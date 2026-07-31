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
