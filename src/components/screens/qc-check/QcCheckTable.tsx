'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Table } from '@/components/ui/table'
import { StatusBadge } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import {
  QC_CHECK_STATUS_LABELS,
  type QcCheckEvent,
  type QcCheckType,
} from '@/mocks/qcChecks'
import {
  formatShortDate,
  getQcTypeLabel,
  getQcStatusSemantic,
  getCalculatedStatus,
} from './qcCheckHelpers'

type BadgeVariant = 'secondary' | 'destructive' | 'outline' | 'default' | null | undefined

const TYPE_BADGE_MAP: Record<QcCheckType, BadgeVariant> = {
  daily: 'secondary',
  patrol: 'destructive',
  monthly: 'outline',
}

interface QcCheckTableProps {
  events: QcCheckEvent[]
  selectedIds: Set<string>
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onRowClick: (id: string) => void
}

export function QcCheckTable({ events, selectedIds, onToggleAll, onToggleOne, onRowClick }: QcCheckTableProps) {
  if (events.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Không có đợt kiểm tra nào phù hợp với bộ lọc.
      </div>
    )
  }

  const isAllSelected = events.length > 0 && events.every((e) => selectedIds.has(e.id))

  return (
    <Table>
        <thead>
          <tr className="bg-muted/50">
            <th className="sticky top-0 z-10 w-[40px] px-3 py-2 bg-muted/90 backdrop-blur-sm border-b">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onToggleAll}
                aria-label="Chọn tất cả"
              />
            </th>
            <th className="sticky top-0 z-10 px-3 py-2 text-left text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Tên cuộc kiểm tra</th>
            <th className="sticky top-0 z-10 w-[100px] px-3 py-2 text-left text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Loại</th>
            <th className="sticky top-0 z-10 w-[110px] px-3 py-2 text-left text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Ngày</th>
            <th className="sticky top-0 z-10 px-3 py-2 text-left text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Chi nhánh</th>
            <th className="sticky top-0 z-10 w-[80px] px-3 py-2 text-center text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Lỗi</th>
            <th className="sticky top-0 z-10 w-[120px] px-3 py-2 text-center text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Lặp lại</th>
            <th className="sticky top-0 z-10 w-[110px] px-3 py-2 text-center text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Đã khắc phục</th>
            <th className="sticky top-0 z-10 w-[110px] px-3 py-2 text-center text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Đã thực hiện HK</th>
            <th className="sticky top-0 z-10 w-[140px] px-3 py-2 text-left text-xs font-medium bg-muted/90 backdrop-blur-sm border-b">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            const errorCount = event.errors.length
            const correctedCount = event.errors.filter(
              (e) => e.status === 'corrected' || e.status === 'closed'
            ).length
            const correctiveActionDone = event.errors.filter(
              (e) => e.correctiveAction && e.correctiveAction.length > 0
            ).length
            const recurrenceTotal = event.errors.reduce(
              (sum, err) => sum + (err.recurrenceCount || 0),
              0
            )

            return (
              <tr
                key={event.id}
                className={`border-b border-border/40 transition-colors ${
                  selectedIds.has(event.id) ? 'bg-muted/50' : 'hover:bg-muted/50'
                }`}
                onClick={() => onRowClick(event.id)}
              >
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(event.id)}
                    onCheckedChange={() => onToggleOne(event.id)}
                    aria-label={`Chọn ${event.code}`}
                  />
                </td>
                <td className="px-3 py-2.5 cursor-pointer max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">
                  <div className="font-medium text-sm text-foreground">
                    {event.name || <span className="text-muted-foreground italic">Chưa đặt tên</span>}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground mt-0.5">
                    {event.code}
                  </div>
                </td>
                <td className="px-3 py-2.5 cursor-pointer">
                  <Badge variant={TYPE_BADGE_MAP[event.type]} className="text-xs">
                    {getQcTypeLabel(event.type)}
                  </Badge>
                </td>
                <td className="px-3 py-2.5 cursor-pointer text-sm">
                  {event.status === 'draft' ? <span className="text-muted-foreground">—</span> : formatShortDate(event.date)}
                </td>
                <td className="px-3 py-2.5 cursor-pointer max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-sm">
                  {event.branch}
                </td>
                <td className="px-3 py-2.5 text-center cursor-pointer text-sm tabular-nums">
                  {errorCount === 0 ? (
                    <span className="text-muted-foreground">0</span>
                  ) : (
                    errorCount
                  )}
                </td>
                <td className="px-3 py-2.5 text-center cursor-pointer text-sm tabular-nums">
                  {recurrenceTotal === 0 ? (
                    <span className="text-muted-foreground">—</span>
                  ) : (
                    recurrenceTotal
                  )}
                </td>
                <td className="px-3 py-2.5 text-center cursor-pointer">
                  {errorCount > 0 ? (
                    <Badge
                      className={
                        correctedCount === errorCount
                          ? getStatusBadgeClass('qc_error_corrected')
                          : correctedCount > 0
                            ? getStatusBadgeClass('qc_error_correcting')
                            : getStatusBadgeClass('qc_error_open')
                      }
                    >
                      {correctedCount}/{errorCount}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-center cursor-pointer">
                  {errorCount > 0 ? (
                    <span className="text-sm tabular-nums">
                      {correctiveActionDone}/{errorCount}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 cursor-pointer">
                  {(() => {
                    const calculatedStatus = getCalculatedStatus(event)
                    return (
                      <StatusBadge
                        status={getQcStatusSemantic(calculatedStatus)}
                        label={QC_CHECK_STATUS_LABELS[calculatedStatus]}
                      />
                    )
                  })()}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
  )
}
