export interface SimulatedPackage {
  id: string
  packageName: string
  totalSessions: number
  remainingSessions: number
  classCode: string
  className: string
  teacherCode: string
  schedule: string
  attendanceRatio: string
  homeworkCompletion: number
  lastTestScore: number
  priorTestScore: number
  startDate: string
  endDate: string
  level: string
  subLevel: string
  status: 'active' | 'expired' | 'pending'
}

export type CareTopicStatus = 'completed' | 'overdue' | 'in_progress' | 'pending'

export interface CareTopic {
  code: string
  name: string
  sla: string
  criteria: string
  description: string
  isCompleted: boolean
  lastInteractionDate?: string // ISO date string for sorting
  careStatus: CareTopicStatus
  displayCode?: string
  slaStatus?: 'within_sla' | 'due_today' | 'overdue'
}

export const ALL_STANDARD_TAGS = [
  { code: 'ĐB1', name: 'Chăm sóc Đặc biệt', sla: '24 giờ', criteria: 'Cảnh báo C90B, BTVN < 70% hoặc Điểm thi < 5.0', description: 'Kế hoạch chăm sóc khẩn cấp đối với các cảnh báo vận hành hoặc học lực yếu kém.' },
  { code: 'ĐK1', name: 'CS học tập Định kỳ', sla: '5 ngày', criteria: 'Điểm chạm tương tác định kỳ hàng tháng', description: 'Trao đổi lộ trình học tập định kỳ và thu thập phản hồi của phụ huynh.' },
  { code: 'ĐK2', name: 'CS học phí Định kỳ', sla: '5 ngày', criteria: 'Cận hạn học phí hoặc có lịch sử nợ phí', description: 'Liên hệ nhắc phí và trao đổi lộ trình gia hạn khóa học.' },
  { code: 'TB1', name: 'CS chuyên cần & gói phí', sla: '3 ngày', criteria: 'Buổi còn lại ≤ 5 hoặc chuyên cần < 80%', description: 'Theo dõi chuyên cần, nhắc nhở đi học đúng giờ và nhắc phí cận hạn.' },
  { code: 'TB2', name: 'CS bài tập & học lực', sla: '2 ngày', criteria: 'Thiếu bài tập về nhà hoặc điểm thi giảm sút', description: 'CS phối hợp giáo viên gửi bài tập làm bù và điều chỉnh nhịp học.' },
  { code: 'CSTP', name: 'Chăm sóc Tái phí', sla: '5 ngày', criteria: 'Liên hệ gia hạn và đóng phí khóa học mới', description: 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới.' },
  { code: 'T1', name: 'Chăm sóc thông thường', sla: '3 ngày', criteria: 'Chăm sóc định kỳ phát sinh', description: 'Tương tác chăm sóc, thăm hỏi định kỳ thông thường.' },
]

export interface CSStaffMember {
  id: string
  name: string
  code: string
  role?: string
  phone?: string
  email?: string
  avatar: string
}

export const defaultCSStaffList: CSStaffMember[] = [
  { id: 'cs-1', name: 'Trần Thị Mai', code: 'EMP-CS-001', role: 'Chuyên viên CSKH', phone: '0901 112 233', email: 'mai.tt@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mai' },
  { id: 'cs-2', name: 'Nguyễn Thị Ngọc Anh', code: 'EMP-CS-010', role: 'Chuyên viên CSKH', phone: '0912 888 999', email: 'ngocanh.nt@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NgocAnh' },
  { id: 'cs-3', name: 'Trần Thảo Anh 20', code: 'EMP-CS-011', role: 'Chuyên viên CSKH', phone: '0983 666 777', email: 'thaoanh.tt@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThaoAnh' },
  { id: 'cs-4', name: 'Lê Hoàng Long', code: 'EMP-CS-012', role: 'Chuyên viên CSKH', phone: '0977 123 456', email: 'long.lh@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangLong' },
  { id: 'cs-5', name: 'Lê Thị Lan', code: 'EMP-CS-002', role: 'Chuyên viên CSKH', phone: '0912 345 678', email: 'lan.lt@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lan' },
  { id: 'cs-6', name: 'Minh Phương', code: 'EMP-CS-003', role: 'Quản lý CSM', phone: '0901 234 567', email: 'phuong.minh@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong' },
  { id: 'cs-7', name: 'Bùi Thu Phương', code: 'EMP-CS-013', role: 'Chuyên viên CSKH', phone: '0908 990 011', email: 'phuong.nt@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ThuPhuong' },
  { id: 'cs-8', name: 'Nguyễn Văn Hùng', code: 'EMP-CS-004', role: 'Chuyên viên CSKH', phone: '0983 222 111', email: 'hung.nv@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hung' },
  { id: 'cs-9', name: 'Phạm Thị Hà', code: 'EMP-CS-005', role: 'Chuyên viên CSKH', phone: '0977 888 999', email: 'ha.pt@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ha' },
  { id: 'cs-10', name: 'Hoàng Anh Tuấn', code: 'EMP-CS-006', role: 'Chuyên viên CSKH', phone: '0966 555 444', email: 'tuan.ha@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tuan' },
  { id: 'cs-11', name: 'Đỗ Mai Hương', code: 'EMP-CS-007', role: 'Chuyên viên CSKH', phone: '0933 444 555', email: 'huong.dm@rinoedu.vn', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Huong' },
]
