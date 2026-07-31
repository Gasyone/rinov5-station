'use client'

import { RefObject, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Phone, X, ChevronDown, ChevronUp, Plus, Check, Copy, Clock, Pencil, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CareTagHoverCard } from '@/components/shared'
import { getCareTagAssignees, isCSDBTag, type CareTag } from './operationsAlertHelpers'
import type { StudentCareAlert, FamilyContact } from '@/mocks/careAlerts'
import type { CareTopic } from './studentCareDetailTypes'
import { CallConnectionBanner } from './CallConnectionBanner'
import { useAuthStore } from '@/stores/useAuthStore'

export function formatContactDisplayName(name: string, relationship: string): string {
  if (!name) return ''
  let clean = name.replace(/^(Châu|Anh|Linh|Minh)\s+(Mẹ|Bố)\s+/i, '').trim()
  clean = clean.replace(/^(Mẹ|Bố)\s+/i, '').trim()
  if (clean.includes('(') && clean.includes(')')) return clean
  if (!relationship) return clean
  return `${clean} (${relationship})`
}

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
  cstpStatus: 'cham_soc' | 'tiem_nang' | 'can_nhac' | 'hen_tai'
  isFormCollapsed: boolean
  setIsFormCollapsed: (val: boolean) => void
  getTagColorClass: (code: string, isExpanded: boolean) => string
  isCaredStatus: boolean
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
  isFormCollapsed,
  setIsFormCollapsed,
  getTagColorClass,
  isCaredStatus,
}: StudentCareFormCardProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const { user } = useAuthStore()
  const showAvatarOnTag = user?.role === 'branch_manager' || user?.role === 'admin'
  const isCSOnly = user?.role === 'csm' || user?.role === 'sale'

  // Filter Care Tags:
  // Completed regular tags are HIDDEN.
  // Completed CSDB tags STAY VISIBLE with a strikethrough style.
  const visibleTopics = useMemo(() => {
    return displayPinnedTopics.filter((topic) => {
      const isCSDB = isCSDBTag(topic.code)
      const isCompletedTag = topic.isCompleted || isCaredStatus
      if (isCompletedTag && !isCSDB) {
        return false
      }
      return true
    })
  }, [displayPinnedTopics, isCaredStatus])

  return (
    <div
      ref={careFormRef}
      className="bg-white dark:bg-zinc-950 rounded-2xl border border-border/60 shadow-2xs text-left mb-3 overflow-hidden"
    >
      {/* Top Header Bar: Care Tags on Left, All Switch, Status & Quá hạn on Right */}
      <div className="py-1.5 px-3 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap select-none min-h-[38px] sticky top-0 z-20">
        {/* Left side: All Switch Toggle + Care Tags list */}
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          {isCSOnly && (
            <div className="flex items-center gap-1 shrink-0 mr-1 border-r border-border/40 pr-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">All</span>
              <Switch
                checked={showAllTags}
                onCheckedChange={setShowAllTags}
                className="scale-75 data-[state=checked]:bg-sky-600 cursor-pointer"
                title="Bật để hiển thị cả nhãn chăm sóc của Giáo viên (GV)"
              />
            </div>
          )}

          {/* Care Tags list */}
          {visibleTopics.length === 0 ? (
            <span className="text-[10px] text-muted-foreground italic font-normal">Không có thẻ chăm sóc</span>
          ) : (
            visibleTopics.map((topic) => {
              const isExpanded = expandedTopicCode === topic.code
              const slaStatus = topic.slaStatus || (topic.code === 'ĐB1' ? 'overdue' : topic.code === 'ĐK1' ? 'due_today' : 'within_sla')
              const assignees = getCareTagAssignees({ label: topic.code } as CareTag)
              const isCSDB = isCSDBTag(topic.code)
              const isCompletedTag = topic.isCompleted || isCaredStatus
              
              return (
                <button
                  key={topic.code}
                  type="button"
                  onClick={() => setExpandedTopicCode(isExpanded ? null : topic.code)}
                  className={cn(
                    "h-5.5 px-1.5 text-[10px] font-semibold rounded-md flex items-center gap-1 cursor-pointer border transition-all shadow-none select-none",
                    getTagColorClass(topic.code, isExpanded),
                    isCompletedTag && isCSDB && "opacity-75 border-dashed border-emerald-400 bg-emerald-50/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  )}
                  title={isCompletedTag && isCSDB ? `Nhãn CSĐB đã hoàn thành chăm sóc` : undefined}
                >
                  {!isCompletedTag && slaStatus === 'overdue' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" title="Quá hạn" />
                  )}
                  {!isCompletedTag && slaStatus === 'due_today' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" title="Đến hạn" />
                  )}
                  {isCompletedTag && isCSDB && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" title="Đã hoàn thành" />
                  )}
                  <span className={cn("font-semibold", isCompletedTag && isCSDB && "line-through decoration-emerald-700 decoration-2")}>
                    {topic.code}
                  </span>
                  {showAvatarOnTag && (
                    <div className="flex items-center gap-0.5 shrink-0">
                      {assignees.includes('CS') && (
                        <Avatar
                          className="h-4 w-4 shrink-0 border border-emerald-500/30 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[8px] font-bold"
                          title="CS phụ trách"
                        >
                          <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student?.csStaff || 'CS'}`} alt="CS" />
                          <AvatarFallback className="bg-emerald-600 text-white font-bold text-[7px]">CS</AvatarFallback>
                        </Avatar>
                      )}
                      {assignees.includes('GV') && (
                        <Avatar
                          className="h-4 w-4 shrink-0 border border-purple-500/30 bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[8px] font-bold"
                          title="GV phụ trách"
                        >
                          <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${student?.teacherCode || 'GV'}`} alt="GV" />
                          <AvatarFallback className="bg-purple-600 text-white font-bold text-[7px]">GV</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )}
                  {isExpanded ? <ChevronUp className="h-3 w-3 shrink-0 opacity-70" /> : <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />}
                </button>
              )
            })
          )}
        </div>

        {/* Right side: Status Badges (Quá hạn & Đang xử lý) */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto select-none">
          {isCaredStatus ? (
            <Badge variant="outline" className="text-[9.5px] px-1.5 py-0 font-bold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900">
              Đã chăm sóc
            </Badge>
          ) : (
            <>
              <span className="text-red-600 dark:text-red-400 font-bold font-mono text-[10px]">
                Quá hạn: 2026-07-21 17:00
              </span>
              <Badge variant="outline" className="text-[9.5px] px-1.5 py-0 font-bold bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900">
                Đang xử lý
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Form Content Body (Always Visible) */}
      <div className="p-3.5 pt-2 space-y-2 select-none">

          {/* Expanded Topic Detail Panel */}
          {expandedTopic && (
            <div className="mt-2 p-2.5 bg-muted/20 border rounded text-xs text-left animate-in fade-in-50 duration-150 relative">
              <button 
                type="button" 
                onClick={() => setExpandedTopicCode(null)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              
              <div className="space-y-1.5">
                {/* Header row: Tag code & Name on Left, SLA / Deadline on Right */}
                <div className="flex items-center justify-between gap-2 flex-wrap pr-5">
                  <div className="font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px] font-bold">{expandedTopic.code}</span>
                    <span>{expandedTopic.name}</span>
                    {expandedTopic.code === 'CSTP' && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9.5px] font-bold border",
                        cstpStatus === 'cham_soc' ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                          : cstpStatus === 'tiem_nang' ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-900"
                          : cstpStatus === 'can_nhac' ? "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
                          : "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-900"
                      )}>
                        {cstpStatus === 'cham_soc' ? 'Chăm sóc' : cstpStatus === 'tiem_nang' ? 'Tiềm năng' : cstpStatus === 'can_nhac' ? 'Cân nhắc' : 'Hẹn tái'}
                      </span>
                    )}
                  </div>

                  {/* Deadline info on the top right on the same row */}
                  <div className="flex items-center gap-1.5 text-[10px] ml-auto select-none">
                    {(() => {
                      const slaStatus = expandedTopic.slaStatus || (expandedTopic.code === 'ĐB1' ? 'overdue' : expandedTopic.code === 'ĐK1' ? 'due_today' : 'within_sla')
                      if (slaStatus === 'overdue') {
                        return (
                          <span className="text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                            Quá hạn: 2026-07-21 - Cần xử lý ngay
                          </span>
                        )
                      }
                      if (slaStatus === 'due_today') {
                        return (
                          <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                            Đến hạn: 2026-07-24 - Cần chăm sóc hôm nay
                          </span>
                        )
                      }
                      return (
                        <span className="text-foreground font-medium bg-muted/40 px-2 py-0.5 rounded border border-border">
                          Hạn: 2026-07-26
                        </span>
                      )
                    })()}
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                  <span className="font-bold text-foreground">Tiêu chí:</span> {expandedTopic.criteria}
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {expandedTopic.description}
                </p>
              </div>
            </div>
          )}

          {/* Top row controls: Recipient Contact bar (Left), Channels (Right) */}
          <div className="flex flex-wrap items-center justify-between gap-2 select-none">
            {/* Left: Contact bar with "PH" label & droplist icon */}
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

              {/* Selected Contact Display, Copy, & Phone Call Icon (Sau copy, không nền, kích thước to) */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-foreground">
                  {formatContactDisplayName(selectedContact.name, selectedContact.relationship)}
                </span>
                <span className="text-muted-foreground font-mono font-medium text-[11px]">- {activeContactPhone}</span>
                
                {/* 1. Nút Copy trước */}
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

                {/* 2. Nút Icon + Gọi điện - Nền đỏ, chữ trắng */}
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

            {/* Channels: Zalo, Gọi điện, Gặp mặt (Converted to Selection with gray label) */}
            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              <span className="text-muted-foreground font-normal text-xs shrink-0">
                Chọn Kênh liên hệ:
              </span>
              <select
                value={chatChannel}
                onChange={(e) => {
                  const val = e.target.value as 'zalo' | 'telephone' | 'direct'
                  setChatChannel(val)
                  if (val === 'telephone') {
                    if (setCallOutcome) setCallOutcome('nghe_may')
                    startCall({
                      studentName: student?.studentName || 'Alex (Nguyễn An)',
                      studentCode: student?.classCode || 'HV-S4-10',
                      contactName: selectedContact.name,
                      contactPhone: activeContactPhone,
                      contactRole: selectedContact.relationship,
                    })
                  } else if (val === 'direct') {
                    if (setCallOutcome) setCallOutcome('da_gap')
                  }
                }}
                className="h-7 text-xs px-2.5 rounded-md border border-border bg-background text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-3xs"
              >
                <option value="zalo">Zalo</option>
                <option value="telephone">Gọi điện</option>
                <option value="direct">Gặp mặt</option>
              </select>
            </div>
          </div>

          {/* Live Call Connection Banner (FULL WIDTH 100%, BELOW BOTH CONTACT & CHANNELS) */}
          <CallConnectionBanner
            isActive={isCallActive}
            contactName={formatContactDisplayName(selectedContact.name, selectedContact.relationship)}
            contactPhone={activeContactPhone}
            onEndCall={() => setIsCallActive(false)}
            onOutcomeSelect={(outcome) => {
              if (setCallOutcome) setCallOutcome(outcome)
            }}
          />

          {/* Call / Interaction Outcome Options */}
          <div className="pt-1.5 pb-1 border-t border-border/40 select-none animate-in fade-in-50 duration-150 flex items-center justify-between gap-2 flex-wrap">
            {(chatChannel === 'telephone' || chatChannel === 'direct') ? (
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide shrink-0">
                  Kết quả:
                </span>
                {chatChannel === 'telephone' ? (
                  <>
                    {[
                      { id: 'nghe_may', label: 'Nghe máy', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
                      { id: 'khong_nghe', label: 'Không nghe máy', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' },
                      { id: 'may_ban', label: 'Máy bận', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300' },
                      { id: 'hen_goi_lai', label: 'Hẹn gọi lại', color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (setCallOutcome) setCallOutcome(opt.id)
                        }}
                        className={cn(
                          'px-2 py-0.5 text-[11px] font-semibold rounded-md border transition-all cursor-pointer',
                          callOutcome === opt.id
                            ? 'ring-2 ring-sky-500 font-bold shadow-2xs ' + opt.color
                            : 'bg-background hover:bg-muted text-muted-foreground border-border/70'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { id: 'da_gap', label: 'Đã gặp', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300' },
                      { id: 'hen_gap_lai', label: 'Hẹn gặp lại', color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300' },
                      { id: 'vang_mat', label: 'Vắng mặt', color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          if (setCallOutcome) setCallOutcome(opt.id)
                        }}
                        className={cn(
                          'px-2 py-0.5 text-[11px] font-semibold rounded-md border transition-all cursor-pointer',
                          callOutcome === opt.id
                            ? 'ring-2 ring-sky-500 font-bold shadow-2xs ' + opt.color
                            : 'bg-background hover:bg-muted text-muted-foreground border-border/70'
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </>
                )}
              </div>
            ) : <div />}
          </div>

          {/* Row 2: Ô Textarea chính & ô Phụ huynh phản hồi */}
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

            {/* Input Phụ huynh phản hồi: Nhãn màu xanh emerald lấy mốc từ phần Lịch sử */}
            <div className="flex items-center gap-1.5 text-xs pt-0.5">
              <span className="shrink-0 font-semibold text-xs text-emerald-800 dark:text-emerald-300">
                Phụ huynh phản hồi:
              </span>
              <input
                type="text"
                value={parentOpinionText}
                onChange={(e) => setParentOpinionText(e.target.value)}
                placeholder="Nhập ý kiến / phản hồi của phụ huynh..."
                className="w-full h-7 text-xs px-2 rounded-md border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-emerald-700/50 dark:placeholder:text-emerald-400/50 placeholder:font-normal"
              />
            </div>

            {/* Bottom Action Row: Lịch hẹn bên trái, Hoàn thành + Lưu bên phải */}
            <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
              {/* Left side: Lịch hẹn Field */}
              <div className="flex items-center gap-1.5 text-xs shrink-0">
                <span className="text-muted-foreground font-normal text-xs shrink-0">
                  Lịch hẹn:
                </span>
                <input
                  type="datetime-local"
                  value={callbackTime}
                  onChange={(e) => setCallbackTime && setCallbackTime(e.target.value)}
                  className="h-7 text-xs px-2 rounded-md border border-border bg-background text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Right side: Button Hoàn thành + Button Lưu */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (handleCompleteCare) handleCompleteCare()
                    setIsCallActive(false)
                  }}
                  className="h-7 px-3 text-xs font-semibold cursor-pointer shrink-0 bg-transparent text-sky-600 border border-sky-600/40 hover:bg-sky-600 hover:text-white dark:text-sky-400 dark:border-sky-500/40 dark:hover:bg-sky-600 dark:hover:text-white rounded-lg transition-colors shadow-none"
                  title="Đánh dấu hoàn thành đợt chăm sóc này"
                >
                  Hoàn thành
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
        </div>
    </div>
  )
}
