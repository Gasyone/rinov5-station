'use client'

import { useState } from 'react'
import { History, ChevronUp, ChevronDown } from 'lucide-react'
import { AudioPlayButton } from './AudioPlayButton'
import { formatFullStaffName } from './operationsAlertHelpers'
import {
  cleanMessageNotes,
  parseRecipient,
  formatCareHistoryTime,
} from './studentCareDetailHelpers'
import type { StudentCareAlert } from '@/mocks/careAlerts'

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
}

export function StudentActiveCareCard({
  student,
  chatRecipient,
  isCaredStatus,
  defaultShowMissedCalls = false,
  mode = 'regular',
  cstpStatus,
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

  // Nội dung ghi chú chăm sóc mẫu theo ngữ cảnh
  let careNote = ''
  let parentOpinion = ''
  let audioDuration = '02:45'
  let appointmentText = isRenewal ? 'Hẹn liên hệ lại: 22/07 10:00' : 'Hẹn gọi lại: 20/07 14:00'

  if (isRenewal) {
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
    // Regular care
    if (student?.interactionNotes) {
      careNote = student.interactionNotes
      parentOpinion = 'Phụ huynh cảm ơn thầy cô đã thông tin kịp thời, sẽ nhắc con ôn bài đầy đủ.'
    } else {
      careNote = isMath
        ? '[HT-01] Giáo viên và CSM trao đổi về tình hình bài tập về nhà Buổi 14 & hướng dẫn ôn tập phần hình học không gian. Học viên tiếp thu nhanh nhưng đôi khi còn mất tập trung ở phần bài tập tự luyện.'
        : '[HT-01] Trao đổi với phụ huynh về tình hình chuyên cần và kết quả bài kiểm tra định kỳ 4 kỹ năng của con. Con phản xạ nói rất tốt, cần tăng cường thêm vốn từ vựng và bài tập viết tại nhà.'
      parentOpinion = 'Mẹ cảm ơn cô giáo đã nhiệt tình nhắc nhở và kèm cặp con, tối nay sẽ nhắc con hoàn thành phiếu bài tập số 14.'
    }
  }

  const effectiveCareNote = cleanMessageNotes(careNote)
  const parsedRec = parseRecipient(student?.interactionNotes)
  const effectiveRecipient = parsedRec || chatRecipient || 'Châu Mẹ Nguyễn Thị Mai (Mẹ)'
  const timeInfo = formatCareHistoryTime('2026-07-20 14:00')

  const missedLogs = [
    {
      time: '18/07 09:30',
      status: 'Đã trao đổi',
      nextCallback: '18/07 14:15',
      duration: '01:45',
      note: isRenewal
        ? isMath
          ? 'Liên hệ trao đổi lần 1 về kết quả học Toán tư duy giữa kỳ và giới thiệu chương trình nâng cấp lên Level 2.'
          : 'Liên hệ trao đổi lần 1 về tiến độ học Tiếng Anh của con và chính sách ưu đãi tái phí sớm 10%.'
        : 'Trao đổi về tình hình làm bài tập về nhà và sự tập trung của con trong các tiết học gần đây.',
      parentOpinion: isRenewal
        ? 'Phụ huynh rất quan tâm nhưng muốn xem lại bảng điểm chi tiết của con trước khi quyết định.'
        : 'Mẹ cảm ơn cô giáo đã kèm cặp sát sao, dạo này con ở nhà tự giác học hơn.',
    },
    {
      time: '18/07 14:15',
      status: 'Đã trao đổi',
      nextCallback: '19/07 10:00',
      duration: '02:10',
      note: isRenewal
        ? isMath
          ? 'Gọi lại gửi phân tích điểm số các bài kiểm tra tuần. Giải đáp thắc mắc về phương pháp tư duy giải toán nhanh.'
          : 'Gọi lại tư vấn xếp lịch học thứ 7 phù hợp với lịch học chính khóa trên trường của con.'
        : 'Thông báo kết quả kiểm tra định kỳ chuyên cần và gửi nhận xét chi tiết của giáo viên.',
      parentOpinion: isRenewal
        ? 'Mẹ chia sẻ gia đình rất hài lòng với sự tiến bộ của con, đang cân nhắc giữa gói 6 tháng và 12 tháng.'
        : 'Gia đình rất vui vì con có tiến bộ rõ rệt ở kỹ năng thuyết trình trước lớp.',
    },
    ...(isRenewal
      ? [
          {
            time: '19/07 10:00',
            status: 'Đã trao đổi',
            nextCallback: '20/07 14:00',
            duration: '01:30',
            note: 'Gửi bảng tính học phí sau khi áp dụng mã giảm giá và đối chiếu số buổi học còn lại của gói hiện tại.',
            parentOpinion:
              'Bố mẹ đồng ý cho con học tiếp, đề xuất chiều nay hoặc ngày mai sẽ ra quầy hoàn tất thủ tục đăng ký.',
          },
        ]
      : []),
  ]

  return (
    <div className="space-y-1 text-left select-none pt-1">
      {/* Active Care Card Item */}
      <div className="space-y-1">
        {/* Header row: Status + CS circle badge + Staff name + Channel & Recipient + Relative time & Next appointment */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5 pb-1 select-none">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className={cn('px-1.5 py-0.5 rounded-md text-xs font-bold border shrink-0', statusBadgeClass)}>
              {statusLabel}
            </span>
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-medium select-none bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 shrink-0">
              CS
            </span>
            <PersonnelHoverCard person={getCSStaffPerson(csStaffName)}>
              <span className="font-normal text-foreground text-xs cursor-pointer hover:underline hover:text-primary transition-colors">
                {csStaffName}
              </span>
            </PersonnelHoverCard>
            <span className="text-xs text-muted-foreground font-normal truncate">
              • Đã gọi <span className="text-foreground font-normal">{effectiveRecipient}</span>
            </span>
            <span
              className="text-xs text-muted-foreground font-normal shrink-0"
              title="2026-07-20 14:00"
            >
              • {timeInfo.display}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-xs font-normal text-muted-foreground">
              📅 {appointmentText}
            </span>
          </div>
        </div>

        {/* Active Care Card Body - Đóng khung ngoài */}
        <div className="rounded-lg border border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-2 space-y-1.5 text-xs text-left">
          {/* Continuous Stream: Audio + Clean Note + Parent Feedback Label & Text */}
          <div className="text-xs text-foreground/90 font-normal leading-relaxed">
            <span className="inline-flex items-center align-middle mr-2">
              <AudioPlayButton duration={audioDuration} />
            </span>
            <span className="align-middle">{effectiveCareNote}</span>
            {parentOpinion && (
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

          {/* Lịch sử ghi nhận chăm sóc trước đó (Accordion) - Bên trong không đóng khung lồng nhau */}
          <div className="pt-1 select-none border-t border-amber-200/60 dark:border-amber-900/30">
            <button
              type="button"
              onClick={() => setShowMissedCalls(!showMissedCalls)}
              className="w-full text-left text-xs font-normal italic text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center justify-between cursor-pointer py-0.5 bg-transparent border-0 p-0 transition-colors"
            >
              <span className="flex items-center gap-1.5 underline decoration-sky-300 dark:decoration-sky-700">
                <History className="h-3.5 w-3.5 text-sky-500 shrink-0 no-underline" />
                <span>
                  Lịch sử ({missedLogs.length}) lần ghi nhận chăm sóc trước đó
                </span>
                <span className="font-mono text-[9.5px] text-muted-foreground font-normal ml-1">
                  18/07 - 19/07
                </span>
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
                        <PersonnelHoverCard person={getCSStaffPerson(csStaffName)}>
                          <span className="font-normal text-foreground text-xs cursor-pointer hover:underline hover:text-primary transition-colors">
                            {csStaffName}
                          </span>
                        </PersonnelHoverCard>

                        <span className="text-xs text-muted-foreground font-normal truncate">
                          • {mCall.status} - <span className="text-foreground font-normal">{effectiveRecipient}</span>
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
