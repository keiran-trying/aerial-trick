'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { DailyTrick } from '@/components/daily-trick'
import { TutorialShuffle } from '@/components/tutorial-shuffle'
import { TutorialTabs } from '@/components/tutorial-tabs'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        // If user is logged in, check if they've completed onboarding
        if (user) {
          const { data: preferences } = await supabase
            .from('user_preferences')
            .select('onboarding_completed_at')
            .eq('user_id', user.id)
            .single()

          // Redirect to onboarding if not completed
          if (!preferences || !preferences.onboarding_completed_at) {
            router.push('/onboarding')
            return
          }
        }
      } catch (error) {
        console.error('Error checking onboarding:', error)
      } finally {
        setLoading(false)
      }
    }

    checkOnboarding()
  }, [router, supabase])

  if (loading) {
    return (
      <LayoutWrapper title="Aerial Tricks" showSettings={true}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper title="Aerial Trick" showSettings={true}>
      <div className="space-y-6 p-4">
        <DailyTrick />
        <TutorialShuffle />
        <TutorialTabs />
      </div>
    </LayoutWrapper>
  )
}
