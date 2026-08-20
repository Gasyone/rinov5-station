'use client'

import { useMemo } from 'react'
import { Clock, ShieldCheck, CheckCircle2, History, Calendar } from 'lucide-react'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import { TYPE_LABELS, STATUS_LABELS } from './leaveReserveTypes'
import { cn } from '@/lib/utils'

interface LeaveReservePolicyPanelProps {
  type: 'off' | 'reservation'
  studentId?: string
  studentName?: string
}

export function LeaveReservePolicyPanel({
  type,
  studentId,
  studentName,
}: LeaveReservePolicyPanelProps) {
  // Get history of leave/reserve for this student
  const studentHistory = useMemo(() => {
    if (!studentId && !studentName) return []
    return mockLeaveReserveRequests
      .filter((r) => (studentId && r.studentId === studentId) || (studentName && r.studentName === studentName))
      .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
  }, [studentId, studentName])

  return (
    <div className="space-y-3 md:col-span-5 flex flex-col justify-start">
      {/* SECTION 1: Policy Guidelines Card (Flat inside) */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 space-y-2.5 shadow-2xs">
        <div className="flex items-center gap-1.5 pb-2 border-b border-border/50 text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <h4 className="font-bold text-xs uppercase tracking-wider">
            {type === 'reservation' ? 'Chính sách bảo lưu [RS-TCSM]' : 'Quy định nghỉ phép & học bù'}
          </h4>
        </div>

        {/* Flat Policy Content */}
        {type === 'reservation' ? (
          <div className="space-y-2.5 text-xs text-muted-foreground">
            {/* Condition */}
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-foreground">Điều kiện:</strong> Còn <strong>tối thiểu 16 buổi học</strong> (không áp dụng học bổng 100%).
              </p>
            </div>

            {/* Hold Seat Rule */}
            <div className="space-y-1 pt-1 border-t border-border/40 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  1. Bảo lưu Giữ chỗ (Trong lớp)
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                  Không trừ phí
                </span>
              </div>
              <ul className="space-y-0.5 pl-4 list-disc text-muted-foreground">
                <li>Toán: Tối đa <strong>04 buổi</strong> | Tiếng Anh: Tối đa <strong>08 buổi</strong>.</li>
                <li>Vẫn ở trong lớp; hết hạn tự động chạy phí tiếp.</li>
              </ul>
            </div>

            {/* No Hold Seat Rule */}
            <div className="space-y-1 pt-1 border-t border-border/40 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  2. Bảo lưu Không giữ chỗ (Out lớp)
                </span>
                <span className="text-[9px] bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 font-semibold px-1.5 py-0.2 rounded border border-amber-200 dark:border-amber-800">
                  Tối đa 3 tháng
                </span>
              </div>
              <ul className="space-y-0.5 pl-4 list-disc text-muted-foreground">
                <li>Tối đa <strong>03 tháng</strong> (rút tên khỏi danh sách lớp).</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Leave Policy Content */
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong className="text-foreground">Thời hạn báo:</strong> Gửi trước giờ ca học <strong>tối thiểu 02 tiếng</strong> để được tính vắng có phép.
              </p>
            </div>

            <div className="space-y-1.5 pt-1 border-t border-border/40 text-[11px] leading-relaxed">
              <div className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <div>
                  <strong className="text-foreground">Học nhiều lớp:</strong> Tích chọn đúng ca học cần xin nghỉ trong ngày.
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <div>
                  <strong className="text-foreground">Hạn mức vắng (Quota):</strong> Tối đa <strong>12 buổi/năm học</strong> được học bù.
                </div>
              </div>

              <div className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <div>
                  <strong className="text-foreground">Quyền lợi học bù:</strong> Sau khi duyệt, học viên đăng ký tại phân hệ Lịch học bù.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Student History Card (Flat list inside) */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-border/50 text-foreground">
          <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider">
            <History className="h-4 w-4 text-primary shrink-0" />
            <span>Lịch sử đơn của học viên</span>
          </div>
          <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded-full border text-muted-foreground font-mono">
            {studentHistory.length} đơn
          </span>
        </div>

        {studentHistory.length === 0 ? (
          <div className="text-center py-3 text-muted-foreground text-xs">
            Học viên chưa có lịch sử đơn nghỉ phép/bảo lưu.
          </div>
        ) : (
          <div className="divide-y divide-border/40 max-h-[180px] overflow-y-auto pr-1">
            {studentHistory.map((item) => {
              const statusText = STATUS_LABELS[item.status] || item.status
              const typeText = TYPE_LABELS[item.type] || item.type
              return (
                <div key={item.id} className="py-2 first:pt-0 last:pb-0 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[10px] text-foreground">
                        {item.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        • {typeText}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-[9px] font-semibold px-1.5 py-0.2 rounded-full border',
                        getStatusBadgeClass(item.status)
                      )}
                    >
                      {statusText}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                    <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span>{item.startDate} {item.endDate && item.endDate !== item.startDate ? `→ ${item.endDate}` : ''}</span>
                  </div>

                  {item.reason && (
                    <p className="text-[10px] text-muted-foreground italic truncate">
                      {item.reason}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
