import { createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { type StatusTile } from '@/components/shared'
import { getSlot } from './workRegistrationHelpers'
import {
  WORK_REGISTRATION_GRID_SECTIONS,
  WORK_STATUS_LABELS,
  type EmployeeWeekSummary,
  type SlotDetailTarget,
  type WorkRegistrationStatusFilter,
} from './workRegistrationTypes'

export function buildStatusTiles(
  summaries: EmployeeWeekSummary[]
): StatusTile<WorkRegistrationStatusFilter>[] {
  const count = (status: WorkRegistrationStatusFilter) =>
    status === 'all' ? summaries.length : summaries.filter((summary) => summary.status === status).length

  return (['all', 'not_registered', 'registered'] as WorkRegistrationStatusFilter[]).map((status) => ({
    id: status,
    label: WORK_STATUS_LABELS[status],
    count: count(status),
    status: status === 'not_registered' ? 'draft' : status, // keep draft color for not_registered
  }))
}

export function buildFilterGroups(
  summaries: EmployeeWeekSummary[],
  jobTitles: string[],
  statusFilter: WorkRegistrationStatusFilter,
  subjectFilter: string
): FilterGroupConfig[] {
  const positions = Array.from(new Set(summaries.map((summary) => summary.employee.position))).sort()
  const subjects = ['IELTS', 'Giao tiếp', 'TOEIC', 'Kids', 'Ngữ pháp']
  return [
    createFilterGroup({
      id: 'subjects',
      options: subjects.map((subject) => ({
        value: subject,
        label: subject,
      })),
      selectedValues: subjectFilter === 'all' ? [] : [subjectFilter],
    }),
    createFilterGroup({
      id: 'jobTitles',
      options: positions,
      selectedValues: jobTitles,
    }),
    createFilterGroup({
      id: 'statuses',
      title: 'Trạng thái đăng ký',
      options: (['not_registered', 'registered'] as WorkRegistrationStatusFilter[]).map((status) => ({
        value: status,
        label: WORK_STATUS_LABELS[status],
        count: summaries.filter((summary) => summary.status === status).length,
      })),
      selectedValues: statusFilter === 'all' ? [] : [statusFilter],
    }),
  ]
}

export function resolveCurrentEmployeeId(role?: string) {
  if (role === 'teacher') return 'e3'
  if (role === 'sale') return 'e2'
  if (role === 'csm') return 'e5'
  if (role === 'branch_manager') return 'e1'
  return 'e1'
}

export function resolveSlotDetailTitle(
  target: SlotDetailTarget | null,
  branchDetail?: { branch: string; date?: string; dayLabel?: string } | null
): string {
  if (branchDetail?.branch) return branchDetail.branch

  const baseTitle = 'Chi tiết nhân viên đăng ký ca'
  if (!target) return baseTitle

  let sessionInfo = ''
  if (target.section) {
    const sec = WORK_REGISTRATION_GRID_SECTIONS.find((s) => s.id === target.section)
    if (sec) {
      sessionInfo = `${sec.label} (${sec.start} - ${sec.end})`
    }
  } else if (target.slotId) {
    const slot = getSlot(target.slotId)
    if (slot) {
      sessionInfo = slot.label
    }
  }

  return sessionInfo ? `${baseTitle} - ${sessionInfo}` : baseTitle
}

export function slotDetailDescription(target: SlotDetailTarget | null) {
  if (!target) return undefined
  // Đã đưa thông tin buổi lên dòng tiêu đề và bỏ hiển thị ngày
  return undefined
}
