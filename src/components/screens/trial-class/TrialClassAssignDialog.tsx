'use client'

import { useState, useMemo } from 'react'
import {
  Calendar,
  MapPin,
  User,
  GraduationCap,
  BookOpen,
  Layers,
  Copy,
  Check,
  FileText,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StatusBadge } from '@/components/shared'
import { mockLeads } from '@/mocks/crmLeads'
import type { TrialClass } from '@/mocks/trialClasses'
import type { AssignDialogMode, TrialSessionSelection } from './trialClassTypes'
import {
  formatTrialDate,
  getTrialStatusLabel,
  getStudentAgeText,
  getTrialFamilyMembers,
} from './trialClassHelpers'
import { getSubjectForProgram } from './trialClassCreateHelpers'
import {
  PROGRAM_OPTIONS,
  SUBJECT_MAP,
  CENTER_DATA,
} from './trialClassConstants'
import { TrialClassCreateProgramSection } from './TrialClassCreateProgramSection'
import { TrialClassSchedulePanel } from './TrialClassSchedulePanel'
import { TrialClassAssignSuccessView } from './TrialClassAssignSuccessView'

interface TrialClassAssignDialogProps {
  mode: AssignDialogMode
  trial: TrialClass | null
  onOpenChange: (open: boolean) => void
  onAssign: (
    trialId: string,
    sessions: TrialSessionSelection[],
    notes: string,
    rescheduleReason?: string,
    branch?: string,
    program?: string,
    subject?: string
  ) => void
}

interface AssignContentProps {
  trial: TrialClass
  mode: AssignDialogMode
  onOpenChange: (open: boolean) => void
  onAssign: (
    trialId: string,
    sessions: TrialSessionSelection[],
    notes: string,
    rescheduleReason?: string,
    branch?: string,
    program?: string,
    subject?: string
  ) => void
}

function TrialClassAssignDialogContent({
  trial,
  mode,
  onOpenChange,
  onAssign,
}: AssignContentProps) {
  const isReschedule = mode.mode === 'reschedule'

  const [selectedBranch, setSelectedBranch] = useState(
    trial.branch || trial.school || CENTER_DATA[0].name
  )
  const [selectedProgram, setSelectedProgram] = useState(
    trial.program || PROGRAM_OPTIONS[0]
  )
  const [selectedSubject, setSelectedSubject] = useState(
    trial.subject || getSubjectForProgram(trial.program || PROGRAM_OPTIONS[0])
  )
  const [selectedSessions, setSelectedSessions] = useState<TrialSessionSelection[]>(
    isReschedule ? [] : trial.sessions.map((s) => ({
      classId: s.classId,
      className: s.className,
      sessionId: s.sessionId,
      sessionName: s.sessionName,
      trialDate: s.trialDate,
    }))
  )
  const [internalNotes, setInternalNotes] = useState(trial.notes || '')
  const [sendNotification, setSendNotification] = useState(true)
  const [isCopiedSummary, setIsCopiedSummary] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  // Xử lý đổi chương trình
  const handleProgramChange = (newProgram: string) => {
    setSelectedProgram(newProgram)
    setSelectedSubject(getSubjectForProgram(newProgram))
    setSelectedSessions([])
  }

  // Chọn ca học (chọn 1 ca)
  const handleSelectSession = (session: TrialSessionSelection) => {
    setSelectedSessions((current) => {
      const isAlreadySelected = current.some(
        (s) => s.classId === session.classId && s.sessionId === session.sessionId
      )
      return isAlreadySelected ? [] : [session]
    })
  }

  const selectedSession = selectedSessions[0] || null
  const canConfirm = selectedSessions.length > 0

  const handleConfirm = () => {
    if (!canConfirm) return
    onAssign(
      trial.id,
      selectedSessions,
      internalNotes,
      isReschedule ? 'Đổi buổi học theo yêu cầu' : undefined,
      selectedBranch,
      selectedProgram,
      selectedSubject
    )
    setIsConfirmed(true)
  }

  // Phụ huynh & SĐT
  const familyMembers = getTrialFamilyMembers(trial)
  const primaryMember =
    familyMembers.find((m) => m.isPrimary) ||
    familyMembers[0] || {
      name: trial.parentName || trial.familyName || 'Phụ huynh',
      phone: trial.familyPhone || '---',
    }

  // Thông tin mở rộng về trường học, học lực và địa chỉ phụ huynh
  const leadMatch = useMemo(() => {
    return mockLeads.find(
      (l) =>
        l.studentName.toLowerCase() === trial.studentName.toLowerCase() ||
        l.phone === trial.familyPhone ||
        (trial.customerId && l.id === trial.customerId)
    )
  }, [trial.studentName, trial.familyPhone, trial.customerId])

  const studentSchool =
    trial.currentSchool ||
    leadMatch?.schoolName ||
    'Tiểu học Lương Định Của (Quận 3)'

  const studentAcademic =
    trial.academicPerformance ||
    leadMatch?.academicPerformance ||
    leadMatch?.academicAbility ||
    'Giỏi / Tốt nghiệp loại Ưu'

  const parentAddress =
    trial.parentAddress ||
    trial.address ||
    leadMatch?.address ||
    'Phường Võ Thị Sáu, Quận 3, TP.HCM'

  const formatPhoneMask = (p?: string) => {
    if (!p) return '---'
    const clean = p.replace(/\s+/g, '')
    if (clean.length >= 7) {
      return `${clean.slice(0, 3)}****${clean.slice(-3)}`
    }
    return p
  }

  // Options chương trình
  const programOptions = useMemo(
    () => [
      {
        value: '',
        textValue: 'Chọn chương trình',
        label: (
          <div className="flex items-center py-0.5 min-w-0">
            <span className="text-muted-foreground font-normal text-xs">
              Chọn chương trình
            </span>
          </div>
        ),
        selectedLabel: (
          <span className="text-muted-foreground font-normal text-xs">
            Chọn chương trình
          </span>
        ),
      },
      ...PROGRAM_OPTIONS.map((p) => ({
        value: p,
        textValue: p,
        label: p,
        selectedLabel: p,
      })),
    ],
    []
  )

  // Options môn học
  const subjectOptions = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(Object.values(SUBJECT_MAP)))
    return uniqueSubjects.map((s) => ({
      value: s,
      textValue: s,
      label: s,
      selectedLabel: s,
    }))
  }, [])

  // Options cơ sở
  const schoolSelectOptions = useMemo(
    () => [
      {
        value: '',
        textValue: 'Chọn trung tâm',
        label: (
          <div className="flex items-center py-0.5 min-w-0">
            <span className="text-muted-foreground font-normal text-xs">
              Chọn trung tâm
            </span>
          </div>
        ),
        selectedLabel: (
          <span className="text-muted-foreground font-normal text-xs">
            Chọn trung tâm
          </span>
        ),
      },
      ...CENTER_DATA.map((c) => ({
        value: c.name,
        textValue: `${c.name} (${c.distanceStr})`,
        label: (
          <div className="flex flex-col w-full py-0.5 min-w-0">
            <div className="flex items-center justify-between w-full gap-2">
              <span className="font-medium text-foreground text-xs">{c.name}</span>
              <span className="text-muted-foreground font-normal tabular-nums shrink-0 text-xs">
                {c.distanceStr}
              </span>
            </div>
            <span className="text-xs text-muted-foreground/75 truncate font-normal leading-normal mt-0.5">
              {c.address}
            </span>
          </div>
        ),
        selectedLabel: (
          <div className="flex items-center justify-between w-full gap-2 text-xs">
            <span className="truncate font-medium text-foreground">{c.name}</span>
            <span className="text-muted-foreground font-normal tabular-nums shrink-0 text-xs">
              {c.distanceStr}
            </span>
          </div>
        ),
      })),
    ],
    []
  )

  // Copy tin nhắn Zalo tóm tắt ở cột phải
  const handleCopyZaloSummary = async () => {
    const parentDisplay = primaryMember.name || trial.studentName
    const lines = [
      `🌟 XÁC NHẬN LỊCH HỌC THỬ TRẢI NGHIỆM - RINOEDU 🌟`,
      `Kính gửi Quý phụ huynh ${parentDisplay},`,
      `Hệ thống RinoEdu gửi thông tin ca học thử của con:`,
      `👤 Học viên: ${trial.studentName}`,
      `📚 Chương trình: ${selectedProgram} (${selectedSubject})`,
      ...(selectedSession
        ? [
            `🏫 Lớp học: ${selectedSession.className}`,
            `⏰ Thời gian: ${selectedSession.trialDate}`,
            ...(selectedSession.room ? [`🚪 Phòng học: ${selectedSession.room}`] : []),
            ...(selectedSession.teacher ? [`👩‍🏫 Giáo viên: ${selectedSession.teacher}`] : []),
          ]
        : [`⏰ Thời gian: Chưa gán ca học cụ thể`]),
      `📍 Cơ sở: ${selectedBranch}`,
      `👉 Lưu ý: Ba/Mẹ vui lòng đưa bé đến trước giờ học 10 phút nhé ạ!`,
    ]
    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setIsCopiedSummary(true)
      setTimeout(() => setIsCopiedSummary(false), 2000)
      toast.success('Đã sao chép nội dung tin nhắn gửi Zalo cho phụ huynh!')
    } catch {
      toast.error('Không thể tự động sao chép.')
    }
  }

  // 1. GIAO DIỆN XÁC NHẬN SAU KHI GHÉP LỚP THÀNH CÔNG
  if (isConfirmed) {
    return (
      <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden sm:max-w-4xl lg:max-w-5xl p-0 border shadow-2xl bg-background">
        <TrialClassAssignSuccessView
          trial={trial}
          session={selectedSession}
          branch={selectedBranch}
          program={selectedProgram}
          subject={selectedSubject}
          notes={internalNotes}
          isReschedule={isReschedule}
          onClose={() => onOpenChange(false)}
          onReassign={() => setIsConfirmed(false)}
        />
      </DialogContent>
    )
  }

  // 2. GIAO DIỆN CHỌN LỚP & GHÉP LỚP (2 CỘT CHUẨN BOOKING-TRIAL)
  return (
    <DialogContent className="max-h-[90vh] flex flex-col overflow-hidden sm:max-w-4xl lg:max-w-5xl p-0 border shadow-2xl bg-background">
      {/* Header gọn gàng - Không đường line, text thường màu nhạt, khoảng cách tối ưu */}
      <DialogHeader className="shrink-0 px-4 pt-3 pb-1">
        <div className="flex items-center justify-between gap-3 pr-6">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xs sm:text-sm font-normal text-muted-foreground">
              {isReschedule ? 'Đổi buổi học thử' : 'Ghép lớp học thử'}
            </DialogTitle>
            <Badge variant="outline" className="font-mono text-xs font-normal text-muted-foreground px-1.5 py-0.5">
              {trial.id}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Học viên: <strong className="text-foreground font-medium">{trial.studentName}</strong>
              {trial.customerId ? ` (${trial.customerId})` : ''}
            </span>
            <StatusBadge status={trial.status} label={getTrialStatusLabel(trial.status)} />
          </div>
        </div>
      </DialogHeader>

      {/* Body: 2 Panel song song (Trái Flex-1, Phải ~310px) */}
      <div className="flex-1 overflow-y-auto px-4 pt-1 pb-3 min-h-0">
        <div className="flex flex-col lg:flex-row gap-3 items-start">
          {/* ==================== PANEL TRÁI (FLEX-1): QUY TRÌNH CHỌN LỊCH ==================== */}
          <div className="flex-1 min-w-0 flex flex-col space-y-2 w-full">
            {/* 1. Phần chọn Chương trình, Môn học, Cơ sở & Gợi ý cơ sở gần nhất */}
            <TrialClassCreateProgramSection
              program={selectedProgram}
              onProgramChange={handleProgramChange}
              subject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              school={selectedBranch}
              onSchoolChange={setSelectedBranch}
              programOptions={programOptions}
              subjectOptions={subjectOptions}
              schoolSelectOptions={schoolSelectOptions}
              centerData={CENTER_DATA}
            />

            {/* Lớp cũ cần đổi (chỉ hiện khi đổi lịch) */}
            {isReschedule && (trial.sessions.length > 0 || trial.previousSession) && (
              <div className="p-2.5 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/50 text-xs flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-800 dark:text-amber-300 font-medium">Lớp cũ cần đổi:</span>
                  <span className="text-foreground font-semibold">
                    {trial.sessions.length > 0
                      ? `${trial.sessions[0].className} (${formatTrialDate(trial.sessions[0].trialDate)})`
                      : trial.previousSession
                      ? `${trial.previousSession.className} (${formatTrialDate(trial.previousSession.trialDate)})`
                      : '—'}
                  </span>
                </div>
                <span className="text-amber-600 dark:text-amber-400 italic text-xs">Sẽ được giải phóng</span>
              </div>
            )}

            {/* 2. Section Lịch học & Ca học khả dụng */}
            <TrialClassSchedulePanel
              school={selectedBranch}
              program={selectedProgram}
              selectedSessions={selectedSessions}
              onSelectSession={handleSelectSession}
            />

            {/* 3. Ô Ghi chú đưa xuống dưới cùng Panel Trái chuẩn booking học thử */}
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Nhập ghi chú cho ca học thử (yêu cầu của phụ huynh, tính cách của bé, lưu ý cho giáo viên...)"
              rows={2}
              className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[48px] resize-y shadow-2xs transition-colors"
            />
          </div>

          {/* ==================== PANEL PHẢI (STICKY ~310px): THÔNG TIN & TÓM TẮT ==================== */}
          <div className="w-full lg:w-[310px] xl:w-[325px] shrink-0 space-y-2 self-start">
            {/* THẺ 1: THÔNG TIN HỌC VIÊN & PHỤ HUYNH */}
            <div className="rounded-lg border border-border/70 bg-card p-2.5 space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <span className="text-xs font-bold text-foreground">
                  Thông tin Học viên
                </span>
                <Badge variant="outline" className="text-xs h-4.5 px-1.5 font-medium text-muted-foreground">
                  {trial.attempt || 'Lần 1'}
                </Badge>
              </div>

              <div className="space-y-1 text-xs">
                {/* 1. Tên học viên & Tuổi */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <span className="font-normal text-foreground text-xs truncate">
                    {trial.studentName}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {getStudentAgeText(trial)}
                  </span>
                </div>

                {/* 2. Trường học hiện tại của bé */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground shrink-0">Trường:</span>
                  <span className="font-normal text-foreground truncate max-w-[190px]" title={studentSchool}>
                    {studentSchool}
                  </span>
                </div>

                {/* 3. Học lực */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="text-muted-foreground shrink-0">Học lực:</span>
                  <span className="font-normal text-foreground truncate max-w-[190px]" title={studentAcademic}>
                    {studentAcademic}
                  </span>
                </div>

                {/* ĐƯỜNG LINE TÁCH PHỤ HUYNH RA */}
                <div className="border-t border-border/60 my-1" />

                {/* 4. Phụ huynh & SĐT */}
                <div className="flex items-center justify-between gap-2 min-w-0 pt-0.5">
                  <span className="font-normal text-foreground text-xs truncate">
                    {primaryMember.name}
                  </span>
                  {primaryMember.phone && (
                    <div className="flex items-center gap-1 shrink-0 font-mono text-xs">
                      <span>{primaryMember.phone}</span>
                      <button
                        type="button"
                        title="Sao chép SĐT"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(primaryMember.phone)
                          toast.success('Đã sao chép số điện thoại!')
                        }}
                        className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-0.5 rounded hover:bg-muted ml-0.5"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Địa chỉ phụ huynh */}
                <div className="flex items-start justify-between gap-2 text-xs">
                  <span className="text-muted-foreground shrink-0">Địa chỉ:</span>
                  <span className="font-normal text-foreground text-right truncate max-w-[190px]" title={parentAddress}>
                    {parentAddress}
                  </span>
                </div>

                {/* 6. Cơ sở đăng ký */}
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="shrink-0">Cơ sở đăng ký:</span>
                  <span className="font-normal text-foreground truncate max-w-[180px]">
                    {trial.branch || trial.school}
                  </span>
                </div>

                {/* 7. Ghi chú ban đầu (nếu có) */}
                {trial.notes && (
                  <div className="rounded bg-muted/30 p-1.5 text-xs text-muted-foreground italic border border-border/40 mt-1 flex items-start gap-1">
                    <FileText className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">&ldquo;{trial.notes}&rdquo;</span>
                  </div>
                )}
              </div>
            </div>

            {/* THẺ 2: TÓM TẮT LỊCH HỌC THỬ (SUMMARY CARD CHUẨN) */}
            <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <span className="uppercase tracking-wider text-xs font-bold text-foreground">
                  Tóm tắt lịch học thử
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyZaloSummary}
                  className="h-6 px-2 text-xs gap-1 cursor-pointer font-medium hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 transition-colors shadow-2xs"
                  title="Sao chép nội dung tin nhắn gửi Zalo cho phụ huynh"
                >
                  {isCopiedSummary ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-muted-foreground" />
                      <span>Sao chép</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Danh sách thông tin chi tiết */}
              <div className="space-y-2 text-xs">
                {/* 1. Lịch học thử */}
                <div className="flex items-start gap-2.5 min-w-0">
                  <Calendar className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1 truncate">
                    {selectedSession ? (
                      <span className="font-semibold text-primary">{selectedSession.trialDate}</span>
                    ) : (
                      <span className="text-muted-foreground font-normal">Chưa chọn ca học cụ thể</span>
                    )}
                  </div>
                </div>

                {/* 2. Lớp học & Phòng */}
                <div className="flex items-start gap-2.5 min-w-0">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1 truncate">
                    {selectedSession ? (
                      <span className="font-semibold text-foreground">
                        {selectedSession.className}
                        {selectedSession.room ? ` • ${selectedSession.room}` : ''}
                      </span>
                    ) : (
                      <span className="text-muted-foreground font-normal">Chưa gán lớp (ghép sau)</span>
                    )}
                  </div>
                </div>

                {/* 3. Cơ sở */}
                <div className="flex items-start gap-2.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1 truncate" title={selectedBranch}>
                    <span className="font-semibold text-foreground">{selectedBranch}</span>
                  </div>
                </div>

                {/* 4. Chương trình & Môn */}
                <div className="flex items-start gap-2.5 min-w-0">
                  <Layers className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1 truncate" title={`${selectedProgram} (${selectedSubject})`}>
                    <span className="font-semibold text-foreground">
                      {selectedProgram} ({selectedSubject})
                    </span>
                  </div>
                </div>

                {/* 5. Giáo viên phụ trách */}
                <div className="flex items-start gap-2.5 min-w-0">
                  <GraduationCap className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1 truncate">
                    {selectedSession?.teacher ? (
                      <span className="font-semibold text-foreground">
                        {selectedSession.teacher}
                        {selectedSession.assistantTeacher ? ` (TG: ${selectedSession.assistantTeacher})` : ''}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-muted-foreground font-normal">
                        <AlertCircle className="h-3 w-3 shrink-0 text-amber-500/80" />
                        <span className="truncate">Bộ phận chuyên môn phân công</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. Bài học / Nội dung */}
                {selectedSession?.lessonTopic && (
                  <div className="flex items-start gap-2.5 min-w-0">
                    <FileText className="h-3.5 w-3.5 text-purple-500 mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1 truncate">
                      <span className="font-semibold text-foreground">Bài: </span>
                      <span className="text-foreground">{selectedSession.lessonTopic}</span>
                    </div>
                  </div>
                )}

                {/* 7. Học viên & Phụ huynh */}
                <div className="flex items-start gap-2.5 min-w-0">
                  <User className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1 truncate">
                    <span className="font-semibold text-foreground">
                      {trial.studentName}{' '}
                      <span className="font-normal text-muted-foreground">
                        ({primaryMember.name} - {formatPhoneMask(primaryMember.phone)})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkbox tự động gửi thông báo */}
              <div className="pt-1.5 border-t border-border/60">
                <label className="flex items-center gap-2 cursor-pointer text-[11.5px] text-muted-foreground hover:text-foreground transition-colors">
                  <input
                    type="checkbox"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <span>Tự động gửi SMS / Zalo ZNS xác nhận</span>
                </label>
              </div>

              {/* Nút thao tác xác nhận ghép */}
              <div className="pt-1 space-y-1.5">
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canConfirm}
                  className="w-full gap-1.5 cursor-pointer h-9 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 shadow-2xs transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>{isReschedule ? 'Lưu thay đổi lịch học' : 'Xác nhận ghép lớp ngay'}</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="w-full h-7 text-[11.5px] text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Hủy bỏ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export function TrialClassAssignDialog({
  mode,
  trial,
  onOpenChange,
  onAssign,
}: TrialClassAssignDialogProps) {
  const isOpen = mode.mode !== 'closed'

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trial ? (
        <TrialClassAssignDialogContent
          key={`${trial.id}_${mode.mode}`}
          trial={trial}
          mode={mode}
          onOpenChange={onOpenChange}
          onAssign={onAssign}
        />
      ) : (
        <DialogContent />
      )}
    </Dialog>
  )
}
