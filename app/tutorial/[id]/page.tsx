'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TutorialDetail } from '@/components/tutorial-detail'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

export default function TutorialPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAuthAndFetchTutorial() {
      try {
        // Await params in Next.js 16+
        const { id } = await params
        
        // Check if user is authenticated
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          // Redirect to login if not authenticated
          router.push('/auth/login')
          return
        }

        setIsAuthenticated(true)

        // Fetch the tutorial
        const { data: tutorialData, error } = await supabase
          .from('tutorials')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !tutorialData) {
          console.error('Tutorial not found:', id, error)
          router.push('/')
          return
        }

        setTutorial(tutorialData)
      } catch (error) {
        console.error('Error:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchTutorial()
  }, [params, router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !tutorial) {
    return null
  }

  return <TutorialDetail tutorial={tutorial} />
}

