'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TutorialCard } from './tutorial-card'
import { Heart } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

export function FavoritesList() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
          tutorial_id,
          tutorials (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const tutorialsData = favoritesData?.map(f => (f as any).tutorials).filter(Boolean) || []
      setTutorials(tutorialsData)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4">
      {tutorials.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {tutorials.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite compact />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600 mb-2">No favorites yet</p>
          <p className="text-sm text-gray-500">
            Tap the heart icon on tutorials you love to save them here.
          </p>
        </div>
      )}
    </div>
  )
}

