import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function POST() {
  try {
    const supabase = getSupabaseClient()
    const today = new Date().toISOString().split('T')[0]

    // Check if daily trick already exists for today
    const { data: existing } = await supabase
      .from('daily_trick')
      .select('id')
      .eq('date', today)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Daily trick already set for today' })
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
      message: 'Daily trick set successfully',
      tutorial_id: selectedTutorial.id,
    })
  } catch (error) {
    console.error('Error setting daily trick:', error)
    return NextResponse.json(
      { error: 'Failed to set daily trick' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_trick')
      .select(`
        *,
        tutorial:tutorials (*)
      `)
      .eq('date', today)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'No daily trick set for today' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching daily trick:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily trick' },
      { status: 500 }
    )
  }
}

