'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FolderOpen, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Collection {
  id: string
  name: string
  description: string | null
  icon: string | null
  tutorial_count?: number
}

export function CollectionsBrowser() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      // Fetch all collections
      const { data: collectionsData } = await supabase
        .from('collections')
        .select('*')
        .order('name')

      if (collectionsData) {
        // Get tutorial count for each collection
        const collectionsWithCount = await Promise.all(
          collectionsData.map(async (collection) => {
            const { count } = await supabase
              .from('tutorial_collections')
              .select('*', { count: 'exact', head: true })
              .eq('collection_id', collection.id)

            return {
              ...collection,
              tutorial_count: count || 0,
            }
          })
        )

        setCollections(collectionsWithCount)
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">📚 Collections</h2>
        <p className="text-white/90 text-sm">
          Browse tutorials organized by topic and series
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="space-y-3">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/collection/${collection.id}`}>
              <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {collection.icon || '📁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors text-lg">
                      {collection.name}
                    </h3>
                    {collection.description && (
                      <p className="text-sm text-gray-800 line-clamp-2 mb-1 font-medium">
                        {collection.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 font-semibold">
                      {collection.tutorial_count} {collection.tutorial_count === 1 ? 'tutorial' : 'tutorials'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No collections yet</p>
          <p className="text-sm">Collections will appear here once tutorials are organized</p>
        </div>
      )}
    </div>
  )
}

