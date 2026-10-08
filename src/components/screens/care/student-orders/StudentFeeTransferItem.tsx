'use client'

import React, { useState } from 'react'
import { Ticket, ExternalLink, ArrowRight, ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import type { FeeTransferRecord } from './studentOrdersTypes'

interface StudentFeeTransferItemProps {
  transfer: FeeTransferRecord
  onScrollToOrder: (orderNo: string) => void
}

export function StudentFeeTransferItem({ transfer: tf, onScrollToOrder }: StudentFeeTransferItemProps) {
  const [showOldUid, setShowOldUid] = useState(false)
  const [showNewUid, setShowNewUid] = useState(false)

  const isProductConversion = tf.category === 'product_conversion' || !!tf.productConversion

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/70 rounded-lg p-2 shadow-3xs space-y-1 text-left text-[11px] transition-all overflow-hidden">
      {/* Transfer Card Header Row */}
      <div className="-mx-2 -mt-2 px-2 py-1 bg-muted/30 dark:bg-zinc-800/40 border-b border-border/30 flex items-center justify-between text-[11px] flex-wrap gap-x-2 gap-y-0.5 rounded-t-lg mb-0.5">
        <div className="text-muted-foreground font-normal">
          Ngày chuyển: <span className="font-medium text-foreground">{tf.transferDate}</span>
        </div>

        <div>
          <span className="text-muted-foreground font-normal">
            Loại:{' '}
            <span
              className={
                isProductConversion
                  ? 'font-medium text-orange-600 dark:text-orange-400'
                  : 'font-medium text-indigo-600 dark:text-indigo-400'
              }
            >
              {tf.categoryLabel || (isProductConversion ? 'Chuyển đổi sản phẩm' : 'Chuyển phí')}
            </span>
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => toast.info(`Mã ticket: ${tf.ticketCode}`)}
            className="inline-flex items-center gap-1 font-mono font-medium text-[10.5px] text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
          >
            <Ticket className="h-2.5 w-2.5 text-muted-foreground" />
            <span>
              Mã ticket: <span className="underline">{tf.ticketCode}</span>
            </span>
            <ExternalLink className="h-2 w-2" />
          </button>
        </div>

        <div className="text-muted-foreground font-normal text-[10.5px]">
          Người thực hiện: <span className="font-medium text-foreground">{tf.executorName}</span>
        </div>
      </div>

      {/* 2-Column Side-by-Side Content Area */}
      {isProductConversion && tf.productConversion ? (
        /* PRODUCT CONVERSION (CHUYỂN ĐỔI SẢN PHẨM) */
        <div className="grid grid-cols-1 md:grid-cols-2 relative gap-2 pt-0.5">
          {/* Left Column: Gói cũ */}
          <div className="space-y-1 pr-0 md:pr-2">
            <h4 className="font-medium text-[11px] text-foreground/80">
              Gói cũ
            </h4>

            <div className="italic text-muted-foreground text-[10.5px]">
              {tf.productConversion.remainingDepositText || 'Số tiền cọc còn lại chưa quy đổi: 0 đ'}
            </div>

            <div className="text-muted-foreground text-[10.5px] font-normal">
              Sản phẩm chuyển:
            </div>

            {/* List of transferred products */}
            <div className="space-y-0.5">
              {tf.productConversion.transferredProducts.map((prod, idx) => (
                <div key={idx} className="flex items-start gap-1 pt-0.5">
                  <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="font-normal text-foreground text-[11px] leading-tight truncate">
                      {prod.name}
                    </div>
                    <div className="px-1.5 py-0.5 rounded border border-border/40 bg-muted/20 text-muted-foreground text-[10.5px] flex items-center justify-between flex-wrap gap-1">
                      <span>
                        Số buổi chuyển: <span className="font-medium text-foreground">{prod.sessions} buổi</span>
                      </span>
                      <span>
                        Số tiền: <span className="font-normal text-foreground font-mono">{prod.amountText}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Original Order Link */}
            {tf.productConversion.originalOrderNo && (
              <div className="pt-0.5 text-[10.5px] text-muted-foreground">
                Đơn gốc:{' '}
                <button
                  type="button"
                  onClick={() => onScrollToOrder(tf.productConversion!.originalOrderNo!)}
                  className="font-mono font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                >
                  <span>{tf.productConversion.originalOrderNo}</span>
                  <ExternalLink className="h-2 w-2" />
                </button>
              </div>
            )}
          </div>

          {/* Center Arrow & Dashed Divider */}
          <div className="hidden md:flex flex-col items-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none">
            <div className="h-4 w-4 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground border border-border/70 flex items-center justify-center shadow-3xs shrink-0 z-10 mt-0.5">
              <ArrowRight className="h-2.5 w-2.5 stroke-[2]" />
            </div>
            <div className="flex-1 w-px border-r border-dashed border-border/60 mt-0.5" />
          </div>

          {/* Right Column: Gói mới */}
          <div className="space-y-1 pl-0 md:pl-2">
            <h4 className="font-medium text-[11px] text-foreground/80">
              Gói mới
            </h4>

            <div className="space-y-0.5 text-[11px]">
              <div>
                <span className="text-muted-foreground">Mã biên nhận: </span>
                <span className="font-mono font-medium text-foreground">
                  {tf.productConversion.newPackage.receiptCode}
                </span>
              </div>

              <div className="flex items-center gap-1 pt-0.5">
                <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-muted-foreground">
                  Số tiền:{' '}
                  <span className="font-normal text-foreground text-[11px] font-mono">
                    {tf.productConversion.newPackage.amountText}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : tf.oldPackage && tf.newPackage ? (
        /* STANDARD FEE TRANSFER (CHUYỂN PHÍ) */
        <div className="grid grid-cols-1 md:grid-cols-2 relative gap-2 pt-0.5">
          {/* Left Column: Gói cũ */}
          <div className="space-y-0.5 pr-0 md:pr-2">
            <h4 className="font-medium text-[11px] text-foreground/80">
              Gói cũ
            </h4>

            <div className="space-y-0.5 text-muted-foreground text-[10.5px] leading-tight">
              <div className="flex items-center gap-1 flex-wrap">
                <span>Học viên:</span>
                <span className="font-medium text-foreground">{tf.oldPackage.studentName}</span>
                <button
                  type="button"
                  onClick={() => setShowOldUid(!showOldUid)}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center"
                  title={showOldUid ? 'Thu gọn mã học viên' : 'Xem UID / SID học viên'}
                >
                  {showOldUid ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {showOldUid && (
                  <span className="font-mono text-muted-foreground font-normal">
                    (UID: {tf.oldPackage.uid} - SID: {tf.oldPackage.sid})
                  </span>
                )}
              </div>

              <p>
                Gói: <span className="text-foreground font-normal">{tf.oldPackage.packageName}</span>
              </p>
              <p>
                Lộ trình: <span className="text-foreground font-mono font-normal">{tf.oldPackage.pathwayLevel}</span>
              </p>
              <p>
                Tổng số buổi: <span className="text-foreground font-mono font-normal">{tf.oldPackage.totalSessions}</span> / Số buổi chính: <span className="text-foreground font-mono font-normal">{tf.oldPackage.mainSessions}</span>
              </p>
              <p>
                Tổng số buổi đã học: <span className="text-foreground font-mono font-normal">{tf.oldPackage.completedTotalSessions}</span> / Số buổi chính đã học: <span className="text-foreground font-mono font-normal">{tf.oldPackage.completedMainSessions}</span>
              </p>
              <p className="pt-0.5">
                Số buổi được chuyển phí: <span className="font-medium text-foreground font-mono">{tf.oldPackage.transferredSessionsCount} buổi</span>
              </p>
            </div>
          </div>

          {/* Center Arrow & Dashed Divider */}
          <div className="hidden md:flex flex-col items-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none">
            <div className="h-4 w-4 rounded-full bg-muted dark:bg-zinc-800 text-muted-foreground border border-border/70 flex items-center justify-center shadow-3xs shrink-0 z-10 mt-0.5">
              <ArrowRight className="h-2.5 w-2.5 stroke-[2]" />
            </div>
            <div className="flex-1 w-px border-r border-dashed border-border/60 mt-0.5" />
          </div>

          {/* Right Column: Gói mới */}
          <div className="space-y-0.5 pl-0 md:pl-2">
            <h4 className="font-medium text-[11px] text-foreground/80">
              Gói mới
            </h4>

            <div className="space-y-0.5 text-muted-foreground text-[10.5px] leading-tight">
              <div className="flex items-center gap-1 flex-wrap">
                <span>Học viên nhận phí:</span>
                <span className="font-medium text-foreground">{tf.newPackage.recipientStudentName}</span>
                <button
                  type="button"
                  onClick={() => setShowNewUid(!showNewUid)}
                  className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center"
                  title={showNewUid ? 'Thu gọn mã học viên' : 'Xem UID / SID học viên'}
                >
                  {showNewUid ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
                {showNewUid && (
                  <span className="font-mono text-muted-foreground font-normal">
                    (UID: {tf.newPackage.uid} - SID: {tf.newPackage.sid})
                  </span>
                )}
              </div>

              {tf.newPackage.packageName && (
                <p>
                  Gói: <span className="text-foreground font-normal">{tf.newPackage.packageName}</span>
                </p>
              )}
              <p>
                Lộ trình: <span className="text-foreground font-mono font-normal">{tf.newPackage.pathwayLevel || '130'}</span>
              </p>
              <p>
                Loại chuyển: <span className="text-foreground font-normal">{tf.newPackage.transferType}</span>
              </p>
              <p>
                Gói nhận phí: <span className="text-foreground font-normal">{tf.newPackage.targetPackageName}</span>
              </p>

              {tf.newPackage.linkedOrderNo && (
                <p className="pt-0.5">
                  Đơn hàng thanh toán thêm:{' '}
                  <button
                    type="button"
                    onClick={() => onScrollToOrder(tf.newPackage!.linkedOrderNo!)}
                    className="font-mono font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                  >
                    <span>{tf.newPackage.linkedOrderNo}</span>
                    <ExternalLink className="h-2 w-2" />
                  </button>
                </p>
              )}

              {/* Số lượng buổi tối đa sau quy đổi */}
              <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                <span className="font-medium text-violet-700 dark:text-violet-400 text-[10.5px]">
                  Số lượng buổi tối đa sau quy đổi:
                </span>
                <span className="px-1.5 py-0.2 rounded-full border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 font-semibold font-mono text-[10px] bg-violet-50/50 dark:bg-violet-950/30">
                  {tf.newPackage.convertedSessionsLabel || `${tf.oldPackage.transferredSessionsCount} BUỔI`}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
