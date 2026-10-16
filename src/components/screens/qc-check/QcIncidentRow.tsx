'use client'

import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Image as ImageIcon,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Bot,
  User,
  Paperclip,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass, getStatusColors } from '@/lib/statusColors'
import type { QcIncident } from '@/mocks/qcChecks'
import {
  QC_CRITERIA_LABELS,
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
} from '@/mocks/qcChecks'
import { formatShortDate, formatDateTime, isToday } from './qcCheckHelpers'
import { isIncidentOverdue, getIncidentBadgeSemantic } from './qcCheckTypes'

export interface QcIncidentRowProps {
  incident: QcIncident
  isSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  rowIndex: number
  onViewDetail: (id: string) => void
}

export function QcIncidentRow({
  incident,
  isSelected,
  onSelectChange,
  rowIndex,
  onViewDetail,
}: QcIncidentRowProps) {
  const isOverdue = isIncidentOverdue(incident)
  const isDeadlineToday = incident.deadline ? isToday(incident.deadline) : false

  // Đồng bộ màu nền dòng theo chuẩn OperationsAlert / StudentsTable
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

  return (
    <tr
      onClick={() => onViewDetail(incident.id)}
      className={cn(
        'group cursor-pointer transition-colors align-middle [&>td]:py-1.5 2xl:[&>td]:py-2 border-b-0',
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
          onCheckedChange={(val) => onSelectChange(incident.id, val === true)}
          aria-label={`Chọn ${incident.code}`}
        />
      </td>

      {/* 2. Đối tượng: Sticky left-8 (Khóa 210px để đồng bộ) */}
      <td
        onClick={() => onViewDetail(incident.id)}
        className={cn(
          'sticky left-8 z-30 w-[210px] min-w-[210px] max-w-[210px] px-2.5 overflow-hidden transition-colors cursor-pointer border-b border-border/40',
          stickyBgClass
        )}
      >
        <div className="flex flex-col gap-0.5 text-left">
          {/* Dòng 1: Icon loại tạo + Tên đối tượng (text-sm font-medium) */}
          <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap min-w-0">
            {incident.source === 'system' ? (
              <span title="Hệ thống tự tạo" className="inline-flex shrink-0">
                <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </span>
            ) : (
              <span title="Người dùng ghi nhận thủ công" className="inline-flex shrink-0">
                <User className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              </span>
            )}
            <span
              className="font-medium text-foreground text-sm truncate hover:underline hover:text-primary leading-tight cursor-pointer"
              title={
                incident.targetGroup === 'teacher'
                  ? `${incident.teacherName}${incident.className ? ` • ${incident.className}` : ''}`
                  : incident.targetGroup === 'facility'
                    ? `${incident.roomId || 'Toàn cơ sở'} • Phụ trách: ${incident.assignee}`
                    : `${incident.csmName || incident.assignee || 'Đội ngũ CS'}${incident.roomId ? ` • ${incident.roomId}` : ''}`
              }
            >
              {incident.targetGroup === 'teacher'
                ? incident.teacherName
                : incident.targetGroup === 'facility'
                  ? incident.roomId || 'Toàn cơ sở'
                  : incident.csmName || incident.assignee || 'Đội ngũ CS'}
            </span>
          </div>

          {/* Dòng 2: Lớp học HOẶC Người phụ trách đi kèm (PT: ...) (text-xs font-normal) */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-normal leading-none mt-0.5 truncate">
            {incident.targetGroup === 'facility' ? (
              <span className="truncate" title={`${incident.className ? `${incident.className} • ` : ''}Phụ trách: ${incident.assignee}`}>
                {incident.className ? <span className="font-mono">{incident.className} • </span> : null}
                <span className="text-muted-foreground">PT:</span>{' '}
                <span className="font-normal text-foreground/80">{incident.assignee}</span>
              </span>
            ) : incident.className ? (
              <span className="font-mono truncate" title={incident.className}>
                {incident.className}{incident.sessionNumber ? ` (B${incident.sessionNumber})` : ''}
              </span>
            ) : incident.targetGroup === 'operations' ? (
              <span className="truncate" title={`${incident.roomId ? `${incident.roomId} • ` : ''}Phụ trách: ${incident.assignee}`}>
                {incident.roomId ? (
                  <>
                    <span>{incident.roomId}</span>
                    <span className="mx-1 text-muted-foreground/60">•</span>
                  </>
                ) : null}
                <span className="text-muted-foreground">PT:</span>{' '}
                <span className="font-normal text-foreground/80">{incident.assignee}</span>
              </span>
            ) : incident.assignee ? (
              <span className="truncate" title={`Phụ trách: ${incident.assignee}`}>
                <span className="text-muted-foreground">PT:</span>{' '}
                <span className="font-normal text-foreground/80">{incident.assignee}</span>
              </span>
            ) : null}
          </div>
        </div>
      </td>

      {/* 3. Tiêu chí & Vi phạm (Giản lược in đậm, text-sm font-normal) */}
      <td className="px-2.5 overflow-hidden border-b border-border/40">
        <div className="flex flex-col gap-0.5 py-0 text-left">
          <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
            {/* Tiêu chí có màu theo mức độ */}
            <Badge
              variant="outline"
              className={cn(
                'text-xs px-1.5 py-0 h-5 font-normal shrink-0 leading-none shadow-none rounded flex items-center gap-1 border',
                incident.severity === 'critical'
                  ? getStatusColors('error').badge
                  : incident.severity === 'high'
                    ? getStatusColors('warning').badge
                    : incident.severity === 'medium'
                      ? getStatusColors('purple').badge
                      : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400'
              )}
              title={`Mức độ: ${QC_ERROR_SEVERITY_LABELS[incident.severity]}`}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full shrink-0',
                  incident.severity === 'critical'
                    ? 'bg-red-500'
                    : incident.severity === 'high'
                      ? 'bg-amber-500'
                      : incident.severity === 'medium'
                        ? 'bg-purple-500'
                        : 'bg-slate-400'
                )}
              />
              {QC_CRITERIA_LABELS[incident.criteria]}
            </Badge>

            {/* Tiêu đề sự cố: text-sm font-normal */}
            <span
              className="text-sm font-normal text-foreground truncate hover:underline hover:text-primary leading-tight cursor-pointer"
              title={incident.title}
            >
              {incident.title}
            </span>

            {/* Tích hợp icon ảnh/link nếu có */}
            {incident.evidenceImage ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetail(incident.id)
                }}
                className="inline-flex items-center text-primary hover:text-primary/80 shrink-0 cursor-pointer p-0.5"
                title="Xem ảnh bằng chứng lỗi"
              >
                <ImageIcon className="h-3.5 w-3.5" />
              </button>
            ) : incident.evidenceLink ? (
              <a
                href={incident.evidenceLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center text-muted-foreground hover:text-foreground shrink-0 p-0.5"
                title="Mở liên kết bằng chứng lỗi"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>

          <div
            className="text-xs text-muted-foreground font-normal leading-tight line-clamp-1 truncate mt-0.5"
            title={incident.description}
          >
            {incident.description}
          </div>
        </div>
      </td>

      {/* 4. Khắc phục & Minh chứng (Giản lược in đậm, text-sm font-normal) */}
      <td className="px-2.5 overflow-hidden border-b border-border/40 text-left">
        <div className="flex flex-col gap-0.5 py-0">
          {/* Dòng 1: Icon đính kèm / Tích tự động ở trước nội dung khắc phục */}
          <div className="flex items-center gap-1.5 min-w-0">
            {incident.source === 'system' || incident.closureMethod === 'system_auto' ? (
              <span
                title="Hệ thống tự động quét và xác nhận dữ liệu đã khắc phục"
                className="inline-flex shrink-0"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </span>
            ) : incident.correctiveImage || incident.correctiveEvidence || incident.correctiveLink ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetail(incident.id)
                }}
                className="inline-flex shrink-0 text-primary hover:text-primary/80 cursor-pointer"
                title="Xem file/ảnh minh chứng đính kèm"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </button>
            ) : null}

            {/* Nội dung khắc phục: text-sm font-normal (giản lược in đậm) */}
            <span
              className={cn(
                'text-sm font-normal leading-tight truncate hover:underline hover:text-primary cursor-pointer',
                incident.correctiveAction
                  ? 'text-foreground'
                  : 'text-muted-foreground/70 italic text-xs'
              )}
              title={
                incident.correctiveAction ||
                (incident.status === 'closed'
                  ? 'Đã xử lý & nghiệm thu hoàn tất'
                  : incident.status === 'cancelled'
                    ? 'Sự cố đã được hủy bỏ'
                    : 'Chưa có báo cáo phương án')
              }
              onClick={() => onViewDetail(incident.id)}
            >
              {incident.correctiveAction ||
                (incident.status === 'closed'
                  ? 'Đã xử lý & nghiệm thu hoàn tất'
                  : incident.status === 'cancelled'
                    ? 'Sự cố đã được hủy bỏ'
                    : 'Chưa có báo cáo phương án')}
            </span>
          </div>

          {/* Dòng 2: Người khắc phục (text-xs font-normal) */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-normal leading-none mt-0.5 truncate">
            <span
              className="truncate"
              title={
                incident.source === 'system' && !incident.correctiveAction
                  ? 'Hệ thống tự động'
                  : incident.assignee || 'Chưa phân công'
              }
            >
              {incident.source === 'system' && !incident.correctiveAction
                ? 'Hệ thống tự động'
                : incident.assignee || 'Chưa phân công'}
            </span>
          </div>
        </div>
      </td>

      {/* 5. Thời gian (Giản lược in đậm, Ngày tháng bỏ năm, Đến hạn hôm nay màu cam) */}
      <td className="w-[140px] min-w-[140px] max-w-[140px] px-2.5 overflow-hidden border-b border-border/40">
        <div className="flex flex-col gap-0.5 text-left">
          {/* Dòng 1: Thời gian ghi nhận / phát hiện - Ngày tháng bỏ năm, font-normal */}
          <div className="flex items-center gap-1 leading-tight whitespace-nowrap text-xs">
            <span className="text-muted-foreground font-normal">Tạo:</span>
            <span
              className="text-foreground font-normal"
              title={`Thời gian tạo: ${formatDateTime(incident.createdAt)}`}
            >
              {formatShortDate(incident.createdAt, false)}
            </span>
          </div>

          {/* Dòng 2: Mốc thời hạn SLA / Ngày đóng - font-normal, Đến hạn hôm nay màu cam */}
          <div className="flex items-center gap-1 leading-tight whitespace-nowrap text-xs mt-0.5">
            {incident.status === 'closed' ? (
              <span
                className="text-muted-foreground font-normal"
                title={`Đã đóng ngày: ${formatDateTime(incident.closedAt)}`}
              >
                Đóng: {formatShortDate(incident.closedAt?.split('T')[0], false)}
              </span>
            ) : isOverdue ? (
              <span
                className="text-red-600 dark:text-red-400 font-normal flex items-center gap-1"
                title={`Quá hạn: ${formatDateTime(incident.deadline)}`}
              >
                <AlertTriangle className="h-3 w-3 shrink-0 text-red-500" />
                <span>Quá hạn: {formatShortDate(incident.deadline, false)}</span>
              </span>
            ) : isDeadlineToday ? (
              <span
                className="text-amber-600 dark:text-amber-400 font-normal flex items-center gap-1"
                title={`Hạn chót hôm nay: ${formatDateTime(incident.deadline)}`}
              >
                <Clock className="h-3 w-3 shrink-0 text-amber-500" />
                <span>Đến hạn: Hôm nay</span>
              </span>
            ) : incident.deadline ? (
              <span
                className="text-muted-foreground font-normal"
                title={`Hạn xử lý: ${formatDateTime(incident.deadline)}`}
              >
                Hạn: {formatShortDate(incident.deadline, false)}
              </span>
            ) : (
              <span className="text-muted-foreground font-normal">Hạn: 24h</span>
            )}
          </div>
        </div>
      </td>

      {/* 6. Trạng thái */}
      <td className="w-[110px] min-w-[110px] max-w-[110px] px-2.5 overflow-hidden whitespace-nowrap border-b border-border/40">
        <div className="flex items-center gap-1 text-left">
          <Badge
            variant="outline"
            className={cn(
              'text-xs font-normal px-2 py-0.5 h-5 leading-none rounded shadow-none',
              getStatusBadgeClass(getIncidentBadgeSemantic(incident))
            )}
          >
            {QC_ERROR_STATUS_LABELS[incident.status]}
          </Badge>
        </div>
      </td>
    </tr>
  )
}
