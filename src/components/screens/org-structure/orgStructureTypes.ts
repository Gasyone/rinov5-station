import type {
  OrgUnit,
  OrgUnitType,
  OrgStaffMember,
  OrgTreeNode,
} from '@/mocks/orgStructure'

export type { OrgUnit, OrgUnitType, OrgStaffMember, OrgTreeNode }

export type OrgViewMode = 'tree' | 'table'

export interface OrgFilterState {
  search: string
  type: string
}

export interface OrgUnitFormValues {
  code: string
  name: string
  type: OrgUnitType
  parentId: string
  branchId?: string
  description: string
  leaderName?: string
  leaderTitle?: string
  leaderPhone?: string
  leaderEmail?: string
}

export interface StaffTransferFormValues {
  staffId: string
  staffName: string
  fromUnitId: string
  fromUnitName: string
  toUnitId: string
  newTitle: string
  effectiveDate: string
  note: string
}

export const ORG_UNIT_TYPES: { value: OrgUnitType | 'all'; label: string }[] = [
  { value: 'all', label: 'Tất cả loại hình' },
  { value: 'board', label: 'Ban Giám đốc' },
  { value: 'block', label: 'Khối' },
  { value: 'region', label: 'Vùng' },
  { value: 'branch', label: 'Chi nhánh' },
  { value: 'department', label: 'Phòng ban' },
  { value: 'team', label: 'Tổ / Nhóm' },
]

export const ORG_TYPE_BADGE_MAP: Record<OrgUnitType, { label: string; badgeVariant: string }> = {
  board: { label: 'Ban Giám đốc', badgeVariant: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' },
  block: { label: 'Khối', badgeVariant: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300' },
  region: { label: 'Vùng', badgeVariant: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
  branch: { label: 'Chi nhánh', badgeVariant: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
  department: { label: 'Phòng ban', badgeVariant: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' },
  team: { label: 'Tổ / Nhóm', badgeVariant: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300' },
}
