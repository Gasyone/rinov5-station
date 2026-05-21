'use client'

import { AlertTriangle, Building2, Clock, Users } from 'lucide-react'
import { DataTablePagination } from '@/components/data-table'
import { EmptyState, MetricTile } from '@/components/shared'
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
import { formatMinutes, formatMinutesShort } from './workRegistrationHelpers'
import type { BranchWeekSummary } from './workRegistrationTypes'
import { WorkRegistrationCenterTableRow } from './WorkRegistrationCenterTableRow'

interface WorkRegistrationCenterOverviewProps {
  summaries: BranchWeekSummary[]
  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onOpenBranch: (branch: string) => void
  onOpenBranchDay: (branch: string, date: string) => void
}

export function WorkRegistrationCenterOverview({
  summaries,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onOpenBranch,
  onOpenBranchDay,
}: WorkRegistrationCenterOverviewProps) {
  const currentPage = Math.min(page, Math.max(1, Math.ceil(summaries.length / pageSize)))
  const paged = summaries.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const totalMinutes = summaries.reduce((total, summary) => total + summary.totalMinutes, 0)
  const registeredBranches = summaries.filter((summary) => summary.registeredEmployeeCount > 0).length
  const coverageGaps = summaries.reduce((total, summary) => total + summary.coverageGapCount, 0)
  const missingEmployees = summaries.reduce(
    (total, summary) => total + Math.max(0, summary.employeeCount - summary.registeredEmployeeCount),
    0
  )

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-2">
      <div className="grid shrink-0 gap-2 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile compact label="Trung tâm có đăng ký" value={registeredBranches} icon={Building2} />
        <MetricTile compact label="Giờ đăng ký trong tuần" value={formatMinutes(totalMinutes)} icon={Clock} />
        <MetricTile compact label="Thiếu phủ giờ vàng" value={coverageGaps} icon={AlertTriangle} />
        <MetricTile compact label="Nhân viên chưa đăng ký" value={missingEmployees} icon={Users} />
      </div>

      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="min-h-0 flex-1 overflow-auto">
          {paged.length > 0 ? (
            <Table>
              <TableHeader className="[&_tr]:border-b-0">
                <TableRow className="border-b-0 bg-muted/50">
                  <TableHead className="sticky left-0 z-10 bg-muted/50">Trung tâm</TableHead>
                  <TableHead>Nhân viên đã đăng ký</TableHead>
                  <TableHead>Giờ trong tuần</TableHead>
                  <TableHead>Thiếu giờ vàng</TableHead>
                  {paged[0]?.daySummaries.map((day) => (
                    <TableHead key={day.date} className="min-w-16 text-center">
                      {day.label}
                    </TableHead>
                  ))}
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-b-0">
                {paged.map((summary) => (
                  <WorkRegistrationCenterTableRow
                    key={summary.branch}
                    summary={summary}
                    onOpenBranch={onOpenBranch}
                    onOpenBranchDay={onOpenBranchDay}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyState
              className="h-full"
              title="Chưa có dữ liệu trung tâm"
              description="Không có trung tâm trong phạm vi hiện tại."
            />
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-card">
          <DataTablePagination
            page={currentPage}
            total={summaries.length}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      </div>
    </div>
  )
}
