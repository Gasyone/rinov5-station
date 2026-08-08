import { use } from 'react'
import { DraftQuoteLandingScreen } from '@/components/screens/quote/DraftQuoteLandingScreen'

interface QuotePageProps {
  params: Promise<{ id: string }>
}

export default function QuotePage({ params }: QuotePageProps) {
  const resolvedParams = use(params)
  return <DraftQuoteLandingScreen quoteId={resolvedParams.id} />
}
