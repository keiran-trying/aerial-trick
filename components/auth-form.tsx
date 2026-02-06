'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Loader2 } from 'lucide-react'

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isForgotPassword) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (resetError) throw resetError
        
        setSuccess('Password reset email sent! Check your inbox.')
        setLoading(false)
        return
      }
      
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })

        if (signUpError) throw signUpError

        if (data.user) {
          router.push('/')
        }
      } else {
        console.log('[Auth] Starting login process...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError
        
        console.log('[Auth] Login successful, user:', signInData.user?.email)
        console.log('[Auth] Session received:', !!signInData.session)
        
        if (!signInData.session) {
          console.error('[Auth] ✗ No session in signIn response!')
          setError('Login failed: No session received. Please try again.')
          setLoading(false)
          return
        }
        
        console.log('[Auth] ✓ Session exists, checking if saved to storage...')
        
        // Wait a moment for Supabase to save to storage (even though it's synchronous, give it a tick)
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Quick check - if getSession works, we're good
        const { data: { session: verifySession } } = await supabase.auth.getSession()
        if (verifySession) {
          console.log('[Auth] ✓ Session verified in storage, redirecting...')
          window.location.href = '/'
        } else {
          console.warn('[Auth] ⚠️ getSession returned null, but we have session from signIn')
          console.log('[Auth] Redirecting anyway - session should be in memory...')
          // Redirect anyway - the session exists and should work
          window.location.href = '/'
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
        {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
      </h2>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {success}
        </div>
      )}

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {isSignUp && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={isSignUp}
                className="w-full pl-9 pr-3 py-2 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                placeholder="Your name"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                placeholder="you@example.com"
              />
          </div>
        </div>

        {!isForgotPassword && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-base text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-gray-400"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : isForgotPassword ? (
            'Send Reset Link'
          ) : isSignUp ? (
            'Sign Up'
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-4 text-center space-y-2">
        {!isForgotPassword && (
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setSuccess('')
            }}
            disabled={loading}
            className="text-purple-600 hover:text-purple-700 font-medium text-xs disabled:opacity-50 block w-full"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        )}
        
        <button
          onClick={() => {
            setIsForgotPassword(!isForgotPassword)
            setIsSignUp(false)
            setError('')
            setSuccess('')
          }}
          disabled={loading}
          className="text-gray-600 hover:text-gray-800 font-medium text-xs disabled:opacity-50 block w-full"
        >
          {isForgotPassword ? 'Back to sign in' : 'Forgot password?'}
        </button>
      </div>

      <div className="mt-3 text-center text-[10px] text-gray-500">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
      </div>
    </div>
  )
}
