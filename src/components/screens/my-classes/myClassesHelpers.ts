import type { ClassRecord } from '@/mocks/classRecords'
import type { PersonnelItem } from '@/components/shared/PersonnelCell'
import type { MyClassesFilterState } from './myClassesTypes'

export interface StudentCareTag {
  code: string
  label: string
  category: 'risk' | 'attendance' | 'academic' | 'excellent' | 'vip'
}

export interface SpecialStudent {
  id: string
  code: string
  name: string
  avatar: string
  type: 'at_risk' | 'excellent' | 'vip'
  reason: string
  careTags: StudentCareTag[]
}

export interface ClassAcademicStats {
  attendanceRate: number
  homeworkRate: number
  avgTestScore: number
  specialStudents: SpecialStudent[]
}

export type ClassTeacher = PersonnelItem

export function filterMyClasses(
  classes: ClassRecord[],
  filters: MyClassesFilterState
): ClassRecord[] {
  return classes.filter((cls) => {
    // 1. Search term match (name, code, room, teacher)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim()
      const matchName = cls.name.toLowerCase().includes(q)
      const matchCode = cls.code.toLowerCase().includes(q)
      const matchRoom = cls.room?.toLowerCase().includes(q)
      const matchTeacher = cls.teacher?.toLowerCase().includes(q)
      const matchSyllabus = cls.syllabus?.toLowerCase().includes(q)
      if (!matchName && !matchCode && !matchRoom && !matchTeacher && !matchSyllabus) {
        return false
      }
    }

    // 2. Status filter
    if (filters.status && filters.status !== 'all') {
      if (cls.status !== filters.status) return false
    }

    // 3. Branch filter
    if (filters.branch && filters.branch !== 'all') {
      if (cls.branch !== filters.branch) return false
    }

    // 4. Level/Subject filter
    if (filters.level && filters.level !== 'all') {
      if (cls.level !== filters.level) return false
    }

    return true
  })
}

export function computeMyClassesMetrics(classes: ClassRecord[]) {
  const totalClasses = classes.length
  const activeClasses = classes.filter((c) => c.status === 'dang_hoc').length
  const upcomingClasses = classes.filter((c) => c.status === 'cho_khai_giang').length
  const totalStudents = classes.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0)

  return {
    totalClasses,
    activeClasses,
    upcomingClasses,
    totalStudents,
  }
}

export function formatMultiDaySchedule(schedule: string | undefined): string {
  if (!schedule || schedule === 'Chưa gán lịch') return 'Chưa gán lịch'
  if (schedule.includes(';')) return schedule

  const match = schedule.match(/^([T\d\/]+)\s+(.+)$/i)
  if (!match) return schedule

  const daysPart = match[1]
  const timePart = match[2]

  if (daysPart.startsWith('T') || daysPart.startsWith('t')) {
    const rawDays = daysPart.substring(1).split('/')
    const formattedDays = rawDays.map((d) => `T${d} ${timePart}`)
    return formattedDays.join('; ')
  }

  return schedule
}

export function getClassTeachers(cls: ClassRecord): ClassTeacher[] {
  if (!cls.teacher || cls.teacher === '—') {
    return [
      {
        id: 'EMP-GV01',
        name: 'ThS. Nguyễn Văn A',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher1',
        role: 'Giáo viên chính',
        phone: cls.teacherPhone || '0988123456',
        email: 'nguyenvana@rinoedu.vn',
      },
    ]
  }

  const names = cls.teacher.split(/[,&]/).map((n) => n.trim()).filter(Boolean)
  
  if (names.length > 1) {
    return names.map((name, idx) => ({
      id: `EMP-GV0${idx + 1}`,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      role: idx === 0 ? 'Giáo viên chính' : 'Trợ giảng',
      phone: idx === 0 ? cls.teacherPhone || '0988123456' : '0912345678',
      email: `${name.toLowerCase().replace(/\s+/g, '')}@rinoedu.vn`,
    }))
  }

  const charSum = cls.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  if (charSum % 3 === 0) {
    return [
      {
        id: 'EMP-GV01',
        name: cls.teacher,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cls.teacher)}`,
        role: 'Giáo viên chính',
        phone: cls.teacherPhone || '0988123456',
        email: 'gvmain@rinoedu.vn',
      },
      {
        id: 'EMP-GV02',
        name: 'Mark Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarkJohnson',
        role: 'Giảng viên nước ngoài',
        phone: '0909888999',
        email: 'mark.johnson@rinoedu.vn',
      },
    ]
  }

  return [
    {
      id: 'EMP-GV01',
      name: cls.teacher,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cls.teacher)}`,
      role: 'Giáo viên chính',
      phone: cls.teacherPhone || '0988123456',
      email: 'gvmain@rinoedu.vn',
    },
  ]
}

export function getClassAcademicStats(cls: ClassRecord): ClassAcademicStats {
  const charSum = cls.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  const attendanceRate = 85 + (charSum % 13) // 85% - 97%
  const homeworkRate = 80 + ((charSum * 3) % 18) // 80% - 97%
  const avgTestScore = Number((7.2 + ((charSum % 23) / 10)).toFixed(1)) // 7.2 - 9.4

  const mockStudents: SpecialStudent[] = [
    {
      id: 'st-01',
      code: 'HV-2026-001',
      name: 'Nguyễn Hoài Nam',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoaiNam',
      type: 'at_risk',
      reason: '🚨 Cần hỗ trợ - Vắng 2 buổi gần nhất',
      careTags: [
        { code: 'RR-01', label: 'Rủi ro xin dừng học / bảo lưu', category: 'risk' },
        { code: 'CC-01', label: 'Nghỉ 2 buổi liên tiếp', category: 'attendance' },
        { code: 'HT-01', label: 'Điểm kiểm tra dưới chuẩn', category: 'academic' },
      ],
    },
    {
      id: 'st-02',
      code: 'HV-2026-042',
      name: 'Trần Bảo Ngọc',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=BaoNgoc',
      type: 'excellent',
      reason: '⭐ Xuất sắc - Top 1 Lớp (Điểm 9.8/10)',
      careTags: [
        { code: 'XS-01', label: 'Học viên xuất sắc Top 1 Lớp', category: 'excellent' },
        { code: 'CC-00', label: 'Chuyên cần 100% không vắng', category: 'attendance' },
      ],
    },
    {
      id: 'st-03',
      code: 'HV-2026-089',
      name: 'Lê Hoàng Anh',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
      type: 'vip',
      reason: '💎 Học viên VIP • Đăng ký 3 lộ trình',
      careTags: [
        { code: 'VIP-01', label: 'Học viên VIP đăng ký lộ trình dài hạn', category: 'vip' },
        { code: 'XS-02', label: 'Thành tích học tập giỏi', category: 'excellent' },
      ],
    },
    {
      id: 'st-04',
      code: 'HV-2026-105',
      name: 'Phạm Minh Đức',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MinhDuc',
      type: 'at_risk',
      reason: '🚨 Chưa nộp BTVN 3 buổi liên tiếp',
      careTags: [
        { code: 'CC-01', label: 'Nghỉ 2 buổi liên tiếp', category: 'attendance' },
        { code: 'HT-02', label: 'Thiếu bài tập 2 buổi', category: 'academic' },
      ],
    },
  ]

  const startIndex = charSum % 2
  const count = 2 + (charSum % 2)
  const specialStudents = mockStudents.slice(startIndex, startIndex + count)

  return {
    attendanceRate,
    homeworkRate,
    avgTestScore,
    specialStudents,
  }
}
