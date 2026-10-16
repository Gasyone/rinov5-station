'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { Users } from 'lucide-react'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { cn } from '@/lib/utils'
import { AlertRow } from './AlertRow'

interface OperationsAlertTableProps {
  alerts: StudentCareAlert[]
  selectedIds: string[]
  onSelectChange: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
  }
  viewMode?: 'service' | 'academic' | 'total'
  onRefresh?: () => void
  onViewDetail?: (id: string) => void
  onOpenRoadmapModal?: (cls: StudentCareAlert) => void
}

export function OperationsAlertTable({
  alerts,
  selectedIds,
  onSelectChange,
  onSelectAll,
  className,
  pagination,
  viewMode = 'service',
  onRefresh,
  onViewDetail,
  onOpenRoadmapModal,
}: OperationsAlertTableProps) {
  const allSelected = alerts.length > 0 && alerts.every((item) => selectedIds.includes(item.id))

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-7 w-7 text-muted-foreground" />}
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
                  checked={allSelected}
                  onCheckedChange={(val) => onSelectAll(val === true)}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="sticky top-0 left-8 z-50 w-[210px] min-w-[195px] xl:w-[230px] 2xl:w-[260px] px-2.5 bg-muted text-left border-none">Học viên</th>
              <th className="sticky top-0 z-40 bg-muted w-[150px] min-w-[140px] xl:w-[165px] 2xl:w-[180px] px-2.5 text-left">Liên hệ</th>
              <th className="sticky top-0 z-40 bg-muted w-[165px] min-w-[150px] xl:w-[185px] 2xl:w-[205px] px-2.5 text-left">Người chăm sóc</th>
              <th className="sticky top-0 z-40 bg-muted w-[210px] min-w-[190px] xl:w-[235px] 2xl:w-[260px] px-2.5 text-left">Thẻ chăm sóc</th>
              <th className="sticky top-0 z-40 bg-muted w-[260px] min-w-[220px] max-w-[320px] xl:w-[290px] 2xl:w-[340px] px-2.5 text-left">Nội dung chăm sóc</th>
              <th className="sticky top-0 z-40 bg-muted w-[130px] min-w-[120px] xl:w-[140px] 2xl:w-[155px] px-2.5 text-left">Trạng thái</th>
              <th className="sticky top-0 z-40 bg-muted w-[195px] min-w-[185px] xl:w-[215px] 2xl:w-[235px] px-2.5 text-left">Lớp học</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((cls, index) => (
              <AlertRow
                key={cls.id}
                cls={cls}
                isSelected={selectedIds.includes(cls.id)}
                onSelectChange={onSelectChange}
                viewMode={viewMode}
                rowIndex={index}
                onRefresh={onRefresh}
                onViewDetail={onViewDetail}
                onOpenRoadmapModal={onOpenRoadmapModal}
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
            selectedCount={selectedIds.length}
            onClearSelection={() => onSelectAll(false)}
            size="sm"
            className="!bg-transparent border-0 border-none shadow-none px-0 py-0"
          />
        </div>
      ) : null}
    </div>
  )
}

