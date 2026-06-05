import { type TeacherClassAssignment, type SubHistoryRecord, type QualityReview } from '@/mocks/teacherDetail'

export function formatScheduleString(dayPattern: string, timeRange: string): string {
  return `${dayPattern} ${timeRange}`
}

export function getRoleLabel(role: 'primary' | 'assistant'): string {
  return role === 'primary' ? 'Giáo viên chính' : 'Trợ giảng'
}

export function getSubStatusSemantic(status: SubHistoryRecord['status']): string {
  return status === 'completed' ? 'completed' : 'neutral'
}

export function getQualityCategoryLabel(category: QualityReview['category']): string {
  const labels: Record<QualityReview['category'], string> = {
    methodology: 'Phương pháp',
    classroom_management: 'Quản lý lớp',
    engagement: 'Tương tác',
    content_delivery: 'Nội dung',
  }
  return labels[category]
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} phút`
  return `${hours} giờ`
}

export function getAssignmentStatusSemantic(status: TeacherClassAssignment['status']): string {
  return status === 'active' ? 'success' : 'neutral'
}

export function getAssignmentStatusLabel(status: TeacherClassAssignment['status']): string {
  return status === 'active' ? 'Đang dạy' : 'Đã kết thúc'
}

export function generateWeekSchedule(): Array<{ day: string; date: string; hasClass: boolean; count: number }> {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
  const classCounts: Record<number, number> = {
    1: 3, 2: 2, 3: 3, 4: 0, 5: 1, 6: 3, 0: 0,
  }

  return dayNames.map((name, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    const mappedIndex = index === 6 ? 0 : index + 1
    return {
      day: name,
      date: date.toISOString().split('T')[0],
      hasClass: (classCounts[mappedIndex] || 0) > 0,
      count: classCounts[mappedIndex] || 0,
    }
  })
}
