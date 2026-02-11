'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getTodayDate, resetDailyTrickCheck, getOrCreateDailyTrick } from '@/lib/daily-trick-manager'

export function AdminDailyTrick() {
  const [isSelecting, setIsSelecting] = useState(false)
  const [message, setMessage] = useState('')

  const selectDailyTrick = async () => {
    setIsSelecting(true)
    setMessage('')

    try {
      const supabase = createClient()
      const today = getTodayDate()

      // Check if daily trick already exists for today
      const { data: existing } = await supabase
        .from('daily_trick')
        .select('id')
        .eq('date', today)
        .maybeSingle()

      if (existing) {
        setMessage('ℹ️ Daily Trick already exists for today. Delete it first to create a new one.')
        return
      }

      // Use the client-side manager to create a new daily trick
      const tutorialId = await getOrCreateDailyTrick(supabase)

      if (tutorialId) {
        setMessage('✅ Daily Trick selected successfully!')
        // Reset the check flag so it can be fetched immediately
        resetDailyTrickCheck()
        // Reload the page to show the new trick
        window.location.reload()
      } else {
        setMessage('❌ Failed to select daily trick - no tutorials available')
      }
    } catch (error) {
      console.error('Error selecting daily trick:', error)
      setMessage('❌ Failed to select daily trick')
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5" />
        <h3 className="font-bold text-lg">Daily Trick Management</h3>
      </div>

      <p className="text-white/90 text-sm mb-4">
        Select a random tutorial to feature as today's Daily Trick. 
        This will be shown to all users on the home screen.
      </p>

      <button
        onClick={selectDailyTrick}
        disabled={isSelecting}
        className="w-full py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isSelecting ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            Selecting...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Pick Daily Trick Now
          </>
        )}
      </button>

      {message && (
        <div className={`mt-3 p-3 rounded-lg ${
          message.includes('✅') 
            ? 'bg-green-500/20 border border-green-300' 
            : message.includes('ℹ️')
            ? 'bg-blue-500/20 border border-blue-300'
            : 'bg-red-500/20 border border-red-300'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs text-white/70">
          💡 <strong>Tip:</strong> Daily tricks are now created automatically when users open the app each day. No server-side cron needed!
        </p>
      </div>
    </div>
  )
}

