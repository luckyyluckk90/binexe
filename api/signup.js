import {
  deleteUser,
  generateMagicLink,
  isResendTestingRestriction,
  mailConfig,
  readJson,
  sendConfirmationEmail,
  sendJson,
  testingRestrictionError,
} from './_mail.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  const { PROJECT_URL, SERVICE_ROLE, RESEND_API_KEY } = mailConfig()

  if (!PROJECT_URL || !SERVICE_ROLE) {
    sendJson(res, 500, { error: 'Authentication service is not configured.' })
    return
  }
  if (!RESEND_API_KEY) {
    sendJson(res, 503, {
      error: 'Email delivery is not configured (missing RESEND_API_KEY).',
    })
    return
  }

  let body
  try {
    body = await readJson(req)
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body.' })
    return
  }

  const email = String(body.email || '')
    .trim()
    .toLowerCase()
  const password = String(body.password || '')
  const fullName = String(body.fullName || '').trim() || 'there'

  if (!email || !email.includes('@')) {
    sendJson(res, 400, { error: 'A valid email is required.' })
    return
  }
  if (password.length < 8) {
    sendJson(res, 400, { error: 'Password must be at least 8 characters.' })
    return
  }

  const headers = {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    'Content-Type': 'application/json',
  }

  // Create account without using Supabase's built-in (rate-limited) mailer.
  const createRes = await fetch(`${PROJECT_URL}/auth/v1/admin/users`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name: fullName },
    }),
  })
  const createJson = await createRes.json().catch(() => ({}))
  if (!createRes.ok) {
    const message = String(createJson.msg || createJson.message || '')
    if (
      createRes.status === 422 ||
      message.toLowerCase().includes('already') ||
      message.toLowerCase().includes('registered')
    ) {
      sendJson(res, 409, {
        error:
          'Bu e-posta zaten kayıtlı. Gelen kutunuzdaki doğrulama mailini kontrol edin veya giriş yapın.',
      })
      return
    }
    sendJson(res, 502, {
      error: message || 'Could not create account.',
    })
    return
  }

  const userId = createJson.id || createJson.user?.id

  try {
    const actionLink = await generateMagicLink(headers, email)
    const mail = await sendConfirmationEmail({
      accountEmail: email,
      fullName,
      actionLink,
    })
    sendJson(res, 200, {
      ok: true,
      email,
      provider: 'resend',
      id: mail.id || null,
      deliveredTo: mail.deliveredTo || email,
    })
  } catch (err) {
    // Avoid leaving orphan accounts that block retries with "already registered".
    await deleteUser(headers, userId)

    const message =
      err instanceof Error ? err.message : 'Confirmation email could not be sent.'
    if (isResendTestingRestriction(message)) {
      sendJson(res, 502, testingRestrictionError())
      return
    }
    sendJson(res, 502, {
      error: message,
      hint:
        'Mail gönderilemedi. Birkaç dakika sonra tekrar deneyin veya spam klasörünü kontrol edin.',
    })
  }
}
