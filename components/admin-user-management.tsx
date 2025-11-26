'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Shield, ShieldOff, User, Crown } from 'lucide-react'

type UserWithStats = {
  id: string
  email: string
  name: string | null
  is_admin: boolean
  join_date: string
  total_points?: number
  videos_completed?: number
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Fetch all users with their progress stats
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, name, is_admin, join_date')
        .order('join_date', { ascending: false })

      if (usersError) throw usersError

      // Fetch progress for each user
      const usersWithStats = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: progressData } = await supabase
            .from('progress')
            .select('total_points, videos_completed')
            .eq('user_id', user.id)
            .single()

          return {
            ...user,
            total_points: progressData?.total_points || 0,
            videos_completed: progressData?.videos_completed || 0,
          }
        })
      )

      setUsers(usersWithStats)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId)
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentStatus }
          : user
      ))

      alert(`User ${!currentStatus ? 'promoted to' : 'removed from'} admin successfully!`)
    } catch (error) {
      console.error('Error updating admin status:', error)
      alert('Failed to update admin status. Make sure you have permission.')
    } finally {
      setUpdating(null)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-8 h-8" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <p className="text-sm opacity-90">
          Manage admin privileges for all users
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          <div className="text-sm text-gray-600">Total Users</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-2xl font-bold text-purple-600">
            {users.filter(u => u.is_admin).length}
          </div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">
          {filteredUsers.length} User{filteredUsers.length !== 1 ? 's' : ''}
        </h2>

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {user.is_admin ? (
                    <Shield className="w-5 h-5 text-purple-600" />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                  <h3 className="font-semibold text-gray-900">
                    {user.name || 'No name'}
                  </h3>
                  {user.is_admin && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>📊 {user.videos_completed || 0} videos</span>
                  <span>⭐ {user.total_points || 0} points</span>
                  <span>📅 {new Date(user.join_date).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                disabled={updating === user.id}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2 ${
                  user.is_admin
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {updating === user.id ? (
                  '...'
                ) : user.is_admin ? (
                  <>
                    <ShieldOff className="w-4 h-4" />
                    Remove Admin
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Make Admin
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}

