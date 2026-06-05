'use client'

import { CalendarDays } from 'lucide-react'
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
}

const COLUMN_DEFS: Array<{ label: string; className: string }> = [
  { label: 'Lớp học', className: 'sticky left-10 z-20 w-[420px] min-w-[420px] max-w-[420px] bg-muted' },
  { label: 'Loại', className: 'min-w-36' },
  { label: 'Chương trình', className: 'min-w-48' },
  { label: 'Khung chương trình', className: 'min-w-56' },
  { label: 'Trình độ', className: 'min-w-40' },
  { label: 'Giáo viên', className: 'min-w-48' },
  { label: 'Sĩ số', className: 'min-w-32' },
  { label: 'Lịch học', className: 'min-w-64' },
  { label: 'Buổi học tiếp theo', className: 'min-w-52' },
  { label: 'Trường', className: 'min-w-48' },
  { label: 'Trạng thái', className: 'min-w-36' },
  { label: 'Thời gian', className: 'min-w-44' },
]

export function ClassesTable({
  classes,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onView,
  onEdit,
  onDelete,
}: ClassesTableProps) {
  const pageIds = classes.map((c) => c.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table
      containerClassName="min-w-full overflow-visible align-top"
      className="min-w-[2200px]"
    >
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow className="border-b-0 bg-muted hover:bg-muted">
          <TableHead className="sticky left-0 z-40 w-10 min-w-10 max-w-10 overflow-hidden bg-muted text-center">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          {COLUMN_DEFS.map((col) => (
            <TableHead key={col.label} className={col.className}>
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {classes.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={COLUMN_DEFS.length + 1} className="h-48 text-center">
              <EmptyState
                icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
                title="Không có lớp học phù hợp."
                description="Điều chỉnh tìm kiếm, trường, trạng thái hoặc bộ lọc."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          classes.map((cls) => (
            <ClassesTableRow
              key={cls.id}
              cls={cls}
              isSelected={selectedIds.has(cls.id)}
              onToggle={onToggleOne}
              onRowClick={onRowClick}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
