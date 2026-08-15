'use client'

import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/format'
import type { DepositOrderMode, DepositType } from './depositOrderTypes'

interface DepositConversionBannerProps {
  mode: DepositOrderMode
  depositType: DepositType
  onDepositTypeChange: (type: DepositType) => void
  depositAmount: number
  onDepositAmountChange: (amount: number) => void
  totalAmount: number
  trialPackageName: string
  convertedSessions: number
  onConvertedSessionsChange: (sessions: number) => void
  remainingSessions: number
  studentName: string
}

export function DepositConversionBanner({
  mode,
  depositType,
  onDepositTypeChange,
  depositAmount,
  onDepositAmountChange,
  totalAmount,
  trialPackageName,
  convertedSessions,
  onConvertedSessionsChange,
  remainingSessions,
  studentName,
}: DepositConversionBannerProps) {
  const remainingAmount = Math.max(0, totalAmount - depositAmount)

  return (
    <div className="space-y-3 text-left">
      {/* ── Top Options & Deposit Amount ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t">
        {/* Checkbox Options */}
        <div className="flex items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={depositType === 'pre_deposit'}
              onChange={() => onDepositTypeChange('pre_deposit')}
              className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Đặt cọc trước tiền</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-foreground">
            <input
              type="checkbox"
              checked={depositType === 'study_now'}
              onChange={() => onDepositTypeChange('study_now')}
              className="rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              Đặt cọc học luôn
            </span>
          </label>
        </div>

        {/* Deposit & Remaining Amounts */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-muted-foreground uppercase text-[11px]">
              TIỀN CỌC:
            </span>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                disabled={mode === 'completion'}
                value={depositAmount}
                onChange={(e) => onDepositAmountChange(Number(e.target.value))}
                className="h-8 w-28 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs"
              />
              <span className="text-muted-foreground font-mono">đ</span>
            </div>
          </div>

          {mode === 'completion' && (
            <div className="flex items-center gap-1.5 pl-3 border-l">
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[11px]">
                CẦN THANH TOÁN TIẾP:
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Highlight Conversion Banner (Amber / Cream Background) ── */}
      <div className="rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3 shadow-2xs">
        {mode === 'deposit' ? (
          /* Mode 1: Đơn cọc (Deposit Mode) */
          <div className="space-y-2.5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Column 1: Gói học thử */}
              <div className="space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  CHỌN GÓI HỌC THỬ
                </span>
                <p className="font-semibold text-foreground text-xs leading-snug">
                  {trialPackageName || 'Gia hạn - Việt Nam : 1-6 : 72 buổi'}
                </p>
              </div>

              {/* Column 2: Số buổi quy đổi cọc */}
              <div className="space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  SỐ BUỔI/THÁNG QUY ĐỔI CỌC
                </span>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    value={convertedSessions}
                    onChange={(e) => onConvertedSessionsChange(Number(e.target.value))}
                    className="h-8 w-20 text-center font-mono font-bold text-xs"
                  />
                  <span className="text-muted-foreground text-xs">(Buổi)</span>
                </div>
              </div>

              {/* Column 3: Tên con */}
              <div className="space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  TÊN CON
                </span>
                <p className="font-semibold text-foreground text-xs leading-snug">
                  {studentName || 'Vũ Đình Tuấn Anh'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1 border-t border-amber-200/50 dark:border-amber-900/40 text-xs">
              <span className="text-muted-foreground">
                Tiền quy đổi :{' '}
                <strong className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(depositAmount)}
                </strong>
              </span>
            </div>
          </div>
        ) : (
          /* Mode 2: Đơn hoàn tất (Completion Mode) */
          <div className="space-y-2.5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Column 1: Hoàn tất gói */}
              <div className="space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                  HOÀN TẤT GÓI
                </span>
                <p className="font-semibold text-foreground text-xs leading-snug">
                  {trialPackageName || 'Gia hạn - Việt Nam : 1-6 : 72 buổi'}
                </p>
              </div>

              {/* Column 2: Số buổi hoàn tất học thử */}
              <div className="space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                  SỐ BUỔI / THÁNG HOÀN TẤT HỌC THỬ
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-foreground text-sm">
                    {remainingSessions || 12}
                  </span>
                  <span className="text-muted-foreground text-xs">(Buổi)</span>
                </div>
              </div>

              {/* Column 3: Tên con */}
              <div className="space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300">
                  TÊN CON
                </span>
                <p className="font-semibold text-foreground text-xs leading-snug">
                  {studentName || 'Vũ Đình Tuấn Anh'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1 border-t border-amber-200/50 dark:border-amber-900/40 text-xs">
              <span className="text-muted-foreground">
                Số tiền thanh toán hoàn tất :{' '}
                <strong className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                  {formatCurrency(remainingAmount)}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
