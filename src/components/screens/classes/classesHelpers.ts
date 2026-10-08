import type { ClassRecord, ScheduleSlot } from '@/mocks/classRecords'
import type { StatusSemantic } from '@/lib/statusColors'
import { mockStudents } from '@/mocks/students'

export type ClassStatusFilter = 'all' | ClassRecord['status']

export interface ClassFilterState {
  branches: string[]
  levels: string[]
  teachers: string[]
  rooms: string[]
  weekdays: string[]
  times: string[]
  subjects: string[]
  programs: string[]
  learningPaths: string[]
  syllabuses: string[]
  packages: string[]
  statuses: string[]
  dateRanges: string[]
  studentSearch: string
}


export function countClassesByStatus(items: ClassRecord[], status: ClassStatusFilter): number {
  if (status === 'all') return items.filter((c) => c.status !== 'huy').length
  return items.filter((c) => c.status === status).length
}

export const getSubjectByLevel = (level: string): string => {
  const l = level.toLowerCase()
  if (l.includes('ielts') || l.includes('toeic') || l.includes('beginner') || l.includes('english') || l.includes('prep') || l.includes('movers') || l.includes('flyers')) {
    return 'english'
  }
  if (l.includes('japanese')) return 'japanese'
  if (l.includes('stem')) return 'stem'
  if (l.includes('math')) return 'math'
  return 'english'
}

export function filterClasses(
  items: ClassRecord[],
  filters: {
    search: string
    branch: string
    status: ClassStatusFilter
    subject?: string
    extra: ClassFilterState
  }
): ClassRecord[] {
  const query = filters.search.trim().toLowerCase()
  
  // Helpers for mapping and schedule checks
  const getProgramByLevel = (level: string): string => {
    const l = level.toLowerCase()
    if (l.includes('ielts')) return 'IELTS Foundation'
    if (l.includes('stem')) return 'STEM Robotics'
    if (l.includes('math')) return 'Toán tư duy'
    return 'Tiếng Anh'
  }

  const matchWeekday = (schedule: string, slots: ScheduleSlot[], targetWeekday: string): boolean => {
    const dayNum = targetWeekday.replace('Thứ ', '')
    const shortHand = dayNum === 'Chủ nhật' ? 'CN' : `T${dayNum}`
    
    if (schedule.includes(shortHand)) return true
    if (targetWeekday === 'Chủ nhật' && (schedule.toLowerCase().includes('cn') || schedule.toLowerCase().includes('chủ nhật'))) return true
    if (slots && slots.some(s => s.dayOfWeek && s.dayOfWeek.includes(dayNum))) return true
    return false
  }

  const matchShift = (schedule: string, slots: ScheduleSlot[], targetShift: string): boolean => {
    const times: string[] = []
    const matched = schedule.match(/\b\d{2}:\d{2}\b/g)
    if (matched) {
      matched.forEach(t => times.push(t))
    }
    if (slots) {
      slots.forEach(s => {
        if (s.startTime) times.push(s.startTime)
      })
    }
    if (times.length === 0) return false
    return times.some(time => {
      const hour = parseInt(time.split(':')[0], 10)
      const minute = parseInt(time.split(':')[1], 10)
      const totalMinutes = hour * 60 + minute
      if (targetShift === 'sang') return totalMinutes < 12 * 60
      if (targetShift === 'chieu') return totalMinutes >= 12 * 60 && totalMinutes <= 17 * 60 + 30
      if (targetShift === 'toi') return totalMinutes > 17 * 60 + 30
      return false
    })
  }

  const matchDateRange = (startDateStr: string, rangeValue: string): boolean => {
    const startDate = new Date(startDateStr)
    const year = startDate.getFullYear()
    const month = startDate.getMonth() + 1
    if (rangeValue === 'this_month') return year === 2026 && month === 6
    if (rangeValue === 'next_month') return year === 2026 && month === 7
    if (rangeValue === 'past') return startDate < new Date('2026-06-01')
    return false
  }

  return items.filter((c) => {
    if (filters.branch !== 'all' && c.branch !== filters.branch) return false
    if (filters.status !== 'all' && c.status !== filters.status) return false
    if (filters.status === 'all' && c.status === 'huy') return false
    if (filters.subject && filters.subject !== 'all' && getSubjectByLevel(c.level) !== filters.subject) return false

    
    // Multi-select basic filters
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(c.branch)) return false
    if (filters.extra.levels.length > 0 && !filters.extra.levels.includes(c.level)) return false
    if (filters.extra.teachers.length > 0 && !filters.extra.teachers.includes(c.teacher)) return false
    if (filters.extra.rooms.length > 0 && !filters.extra.rooms.includes(c.room)) return false
    
    // Expanded academic filters
    if (filters.extra.subjects.length > 0 && !filters.extra.subjects.includes(getSubjectByLevel(c.level))) return false
    if (filters.extra.programs.length > 0 && !filters.extra.programs.includes(getProgramByLevel(c.level))) return false

    // Pathway (Lộ trình)
    if (filters.extra.learningPaths && filters.extra.learningPaths.length > 0) {
      const currentPath = c.learningPath ? c.learningPath.split('→')[0].trim() : ''
      if (!filters.extra.learningPaths.includes(currentPath)) return false
    }

    // Syllabus (Chương trình)
    if (filters.extra.syllabuses && filters.extra.syllabuses.length > 0) {
      if (!c.syllabus || !filters.extra.syllabuses.includes(c.syllabus)) return false
    }

    // Package (Gói đăng ký)
    if (filters.extra.packages && filters.extra.packages.length > 0) {
      const classStudents = mockStudents.filter(
        (s) => s.enrolledClass === c.name || (s.enrolledClasses && s.enrolledClasses.some((ec) => ec.className === c.name))
      )
      const studentPackages = classStudents.map((s) => s.packageName).filter(Boolean) as string[]
      if (!studentPackages.some((pkg) => filters.extra.packages.includes(pkg))) return false
    }

    if (filters.extra.statuses.length > 0 && !filters.extra.statuses.includes(c.status)) return false


    // Weekdays and shifts
    if (filters.extra.weekdays.length > 0 && !filters.extra.weekdays.some(w => matchWeekday(c.schedule, c.scheduleSlots || [], w))) return false
    if (filters.extra.times.length > 0 && !filters.extra.times.some(t => matchShift(c.schedule, c.scheduleSlots || [], t))) return false
    
    // Start date ranges
    if (filters.extra.dateRanges.length > 0 && !filters.extra.dateRanges.some(r => matchDateRange(c.startDate, r))) return false
    
    // Student Search (free text check on mock students matching name, id or phone)
    if (filters.extra.studentSearch) {
      const sq = filters.extra.studentSearch.trim().toLowerCase()
      const matchingClassNames = new Set(
        mockStudents
          .filter((s) => 
            s.name.toLowerCase().includes(sq) || 
            s.id.toLowerCase().includes(sq) ||
            (s.phone && s.phone.includes(sq))
          )
          .map((s) => s.enrolledClass)
          .filter(Boolean) as string[]
      )
      if (!matchingClassNames.has(c.name)) return false
    }

    if (query) {
      const haystack = [c.name, c.code, c.teacher, c.room, c.schedule].join(' ').toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function nextClassId(items: ClassRecord[]): string {
  const max = items.reduce((acc, c) => {
    const numeric = Number.parseInt(c.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `cls-${String(max + 1).padStart(3, '0')}`
}

export function getOccupancyRatio(c: ClassRecord): number {
  if (c.maxStudents <= 0) return 0
  return Math.min(1, c.enrolledStudents / c.maxStudents)
}

export const STATUS_SEMANTIC_MAP: Record<ClassRecord['status'], StatusSemantic> = {
  nhap: 'neutral',
  mo_chieu_sinh: 'info',
  cho_khai_giang: 'purple',
  dang_hoc: 'success',
  tam_dung: 'warning',
  huy: 'completed',
}

export const CLASS_LEVEL_LABELS: Record<string, string> = {
  IELTS: 'IELTS',
  TOEIC: 'TOEIC',
  Beginner: 'Tiếng Anh cơ bản',
  English: 'Tiếng Anh tổng quát',
  Japanese: 'Tiếng Nhật',
  Movers: 'Movers (Cambridge)',
  Flyers: 'Flyers (Cambridge)',
  'KET Prep': 'KET (A2)',
  'PET Prep': 'PET (B1)',
}

export function getClassLevelLabel(level: string): string {
  return CLASS_LEVEL_LABELS[level] ?? level
}

export function getClassAttendanceRate(cls: ClassRecord): number {
  if (typeof cls.attendanceRate === 'number') return cls.attendanceRate
  if (cls.status === 'nhap' || cls.status === 'cho_khai_giang') return 0
  const len = cls.name.length
  return Math.min(100, Math.max(72, 85 + ((len * 7) % 15)))
}

export function getClassHomeworkRate(cls: ClassRecord): number {
  if (typeof cls.homeworkRate === 'number') return cls.homeworkRate
  if (cls.status === 'nhap' || cls.status === 'cho_khai_giang') return 0
  const len = cls.name.length
  return Math.min(100, Math.max(65, 78 + ((len * 9) % 21)))
}

export function getClassAvgTestScore(cls: ClassRecord): number {
  if (typeof cls.avgTestScore === 'number') return cls.avgTestScore
  if (cls.status === 'nhap' || cls.status === 'cho_khai_giang') return 0
  const len = cls.name.length
  const score = 6.8 + ((len * 11) % 28) / 10
  return Number(score.toFixed(1))
}

export function getClassSpecialCareCount(cls: ClassRecord): number {
  if (typeof cls.specialCareCount === 'number') return cls.specialCareCount
  if (cls.status === 'nhap' || cls.status === 'cho_khai_giang') return 0
  const len = cls.name.length
  return len % 5 === 0 ? 3 : len % 3 === 0 ? 2 : len % 2 === 0 ? 1 : 0
}

export function getClassNewStudents(cls: ClassRecord): number {
  if (typeof cls.newStudents === 'number') return cls.newStudents
  if (cls.status === 'nhap' || cls.status === 'cho_khai_giang') return 0
  const len = cls.name.length
  return len % 4 === 0 ? 3 : len % 3 === 0 ? 2 : len % 2 === 0 ? 1 : 0
}

export function hasTeacherLeave(cls: ClassRecord): boolean {
  if (!cls) return false
  if (cls.scheduleSlots && cls.scheduleSlots.some((s) => s.isLeave)) return true
  return false
}

const TEACHER_FULL_NAME_MAP: Record<string, string> = {
  'Cô Hoàng Thị Mai': 'Hoàng Thị Mai',
  'Hoàng Thị Mai': 'Hoàng Thị Mai',
  'Cô Mai': 'Hoàng Thị Mai',
  'Mai': 'Hoàng Thị Mai',
  'Thầy Đức': 'Trịnh Minh Đức',
  'Đức': 'Trịnh Minh Đức',
  'Thầy Hùng': 'Nguyễn Mạnh Hùng',
  'Hùng': 'Nguyễn Mạnh Hùng',
  'Cô Hương': 'Nguyễn Thu Hương',
  'Hương': 'Nguyễn Thu Hương',
  'Cô Nga': 'Trịnh Thúy Nga',
  'Nga': 'Trịnh Thúy Nga',
  'Thầy Quân': 'Trần Minh Quân',
  'Quân': 'Trần Minh Quân',
  'Cô Lan': 'Lê Thị Lan',
  'Lan': 'Lê Thị Lan',
  'Thầy Nam': 'Nguyễn Hoàng Nam',
  'Nam': 'Nguyễn Hoàng Nam',
  'Cô Hoa': 'Nguyễn Thị Hoa',
  'Hoa': 'Nguyễn Thị Hoa',
  'Cô Mỹ Linh': 'Phạm Mỹ Linh',
  'Mỹ Linh': 'Phạm Mỹ Linh',
  'Thầy Minh': 'Nguyễn Văn Minh',
  'Minh': 'Nguyễn Văn Minh',
  'Thầy Tuấn': 'Lê Anh Tuấn',
  'Tuấn': 'Lê Anh Tuấn',
  'Cô Phương': 'Trần Hà Phương',
  'Phương': 'Trần Hà Phương',
  'Cô Hải': 'Đỗ Thanh Hải',
  'Hải': 'Đỗ Thanh Hải',
}

export function formatTeacherFullName(name?: string): string {
  if (!name) return ''
  const trimmed = name.trim()
  if (TEACHER_FULL_NAME_MAP[trimmed]) {
    return TEACHER_FULL_NAME_MAP[trimmed]
  }
  const cleaned = trimmed.replace(/^(Cô|Thầy|GV\.|GV)\s+/i, '').trim()
  if (TEACHER_FULL_NAME_MAP[cleaned]) {
    return TEACHER_FULL_NAME_MAP[cleaned]
  }
  return cleaned
}

/**
 * Chuyển đổi an toàn chuỗi ngày tháng (DD/MM/YYYY hoặc YYYY-MM-DD) sang epoch timestamp (ms).
 */
export function parseDateToTimestamp(dateStr?: string): number {
  if (!dateStr || dateStr === '—') return Number.MAX_SAFE_INTEGER
  const dmyMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch
    return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
  }
  const timestamp = new Date(dateStr).getTime()
  return isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp
}

/**
 * Trọng số ưu tiên vòng đời trạng thái lớp học (Smart Operational Lifecycle)
 * 1. Đang học (vận hành hàng ngày)
 * 2. Chờ khai giảng (chuẩn bị phòng, GV, tài liệu, tuyển sinh)
 * 3. Tạm nghỉ (cần rà soát)
 * 4. Mở chiêu sinh
 * 5. Nháp (kế hoạch dự kiến)
 * 6. Đã kết thúc
 */
export const CLASS_LIFECYCLE_WEIGHT: Record<string, number> = {
  dang_hoc: 1,
  cho_khai_giang: 2,
  tam_dung: 3,
  mo_chieu_sinh: 4,
  nhap: 5,
  huy: 6,
}

/**
 * Kiểm tra xem lớp học có cảnh báo vận hành cần xử lý gấp không:
 * - Giáo viên xin nghỉ phép (cần bố trí dạy thay)
 * - Chưa được phân công giáo viên
 */
export function hasOperationalAlert(cls: ClassRecord): boolean {
  if (hasTeacherLeave(cls)) return true
  if (!cls.teacher || cls.teacher === 'Chưa gán' || cls.teacher.trim() === '') return true
  return false
}

/**
 * Sắp xếp mặc định thông minh cho danh sách lớp học (Smart Default Operational Sort)
 * 
 * BẬC 1 - Cảnh báo vận hành gấp:
 *   Lớp có giáo viên nghỉ phép hoặc chưa gán GV được ưu tiên đưa lên đầu bảng để giáo vụ xử lý.
 * 
 * BẬC 2 - Vòng đời trạng thái:
 *   Gom nhóm theo thứ tự: Đang học -> Chờ khai giảng -> Tạm nghỉ -> Nháp -> Đã kết thúc.
 * 
 * BẬC 3 - Thời gian tiệm cận:
 *   - Lớp "Đang học": Xếp theo buổi học tới gần nhất (nextSession.date tăng dần: hôm nay, ngày mai...).
 *   - Lớp "Chờ khai giảng" / "Nháp": Xếp theo ngày khai giảng gần nhất (startDate tăng dần).
 * 
 * BẬC 4 - Tên lớp / Mã lớp:
 *   Xếp theo bảng chữ cái A -> Z nếu cùng thứ hạng thời gian.
 */
export function sortClassesByOperationalPriority(classes: ClassRecord[]): ClassRecord[] {
  return [...classes].sort((a, b) => {
    // Bậc 1: Cảnh báo vận hành cần xử lý gấp
    const alertA = hasOperationalAlert(a) ? 1 : 0
    const alertB = hasOperationalAlert(b) ? 1 : 0
    if (alertA !== alertB) {
      return alertB - alertA
    }

    // Bậc 2: Vòng đời trạng thái lớp
    const weightA = CLASS_LIFECYCLE_WEIGHT[a.status] ?? 99
    const weightB = CLASS_LIFECYCLE_WEIGHT[b.status] ?? 99
    if (weightA !== weightB) {
      return weightA - weightB
    }

    // Bậc 3: Thời gian cụ thể theo từng loại trạng thái
    if (a.status === 'dang_hoc' && b.status === 'dang_hoc') {
      const nextA = parseDateToTimestamp(a.nextSession?.date)
      const nextB = parseDateToTimestamp(b.nextSession?.date)
      if (nextA !== nextB) {
        return nextA - nextB
      }
    }

    if (
      (a.status === 'cho_khai_giang' || a.status === 'nhap' || a.status === 'mo_chieu_sinh') &&
      a.status === b.status
    ) {
      const startA = parseDateToTimestamp(a.startDate)
      const startB = parseDateToTimestamp(b.startDate)
      if (startA !== startB) {
        return startA - startB
      }
    }

    // Bậc 4: Tên lớp A -> Z
    return a.name.localeCompare(b.name, 'vi')
  })
}



