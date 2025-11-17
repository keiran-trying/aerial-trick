'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TutorialCard } from './tutorial-card'
import { cn } from '@/lib/utils'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']
type DifficultyLevel = Database['public']['Tables']['tutorials']['Row']['difficulty']

const tabs: { label: string; value: DifficultyLevel }[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
  { label: 'Drop', value: 'drop' },
]

export function TutorialTabs() {
  const [activeTab, setActiveTab] = useState<DifficultyLevel>('easy')
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTutorials() {
      setLoading(true)
      try {
        const { data } = await supabase
          .from('tutorials')
          .select('*')
          .eq('difficulty', activeTab)
          .order('created_at', { ascending: false })

        setTutorials(data || [])

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
  
  // Group tutorials by difficulty stars
  const oneStarTutorials = otherTutorials.filter(t => (t.difficulty_stars || 1) === 1)
  const twoStarTutorials = otherTutorials.filter(t => (t.difficulty_stars || 1) === 2)

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all',
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

          {/* One Star Tutorials - Easier */}
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

          {/* Two Star Tutorials - Harder */}
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

          {/* Empty State */}
          {!favoriteTutorials.length && !oneStarTutorials.length && !twoStarTutorials.length && (
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

