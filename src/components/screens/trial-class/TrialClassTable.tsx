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
import type { TrialClass } from '@/mocks/trialClasses'
import { TrialClassTableRow } from './TrialClassTableRow'



const COLUMN_DEFS: Array<{ label: string; className: string }> = [
  { label: 'Booking Học thử', className: 'sticky left-12 z-30 w-84 min-w-84 max-w-84 overflow-hidden bg-background' },
  { label: 'Học viên', className: 'min-w-64' },
  { label: 'Liên hệ', className: 'min-w-56' },
  { label: 'Lần', className: 'min-w-16' },
  { label: 'Lớp ghép', className: 'min-w-52' },
  { label: 'Buổi học', className: 'min-w-48' },
  { label: 'Ngày giờ', className: 'min-w-44' },
  { label: 'Nhận xét', className: 'min-w-44' },
  { label: 'Người phụ trách', className: 'min-w-36' },
  { label: 'Trạng thái', className: 'min-w-40' },
]

interface TrialClassTableProps {
  trials: TrialClass[]
  selectedIds: Set<string>
  copiedKey: string
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onCopy: (text: string, key: string) => void
  onRequestReschedule?: (id: string) => void
  onOpenAssignReschedule?: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassTable({
  trials,
  selectedIds,
  copiedKey,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onCopy,
  onRequestReschedule,
  onOpenAssignReschedule,
  onApprove,
  onReject,
}: TrialClassTableProps) {
  const pageIds = trials.map((t) => t.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  return (
    <Table containerClassName="min-w-full overflow-visible align-top" className="min-w-[1400px]">
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
        </TableRow>
      </TableHeader>
      <TableBody className="[&_tr]:border-b-0">
        {trials.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={COLUMN_DEFS.length + 1} className="h-48 text-center">
              <EmptyState
                icon={<CalendarDays className="h-7 w-7 text-muted-foreground" />}
                title="Không có booking học thử phù hợp."
                description="Điều chỉnh tìm kiếm, cơ sở hoặc bộ lọc."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          trials.map((trial) => (
            <TrialClassTableRow
              key={trial.id}
              trial={trial}
              isSelected={selectedIds.has(trial.id)}
              copiedKey={copiedKey}
              onToggle={onToggleOne}
              onRowClick={onRowClick}
              onCopy={onCopy}
              onRequestReschedule={onRequestReschedule}
              onOpenAssignReschedule={onOpenAssignReschedule}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
