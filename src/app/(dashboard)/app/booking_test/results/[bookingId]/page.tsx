'use client'

import { use } from 'react'
import { BookingTestResultPage } from '@/components/screens/booking-test/BookingTestResultPage'

export default function BookingTestResultRoute({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = use(params)
  return (
    <div className="h-full min-h-0">
      <BookingTestResultPage key={bookingId} bookingId={bookingId} />
    </div>
  )
}
