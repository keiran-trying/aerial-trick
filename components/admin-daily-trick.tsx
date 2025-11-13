'use client'

import { useState } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'

export function AdminDailyTrick() {
  const [isSelecting, setIsSelecting] = useState(false)
  const [message, setMessage] = useState('')

  const selectDailyTrick = async () => {
    setIsSelecting(true)
    setMessage('')

    try {
      const response = await fetch('/api/daily-trick', {
        method: 'POST',
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✅ Daily Trick selected successfully!')
      } else {
        setMessage(`❌ Error: ${data.error || 'Failed to select daily trick'}`)
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
            : 'bg-red-500/20 border border-red-300'
        }`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-xs text-white/70">
          💡 <strong>Tip:</strong> In production on Vercel, this happens automatically every day at midnight UTC.
        </p>
      </div>
    </div>
  )
}

