'use client'

import { BottomNav } from './bottom-nav'
import { Header } from './header'

interface LayoutWrapperProps {
  children: React.ReactNode
  title?: string
  showProfile?: boolean
  showSettings?: boolean
}

export function LayoutWrapper({ 
  children, 
  title, 
  showProfile = true,
  showSettings = false 
}: LayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} showProfile={showProfile} showSettings={showSettings} />
      <main className="max-w-md mx-auto pb-20 min-h-[calc(100vh-8rem)]">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

