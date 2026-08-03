'use client'

import { CalendarCheck } from 'lucide-react'
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
import type { MakeupClassRequest } from '@/mocks/makeupClasses'
import { MakeupClassTableRow } from './MakeupClassTableRow'

const COLUMN_DEFS: Array<{ label: string; className: string }> = [
  { label: 'Học viên', className: 'sticky left-12 z-30 w-80 min-w-80 max-w-80 overflow-hidden bg-background' },
  { label: 'Liên hệ', className: 'min-w-48' },
  { label: 'Lớp gốc', className: 'min-w-44' },
  { label: 'Buổi nghỉ', className: 'min-w-44' },
  { label: 'Lớp ghép', className: 'min-w-44' },
  {label: 'Buổi bù', className: 'min-w-44' },
  { label: 'Kết quả', className: 'min-w-36' },
  { label: 'Người phụ trách', className: 'min-w-36' },
  { label: 'Trạng thái', className: 'min-w-32' },
]

interface MakeupClassTableProps {
  requests: MakeupClassRequest[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function MakeupClassTable({
  requests,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onApprove,
  onReject,
}: MakeupClassTableProps) {
  const pageIds = requests.map((r) => r.id)
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
        {requests.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={COLUMN_DEFS.length + 1} className="h-48 text-center">
              <EmptyState
                icon={<CalendarCheck className="h-7 w-7 text-muted-foreground" />}
                title="Không có phiếu học bù phù hợp."
                description="Điều chỉnh tìm kiếm, cơ sở hoặc bộ lọc."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <MakeupClassTableRow
              key={request.id}
              request={request}
              isSelected={selectedIds.has(request.id)}
              onToggle={onToggleOne}
              onRowClick={onRowClick}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}
