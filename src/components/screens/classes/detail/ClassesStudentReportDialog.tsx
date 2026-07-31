'use client'

import React, { useMemo, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Star,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  Sparkles,
  Eye,
  Check,
  ExternalLink,
} from 'lucide-react'
import type { RosterStudent } from './classesDetailTypes'
import { cn } from '@/lib/utils'
import { getAvatarColor, getInitials, stableHash } from './classesSessionDetailHelpers'
import { SegmentedControl, type SegmentedControlOption } from '@/components/controls'
import { toast } from 'sonner'
import { ClassesStudentReportOverviewTab } from './ClassesStudentReportOverviewTab'

interface ClassesStudentReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: RosterStudent | null
}

// ── Types ───────────────────────────────────────────────────────────────

interface SessionHistory {
  id: string
  sessionNumber: number
  date: string
  topic: string
  type: 'lesson' | 'test'
  attendance: 'present' | 'absent' | 'late' | 'excused'
  homework: 'submitted' | 'not_submitted' | 'late'
  rating: number
  score: number | null
  comment: string | null
}

interface TeacherComment {
  id: string
  date: string
  author: string
  text: string
  type: 'general' | 'session' | 'test'
}

interface Attachment {
  id: string
  name: string
  type: 'pdf' | 'image' | 'doc' | 'link'
  date: string
  size: string
  score?: number
}

interface FeaturedMemory {
  id: string
  title: string
  timeText: string
  gradient: string
  description: string
}

interface PhotoGroup {
  dateText: string
  photos: Array<{
    id: string
    title: string
    timeText: string
    gradient: string
    span?: string
  }>
}

type TabId = 'overview' | 'journey' | 'history' | 'comments' | 'attachments'

const TAB_OPTIONS: SegmentedControlOption<TabId>[] = [
  { value: 'overview', label: 'Tổng quan' },
  { value: 'journey', label: 'Hành trình' },
  { value: 'history', label: 'Lịch sử buổi học' },
  { value: 'comments', label: 'Nhận xét' },
  { value: 'attachments', label: 'Tài liệu' },
]

function getDayOfWeek(dateStr: string): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return days[d.getDay()]
}

// ── Mock data generators ────────────────────────────────────────────────

const TOPICS = [
  'Grammar Structures in Writing', 'Listening Comprehension - Part 1',
  'Reading Strategies: Skimming & Scanning', 'Speaking Practice: Daily Topics',
  'Vocabulary: Academic Word List', 'Writing Task 2: Opinion Essay',
  'Pronunciation & Intonation', 'Reading: True/False/Not Given',
  'Midterm Test', 'Grammar Review & Practice',
  'Speaking: Describe a Place', 'Final Test',
]

const COMMENTS_POOL = [
  'Học tập chăm chỉ, phát biểu tích cực trong lớp.',
  'Cần cải thiện phần phát âm, đặc biệt nguyên âm dài.',
  'Tiến bộ rõ rệt so với tháng trước, đặc biệt kỹ năng viết.',
  'Hoàn thành bài tập đầy đủ nhưng cần chú ý lỗi ngữ pháp.',
  'Tương tác tốt với bạn cùng nhóm, có khả năng dẫn dắt.',
  'Cần tập trung hơn trong giờ học, hay mất tập trung.',
  'Kỹ năng nghe tốt, cần luyện thêm phần nói.',
  'Năng lực tốt, nên thử thách với bài tập nâng cao.',
]

function generateSessionHistory(studentId: string): SessionHistory[] {
  return Array.from({ length: 12 }, (_, i) => {
    const h = stableHash(studentId + String(i))
    const isTest = i === 8 || i === 11
    const att: SessionHistory['attendance'][] = ['present', 'present', 'present', 'late', 'absent', 'excused', 'present', 'present', 'present', 'present']
    const hwOptions: SessionHistory['homework'][] = ['submitted', 'submitted', 'submitted', 'late', 'not_submitted']
    return {
      id: `sh-${i}`, sessionNumber: i + 1,
      date: `2026-${String(Math.floor(i / 4) + 4).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      topic: TOPICS[i % TOPICS.length],
      type: isTest ? 'test' as const : 'lesson' as const,
      attendance: att[h % att.length],
      homework: hwOptions[h % hwOptions.length],
      rating: Math.min(5, Math.max(1, 3 + (h % 3))),
      score: isTest ? parseFloat((5.0 + (h % 40) / 10).toFixed(1)) : (h % 3 === 0 ? parseFloat((5.0 + (h % 50) / 10).toFixed(1)) : null),
      comment: h % 3 === 0 ? COMMENTS_POOL[h % COMMENTS_POOL.length] : null,
    }
  })
}

function generateComments(studentId: string): TeacherComment[] {
  const hash = stableHash(studentId)
  return Array.from({ length: 3 + (hash % 4) }, (_, i) => {
    const h = stableHash(studentId + 'cmt' + String(i))
    const types: TeacherComment['type'][] = ['general', 'session', 'test']
    return {
      id: `cmt-${i}`,
      date: `2026-${String(Math.floor(i / 2) + 4).padStart(2, '0')}-${String((i * 7 % 28) + 1).padStart(2, '0')}`,
      author: i % 2 === 0 ? 'Cô Lan (GV chính)' : 'Thầy Minh (GV phụ trách)',
      text: COMMENTS_POOL[h % COMMENTS_POOL.length],
      type: types[h % types.length],
    }
  })
}

function generateAttachments(studentId: string): Attachment[] {
  const hash = stableHash(studentId)
  const items: Attachment[] = [
    { id: 'a1', name: 'Bài kiểm tra giữa kỳ.pdf', type: 'pdf', date: '2026-05-15', size: '1.2 MB', score: parseFloat((7.0 + (hash % 20) / 10).toFixed(1)) },
    { id: 'a2', name: 'Bài viết Essay - Task 2.doc', type: 'doc', date: '2026-05-20', size: '540 KB' },
    { id: 'a3', name: 'Ảnh làm bài Speaking thực tế.png', type: 'image', date: '2026-06-01', size: '320 KB' },
    { id: 'a4', name: 'Link bài kiểm tra trực tuyến - Reading & Listening (Đã hoàn thành)', type: 'link', date: '2026-06-15', size: 'Online Test Portal', score: parseFloat((7.5 + (hash % 18) / 10).toFixed(1)) },
    { id: 'a5', name: 'Bài kiểm tra cuối kỳ.pdf', type: 'pdf', date: '2026-06-20', size: '1.5 MB', score: parseFloat((8.0 + (hash % 15) / 10).toFixed(1)) },
    { id: 'a6', name: 'Phiếu đánh giá phụ huynh.pdf', type: 'pdf', date: '2026-06-25', size: '280 KB' },
  ]
  return items.slice(0, 3 + (hash % 4))
}

function generateFeaturedMemories(studentId: string): FeaturedMemory[] {
  const hash = stableHash(studentId)
  return [
    {
      id: 'fm-1',
      title: 'Khởi đầu hành trình ✨',
      timeText: '3 tháng trước',
      gradient: 'from-indigo-500 via-purple-500 to-pink-500',
      description: 'Gia nhập lớp học mới với 100% tinh thần nhiệt huyết học tập.',
    },
    {
      id: 'fm-2',
      title: 'Bứt phá điểm kiểm tra 🏆',
      timeText: '1 tháng trước',
      gradient: 'from-amber-400 via-orange-500 to-rose-500',
      description: `Đạt điểm số xuất sắc ${parseFloat((7.5 + (hash % 15) / 10).toFixed(1))} ở bài Midterm.`,
    },
    {
      id: 'fm-3',
      title: 'Ngôi sao chuyên cần 🔥',
      timeText: '2 tuần trước',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      description: 'Đạt chuỗi chuyên cần tuyệt đối trong tháng, đi học đầy đủ đúng giờ.',
    },
    {
      id: 'fm-4',
      title: 'Hoạt động nhóm tích cực 💬',
      timeText: '3 ngày trước',
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      description: 'Dẫn dắt cả đội thảo luận chủ đề Speaking thuyết phục giáo viên.',
    },
  ]
}

function generatePhotoGroups(): PhotoGroup[] {
  return [
    {
      dateText: 'Thứ Năm, 25 Tháng 6, 2026',
      photos: [
        { id: 'ph-1', title: 'Hoạt động Speaking nhóm', timeText: '18:15', gradient: 'from-sky-400/90 to-blue-600/90', span: 'col-span-2' },
        { id: 'ph-2', title: 'Mindmap chủ đề Essay Task 2', timeText: '19:00', gradient: 'from-violet-400/90 to-indigo-600/90' },
        { id: 'ph-3', title: 'Sửa lỗi Writing trực tiếp trên bảng', timeText: '19:20', gradient: 'from-rose-400/90 to-pink-600/90' },
      ],
    },
    {
      dateText: 'Thứ Ba, 22 Tháng 6, 2026',
      photos: [
        { id: 'ph-4', title: 'Bài tập từ vựng chuẩn Vocabulary', timeText: '18:30', gradient: 'from-emerald-400/90 to-teal-600/90' },
        { id: 'ph-5', title: 'Whiteboard: Công thức Grammar nâng cao', timeText: '18:45', gradient: 'from-amber-400/90 to-orange-600/90', span: 'col-span-2' },
      ],
    },
  ]
}

// ── Attendance & Rating Helpers ──────────────────────────────────────────

function AttendanceIcon({ status }: { status: SessionHistory['attendance'] }) {
  switch (status) {
    case 'present': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
    case 'absent': return <XCircle className="h-3.5 w-3.5 text-red-500" />
    case 'late': return <Clock className="h-3.5 w-3.5 text-amber-500" />
    case 'excused': return <AlertCircle className="h-3.5 w-3.5 text-sky-500" />
  }
}

function AttendanceLabel({ status }: { status: SessionHistory['attendance'] }) {
  const map = { present: 'Có mặt', absent: 'Vắng', late: 'Muộn', excused: 'Có phép' }
  return <span className="text-[10px] text-muted-foreground">{map[status]}</span>
}

function FileTypeIcon({ type }: { type: Attachment['type'] }) {
  switch (type) {
    case 'pdf': return <FileText className="h-4 w-4 text-red-500" />
    case 'image': return <ImageIcon className="h-4 w-4 text-sky-500" />
    case 'link': return <Eye className="h-4 w-4 text-emerald-500" />
    default: return <FileText className="h-4 w-4 text-blue-500" />
  }
}

// ── Main Component ──────────────────────────────────────────────────────

export function ClassesStudentReportDialog({ open, onOpenChange, student }: ClassesStudentReportDialogProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const data = useMemo(() => {
    if (!student) return null
    const hash = stableHash(student.id)
    const sessions = generateSessionHistory(student.id)
    const comments = generateComments(student.id)
    const attachments = generateAttachments(student.id)
    const featuredMemories = generateFeaturedMemories(student.id)
    const photoGroups = generatePhotoGroups()

    const totalSessions = sessions.length
    const attended = sessions.filter(s => s.attendance === 'present' || s.attendance === 'late').length
    const attendanceRate = Math.round((attended / totalSessions) * 100)

    const scores = sessions.filter(s => s.score !== null).map(s => s.score!)
    const avgScore = scores.length > 0 ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0
    const highScore = scores.length > 0 ? Math.max(...scores) : 0
    const lowScore = scores.length > 0 ? Math.min(...scores) : 0

    const avgRating = parseFloat((3.0 + (hash % 20) / 10).toFixed(1))
    const reviewCount = 5 + (hash % 12)

    const LEVELS = ['Pre-A1', 'A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'B2']
    const level = LEVELS[Math.min(LEVELS.length - 1, Math.floor(avgScore / 1.2))]
    const trends = ['up', 'stable', 'down'] as const
    const trend = trends[hash % 3]

    return {
      sessions, comments, attachments, featuredMemories, photoGroups,
      totalSessions, attended, attendanceRate,
      avgScore, highScore, lowScore, avgRating, reviewCount, level, trend
    }
  }, [student])

  if (!student || !data) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1100px] w-[95vw] h-[85vh] flex flex-col p-0 gap-0">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-start gap-4">
            <div className={cn("h-14 w-14 rounded-full flex items-center justify-center text-base font-bold shrink-0", getAvatarColor(student.id))}>
              {getInitials(student.name)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-bold leading-tight">{student.name}</DialogTitle>
              <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                <span className="text-[11px] text-muted-foreground font-mono font-medium">{student.code}</span>
                <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/30 text-primary font-bold">{data.level}</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold">{data.avgRating}</span>
                  <span className="text-[11px] text-muted-foreground">({data.reviewCount} lượt đánh giá)</span>
                </div>
              </div>
            </div>
            {/* Expanded stats panel in header */}
            <div className="flex gap-4 shrink-0 bg-zinc-50 dark:bg-zinc-800/40 p-2 rounded-xl border border-zinc-100 dark:border-zinc-800/80 px-4">
              <HeaderStat label="Chuyên cần" value={`${data.attendanceRate}%`} sub={`${data.attended}/${data.totalSessions} buổi`} color={data.attendanceRate >= 90 ? 'emerald' : data.attendanceRate >= 80 ? 'amber' : 'red'} />
              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700 self-center" />
              <HeaderStat label="Điểm TB học bạ" value={String(data.avgScore)} sub={`Min ${data.lowScore} – Max ${data.highScore}`} color={data.avgScore >= 7.0 ? 'emerald' : data.avgScore >= 5.5 ? 'amber' : 'red'} />
              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700 self-center" />
              <HeaderStat label="Tiến trình học tập" value={data.trend === 'up' ? 'Tiến bộ' : data.trend === 'down' ? 'Cần cải thiện' : 'Ổn định'} color={data.trend === 'up' ? 'emerald' : data.trend === 'down' ? 'red' : 'zinc'} />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-4">
            <SegmentedControl
              value={activeTab}
              options={TAB_OPTIONS}
              onValueChange={setActiveTab}
              className="bg-transparent p-0 gap-1.5"
              itemClassName="h-8 px-3.5 text-[11px] font-semibold border border-transparent [&.bg-background]:border-primary [&.bg-background]:bg-primary [&.bg-background]:text-primary-foreground shadow-none"
            />
          </div>
        </DialogHeader>

        {/* ── Tab Content ── */}
        <div className="flex-1 overflow-y-auto min-h-0 px-6 py-4 bg-zinc-50/20 dark:bg-zinc-950/10">
          {activeTab === 'overview' && <ClassesStudentReportOverviewTab studentId={student.id} />}
          {activeTab === 'journey' && <JourneyTab featured={data.featuredMemories} groups={data.photoGroups} />}
          {activeTab === 'history' && <HistoryTab sessions={data.sessions} />}
          {activeTab === 'comments' && <CommentsTab comments={data.comments} />}
          {activeTab === 'attachments' && <AttachmentsTab attachments={data.attachments} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Stat Mini Helper ────────────────────────────────────────────────────

function HeaderStat({ label, value, sub, color }: { label: string; value: string; sub?: string; color: 'emerald' | 'amber' | 'red' | 'zinc' }) {
  const c = {
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400',
    red: 'text-red-600 dark:text-red-400',
    zinc: 'text-zinc-500 dark:text-zinc-400',
  }
  return (
    <div className="text-left">
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
      <p className={cn("text-sm font-extrabold leading-tight", c[color])}>{value}</p>
      {sub && <p className="text-[9px] text-muted-foreground font-mono leading-none mt-0.5">{sub}</p>}
    </div>
  )
}

// ── Tab: Google Photos-style Journey ─────────────────────────────────────



function JourneyTab({ featured, groups }: { featured: FeaturedMemory[]; groups: PhotoGroup[] }) {
  return (
    <div className="space-y-6">
      {/* 1. Featured Memories Section (Kỷ niệm nổi bật) */}
      <div>
        <h3 className="text-xs font-bold text-foreground mb-2.5 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Kỷ niệm nổi bật
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {featured.map((mem) => (
            <div
              key={mem.id}
              className={cn(
                "w-72 h-40 flex-shrink-0 rounded-xl overflow-hidden relative p-4 flex flex-col justify-end shadow-sm group cursor-pointer border border-zinc-100 dark:border-zinc-800 bg-gradient-to-br",
                mem.gradient
              )}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Text Content */}
              <div className="relative z-10 text-white">
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">{mem.timeText}</span>
                <h4 className="text-xs font-extrabold leading-snug mt-0.5">{mem.title}</h4>
                <p className="text-[10px] opacity-90 leading-tight mt-1 line-clamp-2">{mem.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Photo Stream Grouped by Date (Hoạt động học tập) */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-foreground mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-primary" />
          Hình ảnh học tập & hoạt động
        </h3>

        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <span className="text-xs font-semibold text-foreground tracking-tight">{group.dateText}</span>
            <div className="grid grid-cols-3 gap-3">
              {group.photos.map((photo) => (
                <div
                  key={photo.id}
                  className={cn(
                    "aspect-video rounded-xl overflow-hidden relative shadow-sm border border-zinc-100 dark:border-zinc-800 bg-gradient-to-tr cursor-pointer group flex items-end p-3",
                    photo.gradient,
                    photo.span || ""
                  )}
                >
                  {/* Photo Overlay */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-90" />

                  {/* Top Bar inside Photo */}
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-6 w-6 p-0 rounded-full bg-white/20 hover:bg-white/40 text-white border-none shadow-xs"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Time indicator */}
                  <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-white/80 z-10">
                    {photo.timeText}
                  </div>

                  {/* Photo details */}
                  <div className="relative z-10 text-white min-w-0">
                    <p className="text-[11px] font-extrabold leading-snug truncate">{photo.title}</p>
                    <span className="text-[9px] text-white/70 block mt-0.5">Hoạt động lớp học</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Lịch sử học tập (Detailed tab) ──────────────────────────────────

function HistoryTab({ sessions }: { sessions: SessionHistory[] }) {
  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm flex flex-col">
      <table className="w-full text-[11px] border-collapse">
        <thead className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th className="py-2.5 px-3 text-left font-bold text-zinc-500 dark:text-zinc-400 w-[40px]">#</th>
            <th className="py-2.5 px-3 text-left font-bold text-zinc-500 dark:text-zinc-400">Bài học & Thời gian</th>
            <th className="py-2.5 px-3 text-center font-bold text-zinc-500 dark:text-zinc-400 w-[100px]">Điểm danh</th>
            <th className="py-2.5 px-3 text-center font-bold text-zinc-500 dark:text-zinc-400 w-[90px]">Bài tập</th>
            <th className="py-2.5 px-3 text-left font-bold text-zinc-500 dark:text-zinc-400 w-[300px]">Đánh giá & Nhận xét</th>
            <th className="py-2.5 px-3 text-center font-bold text-zinc-500 dark:text-zinc-400 w-[90px]">Điểm số</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {sessions.map((s) => (
            <tr
              key={s.id}
              className={cn(
                "hover:bg-zinc-50/60 dark:hover:bg-zinc-800/20 transition-colors",
                s.type === 'test' && "bg-amber-50/40 dark:bg-amber-950/10"
              )}
            >
              {/* Session # */}
              <td className="py-2.5 px-3 font-mono text-muted-foreground font-semibold">{s.sessionNumber}</td>

              {/* Lesson Title & Date */}
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {s.type === 'test' && (
                    <Badge className="text-[9px] px-1 py-0 bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200/50 font-bold shrink-0">
                      KIỂM TRA
                    </Badge>
                  )}
                  <span className="font-semibold text-foreground">{s.topic}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5 font-medium">
                  <span>{getDayOfWeek(s.date)}, {s.date}</span>
                </div>
              </td>

              {/* Attendance */}
              <td className="py-2.5 px-3">
                <div className="flex items-center justify-center gap-1.5">
                  <AttendanceIcon status={s.attendance} />
                  <AttendanceLabel status={s.attendance} />
                </div>
              </td>

              {/* Homework Status */}
              <td className="py-2.5 px-3 text-center">
                {s.homework === 'submitted' ? (
                  <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/60 font-semibold gap-0.5 px-1 py-0">
                    <Check className="h-2.5 w-2.5 shrink-0" /> Đã nộp
                  </Badge>
                ) : s.homework === 'late' ? (
                  <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/60 font-semibold gap-0.5 px-1 py-0">
                    Nộp muộn
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/60 font-semibold gap-0.5 px-1 py-0">
                    Chưa nộp
                  </Badge>
                )}
              </td>

              {/* Rating stars & comment directly below */}
              <td className="py-2.5 px-3">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                    <span className="font-bold text-foreground">{s.rating}</span>
                    <span className="text-[10px] text-muted-foreground">/5</span>
                  </div>
                  {s.comment ? (
                    <p className="text-[10px] text-muted-foreground leading-snug italic font-medium">
                      &ldquo;{s.comment}&rdquo;
                    </p>
                  ) : (
                    <p className="text-[10px] text-zinc-300 dark:text-zinc-600 italic">
                      Chưa có nhận xét
                    </p>
                  )}
                </div>
              </td>

              {/* Score & link to test history */}
              <td className="py-2.5 px-3 text-center">
                <div className="flex flex-col items-center gap-1">
                  {s.score !== null ? (
                    <Badge className={cn(
                      "font-mono font-extrabold text-[10px] px-1.5 py-0",
                      s.score >= 7.0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200" :
                      s.score >= 5.5 ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200" :
                      "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200"
                    )}>
                      {s.score}
                    </Badge>
                  ) : (
                    <span className="text-zinc-300 dark:text-zinc-600">—</span>
                  )}
                  {s.type === 'test' && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-[9px] font-bold text-primary flex items-center gap-0.5 hover:underline"
                      onClick={() => toast.info(`Đang mở báo cáo chi tiết bài kiểm tra: ${s.topic}`)}
                    >
                      Chi tiết <ExternalLink className="h-2 w-2" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Tab: Nhận xét ───────────────────────────────────────────────────────

function CommentsTab({ comments }: { comments: TeacherComment[] }) {
  return (
    <div className="space-y-1">
      {comments.map((c) => (
        <div key={c.id} className="flex gap-3 px-4 py-3 bg-transparent border-none hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors rounded-xl">
          <div className="shrink-0 mt-0.5">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
              {getInitials(c.author)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-foreground">{c.author}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{c.date}</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize">
                {c.type === 'general' ? 'Tổng quan' : c.type === 'test' ? 'Kiểm tra' : 'Buổi học'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{c.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Tab: Tài liệu ──────────────────────────────────────────────────────

function AttachmentsTab({ attachments }: { attachments: Attachment[] }) {
  return (
    <div className="space-y-1">
      {attachments.map((a) => (
        <div key={a.id} className="flex items-center gap-3 px-4 py-2.5 bg-transparent border-none hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors rounded-xl">
          <div className="h-10 w-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
            <FileTypeIcon type={a.type} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold text-foreground truncate">{a.name}</p>
              {a.score !== undefined && (
                <Badge className="font-mono font-extrabold text-[9px] px-1 py-0 bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 shrink-0">
                  {a.score} Điểm
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">{a.date} · {a.size}</span>
          </div>
          {a.type === 'link' ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text.5 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 shrink-0 gap-1 rounded-lg"
              onClick={() => toast.info(`Đang chuyển hướng tới cổng làm bài trực tuyến...`)}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Xem bài làm
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0 text-muted-foreground hover:text-primary rounded-full animate-none"
              onClick={() => toast.success(`Đang tải xuống tài liệu: ${a.name}`)}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
