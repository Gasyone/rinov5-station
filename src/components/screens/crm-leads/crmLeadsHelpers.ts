import { Lead, LeadChild } from '@/mocks/crmLeads'
import { mockClassRecords, ClassRecord } from '@/mocks/classRecords'
import type { GenericSessionData } from '@/components/screens/calendar/SessionHoverCard'

export const SALES_STAFF_OPTIONS = [
  'Trần Thị Mai (Sales)',
  'Lê Hoàng Nam (Sales)',
  'Nguyễn Văn Hùng (Sales Manager)',
]

export function getProductGroup(subject: string): string {
  if (!subject) return 'Nhóm Tiếng Anh Tổng Quát'
  if (subject.includes('Kindy') || subject.includes('Mẫu giáo')) return 'Nhóm Mẫu Giáo (Kindy)'
  if (subject.includes('SuperKids') || subject.includes('Nhi đồng') || subject.includes('Movers') || subject.includes('Starters')) return 'Nhóm Thiếu Nhi (Kids)'
  if (subject.includes('IELTS') || subject.includes('Flyers') || subject.includes('Thiếu niên')) return 'Nhóm Luyện Thi & Chứng Chỉ'
  return 'Nhóm Tiếng Anh Giao Tiếp'
}

export function getStaffTeam(staffName: string): string {
  if (!staffName || staffName === 'Chưa phân bổ') return ''
  if (staffName.includes('Manager')) return 'Team Sales Manager'
  if (staffName.includes('Mai')) return 'Team Sale 01'
  if (staffName.includes('Nam')) return 'Team Sale 02'
  return 'Team Sales'
}

export function getCleanStaffName(staffName: string): string {
  return staffName.replace(/\s*\([^)]*\)/g, '').trim()
}

/**
 * Lấy ngày bắt đầu phụ trách và tính số ngày đã phụ trách
 * Ví dụ: "10/08/2026 (15 ngày)"
 */
export function getStaffAssignmentInfo(lead: Lead): { dateStr: string; daysElapsed: number; label: string } {
  let createdDate: Date | null = null
  if (lead.createdAt) {
    if (lead.createdAt.includes('-')) {
      const [y, m, d] = lead.createdAt.split('-').map(Number)
      if (y && m && d) createdDate = new Date(y, m - 1, d)
    } else if (lead.createdAt.includes('/')) {
      const [d, m, y] = lead.createdAt.split('/').map(Number)
      if (y && m && d) createdDate = new Date(y, m - 1, d)
    }
  }

  if (!createdDate || isNaN(createdDate.getTime())) {
    createdDate = new Date(2026, 7, 10) // 10/08/2026
  }

  const d = String(createdDate.getDate()).padStart(2, '0')
  const m = String(createdDate.getMonth() + 1).padStart(2, '0')
  const y = createdDate.getFullYear()
  const dateStr = `${d}/${m}/${y}`

  const now = new Date(2026, 7, 25) // Reference date: 25/08/2026
  const diffTime = Math.max(0, now.getTime() - createdDate.getTime())
  const daysElapsed = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)))

  return {
    dateStr,
    daysElapsed,
    label: `${dateStr} (${daysElapsed} ngày)`,
  }
}

// Định dạng Thứ và Ngày (BỎ năm & BỎ giờ để tối ưu 1 dòng)
export function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '---'
  let dateWithoutYear = dateStr
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length >= 2) {
      dateWithoutYear = `${parts[0]}/${parts[1]}`
    }
  }

  let dayOfWeek = ''
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
      if (!isNaN(d.getTime())) {
        dayOfWeek = `${days[d.getDay()]}, `
      }
    }
  }

  return `${dayOfWeek}${dateWithoutYear}`
}

// Định dạng Thứ, Ngày, Giờ (ví dụ: CN, 16/08 - 19:00 hoặc T3, 11/08 - 15:30)
export function formatDateTimeWithDayOfWeek(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '---'
  const dateFormatted = formatDateShort(dateStr)
  if (timeStr) {
    return `${dateFormatted} - ${timeStr}`
  }
  return dateFormatted
}

// Lấy hoặc khởi tạo ClassRecord để gọi Modal Lớp học sẵn có
export function getClassRecord(classCode: string, subjectName?: string): ClassRecord {
  const found = mockClassRecords.find((c) => c.code === classCode)
  if (found) return found

  return {
    id: `class-${classCode}`,
    code: classCode,
    name: `${subjectName || 'SuperKids'} S1`,
    level: 'Level 2',
    branch: 'RinoEdu Quận 1',
    teacher: 'Mỹ Linh',
    teacherPhone: '0901234567',
    room: 'Phòng 2 • RinoEdu Quận 1',
    schedule: 'Chủ Nhật (15:30 - 17:30)',
    scheduleSlots: [
      { dayOfWeek: 'Chủ Nhật', date: '16/08', startTime: '15:30', endTime: '17:30' }
    ],
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    maxStudents: 16,
    enrolledStudents: 15,
    status: 'dang_hoc',
    tuitionFee: 3500000,
    assistant: 'Đức Anh'
  }
}

// Khởi tạo Dữ liệu Hover Card Hồ sơ Buổi học
export function getSessionHoverData(lead: Lead, type: 'trial' | 'test'): GenericSessionData {
  if (type === 'trial') {
    const code = lead.trialClassName || 'SK-02'
    const fullDate = `${formatDateShort(lead.trialDate)} (${lead.trialTime || '15:30 - 17:30'})`
    return {
      id: `trial-${lead.id}`,
      title: `${code} - ${lead.targetSubject || 'Lớp Học thử'}`,
      classCode: code,
      className: lead.targetSubject || 'SuperKids S1',
      subject: lead.targetSubject || 'SuperKids',
      level: lead.testResultLevel || 'Level 2',
      teacher: lead.testerTeacherName || 'Mỹ Linh',
      assistantTeacher: 'Đức Anh',
      branch: lead.branch || 'RinoEdu Quận 1',
      schoolRoom: 'Phòng 2 • RinoEdu Quận 1',
      timeSlot: lead.trialTime ? `${lead.trialTime}` : '15:30 - 17:30',
      timeLabel: '15:30',
      endTimeLabel: '17:30',
      date: fullDate,
      dateBucket: 'today',
      status: 'active',
      type: 'trial',
      totalStudents: 16,
      officialStudents: 15,
      trialStudents: 1,
      lessonSubtitle: 'Thực hành giao tiếp & Cân chỉnh cảm biến',
      note: lead.trialFeedback || 'Học viên tham gia học thử',
    }
  } else {
    const fullDate = `${formatDateShort(lead.testDate)} (${lead.testTime || '18:00 - 19:00'})`
    return {
      id: `test-${lead.id}`,
      title: `Đánh giá: ${lead.testerTeacherName || 'Thầy Alex'}`,
      classCode: 'TEST-01',
      className: 'Đánh giá năng lực & Phỏng vấn đầu vào',
      subject: lead.targetSubject || 'Anh văn',
      level: lead.testResultLevel || 'Đầu vào',
      teacher: lead.testerTeacherName || 'Thầy Alex',
      assistantTeacher: 'Trần Thị Mai (Sales)',
      branch: lead.branch || 'RinoEdu Quận 1',
      schoolRoom: 'Phòng Test 01 • RinoEdu Quận 1',
      timeSlot: lead.testTime ? `${lead.testTime}` : '18:00 - 19:00',
      timeLabel: '18:00',
      endTimeLabel: '19:00',
      date: fullDate,
      dateBucket: 'today',
      status: 'active',
      type: 'test',
      totalStudents: 1,
      trialStudents: 1,
      lessonSubtitle: 'Đánh giá kỹ năng Listening & Speaking',
      note: lead.testScore ? `Đạt score: ${lead.testScore}` : 'Chờ kiểm tra',
    }
  }
}

/**
 * Che số điện thoại chỉ hiển thị 3 số cuối
 * Ví dụ: "0912345678" -> "*******678"
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone || phone.length < 3) return phone || '---'
  const last3 = phone.slice(-3)
  const maskedLength = Math.max(phone.length - 3, 5)
  return `${'*'.repeat(maskedLength)}${last3}`
}

/**
 * Định dạng hiển thị Học viên (Con): Tên (Tuổi - Năm sinh)
 * Ví dụ: "Bé An (8t - 2018)"
 */
export function formatChildLabel(child: LeadChild): string {
  const birthYear = child.birthYear ?? 2026 - child.age
  return `${child.name} (${child.age}t - ${birthYear})`
}

export const isMoiTiepNhanStatus = (s: string) => s === 'moi_tiep_nhan' || s === 'chua_tiep_can'
export const isDangTuVanStatus = (s: string) => s === 'dang_tu_van' || s === 'dang_cham_soc'
export const isHenTraiNghiemStatus = (s: string) => s === 'hen_trai_nghiem' || s === 'danh_gia_trai_nghiem'
export const isChoChotStatus = (s: string) => s === 'cho_chot' || s === 'tiem_nang'
export const isChuyenDoiStatus = (s: string) => s === 'chuyen_doi'
export const isThatBaiStatus = (s: string) => s === 'that_bai'

export const isLeadTodayTask = (l: Lead) => {
  const care = getLeadCareInfo(l)
  return (
    isMoiTiepNhanStatus(l.status) ||
    care.isRescheduled ||
    l.testStatus === 'scheduled' ||
    l.trialStatus === 'scheduled' ||
    l.testStatus === 'completed'
  )
}

export const isLeadOverdue = (l: Lead) => {
  return (
    (isMoiTiepNhanStatus(l.status) && Boolean(l.assignedTo && l.assignedTo !== 'Chưa phân bổ')) ||
    l.testStatus === 'no_show' ||
    l.trialStatus === 'no_show'
  )
}

export const isLeadUnassigned = (l: Lead) =>
  !l.assignedTo || l.assignedTo.trim() === '' || l.assignedTo === 'Chưa phân bổ'

export function calculateStatusTileCounts(leads: Lead[]) {
  const counts: Record<string, number> = {
    all: leads.length,
    today_tasks: leads.filter(isLeadTodayTask).length,
    overdue: leads.filter(isLeadOverdue).length,
    unassigned: leads.filter(isLeadUnassigned).length,
    moi_tiep_nhan: leads.filter((l) => isMoiTiepNhanStatus(l.status)).length,
    dang_tu_van: leads.filter((l) => isDangTuVanStatus(l.status)).length,
    hen_trai_nghiem: leads.filter((l) => isHenTraiNghiemStatus(l.status)).length,
    cho_chot: leads.filter((l) => isChoChotStatus(l.status)).length,
    chuyen_doi: leads.filter((l) => isChuyenDoiStatus(l.status)).length,
    that_bai: leads.filter((l) => isThatBaiStatus(l.status)).length,
    // Legacy aliases
    chua_tiep_can: leads.filter((l) => isMoiTiepNhanStatus(l.status)).length,
    dang_cham_soc: leads.filter((l) => isDangTuVanStatus(l.status)).length,
    danh_gia_trai_nghiem: leads.filter((l) => isHenTraiNghiemStatus(l.status)).length,
    tiem_nang: leads.filter((l) => isChoChotStatus(l.status)).length,
  }

  return counts
}

/**
 * Định dạng Tuổi và Năm sinh: "8 tuổi (2018)"
 */
export function formatAgeAndBirthYear(age: number, birthYear?: number): string {
  const year = birthYear ?? 2026 - age
  return `${age} tuổi (${year})`
}

/**
 * Lấy trình độ ban đầu khi tạo test
 * Dựa theo cấu hình level: Pre-Starters (<=6), Starters (>6 và <=8), Mover (>8 và <=10), Flyers (>10)
 */
export function getInitialLevel(lead: Lead): string {
  if (lead.initialLevel) {
    return lead.initialLevel
  }

  const subject = (lead.targetSubject || '').toLowerCase()
  if (subject.includes('toán')) {
    const classNum = Math.max(1, Math.min(7, lead.studentAge - 5))
    return `Lớp ${classNum}`
  }

  if (subject.includes('grammar')) {
    if (lead.studentAge <= 8) return 'Level 0-1'
    if (lead.studentAge <= 10) return 'Level 2'
    if (lead.studentAge <= 12) return 'Level 3'
    return 'Level 4'
  }

  // Mặc định chương trình Tiếng Anh Station
  if (lead.studentAge <= 6) {
    return 'Pre-Starters'
  }
  if (lead.studentAge <= 8) {
    return 'Starters'
  }
  if (lead.studentAge <= 10) {
    return 'Movers'
  }
  return 'Flyers'
}

/**
 * Lấy nhãn Trạng thái phụ theo trạng thái chính của từng Lead
 */
export function getLeadSubStatusLabel(lead: Lead): string {
  if (lead.subStatus) return lead.subStatus

  const note = (lead.lastNote || '').toLowerCase()
  const subj = (lead.targetSubject || '').toLowerCase()
  const level = (lead.testResultLevel || '').toLowerCase()

  switch (lead.status) {
    case 'moi_tiep_nhan':
    case 'chua_tiep_can':
      if (!lead.assignedTo || lead.assignedTo === 'Chưa phân bổ' || lead.assignedTo.trim() === '') {
        return 'Mới về - Chưa phân Sale'
      }
      return 'Đã giao Sale - Chưa gọi'

    case 'dang_tu_van':
    case 'dang_cham_soc':
      if (note.includes('gọi lần 2')) return 'Đã gọi lần 2'
      if (note.includes('hẹn gọi lại')) return 'Hẹn gọi lại sau'
      if (note.includes('gọi lần 1')) return 'Đã gọi lần 1'
      return 'Đã gọi lần 1'

    case 'hen_trai_nghiem':
    case 'danh_gia_trai_nghiem':
      if (level.includes('superkids')) return 'Đạt level SuperKids'
      if (level.includes('flyers')) return 'Đạt level Flyers'
      if (level.includes('kindy') || subj.includes('kindy')) return 'Đạt level Kindy'
      if (note.includes('chưa giao gv')) return 'Chưa giao GV test'
      if (note.includes('xác nhận')) return 'PH đã xác nhận'
      if (lead.testStatus === 'scheduled') return 'Lịch test tuần này'
      return 'PH đã xác nhận'

    case 'cho_chot':
    case 'tiem_nang':
      if (note.includes('giữ chỗ') || (lead.paymentTerm || '').toLowerCase().includes('giữ chỗ')) return 'Giữ chỗ 24h'
      if (note.includes('chuyển khoản')) return 'Chờ chuyển khoản'
      if (note.includes('tiền mặt')) return 'Hẹn nộp tiền mặt'
      if (note.includes('cọc') || (lead.paymentTerm || '').toLowerCase().includes('cọc')) return 'Đã cọc 50%'
      return 'Giữ chỗ 24h'

    case 'chuyen_doi':
      if (note.includes('100%') || (lead.paymentTerm || '').toLowerCase().includes('100%')) return 'Đã thu 100% học phí'
      if (note.includes('cọc') || (lead.paymentTerm || '').toLowerCase().includes('cọc')) return 'Đã cọc 50%'
      return 'Đã thu 100% học phí'

    case 'that_bai':
      if (lead.testStatus === 'no_show' || lead.trialStatus === 'no_show' || note.includes('vắng test') || note.includes('no-show')) {
        return 'Vắng test (No-show)'
      }
      if (note.includes('không nghe máy')) return 'Không nghe máy'
      if (note.includes('sai số')) return 'Sai số điện thoại'
      if (note.includes('nhà xa')) return 'Nhà xa cơ sở'
      if (note.includes('chê học phí') || note.includes('phí cao')) return 'Chê học phí cao'
      return 'Vắng test (No-show)'

    default:
      return ''
  }
}

export interface LeadCareLog {
  action: string
  staff: string
  date: string
  note: string
  channel: 'telephone' | 'zalo' | 'direct'
  duration?: string
  parentFeedback?: string
  tag?: string
}

export interface LeadCareInfo {
  isUncared: boolean
  inProgress: boolean
  isCompleted: boolean
  attemptCount: number
  isRescheduled: boolean
  rescheduleDate?: string
  rescheduleTime?: string
  logs: LeadCareLog[]
  latestLog?: LeadCareLog
}

export function getLeadCareInfo(lead: Lead): LeadCareInfo {
  const staff = lead.assignedTo && lead.assignedTo !== 'Chưa phân bổ' && lead.assignedTo.trim() !== ''
    ? lead.assignedTo
    : 'Trần Thị Mai (Sales)'
  const note = lead.lastNote || ''

  // 1. Mới tiếp nhận / Chưa tiếp cận -> Chưa chăm sóc
  if (isMoiTiepNhanStatus(lead.status)) {
    return {
      isUncared: true,
      inProgress: false,
      isCompleted: false,
      attemptCount: 0,
      isRescheduled: false,
      logs: [],
    }
  }

  // 2. Đang tư vấn / Đang chăm sóc
  if (isDangTuVanStatus(lead.status)) {
    const isCall2 = note.includes('lần 2')
    const logs: LeadCareLog[] = [
      {
        action: isCall2 ? 'Gọi điện tư vấn lần 2' : 'Gọi điện tư vấn lần 1',
        staff,
        date: '11/08/2026',
        note: lead.lastNote || 'Đã gọi điện tư vấn lộ trình học phù hợp với độ tuổi của bé.',
        channel: 'telephone',
        duration: '2 phút 45 giây',
        parentFeedback: 'Phụ huynh hẹn trao đổi thêm với người nhà vào buổi tối',
      },
    ]

    if (isCall2) {
      logs.push({
        action: 'Gọi điện tiếp cận lần 1',
        staff,
        date: '09/08/2026',
        note: 'Tiếp cận nhu cầu học tiếng Anh, gửi brochure chương trình.',
        channel: 'telephone',
        duration: '1 phút 30 giây',
        parentFeedback: 'Phụ huynh xin thêm tài liệu tham khảo qua Zalo',
      })
    }

    const isRescheduled = note.includes('hẹn') || Boolean(lead.trialDate)
    return {
      isUncared: false,
      inProgress: true,
      isCompleted: false,
      attemptCount: logs.length,
      isRescheduled,
      rescheduleDate: isRescheduled ? (lead.trialDate ? `${lead.trialDate.split('/')[0]}/${lead.trialDate.split('/')[1]}` : 'Hôm nay') : undefined,
      rescheduleTime: isRescheduled ? (lead.trialTime || '19:00') : undefined,
      logs,
      latestLog: logs[0],
    }
  }

  // 3. Hẹn trải nghiệm / Đánh giá & Trải nghiệm
  if (isHenTraiNghiemStatus(lead.status)) {
    const logs: LeadCareLog[] = []
    if (lead.trialStatus === 'completed') {
      logs.push({
        action: 'Chăm sóc sau buổi học thử',
        staff,
        date: lead.trialDate || '12/08/2026',
        note: lead.trialFeedback || 'Bé tham gia lớp học thử hào hứng, tiếp thu tốt bài giảng.',
        channel: 'telephone',
        duration: '3 phút 20 giây',
        parentFeedback: 'Mẹ khen cơ sở vật chất đẹp và giáo viên nhiệt tình',
      })
    }
    if (lead.testStatus === 'completed' || lead.testDate) {
      logs.push({
        action: 'Thông báo kết quả kiểm tra năng lực',
        staff,
        date: lead.testDate || '11/08/2026',
        note: lead.testScore ? `Đạt kết quả ${lead.testResultLevel || ''} (${lead.testScore}). Đã tư vấn xếp lớp phù hợp.` : (lead.lastNote || 'Đã xếp lịch kiểm tra năng lực.'),
        channel: 'telephone',
        duration: '4 phút 10 giây',
        parentFeedback: 'Phụ huynh đồng ý định hướng lộ trình học của trung tâm',
      })
    }
    logs.push({
      action: 'Xác nhận lịch hẹn kiểm tra / học thử',
      staff,
      date: '10/08/2026',
      note: 'Gửi định vị cơ sở và hướng dẫn đón tiếp tại sảnh.',
      channel: 'zalo',
      parentFeedback: 'Phụ huynh đã nhận thông tin lịch hẹn',
    })

    const hasUpcoming = lead.testStatus === 'scheduled' || lead.trialStatus === 'scheduled'
    const appointmentDate = lead.testStatus === 'scheduled' ? lead.testDate : lead.trialDate
    const appointmentTime = lead.testStatus === 'scheduled' ? lead.testTime : lead.trialTime

    return {
      isUncared: false,
      inProgress: true,
      isCompleted: false,
      attemptCount: logs.length,
      isRescheduled: Boolean(hasUpcoming && appointmentDate),
      rescheduleDate: appointmentDate ? `${appointmentDate.split('/')[0]}/${appointmentDate.split('/')[1]}` : undefined,
      rescheduleTime: appointmentTime || '18:00',
      logs,
      latestLog: logs[0],
    }
  }

  // 4. Chờ chốt / Tiềm năng
  if (isChoChotStatus(lead.status)) {
    const logs: LeadCareLog[] = [
      {
        action: 'Tư vấn đóng phí & Giữ chỗ ưu đãi',
        staff,
        date: '12/08/2026',
        note: lead.lastNote || 'Phụ huynh đã chốt gói học và đồng ý giữ chỗ 24h chờ hoàn tất học phí.',
        channel: 'telephone',
        duration: '3 phút 15 giây',
        parentFeedback: 'Mẹ sẽ chuyển khoản học phí trong ngày',
      },
      {
        action: 'Gửi bảng báo giá chi tiết và ưu đãi',
        staff,
        date: '11/08/2026',
        note: `Gửi báo giá ${lead.expectedPackage || 'khóa học'} kèm chính sách tặng quà và học bổng.`,
        channel: 'zalo',
        parentFeedback: 'Phụ huynh đã nhận báo giá và cân nhắc đăng ký gói 1 năm',
      },
      {
        action: 'Tư vấn xếp lịch học theo yêu cầu',
        staff,
        date: '10/08/2026',
        note: 'Trao đổi thời khóa biểu phù hợp với lịch học văn hóa ở trường của bé.',
        channel: 'telephone',
        duration: '2 phút 50 giây',
        parentFeedback: 'Gia đình muốn bé học vào khung giờ cuối tuần',
      },
    ]

    return {
      isUncared: false,
      inProgress: false,
      isCompleted: true,
      attemptCount: logs.length,
      isRescheduled: true,
      rescheduleDate: '14/08',
      rescheduleTime: '10:00',
      logs,
      latestLog: logs[0],
    }
  }

  // 5. Chuyển đổi
  if (lead.status === 'chuyen_doi') {
    const logs: LeadCareLog[] = [
      {
        action: 'Hoàn tất thủ tục nhập học & Thu học phí',
        staff,
        date: '05/08/2026',
        note: lead.lastNote || 'Đã hoàn tất thanh toán 100% học phí trọn gói. Bàn giao thủ tục xếp lớp chính thức.',
        channel: 'direct',
        parentFeedback: 'Gia đình rất an tâm và mong chờ buổi khai giảng của con',
      },
      {
        action: 'Xác nhận thông tin đơn hàng & Lịch nhập học',
        staff,
        date: '04/08/2026',
        note: 'Hướng dẫn phụ huynh chuẩn bị đồ dùng và tham gia buổi định hướng.',
        channel: 'telephone',
        duration: '2 phút 20 giây',
        parentFeedback: 'Phụ huynh xác nhận lịch nhập học',
      },
      {
        action: 'Gửi thông tin tài khoản đóng phí',
        staff,
        date: '03/08/2026',
        note: 'Gửi hóa đơn điện tử và hướng dẫn chuyển khoản qua App ngân hàng.',
        channel: 'zalo',
        parentFeedback: 'Đã nhận thông tin chuyển khoản',
      },
    ]

    return {
      isUncared: false,
      inProgress: false,
      isCompleted: true,
      attemptCount: logs.length,
      isRescheduled: false,
      logs,
      latestLog: logs[0],
    }
  }

  // 6. Thất bại
  const logs: LeadCareLog[] = [
    {
      action: 'Chăm sóc lý do chưa phù hợp & Lưu hồ sơ',
      staff,
      date: '03/08/2026',
      note: lead.lastNote || 'Gọi điện thăm hỏi lý do chưa tham gia. Lưu thông tin theo dõi cho các đợt sau.',
      channel: 'telephone',
      duration: '1 phút 40 giây',
      parentFeedback: 'Phụ huynh xin tạm hoãn và sẽ liên hệ lại khi có thời gian',
    },
    {
      action: 'Gọi điện tiếp cận ban đầu',
      staff,
      date: '01/08/2026',
      note: 'Liên hệ tư vấn khóa học nhưng không kết nối được hoặc vắng hẹn.',
      channel: 'telephone',
      duration: '45 giây',
      parentFeedback: 'Không nghe máy / Máy bận',
    },
  ]

  return {
    isUncared: false,
    inProgress: false,
    isCompleted: false,
    attemptCount: logs.length,
    isRescheduled: false,
    logs,
    latestLog: logs[0],
  }
}

/**
 * Chuyển đổi Khóa học Lead quan tâm sang Chương trình Test của Booking Test Modal
 */
export function mapLeadSubjectToBookingProgram(subject?: string): string {
  if (!subject) return 'Chương trình Station'
  const lower = subject.toLowerCase()
  if (lower.includes('toán')) return 'Chương trình Toán tư duy'
  if (lower.includes('grammar') || lower.includes('ngữ pháp')) return 'Chương trình Station Grammar'
  return 'Chương trình Station'
}

/**
 * Chuyển đổi Khóa học Lead quan tâm sang Chương trình Học thử của Trial Class Modal
 */
export function mapLeadSubjectToTrialProgram(subject?: string): string {
  if (!subject) return 'Cambridge Starter'
  const lower = subject.toLowerCase()
  if (lower.includes('toán')) return 'Math Thinking'
  if (lower.includes('starter')) return 'Cambridge Starter'
  if (lower.includes('mover')) return 'Cambridge Movers'
  if (lower.includes('flyer')) return 'Cambridge Flyers'
  if (lower.includes('ielts')) return 'IELTS Junior'
  if (lower.includes('giao tiếp') || lower.includes('communication')) return 'Communication Kids'
  if (lower.includes('phonics')) return 'Phonics'
  if (lower.includes('stem') || lower.includes('coding')) return 'STEM Coding'
  if (lower.includes('robot')) return 'STEM Robotics'
  if (lower.includes('superkids') || lower.includes('nhi đồng')) return 'Cambridge Starter'
  if (lower.includes('kindy') || lower.includes('mẫu giáo')) return 'English Foundation'
  return 'Cambridge Starter'
}

/**
 * Khớp trạng thái phụ (Sub-status) với dữ liệu Lead
 */
export function matchSubStatus(lead: Lead, subStatusId: string): boolean {
  if (subStatusId === 'all') return true
  const note = (lead.lastNote || '').toLowerCase()
  const subj = (lead.targetSubject || '').toLowerCase()
  const level = (lead.testResultLevel || '').toLowerCase()

  switch (subStatusId) {
    case 'chua_co_sale':
      return !lead.assignedTo || lead.assignedTo === 'Chưa phân bổ' || lead.assignedTo.trim() === ''
    case 'da_phan_sale':
      return Boolean(lead.assignedTo && lead.assignedTo.trim() !== '' && lead.assignedTo !== 'Chưa phân bổ')
    case 'goi_lan_1':
      return note.includes('gọi lần 1')
    case 'goi_lan_2':
      return note.includes('gọi lần 2')
    case 'hen_goi_lai':
      return note.includes('hẹn gọi lại') || note.includes('hẹn')
    case 'test_tuan_nay':
      return lead.testStatus === 'scheduled' || lead.trialStatus === 'scheduled'
    case 'chua_giao_gv':
      return note.includes('chưa giao gv') || !lead.testerTeacherName
    case 'da_xac_nhan':
      return note.includes('xác nhận')
    case 'dat_superkids':
      return level.includes('superkids') || subj.includes('superkids')
    case 'dat_flyers':
      return level.includes('flyers') || subj.includes('flyers')
    case 'dat_kindy':
      return level.includes('kindy') || subj.includes('kindy')
    case 'giu_cho_24h':
      return note.includes('giữ chỗ')
    case 'cho_chuyen_khoan':
      return note.includes('chuyển khoản')
    case 'hen_nop_tien_mat':
      return note.includes('tiền mặt')
    case 'da_thu_100':
      return note.includes('100%')
    case 'da_thu_coc':
      return note.includes('cọc')
    case 'no_show':
      return lead.testStatus === 'no_show' || lead.trialStatus === 'no_show' || note.includes('vắng test')
    case 'khong_nghe_may':
      return note.includes('không nghe máy')
    case 'sai_so':
      return note.includes('sai số')
    case 'nha_xa':
      return note.includes('nhà xa')
    case 'che_phi_cao':
      return note.includes('chê học phí cao')
    default:
      return lead.status === subStatusId || lead.subStatus === subStatusId
  }
}

/**
 * Định dạng ngày tạo đơn hàng dạng DD/MM/YYYY
 */
export function formatOrderDate(dateStr?: string): string {
  if (!dateStr) return '-'
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
  }
  return dateStr
}


