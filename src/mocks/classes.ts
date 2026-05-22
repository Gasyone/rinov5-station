export type ClassCategory = 'nhap' | 'mo_chieu_sinh' | 'dang_hoc' | 'dong_lop' | 'huy'

export const CLASS_STATUS_LABELS: Record<ClassCategory, string> = {
  nhap: 'Nháp',
  mo_chieu_sinh: 'Mở chiêu sinh',
  dang_hoc: 'Đang học',
  dong_lop: 'Đóng lớp',
  huy: 'Hủy',
}

export interface Class {
  id: string
  name: string
  level: string
  branch: string
  teacher: string
  maxStudents: number
  enrolledStudents: number
  startDate: string
  endDate: string
  schedule: string
  room: string
  status: ClassCategory
  tuitionFee: number
  notes?: string
}

export const mockClasses: Class[] = [
  { id: 'c1', name: 'IELTS A1', level: 'IELTS', branch: 'Chi nhánh Hà Nội', teacher: 'Phạm Văn Giảng Dạy', maxStudents: 20, enrolledStudents: 15, startDate: '2026-01-15', endDate: '2026-04-15', schedule: '2/4/6 18:00-20:00', room: 'A101', status: 'dang_hoc', tuitionFee: 3500000 },
  { id: 'c2', name: 'IELTS B1', level: 'IELTS', branch: 'Chi nhánh Đà Nẵng', teacher: 'Hoàng Thị Giáo Viên', maxStudents: 20, enrolledStudents: 18, startDate: '2026-02-01', endDate: '2026-05-01', schedule: '3/5/7 17:00-19:00', room: 'B201', status: 'dang_hoc', tuitionFee: 3500000 },
  { id: 'c3', name: 'TOEIC A2', level: 'TOEIC', branch: 'Chi nhánh Hồ Chí Minh', teacher: 'Phạm Văn Giảng Dạy', maxStudents: 25, enrolledStudents: 22, startDate: '2026-01-10', endDate: '2026-04-10', schedule: '2/4 19:00-21:00', room: 'C301', status: 'dong_lop', tuitionFee: 2500000 },
  { id: 'c4', name: 'Tiếng Anh A1', level: 'Beginner', branch: 'Chi nhánh Hà Nội', teacher: 'Hoàng Thị Giáo Viên', maxStudents: 25, enrolledStudents: 0, startDate: '2026-06-01', endDate: '2026-09-01', schedule: '3/6 18:30-20:30', room: 'A102', status: 'nhap', tuitionFee: 2000000 },
  { id: 'c5', name: 'TOEIC B2', level: 'TOEIC', branch: 'Chi nhánh Hồ Chí Minh', teacher: 'Phạm Văn Giảng Dạy', maxStudents: 20, enrolledStudents: 3, startDate: '2026-06-15', endDate: '2026-09-15', schedule: '2/5 17:30-19:30', room: 'C302', status: 'huy', tuitionFee: 3000000, notes: 'Không đủ học viên' },
  { id: 'c6', name: 'Tiếng Nhật N5', level: 'Japanese', branch: 'Chi nhánh Đà Nẵng', teacher: 'Hoàng Thị Giáo Viên', maxStudents: 20, enrolledStudents: 5, startDate: '2026-07-01', endDate: '2026-10-01', schedule: '4/7 19:00-21:00', room: 'D401', status: 'mo_chieu_sinh', tuitionFee: 4000000 },
]

export function getClasses(filters?: { search?: string; branch?: string; status?: string; level?: string }): Class[] {
  return mockClasses.filter((c) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (!c.name.toLowerCase().includes(q) && !c.teacher.toLowerCase().includes(q) && !c.room.toLowerCase().includes(q)) return false
    }
    if (filters?.branch && c.branch !== filters.branch) return false
    if (filters?.status && c.status !== filters.status) return false
    if (filters?.level && c.level !== filters.level) return false
    return true
  })
}
