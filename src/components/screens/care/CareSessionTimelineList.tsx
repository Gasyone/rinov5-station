'use client'

import React, { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Star, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { SessionHistory } from './studentCareReportHelpers'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import { PersonnelHoverCard } from '@/components/shared'

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
  const [showAllTests, setShowAllTests] = useState(false)

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
      teacher: 'Bùi Văn Anh',
      preparation: 'Đọc trước tài liệu Unit 8 & chuẩn bị bài tập nhóm',
      homeworkCode: 'BT-08',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
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
      comment: `🎯 Bài học hôm nay có gì:
- Con đã cùng cô khám phá về chủ đề hình học trong bài học Level G22: Bài 2 Tạo hình lớn hơn. 🟥

🏅 Thành tích nổi bật:
- Hôm nay con tham gia học tập rất tích cực và nắm được cách ghép hình, hoàn thành tốt các bài tập trong giờ học. ✨
- Con biết quan sát, so sánh hình đã ghép với hình mẫu và bước đầu hình dung được cách sắp xếp các mảnh ghép. 🧩
- Khả năng hình dung không gian con cần thêm thời gian để thử nghiệm nhiều cách ghép khác nhau, nhưng luôn có tinh thần cố gắng. 👏`,
    },
    {
      id: 'past-18',
      sessionNumber: 18,
      date: '2026-07-20',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Unit 6: Technology & Future Innovations'
        : 'Bài 17: Phép nhân và Phép chia Số thập phân',
      attendance: 'present',
      attendanceText: 'Đi muộn 10m',
      homeworkCode: 'BT-06',
      homeworkSubmitted: true,
      homeworkScore: '9.0/10',
      rating: 5,
      comment: `🎯 Bài học hôm nay có gì:
- Con đã học xong bài 17 chủ đề Phép nhân và Phép chia Số thập phân nâng cao. 📐

🏅 Thành tích nổi bật:
- Con biết làm các dạng bài toán tính nhanh và vận dụng linh hoạt vào bài tập thực tế. 🌟`,
    },
    {
      id: 'past-17',
      sessionNumber: 17,
      date: '2026-07-17',
      type: 'lesson' as const,
      topic: pkgIsEnglish
        ? 'Midterm Review & Critical Thinking Practice'
        : 'Bài 16: Hình học Không gian & Diện tích Hình Thang',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-05',
      homeworkSubmitted: true,
      homeworkScore: '9.5/10',
      rating: 5,
      comment: `🎯 Bài học hôm nay có gì:
- Con ôn tập kiến thức hình học diện tích hình thang và chuẩn bị bài kiểm tra logic. 📐

🏅 Thành tích nổi bật:
- Học tập rất tập trung, tương tác tích cực với thầy cô và hỗ trợ các bạn trong giờ thảo luận nhóm. ✨
- Khả năng tư duy hình học của con rất phát triển và chính xác. 🧩`,
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
      comment: `🎯 Bài học hôm nay có gì:
- Con học chủ đề Phép chia Số có nhiều chữ số và giải bài toán có lời văn thực tế. 💡

🏅 Thành tích nổi bật:
- Con phản xạ nói rất tự nhiên, chủ động tham gia thảo luận hăng hái. ✨
- Hoàn thành bài tập đúng hạn với kết quả xuất sắc 9.5/10. 👏`,
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
    {
      id: 'past-05',
      sessionNumber: 5,
      date: '2026-06-15',
      type: 'test' as const,
      topic: pkgIsEnglish
        ? 'Bài kiểm tra Giữa kỳ (Midterm Level Test)'
        : 'Bài kiểm tra Định kỳ tháng 5',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-05',
      homeworkSubmitted: true,
      homeworkScore: '8.8/10',
      rating: 5,
      score: 8.8,
      comment: 'Bài kiểm tra kiến thức tổng hợp giữa khóa đạt 8.8/10. Con làm tốt các bài toán logic.',
    },
    {
      id: 'past-01',
      sessionNumber: 1,
      date: '2026-06-01',
      type: 'test' as const,
      topic: pkgIsEnglish
        ? 'Bài kiểm tra Đầu vào (Initial Assessment)'
        : 'Bài kiểm tra Đầu vào Level G2',
      attendance: 'present',
      attendanceText: 'Đã đến',
      homeworkCode: 'BT-01',
      homeworkSubmitted: true,
      homeworkScore: '9.2/10',
      rating: 5,
      score: 9.2,
      comment: 'Kết quả đánh giá năng lực đầu vào xuất sắc (9.2/10). Đủ điều kiện xếp lớp nâng cao.',
    },
  ]

  const visibleSessions = showAllHistory ? allSessions : allSessions.slice(0, 7)
  const upcomingSessions = visibleSessions.filter((s) => s.type === 'upcoming')
  const regularCompletedSessions = visibleSessions.filter((s) => s.type === 'lesson')
  const allTestSessions = allSessions.filter((s) => s.type === 'test')
  const testCompletedSessions = showAllTests ? allTestSessions : allTestSessions.slice(0, 1)

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
          'p-1.5 sm:p-2 rounded-xl border transition-all text-xs space-y-1',
          isUpcoming
            ? 'bg-muted/10 border-border/40'
            : isTest
            ? 'bg-violet-500/5 dark:bg-violet-950/10 border-violet-200/50 dark:border-violet-900/40'
            : 'bg-card border-border/40 hover:border-border/70'
        )}
      >
        {/* Row 1: Title on left | Rating 5★ + Lịch học (Thứ, ngày, giờ) on right */}
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
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

          <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-[11px] flex-wrap sm:flex-nowrap">
            {session.rating && !isTest && (
              <span className="flex items-center gap-0.5 font-medium text-amber-500 shrink-0">
                {session.rating}<Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
            )}
            {isTest && session.score && (
              <span className="font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-1.5 py-0.5 rounded border border-violet-200/80 shrink-0">
                {session.score}/10
              </span>
            )}

            {/* Lịch học thứ, ngày (giờ) ở phía sau Rating 5 sao */}
            <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
              <span className={cn(
                'font-normal text-[10px] px-1.5 py-0.5 rounded-md border shrink-0 shadow-3xs',
                isTest
                  ? 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800'
                  : 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800'
              )}>
                {dayOfWeek}
              </span>
              <span className="text-muted-foreground text-xs font-normal shrink-0">
                {formattedDate} ({timeSlot})
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Thông tin GV, TG, Phòng & Điểm danh / BTVN */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
          <div className="flex items-center gap-1.5 text-muted-foreground flex-wrap">
            <span className="text-muted-foreground">GV:</span>
            <PersonnelHoverCard
              person={{
                id: 'EMP-HTM',
                name: session.teacher || 'Hoàng Thị Mai',
                role: 'Giáo viên chính',
                phone: '0901234567',
                email: 'hongthmai@rinoedu.com',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangThiMai',
              }}
              align="start"
            >
              <span className="font-normal text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer transition-colors">
                {session.teacher || 'Hoàng Thị Mai'}
              </span>
            </PersonnelHoverCard>

            <span className="text-border/60">•</span>

            <span className="text-muted-foreground">TG:</span>
            <PersonnelHoverCard
              person={{
                id: 'EMP-TA-HA',
                name: 'Hoàng Anh',
                role: 'Trợ giảng (TA)',
                phone: '0934567890',
                email: 'honganh@rinoedu.com',
                avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=HoangAnh',
              }}
              align="start"
            >
              <span className="font-normal text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer transition-colors">
                Hoàng Anh
              </span>
            </PersonnelHoverCard>

            <span className="text-border/60">•</span>

            <span className="text-muted-foreground">Phòng:</span>
            <span className="font-normal text-slate-700 dark:text-zinc-300">
              {session.room || 'A101'}
            </span>
          </div>

          {/* Status Điểm danh & BTVN */}
          <div className="flex items-center gap-1.5 text-muted-foreground flex-wrap ml-auto">
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

        {/* Optional Comments: Default 3 lines clamp + inline italic ... xem thêm on line 3 */}
        {session.comment && (
          <div className="pt-1.5 border-t border-border/30">
            <div className="relative">
              <p
                className={cn(
                  'text-[11px] text-slate-900 dark:text-zinc-100 font-normal leading-relaxed whitespace-pre-line cursor-pointer',
                  !isExpanded && 'line-clamp-3 pr-20'
                )}
                onClick={() => toggleExpand(session.id)}
              >
                {session.comment}
              </p>
              {session.comment.length > 60 && (
                <button
                  type="button"
                  onClick={() => toggleExpand(session.id)}
                  className="absolute bottom-0 right-0 text-[10.5px] italic text-sky-600 dark:text-sky-400 hover:underline cursor-pointer bg-card dark:bg-zinc-900 pl-1 leading-relaxed inline-flex items-center gap-0.5"
                >
                  <span>{isExpanded ? '... Thu gọn' : '... xem thêm'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Card Section 1: Nhật ký Buổi học */}
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

        {/* Completed Regular Lessons */}
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

      {/* Card Section 2: Kiểm tra (Tách riêng giống Section Dự án, Header màu xám) */}
      {allTestSessions.length > 0 && (
        <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 text-left select-none overflow-hidden">
          {/* Header with soft background tint */}
          <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
            <h3 className="text-xs font-bold text-foreground tracking-tight">
              Kiểm tra
            </h3>
            <span className="text-[10px] text-muted-foreground font-normal">
              Hiển thị {testCompletedSessions.length}/{allTestSessions.length} bài kiểm tra
            </span>
          </div>

          <div className="space-y-2 pt-0.5">
            {testCompletedSessions.map(renderSessionCard)}
          </div>

          {/* Button xem thêm lịch sử (x bài cũ hơn) */}
          {allTestSessions.length > 1 && (
            <div className="pt-1.5 text-center">
              <button
                type="button"
                onClick={() => setShowAllTests(!showAllTests)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground border border-border/40 transition-all cursor-pointer"
              >
                <span>
                  {showAllTests
                    ? 'Thu gọn lịch sử'
                    : `Xem thêm lịch sử (${allTestSessions.length - 1} bài cũ hơn)`}
                </span>
                {showAllTests ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
