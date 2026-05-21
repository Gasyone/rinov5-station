import { type FilterSection } from '@/components/filters'
import { type StatusTile } from '@/components/shared'
import { getSlot } from './workRegistrationHelpers'
import {
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

  return (['all', 'not_registered', 'registered', 'locked'] as WorkRegistrationStatusFilter[]).map((status) => ({
    id: status,
    label: WORK_STATUS_LABELS[status],
    count: count(status),
    status: status === 'not_registered' ? 'draft' : status, // keep draft color for not_registered
  }))
}

export function buildFilterSections(
  summaries: EmployeeWeekSummary[],
  jobTitles: string[],
  statusFilter: WorkRegistrationStatusFilter
): FilterSection[] {
  const positions = Array.from(new Set(summaries.map((summary) => summary.employee.position))).sort()
  return [
    {
      id: 'jobTitles',
      title: 'Chức danh',
      options: positions.map((position) => ({
        value: position,
        label: position,
        checked: jobTitles.includes(position),
      })),
    },
    {
      id: 'statuses',
      title: 'Trạng thái đăng ký',
      options: (['not_registered', 'registered', 'locked'] as WorkRegistrationStatusFilter[]).map((status) => ({
        value: status,
        label: WORK_STATUS_LABELS[status],
        count: summaries.filter((summary) => summary.status === status).length,
        checked: statusFilter === status,
      })),
    },
  ]
}

export function resolveCurrentEmployeeId(role?: string) {
  if (role === 'teacher') return 'e3'
  if (role === 'sale') return 'e2'
  if (role === 'csm') return 'e5'
  if (role === 'branch_manager') return 'e1'
  return 'e1'
}

export function slotDetailDescription(target: SlotDetailTarget | null) {
  if (!target) return undefined
  const slot = getSlot(target.slotId)
  return `${target.date} · ${slot?.label ?? target.slotId}`
}
