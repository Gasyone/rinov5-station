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
  onManageRoadmap?: (classId: string) => void
  onAddStudent?: (classId: string) => void
}

const COLUMN_DEFS: Array<{ label: string; className: string }> = [
  { label: 'Lớp học', className: 'sticky left-10 z-30 w-[280px] min-w-[280px] max-w-[280px] bg-muted' },
  { label: 'Môn học', className: 'min-w-36' },
  { label: 'Giáo viên', className: 'min-w-40' },
  { label: 'Sĩ số', className: 'min-w-28' },
  { label: 'Lịch học', className: 'min-w-44' },
  { label: 'Trạng thái', className: 'min-w-32' },
  { label: 'Cơ sở', className: 'min-w-40' },
  { label: 'Chuyên cần', className: 'sticky right-[240px] z-30 w-[90px] min-w-[90px] max-w-[90px] bg-slate-100 dark:bg-slate-800/80 text-center shadow-[-4px_0_6px_-2px_rgba(0,0,0,0.08)]' },
  { label: 'BTVN', className: 'sticky right-[160px] z-30 w-[80px] min-w-[80px] max-w-[80px] bg-slate-100 dark:bg-slate-800/80 text-center' },
  { label: 'Kiểm tra', className: 'sticky right-[80px] z-30 w-[80px] min-w-[80px] max-w-[80px] bg-slate-100 dark:bg-slate-800/80 text-center' },
  { label: 'CSĐB', className: 'sticky right-0 z-30 w-[80px] min-w-[80px] max-w-[80px] bg-slate-100 dark:bg-slate-800/80 text-center' },
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
  onManageRoadmap,
  onAddStudent,
}: ClassesTableProps) {
  const pageIds = classes.map((c) => c.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table
      containerClassName="min-w-full overflow-visible align-top"
      className="min-w-[1500px]"
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
              onManageRoadmap={onManageRoadmap}
              onAddStudent={onAddStudent}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
