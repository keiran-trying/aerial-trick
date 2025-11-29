'use client'

import { X } from 'lucide-react'
import { TutorialDetail } from './tutorial-detail'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

interface TutorialDetailModalProps {
  tutorial: Tutorial
  isOpen?: boolean
  onClose: () => void
}

export function TutorialDetailModal({ tutorial, isOpen = true, onClose }: TutorialDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-0">
          <div className="relative w-full h-screen bg-white modal-content">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Tutorial Detail Content */}
            <div className="h-full overflow-y-auto">
              <TutorialDetail tutorial={tutorial} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



