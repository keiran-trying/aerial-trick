'use client'

import { useAuthListener } from '@/lib/supabase/auth-listener'
import { useInitAuth } from '@/lib/supabase/init-auth'

/**
 * Auth provider component that sets up auth state listening
 * This ensures sessions persist properly in mobile apps
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize auth on app start (especially important for mobile)
  useInitAuth()
  
  // Set up auth state listener
  useAuthListener()

  return <>{children}</>
}

