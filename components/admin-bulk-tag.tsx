'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tag, X, Check, Loader2 } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

interface BulkTagProps {
  onClose: () => void
}

export function AdminBulkTag({ onClose }: BulkTagProps) {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [selectedTutorials, setSelectedTutorials] = useState<Set<string>>(new Set())
  const [collectionName, setCollectionName] = useState('Inversions')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTutorials() {
      setLoading(true)
      try {
        // Fetch all tutorials
        const { data: tutorialsData } = await supabase
          .from('tutorials')
          .select('*')
          .order('created_at', { ascending: false })

        if (tutorialsData) {
          setTutorials(tutorialsData)
        }
      } catch (error) {
        console.error('Error fetching tutorials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [supabase])

  const toggleTutorial = (tutorialId: string) => {
    const newSelected = new Set(selectedTutorials)
    if (newSelected.has(tutorialId)) {
      newSelected.delete(tutorialId)
    } else {
      newSelected.add(tutorialId)
    }
    setSelectedTutorials(newSelected)
  }

  const handleSave = async () => {
    if (selectedTutorials.size === 0 || !collectionName.trim()) {
      alert('Please select tutorials and enter a collection name')
      return
    }

    setSaving(true)
    try {
      // Get or create the collection
      const { data: existingCollection } = await supabase
        .from('collections')
        .select('id')
        .ilike('name', collectionName.trim())
        .single()

      let collectionId: string

      if (existingCollection) {
        collectionId = existingCollection.id
      } else {
        // Create new collection
        const { data: newCollection, error: createError } = await supabase
          .from('collections')
          .insert({ name: collectionName.trim() })
          .select('id')
          .single()

        if (createError || !newCollection) {
          throw new Error('Failed to create collection')
        }

        collectionId = newCollection.id
      }

      // Add tutorials to collection
      const tutorialCollections = Array.from(selectedTutorials).map(tutorialId => ({
        tutorial_id: tutorialId,
        collection_id: collectionId,
      }))

      const { error: insertError } = await supabase
        .from('tutorial_collections')
        .upsert(tutorialCollections, {
          onConflict: 'tutorial_id,collection_id',
          ignoreDuplicates: true,
        })

      if (insertError) {
        throw insertError
      }

      // Get the newest tutorial's thumbnail from the selected tutorials
      const selectedTutorialsList = tutorials.filter(t => selectedTutorials.has(t.id))
      const newestTutorial = selectedTutorialsList.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]

      // Update the collection's updated_at timestamp and thumbnail
      const updateData: any = { updated_at: new Date().toISOString() }
      if (newestTutorial?.thumbnail_url) {
        updateData.thumbnail_url = newestTutorial.thumbnail_url
      }
      
      await supabase
        .from('collections')
        .update(updateData)
        .eq('id', collectionId)

      alert(`Successfully tagged ${selectedTutorials.size} tutorial(s) with "${collectionName}"!`)
      onClose()
    } catch (error: any) {
      console.error('Error saving tags:', error)
      alert(`Failed to save tags: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tag className="w-6 h-6" />
            <div>
              <h2 className="text-2xl font-bold">Bulk Tag Tutorials</h2>
              <p className="text-white/90 text-sm">Select tutorials to add to a collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Collection Input */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Collection Name
          </label>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            placeholder="e.g., Inversions"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 font-medium"
          />
          <p className="text-xs text-gray-600 mt-2">
            Will create collection if it doesn't exist, or add to existing collection
          </p>
        </div>

        {/* Tutorial Grid */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  {selectedTutorials.size} tutorial(s) selected
                </p>
                <button
                  onClick={() => {
                    if (selectedTutorials.size === tutorials.length) {
                      setSelectedTutorials(new Set())
                    } else {
                      setSelectedTutorials(new Set(tutorials.map(t => t.id)))
                    }
                  }}
                  className="text-sm text-purple-600 font-semibold hover:text-purple-700"
                >
                  {selectedTutorials.size === tutorials.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tutorials.map((tutorial) => (
                  <button
                    key={tutorial.id}
                    onClick={() => toggleTutorial(tutorial.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTutorials.has(tutorial.id)
                        ? 'border-purple-600 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          selectedTutorials.has(tutorial.id)
                            ? 'border-purple-600 bg-purple-600'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        {selectedTutorials.has(tutorial.id) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    {tutorial.thumbnail_url ? (
                      <img
                        src={tutorial.thumbnail_url}
                        alt={tutorial.title}
                        className="w-full aspect-[4/3] object-cover rounded-lg mb-3"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-4xl">🧘‍♀️</span>
                      </div>
                    )}

                    {/* Info */}
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 text-sm pr-8">
                      {tutorial.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 font-semibold">
                        {tutorial.difficulty.toUpperCase()}
                      </span>
                      {(tutorial as any).difficulty_stars && (
                        <span className="text-xs">
                          {'⭐️'.repeat((tutorial as any).difficulty_stars)}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || selectedTutorials.size === 0 || !collectionName.trim()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Tag className="w-5 h-5" />
                Tag {selectedTutorials.size} Tutorial{selectedTutorials.size !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

