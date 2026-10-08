'use client'

import { useMemo } from 'react'
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentProgram } from './studentDetailTypes'

export interface StudentDetailRenewalSectionProps {
  program: StudentProgram
  onOpenRenewalDetail?: () => void
  onOpenOrderDetail?: (orderNo: string) => void
  onConsultNewPackage?: () => void
}

export function StudentDetailRenewalSection({
  program,
  onOpenRenewalDetail,
  onOpenOrderDetail,
}: StudentDetailRenewalSectionProps) {
  // Xác định kết quả tái phí trực tiếp từ dữ liệu của gói, không dùng tab chuyển đổi
  const outcome: 'failed' | 'success' = useMemo(() => {
    if (program.renewalInfo?.status === 'success') return 'success'
    if (program.renewalInfo?.status === 'failed') return 'failed'
    if (program.id.includes('math-pre') || program.id.includes('kindy')) return 'failed'
    return 'failed'
  }, [program])

  const isFailed = outcome === 'failed'

  const linkedOrderNo = program.renewalInfo?.linkedOrderNo || 'OD751020'
  const newPackageName = program.renewalInfo?.newPackageName || '[MATH_TUTOR] Toán Tư Duy 1:6 (96 buổi)'
  const failureReason =
    program.renewalInfo?.failureReason ||
    'Gia đình chuyển nơi cư trú sang quận khác, không tiện di chuyển đến cơ sở.'
  const decisionDate = program.renewalInfo?.decisionDate || '18/08/2023'

  return (
    <div
      className={cn(
        'rounded-xl border p-2.5 sm:p-3 space-y-2 text-left transition-colors shadow-3xs',
        isFailed
          ? 'border-rose-200/80 bg-rose-50/35 dark:border-rose-900/50 dark:bg-rose-950/20'
          : 'border-emerald-200/80 bg-emerald-50/35 dark:border-emerald-900/50 dark:bg-emerald-950/20'
      )}
    >
      {/* ── HEADER: Trạng thái Tái phí & Xem hồ sơ tái phí ở cạnh phải hàng trên ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          {isFailed ? (
            <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-foreground">
              {isFailed ? 'Tái phí thất bại' : 'Tái phí thành công'}
            </span>
            <span className="text-[11px] text-muted-foreground">
              • Cập nhật ngày {decisionDate}
            </span>
          </div>
        </div>

        {/* Cạnh phải hàng trên: Xem hồ sơ tái phí */}
        {onOpenRenewalDetail && (
          <button
            type="button"
            onClick={onOpenRenewalDetail}
            className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer underline-offset-2 hover:underline transition-colors shrink-0 ml-auto"
          >
            Xem hồ sơ tái phí
          </button>
        )}
      </div>

      {/* ── THÔNG TIN CHÍNH: Tinh gọn, liền mạch không thụt dòng ── */}
      {isFailed ? (
        <div className="pt-1.5 border-t border-rose-200/50 dark:border-rose-900/30 text-xs">
          <p className="text-foreground/90 text-[11.5px] leading-relaxed">
            <strong className="text-rose-700 dark:text-rose-400 font-semibold mr-1.5 text-[11px]">
              Lý do không mua:
            </strong>
            {failureReason}
          </p>
        </div>
      ) : (
        <div className="pt-1.5 border-t border-emerald-200/50 dark:border-emerald-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] shrink-0">
              Gói chuyển tiếp:
            </span>
            <strong className="text-foreground text-[11.5px] truncate font-semibold">
              {newPackageName}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
            <span>Đơn hàng liên kết:</span>
            <button
              type="button"
              onClick={() => onOpenOrderDetail?.(linkedOrderNo)}
              className="inline-flex items-center gap-1 font-mono font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 hover:underline cursor-pointer transition-colors"
              title={`Nhấp để xem chi tiết đơn hàng ${linkedOrderNo}`}
            >
              <span>{linkedOrderNo}</span>
              <ExternalLink className="h-3 w-3" />
            </button>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium ml-0.5">(Đã thanh toán)</span>
          </div>
        </div>
      )}
    </div>
  )
}
