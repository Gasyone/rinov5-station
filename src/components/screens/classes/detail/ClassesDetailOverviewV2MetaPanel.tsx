'use client'

import { useMemo } from 'react'
import {
  ArrowRight,
  BookOpen,
  Clock,
  Copy,
  ExternalLink,
  FolderOpen,
  History,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { ClassRecord } from '@/mocks/classRecords'
import type { ClassAuditLog } from './classesDetailTypes'

export interface WeeklyScheduleSlot {
  dayOfWeek: string
  startTime: string
  endTime: string
  teacherName: string
  assistantName: string
}

export interface ClassesDetailOverviewV2MetaPanelProps {
  cls: ClassRecord
  logs: ClassAuditLog[]
  weeklySlots: WeeklyScheduleSlot[]
  onRescheduleClick: () => void
  onOpenTeacherHistory: () => void
  onNavigateToSubject: (subject: 'students' | 'sessions' | 'media' | 'logs') => void
}

export function ClassesDetailOverviewV2MetaPanel({
  cls,
  logs,
  weeklySlots,
  onRescheduleClick,
  onOpenTeacherHistory,
  onNavigateToSubject,
}: ClassesDetailOverviewV2MetaPanelProps) {
  // Mock media counts & previews
  const mediaCount = 18
  const previewMedia = [
    {
      id: 'm1',
      title: 'Hoạt động nhóm Writing Task 2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'm2',
      title: 'Slide bài giảng Unit 6',
      type: 'slide',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 'm3',
      title: 'Video thực hành phát âm',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&auto=format&fit=crop&q=80',
    },
  ]

  const isMath = useMemo(
    () =>
      Boolean(
        cls.level?.toLowerCase().includes('toán') ||
          cls.level?.toLowerCase().includes('math') ||
          cls.name?.toLowerCase().includes('toán') ||
          cls.name?.toLowerCase().includes('math')
      ),
    [cls.level, cls.name]
  )

  const formatShortDate = (dateStr?: string) => {
    if (!dateStr || dateStr === '---') return '01/05/2026'
    try {
      const d = new Date(dateStr)
      if (isNaN(d.getTime())) return dateStr
      return d.toLocaleDateString('vi-VN')
    } catch {
      return dateStr
    }
  }

  const getRoomSlot = (roomName?: string, maxStudents?: number) => {
    if (!roomName) return '15 slot'
    if (roomName.includes('101') || roomName.includes('A101')) return '15 slot'
    if (roomName.includes('102') || roomName.includes('B201')) return '12 slot'
    if (roomName.includes('201') || roomName.includes('C301')) return '20 slot'
    if (roomName.includes('401') || roomName.includes('D401')) return '10 slot'
    if (roomName.includes('301')) return '25 slot'
    return `${maxStudents || 15} slot`
  }

  return (
    <div className="lg:col-span-4 flex flex-col space-y-2.5">
      {/* SUBJECT 3: THÔNG TIN LỚP & LỊCH HỌC */}
      <section className="rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs hover:border-border transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <h3 className="text-xs font-normal text-foreground">Thông tin & Lịch học</h3>
            </div>
          </div>

          <Button
            variant="ghost"
            size="xs"
            onClick={onRescheduleClick}
            className="h-6 px-1.5 text-[11px] text-primary hover:bg-primary/5"
          >
            Đổi lịch
          </Button>
        </div>

        {/* Class Metadata: Compact 2-column grid without Tuition or Class Size */}
        <div className="mt-2 grid grid-cols-2 gap-x-2.5 gap-y-1.5 text-xs">
          {/* Item 1: Mã lớp */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Mã lớp</span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-[11px] font-mono font-semibold text-foreground truncate">{cls.code}</span>
              <button
                type="button"
                onClick={() => {
                  if (cls.code) {
                    navigator.clipboard.writeText(cls.code)
                    toast.success(`Đã sao chép: ${cls.code}`)
                  }
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                title="Sao chép mã lớp"
              >
                <Copy className="h-2.5 w-2.5" />
              </button>
            </div>
          </div>

          {/* Item 2: Cơ sở */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Cơ sở</span>
            <span className="text-[11px] font-medium text-foreground block truncate" title={cls.branch}>
              {cls.branch}
            </span>
          </div>

          {/* Item 3: Phòng học & Slot */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Phòng học</span>
            <span className="text-[11px] font-semibold text-foreground block truncate">
              {cls.room || 'A101'}{' '}
              <span className="text-[10.5px] font-normal text-muted-foreground">
                ({getRoomSlot(cls.room, cls.maxStudents)})
              </span>
            </span>
          </div>

          {/* Item 4: Trình độ */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Trình độ</span>
            <span className="text-[11px] font-semibold text-foreground block truncate">
              {cls.level || 'IELTS'} {cls.subLevel ? `(${cls.subLevel})` : ''}
            </span>
          </div>

          {/* Item 5: Khung chương trình */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Chương trình</span>
            <span
              className="text-[11px] font-medium text-sky-600 dark:text-sky-400 block truncate"
              title={cls.syllabus || cls.learningPath || 'IELTS Junior'}
            >
              {cls.syllabus || cls.learningPath || 'IELTS Junior v2.1'}
            </span>
          </div>

          {/* Item 6: Môn học */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Môn học</span>
            <span className="text-[11px] font-normal text-foreground block truncate">
              {isMath ? 'Môn Toán' : 'Tiếng Anh'}
            </span>
          </div>

          {/* Item 7: Quy mô */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Quy mô</span>
            <span className="text-[11px] font-normal text-foreground block truncate">
              {cls.classRatio || '1:7'}
            </span>
          </div>

          {/* Item 8: Loại GV */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Loại giáo viên</span>
            <span className="text-[11px] font-normal text-foreground block truncate">
              {cls.teacherType || 'Việt Nam'}
            </span>
          </div>

          {/* Item 9: Thời gian khóa */}
          <div className="col-span-2 min-w-0 space-y-0.5">
            <span className="text-[10px] text-muted-foreground block leading-none">Thời gian khóa</span>
            <span className="text-[11px] font-mono text-muted-foreground block truncate">
              {formatShortDate(cls.startDate)} – {formatShortDate(cls.endDate)}
            </span>
          </div>
        </div>

        {/* Weekly Schedule Mini Table */}
        <div className="mt-2.5 rounded-lg border border-border/50 bg-muted/20 p-2 space-y-1">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Lịch học trong tuần
            </span>
            <button
              type="button"
              onClick={onOpenTeacherHistory}
              className="inline-flex items-center gap-1 text-[10.5px] font-medium text-primary hover:underline cursor-pointer"
              title="Xem lịch sử phân công & thay đổi giáo viên"
            >
              <History className="h-3 w-3" />
              <span>Lịch sử đổi GV</span>
            </button>
          </div>

          {weeklySlots.map((slot, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-[11px] gap-1.5 py-0.5 border-b border-border/30 last:border-none"
            >
              <span className="font-semibold text-foreground shrink-0 text-[11px]">
                {slot.dayOfWeek} ({slot.startTime}–{slot.endTime})
              </span>
              <span className="text-muted-foreground truncate text-right text-[10.5px]">
                <span>
                  GV: <strong className="font-medium text-foreground">{slot.teacherName}</strong>
                </span>
                <span className="mx-1">•</span>
                <span>
                  TG: <strong className="font-medium text-foreground">{slot.assistantName}</strong>
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SUBJECT 4: TÀI LIỆU & MEDIA */}
      <section className="rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs hover:border-border transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-normal text-foreground">Tài liệu & Media</h3>
              <span className="rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 px-1.5 py-0.2 text-[10.5px] font-medium">
                {mediaCount}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToSubject('media')}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>Mở kho</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Media Thumbnails Grid */}
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {previewMedia.map((m) => (
            <div
              key={m.id}
              onClick={() => onNavigateToSubject('media')}
              className="group relative aspect-video rounded-md overflow-hidden border border-border/60 bg-muted/40 cursor-pointer"
            >
              <img
                src={m.url}
                alt={m.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ExternalLink className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1 text-[9.5px] text-white truncate">
                {m.title}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-between text-[10.5px] text-muted-foreground pt-0.5">
          <span className="truncate">12 Ảnh • 2 Video • 4 Slide</span>
          <button
            type="button"
            onClick={() => onNavigateToSubject('media')}
            className="font-semibold text-primary hover:underline cursor-pointer shrink-0 ml-1"
          >
            Xem toàn bộ kho media →
          </button>
        </div>
      </section>

      {/* SUBJECT 5: LỊCH SỬ CẬP NHẬT */}
      <section className="rounded-xl border border-border/70 bg-card p-2.5 shadow-2xs hover:border-border transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-normal text-foreground">Lịch sử cập nhật</h3>
              <span className="rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-400 px-1.5 py-0.2 text-[10.5px] font-medium">
                {logs.length}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToSubject('logs')}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Logs Recent 2 items */}
        <div className="mt-2 space-y-1.5">
          {logs.slice(0, 2).map((lg) => (
            <div key={lg.id} className="rounded-md bg-muted/30 border border-border/40 p-1.5 text-xs">
              <div className="flex items-center justify-between text-[10.5px] text-muted-foreground mb-0.5">
                <span className="font-semibold text-foreground">{lg.operator}</span>
                <span>{lg.timestamp}</span>
              </div>
              <div className="text-[11px] text-foreground line-clamp-2">{lg.action}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
