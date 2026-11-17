# Binexe integrations

Cloud Agent burada GitHub hesabına giriş yapamıyor. Bağlantıları kendi makinen / tarayıcından tamamla.

## 1) GitHub

```bash
cd /path/to/binexe
gh auth login
gh repo create binexe --private --source=. --remote=origin --push
```

veya GitHub’da boş repo açıp:

```bash
git remote add origin git@github.com:YOUR_USER/binexe.git
git push -u origin HEAD:main
```

## 2) Bitbucket (opsiyonel mirror)

```bash
git remote add bitbucket git@bitbucket.org:YOUR_WORKSPACE/binexe.git
git push -u bitbucket HEAD:main
```

Bitbucket → Repository settings → Pipelines → Enable  
Repository variables:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 3) Vercel

1. [vercel.com/new](https://vercel.com/new) → GitHub/Bitbucket repo’yu import et  
2. Framework: Vite · Build: `npm run build` · Output: `dist`  
3. Environment variables ekle:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SITE_URL` (ör. `https://binexe.com`)
4. Domain: `binexe.com` bağla  

CLI ile:

```bash
npm i -g vercel
vercel login
vercel link
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel --prod
```

GitHub Actions için repo secrets:

- `VERCEL_TOKEN` · `VERCEL_ORG_ID` · `VERCEL_PROJECT_ID`
- `VITE_SUPABASE_URL` · `VITE_SUPABASE_ANON_KEY` · `VITE_SITE_URL`

## 4) Supabase

1. [supabase.com](https://supabase.com) → New project `binexe`  
2. SQL Editor’de `supabase/migrations/20260324120000_enquiries.sql` dosyasını çalıştır  
3. Project Settings → API → Project URL + `anon` key kopyala  
4. Lokal:

```bash
cp .env.example .env
# .env içine URL ve anon key yaz
npm run dev
```

5. Aynı değerleri Vercel + GitHub/Bitbucket secrets’a ekle  

Contact formu Supabase bağlıysa `enquiries` tablosuna yazar; değilse mailto’ya düşer.

## 5) Auth (Login / Sign up + email confirmation)

1. Supabase → Authentication → Providers → Email → **Confirm email: ON**
2. Authentication → URL Configuration:
   - Site URL: `https://binexe.vercel.app` (veya custom domain)
   - Redirect URLs: `https://binexe.vercel.app/auth/callback`
3. Vercel env’e ekle ve redeploy:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `RESEND_ALLOWED_TO` (Resend hesap e-postası; test modunda zorunlu)
   - İsteğe bağlı: `MAIL_FROM` (domain doğrulanınca `Binexe <noreply@alanadiniz.com>`)
4. Site routes: `/login`, `/signup`, `/auth/callback`

Kayıt `/api/signup` üzerinden Resend ile doğrulama maili gönderir.  
`onboarding@resend.dev` kullanırken Resend yalnızca `RESEND_ALLOWED_TO` adresine (ve aynı Gmail +alias’larına) teslim eder. Herkese mail için [resend.com/domains](https://resend.com/domains) üzerinden alan adı doğrula ve `MAIL_FROM`’u o domain’e çevir.

Kod tarafında onaylanmamış hesaplar sign-in sonrası hemen çıkışa zorlanır; login “Email not confirmed” ile reddedilir.
