export type ViewTabMode = 'room_matrix' | 'teacher_workload'

export interface ClassSessionV2 {
  id: string
  classCode: string
  className: string
  subject: string
  teacherName: string
  substituteTeacher?: string
  taName?: string
  taSubstituteName?: string
  taStatus: 'confirmed' | 'missing' | 'substitute'
  roomName: string
  branch: string
  timeSlot: string // e.g. "18:00 - 19:30"
  shift: 'morning' | 'afternoon' | 'evening'
  dayOfWeek: string // e.g. "Thứ 2"
  attendedStudents: number
  totalStudents: number
  trialStudents: number
  currentSession: number
  totalSessions: number
  status: 'normal' | 'opening' | 'substitute' | 'cancelled' | 'conflict'
  milestone?: 'midterm' | 'final' | 'renewal'
}

export interface RoomRowRecord {
  id: string
  roomName: string
  capacity: number
  typeLabel: string
  branch: string
  sessions: ClassSessionV2[]
}

export interface TeacherRowRecord {
  id: string
  teacherName: string
  roleLabel: string
  weeklyHours: number
  isOverloaded: boolean
  branch: string
  sessions: ClassSessionV2[]
}
