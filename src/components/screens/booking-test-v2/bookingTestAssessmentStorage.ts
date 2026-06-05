'use client'

import type { BookingTest } from '@/mocks/bookingTests'
import type { AssessmentDraft } from './bookingTestTypes'

const ASSESSMENT_DRAFTS_KEY = 'rinov5-booking-test-assessment-drafts'
const BOOKING_RESULTS_KEY = 'rinov5-booking-test-results'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readRecord<T>(key: string): Record<string, T> {
  if (!canUseStorage()) return {}
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? '{}') as Record<string, T>
  } catch {
    return {}
  }
}

function writeRecord<T>(key: string, value: Record<string, T>) {
  if (!canUseStorage()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Mock-only persistence. Ignore storage quota/private-mode failures.
  }
}

export function getBookingResultHref(bookingId: string) {
  return `/app/booking_test/results/${encodeURIComponent(bookingId)}`
}

export function hasBookingAssessmentResult(booking: BookingTest) {
  const hasScore = (value?: string) => Boolean(value && value !== '-')
  return Boolean(
    booking.resultLink ||
      booking.isInterviewed ||
      booking.status === 'completed' ||
      hasScore(booking.testResult?.speaking) ||
      hasScore(booking.testResult?.lwr)
  )
}

export function readStoredAssessmentDraft(bookingId: string): AssessmentDraft | null {
  return readRecord<AssessmentDraft>(ASSESSMENT_DRAFTS_KEY)[bookingId] ?? null
}

export function writeStoredAssessmentDraft(bookingId: string, draft: AssessmentDraft) {
  writeRecord(ASSESSMENT_DRAFTS_KEY, {
    ...readRecord<AssessmentDraft>(ASSESSMENT_DRAFTS_KEY),
    [bookingId]: draft,
  })
}

export function readStoredBookingResult(bookingId: string): BookingTest | null {
  return readRecord<BookingTest>(BOOKING_RESULTS_KEY)[bookingId] ?? null
}

export function writeStoredBookingResult(booking: BookingTest) {
  writeRecord(BOOKING_RESULTS_KEY, {
    ...readRecord<BookingTest>(BOOKING_RESULTS_KEY),
    [booking.id]: booking,
  })
}
