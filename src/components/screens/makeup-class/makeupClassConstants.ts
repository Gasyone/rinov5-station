import type { MakeupStatusConfigItem } from './makeupClassTypes'

/** Lifecycle statuses — shown as StatusTiles (left) */
export const MAKEUP_LIFECYCLE_CONFIG: MakeupStatusConfigItem[] = [
  { id: 'cho_duyet', label: 'Mới', status: 'cho_duyet' },
  { id: 'da_xep_lich', label: 'Đã xếp lịch', status: 'da_xep_lich' },
  { id: 'tu_choi', label: 'Từ chối', status: 'tu_choi' },
  { id: 'cancelled', label: 'Hủy', status: 'cancelled' },
]

/** Result statuses — shown as quick-filter chips (right) */
export const MAKEUP_RESULT_FILTERS = [
  { id: 'completed' as const, label: 'Đã học', status: 'completed' },
  { id: 'da_vang' as const, label: 'Vắng mặt', status: 'da_vang' },
  { id: 'het_han' as const, label: 'Hết hạn', status: 'het_han' },
]

/** All statuses combined for lookup */
export const ALL_MAKEUP_STATUS_CONFIG: MakeupStatusConfigItem[] = [
  ...MAKEUP_LIFECYCLE_CONFIG,
  ...MAKEUP_RESULT_FILTERS.map((r) => ({ id: r.id, label: r.label, status: r.status })),
]

export const MAKEUP_STATUS_META = Object.fromEntries(
  ALL_MAKEUP_STATUS_CONFIG.map((s) => [s.id, s])
) as Record<MakeupStatusConfigItem['id'], MakeupStatusConfigItem>
