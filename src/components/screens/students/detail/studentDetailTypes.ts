export interface StudentPackage {
  id: string
  packageName: string
  totalSessions: number
  remainingSessions: number
  price: number
  purchaseDate: string
  status: 'active' | 'expired' | 'pending'
  linkedClassCode?: string
  linkedClassName?: string
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
  status: 'completed' | 'ongoing' | 'upcoming' | 'rescheduled' | 'cancelled' | 'absent'
  materials?: Array<{ name: string; url: string; type?: string }>
}

