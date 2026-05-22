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
  onEdit: (classId: string) => void
  onDelete: (classId: string) => void
  onView: (classId: string) => void
  onOpenClass: (classId: string) => void
  onCancelClass: (classId: string) => void
}

const COLUMN_DEFS: Array<{ label: string; className: string }> = [
  { label: 'Lớp học', className: 'min-w-56' },
  { label: 'Chương trình', className: 'min-w-32' },
  { label: 'GV chủ nhiệm', className: 'min-w-36' },
  { label: 'GV dạy thay', className: 'min-w-24' },
  { label: 'Sĩ số', className: 'min-w-24' },
  { label: 'Lịch học', className: 'min-w-44' },
  { label: 'Chi nhánh', className: 'min-w-44' },
  { label: 'Trạng thái', className: 'min-w-32' },
  { label: 'Thời gian', className: 'min-w-40' },
]

export function ClassesTable({
  classes,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onOpenClass,
  onCancelClass,
}: ClassesTableProps) {
  const pageIds = classes.map((c) => c.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table
      containerClassName="min-w-full overflow-visible align-top"
      className="min-w-[1280px]"
    >
      <TableHeader className="[&_tr]:border-b-0">
        <TableRow className="border-b-0 bg-muted/50 hover:bg-muted/50">
          <TableHead className="sticky left-0 z-40 w-12 min-w-12 max-w-12 overflow-hidden bg-background text-center">
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
          <TableHead className="w-10 text-right" />
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {classes.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={COLUMN_DEFS.length + 2} className="h-48 text-center">
              <EmptyState
                icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
                title="Không có lớp học phù hợp."
                description="Điều chỉnh tìm kiếm, cơ sở, trạng thái hoặc bộ lọc."
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
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
              onOpenClass={onOpenClass}
              onCancelClass={onCancelClass}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
