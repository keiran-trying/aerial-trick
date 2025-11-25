import { createClient } from '@/lib/supabase/server'

/**
 * Check if the current authenticated user is an admin
 * This should ONLY be used on the server side (Server Components, Server Actions, API Routes)
 */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return false
  }
  
  // Check if user has admin privileges
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (error || !data) {
    return false
  }
  
  return data.is_admin === true
}

