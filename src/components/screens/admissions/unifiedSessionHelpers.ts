import { mockBookingTests, type BookingTest } from '@/mocks/bookingTests'
import { MOCK_TRIAL_CLASSES, type TrialClass } from '@/mocks/trialClasses'
import type {
  UnifiedSessionItem,
  StudentPlacementLevels,
  UnifiedSubject,
} from './unifiedSessionTypes'

export function normalizeCleanText(text?: string): string {
  if (!text) return ''
  return text.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function normalizeCleanPhone(phone?: string): string {
  if (!phone) return ''
  return phone.replace(/[^\d]/g, '')
}

export function detectSubject(rawSubject?: string, program?: string): { key: UnifiedSubject; label: string } {
  const s = (rawSubject || '').toLowerCase()
  const p = (program || '').toLowerCase()

  if (s.includes('math') || s.includes('toán') || p.includes('toán') || p.includes('math')) {
    return { key: 'math', label: 'Toán tư duy' }
  }
  return { key: 'english', label: 'Tiếng Anh' }
}

export function isSameStudent(
  nameA?: string,
  phoneA?: string,
  nameB?: string,
  phoneB?: string
): boolean {
  const cleanPhoneA = normalizeCleanPhone(phoneA)
  const cleanPhoneB = normalizeCleanPhone(phoneB)
  if (cleanPhoneA && cleanPhoneB && cleanPhoneA === cleanPhoneB) {
    return true
  }

  const cleanNameA = normalizeCleanText(nameA)
  const cleanNameB = normalizeCleanText(nameB)
  if (cleanNameA && cleanNameB && cleanNameA === cleanNameB) {
    return true
  }

  return false
}

/**
 * Tìm tất cả các ca kiểm tra đầu vào và lớp học thử của một học viên
 */
export function resolveStudentUnifiedSessions(params: {
  studentName: string
  phone?: string
  currentBookingId?: string
  currentTrialId?: string
  allBookings?: BookingTest[]
  allTrials?: TrialClass[]
}): {
  allSessions: UnifiedSessionItem[]
  placementLevels: StudentPlacementLevels
} {
  const bookingsSource = params.allBookings && params.allBookings.length > 0 ? params.allBookings : mockBookingTests
  const trialsSource = params.allTrials && params.allTrials.length > 0 ? params.allTrials : MOCK_TRIAL_CLASSES

  const matchedBookings = bookingsSource.filter((b) =>
    isSameStudent(b.childName, b.phone, params.studentName, params.phone)
  )

  const matchedTrials = trialsSource.filter((t) =>
    isSameStudent(t.studentName, t.familyPhone, params.studentName, params.phone)
  )

  const items: UnifiedSessionItem[] = []

  // 1. Chuyển đổi các ca Test
  for (const b of matchedBookings) {
    const isCurrent = params.currentBookingId === b.id
    const { key, label } = detectSubject(b.subject, b.program)
    const rawDate = b.testTime || '2026-05-20 10:00'

    items.push({
      id: b.id,
      type: 'test',
      title: `Kiểm tra đầu vào #${b.id}`,
      subject: key,
      subjectLabel: label,
      dateLabel: rawDate,
      rawDate,
      timeLabel: rawDate.includes(' ') ? rawDate.split(' ')[1] : rawDate,
      school: b.school,
      room: b.classroom || b.room || 'Phòng Lab',
      teacherName: b.teacher || b.tester || 'Chưa gán GV',
      teacherRole: 'Giáo viên khảo thí',
      creatorName: b.createdBy || b.ops || 'Nguyen Thi Ha',
      status: b.status,
      statusLabel: getBookingStatusLabel(b.status),
      isCurrent,
      testScoreSummary: {
        level: b.testResult?.level || b.expectedLevel,
        subLevel: b.testResult?.subLevel,
        speakingScore: b.testResult?.speakingScore,
        lwrScore: b.testResult?.lwrScore,
        resultLink: b.resultLink || b.testLink,
      },
      sourceBooking: b,
    })
  }

  // 2. Chuyển đổi các ca Học thử
  for (const t of matchedTrials) {
    const isCurrent = params.currentTrialId === t.id
    const { key, label } = detectSubject(t.subject, t.program)
    const session0 = t.sessions[0]
    const rawDate = session0?.trialDate || '2026-05-20 18:00'

    items.push({
      id: t.id,
      type: 'trial',
      title: `Lớp học thử #${t.id}`,
      subject: key,
      subjectLabel: label,
      dateLabel: rawDate,
      rawDate,
      timeLabel: rawDate.includes(' ') ? rawDate.split(' ')[1] : rawDate,
      school: t.branch || t.school,
      room: 'Phòng 201',
      teacherName: t.owner || 'Chưa gán GV',
      teacherRole: 'Giáo viên phụ trách lớp',
      creatorName: t.creator || 'Nguyen Thi Ha',
      status: t.status,
      statusLabel: getTrialStatusLabel(t.status),
      isCurrent,
      trialSummary: {
        className: session0?.className || t.program,
        classId: session0?.classId || 'CLS-NEW',
        sessionName: session0?.sessionName || 'Buổi 1',
        rating: t.feedback?.rating,
        feedbackComment: t.feedback?.comment,
        assistant: t.assistant,
      },
      sourceTrial: t,
    })
  }

  // Sắp xếp giảm dần theo rawDate (mới nhất lên trên)
  items.sort((a, b) => b.rawDate.localeCompare(a.rawDate))

  // Sắp xếp danh sách booking theo thời gian mới nhất lên đầu để lấy đúng trình độ mới nhất
  const sortedBookings = [...matchedBookings].sort((a, b) => (b.testTime || '').localeCompare(a.testTime || ''))

  // 3. Tính toán Trình độ hiện tại theo môn (lấy theo trình độ mới nhất của học viên)
  const placementLevels: StudentPlacementLevels = {}

  // Lọc bài test tiếng Anh mới nhất (ưu tiên bài test gần nhất có kết quả/trình độ, hoặc bài test mới nhất)
  const englishBookings = sortedBookings.filter((b) => detectSubject(b.subject, b.program).key === 'english')
  const englishTest = englishBookings.find((b) => b.testResult?.level) || englishBookings[0]
  if (englishTest) {
    const levelVal = englishTest.testResult?.level || englishTest.expectedLevel
    if (levelVal) {
      placementLevels.english = {
        level: levelVal,
        subLevel: englishTest.testResult?.subLevel,
        testDate: englishTest.testTime,
        isExpected: !englishTest.testResult?.level && Boolean(englishTest.expectedLevel),
      }
    }
  }

  // Lọc bài test Toán mới nhất (ưu tiên bài test gần nhất có kết quả/trình độ, hoặc bài test mới nhất)
  const mathBookings = sortedBookings.filter((b) => detectSubject(b.subject, b.program).key === 'math')
  const mathTest = mathBookings.find((b) => b.testResult?.level) || mathBookings[0]
  if (mathTest) {
    const levelVal = mathTest.testResult?.level || mathTest.expectedLevel
    if (levelVal) {
      placementLevels.math = {
        level: levelVal,
        subLevel: undefined, // Môn Toán không có trình độ phụ
        testDate: mathTest.testTime,
        isExpected: !mathTest.testResult?.level && Boolean(mathTest.expectedLevel),
      }
    }
  }

  return { allSessions: items, placementLevels }
}

function getBookingStatusLabel(status: string): string {
  switch (status) {
    case 'booked_assessment':
      return 'Đã đặt lịch'
    case 'ipad_test_booked':
      return 'Đã đặt iPad'
    case 'ipad_test_started':
      return 'Đang test'
    case 'checkin':
      return 'Đã đến'
    case 'assessing':
      return 'Đang đánh giá'
    case 'completed':
      return 'Hoàn tất'
    case 'failed':
      return 'Không đạt'
    case 'cancelled':
      return 'Đã hủy'
    default:
      return status
  }
}

function getTrialStatusLabel(status: string): string {
  switch (status) {
    case 'pending_approval':
      return 'Chờ xác nhận'
    case 'confirmed':
      return 'Đã ghép lớp'
    case 'reschedule':
      return 'Cần đổi lịch'
    case 'completed':
      return 'Hoàn thành'
    case 'rejected':
      return 'Từ chối ghép'
    case 'cancelled':
      return 'Đã hủy'
    case 'no_show':
      return 'Vắng mặt'
    default:
      return status
  }
}
