'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { ClipboardList, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QcIncident } from '@/mocks/qcChecks'
import type { QcSortMode } from './qcCheckHelpers'
import { QcIncidentRow } from './QcIncidentRow'

export interface QcCheckTableProps {
  incidents: QcIncident[]
  selectedIds: Set<string>
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onRowClick: (id: string) => void
  onQuickApprove?: (incidentId: string) => void
  onQuickRecheck?: (incidentId: string) => void
  sortMode?: QcSortMode
  onSortModeChange?: (mode: QcSortMode) => void
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  // Backwards compatibility props
  events?: unknown[]
}

export function QcCheckTable({
  incidents = [],
  selectedIds,
  onToggleAll,
  onToggleOne,
  onRowClick,
  sortMode = 'severity_deadline',
  onSortModeChange,
  className,
  pagination,
}: QcCheckTableProps) {
  const allSelected = incidents.length > 0 && incidents.every((inc) => selectedIds.has(inc.id))

  if (incidents.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardList className="h-7 w-7 text-muted-foreground" />}
        title="Không tìm thấy sự cố"
        description="Điều chỉnh tìm kiếm hoặc bộ lọc để hiển thị kết quả sự cố chất lượng."
        className="py-10 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      <DataTableFrame className="flex-1 min-h-0">
        <table className="w-full min-w-[1050px] table-fixed text-left border-separate border-spacing-0">
          <colgroup>
            <col className="w-8" />
            <col className="w-[210px]" />
            <col className="w-[55%]" />
            <col className="w-[45%]" />
            <col className="w-[140px]" />
            <col className="w-[110px]" />
          </colgroup>
          <thead className="sticky top-0 z-40 bg-muted">
            <tr className="bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80 [&>th]:whitespace-nowrap">
              <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted border-b border-border/80">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                  aria-label="Chọn tất cả sự cố"
                />
              </th>
              {/* Đối tượng: Sticky left-8 (Khóa cứng 210px để đồng bộ với dòng) */}
              <th className="sticky top-0 left-8 z-50 w-[210px] min-w-[210px] max-w-[210px] px-2.5 bg-muted text-left border-b border-border/80">
                Đối tượng
              </th>
              {/* Tiêu chí & Vi phạm: Sắp xếp theo mức độ vi phạm */}
              <th
                className={cn(
                  'sticky top-0 z-40 bg-muted px-2.5 text-left border-b border-border/80 transition-colors',
                  onSortModeChange && 'cursor-pointer hover:bg-muted/80 select-none'
                )}
                onClick={() => onSortModeChange?.(sortMode === 'severity_deadline' ? 'deadline_severity' : 'severity_deadline')}
                title="Bấm để chuyển đổi ưu tiên sắp xếp giữa Mức độ và Thời hạn"
              >
                <div className="flex items-center gap-1.5">
                  <span>Tiêu chí & Vi phạm</span>
                  {sortMode === 'severity_deadline' && (
                    <span
                      className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-medium leading-none"
                      title="Sắp xếp Cấp 1: Mức độ vi phạm (Nghiêm trọng -> Cao -> Trung bình -> Thấp)"
                    >
                      <ArrowDown className="h-3 w-3 shrink-0" />
                      <span>Cấp 1</span>
                    </span>
                  )}
                  {sortMode === 'deadline_severity' && (
                    <span
                      className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-muted-foreground/10 text-muted-foreground text-xs font-normal leading-none"
                      title="Sắp xếp Cấp 2: Mức độ vi phạm"
                    >
                      <span>Cấp 2</span>
                    </span>
                  )}
                </div>
              </th>
              <th className="sticky top-0 z-40 bg-muted px-2.5 text-left border-b border-border/80">
                Khắc phục & Minh chứng
              </th>
              {/* Thời gian: Sắp xếp theo thời hạn SLA */}
              <th
                className={cn(
                  'sticky top-0 z-40 bg-muted w-[140px] min-w-[140px] max-w-[140px] px-2.5 text-left border-b border-border/80 transition-colors',
                  onSortModeChange && 'cursor-pointer hover:bg-muted/80 select-none'
                )}
                onClick={() => onSortModeChange?.(sortMode === 'deadline_severity' ? 'severity_deadline' : 'deadline_severity')}
                title="Bấm để chuyển đổi ưu tiên sắp xếp giữa Thời hạn và Mức độ"
              >
                <div className="flex items-center gap-1.5">
                  <span>Thời gian</span>
                  {sortMode === 'severity_deadline' && (
                    <span
                      className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-normal leading-none"
                      title="Sắp xếp Cấp 2: Thời hạn (Gấp nhất / Hôm nay lên trước)"
                    >
                      <ArrowDown className="h-3 w-3 shrink-0" />
                      <span>Cấp 2</span>
                    </span>
                  )}
                  {sortMode === 'deadline_severity' && (
                    <span
                      className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-primary/10 text-primary text-xs font-medium leading-none"
                      title="Sắp xếp Cấp 1: Thời hạn (Gấp nhất / Hôm nay lên trước)"
                    >
                      <ArrowDown className="h-3 w-3 shrink-0" />
                      <span>Cấp 1</span>
                    </span>
                  )}
                </div>
              </th>
              <th className="sticky top-0 z-40 bg-muted w-[110px] min-w-[110px] max-w-[110px] px-2.5 text-left border-b border-border/80">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <QcIncidentRow
                key={incident.id}
                incident={incident}
                isSelected={selectedIds.has(incident.id)}
                onSelectChange={onToggleOne}
                rowIndex={index}
                onViewDetail={onRowClick}
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
            onClearSelection={onToggleAll}
            size="sm"
            className="!bg-transparent border-0 border-none shadow-none px-0 py-0"
          />
        </div>
      ) : null}
    </div>
  )
}
