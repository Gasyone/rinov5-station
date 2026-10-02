'use client'

import React from 'react'
import {
  ExternalLink,
  ArrowRightLeft,
  Info,
  Ticket,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { OrderFeeTransferSummary } from './studentOrdersTypes'

interface OrderFeeTransferSummaryPopoverProps {
  summary: OrderFeeTransferSummary
  onScrollToOrder: (orderNo: string) => void
}

export function OrderFeeTransferSummaryPopover({
  summary,
  onScrollToOrder,
}: OrderFeeTransferSummaryPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="font-medium px-2 py-0.5 rounded-md text-[10.5px] font-sans inline-flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800 cursor-pointer shadow-2xs transition-all"
        >
          <ArrowRightLeft className="h-3 w-3 text-purple-600 dark:text-purple-400" />
          <span>Nhận chuyển phí: <strong>{summary.ticketCode}</strong></span>
          <Info className="h-2.5 w-2.5 opacity-70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[720px] sm:w-[760px] md:w-[820px] max-w-[95vw] p-5 text-xs space-y-3.5 text-left shadow-2xl border-purple-200 dark:border-purple-800 z-50 rounded-2xl"
        align="start"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Popover Header */}
        <div className="flex items-center justify-between text-xs pb-2.5 border-b border-border/30 flex-wrap gap-3">
          <div className="text-muted-foreground font-normal">
            Ngày chuyển: <strong className="font-bold text-foreground">{summary.transferDate}</strong>
          </div>
          <div>
            <button
              type="button"
              onClick={() => toast.info(`Mã ticket chuyển phí: ${summary.ticketCode}`)}
              className="inline-flex items-center gap-1 font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
            >
              <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Mã ticket: <span className="underline">{summary.ticketCode}</span></span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="text-muted-foreground font-normal">
            Người thực hiện: <strong className="font-bold text-foreground">{summary.executorName}</strong>
          </div>
        </div>

        {/* 2-Column Side-by-Side Content Area (GÓI CŨ & GÓI MỚI in 1 Row) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 relative gap-8 pt-1">
          {/* Left Column: GÓI CŨ */}
          <div className="space-y-2 pr-0 sm:pr-3">
            <h4 className="font-bold text-xs tracking-wider text-muted-foreground uppercase">
              GÓI CŨ
            </h4>
            <div className="space-y-1.5 text-muted-foreground text-xs leading-relaxed">
              <p>
                Gói : <span className="font-medium text-foreground">{summary.oldPackageName}</span>
              </p>
              <p>
                Lộ trình : <span className="font-semibold text-foreground">{summary.oldPathwayLevel || '150'}</span>
              </p>
              <p>
                Tổng số buổi : <span className="font-semibold text-foreground">{summary.oldTotalSessions ?? 48}</span> / Số buổi chính : <span className="font-semibold text-foreground">{summary.oldMainSessions ?? 48}</span>
              </p>
              <p>
                Tổng số buổi đã học : <span className="font-semibold text-foreground">{summary.oldCompletedTotalSessions ?? 40}</span> / Số buổi chính đã học : <span className="font-semibold text-foreground">{summary.oldCompletedMainSessions ?? 40}</span>
              </p>
              <p className="pt-0.5">
                Số buổi được chuyển phí : <span className="font-semibold text-foreground">{summary.transferredSessionsCount} buổi</span>
              </p>
            </div>
          </div>

          {/* Center Arrow & Dashed Divider */}
          <div className="hidden sm:flex flex-col items-center absolute left-1/2 top-0 bottom-0 -translate-x-1/2 pointer-events-none">
            <div className="h-6 w-6 rounded-full bg-violet-600 dark:bg-violet-500 text-white flex items-center justify-center shadow-xs shrink-0 z-10 mt-1">
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
            <div className="flex-1 w-px border-r border-dashed border-violet-400/80 dark:border-violet-600/80 mt-1" />
          </div>

          {/* Right Column: GÓI MỚI */}
          <div className="space-y-2 pl-0 sm:pl-3">
            <h4 className="font-bold text-xs tracking-wider text-muted-foreground uppercase">
              GÓI MỚI
            </h4>
            <div className="space-y-1.5 text-muted-foreground text-xs leading-relaxed">
              {summary.newProgramName && (
                <p>
                  Gói : <span className="font-semibold text-foreground">{summary.newProgramName}</span>
                </p>
              )}
              <p>
                Lộ trình : <span className="font-semibold text-foreground">{summary.newPathwayLevel || '130'}</span>
              </p>
              <p>
                Loại chuyển : <span className="font-medium text-foreground">{summary.transferType}</span>
              </p>
              <p>
                Gói nhận phí : <span className="font-medium text-foreground">{summary.newPackageName}</span>
              </p>
              {summary.linkedOrderNo && (
                <p className="flex items-center gap-1.5 flex-wrap">
                  <span>Đơn hàng thanh toán thêm:</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onScrollToOrder(summary.linkedOrderNo!)
                    }}
                    className="inline-flex items-center gap-0.5 font-mono font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <span>{summary.linkedOrderNo}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </p>
              )}
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[10.5px] uppercase tracking-wider text-purple-700 dark:text-purple-300">
                  SỐ LƯỢNG BUỔI TỐI ĐA SAU QUY ĐỔI :
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md border border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold font-mono text-xs shadow-2xs">
                  {summary.convertedSessionsLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
