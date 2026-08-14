'use client'

import { RefObject, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Phone, X, ChevronDown, ChevronUp, Plus, Check, Copy, Clock, Pencil, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { isCSDBTag } from './operationsAlertHelpers'
import type { StudentCareAlert, FamilyContact } from '@/mocks/careAlerts'
import type { CareTopic } from './studentCareDetailTypes'
import { CallConnectionBanner } from './CallConnectionBanner'
import { StudentActiveCareCard } from './StudentActiveCareCard'
import { useAuthStore } from '@/stores/useAuthStore'

export function formatContactDisplayName(name: string, relationship: string): string {
  if (!name) return ''
  let clean = name.replace(/^(Châu|Anh|Linh|Minh)\s+(Mẹ|Bố)\s+/i, '').trim()
  clean = clean.replace(/^(Mẹ|Bố)\s+/i, '').trim()
  if (clean.includes('(') && clean.includes(')')) return clean
  if (!relationship) return clean
  return `${clean} (${relationship})`
}

export function getCleanContactName(name: string): string {
  if (!name) return ''
  let clean = name.replace(/^(Châu|Anh|Linh|Minh)\s+(Mẹ|Bố)\s+/i, '').trim()
  clean = clean.replace(/^(Mẹ|Bố)\s+/i, '').trim()
  clean = clean.replace(/\s*\([^)]*\)/g, '').trim()
  return clean
}

export function getCareNatureAbbrev(code: string): string {
  if (code.startsWith('ĐB') || code === 'CSĐB') return 'CSĐB'
  if (code === 'CSTP' || code === 'TP') return 'TP'
  if (code.startsWith('ĐK')) return 'ĐK'
  if (code === 'TB1') return 'THT'
  if (code === 'TB2') return 'TM'
  return 'TYC'
}

export function getCareNatureTextColor(code: string): string {
  const abbrev = getCareNatureAbbrev(code)
  if (abbrev === 'CSĐB') return 'text-red-700 dark:text-red-400'
  if (abbrev === 'TP') return 'text-emerald-700 dark:text-emerald-400'
  if (abbrev === 'ĐK') return 'text-violet-700 dark:text-violet-400'
  if (abbrev === 'THT') return 'text-sky-700 dark:text-sky-400'
  if (abbrev === 'TM') return 'text-indigo-700 dark:text-indigo-400'
  return 'text-amber-700 dark:text-amber-400'
}

export function getCareIssueText(topic: CareTopic): string {
  const code = topic.code
  if (code === 'ĐB1') return 'Cảnh báo C90B, BTVN < 70%'
  if (code === 'ĐK1') return 'Tương tác định kỳ hàng tháng (tháng 7)'
  if (code === 'ĐK2') return 'Cận hạn học phí / nợ phí'
  if (code === 'TB1') return 'Buổi còn lại ≤ 5 (còn 3 buổi)'
  if (code === 'TB2') return 'Thiếu BTVN 2 buổi liên tiếp'
  if (code === 'CSTP') return 'Sắp kết thúc khóa học, cần gia hạn'
  if (code === 'T1') return 'Yêu cầu hỗ trợ chuyển ca học'
  return topic.criteria || topic.name
}

export function getCareAssigneeText(code: string, csStaff?: string, teacherCode?: string): string {
  const cs = `CS ${csStaff || 'Nguyễn Thị Ngọc Anh'}`
  const gv = `GV ${teacherCode || 'Hoàng Thị Mai'}`
  if (code === 'ĐB1' || code === 'TB1' || code === 'TB2') {
    return `${cs} · ${gv}`
  }
  return cs
}

export function getCareDueDate(code: string): string {
  const dateMap: Record<string, string> = {
    'ĐB1': '21/07/2026',
    'ĐK1': '24/07/2026',
    'ĐK2': '25/07/2026',
    'TB1': '26/07/2026',
    'TB2': '27/07/2026',
    'CSTP': '28/07/2026',
    'T1': '29/07/2026',
  }
  return dateMap[code] || '30/07/2026'
}

export function getCareNatureBgStyle(code: string, isExpanded: boolean): string {
  const abbrev = getCareNatureAbbrev(code)
  if (abbrev === 'CSĐB') {
    return isExpanded
      ? "bg-red-100/90 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100 shadow-2xs font-semibold"
      : "bg-red-50/80 dark:bg-red-950/30 border-red-200/80 dark:border-red-900/40 text-red-900 dark:text-red-200 hover:bg-red-100/80"
  }
  if (abbrev === 'TP') {
    return isExpanded
      ? "bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs font-semibold"
      : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100/80"
  }
  if (abbrev === 'ĐK') {
    return isExpanded
      ? "bg-violet-100/90 dark:bg-violet-950/60 border-violet-300 dark:border-violet-800 text-violet-950 dark:text-violet-100 shadow-2xs font-semibold"
      : "bg-violet-50/80 dark:bg-violet-950/30 border-violet-200/80 dark:border-violet-900/40 text-violet-900 dark:text-violet-200 hover:bg-violet-100/80"
  }
  if (abbrev === 'THT') {
    return isExpanded
      ? "bg-sky-100/90 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-950 dark:text-sky-100 shadow-2xs font-semibold"
      : "bg-sky-50/80 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-900/40 text-sky-900 dark:text-sky-200 hover:bg-sky-100/80"
  }
  if (abbrev === 'TM') {
    return isExpanded
      ? "bg-indigo-100/90 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-950 dark:text-indigo-100 shadow-2xs font-semibold"
      : "bg-indigo-50/80 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-900/40 text-indigo-900 dark:text-indigo-200 hover:bg-indigo-100/80"
  }
  return isExpanded
    ? "bg-amber-100/90 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-100 shadow-2xs font-semibold"
    : "bg-amber-50/80 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100/80"
}

export function getRenewalStatusLabel(status: string): string {
  switch (status) {
    case 'moi':
    case 'cham_soc':
      return 'Mới'
    case 'can_nhac':
      return 'Cân nhắc'
    case 'tiem_nang':
      return 'Tiềm năng'
    case 'hen_tai':
      return 'Hẹn tái'
    case 'tai_phi':
      return 'Đã tái phí'
    case 'chong_phi':
      return 'Chồng phí'
    case 'rut_phi':
      return 'Rút phí'
    case 'that_bai':
      return 'Thất bại'
    case 'chua_den_han':
      return 'Chưa đến hạn'
    default:
      return 'Mới'
  }
}

export type CareMode = 'regular' | 'renewal'

interface StudentCareFormCardProps {
  careFormRef: RefObject<HTMLDivElement | null>
  isCSStaff: boolean
  showAllTags: boolean
  setShowAllTags: (val: boolean) => void
  displayedTags: { code: string; label: string; description: string }[]
  statusObj: { label: string; badgeClass: string }
  student?: StudentCareAlert
  isOverdueStatus: boolean
  selectedContact: { name: string; relationship: string; phone: string }
  contactsList: { name: string; relationship: string; phone: string; isPrimary?: boolean }[]
  selectedContactIndex: number
  setSelectedContactIndex: (idx: number) => void
  activeContactPhone: string
  chatChannel: 'telephone' | 'zalo' | 'direct'
  setChatChannel: (ch: 'telephone' | 'zalo' | 'direct') => void
  callOutcome?: string
  setCallOutcome?: (outcome: string) => void
  callbackTime?: string
  setCallbackTime?: (time: string) => void
  showCallbackInput?: boolean
  setShowCallbackInput?: (show: boolean) => void
  startCall: (info: any) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
  chatText: string
  setChatText: (val: string) => void
  expandedTopicCode: string | null
  handleSendChat: () => void
  handleCompleteCare?: () => void
  studentAttitudeNote?: string
  showParentOpinion: boolean
  setShowParentOpinion: (val: boolean) => void
  parentOpinionText: string
  setParentOpinionText: (val: string) => void
  displayPinnedTopics: CareTopic[]
  expandedTopic: CareTopic | null
  setExpandedTopicCode: (code: string | null) => void
  cstpStatus: string
  onCstpStatusChange?: (status: string) => void
  isFormCollapsed: boolean
  setIsFormCollapsed: (val: boolean) => void
  getTagColorClass: (code: string, isExpanded: boolean) => string
  isCaredStatus: boolean
  careMode: CareMode
  onCareModeChange: (mode: CareMode) => void
}

export function StudentCareFormCard({
  careFormRef,
  isCSStaff,
  showAllTags,
  setShowAllTags,
  displayedTags,
  statusObj,
  student,
  isOverdueStatus,
  selectedContact,
  contactsList,
  selectedContactIndex,
  setSelectedContactIndex,
  activeContactPhone,
  chatChannel,
  setChatChannel,
  callOutcome = 'hen_goi_lai',
  setCallOutcome,
  callbackTime = '2026-07-20T14:00',
  setCallbackTime,
  showCallbackInput = true,
  setShowCallbackInput,
  startCall,
  textareaRef,
  chatText,
  setChatText,
  expandedTopicCode,
  handleSendChat,
  handleCompleteCare,
  studentAttitudeNote = "Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân...",
  showParentOpinion,
  setShowParentOpinion,
  parentOpinionText,
  setParentOpinionText,
  displayPinnedTopics,
  expandedTopic,
  setExpandedTopicCode,
  cstpStatus,
  onCstpStatusChange,
  isFormCollapsed,
  setIsFormCollapsed,
  getTagColorClass,
  isCaredStatus,
  careMode,
  onCareModeChange,
}: StudentCareFormCardProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [renewalStatus, setRenewalStatus] = useState<string>('')
  const { user } = useAuthStore()
  const chatRecipient = formatContactDisplayName(selectedContact.name, selectedContact.relationship)

  const isRenewalMode = careMode === 'renewal'

  // Filter Care Tags by mode:
  // Regular mode: show all non-CSTP tags
  // Renewal mode: show only CSTP tag
  // Completed regular tags are HIDDEN. Completed CSDB tags STAY VISIBLE with strikethrough.
  const visibleTopics = useMemo(() => {
    if (isRenewalMode) {
      const cstpTopic = displayPinnedTopics.find((t) => t.code === 'CSTP')
      if (cstpTopic) return [cstpTopic]
      return [
        {
          code: 'CSTP',
          name: 'Chăm sóc Tái phí',
          sla: '5 ngày',
          criteria: 'Sắp kết thúc khóa học, cần gia hạn',
          description: 'Liên hệ trao đổi gia hạn và đóng phí khóa học mới.',
          isCompleted: false,
          careStatus: 'in_progress',
          slaStatus: 'within_sla',
        } as CareTopic,
      ]
    }

    return displayPinnedTopics.filter((topic) => {
      if (topic.code === 'CSTP') return false

      const isCSDB = isCSDBTag(topic.code)
      const isCompletedTag = topic.isCompleted || isCaredStatus
      if (isCompletedTag && !isCSDB) {
        return false
      }
      return true
    })
  }, [displayPinnedTopics, isCaredStatus, isRenewalMode])

  return (
    <div ref={careFormRef} className="space-y-2 text-left mb-3">
      {/* Top Header: Tab Chăm sóc / Tái phí + Các thẻ chăm sóc ngang (Nằm bên ngoài card) */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg flex items-center gap-1 border border-slate-200 dark:border-zinc-700 h-9">
          <button
            type="button"
            onClick={() => onCareModeChange('regular')}
            className={cn(
              'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5',
              !isRenewalMode
                ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200 dark:border-zinc-700 font-bold'
                : 'text-slate-700 dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 font-semibold'
            )}
          >
            <span>Chăm sóc</span>
            {(() => {
              const regTopics = displayPinnedTopics.filter(t => t.code !== 'CSTP' && !(t.isCompleted || isCaredStatus))
              const statusKey = isCaredStatus || regTopics.length === 0 ? 'da_cham_soc' : 'dang_xu_ly'
              const statusLabel = isCaredStatus || regTopics.length === 0 ? 'Đã chăm sóc' : 'Đang xử lý'
              const badgeClass = getStatusBadgeClass(statusKey)

              return (
                <span className={cn('inline-flex items-center justify-center text-[10px] font-bold h-4 px-1.5 rounded-full border transition-colors shadow-3xs', badgeClass)}>
                  {statusLabel} ({regTopics.length})
                </span>
              )
            })()}
          </button>

          <button
            type="button"
            onClick={() => onCareModeChange('renewal')}
            className={cn(
              'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5',
              isRenewalMode
                ? 'bg-white dark:bg-zinc-900 text-foreground dark:text-white shadow-xs border border-slate-200 dark:border-zinc-700 font-bold'
                : 'text-slate-700 dark:text-zinc-300 hover:text-foreground dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 font-semibold'
            )}
          >
            <span>Tái phí</span>
            {(() => {
              const isNotDueYet = student?.activeCSTP === false
              const statusKey = isNotDueYet ? 'chua_den_han' : (cstpStatus || 'moi')
              const statusLabel = getRenewalStatusLabel(statusKey)
              const badgeClass = getStatusBadgeClass(statusKey)

              return (
                <span className={cn('inline-flex items-center justify-center text-[10px] font-bold h-4 px-1.5 rounded-full border transition-colors shadow-3xs', badgeClass)}>
                  {statusLabel}
                </span>
              )
            })()}
          </button>
        </div>

        <div className="space-y-1">
          {visibleTopics.length === 0 ? (
            <div className="py-3 text-center text-[11px] text-muted-foreground italic bg-white dark:bg-zinc-900 rounded-lg border border-border/40">
              {isRenewalMode
                ? (student?.activeCSTP === false
                    ? `Học viên chưa đến kỳ chăm sóc tái phí (Còn ${student?.remainingSessions || 24}/${student?.totalSessions || 30} buổi)`
                    : 'Không có thẻ tái phí')
                : 'Tất cả thẻ chăm sóc đã hoàn thành'}
            </div>
          ) : (
            visibleTopics.map((topic) => {
              const slaStatus = topic.slaStatus || (topic.code === 'ĐB1' ? 'overdue' : topic.code === 'ĐK1' ? 'due_today' : 'within_sla')
              const isCSDB = isCSDBTag(topic.code)
              const isCompletedTag = topic.isCompleted || isCaredStatus

              const natureAbbrev = getCareNatureAbbrev(topic.code)
              const issueText = getCareIssueText(topic)
              const assigneeText = getCareAssigneeText(topic.code, student?.csStaff, (student as any)?.teacherCode || (student as any)?.teacher)
              const dueDate = getCareDueDate(topic.code)
              const rowBgStyle = getCareNatureBgStyle(topic.code, false)

              return (
                <div
                  key={topic.code}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left select-none border shadow-3xs",
                    rowBgStyle,
                    isCompletedTag && isCSDB && "opacity-65"
                  )}
                >
                  <span className={cn("text-[11px] font-extrabold shrink-0 select-none", getCareNatureTextColor(topic.code))}>
                    {natureAbbrev}
                  </span>

                  <span className={cn(
                    "text-[11px] font-semibold shrink-0 max-w-[45%] truncate",
                    isCompletedTag && isCSDB ? "line-through opacity-70" : "text-foreground"
                  )} title={issueText}>
                    {issueText}
                  </span>

                  <span className="text-[10px] text-muted-foreground/60 shrink-0">•</span>

                  <span className="text-[10.5px] font-medium text-muted-foreground flex-1 min-w-0 truncate">
                    Phụ trách: <strong className="font-semibold text-foreground/90">{assigneeText}</strong>
                  </span>

                  {isCompletedTag ? (
                    <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 inline" />
                      <span>Đã xong</span>
                    </span>
                  ) : slaStatus === 'overdue' ? (
                    <span className="text-[11px] font-normal text-red-600 dark:text-red-400 shrink-0">
                      Quá hạn: {dueDate}
                    </span>
                  ) : slaStatus === 'due_today' ? (
                    <span className="text-[11px] font-normal text-amber-600 dark:text-amber-400 shrink-0">
                      Đến hạn: {dueDate}
                    </span>
                  ) : (
                    <span className="text-[11px] font-normal text-muted-foreground shrink-0">
                      Hạn: {dueDate}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Main Section Card: Form nhập liệu tương tác - Phủ toàn bộ màu nền Xanh Sky Light */}
      <div className="bg-sky-50/40 dark:bg-sky-950/25 rounded-2xl border border-sky-200/80 dark:border-sky-900/60 shadow-2xs p-3.5 pt-3 space-y-2">
        <CallConnectionBanner
          isActive={isCallActive}
          contactName={formatContactDisplayName(selectedContact.name, selectedContact.relationship)}
          contactPhone={activeContactPhone}
          onEndCall={() => setIsCallActive(false)}
          onOutcomeSelect={(outcome) => {
            if (setCallOutcome) setCallOutcome(outcome)
          }}
        />

        <div className="select-none animate-in fade-in-50 duration-150 grid grid-cols-1 md:grid-cols-12 gap-3 w-full items-start">
          {/* Left Column (~33%): Contact Info & Controls in horizontal rows */}
          <div className="md:col-span-4 space-y-2 border-b md:border-b-0 md:border-r border-sky-200/60 dark:border-sky-900/50 pb-2 md:pb-0 pr-0 md:pr-3">
            {/* Box cụm người liên hệ phụ huynh (nền trắng nổi bật trên card xanh nhạt) */}
            <div className="p-2 rounded-lg border border-sky-200/80 dark:border-sky-900/70 bg-white/90 dark:bg-zinc-900/90 space-y-1.5 w-full shadow-3xs">
              {/* Row 1: Tên Phụ huynh (dạng dropdown trigger) */}
              <div className="flex items-center justify-between gap-1.5 min-w-0 w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground transition-all cursor-pointer shrink-0 select-none group bg-transparent border-0 p-0 hover:opacity-80 flex-1 min-w-0 truncate justify-start"
                      title="Mở danh sách người liên hệ phụ huynh"
                    >
                      <span className="font-extrabold text-sky-700 dark:text-sky-400 shrink-0">
                        {selectedContact.relationship || 'Mẹ'}
                      </span>
                      <span className="font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                        {getCleanContactName(selectedContact.name)}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-1.5 text-xs" align="start">
                    <div className="font-normal text-[11.5px] text-muted-foreground px-2 py-1 border-b border-border/40 mb-1">
                      Liên hệ cho
                    </div>
                    <div className="space-y-0.5">
                      {contactsList.map((c, idx) => (
                        <button
                          key={c.phone + idx}
                          type="button"
                          onClick={() => setSelectedContactIndex(idx)}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-[11.5px] font-medium flex items-center justify-between transition-colors cursor-pointer',
                            selectedContactIndex === idx
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-bold'
                              : 'hover:bg-muted text-foreground'
                          )}
                        >
                          <div className="flex flex-col">
                            <span>{formatContactDisplayName(c.name, c.relationship)}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{c.phone}</span>
                          </div>
                          {selectedContactIndex === idx && <Check className="h-3.5 w-3.5 text-sky-600 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Row 2: Số ĐT + Copy + Nút Gọi */}
              <div className="flex items-center justify-between gap-1.5 min-w-0 w-full pt-0.5">
                <span className="text-muted-foreground font-mono font-semibold text-xs truncate">
                  {activeContactPhone}
                </span>
                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activeContactPhone)
                        .then(() => toast.success(`Đã sao chép SĐT: ${activeContactPhone}`))
                        .catch(() => toast.error('Không thể sao chép.'))
                    }}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Sao chép số điện thoại"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChatChannel('telephone')
                      if (setCallOutcome) setCallOutcome('nghe_may')
                      setIsCallActive(true)
                      startCall({
                        studentName: student?.studentName || 'Alex (Nguyễn An)',
                        studentCode: student?.classCode || 'HV-S4-10',
                        contactName: selectedContact.name,
                        contactPhone: activeContactPhone,
                        contactRole: selectedContact.relationship,
                      })
                    }}
                    className="h-6 px-2.5 text-[10.5px] font-bold rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1 shadow-2xs shrink-0"
                    title={`Kích hoạt cuộc gọi cho ${formatContactDisplayName(selectedContact.name, selectedContact.relationship)} (${activeContactPhone})`}
                  >
                    <Phone className="h-3 w-3 fill-current text-white" />
                    <span>Gọi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Kênh liên hệ */}
            <div className="flex items-center justify-between gap-2 min-w-0 w-full">
              <span className="text-[10.5px] text-muted-foreground font-medium shrink-0 w-[72px]">
                Kênh liên hệ:
              </span>
              <select
                value={chatChannel}
                onChange={(e) => {
                  const val = e.target.value as 'zalo' | 'telephone' | 'direct'
                  setChatChannel(val)
                  if (val === 'telephone' && setCallOutcome) {
                    setCallOutcome('nghe_may')
                  } else if (val === 'direct' && setCallOutcome) {
                    setCallOutcome('da_gap')
                  }
                }}
                className="h-7 text-xs px-2 rounded-md border border-sky-200/80 dark:border-sky-900/60 bg-white dark:bg-zinc-900 text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-3xs flex-1 min-w-0 truncate"
              >
                <option value="zalo">Zalo</option>
                <option value="telephone">Gọi điện</option>
                <option value="direct">Gặp mặt</option>
              </select>
            </div>

            <div className="flex items-center justify-between gap-2 min-w-0 w-full">
              <span className="text-[10.5px] text-muted-foreground font-medium shrink-0 w-[72px]">
                Kết quả:
              </span>
              <select
                value={callOutcome}
                onChange={(e) => setCallOutcome && setCallOutcome(e.target.value)}
                className="h-7 text-xs px-2 rounded-md border border-sky-200/80 dark:border-sky-900/60 bg-white dark:bg-zinc-900 text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-3xs flex-1 min-w-0 truncate"
              >
                {chatChannel === 'telephone' ? (
                  <>
                    <option value="nghe_may">Nghe máy</option>
                    <option value="khong_nghe">Không nghe máy</option>
                    <option value="may_ban">Máy bận</option>
                  </>
                ) : chatChannel === 'direct' ? (
                  <>
                    <option value="da_gap">Đã gặp</option>
                    <option value="vang_mat">Vắng mặt</option>
                  </>
                ) : (
                  <>
                    <option value="da_nhan">Đã gửi tin nhắn</option>
                    <option value="da_phan_hoi">Phụ huynh đã phản hồi</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex items-center justify-between gap-2 min-w-0 w-full">
              <span className="text-[10.5px] text-muted-foreground font-medium shrink-0 w-[72px]">
                Lịch hẹn:
              </span>
              <input
                type={callbackTime ? 'datetime-local' : 'text'}
                value={callbackTime}
                placeholder="Lên lịch"
                onFocus={(e) => {
                  e.target.type = 'datetime-local'
                  try { e.target.showPicker() } catch {}
                }}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text'
                }}
                onChange={(e) => setCallbackTime && setCallbackTime(e.target.value)}
                className="h-7 text-[11px] px-2 rounded-md border border-sky-200/80 dark:border-sky-900/60 bg-white dark:bg-zinc-900 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-3xs flex-1 min-w-0 placeholder:text-muted-foreground/70"
              />
            </div>

            {isRenewalMode && (
              <div className="flex items-center justify-between gap-2 min-w-0 w-full">
                <span className="text-[10.5px] text-muted-foreground font-medium shrink-0 w-[72px]">
                  Gia hạn:
                </span>
                <select
                  value={
                    renewalStatus ||
                    (['can_nhac', 'tiem_nang', 'hen_tai', 'that_bai'].includes(cstpStatus) ? cstpStatus : '')
                  }
                  onChange={(e) => {
                    const val = e.target.value
                    setRenewalStatus(val)
                    if (onCstpStatusChange) {
                      onCstpStatusChange(val)
                    }
                  }}
                  className="h-7 text-xs px-2 rounded-md border border-sky-200/80 dark:border-sky-900/60 bg-white dark:bg-zinc-900 text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-3xs flex-1 min-w-0 truncate"
                >
                  <option value="" disabled hidden>
                    Chọn phân loại...
                  </option>
                  <option value="can_nhac">Cân nhắc</option>
                  <option value="tiem_nang">Tiềm năng</option>
                  <option value="hen_tai">Hẹn tái</option>
                  <option value="that_bai">Thất bại</option>
                </select>
              </div>
            )}
          </div>

          {/* Right Column (~67%): Resizable Textareas & Action Buttons */}
          <div className="md:col-span-8 space-y-2 flex flex-col justify-between h-full">
            <div className="space-y-1.5 w-full">
              {/* Ô nhập ghi chú: Khung trắng nổi bật (Highlight riêng) trên nền Sky Light của card */}
              <textarea
                ref={textareaRef}
                rows={3}
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault()
                    handleSendChat()
                  }
                }}
                placeholder={
                  expandedTopicCode 
                    ? `Nhập nội dung tương tác cho thẻ ghim [${expandedTopicCode}]...` 
                    : "Nhập ghi chú tóm tắt nội dung đã trao đổi..."
                }
                className="w-full min-h-[76px] max-h-[160px] py-2 px-3 text-xs rounded-lg border border-sky-300 dark:border-sky-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-muted-foreground/70 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 disabled:bg-muted/40 disabled:cursor-not-allowed resize-y overflow-y-auto leading-relaxed shadow-xs transition-all"
              />

              {/* Textarea Phụ huynh phản hồi: Giữ sắc Emerald xanh lá hài hòa */}
              <textarea
                rows={1}
                value={parentOpinionText}
                onChange={(e) => setParentOpinionText(e.target.value)}
                placeholder="Nhập ý kiến / phản hồi của phụ huynh..."
                className="w-full min-h-[34px] h-[36px] max-h-[75px] py-1.5 px-3 text-xs rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/40 focus:bg-white dark:focus:bg-zinc-900 text-emerald-950 dark:text-emerald-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-emerald-700/60 placeholder:font-normal resize-y overflow-y-auto leading-normal shadow-xs transition-all"
              />
            </div>

            {/* Action Buttons: Lưu & Hoàn thành + Lưu */}
            <div className="flex items-center justify-end gap-1.5 pt-1 flex-wrap">
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (handleCompleteCare) handleCompleteCare()
                  setIsCallActive(false)
                }}
                className="h-7 px-3 text-xs font-semibold cursor-pointer shrink-0 bg-transparent text-sky-600 border border-sky-600/40 hover:bg-sky-600 hover:text-white dark:text-sky-400 dark:border-sky-500/40 dark:hover:bg-sky-600 dark:hover:text-white rounded-lg transition-colors shadow-none"
                title="Đánh dấu lưu & hoàn thành đợt chăm sóc này"
              >
                Lưu & Hoàn thành
              </Button>

              <Button
                type="button"
                size="sm"
                disabled={!chatText.trim() && !parentOpinionText.trim()}
                onClick={() => {
                  handleSendChat()
                  setIsCallActive(false)
                }}
                className="h-7 px-4 text-xs font-semibold cursor-pointer shrink-0 bg-sky-600 hover:bg-sky-700 text-white rounded-lg shadow-2xs"
                title="Lưu ghi chú nội dung đã trao đổi"
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>

          {/* Active Care Card */}
          {!isCaredStatus && (
            <div className="border-t border-border/50 pt-2.5 mt-3">
              <StudentActiveCareCard
                student={student}
                chatRecipient={chatRecipient}
                isCaredStatus={isCaredStatus}
              />
            </div>
          )}
        </div>
      </div>
    )
  }
