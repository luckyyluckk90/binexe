import {
  findUserByEmail,
  generateMagicLink,
  isResendTestingRestriction,
  mailConfig,
  readJson,
  sendConfirmationEmail,
  sendJson,
  sleep,
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
    sendJson(res, 500, { error: 'Mail service is not configured.' })
    return
  }

  if (!RESEND_API_KEY) {
    sendJson(res, 503, {
      error:
        'Custom email delivery is not configured yet (missing RESEND_API_KEY).',
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
  const fullName = String(body.fullName || '').trim() || 'there'
  if (!email || !email.includes('@')) {
    sendJson(res, 400, { error: 'A valid email is required.' })
    return
  }

  const headers = {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    'Content-Type': 'application/json',
  }

  let user = await findUserByEmail(headers, email)
  for (let i = 0; i < 4 && !user; i += 1) {
    await sleep(400)
    user = await findUserByEmail(headers, email)
  }

  if (!user) {
    sendJson(res, 404, { error: 'Bu e-posta ile kayıtlı hesap bulunamadı.' })
    return
  }

  if (user.email_confirmed_at) {
    sendJson(res, 409, { error: 'Bu e-posta zaten doğrulanmış. Giriş yapabilirsiniz.' })
    return
  }

  try {
    const actionLink = await generateMagicLink(headers, email)
    const mail = await sendConfirmationEmail({
      accountEmail: email,
      fullName,
      actionLink,
    })
    sendJson(res, 200, {
      ok: true,
      provider: 'resend',
      id: mail.id || null,
      deliveredTo: mail.deliveredTo || email,
    })
  } catch (err) {
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
