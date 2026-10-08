import type { StudentProfileItem } from '@/components/shared'
import type { ClassSession } from '@/mocks/calendarSchedule'

export interface HomeWorkdayScope {
  selectedDate: Date
  dateString: string // YYYY-MM-DD
  branch: string
}

export interface HomeClassMetrics {
  activeClassesCount: number
  upcomingClassesCount: number
  totalEnrolledStudents: number
  maxCapacity: number
  capacityFillRate: number // percentage e.g. 84.5
  avgAttendanceRate: number // percentage e.g. 93.8
  specialCareClassesCount: number
  todaySessionsCount: number
}

export interface TodayScheduleItem {
  id: string
  classCode: string
  className: string
  subject: string
  level: string
  room: string
  branch: string
  startTime: string
  endTime: string
  timeLabel: string
  teacher: string
  assistantTeacher?: string
  substituteTeacher?: string
  type: 'class_session' | 'test_session' | 'trial_class' | 'placement_test' | 'digi_session'
  typeLabel: string
  totalStudents: number
  officialStudents: number
  trialStudents: number
  makeUpStudents?: number
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  statusLabel: string
  lessonTitle?: string
  rawSession?: ClassSession
}

export interface CareAvatarItem {
  id: string
  studentId: string
  studentName: string
  avatar?: string
  classCode: string
  className?: string
  branch: string
  alertType:
    | 'attendance_pending'
    | 'feedback_pending'
    | 'grading_pending'
    | 'absence'
    | 'academic_drop'
    | 'c90b'
    | 'regular_call'
    | 'other'
  alertLabel: string
  alertBadgeColor: 'red' | 'amber' | 'blue' | 'emerald' | 'purple'
  reason: string
  remainingSessions: number
  attendanceRatio: string
  parentName?: string
  parentPhone?: string
  profileItem: StudentProfileItem
}

export interface RenewalAvatarItem {
  id: string
  studentId: string
  studentName: string
  avatar?: string
  classCode: string
  className?: string
  branch: string
  remainingSessions: number
  expectedEndDate: string
  urgencyLevel: 'critical' | 'warning' | 'normal'
  urgencyBadgeColor: 'red' | 'amber' | 'emerald'
  packageName?: string
  renewalStatusLabel: string
  parentName?: string
  parentPhone?: string
  profileItem: StudentProfileItem
}

export interface DailyTodoItem {
  id: string
  title: string
  description: string
  type: 'attendance' | 'feedback' | 'grading' | 'leave_reserve' | 'care_call' | 'test_intake'
  count: number
  urgency: 'high' | 'medium' | 'low'
  actionUrl: string
  actionLabel: string
  completed?: boolean
}

export type BulletinCategory = 'urgent' | 'pinned' | 'handover' | 'operational' | 'notice'

export interface BulletinPost {
  id: string
  title: string
  content: string
  category: BulletinCategory
  categoryLabel: string
  authorName: string
  authorRole: string
  authorAvatar?: string
  createdAt: string
  isPinned?: boolean
  isUrgent?: boolean
  badgeColor: string
  actionLabel?: string
  actionUrl?: string
  branch?: string
  acknowledgedCount?: number
  isAcknowledged?: boolean
}

export type CareFollowCategory =
  | 'all'
  | 'attendance'
  | 'feedback'
  | 'grading'
  | 'care'
  | 'renewal'
