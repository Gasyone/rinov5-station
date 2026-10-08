'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { RenewalAlertRow } from './RenewalAlertRow'

interface RenewalTableProps {
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
  onOpenCallModal?: (student: StudentCareAlert) => void
  onRefresh?: () => void
  onViewDetail?: (id: string) => void
}

export function RenewalTable({
  alerts,
  selectedIds,
  onSelectChange,
  onSelectAll,
  className,
  pagination,
  viewMode = 'service',
  onOpenCallModal,
  onRefresh,
  onViewDetail,
}: RenewalTableProps) {
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
    <DataTableFrame
      className={cn("flex flex-col min-h-0", className)}
      footer={
        pagination ? (
          <DataTablePagination
            page={pagination.page}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={pagination.onPageChange}
            onPageSizeChange={pagination.onPageSizeChange}
            selectedCount={selectedIds.length}
            onClearSelection={() => {
              alerts.forEach((a) => onSelectChange(a.id, false))
            }}
          />
        ) : null
      }
    >
      <table className="w-full min-w-max text-xs text-left border-separate border-spacing-0">
        <thead className="sticky top-0 z-40 bg-muted">
          <tr className="bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80">
            <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(val) => onSelectAll(val === true)}
                aria-label="Chọn tất cả"
              />
            </th>
            <th className="sticky top-0 left-8 z-50 min-w-[220px] px-2.5 bg-muted text-left border-none">Học viên</th>
            <th className="sticky top-0 z-40 bg-muted min-w-[125px] px-2.5 text-left">Liên hệ</th>
            <th className="sticky top-0 z-40 bg-muted min-w-[125px] px-2.5 text-left">Người chăm sóc</th>
            <th className="sticky top-0 z-40 bg-muted min-w-[220px] px-2.5 text-left">Nội dung chăm sóc</th>
            <th className="sticky top-0 z-40 bg-muted w-28 min-w-28 max-w-32 px-2.5 text-left">Trạng thái tái phí</th>
            <th className="sticky top-0 z-40 bg-muted min-w-[200px] px-2.5 text-left">Đơn hàng</th>
            <th className="sticky top-0 z-40 bg-muted min-w-[145px] px-2.5 text-left">Lớp học</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((cls, index) => (
            <RenewalAlertRow
              key={cls.id}
              cls={cls}
              isSelected={selectedIds.includes(cls.id)}
              onSelectChange={onSelectChange}
              viewMode={viewMode}
              rowIndex={index}
              onOpenCallModal={onOpenCallModal}
              onRefresh={onRefresh}
              onViewDetail={onViewDetail}
            />
          ))}
        </tbody>
      </table>
    </DataTableFrame>
  )
}

