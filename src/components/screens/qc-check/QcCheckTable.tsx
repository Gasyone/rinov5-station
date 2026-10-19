'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QcPersonnelGroup } from './qcPersonnelTypes'
import { QcPersonnelRow } from './QcPersonnelRow'

export interface QcCheckTableProps {
  groups: QcPersonnelGroup[]
  selectedIds: Set<string>
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onViewIncidentDetail: (incidentId: string) => void
  onCreateIncidentForPersonnel?: (group: QcPersonnelGroup) => void
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  // Backwards compatibility props
  incidents?: unknown[]
  onRowClick?: (id: string) => void
  events?: unknown[]
}

export function QcCheckTable({
  groups = [],
  selectedIds,
  onToggleAll,
  onToggleOne,
  onViewIncidentDetail,
  onCreateIncidentForPersonnel,
  className,
  pagination,
  onRowClick,
}: QcCheckTableProps) {
  const handleViewDetail = onViewIncidentDetail || onRowClick || (() => {})
  const allSelected = groups.length > 0 && groups.every((grp) => selectedIds.has(grp.id))

  if (groups.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-7 w-7 text-muted-foreground" />}
        title="Không tìm thấy nhân sự hoặc sự cố"
        description="Điều chỉnh tìm kiếm hoặc bộ lọc để hiển thị danh sách nhân sự và thẻ vi phạm."
        className="py-10 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <div className={cn('flex flex-col h-full min-h-0', className)}>
      <DataTableFrame className="flex-1 min-h-0">
        <table className="w-full min-w-[1180px] table-fixed text-left border-separate border-spacing-0">
          <colgroup>
            <col className="w-8" />
            <col className="w-[210px]" />
            <col className="w-[170px]" />
            <col className="w-[145px]" />
            <col className="w-[280px]" />
            <col className="w-[260px]" />
            <col className="w-[145px]" />
          </colgroup>
          <thead className="sticky top-0 z-40 bg-muted">
            <tr className="bg-muted hover:bg-muted [&>th]:h-9 [&>th]:py-1.5 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80 [&>th]:whitespace-nowrap">
              {/* Checkbox: Sticky left-0 */}
              <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted border-b border-border/80">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onToggleAll}
                  aria-label="Chọn tất cả nhân sự"
                />
              </th>
              {/* Nhân sự: Sticky left-8 */}
              <th className="sticky top-0 left-8 z-50 w-[210px] min-w-[195px] px-2.5 bg-muted text-left border-b border-border/80">
                Nhân sự / Đối tượng
              </th>
              {/* Vị trí / Bối cảnh */}
              <th className="sticky top-0 z-40 bg-muted w-[170px] min-w-[150px] px-2.5 text-left border-b border-border/80">
                Vị trí / Bối cảnh
              </th>
              {/* Thống kê lỗi */}
              <th className="sticky top-0 z-40 bg-muted w-[145px] min-w-[135px] px-2.5 text-left border-b border-border/80">
                Thống kê lỗi (30 ngày)
              </th>
              {/* Thẻ vi phạm */}
              <th className="sticky top-0 z-40 bg-muted w-[280px] min-w-[240px] px-2.5 text-left border-b border-border/80">
                Thẻ vi phạm (QC Tags)
              </th>
              {/* Xử lý gần nhất */}
              <th className="sticky top-0 z-40 bg-muted w-[260px] min-w-[220px] px-2.5 text-left border-b border-border/80">
                Xử lý gần nhất
              </th>
              {/* Trạng thái */}
              <th className="sticky top-0 z-40 bg-muted w-[145px] min-w-[135px] px-2.5 text-left border-b border-border/80">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, index) => (
              <QcPersonnelRow
                key={group.id}
                group={group}
                isSelected={selectedIds.has(group.id)}
                onSelectChange={onToggleOne}
                rowIndex={index}
                onViewIncidentDetail={handleViewDetail}
                onCreateIncidentForPersonnel={onCreateIncidentForPersonnel}
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
