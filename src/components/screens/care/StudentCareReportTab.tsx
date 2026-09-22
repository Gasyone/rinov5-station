'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import { toast } from 'sonner'
import { SemesterEvaluationDialog } from './SemesterEvaluationDialog'
import { ClassTestsDialog } from './ClassTestsDialog'
import { ClassAttendanceDialog } from './ClassAttendanceDialog'
import { ClassHomeworkDialog } from './ClassHomeworkDialog'
import { ClassEvaluationDialog } from './ClassEvaluationDialog'
import { generateSessionHistory, getMockMonthlyReports, getMockEvaluations, type SessionHistory, type SemesterEvaluationData } from './studentCareReportHelpers'
import { buildMultiClassSessions } from './careModalFilterHelpers'
import { HistoricalClassesList } from './HistoricalClassesList'
import { CareReportSmartCards } from './CareReportSmartCards'
import { CareSessionTimelineList } from './CareSessionTimelineList'
import { CareProjectMediaList } from './CareProjectMediaList'
import { MonthlyCommentsSection, type MonthlyCommentItem } from './MonthlyCommentsSection'
import { getStudentMonthlyReports } from '@/mocks/monthlyReports'
import { StudentCareReportLinkDialogs } from './StudentCareReportLinkDialogs'
import { StudentCareActiveClassCard } from './StudentCareActiveClassCard'
import { EmptyState } from '@/components/shared'
import { mockCareAlerts, type StudentCareAlert } from '@/mocks/careAlerts'
import { resolveStudentPlacementStatus } from './class-card/studentCareClassCardHelpers'
import { mockStudents } from '@/mocks/students'

export type { SessionHistory, SemesterEvaluationData }

interface StudentCareReportTabProps {
  studentId: string
  studentName: string
  studentAlert?: StudentCareAlert | null
  activePackage?: SimulatedPackage | null
  packagesList?: SimulatedPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  staffInfo: {
    cs: {
      id: string
      name: string
      role: string
      phone?: string
      email?: string
      avatar: string
    }
    teachers: Array<{
      id: string
      name: string
      role: string
      phone?: string
      email?: string
      avatar: string
    }>
  }
  assignedCS?: string
  onAssignedCSChange?: (csName: string) => void
  branchName?: string
  onOpenLeaveReserveDialog?: () => void
  onCreateLeaveReserve?: (type: 'off' | 'reservation') => void
  isRenewal?: boolean
}

// ── Main Component ──────────────────────────────────────────────────────

export function StudentCareReportTab({
  studentId,
  studentName,
  studentAlert,
  activePackage,
  packagesList = [],
  selectedPackageId,
  setSelectedPackageId,
  staffInfo,
  assignedCS,
  onAssignedCSChange,
  branchName,
  onOpenLeaveReserveDialog,
  onCreateLeaveReserve,
  isRenewal = false,
}: StudentCareReportTabProps) {
  const isEnglish = useMemo(() => {
    if (!activePackage) return true
    const name = activePackage.packageName.toLowerCase()
    return !name.includes('toán')
  }, [activePackage])

  const currentStudentAlert = useMemo(() => {
    return studentAlert || mockCareAlerts.find((a) => a.studentId === studentId || a.id === studentId) || null
  }, [studentAlert, studentId])

  const currentBranchName = branchName || 'RinoEdu Nguyễn Tuân'
  const [reportSyncVersion, setReportSyncVersion] = useState(0)

  useEffect(() => {
    const handleReportUpdate = () => {
      setReportSyncVersion((v) => v + 1)
    }
    window.addEventListener('rinov5-monthly-reports-updated', handleReportUpdate)
    return () => {
      window.removeEventListener('rinov5-monthly-reports-updated', handleReportUpdate)
    }
  }, [])

  const studentMonthlyReports = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    reportSyncVersion
    return getStudentMonthlyReports(studentId || studentName)
  }, [studentId, studentName, reportSyncVersion])
  const visiblePackages = packagesList
  const selectedMonth = 'all'
  const [customReports, setCustomReports] = useState<{ title: string; date: string; url: string; packageId: string }[]>([])
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isTestsModalOpen, setIsTestsModalOpen] = useState(false)
  const [testsModalData] = useState<{
    testSessions: SessionHistory[]
    isEnglish: boolean
    className: string
    packageId?: string
  } | null>(null)
  
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [attendanceModalData, setAttendanceModalData] = useState<{
    regularSessions: SessionHistory[]
    testSessions: SessionHistory[]
    className: string
    classCode: string
    packageId?: string
    isHistorical?: boolean
  } | null>(null)

  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false)
  const [homeworkModalData] = useState<{
    regularSessions: SessionHistory[]
    className: string
    packageId?: string
  } | null>(null)

  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false)
  const [evaluationModalData, setEvaluationModalData] = useState<{
    regularSessions: SessionHistory[]
    testSessions: SessionHistory[]
    className: string
    packageId?: string
  } | null>(null)

  const [reportTitle, setReportTitle] = useState('')
  const [reportUrl, setReportUrl] = useState('')
  const [reportNotes, setReportNotes] = useState('')

  // Edit Report Link State
  const [reportOverrides, setReportOverrides] = useState<Record<string, { url: string }>>({})
  const [isEditReportOpen, setIsEditReportOpen] = useState(false)
  const [editReportPkgId, setEditReportPkgId] = useState('')
  const [editReportTitle, setEditReportTitle] = useState('')
  const [editReportUrl, setEditReportUrl] = useState('')
  const [editReportOriginalTitle, setEditReportOriginalTitle] = useState('')

  const handleOpenEditReportModal = (packageId: string, report: { title: string; url: string }) => {
    setEditReportPkgId(packageId)
    setEditReportOriginalTitle(report.title)
    setEditReportTitle(report.title)
    setEditReportUrl(report.url)
    setIsEditReportOpen(true)
  }

  const handleSaveEditReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editReportPkgId || !editReportOriginalTitle) return

    setReportOverrides(prev => ({
      ...prev,
      [`${editReportPkgId}-${editReportOriginalTitle}`]: {
        url: editReportUrl.trim()
      }
    }))

    toast.success('Đã cập nhật liên kết báo cáo thành công!')
    setIsEditReportOpen(false)
  }

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('Đã sao chép đường liên kết báo cáo!')
      })
      .catch(() => {
        toast.error('Không thể sao chép liên kết.')
      })
  }

  // Interactive Evaluation State
  const [isEvalOpen, setIsEvalOpen] = useState(false)
  const [selectedEvalMonth, setSelectedEvalMonth] = useState('')
  const [selectedEvalPkgId, setSelectedEvalPkgId] = useState('')
  const [evalOverrides, setEvalOverrides] = useState<Record<string, { attitude: number; knowledge: number; skills: number; interaction: number }>>({})

  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false)
  const [selectedLeaveDate, setSelectedLeaveDate] = useState<string>('2026-06-25')

  const leaveRequest = useMemo(() => {
    const found = mockLeaveReserveRequests.find(
      (r) => r.studentId === studentId || r.studentName === studentName
    )
    if (found) return { ...found, startDate: selectedLeaveDate, endDate: selectedLeaveDate }

    return {
      id: `LR-GEN-${studentId}`,
      studentId: studentId,
      studentName: studentName || 'Học viên',
      studentCode: 'HV-S4-10',
      branch: 'RinoEdu Nguyễn Tuân',
      type: 'off' as const,
      startDate: selectedLeaveDate,
      endDate: selectedLeaveDate,
      reason: 'Nghỉ ốm có phép (Phụ huynh xin nghỉ qua ứng dụng)',
      status: 'approved' as const,
      requestedDate: selectedLeaveDate,
      approvedBy: 'Trần Văn A (Quản lý)',
      approvedDate: selectedLeaveDate,
      title: 'Đơn xin nghỉ phép học viên',
      phone: '0912345678',
      email: `hv@rinoedu.vn`,
      className: 'Lớp học hiện tại',
      classCode: 'CLASS-01',
      productPackage: 'Gói Tiếng Anh chuẩn Cambridge',
      parentName: 'Phụ huynh',
      additionalContacts: []
    }
  }, [studentId, studentName, selectedLeaveDate])

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault()
    const finalUrl = reportUrl.trim() || 'https://docs.google.com/document/d/1UXX0wgBd13PdfxVf79cQRHwLoXlKwLYk_HC0EbmKZ-k/edit?usp=drive_link'
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const dateStr = `${dd}/${mm}/${yyyy}`

    const defaultTitle = isEnglish
      ? `Báo cáo Tiếng Anh - Tháng ${mm}/${yyyy}`
      : `Báo cáo môn Toán - Tháng ${mm}/${yyyy}`

    const newReport = {
      title: reportTitle.trim() || defaultTitle,
      date: `Cập nhật: ${dateStr}`,
      url: finalUrl,
      packageId: activePackage?.id || 'pkg-1',
    }

    setCustomReports(prev => [newReport, ...prev])
    toast.success('Đã lưu thông tin báo cáo học tập định kỳ thành công!')
    
    setReportTitle('')
    setReportUrl('')
    setReportNotes('')
    setIsReportDialogOpen(false)
  }

  const monthlyReports = useMemo(() => getMockMonthlyReports(isEnglish), [isEnglish])

  const { currentClassEval, oldClassEval, supplementalClassEval } = useMemo(
    () => getMockEvaluations(isEnglish),
    [isEnglish]
  )

  const [expandedPackageIds, setExpandedPackageIds] = useState<Record<string, boolean>>({})

  const classDataForPackages = useMemo(() => {
    const listToUse = packagesList.length > 0 ? packagesList : (activePackage ? [activePackage] : [])
    return listToUse.map((pkg) => {
      const pkgIsEnglish = !pkg.packageName.toLowerCase().includes('toán')
      const pkgSessions = generateSessionHistory(studentId, pkgIsEnglish, pkg.id)
      const allRegular = pkgSessions.filter(s => s.type === 'lesson')
      const allTest = pkgSessions.filter(s => s.type === 'test')

      let regular = allRegular
      let test = allTest
      let evals = [currentClassEval]

      if (pkg.id === 'pkg-3') {
        evals = [oldClassEval]
      } else if (pkg.id === 'pkg-2') {
        evals = [supplementalClassEval]
      } else if (pkg.id === 'pkg-4') {
        regular = []
        test = []
        evals = []
      } else {
        evals = [currentClassEval, oldClassEval]
      }

      // Filter by selectedMonth if it is the active package (current class)
      if (pkg.id === activePackage?.id) {
        if (selectedMonth !== 'all') {
          regular = regular.filter(s => s.date.split('-')[1] === selectedMonth)
          test = test.filter(s => s.date.split('-')[1] === selectedMonth)
        }
      }

      // Filter reports for this package
      const staticReports = monthlyReports.filter(r => r.packageId === pkg.id)
      const dynamicReports = customReports.filter(r => r.packageId === pkg.id)
      const pkgReports = [...dynamicReports, ...staticReports].map(r => {
        const overrideKey = `${pkg.id}-${r.title}`
        const override = reportOverrides[overrideKey]
        if (override) {
          return {
            ...r,
            url: override.url,
          }
        }
        return r
      })

      // Override evaluation scores dynamically if present in evalOverrides
      const mappedEvals = evals.map((ev) => {
        const key = `${pkg.id}-${ev.month}`
        const override = evalOverrides[key]
        if (override) {
          return {
            ...ev,
            ...override
          }
        }
        return ev
      })

      return {
        pkg,
        isEnglish: pkgIsEnglish,
        regularSessions: regular,
        testSessions: test,
        semesterEvaluations: mappedEvals,
        reports: pkgReports,
      }
    })
  }, [packagesList, activePackage, studentId, oldClassEval, currentClassEval, supplementalClassEval, monthlyReports, customReports, selectedMonth, evalOverrides, reportOverrides])

  const togglePackage = (id: string) => {
    setExpandedPackageIds((prev) => {
      const historicalList = classDataForPackages.filter((p) => p.pkg.id !== activePackage?.id)
      const isMostRecent = id === historicalList[0]?.pkg.id
      const current = prev[id] !== undefined ? prev[id] : isMostRecent
      return {
        ...prev,
        [id]: !current,
      }
    })
  }

  const multiClassData = useMemo(() => {
    return buildMultiClassSessions(classDataForPackages, activePackage?.id || '')
  }, [classDataForPackages, activePackage])

  return (
    <div className="w-full space-y-6 text-left p-0 select-none">
      {/* 1. LỚP HIỆN TẠI (Đóng khung/viền, Nền trắng) */}
      {classDataForPackages
        .filter(({ pkg }) => pkg.id === activePackage?.id)
        .map(({ pkg, isEnglish: pkgIsEnglish, regularSessions, testSessions, semesterEvaluations }) => {
          const isPending = pkg.status === 'pending'

          const avgRating = regularSessions.length > 0 
            ? parseFloat((regularSessions.reduce((acc, s) => acc + s.rating, 0) / regularSessions.length).toFixed(1)) 
            : 4.5
          const generalComment = semesterEvaluations[0]?.comment 
            || (pkgIsEnglish ? 'Học viên học tập tích cực, nghe nói tốt.' : 'Học viên tính toán logic tốt, tiếp thu nhanh.')
          const monthlyComments: MonthlyCommentItem[] = studentMonthlyReports.map((r) => ({
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

          const matchedMockStudent = mockStudents.find(
            (s) =>
              s.id === studentId ||
              s.id === currentStudentAlert?.studentId ||
              s.name.toLowerCase() === studentName?.toLowerCase()
          ) || null

          const placementStatus = resolveStudentPlacementStatus(currentStudentAlert, matchedMockStudent, pkg)

          const shouldHideTimeline =
            placementStatus === 'wait_for_assignment' ||
            placementStatus === 'pending_payment' ||
            placementStatus === 'enroll_later' ||
            placementStatus === 'fee_transfer' ||
            placementStatus === 'pending_transfer' ||
            placementStatus === 'draft_class' ||
            placementStatus === 'trial'


          return (
            <div key={pkg.id} className="space-y-4">
              {/* Cụm thông tin Chương trình hiện tại & Lớp học */}
              <StudentCareActiveClassCard
                pkg={pkg}
                visiblePackages={visiblePackages}
                selectedPackageId={selectedPackageId}
                setSelectedPackageId={setSelectedPackageId}
                staffInfo={staffInfo}
                assignedCS={assignedCS}
                onAssignedCSChange={onAssignedCSChange}
                currentBranchName={currentBranchName}
                pkgIsEnglish={pkgIsEnglish}
                student={currentStudentAlert}
                onOpenLeaveReserveDialog={onOpenLeaveReserveDialog}
                onCreateLeaveReserve={onCreateLeaveReserve}
                isRenewal={isRenewal}
              />



              {/* 1. Nhóm 5 buổi đã học + 2 buổi sắp tới (Dạng dòng/thẻ) & 2. Nhóm Buổi project thực hành (Media Ảnh/Video) */}
              {!isPending && !shouldHideTimeline && (
                <div className="space-y-4">
                  {/* Nhật ký Buổi học với SmartCards đặt bên trong (trên các buổi học) */}
                  <CareSessionTimelineList
                    regularSessions={regularSessions}
                    testSessions={testSessions}
                    pkgIsEnglish={pkgIsEnglish}
                    studentId={studentId}
                    studentName={studentName}
                    studentAlert={currentStudentAlert}
                    placementStatus={placementStatus}
                    expectedStartDate={pkg.startDate || '21/11/2023'}
                    onOpenLeave={(date) => {
                      setSelectedLeaveDate(date)
                      setLeaveDialogOpen(true)
                    }}
                    smartCards={
                      placementStatus === 'awaiting_opening' ? null : (
                        <CareReportSmartCards
                          pkg={pkg}
                          regularSessions={regularSessions}
                          testSessions={testSessions}
                          pkgIsEnglish={pkgIsEnglish}
                          avgRating={avgRating}
                          generalComment={generalComment}
                        />
                      )
                    }
                  />

                  {/* Buổi Project Thực hành & Media (Ảnh/Video học viên) - Chỉ hiển thị khi lớp đã bắt đầu học */}
                  {placementStatus !== 'awaiting_opening' && (
                    <CareProjectMediaList
                      pkgIsEnglish={pkgIsEnglish}
                      studentId={studentId}
                      studentName={studentName}
                      classCode={pkg.classCode}
                    />
                  )}

                  {/* Báo cáo Tháng của Học viên - Chỉ hiển thị khi lớp đã bắt đầu học (chờ khai giảng không hiển thị) */}
                  {placementStatus !== 'awaiting_opening' && (
                    <MonthlyCommentsSection
                      monthlyComments={monthlyComments}
                      studentId={studentId}
                      studentName={studentName}
                      studentCode={pkg.classCode || 'HV-S4-10'}
                      onOpenEvaluationTab={() => {
                        setEvaluationModalData({
                          regularSessions,
                          testSessions,
                          className: pkg.className,
                          packageId: pkg.id,
                        })
                        setIsEvaluationModalOpen(true)
                      }}
                    />
                  )}
                </div>
              )}              {isPending && (
                <div className="py-10 text-center select-none flex flex-col items-center justify-center border border-dashed rounded-xl">
                  <EmptyState
                    title="Chương trình học chờ kích hoạt"
                    description="Chương trình học này chưa bắt đầu. Hiện chưa có lịch sử học tập."
                  />
                </div>
              )}
            </div>
          );
        })}

      {/* 2. LỊCH SỬ HỌC TẬP (Lớp cũ) */}
      <HistoricalClassesList
        classDataForPackages={classDataForPackages}
        activePackageId={activePackage?.id || ''}
        expandedPackageIds={expandedPackageIds}
        togglePackage={togglePackage}
        handleCopyLink={handleCopyLink}
        handleOpenEditReportModal={handleOpenEditReportModal}
        setSelectedEvalMonth={setSelectedEvalMonth}
        setSelectedEvalPkgId={setSelectedEvalPkgId}
        setIsEvalOpen={setIsEvalOpen}
        selectedMonth={selectedMonth}
        branchName={currentBranchName}
        studentAlert={currentStudentAlert}
        studentId={studentId}
        studentName={studentName}
        isEnglish={isEnglish}
        onOpenAttendance={(data) => {
          setAttendanceModalData(data)
          setIsAttendanceModalOpen(true)
        }}
        onOpenLeaveReserveDialog={() => setLeaveDialogOpen(true)}
      />

      {/* 3. DIALOGS */}
      <LeaveReserveDetailDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        request={leaveRequest}
        readOnly={true}
      />

      <StudentCareReportLinkDialogs
        isReportDialogOpen={isReportDialogOpen}
        setIsReportDialogOpen={setIsReportDialogOpen}
        isEditReportOpen={isEditReportOpen}
        setIsEditReportOpen={setIsEditReportOpen}
        isEnglish={isEnglish}
        reportTitle={reportTitle}
        setReportTitle={setReportTitle}
        reportUrl={reportUrl}
        setReportUrl={setReportUrl}
        reportNotes={reportNotes}
        setReportNotes={setReportNotes}
        editReportTitle={editReportTitle}
        editReportUrl={editReportUrl}
        setEditReportUrl={setEditReportUrl}
        handleCreateReport={handleCreateReport}
        handleSaveEditReport={handleSaveEditReport}
      />

      <SemesterEvaluationDialog
        key={`${selectedEvalPkgId}-${selectedEvalMonth}`}
        open={isEvalOpen}
        onOpenChange={setIsEvalOpen}
        studentName={studentName}
        studentId={studentId}
        month={selectedEvalMonth}
        initialData={
          selectedEvalPkgId && selectedEvalMonth
            ? evalOverrides[`${selectedEvalPkgId}-${selectedEvalMonth}`]
            : undefined
        }
        onUpdate={(data) => {
          if (selectedEvalPkgId && selectedEvalMonth) {
            setEvalOverrides((prev) => ({
              ...prev,
              [`${selectedEvalPkgId}-${selectedEvalMonth}`]: data,
            }))
          }
        }}
      />

      {testsModalData && (
        <ClassTestsDialog
          open={isTestsModalOpen}
          onOpenChange={setIsTestsModalOpen}
          testSessions={testsModalData.testSessions}
          isEnglish={testsModalData.isEnglish}
          className={testsModalData.className}
          multiClassSessions={multiClassData.allTestSessions}
          classList={multiClassData.classList}
          initialPackageId={testsModalData.packageId || 'all'}
        />
      )}

      {attendanceModalData && (
        <ClassAttendanceDialog
          open={isAttendanceModalOpen}
          onOpenChange={setIsAttendanceModalOpen}
          regularSessions={attendanceModalData.regularSessions}
          testSessions={attendanceModalData.testSessions}
          className={attendanceModalData.className}
          classCode={attendanceModalData.classCode}
          isHistoricalClass={Boolean(
            attendanceModalData.isHistorical ||
            (attendanceModalData.packageId && attendanceModalData.packageId !== activePackage?.id)
          )}
          multiClassSessions={
            attendanceModalData.isHistorical ||
            (attendanceModalData.packageId && attendanceModalData.packageId !== activePackage?.id)
              ? undefined
              : multiClassData.allAttendanceSessions
          }
          classList={
            attendanceModalData.isHistorical ||
            (attendanceModalData.packageId && attendanceModalData.packageId !== activePackage?.id)
              ? []
              : multiClassData.classList
          }
          initialPackageId={attendanceModalData.packageId || 'all'}
          onOpenLeave={(date) => { setSelectedLeaveDate(date); setLeaveDialogOpen(true); }}
        />
      )}

      {homeworkModalData && (
        <ClassHomeworkDialog
          open={isHomeworkModalOpen}
          onOpenChange={setIsHomeworkModalOpen}
          regularSessions={homeworkModalData.regularSessions}
          className={homeworkModalData.className}
          multiClassSessions={multiClassData.allHomeworkSessions}
          classList={multiClassData.classList}
          initialPackageId={homeworkModalData.packageId || 'all'}
        />
      )}

      {evaluationModalData && (
        <ClassEvaluationDialog
          open={isEvaluationModalOpen}
          onOpenChange={setIsEvaluationModalOpen}
          regularSessions={evaluationModalData.regularSessions}
          testSessions={evaluationModalData.testSessions}
          className={evaluationModalData.className}
          multiClassSessions={multiClassData.allEvaluationSessions}
          classList={multiClassData.classList}
          initialPackageId={evaluationModalData.packageId || 'all'}
        />
      )}
    </div>
  )
}
