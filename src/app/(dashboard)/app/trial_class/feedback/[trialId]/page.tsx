'use client'

import { use } from 'react'
import { TrialClassFeedbackPage } from '@/components/screens/trial-class/TrialClassFeedbackPage'

export default function TrialClassFeedbackRoute({
  params,
}: {
  params: Promise<{ trialId: string }>
}) {
  const { trialId } = use(params)
  return (
    <div className="h-full min-h-0">
      <TrialClassFeedbackPage key={trialId} trialId={trialId} />
    </div>
  )
}
