'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// This page redirects to home since tutorials are accessed via direct links
export default function TutorialsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.push('/')
  }, [router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  )
}

