'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, Users, History } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldLabel } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getAssignedEmployeesForRole, getGroupedFeatures } from './permissionsHelpers'
import { PermissionRoleAssignedUsersModal } from './PermissionRoleAssignedUsersModal'
import { PermissionRoleHistoryModal } from './PermissionRoleHistoryModal'
import { PermissionStationMatrixTable } from './PermissionStationMatrixTable'
import { PermissionLegacyMatrixTable } from './PermissionLegacyMatrixTable'
import {
  SYSTEM_PERMISSION_FEATURES,
  STATION_PERMISSION_FEATURES,
} from '@/mocks/permissions'
import type {
  PermissionTopic,
  PermissionRole,
  RolePermissionMatrixItem,
  DataScope,
  PermissionActionState,
} from './permissionsTypes'

interface PermissionRoleEditFormProps {
  role?: PermissionRole | null
  defaultTopicId?: string
  topics: PermissionTopic[]
  onSave: (roleData: {
    id?: string
    name: string
    topicId: string
    code: string
    description: string
    permissions: RolePermissionMatrixItem[]
  }) => void
  onCancel: () => void
}

export function PermissionRoleEditForm({
  role,
  defaultTopicId,
  topics,
  onSave,
  onCancel,
}: PermissionRoleEditFormProps) {
  const [name, setName] = useState(role?.name || '')
  const [topicId] = useState(role?.topicId || defaultTopicId || topics[0]?.id || '')
  const [description, setDescription] = useState(role?.description || '')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'all' | 'station'>('all')
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const [isAssignedUsersModalOpen, setIsAssignedUsersModalOpen] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)

  const [assignedCount, setAssignedCount] = useState(() => {
    return getAssignedEmployeesForRole(role).length
  })

  const currentTopic = useMemo(
    () => topics.find((t) => t.id === topicId) || topics[0],
    [topics, topicId]
  )

  const stationFeaturesCount = STATION_PERMISSION_FEATURES.length
  const totalFeaturesCount = SYSTEM_PERMISSION_FEATURES.length

  // Grouped sections based on active tab ('station': 35 items Station, 'all': 73 items CRM)
  const groupedSections = useMemo(
    () => getGroupedFeatures(activeTab === 'station'),
    [activeTab]
  )

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
    toast.success(`Đã khôi phục ma trận quyền về thời điểm ${timestamp}`)
  }

  const [permissionsMap, setPermissionsMap] = useState<Record<string, RolePermissionMatrixItem>>(() => {
    const map: Record<string, RolePermissionMatrixItem> = {}

    // 1. Fill with existing permissions if editing
    if (role && role.permissions) {
      role.permissions.forEach((p) => {
        map[p.featureKey] = {
          featureKey: p.featureKey,
          actions: { ...p.actions },
          scope: p.scope ?? '',
        }
      })
    }

    // 2. Ensure all system features and station features exist in map
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

  // Đếm số lượng quyền Station đang kích hoạt
  const activeStationCount = useMemo(() => {
    return STATION_PERMISSION_FEATURES.filter((f) => permissionsMap[f.featureKey]?.actions.access).length
  }, [permissionsMap])

  // Action toggle handlers
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

      // If create, edit, delete, export or viewAll is enabled -> auto-enable access
      if (checked && actionKey !== 'access') {
        updatedActions.access = true
      }

      // If access is disabled -> auto-disable all sub-actions
      if (!checked && actionKey === 'access') {
        updatedActions.create = false
        updatedActions.edit = false
        updatedActions.delete = false
        updatedActions.export = false
        updatedActions.viewAll = false
      }

      let updatedScope = current.scope
      // Auto-Scope khi bật quyền Truy cập ở Station
      if (checked) {
        const featItem = STATION_PERMISSION_FEATURES.find((f) => f.featureKey === featureKey)
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

      // Xử lý logic phân cấp Cha - Con khi ở tab Phân hệ Station
      if (activeTab === 'station') {
        const featItem = STATION_PERMISSION_FEATURES.find((f) => f.featureKey === featureKey)

        // 1. Khi bật/tắt nhóm cha work_registration -> Đồng bộ trạng thái xuống tất cả màn con
        if (featItem?.hasChildren) {
          STATION_PERMISSION_FEATURES.filter((f) => f.parentKey === featureKey).forEach((child) => {
            const childItem = next[child.featureKey] || {
              featureKey: child.featureKey,
              actions: { access: false, create: false, edit: false, delete: false, export: false, viewAll: false },
              scope: child.defaultScope || '',
            }

            if (!checked && actionKey === 'access') {
              // Tắt cha -> tắt toàn bộ con
              next[child.featureKey] = {
                ...childItem,
                actions: { access: false, create: false, edit: false, delete: false, export: false, viewAll: false },
              }
            } else if (checked && child.supportedActions[actionKey]) {
              // Bật hành động ở cha -> bật hành động tương ứng ở con
              next[child.featureKey] = {
                ...childItem,
                actions: {
                  ...childItem.actions,
                  [actionKey]: true,
                  access: true,
                },
              }
            }
          })
        }

        // 2. Khi bật bất kỳ quyền nào của màn hình con -> Tự động bật quyền truy cập (access) cho màn hình cha
        if (featItem?.parentKey && checked) {
          const pKey = featItem.parentKey
          const parentItem = next[pKey] || {
            featureKey: pKey,
            actions: { access: false, create: false, edit: false, delete: false, export: false, viewAll: false },
            scope: '',
          }
          next[pKey] = {
            ...parentItem,
            actions: {
              ...parentItem.actions,
              access: true,
            },
          }
        }
      }

      return next
    })
  }

  // Scope change handler
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

  // Column master toggle
  const handleToggleAllColumn = (actionKey: keyof PermissionActionState, checked: boolean) => {
    const visibleFeatures = groupedSections.flatMap((s) => s.features)

    setPermissionsMap((prev) => {
      const next = { ...prev }
      visibleFeatures.forEach((feat) => {
        // Chỉ áp dụng cho tính năng có hỗ trợ hành động này
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
          if (!newScope && activeTab === 'station') {
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
    if (!name.trim()) errs.name = 'Vui lòng nhập tên Nhóm quyền'

    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const permissionList = Object.values(permissionsMap)

    onSave({
      id: role?.id,
      name: name.trim(),
      topicId,
      code: role?.code || 'ROLE_' + name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '_'),
      description: description.trim(),
      permissions: permissionList,
    })
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto w-full bg-background">
      <div className="flex flex-col gap-6 p-6 w-full pb-20">
        {/* Section 1 Header: Thông tin quyền + Back button + Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/80">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center h-8 w-8 -ml-1 rounded-md hover:bg-muted text-foreground cursor-pointer transition-colors"
              title="Quay lại danh sách quyền"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-base font-bold text-foreground">Thông tin quyền</h2>
            {role?.code && (
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-muted text-muted-foreground">
                {role.code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handleSubmit}
              className="h-8 px-4 text-xs font-bold shadow-xs bg-[#e11d48] hover:bg-[#be123c] text-white tracking-wide uppercase cursor-pointer"
            >
              {role ? 'CẬP NHẬT CHỈNH SỬA' : 'TẠO MỚI NHÓM QUYỀN'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="h-8 px-4 text-xs font-bold bg-zinc-400 hover:bg-zinc-500 text-white tracking-wide uppercase cursor-pointer"
            >
              HỦY BỎ
            </Button>
          </div>
        </div>

        {/* Section 1 Form Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldLabel label="Tên quyền" required>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                }}
                placeholder="VD: [Tự học] Telesale..."
                className="h-9 text-xs"
              />
              {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name}</span>}
            </FieldLabel>

            <FieldLabel label="Topic / Nhóm phân loại">
              <div className="h-9 px-3 flex items-center rounded-md border border-input bg-muted/40 text-xs font-semibold text-foreground select-none">
                {currentTopic?.name || 'Chưa phân loại'}
              </div>
            </FieldLabel>
          </div>

          <FieldLabel label="Mô tả quyền">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả quyền..."
              rows={2}
              className="text-xs resize-none"
            />
          </FieldLabel>
        </div>

        {/* Section 2: Danh sách quyền */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">Danh sách quyền</h2>
              <span className="text-xs text-muted-foreground">
                ({activeStationCount}/{stationFeaturesCount} tính năng Station đang cấp quyền)
              </span>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'station' | 'all')}
            className="w-full"
          >
            {/* Tab navigation headers: Tất cả trước, Phân hệ Station sau */}
            <div className="flex items-center justify-between border-b border-border/80 pb-0">
              <TabsList variant="line" className="shrink-0 justify-start p-0 gap-6 h-10 bg-transparent border-0">
                <TabsTrigger
                  value="all"
                  className="px-2 pb-2.5 pt-1 font-bold text-xs flex items-center gap-2 data-[state=active]:text-[#e11d48] cursor-pointer"
                >
                  <span>Tất cả</span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 text-[10.5px] font-bold rounded-md transition-colors',
                      activeTab === 'all'
                        ? 'bg-[#e11d48]/10 text-[#e11d48]'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {totalFeaturesCount} tính năng
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="station"
                  className="px-2 pb-2.5 pt-1 font-bold text-xs flex items-center gap-2 data-[state=active]:text-[#e11d48] cursor-pointer"
                >
                  <span>Phân hệ Station</span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 text-[10.5px] font-bold rounded-md transition-colors',
                      activeTab === 'station'
                        ? 'bg-[#e11d48]/10 text-[#e11d48]'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {stationFeaturesCount} tính năng
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Toolbar đóng/mở cùng hàng tab phía bên phải */}
              <div className="flex items-center gap-1.5 pb-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAssignedUsersModalOpen(true)}
                  className="h-7 px-2.5 text-[11px] font-semibold gap-1.5 cursor-pointer text-foreground hover:text-primary hover:bg-muted/80 border-border/80"
                  title="Xem danh sách nhân sự được phân quyền nhóm này"
                >
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>Nhân sự được gán</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/10 text-primary font-bold">
                    {assignedCount}
                  </span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="h-7 px-2.5 text-[11px] font-semibold gap-1.5 cursor-pointer text-foreground hover:text-primary hover:bg-muted/80 border-border/80"
                  title="Xem log cập nhật hành vi và khôi phục ma trận quyền"
                >
                  <History className="h-3.5 w-3.5 text-primary" />
                  <span>Log cập nhật</span>
                </Button>

                {activeTab === 'station' && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleExpandAll}
                      className="h-7 px-2.5 text-[11px] font-medium cursor-pointer"
                    >
                      Mở tất cả
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCollapseAll}
                      className="h-7 px-2.5 text-[11px] font-medium cursor-pointer"
                    >
                      Thu gọn tất cả
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Matrix Table: Chọn bảng Station hoặc Legacy */}
            {activeTab === 'station' ? (
              <PermissionStationMatrixTable
                groupedSections={groupedSections}
                permissionsMap={permissionsMap}
                collapsedGroups={collapsedGroups}
                onToggleCollapse={toggleGroupCollapse}
                onToggleAction={handleToggleAction}
                onScopeChange={handleScopeChange}
                onToggleAllColumn={handleToggleAllColumn}
              />
            ) : (
              <PermissionLegacyMatrixTable
                groupedSections={groupedSections}
                permissionsMap={permissionsMap}
                onToggleAction={handleToggleAction}
                onToggleAllColumn={handleToggleAllColumn}
              />
            )}
          </Tabs>
        </div>

        {/* Modal danh sách nhân sự được phân quyền */}
        <PermissionRoleAssignedUsersModal
          open={isAssignedUsersModalOpen}
          onOpenChange={setIsAssignedUsersModalOpen}
          role={role}
          topicName={currentTopic?.name}
          onCountChange={setAssignedCount}
        />

        {/* Modal nhật ký phiên bản & khôi phục */}
        <PermissionRoleHistoryModal
          open={isHistoryModalOpen}
          onOpenChange={setIsHistoryModalOpen}
          role={role}
          topicName={currentTopic?.name}
          onRestoreVersion={handleRestoreVersion}
        />
      </div>
    </div>
  )
}
