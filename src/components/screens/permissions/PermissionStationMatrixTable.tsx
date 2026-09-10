'use client'

import { Fragment } from 'react'
import { ChevronDown, ChevronRight, User } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { STATION_MODULE_GROUP_DESCRIPTIONS } from '@/mocks/permissions'
import { getScopeContextualDescription, type GroupedFeatureSection } from './permissionsHelpers'
import {
  STATION_ACTION_COLUMNS,
  DATA_SCOPE_OPTIONS,
  type RolePermissionMatrixItem,
  type DataScope,
  type PermissionActionState,
} from './permissionsTypes'

interface PermissionStationMatrixTableProps {
  groupedSections: GroupedFeatureSection[]
  permissionsMap: Record<string, RolePermissionMatrixItem>
  collapsedGroups: Record<string, boolean>
  onToggleCollapse: (groupKey: string) => void
  onToggleAction: (featureKey: string, actionKey: keyof PermissionActionState, checked: boolean) => void
  onScopeChange: (featureKey: string, newScope: DataScope) => void
  onToggleAllColumn: (actionKey: keyof PermissionActionState, checked: boolean) => void
}

export function PermissionStationMatrixTable({
  groupedSections,
  permissionsMap,
  collapsedGroups,
  onToggleCollapse,
  onToggleAction,
  onScopeChange,
  onToggleAllColumn,
}: PermissionStationMatrixTableProps) {
  // Kiểm tra trạng thái đã chọn tất cả của từng cột hành động
  const getColumnCheckState = (actionKey: keyof PermissionActionState) => {
    const allFeatures = groupedSections.flatMap((s) => s.features)
    const supportedFeatures = allFeatures.filter((f) => !!f.supportedActions[actionKey])
    if (supportedFeatures.length === 0) return false
    const checkedCount = supportedFeatures.filter(
      (f) => !!permissionsMap[f.featureKey]?.actions[actionKey]
    ).length
    return checkedCount === supportedFeatures.length
  }

  return (
    <div className="overflow-x-auto w-full rounded-lg border border-border/40 bg-card">
      <table className="w-full table-fixed text-xs text-left border-collapse min-w-[860px]">
        <colgroup>
          <col className="w-[30%]" />
          <col className="w-[8.5%]" />
          <col className="w-[8.5%]" />
          <col className="w-[8%]" />
          <col className="w-[8%]" />
          <col className="w-[8%]" />
          <col className="w-[9%]" />
          <col className="w-[20%]" />
        </colgroup>

        {/* Master Header cố định ở đầu bảng Station */}
        <thead>
          <tr className="border-b border-border/40 bg-muted/40 text-foreground font-semibold">
            <th className="py-3 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Phân hệ / Màn hình tác nghiệp
            </th>
            {STATION_ACTION_COLUMNS.map((col) => {
              const isChecked = getColumnCheckState(col.key)
              return (
                <th key={col.key} className="py-2.5 px-2 text-center">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="font-bold text-xs text-foreground">{col.label}</span>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={(val) => onToggleAllColumn(col.key, val === true)}
                      aria-label={`Chọn tất cả cột ${col.label}`}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                  </div>
                </th>
              )
            })}
            <th className="py-3 px-4 font-bold text-xs text-foreground uppercase tracking-wider">
              Phạm vi Dữ liệu
            </th>
          </tr>
        </thead>

        {/* Thân bảng */}
        <tbody>
          {groupedSections.map((section) => {
            const isCollapsed = !!collapsedGroups[section.groupKey]

            return (
              <Fragment key={section.groupKey}>
                {/* Dòng tiêu đề Phân hệ */}
                <tr className="sticky top-0 z-10 border-t border-b border-border/40 bg-muted/70 backdrop-blur-xs select-none">
                  <td
                    colSpan={STATION_ACTION_COLUMNS.length + 2}
                    onClick={() => onToggleCollapse(section.groupKey)}
                    className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-foreground cursor-pointer hover:bg-muted/90 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{section.groupName}</span>
                          <span className="px-1.5 py-0.5 rounded text-xs font-semibold normal-case bg-background/90 border border-border/50 text-muted-foreground shrink-0">
                            {section.features.length} tính năng
                          </span>
                        </div>
                        {STATION_MODULE_GROUP_DESCRIPTIONS[section.groupKey] && (
                          <span className="text-xs font-normal normal-case tracking-normal text-muted-foreground line-clamp-1 mt-0.5">
                            {STATION_MODULE_GROUP_DESCRIPTIONS[section.groupKey]}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Các tính năng trong phân hệ */}
                {!isCollapsed &&
                  section.features.map((feat) => {
                    const isPersonalOnly =
                      feat.allowedScopes?.length === 1 && feat.allowedScopes[0] === 'personal'
                    const item = permissionsMap[feat.featureKey] || {
                      featureKey: feat.featureKey,
                      actions: {
                        access: false,
                        create: false,
                        edit: false,
                        delete: false,
                        export: false,
                        viewAll: false,
                      },
                      scope: isPersonalOnly ? 'personal' : (feat.defaultScope || ''),
                    }

                    const isAccessGranted = !!item.actions.access

                    return (
                      <tr
                        key={feat.featureKey}
                        className={cn(
                          'border-b border-border/20 hover:bg-muted/30 transition-colors',
                          feat.hasChildren && 'bg-muted/20 font-semibold',
                          feat.level === 2 && 'bg-background/50'
                        )}
                      >
                        {/* Cột 1: Tên màn hình / Quyền */}
                        <td className="py-2.5 px-4">
                          {feat.hasChildren ? (
                            <div className="flex items-start gap-2">
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-foreground">
                                    • {feat.featureName}
                                  </span>
                                  <span className="px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary font-semibold">
                                    Nhóm quyền
                                  </span>
                                </div>
                                {feat.description && (
                                  <span className="text-xs text-muted-foreground leading-snug mt-0.5">
                                    {feat.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : feat.level === 2 ? (
                            <div className="flex items-start gap-2 pl-4">
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium text-foreground">
                                  └─ {feat.featureName}
                                </span>
                                {feat.description && (
                                  <span className="text-xs text-muted-foreground leading-snug mt-0.5">
                                    {feat.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-2">
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium text-foreground">
                                  • {feat.featureName}
                                </span>
                                {feat.description && (
                                  <span className="text-xs text-muted-foreground leading-snug mt-0.5">
                                    {feat.description}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Các cột hành động: Truy cập, Xem tất cả, Thêm, Sửa, Xóa, Xuất file */}
                        {STATION_ACTION_COLUMNS.map((col) => {
                          const isSupported = !!feat.supportedActions[col.key]
                          const isChecked = !!item.actions[col.key]

                          return (
                            <td key={col.key} className="py-2.5 px-2 text-center">
                              {isSupported ? (
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(val) =>
                                    onToggleAction(feat.featureKey, col.key, val === true)
                                  }
                                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                              ) : (
                                <span className="text-muted-foreground/30 font-bold select-none">-</span>
                              )}
                            </td>
                          )
                        })}

                        {/* Cột 8: Phạm vi Dữ liệu */}
                        <td className="py-2.5 px-4">
                          {isPersonalOnly ? (
                            <div
                              title="Phạm vi dữ liệu cố định: Bản thân"
                              className={cn(
                                'h-8 px-2 flex items-center gap-1.5 text-xs font-semibold max-w-[190px] select-none',
                                !isAccessGranted ? 'text-muted-foreground/40' : 'text-primary'
                              )}
                            >
                              <User className="h-3.5 w-3.5 shrink-0" />
                              <span>Bản thân</span>
                            </div>
                          ) : feat.hasChildren ? (
                            <div className="h-8 px-2 flex items-center text-xs text-muted-foreground italic">
                              (Theo màn hình con)
                            </div>
                          ) : (
                            <Select
                              value={item.scope || '__empty__'}
                              disabled={!isAccessGranted}
                              onValueChange={(val: string) =>
                                onScopeChange(
                                  feat.featureKey,
                                  val === '__empty__' ? '' : (val as DataScope)
                                )
                              }
                            >
                              <SelectTrigger
                                className={cn(
                                  'h-8 text-xs font-medium w-full max-w-[190px] border border-input bg-background/50 hover:bg-muted/50 px-2.5 cursor-pointer',
                                  !isAccessGranted && 'opacity-40 cursor-not-allowed hover:bg-transparent border-transparent',
                                  !item.scope && 'text-muted-foreground italic'
                                )}
                              >
                                <SelectValue placeholder="-- Chọn phạm vi --" />
                              </SelectTrigger>
                              <SelectContent className="min-w-[240px] p-1.5 shadow-md">
                                {DATA_SCOPE_OPTIONS.map((opt) => {
                                  const contextualDesc = getScopeContextualDescription(
                                    feat.moduleGroupKey,
                                    feat.featureKey,
                                    opt.value
                                  )
                                  return (
                                    <SelectItem
                                      key={opt.value || '__empty__'}
                                      value={opt.value || '__empty__'}
                                      className="py-2 px-3 text-xs cursor-pointer rounded-md my-0.5 hover:bg-muted focus:bg-muted"
                                    >
                                      <div className="flex flex-col text-left">
                                        <span className={cn('font-semibold', opt.value === '' && 'text-muted-foreground italic font-normal')}>
                                          {opt.label}
                                        </span>
                                        {opt.value !== '' && contextualDesc && (
                                          <span className="text-xs text-muted-foreground line-clamp-1 font-normal">
                                            {contextualDesc}
                                          </span>
                                        )}
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          )}
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
  )
}
