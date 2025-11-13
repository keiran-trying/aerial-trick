'use client'

import Link from 'next/link'
import { User, Settings } from 'lucide-react'

interface HeaderProps {
  title?: string
  showProfile?: boolean
  showSettings?: boolean
}

export function Header({ title = 'Aerial Trick', showProfile = true, showSettings = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
          {title}
        </Link>
        <div className="flex items-center gap-3">
          {showSettings && (
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

