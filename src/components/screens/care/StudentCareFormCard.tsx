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

export function getCareNatureAbbrev(code: string): string {
  if (code.startsWith('ĐB') || code === 'CSĐB') return 'CSĐB'
  if (code === 'CSTP' || code === 'TP') return 'TP'
  if (code.startsWith('ĐK')) return 'ĐK'
  if (code === 'TB1') return 'THT'
  if (code === 'TB2') return 'TM'
  return 'TYC'
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
    <div
      ref={careFormRef}
      className="bg-white dark:bg-zinc-950 rounded-2xl border border-border/60 shadow-2xs text-left mb-3 overflow-hidden"
    >
      <div className="px-3 pt-2.5 pb-0 sticky top-0 z-20 bg-white dark:bg-zinc-950">
        <div className="w-full bg-slate-100/90 dark:bg-zinc-800/80 p-1 rounded-lg flex items-center gap-1 border border-slate-200/60 dark:border-zinc-700/60 h-9">
          <button
            type="button"
            onClick={() => onCareModeChange('regular')}
            className={cn(
              'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none',
              !isRenewalMode
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-zinc-700/60 font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40 font-medium'
            )}
          >
            <span>Chăm sóc</span>
            {(() => {
              const regTopics = displayPinnedTopics.filter(t => t.code !== 'CSTP' && !(t.isCompleted || isCaredStatus))
              const statusKey = isCaredStatus || regTopics.length === 0 ? 'da_cham_soc' : 'dang_xu_ly'
              const statusLabel = isCaredStatus || regTopics.length === 0 ? 'Đã chăm sóc' : 'Đang xử lý'
              const badgeClass = getStatusBadgeClass(statusKey)

              return (
                <span className={cn('inline-flex items-center justify-center text-[9.5px] font-bold h-4 px-1.5 rounded-full border transition-colors shadow-3xs', badgeClass)}>
                  {statusLabel} ({regTopics.length})
                </span>
              )
            })()}
          </button>

          <button
            type="button"
            onClick={() => onCareModeChange('renewal')}
            className={cn(
              'flex-1 h-7 px-3 rounded-md text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none',
              isRenewalMode
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs border border-slate-200/60 dark:border-zinc-700/60 font-semibold'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/40 dark:hover:bg-zinc-700/40 font-medium'
            )}
          >
            <span>Tái phí</span>
            {(() => {
              const isNotDueYet = student?.activeCSTP === false
              const statusKey = isNotDueYet ? 'chua_den_han' : (cstpStatus || 'moi')
              const statusLabel = getRenewalStatusLabel(statusKey)
              const badgeClass = getStatusBadgeClass(statusKey)

              return (
                <span className={cn('inline-flex items-center justify-center text-[9.5px] font-bold h-4 px-1.5 rounded-full border transition-colors shadow-3xs', badgeClass)}>
                  {statusLabel}
                </span>
              )
            })()}
          </button>
        </div>

        <div className="mt-2 space-y-1">
          {visibleTopics.length === 0 ? (
            <div className="py-3 text-center text-[11px] text-muted-foreground italic">
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
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded font-mono shrink-0 bg-white/90 dark:bg-black/50 border border-current shadow-3xs">
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
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white shrink-0">
                      <CheckCircle className="h-3 w-3 inline -mt-0.5 mr-1" />Đã xong
                    </span>
                  ) : slaStatus === 'overdue' ? (
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-red-600 text-white shrink-0 animate-pulse">
                      Quá hạn: {dueDate}
                    </span>
                  ) : slaStatus === 'due_today' ? (
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded bg-amber-600 text-white shrink-0">
                      Đến hạn: {dueDate}
                    </span>
                  ) : (
                    <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-slate-700 dark:bg-zinc-800 text-white shrink-0">
                      Đến hạn: {dueDate}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      <div className="p-3.5 pt-2 space-y-2 select-none">
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/60 hover:bg-muted text-[11px] font-bold text-foreground border border-border/60 transition-all cursor-pointer shrink-0 select-none shadow-3xs"
                title="Mở danh sách người liên hệ phụ huynh"
              >
                <span className="font-bold text-primary">PH</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-1.5 text-xs" align="start">
              <div className="font-bold text-[11px] text-muted-foreground uppercase px-2 py-1 border-b border-border/40 mb-1">
                Chọn người nhận cuộc gọi / tin nhắn
              </div>
              <div className="space-y-0.5">
                {contactsList.map((c, idx) => (
                  <button
                    key={c.phone + idx}
                    type="button"
                    onClick={() => setSelectedContactIndex(idx)}
                    className={cn(
                      'w-full text-left px-2 py-1 rounded text-[11.5px] font-medium flex items-center justify-between transition-colors cursor-pointer',
                      selectedContactIndex === idx
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-bold'
                        : 'hover:bg-muted text-foreground'
                    )}
                  >
                    <span>{formatContactDisplayName(c.name, c.relationship)}</span>
                    {selectedContactIndex === idx && <Check className="h-3.5 w-3.5 text-sky-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-foreground">
              {formatContactDisplayName(selectedContact.name, selectedContact.relationship)}
            </span>
            <span className="text-muted-foreground font-mono font-medium text-[11px]">- {activeContactPhone}</span>
            
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(activeContactPhone)
                  .then(() => toast.success(`Đã sao chép SĐT: ${activeContactPhone}`))
                  .catch(() => toast.error('Không thể sao chép.'))
              }}
              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors cursor-pointer"
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
              className="h-6 px-2 text-[11px] font-bold rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer inline-flex items-center justify-center gap-1 shadow-2xs"
              title={`Kích hoạt cuộc gọi cho ${formatContactDisplayName(selectedContact.name, selectedContact.relationship)} (${activeContactPhone})`}
            >
              <Phone className="h-3 w-3 fill-current text-white" />
              <span>Gọi điện</span>
            </button>
          </div>
        </div>

        <CallConnectionBanner
          isActive={isCallActive}
          contactName={formatContactDisplayName(selectedContact.name, selectedContact.relationship)}
          contactPhone={activeContactPhone}
          onEndCall={() => setIsCallActive(false)}
          onOutcomeSelect={(outcome) => {
            if (setCallOutcome) setCallOutcome(outcome)
          }}
        />

        <div className={cn(
          "pt-1.5 pb-1 border-t border-border/40 select-none animate-in fade-in-50 duration-150 grid gap-2 w-full",
          isRenewalMode ? "grid-cols-4" : "grid-cols-3"
        )}>
          <div className="flex flex-col items-start gap-1 min-w-0 w-full">
            <span className="text-[10.5px] text-muted-foreground font-normal truncate w-full">
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
              className="h-7 text-xs px-2 rounded-md border border-border bg-background text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-3xs w-full min-w-0 truncate"
            >
              <option value="zalo">Zalo</option>
              <option value="telephone">Gọi điện</option>
              <option value="direct">Gặp mặt</option>
            </select>
          </div>

          <div className="flex flex-col items-start gap-1 min-w-0 w-full">
            <span className="text-[10.5px] text-muted-foreground font-normal truncate w-full">
              Kết quả:
            </span>
            <select
              value={callOutcome}
              onChange={(e) => setCallOutcome && setCallOutcome(e.target.value)}
              className="h-7 text-xs px-2 rounded-md border border-border bg-background text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-3xs w-full min-w-0 truncate"
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

          <div className="flex flex-col items-start gap-1 min-w-0 w-full">
            <span className="text-[10.5px] text-muted-foreground font-normal truncate w-full">
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
              className="h-7 text-[11px] px-2 rounded-md border border-border bg-background text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary shadow-3xs w-full min-w-0 placeholder:text-muted-foreground/70"
            />
          </div>

          {isRenewalMode && (
            <div className="flex flex-col items-start gap-1 min-w-0 w-full">
              <span className="text-[10.5px] text-muted-foreground font-normal truncate w-full">
                Gia hạn:
              </span>
              <select
                value={renewalStatus || cstpStatus}
                onChange={(e) => {
                  const val = e.target.value
                  setRenewalStatus(val)
                  if (onCstpStatusChange) {
                    onCstpStatusChange(val)
                  }
                }}
                className="h-7 text-xs px-2 rounded-md border border-border bg-background text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-3xs w-full min-w-0 truncate"
              >
                <option value="" disabled hidden>Chọn phân loại...</option>
                <option value="moi">Mới</option>
                <option value="can_nhac">Cân nhắc</option>
                <option value="tiem_nang">Tiềm năng</option>
                <option value="hen_tai">Hẹn tái</option>
                <option value="tai_phi">Đã tái phí</option>
                <option value="that_bai">Thất bại</option>
              </select>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <textarea
            ref={textareaRef}
            rows={2}
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
            className="w-full min-h-[44px] max-h-[90px] py-1.5 px-3 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-muted/40 disabled:cursor-not-allowed text-foreground resize-y overflow-y-auto leading-relaxed"
          />

          {/* Input Phụ huynh phản hồi */}
          <div className="pt-0.5">
            <input
              type="text"
              value={parentOpinionText}
              onChange={(e) => setParentOpinionText(e.target.value)}
              placeholder="Nhập ý kiến / phản hồi của phụ huynh..."
              className="w-full h-7 text-xs px-2.5 rounded-md border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-emerald-700/50 dark:placeholder:text-emerald-400/50 placeholder:font-normal"
            />
          </div>

          {/* Action Buttons: Lưu & Hoàn thành + Lưu */}
          <div className="flex items-center justify-end gap-1.5 pt-1.5 flex-wrap">
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
    </div>
  )
}
