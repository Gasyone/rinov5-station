'use client'

import { CalendarDays } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { cn } from '@/lib/utils'
import type { ClassRecord } from '@/mocks/classRecords'
import { ClassesTableRow } from './ClassesTableRow'

interface ClassesTableProps {
  classes: ClassRecord[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (classId: string) => void
  onView: (classId: string) => void
  onEdit: (classId: string) => void
  onDelete: (classId: string) => void
  onManageRoadmap?: (classId: string) => void
  onAddStudent?: (classId: string) => void
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    selectedCount?: number
    onClearSelection?: () => void
  }
}

export function ClassesTable({
  classes,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onView,
  onEdit,
  onDelete,
  onManageRoadmap,
  onAddStudent,
  className,
  pagination,
}: ClassesTableProps) {
  const pageIds = classes.map((c) => c.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  if (classes.length === 0) {
    return (
      <EmptyState
        icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
        title="Không có lớp học phù hợp."
        description="Điều chỉnh tìm kiếm, trường, trạng thái hoặc bộ lọc."
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
            selectedCount={pagination.selectedCount}
            onClearSelection={pagination.onClearSelection}
          />
        ) : null
      }
    >
      <table className="w-full min-w-[1100px] text-xs text-left border-separate border-spacing-0">
        <thead className="sticky top-0 z-40 bg-muted">
          <tr className="bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80">
            {/* Checkbox: sticky top-0 left-0 z-50 */}
            <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted">
              <Checkbox
                checked={isPageSelected}
                onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
                className="h-3.5 w-3.5 translate-y-[1px]"
                aria-label="Chọn tất cả lớp học"
              />
            </th>
            {/* Lớp học: sticky top-0 left-8 z-50 */}
            <th className="sticky top-0 left-8 z-50 w-[240px] min-w-[240px] max-w-[240px] px-2.5 bg-muted text-left border-none">
              Lớp học
            </th>
            {/* Môn học */}
            <th className="sticky top-0 z-40 bg-muted min-w-[130px] max-w-[145px] px-2.5 text-left">
              Môn học
            </th>
            {/* Giáo viên */}
            <th className="sticky top-0 z-40 bg-muted min-w-[135px] max-w-[150px] px-2.5 text-left">
              Giáo viên
            </th>
            {/* Sĩ số */}
            <th className="sticky top-0 z-40 bg-muted min-w-[90px] max-w-[105px] px-2.5 text-left">
              Sĩ số
            </th>
            {/* Lịch học */}
            <th className="sticky top-0 z-40 bg-muted min-w-[130px] max-w-[145px] px-2.5 text-left">
              Lịch học
            </th>
            {/* Trạng thái */}
            <th className="sticky top-0 z-40 bg-muted w-28 min-w-28 max-w-32 px-2.5 text-left">
              Trạng thái
            </th>
            {/* CC & BTVN */}
            <th className="sticky top-0 z-40 bg-muted min-w-[85px] max-w-[100px] px-2.5 text-left">
              CC & BTVN
            </th>
            {/* Kiểm tra */}
            <th className="sticky top-0 z-40 bg-muted w-16 min-w-16 text-center px-2">
              Kiểm tra
            </th>
            {/* CSĐB */}
            <th className="sticky top-0 z-40 bg-muted w-16 min-w-16 text-center px-2">
              CSĐB
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls, index) => (
            <ClassesTableRow
              key={cls.id}
              cls={cls}
              index={index}
              isSelected={selectedIds.has(cls.id)}
              onToggle={onToggleOne}
              onRowClick={onRowClick}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onManageRoadmap={onManageRoadmap}
              onAddStudent={onAddStudent}
            />
          ))}
        </tbody>
      </table>
    </DataTableFrame>
  )
}
