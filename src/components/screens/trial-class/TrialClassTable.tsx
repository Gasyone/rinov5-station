'use client'

import { CalendarDays, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/shared'
import type { TrialClass } from '@/mocks/trialClasses'
import type { TrialSortField, SortDirection } from './trialClassTypes'
import { TrialClassTableRow } from './TrialClassTableRow'

const COLUMN_DEFS: Array<{ label: string; className: string; sortKey?: TrialSortField }> = [
  {
    label: 'Học viên',
    className: 'sticky top-0 left-8 z-50 w-[240px] min-w-[240px] max-w-[240px] overflow-hidden bg-muted',
    sortKey: 'studentName',
  },
  { label: 'Liên hệ', className: 'min-w-40 sticky top-0 z-30 bg-muted' },
  { label: 'Lớp ghép & Buổi học', className: 'min-w-52 sticky top-0 z-30 bg-muted', sortKey: 'trialDate' },
  { label: 'Nhận xét / Thao tác', className: 'min-w-44 sticky top-0 z-30 bg-muted' },
  { label: 'Trạng thái', className: 'w-28 min-w-28 max-w-32 sticky top-0 z-30 bg-muted', sortKey: 'status' },
  { label: 'Người phụ trách', className: 'min-w-36 sticky top-0 z-30 bg-muted' },
]

interface TrialClassTableProps {
  trials: TrialClass[]
  selectedIds: Set<string>
  copiedKey: string
  sortField?: TrialSortField
  sortDirection?: SortDirection
  onSort?: (field: TrialSortField) => void
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
  onRequestReschedule?: (id: string) => void
  onOpenAssign?: (id: string) => void
  onOpenAssignReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassTable({
  trials,
  selectedIds,
  copiedKey,
  sortField,
  sortDirection,
  onSort,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onCopy,
  onRequestReschedule,
  onOpenAssign,
  onOpenAssignReschedule,
  onApprove,
  onReject,
}: TrialClassTableProps) {
  const pageIds = trials.map((t) => t.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table containerClassName="min-w-full overflow-visible align-top" className="min-w-[1200px]">
      <TableHeader className="sticky top-0 z-40 bg-muted border-b border-border/80 shadow-xs">
        <TableRow className="border-b-0 bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground">
          <TableHead className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 overflow-hidden bg-muted text-center px-1">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          {COLUMN_DEFS.map((col) => {
            if (!col.sortKey || !onSort) {
              return (
                <TableHead key={col.label} className={col.className}>
                  {col.label}
                </TableHead>
              )
            }

            const isActive = sortField === col.sortKey
            return (
              <TableHead key={col.label} className={col.className}>
                <button
                  type="button"
                  onClick={() => onSort(col.sortKey!)}
                  className="group inline-flex items-center gap-1 hover:text-foreground cursor-pointer select-none font-normal"
                  title={`Sắp xếp theo ${col.label.toLowerCase()}`}
                >
                  <span>{col.label}</span>
                  {isActive ? (
                    sortDirection === 'asc' ? (
                      <ArrowUp className="h-3 w-3 text-primary shrink-0" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-primary shrink-0" />
                    )
                  ) : (
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground/40 shrink-0 group-hover:text-foreground transition-colors" />
                  )}
                </button>
              </TableHead>
            )
          })}
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {trials.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={COLUMN_DEFS.length + 1} className="h-48 text-center">
              <EmptyState
                icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
                title="Không có booking học thử phù hợp."
                description="Điều chỉnh tìm kiếm, cơ sở hoặc bộ lọc."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          trials.map((trial, index) => (
            <TrialClassTableRow
              key={trial.id}
              trial={trial}
              index={index}
              isSelected={selectedIds.has(trial.id)}
              copiedKey={copiedKey}
              onToggle={onToggleOne}
              onRowClick={onRowClick}
              onCopy={onCopy}
              onRequestReschedule={onRequestReschedule}
              onOpenAssign={onOpenAssign}
              onOpenAssignReschedule={onOpenAssignReschedule}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
