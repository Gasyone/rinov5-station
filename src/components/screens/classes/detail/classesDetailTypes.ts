export interface RosterStudentParent {
  name: string
  phone: string
  relationship: string
}

export type StudentTagType =
  | 'new_student'
  | 'vip'
  | 'attention'
  | 'makeup'
  | 'trial'
  | 'teacher_note'
  | 'excellent'

export interface StudentTag {
  id: string
  tagType: StudentTagType
  emoji: string
  label: string
  color: 'teal' | 'amber' | 'rose' | 'violet' | 'sky' | 'slate' | 'emerald'
  description: string
  note?: string
  assignedBy: string
  assignedDate: string
  isAutomatic: boolean
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
  startSession?: string
  parents?: RosterStudentParent[]
  note?: string
  avatar?: string
  sessionLabel?: 'buoi_1' | 'buoi_2' | 'buoi_3' | 'buoi_cuoi'
  level?: string
  tags?: StudentTag[]
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
  assistantName?: string
  coverType?: string
  coverNote?: string
  rescheduleDate?: string
  originalDate?: string
  rescheduleNote?: string
  status: 'completed' | 'ongoing' | 'upcoming' | 'cancelled' | 'absent'
  materials?: Array<{ name: string; url: string; type?: string }>
  syllabusName?: string
  cancelBy?: string
  cancelReason?: string
  cancelDescription?: string
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

export interface TestScoreData {
  score: number | null
  status: 'graded' | 'not_start' | 'score_button'
  rubric?: {
    vocabulary: number
    vocabCorrect: string
    vocabIncorrect: string
    grammar: number
    grammarCorrect: string
    grammarIncorrect: string
    pronunciation: number
    pronunciationCorrect: string
    pronunciationIncorrect: string
    fluency: number
    fluencyText: string
  }
  objective?: {
    correctAnswers: number
    totalQuestions: number
    comment: string
  }
}
