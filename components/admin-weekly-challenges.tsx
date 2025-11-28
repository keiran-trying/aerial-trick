'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, X, Calendar, ToggleLeft, ToggleRight, Search } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

interface WeeklyChallenge {
  id: string
  title: string
  description: string | null
  tutorial_ids: string[]
  start_date: string
  end_date: string
  is_enabled: boolean
  challenge_type: 'weekly' | 'monthly'
  created_at: string
  updated_at: string
}

export function AdminWeeklyChallenges() {
  const [challenges, setChallenges] = useState<WeeklyChallenge[]>([])
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTutorialIds, setSelectedTutorialIds] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isEnabled, setIsEnabled] = useState(true)
  const [challengeType, setChallengeType] = useState<'weekly' | 'monthly'>('weekly')
  const [tutorialSearch, setTutorialSearch] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [challengesData, tutorialsData] = await Promise.all([
        supabase
          .from('weekly_challenges')
          .select('*')
          .order('start_date', { ascending: false }),
        supabase
          .from('tutorials')
          .select('*')
          .order('title', { ascending: true })
      ])

      setChallenges(challengesData.data || [])
      setTutorials(tutorialsData.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setSelectedTutorialIds([])
    setStartDate('')
    setEndDate('')
    setIsEnabled(true)
    setChallengeType('weekly')
    setTutorialSearch('')
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (challenge: WeeklyChallenge) => {
    setTitle(challenge.title)
    setDescription(challenge.description || '')
    setSelectedTutorialIds(challenge.tutorial_ids)
    setStartDate(challenge.start_date)
    setEndDate(challenge.end_date)
    setIsEnabled(challenge.is_enabled)
    setChallengeType(challenge.challenge_type)
    setEditingId(challenge.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return

    try {
      await supabase.from('weekly_challenges').delete().eq('id', id)
      setChallenges(challenges.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting challenge:', error)
      alert('Failed to delete challenge')
    }
  }

  const toggleEnabled = async (id: string, currentStatus: boolean) => {
    try {
      const { data, error } = await supabase
        .from('weekly_challenges')
        .update({ is_enabled: !currentStatus })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setChallenges(challenges.map(c => c.id === id ? data : c))
    } catch (error) {
      console.error('Error toggling challenge:', error)
      alert('Failed to toggle challenge')
    }
  }

  const handleToggleTutorial = (tutorialId: string) => {
    if (selectedTutorialIds.includes(tutorialId)) {
      setSelectedTutorialIds(selectedTutorialIds.filter(id => id !== tutorialId))
    } else {
      setSelectedTutorialIds([...selectedTutorialIds, tutorialId])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    if (selectedTutorialIds.length === 0) {
      alert('Please select at least one tutorial')
      return
    }

    if (!startDate || !endDate) {
      alert('Please set start and end dates')
      return
    }

    setIsSubmitting(true)
    try {
      const challengeData = {
        title,
        description: description || null,
        tutorial_ids: selectedTutorialIds,
        start_date: startDate,
        end_date: endDate,
        is_enabled: isEnabled,
        challenge_type: challengeType,
      }

      if (editingId) {
        // Update existing challenge
        const { data, error } = await supabase
          .from('weekly_challenges')
          .update(challengeData)
          .eq('id', editingId)
          .select()
          .single()

        if (error) throw error

        setChallenges(challenges.map(c => c.id === editingId ? data : c))
      } else {
        // Create new challenge
        const { data, error } = await supabase
          .from('weekly_challenges')
          .insert(challengeData)
          .select()
          .single()

        if (error) throw error

        setChallenges([data, ...challenges])
      }

      resetForm()
      alert(editingId ? 'Challenge updated successfully!' : 'Challenge created successfully!')
    } catch (error) {
      console.error('Error saving challenge:', error)
      alert('Failed to save challenge')
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
      {/* Add New Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Challenge
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {editingId ? 'Edit Challenge' : 'New Challenge'}
            </h2>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                placeholder="E.g., Master Your Inversions - Week 1"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-24 resize-none text-gray-900"
                placeholder="Describe the challenge..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Challenge Type *
                </label>
                <select
                  value={challengeType}
                  onChange={(e) => setChallengeType(e.target.value as 'weekly' | 'monthly')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-bold text-gray-900">Enabled</span>
                  <button
                    type="button"
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isEnabled ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Select Tutorials * ({selectedTutorialIds.length} selected)
              </label>
              
              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={tutorialSearch}
                  onChange={(e) => setTutorialSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 text-sm"
                />
                {tutorialSearch && (
                  <button
                    type="button"
                    onClick={() => setTutorialSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Tutorial List */}
              <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-2 space-y-2">
                {tutorials
                  .filter((tutorial) => {
                    if (!tutorialSearch.trim()) return true
                    const search = tutorialSearch.toLowerCase()
                    return (
                      tutorial.title.toLowerCase().includes(search) ||
                      tutorial.difficulty.toLowerCase().includes(search) ||
                      tutorial.description?.toLowerCase().includes(search)
                    )
                  })
                  .map((tutorial) => (
                    <label
                      key={tutorial.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTutorialIds.includes(tutorial.id)
                          ? 'bg-purple-50 border border-purple-300'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTutorialIds.includes(tutorial.id)}
                        onChange={() => handleToggleTutorial(tutorial.id)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{tutorial.title}</p>
                        <p className="text-sm text-gray-700 capitalize font-medium">{tutorial.difficulty}</p>
                      </div>
                    </label>
                  ))}
                {tutorials.filter((tutorial) => {
                  if (!tutorialSearch.trim()) return false
                  const search = tutorialSearch.toLowerCase()
                  return !(
                    tutorial.title.toLowerCase().includes(search) ||
                    tutorial.difficulty.toLowerCase().includes(search) ||
                    tutorial.description?.toLowerCase().includes(search)
                  )
                }).length === tutorials.length && tutorialSearch && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No tutorials found matching "{tutorialSearch}"</p>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-600 mt-2">
                Showing {tutorials.filter((tutorial) => {
                  if (!tutorialSearch.trim()) return true
                  const search = tutorialSearch.toLowerCase()
                  return (
                    tutorial.title.toLowerCase().includes(search) ||
                    tutorial.difficulty.toLowerCase().includes(search) ||
                    tutorial.description?.toLowerCase().includes(search)
                  )
                }).length} of {tutorials.length} tutorials
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : editingId ? 'Update Challenge' : 'Create Challenge'}
            </button>
          </form>
        </div>
      )}

      {/* Challenges List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">All Challenges ({challenges.length})</h3>
        {challenges.map((challenge) => {
          const now = new Date()
          const startDate = new Date(challenge.start_date)
          const endDate = new Date(challenge.end_date)
          const isActive = now >= startDate && now <= endDate && challenge.is_enabled
          const isPast = now > endDate
          const isFuture = now < startDate

          return (
            <div key={challenge.id} className="bg-white rounded-xl p-4 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                    {isActive && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                    {isPast && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        Past
                      </span>
                    )}
                    {isFuture && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        Upcoming
                      </span>
                    )}
                  </div>
                  {challenge.description && (
                    <p className="text-sm text-gray-700 mb-2 font-medium">{challenge.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-gray-700 font-medium">
                    <span className="capitalize">{challenge.challenge_type}</span>
                    <span>•</span>
                    <span>{challenge.tutorial_ids.length} tutorials</span>
                    <span>•</span>
                    <span>{challenge.start_date} to {challenge.end_date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleEnabled(challenge.id, challenge.is_enabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    challenge.is_enabled
                      ? 'text-green-600 hover:bg-green-50'
                      : 'text-gray-400 hover:bg-gray-100'
                  }`}
                  title={challenge.is_enabled ? 'Enabled' : 'Disabled'}
                >
                  {challenge.is_enabled ? (
                    <ToggleRight className="w-5 h-5" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={() => handleEdit(challenge)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(challenge.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}

        {challenges.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No challenges yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  )
}

