'use client'

import React from 'react'
import {
  QrCode,
  Receipt,
  CheckCircle2,
  Copy,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared'
import type { FamilyPayment } from '../crmFamily360Types'
import { formatCurrencyVnd } from '../crmFamily360Helpers'

interface CrmFamilyPaymentsTabProps {
  payments: FamilyPayment[]
}

export function CrmFamilyPaymentsTab({ payments }: CrmFamilyPaymentsTabProps) {
  const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0)
  const reconciledCount = payments.filter((p) => p.isReconciled).length

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Đã sao chép mã giao dịch: ${code}`)
  }

  return (
    <div className="space-y-3.5">
      {/* Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-card border border-border/70 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Tổng học phí gia đình đã nộp ({payments.length} phiếu thu)
          </span>
          <p className="text-base font-bold text-emerald-700 dark:text-emerald-300">
            {formatCurrencyVnd(totalAmount)}
          </p>
        </div>

        <div className="p-3 bg-sky-50/40 dark:bg-sky-950/20 border border-sky-200/80 dark:border-sky-900/60 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-sky-700 dark:text-sky-400 font-medium block">
            Đối soát kế toán
          </span>
          <p className="text-base font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            <span>
              {reconciledCount}/{payments.length} Đã đối soát
            </span>
          </p>
        </div>

        <div className="p-3 bg-card border border-border/70 rounded-xl shadow-2xs space-y-1">
          <span className="text-[11px] text-muted-foreground font-medium block">
            Phương thức thanh toán
          </span>
          <p className="text-base font-bold text-foreground flex items-center gap-1.5">
            <QrCode className="h-4 w-4 text-purple-600" />
            <span>VietQR &amp; Bank Transfer</span>
          </p>
        </div>
      </div>

      {/* Danh sách Phiếu thu */}
      {payments.length === 0 ? (
        <EmptyState
          title="Chưa có phiếu thu"
          description="Chưa có phiếu thu hoặc giao dịch nộp tiền nào được ghi nhận cho gia đình này."
        />
      ) : (
        <div className="space-y-3">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-xl border border-border/70 bg-card p-3.5 space-y-2.5 shadow-2xs hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/60 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20">
                    <Receipt className="h-3.5 w-3.5" />
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(payment.code)}
                    className="font-mono text-xs font-bold text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 cursor-pointer"
                    title="Nhấp để sao chép mã"
                  >
                    <span>{payment.code}</span>
                    <Copy className="h-2.5 w-2.5 text-muted-foreground" />
                  </button>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Đơn: <span className="font-mono text-foreground font-bold">{payment.orderNo}</span>
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-xs text-foreground font-medium">
                    Học viên: {payment.studentName}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 dark:bg-purple-950/50 border-purple-200 text-[10px]"
                  >
                    {payment.paymentMethodLabel}
                  </Badge>
                  {payment.isReconciled ? (
                    <Badge className="bg-emerald-600 text-white text-[10px] font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>Đã đối soát</span>
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-700 border-amber-300 text-[10px]">
                      Chờ đối soát
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Loại giao dịch</span>
                  <p className="font-semibold text-foreground">{payment.receiptTypeLabel}</p>
                  <span className="text-[11px] text-muted-foreground truncate block">
                    Người nộp: {payment.parentName}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Số tiền thanh toán</span>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    {formatCurrencyVnd(payment.amount)}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Thời gian giao dịch</span>
                  <p className="font-medium text-foreground">{payment.createdAt}</p>
                  <span className="text-[11px] text-muted-foreground">Người lập: {payment.createdBy}</span>
                </div>

                <div>
                  <span className="text-[11px] text-muted-foreground block">Tài khoản / Ghi chú</span>
                  <p className="font-medium text-foreground truncate" title={payment.bankAccount}>
                    {payment.bankAccount || 'Quầy thu ngân chi nhánh'}
                  </p>
                  {payment.notes && (
                    <span className="text-[11px] text-muted-foreground truncate block" title={payment.notes}>
                      {payment.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
