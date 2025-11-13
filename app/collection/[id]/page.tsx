import { createClient } from '@/lib/supabase/server'
import { CollectionDetail } from '@/components/collection-detail-fixed'
import { notFound } from 'next/navigation'

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .single()

  if (!collection) {
    notFound()
  }

  return <CollectionDetail collection={collection} />
}

