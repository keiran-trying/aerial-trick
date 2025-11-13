import { LayoutWrapper } from '@/components/layout-wrapper'
import { AdminDashboardSimple } from '@/components/admin-dashboard-simple'

export default function AdminPage() {
  return (
    <LayoutWrapper title="Admin Portal" showProfile={false}>
      <AdminDashboardSimple />
    </LayoutWrapper>
  )
}

