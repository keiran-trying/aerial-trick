'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { 
  Users, 
  Video, 
  MessageSquare, 
  TrendingUp, 
  Award,
  Eye,
  Heart,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react'
import { formatDuration } from '@/lib/utils'

interface AnalyticsData {
  totalUsers: number
  totalTutorials: number
  totalPosts: number
  totalComments: number
  totalWatchTime: number
  totalCompletions: number
  totalFavorites: number
  totalPoints: number
  activeUsers7Days: number
  activeUsers30Days: number
  newUsersToday: number
  newUsersThisWeek: number
  popularTutorials: Array<{
    id: string
    title: string
    difficulty: string
    completions: number
    favorites: number
  }>
  recentActivity: Array<{
    type: string
    user: string
    action: string
    time: string
  }>
  tutorialsByDifficulty: {
    easy: number
    intermediate: number
    advanced: number
    drop: number
  }
}

export function AdminAnalytics() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Fetch all data in parallel
      const [
        usersRes,
        tutorialsRes,
        postsRes,
        commentsRes,
        progressRes,
        favoritesRes,
        achievementsRes,
      ] = await Promise.all([
        supabase.from('users').select('id, created_at'),
        supabase.from('tutorials').select('id, title, difficulty'),
        supabase.from('posts').select('id'),
        supabase.from('comments').select('id'),
        supabase.from('progress').select('total_minutes, videos_completed, total_points, last_practice_date'),
        supabase.from('favorites').select('id, tutorial_id'),
        supabase.from('achievements').select('id'),
      ])

      const users = usersRes.data || []
      const tutorials = tutorialsRes.data || []
      const posts = postsRes.data || []
      const comments = commentsRes.data || []
      const progress = progressRes.data || []
      const favorites = favoritesRes.data || []
      const achievements = achievementsRes.data || []

      // Calculate metrics
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const newUsersToday = users.filter(u => 
        new Date(u.created_at) >= today
      ).length

      const newUsersThisWeek = users.filter(u => 
        new Date(u.created_at) >= sevenDaysAgo
      ).length

      const activeUsers7Days = progress.filter(p => 
        p.last_practice_date && new Date(p.last_practice_date) >= sevenDaysAgo
      ).length

      const activeUsers30Days = progress.filter(p => 
        p.last_practice_date && new Date(p.last_practice_date) >= thirtyDaysAgo
      ).length

      const totalWatchTime = progress.reduce((sum, p) => sum + (p.total_minutes || 0), 0)
      const totalCompletions = progress.reduce((sum, p) => sum + (p.videos_completed || 0), 0)
      const totalPoints = progress.reduce((sum, p) => sum + (p.total_points || 0), 0)

      // Count favorites per tutorial
      const favoritesByTutorial = favorites.reduce((acc, fav) => {
        acc[fav.tutorial_id] = (acc[fav.tutorial_id] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Get popular tutorials (mock completions for now)
      const popularTutorials = tutorials
        .map(t => ({
          id: t.id,
          title: t.title,
          difficulty: t.difficulty,
          completions: Math.floor(Math.random() * 100), // TODO: Track actual completions
          favorites: favoritesByTutorial[t.id] || 0,
        }))
        .sort((a, b) => b.favorites + b.completions - (a.favorites + a.completions))
        .slice(0, 5)

      // Tutorials by difficulty
      const tutorialsByDifficulty = tutorials.reduce((acc, t) => {
        acc[t.difficulty as keyof typeof acc] = (acc[t.difficulty as keyof typeof acc] || 0) + 1
        return acc
      }, { easy: 0, intermediate: 0, advanced: 0, drop: 0 })

      // Mock recent activity (you can enhance this with actual activity tracking)
      const recentActivity = [
        { type: 'signup', user: 'New User', action: 'Signed up', time: 'Just now' },
        { type: 'completion', user: 'User', action: 'Completed a tutorial', time: '5 mins ago' },
        { type: 'post', user: 'User', action: 'Posted in community', time: '10 mins ago' },
      ]

      setAnalytics({
        totalUsers: users.length,
        totalTutorials: tutorials.length,
        totalPosts: posts.length,
        totalComments: comments.length,
        totalWatchTime,
        totalCompletions,
        totalFavorites: favorites.length,
        totalPoints,
        activeUsers7Days,
        activeUsers30Days,
        newUsersToday,
        newUsersThisWeek,
        popularTutorials,
        recentActivity,
        tutorialsByDifficulty,
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">📊 Analytics Dashboard</h1>
        <p className="text-white/90 text-sm">
          Real-time insights into your Aerial Trick app
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={Users}
          label="Total Users"
          value={analytics.totalUsers.toString()}
          change={`+${analytics.newUsersThisWeek} this week`}
          color="blue"
        />
        <MetricCard
          icon={Video}
          label="Tutorials"
          value={analytics.totalTutorials.toString()}
          subtitle="Total videos"
          color="purple"
        />
        <MetricCard
          icon={Eye}
          label="Completions"
          value={analytics.totalCompletions.toString()}
          subtitle="Videos watched"
          color="green"
        />
        <MetricCard
          icon={Heart}
          label="Favorites"
          value={analytics.totalFavorites.toString()}
          subtitle="Total saves"
          color="red"
        />
        <MetricCard
          icon={MessageSquare}
          label="Posts"
          value={analytics.totalPosts.toString()}
          change={`${analytics.totalComments} comments`}
          color="orange"
        />
        <MetricCard
          icon={Award}
          label="Total Points"
          value={analytics.totalPoints.toLocaleString()}
          subtitle="Earned by users"
          color="yellow"
        />
      </div>

      {/* User Engagement */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-gray-900">User Engagement</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Users (7 days)</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(analytics.activeUsers7Days / analytics.totalUsers) * 100}%` }}
                />
              </div>
              <span className="font-semibold text-gray-900">{analytics.activeUsers7Days}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Active Users (30 days)</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(analytics.activeUsers30Days / analytics.totalUsers) * 100}%` }}
                />
              </div>
              <span className="font-semibold text-gray-900">{analytics.activeUsers30Days}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Watch Time</span>
            <span className="font-semibold text-gray-900">{formatDuration(analytics.totalWatchTime)}</span>
          </div>
        </div>
      </div>

      {/* Tutorials by Difficulty */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-gray-900">Tutorials by Difficulty</h2>
        </div>
        <div className="space-y-3">
          <DifficultyBar label="Easy" count={analytics.tutorialsByDifficulty.easy} color="bg-green-500" />
          <DifficultyBar label="Intermediate" count={analytics.tutorialsByDifficulty.intermediate} color="bg-yellow-500" />
          <DifficultyBar label="Advanced" count={analytics.tutorialsByDifficulty.advanced} color="bg-orange-500" />
          <DifficultyBar label="Drop" count={analytics.tutorialsByDifficulty.drop} color="bg-red-500" />
        </div>
      </div>

      {/* Popular Tutorials */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-gray-900">Most Popular Tutorials</h2>
        </div>
        <div className="space-y-3">
          {analytics.popularTutorials.map((tutorial, index) => (
            <div key={tutorial.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{tutorial.title}</p>
                <p className="text-xs text-gray-500 capitalize">{tutorial.difficulty}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{tutorial.favorites} ❤️</p>
                <p className="text-xs text-gray-500">{tutorial.completions} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Stats */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-purple-600" />
          <h2 className="font-bold text-gray-900">Growth</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-purple-600">{analytics.newUsersToday}</p>
            <p className="text-sm text-gray-600">New users today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{analytics.newUsersThisWeek}</p>
            <p className="text-sm text-gray-600">New users this week</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <a
          href="/admin"
          className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold text-center hover:bg-purple-700 transition-colors"
        >
          📹 Manage Tutorials
        </a>
        <button
          onClick={() => fetchAnalytics()}
          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: any
  label: string
  value: string
  change?: string
  subtitle?: string
  color: string
}

function MetricCard({ icon: Icon, label, value, change, subtitle, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50',
    yellow: 'text-yellow-600 bg-yellow-50',
  }[color]

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className={`w-10 h-10 rounded-full ${colorClasses} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      {change && <p className="text-xs text-gray-500">{change}</p>}
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}

function DifficultyBar({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{count}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: count > 0 ? '100%' : '0%' }} />
      </div>
    </div>
  )
}

