'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { AdminAnalytics } from '@/components/admin-analytics'
import { isAdmin } from '@/lib/utils/admin'
import { createClient } from '@/lib/supabase/client'

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }
        
        const userIsAdmin = await isAdmin()
        
        if (!userIsAdmin) {
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
      <LayoutWrapper title="Analytics Dashboard" showProfile={false}>
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
    <LayoutWrapper title="Analytics Dashboard" showProfile={false}>
      <AdminAnalytics />
    </LayoutWrapper>
  )
}
