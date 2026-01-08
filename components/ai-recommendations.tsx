'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, RefreshCw, Loader2, Play, Clock, ChevronRight } from 'lucide-react'
import { cn, difficultyColors, formatDuration } from '@/lib/utils'
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
  const router = useRouter()

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
        // Show fallback recommendations for non-logged-in users
        const { data: tutorials } = await supabase
          .from('tutorials')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false })
        
        // Filter out tutorials from future challenges
        const { filterFutureTutorials } = await import('@/lib/filter-future-tutorials')
        const filteredTutorials = await filterFutureTutorials(tutorials, supabase)
        
        const tutorialsWithReason = filteredTutorials.map((tutorial, index) => ({
          ...tutorial,
          aiReason: index === 0 ? '🌟 Most recently added tutorial' : 
                    index === 1 ? '🎯 Popular with beginners' : 
                    '💪 Great for skill building'
        }))
        
        setRecommendations(tutorialsWithReason)
        setUserLevel('Guest Mode')
        setLoading(false)
        return
      }

      // Get user preferences and favorites
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('skill_level')
        .eq('user_id', user.id)
        .single()

      const skillLevel = preferences?.skill_level || 'easy'
      
      // Get user's completed tutorials
      const { data: progress } = await supabase
        .from('user_progress')
        .select('tutorial_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      const completedIds = progress?.map(p => p.tutorial_id) || []

      // Get user's favorites to understand preferences
      const { data: favorites } = await supabase
        .from('favorites')
        .select('tutorials(collections:tutorial_collections(collection:collections(name)))')
        .eq('user_id', user.id)

      // Determine appropriate difficulty level based on user's skill
      let targetDifficulty = skillLevel
      let targetStars = [1] // Default to 1 star
      
      // Smart level progression:
      // Beginners (easy): Only easy 1-star
      // Intermediate: Int 1-star, some easy 2-star
      // Advanced: Adv 1-star, Int 2-star, some drop
      if (skillLevel === 'easy') {
        targetDifficulty = 'easy'
        targetStars = [1] // ONLY 1-star for beginners
      } else if (skillLevel === 'intermediate') {
        // Show intermediate 1-star primarily, some easy 2-star
        targetDifficulty = 'intermediate'
        targetStars = [1, 2]
      } else if (skillLevel === 'advanced') {
        // Show advanced tricks and some drops
        targetDifficulty = 'advanced'
        targetStars = [1, 2]
      }

      // Get recommended tutorials based on skill level
      let query = supabase
        .from('tutorials')
        .select('*')
        .eq('difficulty', targetDifficulty)
        .in('difficulty_stars', targetStars)
        .limit(5)

      if (completedIds.length > 0) {
        query = query.not('id', 'in', `(${completedIds.join(',')})`)
      }

      const { data: tutorials } = await query.order('created_at', { ascending: false })

      // Filter out tutorials from future challenges
      const { filterFutureTutorials } = await import('@/lib/filter-future-tutorials')
      const filteredTutorials = await filterFutureTutorials(tutorials, supabase)

      // If no tutorials at exact level, try easier level
      if (!filteredTutorials || filteredTutorials.length === 0) {
        const fallbackLevel = skillLevel === 'intermediate' ? 'easy' : 'intermediate'
        const { data: fallbackTutorials } = await supabase
          .from('tutorials')
          .select('*')
          .eq('difficulty', fallbackLevel)
          .eq('difficulty_stars', 1)
          .limit(3)
          .order('created_at', { ascending: false })
        
        // Filter fallback tutorials too
        const filteredFallback = await filterFutureTutorials(fallbackTutorials, supabase)
        
        const tutorialsWithReason = filteredFallback.map((tutorial) => ({
          ...tutorial,
          aiReason: '🎯 Master the basics first, then level up!'
        }))
        
        setRecommendations(tutorialsWithReason)
        setUserLevel(`${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Level`)
        setLoading(false)
        return
      }

      // Add AI-like reasons based on user behavior
      const tutorialsWithReason = filteredTutorials.slice(0, 3).map((tutorial, index) => {
        let reason = ''
        
        if (skillLevel === 'easy') {
          reason = index === 0 ? '🌱 Perfect starter trick for beginners' :
                   index === 1 ? '💚 Build your foundation safely' :
                   '✨ Easy to learn, fun to master'
        } else if (skillLevel === 'intermediate') {
          reason = index === 0 ? '🎯 Level up your skills' :
                   index === 1 ? '💪 Challenge yourself with this' :
                   '🌟 Next step in your progression'
        } else {
          reason = index === 0 ? '🔥 Advanced technique for you' :
                   index === 1 ? '💎 Master-level move' :
                   '🚀 Push your limits'
        }
        
        return {
          ...tutorial,
          aiReason: reason
        }
      })

      setRecommendations(tutorialsWithReason)
      setUserLevel(`${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)} Level`)
    } catch (err: any) {
      console.error('Error fetching recommendations:', err)
      // Show fallback on error
      try {
        const { data: tutorials } = await supabase
          .from('tutorials')
          .select('*')
          .limit(3)
          .order('created_at', { ascending: false })
        
        // Filter out tutorials from future challenges
        const { filterFutureTutorials } = await import('@/lib/filter-future-tutorials')
        const filteredTutorials = await filterFutureTutorials(tutorials, supabase)
        
        const tutorialsWithReason = filteredTutorials.map((tutorial) => ({
          ...tutorial,
          aiReason: '🎯 Recommended for you'
        }))
        
        setRecommendations(tutorialsWithReason)
        setUserLevel('Recommendations')
      } catch {
      setError('Unable to load recommendations')
      }
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

  // If OpenAI is not available, don't show the component at all
  if (error && error.includes('unavailable')) {
    return null // Hide completely if AI is unavailable
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white">Recommendations</h2>
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
            <h2 className="text-lg font-bold text-white">Recommendations</h2>
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
          <button
            key={tutorial.id}
            onClick={() => router.push(`/tutorial/${tutorial.id}`)}
            className="w-full text-left bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
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
              
              {/* Tutorial Preview Card - Navigates to Video Page */}
              <div className="flex gap-3 items-start">
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                  {tutorial.thumbnail_url ? (
                    <Image
                      src={tutorial.thumbnail_url}
                      alt={tutorial.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-xl">🧘‍♀️</span>
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                      <Play className="w-4 h-4 text-purple-600 fill-purple-600 ml-0.5" />
                    </div>
                  </div>
                  {/* Duration */}
                  {tutorial.duration_minutes && (
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-white text-[9px] font-semibold">
                      {formatDuration(tutorial.duration_minutes)}
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase',
                      difficultyColors[tutorial.difficulty]
                    )}>
                      {tutorial.difficulty[0]}
                    </span>
                    {tutorial.difficulty_stars && tutorial.difficulty_stars > 0 && (
                      <span className="text-[9px]">
                        {'⭐️'.repeat(tutorial.difficulty_stars)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                    {tutorial.title}
                  </h3>
                </div>
                
                {/* Arrow indicator */}
                <div className="flex-shrink-0 self-center">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs text-white/80 text-center">
          ✨ Watch more tutorials to help us learn what to recommend
        </p>
      </div>
    </div>
  )
}

