import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function formatDate(date: string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const difficultyColors = {
  easy: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-orange-500',
  drop: 'bg-red-500',
}

export const difficultyPoints = {
  easy: 10,
  intermediate: 20,
  advanced: 30,
  drop: 50,
}

export function calculatePoints(difficulty: string, durationMinutes: number): number {
  const basePoints = difficultyPoints[difficulty as keyof typeof difficultyPoints] || 10
  const durationBonus = Math.floor(durationMinutes / 10) * 5
  return basePoints + durationBonus
}

