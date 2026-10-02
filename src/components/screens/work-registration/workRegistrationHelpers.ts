import {
  WORK_TIME_SLOTS,
  getPriorityRequirement,
  getWorkWeekDays,
  toWorkDateKey,
  type WorkRegistrationEmployee,
  type WorkPrioritySlotRule,
  type WorkRegistrationRecord,
  type WorkRegistrationStatus,
} from '@/mocks/workRegistrations'
import { ALL_DUTY_EMPLOYEES, type ShiftSection } from '@/mocks/shiftRoster'
import type {
  BranchWeekSummary,
  EmployeeWeekSummary,
  WorkRegistrationActionState,
  WorkRegistrationStatusFilter,
} from './workRegistrationTypes'

export function getEmployeeRoleLabel(employeeId: string, position?: string, department?: string): string {
  const dutyEmp = ALL_DUTY_EMPLOYEES.find((e) => e.id === employeeId)
  if (dutyEmp) {
    if (dutyEmp.role === 'Khác') {
      if (position?.toLowerCase().includes('manager') || department === 'Management') return 'Quản lý'
      if (position?.toLowerCase().includes('it') || department === 'IT') return 'IT Support'
      if (position?.toLowerCase().includes('accounting') || department === 'Finance') return 'Kế toán'
      if (position?.toLowerCase().includes('reception') || department === 'Admin') return 'Lễ tân'
      return 'Khác'
    }
    return dutyEmp.role
  }
  if (position?.toLowerCase().includes('manager') || department === 'Management') return 'Quản lý'
  if (position?.toLowerCase().includes('teacher')) return 'Giáo viên'
  if (position?.toLowerCase().includes('assistant')) return 'Trợ giảng'
  if (position?.toLowerCase().includes('csm') || position?.toLowerCase().includes('cs') || position?.toLowerCase().includes('sale')) return 'CS'
  return position || 'Nhân viên'
}

export const formatWorkWeekRange = (weekStart: Date) => {
  const days = getWorkWeekDays(weekStart)
  const startDay = days[0].getDate().toString().padStart(2, '0')
  const startMonth = (days[0].getMonth() + 1).toString().padStart(2, '0')
  
  const endDay = days[6].getDate().toString().padStart(2, '0')
  const endMonth = (days[6].getMonth() + 1).toString().padStart(2, '0')
  const endYear = days[6].getFullYear()
  
  return `${startDay}/${startMonth} - ${endDay}/${endMonth}/${endYear}`
}

export const formatWorkMonth = (date: Date) => {
  return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`
}

export const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest} phút`
  if (rest === 0) return `${hours} giờ`
  return `${hours} giờ ${rest} phút`
}

/** Compact format: "5:00", "1:30", "0:00" */
export const formatMinutesShort = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return `${hours}:${rest.toString().padStart(2, '0')}`
}

/**
 * Rút gọn hiển thị thời gian trong badge nhân viên của ma trận ca:
 * - Nếu full ca: hiển thị "Full" (thay vì "Full ca" chiếm diện tích)
 * - Nếu tròn giờ: "08:00 - 10:00" -> "8-10h" (chỉ 5 ký tự)
 * - Nếu nửa giờ: "08:30 - 10:30" -> "8:30-10:30"
 * - Nếu một đầu tròn: "14:00 - 16:30" -> "14h-16:30"
 */
export function formatCompactTimeLabel(rawLabel: string | null | undefined): string | null {
  if (!rawLabel) return null
  const trimmed = rawLabel.trim()
  if (trimmed === 'Full ca' || trimmed === 'Full' || trimmed === 'Cả ca') {
    return 'Full'
  }
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/)
  if (match) {
    const [, startH, startM, endH, endM] = match
    const sH = parseInt(startH, 10)
    const eH = parseInt(endH, 10)
    if (startM === '00' && endM === '00') {
      return `${sH}-${eH}h`
    }
    const sStr = startM === '00' ? `${sH}h` : `${sH}:${startM}`
    const eStr = endM === '00' ? `${eH}h` : `${eH}:${endM}`
    return `${sStr}-${eStr}`
  }
  return trimmed.replace(/\s+/g, '')
}

export const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

export const getSlot = (slotId: string) =>
  WORK_TIME_SLOTS.find((slot) => slot.id === slotId)

export const sumRegistrationMinutes = (records: WorkRegistrationRecord[]) =>
  records.reduce((total, record) => total + (getSlot(record.slotId)?.minutes ?? 0), 0)

export const sumRegisteredMinutes = (records: WorkRegistrationRecord[]) =>
  records
    .filter((record) => record.status !== 'draft')
    .reduce((total, record) => total + (getSlot(record.slotId)?.minutes ?? 0), 0)

export const sumDraftMinutes = (records: WorkRegistrationRecord[]) =>
  records
    .filter((record) => record.status === 'draft')
    .reduce((total, record) => total + (getSlot(record.slotId)?.minutes ?? 0), 0)

export const getRecordsForWeek = (records: WorkRegistrationRecord[], weekStart: Date) => {
  const weekStartKey = toWorkDateKey(weekStart)
  return records.filter((record) => record.weekStart === weekStartKey)
}

export const getEmployeeWeekRecords = (
  records: WorkRegistrationRecord[],
  employeeId: string,
  weekStart: Date
) => getRecordsForWeek(records, weekStart).filter((record) => record.employeeId === employeeId)

export function resolveEmployeeWeekStatus(records: WorkRegistrationRecord[]): WorkRegistrationStatusFilter {
  // Bỏ qua các record đang nháp (chưa lưu) khi tính trạng thái của nhân viên
  const savedRecords = records.filter((record) => record.status !== 'draft')
  if (savedRecords.length === 0) return 'not_registered'
  return 'registered'
}

export function buildEmployeeSummaries(
  employees: WorkRegistrationEmployee[],
  records: WorkRegistrationRecord[],
  weekStart: Date
): EmployeeWeekSummary[] {
  return employees.map((employee) => {
    const employeeRecords = getEmployeeWeekRecords(records, employee.id, weekStart)
    return {
      employee,
      records: employeeRecords,
      totalMinutes: sumRegistrationMinutes(employeeRecords),
      status: resolveEmployeeWeekStatus(employeeRecords),
    }
  })
}

export function filterEmployeeSummaries(
  summaries: EmployeeWeekSummary[],
  options: {
    branch: string
    jobTitles: string[]
    subject: string
    status: WorkRegistrationStatusFilter
    search: string
  }
) {
  const query = options.search.trim().toLowerCase()
  return summaries.filter(({ employee, status }) => {
    if (options.branch !== 'all' && employee.branch !== options.branch) return false
    if (options.subject !== 'all' && (!employee.subjects || !employee.subjects.includes(options.subject))) return false
    if (options.jobTitles.length > 0 && !options.jobTitles.includes(employee.position)) return false
    if (options.status !== 'all' && status !== options.status) return false
    if (!query) return true
    return [employee.name, employee.email, employee.phone, employee.code, employee.position]
      .join(' ')
      .toLowerCase()
      .includes(query)
  })
}

export function buildBranchSummaries(
  employees: WorkRegistrationEmployee[],
  records: WorkRegistrationRecord[],
  weekStart: Date,
  branchFilter: string,
  priorityRules: WorkPrioritySlotRule[]
): BranchWeekSummary[] {
  const weekRecords = getRecordsForWeek(records, weekStart)
  const weekDays = getWorkWeekDays(weekStart)
  const branches = Array.from(new Set(employees.map((employee) => employee.branch))).sort()

  return branches
    .filter((branch) => branchFilter === 'all' || branch === branchFilter)
    .map((branch) => {
      const branchEmployees = employees.filter((employee) => employee.branch === branch)
      const branchRecords = weekRecords.filter((record) => record.branch === branch)
      const availableRecords = branchRecords.filter((record) => record.status !== 'draft')
      const registeredEmployeeCount = new Set(availableRecords.map((record) => record.employeeId)).size
      const daySummaries = buildBranchDaySummaries(availableRecords, weekDays, priorityRules)
      const coverageGapCount = daySummaries.reduce((total, day) => total + day.coverageGapCount, 0)
      const status = registeredEmployeeCount === 0
        ? 'not_registered'
        : coverageGapCount > 0
          ? 'needs_attention'
          : 'registered'

      return {
        branch,
        employeeCount: branchEmployees.length,
        registeredEmployeeCount,
        totalMinutes: sumRegistrationMinutes(availableRecords),
        coverageGapCount,
        daySummaries,
        status,
      }
    })
}

export function buildBranchDaySummaries(
  records: WorkRegistrationRecord[],
  weekDays: Date[],
  priorityRules: WorkPrioritySlotRule[]
) {
  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  return weekDays.map((day) => {
    const dateKey = toWorkDateKey(day)
    const dayRecords = records.filter((record) => record.date === dateKey)
    const wd = weekdays[day.getDay()]

    return {
      date: dateKey,
      label: wd,
      registeredEmployeeCount: new Set(dayRecords.map((record) => record.employeeId)).size,
      totalMinutes: sumRegistrationMinutes(dayRecords),
      coverageGapCount: countCoverageGaps(dayRecords, dateKey, priorityRules),
    }
  })
}

export function countCoverageGaps(
  dayRecords: WorkRegistrationRecord[],
  dateKey: string,
  priorityRules: WorkPrioritySlotRule[]
) {
  return WORK_TIME_SLOTS.reduce((total, slot) => {
    const required = getPriorityRequirement(dateKey, slot.id, priorityRules)
    if (required === 0) return total
    const coveredEmployees = new Set(
      dayRecords
        .filter((record) => record.slotId === slot.id && record.status !== 'draft')
        .map((record) => record.employeeId)
    )
    return coveredEmployees.size < required ? total + 1 : total
  }, 0)
}

export function getMonthMatrix(anchor: Date) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const firstMonday = new Date(first)
  const day = firstMonday.getDay()
  firstMonday.setDate(firstMonday.getDate() - (day === 0 ? 6 : day - 1))
  firstMonday.setHours(0, 0, 0, 0)

  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, index) => {
      const date = new Date(firstMonday)
      date.setDate(date.getDate() + week * 7 + index)
      date.setHours(0, 0, 0, 0)
      return {
        date,
        dateKey: toWorkDateKey(date),
        inMonth: date.getMonth() === anchor.getMonth(),
      }
    })
  )
}

export function resolveWeekActionState(
  records: WorkRegistrationRecord[],
  weekStart: Date,
  currentWeekStart: Date
): WorkRegistrationActionState {
  const weekStartKey = toWorkDateKey(weekStart)
  const currentWeekStartKey = toWorkDateKey(currentWeekStart)
  const isPastWeek = weekStartKey < currentWeekStartKey
  const hasRegistered = records.some((record) => record.status === 'registered')
  const hasDraft = records.some((record) => record.status === 'draft')
  const readonlyWeek = isPastWeek

  if (isPastWeek) {
    return {
      readonlyWeek,
      canMutate: false,
      primaryActionLabel: 'Lưu đăng ký',
      actionHelperText: 'Tuần đã qua chỉ được xem',
    }
  }

  if (hasRegistered) {
    return {
      readonlyWeek,
      canMutate: true,
      primaryActionLabel: 'Lưu đăng ký',
      actionHelperText: 'Tuần đã đăng ký; thay đổi sẽ cập nhật khả dụng',
    }
  }

  if (hasDraft) {
    return {
      readonlyWeek,
      canMutate: true,
      primaryActionLabel: 'Lưu đăng ký',
      actionHelperText: 'Bản nháp chưa đưa vào vận hành',
    }
  }

  return {
    readonlyWeek,
    canMutate: true,
    primaryActionLabel: 'Lưu đăng ký',
    actionHelperText: 'Tuần mới; lưu để tạo lịch khả dụng',
  }
}

export function resolveClassCode(className?: string, assignedCode?: string): string {
  if (assignedCode) return assignedCode
  if (!className) return 'CLS-001'
  if (className.includes('IELTS Intensive')) return 'CLS-IELTS-031'
  if (className.includes('Kids Level 1') || className.includes('Kids')) return 'CLS-KIDS-001'
  if (className.includes('Band 6.5')) return 'CLS-IELTS-005'
  if (className.includes('IELTS')) return 'CLS-IELTS-001'
  return 'CLS-ENG-001'
}

export function resolveDynamicLessonInfo(
  classCode: string,
  className: string,
  dateStr?: string
) {
  let sessionNum = 12
  if (dateStr) {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      const startOfYear = new Date(d.getFullYear(), 0, 1)
      const pastDaysOfYear = (d.getTime() - startOfYear.getTime()) / 86400000
      const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
      sessionNum = ((weekNum * 2) % 24) || 12
    }
  }

  const isIELTS = classCode.includes('IELTS') || className.toLowerCase().includes('ielts')
  const isKids = classCode.includes('KIDS') || className.toLowerCase().includes('kids')
  const isMath = classCode.includes('MATH') || className.toLowerCase().includes('toán')
  const isStem = classCode.includes('STEM') || className.toLowerCase().includes('stem')

  if (isIELTS) {
    const ieltsTopics = [
      {
        title: `Lesson ${sessionNum}: Writing Task 2 - Problem & Solution Essay`,
        subtitle: 'Phân tích đề bài & lập luận logic',
        content: 'Cấu trúc bài viết nguyên nhân - giải pháp, phân tích đề bài, lập dàn ý 4 đoạn & vận dụng từ vựng học thuật band 6.5+ chủ đề Urbanization & Environment.',
      },
      {
        title: `Lesson ${sessionNum}: Speaking Part 3 - Abstract Discussion & Speculation`,
        subtitle: 'Kỹ năng phản xạ & mở rộng câu trả lời',
        content: 'Luyện tập kỹ thuật trả lời đa chiều, mở rộng lập luận với cấu trúc nhượng bộ và thành ngữ học thuật chủ đề Technology in Education.',
      },
      {
        title: `Lesson ${sessionNum}: Reading Academic - Matching Headings & True/False/Not Given`,
        subtitle: 'Chiến thuật Skimming & Scanning nâng cao',
        content: 'Phương pháp định vị từ khóa paraphrasing, phân biệt Fact vs Opinion và xử lý các câu bẫy thông tin đối với dạng bài Matching Headings.',
      },
    ]
    const topic = ieltsTopics[sessionNum % ieltsTopics.length]!
    return {
      sessionNum,
      title: topic.title,
      subtitle: topic.subtitle,
      content: topic.content,
      subject: 'IELTS Academic',
      level: 'Band 5.5 - 6.5',
    }
  }

  if (isKids) {
    const kidsTopics = [
      {
        title: 'Story time: My Family Adventure',
        subtitle: 'Đọc tranh theo nhóm & Kể chuyện',
        content: 'Đọc tranh theo nhóm: Giới thiệu các thành viên trong gia đình, luyện mẫu câu hỏi đáp & từ vựng mở rộng.',
      },
      {
        title: `Interactive Phonics: Sound & Word Play (Buổi ${sessionNum})`,
        subtitle: 'Phát âm chuẩn & ghép vần tương tác',
        content: 'Nhận diện phụ âm đầu /b/, /p/, /d/, ghép từ qua trò chơi thẻ hình và luyện nói câu chào hỏi theo ngữ cảnh sinh hoạt.',
      },
      {
        title: `My Colorful World: Animals & Shapes (Buổi ${sessionNum})`,
        subtitle: 'Từ vựng chủ đề thế giới động vật',
        content: 'Nhận biết tên các loài động vật thân quen, đếm số lượng từ 1-10 và mô tả màu sắc hình khối qua bài hát vui nhộn.',
      },
    ]
    const topic = kidsTopics[sessionNum % kidsTopics.length]!
    return {
      sessionNum,
      title: topic.title,
      subtitle: topic.subtitle,
      content: topic.content,
      subject: 'Tiếng Anh',
      level: 'Kids Level 1',
    }
  }

  if (isMath) {
    return {
      sessionNum,
      title: `Buổi ${sessionNum}: Tư duy hình học không gian & Phép tính logic`,
      subtitle: 'Tư duy logic & giải quyết vấn đề',
      content: 'Luyện tập phương pháp chia nhỏ bài toán, nhận diện quy luật dãy số và mô hình hóa hình học bằng trực quan sinh động.',
      subject: 'Toán tư duy',
      level: 'Tiểu học',
    }
  }

  if (isStem) {
    return {
      sessionNum,
      title: `Session ${sessionNum}: Robotics Architecture & Block Coding`,
      subtitle: 'Lập trình robot & cơ chế chuyển động',
      content: 'Lắp ráp mô hình cảm biến tiệm cận, lập trình khối điều khiển động cơ bước và thực hành vượt chướng ngại vật theo nhóm.',
      subject: 'STEM Robotics',
      level: 'Level 2',
    }
  }

  return {
    sessionNum,
    title: `Lesson ${sessionNum}: Communication & Practical Speaking`,
    subtitle: 'Thực hành giao tiếp chủ đề đời sống',
    content: 'Mở rộng vốn từ vựng thông dụng, luyện ngữ điệu hội thoại tự nhiên và phản xạ xử lý tình huống giao tiếp thực tế.',
    subject: 'Tiếng Anh',
    level: 'Tiêu chuẩn',
  }
}

export function resolveClassSessionHoverData(
  record: WorkRegistrationRecord,
  employeeName: string,
  slotLabel: string,
  branchName: string = 'RinoEdu Linh Đàm'
) {
  const className = record.assignedClass || 'Tiếng Anh Trial Level 2'
  const classCode = resolveClassCode(className, record.assignedClassCode)
  const dynamicLesson = resolveDynamicLessonInfo(classCode, className, record.date)

  return {
    id: `session-${record.id}`,
    title: dynamicLesson.title,
    className: className,
    classCode: classCode,
    subject: dynamicLesson.subject,
    level: dynamicLesson.level,
    subtitle: dynamicLesson.subtitle,
    lessonSubtitle: dynamicLesson.title,
    lessonContent: dynamicLesson.content,
    timeSlot: slotLabel || '15:30 - 17:30',
    timeLabel: slotLabel?.split('-')[0]?.trim() || '15:30',
    endTimeLabel: slotLabel?.split('-')[1]?.trim() || '17:30',
    schoolRoom: 'Phòng 1',
    roomName: 'Phòng 1',
    branch: branchName || record.branch || 'RinoEdu Linh Đàm',
    teacher: employeeName || 'Thu Hà',
    teacherName: employeeName || 'Thu Hà',
    assistantTeacher: 'Đức Anh',
    taName: 'Đức Anh',
    totalStudents: 16,
    officialStudents: 14,
    trialStudents: 2,
    studentCount: 16,
    capacity: 18,
    status: 'happening',
  }
}

export interface SlotInterval {
  start: string
  end: string
  slotIds: string[]
  status: WorkRegistrationStatus
  isDraft: boolean
  isRegistered: boolean
  isLocked: boolean
}

export function groupConsecutiveSlots(
  records: WorkRegistrationRecord[],
  employeeId: string,
  date: string,
  section: string
): SlotInterval[] {
  const sectionSlots = WORK_TIME_SLOTS.filter((s) => s.section === section)
  const employeeSlotMap = new Map<string, WorkRegistrationRecord>()
  for (const r of records) {
    if (r.employeeId === employeeId && r.date === date && r.slotId.startsWith(section) && !r.assignedClass) {
      employeeSlotMap.set(r.slotId, r)
    }
  }

  const intervals: SlotInterval[] = []
  let currentInterval: {
    start: string
    end: string
    slotIds: string[]
    hasDraft: boolean
    hasLocked: boolean
  } | null = null

  for (const slot of sectionSlots) {
    const record = employeeSlotMap.get(slot.id)
    if (record) {
      const isDraft = record.status === 'draft'
      const isLocked = record.status === 'locked'

      if (!currentInterval) {
        currentInterval = {
          start: slot.start,
          end: slot.end,
          slotIds: [slot.id],
          hasDraft: isDraft,
          hasLocked: isLocked,
        }
      } else {
        currentInterval.end = slot.end
        currentInterval.slotIds.push(slot.id)
        if (isDraft) currentInterval.hasDraft = true
        if (isLocked) currentInterval.hasLocked = true
      }
    } else {
      if (currentInterval) {
        const status: WorkRegistrationStatus = currentInterval.hasDraft
          ? 'draft'
          : currentInterval.hasLocked
          ? 'locked'
          : 'registered'

        intervals.push({
          start: currentInterval.start,
          end: currentInterval.end,
          slotIds: currentInterval.slotIds,
          status,
          isDraft: status === 'draft',
          isRegistered: status === 'registered',
          isLocked: status === 'locked',
        })
        currentInterval = null
      }
    }
  }

  if (currentInterval) {
    const status: WorkRegistrationStatus = currentInterval.hasDraft
      ? 'draft'
      : currentInterval.hasLocked
      ? 'locked'
      : 'registered'

    intervals.push({
      start: currentInterval.start,
      end: currentInterval.end,
      slotIds: currentInterval.slotIds,
      status,
      isDraft: status === 'draft',
      isRegistered: status === 'registered',
      isLocked: status === 'locked',
    })
  }

  return intervals
}

export function timeToMinutes(time: string): number {
  if (!time) return 0
  const [hours = 0, minutes = 0] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export function calculateSlotPosition(
  startTime: string,
  endTime: string,
  sectionStartTime: string,
  sectionEndTime: string
): { topPercent: number; heightPercent: number } {
  const startMin = timeToMinutes(startTime)
  const endMin = timeToMinutes(endTime)
  const secStartMin = timeToMinutes(sectionStartTime)
  const secEndMin = timeToMinutes(sectionEndTime)
  const totalDuration = Math.max(1, secEndMin - secStartMin)

  const topPercent = Math.max(0, Math.min(100, ((startMin - secStartMin) / totalDuration) * 100))
  const heightPercent = Math.max(0, Math.min(100 - topPercent, ((endMin - startMin) / totalDuration) * 100))

  return { topPercent, heightPercent }
}

export function getSectionHourTicks(sectionId: ShiftSection): Array<{ time: string; topPercent: number }> {
  if (sectionId === 'morning') {
    return [
      { time: '09:00', topPercent: 25 },
      { time: '10:00', topPercent: 50 },
      { time: '11:00', topPercent: 75 },
    ]
  }
  if (sectionId === 'afternoon') {
    return [
      { time: '14:00', topPercent: (60 / 270) * 100 },
      { time: '15:00', topPercent: (120 / 270) * 100 },
      { time: '16:00', topPercent: (180 / 270) * 100 },
      { time: '17:00', topPercent: (240 / 270) * 100 },
    ]
  }
  return [
    { time: '18:30', topPercent: (60 / 270) * 100 },
    { time: '19:30', topPercent: (120 / 270) * 100 },
    { time: '20:30', topPercent: (180 / 270) * 100 },
    { time: '21:30', topPercent: (240 / 270) * 100 },
  ]
}

export function formatDurationShort(minutes: number): string {
  if (minutes <= 0) return '0h'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}p`
  if (rest === 0) return `${hours}h`
  return `${hours}h${rest < 10 ? '0' : ''}${rest}`
}

export function calculateDailyRegistrationMinutes(
  records: WorkRegistrationRecord[],
  employeeId: string,
  dateKey: string
): number {
  return records
    .filter((r) => r.employeeId === employeeId && r.date === dateKey)
    .reduce((sum, r) => {
      const slot = WORK_TIME_SLOTS.find((s) => s.id === r.slotId)
      return sum + (slot?.minutes || 0)
    }, 0)
}

export function calculateSectionRegistrationMinutes(
  records: WorkRegistrationRecord[],
  employeeId: string,
  sectionId: string
): { totalMinutes: number; shiftCount: number } {
  const sectionRecords = records.filter(
    (r) => r.employeeId === employeeId && r.slotId.startsWith(sectionId)
  )
  const uniqueDays = new Set(sectionRecords.map((r) => r.date))
  const totalMinutes = sectionRecords.reduce((sum, r) => {
    const slot = WORK_TIME_SLOTS.find((s) => s.id === r.slotId)
    return sum + (slot?.minutes || 0)
  }, 0)
  return { totalMinutes, shiftCount: uniqueDays.size }
}

