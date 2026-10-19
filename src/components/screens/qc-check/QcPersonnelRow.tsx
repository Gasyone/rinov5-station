'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { QcPersonnelGroup } from './qcPersonnelTypes'
import { getInitials } from './qcPersonnelHelpers'
import { formatShortDate } from './qcCheckHelpers'
import { QcTagHoverCard } from './QcTagHoverCard'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export interface QcPersonnelRowProps {
  group: QcPersonnelGroup
  isSelected: boolean
  onSelectChange: (groupId: string, checked: boolean) => void
  rowIndex: number
  onViewIncidentDetail: (incidentId: string) => void
  onCreateIncidentForPersonnel?: (group: QcPersonnelGroup) => void
}

export function QcPersonnelRow({
  group,
  isSelected,
  onSelectChange,
  rowIndex,
  onViewIncidentDetail,
  onCreateIncidentForPersonnel,
}: QcPersonnelRowProps) {
  const isEvenRow = typeof rowIndex === 'number' ? rowIndex % 2 === 1 : false

  const stickyBgClass = isSelected
    ? '!bg-sky-100 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'

  const rowBgClass = isSelected
    ? '!bg-sky-50 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800'

  const primaryIncident = group.incidents[0]

  const handleRowClick = () => {
    if (primaryIncident) {
      onViewIncidentDetail(primaryIncident.id)
    }
  }

  // Aggregate badge status
  let aggregateBadgeText = 'Đã giải quyết'
  let aggregateBadgeClass = getStatusBadgeClass('completed')

  if (group.aggregateStatus === 'has_open') {
    aggregateBadgeText = 'Đang có lỗi'
    aggregateBadgeClass = getStatusBadgeClass('open')
  } else if (group.aggregateStatus === 'pending_review') {
    aggregateBadgeText = 'Chờ nghiệm thu'
    aggregateBadgeClass = getStatusBadgeClass('pending')
  }

  const assignedClasses = group.locationContext.assignedClasses || []
  const hasMultipleClasses = assignedClasses.length > 1
  const isTeacher = group.targetGroup === 'teacher'

  return (
    <tr
      onClick={handleRowClick}
      className={cn(
        'group cursor-pointer transition-colors align-middle [&>td]:py-2 2xl:[&>td]:py-2.5 border-b-0',
        rowBgClass
      )}
    >
      {/* 1. Checkbox: Sticky left-0 */}
      <td
        className={cn(
          'sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center px-1 transition-colors border-b border-border/40',
          stickyBgClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(val) => onSelectChange(group.id, val === true)}
          aria-label={`Chọn ${group.cleanName}`}
        />
      </td>

      {/* 2. Nhân sự / Đối tượng: Sticky left-8 */}
      <td
        onClick={handleRowClick}
        className={cn(
          'sticky left-8 z-30 w-[220px] min-w-[200px] xl:w-[240px] 2xl:w-[260px] px-2.5 transition-colors cursor-pointer border-b border-border/40',
          stickyBgClass
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              'h-7 w-7 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 shadow-xs',
              group.avatarColor
            )}
          >
            {getInitials(group.cleanName)}
          </div>
          <div className="min-w-0">
            <p
              className="font-medium text-foreground text-xs 2xl:text-sm truncate hover:underline hover:text-primary leading-tight"
              title={group.personnelName}
            >
              {group.cleanName}
            </p>
            <p className="text-xs text-muted-foreground font-normal leading-none mt-0.5 truncate">
              {group.role}
            </p>
          </div>
        </div>
      </td>

      {/* 3. Vị trí / Bối cảnh */}
      <td className="w-[190px] min-w-[170px] xl:w-[210px] 2xl:w-[230px] px-2.5 border-b border-border/40 text-left">
        <div className="flex flex-col gap-0.5 text-left">
          {/* Dòng 1: Tên cơ sở (bỏ in đậm) */}
          <span
            className="text-xs font-normal text-muted-foreground truncate block"
            title={group.locationContext.displayLocation}
          >
            {group.locationContext.displayLocation}
          </span>

          {/* Dòng 2: Lớp phụ trách (cho Giáo viên) hoặc khu vực/khối (cho vai trò khác) */}
          {isTeacher ? (
            hasMultipleClasses ? (
              <div
                className="flex items-center gap-1 min-w-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span
                  className="text-xs text-foreground font-normal truncate max-w-[130px] xl:max-w-[150px]"
                  title={assignedClasses[0]}
                >
                  {assignedClasses[0]}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="h-4.5 px-1 text-xs font-normal text-primary bg-primary/10 hover:bg-primary/20 rounded shrink-0 cursor-pointer transition-colors"
                      title="Xem danh sách lớp phụ trách"
                    >
                      +{assignedClasses.length - 1}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    side="bottom"
                    className="w-60 p-2.5 bg-popover/95 backdrop-blur-md border border-border/80 rounded-lg shadow-lg text-xs z-50 space-y-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="font-medium text-foreground border-b border-border/60 pb-1 text-xs">
                      Lớp phụ trách ({assignedClasses.length})
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {assignedClasses.map((clsName, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-muted/50 text-xs"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span className="text-foreground font-normal truncate">
                            {clsName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : assignedClasses.length === 1 ? (
              <span
                className="text-xs text-foreground font-normal truncate block"
                title={assignedClasses[0]}
              >
                {assignedClasses[0]}
              </span>
            ) : null
          ) : group.locationContext.roleContext ? (
            <span
              className="text-xs text-muted-foreground font-normal truncate block"
              title={group.locationContext.roleContext}
            >
              {group.locationContext.roleContext}
            </span>
          ) : null}
        </div>
      </td>

      {/* 4. Thống kê lỗi (chu kỳ 30 ngày & tháng trước: Lỗi x/x, Tháng trước X/x, bỏ tăng giảm) */}
      <td className="w-[145px] min-w-[135px] px-2.5 border-b border-border/40 text-left">
        <div className="flex flex-col gap-0.5 text-left">
          {/* Dòng 1: Lỗi: x/x */}
          <div className="text-xs text-foreground font-normal leading-tight">
            <span className="text-muted-foreground mr-1">Lỗi:</span>
            <span className={cn('font-normal', group.errorStats.currentOpenCount > 0 ? 'text-amber-600 dark:text-amber-400 font-medium' : 'text-foreground')}>
              {group.errorStats.currentOpenCount}/{group.errorStats.current30DaysCount}
            </span>
          </div>

          {/* Dòng 2: Tháng trước X/x */}
          <div className="text-xs text-muted-foreground font-normal leading-tight mt-0.5">
            <span className="mr-1">Tháng trước:</span>
            <span className="text-foreground/90 font-normal">
              {group.errorStats.previousMonthOpenCount ?? 0}/{group.errorStats.previousMonthCount}
            </span>
          </div>
        </div>
      </td>

      {/* 5. Thẻ vi phạm (Violation Tags) */}
      <td
        className="w-[280px] min-w-[240px] xl:w-[320px] 2xl:w-[350px] px-2.5 border-b border-border/40 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap items-center gap-1 py-0.5">
          {group.incidents.map((incident) => (
            <QcTagHoverCard
              key={incident.id}
              incident={incident}
              onViewDetail={onViewIncidentDetail}
            />
          ))}

          {/* Quick '+' button: icon dấu cộng thôi, bỏ text */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCreateIncidentForPersonnel?.(group)
            }}
            className="h-5 w-5 rounded border border-dashed border-primary/40 bg-primary/5 hover:bg-primary/20 text-primary shrink-0 flex items-center justify-center cursor-pointer transition-colors"
            title={`Ghi nhận sự cố mới cho ${group.cleanName}`}
            aria-label="Thêm sự cố"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>

      {/* 5. Xử lý gần nhất */}
      <td className="w-[280px] min-w-[230px] xl:w-[310px] 2xl:w-[340px] px-2.5 border-b border-border/40 text-left">
        {group.latestRemediation ? (
          <div className="flex flex-col gap-0.5 py-0 text-left">
            <div
              className="text-xs text-muted-foreground leading-tight line-clamp-1 break-words hover:text-foreground transition-colors"
              title={group.latestRemediation.action}
            >
              {group.latestRemediation.relativeTimeText && (
                <span className="font-semibold text-foreground mr-1 shrink-0">
                  {group.latestRemediation.relativeTimeText}:
                </span>
              )}
              <span className="text-zinc-600 dark:text-zinc-400">
                {group.latestRemediation.action}
              </span>
            </div>
            <div className="text-xs font-normal leading-none mt-0.5">
              {group.latestRemediation.status === 'corrected' ? (
                <span className="text-amber-600 dark:text-amber-400">Chờ nghiệm thu</span>
              ) : group.latestRemediation.status === 'closed' ? (
                <span className="text-emerald-600 dark:text-emerald-400">Đã nghiệm thu</span>
              ) : (
                <span className="text-muted-foreground">Đang khắc phục</span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground font-normal italic">
            Chưa có báo cáo
          </span>
        )}
      </td>

      {/* 6. Trạng thái tổng hợp & SLA dòng 2 */}
      <td className="w-[145px] min-w-[135px] xl:w-[155px] 2xl:w-[165px] px-2.5 border-b border-border/40 text-left whitespace-nowrap">
        <div className="space-y-0.5 text-left">
          {/* Dòng 1: Badge trạng thái */}
          <div>
            <Badge
              variant="outline"
              className={cn(
                'text-xs font-normal px-1.5 py-0.5 h-5 leading-none',
                aggregateBadgeClass
              )}
            >
              {aggregateBadgeText}
            </Badge>
          </div>

          {/* Dòng 2: Thời hạn SLA (bỏ in đậm) */}
          <div className="text-xs font-normal leading-tight mt-0.5">
            {group.aggregateStatus === 'all_closed' ? (
              <span className="text-muted-foreground font-normal">Đã hoàn tất</span>
            ) : group.hasOverdue ? (
              <span className="text-red-600 dark:text-red-400 font-normal">
                Quá hạn: {group.earliestDeadline ? formatShortDate(group.earliestDeadline) : 'Đã quá hạn'}
              </span>
            ) : group.hasDueToday ? (
              <span className="text-amber-600 dark:text-amber-400 font-normal">
                Đến hạn: Hôm nay
              </span>
            ) : group.earliestDeadline ? (
              <span className="text-muted-foreground font-normal">
                Hạn: {formatShortDate(group.earliestDeadline)}
              </span>
            ) : null}
          </div>
        </div>
      </td>
    </tr>
  )
}
