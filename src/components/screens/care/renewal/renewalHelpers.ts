import { StudentCareAlert } from '@/mocks/careAlerts'

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
    
    // TB
    { action: 'Gửi tin nhắn ưu đãi Early Bird', staff: 'AnhNT33 (CSM)', date: '28/06/2026', note: 'Đã gửi thông tin chuyển khoản và chương trình ưu đãi đóng sớm qua Zalo cho buổi học thử.', channel: 'zalo', tag: 'TB', semantic: 'warning' },
    { action: 'Nhắc nhở học tập theo buổi', staff: 'AnhNT33 (CSM)', date: '26/06/2026', note: 'Trao đổi kết quả chuyên cần của học viên sau buổi học.', channel: 'telephone', duration: '1 phút 40 giây', tag: 'TB', semantic: 'warning' },

    // ĐK
    { action: 'Điểm chạm tư vấn chồng phí', staff: 'MinhLH (CSM)', date: '15/06/2026', note: 'Phụ huynh đang cân nhắc giữa gói 6 tháng và 12 tháng do muốn xin thêm voucher.', channel: 'telephone', duration: '2 phút 15 giây', tag: 'ĐK', semantic: 'purple' },
    { action: 'Gửi nhận xét định kỳ tháng 5', staff: 'MinhLH (CSM)', date: '12/06/2026', note: 'Đã gửi nhận xét kết quả học tập tháng 5 qua Zalo cho phụ huynh.', channel: 'zalo', tag: 'ĐK', semantic: 'purple' },

    // ĐB
    { action: 'Cảnh báo học tập đặc biệt', staff: 'AnhNT33 (CSM)', date: '05/06/2026', note: 'Liên hệ trao đổi về tình hình học lực yếu và đề xuất giải pháp phụ đạo.', channel: 'telephone', duration: '3 phút 10 giây', tag: 'ĐB', semantic: 'error' }
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

/**
 * Categorizes expected end date into Month T, T1, or T2+T3
 */
export function getExpirationCategory(expectedEndDateStr: string): 'T' | 'T1' | 'T2T3' {
  if (!expectedEndDateStr) return 'T'
  const parts = expectedEndDateStr.split('/')
  if (parts.length < 3) return 'T'
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)
  
  if (year < 2026) {
    return 'T'
  }
  if (year === 2026) {
    if (month <= 7) {
      return 'T'
    }
    if (month === 8) {
      return 'T1'
    }
    return 'T2T3' // September, October, or later in 2026
  }
  return 'T2T3' // 2027 or later
}

export type RenewalClassification =
  | 'moi'
  | 'can_nhac'
  | 'tiem_nang'
  | 'hen_tai'
  | 'tai_phi'
  | 'chong_phi'
  | 'rut_phi'
  | 'that_bai'
  | 'dang_cham_soc'

export function getOfficialStatus(classification: RenewalClassification): 'dang_cham_soc' | 'tai_phi' | 'chong_phi' | 'rut_phi' | 'that_bai' {
  switch (classification) {
    case 'moi':
    case 'can_nhac':
    case 'tiem_nang':
    case 'hen_tai':
    case 'dang_cham_soc':
      return 'dang_cham_soc'
    case 'tai_phi':
      return 'tai_phi'
    case 'chong_phi':
      return 'chong_phi'
    case 'rut_phi':
      return 'rut_phi'
    case 'that_bai':
      return 'that_bai'
  }
}

export function getOfficialStatusLabel(status: string): string {
  switch (status) {
    case 'dang_cham_soc':
      return 'Đang chăm sóc'
    case 'tai_phi':
      return 'Đã tái phí'
    case 'chong_phi':
      return 'Chồng Phí'
    case 'rut_phi':
      return 'Rút phí'
    case 'that_bai':
      return 'Thất bại'
    default:
      return 'Đang chăm sóc'
  }
}

export function getRenewalClassification(item: StudentCareAlert): RenewalClassification {
  const custom = (item as StudentCareAlert & { renewalClassification?: RenewalClassification }).renewalClassification
  if (custom) return custom

  const hash = stableHash(item.studentId)
  
  if (item.interactionNotes?.includes('chồng') || item.interactionNotes?.includes('thành công')) {
    return 'tai_phi'
  }
  if (item.interactionNotes?.includes('rút phí') || item.interactionNotes?.includes('thất bại')) {
    return 'that_bai'
  }
  if (item.interactionNotes?.includes('hẹn')) {
    return 'hen_tai'
  }
  if (item.interactionNotes?.includes('tiềm năng')) {
    return 'tiem_nang'
  }
  if (item.interactionNotes?.includes('cân nhắc')) {
    return 'can_nhac'
  }
  if (item.interactionNotes?.includes('mới')) {
    return 'moi'
  }

  const mod = hash % 6
  if (mod === 0) return 'moi'
  if (mod === 1) return 'can_nhac'
  if (mod === 2) return 'tiem_nang'
  if (mod === 3) return 'hen_tai'
  if (mod === 4) return 'tai_phi'
  return 'that_bai'
}

export function getUpsaleClassification(item: StudentCareAlert): RenewalClassification {
  if (item.upsaleClassification) return item.upsaleClassification as RenewalClassification
  return 'moi'
}

export function getRenewalClassificationLabel(classification: RenewalClassification): string {
  switch (classification) {
    case 'moi':
      return 'Mới'
    case 'can_nhac':
      return 'Cân nhắc'
    case 'tiem_nang':
      return 'Tiềm năng'
    case 'hen_tai':
      return 'Hẹn tái'
    case 'tai_phi':
      return 'Đã tái phí'
    case 'chong_phi':
      return 'Chồng Phí'
    case 'rut_phi':
      return 'Rút phí'
    case 'that_bai':
      return 'Thất bại'
    case 'dang_cham_soc':
      return 'Chăm sóc'
  }
}

export interface AlertRowMetrics {
  rating: string
  votes: number
  evaluationComment: string
  homeworkDone: number
  avgScore: string
  high: string
  low: string
  level: string
  trendText: string
  trendColor: string
  recentAttStatus: string
  recentAttColor: string
  recentHwStatus: string
  recentHwColor: string
}

export function getAlertRowMetrics(cls: StudentCareAlert): AlertRowMetrics {
  const hash = stableHash(cls.studentId)
  const attRate = parseAttendanceRate(cls.attendanceRatio)
  const avgScore = ((cls.lastTestScore + cls.priorTestScore) / 2).toFixed(1)
  
  // Rating & Votes
  const rating = ((hash % 15 + 35) / 10).toFixed(1)
  const votes = hash % 12 + 6
  
  // Evaluation comment
  const val = parseFloat(rating)
  let evaluationComment = 'Tiến bộ rõ rệt trong tháng qua'
  if (val >= 4.5) evaluationComment = 'Hoàn thành bài tập đầy đủ, tích cực phát biểu'
  else if (val >= 4.0) evaluationComment = 'Tương tác tốt với bạn cùng lớp'
  else if (val >= 3.5) evaluationComment = 'Hay nghỉ học, cần theo dõi sát'

  // Homework done
  const homeworkDone = Math.round((cls.homeworkCompletion / 100) * cls.totalSessions)

  // Scores
  const high = Math.max(cls.lastTestScore, cls.priorTestScore, 7.5).toFixed(1)
  const low = Math.min(cls.lastTestScore, cls.priorTestScore, 4.0).toFixed(1)

  // Level
  const isMath = cls.subject === 'Toán tư duy'
  const level = isMath
    ? (hash % 2 === 0 ? 'M1' : 'M2')
    : (hash % 2 === 0 ? 'A2+' : 'B1')

  // Trend
  const isImproving = cls.lastTestScore > cls.priorTestScore
  const isDeclining = cls.lastTestScore < cls.priorTestScore
  const trendText = isImproving ? 'Tiến bộ' : isDeclining ? 'Cần cải thiện' : 'Ổn định'
  const trendColor = isImproving
    ? 'text-emerald-600 dark:text-emerald-400'
    : isDeclining
      ? 'text-rose-600 dark:text-rose-400'
      : 'text-zinc-500'

  // Attendance and Homework Statuses
  const recentAttStatus = attRate >= 90 ? 'Đi học' : attRate >= 85 ? 'Đi muộn' : 'Vắng mặt'
  const recentAttColor = attRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' : attRate >= 85 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'

  const recentHwStatus = cls.homeworkCompletion >= 90 ? 'Đã nộp' : cls.homeworkCompletion >= 80 ? 'Nộp muộn' : 'Chưa nộp'
  const recentHwColor = cls.homeworkCompletion >= 90 ? 'text-emerald-600 dark:text-emerald-400' : cls.homeworkCompletion >= 80 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'

  return {
    rating,
    votes,
    evaluationComment,
    homeworkDone,
    avgScore,
    high,
    low,
    level,
    trendText,
    trendColor,
    recentAttStatus,
    recentAttColor,
    recentHwStatus,
    recentHwColor
  }
}

export interface StudentOrderInfo {
  orderCode?: string
  packageName: string
  packageAmount?: string
  paymentTerm?: string
}

export function getStudentOrderInfo(item: StudentCareAlert): StudentOrderInfo {
  const classification = getRenewalClassification(item)
  const hash = stableHash(item.studentId)

  // 1. Học viên Mới -> Chưa có đơn hàng nháp -> Hiển thị nút "+ Tạo đơn nháp"
  if (classification === 'moi') {
    return {
      orderCode: undefined,
      packageName: 'Chưa chọn gói',
      packageAmount: undefined,
      paymentTerm: undefined,
    }
  }

  // 2. Học viên Cân nhắc / Tiềm năng / Hẹn tái -> Đa số hiển thị nút "+ Tạo đơn nháp" hoặc đơn nháp đang giữ chỗ/chưa cọc
  if (classification === 'can_nhac' || classification === 'tiem_nang' || classification === 'hen_tai') {
    if (hash % 2 === 0) {
      return {
        orderCode: undefined,
        packageName: item.subject === 'Toán tư duy' ? 'Gói Toán Archimedes 12T' : 'Gói Tiếng Anh Level 5 12T',
        packageAmount: undefined,
        paymentTerm: undefined,
      }
    }
    const draftOrders: StudentOrderInfo[] = [
      { orderCode: `OD-DRAFT-${9230 + (hash % 10)}`, packageName: 'Gói SuperKids 12T', packageAmount: '18.000.000đ', paymentTerm: 'Chưa cọc' },
      { orderCode: `OD-DRAFT-${9230 + (hash % 10)}`, packageName: 'Gói Movers Bán Trú 1N', packageAmount: '28.000.000đ', paymentTerm: 'Giữ chỗ 24h' },
      { orderCode: `OD-DRAFT-${9230 + (hash % 10)}`, packageName: 'Gói Starters 6T', packageAmount: '14.000.000đ', paymentTerm: 'Hẹn nộp 100%' },
      { orderCode: `OD-DRAFT-${9230 + (hash % 10)}`, packageName: 'Gói IELTS Junior 1N', packageAmount: '35.000.000đ', paymentTerm: 'Cọc 2 triệu' },
    ]
    return draftOrders[hash % draftOrders.length]
  }

  // 3. Học viên Đã tái phí / Chồng phí -> Đã có đơn hàng kích hoạt / đóng phí thành công
  if (classification === 'tai_phi' || classification === 'chong_phi') {
    const successOrders: StudentOrderInfo[] = [
      { orderCode: `OD-DRAFT-${9240 + (hash % 10)}`, packageName: 'Gói SuperKids 12T', packageAmount: '18.000.000đ', paymentTerm: 'Thanh toán 100%' },
      { orderCode: `OD-DRAFT-${9240 + (hash % 10)}`, packageName: 'Gói Kindy Mẫu giáo 12T', packageAmount: '20.000.000đ', paymentTerm: 'Thanh toán 100%' },
      { orderCode: `OD-DRAFT-${9240 + (hash % 10)}`, packageName: 'Gói Flyers Intensive 6T', packageAmount: '22.000.000đ', paymentTerm: 'Đã cọc 5 triệu' },
      { orderCode: `OD-DRAFT-${9240 + (hash % 10)}`, packageName: 'Gói Kindy Mẫu giáo 1N', packageAmount: '18.000.000đ', paymentTerm: 'Trả góp 3 kỳ' },
    ]
    return successOrders[hash % successOrders.length]
  }

  // 4. Các trạng thái khác (Thất bại, Rút phí...)
  return {
    orderCode: undefined,
    packageName: 'Không có đơn',
    packageAmount: undefined,
    paymentTerm: undefined,
  }
}



