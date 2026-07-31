import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

export interface LeaveReserveFilterState {
  types: Array<LeaveReserveRequest['type']>
  dateRanges: Array<'this-week' | 'this-month' | 'last-month' | 'custom'>
  schools: string[]
  packages: string[]
  staff: string[]
  classes: string[]
}

export const TYPE_LABELS: Record<LeaveReserveRequest['type'], string> = {
  off: 'Nghỉ phép',
  reservation: 'Bảo lưu',
  learn_again: 'Đi học lại',
}

export const DATE_RANGE_LABELS: Record<LeaveReserveFilterState['dateRanges'][number], string> = {
  'this-week': 'Tuần này',
  'this-month': 'Tháng này',
  'last-month': 'Tháng trước',
  custom: 'Tùy chọn',
}

export const STATUS_LABELS: Record<LeaveReserveRequest['status'], string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  not_approved: 'Không duyệt',
  cancel: 'Hủy duyệt',
}
