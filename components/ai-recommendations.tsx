'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react'
import { TutorialCard } from './tutorial-card'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row'] & {
  aiReason?: string
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userLevel, setUserLevel] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('Please log in to see recommendations')
        setLoading(false)
        return
      }

      // Call recommendation API
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      })

      const data = await response.json()

      if (data.success) {
        setRecommendations(data.recommendations || [])
        setUserLevel(data.userLevel || '')
      } else if (data.fallback) {
        setError('AI recommendations unavailable. Try manual browsing!')
      } else {
        setError(data.error || 'Failed to load recommendations')
      }
    } catch (err: any) {
      console.error('Error fetching recommendations:', err)
      setError('Unable to load recommendations')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchRecommendations()
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3 text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">AI is analyzing your progress...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-center">
          <p className="mb-2">🎉 You've completed all available tutorials!</p>
          <p className="text-sm text-white/80">Check back soon for new content.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
            {userLevel && (
              <p className="text-xs text-white/80">{userLevel}</p>
            )}
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-white ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-3">
        {recommendations.map((tutorial, index) => (
          <div key={tutorial.id} className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden">
            <div className="p-3">
              {/* AI Reason Badge */}
              <div className="flex items-start gap-2 mb-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-semibold text-purple-700">AI says:</span> {tutorial.aiReason}
                  </p>
                </div>
              </div>
              
              {/* Tutorial Card */}
              <TutorialCard tutorial={tutorial} compact />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs text-white/80 text-center">
          ✨ Personalized recommendations based on your progress and skill level
        </p>
      </div>
    </div>
  )
}

