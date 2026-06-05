export type TeacherDetailTabId = 'overview' | 'classes' | 'schedule' | 'sub_history' | 'quality' | 'stats' | 'notes' | 'activity_log'

export interface TeacherClassAssignment {
  id: string
  teacherId: string
  classId: string
  classCode: string
  className: string
  level: string
  role: 'primary' | 'assistant'
  startDate: string
  endDate?: string
  status: 'active' | 'ended'
  studentCount: number
  maxStudents: number
  schedule: string
  room: string
}

export interface TeacherScheduleDay {
  dayOfWeek: string
  date: string
  sessions: Array<{
    id: string
    classCode: string
    className: string
    startTime: string
    endTime: string
    room: string
    topic: string
  }>
}

export interface SubHistoryRecord {
  id: string
  teacherId: string
  originalTeacher: string
  substituteTeacher: string
  date: string
  classCode: string
  className: string
  reason: string
  status: 'completed' | 'cancelled'
}

export interface QualityReview {
  id: string
  teacherId: string
  reviewer: string
  date: string
  classCode: string
  score: number
  category: 'methodology' | 'classroom_management' | 'engagement' | 'content_delivery'
  feedback: string
  improvementSuggestions?: string
}

export interface TeacherNote {
  id: string
  teacherId: string
  author: string
  date: string
  content: string
  priority: 'normal' | 'important' | 'urgent'
}

export interface ActivityLogEntry {
  id: string
  teacherId: string
  date: string
  action: string
  detail: string
  actor: string
}

export interface TeacherStats {
  totalHoursThisWeek: number
  totalHoursThisMonth: number
  totalHoursAllTime: number
  avgStudentsPerClass: number
  attendanceRate: number
  feedbackResponseRate: number
  peakDay: string
  peakHour: string
}

export interface TeacherProfile {
  id: string
  code: string
  name: string
  email: string
  phone: string
  branch: string
  subjects: string[]
  status: string
  rating: number
  startDate: string
  totalStudents: number
  totalClasses: number
  totalHoursThisWeek: number
  tags?: string[]
}

export const mockTeacherAssignments: TeacherClassAssignment[] = [
  { id: 'ta-001', teacherId: 't1', classId: 'c-ielts-a1', classCode: 'IELTS-1A', className: 'IELTS Junior 1A', level: 'IELTS', role: 'primary', startDate: '2026-01-15', status: 'active', studentCount: 15, maxStudents: 20, schedule: '2/4/6 18:00-20:00', room: 'A101' },
  { id: 'ta-002', teacherId: 't1', classId: 'c-ielts-b1', classCode: 'IELTS-1B', className: 'IELTS Junior 1B', level: 'IELTS', role: 'assistant', startDate: '2026-02-01', status: 'active', studentCount: 12, maxStudents: 20, schedule: '3/5 17:00-19:00', room: 'B201' },
  { id: 'ta-003', teacherId: 't1', classId: 'c-toeic-a2', classCode: 'TOEIC-2A', className: 'TOEIC Foundation 2A', level: 'TOEIC', role: 'primary', startDate: '2026-03-01', status: 'active', studentCount: 22, maxStudents: 25, schedule: '2/4 19:00-21:00', room: 'C301' },
  { id: 'ta-004', teacherId: 't1', classId: 'c-toeic-b2', classCode: 'TOEIC-2B', className: 'TOEIC Advanced 2B', level: 'TOEIC', role: 'primary', startDate: '2025-09-01', endDate: '2026-01-15', status: 'ended', studentCount: 18, maxStudents: 20, schedule: '3/5 18:00-20:00', room: 'C302' },

  { id: 'ta-010', teacherId: 't2', classId: 'c-ielts-b1', classCode: 'IELTS-1B', className: 'IELTS Junior 1B', level: 'IELTS', role: 'primary', startDate: '2026-02-01', status: 'active', studentCount: 12, maxStudents: 20, schedule: '3/5 17:00-19:00', room: 'B201' },
  { id: 'ta-011', teacherId: 't2', classId: 'c-toeic-a2', classCode: 'TOEIC-2A', className: 'TOEIC Foundation 2A', level: 'TOEIC', role: 'assistant', startDate: '2026-03-01', status: 'active', studentCount: 22, maxStudents: 25, schedule: '2/4 19:00-21:00', room: 'C301' },
  { id: 'ta-012', teacherId: 't2', classId: 'c-movers-2b', classCode: 'MOV-2B', className: 'Movers 2B', level: 'Movers', role: 'primary', startDate: '2026-04-01', status: 'active', studentCount: 10, maxStudents: 15, schedule: '4/7 16:00-17:30', room: 'D401' },

  { id: 'ta-020', teacherId: 't3', classId: 'c-toeic-a2', classCode: 'TOEIC-2A', className: 'TOEIC Foundation 2A', level: 'TOEIC', role: 'primary', startDate: '2026-03-01', status: 'active', studentCount: 22, maxStudents: 25, schedule: '2/4 19:00-21:00', room: 'C301' },
  { id: 'ta-021', teacherId: 't3', classId: 'c-toeic-b2', classCode: 'TOEIC-3A', className: 'TOEIC Advanced 3A', level: 'TOEIC', role: 'primary', startDate: '2026-01-10', status: 'active', studentCount: 18, maxStudents: 20, schedule: '6/7 14:00-16:00', room: 'C302' },

  { id: 'ta-030', teacherId: 't4', classId: 'c-movers-2b', classCode: 'MOV-2B', className: 'Movers 2B', level: 'Movers', role: 'primary', startDate: '2026-04-01', status: 'active', studentCount: 10, maxStudents: 15, schedule: '4/7 16:00-17:30', room: 'D401' },
  { id: 'ta-031', teacherId: 't4', classId: 'c-flyers-1a', classCode: 'FLY-1A', className: 'Flyers 1A', level: 'Flyers', role: 'primary', startDate: '2026-03-15', status: 'active', studentCount: 12, maxStudents: 15, schedule: '2/4 15:00-16:30', room: 'D402' },

  { id: 'ta-040', teacherId: 't5', classId: 'c-ket-1c', classCode: 'KET-1C', className: 'KET Prep 1C', level: 'KET', role: 'primary', startDate: '2025-11-01', status: 'active', studentCount: 12, maxStudents: 15, schedule: '3/5 18:30-20:00', room: 'E501' },

  { id: 'ta-050', teacherId: 't7', classId: 'c-ielts-a1', classCode: 'IELTS-1A', className: 'IELTS Junior 1A', level: 'IELTS', role: 'assistant', startDate: '2026-04-01', status: 'active', studentCount: 15, maxStudents: 20, schedule: '2/4/6 18:00-20:00', room: 'A101' },
  { id: 'ta-051', teacherId: 't7', classId: 'c-toeic-a2', classCode: 'TOEIC-2A', className: 'TOEIC Foundation 2A', level: 'TOEIC', role: 'primary', startDate: '2026-01-10', status: 'active', studentCount: 22, maxStudents: 25, schedule: '2/4 19:00-21:00', room: 'C301' },
  { id: 'ta-052', teacherId: 't7', classId: 'c-ielts-c1', classCode: 'IELTS-3A', className: 'IELTS Advanced 3A', level: 'IELTS', role: 'primary', startDate: '2025-06-01', endDate: '2025-12-15', status: 'ended', studentCount: 16, maxStudents: 18, schedule: '2/4/6 20:00-21:30', room: 'A103' },
]

export const mockSubHistory: SubHistoryRecord[] = [
  { id: 'sub-001', teacherId: 't1', originalTeacher: 'Cô Lan', substituteTeacher: 'Phạm Văn Giảng Dạy', date: '2026-05-13', classCode: 'IELTS-1A', className: 'IELTS Junior 1A', reason: 'GV chính nghỉ ốm', status: 'completed' },
  { id: 'sub-002', teacherId: 't1', originalTeacher: 'Cô Hương', substituteTeacher: 'Phạm Văn Giảng Dạy', date: '2026-04-20', classCode: 'TOEIC-2A', className: 'TOEIC Foundation 2A', reason: 'GV chính họp đột xuất', status: 'completed' },
  { id: 'sub-003', teacherId: 't2', originalTeacher: 'Thầy Hùng', substituteTeacher: 'Hoàng Thị Giáo Viên', date: '2026-05-08', classCode: 'IELTS-1B', className: 'IELTS Junior 1B', reason: 'GV chính nghỉ phép', status: 'completed' },
  { id: 'sub-004', teacherId: 't7', originalTeacher: 'Cô Lan', substituteTeacher: 'Đặng Thị Mai', date: '2026-05-06', classCode: 'IELTS-1A', className: 'IELTS Junior 1A', reason: 'GV chính ốm', status: 'cancelled' },
]

export const mockQualityReviews: QualityReview[] = [
  { id: 'qr-001', teacherId: 't1', reviewer: 'Cô Hương (QC)', date: '2026-04-15', classCode: 'IELTS-1A', score: 4.8, category: 'methodology', feedback: 'Phương pháp giảng dạy rõ ràng, logic. HV tiếp thu tốt.', improvementSuggestions: 'Có thể tăng cường hoạt động nhóm.' },
  { id: 'qr-002', teacherId: 't1', reviewer: 'Cô Hương (QC)', date: '2026-03-20', classCode: 'TOEIC-2A', score: 4.5, category: 'engagement', feedback: 'Tương tác tốt với học viên, khuyến khích phát biểu.', improvementSuggestions: 'Chú ý hơn đến HV ngồi cuối lớp.' },
  { id: 'qr-003', teacherId: 't2', reviewer: 'Thầy Quân (QC)', date: '2026-04-10', classCode: 'IELTS-1B', score: 4.6, category: 'content_delivery', feedback: 'Nội dung bài học phong phú, cập nhật.', improvementSuggestions: '' },
  { id: 'qr-004', teacherId: 't4', reviewer: 'Cô Lan (QC)', date: '2026-04-22', classCode: 'MOV-2B', score: 4.9, category: 'classroom_management', feedback: 'Quản lý lớp xuất sắc, HV rất tập trung.', improvementSuggestions: '' },
  { id: 'qr-005', teacherId: 't7', reviewer: 'Cô Hương (QC)', date: '2026-04-18', classCode: 'IELTS-1A', score: 4.3, category: 'methodology', feedback: 'Giảng dạy chắc kiến thức.', improvementSuggestions: 'Cần linh hoạt hơn khi HV hỏi ngoài chương trình.' },
]

export const mockTeacherNotes: TeacherNote[] = [
  { id: 'tn-001', teacherId: 't1', author: 'GVCN Linh Đàm', date: '2026-05-10', content: 'GV có đề xuất đổi phòng A101 sang phòng lớn hơn do sĩ số tăng.', priority: 'normal' },
  { id: 'tn-002', teacherId: 't1', author: 'QL Chi nhánh', date: '2026-04-05', content: 'Cần hỗ trợ thêm TA cho lớp IELTS-1A từ tháng 6.', priority: 'important' },
  { id: 'tn-003', teacherId: 't2', author: 'GVCN Nguyễn Tuân', date: '2026-05-01', content: 'GV đề xuất mua thêm tài liệu IELTS Cambridge mới.', priority: 'normal' },
  { id: 'tn-004', teacherId: 't4', author: 'QL Chi nhánh', date: '2026-05-12', content: 'GV xuất sắc nhất quarter Q1/2026 - đề xuất khen thưởng.', priority: 'important' },
]

export const mockActivityLogs: ActivityLogEntry[] = [
  { id: 'al-001', teacherId: 't1', date: '2026-05-13', action: 'Dạy thay', detail: 'Dạy thay Cô Lan lớp IELTS-1A (SES-005)', actor: 'Hệ thống' },
  { id: 'al-002', teacherId: 't1', date: '2026-05-10', action: 'Cập nhật ghi chú', detail: 'Đề xuất đổi phòng học', actor: 'Phạm Văn Giảng Dạy' },
  { id: 'al-003', teacherId: 't1', date: '2026-05-08', action: 'Điểm danh', detail: 'Hoàn tất điểm danh SES-003 (15/15 HV)', actor: 'Phạm Văn Giảng Dạy' },
  { id: 'al-004', teacherId: 't1', date: '2026-05-06', action: 'Nhận xét', detail: 'Gửi nhận xét cho 12 HV lớp TOEIC-2A', actor: 'Phạm Văn Giảng Dạy' },
  { id: 'al-005', teacherId: 't1', date: '2026-04-15', action: 'Đánh giá QC', detail: 'Được đánh giá 4.8/5.0 (Methodology)', actor: 'Cô Hương (QC)' },
  { id: 'al-006', teacherId: 't1', date: '2026-04-01', action: 'Phân công lớp mới', detail: 'Gán làm GV chính lớp TOEIC-2A', actor: 'GVCN Linh Đàm' },
  { id: 'al-007', teacherId: 't1', date: '2026-01-15', action: 'Phân công lớp', detail: 'Gán làm GV chính lớp IELTS-1A', actor: 'GVCN Linh Đàm' },
]

export function getTeacherAssignments(teacherId: string): TeacherClassAssignment[] {
  return mockTeacherAssignments.filter((a) => a.teacherId === teacherId)
}

export function getTeacherSubHistory(teacherId: string): SubHistoryRecord[] {
  return mockSubHistory.filter((r) => r.teacherId === teacherId)
}

export function getTeacherQualityReviews(teacherId: string): QualityReview[] {
  return mockQualityReviews.filter((r) => r.teacherId === teacherId)
}

export function getTeacherNotes(teacherId: string): TeacherNote[] {
  return mockTeacherNotes.filter((n) => n.teacherId === teacherId)
}

export function getTeacherActivityLogs(teacherId: string): ActivityLogEntry[] {
  return mockActivityLogs.filter((l) => l.teacherId === teacherId)
}

export function getTeacherStats(teacherId: string): TeacherStats {
  const assignments = getTeacherAssignments(teacherId).filter((a) => a.status === 'active')
  const totalStudents = assignments.reduce((sum, a) => sum + a.studentCount, 0)
  const classCount = assignments.length

  return {
    totalHoursThisWeek: 12,
    totalHoursThisMonth: 48,
    totalHoursAllTime: 856,
    avgStudentsPerClass: classCount > 0 ? Math.round(totalStudents / classCount) : 0,
    attendanceRate: 98.5,
    feedbackResponseRate: 92.3,
    peakDay: 'Thứ 4',
    peakHour: '18:00-20:00',
  }
}

export const mockTeacherDetailTabs = [
  { id: 'overview' as TeacherDetailTabId, label: 'Tổng quan' },
  { id: 'classes' as TeacherDetailTabId, label: 'Lớp phụ trách' },
  { id: 'schedule' as TeacherDetailTabId, label: 'Lịch dạy' },
  { id: 'sub_history' as TeacherDetailTabId, label: 'Dạy thay' },
  { id: 'quality' as TeacherDetailTabId, label: 'Chất lượng' },
  { id: 'stats' as TeacherDetailTabId, label: 'Thống kê' },
  { id: 'notes' as TeacherDetailTabId, label: 'Ghi chú' },
  { id: 'activity_log' as TeacherDetailTabId, label: 'Nhật ký' },
]
