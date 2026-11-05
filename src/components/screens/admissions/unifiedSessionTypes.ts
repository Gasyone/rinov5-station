import type { BookingTest, BookingSubject, BookingStatus } from '@/mocks/bookingTests'
import type { TrialClass, TrialClassStatus } from '@/mocks/trialClasses'

export type UnifiedSessionType = 'test' | 'trial'

export type UnifiedSubject = 'english' | 'math' | 'other'

export interface UnifiedSessionItem {
  id: string
  type: UnifiedSessionType
  title: string
  subject: UnifiedSubject
  subjectLabel: string
  dateLabel: string
  rawDate: string
  timeLabel: string
  school: string
  room?: string
  teacherName?: string
  teacherRole?: string
  creatorName?: string
  status: string
  statusLabel: string
  isCurrent?: boolean

  // Thuộc tính riêng cho Test
  testScoreSummary?: {
    level?: string
    subLevel?: string
    speakingScore?: string
    lwrScore?: string
    resultLink?: string
  }

  // Thuộc tính riêng cho Trial
  trialSummary?: {
    className?: string
    classId?: string
    sessionName?: string
    rating?: number
    feedbackComment?: string
    assistant?: string
  }

  // Nguồn bản ghi gốc
  sourceBooking?: BookingTest
  sourceTrial?: TrialClass
}

export interface StudentPlacementLevels {
  english?: {
    level: string
    subLevel?: string
    testDate?: string
    isExpected?: boolean
  }
  math?: {
    level: string
    subLevel?: string
    testDate?: string
    isExpected?: boolean
  }
}
