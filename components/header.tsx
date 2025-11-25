'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Settings } from 'lucide-react'
import { isAdminClient } from '@/lib/utils/admin-client'

interface HeaderProps {
  title?: string
  showProfile?: boolean
  showSettings?: boolean
}

export function Header({ title = 'Aerial Tricks', showProfile = true, showSettings = false }: HeaderProps) {
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (showSettings) {
        // Only check admin status if showSettings is true
        const adminStatus = await isAdminClient()
        setIsUserAdmin(adminStatus)
      }
      setIsChecking(false)
    }
    
    checkAdminStatus()
  }, [showSettings])

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200" style={{ paddingTop: 'max(44px, env(safe-area-inset-top))' }}>
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
          {title}
        </Link>
        <div className="flex items-center gap-3">
          {/* Only show settings icon if user is actually an admin */}
          {showSettings && isUserAdmin && !isChecking && (
            <Link
              href="/admin"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          )}
          {showProfile && (
            <Link
              href="/profile"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

