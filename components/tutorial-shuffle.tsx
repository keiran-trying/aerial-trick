'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shuffle, X } from 'lucide-react'
import { TutorialDetailModal } from './tutorial-detail-modal'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

export function TutorialShuffle() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showTutorialModal, setShowTutorialModal] = useState(false)
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null)
  const [finalTutorial, setFinalTutorial] = useState<Tutorial | null>(null)
  const shuffleIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTutorials() {
      const { data } = await supabase
        .from('tutorials')
        .select('*')
      
      // Filter out tutorials from future challenges (unless user is admin)
      const { filterFutureTutorials } = await import('@/lib/filter-future-tutorials')
      const filteredData = await filterFutureTutorials(data, supabase)
      
      setTutorials(filteredData)
    }
    fetchTutorials()
  }, [supabase])

  // Clean up intervals on unmount
  useEffect(() => {
    return () => {
      if (shuffleIntervalRef.current) {
        clearInterval(shuffleIntervalRef.current)
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleShuffle = () => {
    if (tutorials.length === 0) return
    
    // Clear any existing intervals
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setShowModal(true)
    setIsShuffling(true)
    setFinalTutorial(null)
    
    // Pick the final tutorial
    const randomIndex = Math.floor(Math.random() * tutorials.length)
    const finalTut = tutorials[randomIndex]
    
    let count = 0
    const totalCycles = 25 // Total number of changes
    const baseSpeed = 80 // milliseconds per change
    
    const runCycle = () => {
      if (count >= totalCycles) {
        // Animation complete
        setCurrentTutorial(finalTut)
        setFinalTutorial(finalTut)
        setIsShuffling(false)
        return
      }
      
      // Get a random tutorial for this cycle
      const randomIdx = Math.floor(Math.random() * tutorials.length)
      setCurrentTutorial(tutorials[randomIdx])
      
      count++
      
      // Calculate speed - slow down as we approach the end
      let delay = baseSpeed
      if (count > 15) {
        // Gradually slow down in the last 10 cycles
        delay = baseSpeed + ((count - 15) * 50)
      }
      
      // Schedule next cycle
      timeoutRef.current = setTimeout(runCycle, delay)
    }
    
    // Start the animation
    runCycle()
  }

  const handleGoToTutorial = () => {
    if (finalTutorial) {
      setShowModal(false)
      setShowTutorialModal(true)
    }
  }

  const handleClose = () => {
    // Clear any running animations
    if (shuffleIntervalRef.current) {
      clearInterval(shuffleIntervalRef.current)
      shuffleIntervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    // Reset state
    setShowModal(false)
    setIsShuffling(false)
    setCurrentTutorial(null)
    setFinalTutorial(null)
  }

  if (tutorials.length === 0) return null

  return (
    <>
      {/* Shuffle Card - Modern & Delicate */}
      <button
        onClick={handleShuffle}
        className="relative w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-[1.02] active:scale-[0.98] group"
      >
        <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-6">
          <div className="flex items-center gap-4 text-white">
            <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:rotate-12 transition-all duration-500 ease-out flex-shrink-0">
              <Shuffle className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 ease-out"></div>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-xl font-bold mb-1 group-hover:translate-x-1 transition-transform duration-300">Can't Decide?</h3>
              <p className="text-sm text-white/90 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                Let us pick a random tutorial for you!
              </p>
            </div>
          </div>
          
          {/* Modern sparkle animations */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
            <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
          </div>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </button>

      {/* Shuffle Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            // Close if clicking the backdrop
            if (e.target === e.currentTarget) {
              handleClose()
            }
          }}
        >
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={handleClose}
                className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Shuffling Animation */}
            <div className="relative">
              {currentTutorial && (
                <div className={`relative aspect-[4/3] ${isShuffling ? 'animate-pulse' : ''}`}>
                  {currentTutorial.thumbnail_url ? (
                    <img
                      src={currentTutorial.thumbnail_url}
                      alt={currentTutorial.title}
                      className={`w-full h-full object-cover ${isShuffling ? 'blur-sm' : ''} transition-all duration-200`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                      <span className="text-6xl">🧘‍♀️</span>
                    </div>
                  )}
                  
                  {/* Modern Shuffling Overlay */}
                  {isShuffling && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                      <div className="relative">
                        {/* Outer ring */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-ping opacity-75"></div>
                        {/* Main icon */}
                        <div className="relative bg-white/95 backdrop-blur-md rounded-full p-6 shadow-2xl animate-spin" style={{ animationDuration: '2s' }}>
                          <Shuffle className="w-10 h-10 text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tutorial Info */}
            <div className="p-6">
              {isShuffling ? (
                <div className="text-center">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 font-medium">
                    🎲 Shuffling...
                  </p>
                </div>
              ) : finalTutorial ? (
                <div className="text-center animate-in fade-in zoom-in duration-500">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {finalTutorial.title}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      {finalTutorial.difficulty.toUpperCase()}
                    </span>
                    {finalTutorial.difficulty_stars && (
                      <span className="text-lg">
                        {'⭐️'.repeat(finalTutorial.difficulty_stars)}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleGoToTutorial}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Let's Try This! 🚀
                  </button>
                  
                  <button
                    onClick={handleShuffle}
                    className="w-full mt-3 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    <Shuffle className="w-4 h-4 inline mr-2" />
                    Shuffle Again
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Detail Modal */}
      {finalTutorial && (
        <TutorialDetailModal 
          tutorial={finalTutorial}
          isOpen={showTutorialModal}
          onClose={() => setShowTutorialModal(false)}
        />
      )}
    </>
  )
}

