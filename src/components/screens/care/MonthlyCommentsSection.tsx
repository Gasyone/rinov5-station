'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { StudentMonthlyReportLandingDialog } from '../classes/detail/StudentMonthlyReportLandingDialog'

export interface MonthlyCommentItem {
  month: string
  comment: string
  evaluator: string
  date: string
  monthTitle?: string
  dateStr?: string
  awardBadge?: string
  teacherName?: string
  sectionAContent?: string
  sectionBContent?: string
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
  onOpenEvaluationTab,
  studentId = 'HV-S4-10',
  studentName = 'Alex (Nguyễn An)',
  studentCode = 'HV-S4-10',
}: MonthlyCommentsSectionProps) {
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({})
  const [selectedLandingReport, setSelectedLandingReport] = useState<MonthlyCommentItem | null>(null)
  const [isLandingOpen, setIsLandingOpen] = useState(false)

  if (!monthlyComments || monthlyComments.length === 0) return null

  const toggleExpand = (idx: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  const handleOpenLanding = (mc: MonthlyCommentItem) => {
    setSelectedLandingReport(mc)
    setIsLandingOpen(true)
  }

  const visibleComments = showAllHistory ? monthlyComments : monthlyComments.slice(0, 2)

  const getDisplayComment = (mc: MonthlyCommentItem): string => {
    if (mc.sectionAContent) {
      const obsMarker = 'QUAN SÁT TRONG QUÁ TRÌNH HỌC CỦA GIÁO VIÊN:'
      const obsIndex = mc.sectionAContent.indexOf(obsMarker)
      if (obsIndex !== -1) {
        const extracted = mc.sectionAContent.substring(obsIndex + obsMarker.length).trim()
        if (extracted) return extracted
      }
    }
    return mc.comment
  }

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 select-none text-left overflow-hidden">
      {/* Header with soft background tint */}
      <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
        <h3 className="text-xs font-bold text-foreground tracking-tight">
          Báo cáo Tháng của Học viên
        </h3>
        <span className="text-[10px] text-muted-foreground font-normal">
          Hiển thị {visibleComments.length}/{monthlyComments.length} báo cáo tháng
        </span>
      </div>

      {/* List of Monthly Comments Cards */}
      <div className="space-y-2.5">
        {visibleComments.map((mc, idx) => {
          const isExpanded = !!expandedComments[idx]
          const displayText = getDisplayComment(mc)

          return (
            <div
              key={idx}
              className="p-3 rounded-xl border border-border/50 bg-muted/15 dark:bg-zinc-800/30 hover:border-border/80 transition-all text-xs space-y-2"
            >
              {/* Row 1: Nhãn Tháng (textlink click mở landing page modal) + Award Badge + Icon Copy link */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleOpenLanding(mc)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer transition-colors"
                    title={`Báo cáo ${mc.month} - Nhấp để xem Landing Page báo cáo tháng`}
                  >
                    <span>{mc.month}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </button>

                  {mc.awardBadge && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 leading-none">
                      🏆 {mc.awardBadge}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      const link = `https://rinoedu.vn/app/care/reports?student=${studentId}&month=${encodeURIComponent(mc.month)}`
                      navigator.clipboard.writeText(link)
                        .then(() => toast.success(`Đã sao chép liên kết báo cáo ${mc.month}!`))
                        .catch(() => toast.error('Không thể sao chép liên kết.'))
                    }}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                    title={`Sao chép liên kết báo cáo ${mc.month}`}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Row 2: Nội dung nhận xét với toggle Xem thêm / Thu gọn */}
              <div
                onClick={() => toggleExpand(idx)}
                className="flex items-start justify-between gap-2 cursor-pointer group/cmt hover:opacity-90 transition-opacity pt-0.5"
                title={isExpanded ? 'Nhấp để thu gọn' : 'Nhấp để xem đầy đủ báo cáo'}
              >
                <p
                  className="text-[11.5px] italic text-muted-foreground/90 font-normal leading-relaxed flex-1"
                  style={
                    !isExpanded
                      ? {
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }
                      : undefined
                  }
                >
                  &ldquo;{displayText}&rdquo;
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpand(idx)
                  }}
                  className="text-[10px] text-muted-foreground group-hover/cmt:text-foreground flex items-center gap-0.5 shrink-0 pt-0.5 font-semibold transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Button xem thêm lịch sử các tháng trước */}
      {monthlyComments.length > 2 && (
        <div className="pt-2 text-center border-t border-border/40">
          <button
            type="button"
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted/30 hover:bg-muted/60 text-foreground border border-border/60 transition-all cursor-pointer shadow-3xs"
          >
            <span>
              {showAllHistory
                ? 'Thu gọn lịch sử báo cáo các tháng trước'
                : `Xem thêm lịch sử các tháng trước (${monthlyComments.length - 2} tháng cũ hơn)`}
            </span>
            {showAllHistory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      {/* Modal Landing Page Báo Cáo Tháng */}
      {selectedLandingReport && (
        <StudentMonthlyReportLandingDialog
          open={isLandingOpen}
          onOpenChange={setIsLandingOpen}
          student={{
            id: studentId,
            name: studentName,
            code: studentCode,
            status: 'active',
            dob: '01/01/2015',
            parentName: 'Phụ huynh',
            parentPhone: '0912345678',
            enrollmentDate: '01/01/2026',
          }}
          monthTitle={
            selectedLandingReport.monthTitle ||
            `BÁO CÁO HỌC TẬP CHUYÊN SÂU ${selectedLandingReport.month.toUpperCase()} VÀ KẾ HOẠCH HỌC TẬP THÁNG TỚI`
          }
          dateStr={selectedLandingReport.dateStr || '01/09/2026 đến 30/09/2026'}
          awardBadge={selectedLandingReport.awardBadge || 'CHIẾN BINH BỨT PHÁ'}
          teacherName={selectedLandingReport.teacherName || selectedLandingReport.evaluator || 'Teacher Mark & Ms.Chloe'}
          sectionAContent={selectedLandingReport.sectionAContent}
          sectionBContent={selectedLandingReport.sectionBContent}
        />
      )}
    </div>
  )
}
