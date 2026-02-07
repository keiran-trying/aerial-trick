'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { AdminDashboardSimple } from '@/components/admin-dashboard-simple'
import { isAdmin } from '@/lib/utils/admin'
import { createClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          // Not logged in - redirect to login
          router.push('/auth/login')
          return
        }
        
        // Check if user is admin
        const userIsAdmin = await isAdmin()
        
        if (!userIsAdmin) {
          // Not an admin - redirect to home
          router.push('/')
          return
        }
        
        setIsAuthorized(true)
      } catch (error) {
        console.error('Error checking admin access:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    checkAdminAccess()
  }, [router, supabase])

  if (loading) {
    return (
      <LayoutWrapper title="Admin Portal" showProfile={false}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </LayoutWrapper>
    )
  }

  if (!isAuthorized) {
    return null
  }
  
  return (
    <LayoutWrapper title="Admin Portal" showProfile={false}>
      <AdminDashboardSimple />
    </LayoutWrapper>
  )
}
