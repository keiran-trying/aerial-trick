/**
 * Client-side Daily Trick Manager
 * 
 * This handles automatic daily trick creation when users open the app.
 * No server-side cron jobs needed - works perfectly with static export!
 */

import { createClient } from '@/lib/supabase/client'
import type { SupabaseClient } from '@supabase/supabase-js'

const LAST_CHECK_KEY = 'daily_trick_last_check'

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Check if we've already checked today (to avoid redundant checks)
 */
function hasCheckedToday(): boolean {
  if (typeof window === 'undefined') return false
  
  const lastCheck = localStorage.getItem(LAST_CHECK_KEY)
  const today = getTodayDate()
  
  return lastCheck === today
}

/**
 * Mark that we've checked today
 */
function markCheckedToday(): void {
  if (typeof window === 'undefined') return
  
  const today = getTodayDate()
  localStorage.setItem(LAST_CHECK_KEY, today)
}

/**
 * Get or create today's daily trick
 * 
 * This function:
 * 1. Checks if a daily trick exists for today
 * 2. If not, randomly selects a tutorial and creates one
 * 3. Returns the tutorial ID for today's trick
 */
export async function getOrCreateDailyTrick(
  supabase: SupabaseClient
): Promise<string | null> {
  try {
    const today = getTodayDate()
    
    // First, check if daily trick already exists for today
    const { data: existingTrick, error: checkError } = await supabase
      .from('daily_trick')
      .select('tutorial_id')
      .eq('date', today)
      .maybeSingle()
    
    if (checkError) {
      console.error('[DailyTrick] Error checking existing trick:', checkError)
    }
    
    // If it exists, return it
    if (existingTrick) {
      console.log('[DailyTrick] Found existing trick for today:', existingTrick.tutorial_id)
      return existingTrick.tutorial_id
    }
    
    // If not, create a new one
    console.log('[DailyTrick] No trick found for today, creating new one...')
    
    // Get all available tutorials
    const { data: tutorials, error: tutorialsError } = await supabase
      .from('tutorials')
      .select('id')
    
    if (tutorialsError) {
      console.error('[DailyTrick] Error fetching tutorials:', tutorialsError)
      return null
    }
    
    if (!tutorials || tutorials.length === 0) {
      console.warn('[DailyTrick] No tutorials available')
      return null
    }
    
    // Select a random tutorial
    const randomIndex = Math.floor(Math.random() * tutorials.length)
    const selectedTutorial = tutorials[randomIndex]
    
    console.log('[DailyTrick] Selected random tutorial:', selectedTutorial.id)
    
    // Insert the daily trick
    const { error: insertError } = await supabase
      .from('daily_trick')
      .insert({
        tutorial_id: selectedTutorial.id,
        date: today,
      })
    
    if (insertError) {
      console.error('[DailyTrick] Error inserting daily trick:', insertError)
      return null
    }
    
    console.log('[DailyTrick] Successfully created daily trick for', today)
    return selectedTutorial.id
    
  } catch (error) {
    console.error('[DailyTrick] Unexpected error:', error)
    return null
  }
}

/**
 * Ensure today's daily trick exists
 * 
 * Call this when the app starts or when the user navigates to the home page.
 * It will only check/create once per day to avoid redundant database calls.
 */
export async function ensureDailyTrickExists(): Promise<void> {
  // Skip if we've already checked today
  if (hasCheckedToday()) {
    console.log('[DailyTrick] Already checked today, skipping')
    return
  }
  
  console.log('[DailyTrick] Checking if daily trick exists for today...')
  
  const supabase = createClient()
  
  // Get or create the daily trick
  await getOrCreateDailyTrick(supabase)
  
  // Mark that we've checked today
  markCheckedToday()
}

/**
 * Force refresh - useful for testing or manual refresh
 * (Clears the "already checked" flag)
 */
export function resetDailyTrickCheck(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LAST_CHECK_KEY)
  console.log('[DailyTrick] Check flag reset, will check again on next call')
}
