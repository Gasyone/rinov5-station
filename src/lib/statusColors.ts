/**
 * Centralized Status Color Mapping
 *
 * ALL status badge styling MUST use this utility.
 * DO NOT hardcode status colors inline in screen components.
 *
 * @see docs/DESIGN_SYSTEM.md §2.2 Semantic Status Colors
 */

export type StatusSemantic =
  | 'success'     // Active, Available, Completed enrollment
  | 'info'        // In Progress, Assessing, In Use
  | 'warning'     // Pending, Locked, Maintenance, Biệt phái
  | 'error'       // Deactivated, Decommissioned, Failed
  | 'neutral'     // Inactive, Cancelled, Draft
  | 'purple'      // Interviewed, Merged, Special
  | 'completed'   // Completed (distinct from success)

interface StatusColorSet {
  badge: string       // For <Badge className={...}>
  dot: string         // For status dot indicator
  active: string      // For active/selected state (e.g. status tiles)
  bg: string          // Background only
  text: string        // Text only
}

const STATUS_COLORS: Record<StatusSemantic, StatusColorSet> = {
  success: {
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400',
    dot: 'bg-emerald-500',
    active: 'border-emerald-600 bg-emerald-600 text-white',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  info: {
    badge: 'border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-400',
    dot: 'bg-sky-500',
    active: 'border-sky-600 bg-sky-600 text-white',
    bg: 'bg-sky-50 dark:bg-sky-950',
    text: 'text-sky-700 dark:text-sky-400',
  },
  warning: {
    badge: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400',
    dot: 'bg-amber-500',
    active: 'border-amber-600 bg-amber-600 text-white',
    bg: 'bg-amber-50 dark:bg-amber-950',
    text: 'text-amber-700 dark:text-amber-400',
  },
  error: {
    badge: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400',
    dot: 'bg-red-500',
    active: 'border-red-600 bg-red-600 text-white',
    bg: 'bg-red-50 dark:bg-red-950',
    text: 'text-red-700 dark:text-red-400',
  },
  neutral: {
    badge: 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400',
    dot: 'bg-zinc-400',
    active: 'border-zinc-700 bg-zinc-700 text-white',
    bg: 'bg-zinc-50 dark:bg-zinc-900',
    text: 'text-zinc-600 dark:text-zinc-400',
  },
  purple: {
    badge: 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400',
    dot: 'bg-violet-500',
    active: 'border-violet-600 bg-violet-600 text-white',
    bg: 'bg-violet-50 dark:bg-violet-950',
    text: 'text-violet-700 dark:text-violet-400',
  },
  completed: {
    badge: 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-400',
    dot: 'bg-cyan-500',
    active: 'border-cyan-600 bg-cyan-600 text-white',
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    text: 'text-cyan-700 dark:text-cyan-400',
  },
}

/**
 * Get the full color set for a semantic status.
 *
 * Usage:
 * ```tsx
 * import { getStatusColors } from '@/lib/statusColors'
 *
 * const colors = getStatusColors('success')
 * <Badge className={colors.badge}>Active</Badge>
 * <div className={colors.dot} />
 * ```
 */
export function getStatusColors(semantic: StatusSemantic): StatusColorSet {
  return STATUS_COLORS[semantic]
}

// ─── Domain-Specific Status Maps ─────────────────────────────────────

/**
 * Map a known entity status string to its semantic color.
 * Screens MUST use this instead of hardcoding colors.
 *
 * Usage:
 * ```tsx
 * const semantic = resolveStatusSemantic('active') // → 'success'
 * const colors = getStatusColors(semantic)
 * ```
 */
const ENTITY_STATUS_MAP: Record<string, StatusSemantic> = {
  // Account / User
  active: 'success',
  locked: 'warning',
  deactivated: 'error',
  inactive: 'neutral',
  probation: 'warning',
  resigned: 'neutral',

  // Booking Test
  booked_assessment: 'success',
  unassigned_teacher: 'warning',
  interviewed: 'purple',
  tested: 'warning',
  checkin: 'success',
  completed: 'completed',
  escalated: 'error',
  failed: 'error',
  cancelled: 'neutral',

  // Device
  available: 'success',
  in_use: 'info',
  maintenance: 'warning',
  decommissioned: 'error',

  // Person (MDM)
  merged: 'purple',
  pending: 'warning',
  new: 'info',
  contacted: 'warning',
  qualified: 'success',
  converted: 'completed',
  lost: 'neutral',

  // HR
  on_leave: 'info',
  seconded: 'warning', // biệt phái
  registered: 'success',
  needs_attention: 'warning',

  // Calendar event types
  class_session: 'info',
  supplementary: 'success',
  workshop: 'purple',
  digi_session: 'purple',
  planned: 'neutral',
  placement_test: 'warning',
  event: 'info',
  scheduled: 'info',
  ongoing: 'warning',
  upcoming: 'info',

  // Event Management V5
  mo_dang_ky: 'success',
  dang_dien_ra: 'info',
  ket_thuc: 'completed',

  // Students
  graduated: 'completed',
  transferred: 'neutral',
  pending_payment: 'warning',
  draft_class: 'neutral',
  fee_transfer: 'info',
  trial: 'purple',
  reserve: 'purple',
  session_ended: 'neutral',
  dropout: 'error',
  buoi_1: 'info',
  buoi_2: 'info',
  buoi_3: 'info',
  buoi_cuoi: 'error',

  // Products
  archived: 'neutral',

  // Trial Class
  pending_confirmation: 'warning',
  pending_approval: 'warning',
  reschedule: 'error',
  no_show: 'neutral',
  class_workshop: 'warning',
  class_official: 'info',

  // Class Assignment / Waitlist
  wait_for_assignment: 'info',
  enroll_later: 'purple',
  pending_transfer: 'warning',
  awaiting_opening: 'completed',

  // Class lifecycle (BF-CLS-02)
  nhap: 'neutral',
  mo_chieu_sinh: 'info',
  cho_khai_giang: 'purple',
  dang_hoc: 'success',
  tam_dung: 'warning',
  huy: 'completed',

  // Tuition Renewal
  moi: 'neutral',
  chua_den_han: 'neutral',
  can_nhac: 'warning',
  tiem_nang: 'info',
  hen_tai: 'purple',
  tai_phi: 'success',
  chong_phi: 'success',
  rut_phi: 'neutral',
  that_bai: 'error',
  dang_cham_soc: 'info',
  danh_gia_trai_nghiem: 'purple',
  hen_test_hoc_thu: 'purple',
  da_test_hoc_thu: 'warning',
  tiem_nang_cao: 'info',

  // Class Session (BF-OPS-02 / FLOW-OPS-01)
  // scheduled, in_progress, completed, cancelled already registered above
  audited: 'completed',
  rescheduled: 'warning',
  makeup: 'success',

  // Attendance
  present: 'success',
  absent: 'error',
  late: 'warning',
  excused: 'info',
  no_attendance: 'neutral',
  pending_review: 'warning',
  submitted: 'success',
  overdue: 'error',

  // Priority (Tickets, Rules)
  high: 'error',
  medium: 'warning',
  low: 'info',

  // Leave/Reserve types
  leave: 'info',
  off: 'info',
  reservation: 'purple',
  learn_again: 'success',
  resume: 'success',
  not_approved: 'error',
  cancel: 'neutral',
  suspend: 'warning',

  // Holiday types
  national: 'purple',
  internal: 'info',
  center: 'warning',

  // Teacher Schedule Status
  trung_lich: 'error',
  trong_lich: 'success',
  goi_lop: 'warning',
  busy: 'error',
  ca_ca: 'success',
  full_shift: 'success',

  // Session Feedback
  feedback_pending: 'warning',
  feedback_completed: 'success',
  feedback_needs_follow_up: 'error',

  // Homework
  homework_done: 'success',
  homework_missing: 'error',
  homework_late: 'warning',
  homework_partial: 'info',

  // QC Check Event
  qc_draft: 'neutral',
  qc_published: 'info',
  qc_correcting: 'warning',
  qc_closed: 'completed',
  qc_cancelled: 'neutral',
  qc_completed_closed: 'success',
  qc_not_met: 'error',

  // QC Error
  qc_error_open: 'error',
  qc_error_correcting: 'warning',
  qc_error_corrected: 'success',
  qc_error_closed: 'completed',
  qc_error_cancelled: 'neutral',
  qc_error_overdue: 'purple',
  qc_error_not_met: 'error',

  // Make-up Class Request Statuses
  cho_duyet: 'warning',
  da_xep_lich: 'info',
  da_vang: 'error',
  tu_choi: 'error',
  het_han: 'neutral',

  // Generic
  draft: 'neutral',
  approved: 'success',
  rejected: 'error',
  in_progress: 'warning',
  dang_xu_ly: 'warning',
  chua_xuly: 'warning',
  dang_xuly: 'info',
  da_xuly: 'success',
  da_dong: 'neutral',
  chua_cham_soc: 'info',
  paid: 'success',
  unpaid: 'warning',
  partial: 'info',
  refunded: 'neutral',
  confirmed: 'success',
  declined: 'error',

  // Class Types & Operations
  offline: 'success',
  online: 'purple',
  online_tutor: 'purple',
  assigned_class: 'purple',
}

export function resolveStatusSemantic(status: string): StatusSemantic {
  return ENTITY_STATUS_MAP[status] ?? 'neutral'
}

/**
 * Shortcut: get badge class for any entity status string.
 *
 * Usage:
 * ```tsx
 * <Badge className={getStatusBadgeClass('active')}>Active</Badge>
 * ```
 */
export function getStatusBadgeClass(status: string): string {
  return getStatusColors(resolveStatusSemantic(status)).badge
}

export function getStatusDotClass(status: string): string {
  return getStatusColors(resolveStatusSemantic(status)).dot
}

/**
 * Get standard status dot color class for attendance/homework rates.
 */
export function getRateColorClass(rate: number): string {
  if (rate < 50) return getStatusColors('error').dot
  if (rate < 80) return getStatusColors('warning').dot
  return getStatusColors('success').dot
}

