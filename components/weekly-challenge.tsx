'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Calendar, Trophy, ChevronRight } from 'lucide-react'
import { TutorialDetailModal } from './tutorial-detail-modal'
import { difficultyColors } from '@/lib/utils'
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
}

export function WeeklyChallenge() {
  const [challenge, setChallenge] = useState<WeeklyChallenge | null>(null)
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchCurrentChallenge()
  }, [])

  const fetchCurrentChallenge = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]

      // Fetch active challenge
      const { data: challengeData } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('is_enabled', true)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('start_date', { ascending: false })
        .limit(1)
        .single()

      if (challengeData) {
        setChallenge(challengeData)

        // Fetch tutorials for this challenge
        const { data: tutorialsData } = await supabase
          .from('tutorials')
          .select('*')
          .in('id', challengeData.tutorial_ids)

        setTutorials(tutorialsData || [])
      }
    } catch (error) {
      console.error('Error fetching challenge:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-white/30 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-white/20 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  // Don't render anything if no active challenge
  if (!challenge || tutorials.length === 0) {
    return null
  }

  const daysRemaining = Math.ceil(
    (new Date(challenge.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <>
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            <h2 className="text-xl font-bold">
              {challenge.challenge_type === 'weekly' ? 'Weekly Challenge' : 'Monthly Challenge'}
            </h2>
          </div>
          <div className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4" />
            <span>{daysRemaining}d left</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-2">{challenge.title}</h3>
        {challenge.description && (
          <p className="text-white/90 mb-4">{challenge.description}</p>
        )}

        <div className="space-y-2">
          {tutorials.map((tutorial) => (
            <button
              key={tutorial.id}
              onClick={() => setSelectedTutorial(tutorial)}
              className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all group"
            >
              <div className="flex items-center gap-3">
                {tutorial.thumbnail_url ? (
                  <img
                    src={tutorial.thumbnail_url}
                    alt={tutorial.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🤸‍♀️</span>
                  </div>
                )}
                
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-semibold text-white mb-1 truncate">{tutorial.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/20 capitalize">
                      {tutorial.difficulty}
                    </span>
                    {tutorial.duration_minutes && (
                      <span className="text-xs text-white/80">
                        {tutorial.duration_minutes} min
                      </span>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/80">Progress</span>
            <span className="font-semibold">0 / {tutorials.length} completed</span>
          </div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {selectedTutorial && (
        <TutorialDetailModal
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
        />
      )}
    </>
  )
}

