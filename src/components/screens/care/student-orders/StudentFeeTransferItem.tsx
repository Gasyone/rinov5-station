'use client'

import React, { useState } from 'react'
import { Ticket, ExternalLink, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import type { FeeTransferRecord } from './studentOrdersTypes'

interface StudentFeeTransferItemProps {
  transfer: FeeTransferRecord
  onScrollToOrder: (orderNo: string) => void
}

export function StudentFeeTransferItem({ transfer: tf, onScrollToOrder }: StudentFeeTransferItemProps) {
  const [showOldUid, setShowOldUid] = useState(false)
  const [showNewUid, setShowNewUid] = useState(false)

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 text-left text-xs transition-all overflow-hidden">
      {/* Transfer Card Header Row */}
      <div className="flex items-center justify-between text-xs pb-3 border-b border-border/30 flex-wrap gap-2">
        <div className="text-muted-foreground font-normal">
          Ngày chuyển: <strong className="font-bold text-foreground">{tf.transferDate}</strong>
        </div>

        <div>
          <button
            type="button"
            onClick={() => toast.info(`Mã ticket chuyển phí: ${tf.ticketCode}`)}
            className="inline-flex items-center gap-1 font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
          >
            <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Mã ticket: <span className="underline">{tf.ticketCode}</span></span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        <div className="text-muted-foreground font-normal">
          Người thực hiện: <strong className="font-bold text-foreground">{tf.executorName}</strong>
        </div>
      </div>

      {/* 2-Column Side-by-Side Content Area (GÓI CŨ & GÓI MỚI in 1 Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 relative gap-6 pt-1">
        {/* Left Column: GÓI CŨ */}
        <div className="space-y-2 pr-0 md:pr-4">
          <h4 className="font-bold text-xs tracking-wider text-muted-foreground uppercase">
            GÓI CŨ
          </h4>

          <div className="space-y-1.5 text-muted-foreground text-xs leading-relaxed">
            <div className="flex items-center gap-1 flex-wrap">
              <span>Học viên :</span>
              <span className="font-semibold text-foreground">{tf.oldPackage.studentName}</span>
              <button
                type="button"
                onClick={() => setShowOldUid(!showOldUid)}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center"
                title={showOldUid ? 'Thu gọn mã học viên' : 'Xem UID / SID học viên'}
              >
                {showOldUid ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {showOldUid && (
                <span className="font-mono text-muted-foreground font-normal">
                  ( UID: {tf.oldPackage.uid} - SID: {tf.oldPackage.sid} )
                </span>
              )}
            </div>

            <p>
              Gói : <span className="font-medium text-foreground">{tf.oldPackage.packageName}</span>
            </p>
            <p>
              Lộ trình : <span className="font-semibold text-foreground">{tf.oldPackage.pathwayLevel}</span>
            </p>
            <p>
              Tổng số buổi : <span className="font-semibold text-foreground">{tf.oldPackage.totalSessions}</span> / Số buổi chính : <span className="font-semibold text-foreground">{tf.oldPackage.mainSessions}</span>
            </p>
            <p>
              Tổng số buổi đã học : <span className="font-semibold text-foreground">{tf.oldPackage.completedTotalSessions}</span> / Số buổi chính đã học : <span className="font-semibold text-foreground">{tf.oldPackage.completedMainSessions}</span>
            </p>
            <p className="pt-0.5">
              Số buổi được chuyển phí : <span className="font-semibold text-foreground">{tf.oldPackage.transferredSessionsCount} buổi</span>
            </p>
          </div>
        </div>

        {/* Center Arrow & Dashed Divider */}
        <div className="hidden md:flex flex-col items-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none">
          {/* Purple circle with right arrow */}
          <div className="h-6 w-6 rounded-full bg-violet-600 dark:bg-violet-500 text-white flex items-center justify-center shadow-xs shrink-0 z-10 mt-1">
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </div>
          {/* Vertical dashed line */}
          <div className="flex-1 w-px border-r border-dashed border-violet-400/80 dark:border-violet-600/80 mt-1.5" />
        </div>

        {/* Right Column: GÓI MỚI */}
        <div className="space-y-2 pl-0 md:pl-6">
          <h4 className="font-bold text-xs tracking-wider text-muted-foreground uppercase">
            GÓI MỚI
          </h4>

          <div className="space-y-1.5 text-muted-foreground text-xs leading-relaxed">
            <div className="flex items-center gap-1 flex-wrap">
              <span>Học viên nhận phí :</span>
              <span className="font-semibold text-foreground">{tf.newPackage.recipientStudentName}</span>
              <button
                type="button"
                onClick={() => setShowNewUid(!showNewUid)}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center"
                title={showNewUid ? 'Thu gọn mã học viên' : 'Xem UID / SID học viên'}
              >
                {showNewUid ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {showNewUid && (
                <span className="font-mono text-muted-foreground font-normal">
                  ( UID: {tf.newPackage.uid} - SID: {tf.newPackage.sid} )
                </span>
              )}
            </div>

            <p>
              Gói nhận phí : <span className="font-medium text-foreground">{tf.newPackage.targetPackageName}</span>
            </p>
            <p>
              Lộ trình : <span className="font-semibold text-foreground">{tf.newPackage.pathwayLevel || '152'}</span>
            </p>
            <p>
              Loại chuyển : <span className="font-medium text-foreground">{tf.newPackage.transferType}</span>
            </p>

            {tf.newPackage.linkedOrderNo && (
              <p className="pt-0.5">
                Đơn hàng thanh toán thêm:{' '}
                <button
                  type="button"
                  onClick={() => onScrollToOrder(tf.newPackage.linkedOrderNo!)}
                  className="font-mono font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>{tf.newPackage.linkedOrderNo}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </p>
            )}

            {/* SỐ LƯỢNG BUỔI TỐI ĐA SAU QUY ĐỔI : [ 2 BUỔI ] */}
            <div className="flex items-center gap-2 pt-1.5 flex-wrap">
              <span className="font-bold text-violet-700 dark:text-violet-400 uppercase text-[11.5px] tracking-tight">
                SỐ LƯỢNG BUỔI TỐI ĐA SAU QUY ĐỔI :
              </span>
              <span className="px-2.5 py-0.5 rounded border border-violet-600/80 dark:border-violet-400 text-violet-700 dark:text-violet-300 font-bold font-mono text-xs shadow-2xs bg-violet-50/40 dark:bg-violet-950/20">
                {tf.newPackage.convertedSessionsLabel || `${tf.oldPackage.transferredSessionsCount} BUỔI`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

