import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'
import type { SupportedStorage } from '@supabase/ssr'

/**
 * Custom storage adapter for Supabase that uses Capacitor Preferences
 * IMPORTANT: For iOS simulator, we use SYNCHRONOUS localStorage for reliability
 * Async storage causes session save/retrieve race conditions
 */
export const capacitorStorage: SupportedStorage = {
  getItem: (key: string) => {
    console.log('[Storage] getItem called for:', key)
    
    // Use SYNCHRONOUS localStorage for iOS simulator reliability
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const value = localStorage.getItem(key)
        console.log('[Storage] Retrieved from localStorage:', key, value ? '✓ Found' : '✗ Not found')
        return value
      } catch (error) {
        console.error('[Storage] Error getting from localStorage:', key, error)
        return null
      }
    }
    
    console.log('[Storage] localStorage not available')
    return null
  },
  
  setItem: (key: string, value: string) => {
    console.log('[Storage] setItem called for:', key, 'value length:', value.length)
    
    // Use SYNCHRONOUS localStorage for iOS simulator reliability
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, value)
        console.log('[Storage] ✓ Saved to localStorage:', key)
        
        // Also save to Capacitor Preferences asynchronously (don't await)
        if (Capacitor.isNativePlatform()) {
          Preferences.set({ key, value })
            .then(() => console.log('[Storage] ✓ Also saved to Capacitor Preferences:', key))
            .catch((error) => console.error('[Storage] ✗ Capacitor save failed:', key, error))
        }
      } catch (error) {
        console.error('[Storage] ✗ Error saving to localStorage:', key, error)
      }
    } else {
      console.error('[Storage] ✗ localStorage not available!')
    }
  },
  
  removeItem: (key: string) => {
    console.log('[Storage] removeItem called for:', key)
    
    // Use SYNCHRONOUS localStorage for iOS simulator reliability
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(key)
        console.log('[Storage] ✓ Removed from localStorage:', key)
        
        // Also remove from Capacitor Preferences asynchronously
        if (Capacitor.isNativePlatform()) {
          Preferences.remove({ key })
            .then(() => console.log('[Storage] ✓ Also removed from Capacitor Preferences:', key))
            .catch((error) => console.error('[Storage] ✗ Capacitor remove failed:', key, error))
        }
      } catch (error) {
        console.error('[Storage] ✗ Error removing from localStorage:', key, error)
      }
    }
  },
}

