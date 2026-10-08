import { getTrialClasses, getMockSessionsForClass, type TrialClassStatus, type TrialClass } from '@/mocks/trialClasses'
export type { TrialClass }
import type { CreateTrialClassForm, StatusTileId, TrialClassFilterState, TrialResultFilterId, TrialSortField, SortDirection } from './trialClassTypes'
import { STATUS_META, MOCK_CLASS_OPTIONS } from './trialClassConstants'
import { mockClassRecords } from '@/mocks/classRecords'
import { mockEmployees } from '@/mocks/employees'
import { mockLeads } from '@/mocks/crmLeads'
import type { PersonnelItem } from '@/components/shared'

export function formatTrialDate(dateStr: string): string {
  if (!dateStr) return '—'
  const [date, time] = dateStr.split(' ')
  const parts = date.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}${time ? ` ${time}` : ''}`
}

export function formatSessionDateOnly(dateStr: string): string {
  if (!dateStr) return '—'
  const [date] = dateStr.split(' ')
  const parts = date.split('-')
  if (parts.length !== 3) return dateStr
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—'
  const [date] = dateStr.split(' ')
  const parts = date.split('-')
  if (parts.length !== 3) return '—'
  return `${parts[2]}/${parts[1]}`
}

export function formatTimeOnly(dateStr: string): string {
  if (!dateStr) return '—'
  const parts = dateStr.split(' ')
  return parts[1] ?? '—'
}

const WEEKDAYS_VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export function getWeekdayAbbr(dateStr: string): string {
  if (!dateStr) return ''
  const [datePart] = dateStr.split(' ')
  const d = new Date(datePart)
  if (isNaN(d.getTime())) return ''
  return WEEKDAYS_VI[d.getDay()] ?? ''
}

export function getEndTime(startTimeStr: string): string {
  if (!startTimeStr) return ''
  const [hStr, mStr] = startTimeStr.split(':')
  if (!hStr || !mStr) return ''
  let h = parseInt(hStr, 10)
  let m = parseInt(mStr, 10) + 90
  h += Math.floor(m / 60)
  m = m % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

import type { GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'

export function formatSessionDateTimeRange(dateStr: string): string {
  if (!dateStr) return '—'
  const weekday = getWeekdayAbbr(dateStr)
  const dateShort = formatDateShort(dateStr)
  const startTime = formatTimeOnly(dateStr)
  const endTime = getEndTime(startTime)
  const timeRange = endTime ? `${startTime} - ${endTime}` : startTime
  return `${weekday} ${dateShort} · ${timeRange}`
}

export function buildTrialSessionData(trial: TrialClass): GenericSessionData | null {
  if (!trial.sessions || trial.sessions.length === 0) return null
  const sess = trial.sessions[0]
  const dateStr = sess.trialDate || ''
  const startTime = formatTimeOnly(dateStr)
  const endTime = getEndTime(startTime)
  const timeSlot = endTime ? `${startTime} - ${endTime}` : startTime

  // 1. Tìm thông tin lớp trong MOCK_CLASS_OPTIONS hoặc mockClassRecords
  const classOpt = MOCK_CLASS_OPTIONS.find(
    (c) =>
      c.classId.toLowerCase() === sess.classId?.toLowerCase() ||
      c.className.toLowerCase() === sess.className?.toLowerCase()
  )

  const classRecord = mockClassRecords.find(
    (c) =>
      c.code.toLowerCase() === sess.classId?.toLowerCase() ||
      c.id.toLowerCase() === sess.classId?.toLowerCase() ||
      c.name.toLowerCase() === sess.className?.toLowerCase()
  )

  // 2. Giáo viên & Trợ giảng
  const teacher = classOpt?.teacher || classRecord?.teacher || trial.owner || 'Ms. Sarah'
  const assistantTeacher = classRecord?.assistant || 'Cô Lan Anh'

  // 3. Sĩ số & Sức chứa
  const mockSessions = getMockSessionsForClass(sess.classId)
  const matchedSession = mockSessions?.find(
    (s) => s.id === sess.sessionId || s.name === sess.sessionName
  ) || mockSessions?.[0]

  const totalStudents = matchedSession?.attendees ?? classOpt?.enrolledStudents ?? classRecord?.enrolledStudents ?? 12
  const capacity = matchedSession?.capacity ?? classOpt?.maxStudents ?? classRecord?.maxStudents ?? 15
  const trialStudents = classRecord?.trialStudents ?? 1

  // 4. Phòng học & Cơ sở
  const schoolRoom = classRecord?.room || 'Phòng 201'
  const branch = trial.branch || trial.school || classRecord?.branch || 'RinoEdu Nguyễn Tuân'

  // 5. Tiêu đề / Bài học
  const lessonTitle = sess.sessionName || 'Buổi học ghép'

  return {
    id: sess.classId,
    className: sess.className,
    classCode: sess.classId,
    title: lessonTitle,
    lessonSubtitle: sess.sessionName,
    subject: trial.subject,
    level: trial.program,
    branch,
    schoolRoom,
    date: sess.trialDate,
    timeLabel: startTime,
    endTimeLabel: endTime,
    timeSlot,
    scheduleType: 'class',
    teacher,
    teacherName: teacher,
    assistantTeacher,
    totalStudents,
    capacity,
    trialStudents,
  }
}

export function countStatus(trials: TrialClass[], id: string): number {
  if (id === 'all') return trials.length
  if (id === 'unassigned') return trials.filter((t) => t.sessions.length === 0).length
  if (id === 'confirmed') return trials.filter((t) => t.status === 'confirmed' || t.status === 'reschedule').length
  if (id === 'expired') return trials.filter((t) => (t.status as string) === 'expired' || t.status === 'cancelled').length
  return trials.filter((t) => t.status === id).length
}

export function getTrialStatusLabel(status: string) {
  if (status === 'reschedule') return 'Đã ghép lớp'
  if (status === 'no_show') return 'Không đến'
  return STATUS_META[status as keyof typeof STATUS_META]?.label ?? status
}

export function getTrialFamilyMembers(trial: TrialClass) {
  if (trial.familyMembers?.length) return trial.familyMembers
  return [{ name: trial.parentName || trial.familyName, phone: trial.familyPhone, isPrimary: true }]
}

export function canAssign(trial: TrialClass): boolean {
  return trial.status === 'pending_approval' || trial.status === 'reschedule'
}

export function canRequestReschedule(trial: TrialClass): boolean {
  return trial.status === 'confirmed'
}

export function canCancel(trial: TrialClass): boolean {
  return !['cancelled', 'completed', 'no_show'].includes(trial.status)
}

export type TrialClassUpdater = TrialClass[] | ((current: TrialClass[]) => TrialClass[])

export function readTrialClasses(): { trials: TrialClass[]; error: Error | null } {
  try {
    return { trials: getTrialClasses(), error: null }
  } catch (error) {
    return {
      trials: [],
      error: error instanceof Error ? error : new Error('Không thể tải dữ liệu booking học thử.'),
    }
  }
}

export function buildEmptyCreateForm(): CreateTrialClassForm {
  return {
    studentId: '',
    studentName: '',

    school: '',
    program: '',
    subject: '',
    notes: '',

    selectedSessions: [],
  }
}

export function buildTrialFromCreateForm({
  id,
  form,
  activeBranch,
  branchOptions,
  now,
}: {
  id: string
  form: CreateTrialClassForm
  activeBranch: string
  branchOptions: string[]
  now: string
}): TrialClass {
  return {
    id,
    trialName: form.studentName
      ? `Học thử ${form.program} — ${form.studentName}`
      : `Học thử ${form.program}`,
    customerId: `KH-${Date.now().toString().slice(-6)}`,
    studentName: form.studentName,
    parentName: '',
    familyName: '',
    familyPhone: '',
    attempt: 'Lần 1',
    school: form.school,
    program: form.program,
    subject: form.subject,
    status: form.selectedSessions.length > 0 ? 'confirmed' : 'pending_approval',
    creator: 'Người dùng hiện tại',
    owner: 'Chưa gán',
    notes: form.notes,
    sessions: form.selectedSessions.map(s => ({
      classId: s.classId,
      className: s.className,
      sessionId: s.sessionId,
      sessionName: s.sessionName,
      trialDate: s.trialDate,
    })),
    branch: activeBranch === 'all'
      ? form.school
      : branchOptions.find((branch) => form.school.includes(branch)) ?? form.school,
    auditLog: [{ timestamp: now, author: 'Người dùng hiện tại', action: 'Tạo booking' }],
  }
}

export function applyTrialAssignment(
  trial: TrialClass,
  assignment: {
    sessions: import('./trialClassTypes').TrialSessionSelection[]
    notes: string
    now: string
  }
): TrialClass {
  return {
    ...trial,
    sessions: assignment.sessions,
    status: 'pending_approval' as TrialClassStatus,
    notes: assignment.notes || trial.notes,
    auditLog: [
      ...trial.auditLog,
      {
        timestamp: assignment.now,
        author: 'Người dùng hiện tại',
        action: 'Ghép lớp (Chờ xác nhận)',
        detail: `Đã chọn ${assignment.sessions.length} buổi học`,
      },
    ],
  }
}

export function applyTrialReschedule(
  trial: TrialClass,
  reason: string,
  notes: string,
  now: string
): TrialClass {
  const oldSession = trial.sessions.length > 0 ? trial.sessions[0] : undefined

  return {
    ...trial,
    sessions: [],
    status: 'reschedule' as TrialClassStatus,
    previousSession: oldSession,
    cancelReason: reason,
    notes: notes || trial.notes,
    auditLog: [
      ...trial.auditLog,
      { timestamp: now, author: 'Người dùng hiện tại', action: 'Yêu cầu đổi lịch', detail: reason },
      oldSession
        ? { timestamp: now, author: 'Hệ thống', action: 'Giải phóng lớp cũ', detail: `${oldSession.className} — ${trial.sessions.length} buổi` }
        : null,
    ].filter(Boolean) as TrialClass['auditLog'],
  }
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

export function filterTrialClasses(
  trials: TrialClass[],
  search: string,
  activeBranch: string,
  activeStatus: StatusTileId,
  filters: TrialClassFilterState,
  activeSubject?: string,
  activeResultFilter?: TrialResultFilterId
): TrialClass[] {
  return trials.filter((trial) => {
    if (activeBranch !== 'all' && trial.branch !== activeBranch) return false
    if (activeStatus !== 'all') {
      if (activeStatus === 'confirmed' && trial.status !== 'confirmed' && trial.status !== 'reschedule') return false
      if (activeStatus !== 'confirmed' && trial.status !== activeStatus) return false
    }
    if (activeResultFilter && activeResultFilter !== 'all') {
      if (activeResultFilter === 'unassigned' && trial.sessions.length > 0) return false
      if (activeResultFilter === 'completed' && trial.status !== 'completed') return false
      if (activeResultFilter === 'no_show' && trial.status !== 'no_show') return false
      if (activeResultFilter === 'expired' && (trial.status as string) !== 'expired' && trial.status !== 'cancelled') return false
    }
    if (activeSubject && activeSubject !== 'all') {
      const ts = trial.subject.toLowerCase()
      if (activeSubject === 'english' && !ts.includes('anh')) return false
      if (activeSubject === 'math' && !ts.includes('toán')) return false
      if (activeSubject === 'stem' && !ts.includes('stem')) return false
    }
    if (filters.programs.length > 0 && !filters.programs.includes(trial.program)) return false
    if (filters.creators.length > 0 && !filters.creators.includes(trial.creator)) return false
    if (filters.subjects.length > 0 && !filters.subjects.includes(trial.subject)) return false
    if (filters.owners.length > 0 && !filters.owners.includes(trial.owner)) return false
    if (filters.statuses.length > 0 && !filters.statuses.includes(trial.status)) return false
    if (filters.schools.length > 0 && !filters.schools.includes(trial.school)) return false
    if (filters.weekdays && filters.weekdays.length > 0) {
      if (trial.sessions.length === 0) return false
      const dayLabel = getWeekdayLabel(trial.sessions[0].trialDate)
      if (!filters.weekdays.includes(dayLabel)) return false
    }
    if (search) {
      const q = search.toLowerCase()
      const haystack = [
        trial.id,
        trial.trialName,
        trial.studentName,
        trial.customerId,
        trial.familyPhone,
        trial.program,
      ].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone
  return phone.slice(0, 4) + '****' + phone.slice(-2)
}

import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'

export function getLeaveReserveTicketForTrial(studentName: string, familyPhone: string): LeaveReserveRequest | null {
  const cleanPhone = familyPhone.replace(/\s+/g, '')
  return mockLeaveReserveRequests.find((r) => {
    const isNameMatch = r.studentName.toLowerCase() === studentName.toLowerCase()
    const cleanRequestPhone = r.phone.replace(/\s+/g, '')
    const isPhoneMatch = cleanRequestPhone.length > 0 && cleanRequestPhone === cleanPhone
    return (isNameMatch || isPhoneMatch) && (r.type === 'reservation' || r.type === 'off')
  }) || null
}

const STUDENT_DEMOGRAPHICS: Record<string, { age: number; birthYear: number; dob?: string; gender?: 'Nam' | 'Nữ' }> = {
  'Nguyễn An': { age: 11, birthYear: 2015, dob: '15/03/2015', gender: 'Nam' },
  'Bùi Hoàng Phúc': { age: 8, birthYear: 2018, gender: 'Nam' },
  'Nguyễn Minh Anh': { age: 6, birthYear: 2020, gender: 'Nữ' },
  'Hoàng Gia Bảo': { age: 7, birthYear: 2019, gender: 'Nam' },
  'Trương Minh Khang': { age: 9, birthYear: 2017, gender: 'Nam' },
  'Lê Chi': { age: 12, birthYear: 2014, gender: 'Nữ' },
  'Trần Bảo Nam': { age: 8, birthYear: 2018, gender: 'Nam' },
  'Đỗ Khánh Linh': { age: 11, birthYear: 2015, gender: 'Nữ' },
  'Phạm Đức Minh': { age: 10, birthYear: 2016, gender: 'Nam' },
  'Vũ Đức Huy': { age: 8, birthYear: 2018, gender: 'Nam' },
  'Phạm Thùy Linh': { age: 10, birthYear: 2016, gender: 'Nữ' },
  'Ngô Gia Huy': { age: 9, birthYear: 2017, gender: 'Nam' },
  'Vũ Tue Nhi': { age: 7, birthYear: 2019, gender: 'Nữ' },
  'Vũ Tuệ Nhi': { age: 7, birthYear: 2019, gender: 'Nữ' },
}

export function getStudentAgeText(trial: TrialClass): string {
  const name = (trial.studentName || '').trim()
  const demo = STUDENT_DEMOGRAPHICS[name]

  // 1. Xác định giới tính (Nam / Nữ)
  let gender = trial.studentGender || demo?.gender
  if (!gender) {
    const matchedLead = mockLeads.find((l) => l.studentName?.toLowerCase() === name.toLowerCase())
    if (matchedLead?.studentGender) {
      gender = matchedLead.studentGender
    } else {
      const lowerName = name.toLowerCase()
      const femaleKeywords = ['thị', 'chi', 'linh', 'nhi', 'hương', 'mai', 'ngọc', 'trang', 'hà', 'phương', 'lan', 'vy', 'hân', 'my', 'châu', 'yến']
      const isFemale = femaleKeywords.some((kw) => lowerName.includes(kw))
      gender = isFemale ? 'Nữ' : 'Nam'
    }
  }

  // 2. Xác định tuổi & năm sinh
  let age = trial.studentAge || demo?.age
  let birthYear = trial.studentBirthYear || demo?.birthYear

  if (!birthYear && demo?.dob) {
    const parts = demo.dob.split('/')
    if (parts.length === 3) {
      birthYear = parseInt(parts[2], 10)
    }
  }

  if (age && !birthYear) {
    birthYear = new Date().getFullYear() - age
  } else if (!age && birthYear) {
    age = new Date().getFullYear() - birthYear
  } else if (!age && !birthYear) {
    age = 8
    birthYear = 2018
  }

  // Định dạng chuẩn dòng 2 theo yêu cầu: "Giới tính, x T, Năm sinh" (Ví dụ: "Nam, 8 T, 2018")
  return `${gender}, ${age} T, ${birthYear}`
}

export function getAttemptNumber(attempt?: string): string {
  if (!attempt) return '1'
  const match = attempt.match(/\d+/)
  return match ? match[0] : '1'
}

export function getProgramAndLevel(trial: TrialClass): string {
  if (!trial.sessions || trial.sessions.length === 0) return trial.program || '—'
  const sess = trial.sessions[0]
  if (sess.className) {
    const program = trial.program || ''
    if (program && sess.className.startsWith(program)) {
      const levelPart = sess.className.slice(program.length).trim()
      return levelPart ? `${program} · ${levelPart}` : program
    }
    return sess.className
  }
  return trial.program || '—'
}

export function getProgramSubjectColor(trial: { subject?: string; program?: string }): string {
  const s = `${trial.subject || ''} ${trial.program || ''}`.toLowerCase()
  if (s.includes('stem') || s.includes('robotics') || s.includes('coding')) {
    return 'text-purple-600 dark:text-purple-400'
  }
  if (s.includes('toán') || s.includes('math')) {
    return 'text-amber-600 dark:text-amber-400'
  }
  return 'text-blue-600 dark:text-blue-400'
}

export function sortTrialClasses(
  items: TrialClass[],
  sortField: TrialSortField,
  direction: SortDirection
): TrialClass[] {
  const sorted = [...items]
  const factor = direction === 'asc' ? 1 : -1

  sorted.sort((a, b) => {
    if (sortField === 'studentName') {
      return factor * a.studentName.localeCompare(b.studentName, 'vi')
    }

    if (sortField === 'trialDate') {
      const aDate = a.sessions[0]?.trialDate || ''
      const bDate = b.sessions[0]?.trialDate || ''
      if (!aDate && !bDate) return 0
      if (!aDate) return -factor
      if (!bDate) return factor
      return factor * aDate.localeCompare(bDate)
    }

    if (sortField === 'status') {
      const STATUS_WEIGHT: Record<string, number> = {
        pending_approval: 1,
        reschedule: 2,
        rejected: 3,
        confirmed: 4,
        completed: 5,
        no_show: 6,
        cancelled: 7,
      }
      const aWeight = STATUS_WEIGHT[a.status] ?? 99
      const bWeight = STATUS_WEIGHT[b.status] ?? 99
      return factor * (aWeight - bWeight)
    }

    if (sortField === 'createdAt') {
      const aTime = a.auditLog[0]?.timestamp || a.id
      const bTime = b.auditLog[0]?.timestamp || b.id
      return factor * aTime.localeCompare(bTime)
    }

    return 0
  })

  return sorted
}

export function buildPersonnelItem(
  name: string | undefined,
  defaultRole: string,
  defaultPhone = '0912 345 678'
): PersonnelItem {
  if (!name) {
    return {
      name: 'Chưa xác định',
      role: defaultRole,
      phone: defaultPhone,
      email: 'staff@rinoedu.vn',
    }
  }

  const cleanName = name.trim().toLowerCase()
  const matched = mockEmployees.find(
    (emp) =>
      emp.name.toLowerCase() === cleanName ||
      emp.name.toLowerCase().includes(cleanName) ||
      cleanName.includes(emp.name.toLowerCase())
  )

  if (matched) {
    return {
      id: matched.id,
      name: matched.name,
      role: matched.position || defaultRole,
      avatar: matched.avatar,
      phone: matched.phone,
      email: matched.email,
    }
  }

  return {
    name,
    role: defaultRole,
    phone: defaultPhone,
    email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
  }
}

