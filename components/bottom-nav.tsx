'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, TrendingUp, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/collections', label: 'Collections', icon: FolderOpen },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full transition-colors',
                  isActive
                    ? 'text-purple-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className={cn('w-6 h-6', isActive && 'fill-purple-600')} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

