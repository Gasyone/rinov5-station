'use client'

import { CalendarPlus, Eye } from 'lucide-react'
import { DataTableFrame } from '@/components/data-table'
import { DataTablePagination } from '@/components/data-table'
import { EmptyState } from '@/components/shared'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { formatMinutes } from './workRegistrationHelpers'
import { WORK_STATUS_LABELS, type EmployeeWeekSummary } from './workRegistrationTypes'

interface WorkRegistrationStaffTableProps {
  summaries: EmployeeWeekSummary[]
  page: number
  pageSize: number
  selectedEmployeeId?: string
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRegisterFor: (employeeId: string) => void
  onViewEmployee: (employeeId: string) => void
}

export function WorkRegistrationStaffTable({
  summaries,
  page,
  pageSize,
  selectedEmployeeId,
  onPageChange,
  onPageSizeChange,
  onRegisterFor,
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
              <TableHead>Nhân viên</TableHead>
              <TableHead>Trung tâm</TableHead>
              <TableHead>Giờ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((summary) => (
              <TableRow
                key={summary.employee.id}
                data-state={selectedEmployeeId === summary.employee.id ? 'selected' : undefined}
                className="cursor-pointer"
                onClick={() => onViewEmployee(summary.employee.id)}
              >
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{summary.employee.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {summary.employee.code} · {summary.employee.position}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{summary.employee.branch}</TableCell>
                <TableCell>{formatMinutes(summary.totalMinutes)}</TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeClass(statusForBadge(summary.status))}>
                    {WORK_STATUS_LABELS[summary.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Xem ${summary.employee.name}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onViewEmployee(summary.employee.id)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Đăng ký lịch cho ${summary.employee.name}`}
                      onClick={(event) => {
                        event.stopPropagation()
                        onRegisterFor(summary.employee.id)
                      }}
                    >
                      <CalendarPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
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

function statusForBadge(status: EmployeeWeekSummary['status']) {
  return status === 'not_registered' ? 'draft' : status
}
