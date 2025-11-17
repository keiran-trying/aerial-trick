import { LayoutWrapper } from '@/components/layout-wrapper'
import { DailyTrick } from '@/components/daily-trick'
import { TutorialShuffle } from '@/components/tutorial-shuffle'
import { TutorialTabs } from '@/components/tutorial-tabs'

export default function HomePage() {
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
