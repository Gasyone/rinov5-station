'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { formatMinutes, formatMinutesShort } from './workRegistrationHelpers'
import type { BranchWeekSummary } from './workRegistrationTypes'

interface WorkRegistrationCenterTableRowProps {
  summary: BranchWeekSummary
  onOpenBranch: (branch: string) => void
  onOpenBranchDay: (branch: string, date: string) => void
}

export function WorkRegistrationCenterTableRow({
  summary,
  onOpenBranch,
  onOpenBranchDay,
}: WorkRegistrationCenterTableRowProps) {
  return (
    <TableRow
      className="cursor-pointer border-b-0"
      onClick={() => onOpenBranch(summary.branch)}
    >
      <TableCell className="sticky left-0 z-10 bg-card font-medium group-hover:bg-muted/50">{summary.branch}</TableCell>
      <TableCell>
        {summary.registeredEmployeeCount} / {summary.employeeCount}
      </TableCell>
      <TableCell>{formatMinutes(summary.totalMinutes)}</TableCell>
      <TableCell>{summary.coverageGapCount}</TableCell>
      {summary.daySummaries.map((day) => (
        <TableCell key={day.date} className="p-0 text-center">
          <Button
            type="button"
            variant="ghost"
            className="h-auto w-full flex-col gap-0 whitespace-nowrap rounded-none px-1.5 py-1.5 text-center hover:bg-muted/50"
            onClick={(event) => {
              event.stopPropagation()
              onOpenBranchDay(summary.branch, day.date)
            }}
          >
            <p className="text-sm font-medium">{formatMinutesShort(day.totalMinutes)}</p>
            <p className="text-xs text-muted-foreground">
              {day.registeredEmployeeCount}/{day.coverageGapCount}
            </p>
          </Button>
        </TableCell>
      ))}
      <TableCell>
        <Badge className={getStatusBadgeClass(summary.status)}>
          {branchStatusLabel(summary.status)}
        </Badge>
      </TableCell>
    </TableRow>
  )
}

function branchStatusLabel(status: BranchWeekSummary['status']) {
  if (status === 'registered') return 'Sẵn sàng'
  if (status === 'needs_attention') return 'Cần bổ sung'
  if (status === 'not_registered') return 'Chưa có dữ liệu'
  return status
}
