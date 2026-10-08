'use client'

import { RefObject, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Phone, ChevronDown, Check, Copy, CheckCircle, Calendar, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { isCSDBTag } from './operationsAlertHelpers'
import {
  type StudentCareAlert,
  type CareInteractionLog,
  linkOrderToStudentCareAlert,
  unlinkOrderFromStudentCareAlert,
  updateRenewalClassification,
} from '@/mocks/careAlerts'
import type { CareTopic } from './studentCareDetailTypes'
import { CallConnectionBanner } from './CallConnectionBanner'
import { StudentActiveCareCard } from './StudentActiveCareCard'
import { StudentRenewalLinkedOrderRow } from './StudentRenewalLinkedOrderRow'
import { ConfirmDialog, StatusBadge } from '@/components/shared'
import { getStudentOrderInfo, resolvePaymentStatusInfo } from './renewal/renewalHelpers'
import { getStudentOrders } from './StudentOrdersTab'
import { mockOrders } from '@/mocks/orders'

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
  if (code.startsWith('ĐB') || code === 'CSĐB' || code === 'CĐB') return 'CĐB'
  if (code === 'CSTP' || code === 'TP' || code === 'CGH' || code === 'CSGH') return 'CGH'
  if (code.startsWith('ĐK') || code.startsWith('CĐK')) return 'CĐK'
  if (code === 'TB1' || code === 'CBH' || code === 'THT' || code === 'CSBH') return 'CBH'
  if (code === 'TB2' || code === 'TM') return 'CBH'
  return 'CYC'
}

export function getCareNatureTextColor(code: string): string {
  const abbrev = getCareNatureAbbrev(code)
  if (abbrev === 'CĐB' || abbrev === 'CSĐB') return 'text-red-700 dark:text-red-400'
  if (abbrev === 'CGH' || abbrev === 'TP') return 'text-emerald-700 dark:text-emerald-400'
  if (abbrev === 'CĐK' || abbrev === 'ĐK') return 'text-violet-700 dark:text-violet-400'
  if (abbrev === 'CBH' || abbrev === 'THT' || abbrev === 'TM') return 'text-sky-700 dark:text-sky-400'
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

export function getCareAssigneeText(code: string): 'CS' | 'GV' | 'CS/GV' {
  const c = (code || '').trim().toUpperCase()
  if (c === 'ĐB1' || c.startsWith('ĐB') || c === 'CĐB' || c === 'CSCĐ') {
    return 'CS/GV'
  }
  if (c === 'TB1' || c === 'TB2' || c.startsWith('TB') || c.startsWith('TH') || c === 'CBH') {
    return 'CS/GV'
  }
  if (c === 'ĐK1' || c === 'CĐK') {
    return 'GV'
  }
  return 'CS'
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
  if (abbrev === 'CĐB' || abbrev === 'CSĐB') {
    return isExpanded
      ? "bg-red-100/90 dark:bg-red-950/60 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100 shadow-2xs font-semibold"
      : "bg-red-50/80 dark:bg-red-950/30 border-red-200/80 dark:border-red-900/40 text-red-900 dark:text-red-200 hover:bg-red-100/80"
  }
  if (abbrev === 'CGH' || abbrev === 'TP') {
    return isExpanded
      ? "bg-emerald-100/90 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 shadow-2xs font-semibold"
      : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100/80"
  }
  if (abbrev === 'CĐK' || abbrev === 'ĐK') {
    return isExpanded
      ? "bg-violet-100/90 dark:bg-violet-950/60 border-violet-300 dark:border-violet-800 text-violet-950 dark:text-violet-100 shadow-2xs font-semibold"
      : "bg-violet-50/80 dark:bg-violet-950/30 border-violet-200/80 dark:border-violet-900/40 text-violet-900 dark:text-violet-200 hover:bg-violet-100/80"
  }
  if (abbrev === 'CBH' || abbrev === 'THT') {
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

export type CareMode = 'regular' | 'renewal' | 'orders' | 'packages'

interface StudentCareFormCardProps {
  careFormRef: RefObject<HTMLDivElement | null>
  isCSStaff: boolean
  showAllTags: boolean
  setShowAllTags: (val: boolean) => void
  displayedTags: { code: string; label: string; description: string }[]
  statusObj: { label: string; badgeClass: string }
  student?: StudentCareAlert
  effectiveLogs?: CareInteractionLog[]
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
  startCall: (params: {
    studentId: string
    studentName: string
    parentPhone: string
    parentName: string
    scheduleItemId?: string | null
  }) => void
  textareaRef: RefObject<HTMLTextAreaElement | null>
  chatText: string
  setChatText: (val: string) => void
  expandedTopicCode: string | null
  handleSendChat: () => void
  handleQuickLogOutcome?: (
    channel: 'telephone' | 'direct' | 'zalo',
    outcome: string,
    outcomeLabel: string
  ) => void
  handleCompleteCare?: () => void
  studentAttitudeNote?: string
  showParentOpinion?: boolean
  setShowParentOpinion?: (val: boolean) => void
  parentOpinionText?: string
  setParentOpinionText?: (val: string) => void
  displayPinnedTopics: CareTopic[]
  expandedTopic: CareTopic | null
  setExpandedTopicCode: (code: string | null) => void
  cstpStatus: string
  onCstpStatusChange?: (status: string) => void
  isFormCollapsed?: boolean
  setIsFormCollapsed?: (val: boolean) => void
  getTagColorClass: (code: string, isExpanded: boolean) => string
  isCaredStatus: boolean
  careMode: CareMode
  onCareModeChange: (mode: CareMode) => void
  onRefresh?: () => void
  hideOrdersMode?: boolean
}

export function StudentCareFormCard({
  careFormRef,
  student,
  effectiveLogs,
  selectedContact,
  contactsList,
  selectedContactIndex,
  setSelectedContactIndex,
  activeContactPhone,
  setChatChannel,
  setCallOutcome,
  callbackTime = '2026-07-20T14:00',
  setCallbackTime,
  startCall,
  textareaRef,
  chatText,
  setChatText,
  expandedTopicCode,
  handleSendChat,
  handleQuickLogOutcome,
  handleCompleteCare,
  parentOpinionText = '',
  setParentOpinionText,
  displayPinnedTopics,
  cstpStatus,
  onCstpStatusChange,
  isCaredStatus,
  careMode,
  onCareModeChange,
  onRefresh,
  hideOrdersMode = false,
}: StudentCareFormCardProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [renewalStatus, setRenewalStatus] = useState<string>('')
  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false)
  const chatRecipient = formatContactDisplayName(selectedContact.name, selectedContact.relationship)
  const isRenewalMode = careMode === 'renewal'
  const orderInfo = useMemo(() => (student ? getStudentOrderInfo(student) : null), [student])
  const ordersCount = useMemo(() => {
    if (!student?.studentId) return 0
    return getStudentOrders(student.studentId, student.studentName).length
  }, [student])

  const suggestedOrders = useMemo(() => {
    const list: Array<{
      orderNo: string
      packageName: string
      amountText?: string
      paymentStatusText?: string
    }> = []
    const seen = new Set<string>()

    if (student?.studentId) {
      const studentOrders = getStudentOrders(student.studentId, student.studentName)
      studentOrders.forEach((o) => {
        if (o.orderNo && !seen.has(o.orderNo)) {
          seen.add(o.orderNo)
          const amount = o.totalPaidAmount || o.paidAmount || o.finalAmount || 0
          const paymentInfo = resolvePaymentStatusInfo(
            o.paymentMethodTag,
            o.paymentStatus,
            o.totalPaidAmount || o.paidAmount,
            o.finalAmount
          )
          list.push({
            orderNo: o.orderNo,
            packageName: o.detailedItems?.[0]?.productName || o.items?.[0]?.productName || 'Gói học',
            amountText: amount > 0 ? `${amount.toLocaleString('vi-VN')}đ` : 'Chưa đóng phí',
            paymentStatusText: paymentInfo.label,
          })
        }
      })
    }

    mockOrders.slice(0, 6).forEach((o) => {
      if (o.orderNo && !seen.has(o.orderNo)) {
        seen.add(o.orderNo)
        const amount = o.paidAmount || o.finalAmount || 0
        const paymentInfo = resolvePaymentStatusInfo(
          o.paymentMethodTag,
          o.paymentStatus,
          o.paidAmount,
          o.finalAmount
        )
        list.push({
          orderNo: o.orderNo,
          packageName: o.items?.[0]?.productName || 'Gói học',
          amountText: amount > 0 ? `${amount.toLocaleString('vi-VN')}đ` : 'Chưa đóng phí',
          paymentStatusText: paymentInfo.label,
        })
      }
    })

    return list
  }, [student])

  const handleLinkOrder = (codeToLink: string) => {
    if (!student?.id) return
    const trimmed = codeToLink.trim()
    if (!trimmed) return

    const foundInMock = mockOrders.find(
      (o) => o.orderNo?.toLowerCase() === trimmed.toLowerCase() || o.id?.toLowerCase() === trimmed.toLowerCase()
    )
    const foundInStudent = student.studentId
      ? getStudentOrders(student.studentId, student.studentName).find(
          (o) => o.orderNo?.toLowerCase() === trimmed.toLowerCase()
        )
      : null

    const itemsCount = foundInMock?.items?.length || foundInStudent?.detailedItems?.length || 1
    const rawPkgName =
      foundInStudent?.detailedItems?.[0]?.productName ||
      foundInMock?.items?.[0]?.productName ||
      (student.subject === 'Toán tư duy' ? 'Gói Toán Archimedes 12T' : 'Gói Tiếng Anh Level 5 12T')
    const pkgName = itemsCount > 1 ? `${rawPkgName} (${itemsCount}+)` : rawPkgName

    const paid =
      foundInStudent?.totalPaidAmount ||
      foundInMock?.paidAmount ||
      foundInMock?.finalAmount ||
      18000000

    const final =
      foundInStudent?.finalAmount ||
      foundInMock?.finalAmount ||
      18000000

    const term =
      foundInStudent?.paymentMethodTag ||
      foundInMock?.paymentMethodTag ||
      'Thanh toán 100%'

    const paymentInfo = resolvePaymentStatusInfo(
      term,
      foundInStudent?.paymentStatus || foundInMock?.paymentStatus,
      paid,
      final
    )

    linkOrderToStudentCareAlert(student.id, foundInMock?.orderNo || foundInStudent?.orderNo || trimmed, {
      packageName: pkgName,
      totalPaidAmount: paid,
      finalAmount: final,
      paymentTerm: term,
      paymentStatus: paymentInfo.status,
    })

    toast.success(`Đã liên kết đơn hàng ${foundInMock?.orderNo || trimmed} thành công!`)
    if (onRefresh) onRefresh()
  }

  const handleUnlinkOrder = () => {
    if (!student?.id) return
    unlinkOrderFromStudentCareAlert(student.id)
    toast.info('Đã hủy liên kết đơn hàng.')
    if (onRefresh) onRefresh()
  }

  const handleCheckComplete = () => {
    if (isRenewalMode && student) {
      const orderInfo = getStudentOrderInfo(student)
      const hasLinkedOrder = Boolean(orderInfo?.orderCode)
      
      if (!hasLinkedOrder) {
        toast.error('Chưa có đơn hàng liên kết. Vui lòng liên kết đơn hàng để xác định Tái phí thành công!')
        return
      }
    }
    setIsConfirmCompleteOpen(true)
  }

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
    <div ref={careFormRef} className="space-y-1 text-left mb-1.5">
      {/* Top Header: Tab Chăm sóc / Tái phí + Các thẻ chăm sóc ngang (Nằm bên ngoài card) */}
      <div className="space-y-1">
        <div className="w-full bg-slate-100 dark:bg-zinc-800 p-0.5 rounded-lg flex items-center gap-1 border border-slate-200 dark:border-zinc-700 h-7">
          <button
            type="button"
            onClick={() => onCareModeChange('regular')}
            className={cn(
              'flex-1 h-6 px-2 rounded text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5',
              careMode === 'regular'
                ? 'bg-white dark:bg-zinc-900 text-foreground shadow-xs border border-border font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 font-normal'
            )}
          >
            <span>Chăm sóc</span>
          </button>

          <button
            type="button"
            onClick={() => onCareModeChange('renewal')}
            className={cn(
              'flex-1 h-6 px-2 rounded text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5',
              careMode === 'renewal'
                ? 'bg-emerald-600 text-white shadow-xs border border-emerald-600 font-medium dark:bg-emerald-600 dark:text-white'
                : 'text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/50 font-normal'
            )}
          >
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full shrink-0 transition-colors',
                careMode === 'renewal' ? 'bg-white' : 'bg-emerald-500'
              )}
            />
            <span>Tái phí</span>
          </button>

          {!hideOrdersMode && (
            <button
              type="button"
              onClick={() => onCareModeChange('orders')}
              className={cn(
                'flex-1 h-6 px-2 rounded text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5',
                careMode === 'orders'
                  ? 'bg-white dark:bg-zinc-900 text-foreground shadow-xs border border-border font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 font-normal'
              )}
            >
              <span>Đơn hàng</span>
              <span
                className={cn(
                  'inline-flex items-center justify-center text-[10px] font-medium h-3.5 px-1 rounded-full min-w-[14px] transition-colors',
                  careMode === 'orders'
                    ? 'bg-muted text-foreground'
                    : 'bg-muted/80 text-muted-foreground'
                )}
              >
                {ordersCount}
              </span>
            </button>
          )}
        </div>

        {careMode !== 'orders' && (
          <div className="space-y-1">
          {visibleTopics.length === 0 ? (
            <div className="py-2 text-center text-xs text-muted-foreground italic bg-white dark:bg-zinc-900 rounded-lg border border-border/40">
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
              const assigneeText = getCareAssigneeText(topic.code)
              const dueDate = getCareDueDate(topic.code)
              const rowBgStyle = getCareNatureBgStyle(topic.code, false)

              return (
                <div
                  key={topic.code}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1 rounded-lg text-left select-none border",
                    rowBgStyle,
                    isCompletedTag && isCSDB && "opacity-65"
                  )}
                >
                  <span className={cn("text-xs font-semibold shrink-0 select-none", getCareNatureTextColor(topic.code))}>
                    {natureAbbrev}
                  </span>

                  <span className={cn(
                    "text-xs font-normal min-w-0 flex-1 truncate",
                    isCompletedTag && isCSDB ? "line-through opacity-70" : "text-foreground"
                  )} title={issueText}>
                    {issueText}
                  </span>

                  <span className="text-xs text-muted-foreground/60 shrink-0">•</span>

                  <span className="text-xs font-normal text-muted-foreground shrink-0">
                    PT: <span className="font-normal text-foreground/90">{assigneeText}</span>
                  </span>

                  <span className="text-xs text-muted-foreground/60 shrink-0">•</span>

                  {isCompletedTag ? (
                    <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 inline" />
                      <span>Đã xong</span>
                    </span>
                  ) : slaStatus === 'overdue' ? (
                    <span className="text-xs font-normal text-red-600 dark:text-red-400 shrink-0">
                      Quá hạn: {dueDate}
                    </span>
                  ) : slaStatus === 'due_today' ? (
                    <span className="text-xs font-normal text-amber-600 dark:text-amber-400 shrink-0">
                      Đến hạn: {dueDate}
                    </span>
                  ) : (
                    <span className="text-xs font-normal text-muted-foreground shrink-0">
                      Hạn: {dueDate}
                    </span>
                  )}
                </div>
              )
            })
          )}
        </div>
        )}
      </div>

      {/* Main Section Card: Form nhập liệu tương tác */}
      {careMode !== 'orders' && (
        <div
          className={cn(
            'rounded-xl shadow-2xs p-2 sm:p-2.5 space-y-1.5 border transition-colors',
            isRenewalMode
              ? 'bg-emerald-50/25 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50'
              : 'bg-sky-50/30 dark:bg-sky-950/20 border-sky-200/70 dark:border-sky-900/50'
          )}
        >
          <CallConnectionBanner
            isActive={isCallActive}
            contactName={formatContactDisplayName(selectedContact.name, selectedContact.relationship)}
            contactPhone={activeContactPhone}
            onEndCall={() => setIsCallActive(false)}
            onOutcomeSelect={(outcome) => {
              if (setCallOutcome) setCallOutcome(outcome)
            }}
          />

          {isRenewalMode ? (
            <div className="select-none animate-in fade-in-50 duration-150 space-y-1.5 w-full">
              {/* Header của cả section chăm sóc: Thông tin liên hệ phụ huynh */}
              <div className="flex items-center justify-between gap-2 px-0.5 flex-wrap">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs text-muted-foreground font-normal shrink-0">
                    Liên hệ:
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-all cursor-pointer shrink-0 select-none group bg-transparent border-0 p-0 hover:opacity-80"
                        title="Mở danh sách người liên hệ phụ huynh"
                      >
                        <span className="font-medium text-foreground shrink-0">
                          {selectedContact.relationship || 'Mẹ'}
                        </span>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {getCleanContactName(selectedContact.name)}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-1.5 text-xs" align="start">
                      <div className="font-normal text-xs text-muted-foreground px-2 py-1 border-b border-border/40 mb-1">
                        Liên hệ cho
                      </div>
                      <div className="space-y-0.5">
                        {contactsList.map((c, idx) => (
                          <button
                            key={c.phone + idx}
                            type="button"
                            onClick={() => setSelectedContactIndex(idx)}
                            className={cn(
                              'w-full text-left px-2 py-1.5 rounded text-xs font-normal flex items-center justify-between transition-colors cursor-pointer',
                              selectedContactIndex === idx
                                ? 'bg-muted text-foreground font-medium'
                                : 'hover:bg-muted text-foreground'
                            )}
                          >
                            <div className="flex flex-col">
                              <span>{formatContactDisplayName(c.name, c.relationship)}</span>
                              <span className="text-xs text-muted-foreground font-mono">{c.phone}</span>
                            </div>
                            {selectedContactIndex === idx && <Check className="h-3 w-3 text-primary shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-auto flex-wrap">
                  {/* SĐT + Nút Copy + Nút Gọi */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-muted-foreground font-mono font-normal text-xs">
                      {activeContactPhone}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeContactPhone)
                          .then(() => toast.success(`Đã sao chép SĐT: ${activeContactPhone}`))
                          .catch(() => toast.error('Không thể sao chép.'))
                      }}
                      className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded transition-colors cursor-pointer shrink-0"
                      title="Sao chép số điện thoại"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={!activeContactPhone || activeContactPhone === '--'}
                      onClick={() => {
                        if (!activeContactPhone || activeContactPhone === '--' || activeContactPhone.trim() === '') {
                          toast.warning('Người liên hệ chưa được gán số điện thoại. Vui lòng cập nhật số điện thoại trước khi gọi!')
                          return
                        }
                        setChatChannel('telephone')
                        if (setCallOutcome) setCallOutcome('nghe_may')
                        setIsCallActive(true)
                        startCall({
                          studentId: student?.studentId || 's1',
                          studentName: student?.studentName || 'Alex (Nguyễn An)',
                          parentPhone: activeContactPhone,
                          parentName: formatContactDisplayName(selectedContact.name, selectedContact.relationship),
                        })
                      }}
                      className={cn(
                        'h-6 px-2.5 text-xs font-medium rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1 shadow-xs shrink-0',
                        !activeContactPhone || activeContactPhone === '--'
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      )}
                      title={
                        !activeContactPhone || activeContactPhone === '--'
                          ? 'Chưa gán số điện thoại liên hệ'
                          : `Kích hoạt cuộc gọi cho ${formatContactDisplayName(selectedContact.name, selectedContact.relationship)} (${activeContactPhone})`
                      }
                    >
                      <Phone className="h-3 w-3 fill-current" />
                      <span>Gọi</span>
                    </button>
                  </div>

                  <span className="text-border/60 hidden sm:inline text-xs">|</span>

                  {/* Lịch hẹn đưa lên cạnh phải header liên hệ */}
                  <div className="flex items-center gap-1 bg-background px-2 py-0.5 rounded-md border border-border/70 text-xs shadow-none">
                    <span className="text-xs font-normal text-muted-foreground shrink-0 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
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
                      className="h-4.5 text-xs text-foreground bg-transparent border-none focus:outline-none w-[115px] font-normal placeholder:text-muted-foreground/70 cursor-pointer"
                    />
                    {callbackTime && (
                      <button
                        type="button"
                        onClick={() => setCallbackTime && setCallbackTime('')}
                        className="text-muted-foreground hover:text-foreground text-xs p-0.5 rounded cursor-pointer leading-none"
                        title="Xóa lịch hẹn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Ô nhập liệu Full chiều rộng */}
              <div className="rounded-lg border border-border bg-card shadow-xs overflow-hidden focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary transition-all w-full">
                {/* Textarea ghi chú */}
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
                  className="w-full min-h-[38px] max-h-[120px] p-2 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/70 font-normal focus:outline-none disabled:bg-muted/40 disabled:cursor-not-allowed resize-y overflow-y-auto leading-relaxed border-0"
                />

                {/* Input Phụ huynh phản hồi */}
                <div className="p-0.5 px-2 bg-muted/20 border-t border-border/40">
                  <input
                    type="text"
                    value={parentOpinionText}
                    onChange={(e) => setParentOpinionText && setParentOpinionText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault()
                        handleSendChat()
                      }
                    }}
                    placeholder="Nhập tóm tắt ý kiến / phản hồi của phụ huynh..."
                    className="w-full h-5.5 text-xs px-1.5 rounded border border-border/60 bg-background text-foreground font-normal focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {/* Action Row: Lựa chọn trạng thái chưa liên lạc + Nút Tái phí (kèm menu trạng thái khác) + Hướng dẫn */}
              <div className="flex items-center justify-between gap-1.5 pt-0.5 flex-wrap">
                {/* Cụm trạng thái chưa thành công để log lịch sử nhanh */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-normal text-muted-foreground shrink-0 hidden sm:inline">
                    Chưa liên lạc:
                  </span>
                  
                  {/* Kênh Gọi: Không nghe */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('telephone', 'khong_nghe', 'Không nghe máy')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận cuộc gọi không nghe máy (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Không nghe</span>
                  </button>

                  {/* Kênh Gọi: Máy bận */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('telephone', 'may_ban', 'Máy bận')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận cuộc gọi máy bận (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Máy bận</span>
                  </button>

                  {/* Kênh Gặp mặt: Vắng mặt */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('direct', 'vang_mat', 'Vắng mặt')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận gặp mặt vắng mặt (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Vắng mặt</span>
                  </button>

                  {/* Kênh Zalo/Tin nhắn: Chưa phản hồi */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('zalo', 'chua_phan_hoi', 'Chưa phản hồi')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận tin nhắn chưa có phản hồi (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Chưa phản hồi</span>
                  </button>
                </div>

                {/* Cụm Nút Tái phí (gộp menu trạng thái khác) + Icon hướng dẫn ra sau */}
                <div className="flex items-center gap-1.5 ml-auto shrink-0 flex-wrap">
                  {/* Split button: Tái phí (xanh) + ChevronDown mở menu trạng thái khác */}
                  <div className="inline-flex items-center rounded-md shadow-xs bg-emerald-600 text-white overflow-hidden">
                    {/* Nút chính: Tái phí */}
                    <button
                      type="button"
                      onClick={handleCheckComplete}
                      className="h-7 px-3.5 text-xs font-medium cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center"
                      title="Xác nhận Tái phí thành công và kết thúc ca chăm sóc"
                    >
                      Tái phí
                    </button>

                    {/* Dropdown mở trạng thái khác */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="h-7 px-1.5 bg-emerald-700 hover:bg-emerald-800 text-white/90 hover:text-white transition-colors cursor-pointer border-l border-emerald-500/60 flex items-center justify-center"
                          title="Chọn trạng thái tái phí khác (Cân nhắc, Tiềm năng, Hẹn tái, Thất bại)"
                          aria-label="Chọn trạng thái khác"
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent side="top" align="end" className="w-48 p-1 text-xs space-y-0.5 shadow-md">
                        <div className="px-2 py-1 text-[11px] font-normal text-muted-foreground border-b border-border/50 mb-0.5">
                          Chuyển trạng thái ca tái phí:
                        </div>
                        {[
                          { key: 'can_nhac', label: 'Cân nhắc' },
                          { key: 'tiem_nang', label: 'Tiềm năng' },
                          { key: 'hen_tai', label: 'Hẹn tái' },
                          { key: 'that_bai', label: 'Thất bại' },
                        ].map((item) => {
                          const currentStatus = renewalStatus || cstpStatus
                          const isCurrent = currentStatus === item.key
                          return (
                            <button
                              key={item.key}
                              type="button"
                              onClick={() => {
                                setRenewalStatus(item.key)
                                if (student) {
                                  updateRenewalClassification(student.id, item.key)
                                }
                                if (onCstpStatusChange) {
                                  onCstpStatusChange(item.key)
                                }
                                if (chatText.trim() || parentOpinionText.trim()) {
                                  handleSendChat()
                                } else {
                                  toast.success(`Đã cập nhật trạng thái: ${item.label}`)
                                }
                                if (onRefresh) onRefresh()
                              }}
                              className={cn(
                                'w-full text-left px-2 py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-between',
                                isCurrent
                                  ? 'bg-muted font-medium text-foreground'
                                  : 'hover:bg-muted text-foreground'
                              )}
                            >
                              <span>{item.label}</span>
                              {isCurrent && <Check className="h-3 w-3 text-emerald-600 shrink-0" />}
                            </button>
                          )
                        })}
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Icon hướng dẫn chuyển ra sau button Tái phí */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="p-1 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer rounded-full hover:bg-muted/60"
                        title="Giải thích thao tác Tái phí"
                        aria-label="Giải thích thao tác Tái phí"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="end" className="w-68 p-2.5 text-xs space-y-1.5 shadow-md">
                      <div className="font-semibold text-foreground border-b border-border/50 pb-1 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-primary" />
                        <span>Ý nghĩa nút thao tác</span>
                      </div>
                      <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
                        <p>
                          <strong className="text-foreground font-medium">Tái phí:</strong> Lưu nội dung trao đổi, xác nhận Tái phí thành công và kết thúc ca chăm sóc.
                        </p>
                        <p>
                          <strong className="text-foreground font-medium">Menu mở rộng:</strong> Chuyển nhanh sang các trạng thái Cân nhắc, Tiềm năng, Hẹn tái hoặc Thất bại.
                        </p>
                        <p>
                          <strong className="text-foreground font-medium">Chưa liên lạc:</strong> Bấm để ghi nhận nhanh lịch sử chưa liên lạc được mà không cần nhập ghi chú.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          ) : (
            <div className="select-none animate-in fade-in-50 duration-150 space-y-1.5 w-full">
              {/* Header của section chăm sóc: Thông tin liên hệ phụ huynh + SĐT + Gọi + Lịch hẹn */}
              <div className="flex items-center justify-between gap-2 px-0.5 flex-wrap">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs text-muted-foreground font-normal shrink-0">
                    Liên hệ:
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-foreground transition-all cursor-pointer shrink-0 select-none group bg-transparent border-0 p-0 hover:opacity-80"
                        title="Mở danh sách người liên hệ phụ huynh"
                      >
                        <span className="font-medium text-foreground shrink-0">
                          {selectedContact.relationship || 'Mẹ'}
                        </span>
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {getCleanContactName(selectedContact.name)}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-1.5 text-xs" align="start">
                      <div className="font-normal text-xs text-muted-foreground px-2 py-1 border-b border-border/40 mb-1">
                        Liên hệ cho
                      </div>
                      <div className="space-y-0.5">
                        {contactsList.map((c, idx) => (
                          <button
                            key={c.phone + idx}
                            type="button"
                            onClick={() => setSelectedContactIndex(idx)}
                            className={cn(
                              'w-full text-left px-2 py-1.5 rounded text-xs font-normal flex items-center justify-between transition-colors cursor-pointer',
                              selectedContactIndex === idx
                                ? 'bg-muted text-foreground font-medium'
                                : 'hover:bg-muted text-foreground'
                            )}
                          >
                            <div className="flex flex-col">
                              <span>{formatContactDisplayName(c.name, c.relationship)}</span>
                              <span className="text-xs text-muted-foreground font-mono">{c.phone}</span>
                            </div>
                            {selectedContactIndex === idx && <Check className="h-3 w-3 text-primary shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-auto flex-wrap">
                  {/* SĐT + Nút Copy + Nút Gọi */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-muted-foreground font-mono font-normal text-xs">
                      {activeContactPhone}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(activeContactPhone)
                          .then(() => toast.success(`Đã sao chép SĐT: ${activeContactPhone}`))
                          .catch(() => toast.error('Không thể sao chép.'))
                      }}
                      className="p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded transition-colors cursor-pointer shrink-0"
                      title="Sao chép số điện thoại"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      disabled={!activeContactPhone || activeContactPhone === '--'}
                      onClick={() => {
                        if (!activeContactPhone || activeContactPhone === '--' || activeContactPhone.trim() === '') {
                          toast.warning('Người liên hệ chưa được gán số điện thoại. Vui lòng cập nhật số điện thoại trước khi gọi!')
                          return
                        }
                        setChatChannel('telephone')
                        if (setCallOutcome) setCallOutcome('nghe_may')
                        setIsCallActive(true)
                        startCall({
                          studentId: student?.studentId || 's1',
                          studentName: student?.studentName || 'Alex (Nguyễn An)',
                          parentPhone: activeContactPhone,
                          parentName: formatContactDisplayName(selectedContact.name, selectedContact.relationship),
                        })
                      }}
                      className={cn(
                        'h-6 px-2.5 text-xs font-medium rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1 shadow-xs shrink-0',
                        !activeContactPhone || activeContactPhone === '--'
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      )}
                      title={
                        !activeContactPhone || activeContactPhone === '--'
                          ? 'Chưa gán số điện thoại liên hệ'
                          : `Kích hoạt cuộc gọi cho ${formatContactDisplayName(selectedContact.name, selectedContact.relationship)} (${activeContactPhone})`
                      }
                    >
                      <Phone className="h-3 w-3 fill-current" />
                      <span>Gọi</span>
                    </button>
                  </div>

                  <span className="text-border/60 hidden sm:inline text-xs">|</span>

                  {/* Lịch hẹn đưa lên cạnh phải header liên hệ */}
                  <div className="flex items-center gap-1 bg-background px-2 py-0.5 rounded-md border border-border/70 text-xs shadow-none">
                    <span className="text-xs font-normal text-muted-foreground shrink-0 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
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
                      className="h-4.5 text-xs text-foreground bg-transparent border-none focus:outline-none w-[115px] font-normal placeholder:text-muted-foreground/70 cursor-pointer"
                    />
                    {callbackTime && (
                      <button
                        type="button"
                        onClick={() => setCallbackTime && setCallbackTime('')}
                        className="text-muted-foreground hover:text-foreground text-xs p-0.5 rounded cursor-pointer leading-none"
                        title="Xóa lịch hẹn"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Ô nhập liệu Full chiều rộng */}
              <div className="rounded-lg border border-border bg-card shadow-xs overflow-hidden focus-within:ring-1 focus-within:ring-primary/40 focus-within:border-primary transition-all w-full">
                {/* Textarea ghi chú trao đổi */}
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
                  className="w-full min-h-[38px] max-h-[120px] p-2 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/70 font-normal focus:outline-none disabled:bg-muted/40 disabled:cursor-not-allowed resize-y overflow-y-auto leading-relaxed border-0"
                />

                {/* Input Phụ huynh phản hồi */}
                <div className="p-0.5 px-2 bg-muted/20 border-t border-border/40">
                  <input
                    type="text"
                    value={parentOpinionText}
                    onChange={(e) => setParentOpinionText && setParentOpinionText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault()
                        handleSendChat()
                      }
                    }}
                    placeholder="Nhập ý kiến / phản hồi của phụ huynh..."
                    className="w-full h-5.5 text-xs px-1.5 rounded border border-border/60 bg-background text-foreground font-normal focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
                  />
                </div>
              </div>

              {/* Action Row: Lựa chọn trạng thái chưa thành công (kênh Gọi, Gặp mặt, Zalo) + Kênh liên hệ + Lưu */}
              <div className="flex items-center justify-between gap-1.5 pt-0.5 flex-wrap">
                {/* Cụm trạng thái chưa thành công của tất cả các kênh để log lịch sử nhanh */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[11px] font-normal text-muted-foreground shrink-0 hidden sm:inline">
                    Chưa liên lạc:
                  </span>
                  
                  {/* Kênh Gọi: Không nghe */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('telephone', 'khong_nghe', 'Không nghe máy')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận cuộc gọi không nghe máy (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Không nghe</span>
                  </button>

                  {/* Kênh Gọi: Máy bận */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('telephone', 'may_ban', 'Máy bận')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận cuộc gọi máy bận (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Máy bận</span>
                  </button>

                  {/* Kênh Gặp mặt: Vắng mặt */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('direct', 'vang_mat', 'Vắng mặt')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận gặp mặt vắng mặt (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Vắng mặt</span>
                  </button>

                  {/* Kênh Zalo/Tin nhắn: Chưa phản hồi */}
                  <button
                    type="button"
                    onClick={() => handleQuickLogOutcome?.('zalo', 'chua_phan_hoi', 'Chưa phản hồi')}
                    className="h-7 px-2 text-xs font-normal rounded-md border border-border/80 bg-background text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border transition-colors cursor-pointer inline-flex items-center shrink-0"
                    title="Ghi nhận tin nhắn chưa có phản hồi (Không bắt buộc nhập ghi chú)"
                  >
                    <span>Chưa phản hồi</span>
                  </button>
                </div>

                {/* Cụm Nút Lưu + Popover giải thích */}
                <div className="flex items-center gap-1.5 ml-auto shrink-0 flex-wrap">
                  {/* Nút Lưu (màu xanh) */}
                  <Button
                    type="button"
                    size="sm"
                    disabled={!chatText.trim() && !parentOpinionText.trim()}
                    onClick={() => {
                      handleSendChat()
                      setIsCallActive(false)
                    }}
                    className="h-7 px-4 text-xs font-medium cursor-pointer shrink-0 rounded-md shadow-xs bg-sky-600 hover:bg-sky-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Lưu nội dung tương tác vào lịch sử chăm sóc"
                  >
                    Lưu
                  </Button>

                  {/* Popover giải thích */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="p-1 text-muted-foreground/70 hover:text-foreground transition-colors cursor-pointer rounded-full hover:bg-muted/60"
                        title="Giải thích thao tác Lưu"
                        aria-label="Giải thích thao tác Lưu"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="end" className="w-68 p-2.5 text-xs space-y-1.5 shadow-md">
                      <div className="font-semibold text-foreground border-b border-border/50 pb-1 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-primary" />
                        <span>Ý nghĩa nút thao tác</span>
                      </div>
                      <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
                        <p>
                          <strong className="text-foreground font-medium">Lưu:</strong> Lưu nội dung trao đổi vào lịch sử chăm sóc.
                        </p>
                        <p>
                          <strong className="text-foreground font-medium">Không nghe / Máy bận / Vắng mặt:</strong> Bấm để ghi nhận nhanh lịch sử chưa liên lạc được mà không cần nhập ghi chú.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}

        {/* Active Care Card / Linked Order Section */}
        <div className="border-t border-border/40 pt-1 mt-1 space-y-1">
          {/* Thông tin Đơn hàng liên kết ở tab Tái phí: nhập trực tiếp trên dòng, không mở modal, có thể sửa */}
          {isRenewalMode && (
            <StudentRenewalLinkedOrderRow
              orderInfo={orderInfo}
              suggestedOrders={suggestedOrders}
              onLinkOrder={handleLinkOrder}
              onUnlinkOrder={handleUnlinkOrder}
            />
          )}

          {/* Trạng thái & Nội dung chăm sóc gần nhất - Hiển thị cả Chăm sóc và Tái phí */}
          <StudentActiveCareCard
            student={student}
            chatRecipient={chatRecipient}
            isCaredStatus={isCaredStatus}
            mode={careMode === 'renewal' ? 'renewal' : 'regular'}
            cstpStatus={cstpStatus || renewalStatus}
            logs={effectiveLogs || student?.interactionLogs}
          />
        </div>
      </div>
    )}

      {/* Modal xác nhận Kết thúc ca */}
      <ConfirmDialog
        open={isConfirmCompleteOpen}
        onOpenChange={setIsConfirmCompleteOpen}
        title={isRenewalMode ? "Xác nhận kết thúc ca tái phí" : "Xác nhận kết thúc ca chăm sóc"}
        description={
          <div className="space-y-2 text-xs text-left">
            <p>
              Bạn có chắc chắn muốn lưu thông tin và kết thúc ca {isRenewalMode ? 'chăm sóc tái phí' : 'chăm sóc'} cho học viên{' '}
              <strong className="text-foreground">{student?.studentName}</strong>?
            </p>
            {isRenewalMode && orderInfo?.orderCode && (
              <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-[11.5px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đơn hàng liên kết:</span>
                  <strong className="font-mono text-foreground">{orderInfo.orderCode}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Gói học:</span>
                  <span className="font-medium text-foreground truncate max-w-[200px]" title={orderInfo.packageName}>
                    {orderInfo.packageName}
                  </span>
                </div>
                {orderInfo.paymentStatusLabel && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trạng thái thanh toán:</span>
                    <StatusBadge
                      status={orderInfo.paymentStatus || 'paid'}
                      label={orderInfo.paymentStatusLabel}
                      className="text-xs px-1.5 py-0 h-4 font-semibold shrink-0"
                    />
                  </div>
                )}
              </div>
            )}
            <p className="text-muted-foreground">
              {isRenewalMode ? (
                <>Thao tác này sẽ ghi nhận trạng thái <strong>ĐÃ TÁI PHÍ THÀNH CÔNG</strong>, lưu các nội dung trao đổi và chính thức kết thúc ca chăm sóc.</>
              ) : (
                <>Thao tác này sẽ lưu các nội dung trao đổi và chính thức kết thúc ca chăm sóc này.</>
              )}
            </p>
          </div>
        }
        confirmLabel="Xác nhận kết thúc"
        cancelLabel="Hủy"
        onConfirm={() => {
          if (isRenewalMode && student) {
            updateRenewalClassification(student.id, 'tai_phi')
          }
          if (handleCompleteCare) handleCompleteCare()
          setIsCallActive(false)
          setIsConfirmCompleteOpen(false)
          if (onRefresh) onRefresh()
        }}
      />
      </div>
    )
  }
