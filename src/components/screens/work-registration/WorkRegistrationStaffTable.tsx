'use client'

import { DataTableFrame } from '@/components/data-table'
import { DataTablePagination } from '@/components/data-table'
import { EmptyState } from '@/components/shared'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatMinutes } from './workRegistrationHelpers'
import type { EmployeeWeekSummary } from './workRegistrationTypes'

interface WorkRegistrationStaffTableProps {
  summaries: EmployeeWeekSummary[]
  page: number
  pageSize: number
  selectedEmployeeId?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onViewEmployee: (employeeId: string) => void
}

export function WorkRegistrationStaffTable({
  summaries,
  page,
  pageSize,
  selectedEmployeeId,
  onPageChange,
  onPageSizeChange,
  onViewEmployee,
}: WorkRegistrationStaffTableProps) {
  const currentPage = Math.min(page, Math.max(1, Math.ceil(summaries.length / pageSize)))
  const paged = summaries.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <DataTableFrame
      footer={
        <DataTablePagination
          page={currentPage}
          total={summaries.length}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
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
                      {summary.employee.code} · {summary.employee.position}
                    </p>
                  </div>
                </td>
                <td className="py-2.5 px-3 text-right whitespace-nowrap">
                  {summary.totalMinutes > 0 ? (
                    <span className="font-semibold text-xs text-primary tabular-nums">
                      {formatMinutes(summary.totalMinutes)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60 text-[11px] font-normal italic">
                      Chưa đăng ký
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
          title="Chưa có đăng ký nhân viên"
          description="Điều chỉnh bộ lọc để xem lịch khả dụng trong tuần."
        />
      )}
    </DataTableFrame>
  )
}
