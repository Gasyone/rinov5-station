import type { EnrolledClass, Student } from '@/mocks/students'

export type { Student }

export interface StudentProgram {
  id: string
  name: string
  subject: 'math' | 'english' | 'stem' | 'other'
  level?: string
  subLevel?: string
  schoolClass?: string
  branch?: string
  entryScore?: string
  entryScoreEvaluation?: string
  assessmentNote?: string
  csmName?: string
  saleName?: string
  availableSlots?: StudentAvailableSlot[]
  packages: StudentPackage[]
  totalSessions: number
  studiedSessions: number
  remainingSessions: number
  startDate?: string
  endDate?: string
  currentClass: EnrolledClass | null
  pastClasses: EnrolledClass[]
  programStatus:
    | 'active'
    | 'wait_for_assignment'
    | 'dropped'
    | 'pending_transfer'
    | 'reserved'
    | 'reserve'
    | 'draft_class'
    | 'awaiting_opening'
    | 'trial'
    | 'enroll_later'
    | 'pending_payment'
    | 'fee_transfer'
    | 'session_ended'
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
  renewalInfo?: {
    status: 'success' | 'failed' | 'pending'
    outcomeType?: 'not_purchased' | 'purchased_other'
    failureReason?: string
    newPackageName?: string
    newProgramName?: string
    linkedOrderNo?: string
    decisionDate?: string
    note?: string
  }
  feeTransferInfo?: {
    ticketCode: string
    transferDate: string
    executorName?: string
    transferredSessions: number
    targetPackageName?: string
    recipientStudentName?: string
    linkedOrderNo?: string
    note?: string
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
  packageTag?: 'transferred' | 'cancelled' | 'received_transfer'
  linkedClassCode?: string
  linkedClassName?: string
  startSessionDate?: string
  endDate?: string
  allocatedSessions?: number
  orderNo?: string
  leaveQuota?: number
  saleName?: string
  teacherType?: 'VN' | 'Phil' | 'Native' | 'Mix' | string
  notes?: string
}

export interface StudentAvailableSlot {
  id: string
  dayOfWeek: string
  timeRange: string
  note?: string
  isPreferred?: boolean
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

export interface HistoricalTrack {
  id: string
  name: string
  subject: 'math' | 'english' | 'stem' | 'other'
  level: string
  startDate: string
  endDate: string
  totalSessions: number
  completedSessions: number
  status: 'completed' | 'dropped'
  finalOutcome?: string
  teacherFinalFeedback?: string
  classes: {
    classCode: string
    className: string
    teacherName: string
    assistantName?: string
    sessions: string
  }[]
}

export const defaultHistoricalTracks: HistoricalTrack[] = [
  {
    id: 'track-math-prek',
    name: 'Toán Tiền Tiểu Học Kindi 3 (Pre-K)',
    subject: 'math',
    level: 'Toán Tiền Tiểu Học (Kindi 3)',
    startDate: '01/06/2023',
    endDate: '31/12/2023',
    totalSessions: 24,
    completedSessions: 24,
    status: 'completed',
    finalOutcome: 'Đạt chuẩn đầu ra Archimedes Pre-K - A • Đủ điều kiện lên Toán 1:6',
    teacherFinalFeedback: 'Bé làm quen rất tốt với các khối hình và số đếm tư duy, tự tin phát biểu và hoàn thành mọi bài tập dự án.',
    classes: [
      {
        classCode: 'LD_TOAN_00003',
        className: 'Toán Nhập Môn Mầm Non K8',
        teacherName: 'GV_HuongTM',
        assistantName: 'Phạm Quỳnh Nga',
        sessions: '16 / 16 buổi',
      },
      {
        classCode: 'LD_TOAN_00001',
        className: 'Toán Khám Phá Khối Hình K7',
        teacherName: 'GV_HuongTM',
        assistantName: 'Trần Thảo',
        sessions: '8 / 8 buổi',
      },
    ],
  },
  {
    id: 'track-eng-starters',
    name: 'Tiếng Anh Trẻ Em Khởi Động (Kindie 1)',
    subject: 'english',
    level: 'Cambridge Starters Foundation',
    startDate: '15/01/2023',
    endDate: '30/05/2023',
    totalSessions: 24,
    completedSessions: 24,
    status: 'completed',
    finalOutcome: 'Đạt chuẩn đầu ra Cambridge Starters (15/15 Khiên)',
    teacherFinalFeedback: 'Phát âm tự nhiên, vốn từ vựng cơ bản vững chắc, phản xạ giao tiếp tiếng Anh tự tin trong mọi hoạt động nhóm.',
    classes: [
      {
        classCode: 'LD_ENG_00001',
        className: 'Tiếng Anh Kindie 1 - K5',
        teacherName: 'Sarah Jenkins',
        assistantName: 'Lê Mai Anh',
        sessions: '24 / 24 buổi',
      },
    ],
  },
]

