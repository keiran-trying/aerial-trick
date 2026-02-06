'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TutorialDetail } from '@/components/tutorial-detail'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

interface TutorialDetailWrapperProps {
  tutorialId: string
}

export function TutorialDetailWrapper({ tutorialId }: TutorialDetailWrapperProps) {
  const router = useRouter()
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTutorial() {
      try {
        console.log('[Tutorial] Loading tutorial:', tutorialId)
        
        // Check if user is authenticated (but don't require it to view)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          console.log('[Tutorial] User authenticated:', user.email)
          setIsAuthenticated(true)
        } else {
          console.log('[Tutorial] No user session, but allowing view')
          setIsAuthenticated(false)
        }

        // Fetch the tutorial (allow viewing even without auth)
        const { data: tutorialData, error } = await supabase
          .from('tutorials')
          .select('*')
          .eq('id', tutorialId)
          .single()

        if (error || !tutorialData) {
          console.error('[Tutorial] Tutorial not found:', tutorialId, error)
          router.push('/')
          return
        }

        console.log('[Tutorial] Tutorial loaded successfully:', tutorialData.title)
        setTutorial(tutorialData)
      } catch (error) {
        console.error('[Tutorial] Error loading tutorial:', error)
        // Don't redirect to login, just go back to homepage
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchTutorial()
  }, [tutorialId, router, supabase])

  // Show skeleton loader instead of spinner to prevent flickering
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Skeleton for video */}
          <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
          {/* Skeleton for title */}
          <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
          {/* Skeleton for description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
        </div>
      </div>
    )
  }

  if (!tutorial) {
    return null
  }

  return <TutorialDetail tutorial={tutorial} />
}

