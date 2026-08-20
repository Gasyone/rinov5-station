'use client'

import { Clock, History, CheckCircle2 } from 'lucide-react'
import { FieldLabel } from '@/components/shared'
import { cn } from '@/lib/utils'

interface LeaveReserveReservationFormProps {
  reserveMode: 'hold_seat' | 'no_hold_seat'
  onReserveModeChange: (mode: 'hold_seat' | 'no_hold_seat') => void
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  onPastReservationDate: () => void
  isStartDateInPast: boolean
  subjectHoldInfo: { maxSessions: number; subjectName: string }
}

export function LeaveReserveReservationForm({
  reserveMode,
  onReserveModeChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onPastReservationDate,
  isStartDateInPast,
  subjectHoldInfo,
}: LeaveReserveReservationFormProps) {
  return (
    <div className="space-y-3.5 rounded-xl border border-sky-200/80 bg-sky-50/20 dark:bg-sky-950/10 p-3.5">
      {/* Reservation Mode Selection: Giữ chỗ vs Không giữ chỗ */}
      <div className="space-y-1.5">
        <FieldLabel label="Hình thức bảo lưu" required>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => onReserveModeChange('hold_seat')}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer',
                reserveMode === 'hold_seat'
                  ? 'bg-card border-sky-600 ring-2 ring-sky-600/20 shadow-xs'
                  : 'bg-background hover:bg-muted/40 border-border/70 text-muted-foreground'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Bảo lưu Giữ chỗ
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded font-semibold">
                  Vẫn trong lớp
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                Tối đa {subjectHoldInfo.maxSessions} buổi ({subjectHoldInfo.subjectName}). Không tính phí các buổi trong lớp.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onReserveModeChange('no_hold_seat')}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer',
                reserveMode === 'no_hold_seat'
                  ? 'bg-card border-sky-600 ring-2 ring-sky-600/20 shadow-xs'
                  : 'bg-background hover:bg-muted/40 border-border/70 text-muted-foreground'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Không giữ chỗ
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                  Out khỏi lớp
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-snug">
                Tối đa 3 tháng. Rút khỏi danh sách lớp để nhường chỗ.
              </p>
            </button>
          </div>
        </FieldLabel>
      </div>

      {/* Date Pickers with Past Reservation Helper */}
      <div className="space-y-2 pt-1 border-t border-sky-200/50">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-sky-600" />
            Khoảng thời gian bảo lưu:
          </span>
          <button
            type="button"
            onClick={onPastReservationDate}
            className="text-[11px] font-medium text-sky-700 hover:text-sky-900 dark:text-sky-300 underline flex items-center gap-1 cursor-pointer"
          >
            <History className="h-3 w-3" />
            Bảo lưu từ 1 buổi học trước (Quá khứ)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FieldLabel label="Bảo lưu từ ngày" required>
            <input
              id="reserve-start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              required
            />
          </FieldLabel>
          <FieldLabel label="Bảo lưu đến ngày" required>
            <input
              id="reserve-end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate}
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
              required
            />
          </FieldLabel>
        </div>

        {isStartDateInPast && (
          <div className="flex items-center gap-1.5 text-[10px] text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 p-1.5 px-2 rounded border border-sky-200 dark:border-sky-800">
            <CheckCircle2 className="h-3 w-3 text-sky-600 shrink-0" />
            <span>Hợp lệ: Đã kích hoạt bảo lưu quá khứ (trong hạn mức tối đa 1 buổi học trước).</span>
          </div>
        )}

        {/* Informative Note for Mode */}
        {reserveMode === 'hold_seat' ? (
          <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200/70 dark:border-emerald-800">
            ✓ <strong>Bảo lưu Giữ chỗ:</strong> Hệ thống tự động tính số buổi giữ chỗ theo khoảng ngày (Tối đa {subjectHoldInfo.maxSessions} buổi môn {subjectHoldInfo.subjectName}). Học viên không bị trừ phí trong thời gian này.
          </div>
        ) : (
          <div className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200/70 dark:border-amber-800">
            ⚠️ <strong>Bảo lưu Không giữ chỗ:</strong> Học viên được rút khỏi sĩ số lớp. Khi hết hạn bảo lưu, Phụ huynh liên hệ để CSM làm thủ tục xếp lớp mới.
          </div>
        )}
      </div>
    </div>
  )
}
