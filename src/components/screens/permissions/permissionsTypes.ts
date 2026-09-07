import type {
  DataScope,
  PermissionActionState,
  PermissionFeatureItem,
  RolePermissionMatrixItem,
  PermissionRole,
  PermissionTopic,
} from '@/mocks/permissions'

export type {
  DataScope,
  PermissionActionState,
  PermissionFeatureItem,
  RolePermissionMatrixItem,
  PermissionRole,
  PermissionTopic,
}

export interface ScopeOptionItem {
  value: DataScope
  label: string
  description?: string
}

export const PERMISSION_ACTION_COLUMNS: { key: keyof PermissionActionState; label: string }[] = [
  { key: 'access', label: 'Truy cập' },
  { key: 'create', label: 'Thêm' },
  { key: 'edit', label: 'Sửa' },
  { key: 'delete', label: 'Xóa' },
  { key: 'export', label: 'Download/Upload' },
]

export const STATION_ACTION_COLUMNS: { key: keyof PermissionActionState; label: string }[] = [
  { key: 'access', label: 'Truy cập' },
  { key: 'viewAll', label: 'Xem tất cả' },
  { key: 'create', label: 'Thêm' },
  { key: 'edit', label: 'Sửa' },
  { key: 'delete', label: 'Xóa' },
  { key: 'export', label: 'Xuất file' },
]

export const DATA_SCOPE_OPTIONS: ScopeOptionItem[] = [
  {
    value: '',
    label: '-- Chọn phạm vi --',
    description: 'Chưa thiết lập phạm vi dữ liệu cho Station (mặc định theo hệ thống)',
  },
  {
    value: 'personal',
    label: 'Bản thân',
    description: 'Chỉ truy cập dữ liệu do chính người dùng phụ trách hoặc tạo ra',
  },
  {
    value: 'team',
    label: 'Cùng nhóm',
    description: 'Truy cập dữ liệu của tất cả thành viên trong cùng tổ/nhóm',
  },
  {
    value: 'branch',
    label: 'Toàn cơ sở',
    description: 'Truy cập toàn bộ dữ liệu nội bộ của cơ sở / chi nhánh công tác',
  },
  {
    value: 'global',
    label: 'Toàn chuỗi',
    description: 'Không giới hạn cơ sở, truy cập dữ liệu trên toàn bộ hệ thống',
  },
]

export interface RoleBehaviorDiffItem {
  type: 'added' | 'removed'
  featureName: string
  actionLabels: string[]
}

export interface RoleAuditLogItem {
  id: string
  updatedAt: string
  updatedBy: string
  isCurrent?: boolean
  diffs: RoleBehaviorDiffItem[]
  permissionsSnapshot: RolePermissionMatrixItem[]
}
