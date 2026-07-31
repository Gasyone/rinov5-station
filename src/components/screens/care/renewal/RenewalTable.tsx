'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { DataTablePagination } from '@/components/data-table'
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
    <div className={cn("rounded-lg border border-border bg-card overflow-hidden flex flex-col min-h-0", className)}>
      <div className="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table className="w-full min-w-max text-xs text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-zinc-50 dark:bg-zinc-900 border-b border-border">
            <tr className="border-b border-border bg-muted/40 dark:bg-muted/10 text-muted-foreground font-semibold">
              <th className="py-2.5 px-3 w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(val) => onSelectAll(val === true)}
                  aria-label="Chọn tất cả"
                />
              </th>
              <th className="py-2.5 px-3 min-w-[320px]">Học viên</th>
              <th className="py-2.5 px-3 min-w-[170px]">Liên hệ</th>
              <th className="py-2.5 px-3 min-w-[160px]">Phụ trách</th>
              <th className="py-2.5 px-3 min-w-[200px]">Lớp học</th>
              <th className="py-2.5 px-3 min-w-[180px]">Gói sản phẩm</th>
              <th className="py-2.5 px-3 text-left min-w-[150px]">Thống kê học tập</th>
              {viewMode === 'total' ? (
                <th className="py-2.5 px-3 text-left min-w-[200px]">Lịch sử chăm sóc</th>
              ) : (
                <th className="py-2.5 px-3 min-w-[260px] text-left">Nội dung tái phí gần nhất</th>
              )}
              <th className="py-2.5 px-3 min-w-[140px]">Phân loại tái phí</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((cls) => (
              <RenewalAlertRow
                key={cls.id}
                cls={cls}
                isSelected={selectedIds.includes(cls.id)}
                onSelectChange={onSelectChange}
                viewMode={viewMode}
                onOpenCallModal={onOpenCallModal}
                onRefresh={onRefresh}
                onViewDetail={onViewDetail}
              />
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <DataTablePagination
          page={pagination.page}
          total={pagination.total}
          pageSize={pagination.pageSize}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          className="border-t border-border shrink-0"
        />
      )}
    </div>
  )
}

