import type { BookingStatus, BookingSubject, BookingTest } from '@/mocks/bookingTests'
import type { AssessmentDraft } from './bookingTestTypes'
import { STATUS_META } from './bookingTestConstants'
import type { CreateBookingForm, StatusTileId } from './bookingTestTypes'

export function getTodayDateInput() {
  const now = new Date()
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10)
}

export function buildEmptyCreateForm(): CreateBookingForm {
  return {
    studentId: '',
    childName: '',
    program: '',
    level: '',
    school: '',
    room: 'Sảnh tư vấn',
    teacher: '',
    notes: '',
    scheduleDate: getTodayDateInput(),
    scheduleTime: '',
    testDuration: '30 phút',
  }
}

export function formatAssessmentScore(value: number): string {
  return value % 1 === 0 ? String(value) : value.toFixed(1)
}

export function getSpeakingLevelFromScore(totalScore: number, answeredCount: number): string {
  if (answeredCount === 0) return ''
  if (totalScore <= 2) return 'Cần hỗ trợ'
  if (totalScore <= 4) return 'Đang phát triển'
  if (totalScore <= 6) return 'Tự tin'
  return 'Nâng cao'
}

export function summarizeAssessmentDraft(draft: AssessmentDraft) {
  const scoreSelections =
    draft.selectedTab === 'oldForm' ? draft.oldForm.scoreSelections : draft.scoreSelections
  const maxScore = draft.selectedTab === 'oldForm' ? 32 : 8
  const numericScores = Object.values(scoreSelections)
    .filter((value) => typeof value === 'number' && !Number.isNaN(value)) as number[]
  const totalScore = numericScores.reduce((sum, value) => sum + value, 0)
  const answeredCount = numericScores.length

  return {
    answeredCount,
    level:
      draft.selectedTab === 'form2025'
        ? getSpeakingLevelFromScore(totalScore, answeredCount)
        : '',
    speaking: answeredCount > 0 ? `${formatAssessmentScore(totalScore)}/${maxScore}` : '',
  }
}

export function buildEmptyAssessmentDraft(booking?: BookingTest): AssessmentDraft {
  return {
    evaluatorId: booking?.teacher ?? '',
    testType: 'preStarters',
    selectedTab: 'form2025',
    isSkipped2025: false,
    weaknesses: [],
    feedbackAnswers: {},
    scoreSelections: {},
    level: booking?.testResult?.level ?? '',
    subLevel: booking?.testResult?.subLevel ?? '',
    speaking: booking?.testResult?.speaking ?? '',
    lwr: booking?.testResult?.lwr ?? '',
    path: booking?.testResult?.path ?? 'Kiểm tra đầu vào Tiếng Anh',
    oldForm: {
      scoreSelections: {},
      isSkipped: false,
      vocabLevel: '',
      vocabRemembered: '',
      vocabForgotten: '',
      grammarRemembered: '',
      grammarForgotten: '',
      grammarErrors: [],
      grammarDetail: '',
      openQuestion: '',
      pronunciationErrors: [],
      pronunciationDetail: '',
      fluencyAnswers: {},
      generalComment: '',
    },
  }
}

export function getSubjectLabel(subject: BookingSubject) {
  return subject === 'english' ? 'Tiếng Anh' : 'Toán'
}

export function getWeekdayLabel(dateTimeStr: string): string {
  if (!dateTimeStr) return ''
  const datePart = dateTimeStr.split(' ')[0]
  const date = new Date(datePart)
  if (Number.isNaN(date.getTime())) return ''
  const day = date.getDay()
  const weekdayLabels = [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ]
  return weekdayLabels[day]
}

export function maskPhone(phone?: string) {
  if (!phone) return '-'
  const trimmed = phone.trim()
  if (trimmed.length < 6) return trimmed
  return `${trimmed.slice(0, 3)}${'*'.repeat(trimmed.length - 6)}${trimmed.slice(-3)}`
}

export function normalizePhone(phone?: string) {
  return String(phone ?? '').replace(/[^\d+]/g, '')
}

export function uniqueSorted(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.map((value) => String(value ?? '').trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, 'vi'))
}

export function getMemberList(booking: BookingTest) {
  return uniqueSorted([
    booking.createdBy,
    booking.ops,
    booking.teacher,
    booking.tester,
    booking.interviewer,
  ])
}

export function getInitials(name?: string) {
  const parts = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function getStatusLabel(status: BookingStatus) {
  return STATUS_META[status as keyof typeof STATUS_META]?.label ?? status
}

export function matchesStatusTile(booking: BookingTest, status: StatusTileId) {
  if (status === 'all') return true
  if (status === 'interviewed')
    return booking.status === 'started_assessment' && Boolean(booking.isInterviewed)
  if (status === 'tested')
    return booking.status === 'started_assessment' && Boolean(booking.isTested)
  if (status === 'unassigned_teacher') return !String(booking.teacher ?? '').trim()
  if (status === 'checkin')
    return (
      booking.attendance === 'confirmed' ||
      ['started_assessment', 'completed', 'failed'].includes(booking.status)
    )
  return booking.status === status
}

export function canSelectPlacementLevel(booking: BookingTest) {
  return Boolean(
    booking.isTested ||
      booking.status === 'completed' ||
      booking.status === 'failed'
  )
}

export function countStatus(bookings: BookingTest[], status: StatusTileId) {
  if (status === 'all') return bookings.length
  return bookings.filter((booking) => matchesStatusTile(booking, status)).length
}

export function nextBookingId(bookings: BookingTest[]) {
  const maxId = bookings.reduce((maxValue, booking) => {
    const numeric = Number.parseInt(booking.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? maxValue : Math.max(maxValue, numeric)
  }, 0)
  return `E${String(maxId + 1).padStart(4, '0')}`
}

export function formatDateTime(value?: string) {
  if (!value) return '-'
  const [date, time] = value.split(' ')
  return time ? `${time} · ${date}` : date
}

export function isTeacherEmployeeName(name: string) {
  return ['teacher', 'tutor', 'giang day', 'giao vien'].some((keyword) =>
    name.toLowerCase().includes(keyword)
  )
}

export function buildNewBooking({
  id,
  form,
  activeSubject,
  authorName,
  familyName,
  phone,
}: {
  id: string
  form: CreateBookingForm
  activeSubject: BookingSubject
  authorName: string
  familyName: string
  phone: string
}): BookingTest {
  const testTime = `${form.scheduleDate} ${form.scheduleTime}`.trim()
  return {
    id,
    childName: form.childName.trim(),
    familyName: familyName.trim() || `Gia đình ${form.childName.trim()}`,
    phone: phone.trim(),
    familyMembers: [
      {
        name: familyName.trim() || `Gia đình ${form.childName.trim()}`,
        phone: phone.trim(),
        isPrimary: true,
      },
    ].filter((member) => member.phone),
    status: 'booked_assessment',
    attendance: 'pending',
    subject: activeSubject,
    eventType: 'test',
    program: form.program,
    school: form.school,
    room: form.room || 'Sảnh tư vấn',
    classroom: form.room || 'Sảnh tư vấn',
    testTime,
    testResult: {
      level: form.level || 'Chưa xác định',
      speaking: '-',
      lwr: '-',
      path: activeSubject === 'english' ? 'Kiểm tra đầu vào Tiếng Anh' : undefined,
    },
    resultLink: '',
    testLink: `mock://booking-tests/${id.toLowerCase()}`,
    createdBy: authorName,
    ops: authorName,
    teacher: form.teacher,
    tester: form.teacher,
    msg: form.notes.trim() || '-',
    notes: form.notes.trim()
      ? [
          {
            text: form.notes.trim(),
            author: authorName,
            timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
          },
        ]
      : [],
  }
}
