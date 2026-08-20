'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DataTableFrame } from '@/components/data-table'
import { EmptyState } from '@/components/shared'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatMinutesShort, getEmployeeRoleLabel } from './workRegistrationHelpers'
import type { EmployeeWeekSummary } from './workRegistrationTypes'

interface WorkRegistrationStaffTableProps {
  summaries: EmployeeWeekSummary[]
  page: number
  pageSize?: number
  selectedEmployeeId?: string
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  onViewEmployee: (employeeId: string) => void
}

export function WorkRegistrationStaffTable({
  summaries,
  page,
  pageSize = 50,
  selectedEmployeeId,
  onPageChange,
  onViewEmployee,
}: WorkRegistrationStaffTableProps) {
  const total = summaries.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const firstRecord = total === 0 ? 0 : (safePage - 1) * pageSize + 1
  const lastRecord = Math.min(safePage * pageSize, total)
  const paged = summaries.slice((safePage - 1) * pageSize, safePage * pageSize)

  return (
    <DataTableFrame
      footer={
        <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground border-t bg-muted/15">
          <span className="text-[11px] font-medium tabular-nums">
            {total > 0 ? `${firstRecord}–${lastRecord} / ${total} NV` : '0 nhân viên'}
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={safePage <= 1}
                onClick={() => onPageChange(safePage - 1)}
                className="h-6 w-6 cursor-pointer"
                aria-label="Trang trước"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-[11px] font-medium px-1 tabular-nums">
                {safePage}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="icon-sm"
                disabled={safePage >= totalPages}
                onClick={() => onPageChange(safePage + 1)}
                className="h-6 w-6 cursor-pointer"
                aria-label="Trang sau"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      }
    >
      {paged.length > 0 ? (
        <Table containerClassName="h-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-2.5 px-3">Nhân viên</TableHead>
              <TableHead className="py-2.5 px-3 text-right">Giờ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((summary) => (
              <TableRow
                key={summary.employee.id}
                data-state={selectedEmployeeId === summary.employee.id ? 'selected' : undefined}
                className="cursor-pointer hover:bg-muted/40 transition-colors"
                onClick={() => onViewEmployee(summary.employee.id)}
              >
                <td className="py-2.5 px-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-xs text-foreground">
                      {summary.employee.name}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {summary.employee.code} · {getEmployeeRoleLabel(summary.employee.id, summary.employee.position, summary.employee.department)}
                    </p>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  {summary.totalMinutes > 0 ? (
                    <span className="font-semibold text-xs text-primary tabular-nums">
                      {formatMinutesShort(summary.totalMinutes)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60 text-xs font-normal tabular-nums">
                      0:00
                    </span>
                  )}
                </td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          className="h-full"
          title="Chưa có nhân viên"
          description="Điều chỉnh bộ lọc cơ sở để xem danh sách nhân sự."
        />
      )}
    </DataTableFrame>
  )
}
