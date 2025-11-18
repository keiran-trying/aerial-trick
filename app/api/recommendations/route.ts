import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Get user's progress and completed tutorials
    const { data: userProgress } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get user preferences from onboarding
    const { data: userPreferences } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get tutorials user has watched/completed
    const { data: completedTutorials } = await supabase
      .from('tutorials')
      .select('id, title, difficulty, difficulty_stars')
      .in('id', userProgress?.completed_tutorials || [])

    // Get all available tutorials with collections
    const { data: allTutorials } = await supabase
      .from('tutorials')
      .select(`
        id,
        title,
        description,
        difficulty,
        difficulty_stars,
        duration_minutes
      `)

    // Get tutorial collections
    const { data: tutorialCollections } = await supabase
      .from('tutorial_collections')
      .select(`
        tutorial_id,
        collections (
          name
        )
      `)

    // Map collections to tutorials
    const tutorialsWithCollections = allTutorials?.map(tutorial => {
      const collections = tutorialCollections
        ?.filter(tc => tc.tutorial_id === tutorial.id)
        .map((tc: any) => tc.collections?.name)
        .filter(Boolean) || []
      
      return {
        ...tutorial,
        collections
      }
    })

    // Filter out already completed tutorials
    const availableTutorials = tutorialsWithCollections?.filter(
      t => !completedTutorials?.some(ct => ct.id === t.id)
    ) || []

    // Prepare data for OpenAI
    const userLevel = determineUserLevel(userProgress, completedTutorials || [])
    
    const prompt = `You are an aerial yoga instructor AI helping a student find their next tutorial.

USER PROFILE:
- Current level: ${userLevel}
- Preferred difficulty: ${userPreferences?.skill_level || 'not specified'}
- Interests: ${userPreferences?.interests?.join(', ') || 'not specified'}
- Likes drop tutorials: ${userPreferences?.likes_drop ? 'Yes' : 'No'}
- Videos completed: ${userProgress?.videos_completed || 0}
- Total minutes practiced: ${userProgress?.minutes_watched || 0}
- Days practiced: ${userProgress?.days_practiced || 0}

COMPLETED TUTORIALS:
${completedTutorials?.map(t => `- ${t.title} (${t.difficulty} ${t.difficulty_stars ? '⭐'.repeat(t.difficulty_stars) : ''})`).join('\n') || 'None yet'}

AVAILABLE TUTORIALS:
${availableTutorials.slice(0, 30).map((t, i) => 
  `${i + 1}. "${t.title}" - ${t.difficulty} ${'⭐'.repeat(t.difficulty_stars || 1)} ${t.collections.length > 0 ? `[${t.collections.join(', ')}]` : ''} ${t.description ? `(${t.description})` : ''}`
).join('\n')}

Please recommend 3-5 tutorials that would be perfect for this user's progression. Consider:
1. Their current skill level and experience
2. Their stated preferences and interests (especially important!)
3. Natural progression from what they've completed
4. Match tutorials to their interests (e.g., if they like "static tricks", prioritize tutorials in Static collection)
5. Respect their preference about drop tutorials
6. Variety in difficulty and collections
7. Building foundational skills before advanced moves

Format your response as a JSON array with this structure:
[
  {
    "tutorialTitle": "exact title from available tutorials",
    "reason": "1-2 sentences explaining why this is recommended for the user"
  }
]

Only recommend tutorials from the AVAILABLE TUTORIALS list above. Be encouraging and supportive!`

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive aerial yoga instructor AI. Provide personalized, encouraging recommendations in JSON format only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const responseText = completion.choices[0]?.message?.content || '[]'
    
    // Parse AI response
    let recommendations
    try {
      // Extract JSON from response (in case AI adds extra text)
      const jsonMatch = responseText.match(/\[[\s\S]*\]/)
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : []
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      recommendations = []
    }

    // Match recommendations with actual tutorial data
    const enrichedRecommendations = recommendations
      .map((rec: any) => {
        const tutorial = availableTutorials.find(
          t => t.title.toLowerCase() === rec.tutorialTitle.toLowerCase()
        )
        if (tutorial) {
          return {
            ...tutorial,
            aiReason: rec.reason
          }
        }
        return null
      })
      .filter(Boolean)
      .slice(0, 5) // Limit to 5 recommendations

    return NextResponse.json({
      success: true,
      recommendations: enrichedRecommendations,
      userLevel
    })

  } catch (error: any) {
    console.error('Recommendation error:', error)
    
    // Return fallback recommendations if OpenAI fails
    return NextResponse.json({
      success: false,
      error: error.message,
      recommendations: [],
      fallback: true
    }, { status: 200 }) // Return 200 so app doesn't break
  }
}

function determineUserLevel(userProgress: any, completedTutorials: any[]): string {
  const videosCompleted = userProgress?.videos_completed || 0
  const minutesPracticed = userProgress?.minutes_watched || 0
  
  // Analyze completed tutorial difficulties
  const difficulties = completedTutorials?.map(t => t.difficulty) || []
  const hasAdvanced = difficulties.includes('advanced') || difficulties.includes('drop')
  const hasIntermediate = difficulties.includes('intermediate')
  
  if (videosCompleted === 0) {
    return 'Complete Beginner - New to aerial yoga'
  } else if (videosCompleted < 5 || minutesPracticed < 60) {
    return 'Beginner - Building foundation'
  } else if (videosCompleted < 15 || !hasIntermediate) {
    return 'Early Intermediate - Ready for more challenges'
  } else if (videosCompleted < 30 || !hasAdvanced) {
    return 'Intermediate - Developing advanced skills'
  } else {
    return 'Advanced - Mastering complex moves'
  }
}

