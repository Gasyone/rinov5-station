'use client'

import { type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'
import type { BookingSubject, BookingTest } from '@/mocks/bookingTests'
import {
  applyBookingCheckIn,
  buildEmptyAssessmentDraft,
  normalizePhone,
  summarizeAssessmentDraft,
} from './bookingTestHelpers'
import {
  getBookingResultHref,
  readStoredAssessmentDraft,
  writeStoredAssessmentDraft,
  writeStoredBookingResult,
} from './bookingTestAssessmentStorage'
import {
  buildSampleAssessmentDraft,
  hasAssessmentDraftContent,
} from './bookingTestAssessmentSamples'
import type { AssessmentDraft } from './bookingTestTypes'

interface ActionDeps {
  bookings: BookingTest[]
  setBookings: Dispatch<SetStateAction<BookingTest[]>>
  setCopiedKey: Dispatch<SetStateAction<string>>
  setAssessmentBookingId: Dispatch<SetStateAction<string>>
  setAssessmentDraft: Dispatch<SetStateAction<AssessmentDraft>>
  setDetailNote: Dispatch<SetStateAction<string>>
  setSelectedIds: Dispatch<SetStateAction<Set<string>>>
  studentOptions: Array<{ id: string; label: string; familyName: string; phone: string }>
  authorName: string
  activeSubject: BookingSubject
  assessmentBooking: BookingTest | null
  assessmentDraft: AssessmentDraft
  detailBooking: BookingTest | null
  detailNote: string
}

/**
 * Side-effect handlers wired by BookingTestScreen.
 * Extracted to keep the orchestrator under the 300-line cap (DS §10.1).
 */
export function useBookingTestActions(deps: ActionDeps) {
  const updateBooking = (id: string, updater: (booking: BookingTest) => BookingTest) =>
    deps.setBookings((current) =>
      current.map((booking) => (booking.id === id ? updater(booking) : booking))
    )

  const copyToClipboard = async (text: string, key: string) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const element = document.createElement('textarea')
      element.value = text
      document.body.appendChild(element)
      element.select()
      document.execCommand('copy')
      document.body.removeChild(element)
    }
    deps.setCopiedKey(key)
    window.setTimeout(() => deps.setCopiedKey(''), 1800)
  }

  const triggerDeskCall = (phone?: string, name?: string, studentName?: string, studentId?: string) => {
    const normalized = normalizePhone(phone)
    if (!normalized) return
    const callEvent = new CustomEvent('rinov5:desk-call', {
      detail: { phone: normalized, name, studentName, studentId, source: 'screen.booking-test' },
      cancelable: true,
    })
    window.dispatchEvent(callEvent)
    if (!callEvent.defaultPrevented) window.location.href = `tel:${normalized}`
  }



  const openAssessmentDialog = (bookingId: string) => {
    const next = deps.bookings.find((booking) => booking.id === bookingId)
    if (!next || next.subject !== 'english') return

    // Kiểm tra đã gán giáo viên và người phụ trách hay chưa
    const hasTeacher = Boolean(next.teacher?.trim())
    const hasResponsible = Boolean(
      next.ops?.trim() ||
        next.createdBy?.trim() ||
        next.interviewer?.trim() ||
        next.tester?.trim()
    )

    if (!hasTeacher || !hasResponsible) {
      toast.error(
        'Vui lòng gán Giáo viên và Người phụ trách trước khi bắt đầu đánh giá/làm bài test.'
      )
      return
    }

    if (next.status === 'booked_assessment' || next.attendance !== 'confirmed') {
      updateBooking(bookingId, (current) => ({
        ...applyBookingCheckIn(current),
        status:
          current.status === 'booked_assessment'
            ? 'started_assessment'
            : current.status,
      }))
    }

    const storedDraft = readStoredAssessmentDraft(bookingId)
    const sampleDraft = buildSampleAssessmentDraft(next)
    deps.setAssessmentDraft(
      (storedDraft && hasAssessmentDraftContent(storedDraft) ? storedDraft : null) ??
        sampleDraft ??
        storedDraft ??
        buildEmptyAssessmentDraft(next)
    )
    deps.setAssessmentBookingId(bookingId)
  }



  const saveAssessment = () => {
    if (!deps.assessmentBooking) return
    const draft = deps.assessmentDraft
    const summary = summarizeAssessmentDraft(draft)
    writeStoredAssessmentDraft(deps.assessmentBooking.id, draft)

    updateBooking(deps.assessmentBooking.id, (booking) => {
      const updated: BookingTest = {
        ...booking,
        status: booking.status === 'booked_assessment' ? 'started_assessment' : booking.status,
        attendance: 'confirmed',
        isInterviewed: true,
        isTested: true,
        resultLink: booking.resultLink || getBookingResultHref(booking.id),
        testResult: {
          ...booking.testResult,
          level: draft.level || summary.level || booking.testResult?.level,
          subLevel: draft.subLevel || booking.testResult?.subLevel,
          speaking: draft.speaking || summary.speaking || booking.testResult?.speaking,
          lwr: draft.lwr || booking.testResult?.lwr,
          path: draft.path || booking.testResult?.path,
        },
      }
      writeStoredBookingResult(updated)
      return updated
    })
    deps.setAssessmentBookingId('')
  }

  const addDetailNote = () => {
    if (!deps.detailBooking || !deps.detailNote.trim()) return
    const note = {
      text: deps.detailNote.trim(),
      author: deps.authorName,
      timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
    updateBooking(deps.detailBooking.id, (booking) => ({
      ...booking,
      notes: [...(booking.notes ?? []), note],
      msg: note.text,
    }))
    deps.setDetailNote('')
  }

  const toggleSelectAll = (checked: boolean, ids: string[]) =>
    deps.setSelectedIds((current) => {
      const next = new Set(current)
      ids.forEach((id) => {
        if (checked) next.add(id)
        else next.delete(id)
      })
      return next
    })

  const toggleSelectOne = (id: string, checked: boolean) =>
    deps.setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })

  return {
    updateBooking,
    copyToClipboard,
    triggerDeskCall,
    openAssessmentDialog,
    saveAssessment,
    addDetailNote,
    toggleSelectAll,
    toggleSelectOne,
  }
}
