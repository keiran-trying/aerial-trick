'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Clock, Video, Calendar, Flame, Trophy, Camera, Upload } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Progress = Database['public']['Tables']['progress']['Row']
type ProgressPhotos = Database['public']['Tables']['progress_photos']['Row']
type Achievement = Database['public']['Tables']['achievements']['Row']

export function ProgressDashboard() {
  const [progress, setProgress] = useState<Progress | null>(null)
  const [photos, setPhotos] = useState<ProgressPhotos | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const [progressRes, photosRes, achievementsRes] = await Promise.all([
        supabase.from('progress').select('*').eq('user_id', user.id).single(),
        supabase.from('progress_photos').select('*').eq('user_id', user.id).single(),
        supabase.from('achievements').select('*').eq('user_id', user.id).order('earned_at', { ascending: false }),
      ])

      setProgress(progressRes.data)
      setPhotos(photosRes.data)
      setAchievements(achievementsRes.data || [])
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (milestone: string, file: File) => {
    setUploadingPhoto(milestone)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${milestone}-${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('progress-photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('progress-photos')
        .getPublicUrl(uploadData.path)

      await supabase
        .from('progress_photos')
        .update({ [milestone]: urlData.publicUrl })
        .eq('user_id', user.id)

      // Refresh data
      await fetchProgressData()
    } catch (error) {
      console.error('Error uploading photo:', error)
    } finally {
      setUploadingPhoto(null)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-6 shadow animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const milestones = [
    { key: 'day_0', label: 'Day 1', description: 'Your starting point' },
    { key: 'month_1', label: '1 Month', description: 'After 30 days' },
    { key: 'month_3', label: '3 Months', description: 'Quarter year progress' },
    { key: 'month_6', label: '6 Months', description: 'Half year journey' },
    { key: 'year_1', label: '1 Year', description: 'Full year transformation' },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatDuration(progress?.total_minutes || 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <Video className="w-5 h-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {progress?.videos_completed || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium">Days Practiced</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {progress?.days_practiced || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {progress?.current_streak || 0}
          </p>
        </div>
      </div>

      {/* Points Display */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90 mb-1">Total Points</p>
            <p className="text-4xl font-bold">{progress?.total_points || 0}</p>
          </div>
          <Trophy className="w-16 h-16 opacity-80" />
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm opacity-90">
            Longest Streak: {progress?.longest_streak || 0} days 🔥
          </p>
        </div>
      </div>

      {/* Progress Photos */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Progress Photos</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Track your transformation journey with photos at key milestones.
        </p>

        <div className="space-y-4">
          {milestones.map((milestone) => {
            const photoUrl = photos?.[milestone.key as keyof ProgressPhotos]
            const isUploading = uploadingPhoto === milestone.key
            
            return (
              <div key={milestone.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{milestone.label}</h3>
                    <p className="text-xs text-gray-500">{milestone.description}</p>
                  </div>
                  {!photoUrl && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handlePhotoUpload(milestone.key, file)
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200">
                        {isUploading ? (
                          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Upload className="w-5 h-5" />
                        )}
                      </div>
                    </label>
                  )}
                </div>
                
                {photoUrl ? (
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photoUrl}
                      alt={`Progress at ${milestone.label}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h2 className="text-lg font-bold text-gray-900">Achievements</h2>
          </div>
          
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
              >
                <div className="text-3xl">🏆</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {achievement.badge_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {achievement.badge_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

