'use client'

import { useMemo } from 'react'
import {
  Clock,
  ShieldCheck,
  CheckCircle2,
  History,
  User,
  GraduationCap,
  MapPin,
  Phone,
} from 'lucide-react'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import type { Student } from '@/mocks/students'
import { STATUS_LABELS, type LeaveReservePackageItem } from './leaveReserveTypes'
import { cn } from '@/lib/utils'

interface LeaveReservePolicyPanelProps {
  type: 'off' | 'reservation'
  student?: Student
  studentId?: string
  studentName?: string
  packageName?: string
  remainingSessions?: number
  totalSessions?: number
  activePackageTab?: string
  activePackage?: LeaveReservePackageItem
}

export function LeaveReservePolicyPanel({
  type,
  student,
  studentId,
  studentName,
  packageName,
  remainingSessions,
  totalSessions,
  activePackageTab,
  activePackage,
}: LeaveReservePolicyPanelProps) {
  const currentStudentId = student?.id || studentId
  const currentStudentName = student?.name || studentName

  const displayPackageName =
    activePackage?.packageName || packageName || student?.packageName || 'Toán Tư Duy 1:6 (96 buổi)'
  const displayRemainingSessions =
    activePackage?.remainingSessions ?? remainingSessions ?? student?.remainingSessions ?? 12
  const displayTotalSessions =
    activePackage?.totalSessions ?? totalSessions ?? student?.totalSessions ?? 96

  // Get history of leave/reserve for this student (filtered by package if activePackageTab !== 'all')
  const studentHistory = useMemo(() => {
    if (!currentStudentId && !currentStudentName) return []
    let list = mockLeaveReserveRequests.filter((r) => {
      const matchesId =
        (currentStudentId && r.studentId === currentStudentId) ||
        (currentStudentId === 'bao-han' && r.studentId === 's-baohan') ||
        (currentStudentId === 's-baohan' && r.studentId === 's-baohan')
      const matchesName = currentStudentName && r.studentName === currentStudentName
      return matchesId || matchesName
    })

    if (activePackageTab && activePackageTab !== 'all') {
      list = list.filter((r) => !r.classCode || r.classCode === activePackageTab)
    }

    return list.sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
  }, [currentStudentId, currentStudentName, activePackageTab])

  // Format date display: Thứ, ngày/tháng, giờ (bỏ năm)
  const formatLeaveDateTimeDisplay = (dateStr: string, timeStr = '17:30 - 19:30') => {
    if (!dateStr) return '---'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    const dayName = days[d.getDay()] || ''
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    return `${dayName}, ${dd}/${mm} · ${timeStr}`
  }

  return (
    <div className="space-y-3 md:col-span-5 flex flex-col justify-start">
      {/* SECTION 1: Thông tin học viên & Gói học (Viết hoa chữ cái đầu, không in đậm) */}
      {student && (
        <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
            <div className="flex items-center gap-1.5 font-normal text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Học viên & gói học</span>
            </div>
            <span className="font-mono text-[11px] font-normal text-muted-foreground bg-background px-1.5 py-0.2 rounded border">
              {student.id === 's-baohan' ? '10700325' : student.id}
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-normal">
            {/* Student Name */}
            <div>
              <span className="font-medium text-foreground text-sm">
                {student.name}
              </span>
              {student.englishName && (
                <span className="text-muted-foreground ml-1 text-xs font-normal">
                  ({student.englishName})
                </span>
              )}
            </div>

            {/* Gói học: Hiển thị thông tin gói đang chọn */}
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <GraduationCap className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span className="text-foreground font-normal truncate">
                {displayPackageName}
              </span>
            </div>

            {/* Parent & Phone */}
            {student.parentName && (
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40 text-muted-foreground">
                <span>PH: <span className="text-foreground">{student.parentName}</span></span>
                {student.parentPhone && (
                  <span className="flex items-center gap-1 font-mono text-foreground font-normal">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {student.parentPhone}
                  </span>
                )}
              </div>
            )}

            {/* Branch & Remaining Sessions */}
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/40 text-muted-foreground">
              <span className="flex items-center gap-1 truncate max-w-[150px]">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="truncate">{student.branch}</span>
              </span>
              <span className="font-normal text-emerald-700 dark:text-emerald-400">
                Còn {displayRemainingSessions}/{displayTotalSessions} buổi
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Lịch sử nghỉ phép của học viên (Viết hoa chữ cái đầu, không in đậm) */}
      <div className="rounded-xl border border-border/80 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
          <div className="flex items-center gap-1.5 font-normal text-xs text-muted-foreground">
            <History className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>Lịch sử nghỉ phép</span>
          </div>
          <span className="text-[11px] font-normal bg-muted px-2 py-0.2 rounded-full border text-muted-foreground font-mono">
            {studentHistory.length} đơn
          </span>
        </div>

        {studentHistory.length === 0 ? (
          <div className="text-center py-2.5 text-muted-foreground text-xs font-normal">
            Học viên chưa có lịch sử đơn nghỉ phép.
          </div>
        ) : (
          <div className="divide-y divide-border/40 max-h-[170px] overflow-y-auto pr-1">
            {studentHistory.map((item) => {
              const statusText = STATUS_LABELS[item.status] || item.status
              const dateTimeDisplay = formatLeaveDateTimeDisplay(item.startDate)

              return (
                <div key={item.id} className="py-2 first:pt-0 last:pb-0 text-xs space-y-1 font-normal">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono font-medium text-xs text-sky-600 dark:text-sky-400 shrink-0">
                        {item.id}
                      </span>
                      <span className="text-muted-foreground text-[11px] font-normal truncate">
                        · {dateTimeDisplay}
                      </span>
                    </div>
                    <span
                      className={cn(
                        'text-[10px] font-normal px-2 py-0.2 rounded-full border shrink-0',
                        getStatusBadgeClass(item.status)
                      )}
                    >
                      {statusText}
                    </span>
                  </div>

                  {/* Reason */}
                  {item.reason && (
                    <p className="text-[11px] text-muted-foreground italic truncate font-normal">
                      Lý do: {item.reason}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: Quy định chính sách (Viết hoa chữ cái đầu, không in đậm) */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center gap-1.5 pb-1.5 border-b border-border/40">
          <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
          <h4 className="font-normal text-xs text-muted-foreground">
            {type === 'reservation' ? 'Chính sách bảo lưu [RS-TCSM]' : 'Quy định nghỉ phép & học bù'}
          </h4>
        </div>

        {type === 'reservation' ? (
          <div className="space-y-2 text-xs text-muted-foreground font-normal">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-sky-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Điều kiện: Còn tối thiểu 16 buổi học (không áp dụng học bổng 100%).
              </p>
            </div>
            <div className="space-y-0.5 pt-1 border-t border-border/40 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-normal flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  1. Bảo lưu giữ chỗ (trong lớp)
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 font-normal px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                  Không trừ phí
                </span>
              </div>
              <ul className="space-y-0.5 pl-3.5 list-disc text-muted-foreground font-normal">
                <li>Toán: Tối đa 04 buổi | Tiếng Anh: Tối đa 08 buổi.</li>
                <li>Vẫn ở trong lớp; hết hạn tự động chạy phí tiếp.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5 text-xs text-muted-foreground font-normal">
            <div className="flex items-start gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed font-normal">
                Thời hạn báo: Gửi trước giờ ca học tối thiểu 02 tiếng để được tính vắng có phép.
              </p>
            </div>
            <div className="space-y-1 pt-1 border-t border-border/40 text-[11px] leading-relaxed font-normal">
              <div className="flex items-start gap-1.5">
                <span className="text-amber-600">•</span>
                <div>
                  Hạn mức vắng (Quota): Tối đa 12 buổi/năm học được học bù.
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-600">•</span>
                <div>
                  Học bù: Sau khi đơn được duyệt, học viên đăng ký tại phân hệ Lịch học bù.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
