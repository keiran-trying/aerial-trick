import { Preferences } from '@capacitor/preferences'
import { Capacitor } from '@capacitor/core'

/**
 * Custom storage adapter for Supabase that uses Capacitor Preferences
 * This ensures auth tokens persist properly in mobile apps
 */
export const capacitorStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Use localStorage for web
        return localStorage.getItem(key)
      }
      // Use Capacitor Preferences for mobile
      const { value } = await Preferences.get({ key })
      return value
    } catch (error) {
      console.error('Error getting item from storage:', key, error)
      // Fallback to localStorage if Capacitor fails
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key)
      }
      return null
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Use localStorage for web
        localStorage.setItem(key, value)
        return
      }
      // Use Capacitor Preferences for mobile
      await Preferences.set({ key, value })
      // Also save to localStorage as backup
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value)
      }
    } catch (error) {
      console.error('Error setting item in storage:', key, error)
      // Fallback to localStorage if Capacitor fails
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value)
      }
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (!Capacitor.isNativePlatform()) {
        // Use localStorage for web
        localStorage.removeItem(key)
        return
      }
      // Use Capacitor Preferences for mobile
      await Preferences.remove({ key })
      // Also remove from localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.error('Error removing item from storage:', key, error)
      // Fallback to localStorage if Capacitor fails
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key)
      }
    }
  },
}

