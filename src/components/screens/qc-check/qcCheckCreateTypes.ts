import {
  QC_TARGET_GROUP_CRITERIA,
  type QcTargetGroup,
  type QcEvaluationCriteria,
  type QcErrorSeverity,
} from '@/mocks/qcChecks'
import { BRANCH_OPTIONS } from './qcCheckHelpers'
import { Info, AlertCircle, AlertTriangle, Flame } from 'lucide-react'

export interface CreateIncidentItem {
  targetGroup: QcTargetGroup
  criteria: QcEvaluationCriteria
  title: string
  description: string
  severity: QcErrorSeverity
  // Context fields
  className?: string
  sessionNumber?: number
  sessionInfo?: string
  roomId?: string
  teacherName?: string
  facilityStaffName?: string
  csmName?: string
  // Evidence & Assignee
  evidence: string
  evidenceImage?: string
  evidenceLink?: string
  assignee: string
  deadline?: string
  notes?: string
}

export interface CreateBatchIncidentForm {
  branch: string
  inspectorId: string
  incidents: CreateIncidentItem[]
}

export interface QcCreatePrefill {
  branch?: string
  targetGroup?: QcTargetGroup
  teacherName?: string
  assignee?: string
  roomId?: string
  className?: string
}

export const SAMPLE_CLASSES = [
  'IELTS Intensive K24',
  'Toán Tư Duy Bồi Dưỡng T5',
  'Tiếng Anh Mầm Non K12',
  'Tiếng Anh Giao Tiếp E3',
  'Lập trình Scratch Nhí S2',
  'IELTS-K24',
  'MATH-T05',
  'ENG-K12',
]

export const SAMPLE_ROOMS = [
  'Phòng A101',
  'Phòng A201',
  'Phòng A203',
  'Phòng B102',
  'Phòng Lab 2',
  'Sảnh chính tầng 1',
  'Hành lang tầng 3',
  'Nhà vệ sinh tầng 2',
]

export const SAMPLE_EQUIPMENT = [
  'Điều hòa không khí',
  'Máy chiếu & Màn chiếu',
  'Đèn chiếu sáng',
  'Bàn ghế học sinh',
  'Bảng viết & Bút lông',
  'Hệ thống âm thanh / Loa',
  'Cửa sổ / Cửa ra vào',
  'Thiết bị vệ sinh',
]

export const SEVERITY_OPTIONS = [
  {
    value: 'low' as const,
    title: 'Mức độ Thấp',
    activeClass:
      'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 ring-1 ring-emerald-500/30',
    inactiveClass: 'text-emerald-500 dark:text-emerald-400 hover:bg-emerald-500/10',
    icon: Info,
  },
  {
    value: 'medium' as const,
    title: 'Mức độ Trung bình (Mặc định)',
    activeClass:
      'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40 ring-1 ring-blue-500/30',
    inactiveClass: 'text-blue-500 dark:text-blue-400 hover:bg-blue-500/10',
    icon: AlertCircle,
  },
  {
    value: 'high' as const,
    title: 'Mức độ Cao',
    activeClass:
      'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 ring-1 ring-amber-500/30',
    inactiveClass: 'text-amber-500 dark:text-amber-400 hover:bg-amber-500/10',
    icon: AlertTriangle,
  },
  {
    value: 'critical' as const,
    title: 'Mức độ Nghiêm trọng',
    activeClass:
      'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40 ring-1 ring-rose-500/30',
    inactiveClass: 'text-rose-500 dark:text-rose-400 hover:bg-rose-500/10',
    icon: Flame,
  },
]

export function buildEmptyItem(defaultGroup: QcTargetGroup = 'teacher'): CreateIncidentItem {
  const defaultTeacher = 'Cô Hoàng Thu Thảo'
  const defaultFacility = 'Võ Minh Tuấn'
  const defaultCsm = 'Nguyễn Thị Mai'

  const assignee =
    defaultGroup === 'teacher'
      ? defaultTeacher
      : defaultGroup === 'facility'
        ? defaultFacility
        : defaultCsm

  return {
    targetGroup: defaultGroup,
    criteria: QC_TARGET_GROUP_CRITERIA[defaultGroup][0],
    title: '',
    description: '',
    severity: 'medium', // Luôn để mặc định là Trung bình
    className: '',
    sessionNumber: defaultGroup === 'teacher' ? 1 : undefined,
    sessionInfo: defaultGroup === 'teacher' ? 'Buổi 1' : '',
    roomId: defaultGroup === 'facility' ? SAMPLE_ROOMS[1] : '',
    teacherName: defaultGroup === 'teacher' ? defaultTeacher : '',
    facilityStaffName: defaultGroup === 'facility' ? defaultFacility : '',
    csmName: defaultGroup === 'operations' ? defaultCsm : '',
    evidence: 'Ghi nhận trực tiếp khi kiểm tra',
    evidenceImage: '',
    evidenceLink: '',
    assignee,
    deadline: '',
    notes: '',
  }
}

export function buildEmptyBatchForm(): CreateBatchIncidentForm {
  return {
    branch: BRANCH_OPTIONS[0],
    inspectorId: 'ins_01',
    incidents: [buildEmptyItem('teacher')],
  }
}

export function buildInitialBatchForm(prefill?: QcCreatePrefill | null): CreateBatchIncidentForm {
  if (prefill) {
    const tg = prefill.targetGroup || 'teacher'
    const item = buildEmptyItem(tg)
    if (prefill.teacherName) {
      item.teacherName = prefill.teacherName
      item.assignee = prefill.teacherName
    }
    if (prefill.assignee) {
      item.assignee = prefill.assignee
      if (tg === 'teacher') item.teacherName = prefill.assignee
      if (tg === 'facility') item.facilityStaffName = prefill.assignee
      if (tg === 'operations') item.csmName = prefill.assignee
    }
    if (prefill.roomId) item.roomId = prefill.roomId
    if (prefill.className) item.className = prefill.className
    return {
      branch: prefill.branch || BRANCH_OPTIONS[0],
      inspectorId: 'ins_01',
      incidents: [item],
    }
  }
  return buildEmptyBatchForm()
}
