'use client'

import React, { useState } from 'react'
import {
  ChevronDown,
  FileText,
  ExternalLink,
  ClipboardList,
  Snowflake,
  RotateCcw,
  Pencil,
  GraduationCap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EmptyState } from '@/components/shared'
import { type HistoricalReportItem } from './HistoricalReportsDialog'
import { StudentCareEarlyReturnDialog } from './StudentCareEarlyReturnDialog'
import { HistoricalClassAiRemarkModal, type ClassRemarkState } from './HistoricalClassAiRemarkModal'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { type SessionHistory } from './StudentCareReportTab'
import { type SemesterEvaluationData } from './StudentCareReportTab'
import { type StudentCareAlert } from '@/mocks/careAlerts'
import { CareReportSmartCards } from './CareReportSmartCards'
// Tạm ẩn import phần test và học thử theo yêu cầu
// import { HistoricalTestCard } from './HistoricalTestCard'
// import { HistoricalTrialCard } from './HistoricalTrialCard'
// import { getStudentHistoricalTest, getStudentHistoricalTrial } from './historicalLearningHelpers'
// import { TrialClassDetailDialog } from '@/components/screens/trial-class/TrialClassDetailDialog'
// import { BookingTestDetailDialog } from '@/components/screens/booking-test/BookingTestDetailDialog'
// import type { TrialClass } from '@/mocks/trialClasses'
// import type { BookingTest } from '@/mocks/bookingTests'

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
  studentId?: string
  studentName?: string
  isEnglish?: boolean
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
  // Tạm ẩn phân hệ tab lọc và đánh giá/học thử theo yêu cầu
  // const [historyTab, setHistoryTab] = useState<'all' | 'assessments' | 'classes'>('all')
  // const [selectedTrial, setSelectedTrial] = useState<TrialClass | null>(null)
  // const [selectedBooking, setSelectedBooking] = useState<BookingTest | null>(null)
  const [earlyReturnPkg, setEarlyReturnPkg] = useState<SimulatedPackage | null>(null)
  const [classRemarks, setClassRemarks] = useState<Record<string, ClassRemarkState>>({
    'pkg-2': {
      text: 'Học viên tiếp thu nhanh các dạng toán tư duy logic, thái độ học tập tích cực và hoàn thành đầy đủ bài tập. Điểm kiểm tra cuối kỳ đạt 9.0. Cần rèn thêm tính cẩn thận ở các bài toán đố hình học để tránh nhầm lẫn số đo. Kiến nghị: Đạt chuẩn đầu ra, đủ điều kiện chuyển tiếp lên trình độ Level B.',
      isAiGenerated: true,
    },
    'pkg-3': {
      text: 'Học viên hoàn thành xuất sắc khóa học Foundation, phản xạ nói tự nhiên, nắm vững kiến thức cấu trúc câu cơ bản của cấp độ. Cần chú ý củng cố kỹ năng viết và mở rộng vốn từ vựng học thuật. Kiến nghị: Đạt chuẩn đầu ra, chuyển tiếp lên khóa Academic Prep.',
      isAiGenerated: true,
    },
  })
  const [editingRemarkPkg, setEditingRemarkPkg] = useState<{
    pkg: SimulatedPackage
    teacherName: string
  } | null>(null)

  // const resolvedStudentName = _studentName || studentAlert?.studentName || 'Hoàng Bảo Nam'

  // Tạm ẩn phần test và học thử theo yêu cầu
  // const testData = useMemo(() => {
  //   return getStudentHistoricalTest(resolvedStudentName, branchName, _isEnglish)
  // }, [resolvedStudentName, branchName, _isEnglish])

  // const trialData = useMemo(() => {
  //   return getStudentHistoricalTrial(resolvedStudentName, branchName, _isEnglish)
  // }, [resolvedStudentName, branchName, _isEnglish])

  const handleSaveRemark = (pkgId: string, updated: ClassRemarkState) => {
    setClassRemarks(prev => ({
      ...prev,
      [pkgId]: updated,
    }))
  }

  const historicalPackages = classDataForPackages.filter(({ pkg }) => pkg.id !== activePackageId)
  const visibleHistoricalPackages = showAllHistory ? historicalPackages : historicalPackages.slice(0, 2)

  const isGlobalReserved =
    (studentAlert?.status === 'Hết buổi' && studentAlert?.careAlert?.toLowerCase().includes('bảo lưu')) ||
    (studentAlert?.status as string) === 'reserve' ||
    (studentAlert?.status as string) === 'Bảo lưu'

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1 shrink-0 select-none flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Lịch sử học tập</span>
          </h2>
          {historicalPackages.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-semibold">
              <span className="text-muted-foreground/80 bg-muted px-1.5 py-0.2 rounded-full">
                {historicalPackages.length} lớp cũ
              </span>
            </div>
          )}
        </div>

        {historicalPackages.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAllHistory((prev) => !prev)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-auto"
          >
            {showAllHistory ? 'Thu gọn' : `Xem tất cả (${historicalPackages.length})`}
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {/* Tạm ẩn phần test và học thử theo yêu cầu
        <div className="space-y-3">
          <HistoricalTestCard
            testData={testData}
            isEnglish={isEnglish}
            studentName={resolvedStudentName}
            onOpenTestDetail={(booking) => {
              setSelectedBooking(booking || testData.bookingRaw || null)
            }}
          />
          <HistoricalTrialCard
            trialData={trialData}
            onOpenTrialDetail={() => {
              setSelectedTrial(trialData.trialRaw || null)
            }}
          />
        </div>
        */}

        {/* CÁC LỚP HỌC TRƯỚC ĐÓ */}
        {historicalPackages.length === 0 ? (
          <div className="py-6 px-4 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center">
            <p className="text-xs font-semibold text-foreground">Chưa có lớp học trước đó</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Học viên chưa tham gia lớp học nào trước đây.</p>
          </div>
        ) : (
          visibleHistoricalPackages.map(({ pkg, isEnglish: pkgIsEnglish, regularSessions, testSessions, reports }) => {
          // Luôn mở rộng lớp gần nhất trong lịch sử học tập
          const isMostRecent = pkg.id === historicalPackages[0]?.pkg.id
          const isOpen = expandedPackageIds[pkg.id] !== undefined ? expandedPackageIds[pkg.id] : isMostRecent
          const isPending = pkg.status === 'pending'
          const teacher = getHistoricalTeacherInfo(pkg, pkgIsEnglish)
          const dateRange = getHistoricalDates(pkg)
          const totalSessions = pkg.totalSessions || 24
          const usedSessions = totalSessions - (pkg.remainingSessions || 0)

          // Determine class status in history
          const isReservedClass = (pkg.status as string) === 'reserve' || (isGlobalReserved && pkg.id === 'pkg-3')

          const currentRemark: ClassRemarkState = classRemarks[pkg.id] || {
            text: pkgIsEnglish
              ? 'Học viên hoàn thành tốt chương trình học, nắm vững kiến thức ngữ pháp trọng tâm và có tinh thần học tập tích cực. Kiến nghị: Đạt chuẩn đánh giá để chuyển tiếp lộ trình đào tạo tiếp theo.'
              : 'Học viên hiểu bài nhanh, làm bài tập đầy đủ và có tư duy suy luận toán học tốt trong suốt học kỳ. Kiến nghị: Đạt chuẩn đầu ra để chuyển tiếp lên trình độ nâng cao.',
            isAiGenerated: true,
          }

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
                  {/* Status Banner inside history if reserved */}

                  {isReservedClass && (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 select-none">
                      <div className="flex items-center gap-2">
                        <Snowflake className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>
                          Khóa học tạm ngưng bảo lưu <strong>{pkg.remainingSessions || 14} buổi</strong> từ 15/06/2026 đến 15/09/2026.
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setEarlyReturnPkg(pkg)}
                          className="h-6 px-2 text-[11px] font-semibold text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 bg-sky-50/70 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 cursor-pointer shadow-3xs"
                        >
                          <RotateCcw className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400" />
                          <span>Đi học lại</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Nhận xét học tập Lớp học (AI Tổng hợp / Đã duyệt bởi GV) */}
                  <div className="bg-muted/25 dark:bg-muted/10 rounded-xl p-3 sm:p-3.5 space-y-2 text-xs text-left">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wide">
                        {currentRemark.isAiGenerated
                          ? 'Nhận xét học tập Lớp học (AI Tổng hợp)'
                          : 'Nhận xét học tập Lớp học (Đã duyệt bởi GV)'}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRemarkPkg({ pkg, teacherName: teacher.main })}
                        className="h-6 px-2 text-[11px] font-medium border-border/80 text-foreground/80 hover:bg-muted/60 gap-1 cursor-pointer shadow-3xs"
                      >
                        <Pencil className="h-3 w-3" />
                        <span>Chỉnh sửa</span>
                      </Button>
                    </div>

                    <p className="text-foreground/90 leading-relaxed text-[11.5px] italic">
                      &ldquo;{currentRemark.text}&rdquo;
                    </p>

                    <div className="text-[10.5px] text-muted-foreground pt-0.5">
                      <span>
                        {currentRemark.isAiGenerated
                          ? `* Tổng hợp từ dữ liệu ${usedSessions} buổi học, kết quả BTVN và các bài kiểm tra.`
                          : `* Đã được GV ${currentRemark.lastEditedBy || teacher.main} rà soát & cập nhật (${currentRemark.lastEditedAt || 'Gần đây'}).`}
                      </span>
                    </div>
                  </div>

                  {/* Kết quả học tập tổng kết cuối khóa (Đồng bộ thiết kế SmartCard như buổi hiện tại) */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Kết quả học tập tổng kết
                    </span>
                    <CareReportSmartCards
                      pkg={pkg}
                      regularSessions={regularSessions}
                      testSessions={testSessions}
                      pkgIsEnglish={pkgIsEnglish}
                      avgRating={4.5}
                      generalComment=""
                    />
                  </div>

                  {/* Báo cáo học tập (danh sách textlink trực tiếp, không mở modal) */}
                  <div className="flex items-center gap-2 flex-wrap text-xs py-1 text-left select-none">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5 shrink-0">
                      <FileText className="h-3.5 w-3.5 text-violet-500" />
                      <span>Báo cáo tháng:</span>
                    </span>
                    {reportItems.length > 0 ? (
                      <div className="flex items-center gap-2.5 flex-wrap">
                        {reportItems.map((item, idx) => (
                          <React.Fragment key={item.id}>
                            {idx > 0 && <span className="text-muted-foreground/40">•</span>}
                            <button
                              type="button"
                              onClick={() => handleCopyLink(item.url || `https://rinoedu.vn/reports/${pkg.classCode}/${item.id}`)}
                              className="inline-flex items-center gap-1 text-[11.5px] font-medium text-primary hover:underline cursor-pointer"
                              title="Nhấp để sao chép liên kết báo cáo"
                            >
                              <span>{item.monthBadge || item.title}</span>
                              <ExternalLink className="h-3 w-3 opacity-60" />
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic">Chưa có báo cáo tháng</span>
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
        })
      )}
      </div>

      {/* MODAL CHI TIẾT PHIẾU HỌC THỬ & BÀI ĐÁNH GIÁ ĐẦU VÀO (Tạm ẩn cùng phân hệ test & học thử)
      {selectedTrial && (
        <TrialClassDetailDialog
          trial={selectedTrial}
          onOpenChange={(open) => {
            if (!open) setSelectedTrial(null)
          }}
        />
      )}

      {selectedBooking && (
        <BookingTestDetailDialog
          booking={selectedBooking}
          detailNote=""
          copiedKey=""
          onOpenChange={(open) => {
            if (!open) setSelectedBooking(null)
          }}
          onUpdateBooking={() => {}}
          onOpenAssessment={() => {}}
          onCall={() => {}}
          onCopy={async () => {}}
          onDetailNoteChange={() => {}}
          onAddNote={() => {}}
        />
      )}
      */}

      {editingRemarkPkg && (
        <HistoricalClassAiRemarkModal
          key={editingRemarkPkg.pkg.id}
          open={Boolean(editingRemarkPkg)}
          onOpenChange={(open) => {
            if (!open) setEditingRemarkPkg(null)
          }}
          pkg={editingRemarkPkg.pkg}
          teacherName={editingRemarkPkg.teacherName}
          studentName={studentAlert?.studentName || 'Hoàng Bảo Nam'}
          currentRemark={classRemarks[editingRemarkPkg.pkg.id]}
          onSaveRemark={handleSaveRemark}
        />
      )}

      {earlyReturnPkg && (
        <StudentCareEarlyReturnDialog
          open={Boolean(earlyReturnPkg)}
          onOpenChange={(open) => {
            if (!open) setEarlyReturnPkg(null)
          }}
          studentName={studentAlert?.studentName || 'Hoàng Bảo Nam'}
          studentCode={studentAlert?.customerCode || studentAlert?.studentId || 'HV-2024-0012'}
          studentId={studentAlert?.studentId}
          packageName={earlyReturnPkg.packageName || 'Khóa học'}
          className={earlyReturnPkg.className}
          classCode={earlyReturnPkg.classCode}
          isHoldingClass={false}
          expectedReturnDate="15/09/2026"
          reserveDuration="15/06/2026 ➔ 15/09/2026"
          remainingSessions={earlyReturnPkg.remainingSessions || 14}
          branchName={branchName}
        />
      )}
    </div>
  )
}

