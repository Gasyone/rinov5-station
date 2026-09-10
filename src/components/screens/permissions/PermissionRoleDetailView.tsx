'use client'

import { useState, useMemo } from 'react'
import {
  Shield,
  Users,
  History,
  Save,
  MoreHorizontal,
  Trash2,
  Copy,
  UserPlus,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FieldLabel, ConfirmDialog, EmptyState } from '@/components/shared'
import { PermissionStationMatrixTable } from './PermissionStationMatrixTable'
import { PermissionRoleAssignedUsersTab } from './PermissionRoleAssignedUsersTab'
import { PermissionRoleHistoryTab } from './PermissionRoleHistoryTab'
import { getAssignedEmployeesForRole, getGroupedFeatures, createDefaultRolePermissions } from './permissionsHelpers'
import {
  SYSTEM_PERMISSION_FEATURES,
  STATION_PERMISSION_FEATURES,
} from '@/mocks/permissions'
import type { Employee } from '@/mocks/employees'
import type {
  PermissionTopic,
  PermissionRole,
  RolePermissionMatrixItem,
  DataScope,
  PermissionActionState,
} from './permissionsTypes'

interface PermissionRoleDetailViewProps {
  role?: PermissionRole | null
  isCreating: boolean
  topics: PermissionTopic[]
  defaultTopicId?: string
  onSave: (roleData: {
    id?: string
    name: string
    topicId: string
    code: string
    description: string
    permissions: RolePermissionMatrixItem[]
    userCount: number
  }) => void
  onCancel: () => void
  onDeleteRole: (role: PermissionRole) => void
  onDuplicateRole: (role: PermissionRole) => void
}

export function PermissionRoleDetailView({
  role,
  isCreating,
  topics,
  defaultTopicId,
  onSave,
  onCancel,
  onDeleteRole,
  onDuplicateRole,
}: PermissionRoleDetailViewProps) {
  // Form state (Xóa hoàn toàn Mã quyền)
  const [name, setName] = useState(isCreating ? '' : role?.name || '')
  const topicId = isCreating
    ? defaultTopicId || topics[0]?.id || ''
    : role?.topicId || defaultTopicId || topics[0]?.id || ''
  const [description, setDescription] = useState(isCreating ? '' : role?.description || '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)

  // Tab state: 'matrix' | 'users' | 'history'
  const [activeTab, setActiveTab] = useState<string>('matrix')

  // Matrix and Group Collapse state
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  // Assigned Employees list
  const [assignedEmployees, setAssignedEmployees] = useState<Employee[]>(() => {
    return role && !isCreating ? getAssignedEmployeesForRole(role) : []
  })

  // Permissions matrix map
  const [permissionsMap, setPermissionsMap] = useState<Record<string, RolePermissionMatrixItem>>(() => {
    const map: Record<string, RolePermissionMatrixItem> = {}
    const basePermissions = role?.permissions || (isCreating ? createDefaultRolePermissions() : [])

    basePermissions.forEach((p) => {
      map[p.featureKey] = {
        featureKey: p.featureKey,
        actions: { ...p.actions },
        scope: p.scope ?? '',
      }
    })

    ;[...SYSTEM_PERMISSION_FEATURES, ...STATION_PERMISSION_FEATURES].forEach((feat) => {
      const isPersonalOnly = feat.allowedScopes?.length === 1 && feat.allowedScopes[0] === 'personal'
      if (!map[feat.featureKey]) {
        map[feat.featureKey] = {
          featureKey: feat.featureKey,
          actions: {
            access: false,
            create: false,
            edit: false,
            delete: false,
            export: false,
            viewAll: false,
          },
          scope: isPersonalOnly ? 'personal' : (feat.defaultScope ?? ''),
        }
      } else if (isPersonalOnly && map[feat.featureKey].scope !== 'personal') {
        map[feat.featureKey].scope = 'personal'
      }
    })

    return map
  })

  const currentTopic = useMemo(
    () => topics.find((t) => t.id === topicId) || topics[0],
    [topics, topicId]
  )

  // LẤY ĐẦY ĐỦ TOÀN BỘ CÁC PHÂN HỆ VÀ TÍNH NĂNG (getGroupedFeatures(false))
  const groupedSections = useMemo(() => getGroupedFeatures(false), [])

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  const handleExpandAll = () => {
    setCollapsedGroups({})
  }

  const handleCollapseAll = () => {
    const collapsed: Record<string, boolean> = {}
    groupedSections.forEach((sec) => {
      collapsed[sec.groupKey] = true
    })
    setCollapsedGroups(collapsed)
  }

  // Restore snapshot handler
  const handleRestoreVersion = (
    restoredPermissions: RolePermissionMatrixItem[],
    timestamp: string
  ) => {
    setPermissionsMap((prev) => {
      const next = { ...prev }
      restoredPermissions.forEach((p) => {
        next[p.featureKey] = {
          featureKey: p.featureKey,
          actions: { ...p.actions },
          scope: p.scope ?? '',
        }
      })
      return next
    })
    toast.success(`Đã khôi phục ma trận phân quyền về thời điểm ${timestamp}`)
  }

  // Toggle action in matrix
  const handleToggleAction = (
    featureKey: string,
    actionKey: keyof PermissionActionState,
    checked: boolean
  ) => {
    setPermissionsMap((prev) => {
      const current = prev[featureKey] || {
        featureKey,
        actions: { access: false, create: false, edit: false, delete: false, export: false, viewAll: false },
        scope: '',
      }

      const updatedActions = { ...current.actions, [actionKey]: checked }

      if (checked && actionKey !== 'access') {
        updatedActions.access = true
      }
      if (!checked && actionKey === 'access') {
        updatedActions.create = false
        updatedActions.edit = false
        updatedActions.delete = false
        updatedActions.export = false
        updatedActions.viewAll = false
      }

      let updatedScope = current.scope
      if (checked) {
        const featItem = SYSTEM_PERMISSION_FEATURES.find((f) => f.featureKey === featureKey)
        if (featItem && !updatedScope) {
          updatedScope = featItem.defaultScope || (featItem.allowedScopes?.length === 1 ? featItem.allowedScopes[0] : 'personal')
        }
      }

      const next = {
        ...prev,
        [featureKey]: {
          ...current,
          actions: updatedActions,
          scope: updatedScope,
        },
      }

      return next
    })
  }

  const handleScopeChange = (featureKey: string, newScope: DataScope) => {
    setPermissionsMap((prev) => {
      const current = prev[featureKey]
      if (!current) return prev
      return {
        ...prev,
        [featureKey]: {
          ...current,
          scope: newScope,
        },
      }
    })
  }

  const handleToggleAllColumn = (actionKey: keyof PermissionActionState, checked: boolean) => {
    const visibleFeatures = groupedSections.flatMap((s) => s.features)

    setPermissionsMap((prev) => {
      const next = { ...prev }
      visibleFeatures.forEach((feat) => {
        if (!feat.supportedActions[actionKey]) return

        const item = next[feat.featureKey] || {
          featureKey: feat.featureKey,
          actions: { access: false, create: false, edit: false, delete: false, export: false, viewAll: false },
          scope: feat.defaultScope || '',
        }

        const updated = { ...item.actions, [actionKey]: checked }
        let newScope = item.scope

        if (checked) {
          updated.access = true
          if (!newScope) {
            newScope = feat.defaultScope || (feat.allowedScopes?.length === 1 ? feat.allowedScopes[0] : 'personal')
          }
        }
        if (!checked && actionKey === 'access') {
          updated.create = false
          updated.edit = false
          updated.delete = false
          updated.export = false
          updated.viewAll = false
        }

        next[feat.featureKey] = {
          ...item,
          actions: updated,
          scope: newScope,
        }
      })
      return next
    })
  }

  // Submit Handler
  const handleSubmit = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Vui lòng nhập tên nhóm quyền'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const permissionList = Object.values(permissionsMap)

    onSave({
      id: role?.id,
      name: name.trim(),
      topicId,
      code: role?.code || 'ROLE_' + Date.now(),
      description: description.trim(),
      permissions: permissionList,
      userCount: assignedEmployees.length,
    })
  }

  if (!role && !isCreating) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={<Shield className="h-10 w-10 text-muted-foreground/30" />}
          title="Chưa chọn nhóm quyền"
          description="Vui lòng chọn một nhóm quyền từ danh sách bên trái để xem và thiết lập ma trận."
        />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-background overflow-hidden">
      {/* 1. Header Workspace tinh giản (Xóa mã quyền, bỏ droplist icon Topic, giảm đường line) */}
      <div className="px-6 pt-4 pb-3 border-b border-border/40 space-y-3 shrink-0">
        {/* Hàng 1: Tiêu đề + Nút thao tác */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <h1 className="text-base font-bold text-foreground tracking-tight">
              {isCreating ? 'Tạo nhóm quyền mới' : name || 'Chưa đặt tên'}
            </h1>

            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-muted text-muted-foreground">
              {currentTopic?.name || 'Chưa phân loại'}
            </span>

            {!isCreating && (
              <span className="text-xs text-muted-foreground">
                • {assignedEmployees.length} nhân sự
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Hủy
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              className="h-8 text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isCreating ? 'Tạo nhóm quyền' : 'Lưu thay đổi'}</span>
            </Button>

            {!isCreating && role && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs w-36">
                  <DropdownMenuItem onClick={() => onDuplicateRole(role)} className="gap-2 cursor-pointer">
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    Nhân bản
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Xóa quyền
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Hàng 2: Các trường thông tin trực tiếp (Xóa mã quyền, Topic tĩnh không có droplist icon) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <FieldLabel label="Tên nhóm quyền" required>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
              placeholder="VD: [Tự học] Telesale..."
              className="h-8 text-xs bg-muted/20 border-border/40"
            />
            {errors.name && <span className="text-xs text-destructive mt-0.5 block">{errors.name}</span>}
          </FieldLabel>

          {/* Topic không sửa được ở panel phải: hiển thị dạng tĩnh, không có droplist icon */}
          <FieldLabel label="Topic trực thuộc">
            <div className="h-8 px-3 flex items-center rounded-md bg-muted/30 border border-border/40 text-xs font-medium text-foreground select-none">
              {currentTopic?.name || 'Chưa phân loại'}
            </div>
          </FieldLabel>

          <FieldLabel label="Mô tả nhóm quyền">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ghi chú nhiệm vụ chính của nhóm quyền..."
              className="h-8 text-xs bg-muted/20 border-border/40"
            />
          </FieldLabel>
        </div>
      </div>

      {/* 2. Main Tabs Navigation: Đưa Thêm nhân sự lên cùng dòng tab bên phải */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="px-6 border-b border-border/40 flex items-center justify-between shrink-0">
          <TabsList className="h-10 bg-transparent p-0 gap-6">
            <TabsTrigger
              value="matrix"
              className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-semibold px-1 gap-1.5 cursor-pointer shadow-none"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Ma trận quyền</span>
            </TabsTrigger>

            <TabsTrigger
              value="users"
              className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-semibold px-1 gap-1.5 cursor-pointer shadow-none"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Nhân sự được gán</span>
              <span className="px-1.5 py-0.2 rounded-full text-xs font-bold bg-muted text-muted-foreground">
                {assignedEmployees.length}
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="history"
              className="h-10 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary text-xs font-semibold px-1 gap-1.5 cursor-pointer shadow-none"
            >
              <History className="h-3.5 w-3.5" />
              <span>Nhật ký cập nhật</span>
            </TabsTrigger>
          </TabsList>

          {/* CẠNH PHẢI CÙNG DÒNG TAB: Các nút hành động tương ứng */}
          {activeTab === 'matrix' && (
            <div className="flex items-center gap-1.5 py-1">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleExpandAll}
                className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Mở tất cả
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleCollapseAll}
                className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Thu gọn tất cả
              </Button>
            </div>
          )}

          {/* ĐƯA THÊM NHÂN SỰ LÊN CÙNG DÒNG TAB LUÔN, CẠNH PHẢI */}
          {activeTab === 'users' && (
            <Button
              type="button"
              size="xs"
              onClick={() => setIsAddUserDialogOpen(true)}
              className="h-7 px-2.5 text-xs font-medium gap-1.5 shadow-xs"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Thêm nhân sự</span>
            </Button>
          )}
        </div>

        {/* Tab 1: Ma trận quyền (Đầy đủ tất cả các Phân hệ của hệ thống) */}
        <TabsContent value="matrix" className="flex-1 min-h-0 overflow-y-auto px-6 py-4 m-0">
          <PermissionStationMatrixTable
            groupedSections={groupedSections}
            permissionsMap={permissionsMap}
            collapsedGroups={collapsedGroups}
            onToggleCollapse={toggleGroupCollapse}
            onToggleAction={handleToggleAction}
            onScopeChange={handleScopeChange}
            onToggleAllColumn={handleToggleAllColumn}
          />
        </TabsContent>

        {/* Tab 2: Nhân sự được gán (Đã bỏ cột cơ sở, bỏ search, bỏ thống kê, đường line nhẹ nhàng) */}
        <TabsContent value="users" className="flex-1 min-h-0 px-6 py-4 m-0 overflow-hidden">
          <PermissionRoleAssignedUsersTab
            role={role}
            assignedEmployees={assignedEmployees}
            isAddDialogOpen={isAddUserDialogOpen}
            setIsAddDialogOpen={setIsAddUserDialogOpen}
            onAssignEmployee={(emp) => {
              setAssignedEmployees((prev) => [emp, ...prev])
            }}
            onRemoveEmployee={(empId) => {
              setAssignedEmployees((prev) => prev.filter((e) => e.id !== empId))
            }}
          />
        </TabsContent>

        {/* Tab 3: Nhật ký cập nhật */}
        <TabsContent value="history" className="flex-1 min-h-0 px-6 py-4 m-0 overflow-hidden">
          <PermissionRoleHistoryTab
            role={role}
            onRestoreVersion={handleRestoreVersion}
          />
        </TabsContent>
      </Tabs>

      {/* Confirm Dialog Xóa Nhóm quyền */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title={`Xác nhận xóa Nhóm quyền "${role?.name}"?`}
        description="Hành động này sẽ xóa vĩnh viễn nhóm quyền khỏi hệ thống. Các nhân sự được gán sẽ mất quyền hạn này. Bạn có chắc chắn muốn tiếp tục?"
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={() => {
          if (role) onDeleteRole(role)
          setDeleteConfirmOpen(false)
        }}
      />
    </div>
  )
}
