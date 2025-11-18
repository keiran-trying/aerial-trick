import { LayoutWrapper } from '@/components/layout-wrapper'
import { DailyTrick } from '@/components/daily-trick'
import { TutorialShuffle } from '@/components/tutorial-shuffle'
import { AIRecommendations } from '@/components/ai-recommendations'
import { TutorialTabs } from '@/components/tutorial-tabs'

export default function HomePage() {
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
