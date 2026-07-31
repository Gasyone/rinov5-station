'use client'

import React, { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  UserPlus,
  Check,
  Search,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { type SimulatedPackage } from './studentCareDetailTypes'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { mockLeaveReserveRequests } from '@/mocks/leaveReserve'
import { toast } from 'sonner'
import { SemesterEvaluationDialog } from './SemesterEvaluationDialog'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { ClassTestsDialog } from './ClassTestsDialog'
import { ClassAttendanceDialog } from './ClassAttendanceDialog'
import { ClassHomeworkDialog } from './ClassHomeworkDialog'
import { ClassEvaluationDialog } from './ClassEvaluationDialog'
import { ClassTeacherHistoryPopover } from './ClassTeacherHistoryPopover'
import { generateSessionHistory, getMockMonthlyReports, getMockEvaluations, type SessionHistory, type SemesterEvaluationData } from './studentCareReportHelpers'
import { HistoricalClassesList } from './HistoricalClassesList'
import { CareReportSmartCards } from './CareReportSmartCards'
import { CareSessionTimelineList } from './CareSessionTimelineList'
import { CareProjectMediaList } from './CareProjectMediaList'
import { MonthlyCommentsSection } from './MonthlyCommentsSection'
import { StudentCareReportLinkDialogs } from './StudentCareReportLinkDialogs'
import { SyllabusProfileHoverCard } from '@/components/screens/classes/SyllabusProfileHoverCard'
import type { ClassRecord } from '@/mocks/classRecords'
import { EmptyState, PersonnelHoverCard, AppAvatar } from '@/components/shared'
import { cn } from '@/lib/utils'

export type { SessionHistory, SemesterEvaluationData }

interface StudentCareReportTabProps {
  studentId: string
  studentName: string
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
}

// ── Main Component ──────────────────────────────────────────────────────

export function StudentCareReportTab({
  studentId,
  studentName,
  activePackage,
  packagesList = [],
  selectedPackageId,
  setSelectedPackageId,
  staffInfo,
  assignedCS,
  onAssignedCSChange,
  branchName,
}: StudentCareReportTabProps) {
  const isEnglish = useMemo(() => {
    if (!activePackage) return true
    const name = activePackage.packageName.toLowerCase()
    return !name.includes('toán')
  }, [activePackage])

  const [internalCS, setInternalCS] = useState('Lê Thị Lan')
  const [csSearchQuery, setCsSearchQuery] = useState('')

  const currentCSName = assignedCS || internalCS
  const handleCSChange = (name: string) => {
    if (onAssignedCSChange) {
      onAssignedCSChange(name)
    }
    setInternalCS(name)
  }

  const currentBranchName = branchName || 'RinoEdu Nguyễn Tuân'

  // CS staff list filtered according to the current Branch (Cơ sở)
  const branchCsMapping: Record<string, Array<{ id: string; name: string; code: string; avatar: string }>> = useMemo(() => ({
    'RinoEdu Nguyễn Tuân': [
      { id: 'cs-1', name: 'Lê Thị Lan', code: 'EMP-CS-001', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lan' },
      { id: 'cs-2', name: 'Minh Phương', code: 'EMP-CS-002', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Phuong' },
      { id: 'cs-3', name: 'Nguyễn Văn Hùng', code: 'EMP-CS-003', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hung' },
    ],
    'RinoEdu Linh Đàm': [
      { id: 'cs-4', name: 'Phạm Thị Hà', code: 'EMP-CS-004', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ha' },
      { id: 'cs-5', name: 'Hoàng Anh Tuấn', code: 'EMP-CS-005', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Tuan' },
    ],
    'RinoEdu Cầu Giấy': [
      { id: 'cs-6', name: 'Đỗ Mai Hương', code: 'EMP-CS-006', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Huong' },
      { id: 'cs-7', name: 'Trần Văn Đức', code: 'EMP-CS-007', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Duc' },
    ],
  }), [])

  const csListForBranch = useMemo(() => {
    return branchCsMapping[currentBranchName] || branchCsMapping['RinoEdu Nguyễn Tuân']
  }, [branchCsMapping, currentBranchName])

  const filteredBranchCsList = useMemo(() => {
    if (!csSearchQuery.trim()) return csListForBranch
    const q = csSearchQuery.toLowerCase()
    return csListForBranch.filter((item) =>
      item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)
    )
  }, [csSearchQuery, csListForBranch])

  const currentCSObj = useMemo(() => {
    return csListForBranch.find((c) => c.name === currentCSName) || csListForBranch[0]
  }, [csListForBranch, currentCSName])
  const [showAllPrograms, setShowAllPrograms] = useState(false)
  const activePackages = useMemo(() => packagesList.filter(p => p.status === 'active'), [packagesList])
  const otherPackages = useMemo(() => packagesList.filter(p => p.status !== 'active'), [packagesList])
  const visiblePackages = useMemo(() => showAllPrograms ? packagesList : activePackages, [packagesList, activePackages, showAllPrograms])
  const selectedMonth = 'all'
  const [customReports, setCustomReports] = useState<{ title: string; date: string; url: string; packageId: string }[]>([])
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [isTestsModalOpen, setIsTestsModalOpen] = useState(false)
  const [testsModalData, setTestsModalData] = useState<{
    testSessions: SessionHistory[]
    isEnglish: boolean
    className: string
  } | null>(null)
  
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false)
  const [attendanceModalData, setAttendanceModalData] = useState<{
    regularSessions: SessionHistory[]
    testSessions: SessionHistory[]
    className: string
    classCode: string
  } | null>(null)

  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false)
  const [homeworkModalData, setHomeworkModalData] = useState<{
    regularSessions: SessionHistory[]
    className: string
  } | null>(null)

  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false)
  const [evaluationModalData, setEvaluationModalData] = useState<{
    regularSessions: SessionHistory[]
    testSessions: SessionHistory[]
    className: string
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

  const togglePackage = (id: string) => {
    setExpandedPackageIds(prev => ({
      ...prev,
      [id]: !(prev[id] ?? id === activePackage?.id)
    }))
  }

  const classDataForPackages = useMemo(() => {
    const listToUse = packagesList.length > 0 ? packagesList : (activePackage ? [activePackage] : [])
    return listToUse.map((pkg) => {
      const pkgIsEnglish = !pkg.packageName.toLowerCase().includes('toán')
      const pkgSessions = generateSessionHistory(studentId, pkgIsEnglish)
      const allRegular = pkgSessions.filter(s => s.type === 'lesson')
      const allTest = pkgSessions.filter(s => s.type === 'test')

      let regular = allRegular
      let test = allTest
      let evals = [currentClassEval]

      if (pkg.id === 'pkg-3') {
        regular = allRegular.filter(s => s.sessionNumber <= 4)
        test = allTest.filter(s => s.sessionNumber <= 4)
        evals = [oldClassEval]
      } else if (pkg.id === 'pkg-2') {
        regular = allRegular.slice(0, 5).map((s, idx) => ({ ...s, sessionNumber: idx + 1 }))
        test = allTest.slice(0, 1).map((s) => ({ ...s, sessionNumber: 6 }))
        evals = [supplementalClassEval]
      } else if (pkg.id === 'pkg-4') {
        regular = []
        test = []
        evals = []
      } else {
        regular = allRegular.filter(s => s.sessionNumber >= 5)
        test = allTest.filter(s => s.sessionNumber >= 5)
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

          const monthlyComments = [
            {
              month: 'Tháng 9/2026',
              monthTitle: pkgIsEnglish 
                ? 'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 9 VÀ KẾ HOẠCH HỌC TẬP THÁNG 10'
                : 'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 9 VÀ KẾ HOẠCH HỌC TẬP THÁNG 10',
              dateStr: '01/09/2026 đến 30/09/2026',
              awardBadge: 'CHIẾN BINH BỨT PHÁ',
              teacherName: 'Teacher Mark & Ms.Chloe',
              comment: pkgIsEnglish 
                ? 'Quan sát trong quá trình học cho thấy con tiếp thu rất tốt các bài giảng. Chỉ cần kiên nhẫn hơn ở phần rèn luyện kỹ năng viết, con sẽ đạt kết quả toàn diện hơn nữa.'
                : 'Học viên tiếp thu bài cực kỳ nhanh, phản xạ toán học nhạy bén. Kiên nhẫn trình bày đầy đủ các bước giải sẽ giúp con đạt điểm tuyệt đối.',
              sectionAContent: pkgIsEnglish ? `ĐIỂM NỔI BẬT ĐẠT ĐƯỢC:
Học viên rất năng nổ tương tác nhóm, hiểu bài nhanh và có ý thức tự giác cao. Con ghi nhớ từ vựng và cấu trúc câu tốt, tham gia hăng hái vào các hoạt động phản xạ nghe nói trên lớp.

ĐIỂM CẦN CẢI THIỆN:
Tuy nhiên cần chú ý rèn luyện viết từ vựng kỹ càng hơn để tránh các lỗi chính tả nhỏ. Cần cẩn thận tỉ mỉ hơn khi hoàn thành các đoạn văn ngắn.

QUAN SÁT TRONG QUÁ TRÌNH HỌC CỦA GIÁO VIÊN:
Quan sát trong quá trình học cho thấy con tiếp thu rất tốt các bài giảng. Chỉ cần kiên nhẫn hơn ở phần rèn luyện kỹ năng viết, con sẽ đạt kết quả toàn diện hơn nữa.`
: `ĐIỂM NỔI BẬT ĐẠT ĐƯỢC:
Học viên có tư duy phân tích đề rất tốt, làm đúng các bài toán logic phức tạp. Tự giác giải quyết các dạng toán tư duy nâng cao.

ĐIỂM CẦN CẢI THIỆN:
Cần rèn tính cẩn thận, tránh nhẩm vội ở các phép tính lớn để hạn chế các sai sót số liệu không đáng có.

QUAN SÁT TRONG QUÁ TRÌNH HỌC CỦA GIÁO VIÊN:
Học viên tiếp thu bài cực kỳ nhanh, phản xạ toán học nhạy bén. Kiên nhẫn trình bày đầy đủ các bước giải sẽ giúp con đạt điểm tuyệt đối.`,
              sectionBContent: `MỤC TIÊU & ĐỊNH HƯỚNG HỖ TRỢ:
Trong thời gian tới, để hỗ trợ con cải thiện đúng trọng tâm và phát triển vững vàng hơn, kế hoạch học tập sẽ tập trung vào các dạng bài củng cố kỹ năng và thực hành nâng cao.

KẾ HOẠCH HỌC TẬP BÁM SÁT MỤC TIÊU:
- Trên lớp: Tăng bài tập rèn luyện cá nhân, theo dõi sát quá trình làm bài
- Bài tập: Dạng bài tổng hợp luyện tập hàng tuần
- Thói quen học: Tự rà soát bài làm 5 phút trước khi nộp bài`,
              evaluator: 'Teacher Mark & Giáo vụ Lan',
              date: '25/09/2026'
            },
            {
              month: 'Tháng 8/2026',
              monthTitle: 'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 8 VÀ KẾ HOẠCH HỌC TẬP THÁNG 9',
              dateStr: '01/08/2026 đến 31/08/2026',
              awardBadge: 'HỌC VIÊN XUẤT SẮC',
              teacherName: 'Teacher David & Ms.Chloe',
              comment: pkgIsEnglish
                ? 'Học viên có tố chất tốt, nắm bắt nhanh các cấu trúc ngữ pháp nâng cao. Cần thực hành phát âm chuẩn xác và tự nhiên hơn nữa.'
                : 'Học viên tính toán logic rất xuất sắc, hiểu nhanh các dạng bài toán đố phức tạp. Cần kiên nhẫn hơn khi trình bày các bước giải.',
              sectionAContent: `ĐIỂM NỔI BẬT ĐẠT ĐƯỢC:
Học viên nắm bắt rất nhanh các nội dung học tập nâng cao, tư duy độc lập và hoàn thành xuất sắc các bài kiểm tra định kỳ.

ĐIỂM CẦN CẢI THIỆN:
Cần chú ý trình bày chi tiết và mạch lạc hơn trong các bài tập tổng hợp.

QUAN SÁT TRONG QUÁ TRÌNH HỌC CỦA GIÁO VIÊN:
Tích cực, tập trung cao độ trong các giờ học.`,
              sectionBContent: `MỤC TIÊU & ĐỊNH HƯỚNG HỖ TRỢ:
Duy trì phong độ học tập và thử thách bản thân với các dạng bài nâng cao.

KẾ HOẠCH HỌC TẬP BÁM SÁT MỤC TIÊU:
- Trên lớp: Thực hiện bài tập thách thức nâng cao
- Bài tập: Đọc hiểu và tổng hợp kiến thức
- Thói quen học: Rèn luyện tính tự giác 15 phút mỗi ngày`,
              evaluator: 'Teacher David & Giáo vụ Thảo',
              date: '28/08/2026'
            },
            {
              month: 'Tháng 7/2026',
              monthTitle: 'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 7 VÀ KẾ HOẠCH HỌC TẬP THÁNG 8',
              dateStr: '01/07/2026 đến 31/07/2026',
              awardBadge: 'CHIẾN BINH TIẾN BỘ',
              teacherName: 'Teacher David & Ms.Chloe',
              comment: pkgIsEnglish
                ? 'Em học rất tập trung, hăng hái phát biểu xây dựng bài. Kỹ năng nghe hiểu cải thiện rõ rệt, cần tiếp tục phát huy.'
                : 'Học viên tính toán nhanh, tiếp thu bài tốt trong suốt học kỳ và có kết quả thi cuối khóa xuất sắc.',
              sectionAContent: `ĐIỂM NỔI BẬT ĐẠT ĐƯỢC:
Học viên thi cuối khóa đạt điểm số ấn tượng, sự tiến bộ vượt bậc so với đầu kỳ.

ĐIỂM CẦN CẢI THIỆN:
Tiếp tục rèn luyện thói quen tự học hàng ngày.`,
              sectionBContent: `MỤC TIÊU & ĐỊNH HƯỚNG HỖ TRỢ:
Củng cố nền tảng vững chắc để sẵn sàng cho cấp độ học tiếp theo.`,
              evaluator: 'Teacher David & Giáo vụ Thảo',
              date: '27/07/2026'
            },
            {
              month: 'Tháng 6/2026',
              monthTitle: 'BÁO CÁO HỌC TẬP CHUYÊN SÂU THÁNG 6 VÀ KẾ HOẠCH HỌC TẬP THÁNG 7',
              dateStr: '01/06/2026 đến 30/06/2026',
              awardBadge: 'NGÔI SAO SÁNG TẠO',
              teacherName: 'Teacher Sarah & Ms.Chloe',
              comment: pkgIsEnglish
                ? 'Học viên hoàn thành xuất sắc khóa học Foundation, phản xạ nói tự nhiên, nắm vững kiến thức cấu trúc câu cơ bản của cấp độ.'
                : 'Học viên có sự tiến bộ lớn trong tư duy giải toán, chủ động làm các bài tập mở rộng.',
              sectionAContent: `ĐIỂM NỔI BẬT ĐẠT ĐƯỢC:
Sáng tạo trong học tập, hoàn thành tốt các dự án học tập nhỏ.`,
              sectionBContent: `MỤC TIÊU & ĐỊNH HƯỚNG HỖ TRỢ:
Phát huy tinh thần chủ động sáng tạo.`,
              evaluator: 'Teacher Sarah & Giáo vụ Mai',
              date: '29/06/2026'
            }
          ]

          const classRecordForHover: ClassRecord = {
            id: pkg.id,
            code: pkg.classCode || 'CLS-IELTS-001',
            name: pkg.className,
            level: pkgIsEnglish ? 'IELTS' : 'Toán tư duy',
            syllabus: pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán Tư Duy STEM Rino',
            learningPath: pkgIsEnglish ? 'IELTS Foundation ➔ Academic' : 'Rino Math Standard ➔ Advanced',
            subLevel: pkg.subLevel || (pkgIsEnglish ? '5.0–5.5' : 'Archimedes 5 - A'),
            branch: 'RinoEdu Linh Đàm',
            teacher: staffInfo?.teachers.map((t) => t.name.replace(/^GV\.?\s*/i, '')).join(', ') || 'Giáo viên',
            teacherPhone: '0901234567',
            room: 'P.102 (Tầng 1)',
            schedule: pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)',
            scheduleSlots: [
              { dayOfWeek: 'Thứ 2', date: '27/07', startTime: '17:30', endTime: '19:00' },
              { dayOfWeek: 'Thứ 6', date: '31/07', startTime: '17:30', endTime: '19:00' },
            ],
            startDate: '2026-05-01',
            endDate: pkg.endDate || '2027-05-13',
            maxStudents: 15,
            enrolledStudents: 12,
            status: 'dang_hoc',
            tuitionFee: 3000000,
          }

          return (
            <div key={pkg.id} className="space-y-4">
              {/* Cụm thông tin Gói học & Lớp học - Giản lược thị giác & Tập trung vào thông tin chính */}
              <div className="bg-card dark:bg-zinc-900 border border-border/70 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3 select-none text-left overflow-hidden">
                {/* Row 1: Program Selector (Header bar with soft background tint) */}
                <div className="-mx-3.5 -mt-3.5 sm:-mx-4 sm:-mt-4 p-3 px-3.5 sm:px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap mb-3">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <span className="text-[11px] text-muted-foreground font-medium shrink-0">Lớp:</span>
                    {visiblePackages.map((pItem) => {
                      const isSelected = pItem.id === selectedPackageId
                      const text = `${pItem.packageName} ${pItem.className} ${pItem.classCode}`
                      const shortSubject = /tiếng\s*anh|english|LD_TA/i.test(text)
                        ? 'Tiếng Anh'
                        : /toán|math|LD_TOAN/i.test(text)
                          ? 'Toán tư duy'
                          : pItem.packageName.replace(/^Gói\s*/i, '').replace(/\s*Level.*$/i, '').trim() || 'Lớp học'
                      const displayLabel = pItem.classCode ? `${shortSubject} (${pItem.classCode})` : shortSubject
                      const isPkgActive = pItem.status === 'active'
                      return (
                        <button
                          key={pItem.id}
                          type="button"
                          onClick={() => setSelectedPackageId(pItem.id)}
                          className={cn(
                            "h-6 px-2.5 text-xs rounded-md transition-all flex items-center justify-center cursor-pointer",
                            isSelected
                              ? "bg-sky-600 text-white font-medium shadow-2xs"
                              : isPkgActive
                                ? "bg-muted/40 text-foreground hover:bg-muted/70"
                                : "bg-transparent text-muted-foreground hover:bg-muted/30"
                          )}
                        >
                          <span>{displayLabel}</span>
                          {!isPkgActive && (
                            <span className="text-[9px] text-muted-foreground/70 ml-1 font-normal">
                              ({pItem.status === 'pending' ? 'Chờ' : 'Cũ'})
                            </span>
                          )}
                        </button>
                      )
                    })}
                    {otherPackages.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPrograms(!showAllPrograms)}
                        className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showAllPrograms ? 'Thu gọn' : `Khác (${otherPackages.length})`}</span>
                        {showAllPrograms ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* 2-Column Grid with Merged Groups */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1 text-left">
                  {/* Group 1: Cơ sở & CS phụ trách (Icon Đổi CS ở góc phải hàng nhãn) */}
                  <div className="space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground font-medium">Cơ sở & CS phụ trách</span>
                      {/* Icon đổi CS phụ trách ở góc phải cùng hàng với nhãn */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="p-0.5 text-muted-foreground hover:text-foreground rounded transition-colors cursor-pointer"
                            title={`Đổi CS phụ trách tại ${currentBranchName}`}
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-64 p-2.5 space-y-2 text-xs z-50 shadow-md border bg-popover text-popover-foreground">
                          <div className="pb-1 border-b border-border/40 space-y-0.5">
                            <p className="font-bold text-foreground text-[11px]">Đổi CS phụ trách</p>
                            <p className="text-[10px] text-muted-foreground italic">Danh sách thuộc {currentBranchName}</p>
                          </div>
                          
                          <div className="relative flex items-center">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                            <input
                              type="text"
                              value={csSearchQuery}
                              onChange={(e) => setCsSearchQuery(e.target.value)}
                              placeholder="Tìm nhân viên CS..."
                              className="w-full pl-8 pr-2 py-1.5 bg-muted/30 border border-border/60 rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-sky-500"
                            />
                          </div>

                          <div className="max-h-52 overflow-y-auto space-y-1 pt-0.5">
                            {filteredBranchCsList.length === 0 ? (
                              <p className="text-[11px] text-muted-foreground italic text-center py-2">Không tìm thấy nhân viên thuộc cơ sở</p>
                            ) : (
                              filteredBranchCsList.map((csItem) => (
                                <button
                                  key={csItem.id}
                                  type="button"
                                  onClick={() => {
                                    handleCSChange(csItem.name)
                                    toast.success(`Đã đổi CS phụ trách (${currentBranchName}) thành: ${csItem.name}`)
                                  }}
                                  className={cn(
                                    'w-full text-left p-1.5 rounded-lg text-xs font-semibold hover:bg-muted transition-colors flex items-center justify-between gap-2 cursor-pointer',
                                    currentCSName === csItem.name ? 'bg-muted text-foreground font-bold' : 'text-foreground'
                                  )}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <AppAvatar src={csItem.avatar} name={csItem.name} size="xs" className="h-6 w-6 border border-primary/10 shrink-0" />
                                    <div className="min-w-0 space-y-0.5">
                                      <p className="font-bold text-xs truncate leading-none">{csItem.name}</p>
                                      <p className="font-mono text-[9.5px] text-muted-foreground font-normal leading-none">{csItem.code}</p>
                                    </div>
                                  </div>
                                  {currentCSName === csItem.name && <Check className="h-3.5 w-3.5 text-foreground shrink-0" />}
                                </button>
                              ))
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground flex-wrap">
                      <span>{currentBranchName}</span>
                      <span className="text-border/60 font-normal">•</span>
                      <div className="flex items-center gap-1.5">
                        <AppAvatar
                          src={currentCSObj.avatar}
                          name={currentCSObj.name}
                          size="xs"
                          className="h-4 w-4 border border-primary/10 shrink-0"
                        />
                        <span>{currentCSName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Group 2: KCT & Trình độ */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground font-medium block">KCT & Trình độ</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground flex-wrap">
                      <SyllabusProfileHoverCard cls={classRecordForHover}>
                        <span className="hover:underline cursor-pointer">
                          {pkgIsEnglish ? 'IELTS Junior v2.1' : 'Toán Tư Duy STEM Rino'}
                        </span>
                      </SyllabusProfileHoverCard>
                      <span className="text-border/60 font-normal">•</span>
                      <span>
                        {pkg.level && pkg.subLevel ? (pkg.subLevel.includes(pkg.level) ? pkg.subLevel : `${pkg.level} - ${pkg.subLevel}`) : (pkg.subLevel || pkg.level || 'Level 4 - A')}
                      </span>
                    </div>
                  </div>

                  {/* Group 3: Gói học */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground font-medium block">Gói học</span>
                    <span className="text-xs font-semibold text-foreground block">{pkg.packageName}</span>
                  </div>

                  {/* Group 4: Lịch học */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground font-medium block">Lịch học</span>
                    <span className="text-xs font-semibold text-foreground block">
                      {pkg.schedule || 'Thứ 2, 6 (17:30 - 19:00)'}
                    </span>
                  </div>

                  {/* Group 5: Ngày bắt đầu - Hạn học */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground font-medium block">Ngày bắt đầu - Hạn học</span>
                    <span className="text-xs font-semibold text-foreground block">
                      {pkg.startDate ? (pkg.startDate.includes('-') ? pkg.startDate.split('-').reverse().join('/') : pkg.startDate) : '01/05/2026'} - {pkg.endDate || '25/10/2026'}
                    </span>
                  </div>

                  {/* Group 6: Giáo viên (GV) */}
                  <div className="space-y-0.5 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[11px] text-muted-foreground font-medium block">Giáo viên (GV)</span>
                      {staffInfo && (
                        <div className="flex items-center gap-1 text-xs flex-wrap font-semibold text-foreground">
                          {staffInfo.teachers.map((teacher, idx) => {
                            const cleanedTeacherName = teacher.name.replace(/^GV\.?\s*/i, '')
                            return (
                              <React.Fragment key={teacher.id}>
                                <PersonnelHoverCard person={{ ...teacher, name: cleanedTeacherName }}>
                                  <span className="text-foreground font-semibold hover:underline cursor-pointer text-xs">{cleanedTeacherName}</span>
                                </PersonnelHoverCard>
                                {idx < staffInfo.teachers.length - 1 && <span>,</span>}
                              </React.Fragment>
                            )
                          })}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end pt-1">
                      <ClassTeacherHistoryPopover />
                    </div>
                  </div>
                </div>
              </div>



              {/* 1. Nhóm 5 buổi đã học + 2 buổi sắp tới (Dạng dòng/thẻ) & 2. Nhóm Buổi project thực hành (Media Ảnh/Video) */}
              {!isPending && (
                <div className="space-y-4">
                  {/* Nhật ký Buổi học với SmartCards đặt bên trong (trên các buổi học) */}
                  <CareSessionTimelineList
                    regularSessions={regularSessions}
                    testSessions={testSessions}
                    pkgIsEnglish={pkgIsEnglish}
                    smartCards={
                      <CareReportSmartCards
                        pkg={pkg}
                        regularSessions={regularSessions}
                        testSessions={testSessions}
                        pkgIsEnglish={pkgIsEnglish}
                        avgRating={avgRating}
                        generalComment={generalComment}
                        onOpenAttendance={() => {
                          setAttendanceModalData({
                            regularSessions,
                            testSessions,
                            className: pkg.className,
                            classCode: pkg.classCode
                          })
                          setIsAttendanceModalOpen(true)
                        }}
                        onOpenHomework={() => {
                          setHomeworkModalData({
                            regularSessions,
                            className: pkg.className
                          })
                          setIsHomeworkModalOpen(true)
                        }}
                        onOpenTests={() => {
                          setTestsModalData({
                            testSessions,
                            isEnglish: pkgIsEnglish,
                            className: pkg.className
                          })
                          setIsTestsModalOpen(true)
                        }}
                        onOpenEvaluation={() => {
                          setEvaluationModalData({
                            regularSessions,
                            testSessions,
                            className: pkg.className
                          })
                          setIsEvaluationModalOpen(true)
                        }}
                      />
                    }
                  />

                  {/* Buổi Project Thực hành & Media (Ảnh/Video học viên) */}
                  <CareProjectMediaList
                    pkgIsEnglish={pkgIsEnglish}
                  />

                  <MonthlyCommentsSection
                    monthlyComments={monthlyComments}
                    studentId={studentId}
                    studentName={studentName}
                    onOpenEvaluationTab={() => {
                      setEvaluationModalData({
                        regularSessions,
                        testSessions,
                        className: pkg.className,
                      })
                      setIsEvaluationModalOpen(true)
                    }}
                  />
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

      {/* 2. LỊCH SỬ CÁC LỚP CŨ (Collapsible cards with borders) */}
      {/* 2. LỊCH SỬ CÁC LỚP CŨ (Collapsible cards with borders) */}
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
          onOpenLeave={(date) => { setSelectedLeaveDate(date); setLeaveDialogOpen(true); }}
        />
      )}

      {homeworkModalData && (
        <ClassHomeworkDialog
          open={isHomeworkModalOpen}
          onOpenChange={setIsHomeworkModalOpen}
          regularSessions={homeworkModalData.regularSessions}
          className={homeworkModalData.className}
        />
      )}

      {evaluationModalData && (
        <ClassEvaluationDialog
          open={isEvaluationModalOpen}
          onOpenChange={setIsEvaluationModalOpen}
          regularSessions={evaluationModalData.regularSessions}
          testSessions={evaluationModalData.testSessions}
          className={evaluationModalData.className}
        />
      )}
    </div>
  )
}
