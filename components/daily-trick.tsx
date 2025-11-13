'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sparkles } from 'lucide-react'
import { TutorialCard } from './tutorial-card'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

export function DailyTrick() {
  const [dailyTutorial, setDailyTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDailyTrick() {
      try {
        const today = new Date().toISOString().split('T')[0]
        
        // Check if daily trick exists for today
        const { data: dailyTrickData } = await supabase
          .from('daily_trick')
          .select('tutorial_id')
          .eq('date', today)
          .single()

        if (dailyTrickData) {
          // Fetch the tutorial
          const { data: tutorial } = await supabase
            .from('tutorials')
            .select('*')
            .eq('id', dailyTrickData.tutorial_id)
            .single()
          
          setDailyTutorial(tutorial)
        } else {
          // No daily trick set yet - could be set by cron job
          // For now, just show nothing
          setDailyTutorial(null)
        }
      } catch (error) {
        console.error('Error fetching daily trick:', error)
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

