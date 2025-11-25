'use client'

import { useState, useEffect } from 'react'
import { X, FolderOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { TutorialCard } from './tutorial-card'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

interface Collection {
  id: string
  name: string
  description: string | null
  icon: string | null
}

interface CollectionDetailModalProps {
  collection: Collection
  onClose: () => void
}

export function CollectionDetailModal({ collection, onClose }: CollectionDetailModalProps) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchCollectionTutorials()
  }, [collection.id])

  const fetchCollectionTutorials = async () => {
    try {
      setLoading(true)

      // Fetch tutorials in this collection
      const { data: tutorialCollections } = await supabase
        .from('tutorial_collections')
        .select('tutorial_id')
        .eq('collection_id', collection.id)

      if (!tutorialCollections || tutorialCollections.length === 0) {
        setLoading(false)
        return
      }

      const tutorialIds = tutorialCollections.map((tc) => tc.tutorial_id)

      // Fetch full tutorial data
      const { data: tutorialsData } = await supabase
        .from('tutorials')
        .select('*')
        .in('id', tutorialIds)
        .order('created_at', { ascending: false })

      setTutorials(tutorialsData || [])

      // Fetch favorites
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: favData } = await supabase
          .from('favorites')
          .select('tutorial_id')
          .eq('user_id', user.id)
        
        setFavorites(favData?.map((f) => f.tutorial_id) || [])
      }
    } catch (error) {
      console.error('Error fetching collection tutorials:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
      {/* Modal */}
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[90vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl flex justify-between items-start">
          <div className="flex-1">
            <div className="text-4xl mb-2">{collection.icon || '📁'}</div>
            <h2 className="text-2xl font-bold mb-2">{collection.name}</h2>
            {collection.description && (
              <p className="text-white/90 text-sm">{collection.description}</p>
            )}
            <p className="text-white/80 text-xs mt-2">
              {tutorials.length} {tutorials.length === 1 ? 'tutorial' : 'tutorials'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                  <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 font-medium mb-1">No tutorials yet</p>
              <p className="text-sm text-gray-500">
                Tutorials will appear here when added to this collection
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

