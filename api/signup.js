const PROJECT_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || ''
const SITE_URL = process.env.VITE_SITE_URL || 'https://binexe.vercel.app'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const MAIL_FROM =
  process.env.MAIL_FROM || 'Binexe <onboarding@resend.dev>'

function send(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body)
  }
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  return raw ? JSON.parse(raw) : {}
}

async function sendConfirmationEmail({ email, fullName, actionLink }) {
  const mailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [email],
      subject: 'Confirm your Binexe email',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#102a43">
          <h2>Confirm your email</h2>
          <p>Hi ${fullName},</p>
          <p>Thanks for creating a Binexe account. Confirm your email to continue:</p>
          <p>
            <a href="${actionLink}"
               style="display:inline-block;padding:12px 18px;background:#087a68;color:#fff;text-decoration:none;border-radius:4px">
              Confirm email address
            </a>
          </p>
          <p>Or open this link:<br/><a href="${actionLink}">${actionLink}</a></p>
          <p>If you did not sign up, you can ignore this message.</p>
        </div>
      `,
    }),
  })
  const mailJson = await mailRes.json().catch(() => ({}))
  if (!mailRes.ok) {
    const message =
      mailJson.message ||
      mailJson.error ||
      'Confirmation email could not be delivered.'
    const error = new Error(message)
    error.status = mailRes.status
    throw error
  }
  return mailJson
}

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
    send(res, 405, { error: 'Method not allowed' })
    return
  }

  if (!PROJECT_URL || !SERVICE_ROLE) {
    send(res, 500, { error: 'Authentication service is not configured.' })
    return
  }
  if (!RESEND_API_KEY) {
    send(res, 503, {
      error: 'Email delivery is not configured (missing RESEND_API_KEY).',
    })
    return
  }

  let body
  try {
    body = await readJson(req)
  } catch {
    send(res, 400, { error: 'Invalid JSON body.' })
    return
  }

  const email = String(body.email || '')
    .trim()
    .toLowerCase()
  const password = String(body.password || '')
  const fullName = String(body.fullName || '').trim() || 'there'

  if (!email || !email.includes('@')) {
    send(res, 400, { error: 'A valid email is required.' })
    return
  }
  if (password.length < 8) {
    send(res, 400, { error: 'Password must be at least 8 characters.' })
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
      send(res, 409, {
        error: 'This email is already registered. Confirm your inbox or log in.',
      })
      return
    }
    send(res, 502, {
      error: message || 'Could not create account.',
    })
    return
  }

  const redirectTo = `${SITE_URL.replace(/\/$/, '')}/auth/callback`
  const linkRes = await fetch(`${PROJECT_URL}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'magiclink',
      email,
      redirect_to: redirectTo,
    }),
  })
  const linkJson = await linkRes.json().catch(() => ({}))
  if (!linkRes.ok || !linkJson.action_link) {
    send(res, 502, {
      error:
        linkJson.msg ||
        linkJson.message ||
        'Account created, but confirmation link could not be generated.',
    })
    return
  }

  try {
    const mail = await sendConfirmationEmail({
      email,
      fullName,
      actionLink: linkJson.action_link,
    })
    send(res, 200, {
      ok: true,
      email,
      provider: 'resend',
      id: mail.id || null,
    })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Confirmation email could not be sent.'
    send(res, 502, {
      error: message,
      hint:
        'If using onboarding@resend.dev, Resend only delivers to your account email until a domain is verified.',
    })
  }
}
