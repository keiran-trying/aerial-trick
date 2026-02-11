# Fix Vercel Build Failure

If `npm run build` fails on Vercel with exit code 1, follow these steps:

## 1. Add Required Environment Variables (Most Common Cause)

Your build needs Supabase credentials. **Add these in Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Select your project (`aerial-trick-moar`)
3. **Settings** → **Environment Variables**
4. Add these two variables:

| Name | Value | Environments |
|------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxxxx.supabase.co`) | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Production, Preview, Development |

**Where to find these:**
- Supabase Dashboard → Project Settings → API
- Copy "Project URL" and "anon public" key

5. Click **Save**
6. **Redeploy** (Deployments → ⋮ on latest → Redeploy)

---

## 2. Config Changes Applied

- Removed deprecated `eslint` config from next.config.ts (was causing warnings)
- Removed `out/` from .vercelignore (was excluding build output)

---

## 3. If Build Still Fails

**Get the actual error:** In Vercel build logs, scroll down past the "Cloning" section to find the real error message. It might show:
- Missing dependency
- TypeScript error
- Out of memory
- Node version mismatch

**Share the full error** so we can diagnose further.

---

## 4. Verify Local Build Works

Before pushing, always run:

```bash
npm run build
```

If it fails locally, it will fail on Vercel too.
