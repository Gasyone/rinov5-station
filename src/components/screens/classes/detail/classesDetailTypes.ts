export interface RosterStudentParent {
  name: string
  phone: string
  relationship: string
}

export interface RosterStudent {
  id: string
  name: string
  code: string
  status: 'active' | 'trial' | 'reserve' | 'transferred' | 'new' | 'dropout' | 'session_ended'
  dob: string
  parentName: string
  parentPhone: string
  enrollmentDate: string
  parents?: RosterStudentParent[]
  note?: string
}

export interface RoadmapSession {
  id: string
  sessionNumber: number
  date: string
  startTime: string
  endTime: string
  topic: string
  description?: string
  room: string
  defaultRoom?: string
  teacherName: string
  substituteTeacherName?: string
  coverType?: string
  coverNote?: string
  status: 'completed' | 'ongoing' | 'upcoming' | 'rescheduled' | 'cancelled'
  materials?: Array<{ name: string; url: string; type?: string }>
  syllabusName?: string
}

export interface ClassNote {
  id: string
  text: string
  author: string
  timestamp: string
}

export interface ClassAuditLog {
  id: string
  action: string
  operator: string
  timestamp: string
}
