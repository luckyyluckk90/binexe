import {
  findUserByEmail,
  generateAuthLink,
  isResendTestingRestriction,
  mailConfig,
  readJson,
  sendJson,
  sendPasswordResetEmail,
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
  if (!email || !email.includes('@')) {
    sendJson(res, 400, { error: 'A valid email is required.' })
    return
  }

  const headers = {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    'Content-Type': 'application/json',
  }

  const user = await findUserByEmail(headers, email)
  // Always return a generic success to avoid account enumeration,
  // but only send mail when the account exists.
  if (!user) {
    sendJson(res, 200, { ok: true })
    return
  }

  try {
    const actionLink = await generateAuthLink(headers, email, 'recovery')
    const mail = await sendPasswordResetEmail({
      accountEmail: email,
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
      err instanceof Error ? err.message : 'Password reset email could not be sent.'
    if (isResendTestingRestriction(message)) {
      sendJson(res, 502, testingRestrictionError())
      return
    }
    sendJson(res, 502, { error: message })
  }
}
