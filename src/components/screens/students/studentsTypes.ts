import type { Student } from '@/mocks/students'

export type StudentStatusFilter = 'all' | Student['status']

export interface StudentFilterState {
  branches: string[]
  levels: string[]
  status: StudentStatusFilter
}

export const STUDENT_STATUS_TABS: Array<{
  id: StudentStatusFilter
  label: string
  /** Status key resolved via @/lib/statusColors. `undefined` for the "All" tile. */
  status?: Student['status']
}> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'pending_payment', label: 'Chờ thanh toán', status: 'pending_payment' },
  { id: 'draft_class', label: 'Lớp nháp', status: 'draft_class' },
  { id: 'wait_for_assignment', label: 'Chờ xếp lớp', status: 'wait_for_assignment' },
  { id: 'enroll_later', label: 'Xếp lớp sau', status: 'enroll_later' },
  { id: 'pending_transfer', label: 'Chờ chuyển lớp', status: 'pending_transfer' },
  { id: 'fee_transfer', label: 'Chuyển phí', status: 'fee_transfer' },
  { id: 'awaiting_opening', label: 'Chờ khai giảng', status: 'awaiting_opening' },
  { id: 'trial', label: 'Học thử', status: 'trial' },
  { id: 'active', label: 'Đang học', status: 'active' },
  { id: 'reserve', label: 'Bảo lưu', status: 'reserve' },
  { id: 'session_ended', label: 'Hết buổi', status: 'session_ended' },
]
