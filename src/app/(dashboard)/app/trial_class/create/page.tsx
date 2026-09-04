'use client'

import { Suspense } from 'react'
import { TrialClassCreateScreen } from '@/components/screens/trial-class/TrialClassCreateScreen'

export default function TrialClassCreateRoute() {
  return (
    <div className="h-full min-h-0">
      <Suspense fallback={null}>
        <TrialClassCreateScreen />
      </Suspense>
    </div>
  )
}
