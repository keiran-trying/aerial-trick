'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getTodayDate } from '@/lib/daily-trick-manager'
import { Sparkles } from 'lucide-react'
import { TutorialCard } from './tutorial-card'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

export function DailyTrick() {
  const [dailyTutorial, setDailyTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDailyTrick() {
      try {
        const today = getTodayDate()
        
        // Check if daily trick exists for today
        const { data: dailyTrickData, error: trickError } = await supabase
          .from('daily_trick')
          .select('tutorial_id')
          .eq('date', today)
          .maybeSingle()

        if (trickError) {
          console.error('[DailyTrick] Error fetching daily trick:', trickError)
          setDailyTutorial(null)
          return
        }

        if (!dailyTrickData) {
          console.log('[DailyTrick] No daily trick found for today')
          setDailyTutorial(null)
          return
        }

        // Fetch the tutorial
        const { data: tutorial, error: tutorialError } = await supabase
          .from('tutorials')
          .select('*')
          .eq('id', dailyTrickData.tutorial_id)
          .single()
        
        if (tutorialError) {
          console.error('[DailyTrick] Error fetching tutorial:', tutorialError)
          setDailyTutorial(null)
          return
        }
        
        if (tutorial) {
          // Filter out if it's in a future challenge
          const { filterFutureTutorials } = await import('@/lib/filter-future-tutorials')
          const filtered = await filterFutureTutorials([tutorial], supabase)
          
          if (filtered.length > 0) {
            setDailyTutorial(filtered[0])
          } else {
            setDailyTutorial(null)
          }
        } else {
          setDailyTutorial(null)
        }
      } catch (error) {
        console.error('[DailyTrick] Unexpected error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDailyTrick()
  }, [supabase])

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-white/30 rounded w-40 mb-4"></div>
          <div className="h-32 bg-white/30 rounded"></div>
        </div>
      </div>
    )
  }

  if (!dailyTutorial) {
    return (
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg text-white">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-bold">Daily Trick</h2>
        </div>
        <p className="text-sm opacity-90">Check back soon for today's featured trick!</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-3 shadow-lg">
      <div className="flex items-center gap-2 mb-2 text-white">
        <Sparkles className="w-4 h-4" />
        <h2 className="text-sm font-bold">Daily Trick</h2>
      </div>
      <TutorialCard tutorial={dailyTutorial} featured compact />
    </div>
  )
}

