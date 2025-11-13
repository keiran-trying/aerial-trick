import { LayoutWrapper } from '@/components/layout-wrapper'
import { AdminAnalytics } from '@/components/admin-analytics'

export default function AdminAnalyticsPage() {
  return (
    <LayoutWrapper title="Analytics Dashboard" showProfile={false}>
      <AdminAnalytics />
    </LayoutWrapper>
  )
}

