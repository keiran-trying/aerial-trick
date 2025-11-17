'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shuffle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

export function TutorialShuffle() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [isShuffling, setIsShuffling] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null)
  const [finalTutorial, setFinalTutorial] = useState<Tutorial | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchTutorials() {
      const { data } = await supabase
        .from('tutorials')
        .select('*')
      
      if (data) {
        setTutorials(data)
      }
    }
    fetchTutorials()
  }, [supabase])

  const handleShuffle = () => {
    if (tutorials.length === 0) return
    
    setShowModal(true)
    setIsShuffling(true)
    setFinalTutorial(null)
    
    // Pick the final tutorial
    const randomIndex = Math.floor(Math.random() * tutorials.length)
    const finalTut = tutorials[randomIndex]
    
    let count = 0
    const totalCycles = 30 // Total number of changes
    let speed = 50 // Start fast
    
    const shuffleInterval = setInterval(() => {
      // Get a random tutorial
      const randomIdx = Math.floor(Math.random() * tutorials.length)
      setCurrentTutorial(tutorials[randomIdx])
      
      count++
      
      // Slow down near the end
      if (count > 20) {
        speed += 30
        clearInterval(shuffleInterval)
        setTimeout(() => handleShuffle(), speed)
      }
      
      // Stop at the final tutorial
      if (count >= totalCycles) {
        clearInterval(shuffleInterval)
        setCurrentTutorial(finalTut)
        setFinalTutorial(finalTut)
        setIsShuffling(false)
      }
    }, speed)
  }

  const handleGoToTutorial = () => {
    if (finalTutorial) {
      router.push(`/tutorial/${finalTutorial.id}`)
    }
  }

  const handleClose = () => {
    setShowModal(false)
    setCurrentTutorial(null)
    setFinalTutorial(null)
  }

  if (tutorials.length === 0) return null

  return (
    <>
      {/* Shuffle Card */}
      <button
        onClick={handleShuffle}
        className="relative w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group"
      >
        <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 group-hover:scale-110 transition-transform">
              <Shuffle className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Can't Decide?</h3>
            <p className="text-sm text-white/90 text-center">
              Let us pick a random tutorial for you!
            </p>
          </div>
          
          {/* Sparkle animation */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </button>

      {/* Shuffle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
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
                  
                  {/* Shuffling Overlay */}
                  {isShuffling && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 animate-spin">
                        <Shuffle className="w-10 h-10 text-purple-600" />
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
    </>
  )
}

