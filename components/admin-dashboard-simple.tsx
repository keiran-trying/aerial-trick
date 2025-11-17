'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Upload, X, Search } from 'lucide-react'
import { difficultyColors } from '@/lib/utils'
import { AdminDailyTrick } from './admin-daily-trick'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']
type DifficultyLevel = Database['public']['Tables']['tutorials']['Row']['difficulty']

export function AdminDashboardSimple() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy')
  const [difficultyStars, setDifficultyStars] = useState<number>(1) // Sub-level difficulty (1-2)
  const [collectionsInput, setCollectionsInput] = useState('') // Comma-separated collections
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all')
  
  const supabase = createClient()

  useEffect(() => {
    fetchTutorials()
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

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDifficulty('easy')
    setDifficultyStars(1)
    setCollectionsInput('')
    setVideoFile(null)
    setThumbnailFile(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = async (tutorial: Tutorial) => {
    setTitle(tutorial.title)
    setDescription(tutorial.description || '')
    setDifficulty(tutorial.difficulty)
    setDifficultyStars(tutorial.difficulty_stars || 1)
    setEditingId(tutorial.id)
    
    // Fetch tutorial's collections
    const { data: tutorialCollections } = await supabase
      .from('tutorial_collections')
      .select('collection_id, collections(name)')
      .eq('tutorial_id', tutorial.id)
    
    if (tutorialCollections) {
      const collectionNames = tutorialCollections
        .map((tc: any) => tc.collections?.name)
        .filter(Boolean)
        .join(', ')
      setCollectionsInput(collectionNames)
    }
    
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

  const getVideoDuration = async (videoFile: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.src = URL.createObjectURL(videoFile)
      
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src)
        // Round up to nearest minute
        const durationMinutes = Math.ceil(video.duration / 60)
        resolve(durationMinutes)
      }

      video.onerror = () => {
        URL.revokeObjectURL(video.src)
        reject(new Error('Failed to load video'))
      }
    })
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

  // Helper function to convert text to Title Case
  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
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

      // Get existing tutorial data if editing
      const existingTutorial = editingId ? tutorials.find(t => t.id === editingId) : null
      
      // Keep existing URLs and duration if not uploading new files
      let videoUrl = existingTutorial?.video_url || ''
      let thumbnailUrl = existingTutorial?.thumbnail_url || null
      let durationMinutes = existingTutorial?.duration_minutes || null

      // Upload video ONLY if a new file is provided
      if (videoFile) {
        // Extract video duration
        try {
          durationMinutes = await getVideoDuration(videoFile)
        } catch (error) {
          console.error('Error getting video duration:', error)
        }

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
        // Only auto-generate thumbnail for NEW tutorials
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
        title: toTitleCase(title.trim()),
        description: description || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        difficulty,
        difficulty_stars: difficultyStars,
        collection: null,
        duration_minutes: durationMinutes,
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

      // Handle collections - create them if they don't exist
      if (tutorialId && collectionsInput.trim()) {
        // Remove old collections
        await supabase
          .from('tutorial_collections')
          .delete()
          .eq('tutorial_id', tutorialId)

        // Parse collection names (comma-separated)
        const collectionNames = collectionsInput
          .split(',')
          .map(name => name.trim())
          .filter(name => name.length > 0)
          .map(name => toTitleCase(name))

        // Create collections if they don't exist and link them
        for (const collectionName of collectionNames) {
          // Try to get existing collection (case-insensitive search)
          let { data: existingCollections } = await supabase
            .from('collections')
            .select('id, name')

          // Find matching collection (case-insensitive)
          let existingCollection = existingCollections?.find(
            col => col.name.toLowerCase() === collectionName.toLowerCase()
          )

          let collectionId = existingCollection?.id

          // Create collection if it doesn't exist
          if (!collectionId) {
            const { data: newCollection, error: createError } = await supabase
              .from('collections')
              .insert({
                name: collectionName,
                description: null,
                icon: '📁',
              })
              .select('id')
              .single()

            if (createError) {
              console.error('Error creating collection:', createError)
              continue
            }

            collectionId = newCollection.id
          }

          // Link tutorial to collection
          if (collectionId) {
            await supabase
              .from('tutorial_collections')
              .insert({
                tutorial_id: tutorialId,
                collection_id: collectionId,
              })
          }
        }
      }

      resetForm()
      alert(editingId ? 'Tutorial updated successfully!' : 'Tutorial created successfully!')
    } catch (error: any) {
      console.error('Error saving tutorial:', error)
      const errorMessage = error?.message || error?.error_description || 'Unknown error'
      alert(`Failed to save tutorial: ${errorMessage}\n\nIf you see a column error, make sure you've run the SQL migration in Supabase.`)
    } finally {
      setIsSubmitting(false)
    }
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

      {/* Daily Trick Info - Only for manual testing if needed */}
      {!showForm && process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-900 font-medium mb-2">
            💡 <strong>Daily Trick is Automatic!</strong>
          </p>
          <p className="text-xs text-blue-800">
            On Vercel, a new Daily Trick is automatically selected every day at midnight UTC. 
            No manual work needed! Deploy to Vercel to enable automatic selection.
          </p>
          <details className="mt-2">
            <summary className="text-xs text-blue-700 cursor-pointer hover:text-blue-900 font-medium">
              Manual trigger (testing only)
            </summary>
            <div className="mt-2">
              <AdminDailyTrick />
            </div>
          </details>
        </div>
      )}

      {/* Add New Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Tutorial
        </button>
      )}

      {/* Tutorial Form */}
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
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="E.g., Basic Inversion for Beginners"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24 resize-none text-gray-900"
                placeholder="Describe what students will learn..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">Difficulty *</label>
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

            {/* Difficulty Stars Sub-level */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Sub-Level *
              </label>
              <div className="flex gap-3">
                {[1, 2].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() => setDifficultyStars(stars)}
                    className={`flex-1 px-6 py-4 border-2 rounded-lg font-semibold transition-all ${
                      difficultyStars === stars
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{'⭐️'.repeat(stars)}</div>
                    <div className="text-sm font-bold">
                      {stars === 1 ? 'Easier' : 'Harder'}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Choose the sub-level within the difficulty category
              </p>
            </div>

            {/* Simple Collections Input */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Collections (optional)
              </label>
              <input
                type="text"
                value={collectionsInput}
                onChange={(e) => setCollectionsInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="E.g., Beginner Series, 30-Day Challenge"
              />
              <p className="text-xs text-gray-700 mt-1 font-medium">
                Separate multiple collections with commas. Collections will be created automatically.
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Video {!editingId && '*'}
              </label>
              {editingId && (
                <p className="text-xs text-gray-700 mb-2 font-medium">
                  Leave empty to keep existing video
                </p>
              )}
              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-black font-medium">
                  {videoFile ? videoFile.name : editingId ? 'Upload new video (optional)' : 'Upload video file'}
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
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Thumbnail (optional)
              </label>
              <p className="text-xs text-gray-700 mb-2 font-medium">
                {editingId ? 'Leave empty to keep existing thumbnail' : 'If not provided, will be auto-generated from video'}
              </p>
              <label className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-black font-medium">
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
      {!showForm && (() => {
        // Filter tutorials
        let filteredTutorials = tutorials

        // Filter by difficulty
        if (filterDifficulty !== 'all') {
          filteredTutorials = filteredTutorials.filter(t => t.difficulty === filterDifficulty)
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase()
          filteredTutorials = filteredTutorials.filter(t => 
            t.title.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query) ||
            t.difficulty.toLowerCase().includes(query) ||
            new Date(t.created_at).toLocaleDateString().includes(query)
          )
        }

        return (
          <div className="space-y-4">
            {/* Search and Filter Bar */}
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, date, difficulty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Difficulty Filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setFilterDifficulty('all')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filterDifficulty === 'all'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All ({tutorials.length})
                </button>
                {(['easy', 'intermediate', 'advanced', 'drop'] as DifficultyLevel[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setFilterDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                      filterDifficulty === diff
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)} ({tutorials.filter(t => t.difficulty === diff).length})
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <h3 className="text-lg font-bold text-gray-900">
              {searchQuery || filterDifficulty !== 'all' 
                ? `${filteredTutorials.length} Result${filteredTutorials.length !== 1 ? 's' : ''}`
                : `All Tutorials (${tutorials.length})`
              }
            </h3>

            {/* Tutorials Grid with Landscape Thumbnails */}
            {filteredTutorials.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTutorials.map((tutorial) => (
                  <div key={tutorial.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    {/* Landscape Thumbnail */}
                    {tutorial.thumbnail_url ? (
                      <img
                        src={tutorial.thumbnail_url}
                        alt={tutorial.title}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                        <span className="text-6xl">🧘‍♀️</span>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="p-3">
                      <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{tutorial.title}</h4>
                      
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full text-white font-semibold ${difficultyColors[tutorial.difficulty]}`}>
                          {tutorial.difficulty.toUpperCase()}
                        </span>
                        {tutorial.difficulty_stars && (
                          <span className="text-xs px-1.5 py-0.5 bg-white border border-gray-300 rounded-full">
                            {'⭐️'.repeat(tutorial.difficulty_stars)}
                          </span>
                        )}
                      </div>
                      
                      {/* Date */}
                      <div className="text-xs text-gray-500 mb-3">
                        {new Date(tutorial.created_at).toLocaleDateString()}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(tutorial)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tutorial.id)}
                          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                {tutorials.length === 0 ? (
                  <p>No tutorials yet. Create your first one!</p>
                ) : (
                  <>
                    <p>No tutorials match your search.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setFilterDifficulty('all')
                      }}
                      className="mt-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Clear filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}

