import { createClient } from '@/lib/supabase/server'
import { TutorialDetail } from '@/components/tutorial-detail'
import { notFound } from 'next/navigation'

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

