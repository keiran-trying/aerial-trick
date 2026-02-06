'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { DailyTrick } from '@/components/daily-trick'
import { WeeklyChallenge } from '@/components/weekly-challenge'
import { TutorialShuffle } from '@/components/tutorial-shuffle'
import { TutorialTabs } from '@/components/tutorial-tabs'

export default function HomePage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkOnboarding() {
      try {
        console.log('[HomePage] Checking user authentication...')
        
        // Retry getting user session up to 5 times (helps with iOS simulator)
        let user = null
        for (let i = 0; i < 5; i++) {
          const { data: { user: currentUser } } = await supabase.auth.getUser()
          if (currentUser) {
            user = currentUser
            console.log('[HomePage] User found after', i + 1, 'attempts:', user.email)
            break
          }
          console.log('[HomePage] User not found, attempt', i + 1)
          await new Promise(resolve => setTimeout(resolve, 300))
        }

        // If user is logged in, check if they've completed onboarding
        if (user) {
          const { data: preferences } = await supabase
            .from('user_preferences')
            .select('onboarding_completed_at')
            .eq('user_id', user.id)
            .single()

          // Redirect to onboarding if not completed
          if (!preferences || !preferences.onboarding_completed_at) {
            console.log('[HomePage] Redirecting to onboarding...')
            router.push('/onboarding')
            return
          }
        } else {
          console.log('[HomePage] No user found, showing page without auth')
        }
      } catch (error) {
        console.error('[HomePage] Error checking onboarding:', error)
      }
    }

    checkOnboarding()
  }, [router, supabase])

  // Show content immediately - no loading spinner to prevent flickering
  return (
    <LayoutWrapper title="Aerial Trick" showSettings={true}>
      <div className="space-y-6 p-4">
        <DailyTrick />
        <WeeklyChallenge />
        <TutorialShuffle />
        <TutorialTabs />
      </div>
    </LayoutWrapper>
  )
}
