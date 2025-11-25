import { redirect } from 'next/navigation'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { AdminDashboardSimple } from '@/components/admin-dashboard-simple'
import { isAdmin } from '@/lib/utils/admin'
import { createClient } from '@/lib/supabase/server'

export default async function AdminPage() {
  // Check if user is authenticated
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    // Not logged in - redirect to login
    redirect('/login')
  }
  
  // Check if user is admin
  const userIsAdmin = await isAdmin()
  
  if (!userIsAdmin) {
    // Not an admin - redirect to home
    redirect('/')
  }
  
  return (
    <LayoutWrapper title="Admin Portal" showProfile={false}>
      <AdminDashboardSimple />
    </LayoutWrapper>
  )
}

