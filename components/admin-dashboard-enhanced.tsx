'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Upload, X, Tag } from 'lucide-react'
import { difficultyColors } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']
type DifficultyLevel = Database['public']['Tables']['tutorials']['Row']['difficulty']

interface Collection {
  id: string
  name: string
  description: string | null
  icon: string | null
}

export function AdminDashboardEnhanced() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showCollectionManager, setShowCollectionManager] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy')
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [durationMinutes, setDurationMinutes] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  
  // Collection form state
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newCollectionDescription, setNewCollectionDescription] = useState('')
  const [newCollectionIcon, setNewCollectionIcon] = useState('📁')
  
  const supabase = createClient()

  useEffect(() => {
    fetchTutorials()
    fetchCollections()
  }, [])

  const fetchTutorials = async () => {
    try {
      const { data } = await supabase
        .from('tutorials')
        .select('*')
        .order('created_at', { ascending: false })

      setTutorials(data || [])
    } catch (error) {
      console.error('Error fetching tutorials:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCollections = async () => {
    try {
      const { data } = await supabase
        .from('collections')
        .select('*')
        .order('name')

      setCollections(data || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const createCollection = async () => {
    if (!newCollectionName.trim()) return

    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          name: newCollectionName.trim(),
          description: newCollectionDescription.trim() || null,
          icon: newCollectionIcon,
        })
        .select()
        .single()

      if (error) throw error

      setCollections([...collections, data])
      setNewCollectionName('')
      setNewCollectionDescription('')
      setNewCollectionIcon('📁')
      alert('Collection created!')
    } catch (error: any) {
      console.error('Error creating collection:', error)
      if (error.code === '23505') {
        alert('A collection with this name already exists!')
      } else {
        alert('Failed to create collection')
      }
    }
  }

  const deleteCollection = async (id: string) => {
    if (!confirm('Delete this collection? Tutorials will not be deleted.')) return

    try {
      await supabase.from('collections').delete().eq('id', id)
      setCollections(collections.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert('Failed to delete collection')
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDifficulty('easy')
    setSelectedCollections([])
    setDurationMinutes('')
    setVideoFile(null)
    setThumbnailFile(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = async (tutorial: Tutorial) => {
    setTitle(tutorial.title)
    setDescription(tutorial.description || '')
    setDifficulty(tutorial.difficulty)
    setDurationMinutes(tutorial.duration_minutes?.toString() || '')
    setEditingId(tutorial.id)
    
    // Fetch tutorial's collections
    const { data: tutorialCollections } = await supabase
      .from('tutorial_collections')
      .select('collection_id')
      .eq('tutorial_id', tutorial.id)
    
    setSelectedCollections(tutorialCollections?.map(tc => tc.collection_id) || [])
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return

    try {
      await supabase.from('tutorials').delete().eq('id', id)
      setTutorials(tutorials.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting tutorial:', error)
      alert('Failed to delete tutorial')
    }
  }

  const extractVideoFrame = async (videoFile: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.preload = 'metadata'
      video.src = URL.createObjectURL(videoFile)
      
      video.onloadedmetadata = () => {
        video.currentTime = 1
      }

      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Failed to extract frame'))
          }
        }, 'image/jpeg', 0.8)
        
        URL.revokeObjectURL(video.src)
      }

      video.onerror = () => {
        reject(new Error('Failed to load video'))
        URL.revokeObjectURL(video.src)
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (!videoFile && !editingId) {
      alert('Please select a video file')
      return
    }

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('You must be logged in')
        return
      }

      let videoUrl = editingId ? tutorials.find(t => t.id === editingId)?.video_url || '' : ''
      let thumbnailUrl = editingId ? tutorials.find(t => t.id === editingId)?.thumbnail_url || null : null

      // Upload video if provided
      if (videoFile) {
        const videoExt = videoFile.name.split('.').pop()
        const videoFileName = `${Date.now()}-${title.replace(/\s+/g, '-')}.${videoExt}`
        const { data: videoData, error: videoError } = await supabase.storage
          .from('tutorials')
          .upload(videoFileName, videoFile)

        if (videoError) throw videoError

        const { data: videoUrlData } = supabase.storage
          .from('tutorials')
          .getPublicUrl(videoData.path)

        videoUrl = videoUrlData.publicUrl
      }

      // Upload thumbnail or generate from video
      if (thumbnailFile) {
        const thumbExt = thumbnailFile.name.split('.').pop()
        const thumbFileName = `thumb-${Date.now()}-${title.replace(/\s+/g, '-')}.${thumbExt}`
        const { data: thumbData, error: thumbError } = await supabase.storage
          .from('tutorials')
          .upload(thumbFileName, thumbnailFile)

        if (thumbError) throw thumbError

        const { data: thumbUrlData } = supabase.storage
          .from('tutorials')
          .getPublicUrl(thumbData.path)

        thumbnailUrl = thumbUrlData.publicUrl
      } else if (videoFile && !editingId) {
        try {
          const frameBlob = await extractVideoFrame(videoFile)
          
          const thumbFileName = `thumb-${Date.now()}-${title.replace(/\s+/g, '-')}.jpg`
          const { data: thumbData, error: thumbError } = await supabase.storage
            .from('tutorials')
            .upload(thumbFileName, frameBlob)

          if (!thumbError && thumbData) {
            const { data: thumbUrlData } = supabase.storage
              .from('tutorials')
              .getPublicUrl(thumbData.path)

            thumbnailUrl = thumbUrlData.publicUrl
          }
        } catch (error) {
          console.error('Error generating thumbnail:', error)
        }
      }

      const tutorialData = {
        title,
        description: description || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        difficulty,
        collection: null, // Keep for backwards compatibility
        duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
      }

      let tutorialId = editingId

      if (editingId) {
        // Update existing tutorial
        const { data, error } = await supabase
          .from('tutorials')
          .update(tutorialData)
          .eq('id', editingId)
          .select()
          .single()

        if (error) throw error
        setTutorials(tutorials.map(t => t.id === editingId ? data : t))
      } else {
        // Create new tutorial
        const { data, error } = await supabase
          .from('tutorials')
          .insert(tutorialData)
          .select()
          .single()

        if (error) throw error
        setTutorials([data, ...tutorials])
        tutorialId = data.id
      }

      // Update tutorial collections
      if (tutorialId) {
        // Remove old collections
        await supabase
          .from('tutorial_collections')
          .delete()
          .eq('tutorial_id', tutorialId)

        // Add new collections
        if (selectedCollections.length > 0) {
          const { error: collectionError } = await supabase
            .from('tutorial_collections')
            .insert(
              selectedCollections.map(collectionId => ({
                tutorial_id: tutorialId,
                collection_id: collectionId,
              }))
            )

          if (collectionError) throw collectionError
        }
      }

      resetForm()
      alert(editingId ? 'Tutorial updated successfully!' : 'Tutorial created successfully!')
    } catch (error) {
      console.error('Error saving tutorial:', error)
      alert('Failed to save tutorial')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* Navigation Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-1 shadow-md">
        <button
          onClick={() => {}}
          className="flex-1 py-3 rounded-lg font-semibold bg-purple-600 text-white"
        >
          📹 Tutorials
        </button>
        <button
          onClick={() => window.location.href = '/admin/analytics'}
          className="flex-1 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          📊 Analytics
        </button>
      </div>

      {/* Action Buttons */}
      {!showForm && !showCollectionManager && (
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Tutorial
          </button>
          <button
            onClick={() => setShowCollectionManager(true)}
            className="flex-1 py-4 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
          >
            <Tag className="w-5 h-5" />
            Manage Collections
          </button>
        </div>
      )}

      {/* Collection Manager */}
      {showCollectionManager && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Manage Collections</h2>
            <button onClick={() => setShowCollectionManager(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Collection name (e.g., Beginner Series)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <textarea
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newCollectionIcon}
                onChange={(e) => setNewCollectionIcon(e.target.value)}
                placeholder="Icon (emoji)"
                className="w-20 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-2xl"
                maxLength={2}
              />
              <button
                onClick={createCollection}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700"
              >
                Create Collection
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-600 mb-2">Existing Collections:</h3>
            {collections.map((collection) => (
              <div key={collection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{collection.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{collection.name}</p>
                    {collection.description && (
                      <p className="text-xs text-gray-500">{collection.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteCollection(collection.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {collections.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No collections yet</p>
            )}
          </div>
        </div>
      )}

      {/* Tutorial Form - Continue with existing form but add collections selector */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {editingId ? 'Edit Tutorial' : 'New Tutorial'}
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Existing fields... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="E.g., Basic Inversion for Beginners"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24 resize-none"
                placeholder="Describe what students will learn..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="drop">Drop</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="10"
                  min="1"
                />
              </div>
            </div>

            {/* NEW: Collections Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collections (optional - select multiple)
              </label>
              {collections.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => toggleCollection(collection.id)}
                      className={`px-3 py-2 rounded-lg border-2 transition-all ${
                        selectedCollections.includes(collection.id)
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      <span className="mr-1">{collection.icon}</span>
                      {collection.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No collections yet. Create collections in "Manage Collections" first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Video {!editingId && '*'}</label>
              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {videoFile ? videoFile.name : 'Upload video file'}
                </span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail (optional)</label>
              <p className="text-xs text-gray-500 mb-2">If not provided, will be auto-generated from video</p>
              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">
                  {thumbnailFile ? thumbnailFile.name : 'Upload thumbnail'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update Tutorial' : 'Create Tutorial'}
            </button>
          </form>
        </div>
      )}

      {/* Tutorials List */}
      {!showForm && !showCollectionManager && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900">All Tutorials ({tutorials.length})</h3>
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex gap-3">
                {tutorial.thumbnail_url ? (
                  <img
                    src={tutorial.thumbnail_url}
                    alt={tutorial.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">🧘‍♀️</span>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">{tutorial.title}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${difficultyColors[tutorial.difficulty]}`}>
                      {tutorial.difficulty}
                    </span>
                    {tutorial.collection && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{tutorial.collection}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(tutorial)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(tutorial.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {tutorials.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No tutorials yet. Create your first one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

