'use client'

import React, { useState } from 'react'
import { FileText, Copy, Pencil, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { type SemesterEvaluationData } from './StudentCareReportTab'

interface SimulatedReport {
  title: string
  date: string
  url: string
  packageId: string
  notes?: string
}

interface MonthlyReportsListProps {
  reports: SimulatedReport[]
  semesterEvaluations: SemesterEvaluationData[]
  pkg: SimulatedPackage
  selectedMonth: string
  setSelectedEvalMonth: (month: string) => void
  setSelectedEvalPkgId: (pkgId: string) => void
  setIsEvalOpen: (open: boolean) => void
  handleCopyLink: (url: string) => void
  handleOpenEditReportModal: (pkgId: string, report: { title: string; url: string }) => void
}

export function MonthlyReportsList({
  reports,
  semesterEvaluations,
  pkg,
  selectedMonth,
  setSelectedEvalMonth,
  setSelectedEvalPkgId,
  setIsEvalOpen,
  handleCopyLink,
  handleOpenEditReportModal
}: MonthlyReportsListProps) {
  const [showAllReports, setShowAllReports] = useState(false)
  const visibleReports = showAllReports ? reports : reports.slice(0, 2)

  return (
    <div className="space-y-3 pb-3 text-left">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-[11px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
          <FileText className="h-3.5 w-3.5 text-violet-500" />
          Báo cáo học tập & Đánh giá
        </h4>
        {reports.length > 0 && (
          <span className="text-[10px] text-muted-foreground font-normal">
            Hiển thị {visibleReports.length}/{reports.length} báo cáo
          </span>
        )}
      </div>

      {(reports.length > 0 || (semesterEvaluations && semesterEvaluations.length > 0)) ? (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Monthly Reports (2 báo cáo liền kề) */}
            {visibleReports.map((report, idx) => {
              const match = report.title.match(/Tháng\s+\d+\/\d+/i)
              const displayTitle = match?.[0] ? `Báo cáo ${match[0]}` : report.title
              return (
                <a
                  key={`report-${idx}`}
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 px-3 rounded-lg border border-violet-100 dark:border-violet-900/40 bg-violet-50/15 dark:bg-violet-950/5 hover:border-violet-400 dark:hover:border-violet-700 hover:bg-violet-50/60 dark:hover:bg-violet-950/20 transition-all text-[11px] group cursor-pointer h-full min-h-[52px] shadow-xs"
                >
                  <div className="min-w-0 flex items-center gap-2 flex-1">
                    <FileText className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                    <div className="min-w-0 flex flex-col text-left">
                      <span className="font-normal text-foreground truncate">{displayTitle}</span>
                      <span className="text-[9.5px] text-muted-foreground mt-0.5">{report.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {/* Hover Actions */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleCopyLink(report.url)
                        }}
                        title="Sao chép đường liên kết"
                        className="p-1 rounded hover:bg-violet-100 dark:hover:bg-violet-900/50 text-muted-foreground hover:text-violet-600 transition-colors cursor-pointer animate-in fade-in duration-200"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleOpenEditReportModal(pkg.id, report)
                        }}
                        title="Chỉnh sửa liên kết báo cáo"
                        className="p-1 rounded hover:bg-violet-100 dark:hover:bg-violet-900/50 text-muted-foreground hover:text-violet-600 transition-colors cursor-pointer animate-in fade-in duration-200"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>
                    {/* Default Link Icon */}
                    <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:hidden shrink-0 transition-colors" />
                  </div>
                </a>
              )
            })}

            {/* Semester Evaluations */}
            {semesterEvaluations && (() => {
              const evalsToShow = selectedMonth === 'all' ? semesterEvaluations : semesterEvaluations.slice(0, 1)
              return evalsToShow.map((evalItem, evalIdx) => (
                <div
                  key={`eval-${evalIdx}`}
                  onClick={() => {
                    setSelectedEvalMonth(evalItem.month)
                    setSelectedEvalPkgId(pkg.id)
                    setIsEvalOpen(true)
                  }}
                  className="py-1.5 px-2.5 rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/15 dark:bg-amber-950/5 hover:border-amber-400 dark:hover:border-amber-700 hover:bg-amber-50/60 dark:hover:bg-amber-950/20 flex flex-col justify-between gap-1.5 text-[11px] w-full cursor-pointer transition-all h-full min-h-[38px] shadow-xs"
                >
                  {/* Top: Title & Month inline */}
                  <div className="flex items-center gap-2 min-w-0 flex-1 w-full">
                    <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <div className="min-w-0 flex items-baseline justify-between flex-1">
                      <span className="font-normal text-foreground truncate">Đánh giá cuối kỳ</span>
                      <span className="text-[9px] text-muted-foreground ml-2 shrink-0">{evalItem.month}</span>
                    </div>
                  </div>

                  {/* Bottom: Scores in 4 columns */}
                  <div className="grid grid-cols-4 gap-1 text-[9px] font-normal w-full border-t border-amber-100/50 dark:border-amber-900/30 pt-1.5 mt-0.5 shrink-0 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[7.5px] uppercase tracking-wider text-muted-foreground">Ý thức</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">{evalItem.attitude}/5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7.5px] uppercase tracking-wider text-muted-foreground">K.thức</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">{evalItem.knowledge}/5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7.5px] uppercase tracking-wider text-muted-foreground">K.năng</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">{evalItem.skills}/5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7.5px] uppercase tracking-wider text-muted-foreground">T.tác</span>
                      <span className="font-semibold text-amber-700 dark:text-amber-400">{evalItem.interaction}/5</span>
                    </div>
                  </div>
                </div>
              ))
            })()}
          </div>

          {/* Toggle Expand/Collapse for Reports */}
          {reports.length > 2 && (
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => setShowAllReports(!showAllReports)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <span>
                  {showAllReports
                    ? 'Thu gọn báo cáo'
                    : `Xem thêm báo cáo tháng khác (${reports.length - 2} báo cáo)`}
                </span>
                {showAllReports ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground italic pl-1">
          Chưa có báo cáo học tập hay đánh giá cuối kỳ cho lớp học này.
        </p>
      )}
    </div>
  )
}
