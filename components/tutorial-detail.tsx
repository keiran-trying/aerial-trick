'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Clock, MessageCircle, Send, Play } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn, difficultyColors, formatDuration, formatDate, calculatePoints } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']
type Comment = Database['public']['Tables']['comments']['Row'] & {
  author: { name: string | null; profile_pic: string | null }
}

interface TutorialDetailProps {
  tutorial: Tutorial
  onClose?: () => void // Optional callback for when used in modal context
}

export function TutorialDetail({ tutorial, onClose }: TutorialDetailProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMotivation, setShowMotivation] = useState(false)
  const [motivationMessage, setMotivationMessage] = useState('')
  const [hasCompletedVideo, setHasCompletedVideo] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const supabase = createClient()

  // Handle back navigation - works for both modal and standalone page
  const handleGoBack = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // If onClose is provided (modal context), use it
    if (onClose) {
      onClose()
      return
    }
    
    // Otherwise use navigation (standalone page context)
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }, [router, onClose])

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Require authentication to view tutorials
      if (!user) {
        router.push('/auth/login')
        return
      }

      setIsAuthenticated(true)
      
      // Check if favorited
      const { data: favData } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('tutorial_id', tutorial.id)
        .single()
      
      setIsFavorite(!!favData)

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          *,
          author:users!comments_author_id_fkey (name, profile_pic)
        `)
        .eq('tutorial_id', tutorial.id)
        .order('created_at', { ascending: false })

      setComments(commentsData as any || [])
      setLoading(false)
    }

    fetchData()
  }, [tutorial.id, router, supabase])

  const handleFavoriteToggle = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('tutorial_id', tutorial.id)
      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, tutorial_id: tutorial.id })
      setIsFavorite(true)
    }
  }

  const handleVideoEnd = async () => {
    if (hasCompletedVideo) return
    
    try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setHasCompletedVideo(true)

    // Calculate points
    const points = calculatePoints(tutorial.difficulty, tutorial.duration_minutes || 0)

    // Update user progress
      const { data: progressData, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

      // If no progress entry exists, create one
      if (progressError || !progressData) {
        const { error: insertError } = await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            total_minutes: tutorial.duration_minutes || 0,
            videos_completed: 1,
            days_practiced: 1,
            current_streak: 1,
            longest_streak: 1,
            total_points: points,
            last_practice_date: new Date().toISOString().split('T')[0],
          })
        
        if (!insertError) {
          await fetchMotivationMessage()
        }
        return
      }

    const today = new Date().toISOString().split('T')[0]
    const lastPracticeDate = progressData?.last_practice_date

    let newStreak = progressData?.current_streak || 0
    let daysPracticed = progressData?.days_practiced || 0

    // Check if this is a new day
    if (lastPracticeDate !== today) {
      daysPracticed += 1
      
      // Check streak
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      
      if (lastPracticeDate === yesterdayStr) {
        newStreak += 1
      } else if (lastPracticeDate) {
        newStreak = 1
      } else {
        newStreak = 1
      }
    }

    await supabase
      .from('progress')
      .update({
        total_minutes: (progressData?.total_minutes || 0) + (tutorial.duration_minutes || 0),
        videos_completed: (progressData?.videos_completed || 0) + 1,
        days_practiced: daysPracticed,
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, progressData?.longest_streak || 0),
        total_points: (progressData?.total_points || 0) + points,
        last_practice_date: today,
      })
      .eq('user_id', user.id)

    // Check for achievements
    await checkAchievements(user.id, progressData?.videos_completed || 0, newStreak)

    // Show motivational message
    await fetchMotivationMessage()
    } catch (error) {
      // Silently fail - don't show errors to user, video still works
      console.error('Progress tracking error:', error)
    }
  }

  const checkAchievements = async (userId: string, videosCompleted: number, streak: number) => {
    const achievements: { badge_name: string; badge_description: string }[] = []

    if (videosCompleted + 1 === 1) {
      achievements.push({ badge_name: 'First Flight', badge_description: 'Completed your first tutorial!' })
    }
    if (videosCompleted + 1 === 10) {
      achievements.push({ badge_name: 'Rising Star', badge_description: 'Completed 10 tutorials!' })
    }
    if (videosCompleted + 1 === 50) {
      achievements.push({ badge_name: 'Aerial Master', badge_description: 'Completed 50 tutorials!' })
    }
    if (streak === 7) {
      achievements.push({ badge_name: 'Week Warrior', badge_description: 'Practiced 7 days in a row!' })
    }
    if (streak === 30) {
      achievements.push({ badge_name: 'Monthly Champion', badge_description: 'Practiced 30 days in a row!' })
    }

    for (const achievement of achievements) {
      await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          badge_name: achievement.badge_name,
          badge_description: achievement.badge_description,
        })
    }
  }

  const fetchMotivationMessage = async () => {
    try {
      const response = await fetch('/api/motivation')
      const data = await response.json()
      setMotivationMessage(data.message)
      setShowMotivation(true)
      setTimeout(() => setShowMotivation(false), 3000)
    } catch (error) {
      console.error('Error fetching motivation:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('comments')
        .insert({
          tutorial_id: tutorial.id,
          author_id: user.id,
          content: newComment.trim(),
        })
        .select(`
          *,
          author:users!comments_author_id_fkey (name, profile_pic)
        `)
        .single()

      if (error) throw error

      setComments([data as any, ...comments])
      setNewComment('')
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-violet-600"></div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 safe-area-top">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <button 
            onClick={handleGoBack} 
            className="p-2.5 -ml-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
            type="button"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h2 className="text-sm font-medium text-slate-500 truncate max-w-[180px]">
            {tutorial.collection || 'Tutorial'}
          </h2>
          <button 
            onClick={handleFavoriteToggle} 
            className="p-2.5 -mr-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
            type="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-all duration-200',
                isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-500'
              )}
            />
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Elegant Video Card */}
        <div className="relative mb-6">
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
            {/* Aspect ratio container - 16:9 for a sleek look */}
            <div className="relative aspect-video">
              {!isVideoPlaying ? (
                // Thumbnail with play overlay
                <div 
                  className="absolute inset-0 cursor-pointer group"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  {tutorial.thumbnail_url ? (
                    <img 
                      src={tutorial.thumbnail_url} 
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600" />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 group-active:scale-95 transition-transform duration-200">
                      <Play className="w-7 h-7 text-slate-800 ml-1" fill="currentColor" />
                    </div>
                  </div>
                  {/* Duration badge */}
                  {tutorial.duration_minutes && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-md">
                      <span className="text-xs font-medium text-white">
                        {formatDuration(tutorial.duration_minutes)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // Video player
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain bg-black"
                  onEnded={handleVideoEnd}
                  playsInline
                >
                  <source src={tutorial.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          {/* Title and Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm',
                difficultyColors[tutorial.difficulty]
              )}>
                {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
              </span>
            </div>
            
            <h1 className="text-xl font-bold text-slate-900 mb-2 leading-tight">
              {tutorial.title}
            </h1>

            {tutorial.description && (
              <p className="text-slate-600 text-sm leading-relaxed">{tutorial.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-slate-400 mt-4 pt-4 border-t border-slate-100">
              {tutorial.duration_minutes && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(tutorial.duration_minutes)}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mt-4">
          <h2 className="font-semibold text-slate-900 mb-4">Comments</h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-5">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm transition-all"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="p-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {comment.author?.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-slate-50 rounded-xl px-3.5 py-2.5">
                    <p className="font-medium text-sm text-slate-900">
                      {comment.author?.name || 'Anonymous'}
                    </p>
                    <p className="text-slate-700 text-sm mt-0.5">{comment.content}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 ml-3.5">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacing for safe area */}
        <div className="h-8 safe-area-bottom" />
      </div>

      {/* Motivation Modal */}
      {showMotivation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 mx-6 max-w-sm shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-xl font-bold text-slate-900 leading-tight">{motivationMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

