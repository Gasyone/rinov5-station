'use client'

import { use } from 'react'
import { TrialClassReportView } from '@/components/screens/trial-class/TrialClassReportView'

export default function TrialReportPage({
  params,
}: {
  params: Promise<{ trialId: string }>
}) {
  const { trialId } = use(params)
  return <TrialClassReportView trialId={trialId} />
}
