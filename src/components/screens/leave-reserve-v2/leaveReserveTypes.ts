import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

export interface LeaveReserveFilterState {
  types: Array<LeaveReserveRequest['type']>
  dateRanges: Array<'this-week' | 'this-month' | 'last-month' | 'custom'>
}

export const TYPE_LABELS: Record<LeaveReserveRequest['type'], string> = {
  leave: 'Nghỉ phép',
  reserve: 'Bảo lưu',
  suspend: 'Nghỉ học tạm thời',
}

export const DATE_RANGE_LABELS: Record<LeaveReserveFilterState['dateRanges'][number], string> = {
  'this-week': 'Tuần này',
  'this-month': 'Tháng này',
  'last-month': 'Tháng trước',
  custom: 'Tùy chọn',
}
