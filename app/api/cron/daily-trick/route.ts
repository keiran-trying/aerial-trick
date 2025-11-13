import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, or any external cron service)
// It should be called daily at midnight (00:00 UTC)
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization check
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Check if daily trick already exists for today
    const { data: existing } = await supabase
      .from('daily_trick')
      .select('id')
      .eq('date', today)
      .single()

    if (existing) {
      return NextResponse.json({ 
        message: 'Daily trick already set for today',
        date: today 
      })
    }

    // Get all tutorials
    const { data: tutorials, error: tutorialsError } = await supabase
      .from('tutorials')
      .select('id')

    if (tutorialsError || !tutorials || tutorials.length === 0) {
      return NextResponse.json(
        { error: 'No tutorials available' },
        { status: 404 }
      )
    }

    // Select a random tutorial
    const randomIndex = Math.floor(Math.random() * tutorials.length)
    const selectedTutorial = tutorials[randomIndex]

    // Insert the daily trick
    const { error: insertError } = await supabase
      .from('daily_trick')
      .insert({
        tutorial_id: selectedTutorial.id,
        date: today,
      })

    if (insertError) {
      throw insertError
    }

    return NextResponse.json({
      success: true,
      message: 'Daily trick set successfully',
      tutorial_id: selectedTutorial.id,
      date: today,
    })
  } catch (error) {
    console.error('Error in daily trick cron job:', error)
    return NextResponse.json(
      { error: 'Failed to set daily trick' },
      { status: 500 }
    )
  }
}

