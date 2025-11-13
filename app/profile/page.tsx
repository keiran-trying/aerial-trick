import { LayoutWrapper } from '@/components/layout-wrapper'
import { ProfileSettings } from '@/components/profile-settings'

export default function ProfilePage() {
  return (
    <LayoutWrapper title="Profile" showProfile={false}>
      <ProfileSettings />
    </LayoutWrapper>
  )
}

