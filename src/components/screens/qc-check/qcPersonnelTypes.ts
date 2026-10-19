import type {
  QcIncident,
  QcTargetGroup,
  QcEvaluationCriteria,
  QcErrorStatus,
} from '@/mocks/qcChecks'

export interface QcTagCriteriaMeta {
  abbrev: string
  label: string
  fullLabel: string
}

export const QC_CRITERIA_TAG_META: Record<QcEvaluationCriteria, QcTagCriteriaMeta> = {
  attendance: {
    abbrev: 'ĐD',
    label: 'Điểm danh',
    fullLabel: 'ĐD - Điểm danh học viên',
  },
  student_care: {
    abbrev: 'CS',
    label: 'Chăm sóc',
    fullLabel: 'CS - Chăm sóc học viên',
  },
  facility_quality: {
    abbrev: 'TB',
    label: 'CSVC / Thiết bị',
    fullLabel: 'TB - Chất lượng cơ sở vật chất',
  },
  feedback: {
    abbrev: 'NX',
    label: 'Nhận xét',
    fullLabel: 'NX - Nhận xét học viên',
  },
  pedagogy: {
    abbrev: 'TP',
    label: 'Tác phong',
    fullLabel: 'TP - Tác phong giảng dạy',
  },
  safety_hygiene: {
    abbrev: 'VS',
    label: 'Vệ sinh / An toàn',
    fullLabel: 'VS - An toàn & Vệ sinh',
  },
}

export interface QcPersonnelLocationContext {
  branch: string
  room?: string
  className?: string
  subject?: string
  displayLocation: string
  displaySubContext?: string
  assignedClasses: string[]
  roleContext?: string
}

export interface QcLatestRemediationInfo {
  action: string
  submittedAt?: string
  submittedBy?: string
  relativeTimeText?: string
  status: QcErrorStatus
  reviewStatus?: 'approved' | 'rejected'
}

export interface QcPersonnelErrorStats {
  current30DaysCount: number
  currentOpenCount: number
  previousMonthCount: number
  previousMonthOpenCount?: number
  trendDirection?: 'up' | 'down' | 'flat'
  diffCount?: number
}

export interface QcPersonnelProfile {
  code: string
  phone: string
  email: string
  avatar?: string
  department?: string
  directManager?: string
  position?: string
  subject?: string
  branches?: string[]
}

export interface QcPersonnelGroup {
  id: string
  personnelName: string
  cleanName: string
  role: string
  avatarColor: string
  targetGroup: QcTargetGroup
  branch: string
  locationContext: QcPersonnelLocationContext
  incidents: QcIncident[]
  activeIncidentsCount: number
  closedIncidentsCount: number
  pendingReviewCount: number
  hasOverdue: boolean
  hasDueToday: boolean
  earliestDeadline?: string
  latestRemediation?: QcLatestRemediationInfo
  aggregateStatus: 'has_open' | 'pending_review' | 'all_closed'
  errorStats: QcPersonnelErrorStats
  profile?: QcPersonnelProfile
}
