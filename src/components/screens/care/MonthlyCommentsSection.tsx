'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  ExternalLink,
  Copy,
  Pencil,
  Award,
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

  const visibleComments = showAllHistory ? commentsList : commentsList.slice(0, 1)

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
      {/* Header with soft background tint */}
      <div className="-mx-4 -mt-4 py-2.5 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-xs font-bold text-foreground tracking-tight">
            Báo cáo Tháng của Học viên
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-normal">
            Hiển thị {visibleComments.length}/{commentsList.length} kỳ báo cáo
          </span>
          {commentsList.length > 1 && (
            <>
              <span className="text-border">•</span>
              <button
                type="button"
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <span>
                  {showAllHistory
                    ? 'Thu gọn'
                    : `Xem thêm (${commentsList.length - 1} tháng cũ hơn)`}
                </span>
                {showAllHistory ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* List of Monthly Report Summary Cards (Compact, Direct Modal Opener) */}
      <div className="space-y-1.5 pt-0.5">
        {visibleComments.map((mc, idx) => {
          return (
            <div
              key={mc.id || idx}
              className="p-2.5 rounded-xl border border-transparent bg-transparent hover:border-border/70 hover:bg-muted/30 dark:hover:bg-zinc-800/40 transition-all text-xs"
            >
              {/* Card Header Bar: Toàn bộ chỉ 1 dòng duy nhất */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : ''
                      const url = `${origin}/report/${studentId}?month=${encodeURIComponent(mc.monthOptionValue || mc.month)}`
                      window.open(url, '_blank')
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors shrink-0"
                    title={`Nhấp để mở Landing Page báo cáo ${mc.month}`}
                  >
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

                  {/* Danh hiệu (Award Badge) đưa lên header */}
                  {mc.awardBadge && (
                    <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 leading-none inline-flex items-center gap-1 shrink-0">
                      <Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span>{mc.awardBadge}</span>
                    </span>
                  )}

                  {/* Teacher / Evaluator */}
                  <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                    GV: <strong className="text-foreground font-semibold">{mc.teacherName || mc.evaluator || 'Ms.Chloe'}</strong>
                  </span>
                </div>

                {/* Right Action Buttons: Xem & Sửa báo cáo trong modal + Sao chép link */}
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
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
            </div>
          )
        })}
      </div>



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

