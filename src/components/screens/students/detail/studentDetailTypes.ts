import type { EnrolledClass } from '@/mocks/students'

export interface StudentProgram {
  id: string
  name: string
  subject: 'math' | 'english' | 'stem' | 'other'
  level?: string
  subLevel?: string
  packages: StudentPackage[]
  totalSessions: number
  studiedSessions: number
  remainingSessions: number
  startDate?: string
  endDate?: string
  currentClass: EnrolledClass | null
  pastClasses: EnrolledClass[]
  programStatus: 'active' | 'wait_for_assignment' | 'dropped' | 'reserved'
  droppedClassInfo?: {
    className: string
    classCode: string
    droppedDate?: string
    studiedBeforeDrop?: string
    teacherName?: string
    room?: string
    reason?: string
  }
  reservedInfo?: {
    reservedSessions: number
    expiryDate?: string
    startDate?: string
    endDate?: string
    duration?: string
    isHoldingClass?: boolean
    reason?: string
  }
  transferInfo?: {
    sourceClass: string
    targetClass?: string
    transferredSessions?: number
    transferDate?: string
    reason?: string
  }
}

export interface StudentPackage {
  id: string
  packageName: string
  totalSessions: number
  remainingSessions: number
  price: number
  purchaseDate: string
  status: 'active' | 'expired' | 'pending' | 'transferred' | 'cancelled' | 'suspended' | 'reserved'
  linkedClassCode?: string
  linkedClassName?: string
  startSessionDate?: string
  endDate?: string
}

export interface StudentGlobalLog {
  id: string
  timestamp: string
  action: string
  operator: string
}

export interface StudentNote {
  id: string
  text: string
  author: string
  timestamp: string
}

export interface FamilyMember {
  id: string
  name: string
  phone: string
  email?: string
  relationship: string
}

export interface StudentScheduleSession {
  id: string
  className: string
  classCode: string
  sessionNumber: number
  date: string
  startTime: string
  endTime: string
  topic: string
  description?: string
  room: string
  teacherName: string
  substituteTeacherName?: string
  status: 'completed' | 'ongoing' | 'upcoming' | 'cancelled' | 'absent'
  materials?: Array<{ name: string; url: string; type?: string }>
}

