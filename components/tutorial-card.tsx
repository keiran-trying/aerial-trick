'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, Clock, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn, difficultyColors, formatDuration } from '@/lib/utils'
import { TutorialDetailModal } from './tutorial-detail-modal'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

interface TutorialCardProps {
  tutorial: Tutorial
  featured?: boolean
  isFavorite?: boolean
  compact?: boolean
}

export function TutorialCard({ tutorial, featured = false, isFavorite: initialFavorite = false, compact = false }: TutorialCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)
  const [isToggling, setIsToggling] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const supabase = createClient()

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Stop event from triggering parent button
    if (isToggling) return

    setIsToggling(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        // Redirect to login
        window.location.href = '/auth/login'
        return
      }

      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tutorial_id', tutorial.id)
        setIsFavorite(false)
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, tutorial_id: tutorial.id })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsToggling(false)
    }
  }

  if (compact) {
    return (
      <>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full text-left"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
          {/* Compact Thumbnail - Landscape */}
          <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-amber-200">
            {tutorial.thumbnail_url ? (
              <Image
                src={tutorial.thumbnail_url}
                alt={tutorial.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 224px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-3xl">🧘‍♀️</span>
              </div>
            )}
            
            {/* Difficulty Badge - Smaller */}
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <span className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md uppercase',
                difficultyColors[tutorial.difficulty]
              )}>
                {tutorial.difficulty[0]}
              </span>
              {tutorial.difficulty_stars && tutorial.difficulty_stars > 0 && (
                <span className="px-1.5 py-0.5 bg-white/90 backdrop-blur rounded-full text-[9px] shadow-md">
                  {'⭐️'.repeat(tutorial.difficulty_stars)}
                </span>
              )}
            </div>

            {/* Favorite Button - Smaller */}
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
              disabled={isToggling}
            >
              <Heart
                className={cn(
                  'w-3.5 h-3.5 transition-all',
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
                )}
              />
            </button>

            {/* Duration Badge */}
            {tutorial.duration_minutes && (
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-white text-[10px] font-semibold">
                {formatDuration(tutorial.duration_minutes)}
              </div>
            )}
          </div>

          {/* Compact Content */}
          <div className="p-3 bg-white">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
              {tutorial.title}
            </h3>
          </div>
        </div>
        </button>
        <TutorialDetailModal 
          tutorial={tutorial}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    )
  }

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full text-left"
      >
      <div className={cn(
        'relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]',
        featured ? 'bg-white/95 backdrop-blur' : 'bg-white'
      )}>
        {/* Thumbnail - Vertical/Portrait */}
        <div className="relative aspect-[9/16] bg-gradient-to-br from-gray-200 to-gray-300">
          {tutorial.thumbnail_url ? (
            <Image
              src={tutorial.thumbnail_url}
              alt={tutorial.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <span className="text-6xl">🧘‍♀️</span>
            </div>
          )}
          
          {/* Difficulty Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md',
              difficultyColors[tutorial.difficulty]
            )}>
              {tutorial.difficulty.toUpperCase()}
            </span>
            {tutorial.difficulty_stars && tutorial.difficulty_stars > 0 && (
              <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-full text-xs shadow-md">
                {'⭐️'.repeat(tutorial.difficulty_stars)}
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-md hover:bg-white transition-colors"
            disabled={isToggling}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-all',
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {tutorial.title}
          </h3>
          
          {tutorial.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {tutorial.description}
            </p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              {tutorial.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(tutorial.duration_minutes)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>Comments</span>
              </div>
            </div>
            
            {tutorial.collection && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {tutorial.collection}
              </span>
            )}
          </div>
        </div>
      </div>
      </button>
      <TutorialDetailModal 
        tutorial={tutorial}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}

