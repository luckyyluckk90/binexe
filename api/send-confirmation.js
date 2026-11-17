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

async function findUser(headers, email) {
  const filtered = await fetch(
    `${PROJECT_URL}/auth/v1/admin/users?page=1&per_page=200&email=${encodeURIComponent(email)}`,
    { headers },
  )
  if (filtered.ok) {
    const json = await filtered.json()
    const users = json.users || []
    const match = users.find(
      (item) => String(item.email || '').toLowerCase() === email,
    )
    if (match) return match
  }

  const listRes = await fetch(
    `${PROJECT_URL}/auth/v1/admin/users?page=1&per_page=200`,
    { headers },
  )
  if (!listRes.ok) return null
  const listJson = await listRes.json()
  return (
    (listJson.users || []).find(
      (item) => String(item.email || '').toLowerCase() === email,
    ) || null
  )
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
    send(res, 500, { error: 'Mail service is not configured.' })
    return
  }

  if (!RESEND_API_KEY) {
    send(res, 503, {
      error:
        'Custom email delivery is not configured yet (missing RESEND_API_KEY).',
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
  const fullName = String(body.fullName || '').trim() || 'there'
  if (!email || !email.includes('@')) {
    send(res, 400, { error: 'A valid email is required.' })
    return
  }

  const headers = {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    'Content-Type': 'application/json',
  }

  let user = await findUser(headers, email)
  for (let i = 0; i < 4 && !user; i += 1) {
    await sleep(400)
    user = await findUser(headers, email)
  }

  if (!user) {
    send(res, 404, { error: 'No account found for this email.' })
    return
  }

  if (user.email_confirmed_at) {
    send(res, 409, { error: 'This email is already confirmed.' })
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
  const linkJson = await linkRes.json()
  if (!linkRes.ok || !linkJson.action_link) {
    send(res, 502, {
      error:
        linkJson.msg ||
        linkJson.message ||
        'Could not create confirmation link.',
    })
    return
  }

  const confirmUrl = linkJson.action_link
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
          <p><a href="${confirmUrl}" style="display:inline-block;padding:12px 18px;background:#087a68;color:#fff;text-decoration:none;border-radius:4px">Confirm email address</a></p>
          <p>Or open this link:<br/><a href="${confirmUrl}">${confirmUrl}</a></p>
          <p>If you did not sign up, you can ignore this message.</p>
        </div>
      `,
    }),
  })

  const mailJson = await mailRes.json().catch(() => ({}))
  if (!mailRes.ok) {
    send(res, 502, {
      error:
        mailJson.message ||
        mailJson.error ||
        'Confirmation email could not be delivered.',
    })
    return
  }

  send(res, 200, { ok: true, provider: 'resend', id: mailJson.id || null })
}
