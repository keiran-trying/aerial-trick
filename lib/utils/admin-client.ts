import { createClient } from '@/lib/supabase/client'

/**
 * Check if the current authenticated user is an admin (client-side version)
 * This should ONLY be used on the client side
 */
export async function isAdminClient(): Promise<boolean> {
  const supabase = createClient()
  
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

