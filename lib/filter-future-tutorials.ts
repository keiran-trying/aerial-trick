import { createClient } from '@/lib/supabase/client'
import { isAdminClient } from '@/lib/utils/admin-client'
import type { Database } from '@/lib/types/database.types'

type Tutorial = Database['public']['Tables']['tutorials']['Row']

/**
 * Filters out tutorials that belong to future (not-yet-started) challenges
 * Admins can see all tutorials for preview purposes
 */
export async function filterFutureTutorials(
  tutorials: Tutorial[] | null,
  supabase?: ReturnType<typeof createClient>
): Promise<Tutorial[]> {
  // Return empty array if no tutorials
  if (!tutorials || tutorials.length === 0) {
    return []
  }

  // Check if user is admin - admins can see all tutorials
  const userIsAdmin = await isAdminClient()
  if (userIsAdmin) {
    return tutorials
  }

  // Get or create supabase client
  const client = supabase || createClient()

  try {
    // Get today's date (YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0]

    // Fetch all future challenges (start_date > today)
    const { data: futureChallenges, error } = await client
      .from('weekly_challenges')
      .select('tutorial_ids')
      .gt('start_date', today)

    if (error) {
      console.error('Error fetching future challenges:', error)
      // If error, return all tutorials to avoid hiding content due to error
      return tutorials
    }

    // If no future challenges, return all tutorials
    if (!futureChallenges || futureChallenges.length === 0) {
      return tutorials
    }

    // Collect all tutorial IDs from future challenges into a Set for fast lookup
    const futureTutorialIds = new Set<string>()
    futureChallenges.forEach((challenge) => {
      if (challenge.tutorial_ids && Array.isArray(challenge.tutorial_ids)) {
        challenge.tutorial_ids.forEach((id) => futureTutorialIds.add(id))
      }
    })

    // If no tutorial IDs in future challenges, return all tutorials
    if (futureTutorialIds.size === 0) {
      return tutorials
    }

    // Filter out tutorials that are in future challenges
    const filteredTutorials = tutorials.filter(
      (tutorial) => !futureTutorialIds.has(tutorial.id)
    )

    return filteredTutorials
  } catch (error) {
    console.error('Error in filterFutureTutorials:', error)
    // If error, return all tutorials to avoid hiding content due to error
    return tutorials
  }
}

