'use client'

import { useState, useMemo } from 'react'
import { History, ChevronUp, ChevronDown } from 'lucide-react'
import { AudioPlayButton } from './AudioPlayButton'
import { formatFullStaffName, isUncared, isCared } from './operationsAlertHelpers'
import {
  cleanMessageNotes,
  parseRecipient,
  parseLogTopic,
  formatCareHistoryTime,
} from './studentCareDetailHelpers'
import { getRenewalClassification, getRenewalClassificationLabel, type RenewalClassification } from './renewal/renewalHelpers'
import type { StudentCareAlert, CareInteractionLog } from '@/mocks/careAlerts'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { PersonnelHoverCard } from '@/components/shared'
import { cn } from '@/lib/utils'

function getCSStaffPerson(name: string) {
  return {
    id: 'EMP-NTA',
    name: name || 'Nguyễn Thị Ngọc Anh',
    role: 'Chuyên viên CSKH',
    phone: '0901612940',
    email: 'ngocanh@rinoedu.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NgocAnh'
  }
}

interface StudentActiveCareCardProps {
  student?: StudentCareAlert
  chatRecipient: string
  isCaredStatus: boolean
  defaultShowMissedCalls?: boolean
  mode?: 'regular' | 'renewal'
  cstpStatus?: string
  logs?: CareInteractionLog[]
}

export function StudentActiveCareCard({
  student,
  chatRecipient,
  isCaredStatus,
  defaultShowMissedCalls = false,
  mode = 'regular',
  cstpStatus,
  logs,
}: StudentActiveCareCardProps) {
  const [showMissedCalls, setShowMissedCalls] = useState(defaultShowMissedCalls)
  const [prevStudentId, setPrevStudentId] = useState(student?.id)

  if (student?.id !== prevStudentId) {
    setPrevStudentId(student?.id)
    setShowMissedCalls(false)
  }

  const isRenewal = mode === 'renewal'
  const csStaffName = formatFullStaffName(student?.csStaff || 'Lê Thị Lan (CS)')

  const completed = isCaredStatus || (student ? isCared(student) : false)
  const uncared = student ? isUncared(student) : false

  // 1. Tập hợp các logs tương tác thực tế của học viên
  const allLogs = useMemo(() => {
    const rawList = logs && logs.length > 0 ? logs : (student?.interactionLogs || [])
    return [...rawList].sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0
      const timeB = new Date(b.date).getTime() || 0
      return timeB - timeA
    })
  }, [logs, student?.interactionLogs])

  const renewalLogs = useMemo(() => {
    return allLogs.filter(
      (l) =>
        (l.notes || '').includes('[CSTP]') ||
        (l.notes || '').toLowerCase().includes('tái phí') ||
        parseLogTopic(l.notes) === 'CSTP'
    )
  }, [allLogs])

  // Trạng thái hiển thị đồng bộ 100% với danh sách ngoài bảng
  let statusLabel = 'Đang xử lý'
  let statusBadgeClass = getStatusBadgeClass('in_progress')

  const rawStatus = isRenewal ? (cstpStatus || (student ? getRenewalClassification(student) : 'moi')) : 'in_progress'

  if (isRenewal) {
    statusLabel = getRenewalClassificationLabel(rawStatus as RenewalClassification)
    statusBadgeClass = getStatusBadgeClass(rawStatus)
  } else {
    if (completed) {
      statusLabel = 'Hoàn thành'
      statusBadgeClass = getStatusBadgeClass('completed')
    } else if (uncared && allLogs.length === 0 && !student?.interactionNotes) {
      statusLabel = 'Chưa chăm sóc'
      statusBadgeClass = getStatusBadgeClass('info')
    } else {
      statusLabel = 'Đang xử lý'
      statusBadgeClass = getStatusBadgeClass('in_progress')
    }
  }

  const activeLog = isRenewal
    ? (renewalLogs.length > 0 ? renewalLogs[0] : (student?.interactionNotes ? null : allLogs[0]))
    : (allLogs.length > 0 ? allLogs[0] : null)

  // Tương tác gần nhất (Active Log hoặc student.interactionNotes)
  const latestInteraction = activeLog ? activeLog.notes : (student?.interactionNotes || '')
  const isKnM = latestInteraction.includes('Không nghe') || (activeLog ? activeLog.callConfirmation === 'KNM' : student?.callConfirmation === 'KNM')
  const isMayBan = latestInteraction.includes('Máy bận')
  const isVangMat = latestInteraction.includes('Vắng mặt')
  const isChuaPhanHoi = latestInteraction.includes('Chưa phản hồi') || latestInteraction.includes('chua_phan_hoi')
  const isUnreachedActive = isKnM || isMayBan || isVangMat || isChuaPhanHoi

  // Action label (kênh/phương thức)
  let actionLabel = 'Đã gọi'
  if (isKnM) {
    actionLabel = 'Gọi KNM'
  } else if (isMayBan) {
    actionLabel = 'Gọi máy bận'
  } else if (isVangMat) {
    actionLabel = 'Vắng mặt'
  } else if (isChuaPhanHoi) {
    actionLabel = 'Chưa phản hồi'
  } else if (latestInteraction.includes('trực tiếp') || activeLog?.callConfirmation === 'Đã gặp trực tiếp') {
    actionLabel = 'Gặp trực tiếp'
  } else if (latestInteraction.includes('Zalo') || latestInteraction.includes('zalo') || activeLog?.callConfirmation === 'Đã nhắn Zalo') {
    actionLabel = 'Đã nhắn Zalo'
  }

  // Nội dung ghi chú chăm sóc
  let careNote = ''
  let parentOpinion = ''
  let audioDuration = ''
  let appointmentText = ''

  if (activeLog) {
    careNote = activeLog.notes
    audioDuration = activeLog.audioDuration || ''
    const opinionMatch = activeLog.notes.match(/\[Ý kiến PH:\s*([^\]]+)\]/i)
    parentOpinion = activeLog.parentOpinion || (opinionMatch ? opinionMatch[1].trim() : '')
  } else if (student?.interactionNotes) {
    careNote = student.interactionNotes
    audioDuration = ''
    const opinionMatch = student.interactionNotes.match(/\[Ý kiến PH:\s*([^\]]+)\]/i)
    parentOpinion = opinionMatch ? opinionMatch[1].trim() : ''
  } else if (isRenewal) {
    careNote = `[CSTP] Đang theo dõi tái phí: ${statusLabel}`
    parentOpinion = ''
    audioDuration = ''
  } else {
    careNote = 'Đang theo dõi và chăm sóc học viên.'
    parentOpinion = ''
    audioDuration = ''
  }

  // Kiểm tra lịch hẹn gọi lại nếu có trong ghi chú
  const callbackMatch = (careNote || '').match(/\[Hẹn gọi lại:\s*([^\]]+)\]/i)
  if (callbackMatch) {
    appointmentText = `Hẹn gọi lại: ${callbackMatch[1].trim()}`
  } else if (!isRenewal || activeLog || student?.interactionNotes) {
    appointmentText = ''
  }

  const effectiveCareNote = cleanMessageNotes(careNote)
  const parsedRec = parseRecipient(activeLog?.notes || student?.interactionNotes)
  const effectiveRecipient = parsedRec || chatRecipient || 'Phụ huynh'
  const latestLogDate = activeLog?.date || (student?.interactionLogs && student.interactionLogs.length > 0
    ? student.interactionLogs[student.interactionLogs.length - 1].date
    : new Date().toISOString())
  const timeInfo = formatCareHistoryTime(latestLogDate)
  const effectiveCSStaffName = formatFullStaffName(activeLog?.staffName || csStaffName)

  // Gom các lần log trước đó (từ vị trí 1 trở đi trong danh sách thực tế)
  const missedLogs = useMemo(() => {
    const listToSlice = isRenewal && renewalLogs.length > 0 ? renewalLogs : allLogs
    if (listToSlice.length > 1) {
      return listToSlice.slice(1).map((logItem) => {
        const notes = logItem.notes || ''
        const isPriorKnM = logItem.callConfirmation === 'KNM' || notes.includes('Không nghe')
        const isPriorMayBan = notes.includes('Máy bận')
        const isPriorVangMat = notes.includes('Vắng mặt')
        const isPriorChuaPhanHoi = notes.includes('Chưa phản hồi') || notes.includes('chua_phan_hoi')

        let status = 'Đã gọi'
        if (isPriorKnM) status = 'Gọi KNM'
        else if (isPriorMayBan) status = 'Gọi máy bận'
        else if (isPriorVangMat) status = 'Vắng mặt'
        else if (isPriorChuaPhanHoi) status = 'Chưa phản hồi'
        else if (notes.includes('trực tiếp') || logItem.callConfirmation === 'Đã gặp trực tiếp') status = 'Gặp trực tiếp'
        else if (notes.includes('Zalo') || logItem.callConfirmation === 'Đã nhắn Zalo') status = 'Đã nhắn Zalo'

        const cbMatch = notes.match(/\[Hẹn gọi lại:\s*([^\]]+)\]/i)
        const opMatch = notes.match(/\[Ý kiến PH:\s*([^\]]+)\]/i)
        const tInfo = formatCareHistoryTime(logItem.date)

        return {
          time: tInfo.display,
          status,
          nextCallback: cbMatch ? cbMatch[1].trim() : undefined,
          duration: logItem.audioDuration || '',
          note: cleanMessageNotes(notes),
          parentOpinion: logItem.parentOpinion || (opMatch ? opMatch[1].trim() : undefined),
          staffName: formatFullStaffName(logItem.staffName || effectiveCSStaffName),
          recipient: parseRecipient(notes) || effectiveRecipient,
        }
      })
    }
    return []
  }, [allLogs, renewalLogs, isRenewal, effectiveCSStaffName, effectiveRecipient])

  const dateRangeText = useMemo(() => {
    if (missedLogs.length === 0) return ''
    const times = missedLogs.map(m => m.time).filter(Boolean)
    if (times.length === 1) return times[0]
    return `${times[times.length - 1]} - ${times[0]}`
  }, [missedLogs])

  // Điều kiện hiển thị (Hooks đã được gọi đầy đủ ở trên)
  if (isRenewal) {
    if ((rawStatus === 'moi' || rawStatus === 'chua_den_han') && renewalLogs.length === 0 && !student?.interactionNotes) {
      return null
    }
  } else {
    if (uncared && allLogs.length === 0 && !student?.interactionNotes) {
      return null
    }
  }

  return (
    <div className="space-y-1 text-left select-none pt-0.5">
      {/* Active Care Card Item */}
      <div className="space-y-1">
        {/* Header row: Status + CS circle badge + Staff name + Channel & Recipient + Relative time & Next appointment */}
        <div className="flex items-center justify-between flex-wrap gap-1 pt-0 pb-0 select-none">
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            <span className={cn('px-1.5 py-0 rounded text-xs font-normal border shrink-0 h-4 inline-flex items-center', statusBadgeClass)}>
              {statusLabel}
            </span>
            <span className="inline-flex items-center justify-center h-4.5 w-4.5 rounded-full text-xs font-medium select-none bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shrink-0">
              CS
            </span>
            <PersonnelHoverCard person={getCSStaffPerson(effectiveCSStaffName)}>
              <span className="font-normal text-foreground text-xs cursor-pointer hover:underline hover:text-primary transition-colors">
                {effectiveCSStaffName}
              </span>
            </PersonnelHoverCard>
            <span className="text-xs text-muted-foreground font-normal truncate">
              • {actionLabel} - <span className="text-foreground font-normal">{effectiveRecipient}</span>
            </span>
            <span
              className="text-xs text-muted-foreground font-normal shrink-0"
              title={latestLogDate}
            >
              • {timeInfo.display}
            </span>
          </div>

          {appointmentText && (
            <div className="flex items-center gap-1 shrink-0 text-xs">
              <span className="text-xs font-normal text-muted-foreground">
                📅 {appointmentText}
              </span>
            </div>
          )}
        </div>

        {/* Active Care Card Body */}
        <div
          className={cn(
            'rounded-lg p-2 sm:p-2.5 space-y-1 text-xs text-left border',
            (isRenewal && statusLabel === 'Đã tái phí') || statusLabel === 'Hoàn thành'
              ? 'border-emerald-200/80 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
              : 'border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20'
          )}
        >
          {/* Continuous Stream: Audio (nếu có) + Clean Note + Parent Feedback Label & Text (nếu có) */}
          <div className="text-xs text-foreground/90 font-normal leading-relaxed">
            {Boolean(audioDuration) && (
              <span className="inline-flex items-center align-middle mr-1.5">
                <AudioPlayButton duration={audioDuration} />
              </span>
            )}
            <span className="align-middle">{effectiveCareNote}</span>
            {Boolean(parentOpinion) && (
              <span className="align-middle">
                {' '}
                <span className="text-emerald-800 dark:text-emerald-300 font-normal">
                  • Phụ huynh phản hồi:
                </span>{' '}
                <span className="italic font-normal text-emerald-700 dark:text-emerald-400">
                  “{parentOpinion.replace(/^(Phụ huynh phản hồi:\s*|")/gi, '').replace(/"$/g, '')}”
                </span>
              </span>
            )}
          </div>

          {/* Lịch sử ghi nhận chăm sóc trước đó (Accordion) - chỉ hiện khi có lịch sử thực tế */}
          {missedLogs.length > 0 && (
            <div className="pt-0.5 select-none">
              <button
                type="button"
                onClick={() => setShowMissedCalls(!showMissedCalls)}
                className="w-full text-left text-xs font-normal italic text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center justify-between cursor-pointer py-0.5 bg-transparent border-0 p-0 transition-colors"
              >
                <span className="flex items-center gap-1 underline decoration-sky-300 dark:decoration-sky-700">
                  <History className="h-3 w-3 text-sky-500 shrink-0 no-underline" />
                  <span>
                    Lịch sử ({missedLogs.length}) lần {isUnreachedActive ? 'chưa liên hệ được' : 'chăm sóc'} trước đó
                  </span>
                  {dateRangeText && (
                    <span className="font-mono text-xs text-muted-foreground font-normal ml-1">
                      {dateRangeText}
                    </span>
                  )}
                </span>
                {showMissedCalls ? (
                  <ChevronUp className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                )}
              </button>

              {showMissedCalls && (
                <div className="mt-1.5 space-y-2 text-xs text-muted-foreground font-normal animate-in fade-in-50 duration-150 pl-1">
                  {missedLogs.map((mCall, mIdx) => (
                    <div key={mIdx} className="space-y-1 pt-1 border-t border-border/40 first:border-t-0 first:pt-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                          <PersonnelHoverCard person={getCSStaffPerson(mCall.staffName || effectiveCSStaffName)}>
                            <span className="font-normal text-foreground text-xs cursor-pointer hover:underline hover:text-primary transition-colors">
                              {mCall.staffName || effectiveCSStaffName}
                            </span>
                          </PersonnelHoverCard>

                          <span className="text-xs text-muted-foreground font-normal truncate">
                            • {mCall.status} - <span className="text-foreground font-normal">{mCall.recipient || effectiveRecipient}</span>
                          </span>
                          <span className="text-xs text-muted-foreground font-normal shrink-0">
                            • {mCall.time}
                          </span>
                        </div>
                        {mCall.nextCallback && (
                          <span className="text-xs font-normal text-muted-foreground shrink-0">
                            📅 Hẹn gọi lại: {mCall.nextCallback}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-foreground/90 leading-relaxed font-normal">
                        {mCall.duration && (
                          <span className="inline-flex items-center align-middle mr-2">
                            <AudioPlayButton duration={mCall.duration} />
                          </span>
                        )}
                        <span className="align-middle text-muted-foreground/90">
                          {mCall.note}
                        </span>
                        {mCall.parentOpinion && (
                          <span>
                            {' '}
                            <span className="align-middle text-emerald-800 dark:text-emerald-300 font-normal">
                              • Phụ huynh phản hồi:
                            </span>{' '}
                            <span className="align-middle italic font-normal text-emerald-700 dark:text-emerald-400">
                              “{mCall.parentOpinion}”
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
