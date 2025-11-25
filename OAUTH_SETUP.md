# 🔐 OAuth Setup Guide (Google, Apple, Facebook)

## Why OAuth is Important

✅ **Users prefer it** - Login with one click  
✅ **Required for App Store** - Apple requires "Sign in with Apple" if you have other OAuth options  
✅ **Higher conversion** - Easier signup = more users  
✅ **More secure** - No passwords to manage

---

## 🍎 1. Sign in with Apple (REQUIRED for App Store!)

### Step 1: Configure in Apple Developer

1. Go to https://developer.apple.com/account
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click **Identifiers** → Select your App ID
4. Enable **Sign in with Apple**
5. Save

### Step 2: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Apple** and enable it
3. Fill in:
   - **Services ID**: `com.aerialtrick.app.auth`
   - **Bundle ID**: `com.aerialtrick.app`
   - **Key ID**: (get from Apple Developer)
   - **Team ID**: (your Apple Team ID)
4. Save

### Step 3: Add to Your App

```typescript
// components/auth-form.tsx
import { AppleIcon } from 'lucide-react'

const handleAppleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) console.error('Error:', error.message)
}

// Add button
<button
  onClick={handleAppleSignIn}
  className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors"
>
  <AppleIcon className="w-5 h-5" />
  Continue with Apple
</button>
```

---

## 🔵 2. Sign in with Google

### Step 1: Create Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   ```
   https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback
   ```
7. Save and copy:
   - Client ID
   - Client Secret

### Step 2: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste:
   - Client ID
   - Client Secret
4. Save

### Step 3: Add to Your App

```typescript
const handleGoogleSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  
  if (error) console.error('Error:', error.message)
}

// Add button
<button
  onClick={handleGoogleSignIn}
  className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continue with Google
</button>
```

---

## 📘 3. Sign in with Facebook

### Step 1: Create Facebook App

1. Go to https://developers.facebook.com
2. Create new app → Consumer
3. Add **Facebook Login** product
4. Configure OAuth Redirect URIs:
   ```
   https://[YOUR-SUPABASE-PROJECT].supabase.co/auth/v1/callback
   ```
5. Copy:
   - App ID
   - App Secret

### Step 2: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Facebook** and enable it
3. Paste:
   - Client ID (App ID)
   - Client Secret (App Secret)
4. Save

### Step 3: Add to Your App

```typescript
const handleFacebookSignIn = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'facebook',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) console.error('Error:', error.message)
}

// Add button
<button
  onClick={handleFacebookSignIn}
  className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#166FE5] transition-colors"
>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
  Continue with Facebook
</button>
```

---

## 🔄 4. Callback Handler

Create: `app/auth/callback/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect to home page
  return NextResponse.redirect(`${requestUrl.origin}/`)
}
```

---

## 📱 5. Updated Auth Form Component

Here's your complete auth form with all OAuth options:

```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Apple, Loader2 } from 'lucide-react'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const supabase = createClient()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })
        if (error) throw error
        alert('Check your email for verification link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'apple' | 'facebook') => {
    setOauthLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      alert(error.message)
      setOauthLoading(null)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {/* OAuth Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => handleOAuth('apple')}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50"
        >
          {oauthLoading === 'apple' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Apple className="w-5 h-5" />
          )}
          Continue with Apple
        </button>

        <button
          onClick={() => handleOAuth('google')}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {oauthLoading === 'google' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <button
          onClick={() => handleOAuth('facebook')}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#166FE5] transition-colors disabled:opacity-50"
        >
          {oauthLoading === 'facebook' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FacebookIcon />
          )}
          Continue with Facebook
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Email Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Your name"
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            isSignUp ? 'Sign Up' : 'Sign In'
          )}
        </button>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-900"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  )
}

// Helper components for icons
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}
```

---

## ⚠️ Important Notes

1. **Apple Sign In is REQUIRED** if you have other OAuth options in App Store
2. Test OAuth in **production** - won't work well on localhost
3. Make sure redirect URLs match exactly
4. For mobile (Capacitor), use deep links for OAuth callbacks

---

## 📱 Mobile OAuth (Capacitor)

For mobile apps, update Capacitor config:

```typescript
// capacitor.config.ts
{
  plugins: {
    App: {
      appUrlScheme: 'aerialtrick'
    }
  }
}
```

Update OAuth redirects:
```typescript
redirectTo: 'aerialtrick://auth/callback'
```

---

**Ready to implement?** Let me know!


