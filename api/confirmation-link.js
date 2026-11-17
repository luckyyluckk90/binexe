const PROJECT_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || ''
const SITE_URL = process.env.VITE_SITE_URL || 'https://binexe.vercel.app'

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
    send(res, 500, { error: 'Confirmation helper is not configured.' })
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
  if (!email || !email.includes('@')) {
    send(res, 400, { error: 'A valid email is required.' })
    return
  }

  const headers = {
    apikey: SERVICE_ROLE,
    Authorization: `Bearer ${SERVICE_ROLE}`,
    'Content-Type': 'application/json',
  }

  const listRes = await fetch(
    `${PROJECT_URL}/auth/v1/admin/users?page=1&per_page=200`,
    { headers },
  )
  if (!listRes.ok) {
    send(res, 502, { error: 'Could not look up the account.' })
    return
  }

  const listJson = await listRes.json()
  const users = listJson.users || []
  const user = users.find(
    (item) => String(item.email || '').toLowerCase() === email,
  )

  if (!user) {
    send(res, 404, {
      error: 'No account found for this email. Try signing up again first.',
    })
    return
  }

  if (user.email_confirmed_at || user.confirmed_at) {
    send(res, 409, {
      error: 'This email is already confirmed. You can log in.',
    })
    return
  }

  const createdAt = Date.parse(user.created_at || '')
  const ageMs = Date.now() - (Number.isFinite(createdAt) ? createdAt : 0)
  if (ageMs > 1000 * 60 * 60 * 6) {
    send(res, 403, {
      error:
        'This signup is too old for the on-page link. Use Resend confirmation or contact support.',
    })
    return
  }

  const linkRes = await fetch(`${PROJECT_URL}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      type: 'magiclink',
      email,
      redirect_to: `${SITE_URL.replace(/\/$/, '')}/auth/callback`,
    }),
  })

  const linkJson = await linkRes.json()
  if (!linkRes.ok || !linkJson.action_link) {
    send(res, 502, {
      error:
        linkJson.msg ||
        linkJson.message ||
        'Could not create a confirmation link right now.',
    })
    return
  }

  send(res, 200, {
    email,
    action_link: linkJson.action_link,
    note: 'Open this link to confirm your email if the inbox message has not arrived.',
  })
}
