# Binexe integrations

Default branch is **`main`**. Landing work also lives on `cursor/binexe-landing-89ee` (do not delete).  
Cloud Agent may not be able to change GitHub settings or log into Vercel/Supabase/Resend — finish those steps in your own browser.

## Required environment variables

| Variable | Where | Purpose |
|----------|--------|---------|
| `VITE_SUPABASE_URL` | Vite build + Vercel | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Vite build + Vercel | Public anon key |
| `VITE_SITE_URL` | Vite build + Vercel | Auth redirect / email link base |
| `SUPABASE_SERVICE_ROLE_KEY` | **Vercel only** (server) | Admin auth links for signup / confirm / reset |
| `RESEND_API_KEY` | **Vercel only** (server) | Send confirmation + reset emails |
| `RESEND_ALLOWED_TO` | **Vercel only** (server) | Inbox allowlist while using Resend test/onboarding from |
| `MAIL_FROM` | **Vercel only** (server, optional) | Sender; default `Binexe <onboarding@resend.dev>` |

Copy locally:

```bash
cp .env.example .env
# Fill client vars for `npm run dev`. Server vars are only needed on Vercel for /api/*.
```

## 1) GitHub

Repo: https://github.com/luckyyluckk90/binexe  

If `main` is not yet the GitHub **default branch**, set it in the UI:  
Settings → General → Default branch → `main`.

GitHub Actions workflow `.github/workflows/deploy-vercel.yml` runs on push/PR to **`main`** (and `master`) and on `workflow_dispatch`.

Repo **Actions secrets** (Settings → Secrets and variables → Actions):

- Deploy: `VERCEL_TOKEN` · `VERCEL_ORG_ID` · `VERCEL_PROJECT_ID`
- Client build: `VITE_SUPABASE_URL` · `VITE_SUPABASE_ANON_KEY` · `VITE_SITE_URL`

Server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `RESEND_ALLOWED_TO`, `MAIL_FROM`) must live in **Vercel project env** — the workflow deploys with `vercel pull` / prebuilt deploy and does not inject them into the static build.

## 2) Bitbucket (optional mirror)

```bash
git remote add bitbucket git@bitbucket.org:YOUR_WORKSPACE/binexe.git
git push -u bitbucket HEAD:main
```

Bitbucket → Repository settings → Pipelines → Enable  

Repository variables (mirror of what you need for build/deploy):

- `VERCEL_TOKEN` · `VERCEL_ORG_ID` · `VERCEL_PROJECT_ID`
- `VITE_SUPABASE_URL` · `VITE_SUPABASE_ANON_KEY` · `VITE_SITE_URL`

## 3) Vercel

1. [vercel.com/new](https://vercel.com/new) → import `luckyyluckk90/binexe`  
2. Production branch: **`main`**  
3. Framework: Vite · Build: `npm run build` · Output: `dist`  
   (`vercel.json` already sets these + SPA rewrites excluding `/api/` and `/assets/`)  
4. Environment variables (Production + Preview as needed):

   **Client**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (e.g. `https://binexe.com` or `https://binexe.vercel.app`)

   **Server (required for auth email APIs)**
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_ALLOWED_TO`
   - `MAIL_FROM` (optional until a domain is verified)

5. Domain: attach `binexe.com` when ready  

CLI (owner machine — needs interactive login / token):

```bash
npm i -g vercel
vercel login
vercel link
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_SITE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add RESEND_API_KEY
vercel env add RESEND_ALLOWED_TO
vercel env add MAIL_FROM
vercel --prod
```

## 4) Supabase

1. [supabase.com](https://supabase.com) → project `binexe`  
2. SQL Editor → run `supabase/migrations/20260324120000_enquiries.sql`  
3. Project Settings → API → copy Project URL + `anon` key (+ keep `service_role` for Vercel only)  
4. Local: fill `.env` from `.env.example`, then `npm run dev`  
5. Put the same client values in Vercel + GitHub Actions secrets  

Contact form writes to `enquiries` when Supabase is configured; otherwise it falls back to mailto.

## 5) Auth (Login / Sign up + email confirmation)

1. Supabase → Authentication → Providers → Email → **Confirm email: ON**  
2. Authentication → URL Configuration:
   - Site URL: production URL (`https://binexe.vercel.app` or custom domain)
   - Redirect URLs: `https://<your-host>/auth/callback`  
     (also add `https://<your-host>/auth/reset-password` if you use hash/query recovery there)
3. Vercel env as in the table above; redeploy after changes  
4. Site routes: `/login`, `/signup`, `/profile`, `/auth/callback`, `/auth/reset-password`  

Signup goes through `/api/signup` and sends mail via Resend.  
With `onboarding@resend.dev`, Resend only delivers to `RESEND_ALLOWED_TO` (and matching Gmail +aliases). For open delivery, verify a domain at [resend.com/domains](https://resend.com/domains) and set `MAIL_FROM` to that domain.

Unconfirmed accounts are forced signed-out after login; login rejects with “Email not confirmed” until verified.
