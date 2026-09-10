'use client'

import React, { useState, useMemo } from 'react'
import {
  Building2,
  Layers,
  MapPin,
  Store,
  Briefcase,
  Users,
  Network,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Search,
  Check,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  mockOrgUnits,
  getOrgTree,
  type OrgTreeNode,
  type OrgUnit,
} from '@/mocks/orgStructure'

export interface OrgUnitTreeSelectProps {
  value?: string
  onChange: (unitId: string, unitName: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

const ORG_TYPE_CONFIG: Record<
  string,
  { label: string; badgeClass: string; icon: React.ComponentType<{ className?: string }> }
> = {
  board: {
    label: 'Ban Giám đốc',
    badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    icon: Building2,
  },
  block: {
    label: 'Khối',
    badgeClass: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    icon: Layers,
  },
  region: {
    label: 'Vùng',
    badgeClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    icon: MapPin,
  },
  branch: {
    label: 'Chi nhánh',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    icon: Store,
  },
  department: {
    label: 'Phòng ban',
    badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    icon: Briefcase,
  },
  team: {
    label: 'Tổ / Nhóm',
    badgeClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
    icon: Users,
  },
}

function getAncestors(unitId: string, allUnits: OrgUnit[]): string[] {
  const ancestors: string[] = []
  let currentId: string | null = unitId
  while (currentId) {
    const unit = allUnits.find((u) => u.id === currentId)
    if (unit?.parentId) {
      ancestors.push(unit.parentId)
      currentId = unit.parentId
    } else {
      currentId = null
    }
  }
  return ancestors
}

function filterTree(nodes: OrgTreeNode[], query: string): OrgTreeNode[] {
  if (!query.trim()) return nodes
  const q = query.trim().toLowerCase()

  const result: OrgTreeNode[] = []
  for (const node of nodes) {
    const isSelfMatch =
      node.name.toLowerCase().includes(q) ||
      node.code.toLowerCase().includes(q) ||
      node.typeLabel.toLowerCase().includes(q)

    const filteredChildren = filterTree(node.children || [], query)
    const hasMatchingChildren = filteredChildren.length > 0

    if (isSelfMatch || hasMatchingChildren) {
      result.push({
        ...node,
        children: filteredChildren,
      })
    }
  }
  return result
}

function collectMatchingAncestorIds(nodes: OrgTreeNode[], query: string): Set<string> {
  const ids = new Set<string>()
  if (!query.trim()) return ids
  const q = query.trim().toLowerCase()

  function traverse(node: OrgTreeNode): boolean {
    const isSelfMatch =
      node.name.toLowerCase().includes(q) ||
      node.code.toLowerCase().includes(q)
    let childMatched = false
    if (node.children) {
      for (const child of node.children) {
        if (traverse(child)) {
          childMatched = true
        }
      }
    }
    if (isSelfMatch || childMatched) {
      ids.add(node.id)
      return true
    }
    return false
  }

  for (const root of nodes) {
    traverse(root)
  }
  return ids
}

interface OrgTreeNodeRowProps {
  node: OrgTreeNode
  level: number
  selectedId: string
  expandedIds: Set<string>
  onToggleExpand: (id: string, e: React.MouseEvent) => void
  onSelect: (node: OrgTreeNode) => void
}

function OrgTreeNodeRow({
  node,
  level,
  selectedId,
  expandedIds,
  onToggleExpand,
  onSelect,
}: OrgTreeNodeRowProps) {
  const isSelected = selectedId === node.id
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedIds.has(node.id)

  const config = ORG_TYPE_CONFIG[node.type] || {
    label: node.typeLabel || 'Đơn vị',
    badgeClass: 'bg-muted text-muted-foreground border-border',
    icon: Network,
  }
  const Icon = config.icon

  return (
    <div className="flex flex-col">
      <div
        onClick={() => onSelect(node)}
        className={cn(
          'flex items-center gap-1.5 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-xs select-none group',
          isSelected
            ? 'bg-primary/10 text-primary font-medium hover:bg-primary/15'
            : 'hover:bg-accent/60 text-foreground'
        )}
        style={{ paddingLeft: `${level * 16 + 6}px` }}
      >
        {/* Toggle chevron */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => onToggleExpand(node.id, e)}
            className="p-0.5 rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground shrink-0 transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-4.5 shrink-0" />
        )}

        {/* Node Icon */}
        <Icon
          className={cn(
            'h-3.5 w-3.5 shrink-0',
            isSelected ? 'text-primary' : 'text-muted-foreground'
          )}
        />

        {/* Node Name */}
        <span className="truncate flex-1 min-w-0" title={`${node.name} (${node.code})`}>
          {node.name}
        </span>

        {/* Unit Code */}
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          ({node.code})
        </span>

        {/* Unit Type Badge */}
        <span
          className={cn(
            'text-[9.5px] px-1.5 py-0.5 rounded-sm border font-normal shrink-0',
            config.badgeClass
          )}
        >
          {config.label}
        </span>

        {/* Selection Indicator */}
        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1" />}
      </div>

      {/* Render children recursively */}
      {hasChildren && isExpanded && (
        <div className="relative flex flex-col">
          {node.children.map((child) => (
            <OrgTreeNodeRow
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const OrgUnitTreeSelect: React.FC<OrgUnitTreeSelectProps> = ({
  value = '',
  onChange,
  error,
  placeholder = 'Chọn khối / phòng ban từ sơ đồ tổ chức...',
  disabled = false,
  className,
}) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const fullTree = useMemo(() => getOrgTree(), [])

  // Find currently selected unit
  const selectedUnit = useMemo(() => {
    return mockOrgUnits.find((u) => u.id === value) || null
  }, [value])

  // Initial expanded state: roots of the organization tree
  const [manualExpandedIds, setManualExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>()
    fullTree.forEach((root) => {
      ids.add(root.id)
      if (root.children) {
        root.children.forEach((c) => ids.add(c.id))
      }
    })
    return ids
  })

  // Ancestors of selected unit are derived purely via useMemo (zero setState during render)
  const selectedAncestors = useMemo(() => {
    return value ? getAncestors(value, mockOrgUnits) : []
  }, [value])

  // Filtered tree for search
  const displayedTree = useMemo(() => {
    return filterTree(fullTree, searchQuery)
  }, [fullTree, searchQuery])

  // Derive expanded IDs during search
  const searchExpandedIds = useMemo(() => {
    if (!searchQuery.trim()) return null
    return collectMatchingAncestorIds(fullTree, searchQuery)
  }, [fullTree, searchQuery])

  // Effective expanded IDs: union of manual, selected ancestors, and search matches
  const effectiveExpandedIds = useMemo(() => {
    const ids = new Set<string>(manualExpandedIds)
    selectedAncestors.forEach((id) => ids.add(id))
    if (searchExpandedIds) {
      searchExpandedIds.forEach((id) => ids.add(id))
    }
    return ids
  }, [manualExpandedIds, selectedAncestors, searchExpandedIds])

  const handleToggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setManualExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleExpandAll = () => {
    setManualExpandedIds(new Set(mockOrgUnits.map((u) => u.id)))
  }

  const handleCollapseAll = () => {
    setManualExpandedIds(new Set())
  }

  const handleSelect = (node: OrgTreeNode) => {
    onChange(node.id, node.name)
    setOpen(false)
    setSearchQuery('')
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground shadow-2xs transition-colors hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-left cursor-pointer',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
        >
          {selectedUnit ? (
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <Network className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate font-medium text-foreground">
                {selectedUnit.name}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                ({selectedUnit.code})
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground truncate">{placeholder}</span>
          )}

          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-1" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-[440px] max-w-[95vw] p-2 z-[60] bg-popover text-popover-foreground border rounded-lg shadow-xl space-y-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search header */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm phòng ban, khối, chi nhánh..."
            className="h-8 pl-8 pr-7 text-xs bg-background"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-2 p-0.5 text-muted-foreground hover:text-foreground rounded cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Tree Toolbar: summary count & expand/collapse controls */}
        <div className="flex items-center justify-between px-1 text-[11px] text-muted-foreground">
          <span>
            {searchQuery
              ? `Kết quả tìm kiếm (${displayedTree.length} nhánh)`
              : `Sơ đồ tổ chức (${mockOrgUnits.length} đơn vị)`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExpandAll}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Mở rộng hết
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleCollapseAll}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Thu gọn
            </button>
          </div>
        </div>

        {/* Scrollable Treeview */}
        <div className="max-h-[290px] overflow-y-auto space-y-0.5 pr-1 border-t border-border/60 pt-1.5">
          {displayedTree.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Không tìm thấy đơn vị tổ chức phù hợp.
            </div>
          ) : (
            displayedTree.map((rootNode) => (
              <OrgTreeNodeRow
                key={rootNode.id}
                node={rootNode}
                level={0}
                selectedId={value}
                expandedIds={effectiveExpandedIds}
                onToggleExpand={handleToggleExpand}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
