import { createClient } from '@/lib/supabase/server'
import { TutorialDetail } from '@/components/tutorial-detail'
import { notFound } from 'next/navigation'

// Required for static export
export async function generateStaticParams() {
  // Return empty array - pages will be generated on-demand
  return []
}

export default async function TutorialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: tutorial } = await supabase
    .from('tutorials')
    .select('*')
    .eq('id', id)
    .single()

  if (!tutorial) {
    notFound()
  }

  return <TutorialDetail tutorial={tutorial} />
}

