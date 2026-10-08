export type StudentStatusId =
  | 'all'
  | 'pending_payment'
  | 'draft_class'
  | 'wait_for_assignment'
  | 'enroll_later'
  | 'pending_transfer'
  | 'fee_transfer'
  | 'awaiting_opening'
  | 'trial'
  | 'active'
  | 'reserve'
  | 'session_ended'

export type StudentLifecycleStatusId =
  | 'all'
  | 'wait_for_assignment'
  | 'active'
  | 'reserve'
  | 'session_ended'

export const STUDENT_LIFECYCLE_STATUS_CONFIG: Array<{
  id: StudentLifecycleStatusId
  label: string
  statusKey: string
}> = [
  { id: 'wait_for_assignment', label: 'Chờ xếp lớp', statusKey: 'wait_for_assignment' },
  { id: 'active', label: 'Đang học', statusKey: 'active' },
  { id: 'reserve', label: 'Bảo lưu', statusKey: 'reserve' },
  { id: 'session_ended', label: 'Hết buổi', statusKey: 'session_ended' },
]

export type StudentQuickFilterId =
  | 'all'
  | 'awaiting_opening'
  | 'pending_transfer'
  | 'enroll_later'
  | 'draft_class'
  | 'pending_payment'
  | 'trial'
  | 'fee_transfer'

export interface StudentQuickFilterDef {
  id: Exclude<StudentQuickFilterId, 'all'>
  label: string
}

export const STUDENT_QUICK_FILTERS: StudentQuickFilterDef[] = [
  { id: 'awaiting_opening', label: 'Chờ khai giảng' },
  { id: 'pending_transfer', label: 'Chờ chuyển lớp' },
  { id: 'enroll_later', label: 'Hẹn xếp sau' },
  { id: 'draft_class', label: 'Lớp nháp' },
  { id: 'pending_payment', label: 'Chờ thanh toán' },
  { id: 'fee_transfer', label: 'Chuyển phí' },
]

export const STUDENT_STATUS_CONFIG: Array<{ id: StudentStatusId; label: string; statusKey: string }> = [
  { id: 'pending_payment', label: 'Chờ thanh toán', statusKey: 'pending_payment' },
  { id: 'draft_class', label: 'Lớp nháp', statusKey: 'draft_class' },
  { id: 'wait_for_assignment', label: 'Chờ xếp lớp', statusKey: 'wait_for_assignment' },
  { id: 'enroll_later', label: 'Xếp lớp sau', statusKey: 'enroll_later' },
  { id: 'pending_transfer', label: 'Chờ chuyển lớp', statusKey: 'pending_transfer' },
  { id: 'fee_transfer', label: 'Chuyển phí', statusKey: 'fee_transfer' },
  { id: 'awaiting_opening', label: 'Chờ khai giảng', statusKey: 'awaiting_opening' },
  { id: 'trial', label: 'Học thử', statusKey: 'trial' },
  { id: 'active', label: 'Đang học', statusKey: 'active' },
  { id: 'reserve', label: 'Bảo lưu', statusKey: 'reserve' },
  { id: 'session_ended', label: 'Hết buổi', statusKey: 'session_ended' },
]

export const STUDENT_STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Chờ thanh toán',
  draft_class: 'Lớp nháp',
  wait_for_assignment: 'Chờ xếp lớp',
  enroll_later: 'Xếp lớp sau',
  pending_transfer: 'Chờ chuyển lớp',
  fee_transfer: 'Chuyển phí',
  awaiting_opening: 'Chờ khai giảng',
  trial: 'Học thử',
  active: 'Đang học',
  reserve: 'Bảo lưu',
  session_ended: 'Hết buổi',
  // EnrolledClass-specific statuses
  inactive: 'Không hoạt động',
  absent: 'Vắng mặt',
  excused: 'Nghỉ phép',
  paused: 'Bảo lưu',
  dropped: 'Đã hủy',
}
