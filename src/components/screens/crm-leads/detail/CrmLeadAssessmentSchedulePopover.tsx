'use client'

import React from 'react'
import {
  Clock,
  BookOpen,
  Award,
  MapPin,
  UserCheck,
  Link as LinkIcon,
  ExternalLink,
  Info,
} from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AppAvatar } from '@/components/shared'
import type { ChildPersonaItem, StudentSubjectItem } from './CrmLeadChildCard'

export interface CrmLeadAssessmentSchedulePopoverProps {
  student: ChildPersonaItem
  currentSubject: StudentSubjectItem
  isMathSubject?: boolean
  children: React.ReactNode
}

export function CrmLeadAssessmentSchedulePopover({
  student,
  currentSubject,
  isMathSubject,
  children,
}: CrmLeadAssessmentSchedulePopoverProps) {
  const timeDisplay = currentSubject.testTime
    ? `${currentSubject.testTime} - 18:30`
    : '18:00 - 18:30'

  const displayProgram =
    currentSubject.testProgram ||
    currentSubject.subjectName ||
    'Chương trình Tiếng Anh'

  const registeredLevel =
    currentSubject.testTargetLevel ||
    currentSubject.courseLevel ||
    (isMathSubject ? 'Toán tư duy Cấp độ 2' : 'Flyers Intensive Cấp độ 3')

  const assessedLevel =
    currentSubject.testLevel || (isMathSubject ? 'Level 2B' : 'Level 3A')
  const assessedSubLevel =
    currentSubject.testSubLevel || (isMathSubject ? 'Logic' : 'Movers')

  const branchDisplay =
    currentSubject.testBranch ||
    currentSubject.branch ||
    student.branch ||
    'RinoEdu Nguyễn Tuân'

  const teacherName =
    currentSubject.testTeacher ||
    (isMathSubject ? 'Thầy Quang Huy' : 'Cô Emma (CS)')

  const parentPhone =
    student.studentPhone && student.studentPhone !== '--'
      ? student.studentPhone
      : '0945456789'

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-80 p-0 overflow-hidden rounded-xl shadow-xl border border-border/80 bg-popover z-50 text-xs animate-in fade-in-0 zoom-in-95"
      >
        {/* Header Ribbon xanh mint chuẩn theo ảnh */}
        <div className="px-3.5 py-2 flex items-center justify-between border-b bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800 text-xs font-semibold">
          <div className="flex items-center gap-1.5 font-bold">
            <Clock className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span>{timeDisplay}</span>
          </div>
          <span className="inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            Trải nghiệm
          </span>
        </div>

        {/* Nội dung chi tiết thẻ */}
        <div className="p-3.5 space-y-2.5 text-xs">
          {/* Tên học viên & Trạng thái */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-bold text-sm text-foreground leading-tight">
                {student.name || 'Hoàng Nam'}
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {currentSubject.statusLabel || 'Hoàn tất'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              PH: Gia đình {student.name} ({parentPhone})
            </p>
          </div>

          {/* Dòng 1: Môn & Tên chương trình */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
            <span className="font-medium text-foreground/90 truncate">
              {currentSubject.subjectName} - Chương trình {displayProgram}
            </span>
          </div>

          {/* Dòng 2: Trình độ đăng ký kèm link */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Award className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-foreground/90">
              Trình độ:{' '}
              <a
                href={currentSubject.detailReportLink || '/app/booking_test'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-700 dark:text-emerald-400 underline hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{registeredLevel}</span>
                <ExternalLink className="h-3 w-3 inline" />
              </a>
            </span>
          </div>

          {/* Dòng 3: Cơ sở & Phòng học */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
            <span className="font-medium text-foreground truncate">
              {branchDisplay} - Phòng A3
            </span>
          </div>

          {/* Staff Section: PHỤ TRÁCH */}
          <div className="border-t border-border/50 pt-2 space-y-1 text-xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              PHỤ TRÁCH:
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Phụ trách:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AppAvatar name={teacherName} size="xs" />
                <span className="font-semibold text-foreground">{teacherName}</span>
              </div>
            </div>
          </div>

          {/* Result & Assessment Level Section */}
          <div className="border-t border-border/50 pt-2 space-y-1.5 text-xs">
            {/* Kết quả */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <LinkIcon className="h-3.5 w-3.5 shrink-0 text-sky-600 dark:text-sky-400" />
                <span className="text-foreground/90 font-medium">Kết quả:</span>
              </div>
              <a
                href={currentSubject.detailReportLink || '/app/booking_test'}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-sky-700 dark:text-sky-300 underline hover:text-sky-800 inline-flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="h-3 w-3 inline" />
                <span>Kết quả đánh giá</span>
              </a>
            </div>

            {/* Trình độ đánh giá */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <Award className="h-3.5 w-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
                <span className="text-foreground/90 font-medium">Trình độ đánh giá:</span>
              </div>
              <span className="font-bold text-purple-700 dark:text-purple-300">
                {assessedLevel} • {assessedSubLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="bg-muted/40 border-t border-border/60 px-3.5 py-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5">
          <Info className="h-3 w-3 text-muted-foreground/60 shrink-0" />
          <span>Nhấp vào thẻ để mở chi tiết &amp; thao tác</span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
