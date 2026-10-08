'use client'

import { useState, useMemo } from 'react'
import {
  BookOpen,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  GraduationCap,
  History,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  School,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  AppAvatar,
  StatusBadge,
  ConfirmDialog,
  PersonnelHoverCard,
} from '@/components/shared'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { SessionHoverCard } from '@/components/screens/calendar/SessionHoverCard'
import { MOCK_TRIAL_CLASSES, type TrialClass } from '@/mocks/trialClasses'
import { mockLeads } from '@/mocks/crmLeads'
import {
  formatSessionDateTimeRange,
  getTrialStatusLabel,
  getTrialFamilyMembers,
  buildTrialSessionData,
  getStudentAgeText,
  buildPersonnelItem,
} from './trialClassHelpers'
import type { AssignDialogMode } from './trialClassTypes'
import { DetailCard } from './TrialClassDetailCard'
import { TrialClassDetailFeedbackSection } from './TrialClassDetailFeedbackSection'

interface TrialClassDetailDialogProps {
  trial: TrialClass | null
  onOpenChange: (open: boolean) => void
  onCopy?: (text: string, key: string) => void
  copiedKey?: string
  onOpenAssign?: (mode: AssignDialogMode) => void
  onRequestReschedule?: (trialId: string, reason: string, notes: string) => void
  onUpdateTrial?: (trialId: string, updater: (trial: TrialClass) => TrialClass) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassDetailDialog({
  trial,
  onOpenChange,
  onOpenAssign,
  onApprove,
  onReject,
}: TrialClassDetailDialogProps) {
  const [confirmAction, setConfirmAction] = useState<{ type: string; label: string; description: string } | null>(null)
  const [overrideTrial, setOverrideTrial] = useState<TrialClass | null>(null)
  const [prevTrialId, setPrevTrialId] = useState(trial?.id)
  const [historyPopoverOpen, setHistoryPopoverOpen] = useState(false)
  const [isSessionContentExpanded, setIsSessionContentExpanded] = useState(false)

  // Reset overrideTrial nếu prop trial bên ngoài thay đổi
  if (trial?.id !== prevTrialId) {
    setPrevTrialId(trial?.id)
    setOverrideTrial(null)
  }

  const currentTrial = overrideTrial ?? trial

  // Tìm các lần học thử khác của học viên này (cho phép chuyển đổi xem)
  const previousTrials = useMemo(() => {
    if (!currentTrial) return []
    const cleanName = currentTrial.studentName?.trim().toLowerCase()
    const cleanPhone = currentTrial.familyPhone?.trim()
    return MOCK_TRIAL_CLASSES.filter(
      (t) => t.id !== currentTrial.id && ((cleanName && t.studentName?.trim().toLowerCase() === cleanName) || (cleanPhone && t.familyPhone?.trim() === cleanPhone))
    )
  }, [currentTrial])

  // Đối chiếu lead match để lấy trường học, học lực, địa chỉ
  const leadMatch = useMemo(() => {
    if (!currentTrial) return null
    return (
      mockLeads.find(
        (l) => l.studentName.toLowerCase() === currentTrial.studentName.toLowerCase() || l.phone === currentTrial.familyPhone || (currentTrial.customerId && l.id === currentTrial.customerId)
      ) ?? null
    )
  }, [currentTrial])

  // Profile nhân sự cho Hover Card
  const creatorPersonnelItem = useMemo(
    () => buildPersonnelItem(currentTrial?.creator, 'Nhân viên kinh doanh / Tuyển sinh'),
    [currentTrial?.creator]
  )
  const teacherPersonnelItem = useMemo(
    () => buildPersonnelItem(currentTrial?.owner, 'Giáo viên phụ trách'),
    [currentTrial?.owner]
  )
  const assistantPersonnelItem = useMemo(
    () => buildPersonnelItem(currentTrial?.assistant, 'Trợ giảng lớp học'),
    [currentTrial?.assistant]
  )

  // Nội dung buổi học (ưu tiên sessionContent từ mock, hoặc fallback cấu trúc chuẩn)
  const sessionContent = useMemo(() => {
    if (!currentTrial) return undefined
    if (currentTrial.sessionContent) return currentTrial.sessionContent
    if (currentTrial.sessions.length > 0) {
      return {
        topic: `Buổi học: ${currentTrial.sessions[0].sessionName}`,
        objective: `Làm quen kiến thức chương trình ${currentTrial.program}, đánh giá khả năng tiếp thu và mức độ phù hợp.`,
        activities: [
          'Khởi động & Làm quen lớp học',
          'Tương tác kiến thức trọng tâm bài học',
          'Thực hành bài tập nhóm và tương tác trực tiếp với giáo viên',
          'Đánh giá phản xạ & Ghi nhận nhận xét sau buổi học',
        ],
      }
    }
    return undefined
  }, [currentTrial])

  if (!trial || !currentTrial) return null

  const handleConfirmAction = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'approve') onApprove?.(currentTrial.id)
    if (confirmAction.type === 'reject') onReject?.(currentTrial.id)
    setConfirmAction(null)
  }

  const isPendingReschedule = currentTrial.status === 'reschedule'
  const activeSessions = isPendingReschedule ? [] : currentTrial.sessions
  const releasedSession = currentTrial.previousSession ?? (isPendingReschedule ? currentTrial.sessions[0] : undefined)
  const familyMembers = getTrialFamilyMembers(currentTrial)
  const primaryFamilyMember = familyMembers.find((m) => m.isPrimary) ?? familyMembers[0] ?? { name: currentTrial.parentName || currentTrial.familyName, phone: currentTrial.familyPhone }
  const sessionData = buildTrialSessionData(currentTrial)
  // Nhận xét chỉ tồn tại và hiển thị khi buổi học thử đã hoàn thành (status === 'completed')
  const hasFeedback = currentTrial.status === 'completed' && Boolean(currentTrial.feedback)
  const feedback = hasFeedback ? currentTrial.feedback : undefined

  const studentSchool = currentTrial.currentSchool || leadMatch?.schoolName || 'Tiểu học Chu Văn An (Hà Nội)'
  const studentAbility = currentTrial.academicPerformance || leadMatch?.academicPerformance || leadMatch?.academicAbility || 'Khá - Giỏi / Tiếp thu nhanh'
  const parentAddress = currentTrial.parentAddress || currentTrial.address || leadMatch?.address || 'Thanh Xuân, Hà Nội'
  const parentDisplayName = primaryFamilyMember.name.includes('(') ? primaryFamilyMember.name : `${primaryFamilyMember.name} (Bố)`

  return (
    <>
      <Dialog open={Boolean(trial)} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] flex flex-col gap-0 overflow-hidden sm:max-w-4xl p-0 border shadow-xl bg-background">
          {/* Header gọn gàng: Tiêu đề + Mã phiếu + Badge Trạng thái */}
          <DialogHeader className="shrink-0 px-5 pt-2.5 pb-1 border-b-0">
            <div className="flex items-center justify-between gap-3 pr-6">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xs font-normal text-muted-foreground">
                  Chi tiết Phiếu học thử
                </DialogTitle>
                <Badge variant="outline" className="font-mono text-xs font-semibold px-1.5 py-0.5">
                  {currentTrial.id}
                </Badge>
              </div>
              <div className="shrink-0">
                <StatusBadge
                  status={currentTrial.status === 'reschedule' ? 'confirmed' : currentTrial.status}
                  label={getTrialStatusLabel(currentTrial.status)}
                />
              </div>
            </div>
          </DialogHeader>

          {/* Body: 2 Panel song song (Trái 60%, Phải 40%) */}
          <div className="flex-1 overflow-y-auto px-5 pt-0.5 pb-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
              {/* ==================== PANEL TRÁI (60% - col-span-3): Kết quả & Lịch ghép ==================== */}
              <div className="flex flex-col gap-3 min-w-0 md:col-span-3">
                {/* 1. KẾT QUẢ HỌC THỬ & ĐÁNH GIÁ */}
                <TrialClassDetailFeedbackSection
                  trial={currentTrial}
                  feedback={feedback}
                  activeSessionsCount={activeSessions.length}
                />

                {/* 2. CHI TIẾT LỊCH GHÉP & BUỔI HỌC */}
                <DetailCard
                  title="Chi tiết Lịch ghép & Buổi học"
                  titleClassName="font-normal text-muted-foreground"
                  actions={
                    activeSessions.length > 0 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-1.5 text-xs font-medium text-primary hover:bg-primary/10 cursor-pointer"
                        onClick={() => onOpenAssign?.({ mode: 'reschedule', trialId: currentTrial.id })}
                      >
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Đổi buổi học
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs font-medium text-primary border-primary/30 hover:bg-primary/10 cursor-pointer"
                        onClick={() => onOpenAssign?.({ mode: 'assign', trialId: currentTrial.id })}
                      >
                        <CalendarPlus className="mr-1 h-3 w-3" />
                        Chọn buổi học
                      </Button>
                    )
                  }
                >
                  {activeSessions.length > 0 ? (
                    <div className="space-y-2.5 text-xs">
                      {/* Dòng 1: Thời gian học & Giáo viên / Trợ giảng */}
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Clock className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                          {sessionData ? (
                            <SessionHoverCard session={sessionData}>
                              <span className="font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline text-xs inline-flex items-center gap-1 cursor-pointer">
                                <span>{formatSessionDateTimeRange(activeSessions[0].trialDate)}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                              </span>
                            </SessionHoverCard>
                          ) : (
                            <span className="font-normal text-sky-600 text-xs">
                              {formatSessionDateTimeRange(activeSessions[0].trialDate)}
                            </span>
                          )}
                        </div>

                        {/* Giáo viên & Trợ giảng với Profile Hover Card */}
                        <div className="flex items-center gap-2 shrink-0 text-xs">
                          <PersonnelHoverCard person={teacherPersonnelItem} align="end">
                            <span className="inline-flex items-center gap-1 cursor-pointer hover:underline text-foreground">
                              <GraduationCap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span className="font-semibold truncate max-w-[110px]">
                                {currentTrial.owner || 'Chưa gán GV'}
                              </span>
                            </span>
                          </PersonnelHoverCard>

                          {currentTrial.assistant && (
                            <PersonnelHoverCard person={assistantPersonnelItem} align="end">
                              <span className="inline-flex items-center gap-1 cursor-pointer hover:underline text-muted-foreground hover:text-foreground">
                                <Users className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span className="font-medium text-xs truncate max-w-[110px]">
                                  TG: <span className="font-semibold text-foreground">{currentTrial.assistant}</span>
                                </span>
                              </span>
                            </PersonnelHoverCard>
                          )}
                        </div>
                      </div>

                      {/* Dòng 2: Cơ sở & Phòng học */}
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span className="font-semibold text-foreground text-xs truncate">
                            {currentTrial.branch || currentTrial.school}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 text-xs">
                          <School className="h-3.5 w-3.5 text-violet-500 shrink-0" />
                          <span className="font-medium text-foreground">Phòng 201</span>
                        </div>
                      </div>

                      {/* Dòng 3: Lớp ghép, Buổi học & Môn học */}
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <BookOpen className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <div className="flex items-center gap-1 truncate" onClick={(e) => e.stopPropagation()}>
                            <ClassCodeHoverCell
                              classCode={activeSessions[0].classId}
                              subject={currentTrial.subject}
                              level={currentTrial.program}
                              teacherCode={currentTrial.owner}
                              schedule={formatSessionDateTimeRange(activeSessions[0].trialDate)}
                            />
                            <span className="font-semibold text-foreground text-xs truncate ml-1">
                              {activeSessions[0].className}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs font-normal h-4.5 px-1.5 shrink-0 ml-1">
                            {currentTrial.subject}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {activeSessions[0].sessionName}
                        </span>
                      </div>

                      {/* Ca cũ đã giải phóng (nếu có) */}
                      {releasedSession && (
                        <div className="rounded border border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/40 p-2 text-xs flex items-center justify-between gap-2">
                          <span className="text-amber-800 dark:text-amber-300">
                            Lớp cũ: <strong>{releasedSession.className}</strong> ({formatSessionDateTimeRange(releasedSession.trialDate)})
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 italic shrink-0">Đã giải phóng</span>
                        </div>
                      )}

                      {/* Mở rộng / Thu gọn nội dung buổi học */}
                      {sessionContent && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <button
                            type="button"
                            className="w-full flex items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground py-0.5 cursor-pointer select-none transition-colors"
                            onClick={() => setIsSessionContentExpanded((prev) => !prev)}
                          >
                            <span className="flex items-center gap-1.5 min-w-0">
                              <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="shrink-0 font-medium text-foreground">Nội dung buổi học</span>
                              <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 h-4 truncate max-w-[190px]">
                                {sessionContent.topic}
                              </Badge>
                            </span>
                            <span className="text-xs text-primary flex items-center gap-0.5 shrink-0 ml-2">
                              {isSessionContentExpanded ? (
                                <>
                                  <span>Thu gọn</span>
                                  <ChevronUp className="h-3 w-3" />
                                </>
                              ) : (
                                <>
                                  <span>Chi tiết</span>
                                  <ChevronDown className="h-3 w-3" />
                                </>
                              )}
                            </span>
                          </button>

                          {isSessionContentExpanded && (
                            <div className="mt-2 p-2.5 rounded-md bg-muted/40 border border-border/60 text-xs space-y-2">
                              {sessionContent.objective && (
                                <div>
                                  <span className="font-semibold text-foreground text-xs">Mục tiêu: </span>
                                  <span className="text-muted-foreground text-xs leading-relaxed">
                                    {sessionContent.objective}
                                  </span>
                                </div>
                              )}
                              {sessionContent.activities && sessionContent.activities.length > 0 && (
                                <div>
                                  <span className="font-semibold text-foreground text-xs block mb-1">
                                    Hoạt động buổi học:
                                  </span>
                                  <ul className="space-y-1 pl-4 list-disc text-muted-foreground text-xs">
                                    {sessionContent.activities.map((act, idx) => (
                                      <li key={idx} className="leading-relaxed">
                                        {act}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="group cursor-pointer py-5 px-3 text-center transition-colors hover:bg-muted/30 rounded-md"
                      onClick={() => onOpenAssign?.({ mode: 'assign', trialId: currentTrial.id })}
                    >
                      <p className="text-xs font-semibold text-primary group-hover:underline">
                        Chưa xếp lịch học thử &bull; Chọn buổi ngay
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Click để mở danh sách lớp và ca học khả dụng cho học viên.
                      </p>
                    </div>
                  )}
                </DetailCard>
              </div>

              {/* ==================== PANEL PHẢI (40% - col-span-2): Học viên & Phụ trách ==================== */}
              <div className="flex flex-col gap-3 min-w-0 md:col-span-2">
                {/* 1. THÔNG TIN HỌC VIÊN */}
                <DetailCard
                  title="Thông tin Học viên"
                  titleClassName="font-normal text-muted-foreground"
                  actions={
                    previousTrials.length > 0 ? (
                      <Popover open={historyPopoverOpen} onOpenChange={setHistoryPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1.5 text-xs font-normal gap-1 text-primary hover:text-primary/80 shrink-0 cursor-pointer"
                            title="Xem lịch sử các lần học thử trước đó"
                          >
                            <History className="h-3.5 w-3.5 text-primary" />
                            <span>{previousTrials.length} lần học thử khác</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-80 p-3 shadow-lg bg-popover z-50">
                          <div className="flex items-center justify-between border-b pb-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <History className="h-3.5 w-3.5 text-primary" />
                              <span className="text-xs font-bold text-foreground">
                                Lịch sử học thử ({previousTrials.length + 1} lần)
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">
                              {currentTrial.studentName}
                            </span>
                          </div>
                          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {/* Phiếu hiện tại */}
                            <div className="rounded border border-primary/40 bg-primary/5 p-2 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-primary font-mono">{currentTrial.id}</span>
                                <span className="text-xs font-medium text-primary bg-primary/15 px-1 rounded">
                                  Đang xem
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground text-xs">
                                <span>{currentTrial.sessions[0] ? formatSessionDateTimeRange(currentTrial.sessions[0].trialDate) : 'Chưa xếp lịch'}</span>
                                <span className="font-medium text-foreground">{currentTrial.program}</span>
                              </div>
                            </div>
                            {/* Các phiếu khác: Click để chuyển xem */}
                            {previousTrials.map((pt) => (
                              <button
                                key={pt.id}
                                type="button"
                                onClick={() => {
                                  setOverrideTrial(pt)
                                  setHistoryPopoverOpen(false)
                                }}
                                className="w-full text-left rounded border border-border/70 bg-card hover:bg-muted/60 hover:border-primary/40 transition-colors p-2 text-xs space-y-1 cursor-pointer group"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-semibold text-foreground font-mono group-hover:text-primary transition-colors">
                                      {pt.id}
                                    </span>
                                    <span className="text-xs text-muted-foreground">({pt.attempt || 'Khác'})</span>
                                  </div>
                                  <StatusBadge status={pt.status} label={getTrialStatusLabel(pt.status)} />
                                </div>
                                <div className="flex items-center justify-between text-muted-foreground text-xs">
                                  <span>{pt.sessions[0] ? formatSessionDateTimeRange(pt.sessions[0].trialDate) : 'Chưa xếp lịch'}</span>
                                  <span className="font-medium text-foreground">{pt.program}</span>
                                </div>
                                <div className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                  &rarr; Click để xem chi tiết phiếu này
                                </div>
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Badge variant="outline" className="text-xs font-medium h-5 px-1.5 text-muted-foreground">
                        {currentTrial.attempt || 'Lần 1'}
                      </Badge>
                    )
                  }
                >
                  <div className="space-y-2 text-xs">
                    {/* Dòng 1: Học viên & Ngày sinh / Tuổi */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="font-semibold text-foreground text-xs truncate">
                        {currentTrial.studentName}
                      </span>
                      <span className="text-muted-foreground text-xs shrink-0 text-right">
                        {getStudentAgeText(currentTrial)}
                      </span>
                    </div>

                    {/* Dòng 2: Trường học của học viên */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="text-muted-foreground shrink-0">Trường:</span>
                      <span className="font-normal text-muted-foreground truncate text-right" title={studentSchool}>
                        {studentSchool}
                      </span>
                    </div>

                    {/* Dòng 3: Học lực của học viên */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="text-muted-foreground shrink-0">Học lực:</span>
                      <span className="font-normal text-muted-foreground truncate text-right" title={studentAbility}>
                        {studentAbility}
                      </span>
                    </div>

                    {/* Đường phân cách tách thông tin Phụ huynh */}
                    <div className="border-t border-border/50 my-1" />

                    {/* Dòng 4: Phụ huynh & Số điện thoại */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="font-semibold text-foreground truncate">
                        {parentDisplayName}
                      </span>
                      <span className="font-mono font-normal text-muted-foreground shrink-0">
                        {primaryFamilyMember.phone}
                      </span>
                    </div>

                    {/* Dòng 5: Địa chỉ phụ huynh */}
                    <div className="flex items-center justify-between gap-2 min-w-0 text-xs">
                      <span className="text-muted-foreground shrink-0">Địa chỉ:</span>
                      <span className="font-normal text-muted-foreground truncate text-right" title={parentAddress}>
                        {parentAddress}
                      </span>
                    </div>

                    {/* Thành viên phụ (nếu có) */}
                    {familyMembers.length > 1 && (
                      <div className="space-y-0.5">
                        {familyMembers.filter((m) => !m.isPrimary).map((m, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{m.name}</span>
                            <span className="font-mono">{m.phone}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Ghi chú */}
                    {currentTrial.notes && (
                      <div className="rounded bg-muted/40 p-2 text-xs text-foreground italic border border-border/40 mt-1">
                        &ldquo;{currentTrial.notes}&rdquo;
                      </div>
                    )}
                  </div>
                </DetailCard>

                {/* 2. THỜI HẠN */}
                <DetailCard
                  title="Thời hạn"
                  titleClassName="font-normal text-muted-foreground"
                  actions={
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground shrink-0 cursor-pointer"
                          title="Xem lịch sử thao tác & ghi chú"
                        >
                          <History className="h-3 w-3 text-primary" />
                          <span>Lịch sử ({currentTrial.auditLog.length})</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" className="w-80 p-3 shadow-lg bg-popover z-50">
                        <div className="flex items-center gap-1.5 border-b pb-2 mb-2">
                          <History className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-bold text-foreground">
                            Lịch sử thao tác & ghi chú
                          </span>
                        </div>
                        {currentTrial.auditLog.length === 0 ? (
                          <p className="text-xs text-muted-foreground italic py-1">
                            Chưa có lịch sử thao tác nào.
                          </p>
                        ) : (
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {currentTrial.auditLog.map((log, idx) => (
                              <div key={idx} className="relative pl-3 border-l-2 border-primary/40 text-xs space-y-0.5">
                                <div className="flex items-center justify-between text-muted-foreground text-xs">
                                  <span className="font-semibold text-foreground">{log.author}</span>
                                  <span>{log.timestamp}</span>
                                </div>
                                <p className="font-medium text-foreground">{log.action}</p>
                                {log.detail && (
                                  <p className="text-muted-foreground text-xs">{log.detail}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                  }
                >
                  <div className="space-y-2.5 text-xs">
                    {/* Ngày tạo & Phân loại */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Ngày tạo phiếu:</span>
                      <span className="font-semibold text-foreground">
                        {currentTrial.auditLog[0]?.timestamp || '—'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Lần học thử:</span>
                      <span className="font-semibold text-foreground">
                        {currentTrial.attempt || 'Lần 1'}
                      </span>
                    </div>

                    {/* Người tạo */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <UserPlus className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="text-muted-foreground">Người tạo:</span>
                      </div>
                      <PersonnelHoverCard person={creatorPersonnelItem} align="end">
                        <div className="flex items-center gap-1.5 font-semibold text-foreground truncate max-w-[150px] cursor-pointer hover:underline">
                          <AppAvatar name={currentTrial.creator || 'Hệ thống'} size="xs" />
                          <span className="truncate">{currentTrial.creator || 'Hệ thống'}</span>
                        </div>
                      </PersonnelHoverCard>
                    </div>
                  </div>
                </DetailCard>
              </div>
            </div>
          </div>

          {/* Footer chuẩn: Nút đóng bên trái/phải, nút thao tác chính */}
          <div className="shrink-0 flex items-center justify-between px-5 py-2 border-t border-border/50 bg-muted/15">
            <div>
              {currentTrial.status === 'pending_approval' && activeSessions.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  onClick={() =>
                    setConfirmAction({
                      type: 'reject',
                      label: 'Từ chối ghép lớp',
                      description: 'Bạn có chắc chắn muốn từ chối ghép lớp học thử này?',
                    })
                  }
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Từ chối ghép lớp
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs">
                Đóng
              </Button>

              {/* Action chính theo trạng thái */}
              {currentTrial.status === 'pending_approval' && (
                activeSessions.length > 0 ? (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                    onClick={() => {
                      onApprove?.(currentTrial.id)
                      onOpenChange(false)
                    }}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Xác nhận ghép lớp
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                    onClick={() => onOpenAssign?.({ mode: 'assign', trialId: currentTrial.id })}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Ghép lớp & xác nhận
                  </Button>
                )
              )}

              {currentTrial.status === 'rejected' && (
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                  onClick={() => onOpenAssign?.({ mode: 'assign', trialId: currentTrial.id })}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Ghép lại lớp
                </Button>
              )}

              {currentTrial.status === 'reschedule' && (
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                  onClick={() => onOpenAssign?.({ mode: 'reschedule', trialId: currentTrial.id })}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Đổi buổi học
                </Button>
              )}

              {/* Chỉ hiển thị nút "Mở trang nhận xét" khi buổi học thử đã hoàn thành VÀ có nhận xét */}
              {feedback && currentTrial.status === 'completed' && (
                <Button
                  size="sm"
                  asChild
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                >
                  <a
                    href={feedback.resultLink || `/app/trial_class/feedback/${currentTrial.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Mở trang nhận xét
                  </a>
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          open={Boolean(confirmAction)}
          onOpenChange={(open) => {
            if (!open) setConfirmAction(null)
          }}
          title={confirmAction.label}
          description={confirmAction.description}
          onConfirm={handleConfirmAction}
          variant="destructive"
        />
      )}
    </>
  )
}
