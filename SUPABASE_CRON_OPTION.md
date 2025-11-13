# ⚡ Option 2: Use Supabase Edge Functions for Daily Trick

**This option is 100% free and doesn't require Vercel!**

## Step 1: Create Edge Function

1. Go to your Supabase Dashboard
2. Click **Edge Functions** in the sidebar
3. Click **Create a new function**
4. Name it: `daily-trick-cron`
5. Paste this code:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    const today = new Date().toISOString().split('T')[0]

    // Check if daily trick already exists for today
    const { data: existing } = await supabase
      .from('daily_trick')
      .select('id')
      .eq('date', today)
      .single()

    if (existing) {
      return new Response(
        JSON.stringify({ message: 'Daily trick already selected for today' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get random tutorial
    const { data: tutorials, error: tutorialsError } = await supabase
      .from('tutorials')
      .select('id')
    
    if (tutorialsError || !tutorials || tutorials.length === 0) {
      throw new Error('No tutorials found')
    }

    const randomTutorial = tutorials[Math.floor(Math.random() * tutorials.length)]

    // Insert new daily trick
    const { error: insertError } = await supabase
      .from('daily_trick')
      .insert({
        tutorial_id: randomTutorial.id,
        date: today
      })

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Daily trick set for ${today}`,
        tutorial_id: randomTutorial.id 
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

6. Click **Deploy**

## Step 2: Set Up Cron

1. In the Edge Functions page, click on your `daily-trick-cron` function
2. Click the **Cron** tab
3. Click **Create a cron job**
4. Set schedule: `0 0 * * *` (midnight daily)
5. Click **Create**

## Done! 🎉

Your Daily Trick will now automatically update every day at midnight, completely for free using Supabase!

## Test It Manually

To test, go to your Edge Function URL:
```
https://your-project-ref.supabase.co/functions/v1/daily-trick-cron
```

You should see: `{ "success": true, "message": "Daily trick set for YYYY-MM-DD" }`

