'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, FolderOpen } from 'lucide-react'
import { TutorialCard } from './tutorial-card'
import type { Database } from '@/lib/types/database.types'

type Collection = {
  id: string
  name: string
  description: string | null
  icon: string | null
}

type Tutorial = Database['public']['Tables']['tutorials']['Row']

interface CollectionDetailProps {
  collection: Collection
}

export function CollectionDetail({ collection }: CollectionDetailProps) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchTutorials()
  }, [collection.id])

  const fetchTutorials = async () => {
    try {
      // Get tutorial IDs in this collection
      const { data: tutorialCollections } = await supabase
        .from('tutorial_collections')
        .select('tutorial_id')
        .eq('collection_id', collection.id)

      if (tutorialCollections) {
        const tutorialIds = tutorialCollections.map(tc => tc.tutorial_id)

        // Fetch the actual tutorials
        const { data: tutorialsData } = await supabase
          .from('tutorials')
          .select('*')
          .in('id', tutorialIds)
          .order('created_at', { ascending: false })

        setTutorials(tutorialsData || [])

        // Fetch user's favorites
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('tutorial_id')
            .eq('user_id', user.id)
          
          setFavorites(favData?.map(f => f.tutorial_id) || [])
        }
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Collection Header */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="text-5xl mb-3">{collection.icon || '📁'}</div>
          <h1 className="text-2xl font-bold mb-2">{collection.name}</h1>
          {collection.description && (
            <p className="text-white/90 text-sm">{collection.description}</p>
          )}
          <p className="text-white/80 text-xs mt-3">
            {tutorials.length} {tutorials.length === 1 ? 'tutorial' : 'tutorials'}
          </p>
        </div>

        {/* Tutorials */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : tutorials.length > 0 ? (
          <div className="space-y-3">
            {tutorials.map((tutorial) => (
              <TutorialCard 
                key={tutorial.id} 
                tutorial={tutorial} 
                isFavorite={favorites.includes(tutorial.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 font-medium mb-1">No tutorials yet</p>
            <p className="text-sm text-gray-500">
              Tutorials will appear here when added to this collection
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

