'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Clock, MessageCircle, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn, difficultyColors, formatDuration, formatDate, calculatePoints } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']
type Comment = Database['public']['Tables']['comments']['Row'] & {
  author: { name: string | null; profile_pic: string | null }
}

interface TutorialDetailProps {
  tutorial: Tutorial
}

export function TutorialDetail({ tutorial }: TutorialDetailProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMotivation, setShowMotivation] = useState(false)
  const [motivationMessage, setMotivationMessage] = useState('')
  const [hasCompletedVideo, setHasCompletedVideo] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if favorited
        const { data: favData } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('tutorial_id', tutorial.id)
          .single()
        
        setIsFavorite(!!favData)
      }

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
    }

    fetchData()
  }, [tutorial.id, supabase])

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
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    setHasCompletedVideo(true)

    // Calculate points
    const points = calculatePoints(tutorial.difficulty, tutorial.duration_minutes || 0)

    // Update user progress
    const { data: progressData } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button onClick={handleFavoriteToggle} className="p-2 -mr-2">
            <Heart
              className={cn(
                'w-6 h-6 transition-all',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Video Player - Vertical/Portrait */}
        <div className="relative bg-black aspect-[9/16]">
          <video
            controls
            className="w-full h-full object-cover"
            onEnded={handleVideoEnd}
            poster={tutorial.thumbnail_url || undefined}
            playsInline
          >
            <source src={tutorial.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title and Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold text-white',
                difficultyColors[tutorial.difficulty]
              )}>
                {tutorial.difficulty.toUpperCase()}
              </span>
              {tutorial.collection && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {tutorial.collection}
                </span>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {tutorial.title}
            </h1>

            {tutorial.description && (
              <p className="text-gray-600 mb-3">{tutorial.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              {tutorial.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(tutorial.duration_minutes)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{comments.length} comments</span>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-4">
            <h2 className="font-semibold text-lg mb-4">Comments</h2>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                    {comment.author?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 rounded-2xl px-4 py-2">
                      <p className="font-semibold text-sm text-gray-900">
                        {comment.author?.name || 'Anonymous'}
                      </p>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 ml-4">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                </div>
              ))}

              {comments.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Motivation Modal */}
      {showMotivation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-2xl font-bold text-gray-900">{motivationMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

