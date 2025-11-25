// Pagination helper for loading tutorials efficiently

export const TUTORIALS_PER_PAGE = 20 // Load 20 at a time

/**
 * Fetch tutorials with pagination
 * @param supabase - Supabase client
 * @param page - Page number (0-indexed)
 * @param difficulty - Filter by difficulty (optional)
 * @returns Tutorials for the requested page
 */
export async function fetchTutorialsPaginated(
  supabase: any,
  page: number = 0,
  difficulty?: string
) {
  try {
    const from = page * TUTORIALS_PER_PAGE
    const to = from + TUTORIALS_PER_PAGE - 1

    let query = supabase
      .from('tutorials')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (difficulty && difficulty !== 'all') {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching tutorials:', error)
      return { tutorials: [], total: 0, hasMore: false }
    }

    const hasMore = count ? (page + 1) * TUTORIALS_PER_PAGE < count : false

    return {
      tutorials: data || [],
      total: count || 0,
      hasMore,
      currentPage: page,
    }
  } catch (error) {
    console.error('Pagination error:', error)
    return { tutorials: [], total: 0, hasMore: false, currentPage: page }
  }
}

/**
 * Cache key generator for tutorials
 */
export function getTutorialsCacheKey(difficulty?: string, page?: number): string {
  return `tutorials_${difficulty || 'all'}_page_${page || 0}`
}

/**
 * Cache tutorials in localStorage
 * @param key - Cache key
 * @param data - Data to cache
 * @param ttl - Time to live in milliseconds (default: 5 minutes)
 */
export function cacheTutorials(key: string, data: any, ttl: number = 5 * 60 * 1000) {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    }
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Cache write error:', error)
    // Silently fail if localStorage is full
  }
}

/**
 * Get cached tutorials from localStorage
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export function getCachedTutorials(key: string): any | null {
  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp, ttl } = JSON.parse(cached)
    const now = Date.now()

    // Check if cache is still valid
    if (now - timestamp > ttl) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch (error) {
    console.error('Cache read error:', error)
    return null
  }
}

/**
 * Clear all tutorial caches
 */
export function clearTutorialCache() {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('tutorials_')) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Cache clear error:', error)
  }
}

/**
 * Preload next page of tutorials in the background
 * @param supabase - Supabase client
 * @param currentPage - Current page number
 * @param difficulty - Current difficulty filter
 */
export async function preloadNextPage(
  supabase: any,
  currentPage: number,
  difficulty?: string
) {
  const nextPage = currentPage + 1
  const cacheKey = getTutorialsCacheKey(difficulty, nextPage)

  // Check if already cached
  if (getCachedTutorials(cacheKey)) {
    return // Already cached
  }

  // Fetch and cache in background
  const result = await fetchTutorialsPaginated(supabase, nextPage, difficulty)
  cacheTutorials(cacheKey, result)
}

