'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useCallStore } from '@/stores/useCallStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { updateCareAlertInteraction, completeCareTag, type StudentCareAlert, type CareInteractionLog, type FamilyContact } from '@/mocks/careAlerts'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { isCared, isOverdue, stableHash } from './operationsAlertHelpers'
import { getRenewalClassification } from './renewal/renewalHelpers'
import { type CareTopic, ALL_STANDARD_TAGS } from './studentCareDetailTypes'
import {
  getCombinedLogs,
  parseLogTopic,
  parseRecipient,
  getCareTopicsForStudent,
} from './studentCareDetailHelpers'
import { StudentCareTimeline } from './StudentCareTimeline'
import { StudentActiveCareCard } from './StudentActiveCareCard'
import { StudentCareFormCard, type CareMode } from './StudentCareFormCard'

const getTagColorClass = (code: string, isExpanded: boolean) => {
  if (code.startsWith('ĐB')) {
    return isExpanded 
      ? "bg-red-600 text-white border-red-600 dark:bg-red-700 dark:border-red-700 shadow-sm"
      : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
  }
  if (code.startsWith('ĐK')) {
    return isExpanded
      ? "bg-violet-600 text-white border-violet-600 dark:bg-violet-700 dark:border-violet-700 shadow-sm"
      : "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900"
  }
  if (code.startsWith('TB')) {
    return isExpanded
      ? "bg-amber-600 text-white border-amber-600 dark:bg-amber-700 dark:border-amber-700 shadow-sm"
      : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
  }
  if (code.startsWith('CSTP')) {
    return isExpanded
      ? "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-700 dark:border-emerald-700 shadow-sm"
      : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
  }
  return isExpanded
    ? "bg-zinc-700 text-white border-zinc-700 dark:bg-zinc-800 dark:border-zinc-800 shadow-sm"
    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800"
}

interface StudentCareChatFeedProps {
  student: StudentCareAlert
  contacts: FamilyContact[]
  formattedPhone: string
  primaryContact: FamilyContact | undefined
  onRefresh?: () => void
  topicsList: CareTopic[]
  allLogs: CareInteractionLog[]
}

export function StudentCareChatFeed({
  student,
  contacts,
  formattedPhone,
  onRefresh,
  topicsList,
  allLogs = [],
}: StudentCareChatFeedProps) {
  const startCall = useCallStore((state) => state.startCall)
  const currentUser = useAuthStore((state) => state.user)
  const userRole = currentUser?.role || 'admin'
  const isCSStaff = userRole === 'admin' || userRole === 'branch_manager' || userRole === 'csm'

  // Family contacts list with fallback
  const contactsList = useMemo(() => {
    if (contacts && contacts.length > 0) {
      return contacts.map((c) => ({
        name: c.name,
        relationship: c.relationship,
        phone: c.phone || formattedPhone || '0912 345 678',
        isPrimary: c.isPrimary,
      }))
    }
    return [
      { name: 'Linh Mẹ Lê Thu Thủy', relationship: 'Mẹ', phone: formattedPhone || '0912 345 678', isPrimary: true },
      { name: 'Nguyễn Văn Hùng', relationship: 'Bố', phone: '0987 654 321', isPrimary: false },
    ]
  }, [contacts, formattedPhone])

  const [selectedContactIndex, setSelectedContactIndex] = useState(0)

  const selectedContact = useMemo(() => {
    return contactsList[selectedContactIndex] || contactsList[0]
  }, [contactsList, selectedContactIndex])

  const chatRecipient = `${selectedContact.name} (${selectedContact.relationship})`
  const activeContactPhone = selectedContact.phone

  const [chatChannel, setChatChannel] = useState<'telephone' | 'zalo' | 'direct'>('zalo')
  const [chatText, setChatText] = useState('')
  const [callOutcome, setCallOutcome] = useState<string>('nghe_may')
  const [callbackTime, setCallbackTime] = useState<string>('')
  const [showCallbackInput, setShowCallbackInput] = useState<boolean>(true)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [lastStudentId, setLastStudentId] = useState<string | null>(null)
  const [completedTopics] = useState<string[]>([])
  
  // States for Pinned Tags design
  const [expandedTopicCode, setExpandedTopicCode] = useState<string | null>(null)
  const [cstpStatus, setCstpStatus] = useState<string>('moi')
  const [parentOpinionText, setParentOpinionText] = useState('')
  const [showParentOpinion, setShowParentOpinion] = useState(false)
  const [localLogs, setLocalLogs] = useState<CareInteractionLog[]>([])
  const [isFormCollapsed, setIsFormCollapsed] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)
  const [careMode, setCareMode] = useState<CareMode>('regular')
  const isCaredStatus = student ? isCared(student) : false

  // Sync cstpStatus with student data using the exact classification helper from renewal module
  useEffect(() => {
    if (!student) return
    const classification = getRenewalClassification(student)
    setCstpStatus(classification)
  }, [student])

  const careFormRef = useRef<HTMLDivElement>(null)
  const [careFormHeight, setCareFormHeight] = useState(160)

  useEffect(() => {
    if (!careFormRef.current) return
    const el = careFormRef.current
    const updateHeight = () => {
      if (el) setCareFormHeight(el.offsetHeight)
    }
    updateHeight()

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        updateHeight()
      })
      observer.observe(el)
      return () => observer.disconnect()
    }
  }, [showParentOpinion, expandedTopicCode, isFormCollapsed])

  // Reset student states when student changes
  if (student.studentId !== lastStudentId) {
    setLastStudentId(student.studentId)
    setExpandedTopicCode(null)
  }

  const generatedTopics = useMemo(() => {
    return getCareTopicsForStudent(student)
  }, [student])

  const displayPinnedTopics = useMemo(() => {
    return (topicsList && topicsList.length > 0) ? topicsList : generatedTopics
  }, [topicsList, generatedTopics])

  const expandedTopic = useMemo(() => {
    if (!expandedTopicCode) return null
    const found = displayPinnedTopics.find((t) => t.code === expandedTopicCode)
    if (found) return found
    const std = ALL_STANDARD_TAGS.find((t) => t.code === expandedTopicCode)
    if (!std) return null
    return {
      code: std.code,
      name: std.name,
      sla: std.sla,
      criteria: std.criteria,
      description: std.description,
      isCompleted: false,
      careStatus: 'pending' as const,
    } as CareTopic
  }, [expandedTopicCode, displayPinnedTopics])

  // Get status color object
  const statusObj = useMemo(() => {
    if (!student) return { label: 'Đang xử lý', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' }
    return {
      label: student.status || 'Đang xử lý',
      badgeClass: getStatusBadgeClass(student.status || 'processing'),
    }
  }, [student])

  // Combine logs from props & local state
  const effectiveLogs = useMemo(() => {
    const combined = [...localLogs, ...allLogs]
    const map = new Map<string, CareInteractionLog>()
    combined.forEach((log) => {
      if (log.id && !map.has(log.id)) {
        map.set(log.id, log)
      }
    })
    return Array.from(map.values())
  }, [localLogs, allLogs])

  const rawCombinedLogs = useMemo(() => {
    return getCombinedLogs(effectiveLogs, displayPinnedTopics, completedTopics)
  }, [effectiveLogs, displayPinnedTopics, completedTopics])

  const filteredCombinedLogs = useMemo(() => {
    return rawCombinedLogs.filter((item) => {
      if (item.type === 'log') {
        const topicCode = parseLogTopic(item.data.notes)
        if (completedTopics.length > 0 && topicCode && completedTopics.includes(topicCode)) {
          return false
        }
        if (userRole === 'teacher') {
          const recipient = parseRecipient(item.data.notes)
          const notes = item.data.notes || ''
          const staff = item.data.staffName || ''
          const isGVNote = notes.includes('[GV Phụ trách]') || 
                            notes.includes('[Giáo viên]') || 
                            notes.includes('Giáo viên') || 
                            staff.includes('GV') ||
                            staff.includes('Giáo viên') ||
                            notes.includes('Nhận xét buổi học')
          const isDirectToStudent = recipient.includes('Học sinh') || recipient.includes('Alex')
          const isPublicNote = !notes.includes('[CSKH Nội bộ]') && !notes.includes('[Chỉ CSKH]')
          
          return isGVNote || isDirectToStudent || isPublicNote
        }
      }
      return true
    })
  }, [rawCombinedLogs, userRole, completedTopics])

  // Processed displayed tags
  const displayedTags = useMemo(() => {
    return displayPinnedTopics.map((t) => ({
      code: t.code,
      label: t.name,
      description: t.description,
    }))
  }, [displayPinnedTopics])

  const isOverdueStatus = student ? isOverdue(student) : false

  const handleSendChat = () => {
    if (!chatText.trim() && !parentOpinionText.trim()) return

    const recipientText = `[Đến: ${chatRecipient}]`
    const channelText = `[Kênh: ${chatChannel.toUpperCase()}]`
    
    let outcomeText = ''
    if (chatChannel === 'telephone' || chatChannel === 'direct') {
      const labelMap: Record<string, string> = {
        nghe_may: 'Nghe máy',
        khong_nghe: 'Không nghe máy',
        may_ban: 'Máy bận',
        hen_goi_lai: 'Hẹn gọi lại',
        so_sai: 'Nhầm số',
        da_gap: 'Đã gặp',
        hen_gap_lai: 'Hẹn gặp lại',
        vang_mat: 'Vắng mặt',
      }
      outcomeText = ` | [Kết quả: ${labelMap[callOutcome] || callOutcome}]`
    }

    let callbackText = ''
    if (callbackTime && (callOutcome === 'hen_goi_lai' || callOutcome === 'hen_gap_lai' || showCallbackInput)) {
      const d = new Date(callbackTime)
      if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const hours = String(d.getHours()).padStart(2, '0')
        const minutes = String(d.getMinutes()).padStart(2, '0')
        callbackText = ` | [Hẹn gọi lại: ${day}/${month} ${hours}:${minutes}]`
      }
    }
    
    let topicPrefix = ''
    if (expandedTopicCode) {
      topicPrefix = `[Mốc/Thẻ: ${expandedTopicCode}] `
    }
    
    let opinionText = ''
    if (parentOpinionText.trim()) {
      opinionText = ` | [Ý kiến PH: ${parentOpinionText.trim()}]`
    }

    const notesWithPrefix = `${recipientText} ${channelText}${outcomeText}${callbackText} ${topicPrefix}${chatText.trim()}${opinionText}`

    const channelLabel = chatChannel === 'telephone' ? 'Đã gọi' : chatChannel === 'zalo' ? 'Đã nhắn Zalo' : 'Đã gặp trực tiếp'

    const updated = updateCareAlertInteraction(student.id, {
      staffName: currentUser?.name || 'CS Staff',
      callConfirmation: channelLabel as any,
      notes: notesWithPrefix,
    })

    if (updated) {
      const newLog: CareInteractionLog = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        staffName: currentUser?.name || 'CS Staff',
        callConfirmation: channelLabel as any,
        notes: notesWithPrefix,
      }
      setLocalLogs((prev) => [newLog, ...prev])
      toast.success('Đã ghi nhận chăm sóc thành công!')
      setChatText('')
      setParentOpinionText('')
      setShowParentOpinion(false)

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }

      if (onRefresh) onRefresh()
    } else {
      toast.error('Có lỗi xảy ra khi lưu chăm sóc.')
    }
  }

  const handleCompleteCare = () => {
    if (student) {
      completeCareTag(student.id, expandedTopicCode || 'CSTP')
      if (chatText.trim()) {
        handleSendChat()
      } else {
        toast.success('Đã đánh dấu hoàn thành chăm sóc học viên!')
      }
      if (onRefresh) onRefresh()
    }
  }

  return (
    <div className="flex-1 min-h-0 bg-transparent flex flex-col border-none shadow-none overflow-y-auto custom-scrollbar relative">
      {/* Chat Stream (Right - Full Width) */}
      <div className="flex flex-col min-w-0 bg-transparent text-left relative border-none shadow-none">
        {/* Conversation Header Care Form (Card 1) - STICKY ONLY UP TO Ý KIẾN PHỤ HUYNH */}
        <StudentCareFormCard
          careFormRef={careFormRef}
          isCSStaff={isCSStaff}
          showAllTags={showAllTags}
          setShowAllTags={setShowAllTags}
          displayedTags={displayedTags}
          statusObj={statusObj}
          student={student}
          isOverdueStatus={isOverdueStatus}
          selectedContact={selectedContact}
          contactsList={contactsList}
          selectedContactIndex={selectedContactIndex}
          setSelectedContactIndex={setSelectedContactIndex}
          activeContactPhone={activeContactPhone}
          chatChannel={chatChannel}
          setChatChannel={setChatChannel}
          callOutcome={callOutcome}
          setCallOutcome={setCallOutcome}
          callbackTime={callbackTime}
          setCallbackTime={setCallbackTime}
          showCallbackInput={showCallbackInput}
          setShowCallbackInput={setShowCallbackInput}
          startCall={startCall}
          textareaRef={textareaRef}
          chatText={chatText}
          setChatText={setChatText}
          expandedTopicCode={expandedTopicCode}
          handleSendChat={handleSendChat}
          handleCompleteCare={handleCompleteCare}
          showParentOpinion={showParentOpinion}
          setShowParentOpinion={setShowParentOpinion}
          parentOpinionText={parentOpinionText}
          setParentOpinionText={setParentOpinionText}
          displayPinnedTopics={displayPinnedTopics}
          expandedTopic={expandedTopic}
          setExpandedTopicCode={setExpandedTopicCode}
          cstpStatus={cstpStatus}
          onCstpStatusChange={setCstpStatus}
          isFormCollapsed={isFormCollapsed}
          setIsFormCollapsed={setIsFormCollapsed}
          getTagColorClass={getTagColorClass}
          isCaredStatus={isCaredStatus}
          careMode={careMode}
          onCareModeChange={setCareMode}
        />

        {/* Message timelines & history below care form */}
        <div className="flex flex-col">
          <StudentCareTimeline
            student={student}
            filteredCombinedLogs={filteredCombinedLogs}
            stickyTopOffset={careFormHeight}
          />
        </div>
      </div>
    </div>
  )
}
