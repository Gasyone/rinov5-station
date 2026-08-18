'use client'

import React from 'react'
import {
  Calendar,
  Clock,
  MapPin,
  GraduationCap,
  User,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSlotTimeRange } from './bookingTestCreateTypes'

interface BookingTestCreateSummaryProps {
  dateLabel: string
  selectedSlot: string
  school: string
  program: string
  level: string
  studentName: string
  parentName: string
  phone: string
  teacherName: string
  teacherRole?: string
}

export function BookingTestCreateSummary({
  dateLabel,
  selectedSlot,
  school,
  program,
  level,
  studentName,
  parentName,
  phone,
  teacherName,
  teacherRole = 'Giáo viên',
}: BookingTestCreateSummaryProps) {
  const timeRange = getSlotTimeRange(selectedSlot, 30)
  const isAssigned = Boolean(teacherName)

  // Masking phone on display to comply with security rules
  const maskedPhone =
    phone && phone.length >= 7
      ? `${phone.slice(0, 3)}****${phone.slice(-3)}`
      : phone || '---'

  return (
    <div className="rounded-xl border border-border/80 bg-slate-50/70 dark:bg-zinc-900/50 p-3 shadow-2xs transition-all">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="uppercase tracking-wider text-[11px]">Tóm tắt ca test đã chọn</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium bg-background px-2 py-0.5 rounded-full border border-border/60">
          Thời lượng: 30 phút
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {/* Lịch test */}
        <div className="flex items-start gap-2 min-w-0">
          <Calendar className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block font-medium">Lịch đánh giá</span>
            <p className="font-semibold text-foreground truncate">
              {dateLabel} • <span className="text-primary font-bold">{timeRange}</span>
            </p>
          </div>
        </div>

        {/* Địa điểm & Chương trình */}
        <div className="flex items-start gap-2 min-w-0">
          <MapPin className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block font-medium">Cơ sở & Chương trình</span>
            <p className="font-semibold text-foreground truncate" title={`${school} • ${program} (${level})`}>
              {school} • {level || program}
            </p>
          </div>
        </div>

        {/* Học viên & Phụ huynh */}
        <div className="flex items-start gap-2 min-w-0">
          <User className="h-3.5 w-3.5 text-teal-600 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block font-medium">Học viên & Phụ huynh</span>
            <p className="font-semibold text-foreground truncate" title={`${studentName} (PH: ${parentName} - ${maskedPhone})`}>
              {studentName} <span className="font-normal text-muted-foreground">({parentName} - {maskedPhone})</span>
            </p>
          </div>
        </div>

        {/* Người phụ trách */}
        <div className="flex items-start gap-2 min-w-0">
          <GraduationCap className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-muted-foreground block font-medium">Nhân sự phụ trách</span>
            {isAssigned ? (
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-foreground truncate">{teacherName}</span>
                <span
                  className={cn(
                    'text-[9px] px-1.5 py-0.2 rounded font-semibold border shrink-0',
                    teacherRole === 'CS'
                      ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      : teacherRole === 'Khác'
                      ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                  )}
                >
                  {teacherRole}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <AlertCircle className="h-3 w-3 shrink-0" />
                <span className="truncate">Chưa gán (Phân công sau)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
