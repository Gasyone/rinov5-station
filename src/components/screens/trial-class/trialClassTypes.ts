import type { TrialClassStatus } from '@/mocks/trialClasses'

/** Tile Id includes real statuses + virtual filters like 'unassigned' */
export type StatusTileId = 'all' | TrialClassStatus | 'unassigned'

export interface TrialSessionSelection {
  classId: string
  className: string
  sessionId: string
  sessionName: string
  trialDate: string
}

export interface TrialClassFilterState {
  programs: string[]
  creators: string[]
  statuses: TrialClassStatus[]
}

export interface CreateTrialClassForm {
  studentId: string
  studentName: string

  school: string
  program: string
  subject: string
  notes: string

  selectedSessions: TrialSessionSelection[]
}

export type AssignDialogMode =
  | { mode: 'closed' }
  | { mode: 'assign'; trialId: string }
  | { mode: 'reschedule'; trialId: string }

export interface StatusConfigItem {
  id: Exclude<StatusTileId, 'all'>
  label: string
  status: string
}

export interface RescheduleRequestData {
  reason: string
  notes: string
}
