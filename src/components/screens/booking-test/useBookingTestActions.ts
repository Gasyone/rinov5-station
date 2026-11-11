'use client'

import { type Dispatch, type SetStateAction } from 'react'
import { toast } from 'sonner'
import type { BookingTest } from '@/mocks/bookingTests'
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
  activeSubject: string
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

    if (!next.teacher?.trim()) {
      updateBooking(bookingId, (current) => ({
        ...current,
        teacher: current.teacher || 'Sarah J.',
        tester: current.tester || 'Sarah J.',
      }))
    }

    if (next.status === 'booked_assessment' || next.attendance !== 'confirmed') {
      updateBooking(bookingId, (current) => ({
        ...applyBookingCheckIn(current),
        status:
          current.status === 'booked_assessment'
            ? 'checkin'
            : current.status,
      }))
    }

    const storedDraft = readStoredAssessmentDraft(bookingId)
    const sampleDraft = buildSampleAssessmentDraft(next)

    // Kiểm tra draft đã lưu có đầy đủ tiêu chí điểm và nhận xét hay không
    const isStoredComplete = Boolean(
      storedDraft &&
      Object.keys(storedDraft.scoreSelections || {}).length >= 8 &&
      Object.values(storedDraft.scoreSelections || {}).some((v) => typeof v === 'number') &&
      Object.keys(storedDraft.feedbackAnswers || {}).length > 0
    )

    const initialDraft: AssessmentDraft =
      (isStoredComplete ? storedDraft : null) ??
      sampleDraft ??
      storedDraft ??
      buildEmptyAssessmentDraft(next)

    // Đảm bảo luôn nạp đầy đủ điểm tiêu chí và nhận xét chi tiết nếu ca đã được đánh giá
    if (sampleDraft) {
      if (!initialDraft.generalComment) {
        initialDraft.generalComment = sampleDraft.generalComment || sampleDraft.oldForm?.generalComment || ''
      }
      if (Object.keys(initialDraft.feedbackAnswers || {}).length === 0) {
        initialDraft.feedbackAnswers = sampleDraft.feedbackAnswers
      }
      if (!initialDraft.weaknesses || initialDraft.weaknesses.length === 0) {
        initialDraft.weaknesses = sampleDraft.weaknesses
      }
      if (Object.keys(initialDraft.scoreSelections || {}).length === 0) {
        initialDraft.scoreSelections = sampleDraft.scoreSelections
      }
    }

    deps.setAssessmentDraft(initialDraft)
    deps.setAssessmentBookingId(bookingId)
  }



  const saveAssessment = () => {
    if (!deps.assessmentBooking) return
    const draft = deps.assessmentDraft
    const summary = summarizeAssessmentDraft(draft)
    const nextSpeaking =
      summary.answeredCount > 0
        ? summary.speaking
        : draft.speaking || deps.assessmentBooking.testResult?.speaking
    const nextLevel =
      draft.level || summary.level || deps.assessmentBooking.testResult?.level
    const nextSpeakingScore =
      deps.assessmentBooking.testResult?.speakingScore ||
      (summary.answeredCount > 0
        ? summary.answeredCount >= 7
          ? '1.5'
          : summary.answeredCount >= 5
            ? '1.0'
            : '0.5'
        : '0')

    const commentText = draft.generalComment || draft.oldForm?.generalComment || ''
    const updatedDraft: AssessmentDraft = {
      ...draft,
      speaking: nextSpeaking || '',
      level: nextLevel || '',
      generalComment: commentText,
    }
    writeStoredAssessmentDraft(deps.assessmentBooking.id, updatedDraft)

    updateBooking(deps.assessmentBooking.id, (booking) => {
      const existingNotes = booking.notes || []
      const updatedNotes = commentText
        ? [
            ...existingNotes.filter((n) => n.author !== deps.authorName),
            {
              text: commentText,
              author: deps.authorName,
              timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
            },
          ]
        : existingNotes

      const updated: BookingTest = {
        ...booking,
        status: booking.status === 'booked_assessment' ? 'checkin' : booking.status,
        attendance: 'confirmed',
        isInterviewed: true,
        isTested: true,
        notes: updatedNotes,
        msg: commentText || booking.msg,
        resultLink: booking.resultLink || getBookingResultHref(booking.id),
        testResult: {
          ...booking.testResult,
          level: nextLevel,
          subLevel: draft.subLevel || booking.testResult?.subLevel,
          speaking: nextSpeaking,
          speakingScore: nextSpeakingScore,
          lwr: draft.lwr || booking.testResult?.lwr,
          path: draft.path || booking.testResult?.path,
        },
      }
      writeStoredBookingResult(updated)
      return updated
    })
    toast.success(`Đã cập nhật kết quả đánh giá cho ${deps.assessmentBooking.childName}`)
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
