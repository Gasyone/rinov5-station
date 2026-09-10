'use client'

import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Eye,
  MoreHorizontal,
  Plus,
  UserCheck,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableFrame } from '@/components/data-table'
import { StatusBadge, EmptyState } from '@/components/shared'
import {
  flattenOrgTree,
  type FlattenedOrgNode,
} from './orgStructureHelpers'
import {
  ORG_TYPE_BADGE_MAP,
  type OrgTreeNode,
  type OrgUnit,
} from './orgStructureTypes'

interface OrgStructureTableViewProps {
  tree: OrgTreeNode[]
  allUnits: OrgUnit[]
  expandedIds: Set<string>
  onToggleExpand: (nodeId: string) => void
  onViewDetail: (unit: OrgUnit) => void
  onAddChild: (parentUnit: OrgUnit) => void
  onTransferStaff: (unit: OrgUnit) => void
}

export function OrgStructureTableView({
  tree,
  allUnits,
  expandedIds,
  onToggleExpand,
  onViewDetail,
  onAddChild,
  onTransferStaff,
}: OrgStructureTableViewProps) {
  const flattened = flattenOrgTree(tree, expandedIds)

  if (flattened.length === 0) {
    return (
      <DataTableFrame>
        <EmptyState
          title="Không tìm thấy đơn vị tổ chức"
          description="Thử thay đổi từ khóa tìm kiếm hoặc lọc theo loại hình khác."
        />
      </DataTableFrame>
    )
  }

  const parentMap = new Map(allUnits.map((u) => [u.id, u.name]))

  return (
    <DataTableFrame>
      <table className="w-full text-left text-xs border-collapse">
        <thead className="border-b bg-muted/40 font-medium text-muted-foreground">
          <tr>
            <th className="py-2.5 px-4 font-semibold">Tên đơn vị & Mã</th>
            <th className="py-2.5 px-3 font-semibold">Loại hình</th>
            <th className="py-2.5 px-3 font-semibold">Trực thuộc</th>
            <th className="py-2.5 px-3 font-semibold text-center">Quy mô</th>
            <th className="py-2.5 px-4 font-semibold text-center">Trạng thái</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {flattened.map((node: FlattenedOrgNode) => {
            const isExpanded = expandedIds.has(node.id)
            const typeConfig = ORG_TYPE_BADGE_MAP[node.type] || {
              label: node.typeLabel,
              badgeVariant: 'bg-muted text-muted-foreground',
            }
            const parentName = node.parentId ? parentMap.get(node.parentId) || '—' : 'Gốc (BOD)'

            return (
              <tr
                key={node.id}
                className="transition-colors hover:bg-muted/30 cursor-pointer"
                onClick={() => onViewDetail(node)}
              >
                {/* Unit Name with indentation & Action icon on the right edge */}
                <td className="py-2 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className="flex items-center gap-1.5 min-w-0"
                      style={{ paddingLeft: `${node.level * 24}px` }}
                    >
                      {node.hasChildren ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleExpand(node.id)
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      ) : (
                        <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-border" />
                        </div>
                      )}

                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-semibold text-foreground hover:underline truncate">
                          {node.name}
                        </span>
                        <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-muted text-muted-foreground border">
                          {node.code}
                        </span>
                      </div>
                    </div>

                    {/* Quick action button inside Unit Name cell */}
                    <div
                      className="shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            title="Thao tác"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Thao tác</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 text-xs">
                          <DropdownMenuItem
                            onClick={() => onViewDetail(node)}
                            className="gap-2 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Xem chi tiết hồ sơ</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAddChild(node)}
                            className="gap-2 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Thêm đơn vị con</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onTransferStaff(node)}
                            className="gap-2 cursor-pointer text-primary focus:text-primary"
                          >
                            <UserCheck className="h-3.5 w-3.5" />
                            <span>Điều chuyển nhân sự</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </td>

                {/* Type badge */}
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${typeConfig.badgeVariant}`}
                  >
                    {typeConfig.label}
                  </span>
                </td>

                {/* Parent Unit */}
                <td className="py-2.5 px-3 text-muted-foreground truncate max-w-[160px]">
                  {parentName}
                </td>

                {/* Quy mô: Chức danh (trên) & Nhân sự (dưới) */}
                <td className="py-2.5 px-3 text-center">
                  <div className="inline-flex flex-col items-center gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/85">
                      <Briefcase className="h-3 w-3 text-primary/70" />
                      <span>{node.positions?.length || 1} chức danh</span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Users className="h-2.5 w-2.5 text-muted-foreground" />
                      <span>{node.memberCount} nhân sự</span>
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-2.5 px-4 text-center">
                  <StatusBadge status={node.status} label={node.statusLabel} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </DataTableFrame>
  )
}
