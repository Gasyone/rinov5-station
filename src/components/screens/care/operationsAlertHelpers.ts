import { StudentCareAlert } from '@/mocks/careAlerts'

/**
 * Checks if a care tag code belongs to Special Care (CSĐB)
 */
export function isCSDBTag(code?: string): boolean {
  if (!code) return false
  const upper = code.trim().toUpperCase()
  return upper.startsWith('ĐB') || upper.includes('CSĐB') || upper.includes('ĐẶC BIỆT')
}

/**
 * Formats staff name to full name without codes (AnhNTN33) and without titles (Cô, Thầy, GV)
 */
export function formatFullStaffName(name?: string): string {
  if (!name) return 'Lê Thị Lan'
  
  let clean = name.replace(/^(Cô|Thầy|GV\.|GV)\s+/i, '').trim()
  clean = clean.replace(/\s*\((CS|GV|Sale|CSM)\)$/i, '').trim()

  const codeMap: Record<string, string> = {
    'AnhNTN33': 'Nguyễn Thị Ngọc Anh',
    'AnhNTN33 (CSM)': 'Nguyễn Thị Ngọc Anh',
    'MinhLH': 'Lê Hoàng Minh',
    'MinhLH (CSM)': 'Lê Hoàng Minh',
    'LanLT': 'Lê Thị Lan',
    'GV_F010': 'Nguyễn Huy Hoàng',
    'GV. Nguyễn Huy Hoàng': 'Nguyễn Huy Hoàng',
    'Cô Hoàng Thị Mai': 'Hoàng Thị Mai',
    'Cô Hoàng Thị Mai (GV)': 'Hoàng Thị Mai',
    'Cô Lan': 'Lê Thị Lan',
    'Cô Nguyễn Thị Hoa': 'Nguyễn Thị Hoa',
    'Thầy David Wilson': 'David Wilson',
  }

  if (codeMap[name]) return codeMap[name]
  if (codeMap[clean]) return codeMap[clean]

  return clean
}

/**
 * Calculates the percentage of remaining sessions
 */
export function calculateRemainingSessionsRatio(remaining: number, total: number): number {
  if (!total) return 0
  return Math.round((remaining / total) * 100)
}

/**
 * Gets attendance rate percentage from a ratio string like '6/6'
 */
export function parseAttendanceRate(ratio: string): number {
  if (!ratio || ratio === '0/0') return 0
  const [present, total] = ratio.split('/').map(Number)
  if (!total) return 0
  return Math.round((present / total) * 100)
}

/**
 * Compares two scores to determine the trend direction
 */
export function getTrendDirection(current: number, prior: number): 'up' | 'down' | 'flat' {
  if (current > prior) return 'up'
  if (current < prior) return 'down'
  return 'flat'
}

/**
 * Filters the raw student care alerts array based on UI parameters
 */
export function filterAlertData(
  data: StudentCareAlert[],
  filters: {
    search?: string
    status?: string
    careAlert?: string
    classCode?: string
    callConfirmation?: string
  }
): StudentCareAlert[] {
  return data.filter((item) => {
    // 1. Status Filter
    if (filters.status && filters.status !== 'all' && item.status !== filters.status) {
      return false
    }

    // 2. Alert Type Filter
    if (filters.careAlert && filters.careAlert !== 'all' && item.careAlert !== filters.careAlert) {
      return false
    }

    // 3. Class Code Filter
    if (filters.classCode && filters.classCode !== 'all' && item.classCode !== filters.classCode) {
      return false
    }

    // 4. Call Confirmation Filter
    if (filters.callConfirmation && filters.callConfirmation !== 'all' && item.callConfirmation !== filters.callConfirmation) {
      return false
    }

    // 5. General Search
    if (filters.search) {
      const q = filters.search.toLowerCase().trim()
      const matches =
        item.studentName.toLowerCase().includes(q) ||
        item.studentId.includes(q) ||
        item.classCode.toLowerCase().includes(q) ||
        item.teacherCode.toLowerCase().includes(q) ||
        (item.customerCode && item.customerCode.toLowerCase().includes(q))
      if (!matches) return false
    }

    return true
  })
}

export interface ParsedScheduleSlot {
  day: string
  time: string
}

/**
 * Parses a raw schedule string like "T2 - 19:25-20:55, T5 - 19:25-20:55" into structured slots
 */
export function parseScheduleString(scheduleStr: string): ParsedScheduleSlot[] {
  if (!scheduleStr) return []
  return scheduleStr.split(',').map((slot) => {
    const parts = slot.split('-')
    if (parts.length >= 2) {
      const day = parts[0].trim()
      const time = parts.slice(1).join('-').trim()
      return { day, time }
    }
    return { day: slot.trim(), time: '' }
  })
}

export const stableHash = (str: string): number => {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h)
  }
  return Math.abs(h)
}

export const getInitials = (name: string): string => {
  const parts = name.replace(/\s*\(.*\)\s*$/, '').trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '?'
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400',
  'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400',
]

export const getAvatarColor = (id: string): string =>
  AVATAR_COLORS[stableHash(id) % AVATAR_COLORS.length]

export interface HistoryLog {
  action: string
  staff: string
  date: string
  note: string
  channel: 'zalo' | 'telephone'
  duration?: string
  tag: string
  semantic: 'warning' | 'purple' | 'error' | 'success'
}

export function getHistoryLogsForStudent(studentId: string): HistoryLog[] {
  const hash = stableHash(studentId)
  const rawLogs: HistoryLog[] = [
    // CSTP
    { action: 'Điểm chạm tái phí chính khóa', staff: 'AnhNT33 (CSM)', date: '12/07/2026', note: 'Đã gọi điện trao đổi lộ trình học tập tiếp theo, phụ huynh hẹn cuối tuần chuyển khoản đóng phí.', channel: 'telephone', duration: '3 phút 45 giây', tag: 'CSTP', semantic: 'success' },
    { action: 'Gửi tin nhắn thông báo phí đóng sớm', staff: 'AnhNT33 (CSM)', date: '10/07/2026', note: 'Đã gửi thông tin chuyển khoản và chương trình ưu đãi đóng sớm qua Zalo.', channel: 'zalo', tag: 'CSTP', semantic: 'success' },
    { action: 'Điểm chạm tái phí lần 3', staff: 'AnhNT33 (CSM)', date: '08/07/2026', note: 'Trao đổi về mức học phí đóng sớm và lộ trình nâng cao.', channel: 'telephone', duration: '1 phút 50 giây', tag: 'CSTP', semantic: 'success' },
    { action: 'Gửi link đăng ký ưu đãi hè', staff: 'MinhLH (CSM)', date: '05/07/2026', note: 'Gửi chương trình quà tặng đăng ký tái phí trước 15 ngày qua Zalo.', channel: 'zalo', tag: 'CSTP', semantic: 'success' },
    
    // TB
    { action: 'Gửi tin nhắn thông báo đi muộn', staff: 'AnhNT33 (CSM)', date: '12/07/2026', note: 'Đã nhắn Zalo trao đổi với mẹ nhắc con đi học đúng giờ.', channel: 'zalo', tag: 'TB', semantic: 'warning' },
    { action: 'Gửi tin nhắn nhắc nhở nộp BTVN', staff: 'MinhLH (CSM)', date: '10/07/2026', note: 'Nhắc học viên hoàn thành bài tập về nhà buổi 5 trước khi lên lớp.', channel: 'zalo', tag: 'TB', semantic: 'warning' },
    { action: 'Gửi tin nhắn nhắc nhở nộp BTVN bù', staff: 'MinhLH (CSM)', date: '07/07/2026', note: 'Nhắc con làm bù bài tập buổi 3 và buổi 4 còn thiếu.', channel: 'zalo', tag: 'TB', semantic: 'warning' },
    { action: 'Điểm chạm chuyên cần sau buổi nghỉ', staff: 'AnhNT33 (CSM)', date: '04/07/2026', note: 'Gọi điện hỏi thăm sức khỏe học viên và thông báo gửi bài giảng ghi hình.', channel: 'telephone', duration: '2 phút 40 giây', tag: 'TB', semantic: 'warning' },
    
    // ĐK
    { action: 'Điểm chạm định kỳ tháng 6', staff: 'AnhNT33 (CSM)', date: '28/06/2026', note: 'Gọi điện trao đổi lộ trình học tập, phụ huynh phản hồi tích cực.', channel: 'telephone', duration: '3 phút 45 giây', tag: 'ĐK', semantic: 'purple' },
    { action: 'Gửi nhận xét định kỳ tháng 5', staff: 'MinhLH (CSM)', date: '25/06/2026', note: 'Đã gửi nhận xét kết quả học tập tháng 5 qua Zalo cho phụ huynh.', channel: 'zalo', tag: 'ĐK', semantic: 'purple' },
    { action: 'Điểm chạm định kỳ tháng 4', staff: 'AnhNT33 (CSM)', date: '20/05/2026', note: 'Gọi điện cập nhật tình hình học tập và chuẩn bị lên trình độ mới.', channel: 'telephone', duration: '4 phút 12 giây', tag: 'ĐK', semantic: 'purple' },
    { action: 'Gửi kết quả kiểm tra định kỳ lần 1', staff: 'MinhLH (CSM)', date: '15/05/2026', note: 'Gửi bảng điểm chi tiết bài kiểm tra đánh giá năng lực lần 1.', channel: 'zalo', tag: 'ĐK', semantic: 'purple' },
    
    // ĐB
    { action: 'Xử lý cảnh báo nghỉ học liên tiếp', staff: 'MinhLH (GV)', date: '15/06/2026', note: 'Đã liên hệ xác nhận học viên nghỉ học do bị sốt, giáo viên sẽ gửi bài ghi hình.', channel: 'telephone', duration: '2 phút 15 giây', tag: 'ĐB', semantic: 'error' },
    { action: 'Cảnh báo học tập đặc biệt', staff: 'AnhNT33 (CSM)', date: '05/06/2026', note: 'Liên hệ trao đổi về tình hình học lực yếu và đề xuất giải pháp phụ đạo.', channel: 'telephone', duration: '3 phút 10 giây', tag: 'ĐB', semantic: 'error' },
    { action: 'Xử lý cảnh báo bỏ học giữa kỳ', staff: 'AnhNT33 (CSM)', date: '01/06/2026', note: 'Phụ huynh bận đi công tác nên con tự học chưa tốt. CSM thống nhất kèm thêm.', channel: 'telephone', duration: '2 phút 50 giây', tag: 'ĐB', semantic: 'error' },
    { action: 'Họp ban phụ huynh trao đổi học lực', staff: 'MinhLH (GV)', date: '28/05/2026', note: 'Mời phụ huynh họp nhanh 10 phút sau giờ học để định hướng phương pháp ôn tập.', channel: 'telephone', duration: '5 phút 20 giây', tag: 'ĐB', semantic: 'error' }
  ]
  
  // Shift dates slightly based on student ID to make it dynamic
  const offset = hash % 3
  const logs = rawLogs.map((log) => {
    const originalDateParts = log.date.split('/')
    if (originalDateParts.length === 3) {
      const day = parseInt(originalDateParts[0], 10)
      const adjustedDay = Math.max(1, Math.min(28, day - offset))
      const adjustedDayStr = adjustedDay.toString().padStart(2, '0')
      return {
        ...log,
        date: `${adjustedDayStr}/${originalDateParts[1]}/${originalDateParts[2]}`
      }
    }
    return log
  })

  if (hash % 2 === 0) {
    const zaloLogIndex = logs.findIndex((l) => l.channel === 'zalo')
    if (zaloLogIndex !== -1) {
      const zaloLog = logs[zaloLogIndex]
      logs.splice(zaloLogIndex, 1)
      logs.unshift(zaloLog)
    }
  }

  return logs
}

export function getAcademicIssues(item: {
  attendanceRatio?: string
  homeworkCompletion: number
  lastTestScore: number
  priorTestScore: number
}) {
  const issues: string[] = []
  
  // 1. Nghỉ không phép 2 buổi trong 8 buổi gần nhất
  const ratio = item.attendanceRatio || '0/0'
  const [attended, total] = ratio.split('/').map(Number)
  const absentCount = total > 0 ? (total - attended) : 0
  if (absentCount >= 2) {
    issues.push(`Nghỉ không phép ${absentCount} buổi trong ${total} buổi gần nhất (yêu cầu < 2)`)
  }

  // 2. Không làm bài tập 3 buổi trong 8 buổi gần nhất
  const displayTotal = (total && total > 0) ? total : 8
  const done = Math.round((item.homeworkCompletion / 100) * displayTotal)
  const missedHomework = displayTotal - done
  if (missedHomework >= 3) {
    issues.push(`Không làm bài tập ${missedHomework} buổi trong ${displayTotal} buổi gần nhất (yêu cầu < 3)`)
  }

  // 3. Bất kỳ bài kiểm tra nào có điểm ≤ 6
  if (item.lastTestScore > 0 && item.lastTestScore <= 6) {
    issues.push(`Bài kiểm tra gần nhất điểm ≤ 6 (${item.lastTestScore})`)
  }
  if (item.priorTestScore > 0 && item.priorTestScore <= 6) {
    issues.push(`Bài kiểm tra trước đó điểm ≤ 6 (${item.priorTestScore})`)
  }

  return issues
}

export function getStudentActiveTags(item: StudentCareAlert): string[] {
  const tags: string[] = []
  const hash = stableHash(item.studentId)
  const avgScore = ((item.lastTestScore + item.priorTestScore) / 2).toFixed(1)
  
  // 0. CS Chủ động (CSCĐ) -> Triggered by academic issues
  const academicIssues = getAcademicIssues(item)
  if (academicIssues.length > 0) {
    tags.push('CSCĐ')
  }

  // 1. CS Đặc biệt (Red / Error) -> ĐB
  if (item.careAlert === 'C90B' || item.homeworkCompletion < 70 || parseFloat(avgScore) < 5.0) {
    tags.push('ĐB1')
  }
  
  // 2. CS Định kỳ (Purple) -> ĐK
  if (hash % 3 === 0) {
    tags.push('ĐK1')
    tags.push('ĐK2')
  } else if (hash % 4 === 0) {
    tags.push('ĐK1')
  }
  
  // 3. CS Theo buổi (Warning / Amber) -> TB
  if (item.remainingSessions <= 5 || hash % 5 === 0) {
    tags.push('TB1')
  }
  if (hash % 6 === 0) {
    tags.push('TB2')
  }
  
  const completed = item.completedCareTags || []
  return tags.filter(tag => !completed.includes(tag))
}


export interface CareTag {
  label: string
  semantic: 'error' | 'purple' | 'warning' | 'success' | 'info' | 'neutral'
  description: string
  isOverdue: boolean
  isDueToday?: boolean
  displayLabel?: string
  isCompleted?: boolean
  configRule?: string
  realDataIssue?: string
  occurredDate?: string
  slaText?: string
  assignees?: ('CS' | 'GV')[]
}

export function getCareTagAssignees(tag: CareTag): ('CS' | 'GV')[] {
  if (tag.assignees && tag.assignees.length > 0) {
    return tag.assignees
  }
  const code = (tag.label || '').trim().toUpperCase()
  if (code.startsWith('ĐB')) {
    return ['CS']
  }
  if (code === 'CSCĐ') {
    return ['CS', 'GV']
  }
  if (code === 'ĐK1' || code === 'TB2') {
    return ['GV']
  }
  if (code === 'ĐK2' || code === 'TB1' || code === 'CSTP') {
    return ['CS']
  }
  return ['CS']
}

export function getUnassignedStaffStatus(cls: StudentCareAlert): {
  isUnassigned: boolean
  unassignedText: string
  hasMissingCS: boolean
  hasMissingGV: boolean
} {
  const isCsMissing = !cls.csStaff || cls.csStaff === 'Chưa gán' || cls.csStaff === 'N/A' || stableHash(cls.studentId) % 5 === 0
  const isGvMissing = !cls.teacherCode || cls.teacherCode === 'Chưa gán' || cls.teacherCode === 'N/A' || stableHash(cls.studentId + 'gv') % 7 === 0

  const isUnassigned = isCsMissing || isGvMissing
  let unassignedText = ''
  if (isCsMissing && isGvMissing) {
    unassignedText = 'Chưa gán CS/GV'
  } else if (isCsMissing) {
    unassignedText = 'Chưa gán CS'
  } else if (isGvMissing) {
    unassignedText = 'Chưa gán GV'
  }

  return {
    isUnassigned,
    unassignedText,
    hasMissingCS: isCsMissing,
    hasMissingGV: isGvMissing,
  }
}

export function getStudentCareTags(item: StudentCareAlert): CareTag[] {
  const tags: CareTag[] = []
  const hash = stableHash(item.studentId)
  const avgScore = ((item.lastTestScore + item.priorTestScore) / 2).toFixed(1)

  const getSlaInfo = (code: string, _slaStr: string) => {
    void _slaStr
    const h = stableHash(item.studentId + code)
    const mod = h % 3
    
    if (mod === 0) {
      return { isOverdue: true, isDueToday: false }
    } else if (mod === 1) {
      return { isOverdue: false, isDueToday: true }
    } else {
      return { isOverdue: false, isDueToday: false }
    }
  }
  
  // 0. CS Chủ động (CSCĐ) -> Triggered by academic issues
  const academicIssues = getAcademicIssues(item)
  if (academicIssues.length > 0) {
    tags.push({
      label: 'CSCĐ',
      semantic: 'error',
      description: 'Chăm sóc Chủ động: ' + academicIssues.join(', '),
      isOverdue: false,
      isDueToday: false
    })
  }

  // 1. CS Đặc biệt (Red / Error) -> ĐB
  if (item.careAlert === 'C90B' || item.homeworkCompletion < 70 || parseFloat(avgScore) < 5.0) {
    const slaInfo = getSlaInfo('ĐB1', '24 giờ')
    tags.push({
      label: `ĐB1`,
      semantic: 'error',
      description: 'Chăm sóc Đặc biệt: Cần chăm sóc khẩn cấp do có cảnh báo vận hành hoặc học thuật yếu.',
      isOverdue: slaInfo.isOverdue,
      isDueToday: slaInfo.isDueToday
    })
  }
  
  // 2. CS Định kỳ (Purple) -> ĐK
  if (hash % 3 === 0) {
    const dk1Info = getSlaInfo('ĐK1', '5 ngày')
    tags.push({
      label: `ĐK1`,
      semantic: 'purple',
      description: 'Chăm sóc Định kỳ Kỳ 1: Trao đổi học tập định kỳ hàng tháng.',
      isOverdue: dk1Info.isOverdue,
      isDueToday: dk1Info.isDueToday
    })
    const dk2Info = getSlaInfo('ĐK2', '5 ngày')
    tags.push({
      label: `ĐK2`,
      semantic: 'purple',
      description: 'Chăm sóc Định kỳ Kỳ 2: Trao đổi gia hạn khóa học.',
      isOverdue: dk2Info.isOverdue,
      isDueToday: dk2Info.isDueToday
    })
  } else if (hash % 4 === 0) {
    const dk1Info = getSlaInfo('ĐK1', '5 ngày')
    tags.push({
      label: `ĐK1`,
      semantic: 'purple',
      description: 'Chăm sóc Định kỳ: Điểm chạm kiểm tra định kỳ hàng tháng/giữa kỳ.',
      isOverdue: dk1Info.isOverdue,
      isDueToday: dk1Info.isDueToday
    })
  }
  
  // 3. CS Theo buổi (Warning / Amber) -> TB
  if (item.remainingSessions <= 5 || hash % 5 === 0) {
    const tb1Info = getSlaInfo('TB1', '3 ngày')
    tags.push({
      label: `TB1`,
      semantic: 'warning',
      description: 'Chăm sóc Theo buổi: Chăm sóc phát sinh sau buổi học do nghỉ học/đi muộn hoặc sắp hết buổi.',
      isOverdue: tb1Info.isOverdue,
      isDueToday: tb1Info.isDueToday
    })
  }

  // Dồn thêm chăm sóc theo buổi nếu chưa làm
  if (hash % 6 === 0) {
    const tb2Info = getSlaInfo('TB2', '2 ngày')
    tags.push({
      label: `TB2`,
      semantic: 'warning',
      description: 'Chăm sóc Theo buổi: Nhắc nhở thiếu bài tập về nhà.',
      isOverdue: tb2Info.isOverdue,
      isDueToday: tb2Info.isDueToday
    })
  }

  // 4. CS Tái phí (Success / Green) -> CSTP
  const cstpInfo = getSlaInfo('CSTP', '5 ngày')
  tags.push({
    label: `CSTP`,
    semantic: 'success',
    description: 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới.',
    isOverdue: cstpInfo.isOverdue,
    isDueToday: cstpInfo.isDueToday
  })

  // Custom care tags
  if (item.customCareTags) {
    item.customCareTags.forEach(ct => {
      const slaInfo = getSlaInfo(ct.code, ct.sla.toString().includes('ngày') || ct.sla.toString().includes('h') ? ct.sla.toString() : `${ct.sla} ngày`)
      tags.push({
        label: ct.code,
        semantic: ct.code.startsWith('ĐB')
          ? 'error'
          : ct.code.startsWith('ĐK')
          ? 'purple'
          : ct.code.startsWith('TB')
          ? 'warning'
          : ct.code.startsWith('CSTP')
          ? 'success'
          : 'info',
        description: ct.description || `${ct.name} (SLA: ${ct.sla} ngày)`,
        isOverdue: slaInfo.isOverdue,
        isDueToday: slaInfo.isDueToday
      })
    })
  }
  const completed = item.completedCareTags || []
  
  if (tags.length === 0) {
    tags.push({
      label: `T1`,
      semantic: 'neutral',
      description: 'Chăm sóc Thường: Tương tác chăm sóc, thăm hỏi định kỳ thông thường.',
      isOverdue: false,
      isDueToday: false
    })
  }
  
  return tags.map(tag => {
    const isCompleted = completed.includes(tag.label) || (item.callConfirmation !== 'Chưa gọi' && item.callConfirmation !== 'KNM')
    if (tag.label === 'T1') return { ...tag, displayLabel: tag.label, isCompleted }
    
    let displayPrefix = tag.label
    if (tag.label.startsWith('ĐB')) {
      displayPrefix = 'CSĐB'
    } else if (tag.label.startsWith('ĐK')) {
      displayPrefix = 'CSĐK'
    } else if (tag.label.startsWith('TB')) {
      displayPrefix = 'CSBH'
    } else if (tag.label === 'CSTP') {
      displayPrefix = 'CSTP'
    }
    
    const baseCount = hash % 2 + 1
    const addedLogs = item.interactionLogs.filter(l => l.notes.includes(tag.label)).length
    const count = baseCount + addedLogs
    return {
      ...tag,
      isCompleted,
      displayLabel: count === 1 ? displayPrefix : `${displayPrefix} (${count})`
    }
  })
}

export function hasActiveTags(item: StudentCareAlert): boolean {
  return getStudentActiveTags(item).length > 0
}

export const isCared = (item: StudentCareAlert): boolean => {
  return item.callConfirmation === 'Đã gọi' || item.callConfirmation === 'Đã nhắn Zalo' || item.callConfirmation === 'Đã tương tác' || item.callConfirmation === 'Đã gặp trực tiếp'
}

export const isOverdue = (item: StudentCareAlert): boolean => {
  if (isCared(item)) return false
  const hash = stableHash(item.studentId)
  return !isRescheduled(item) && hash % 3 === 0
}

export const isPending = (item: StudentCareAlert): boolean => {
  if (isCared(item)) return false
  if (isRescheduled(item)) return false
  const hash = stableHash(item.studentId)
  return hash % 3 === 0 && item.interactionLogs.length === 0
}

export const isInProgress = (item: StudentCareAlert): boolean => {
  if (isCared(item)) return false
  if (isRescheduled(item)) return true
  if (item.interactionLogs.length > 0 || (item.callConfirmation && item.callConfirmation !== 'Chưa gọi')) return true
  const hash = stableHash(item.studentId)
  return hash % 3 !== 0
}

export const isWeakAcademic = (item: StudentCareAlert): boolean => {
  const active = getStudentActiveTags(item)
  if (active.length === 0) return false
  const hasAcademicActive = active.includes('ĐB1') || active.includes('TB2')
  return hasAcademicActive && (item.homeworkCompletion < 80 || item.lastTestScore < 6.0 || item.careAlert === 'Học lực yếu')
}

export const isLowAttendance = (item: StudentCareAlert): boolean => {
  const active = getStudentActiveTags(item)
  if (active.length === 0) return false
  const hasAttendanceActive = active.includes('TB1')
  return hasAttendanceActive && parseAttendanceRate(item.attendanceRatio) < 80
}

export const isDecliningTrend = (item: StudentCareAlert): boolean => {
  const active = getStudentActiveTags(item)
  if (active.length === 0) return false
  const hasAcademicActive = active.includes('ĐB1') || active.includes('TB2')
  return hasAcademicActive && item.lastTestScore < item.priorTestScore
}

export const isToday = (item: StudentCareAlert): boolean => {
  const isCompleted = item.callConfirmation === 'Đã gọi' || item.callConfirmation === 'Đã nhắn Zalo' || item.callConfirmation === 'Đã tương tác' || item.callConfirmation === 'Đã gặp trực tiếp'
  if (isCompleted) return false
  const hash = stableHash(item.studentId)
  return !isRescheduled(item) && !isOverdue(item) && hash % 3 === 1
}

export const isHomeworkAlert = (item: StudentCareAlert): boolean => {
  const active = getStudentActiveTags(item)
  if (active.length === 0) return false
  return active.includes('TB2') || item.homeworkCompletion < 80
}

export function getConsecutiveAbsences(studentId: string): number {
  const hash = stableHash(studentId)
  return hash % 5
}

export function getConsecutiveMissingHomework(studentId: string): number {
  const hash = stableHash(studentId)
  return (hash + 2) % 5
}

export function getConsecutiveLowScores(studentId: string): number {
  const hash = stableHash(studentId)
  return (hash + 4) % 5
}

export interface RescheduleInfo {
  isRescheduled: boolean
  rescheduleDate?: string
  rescheduleTime?: string
  rescheduleLabel?: string
}

export function getRescheduleInfo(item: StudentCareAlert): RescheduleInfo {
  const hash = stableHash(item.studentId)
  const isCompleted = item.callConfirmation === 'Đã gọi' || item.callConfirmation === 'Đã nhắn Zalo' || item.callConfirmation === 'Đã tương tác' || item.callConfirmation === 'Đã gặp trực tiếp'

  if (isCompleted) {
    return { isRescheduled: false }
  }

  const hasAppointment = item.callConfirmation === 'KNM' || hash % 4 === 1 || item.careAlert === 'Hẹn gọi lại'

  if (hasAppointment) {
    const day = (hash % 5) + 24
    const date = `${day.toString().padStart(2, '0')}/07/2026`
    const time = `${14 + (hash % 4)}:00`
    return {
      isRescheduled: true,
      rescheduleDate: date,
      rescheduleTime: time,
      rescheduleLabel: `Hẹn gọi lại: ${date} ${time}`
    }
  }

  return { isRescheduled: false }
}

export const isRescheduled = (item: StudentCareAlert): boolean => {
  return getRescheduleInfo(item).isRescheduled
}

/**
 * Returns top N urgent care alerts (e.g. overdue SLA, weak academic, low attendance)
 * sorted by urgency level.
 */
export function getTopUrgentAlerts(alerts: StudentCareAlert[], limit: number = 5): StudentCareAlert[] {
  return [...alerts]
    .map(item => {
      let score = 0
      if (isOverdue(item)) score += 50
      if (isWeakAcademic(item)) score += 30
      if (isLowAttendance(item)) score += 20
      if (isPending(item)) score += 10
      return { item, score }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.item)
}

export interface RolePerformanceSummary {
  totalAlerts: number
  caredAlerts: number
  overdueAlerts: number
  inTimeRate: number
}

export interface StaffPerformanceMetric {
  staffName: string
  role: 'CS' | 'GV'
  assignedCount: number
  caredCount: number
  overdueCount: number
  inTimeRate: number
}

export interface MonthFilterOption {
  value: string
  label: string
}

/**
 * Dynamically generates a rolling list of 12 months ending at the current date
 * to handle year-end and year-start rollovers seamlessly.
 */
export function getDynamicMonthFilterOptions(referenceDate: Date = new Date(2026, 6, 25)): MonthFilterOption[] {
  const currentYear = referenceDate.getFullYear()
  const options: MonthFilterOption[] = []

  for (let i = 0; i < 12; i++) {
    const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1)
    const m = (d.getMonth() + 1).toString().padStart(2, '0')
    const y = d.getFullYear()
    const value = `${m}/${y}`
    const label = y === currentYear ? `Tháng ${d.getMonth() + 1}` : `Tháng ${d.getMonth() + 1}/${y}`
    options.push({ value, label })
  }

  return options
}

export function calculateStaffPerformanceMetrics(alerts: StudentCareAlert[]): {
  csSummary: RolePerformanceSummary
  gvSummary: RolePerformanceSummary
  staffList: StaffPerformanceMetric[]
} {
  let totalCSAlerts = 0
  let caredCSAlerts = 0
  let overdueCSAlerts = 0

  let totalGVAlerts = 0
  let caredGVAlerts = 0
  let overdueGVAlerts = 0

  const csMap = new Map<string, { total: number; cared: number; overdue: number }>()
  const gvMap = new Map<string, { total: number; cared: number; overdue: number }>()

  alerts.forEach(item => {
    const isItemOverdue = isOverdue(item)
    const isItemCared = isCared(item)

    // CS metrics
    if (item.csStaff) {
      totalCSAlerts++
      if (isItemCared) caredCSAlerts++
      if (isItemOverdue) overdueCSAlerts++

      const current = csMap.get(item.csStaff) || { total: 0, cared: 0, overdue: 0 }
      current.total++
      if (isItemCared) current.cared++
      if (isItemOverdue) current.overdue++
      csMap.set(item.csStaff, current)
    }

    // Teacher metrics
    const teacherName = item.teacherCode ? (item.teacherCode.startsWith('GV') ? item.teacherCode : `GV ${item.teacherCode}`) : 'GV Chưa gán'
    totalGVAlerts++
    if (isItemCared) caredGVAlerts++
    if (isItemOverdue) overdueGVAlerts++

    const currentGv = gvMap.get(teacherName) || { total: 0, cared: 0, overdue: 0 }
    currentGv.total++
    if (isItemCared) currentGv.cared++
    if (isItemOverdue) currentGv.overdue++
    gvMap.set(teacherName, currentGv)
  })

  const csSummary: RolePerformanceSummary = {
    totalAlerts: totalCSAlerts,
    caredAlerts: caredCSAlerts,
    overdueAlerts: overdueCSAlerts,
    inTimeRate: totalCSAlerts > 0 ? Math.round(((totalCSAlerts - overdueCSAlerts) / totalCSAlerts) * 100) : 100
  }

  const gvSummary: RolePerformanceSummary = {
    totalAlerts: totalGVAlerts,
    caredAlerts: caredGVAlerts,
    overdueAlerts: overdueGVAlerts,
    inTimeRate: totalGVAlerts > 0 ? Math.round(((totalGVAlerts - overdueGVAlerts) / totalGVAlerts) * 100) : 100
  }

  const staffList: StaffPerformanceMetric[] = []

  csMap.forEach((val, name) => {
    staffList.push({
      staffName: name,
      role: 'CS',
      assignedCount: val.total,
      caredCount: val.cared,
      overdueCount: val.overdue,
      inTimeRate: val.total > 0 ? Math.round(((val.total - val.overdue) / val.total) * 100) : 100
    })
  })

  gvMap.forEach((val, name) => {
    staffList.push({
      staffName: name,
      role: 'GV',
      assignedCount: val.total,
      caredCount: val.cared,
      overdueCount: val.overdue,
      inTimeRate: val.total > 0 ? Math.round(((val.total - val.overdue) / val.total) * 100) : 100
    })
  })

  // Sort by overdue descending, then assigned count descending
  staffList.sort((a, b) => b.overdueCount - a.overdueCount || b.assignedCount - a.assignedCount)

  return { csSummary, gvSummary, staffList }
}



