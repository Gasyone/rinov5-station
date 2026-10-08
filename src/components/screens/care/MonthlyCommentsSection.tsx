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
import { Button } from '@/components/ui/button'
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
  subject?: string
}


export function MonthlyCommentsSection({
  monthlyComments,
  studentId = 'HV-S4-10',
  studentName = 'Alex (Nguyễn An)',
  studentCode = 'HV-S4-10',
  subject,
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
    const storeReports = getStudentMonthlyReports(studentId, studentName)
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
          : (r.sectionAContent || 'Chưa có nhận xét - Bấm để điền báo cáo'),
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
    if (monthlyComments && monthlyComments.length > 0) {
      return monthlyComments
    }
    // Fallback: nếu chưa có báo cáo nào, vẫn luôn hiển thị kỳ hiện tại (Tháng 4/2026) để người dùng có thể bấm vào tạo/sửa
    return [
      {
        id: `draft-${studentId}-4_5_2026`,
        month: 'Tháng 4/2026',
        monthOptionValue: '4_5_2026',
        monthTitle: 'BÁO CÁO HỌC TẬP THÁNG 4 VÀ KẾ HOẠCH HỌC TẬP THÁNG 5',
        dateStr: '01/04/2026 đến 30/04/2026',
        awardBadge: '',
        teacherName: 'Ms.Chloe',
        comment: 'Chưa có nhận xét - Bấm "Xem & sửa" để cập nhật báo cáo',
        sectionA1Content: '',
        sectionA2Content: '',
        sectionAContent: '',
        sectionB1Content: '',
        sectionB2StartLesson: undefined,
        sectionB2EndLesson: undefined,
        sectionB2Weeks: [],
        evaluator: 'Ms.Chloe',
        date: '28/04/2026',
        isCurrent: true,
      },
    ]
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

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-xl p-2.5 shadow-2xs space-y-2 select-none text-left overflow-hidden">
      {/* Header with soft background tint */}
      <div className="-mx-2.5 -mt-2.5 py-1.5 px-3 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap mb-1.5">
        <div>
          <h3 className="text-xs font-semibold text-foreground tracking-tight">
            Báo cáo tháng của học viên
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground font-normal">
            Hiển thị {visibleComments.length}/{commentsList.length} kỳ báo cáo
          </span>
          {commentsList.length > 1 && (
            <>
              <span className="text-border/80">•</span>
              <button
                type="button"
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="inline-flex items-center gap-1 text-[11px] font-normal text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <span>
                  {showAllHistory ? 'Thu gọn' : `Xem thêm (${commentsList.length - 1} kỳ)`}
                </span>
                {showAllHistory ? (
                  <ChevronUp className="h-3 w-3 text-muted-foreground stroke-[1.5]" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-muted-foreground stroke-[1.5]" />
                )}
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
              className="p-2 sm:px-2.5 rounded-lg border border-border/50 bg-muted/15 dark:bg-zinc-800/25 hover:bg-muted/30 hover:border-border/80 transition-colors text-xs"
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
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer transition-colors shrink-0"
                    title={`Nhấp để mở Landing Page báo cáo ${mc.month}`}
                  >
                    <span>{mc.month}</span>
                    <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
                  </button>

                  {/* Current Month Badge */}
                  {(mc.isCurrent !== undefined ? mc.isCurrent : idx === 0) && (
                    <span
                      className={cn(
                        'text-[10.5px] font-normal px-2 py-0.5 rounded-full border leading-none shrink-0',
                        getStatusBadgeClass('current')
                      )}
                    >
                      Hiện tại
                    </span>
                  )}

                  {/* Draft Badge if report is empty */}
                  {!mc.sectionA1Content && !mc.sectionAContent && (
                    <span className="text-[10.5px] font-normal px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 leading-none shrink-0">
                      Bản dự thảo
                    </span>
                  )}

                  {/* Danh hiệu (Award Badge) đưa lên header */}
                  {mc.awardBadge && (
                    <span className="text-[10.5px] font-normal px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 leading-none inline-flex items-center gap-1 shrink-0">
                      <Award className="h-3 w-3 text-amber-600 dark:text-amber-400 stroke-[1.5]" />
                      <span>{mc.awardBadge}</span>
                    </span>
                  )}

                  {/* Teacher / Evaluator */}
                  <span className="text-[11px] text-muted-foreground font-normal shrink-0">
                    GV: <span className="text-foreground font-normal">{mc.teacherName || mc.evaluator || 'Ms.Chloe'}</span>
                  </span>
                </div>

                {/* Right Action Buttons: Xem & Sửa báo cáo trong modal + Sao chép link */}
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReport(mc.monthOptionValue || mc.month)}
                    className="h-6 px-2 text-[11px] font-normal text-primary border-primary/30 hover:bg-primary/10 gap-1 cursor-pointer shadow-3xs"
                    title={`Mở xem và chỉnh sửa báo cáo ${mc.month} trong modal`}
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Xem & sửa</span>
                  </Button>

                  {/* Nút Copy Link Landing Page */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const origin = typeof window !== 'undefined' ? window.location.origin : ''
                      const link = `${origin}/report/${studentId}?month=${encodeURIComponent(mc.monthOptionValue || mc.month)}`
                      navigator.clipboard
                        .writeText(link)
                        .then(() => toast.success(`Đã sao chép liên kết Landing Page báo cáo ${mc.month}!`))
                        .catch(() => toast.error('Không thể sao chép liên kết.'))
                    }}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                    title={`Sao chép liên kết Landing Page báo cáo ${mc.month}`}
                  >
                    <Copy className="h-3 w-3 stroke-[1.5]" />
                  </Button>
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
        subject={subject}
      />
    </div>
  )
}

