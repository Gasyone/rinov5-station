'use client'

import { Fragment } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  PERMISSION_ACTION_COLUMNS,
  type RolePermissionMatrixItem,
  type PermissionActionState,
} from './permissionsTypes'
import type { GroupedFeatureSection } from './permissionsHelpers'

interface PermissionLegacyMatrixTableProps {
  groupedSections: GroupedFeatureSection[]
  permissionsMap: Record<string, RolePermissionMatrixItem>
  onToggleAction: (featureKey: string, actionKey: keyof PermissionActionState, checked: boolean) => void
  onToggleAllColumn: (actionKey: keyof PermissionActionState, checked: boolean) => void
}

export function PermissionLegacyMatrixTable({
  groupedSections,
  permissionsMap,
  onToggleAction,
  onToggleAllColumn,
}: PermissionLegacyMatrixTableProps) {
  return (
    <div className="overflow-x-auto w-full mt-2 rounded-md border border-border/80 bg-card shadow-2xs">
      <table className="w-full table-fixed text-xs text-left border-collapse min-w-[780px]">
        <colgroup>
          <col className="w-[45%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
        </colgroup>

        {/* Table Header nguyên bản của CRM */}
        <thead>
          <tr className="border-b border-border/80 text-foreground font-semibold bg-muted/40">
            <th className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">
              Phân hệ / Tính năng
            </th>
            {PERMISSION_ACTION_COLUMNS.map((col) => (
              <th key={col.key} className="py-2.5 px-2 text-center">
                <div className="flex flex-col items-center gap-1.5">
                  <span className="font-semibold text-xs text-foreground">{col.label}</span>
                  <Checkbox
                    onCheckedChange={(val) => onToggleAllColumn(col.key, val === true)}
                    aria-label={`Chọn tất cả ${col.label}`}
                    className="data-[state=checked]:bg-[#e11d48] data-[state=checked]:border-[#e11d48]"
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {groupedSections.map((section) => (
            <Fragment key={section.groupKey}>
              {/* Dòng phân hệ xám phẳng CRM */}
              <tr className="border-t border-b border-border/70 bg-[#f0f0f0] dark:bg-zinc-800/70 select-none">
                <td
                  colSpan={PERMISSION_ACTION_COLUMNS.length + 1}
                  className="py-2.5 px-4 font-bold text-xs uppercase tracking-wider text-foreground"
                >
                  {section.groupName}
                </td>
              </tr>

              {/* Các tính năng */}
              {section.features.map((feat) => {
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
                  scope: '',
                }

                return (
                  <tr
                    key={feat.featureKey}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    <td className="py-2.5 px-4">
                      <span className="font-medium text-foreground text-xs">
                        |--- {feat.featureName}
                      </span>
                    </td>

                    {PERMISSION_ACTION_COLUMNS.map((col) => {
                      const isSupported = !!feat.supportedActions[col.key]

                      return (
                        <td key={col.key} className="py-2.5 px-2 text-center">
                          {isSupported ? (
                            <Checkbox
                              checked={item.actions[col.key]}
                              onCheckedChange={(val) =>
                                onToggleAction(feat.featureKey, col.key, val === true)
                              }
                              className="data-[state=checked]:bg-[#e11d48] data-[state=checked]:border-[#e11d48]"
                            />
                          ) : (
                            <span className="text-muted-foreground/30 font-bold select-none">-</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
