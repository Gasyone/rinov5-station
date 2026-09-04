'use client'

import { useState, useMemo, Fragment } from 'react'
import { ChevronRight, ChevronDown, ArrowLeft, Check, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldLabel } from '@/components/shared'
import { cn } from '@/lib/utils'
import { getGroupedFeatures } from './permissionsHelpers'
import { SYSTEM_PERMISSION_FEATURES } from '@/mocks/permissions'
import {
  DATA_SCOPE_OPTIONS,
  type PermissionTopic,
  type PermissionRole,
  type RolePermissionMatrixItem,
  type DataScope,
  type PermissionActionState,
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
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const [onlyStation, setOnlyStation] = useState(true)

  const currentTopic = useMemo(
    () => topics.find((t) => t.id === topicId) || topics[0],
    [topics, topicId]
  )

  const stationFeaturesCount = useMemo(
    () => SYSTEM_PERMISSION_FEATURES.filter((f) => f.isStation).length,
    []
  )
  const totalFeaturesCount = SYSTEM_PERMISSION_FEATURES.length

  // Initialize permissions matrix map with filter
  const groupedSections = useMemo(() => getGroupedFeatures(onlyStation), [onlyStation])

  const [permissionsMap, setPermissionsMap] = useState<Record<string, RolePermissionMatrixItem>>(() => {
    const map: Record<string, RolePermissionMatrixItem> = {}

    // Fill with existing permissions if editing
    if (role && role.permissions) {
      role.permissions.forEach((p) => {
        map[p.featureKey] = {
          featureKey: p.featureKey,
          actions: { ...p.actions },
          scope: p.scope ?? '',
        }
      })
    }

    // Ensure all system features exist in map
    groupedSections.forEach((section) => {
      section.features.forEach((feat) => {
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
            scope: '',
          }
        }
      })
    })

    return map
  })

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

      return {
        ...prev,
        [featureKey]: {
          ...current,
          actions: updatedActions,
        },
      }
    })
  }

  // Scope change handler (Hoàn toàn độc lập với Xem tất cả)
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

  // Column master toggle (Toggle all rows in column)
  const handleToggleAllColumn = (actionKey: keyof PermissionActionState, checked: boolean) => {
    setPermissionsMap((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((fKey) => {
        const item = next[fKey]
        const updated = { ...item.actions, [actionKey]: checked }
        if (checked && actionKey !== 'access') {
          updated.access = true
        }
        if (!checked && actionKey === 'access') {
          updated.create = false
          updated.edit = false
          updated.delete = false
          updated.export = false
          updated.viewAll = false
        }
        next[fKey] = { ...item, actions: updated }
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
    <div className="flex-1 min-h-0 overflow-y-auto w-full">
      <div className="flex flex-col gap-5 p-4 lg:p-6 max-w-7xl mx-auto w-full pb-16">
      {/* Top Breadcrumb & Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={onCancel}
            className="hover:text-foreground font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Danh sách quyền
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">
            {role ? 'Chỉnh sửa quyền' : 'Tạo nhóm quyền mới'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8 px-3 text-xs font-bold"
          >
            HỦY BỎ
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            className="h-8 px-4 text-xs font-bold shadow-xs bg-rose-600 hover:bg-rose-700 text-white"
          >
            {role ? 'CẬP NHẬT CHỈNH SỬA' : 'TẠO MỚI NHÓM QUYỀN'}
          </Button>
        </div>
      </div>

      {/* Section 1: Thông tin quyền */}
      <div className="rounded-xl border border-border bg-card p-4 lg:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border/60">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Thông tin quyền</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldLabel label="Tên quyền" required>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
              placeholder="VD: [Tự học] S-lead, [CSKH] Chuyên viên Chăm sóc..."
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
            placeholder="Mô tả trách nhiệm, phạm vi công việc và đối tượng nhân sự áp dụng nhóm quyền này..."
            rows={2}
            className="text-xs"
          />
        </FieldLabel>
      </div>

      {/* Station Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-2.5">
          <Checkbox
            id="filter-station"
            checked={onlyStation}
            onCheckedChange={(val) => setOnlyStation(val === true)}
          />
          <label
            htmlFor="filter-station"
            className="text-xs font-semibold cursor-pointer select-none text-foreground flex items-center gap-1.5"
          >
            <Shield className="h-3.5 w-3.5 text-primary" />
            Chỉ hiển thị tính năng thuộc Station ({stationFeaturesCount} / {totalFeaturesCount} tính năng)
          </label>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="text-[11.5px]">
            {onlyStation
              ? 'Đang lọc các phân hệ vận hành trực tiếp tại Station'
              : 'Đang hiển thị đầy đủ toàn bộ phân hệ CRM Core & Station'}
          </span>
        </div>
      </div>

      {/* Section 2: Danh sách quyền (Ma trận phân quyền) */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-border bg-muted/50 dark:bg-muted/30 text-muted-foreground font-semibold">
                <th className="py-2.5 px-4 min-w-[260px] text-foreground font-bold">
                  Phân hệ / Tính năng
                </th>
                <th className="py-2.5 px-3 text-center w-20">
                  <div className="flex flex-col items-center gap-1">
                    <span>Truy cập</span>
                    <Checkbox
                      onCheckedChange={(val) => handleToggleAllColumn('access', val === true)}
                      aria-label="Chọn tất cả Truy cập"
                    />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-20">
                  <div className="flex flex-col items-center gap-1">
                    <span>Thêm</span>
                    <Checkbox
                      onCheckedChange={(val) => handleToggleAllColumn('create', val === true)}
                      aria-label="Chọn tất cả Thêm"
                    />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-20">
                  <div className="flex flex-col items-center gap-1">
                    <span>Sửa</span>
                    <Checkbox
                      onCheckedChange={(val) => handleToggleAllColumn('edit', val === true)}
                      aria-label="Chọn tất cả Sửa"
                    />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-20">
                  <div className="flex flex-col items-center gap-1">
                    <span>Xóa</span>
                    <Checkbox
                      onCheckedChange={(val) => handleToggleAllColumn('delete', val === true)}
                      aria-label="Chọn tất cả Xóa"
                    />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-28">
                  <div className="flex flex-col items-center gap-1">
                    <span>Download/Upload</span>
                    <Checkbox
                      onCheckedChange={(val) => handleToggleAllColumn('export', val === true)}
                      aria-label="Chọn tất cả Download/Upload"
                    />
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center w-24">
                  <div className="flex flex-col items-center gap-1">
                    <span>Xem tất cả</span>
                    <Checkbox
                      onCheckedChange={(val) => handleToggleAllColumn('viewAll', val === true)}
                      aria-label="Chọn tất cả Xem tất cả"
                    />
                  </div>
                </th>
                <th className="py-2.5 px-4 text-left min-w-[210px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Phạm vi Dữ liệu (Station)</span>
                    <button
                      type="button"
                      onClick={() => {
                        const allCollapsed = groupedSections.every((s) => collapsedGroups[s.groupKey])
                        const next: Record<string, boolean> = {}
                        groupedSections.forEach((s) => {
                          next[s.groupKey] = !allCollapsed
                        })
                        setCollapsedGroups(next)
                      }}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer ml-2"
                    >
                      {groupedSections.every((s) => collapsedGroups[s.groupKey]) ? 'Mở tất cả' : 'Thu gọn'}
                    </button>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body Grouped by Modules */}
            <tbody>
              {groupedSections.map((section) => {
                const isCollapsed = Boolean(collapsedGroups[section.groupKey])

                return (
                  <Fragment key={section.groupKey}>
                    {/* Section Header Row (Accordion Toggle) */}
                    <tr
                      className="bg-muted/80 dark:bg-muted/50 border-t border-b border-border/80 cursor-pointer hover:bg-muted select-none transition-colors"
                      onClick={() =>
                        setCollapsedGroups((prev) => ({
                          ...prev,
                          [section.groupKey]: !prev[section.groupKey],
                        }))
                      }
                    >
                      <td colSpan={8} className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          {isCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-primary transition-transform" />
                          )}
                          <span className="font-extrabold text-xs uppercase tracking-wider text-foreground">
                            {section.groupName}
                          </span>
                          <span className="text-[10.5px] font-semibold text-muted-foreground bg-background px-1.5 py-0.2 rounded border border-border">
                            {section.features.length} tính năng
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Features in this Section */}
                    {!isCollapsed &&
                      section.features.map((feat) => {
                        const item = permissionsMap[feat.featureKey] || {
                          featureKey: feat.featureKey,
                          actions: { access: false, create: false, edit: false, delete: false, export: false, viewAll: false },
                          scope: '',
                        }

                        return (
                          <tr
                            key={feat.featureKey}
                            className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                          >
                            {/* Feature Name */}
                            <td className="py-2.5 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">
                                  |--- {feat.featureName}
                                </span>
                                {feat.isStation && (
                                  <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                                    Station
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Action 1: Truy cập */}
                            <td className="py-3 px-3 text-center">
                              {feat.supportedActions.access ? (
                                <Checkbox
                                  checked={item.actions.access}
                                  onCheckedChange={(val) =>
                                    handleToggleAction(feat.featureKey, 'access', val === true)
                                  }
                                />
                              ) : (
                                <span className="text-zinc-300 dark:text-zinc-700">-</span>
                              )}
                            </td>

                            {/* Action 2: Thêm */}
                            <td className="py-3 px-3 text-center">
                              {feat.supportedActions.create ? (
                                <Checkbox
                                  checked={item.actions.create}
                                  onCheckedChange={(val) =>
                                    handleToggleAction(feat.featureKey, 'create', val === true)
                                  }
                                />
                              ) : (
                                <span className="text-zinc-300 dark:text-zinc-700">-</span>
                              )}
                            </td>

                            {/* Action 3: Sửa */}
                            <td className="py-3 px-3 text-center">
                              {feat.supportedActions.edit ? (
                                <Checkbox
                                  checked={item.actions.edit}
                                  onCheckedChange={(val) =>
                                    handleToggleAction(feat.featureKey, 'edit', val === true)
                                  }
                                />
                              ) : (
                                <span className="text-zinc-300 dark:text-zinc-700">-</span>
                              )}
                            </td>

                            {/* Action 4: Xóa */}
                            <td className="py-3 px-3 text-center">
                              {feat.supportedActions.delete ? (
                                <Checkbox
                                  checked={item.actions.delete}
                                  onCheckedChange={(val) =>
                                    handleToggleAction(feat.featureKey, 'delete', val === true)
                                  }
                                />
                              ) : (
                                <span className="text-zinc-300 dark:text-zinc-700">-</span>
                              )}
                            </td>

                            {/* Action 5: Download/Upload */}
                            <td className="py-3 px-3 text-center">
                              {feat.supportedActions.export ? (
                                <Checkbox
                                  checked={item.actions.export}
                                  onCheckedChange={(val) =>
                                    handleToggleAction(feat.featureKey, 'export', val === true)
                                  }
                                />
                              ) : (
                                <span className="text-zinc-300 dark:text-zinc-700">-</span>
                              )}
                            </td>

                            {/* Action 6: Xem tất cả */}
                            <td className="py-3 px-3 text-center">
                              {feat.supportedActions.viewAll !== false ? (
                                <Checkbox
                                  checked={item.actions.viewAll}
                                  onCheckedChange={(val) =>
                                    handleToggleAction(feat.featureKey, 'viewAll', val === true)
                                  }
                                />
                              ) : (
                                <span className="text-zinc-300 dark:text-zinc-700">-</span>
                              )}
                            </td>

                            {/* Action 7: Cột Phạm vi Dữ liệu (Station) */}
                            <td className="py-3 px-4">
                              <Select
                                value={item.scope || '__empty__'}
                                disabled={!item.actions.access}
                                onValueChange={(val: string) =>
                                  handleScopeChange(
                                    feat.featureKey,
                                    val === '__empty__' ? '' : (val as DataScope)
                                  )
                                }
                              >
                                <SelectTrigger
                                  className={cn(
                                    'h-8 text-xs font-medium w-full max-w-[170px] border-0 bg-transparent shadow-none hover:bg-muted/50 px-2 cursor-pointer focus:ring-0 focus-visible:ring-0 focus:outline-none',
                                    !item.actions.access && 'opacity-40 cursor-not-allowed hover:bg-transparent',
                                    !item.scope && 'text-muted-foreground italic'
                                  )}
                                >
                                  <SelectValue placeholder="-- Chọn phạm vi --" />
                                </SelectTrigger>
                                <SelectContent className="min-w-[155px] p-1.5 shadow-md">
                                  {DATA_SCOPE_OPTIONS.map((opt) => (
                                    <SelectItem
                                      key={opt.value || '__empty__'}
                                      value={opt.value || '__empty__'}
                                      className="py-2.5 px-3 text-xs font-medium cursor-pointer rounded-md my-0.5 hover:bg-muted focus:bg-muted"
                                    >
                                      <span className={opt.value === '' ? 'text-muted-foreground italic' : ''}>
                                        {opt.label}
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        )
                      })}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  )
}
