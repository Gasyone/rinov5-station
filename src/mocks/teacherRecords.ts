export type TeacherStatus = 'active' | 'on_leave' | 'resigned' | 'probation'

export interface TeacherRecord {
  id: string
  code: string
  name: string
  email: string
  phone: string
  branch: string
  subjects: string[]
  status: TeacherStatus
  totalStudents: number
  totalClasses: number
  rating: number
  startDate: string
  notes?: string
}

export const mockTeachers: TeacherRecord[] = [
  { id: 't1', code: 'GV-001', name: 'Phạm Văn Giảng Dạy', email: 'gv1@rinoedu.com', phone: '0911111111', branch: 'RinoEdu Linh Đàm', subjects: ['IELTS', 'TOEIC'], status: 'active', totalStudents: 87, totalClasses: 4, rating: 4.8, startDate: '2023-01-15' },
  { id: 't2', code: 'GV-002', name: 'Hoàng Thị Giáo Viên', email: 'gv2@rinoedu.com', phone: '0922222222', branch: 'RinoEdu Nguyễn Tuân', subjects: ['English', 'Japanese'], status: 'active', totalStudents: 65, totalClasses: 3, rating: 4.5, startDate: '2023-06-01' },
  { id: 't3', code: 'GV-003', name: 'Trần Thị Hương', email: 'gv3@rinoedu.com', phone: '0933333333', branch: 'RinoEdu Nguyễn Tuân', subjects: ['TOEIC'], status: 'active', totalStudents: 56, totalClasses: 2, rating: 4.7, startDate: '2024-02-10' },
  { id: 't4', code: 'GV-004', name: 'Lê Thị Nga', email: 'gv4@rinoedu.com', phone: '0944444444', branch: 'RinoEdu Smart City', subjects: ['Movers', 'Flyers'], status: 'active', totalStudents: 34, totalClasses: 2, rating: 4.9, startDate: '2024-08-20' },
  { id: 't5', code: 'GV-005', name: 'Nguyễn Văn Quân', email: 'gv5@rinoedu.com', phone: '0955555555', branch: 'RinoEdu Linh Đàm', subjects: ['KET Prep', 'PET Prep'], status: 'probation', totalStudents: 24, totalClasses: 1, rating: 4.2, startDate: '2025-11-01' },
  { id: 't6', code: 'GV-006', name: 'Võ Minh Hùng', email: 'gv6@rinoedu.com', phone: '0966666666', branch: 'RinoEdu Nguyễn Tuân', subjects: ['IELTS'], status: 'on_leave', totalStudents: 36, totalClasses: 1, rating: 4.6, startDate: '2023-09-15' },
  { id: 't7', code: 'GV-007', name: 'Đặng Thị Mai', email: 'gv7@rinoedu.com', phone: '0977777777', branch: 'RinoEdu Linh Đàm', subjects: ['IELTS', 'English'], status: 'active', totalStudents: 78, totalClasses: 3, rating: 4.4, startDate: '2022-05-01' },
  { id: 't8', code: 'GV-008', name: 'Bùi Thanh Tùng', email: 'gv8@rinoedu.com', phone: '0988888888', branch: 'RinoEdu Nguyễn Tuân', subjects: ['TOEIC'], status: 'resigned', totalStudents: 0, totalClasses: 0, rating: 3.8, startDate: '2021-03-01', notes: 'Nghỉ việc tháng 3/2026' },
]

export function getTeachers(filters?: { search?: string; branch?: string; status?: string }): TeacherRecord[] {
  return mockTeachers.filter((t) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (
        !t.name.toLowerCase().includes(q) &&
        !t.code.toLowerCase().includes(q) &&
        !t.email.toLowerCase().includes(q) &&
        !t.phone.includes(q)
      ) return false
    }
    if (filters?.branch && t.branch !== filters.branch) return false
    if (filters?.status && filters.status !== 'all' && t.status !== filters.status) return false
    return true
  })
}

export function getTeacherStatusCounts(teachers: TeacherRecord[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: teachers.length,
    active: 0,
    on_leave: 0,
    resigned: 0,
    probation: 0,
  }
  for (const t of teachers) {
    if (counts[t.status] !== undefined) counts[t.status]++
  }
  return counts
}

export function getTeacherBranches(teachers: TeacherRecord[]): string[] {
  return [...new Set(teachers.map((t) => t.branch))].sort()
}
