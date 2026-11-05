'use client'

import { CalendarDays, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { cn } from '@/lib/utils'
import type { TrialClass } from '@/mocks/trialClasses'
import type { TrialSortField, SortDirection } from './trialClassTypes'
import { TrialClassTableRow } from './TrialClassTableRow'

const COLUMN_DEFS: Array<{ label: string; className: string; sortKey?: TrialSortField }> = [
  {
    label: 'Học viên',
    className: 'sticky top-0 left-8 z-50 w-[230px] min-w-[210px] xl:w-[240px] 2xl:w-[260px] px-2.5 bg-muted text-left border-none',
    sortKey: 'studentName',
  },
  {
    label: 'Liên hệ',
    className: 'sticky top-0 z-40 bg-muted w-[150px] min-w-[140px] xl:w-[165px] 2xl:w-[180px] px-2.5 text-left',
  },
  {
    label: 'Nhu cầu đăng ký',
    className: 'sticky top-0 z-40 bg-muted w-[230px] min-w-[210px] xl:w-[250px] 2xl:w-[270px] px-2.5 text-left',
    sortKey: 'program',
  },
  {
    label: 'Lớp ghép & Buổi học',
    className: 'sticky top-0 z-40 bg-muted w-[200px] min-w-[180px] xl:w-[220px] 2xl:w-[240px] px-2.5 text-left',
    sortKey: 'trialDate',
  },
  {
    label: 'Nhận xét / Thao tác',
    className: 'sticky top-0 z-40 bg-muted w-[150px] min-w-[135px] xl:w-[160px] 2xl:w-[175px] px-2.5 text-left',
  },
  {
    label: 'Trạng thái',
    className: 'sticky top-0 z-40 bg-muted w-[125px] min-w-[115px] xl:w-[130px] 2xl:w-[140px] px-2.5 text-left',
    sortKey: 'status',
  },
  {
    label: 'Người phụ trách',
    className: 'sticky top-0 z-40 bg-muted w-[150px] min-w-[140px] xl:w-[165px] 2xl:w-[180px] px-2.5 text-left',
  },
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
  onOpenAssign?: (id: string) => void
  onOpenAssignReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onChangeBranch?: (trialId: string, newBranch: string) => void
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  onClearSelection?: () => void
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
  onOpenAssign,
  onOpenAssignReschedule,
  onApprove,
  onReject,
  onChangeBranch,
  className,
  pagination,
  onClearSelection,
}: TrialClassTableProps) {
  const pageIds = trials.map((t) => t.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  if (trials.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
        title="Không tìm thấy dữ liệu"
        description="Điều chỉnh tìm kiếm hoặc bộ lọc để hiển thị kết quả."
        className="py-10 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      <DataTableFrame className="flex-1 min-h-0">
        <table className="w-full min-w-max text-xs text-left border-separate border-spacing-0">
          <thead className="sticky top-0 z-40 bg-muted">
            <tr className="bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80 [&>th]:whitespace-nowrap">
              <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted">
                <Checkbox
                  checked={isPageSelected}
                  onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
                  aria-label="Chọn tất cả"
                />
              </th>
              {COLUMN_DEFS.map((col) => {
                if (!col.sortKey || !onSort) {
                  return (
                    <th key={col.label} className={col.className}>
                      {col.label}
                    </th>
                  )
                }

                const isActive = sortField === col.sortKey
                return (
                  <th key={col.label} className={col.className}>
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
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {trials.map((trial, index) => (
              <TrialClassTableRow
                key={trial.id}
                trial={trial}
                index={index}
                isSelected={selectedIds.has(trial.id)}
                copiedKey={copiedKey}
                onToggle={onToggleOne}
                onRowClick={onRowClick}
                onCopy={onCopy}
                onOpenAssign={onOpenAssign}
                onOpenAssignReschedule={onOpenAssignReschedule}
                onApprove={onApprove}
                onReject={onReject}
                onChangeBranch={onChangeBranch}
              />
            ))}
          </tbody>
        </table>
      </DataTableFrame>

      {pagination ? (
        <div className="shrink-0 pt-1 pb-0">
          <DataTablePagination
            page={pagination.page}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            selectedCount={selectedIds.size}
            onClearSelection={onClearSelection || (() => onToggleAll(false, pageIds))}
            size="sm"
            className="!bg-transparent border-0 border-none shadow-none px-0 py-0"
          />
        </div>
      ) : null}
    </div>
  )
}
