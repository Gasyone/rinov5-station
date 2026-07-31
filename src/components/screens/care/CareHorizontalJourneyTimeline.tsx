'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { CareTagHoverCard } from '@/components/shared'
import { AudioPlayButton } from './AudioPlayButton'
import { StudentCareWorkItem } from './careJourneyHelpers'

interface CareHorizontalJourneyTimelineProps {
  workItem: StudentCareWorkItem
}

interface MonthMilestone {
  code: string
  name: string
  role: 'CS' | 'GV' | 'GV/CS'
  date: string
  sub: string
  status: 'completed' | 'active' | 'upcoming'
  isOverdue?: boolean
  isAdhoc?: boolean
  historyLog?: {
    staffName: string
    date: string
    channel: string
    note: string
    quote?: string
    hasMissedCalls?: boolean
  }
}

interface MonthColumnData {
  monthKey: string
  monthName: string
  milestones: MonthMilestone[]
}

export const CareHorizontalJourneyTimeline: React.FC<CareHorizontalJourneyTimelineProps> = ({ workItem }) => {
  const [startIndex, setStartIndex] = useState(0)

  // Full 6-Month / 12-Month Roadmap divided into Month Columns with rich care history for hover speech bubble
  const monthColumnsData: MonthColumnData[] = [
    {
      monthKey: '2026-07',
      monthName: 'THÁNG 7/2026',
      milestones: [
        {
          code: 'TH-01',
          name: 'Prestudy (Trước khai giảng)',
          role: 'CS',
          date: '01/07/2026',
          sub: 'Xác nhận thông tin & nhận lớp',
          status: 'completed',
          historyLog: {
            staffName: 'Lê Thị Lan (CS)',
            date: '01/07/2026 09:30',
            channel: 'Cuộc gọi: Nguyễn Văn Hùng (Bố)',
            note: 'Xác nhận lại lịch học, quy định lớp học và gửi link lớp Zalo cho phụ huynh.',
            quote: '“Bố đã nhận được thông tin và sẽ chuẩn bị cho con tham gia buổi đầu đúng giờ.”',
            hasMissedCalls: true,
          },
        },
        {
          code: 'TH-02',
          name: 'Buổi 1-2 (Hòa nhập ban đầu)',
          role: 'CS',
          date: '05/07/2026',
          sub: 'Hỏi thăm trải nghiệm đầu tiên',
          status: 'completed',
          historyLog: {
            staffName: 'Lê Thị Lan (CS)',
            date: '05/07/2026 15:30',
            channel: 'Cuộc gọi: Châu Mẹ Nguyễn Thị Mai (Mẹ)',
            note: 'Hỏi thăm tình hình học sinh 2 buổi đầu tiên. Học viên hòa nhập tốt với các bạn và tích cực phát biểu.',
            quote: '“Bé về nhà rất hào hứng khen lớp học vui và cô giáo giảng bài dễ hiểu.”',
          },
        },
        {
          code: 'ĐX-01',
          name: 'Chăm sóc Đột xuất',
          role: 'CS',
          date: '15/07/2026 09:30',
          sub: 'Phát sinh ngoài mốc (Hỏi xe đưa đón & ngoại khóa)',
          status: 'completed',
          isAdhoc: true,
          historyLog: {
            staffName: 'Lê Thị Lan (CS)',
            date: '15/07/2026 09:30',
            channel: 'Zalo: Trần Thị Phương (Mẹ)',
            note: 'Hướng dẫn mẹ đăng ký tuyến xe đưa đón điểm trường Cơ sở 1 và các hoạt động ngoại khóa tháng 7.',
            quote: '“Cảm ơn cô, mẹ đã gửi form đăng ký xe bus cho bé rồi nhé.”',
          },
        },
        {
          code: 'ĐK-01',
          name: 'Báo cáo Chăm sóc Tháng 7/2026',
          role: 'GV',
          date: '25/07/2026',
          sub: 'Đánh giá thái độ & chuyên cần học tập',
          status: 'active',
          isOverdue: true,
          historyLog: {
            staffName: 'Hoàng Thị Mai (GV)',
            date: '20/07/2026 14:00',
            channel: 'Cuộc gọi: Nguyễn Văn Hùng (Bố)',
            note: 'Trao đổi về tình hình nghỉ học 2 buổi liên tiếp và điểm thi giảm sút.',
            quote: '“Bố bận việc gia đình, xin bảo lưu kết quả 1 tháng để con về quê giải quyết việc.”',
            hasMissedCalls: true,
          },
        },
      ],
    },
    {
      monthKey: '2026-08',
      monthName: 'THÁNG 8/2026',
      milestones: [
        {
          code: 'ĐK-02',
          name: 'Báo cáo Chăm sóc Tháng 8/2026',
          role: 'GV',
          date: '25/08/2026',
          sub: 'Báo cáo định kỳ tình hình học tập tháng 8',
          status: 'upcoming',
        },
      ],
    },
    {
      monthKey: '2026-09',
      monthName: 'THÁNG 9/2026',
      milestones: [
        {
          code: 'TH-03',
          name: 'Mini Project 1 (Dự án bài học)',
          role: 'GV',
          date: '15/09/2026',
          sub: 'Gửi video & nhận xét sản phẩm thực hành 1',
          status: 'upcoming',
        },
        {
          code: 'ĐK-03',
          name: 'Báo cáo Chăm sóc Tháng 9/2026',
          role: 'GV',
          date: '25/09/2026',
          sub: 'Đánh giá kết quả học tập giữa chặng',
          status: 'upcoming',
        },
      ],
    },
    {
      monthKey: '2026-10',
      monthName: 'THÁNG 10/2026',
      milestones: [
        {
          code: 'TH-04',
          name: 'Progress Test 1 (Giữa kỳ)',
          role: 'GV',
          date: '18/10/2026',
          sub: 'Bài thi kiểm tra đánh giá giữa khóa',
          status: 'upcoming',
        },
        {
          code: 'ĐK-04',
          name: 'Báo cáo Chăm sóc Tháng 10/2026',
          role: 'GV',
          date: '25/10/2026',
          sub: 'Tư vấn kết quả thi giữa kỳ cho gia đình',
          status: 'upcoming',
        },
      ],
    },
    {
      monthKey: '2026-11',
      monthName: 'THÁNG 11/2026',
      milestones: [
        {
          code: 'ĐK-05',
          name: 'Báo cáo Chăm sóc Tháng 11/2026',
          role: 'GV',
          date: '25/11/2026',
          sub: 'Đánh giá sự tiến bộ học tập tháng 11',
          status: 'upcoming',
        },
      ],
    },
    {
      monthKey: '2026-12',
      monthName: 'THÁNG 12/2026',
      milestones: [
        {
          code: 'ĐK-06',
          name: 'Báo cáo Chăm sóc Tháng 12/2026',
          role: 'GV',
          date: '25/12/2026',
          sub: 'Báo cáo chuyên cần và ý thức cuối năm',
          status: 'upcoming',
        },
        {
          code: 'TH-05',
          name: 'Mini Project 2 (Dự án nhóm)',
          role: 'GV',
          date: '15/01/2027',
          sub: 'Thuyết trình bài tập lớn sản phẩm 2',
          status: 'upcoming',
        },
      ],
    },
  ]

  const maxStartIndex = Math.max(0, monthColumnsData.length - 3)
  const visibleMonths = monthColumnsData.slice(startIndex, startIndex + 3)

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + 1))
  }

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 space-y-3 select-none">
      {/* 3-Month Sliding Controller Header */}
      <div className="w-full flex items-center justify-between py-0.5 shrink-0 gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={startIndex === 0}
          className="h-8 text-xs px-3 gap-1.5 font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 rounded-lg cursor-pointer shadow-none"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Tháng trước</span>
        </Button>

        <div className="px-4 py-1 font-mono text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50/60 dark:bg-sky-950/40 rounded-lg border border-sky-200/60 dark:border-sky-800/60 shadow-2xs">
          {visibleMonths[0]?.monthName} &rarr; {visibleMonths[visibleMonths.length - 1]?.monthName}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={startIndex >= maxStartIndex}
          className="h-8 text-xs px-3 gap-1.5 font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 rounded-lg cursor-pointer shadow-none"
        >
          <span>Tháng sau</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 3 MONTH COLUMNS CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 flex-1 min-h-0 overflow-y-auto pt-1 pb-1">
        {visibleMonths.map((col) => (
          <div
            key={col.monthKey}
            className="flex flex-col bg-muted/20 dark:bg-zinc-900/40 rounded-xl border border-border/70 overflow-hidden shadow-2xs"
          >
            {/* Column Month Header */}
            <div className="px-3.5 py-2.5 bg-muted/60 dark:bg-zinc-800/60 border-b border-border/60 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                <Calendar className="h-3.5 w-3.5 text-sky-600" />
                <span>{col.monthName}</span>
              </div>
              <Badge variant="secondary" className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-background border">
                {col.milestones.length} mốc
              </Badge>
            </div>

            {/* Column Milestones Stack */}
            <div className="p-3 space-y-2.5 overflow-y-auto flex-1 scrollbar-thin">
              {col.milestones.map((m, idx) => {
                const isCompleted = m.status === 'completed'
                const isActive = m.status === 'active'
                const isUpcoming = m.status === 'upcoming'
                const historyLog = m.historyLog
                const isTeacher = m.role.includes('GV')

                return (
                  <HoverCard key={idx} openDelay={150} closeDelay={150}>
                    <HoverCardTrigger asChild>
                      <div
                        className={cn(
                          'rounded-xl border p-3 text-xs space-y-2 transition-all bg-card shadow-2xs cursor-pointer hover:border-sky-400 hover:shadow-md',
                          isCompleted && 'border-emerald-200 bg-emerald-50/20 dark:border-emerald-950 dark:bg-emerald-950/20',
                          isActive && 'border-amber-300 bg-amber-50/40 dark:border-amber-900 dark:bg-amber-950/30 ring-1 ring-amber-300/80',
                          isUpcoming && 'border-border/60 bg-card/60 opacity-90'
                        )}
                      >
                        {/* Milestone Top Line: Code & Role */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-[10.5px] font-bold text-muted-foreground">{m.code}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-muted text-muted-foreground tracking-wider border">
                            {m.role} PHỤ TRÁCH
                          </span>
                        </div>

                        {/* Milestone Title & Description */}
                        <div className="space-y-0.5">
                          <div className="font-bold text-foreground text-xs leading-snug">{m.name}</div>
                          <div className="text-[11px] text-muted-foreground leading-relaxed">{m.sub}</div>
                        </div>

                        {/* Milestone Footer: Date & Status */}
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-muted-foreground">{m.date}</span>
                          {isCompleted && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                              ✓ Hoàn thành
                            </span>
                          )}
                          {isActive && (
                            <span
                              className={cn(
                                'font-bold px-2 py-0.5 rounded-full',
                                m.isOverdue
                                  ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 animate-pulse'
                                  : 'text-amber-700 bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300'
                              )}
                            >
                              {m.isOverdue ? '🚨 Quá hạn' : '📌 Đang xử lý'}
                            </span>
                          )}
                          {isUpcoming && <span className="text-muted-foreground italic font-sans">Sắp tới</span>}
                        </div>
                      </div>
                    </HoverCardTrigger>

                    {/* HOVER SPEECH BUBBLE OVERLAY (Bong bóng thông tin lịch sử chăm sóc) */}
                    <HoverCardContent
                      side="right"
                      align="start"
                      sideOffset={10}
                      className="w-[330px] sm:w-[370px] p-3.5 space-y-2.5 rounded-2xl border-sky-200 dark:border-sky-800 shadow-xl bg-background/95 backdrop-blur-md z-50 select-none text-left"
                    >
                      {/* Bubble Header */}
                      <div className="flex items-center justify-between border-b pb-2 gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono text-[10.5px] font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-1.5 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                            {m.code}
                          </span>
                          <span className="font-bold text-xs text-foreground truncate">{m.name}</span>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-extrabold uppercase shrink-0">
                          {m.role} PHỤ TRÁCH
                        </Badge>
                      </div>

                      {/* Bubble Body: Care History matched 100% from Vertical Card */}
                      {historyLog ? (
                        <div className="space-y-2.5 text-xs">
                          {/* Staff & Channel Header */}
                          <div className="flex items-center justify-between flex-wrap gap-1.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  'px-2 py-0.5 rounded-full text-[10px] font-bold border',
                                  isTeacher
                                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300'
                                    : 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300'
                                )}
                              >
                                {isTeacher ? 'GV' : 'CS'}
                              </span>
                              <span className="font-bold text-foreground text-xs">{historyLog.staffName}</span>
                              <span className="text-muted-foreground text-xs font-normal">
                                • {historyLog.channel}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-muted-foreground">{historyLog.date}</span>
                          </div>

                          {/* Inner Card Container matching Dạng Dọc card */}
                          <div className="rounded-xl border border-border bg-background p-3 space-y-2 text-xs shadow-2xs">
                            {/* Care Tag & Appointment Badge */}
                            <div className="flex items-center justify-between gap-1.5 flex-wrap">
                              <CareTagHoverCard
                                code={isTeacher ? 'HT-01' : 'CC-01'}
                                label={
                                  isTeacher
                                    ? 'HT-01 : Điểm kiểm tra dưới chuẩn'
                                    : 'CC-01 : Nghỉ 2 buổi liên tiếp'
                                }
                                description={
                                  isTeacher
                                    ? 'Điểm kiểm tra định kỳ thấp hơn mức chuẩn 6.0'
                                    : 'Học viên nghỉ học 2 buổi liên tiếp không xin phép'
                                }
                              />
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300">
                                📅 Hẹn gọi lại: {historyLog.date.split(' ')[0]} 14:00
                              </span>
                            </div>

                            {/* Audio Player */}
                            <div className="pt-0.5">
                              <AudioPlayButton duration="02:45" />
                            </div>

                            {/* Main Care Note */}
                            <p className="text-xs text-foreground/90 font-normal leading-relaxed">
                              {historyLog.note}
                            </p>

                            {/* Parent Feedback Quote */}
                            {historyLog.quote && (
                              <p className="text-xs italic font-medium text-emerald-700 dark:text-emerald-400 leading-relaxed">
                                {historyLog.quote}
                              </p>
                            )}

                            {/* Missed Call History if any */}
                            {historyLog.hasMissedCalls && (
                              <div className="pt-1.5 border-t border-border/50 space-y-1">
                                <div className="p-1.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 space-y-1">
                                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                    <span className="font-semibold text-foreground text-xs">
                                      • {historyLog.date.split(' ')[0]} 09:15: Gọi KNM (Không nghe máy)
                                    </span>
                                    <span className="text-[9.5px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded border border-sky-200/60 dark:border-sky-800 shrink-0">
                                      📅 Hẹn gọi lại: {historyLog.date.split(' ')[0]} 14:00
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-muted-foreground/90 italic pl-3 leading-relaxed w-full">
                                    * Ghi chú: Chuông reo 5 tiếng phụ huynh không nghe máy
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Upcoming Milestone Info */
                        <div className="space-y-1.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">Phụ trách:</span>
                            <span>{m.role === 'CS' ? 'Lê Thị Lan (Chuyên viên CS)' : 'Hoàng Thị Mai (Giáo viên)'}</span>
                          </div>
                          <p className="text-xs font-mono">{m.date} &bull; {m.sub}</p>
                          <p className="text-[11px] italic text-muted-foreground/80 pt-1.5 border-t border-border/50">
                            • Mốc tương lai - Chưa thực hiện chăm sóc
                          </p>
                        </div>
                      )}
                    </HoverCardContent>
                  </HoverCard>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
