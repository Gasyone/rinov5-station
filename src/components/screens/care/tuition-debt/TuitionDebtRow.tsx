'use client'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AppAvatar } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { AlertCircle, Phone, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TuitionDebtItem } from './tuitionDebtTypes'
import { DEBT_STATUS_LABELS, PAYMENT_PLAN_LABELS } from './tuitionDebtTypes'
import { formatVND } from './tuitionDebtHelpers'

interface TuitionDebtRowProps {
  item: TuitionDebtItem
  isSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  onViewDetail?: (studentId: string) => void
  onPayMore?: (item: TuitionDebtItem) => void
}

export function TuitionDebtRow({
  item,
  isSelected,
  onSelectChange,
  onViewDetail,
  onPayMore,
}: TuitionDebtRowProps) {
  const isCapReached =
    item.paymentPlan === 'coc_hoc_luon' &&
    item.allowedSessions !== undefined &&
    item.attendedSessions >= item.allowedSessions

  return (
    <tr
      className={`border-b border-border transition-colors hover:bg-muted/40 cursor-pointer ${
        isSelected ? 'bg-muted/60' : ''
      }`}
      onClick={() => onViewDetail?.(item.studentId)}
    >
      {/* 0. Checkbox */}
      <td
        className="py-3 px-3 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(val) => onSelectChange(item.id, val === true)}
          aria-label={`Chọn học viên ${item.studentName}`}
        />
      </td>

      {/* 1. Học viên */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2.5">
          <AppAvatar
            name={item.studentName}
            src={item.avatar}
            className="h-8 w-8 text-xs shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-medium text-foreground hover:underline">
                {item.studentName}
              </span>
              {item.englishName && (
                <span className="text-muted-foreground text-xs">
                  ({item.englishName})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{item.studentCode}</span>
              <span>•</span>
              <span className="truncate">{item.branch}</span>
            </div>
          </div>
        </div>
      </td>

      {/* 2. Liên hệ */}
      <td className="py-2.5 px-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs font-medium text-foreground">
              {item.parentPhone}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {item.parentRelation}: {item.parentName}
          </span>
        </div>
      </td>

      {/* 3. Người phụ trách CS */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2">
          <AppAvatar
            name={item.csStaff}
            className="h-6 w-6 text-xs shrink-0"
          />
          <span className="text-xs text-foreground font-medium truncate">
            {item.csStaff}
          </span>
        </div>
      </td>

      {/* 4. Nội dung chăm sóc & Lịch hẹn */}
      <td className="py-2.5 px-3">
        <div className="flex flex-col gap-1 max-w-[260px]">
          {item.lastContactResult ? (
            <p className="text-xs text-foreground line-clamp-1">
              {item.lastContactResult}
            </p>
          ) : (
            <span className="text-xs text-muted-foreground italic">
              Chưa có tương tác
            </span>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {item.lastContactDate && <span>Lần cuối: {item.lastContactDate}</span>}
            {item.nextFollowUpDate && (
              <span className="text-sky-600 dark:text-sky-400 font-medium">
                • Hẹn gọi: {item.nextFollowUpDate}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* 5. Trạng thái công nợ */}
      <td className="py-2.5 px-3">
        <div className="flex flex-col gap-1 items-start">
          <Badge className={`text-xs px-2 py-0.5 font-medium ${getStatusBadgeClass(item.debtStatus)}`}>
            {DEBT_STATUS_LABELS[item.debtStatus]}
          </Badge>
          <span className="text-xs text-muted-foreground font-mono">
            Hạn: {item.nextDueDate}
          </span>
          {item.daysOverdue && item.daysOverdue > 0 && item.debtStatus !== 'debt_da_thu_du' && item.debtStatus !== 'debt_da_huy' && (
            <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
              (Trễ {item.daysOverdue} ngày)
            </span>
          )}
        </div>
      </td>

      {/* 6. Đơn hàng & Công nợ */}
      <td className="py-2.5 px-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-semibold text-foreground">
              {item.orderCode}
            </span>
            {item.paymentPlan === 'coc_hoc_luon' ? (
              <Badge variant="outline" className="text-xs px-1.5 py-0 border-violet-300 text-violet-700 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-700 font-medium">
                Cọc học luôn
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground bg-muted/80 px-1.5 py-0.5 rounded">
                {PAYMENT_PLAN_LABELS[item.paymentPlan]}
              </span>
            )}
          </div>
          <span className="text-xs text-foreground font-medium truncate max-w-[220px]">
            {item.packageName}
          </span>
          <div className="text-xs text-muted-foreground">
            Tổng: {formatVND(item.totalAmount)} • Đã thu: {formatVND(item.paidAmount)}
          </div>
          <div className="flex items-center justify-between gap-1 text-xs pt-0.5">
            <span className={`font-semibold ${item.debtAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              Còn nợ: {formatVND(item.debtAmount)}
            </span>
            {item.debtAmount > 0 && onPayMore && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-5.5 text-xs px-1.5 gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
                onClick={(e) => {
                  e.stopPropagation()
                  onPayMore(item)
                }}
                title="Lập phiếu thu tiền đợt tiếp theo"
              >
                <Plus className="h-2.5 w-2.5" />
                Thu tiền
              </Button>
            )}
          </div>
        </div>
      </td>

      {/* 7. Lớp học & Buổi */}
      <td className="py-2.5 px-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-medium text-foreground">
              {item.classCode}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {item.subject}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            GV: {item.teacherName}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-medium text-foreground">
              {item.attendedSessions}/{item.totalSessions} buổi
            </span>
            {isCapReached && (
              <Badge className="text-xs px-1.5 py-0 bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-800">
                <AlertCircle className="h-2.5 w-2.5 mr-0.5 inline" />
                Chạm trần cọc ({item.allowedSessions}b)
              </Badge>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}
