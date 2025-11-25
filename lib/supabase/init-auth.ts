'use client'

import { useEffect } from 'react'
import { createClient } from './client'
import { Capacitor } from '@capacitor/core'

/**
 * Initialize auth session on app start
 * This is especially important for mobile apps where storage might be slow
 */
export function useInitAuth() {
  useEffect(() => {
    const supabase = createClient()
    
    // On mobile, wait a bit for Capacitor storage to initialize
    if (Capacitor.isNativePlatform()) {
      const initAuth = async () => {
        try {
          // Wait for storage to be ready
          await new Promise(resolve => setTimeout(resolve, 300))
          
          // Try to get the session
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session) {
            console.log('Session found on app init:', session.user.email)
            // Refresh the session to ensure it's valid
            await supabase.auth.refreshSession()
          } else {
            console.log('No session found on app init')
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
        }
      }
      
      initAuth()
    }
  }, [])
}

