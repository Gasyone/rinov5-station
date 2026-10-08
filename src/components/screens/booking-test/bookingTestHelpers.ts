import type { BookingStatus, BookingSubject, BookingTest } from '@/mocks/bookingTests'
import { mockLeads } from '@/mocks/crmLeads'
import { mockStudents } from '@/mocks/students'
import type { AssessmentDraft } from './bookingTestTypes'
import { STATUS_META } from './bookingTestConstants'
import type { CreateBookingForm, StatusTileId } from './bookingTestTypes'
import type { ContactPerson } from './ContactSearchableSelect'

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
  const scoreSelections = draft.scoreSelections
  const maxScore = 8
  const numericScores = Object.values(scoreSelections)
    .filter((value) => typeof value === 'number' && !Number.isNaN(value)) as number[]
  const totalScore = numericScores.reduce((sum, value) => sum + value, 0)
  const answeredCount = numericScores.length

  return {
    answeredCount,
    level: getSpeakingLevelFromScore(totalScore, answeredCount),
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

export function formatTestTimeWithDay(dateTimeStr: string): string {
  if (!dateTimeStr) return ''
  const parts = dateTimeStr.trim().split(' ')
  const datePart = parts[0] || ''
  const timePart = parts[1] || ''

  if (!datePart) return dateTimeStr

  const [y, m, d] = datePart.split('-').map(Number)
  if (!y || !m || !d) return dateTimeStr

  const date = new Date(y, m - 1, d)
  if (Number.isNaN(date.getTime())) return dateTimeStr

  const weekdayLabels = [
    'Chủ Nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ]
  const dayLabel = weekdayLabels[date.getDay()]
  const dayStr = String(d).padStart(2, '0')
  const monthStr = String(m).padStart(2, '0')

  return `${dayLabel}, ${dayStr}/${monthStr}${timePart ? `, ${timePart}` : ''}`.trim()
}

export function calculateStudentAge(dob?: string): number | null {
  if (!dob) return null
  const trimmed = dob.trim()
  let birthYear: number | null = null
  let birthMonth: number | null = null
  let birthDay: number | null = null

  if (/^\d{4}$/.test(trimmed)) {
    birthYear = parseInt(trimmed, 10)
  } else if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number)
    birthYear = y
    birthMonth = m
    birthDay = d
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/').map(Number)
    birthYear = y
    birthMonth = m
    birthDay = d
  }

  if (!birthYear) return null
  const now = new Date()
  let age = now.getFullYear() - birthYear
  if (birthMonth && birthDay) {
    const isBirthdayPassed =
      now.getMonth() + 1 > birthMonth ||
      (now.getMonth() + 1 === birthMonth && now.getDate() >= birthDay)
    if (!isBirthdayPassed) {
      age -= 1
    }
  }
  return age > 0 ? age : null
}

export function formatStudentDob(dob?: string): string {
  if (!dob) return '-'
  const trimmed = dob.trim()
  if (/^\d{4}$/.test(trimmed)) return trimmed
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) return trimmed
  const parts = trimmed.split('-')
  if (parts.length === 3) {
    const [y, m, d] = parts
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`
  }
  return trimmed
}

export function formatStudentAgeDob(dob?: string): string {
  if (!dob) return '-'
  const formattedDob = formatStudentDob(dob)
  const age = calculateStudentAge(dob)
  if (age !== null) {
    return `${age} tuổi, ${formattedDob}`
  }
  return formattedDob
}

export function getStudentGender(booking: BookingTest): string {
  if (booking.gender) {
    if (booking.gender === 'Female' || booking.gender === 'Nữ') return 'Nữ'
    if (booking.gender === 'Male' || booking.gender === 'Nam') return 'Nam'
    return booking.gender
  }

  const student = mockStudents.find((s) => s.name === booking.childName)
  if (student?.gender) {
    return student.gender === 'Female' ? 'Nữ' : 'Nam'
  }

  const nameLower = booking.childName.toLowerCase().trim()
  const femaleKeywords = [
    'thị', 'chi', 'my', 'vi', 'vy', 'linh', 'châu', 'chau', 'hương', 'huong',
    'nhi', 'ngọc', 'ngoc', 'lan', 'mai', 'hoa', 'thảo', 'thao', 'trang', 'hà'
  ]
  const isFemale = femaleKeywords.some((kw) => nameLower.includes(kw))
  return isFemale ? 'Nữ' : 'Nam'
}

export function formatStudentBirthYear(dob?: string): string {
  if (!dob) return '-'
  const trimmed = dob.trim()
  if (/^\d{4}$/.test(trimmed)) return trimmed
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed.slice(0, 4)
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) return trimmed.slice(-4)
  const match = trimmed.match(/\b(19\d{2}|20\d{2})\b/)
  return match ? match[1] : trimmed
}

/**
 * Định dạng dòng 2 cột Học viên: Giới tính, x T, Năm sinh
 * Ví dụ: "Nam, 11 T, 2015" hoặc "Nữ, 9 T, 2017"
 */
export function formatStudentMetaLine(booking: BookingTest): string {
  const gender = getStudentGender(booking)
  const age = calculateStudentAge(booking.dob)
  const ageText = age !== null ? `${age} T` : '- T'
  const birthYear = formatStudentBirthYear(booking.dob)

  return `${gender}, ${ageText}, ${birthYear}`
}

export function getParentDisplayName(booking: BookingTest): string {
  const primaryMember =
    booking.familyMembers?.find((m) => m.isPrimary) ||
    booking.familyMembers?.[0]
  if (primaryMember?.name?.trim()) {
    const name = primaryMember.name.trim()
    if (/\(.*\)/.test(name)) return name
    return `${name} (Phụ huynh)`
  }
  if (booking.familyName?.trim()) {
    const cleaned = booking.familyName.replace(/^Gia đình\s+/i, '').trim()
    return cleaned ? `${cleaned} (Phụ huynh)` : booking.familyName
  }
  return 'Phụ huynh'
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
  if (status === 'ipad_test_booked') return 'Đã book test'
  if (status === 'ipad_test_started') return 'Đang test'
  if (status === 'assessing') return 'Đang đánh giá'
  return STATUS_META[status as keyof typeof STATUS_META]?.label ?? status
}

export function isTerminalBookingStatus(status: BookingStatus) {
  return ['completed', 'cancelled', 'failed'].includes(status)
}

export function isBookingCheckedIn(booking: BookingTest) {
  return booking.attendance === 'confirmed'
}

export function shouldShowCheckInAction(booking: BookingTest) {
  return !isBookingCheckedIn(booking) && !isTerminalBookingStatus(booking.status) && booking.status !== 'ipad_test_booked' && booking.status !== 'ipad_test_started'
}

export function applyBookingCheckIn(booking: BookingTest): BookingTest {
  return {
    ...booking,
    attendance: 'confirmed',
    status:
      booking.status === 'booked_assessment'
        ? 'checkin'
        : booking.status,
  }
}

export function matchesStatusTile(booking: BookingTest, status: StatusTileId) {
  if (status === 'all') return true
  if (status === 'interviewed')
    return booking.status === 'checkin' && Boolean(booking.isInterviewed)
  if (status === 'tested')
    return booking.status === 'checkin' && Boolean(booking.isTested)
  if (status === 'unassigned_teacher') return !String(booking.teacher ?? '').trim()
  if (status === 'checkin') return isBookingCheckedIn(booking)
  return booking.status === status
}

export function canSelectPlacementLevel(booking: BookingTest) {
  return Boolean(
    booking.isTested ||
      booking.status === 'assessing' ||
      booking.status === 'completed' ||
      booking.status === 'failed'
  )
}

export function countStatus(bookings: BookingTest[], status: StatusTileId) {
  if (status === 'all') return bookings.filter((booking) => booking.status !== 'cancelled').length
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
  activeSubject: string
  authorName: string
  familyName: string
  phone: string
}): BookingTest {
  const testTime = `${form.scheduleDate} ${form.scheduleTime}`.trim()
  const resolvedSubject = activeSubject === 'math' ? 'math' : 'english'
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
    subject: resolvedSubject,
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
      path: resolvedSubject === 'english' ? 'Kiểm tra đầu vào Tiếng Anh' : undefined,
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

export const BOOKING_TEST_CENTER_DATA = [
  {
    name: 'RinoEdu Linh Đàm',
    distance: 1.2,
    distanceStr: '1.2 km',
    address: 'Tầng 3, TTTM Rice City, Linh Đàm, Hoàng Mai',
  },
  {
    name: 'RinoEdu Nguyễn Tuân',
    distance: 2.8,
    distanceStr: '2.8 km',
    address: 'Số 90 Nguyễn Tuân, Thanh Xuân',
  },
  {
    name: 'RinoEdu Đống Đa',
    distance: 4.5,
    distanceStr: '4.5 km',
    address: 'Số 142 Hào Nam, Đống Đa',
  },
  {
    name: 'RinoEdu Cầu Giấy',
    distance: 6.3,
    distanceStr: '6.3 km',
    address: 'Tòa Discovery Complex, 302 Cầu Giấy',
  },
  {
    name: 'RinoEdu Smart City',
    distance: 8.5,
    distanceStr: '8.5 km',
    address: 'Tòa S2.01 Vinhomes Smart City, Nam Từ Liêm',
  },
  {
    name: 'RinoEdu Hà Đông',
    distance: 9.8,
    distanceStr: '9.8 km',
    address: 'Số 48 Quang Trung, Hà Đông',
  },
]

export function buildBookingTestContactsList(
  customContacts: ContactPerson[]
): ContactPerson[] {
  const map = new Map<string, ContactPerson>()

  customContacts.forEach((c) => {
    map.set(c.id, c)
  })

  mockLeads.forEach((lead) => {
    if (!lead.parentName) return
    const pName = lead.parentName
    const pPhone = lead.phone || '0900000000'
    const key = `${pName}_${pPhone}`

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: pName,
        role: lead.parentRole || 'Mẹ',
        phone: pPhone,
        address: lead.address,
        children: [],
      })
    }

    const contact = map.get(key)!
    if (lead.address && !contact.address) {
      contact.address = lead.address
    }

    const childKey = `lead_child_${lead.id}`
    if (!contact.children.some((c) => c.name === lead.studentName)) {
      contact.children.push({
        id: childKey,
        name: lead.studentName,
        dob: lead.birthYear ? `01/01/${lead.birthYear}` : undefined,
        age: lead.studentAge,
        currentSchool: lead.schoolName || 'Tiểu học Lương Định Của (Quận 3)',
        academicPerformance: lead.academicAbility || lead.academicPerformance || 'Giỏi / Tốt nghiệp loại Ưu',
      })
    }
  })

  mockStudents.forEach((student) => {
    const pName = student.parentName || `Phụ huynh ${student.name}`
    const pPhone = student.parentPhone || student.phone || '0900000000'
    const key = `${pName}_${pPhone}`

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: pName,
        role: 'Mẹ',
        phone: pPhone,
        address: 'Phường Võ Thị Sáu, Quận 3, TP.HCM',
        children: [],
      })
    }

    const contact = map.get(key)!
    if (!contact.children.some((c) => c.id === student.id)) {
      let calcAge: number | undefined
      if (student.dob) {
        const birthYear = parseInt(student.dob.slice(0, 4), 10)
        if (!isNaN(birthYear)) {
          calcAge = 2026 - birthYear
        }
      }
      contact.children.push({
        id: student.id,
        name: student.name,
        dob: student.dob,
        age: calcAge || 8,
        currentSchool: 'Tiểu học Lương Định Của (Quận 3)',
        academicPerformance: 'Giỏi / Tốt nghiệp loại Ưu',
      })
    }
  })

  return Array.from(map.values())
}

function parseTestTimeToMs(dateTimeStr?: string): number {
  if (!dateTimeStr) return 0
  const normalized = dateTimeStr.trim().replace(' ', 'T')
  const time = new Date(normalized).getTime()
  return Number.isNaN(time) ? 0 : time
}

function getDateOnly(dateTimeStr?: string): string {
  if (!dateTimeStr) return ''
  return dateTimeStr.trim().split(' ')[0] || ''
}

export function getBookingOperationalRank(booking: BookingTest, todayStr: string): number {
  const isTerminal = isTerminalBookingStatus(booking.status)
  const bookingDate = getDateOnly(booking.testTime)
  const isUnassignedTeacher = !String(booking.teacher ?? '').trim()
  const isOnSiteOrInProgress =
    !isTerminal &&
    (isBookingCheckedIn(booking) ||
      booking.status === 'assessing' ||
      booking.status === 'ipad_test_started' ||
      Boolean(booking.isTested) ||
      Boolean(booking.isInterviewed))

  // Bậc 1: Khẩn cấp - Chưa có giáo viên phụ trách cho ca hôm nay hoặc đã đến hạn
  if (!isTerminal && isUnassignedTeacher && bookingDate <= todayStr) {
    return 1
  }

  // Bậc 2: Đang tại cơ sở / Đang test / Đang đánh giá (cần xử lý ngay)
  if (isOnSiteOrInProgress) {
    return 2
  }

  // Bậc 3: Ca hôm nay sắp diễn ra (đã gán GV hoặc chuẩn bị đến)
  if (!isTerminal && bookingDate === todayStr) {
    return 3
  }

  // Bậc 4: Ca tương lai (ngày mai trở đi)
  if (!isTerminal && bookingDate > todayStr) {
    return 4
  }

  // Bậc 5: Ca quá khứ chưa đóng
  if (!isTerminal) {
    return 5
  }

  // Bậc 6: Đã hoàn tất (completed)
  if (booking.status === 'completed') {
    return 6
  }

  // Bậc 7: Không đạt (failed)
  if (booking.status === 'failed') {
    return 7
  }

  // Bậc 8: Đã hủy (cancelled)
  return 8
}

/**
 * Sắp xếp danh sách lịch kiểm tra theo Mức độ ưu tiên vận hành (Phương án 1):
 * - Bậc 1: Khẩn cấp (Hôm nay chưa gán giáo viên)
 * - Bậc 2: Đang tại cơ sở / Đang test / Đang đánh giá
 * - Bậc 3: Ca hôm nay sắp tới (giờ sớm lên trước)
 * - Bậc 4: Ca tương lai (ngày gần lên trước)
 * - Bậc 5: Ca quá khứ chưa đóng
 * - Bậc 6-8: Lịch sử đã xong (Hoàn tất -> Không đạt -> Đã hủy, gần nhất lên trước)
 */
export function sortBookingTestsByOperationalPriority(bookings: BookingTest[]): BookingTest[] {
  const todayStr = getTodayDateInput()

  return [...bookings].sort((a, b) => {
    const rankA = getBookingOperationalRank(a, todayStr)
    const rankB = getBookingOperationalRank(b, todayStr)

    if (rankA !== rankB) {
      return rankA - rankB
    }

    const timeA = parseTestTimeToMs(a.testTime)
    const timeB = parseTestTimeToMs(b.testTime)

    // Các bậc 1, 2, 3, 4 (chưa kết thúc): Xếp thời gian tăng dần (ca sớm hơn lên trước)
    if (rankA <= 4) {
      if (timeA !== timeB) {
        return timeA - timeB
      }
    } else {
      // Các bậc 5, 6, 7, 8 (quá khứ hoặc đã kết thúc): Xếp thời gian giảm dần (gần nhất lên trước)
      if (timeA !== timeB) {
        return timeB - timeA
      }
    }

    // Tie-breaker: Mã phiếu giảm dần
    return b.id.localeCompare(a.id, undefined, { numeric: true })
  })
}

