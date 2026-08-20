import type { DigiStudentBooking } from '@/mocks/digiSchedule'
import type { ClassSession } from '@/mocks/calendarSchedule'

export interface DigiScheduleFilterState {
  branches: string[]
  statuses: string[]
  assistants: string[]
}

export type { DigiStudentBooking, ClassSession }

