'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Mail, Camera, LogOut, Settings } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type UserProfile = Database['public']['Tables']['users']['Row']
type Progress = Database['public']['Tables']['progress']['Row']

export function ProfileSettings() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth/login')
        return
      }

      const [userRes, progressRes] = await Promise.all([
        supabase.from('users').select('*').eq('id', authUser.id).single(),
        supabase.from('progress').select('*').eq('user_id', authUser.id).single(),
      ])

      if (userRes.data) {
        setUser(userRes.data)
        setName(userRes.data.name || '')
        setEmail(userRes.data.email)
      }
      setProgress(progressRes.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || isSaving) return

    setIsSaving(true)
    try {
      await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)

      setUser({ ...user, name })
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl p-6 shadow animate-pulse">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
              {name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {isEditing ? (
            <div className="w-full space-y-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setName(user?.name || '')
                  }}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {name || 'Aerial Enthusiast'}
              </h2>
              <p className="text-sm text-gray-500 mb-3">{email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Your Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Minutes Practiced</span>
            <span className="font-semibold text-gray-900">
              {formatDuration(progress?.total_minutes || 0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tutorials Completed</span>
            <span className="font-semibold text-gray-900">
              {progress?.videos_completed || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Days Practiced</span>
            <span className="font-semibold text-gray-900">
              {progress?.days_practiced || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Current Streak</span>
            <span className="font-semibold text-gray-900">
              {progress?.current_streak || 0} days 🔥
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Points</span>
            <span className="font-semibold text-purple-600 text-lg">
              {progress?.total_points || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <button
          onClick={() => router.push('/admin')}
          className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Admin Portal</span>
        </button>
        
        <button
          onClick={handleLogout}
          className="w-full px-6 py-4 flex items-center gap-3 text-left hover:bg-red-50 transition-colors border-t"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span className="font-medium text-red-600">Log Out</span>
        </button>
      </div>

      {/* Member Since */}
      <div className="text-center text-sm text-gray-500">
        Member since {new Date(user?.join_date || '').toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })}
      </div>
    </div>
  )
}

