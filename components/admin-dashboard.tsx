'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Upload, X } from 'lucide-react'
import { difficultyColors } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']
type DifficultyLevel = Database['public']['Tables']['tutorials']['Row']['difficulty']

export function AdminDashboard() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'tutorials' | 'analytics'>('tutorials')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('easy')
  const [collection, setCollection] = useState('')
  const [durationMinutes, setDurationMinutes] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  
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
    setCollection('')
    setDurationMinutes('')
    setVideoFile(null)
    setThumbnailFile(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (tutorial: Tutorial) => {
    setTitle(tutorial.title)
    setDescription(tutorial.description || '')
    setDifficulty(tutorial.difficulty)
    setCollection(tutorial.collection || '')
    setDurationMinutes(tutorial.duration_minutes?.toString() || '')
    setEditingId(tutorial.id)
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

  const extractVideoFrame = async (videoFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      video.preload = 'metadata'
      video.src = URL.createObjectURL(videoFile)
      
      video.onloadedmetadata = () => {
        video.currentTime = 1 // Get frame at 1 second
      }

      video.onseeked = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob))
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
        // Generate thumbnail from video
        try {
          const frameUrl = await extractVideoFrame(videoFile)
          const response = await fetch(frameUrl)
          const blob = await response.blob()
          
          const thumbFileName = `thumb-${Date.now()}-${title.replace(/\s+/g, '-')}.jpg`
          const { data: thumbData, error: thumbError } = await supabase.storage
            .from('tutorials')
            .upload(thumbFileName, blob)

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
        collection: collection || null,
        duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
      }

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
          onClick={() => setActiveTab('tutorials')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'tutorials'
              ? 'bg-purple-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
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

      {/* Form */}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24 resize-none"
                placeholder="Describe what students will learn..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Collection (optional)
              </label>
              <input
                type="text"
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="E.g., Beginner Series"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video {!editingId && '*'}
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail (optional)
              </label>
              <p className="text-xs text-gray-500 mb-2">
                If not provided, will be auto-generated from video
              </p>
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
                <h4 className="font-semibold text-gray-900 mb-1 truncate">
                  {tutorial.title}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${difficultyColors[tutorial.difficulty]}`}>
                    {tutorial.difficulty}
                  </span>
                  {tutorial.collection && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {tutorial.collection}
                    </span>
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
    </div>
  )
}

