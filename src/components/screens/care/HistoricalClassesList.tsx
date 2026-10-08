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
  Users,
  UserCheck,
  BookOpen,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { type HistoricalReportItem } from './HistoricalReportsDialog'
import { StudentCareEarlyReturnDialog } from './StudentCareEarlyReturnDialog'
import { HistoricalClassAiRemarkModal, type ClassRemarkState } from './HistoricalClassAiRemarkModal'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { type SessionHistory } from './StudentCareReportTab'
import { type SemesterEvaluationData } from './StudentCareReportTab'
import { type StudentCareAlert } from '@/mocks/careAlerts'
import { mockClassRecords } from '@/mocks/classRecords'
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

  const historicalPackages = classDataForPackages.filter(({ pkg }) => {
    if (pkg.id === activePackageId) return false
    // Không đưa các gói chính đang học hoặc chờ chuyển/xếp lớp (như pkg-1 hoặc pkg-2) vào lịch sử lớp cũ
    if (['pkg-1', 'pkg-2'].includes(pkg.id) && pkg.status !== 'expired') return false
    return true
  })
  const visibleHistoricalPackages = showAllHistory ? historicalPackages : historicalPackages.slice(0, 2)

  const isGlobalReserved =
    (studentAlert?.status === 'Hết buổi' && studentAlert?.careAlert?.toLowerCase().includes('bảo lưu')) ||
    (studentAlert?.status as string) === 'reserve' ||
    (studentAlert?.status as string) === 'Bảo lưu'

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between px-1 shrink-0 select-none flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Lịch sử học tập</span>
          </h2>
          {historicalPackages.length > 0 && (
            <span className="text-muted-foreground text-xs font-normal bg-muted px-1.5 py-0.2 rounded-full">
              {historicalPackages.length} lớp cũ
            </span>
          )}
        </div>

        {historicalPackages.length > 2 && (
          <button
            type="button"
            onClick={() => setShowAllHistory((prev) => !prev)}
            className="text-[11px] font-normal text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-auto"
          >
            {showAllHistory ? 'Thu gọn' : 'Xem tất cả'}
          </button>
        )}
      </div>

      <div className="space-y-2">
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
          <div className="py-3 px-3 rounded-lg border border-dashed border-border/70 bg-muted/20 text-center">
            <p className="text-xs font-semibold text-foreground">Chưa có lớp học trước đó</p>
            <p className="text-xs text-muted-foreground mt-0.5">Học viên chưa tham gia lớp học nào trước đây.</p>
          </div>
        ) : (
          visibleHistoricalPackages.map(({ pkg, isEnglish: pkgIsEnglish, regularSessions, testSessions, reports }) => {
          // Luôn mở rộng lớp gần nhất trong lịch sử học tập
          const isMostRecent = pkg.id === historicalPackages[0]?.pkg.id
          const isOpen = expandedPackageIds[pkg.id] !== undefined ? expandedPackageIds[pkg.id] : isMostRecent
          const teacher = getHistoricalTeacherInfo(pkg, pkgIsEnglish)
          const dateRange = getHistoricalDates(pkg)
          const totalSessions = pkg.totalSessions || 24

          // Thống kê & Sĩ số
          const classRecord = mockClassRecords.find((c) => c.code === pkg.classCode)
          const enrolled = classRecord?.enrolledStudents || 15
          const max = classRecord?.maxStudents || 20

          // Chuyên cần
          const rawAtt = pkg.attendanceRatio || ''
          const attendanceRatioDisplay = rawAtt.includes('/') ? rawAtt : '6/7'

          // BTVN
          const hwRatioDisplay = `${Math.round(7 * ((pkg.homeworkCompletion || 85) / 100))}/7`

          // Điểm kiểm tra
          const testScoreDisplay = pkg.lastTestScore ? pkg.lastTestScore.toFixed(1) : '8.8'

          // Số buổi trong lớp
          const sessionsCount = pkg.totalSessions || 24

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
              className="border border-border/70 rounded-xl overflow-hidden bg-card dark:bg-zinc-900 shadow-2xs transition-all hover:border-border"
            >
              {/* Collapsible Header */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => togglePackage(pkg.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    togglePackage(pkg.id)
                  }
                }}
                className="w-full flex items-center justify-between py-2 px-3 sm:px-3.5 bg-muted/25 dark:bg-zinc-800/40 hover:bg-muted/40 transition-colors text-left select-none border-b border-border/50 cursor-pointer"
              >
                {/* Cột trái: Thông tin lớp & Sĩ số, Thời gian (số buổi) */}
                <div className="min-w-0 space-y-0.5 flex-1 pr-2">
                  {/* Dòng 1: Lớp + Sĩ số đưa về cạnh mã lớp */}
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <div className="flex items-center gap-1.5 min-w-0" onClick={(e) => e.stopPropagation()}>
                      <span className="text-muted-foreground font-normal text-[11px]">Lớp</span>
                      <ClassCodeHoverCell
                        classCode={pkg.classCode}
                        subject={pkgIsEnglish ? 'Tiếng Anh' : 'Toán tư duy'}
                        level={pkg.level || 'Archimedes'}
                        subLevel={pkg.subLevel}
                        teacherCode={teacher.main}
                        schedule={pkg.schedule || 'Thứ 2, 6'}
                        openInNewTab={true}
                        className="font-mono font-normal text-[11.5px]"
                      />
                    </div>

                    {/* Sĩ số đưa về cạnh mã lớp */}
                    <div
                      className="flex items-center gap-1 text-[10.5px] text-muted-foreground font-normal shrink-0"
                      title={`Sĩ số lớp: ${enrolled}/${max} học viên`}
                    >
                      <Users className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                      <span className="text-foreground/90 font-medium">{enrolled}/{max}</span>
                    </div>
                  </div>

                  {/* Dòng 2: Thời gian: {dateRange} ({sessionsCount} buổi) - Xóa trình độ đi */}
                  <div className="text-[10.5px] text-muted-foreground font-normal truncate">
                    <span>Thời gian: {dateRange} ({sessionsCount} buổi)</span>
                  </div>
                </div>

                {/* Cột phải: Section thống kê thu gọn (Chuyên cần, BTVN, Điểm) + Chevron */}
                <div className="flex items-center gap-1.5 shrink-0 ml-auto flex-wrap sm:flex-nowrap">
                  {/* Chuyên cần */}
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 dark:bg-zinc-800/40 border border-border/40 text-[10.5px] select-none shadow-3xs"
                    title={`Chuyên cần: ${attendanceRatioDisplay}`}
                  >
                    <UserCheck className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-[10px]">Chuyên cần:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{attendanceRatioDisplay}</span>
                  </div>

                  {/* BTVN */}
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 dark:bg-zinc-800/40 border border-border/40 text-[10.5px] select-none shadow-3xs"
                    title={`BTVN: ${hwRatioDisplay}`}
                  >
                    <BookOpen className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-[10px]">BTVN:</span>
                    <span className="font-semibold text-sky-600 dark:text-sky-400">{hwRatioDisplay}</span>
                  </div>

                  {/* Điểm kiểm tra */}
                  <div
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 dark:bg-zinc-800/40 border border-border/40 text-[10.5px] select-none shadow-3xs"
                    title={`Điểm kiểm tra: ${testScoreDisplay}`}
                  >
                    <Award className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-[10px]">Điểm:</span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">{testScoreDisplay}</span>
                  </div>

                  {/* ChevronDown icon */}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200 ml-0.5 shrink-0",
                      isOpen && "rotate-180"
                    )}
                  />
                </div>
              </div>

              {/* Collapsible Content */}
              {isOpen && (
                <div className="p-2.5 sm:p-3 space-y-2 bg-card dark:bg-zinc-900 text-left">
                  {/* Status Banner inside history if reserved */}
                  {isReservedClass && (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 select-none">
                      <div className="flex items-center gap-1.5">
                        <Snowflake className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>
                          Khóa học tạm ngưng bảo lưu <span className="font-semibold">{pkg.remainingSessions || 14} buổi</span> từ 15/06/2026 đến 15/09/2026.
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {onOpenLeaveReserveDialog && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onOpenLeaveReserveDialog}
                            className="h-5.5 px-2 text-[11px] font-normal text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer shadow-3xs"
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
                          className="h-5.5 px-2 text-[11px] font-normal text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 bg-sky-50/70 hover:bg-sky-100 dark:bg-sky-950/40 dark:hover:bg-sky-900/60 cursor-pointer shadow-3xs"
                        >
                          <RotateCcw className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400" />
                          <span>Đi học lại</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Nhận xét học tập Lớp học (AI Tổng hợp / Đã duyệt bởi GV) */}
                  <div className="bg-muted/20 dark:bg-muted/10 rounded-lg p-2.5 space-y-1.5 text-xs text-left">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-semibold text-foreground text-xs tracking-normal">
                        {currentRemark.isAiGenerated
                          ? 'Nhận xét học tập lớp học (AI tổng hợp)'
                          : 'Nhận xét học tập lớp học (Đã duyệt bởi GV)'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setEditingRemarkPkg({ pkg, teacherName: teacher.main })}
                        className="inline-flex items-center gap-1 text-[11px] font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer transition-colors"
                      >
                        <Pencil className="h-3 w-3 shrink-0" />
                        <span>Chỉnh sửa</span>
                      </button>
                    </div>

                    <p className="text-foreground/85 leading-relaxed text-[11px] italic font-normal">
                      &ldquo;{currentRemark.text}&rdquo;
                    </p>
                  </div>

                  {/* Báo cáo học tập & Nhật ký buổi học */}
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs py-0.5 text-left select-none">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-normal text-muted-foreground flex items-center gap-1.5 shrink-0">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Báo cáo tháng:</span>
                      </span>
                      {reportItems.length > 0 ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          {reportItems.map((item, idx) => (
                            <React.Fragment key={item.id}>
                              {idx > 0 && <span className="text-muted-foreground/40">•</span>}
                              <button
                                type="button"
                                onClick={() => handleCopyLink(item.url || `https://rinoedu.vn/reports/${pkg.classCode}/${item.id}`)}
                                className="inline-flex items-center gap-1 text-[11px] font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer"
                                title="Nhấp để sao chép liên kết báo cáo"
                              >
                                <span>{item.monthBadge || item.title}</span>
                                <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic font-normal">Chưa có báo cáo tháng</span>
                      )}
                    </div>

                    {onOpenAttendance && (
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
                        className="h-6 px-2 text-[11px] font-normal text-primary border-primary/30 hover:bg-primary/10 gap-1 cursor-pointer shadow-3xs ml-auto"
                      >
                        <ClipboardList className="h-3 w-3" />
                        <span>Nhật ký {totalSessions} buổi</span>
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </Button>
                    )}
                  </div>
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

