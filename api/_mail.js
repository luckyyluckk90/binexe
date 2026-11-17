const PROJECT_URL =
  process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || ''
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || ''
const SITE_URL = process.env.VITE_SITE_URL || 'https://binexe.vercel.app'
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const MAIL_FROM =
  process.env.MAIL_FROM || 'Binexe <onboarding@resend.dev>'
const RESEND_ALLOWED_TO = String(
  process.env.RESEND_ALLOWED_TO || 'luckyyluckk90@gmail.com',
)
  .trim()
  .toLowerCase()

export function mailConfig() {
  return {
    PROJECT_URL,
    SERVICE_ROLE,
    SITE_URL,
    RESEND_API_KEY,
    MAIL_FROM,
    RESEND_ALLOWED_TO,
  }
}

export function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

export async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string' && req.body.trim()) {
    return JSON.parse(req.body)
  }
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  return raw ? JSON.parse(raw) : {}
}

function splitEmail(email) {
  const at = email.lastIndexOf('@')
  if (at < 1) return { local: email, domain: '' }
  return {
    local: email.slice(0, at),
    domain: email.slice(at + 1),
  }
}

/**
 * Resend's onboarding@resend.dev sender can only deliver to the account
 * inbox until a domain is verified. Gmail plus-aliases of that inbox still
 * land in the same mailbox, so rewrite the Resend "to" while keeping the
 * Supabase confirmation link tied to the real signup email.
 */
export function resolveResendRecipient(email) {
  const accountEmail = String(email || '')
    .trim()
    .toLowerCase()
  const allowed = RESEND_ALLOWED_TO

  if (!accountEmail.includes('@')) {
    return { accountEmail, to: accountEmail, rewritten: false }
  }
  if (!allowed || accountEmail === allowed) {
    return { accountEmail, to: accountEmail || allowed, rewritten: false }
  }

  const target = splitEmail(accountEmail)
  const allow = splitEmail(allowed)
  const gmailLike =
    target.domain === 'gmail.com' || target.domain === 'googlemail.com'
  const allowedGmail =
    allow.domain === 'gmail.com' || allow.domain === 'googlemail.com'

  if (gmailLike && allowedGmail) {
    const baseLocal = target.local.split('+')[0].replace(/\./g, '')
    const allowedLocal = allow.local.split('+')[0].replace(/\./g, '')
    if (baseLocal && baseLocal === allowedLocal) {
      return { accountEmail, to: allowed, rewritten: true }
    }
  }

  return { accountEmail, to: accountEmail, rewritten: false }
}

export function isResendTestingRestriction(message) {
  const text = String(message || '').toLowerCase()
  return (
    text.includes('only send testing emails') ||
    text.includes('verify a domain at resend.com/domains') ||
    text.includes('only send to your own email')
  )
}

export function testingRestrictionError() {
  return {
    error:
      'Doğrulama maili gönderilemedi: Resend henüz yalnızca hesap e-postasına (test modu) izin veriyor.',
    hint:
      'Geçici çözüm: luckyyluckk90@gmail.com (veya aynı Gmail +alias) ile kayıt olun. Kalıcı çözüm: resend.com/domains üzerinden bir alan adı doğrulayıp Vercel’de MAIL_FROM=Binexe <onay@alanadiniz.com> ayarlayın.',
  }
}

export async function generateMagicLink(headers, email) {
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
    const error = new Error(
      linkJson.msg ||
        linkJson.message ||
        'Doğrulama linki oluşturulamadı.',
    )
    error.status = 502
    throw error
  }
  return linkJson.action_link
}

export async function sendConfirmationEmail({
  accountEmail,
  fullName,
  actionLink,
}) {
  const { to, rewritten } = resolveResendRecipient(accountEmail)
  const aliasNote = rewritten
    ? `<p style="color:#486581">Bu mail, <strong>${accountEmail}</strong> kaydını onaylamak için gönderildi.</p>`
    : ''

  const mailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: [to],
      subject: 'Confirm your Binexe email',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#102a43">
          <h2>Confirm your email</h2>
          <p>Hi ${fullName},</p>
          ${aliasNote}
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
    error.payload = mailJson
    throw error
  }
  return { ...mailJson, deliveredTo: to, rewritten }
}

export async function deleteUser(headers, userId) {
  if (!userId) return
  await fetch(`${PROJECT_URL}/auth/v1/admin/users/${userId}`, {
    method: 'DELETE',
    headers,
  }).catch(() => null)
}

export async function findUserByEmail(headers, email) {
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

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
