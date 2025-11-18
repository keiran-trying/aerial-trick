import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Fallback messages in case OpenAI is unavailable
const fallbackMessages = [
  'Well done!',
  'Good job!',
  'Amazing work!',
  'Keep it up!',
  'You\'re doing great!',
  'Fantastic effort!',
  'Way to go!',
  'You\'re a star!',
  'Brilliant!',
  'Outstanding!',
  'You nailed it!',
  'Incredible progress!',
]

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Use fallback if no API key
      const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
      return NextResponse.json({ message: randomMessage })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a motivational aerial yoga instructor. Generate a short, positive, encouraging message (5-10 words) to congratulate someone who just finished a tutorial. Be upbeat and inspiring.',
        },
        {
          role: 'user',
          content: 'Give me a motivational message.',
        },
      ],
      max_tokens: 30,
      temperature: 0.8,
    })

    const message = response.choices[0]?.message?.content?.trim() || fallbackMessages[0]

    return NextResponse.json({ message })
  } catch (error) {
    console.error('Error generating motivation:', error)
    // Fallback to random message on error
    const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
    return NextResponse.json({ message: randomMessage })
  }
}

