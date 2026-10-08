'use client'

import { useState, useMemo } from 'react'
import { History, ChevronUp, ChevronDown } from 'lucide-react'
import { AudioPlayButton } from './AudioPlayButton'
import { formatFullStaffName } from './operationsAlertHelpers'
import {
  cleanMessageNotes,
  parseRecipient,
  formatCareHistoryTime,
} from './studentCareDetailHelpers'
import type { StudentCareAlert, CareInteractionLog } from '@/mocks/careAlerts'

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
  const isMath = student?.subject === 'Toán tư duy'

  // Trạng thái hiển thị
  let statusLabel = 'Đang xử lý'
  let statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'

  if (isRenewal) {
    const rawStatus = cstpStatus || student?.renewalClassification || 'can_nhac'
    if (rawStatus === 'tai_phi') {
      statusLabel = 'Đã tái phí'
      statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
    } else if (rawStatus === 'hen_tai') {
      statusLabel = 'Hẹn tái'
      statusBadgeClass = 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
    } else if (rawStatus === 'tiem_nang') {
      statusLabel = 'Tiềm năng'
      statusBadgeClass = 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300'
    } else if (rawStatus === 'that_bai') {
      statusLabel = 'Thất bại'
      statusBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
    } else {
      statusLabel = 'Cân nhắc'
      statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
    }
  } else {
    if (isCaredStatus) {
      statusLabel = 'Đã chăm sóc'
      statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
    } else {
      statusLabel = 'Đang xử lý'
      statusBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
    }
  }

  // 1. Tập hợp các logs tương tác thực tế của học viên (bao gồm các lần log vừa tạo)
  const allLogs = useMemo(() => {
    const rawList = logs && logs.length > 0 ? logs : (student?.interactionLogs || [])
    return [...rawList].sort((a, b) => {
      const timeA = new Date(a.date).getTime() || 0
      const timeB = new Date(b.date).getTime() || 0
      return timeB - timeA
    })
  }, [logs, student?.interactionLogs])

  const activeLog = allLogs.length > 0 ? allLogs[0] : null

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

  // Nội dung ghi chú chăm sóc mẫu theo ngữ cảnh
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
    if (statusLabel === 'Đã tái phí') {
      careNote = isMath
        ? '[CSTP] Đã gọi điện trao đổi lộ trình học Toán tư duy nâng cao giai đoạn 2. Phụ huynh rất hài lòng về kết quả thi học kỳ của con và đã hoàn tất chuyển khoản gia hạn gói học mới.'
        : '[CSTP] Đã gọi điện trao đổi lộ trình luyện thi IELTS C1 cam kết đầu ra 7.0+. Phụ huynh đánh giá cao sự tiến bộ của con và đã hoàn tất thanh toán toàn bộ khóa học mới.'
      parentOpinion = 'Phụ huynh rất vui và gửi lời cảm ơn thầy cô đã nhiệt tình kèm cặp con trong suốt khóa vừa qua.'
      audioDuration = '03:15'
      appointmentText = 'Đã hoàn tất ca tái phí'
    } else if (statusLabel === 'Hẹn tái') {
      careNote = isMath
        ? '[CSTP] Đã gọi trao đổi gia hạn gói Toán tư duy mới. Phụ huynh đồng ý giữ chỗ cho con ca thứ 7 và đã nộp tiền cọc đợt 1, hẹn tuần tới đóng nốt số tiền còn lại.'
        : '[CSTP] Đã gọi trao đổi lộ trình học Tiếng Anh tiếp theo. Phụ huynh đã đặt cọc giữ chỗ lớp cô Mai, hẹn chuyển nốt phần phí còn lại trước ngày khai giảng.'
      parentOpinion = 'Phụ huynh hẹn cuối tuần đi công tác về sẽ ra quầy trung tâm hoặc chuyển khoản nốt số tiền còn lại.'
      audioDuration = '02:20'
      appointmentText = 'Hẹn thanh toán nốt: 22/07 17:00'
    } else {
      careNote = isMath
        ? '[CSTP] Đã liên hệ phụ huynh tư vấn gia hạn khóa Toán tư duy Archimedes 12 tháng. Phụ huynh quan tâm chương trình ưu đãi đóng sớm và xin thêm thông tin về lịch học thứ 7.'
        : '[CSTP] Đã liên hệ phụ huynh tư vấn gia hạn lộ trình Tiếng Anh nâng cao. Học viên học lực tốt, phụ huynh đang cân nhắc sắp xếp lịch học thêm của con ở trường.'
      parentOpinion = 'Bố mẹ cần trao đổi lại với con về lịch học trên trường, hẹn chuyên viên tư vấn gọi lại vào chiều mai.'
      audioDuration = '02:45'
      appointmentText = 'Hẹn liên hệ lại: 21/07 15:00'
    }
  } else {
    // Regular care (chưa có ghi chú)
    careNote = isMath
      ? '[HT-01] Giáo viên và CSM trao đổi về tình hình bài tập về nhà Buổi 14 & hướng dẫn ôn tập phần hình học không gian.'
      : '[HT-01] Trao đổi với phụ huynh về tình hình chuyên cần và kết quả bài kiểm tra định kỳ 4 kỹ năng của con.'
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
  const effectiveRecipient = parsedRec || chatRecipient || 'Châu Mẹ Nguyễn Thị Mai (Mẹ)'
  const latestLogDate = activeLog?.date || (student?.interactionLogs && student.interactionLogs.length > 0
    ? student.interactionLogs[student.interactionLogs.length - 1].date
    : '2026-07-20 14:00')
  const timeInfo = formatCareHistoryTime(latestLogDate)
  const effectiveCSStaffName = formatFullStaffName(activeLog?.staffName || csStaffName)

  const defaultMockMissedLogs = useMemo(() => [
    {
      time: '18/07 09:30',
      status: 'Gọi KNM',
      nextCallback: '18/07 14:15',
      duration: '',
      note: 'Đã gọi trao đổi nhưng phụ huynh không nghe máy, gửi tin nhắn hẹn gọi lại.',
      parentOpinion: undefined,
      staffName: effectiveCSStaffName,
      recipient: effectiveRecipient,
    },
    {
      time: '19/07 14:15',
      status: 'Gọi máy bận',
      nextCallback: '20/07 10:00',
      duration: '',
      note: 'Đã liên hệ lại theo lịch hẹn, đường dây phụ huynh bận.',
      parentOpinion: undefined,
      staffName: effectiveCSStaffName,
      recipient: effectiveRecipient,
    },
  ], [effectiveCSStaffName, effectiveRecipient])

  const missedLogs = useMemo(() => {
    // Gom tất cả các lần log trước đó (từ vị trí 1 trở đi trong danh sách đã sắp xếp)
    if (allLogs.length > 1) {
      const priorLogs = allLogs.slice(1).map((logItem) => {
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
      return [...priorLogs, ...defaultMockMissedLogs]
    }
    return defaultMockMissedLogs
  }, [allLogs, effectiveCSStaffName, effectiveRecipient, defaultMockMissedLogs])

  const dateRangeText = useMemo(() => {
    if (missedLogs.length === 0) return ''
    const hasToday = missedLogs.some(
      (m) =>
        m.time.includes('Vừa xong') ||
        m.time.includes('Hôm nay') ||
        m.time.includes('phút') ||
        m.time.includes('giờ')
    )
    if (hasToday) {
      return '18/07 - Hôm nay'
    }
    return '18/07 - 19/07'
  }, [missedLogs])

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
              title="2026-07-20 14:00"
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

        {/* Active Care Card Body - Đóng khung ngoài tinh gọn */}
        <div
          className={cn(
            'rounded-lg p-2 sm:p-2.5 space-y-1 text-xs text-left border',
            isRenewal && statusLabel === 'Đã tái phí'
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

          {/* Lịch sử ghi nhận chăm sóc trước đó (Accordion) - Mảnh gọn, không có đường line phân cách */}
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
        </div>
      </div>
    </div>
  )
}
