import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { DailyTrick } from '@/components/daily-trick'
import { TutorialShuffle } from '@/components/tutorial-shuffle'
import { AIRecommendations } from '@/components/ai-recommendations'
import { TutorialTabs } from '@/components/tutorial-tabs'

export default async function HomePage() {
  const supabase = createClient()
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
      redirect('/onboarding')
    }
  }

  return (
    <LayoutWrapper title="Aerial Trick" showSettings={true}>
      <div className="space-y-6 p-4">
        <DailyTrick />
        <TutorialShuffle />
        <AIRecommendations />
        <TutorialTabs />
      </div>
    </LayoutWrapper>
  )
}
