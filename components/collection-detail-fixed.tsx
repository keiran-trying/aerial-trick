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
    console.log('Fetching tutorials for collection:', collection.id)
    try {
      // Get tutorial IDs in this collection
      const { data: tutorialCollections, error: tcError } = await supabase
        .from('tutorial_collections')
        .select('tutorial_id')
        .eq('collection_id', collection.id)

      console.log('Tutorial collections data:', tutorialCollections)
      console.log('Tutorial collections error:', tcError)

      if (tutorialCollections && tutorialCollections.length > 0) {
        const tutorialIds = tutorialCollections.map(tc => tc.tutorial_id)
        console.log('Tutorial IDs:', tutorialIds)

        // Fetch the actual tutorials
        const { data: tutorialsData, error: tutError } = await supabase
          .from('tutorials')
          .select('*')
          .in('id', tutorialIds)
          .order('created_at', { ascending: false })

        console.log('Tutorials data:', tutorialsData)
        console.log('Tutorials error:', tutError)

        // Filter out tutorials from future challenges (unless user is admin)
        const { filterFutureTutorials } = await import('@/lib/filter-future-tutorials')
        const filteredData = await filterFutureTutorials(tutorialsData, supabase)
        
        setTutorials(filteredData)

        // Fetch user's favorites
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('tutorial_id')
            .eq('user_id', user.id)
          
          setFavorites(favData?.map(f => f.tutorial_id) || [])
        }
      } else {
        console.log('No tutorials found in this collection')
        setTutorials([])
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
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="aspect-[9/16] bg-gray-200 rounded-lg mb-2"></div>
                <div className="p-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tutorials.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {tutorials.map((tutorial) => (
              <TutorialCard 
                key={tutorial.id} 
                tutorial={tutorial} 
                isFavorite={favorites.includes(tutorial.id)}
                compact
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-900 font-bold mb-1 text-lg">No tutorials yet</p>
            <p className="text-sm text-gray-700 font-medium">
              Tutorials will appear here when added to this collection
            </p>
            <button
              onClick={() => router.push('/admin')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
            >
              Add Tutorials
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

