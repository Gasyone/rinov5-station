'use client'

import React, { useState } from 'react'
import {
  ChevronDown,
  FileText,
  ExternalLink,
  Calendar,
  GraduationCap,
  ClipboardList,
  Clock,
  UserCheck,
  ArrowRightLeft,
  Snowflake,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/shared'
import { HistoricalReportsDialog, type HistoricalReportItem } from './HistoricalReportsDialog'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { type SessionHistory } from './StudentCareReportTab'
import { type SemesterEvaluationData } from './StudentCareReportTab'
import { type StudentCareAlert } from '@/mocks/careAlerts'

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
  handleOpenEditReportModal?: (pkgId: string, report: { title: string; url: string }) => void
  setSelectedEvalMonth?: (month: string) => void
  setSelectedEvalPkgId?: (pkgId: string) => void
  setIsEvalOpen?: (open: boolean) => void
  selectedMonth?: string
  branchName?: string
  studentAlert?: StudentCareAlert | null
  onOpenAttendance?: (data: {
    regularSessions: SessionHistory[]
    testSessions: SessionHistory[]
    className: string
    classCode: string
    packageId?: string
    isHistorical?: boolean
  }) => void
  onOpenLeaveReserveDialog?: () => void
}

function getHistoricalTeacherInfo(pkg: SimulatedPackage, isEnglish: boolean) {
  if (pkg.id === 'pkg-2') {
    return {
      main: 'Phạm Thị Toán',
      role: 'GV Toán tư duy',
      assistant: 'Nguyễn Văn Minh (TA)',
    }
  }
  if (pkg.id === 'pkg-3') {
    return {
      main: isEnglish ? 'Sarah Smith' : 'Bùi Văn Anh',
      role: isEnglish ? 'Giáo viên Bản ngữ' : 'Giáo viên chính',
      assistant: 'Hoàng Anh (TA)',
    }
  }
  return {
    main: isEnglish ? 'Sarah Smith' : 'Hoàng Thị Mai',
    role: isEnglish ? 'Giáo viên Tiếng Anh' : 'Giáo viên Toán tư duy',
    assistant: 'Hoàng Anh (TA)',
  }
}

function getHistoricalDates(pkg: SimulatedPackage) {
  if (pkg.startDate && pkg.endDate) {
    const s = pkg.startDate.includes('-') ? pkg.startDate.split('-').reverse().join('/') : pkg.startDate
    const e = pkg.endDate.includes('-') ? pkg.endDate.split('-').reverse().join('/') : pkg.endDate
    return `${s} - ${e}`
  }
  if (pkg.id === 'pkg-3') return '01/10/2025 - 31/03/2026'
  if (pkg.id === 'pkg-2') return '15/07/2025 - 15/01/2026'
  return '01/08/2025 - 15/02/2026'
}

export function HistoricalClassesList({
  classDataForPackages,
  activePackageId,
  expandedPackageIds,
  togglePackage,
  handleCopyLink,
  branchName = 'RinoEdu Nguyễn Tuân',
  studentAlert,
  onOpenAttendance,
  onOpenLeaveReserveDialog,
}: HistoricalClassesListProps) {
  const [showAllHistory, setShowAllHistory] = useState(false)
  const [viewingReportsModal, setViewingReportsModal] = useState<{
    className: string
    classCode: string
    items: HistoricalReportItem[]
  } | null>(null)

  const historicalPackages = classDataForPackages.filter(({ pkg }) => pkg.id !== activePackageId)

  if (historicalPackages.length === 0) return null

  const visibleHistoricalPackages = showAllHistory ? historicalPackages : historicalPackages.slice(0, 2)

  const isGlobalPendingTransfer =
    studentAlert?.status === 'Chờ chuyển lớp' ||
    (studentAlert?.status as string) === 'pending_transfer' ||
    studentAlert?.realtimeStatus === 'Chờ chuyển lớp'

  const isGlobalReserved =
    studentAlert?.status === 'Hết buổi' && studentAlert?.careAlert?.toLowerCase().includes('bảo lưu') ||
    (studentAlert?.status as string) === 'reserve' ||
    (studentAlert?.status as string) === 'Bảo lưu'

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1 shrink-0 select-none">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Lịch sử các lớp học trước đó</span>
          <span className="text-[10px] font-semibold text-muted-foreground/70 bg-muted px-1.5 py-0.2 rounded-full">
            {historicalPackages.length} lớp
          </span>
        </h2>
        {historicalPackages.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAllHistory(prev => !prev)}
            className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
          >
            {showAllHistory ? 'Thu gọn' : `Xem tất cả (${historicalPackages.length})`}
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {visibleHistoricalPackages.map(({ pkg, isEnglish: pkgIsEnglish, regularSessions, testSessions, reports }) => {
          const isOpen = expandedPackageIds[pkg.id] ?? false
          const isPending = pkg.status === 'pending'
          const teacher = getHistoricalTeacherInfo(pkg, pkgIsEnglish)
          const dateRange = getHistoricalDates(pkg)
          const totalSessions = pkg.totalSessions || 24
          const usedSessions = totalSessions - (pkg.remainingSessions || 0)

          // Determine class status in history
          const isTransferredClass = (pkg.status as string) === 'pending_transfer' || (isGlobalPendingTransfer && pkg.id === 'pkg-2')
          const isReservedClass = (pkg.status as string) === 'reserve' || (isGlobalReserved && pkg.id === 'pkg-3')

          // Danh sách báo cáo học tập tháng của lớp cũ (lớp cũ không có đánh giá định kỳ)
          const reportItems: HistoricalReportItem[] = (reports || []).map((r, i) => {
            const match = r.title.match(/Tháng\s+\d+\/\d+/i)
            return {
              id: `rep-${pkg.id}-${i}`,
              monthBadge: match ? match[0] : 'Báo cáo',
              title: r.title,
              date: r.date.replace(/^Cập nhật:\s*/i, ''),
              teacherName: teacher.main,
              url: r.url,
            }
          })

          return (
            <div
              key={pkg.id}
              className="border border-border/80 rounded-xl overflow-hidden bg-background shadow-xs transition-all hover:border-border"
            >
              {/* Collapsible Header */}
              <button
                type="button"
                onClick={() => togglePackage(pkg.id)}
                className="w-full flex items-center justify-between p-3.5 bg-muted/10 hover:bg-muted/20 transition-colors text-left select-none border-b border-border/40 cursor-pointer"
              >
                <div className="min-w-0 flex-1 pr-3 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap leading-tight">
                    <h3 className="text-xs font-bold text-foreground truncate">
                      Lớp học: {pkg.className}
                    </h3>
                    <span className="font-mono text-[9.5px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {pkg.classCode}
                    </span>
                  </div>

                  {/* Subline: Thời gian học • Trình độ • Giáo viên */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <span className="font-medium text-foreground/85">{dateRange}</span>
                    <span className="text-border">•</span>
                    <span>
                      Trình độ: <strong className="text-foreground/90 font-semibold">{pkg.level} — Level {pkg.subLevel}</strong>
                    </span>
                    <span className="text-border">•</span>
                    <span>
                      GV: <strong className="text-foreground/90 font-semibold">{teacher.main}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200 shrink-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="p-3.5 sm:p-4 space-y-3.5 bg-background/50 text-left">
                  {/* Status Banner inside history if transferred or reserved */}
                  {isTransferredClass && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg border border-sky-200 dark:border-sky-900/50 bg-sky-50/60 dark:bg-sky-950/20 text-xs text-sky-900 dark:text-sky-200 select-none">
                      <ArrowRightLeft className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      <span>
                        Học viên đã kết chuyển từ lớp này sang lớp mới ngày <strong>01/08/2026</strong>. Đã bảo lưu và kết chuyển <strong>{pkg.remainingSessions || 8} buổi</strong> học phí.
                      </span>
                    </div>
                  )}

                  {isReservedClass && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 select-none">
                      <div className="flex items-center gap-2">
                        <Snowflake className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>
                          Khóa học tạm ngưng bảo lưu <strong>{pkg.remainingSessions || 14} buổi</strong> từ 15/06/2026 đến 15/09/2026.
                        </span>
                      </div>
                      {onOpenLeaveReserveDialog && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={onOpenLeaveReserveDialog}
                          className="h-6 px-2 text-[11px] font-semibold text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer shadow-3xs"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          <span>Xem đơn #BL002</span>
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Khối 1: Thông tin khóa học & Nhân sự */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 sm:p-3 rounded-lg bg-muted/20 border border-border/50 text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <UserCheck className="h-3 w-3 text-primary" />
                        <span>Giáo viên giảng dạy</span>
                      </span>
                      <p className="font-semibold text-foreground truncate">
                        {teacher.main} <span className="text-muted-foreground font-normal">({teacher.role})</span>
                      </p>
                      <p className="text-[10.5px] text-muted-foreground truncate">
                        Trợ giảng: {teacher.assistant}
                      </p>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>Lịch học khóa cũ</span>
                      </span>
                      <p className="font-medium text-foreground truncate">
                        {pkg.schedule || 'T3 (18:00 - 19:30), T7 (09:00 - 10:30)'}
                      </p>
                      <p className="text-[10.5px] text-muted-foreground truncate">
                        Thời lượng: {dateRange}
                      </p>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                        <span>Gói học & Cơ sở</span>
                      </span>
                      <p className="font-semibold text-foreground truncate">
                        {pkg.packageName}
                      </p>
                      <p className="text-[10.5px] text-muted-foreground truncate">
                        {branchName}
                      </p>
                    </div>
                  </div>

                  {/* Khối 2: Kết quả học tập tổng kết cuối khóa (4 Metric Cards thu nhỏ) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Kết quả học tập tổng kết
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {/* 1. Chuyên cần */}
                      <div className="p-2 sm:p-2.5 rounded-lg border border-border/70 bg-card/60 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                            Chuyên cần
                          </span>
                          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 leading-none shrink-0">
                            {pkg.attendanceRatio || '96%'}
                          </span>
                        </div>
                        <span className="text-[9.5px] text-muted-foreground block truncate">
                          Đã học: {usedSessions}/{totalSessions} buổi
                        </span>
                      </div>

                      {/* 2. BTVN */}
                      <div className="p-2 sm:p-2.5 rounded-lg border border-border/70 bg-card/60 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                            BTVN
                          </span>
                          <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400 leading-none shrink-0">
                            {pkg.homeworkCompletion ? `${pkg.homeworkCompletion}%` : '88%'}
                          </span>
                        </div>
                        <span className="text-[9.5px] text-muted-foreground block truncate">
                          Điểm TB: 8.2 / 10
                        </span>
                      </div>

                      {/* 3. Điểm thi tổng kết */}
                      <div className="p-2 sm:p-2.5 rounded-lg border border-border/70 bg-card/60 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                            Điểm KT
                          </span>
                          <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 leading-none shrink-0">
                            {pkg.lastTestScore || 8.5}
                          </span>
                        </div>
                        <span className="text-[9.5px] text-muted-foreground block truncate">
                          Đạt chuẩn đầu ra
                        </span>
                      </div>

                      {/* 4. Buổi học */}
                      <div className="p-2 sm:p-2.5 rounded-lg border border-border/70 bg-card/60 space-y-1">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                            Buổi học
                          </span>
                          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 leading-none shrink-0">
                            {isTransferredClass ? `${usedSessions}/${totalSessions}` : `${totalSessions}/${totalSessions}`}
                          </span>
                        </div>
                        <span className={cn(
                          "text-[9.5px] font-semibold block truncate",
                          isTransferredClass ? "text-sky-600 dark:text-sky-400" : "text-emerald-600 dark:text-emerald-400"
                        )}>
                          {isTransferredClass ? `Chuyển ${pkg.remainingSessions || 8} buổi` : '100% hoàn thành'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Khối 3: Báo cáo học tập (Chỉ 1 dòng tiêu đề mở modal danh sách báo cáo) */}
                  <div className="flex items-center justify-between p-2.5 px-3 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 transition-colors text-xs select-none">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                      <span className="font-semibold text-foreground truncate">
                        Báo cáo học tập
                      </span>
                      <Badge className="text-[10px] font-semibold py-0.2 px-1.5 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 border-none shadow-none">
                        {reportItems.length} báo cáo
                      </Badge>
                    </div>
                    {reportItems.length > 0 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingReportsModal({
                          className: pkg.className,
                          classCode: pkg.classCode,
                          items: reportItems,
                        })}
                        className="h-6 px-2 text-[11.5px] font-semibold text-primary hover:text-primary hover:bg-primary/10 gap-1 cursor-pointer"
                      >
                        <span>Xem danh sách báo cáo</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </Button>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">Chưa có báo cáo</span>
                    )}
                  </div>

                  {/* Khối 4: Nút tra cứu nhanh nhật ký chi tiết buổi học */}
                  {onOpenAttendance && (
                    <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        Cần đối soát lịch sử điểm danh, bài tập hoặc nhận xét từng buổi của lớp này?
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenAttendance({
                          regularSessions,
                          testSessions,
                          className: pkg.className,
                          classCode: pkg.classCode,
                          packageId: pkg.id,
                          isHistorical: true,
                        })}
                        className="h-7 px-2.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 gap-1.5 cursor-pointer shadow-3xs"
                      >
                        <ClipboardList className="h-3.5 w-3.5" />
                        <span>Xem nhật ký {totalSessions} buổi học cũ</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </Button>
                    </div>
                  )}

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

      {viewingReportsModal && (
        <HistoricalReportsDialog
          open={!!viewingReportsModal}
          onOpenChange={(open) => {
            if (!open) setViewingReportsModal(null)
          }}
          className={viewingReportsModal.className}
          classCode={viewingReportsModal.classCode}
          items={viewingReportsModal.items}
          onCopyLink={handleCopyLink}
        />
      )}
    </div>
  )
}
