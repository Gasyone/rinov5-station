'use client'

import { Eye, Pencil, Trash2, MoreHorizontal, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ActionItem {
  /** Stable id used as React key + DOM data attr. */
  id: string
  label: string
  icon?: LucideIcon
  onClick: () => void
  /** Render as red destructive entry in the overflow menu. */
  destructive?: boolean
  disabled?: boolean
}

interface DataTableActionsProps {
  /** Primary inline action — almost always "View". */
  onView?: () => void
  /** Secondary inline action — typically "Edit". */
  onEdit?: () => void
  /** Destructive action shown as the last entry in the overflow menu. */
  onDelete?: () => void
  /** Additional menu entries (audit log, duplicate, lock, …). */
  extra?: ActionItem[]
  /** Optional aria-label for the overflow menu trigger. */
  menuLabel?: string
  className?: string
}

/**
 * Standard row-action group for list tables.
 *
 * Layout: [👁] [✏️] [⋯ More]   (any handler is optional — only renders the ones provided)
 *
 * Destructive actions land inside the overflow menu so a single click
 * cannot delete by accident (pair with `<ConfirmDialog />` per DS §4.4 F4).
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern, §6.2 Button
 */
export function DataTableActions({
  onView,
  onEdit,
  onDelete,
  extra,
  menuLabel = 'More actions',
  className,
}: DataTableActionsProps) {
  const hasOverflow = Boolean(onDelete) || (extra && extra.length > 0)

  return (
    <div className={cn('flex items-center justify-end gap-0.5', className)}>
      {onView ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="View details"
          title="View details"
          onClick={(event) => {
            event.stopPropagation()
            onView()
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ) : null}
      {onEdit ? (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Edit"
          title="Edit"
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : null}
      {hasOverflow ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
            <Button variant="ghost" size="icon-sm" aria-label={menuLabel} title={menuLabel}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            onClick={(event) => event.stopPropagation()}
          >
            {extra?.map((item) => {
              const Icon = item.icon
              return (
                <DropdownMenuItem
                  key={item.id}
                  variant={item.destructive ? 'destructive' : 'default'}
                  disabled={item.disabled}
                  onSelect={item.onClick}
                  className="gap-2"
                >
                  {Icon ? <Icon className="h-4 w-4" /> : null}
                  {item.label}
                </DropdownMenuItem>
              )
            })}
            {onDelete && extra?.length ? <DropdownMenuSeparator /> : null}
            {onDelete ? (
              <DropdownMenuItem
                variant="destructive"
                onSelect={onDelete}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </div>
  )
}
