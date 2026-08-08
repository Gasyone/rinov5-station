'use client'

import React from 'react'
import { Ticket, ExternalLink, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import type { FeeTransferRecord } from './studentOrdersTypes'

interface StudentFeeTransferItemProps {
  transfer: FeeTransferRecord
  onScrollToOrder: (orderNo: string) => void
}

export function StudentFeeTransferItem({ transfer: tf, onScrollToOrder }: StudentFeeTransferItemProps) {
  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-2.5 shadow-2xs space-y-2.5 text-left select-none overflow-hidden">
      {/* Transfer Card Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap -mx-2.5 -mt-2.5 px-3 py-2 bg-muted/40 dark:bg-zinc-800/40 rounded-t-2xl border-b border-border/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 shrink-0">
            🔄 Chuyển phí
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            Ngày chuyển: <strong className="text-foreground">{tf.transferDate}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs flex-wrap">
          <button
            type="button"
            onClick={() => toast.info(`Mã ticket chuyển phí: ${tf.ticketCode}`)}
            className="inline-flex items-center gap-1 font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
          >
            <Ticket className="h-3.5 w-3.5 text-zinc-500" />
            <span>Mã ticket: {tf.ticketCode}</span>
            <ExternalLink className="h-3 w-3" />
          </button>
          <span className="text-muted-foreground font-normal">
            Người thực hiện: <strong className="text-foreground font-medium">{tf.executorName}</strong>
          </span>
        </div>
      </div>

      {/* 2-Column Transfer Flow Layout (GÓI CŨ ➔ GÓI MỚI) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center text-xs">
        {/* Column 1: GÓI CŨ (GÓI NGUỒN) */}
        <div className="p-3 rounded-xl bg-muted/20 dark:bg-zinc-800/30 border border-border/50 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-1 pb-1 border-b border-border/30">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
              Gói Cũ (Gói Nguồn)
            </span>
          </div>

          <p className="font-bold text-foreground text-xs leading-snug">
            Học viên: <span className="text-foreground">{tf.oldPackage.studentName}</span>{' '}
            <span className="text-muted-foreground font-mono font-normal">
              (UID: {tf.oldPackage.uid} - SID: {tf.oldPackage.sid})
            </span>
          </p>

          <p className="text-muted-foreground leading-snug font-normal">
            Gói: <strong className="text-foreground font-semibold">{tf.oldPackage.packageName}</strong>
          </p>

          <div className="text-[11px] text-muted-foreground space-y-0.5 pt-0.5">
            <p>Lộ trình: <strong className="text-foreground">{tf.oldPackage.pathwayLevel}</strong></p>
            <p>
              Tổng số buổi: <strong className="text-foreground">{tf.oldPackage.totalSessions}</strong> / Buổi chính: <strong className="text-foreground">{tf.oldPackage.mainSessions}</strong>
            </p>
            <p>
              Tổng đã học: <strong className="text-foreground">{tf.oldPackage.completedTotalSessions}</strong> / Buổi chính đã học: <strong className="text-foreground">{tf.oldPackage.completedMainSessions}</strong>
            </p>
          </div>

          <div className="pt-1.5 border-t border-border/30">
            <span className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/70 text-xs font-semibold">
              Số buổi được chuyển phí: {tf.oldPackage.transferredSessionsCount} buổi
            </span>
          </div>
        </div>

        {/* Arrow Transfer Indicator Icon */}
        <div className="flex items-center justify-center my-1 md:my-0">
          <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-3xs shrink-0">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Column 2: GÓI MỚI (GÓI NHẬN PHÍ) */}
        <div className="p-3 rounded-xl bg-muted/20 dark:bg-zinc-800/30 border border-border/50 space-y-1.5 min-w-0">
          <div className="flex items-center justify-between gap-1 pb-1 border-b border-border/30">
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider block">
              Gói Mới (Gói Nhận Phí)
            </span>
          </div>

          <p className="font-bold text-foreground text-xs leading-snug">
            Học viên nhận phí:{' '}
            <span className="text-foreground">{tf.newPackage.recipientStudentName}</span>{' '}
            <span className="text-muted-foreground font-mono font-normal">
              (UID: {tf.newPackage.uid} - SID: {tf.newPackage.sid})
            </span>
          </p>

          <p className="text-muted-foreground leading-snug font-normal">
            Loại chuyển:{' '}
            <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200/60">
              {tf.newPackage.transferType}
            </span>
          </p>

          <p className="text-muted-foreground leading-snug font-normal pt-0.5">
            Gói nhận phí:{' '}
            <strong className="text-foreground font-semibold">
              {tf.newPackage.targetPackageName}
            </strong>
          </p>

          {/* Linked Order Button */}
          <div className="pt-2 border-t border-border/30">
            <button
              type="button"
              onClick={() => onScrollToOrder(tf.newPackage.linkedOrderNo)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
            >
              <span>Đơn hàng thanh toán thêm:</span>
              <span className="font-mono bg-sky-50 dark:bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-200/60">
                {tf.newPackage.linkedOrderNo}
              </span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
