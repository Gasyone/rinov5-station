'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SessionHistory } from './studentCareReportHelpers'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'

interface CareSessionTimelineListProps {
  regularSessions?: SessionHistory[]
  testSessions?: SessionHistory[]
  pkgIsEnglish: boolean
  smartCards?: React.ReactNode
}

interface UnifiedSessionItem {
  id: string
  sessionNumber: number
  date: string
  type: 'upcoming' | 'lesson' | 'test'
  topic: string
  time?: string
  room?: string
  teacher?: string
  preparation?: string
  attendance?: string
  attendanceText?: string
  homeworkCode?: string
  homeworkSubmitted?: boolean
  homeworkScore?: string
  rating?: number
  score?: number
  comment?: string
  skills?: Record<string, string>
}

export function CareSessionTimelineList({
  pkgIsEnglish,
  smartCards
}: CareSessionTimelineListProps) {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [showAllHistory, setShowAllHistory] = useState(false)

  const toggleExpand = (id: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Unified sessions list - Ordered DESCENDING by session number
  const allSessions: UnifiedSessionItem[] = [
    // Upcoming Sessions (On Top)
    {
      id: 'next-2',
      sessionNumber: 21,
      date: '2026-07-31 (Thứ 6)',
      time: '17:30 - 19:00',
      type: 'upcoming' as const,
      topic: pkgIsEnglish
        ? 'Unit 9: Presentation Skills & Individual Speech Project'
        : 'Bài 20: Luyện tập tổng hợp & Thuyết trình Dự án Toán học',
      room: 'P.102 (Tầng 1)',
      teacher: 'Bùi Văn Anh',
      preparation: 'Chuẩn bị slide/poster dự án thuyết trình cá nhân',
      homeworkCode: 'BT-09',
      homeworkSubmitted: false,
    },
    {
      id: 'next-1',
      sessionNumber: 20,
      date: '2026-07-27 (Thứ 2)',
      time: '17:30 - 19:00',
      type: 'upcoming' as const,
      topic: pkgIsEnglish
        ? 'Unit 8: Advanced Academic Vocabulary & Writing Strategy'
        : 'Bài 19: Tỉ số phần trăm & Ứng dụng thực tế tính tiền lãi',
      room: 'P.102 (Tầng 1)',
      teacher: 'Nguyễn Minh Trí',
      preparation: 'Xem trước từ vựng Unit 8 trong sách bài tập và chuẩn bị câu hỏi thảo luận',
      homeworkCode: 'BT-08',
      homeworkSubmitted: false,
    },

    // Completed Sessions (Descending Order: 19 ➔ 15)
    {
      id: 'past-19',
      sessionNumber: 19,
      date: '2026-07-22',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Unit 7: World Culture & Global Heritage'
        : 'Bài 18: Phép chia Số có nhiều chữ số & Bài toán có lời văn',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-07',
      homeworkSubmitted: true,
      homeworkScore: '10/10',
      rating: 5,
      comment:
        'Xuất sắc bài tập nâng cao đạt 10/10 tuyệt đối! Con có tư duy sáng tạo, khả năng tự học cao và luôn hoàn thành bài tập trước hạn.',
    },
    {
      id: 'past-18',
      sessionNumber: 18,
      date: '2026-07-20',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Listening & Speaking Skills Workshop'
        : 'Bài 17: Ôn tập Toán Logic & Chuẩn bị thi',
      attendance: 'late',
      attendanceText: 'Đi muộn 10m',
      homeworkCode: 'BT-06',
      homeworkSubmitted: true,
      homeworkScore: '8.5/10',
      rating: 4,
      comment:
        'Vào lớp trễ 10 phút do kẹt xe nhưng bắt kíp nhịp học rất nhanh, hoàn thành xuất sắc bài tập nhóm.',
    },
    {
      id: 'past-17',
      sessionNumber: 17,
      date: '2026-07-17',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Unit 6: Technology & Future Innovation'
        : 'Bài 16: Hình học Khung không gian & Thể tích khối lập phương',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-05',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 4,
      comment:
        'Học tập rất tập trung, tương tác tích cực với thầy cô và hỗ trợ các bạn trong giờ thảo luận nhóm.',
    },
    {
      id: 'past-16',
      sessionNumber: 16,
      date: '2026-07-15',
      type: 'test' as const,
      topic: pkgIsEnglish
        ? 'Kiểm tra Giữa kỳ (Midterm Assessment)'
        : 'Bài kiểm tra Định kỳ tháng 7',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-04',
      homeworkSubmitted: true,
      homeworkScore: '8.5/10',
      rating: 5,
      score: 8.5,
      comment: pkgIsEnglish
        ? 'Kết quả bài thi giữa kỳ xuất sắc (8.5/10), con cải thiện vượt bậc ở kỹ năng Đọc hiểu và Từ vựng học thuật.'
        : 'Đạt điểm giỏi bài kiểm tra logic định kỳ tháng 7 (8.5/10). Con có tư duy hình học không gian xuất sắc.',
    },
    {
      id: 'past-15',
      sessionNumber: 15,
      date: '2026-07-13',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Unit 5: Environmental Conservation & Group Debate'
        : 'Bài 15: Phép chia Số có nhiều chữ số & Bài toán có lời văn',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-03',
      homeworkSubmitted: true,
      homeworkScore: '9.5/10',
      rating: 5,
      comment:
        'Con phản xạ nói rất tự nhiên, chủ động sử dụng nhiều từ vựng chủ đề môi trường và tham gia thảo luận hăng hái.',
    },

    // Older Historical Sessions
    {
      id: 'past-14',
      sessionNumber: 14,
      date: '2026-07-10',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Unit 4: Science & Space Exploration'
        : 'Bài 14: Luyện tập Toán Tư Duy & Ôn tập Tổng hợp',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-02',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 4,
      comment: 'Hoàn thành bài tập khoa học đúng hạn, tư duy logic phản xạ nhanh.',
    },
    {
      id: 'past-13',
      sessionNumber: 13,
      date: '2026-07-08',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Unit 3: Healthy Lifestyle & Nutrition'
        : 'Bài 13: Bài toán Tìm hai số khi biết Tổng và Tỉ số',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-01',
      homeworkSubmitted: false,
      rating: 4,
      comment: 'Tham gia xây dựng bài tích cực, hiểu rõ bản chất công thức tính tỉ số.',
    },
    {
      id: 'past-12',
      sessionNumber: 12,
      date: '2026-07-06',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Grammar Review & Vocabulary Expansion'
        : 'Bài 12: Hình học Ôn tập Tính diện tích Tam giác & Tứ giác',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-12',
      homeworkSubmitted: true,
      homeworkScore: '9.5/10',
      rating: 5,
      comment: 'Nắm chắc kiến thức ngữ pháp cơ bản, làm bài tập thực hành nhanh và chuẩn xác.',
    },
    {
      id: 'past-11',
      sessionNumber: 11,
      date: '2026-07-03',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Unit 2: Art, Music & Cultural Diversity'
        : 'Bài 11: Phép nhân và Phép chia Phân số Nâng cao',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-11',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 5,
      comment: 'Phát biểu sôi nổi, chủ động đặt nhiều câu hỏi mở rộng với giáo viên.',
    },
    {
      id: 'past-10',
      sessionNumber: 10,
      date: '2026-07-01',
      type: 'test' as const,
      topic: pkgIsEnglish
        ? 'Bài kiểm tra Đầu tháng (Monthly Placement Test)'
        : 'Bài kiểm tra Định kỳ tháng 6',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-10',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 5,
      score: 9.0,
      comment: 'Bài thi đạt 9.0/10 xuất sắc, kiến thức nền tảng rất vững vàng.',
    },
  ]

  const visibleSessions = showAllHistory ? allSessions : allSessions.slice(0, 7)
  const upcomingSessions = visibleSessions.filter((s) => s.type === 'upcoming')
  const regularCompletedSessions = visibleSessions.filter((s) => s.type === 'lesson')
  const testCompletedSessions = visibleSessions.filter((s) => s.type === 'test')

  const getDayOfWeekName = (dateStr: string) => {
    if (dateStr.includes('Thứ')) {
      const match = dateStr.match(/(Thứ\s*\d|Thứ\s*Bảy|Chủ\s*Nhật)/i)
      if (match) return match[1]
    }
    const cleanDate = dateStr.split(' ')[0]
    const d = new Date(cleanDate)
    if (isNaN(d.getTime())) return 'Thứ 4'
    const day = d.getDay()
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    return days[day]
  }

  const formatDateOnly = (dateStr: string) => {
    const cleanDate = dateStr.split(' ')[0]
    if (cleanDate.includes('/')) return cleanDate
    const d = new Date(cleanDate)
    if (isNaN(d.getTime())) return dateStr
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  const renderSessionCard = (session: UnifiedSessionItem) => {
    const isUpcoming = session.type === 'upcoming'
    const isTest = session.type === 'test'
    const isExpanded = !!expandedComments[session.id]

    const dayOfWeek = getDayOfWeekName(session.date)
    const formattedDate = formatDateOnly(session.date)
    const timeSlot = session.time || '17:30 - 19:00'

    return (
      <div
        key={session.id}
        className={cn(
          'p-2.5 sm:p-3 rounded-xl border transition-all text-xs space-y-2',
          isUpcoming
            ? 'bg-muted/10 border-border/40'
            : isTest
            ? 'bg-violet-500/5 dark:bg-violet-950/10 border-violet-200/50 dark:border-violet-900/40'
            : 'bg-card border-border/40 hover:border-border/70'
        )}
      >
        {/* Row 1: Title + Score / Rating */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <h4 className="font-semibold text-foreground text-xs truncate leading-snug">
              {session.topic}
            </h4>
            {isTest && (
              <Badge variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300 border border-violet-200 dark:border-violet-800 shrink-0">
                Kiểm tra
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-[11px]">
            {session.rating && !isTest && (
              <span className="flex items-center gap-0.5 font-medium text-amber-500">
                {session.rating}<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
            )}
            {isTest && session.score && (
              <span className="font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-200/80">
                {session.score}/10
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Highlighted Day of Week + Date + Time Slot */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5 pb-0.5">
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className={cn(
              'font-extrabold text-[10px] px-1.5 py-0.5 rounded-md border shrink-0 shadow-3xs',
              isTest
                ? 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                : 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800'
            )}>
              {dayOfWeek}
            </span>
            <ClassSessionHoverCard
              session={{
                id: session.id,
                className: pkgIsEnglish ? 'IELTS Junior 1A' : 'Toán Tư Duy STEM Rino',
                classCode: pkgIsEnglish ? 'CLS-IELTS-001' : 'LD_TOAN_00010',
                subject: pkgIsEnglish ? 'Tiếng Anh - IELTS' : 'Toán tư duy - STEM',
                level: pkgIsEnglish ? 'IELTS Junior' : 'Einstein 0 - A',
                timeSlot: timeSlot,
                schoolRoom: session.room || 'P.102 • RinoEdu Nguyễn Tuân',
                branch: 'RinoEdu Nguyễn Tuân',
                teacherName: session.teacher || 'Nguyễn Minh Trí, Bùi Văn Anh',
                taName: 'Trần Văn Hoàng',
                totalStudents: 20,
                trialStudents: 2,
                status: session.type === 'upcoming' ? 'scheduled' : 'completed',
                title: session.topic,
              }}
              side="top"
            >
              <span className="font-semibold text-foreground hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer transition-colors">
                {formattedDate}
              </span>
            </ClassSessionHoverCard>
            <span className="text-border/80 shrink-0">•</span>
            <span className="font-mono text-[10.5px] font-medium text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/50 shrink-0">
              {timeSlot}
            </span>
          </div>

          {/* Status Điểm danh & BTVN */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap ml-auto">
            {isUpcoming ? (
              <span className="text-muted-foreground/70">Chưa điểm danh</span>
            ) : session.attendance === 'present' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Đã đến</span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">{session.attendanceText}</span>
            )}
            <span className="text-border/60">•</span>
            <span>
              BTVN:{' '}
              {session.homeworkSubmitted ? (
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      `Chi tiết bài tập ${session.homeworkCode}: Đã làm (${session.homeworkScore})`
                    )
                  }
                  className="text-primary hover:underline font-medium cursor-pointer"
                >
                  {session.homeworkCode} ({session.homeworkScore})
                </button>
              ) : (
                <span className="text-muted-foreground/70 font-normal">
                  {session.homeworkCode} (Chưa làm)
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Optional Comments: 3 lines clamp + Xem thêm on bottom row */}
        {session.comment && (
          <div className="pt-1.5 border-t border-border/30 space-y-1">
            <p
              className={cn(
                'text-[11px] text-slate-900 dark:text-zinc-100 font-normal leading-relaxed',
                !isExpanded && 'line-clamp-3'
              )}
            >
              {session.comment}
            </p>
            {session.comment.length > 70 && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() => toggleExpand(session.id)}
                  className="text-[10.5px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer font-semibold transition-colors"
                >
                  <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 text-left select-none overflow-hidden">
      {/* Streamlined Header with soft background tint */}
      <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
        <h3 className="text-xs font-bold text-foreground tracking-tight">
          Nhật ký Buổi học
        </h3>
        <span className="text-[10px] text-muted-foreground font-normal">
          Hiển thị {visibleSessions.length}/{allSessions.length} buổi
        </span>
      </div>

      {/* Smart Cards inside Nhật ký Buổi học (trên các buổi học) */}
      {smartCards && <div className="mb-2">{smartCards}</div>}

      {/* Single Line Upcoming Session Banner (1 buổi tiếp theo) */}
      {upcomingSessions.length > 0 && (() => {
        const nextSession = [...allSessions.filter((s) => s.type === 'upcoming')].sort(
          (a, b) => a.sessionNumber - b.sessionNumber
        )[0] || upcomingSessions[0]

        const sessionTime = nextSession.time || '17:30 - 19:00'
        const dayOfWeek = getDayOfWeekName(nextSession.date)
        const formattedDate = formatDateOnly(nextSession.date)
        const fullDateTime = `${dayOfWeek} • ${formattedDate} (${sessionTime})`

        return (
          <div className="pt-0.5 pb-1">
            <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/50">
              <div className="flex items-center gap-2 min-w-0 pr-3">
                <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 animate-pulse" />
                <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 shrink-0 uppercase tracking-wide">
                  Buổi tiếp theo:
                </span>
                <span className="font-semibold text-foreground truncate text-xs">
                  {nextSession.topic}
                </span>
              </div>

              <ClassSessionHoverCard
                session={{
                  id: nextSession.id,
                  className: pkgIsEnglish ? 'IELTS Junior 1A' : 'Toán Tư Duy STEM Rino',
                  classCode: pkgIsEnglish ? 'CLS-IELTS-001' : 'LD_TOAN_00010',
                  subject: pkgIsEnglish ? 'Tiếng Anh - IELTS' : 'Toán tư duy - STEM',
                  level: pkgIsEnglish ? 'IELTS Junior' : 'Einstein 0 - A',
                  timeSlot: sessionTime,
                  schoolRoom: nextSession.room || 'P.102 • RinoEdu Nguyễn Tuân',
                  branch: 'RinoEdu Nguyễn Tuân',
                  teacherName: nextSession.teacher || 'Nguyễn Minh Trí, Bùi Văn Anh',
                  taName: 'Trần Văn Hoàng',
                  totalStudents: 20,
                  trialStudents: 2,
                  status: 'scheduled',
                  title: nextSession.topic,
                }}
                side="top"
              >
                <span className="text-xs text-muted-foreground hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer font-medium shrink-0 ml-2 whitespace-nowrap inline-flex items-center gap-1 transition-colors">
                  <span className="font-extrabold text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950 dark:text-sky-300">
                    {dayOfWeek}
                  </span>
                  <span>{formattedDate} ({sessionTime})</span>
                </span>
              </ClassSessionHoverCard>
            </div>
          </div>
        )
      })()}

      {/* Section 2: Completed Regular Lessons */}
      {regularCompletedSessions.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Các buổi học chính ({regularCompletedSessions.length})</span>
          </div>
          <div className="space-y-2">
            {regularCompletedSessions.map(renderSessionCard)}
          </div>
        </div>
      )}

      {/* Section 3: TÁCH KIỂM TRA THÀNH 1 SECTION RIÊNG */}
      {testCompletedSessions.length > 0 && (
        <div className="space-y-2 pt-3 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span>Bài kiểm tra & Đánh giá định kỳ ({testCompletedSessions.length})</span>
          </div>
          <div className="space-y-2">
            {testCompletedSessions.map(renderSessionCard)}
          </div>
        </div>
      )}

      {/* Expand More Button */}
      {allSessions.length > 7 && (
        <div className="pt-1.5 text-center">
          <button
            type="button"
            onClick={() => setShowAllHistory(!showAllHistory)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-border/40 transition-all cursor-pointer"
          >
            <span>
              {showAllHistory
                ? 'Thu gọn lịch sử'
                : `Xem thêm lịch sử (${allSessions.length - 7} buổi cũ hơn)`}
            </span>
            {showAllHistory ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
    </div>
  )
}
