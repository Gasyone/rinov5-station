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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/shared'
import { cn } from '@/lib/utils'
import {
  ORG_TYPE_BADGE_MAP,
  type OrgTreeNode,
  type OrgUnit,
} from './orgStructureTypes'

interface OrgStructureTreeViewProps {
  tree: OrgTreeNode[]
  expandedIds: Set<string>
  onToggleExpand: (nodeId: string) => void
  onViewDetail: (unit: OrgUnit) => void
  onAddChild: (parentUnit: OrgUnit) => void
  onTransferStaff: (unit: OrgUnit) => void
}

export function OrgStructureTreeView({
  tree,
  expandedIds,
  onToggleExpand,
  onViewDetail,
  onAddChild,
  onTransferStaff,
}: OrgStructureTreeViewProps) {
  if (tree.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed p-8 text-center text-xs text-muted-foreground">
        Không có dữ liệu đơn vị tổ chức phù hợp với bộ lọc.
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-card/50 p-4 sm:p-6 overflow-x-auto min-h-[500px]">
      <div className="space-y-4 min-w-[700px]">
        {tree.map((rootNode) => (
          <OrgTreeNodeItem
            key={rootNode.id}
            node={rootNode}
            level={0}
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
            onViewDetail={onViewDetail}
            onAddChild={onAddChild}
            onTransferStaff={onTransferStaff}
          />
        ))}
      </div>
    </div>
  )
}

interface OrgTreeNodeItemProps {
  node: OrgTreeNode
  level: number
  expandedIds: Set<string>
  onToggleExpand: (nodeId: string) => void
  onViewDetail: (unit: OrgUnit) => void
  onAddChild: (parentUnit: OrgUnit) => void
  onTransferStaff: (unit: OrgUnit) => void
}

function OrgTreeNodeItem({
  node,
  level,
  expandedIds,
  onToggleExpand,
  onViewDetail,
  onAddChild,
  onTransferStaff,
}: OrgTreeNodeItemProps) {
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = node.children && node.children.length > 0
  const typeConfig = ORG_TYPE_BADGE_MAP[node.type] || {
    label: node.typeLabel,
    badgeVariant: 'bg-muted text-muted-foreground',
  }

  const leaderInitial = node.leaderName
    ? node.leaderName.split(' ').pop()?.charAt(0) || 'U'
    : 'U'

  return (
    <div className="flex flex-col space-y-2">
      {/* Node Card */}
      <div
        className={cn(
          'group relative flex items-center justify-between gap-4 rounded-xl border bg-card p-3 shadow-xs transition-all hover:border-primary/50 hover:shadow-md',
          level > 0 && 'ml-6 sm:ml-8 before:absolute before:-left-4 before:top-1/2 before:h-px before:w-4 before:bg-border'
        )}
      >
        {/* Left: Expand icon + Info */}
        <div className="flex items-center gap-3 min-w-0">
          {hasChildren ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => onToggleExpand(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="sr-only">Thu phóng</span>
            </Button>
          ) : (
            <div className="h-7 w-7 shrink-0 flex items-center justify-center">
              <div className="h-1.5 w-1.5 rounded-full bg-border" />
            </div>
          )}

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-bold text-sm text-foreground hover:underline cursor-pointer truncate"
                onClick={() => onViewDetail(node)}
              >
                {node.name}
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border">
                {node.code}
              </span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-semibold',
                  typeConfig.badgeVariant
                )}
              >
                {typeConfig.label}
              </span>
            </div>

            {/* Leader info & stats */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Avatar className="h-5 w-5 border">
                  {node.leaderAvatar ? (
                    <AvatarImage src={node.leaderAvatar} alt={node.leaderName} />
                  ) : null}
                  <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-bold">
                    {leaderInitial}
                  </AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium">{node.leaderName}</span>
                <span className="text-[11px] text-muted-foreground">({node.leaderTitle})</span>
              </div>

              <span className="text-border">|</span>

              <div className="flex items-center gap-1 text-[11px]">
                <Users className="h-3 w-3 text-primary" />
                <span className="font-semibold text-foreground">{node.memberCount}</span> nhân sự
              </div>
            </div>

            {/* Job Titles / Chức danh thuộc đơn vị */}
            {node.positions && node.positions.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground shrink-0">
                  <Briefcase className="h-3 w-3 text-primary/70" />
                  <span>Chức danh:</span>
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {node.positions.map((title) => (
                    <span
                      key={title}
                      className="inline-flex items-center rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80 border border-border/60"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={node.status} label={node.statusLabel} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Thao tác</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem
                onClick={() => onViewDetail(node)}
                className="gap-2 cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Xem hồ sơ & nhân sự</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onAddChild(node)}
                className="gap-2 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Thêm đơn vị trực thuộc</span>
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

      {/* Children list */}
      {hasChildren && isExpanded ? (
        <div className="relative flex flex-col space-y-2 before:absolute before:bottom-3 before:left-3 before:top-0 before:w-px before:bg-border/60">
          {node.children.map((childNode) => (
            <OrgTreeNodeItem
              key={childNode.id}
              node={childNode}
              level={level + 1}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onViewDetail={onViewDetail}
              onAddChild={onAddChild}
              onTransferStaff={onTransferStaff}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
