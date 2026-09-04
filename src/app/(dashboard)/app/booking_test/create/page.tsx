'use client'

import { Suspense } from 'react'
import { BookingTestCreateScreen } from '@/components/screens/booking-test/BookingTestCreateScreen'

export default function BookingTestCreateRoute() {
  return (
    <div className="h-full min-h-0">
      <Suspense fallback={null}>
        <BookingTestCreateScreen />
      </Suspense>
    </div>
  )
}
