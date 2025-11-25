'use client'

import { useEffect } from 'react'
import { createClient } from './client'

/**
 * Auth state listener for mobile apps
 * This ensures auth sessions are refreshed and persisted properly
 */
export function useAuthListener() {
  useEffect(() => {
    const supabase = createClient()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? 'User logged in' : 'User logged out')

      // Handle different auth events
      if (event === 'SIGNED_IN') {
        console.log('User signed in')
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed')
      } else if (event === 'USER_UPDATED') {
        console.log('User updated')
      }
    })

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [])
}

