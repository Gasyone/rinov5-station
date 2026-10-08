'use client'

import { useMemo, useState } from 'react'
import {
  Users,
  UserCheck,
  BookOpen,
  Award,
  CalendarOff,
  Snowflake,
  LogOut,
  Pencil,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import { HistoricalClassAiRemarkModal, type ClassRemarkState } from '@/components/screens/care/HistoricalClassAiRemarkModal'
import type { SimulatedPackage } from '@/components/screens/care/studentCareDetailTypes'
import { cn } from '@/lib/utils'
import type { EnrolledClass } from '@/mocks/students'
import type { ClassRecord } from '@/mocks/classRecords'
import type { ClassSession } from '@/mocks/calendarSchedule'
import { getClassPerformance } from './studentDetailClassesHelpers'

export interface StudentEnrolledClassCardProps {
  cls: EnrolledClass
  classRecord?: ClassRecord | null
  studentBranch?: string
  studentLevel?: string
  isPast?: boolean
  defaultExpanded?: boolean
  onOpenClassDetail?: (classCode: string) => void
  onOpenAssignClass?: () => void
  onLeaveClass?: () => void
  onReserveClass?: () => void
  onDropClass?: (classCode: string) => void
  onSelectSession?: (session: ClassSession) => void
}

export function StudentEnrolledClassCard({
  cls,
  classRecord,
  studentBranch,
  studentLevel,
  isPast = false,
  defaultExpanded,
  onOpenClassDetail,
  onLeaveClass,
  onReserveClass,
  onDropClass,
  onSelectSession,
}: StudentEnrolledClassCardProps) {
  // Trạng thái thu gọn/mở rộng cho lớp cũ (lớp gần nhất mặc định mở rộng)
  const [isCardExpanded, setIsCardExpanded] = useState<boolean>(() => {
    if (defaultExpanded !== undefined) return defaultExpanded
    return !isPast
  })
  // Lấy dữ liệu lớp học
  const enrolled = classRecord?.enrolledStudents || 15
  const max = classRecord?.maxStudents || 20
  const trialCount = classRecord?.trialStudents || 2

  // Dữ liệu học tập từ helper dùng chung với màn chăm sóc học viên
  const perf = useMemo(() => getClassPerformance(cls.classCode), [cls.classCode])

  // Thống kê theo mẫu 3 thẻ thông minh khớp 100% hình ảnh mẫu:
  // Card 1: Chuyên cần -> 6/7, Muộn: 1
  const attendanceRatioDisplay = useMemo(() => {
    if (cls.attendanceRate && cls.attendanceRate.includes('/')) return cls.attendanceRate
    return '6/7'
  }, [cls.attendanceRate])

  const lateDisplay = 'Muộn: 1'

  // Card 2: BTVN -> 6/7, Trung bình: 7.5
  const hwRatioDisplay = useMemo(() => {
    if (cls.homeworkRate && cls.homeworkRate.includes('/')) return cls.homeworkRate
    return '6/7'
  }, [cls.homeworkRate])

  const hwAvgDisplay = useMemo(() => {
    if (cls.homeworkScore) return `Trung bình: ${cls.homeworkScore.toFixed(1)}`
    return 'Trung bình: 7.5'
  }, [cls.homeworkScore])

  // Card 3: Điểm kiểm tra -> 8.5, Trước: 8.0
  const testScoreDisplay = useMemo(() => {
    if (cls.finalScore) return cls.finalScore.toFixed(1)
    const raw = perf.latestScore.score.replace(/\s*\/.*$/, '')
    const num = parseFloat(raw)
    return isNaN(num) ? '8.5' : num.toFixed(1)
  }, [cls.finalScore, perf.latestScore.score])

  const priorScoreDisplay = 'Trước: 8.0'

  // Format lịch học
  const scheduleText = useMemo(() => {
    if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
      return cls.scheduleSlots
        .map((s) => `${s.dayOfWeek || ('date' in s ? (s as { date?: string }).date : '')} ${s.startTime}-${s.endTime}`)
        .join(' • ')
    }
    return 'Thứ 3 17:30-19:30 • Thứ 6 17:30-19:30'
  }, [cls.scheduleSlots])



  // Xây dựng thông tin chuỗi bắt đầu: "Thứ, ngày/tháng, giờ bắt đầu - kết thúc"
  const startSessionInfo = useMemo(() => {
    const rawDate = cls.startDate || '2024-08-14'
    let dayOfWeek = 'Thứ 3'
    let timeRange = '17:30 - 19:30'

    if (cls.scheduleSlots && cls.scheduleSlots.length > 0) {
      const firstSlot = cls.scheduleSlots[0]
      if (firstSlot.dayOfWeek) dayOfWeek = firstSlot.dayOfWeek
      if (firstSlot.startTime && firstSlot.endTime) {
        timeRange = `${firstSlot.startTime} - ${firstSlot.endTime}`
      }
    }

    // Chuyển rawDate về DD/MM/YYYY
    let formattedDate = '14/08/2024'
    if (rawDate.includes('-')) {
      const parts = rawDate.split('-')
      if (parts.length === 3) {
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`
      }
    } else if (rawDate.includes('/')) {
      formattedDate = rawDate
    }

    const displayText = `${dayOfWeek}, ${formattedDate}, ${timeRange}`

    // Payload của buổi bắt đầu để hiển thị popup hoặc mở modal chi tiết
    const sessionPayload: ClassSession = {
      id: `sess-start-${cls.classCode}-1`,
      classCode: cls.classCode,
      className: cls.className,
      title: 'Buổi 01: Khảo sát & Khởi động chuyên đề',
      lessonSubtitle: 'Khái niệm tập hợp và các quy luật logic trực quan',
      kctName: cls.curriculumName || 'Toán Archimedes v2.0',
      subject: cls.programName || 'Toán Tư Duy',
      teacher: cls.teacherName || 'GV_HuiLT20',
      assistantTeacher: cls.assistantName || 'Nguyễn Thu Trang',
      branch: cls.branch || studentBranch || 'RinoEdu Nguyễn Tuân',
      schoolRoom: cls.room || 'Phòng B202',
      level: cls.level || studentLevel || 'Khối 5 Archimedes',
      date: formattedDate,
      dateDisplay: formattedDate,
      dateBucket: 'past',
      timeLabel: timeRange.split('-')[0]?.trim() || '17:30',
      endTimeLabel: timeRange.split('-')[1]?.trim() || '19:30',
      statusLabel: 'Đã diễn ra',
      type: 'class_session',
      typeLabel: 'Chính thức',
      lessonNumber: 1,
      totalStudents: max,
      officialStudents: enrolled,
      trialStudents: trialCount,
      attendedStudents: enrolled,
      status: 'completed',
    }

    return {
      displayText,
      formattedDate,
      timeRange,
      payload: sessionPayload,
    }
  }, [cls, studentBranch, studentLevel, enrolled, max, trialCount])

  // Nhận xét giáo viên / AI tổng hợp cho lớp cũ (Khớp 100% mẫu AI tổng hợp & hỗ trợ chỉnh sửa)
  const isEnglish = cls.level?.toLowerCase().includes('ielts') || studentLevel?.toLowerCase().includes('ielts')

  const initialFeedbackText = useMemo(() => {
    if (cls.teacherFinalFeedback) return cls.teacherFinalFeedback
    if (isEnglish) {
      return 'Học viên tiếp thu bài tốt, ngữ pháp vững vàng, phản xạ nói lưu loát và tương tác tích cực với giáo viên. Điểm kiểm tra cuối kỳ đạt 8.5. Cần luyện thêm từ vựng học thuật. Kiến nghị: Đạt chuẩn đầu ra, đủ điều kiện chuyển tiếp lên khóa tiếp theo.'
    }
    return 'Học viên tiếp thu nhanh các dạng toán tư duy logic, thái độ học tập tích cực và hoàn thành đầy đủ bài tập. Điểm kiểm tra cuối kỳ đạt 9.0. Cần rèn thêm tính cẩn thận ở các bài toán đố hình học để tránh nhầm lẫn số đo. Kiến nghị: Đạt chuẩn đầu ra, đủ điều kiện chuyển tiếp lên trình độ Level B.'
  }, [cls.teacherFinalFeedback, isEnglish])

  const [isEditRemarkOpen, setIsEditRemarkOpen] = useState(false)
  const [remarkState, setRemarkState] = useState<ClassRemarkState>({
    text: initialFeedbackText,
    isAiGenerated: true,
  })

  const simulatedPkg = useMemo<SimulatedPackage>(() => ({
    id: cls.classCode,
    packageName: cls.linkedPackageName || cls.className || 'Toán tư duy',
    totalSessions: cls.totalSessions || 24,
    remainingSessions: 0,
    classCode: cls.classCode,
    className: cls.className,
    teacherCode: cls.teacherName || 'GV',
    schedule: scheduleText,
    attendanceRatio: cls.attendanceRate || '100%',
    homeworkCompletion: 85,
    lastTestScore: cls.finalScore || 9.0,
    priorTestScore: 8.0,
    startDate: cls.startDate || '2023-09-05',
    endDate: cls.endDate || '2023-12-15',
    level: cls.level || studentLevel || 'Toán 1:6',
    subLevel: cls.subLevel || 'B',
    status: 'expired',
  }), [cls, scheduleText, studentLevel])

  // Định dạng ngày theo chuẩn DD/MM/YYYY cho lớp cũ
  const pastClassDateRange = useMemo(() => {
    const formatVN = (dateStr?: string) => {
      if (!dateStr) return ''
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-')
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`
      }
      return dateStr
    }
    const start = formatVN(cls.startDate) || '15/01/2024'
    const end = formatVN(cls.endDate) || '15/04/2024'
    const sessions = cls.usedSessions || cls.totalSessions || 24
    return `Thời gian: ${start} - ${end} (${sessions} buổi)`
  }, [cls.startDate, cls.endDate, cls.usedSessions, cls.totalSessions])

  return (
    <div
      className={cn(
        "rounded-xl border transition-colors text-left shadow-2xs",
        isPast
          ? "px-2 py-1.5 sm:px-2.5 sm:py-1.5 space-y-1 bg-muted/40 hover:bg-muted/50 dark:bg-zinc-900/40 border-border/60 hover:border-border/80"
          : "px-2.5 py-1.5 sm:px-3 sm:py-1.5 space-y-1.5 bg-sky-50/60 dark:bg-sky-950/20 border-sky-200/80 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-700/60"
      )}
    >
      {isPast ? (
        /* ── GIAO DIỆN LỚP CŨ: GỌN GÀNG THEO YÊU CẦU ── */
        <div className="space-y-1">
          {/* HÀNG HEADER CHÍNH: BÊN TRÁI (DÒNG 1: MÃ LỚP + SĨ SỐ, DÒNG 2: THỜI GIAN), BÊN PHẢI (THỐNG KÊ THU GỌN + NÚT ICON) */}
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {/* Cột trái: Thông tin lớp học */}
            <div className="min-w-0 space-y-0.5 flex-1">
              {/* Dòng 1: Mã lớp + Sĩ số đưa về cạnh mã lớp */}
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-muted-foreground font-normal text-[11px]">Lớp</span>
                  <ClassCodeHoverCell
                    classCode={cls.classCode}
                    subject={cls.programName || cls.level || 'Toán tư duy'}
                    level={cls.level || studentLevel || 'Toán 1:6'}
                    subLevel={cls.subLevel}
                    teacherCode={cls.teacherName || 'GV'}
                    schedule={scheduleText}
                    openInNewTab={true}
                    onOpenDetail={onOpenClassDetail}
                    className="font-mono font-normal text-[11.5px]"
                  />
                </div>

                {/* 2. Đưa sĩ số về cạnh mã lớp */}
                <div
                  className="flex items-center gap-1 text-[10.5px] text-muted-foreground font-normal shrink-0"
                  title={`Sĩ số lớp: ${enrolled}/${max} học viên`}
                >
                  <Users className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                  <span className="text-foreground/90 font-medium">{enrolled}/{max}</span>
                </div>
              </div>

              {/* Dòng 2: 1. Bắt đầu sửa thành Thời gian: Ngày bắt đầu và ngày kết thúc, Bỏ ngày kết thúc ở cạnh phải đi */}
              <div className="text-[10.5px] text-muted-foreground font-normal truncate">
                <span>{pastClassDateRange}</span>
              </div>
            </div>

            {/* Cột phải: 4. Thu gọn phần section thống kê học tập đưa về cạnh phải cùng hàng với dòng 1, dòng 2 + 3. Bỏ text thu gọn/mở rộng, để icon thôi */}
            <div className="flex items-center gap-1.5 shrink-0 ml-auto flex-wrap sm:flex-nowrap">
              {/* Chuyên cần */}
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 dark:bg-zinc-800/40 border border-border/40 text-[10.5px] select-none shadow-3xs"
                title={`Chuyên cần: ${attendanceRatioDisplay} (${lateDisplay})`}
              >
                <UserCheck className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-[10px]">Chuyên cần:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{attendanceRatioDisplay}</span>
              </div>

              {/* BTVN */}
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 dark:bg-zinc-800/40 border border-border/40 text-[10.5px] select-none shadow-3xs"
                title={`BTVN: ${hwRatioDisplay} (${hwAvgDisplay})`}
              >
                <BookOpen className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-[10px]">BTVN:</span>
                <span className="font-semibold text-sky-600 dark:text-sky-400">{hwRatioDisplay}</span>
              </div>

              {/* Điểm kiểm tra */}
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-background/60 dark:bg-zinc-800/40 border border-border/40 text-[10.5px] select-none shadow-3xs"
                title={`Điểm kiểm tra: ${testScoreDisplay} (${priorScoreDisplay})`}
              >
                <Award className="h-2.5 w-2.5 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground text-[10px]">Điểm:</span>
                <span className="font-semibold text-violet-600 dark:text-violet-400">{testScoreDisplay}</span>
              </div>

              {/* 3. Bỏ text thu gọn/mở rộng đi, để icon thôi (bỏ viền, nền theo yêu cầu) */}
              <button
                type="button"
                onClick={() => setIsCardExpanded((prev) => !prev)}
                className="p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none ml-0.5"
                title={isCardExpanded ? 'Thu gọn nhận xét' : 'Mở rộng xem nhận xét'}
                aria-expanded={isCardExpanded}
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isCardExpanded && "rotate-180")} />
              </button>
            </div>
          </div>

          {/* 5. Bỏ viền, nền phần nhận xét đi (chỉ hiển thị khi mở rộng) */}
          {isCardExpanded && (
            <div className="pt-1.5 border-t border-border/30 space-y-0.5 text-left animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h5 className="font-medium text-foreground text-[11px] tracking-normal">
                  {remarkState.isAiGenerated
                    ? 'Nhận xét học tập lớp học (AI tổng hợp)'
                    : 'Nhận xét học tập lớp học (Đã duyệt bởi GV)'}
                </h5>

                <button
                  type="button"
                  onClick={() => setIsEditRemarkOpen(true)}
                  className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[10.5px] font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 transition-colors cursor-pointer"
                >
                  <Pencil className="h-2.5 w-2.5 shrink-0 text-sky-600 dark:text-sky-400" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <p className="italic text-foreground/80 dark:text-foreground/75 text-[11px] leading-relaxed">
                &ldquo;{remarkState.text}&rdquo;
              </p>

              <HistoricalClassAiRemarkModal
                open={isEditRemarkOpen}
                onOpenChange={setIsEditRemarkOpen}
                pkg={simulatedPkg}
                teacherName={cls.teacherName || 'GV'}
                studentName="Học viên"
                currentRemark={remarkState}
                onSaveRemark={(_pkgId, updated) => setRemarkState(updated)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* Cụm thông tin lớp: Cột trái (Dòng 1 + Dòng 2) & Cột phải (Cụm Action buttons căn giữa cả 2 dòng) */}
          <div className="flex items-center justify-between gap-2">
            {/* Cột trái: Dòng 1 & Dòng 2 thu hẹp khoảng cách */}
            <div className="min-w-0 flex-1 space-y-0.5">
              {/* Dòng 1: Lớp + Mã lớp + Sĩ số */}
              <div className="flex items-center gap-2 min-w-0 flex-wrap leading-tight">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-muted-foreground font-normal text-[11.5px]">Lớp</span>
                  <ClassCodeHoverCell
                    classCode={cls.classCode}
                    subject={cls.programName || cls.level || 'Toán tư duy'}
                    level={cls.level || studentLevel || 'Toán 1:6'}
                    subLevel={cls.subLevel}
                    teacherCode={cls.teacherName || 'GV'}
                    schedule={scheduleText}
                    openInNewTab={true}
                    onOpenDetail={onOpenClassDetail}
                    className="font-mono font-normal text-xs"
                  />
                </div>

                {/* Sĩ số lớp đưa lên cạnh mã lớp */}
                <div
                  className="flex items-center gap-1 text-[11px] text-muted-foreground font-normal shrink-0"
                  title={`Sĩ số lớp: ${enrolled}/${max} học viên (+${trialCount} mới)`}
                >
                  <Users className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                  <span>
                    <span className="text-foreground font-medium">{enrolled}/{max}</span>
                    <span className="text-muted-foreground font-normal ml-1 text-[10px]">
                      (+{trialCount} mới)
                    </span>
                  </span>
                </div>
              </div>

              {/* Dòng 2: Bắt đầu (bên trái kèm tổng số buổi) */}
              <div className="flex items-center gap-1.5 min-w-0 flex-wrap text-[11px] leading-tight">
                <span className="text-muted-foreground shrink-0 font-normal">Bắt đầu:</span>
                <ClassSessionHoverCard session={startSessionInfo.payload} side="bottom">
                  <button
                    type="button"
                    onClick={() => onSelectSession?.(startSessionInfo.payload)}
                    className="font-normal text-foreground/85 dark:text-foreground/80 hover:text-foreground hover:underline cursor-pointer transition-colors text-left"
                  >
                    {startSessionInfo.displayText}
                  </button>
                </ClassSessionHoverCard>
                <span className="text-muted-foreground font-normal shrink-0">
                  ({cls.totalSessions || 24} buổi)
                </span>
              </div>
            </div>

            {/* Cột phải: Cụm Action buttons cho Lớp đang học - căn giữa cả 2 dòng 1 và 2 */}
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap ml-auto">
              {onLeaveClass && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onLeaveClass}
                  className="h-6 px-2 text-[11px] font-medium text-foreground/80 border-border/80 bg-background hover:bg-muted hover:text-foreground cursor-pointer shadow-3xs"
                  title="Tạo đơn xin nghỉ phép buổi học"
                >
                  <CalendarOff className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>Nghỉ phép</span>
                </Button>
              )}

              {onReserveClass && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onReserveClass}
                  className="h-6 px-2 text-[11px] font-medium text-foreground/80 border-border/80 bg-background hover:bg-muted hover:text-foreground cursor-pointer shadow-3xs"
                  title="Bảo lưu học phí / giữ lớp"
                >
                  <Snowflake className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>Bảo lưu</span>
                </Button>
              )}

              {onDropClass && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onDropClass(cls.classCode)}
                  className="h-6 px-2 text-[11px] font-medium text-destructive/80 border-destructive/30 bg-background hover:bg-destructive/10 hover:text-destructive cursor-pointer shadow-3xs"
                  title="Rút học viên khỏi lớp này về trạng thái chờ ghép lớp"
                >
                  <LogOut className="h-3 w-3 mr-1 text-destructive/70" />
                  <span>Rút lớp</span>
                </Button>
              )}
            </div>
          </div>

          {/* Dòng 3: Thống kê học tập 3 thẻ to cho lớp đang học */}
          <div className="pt-0.5 animate-in fade-in duration-200">
            <div className="grid grid-cols-3 select-none gap-1.5">
              {/* Card 1: Chuyên cần */}
              <div className="border flex flex-col justify-between min-w-0 text-left select-none bg-white/80 dark:bg-zinc-900/40 border-sky-100 dark:border-sky-900/40 rounded-md px-2 py-1 gap-0.5">
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <div className="flex items-center gap-1 min-w-0">
                    <UserCheck className="text-muted-foreground shrink-0 h-3 w-3" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 leading-none text-[11.5px]">
                      {attendanceRatioDisplay}
                    </span>
                  </div>
                  <span className="font-normal text-muted-foreground truncate leading-tight ml-auto text-right text-[10px]">
                    {lateDisplay}
                  </span>
                </div>
                <span className="font-normal text-muted-foreground truncate text-[10px]">
                  Chuyên cần
                </span>
              </div>

              {/* Card 2: BTVN */}
              <div className="border flex flex-col justify-between min-w-0 text-left select-none bg-white/80 dark:bg-zinc-900/40 border-sky-100 dark:border-sky-900/40 rounded-md px-2 py-1 gap-0.5">
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <div className="flex items-center gap-1 min-w-0">
                    <BookOpen className="text-muted-foreground shrink-0 h-3 w-3" />
                    <span className="font-semibold text-sky-600 dark:text-sky-400 leading-none text-[11.5px]">
                      {hwRatioDisplay}
                    </span>
                  </div>
                  <span className="font-normal text-muted-foreground truncate leading-tight ml-auto text-right text-[10px]">
                    {hwAvgDisplay}
                  </span>
                </div>
                <span className="font-normal text-muted-foreground truncate text-[10px]">
                  BTVN
                </span>
              </div>

              {/* Card 3: Điểm kiểm tra */}
              <div className="border flex flex-col justify-between min-w-0 text-left select-none bg-white/80 dark:bg-zinc-900/40 border-sky-100 dark:border-sky-900/40 rounded-md px-2 py-1 gap-0.5">
                <div className="flex items-center justify-between gap-1 min-w-0">
                  <div className="flex items-center gap-1 min-w-0">
                    <Award className="text-muted-foreground shrink-0 h-3 w-3" />
                    <span className="font-semibold text-violet-600 dark:text-violet-400 leading-none text-[11.5px]">
                      {testScoreDisplay}
                    </span>
                  </div>
                  <span className="font-normal text-muted-foreground truncate leading-tight ml-auto text-right text-[10px]">
                    {priorScoreDisplay}
                  </span>
                </div>
                <span className="font-normal text-muted-foreground truncate text-[10px]">
                  Điểm kiểm tra
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
