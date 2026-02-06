import { TutorialDetailWrapper } from '@/components/tutorial-detail-wrapper'

// Required for static export - returns placeholder for build
export async function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

export default async function TutorialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TutorialDetailWrapper tutorialId={id} />
}

