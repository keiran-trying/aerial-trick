'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TutorialCard } from './tutorial-card'
import { AIRecommendations } from './ai-recommendations'
import { TutorialShuffle } from './tutorial-shuffle'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']
type DifficultyLevel = Database['public']['Tables']['tutorials']['Row']['difficulty']

const tabs: { label: string; value: DifficultyLevel | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Easy', value: 'easy' },
  { label: 'Med', value: 'intermediate' },
  { label: 'Pro', value: 'advanced' },
  { label: 'Drop', value: 'drop' },
]

export function TutorialTabs() {
  const [activeTab, setActiveTab] = useState<DifficultyLevel | 'all'>('easy')
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Load user's preferred skill level from onboarding
  useEffect(() => {
    async function loadUserPreferences() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('skill_level')
          .eq('user_id', user.id)
          .single()
        
        if (preferences?.skill_level) {
          setActiveTab(preferences.skill_level as DifficultyLevel)
        }
      }
    }
    loadUserPreferences()
  }, [supabase])

  useEffect(() => {
    async function fetchTutorials() {
      setLoading(true)
      try {
        let query = supabase
          .from('tutorials')
          .select('*')
          
        // Only filter by difficulty if not "all"
        if (activeTab !== 'all') {
          query = query.eq('difficulty', activeTab)
        }
        
        const { data } = await query.order('created_at', { ascending: false })

        // Filter out tutorials from future challenges (unless user is admin)
        const { filterFutureTutorials } = await import('@/lib/filter-future-tutorials')
        const filteredData = await filterFutureTutorials(data, supabase)
        
        setTutorials(filteredData)

        // Fetch user's favorites
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: favData } = await supabase
            .from('favorites')
            .select('tutorial_id')
            .eq('user_id', user.id)
          
          setFavorites(favData?.map(f => f.tutorial_id) || [])
        }
      } catch (error) {
        console.error('Error fetching tutorials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [activeTab, supabase])

  const favoriteTutorials = tutorials.filter(t => favorites.includes(t.id))
  const otherTutorials = tutorials.filter(t => !favorites.includes(t.id))
  
  // Group tutorials by difficulty stars (for specific difficulty tabs)
  const oneStarTutorials = otherTutorials.filter(t => (t.difficulty_stars || 1) === 1)
  const twoStarTutorials = otherTutorials.filter(t => (t.difficulty_stars || 1) === 2)
  
  // Group by difficulty level (for "All" tab)
  const easyTutorials = otherTutorials.filter(t => t.difficulty === 'easy')
  const intermediateTutorials = otherTutorials.filter(t => t.difficulty === 'intermediate')
  const advancedTutorials = otherTutorials.filter(t => t.difficulty === 'advanced')
  const dropTutorials = otherTutorials.filter(t => t.difficulty === 'drop')

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 justify-between">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'flex-1 px-2 py-2 rounded-full font-medium text-xs transition-all',
              activeTab === tab.value
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Favorites Section */}
          {favoriteTutorials.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-gray-700 mb-2 px-1 uppercase tracking-wide">
                ⭐ Your Favorites
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {favoriteTutorials.map((tutorial) => (
                  <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite compact />
                ))}
              </div>
            </div>
          )}

          {/* Show by difficulty level if "All" tab is active */}
          {activeTab === 'all' ? (
            <>
              {easyTutorials.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 px-1">Easy</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {easyTutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite={false} compact />
                    ))}
                  </div>
                </div>
              )}
              
              {/* AI Recommendations */}
              <AIRecommendations />
              
              {intermediateTutorials.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 px-1">Intermediate</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {intermediateTutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite={false} compact />
                    ))}
                  </div>
                </div>
              )}
              {advancedTutorials.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 px-1">Advanced</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {advancedTutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite={false} compact />
                    ))}
                  </div>
                </div>
              )}
              {dropTutorials.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 px-1">Drop</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {dropTutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite={false} compact />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Show by star rating for specific difficulty tabs */}
              {oneStarTutorials.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 px-1 flex items-center gap-2">
                    <span>{tabs.find(t => t.value === activeTab)?.label} ⭐</span>
                    <span className="text-xs font-normal text-gray-600">(Easier)</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {oneStarTutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite={false} compact />
                    ))}
                  </div>
                </div>
              )}
              
              {/* AI Recommendations between easier and harder tutorials */}
              <AIRecommendations />
              
              {twoStarTutorials.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 px-1 flex items-center gap-2">
                    <span>{tabs.find(t => t.value === activeTab)?.label} ⭐⭐</span>
                    <span className="text-xs font-normal text-gray-600">(Harder)</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {twoStarTutorials.map((tutorial) => (
                      <TutorialCard key={tutorial.id} tutorial={tutorial} isFavorite={false} compact />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!favoriteTutorials.length && otherTutorials.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No tutorials available yet.</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

