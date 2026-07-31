'use client'

import React from 'react'
import { ChevronDown, FileText, Copy, Pencil, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/shared'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { type SessionHistory } from './StudentCareReportTab'
import { type SemesterEvaluationData } from './StudentCareReportTab'

interface SimulatedReport {
  title: string
  date: string
  url: string
  packageId: string
  notes?: string
}

interface HistoricalClassesListProps {
  classDataForPackages: Array<{
    pkg: SimulatedPackage
    isEnglish: boolean
    regularSessions: SessionHistory[]
    testSessions: SessionHistory[]
    semesterEvaluations: SemesterEvaluationData[]
    reports: SimulatedReport[]
  }>
  activePackageId: string
  expandedPackageIds: Record<string, boolean>
  togglePackage: (pkgId: string) => void
  handleCopyLink: (url: string) => void
  handleOpenEditReportModal: (pkgId: string, report: { title: string; url: string }) => void
  setSelectedEvalMonth: (month: string) => void
  setSelectedEvalPkgId: (pkgId: string) => void
  setIsEvalOpen: (open: boolean) => void
  selectedMonth: string
}

export function HistoricalClassesList({
  classDataForPackages,
  activePackageId,
  expandedPackageIds,
  togglePackage,
  handleCopyLink,
  handleOpenEditReportModal,
  setSelectedEvalMonth,
  setSelectedEvalPkgId,
  setIsEvalOpen,
  selectedMonth,
}: HistoricalClassesListProps) {
  const historicalPackages = classDataForPackages.filter(({ pkg }) => pkg.id !== activePackageId)

  if (historicalPackages.length === 0) return null

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-1 px-1 shrink-0 select-none">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Lịch sử các lớp học trước đó
        </h2>
      </div>

      <div className="space-y-4">
        {historicalPackages.map(({ pkg, regularSessions, testSessions, semesterEvaluations, reports }) => {
          const isOpen = expandedPackageIds[pkg.id] ?? false
          const isPending = pkg.status === 'pending'

          return (
            <div key={pkg.id} className="border border-border/80 rounded-xl overflow-hidden bg-background shadow-sm">
              {/* Collapsible Header */}
              <button
                type="button"
                onClick={() => togglePackage(pkg.id)}
                className="w-full flex items-center justify-between p-3.5 bg-muted/10 hover:bg-muted/20 transition-colors text-left select-none border-b border-border/40 cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-foreground truncate">
                      Lớp học: {pkg.className}
                    </h3>
                    <span className="font-mono text-[9.5px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {pkg.classCode}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Trình độ: <span className="font-medium text-foreground">{pkg.level} &mdash; Level {pkg.subLevel}</span> &bull; Lịch học: <span className="font-medium text-foreground">{pkg.schedule}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-250 shrink-0",
                    isOpen && "rotate-180"
                  )} />
                </div>
              </button>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="p-4 space-y-4 bg-background/50 border-t border-border/40">
                  {/* Reports Section inside Class */}
                  <div className="space-y-3 pb-3 text-left">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-[11px] font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                        <FileText className="h-3.5 w-3.5 text-violet-500" />
                        Báo cáo học tập
                      </h4>
                    </div>

                    {/* Combined reports and semester evaluations section */}
                    {(reports.length > 0 || (semesterEvaluations && semesterEvaluations.length > 0)) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {/* Monthly Reports */}
                        {reports.map((report, idx) => {
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
                        {semesterEvaluations && semesterEvaluations.map((evalItem, evalIdx) => (
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
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic pl-1">
                        Chưa có báo cáo học tập hay đánh giá cuối kỳ cho lớp học này.
                      </p>
                    )}
                  </div>

                  {isPending && (
                    <div className="py-10 text-center select-none flex flex-col items-center justify-center">
                      <EmptyState
                        title="Chương trình học chờ kích hoạt"
                        description="Chương trình học này chưa bắt đầu. Hiện chưa có lịch sử học tập."
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
