'use client'

import { TrialClassReportView } from './TrialClassReportView'

interface TrialClassFeedbackPageProps {
  trialId: string
}

export function TrialClassFeedbackPage({ trialId }: TrialClassFeedbackPageProps) {
  return <TrialClassReportView trialId={trialId} />
}
