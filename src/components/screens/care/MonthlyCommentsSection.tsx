'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  ExternalLink,
  Copy,
  Pencil,
  Award,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { StudentMonthlyReportDialog } from '../classes/detail/StudentMonthlyReportDialog'
import type { RosterStudent } from '../classes/detail/classesDetailTypes'
import {
  getStudentMonthlyReports,
  type WeekReviewItem,
} from '@/mocks/monthlyReports'

export interface MonthlyCommentItem {
  id?: string
  month: string
  comment: string
  evaluator: string
  date: string
  monthTitle?: string
  dateStr?: string
  awardBadge?: string
  teacherName?: string
  sectionA1Content?: string
  sectionA2Content?: string
  sectionAContent?: string
  sectionB1Content?: string
  sectionB2StartLesson?: number
  sectionB2EndLesson?: number
  sectionB2Weeks?: WeekReviewItem[]
  sectionB2Content?: string
  sectionBContent?: string
  isCurrent?: boolean
  monthOptionValue?: string
}

interface MonthlyCommentsSectionProps {
  monthlyComments: MonthlyCommentItem[]
  onOpenEvaluationTab?: (month?: string) => void
  studentId?: string
  studentName?: string
  studentCode?: string
}

function getDisplayComment(mc: MonthlyCommentItem): string {
  if (mc.sectionA1Content) {
    const marker = 'Điểm nổi bật:'
    const idx = mc.sectionA1Content.indexOf(marker)
    if (idx !== -1) {
      const after = mc.sectionA1Content.substring(idx + marker.length).trim()
      const firstPeriod = after.indexOf('.')
      if (firstPeriod > 0) {
        return `Điểm nổi bật: ${after.substring(0, firstPeriod + 1).trim()}`
      }
      return `Điểm nổi bật: ${after.split('\n')[0].trim()}`
    }
    return mc.sectionA1Content.split('\n')[0]
  }
  if (mc.sectionAContent) {
    return mc.sectionAContent.split('\n')[0]
  }
  return mc.comment || 'Học viên học tập tích cực, hoàn thành tốt các bài tập rèn luyện.'
}

export function MonthlyCommentsSection({
  monthlyComments,
  studentId = 'HV-S4-10',
  studentName = 'Alex (Nguyễn An)',
  studentCode = 'HV-S4-10',
}: MonthlyCommentsSectionProps) {
  const [showAllHistory, setShowAllHistory] = useState(false)
  // State mở Modal Báo Cáo Tháng (chuẩn đồng bộ từ detail lớp: StudentMonthlyReportDialog)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [selectedReportMonthKey, setSelectedReportMonthKey] = useState<string>('4_5_2026')
  const [syncCounter, setSyncCounter] = useState(0)

  // Listen to global update event for monthly reports
  useEffect(() => {
    const handleReportUpdate = () => {
      setSyncCounter((c) => c + 1)
    }
    window.addEventListener('rinov5-monthly-reports-updated', handleReportUpdate)
    return () => {
      window.removeEventListener('rinov5-monthly-reports-updated', handleReportUpdate)
    }
  }, [])

  // Build merged comments list from direct props and latest mock store
  const commentsList = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    syncCounter
    const storeReports = getStudentMonthlyReports(studentId || studentName)
    if (storeReports && storeReports.length > 0) {
      return storeReports.map((r) => ({
        id: r.id,
        month: r.monthKey,
        monthOptionValue: r.monthOptionValue,
        monthTitle: r.monthTitle,
        dateStr: r.dateStr,
        awardBadge: r.awardBadge,
        teacherName: r.teacherName,
        comment: r.sectionA1Content
          ? (r.sectionA1Content.split('\n')[0] || r.sectionAContent || 'Đánh giá năng lực học tập')
          : (r.sectionAContent || 'Đánh giá năng lực học tập'),
        sectionA1Content: r.sectionA1Content,
        sectionA2Content: r.sectionA2Content,
        sectionAContent: r.sectionAContent,
        sectionB1Content: r.sectionB1Content,
        sectionB2StartLesson: r.sectionB2StartLesson,
        sectionB2EndLesson: r.sectionB2EndLesson,
        sectionB2Weeks: r.sectionB2Weeks,
        sectionB2Content: r.sectionB2Content,
        sectionBContent: r.sectionBContent,
        evaluator: r.teacherName,
        date: r.updatedAt.includes('-') ? r.updatedAt.split('-').reverse().join('/') : r.updatedAt,
        isCurrent: r.isCurrent,
      }))
    }
    return monthlyComments
  }, [monthlyComments, studentId, studentName, syncCounter])

  const handleOpenReport = (monthKeyOrValue?: string) => {
    setSelectedReportMonthKey(monthKeyOrValue || '4_5_2026')
    setIsReportDialogOpen(true)
  }

  const visibleComments = showAllHistory ? commentsList : commentsList.slice(0, 2)

  const rosterStudent: RosterStudent = useMemo(
    () => ({
      id: studentId,
      code: studentCode,
      name: studentName,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${studentName}`,
      status: 'active',
      gender: 'female',
      dob: '2018-05-15',
      parentName: 'Phụ huynh',
      parentPhone: '0912345678',
      enrolledDate: '2025-09-01',
      enrollmentDate: '2025-09-01',
      attendanceRate: 95,
      homeworkRate: 90,
      lastScore: 8.5,
    }),
    [studentId, studentCode, studentName]
  )

  if (!commentsList || commentsList.length === 0) return null

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3 select-none text-left overflow-hidden">
      {/* Header with soft background tint & Action button to open Create/Edit Form */}
      <div className="-mx-4 -mt-4 py-2.5 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground tracking-tight">
              Báo cáo Tháng của Học viên
            </h3>
            <p className="text-[11px] text-muted-foreground font-normal">
              Xem báo cáo gửi phụ huynh & chỉnh sửa báo cáo chuyên sâu qua cửa sổ modal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium bg-background px-2.5 py-1 rounded-full border border-border/60">
            {visibleComments.length} kỳ báo cáo
          </span>
        </div>
      </div>

      {/* List of Monthly Report Summary Cards (Compact, Direct Modal Opener) */}
      <div className="space-y-2.5">
        {visibleComments.map((mc, idx) => {
          const displayText = getDisplayComment(mc)

          return (
            <div
              key={mc.id || idx}
              className="p-3 rounded-xl border border-border/70 bg-card dark:bg-zinc-800/40 shadow-3xs hover:border-border transition-all text-xs space-y-2"
            >
              {/* Card Header Bar: Toàn bộ chỉ 1 dòng duy nhất */}
              <div className="flex items-center justify-between gap-2 flex-nowrap">
                <div className="flex items-center gap-2 min-w-0 truncate">
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : ''
                      const url = `${origin}/report/${studentId}?month=${encodeURIComponent(mc.monthOptionValue || mc.month)}`
                      window.open(url, '_blank')
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors shrink-0"
                    title={`Nhấp để mở Landing Page báo cáo ${mc.month}`}
                  >
                    <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{mc.month}</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </button>

                  {/* Current Month Badge */}
                  {(mc.isCurrent !== undefined ? mc.isCurrent : idx === 0) && (
                    <span
                      className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full border leading-none shrink-0',
                        getStatusBadgeClass('current')
                      )}
                    >
                      Hiện tại
                    </span>
                  )}

                  {/* Teacher / Evaluator */}
                  <span className="text-[11px] text-muted-foreground font-medium truncate">
                    GV: <strong className="text-foreground font-semibold">{mc.teacherName || mc.evaluator || 'Ms.Chloe'}</strong>
                  </span>
                </div>

                {/* Right Action Buttons: Xem & Sửa báo cáo trong modal + Sao chép link */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenReport(mc.monthOptionValue || mc.month)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors cursor-pointer shadow-3xs"
                    title={`Mở xem và chỉnh sửa báo cáo ${mc.month} trong modal`}
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Xem & sửa</span>
                  </button>

                  {/* Nút Copy Link Landing Page */}
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : ''
                      const link = `${origin}/report/${studentId}?month=${encodeURIComponent(mc.monthOptionValue || mc.month)}`
                      navigator.clipboard
                        .writeText(link)
                        .then(() => toast.success(`Đã sao chép liên kết Landing Page báo cáo ${mc.month}!`))
                        .catch(() => toast.error('Không thể sao chép liên kết.'))
                    }}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                    title={`Sao chép liên kết Landing Page báo cáo ${mc.month}`}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Phần nội dung: Chứa danh hiệu, thời gian & nhận xét */}
              <div
                onClick={() => handleOpenReport(mc.monthOptionValue || mc.month)}
                className="p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer border border-border/40 space-y-1.5"
                title="Nhấp để mở xem báo cáo trong modal"
              >
                {/* Ngôi sao, danh hiệu & khoảng thời gian đưa xuống đây */}
                {(mc.awardBadge || mc.dateStr) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {mc.awardBadge && (
                      <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 leading-none inline-flex items-center gap-1 shrink-0">
                        <Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                        <span>{mc.awardBadge}</span>
                      </span>
                    )}

                    {mc.dateStr && (
                      <span className="text-[10.5px] text-muted-foreground">
                        ({mc.dateStr})
                      </span>
                    )}
                  </div>
                )}

                <p className="text-[11.5px] italic text-muted-foreground/90 font-normal leading-relaxed line-clamp-2">
                  &ldquo;{displayText}&rdquo;
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Button xem thêm lịch sử các tháng trước */}
      {commentsList.length > 2 && (
        <div className="pt-2 text-center border-t border-border/40">
          <button
            type="button"
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted/30 hover:bg-muted/60 text-foreground border border-border/60 transition-all cursor-pointer shadow-3xs"
          >
            <span>
              {showAllHistory
                ? 'Thu gọn lịch sử báo cáo các tháng trước'
                : `Xem thêm lịch sử các tháng trước (${commentsList.length - 2} tháng cũ hơn)`}
            </span>
            {showAllHistory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {/* Modal Báo Cáo Tháng Chuyên Sâu (StudentMonthlyReportDialog - Chuẩn bản từ Chi tiết Lớp học) */}
      <StudentMonthlyReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        students={[rosterStudent]}
        initialStudentId={studentId}
        initialMonthKey={selectedReportMonthKey}
      />
    </div>
  )
}

