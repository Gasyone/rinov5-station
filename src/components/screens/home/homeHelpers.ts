import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import type { ClassSession } from '@/mocks/calendarSchedule'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'
import type { BookingTest } from '@/mocks/bookingTests'
import type {
  HomeClassMetrics,
  TodayScheduleItem,
  CareAvatarItem,
  RenewalAvatarItem,
  DailyTodoItem,
} from './homeTypes'

const STUDENT_AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
]

function getAvatarForStudent(id: string, name: string): string {
  const found = mockStudents.find((s) => s.id === id || s.name.toLowerCase() === name.toLowerCase())
  if (found?.avatar) return found.avatar
  let hash = 0
  const key = id + name
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % STUDENT_AVATAR_PRESETS.length
  return STUDENT_AVATAR_PRESETS[index]
}

export function formatDateVietnamese(date: Date): string {
  const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const dayName = daysOfWeek[date.getDay()]
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${dayName}, ${day}/${month}/${year}`
}

export function toDateKeyString(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function computeHomeClassMetrics(classes: ClassRecord[], branch: string): HomeClassMetrics {
  const filtered = branch === 'all'
    ? classes
    : classes.filter((c) => c.branch === branch || c.branch.toLowerCase().includes(branch.toLowerCase()))

  const activeClasses = filtered.filter((c) => c.status === 'dang_hoc')
  const upcomingClasses = filtered.filter((c) => c.status === 'cho_khai_giang' || c.status === 'mo_chieu_sinh')

  const totalEnrolled = filtered.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0)
  const totalCapacity = filtered.reduce((acc, c) => acc + (c.maxStudents || 15), 0)
  const capacityFillRate = totalCapacity > 0 ? Number(((totalEnrolled / totalCapacity) * 100).toFixed(1)) : 0

  const attendanceRates = filtered
    .map((c) => c.attendanceRate)
    .filter((r): r is number => typeof r === 'number' && r > 0)

  const avgAttendance = attendanceRates.length > 0
    ? Number((attendanceRates.reduce((a, b) => a + b, 0) / attendanceRates.length).toFixed(1))
    : 94.6

  const specialCareClasses = filtered.filter(
    (c) => (c.specialCareCount && c.specialCareCount > 0) || c.status === 'tam_dung'
  ).length

  return {
    activeClassesCount: activeClasses.length,
    upcomingClassesCount: upcomingClasses.length,
    totalEnrolledStudents: totalEnrolled,
    maxCapacity: totalCapacity,
    capacityFillRate,
    avgAttendanceRate: avgAttendance,
    specialCareClassesCount: specialCareClasses,
    todaySessionsCount: 0,
  }
}

export function getTodayScheduleItems(
  sessions: ClassSession[],
  bookingTests: BookingTest[],
  branch: string,
  selectedDateStr: string
): TodayScheduleItem[] {
  const branchFilter = (b: string) =>
    branch === 'all' || b === branch || b.toLowerCase().includes(branch.toLowerCase())

  // Class Sessions for the selected date
  const filteredSessions = sessions.filter((s) => {
    const isDateMatch = s.date === selectedDateStr || s.dateBucket === 'today'
    return isDateMatch && branchFilter(s.branch)
  })

  const classItems: TodayScheduleItem[] = filteredSessions.map((s) => {
    let computedStatus: TodayScheduleItem['status'] = 'upcoming'
    if (s.status === 'completed' || s.dateBucket === 'past') {
      computedStatus = 'completed'
    } else if (s.status === 'cancelled') {
      computedStatus = 'cancelled'
    } else if (s.status === 'confirmed' || s.dateBucket === 'today') {
      computedStatus = 'in_progress'
    }

    return {
      id: s.id,
      classCode: s.classCode,
      className: s.className,
      subject: s.subject || 'Tiếng Anh',
      level: s.level || 'Tổng quát',
      room: s.schoolRoom || 'Phòng 101',
      branch: s.branch,
      startTime: s.timeLabel,
      endTime: s.endTimeLabel,
      timeLabel: `${s.timeLabel} - ${s.endTimeLabel}`,
      teacher: s.teacher,
      assistantTeacher: s.assistantTeacher,
      substituteTeacher: s.substituteTeacher,
      type: s.type === 'digi_session' ? 'digi_session' : s.type === 'test_session' ? 'test_session' : 'class_session',
      typeLabel: s.typeLabel || 'Buổi thường',
      totalStudents: s.totalStudents || 12,
      officialStudents: s.officialStudents || 10,
      trialStudents: s.trialStudents || 0,
      makeUpStudents: s.makeUpStudents || 0,
      status: computedStatus,
      statusLabel: s.statusLabel || 'Đã lên lịch',
      lessonTitle: s.title,
      rawSession: s,
    }
  })

  // Booking tests for intake today
  const bookingItems: TodayScheduleItem[] = bookingTests
    .filter((b) => branchFilter(b.school))
    .slice(0, 3)
    .map((b) => {
      const timeParts = b.testTime.split(' ')
      const timeStr = timeParts[1] || '09:00'
      const [h, m] = timeStr.split(':').map(Number)
      const endH = (h || 9) + 1
      const endTimeStr = `${String(endH).padStart(2, '0')}:${String(m || 0).padStart(2, '0')}`

      const bookingSession: ClassSession = {
        id: b.id,
        classCode: b.id,
        className: `Test năng lực: ${b.childName}`,
        title: `Test năng lực: ${b.childName}`,
        lessonSubtitle: `Kiểm tra xếp lớp cho học sinh ${b.childName}`,
        subject: b.subject === 'math' ? 'Toán tư duy' : 'Tiếng Anh',
        level: b.expectedLevel || b.program || 'Đầu vào',
        branch: b.school,
        schoolRoom: b.room || 'Phòng Tư Vấn',
        date: selectedDateStr,
        dateDisplay: 'Hôm nay',
        dateBucket: b.status === 'completed' ? 'past' : 'today',
        timeLabel: timeStr,
        endTimeLabel: endTimeStr,
        statusLabel: b.status === 'completed' ? 'Đã xong' : 'Chờ đón tiếp',
        type: 'test_session',
        typeLabel: 'Lịch Test Đón Tiếp',
        teacher: b.teacher || b.tester || b.ops || 'Tư vấn viên đón tiếp',
        totalStudents: 1,
        officialStudents: 0,
        trialStudents: 1,
        attendedStudents: b.status === 'completed' ? 1 : 0,
        status: b.status === 'completed' ? 'completed' : 'confirmed',
      }

      return {
        id: b.id,
        classCode: b.id,
        className: `Test năng lực: ${b.childName}`,
        subject: b.subject === 'math' ? 'Toán tư duy' : 'Tiếng Anh',
        level: b.expectedLevel || b.program || 'Đầu vào',
        room: b.room || 'Phòng Tư Vấn',
        branch: b.school,
        startTime: timeStr,
        endTime: endTimeStr,
        timeLabel: `${timeStr} - ${endTimeStr}`,
        teacher: b.teacher || b.tester || b.ops || 'Tư vấn viên đón tiếp',
        type: 'placement_test',
        typeLabel: 'Lịch Test Đón Tiếp',
        totalStudents: 1,
        officialStudents: 0,
        trialStudents: 1,
        status: b.status === 'completed' ? 'completed' : 'upcoming',
        statusLabel: b.status === 'completed' ? 'Đã xong' : 'Chờ đón tiếp',
        lessonTitle: `Kiểm tra xếp lớp cho học sinh ${b.childName}`,
        rawSession: bookingSession,
      }
    })

  return [...classItems, ...bookingItems].sort((a, b) => a.startTime.localeCompare(b.startTime))
}

export function getCareAvatarItems(
  alerts: StudentCareAlert[],
  branch: string,
  limit = 24
): CareAvatarItem[] {
  const filtered = alerts.filter((a) => {
    const isCareAlert = Boolean(a.careAlert && a.careAlert.trim() !== '')
    if (!isCareAlert) return false
    if (!branch || branch === 'all') return true
    const cls = mockClassRecords.find((c) => c.code === a.classCode)
    if (cls && (cls.branch === branch || cls.branch.toLowerCase().includes(branch.toLowerCase()))) return true
    return true
  })

  const results: CareAvatarItem[] = filtered.slice(0, limit).map((a) => {
    let alertType: CareAvatarItem['alertType'] = 'other'
    let alertBadgeColor: CareAvatarItem['alertBadgeColor'] = 'blue'
    let alertLabel = 'Cần chăm sóc'

    const alertText = (a.careAlert || '').toLowerCase()
    if (alertText.includes('vắng') || alertText.includes('nghỉ')) {
      alertType = 'absence'
      alertBadgeColor = 'red'
      alertLabel = 'Vắng mặt'
    } else if (alertText.includes('sụt') || alertText.includes('điểm') || alertText.includes('học lực')) {
      alertType = 'academic_drop'
      alertBadgeColor = 'amber'
      alertLabel = 'Học lực sụt giảm'
    } else if (alertText.includes('c90b') || a.confirmC90B === 'ĐANG XỬ LÝ') {
      alertType = 'c90b'
      alertBadgeColor = 'amber'
      alertLabel = 'Cảnh báo C90B'
    } else if (alertText.includes('cuộc gọi') || a.callConfirmation === 'Chưa gọi') {
      alertType = 'regular_call'
      alertBadgeColor = 'blue'
      alertLabel = 'Chưa liên hệ'
    }

    const contacts = getFamilyContacts(a.studentId, a.studentName)
    const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]
    const studentAvatar = getAvatarForStudent(a.studentId, a.studentName)

    return {
      id: a.id,
      studentId: a.studentId,
      studentName: a.studentName,
      avatar: studentAvatar,
      classCode: a.classCode,
      branch: 'RinoEdu Chi nhánh',
      alertType,
      alertLabel,
      alertBadgeColor,
      reason: a.careAlert || 'Cần liên hệ trao đổi tình hình học tập',
      remainingSessions: a.remainingSessions,
      attendanceRatio: a.attendanceRatio,
      parentName: primaryContact?.name,
      parentPhone: primaryContact?.phone,
      profileItem: {
        id: a.studentId,
        name: a.studentName,
        avatar: studentAvatar,
        code: a.customerCode || `HV-${a.studentId}`,
        classCode: a.classCode,
        className: `Lớp ${a.classCode}`,
        parentName: primaryContact?.name,
        parentPhone: primaryContact?.phone,
        parentRelation: primaryContact?.relationship,
        attendanceRate: a.attendanceRatio,
        note: a.careAlert,
      },
    }
  })

  return results
}

export function getRenewalAvatarItems(
  alerts: StudentCareAlert[],
  branch: string,
  limit = 24
): RenewalAvatarItem[] {
  const filtered = alerts.filter((a) => a.remainingSessions <= 6)

  const results: RenewalAvatarItem[] = filtered.slice(0, limit).map((a) => {
    let urgencyLevel: RenewalAvatarItem['urgencyLevel'] = 'normal'
    let urgencyBadgeColor: RenewalAvatarItem['urgencyBadgeColor'] = 'emerald'
    let renewalStatusLabel = `Còn ${a.remainingSessions} buổi`

    if (a.remainingSessions <= 1) {
      urgencyLevel = 'critical'
      urgencyBadgeColor = 'red'
      renewalStatusLabel = 'Hết buổi (Khẩn)'
    } else if (a.remainingSessions <= 3) {
      urgencyLevel = 'warning'
      urgencyBadgeColor = 'amber'
      renewalStatusLabel = `Sắp hết (${a.remainingSessions} buổi)`
    }

    const contacts = getFamilyContacts(a.studentId, a.studentName)
    const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]
    const studentAvatar = getAvatarForStudent(a.studentId, a.studentName)

    return {
      id: `rn-${a.id}`,
      studentId: a.studentId,
      studentName: a.studentName,
      avatar: studentAvatar,
      classCode: a.classCode,
      branch: 'RinoEdu Chi nhánh',
      remainingSessions: a.remainingSessions,
      expectedEndDate: a.expectedEndDate,
      urgencyLevel,
      urgencyBadgeColor,
      renewalStatusLabel,
      parentName: primaryContact?.name,
      parentPhone: primaryContact?.phone,
      packageName: a.linkedOrder?.packageName || 'Gói học tiêu chuẩn',
      profileItem: {
        id: a.studentId,
        name: a.studentName,
        avatar: studentAvatar,
        code: a.customerCode || `HV-${a.studentId}`,
        classCode: a.classCode,
        className: `Lớp ${a.classCode}`,
        parentName: primaryContact?.name,
        parentPhone: primaryContact?.phone,
        parentRelation: primaryContact?.relationship,
        note: `Hạn học: ${a.expectedEndDate} • Còn ${a.remainingSessions} buổi • Trạng thái: ${a.renewalClassification || 'Đang tư vấn'}`,
      },
    }
  })

  return results
}

export function getDailyTodos(
  pendingLeaves: LeaveReserveRequest[],
  todaySessions: ClassSession[],
  careAlerts: StudentCareAlert[],
  branch: string
): DailyTodoItem[] {
  const branchFilter = (b?: string) => {
    if (!b || branch === 'all') return true
    return b === branch || b.toLowerCase().includes(branch.toLowerCase())
  }

  const pendingLeaveCount = pendingLeaves.filter((l) => l.status === 'pending' && branchFilter(l.branch)).length
  const substituteNeededCount = todaySessions.filter((s) => Boolean(s.substituteTeacher)).length
  const uncontactedCareCount = careAlerts.filter((c) => c.callConfirmation === 'Chưa gọi').length

  const todos: DailyTodoItem[] = [
    {
      id: 'todo-leave',
      title: 'Duyệt đơn bảo lưu & xin nghỉ phép',
      description: `Có ${pendingLeaveCount} đơn nghỉ học / bảo lưu của học viên đang chờ phê duyệt.`,
      type: 'leave_reserve',
      count: pendingLeaveCount,
      urgency: pendingLeaveCount > 0 ? 'high' : 'low',
      actionUrl: '/app/leave_reserve',
      actionLabel: 'Xử lý đơn',
    },
    {
      id: 'todo-care',
      title: 'Liên hệ chăm sóc học viên chưa gọi',
      description: `Có ${uncontactedCareCount} học sinh có cảnh báo cần CSKH gọi điện trao đổi với phụ huynh.`,
      type: 'care_call',
      count: uncontactedCareCount,
      urgency: uncontactedCareCount > 5 ? 'high' : 'medium',
      actionUrl: '/app/student_operations_alert',
      actionLabel: 'Danh sách gọi',
    },
    {
      id: 'todo-attendance',
      title: 'Kiểm tra điểm danh & bàn giao ca dạy thay',
      description: `Hôm nay có ${substituteNeededCount} ca học có giáo viên dạy thay cần xác nhận điểm danh sớm.`,
      type: 'attendance',
      count: substituteNeededCount,
      urgency: substituteNeededCount > 0 ? 'medium' : 'low',
      actionUrl: '/app/calendar_class_schedule',
      actionLabel: 'Xem lịch ca',
    },
    {
      id: 'todo-test',
      title: 'Đón tiếp ca kiểm tra & học thử',
      description: 'Tiếp đón 2 phụ huynh và học sinh đến cơ sở làm bài kiểm tra đầu vào chiều nay.',
      type: 'test_intake',
      count: 2,
      urgency: 'medium',
      actionUrl: '/app/booking_test',
      actionLabel: 'Xem lịch test',
    },
  ]

  return todos
}
