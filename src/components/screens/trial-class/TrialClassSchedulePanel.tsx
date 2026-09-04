'use client'

import * as React from 'react'
import {
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Calendar as CalendarIcon,
  GraduationCap,
  UserCheck,
  BookOpen,
  Info,
  ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
import { PersonnelHoverCard } from '@/components/shared'
import { ClassSessionHoverCard } from '../calendar/ClassSessionHoverCard'
import { ClassCodeHoverCell } from '../care/ClassCodeHoverCell'
import { MOCK_CLASS_OPTIONS } from './trialClassConstants'
import type { TrialSessionSelection } from './trialClassTypes'
import { cn } from '@/lib/utils'

interface TrialClassSchedulePanelProps {
  school?: string
  program: string
  selectedSessions: TrialSessionSelection[]
  onSelectSession: (session: TrialSessionSelection) => void
}

type DatePreset = '7days' | '14days' | '30days' | 'custom'

const BASE_DATE = new Date('2026-05-18')

const getDateRangeForPreset = (preset: DatePreset): DateRange => {
  const from = new Date(BASE_DATE)
  const to = new Date(BASE_DATE)
  if (preset === '7days') {
    to.setDate(from.getDate() + 7)
  } else if (preset === '14days') {
    to.setDate(from.getDate() + 14)
  } else if (preset === '30days') {
    to.setDate(from.getDate() + 30)
  }
  return { from, to }
}

const TEACHER_POOL = [
  'Ms. Sarah',
  'Mr. David',
  'Ms. Emily',
  'Thầy Hoàng',
  'Cô Thu Trang',
  'Mr. John',
  'Cô Thanh Mai',
  'Thầy Minh Quân',
]

const TA_POOL = [
  'Cô Lan Anh',
  'Thầy Đức',
  'Cô Thảo Linh',
  'Mr. Alex',
  'Cô Thu Hà',
  'Cô Phương Anh',
]

const ROOM_POOL = [
  'Phòng 201',
  'Phòng 102',
  'Phòng 301',
  'Phòng 204',
  'Phòng Lab 1',
  'Phòng STEAM 2',
]

const LESSON_TOPICS_BY_PROGRAM: Record<string, { topic: string; words: string; sentences: string; phonics: string }[]> = {
  'Cambridge Starter': [
    { topic: 'Unit 1: Hello & Colors', words: 'Red, Blue, Green, Yellow, Orange', sentences: 'Hello, what is your name? - My name is...', phonics: 'Letter /a/ as in Apple, Ant' },
    { topic: 'Unit 2: Family & Feelings', words: 'Mom, Dad, Brother, Sister, Happy, Sad', sentences: 'This is my mom. I am happy.', phonics: 'Letter /b/ as in Ball, Boy' },
    { topic: 'Unit 3: School & Animals', words: 'Dog, Cat, Bird, Book, Pencil, Desk', sentences: 'I have a red book. Look at the cat.', phonics: 'Letter /c/ as in Cat, Cup' },
    { topic: 'Unit 4: Numbers & Shapes', words: 'One, Two, Three, Circle, Square', sentences: 'How many circles? - Three circles.', phonics: 'Letter /d/ as in Duck, Dog' },
    { topic: 'Unit 5: Toys & Playground', words: 'Ball, Car, Doll, Robot, Slide, Swing', sentences: 'I like playing with my robot.', phonics: 'Letter /e/ as in Elephant, Egg' },
  ],
  'STEM Robotics': [
    { topic: 'Bài 1: Khám phá Động cơ & Bánh răng', words: 'Motor, Gear, Axle, Speed', sentences: 'How do gears transfer motion?', phonics: 'Thực hành lắp ráp mô hình quay' },
    { topic: 'Bài 2: Cảm biến khoảng cách & Đèn LED', words: 'Ultrasonic Sensor, Light, Loop', sentences: 'Programming robot to stop before obstacles.', phonics: 'Thử nghiệm cảm biến siêu âm' },
    { topic: 'Bài 3: Lập trình xe dò đường thông minh', words: 'Line follower, Logic, Algorithm', sentences: 'Robot follows the black track smoothly.', phonics: 'Thử thách đường đua tự động' },
  ],
  default: [
    { topic: 'Bài 1: Khởi động & Khám phá chủ đề', words: 'Vocabulary, Expression, Basic patterns', sentences: 'Daily conversation practice.', phonics: 'Phát âm chuẩn & tương tác tự tin' },
    { topic: 'Bài 2: Thực hành giao tiếp & Tương tác nhóm', words: 'Key vocabulary, Speaking phrases', sentences: 'Role-play in real classroom situations.', phonics: 'Thực hành phản xạ tương tác' },
    { topic: 'Bài 3: Ôn tập & Dự án trải nghiệm', words: 'Project vocab, Presentation words', sentences: 'Presentation and teamwork challenge.', phonics: 'Thực hành thuyết trình nhóm' },
  ]
}

const VIETNAMESE_WEEKDAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
]

interface GeneratedSession {
  id: string
  name: string
  date: string // "2026-05-19"
  time: string // "18:00"
  weekdayName: string // "Thứ Ba"
  formattedDate: string // "19/05/2026"
  teacher: string // "Ms. Sarah"
  assistantTeacher?: string // "Cô Lan Anh"
  room: string // "Phòng 201"
  lessonTopic: string // "Unit 1: Hello & Colors"
  lessonContent: {
    words?: string
    sentences?: string
    phonics?: string
  }
  attendees: number
  capacity: number
}

function generateSessionsForClass(
  cls: typeof MOCK_CLASS_OPTIONS[0],
  fromDateStr: string,
  toDateStr: string
): GeneratedSession[] {
  const sessions: GeneratedSession[] = []

  if (!fromDateStr) return []

  const fromDate = new Date(fromDateStr)
  fromDate.setHours(0, 0, 0, 0)

  const toDate = toDateStr ? new Date(toDateStr) : new Date(fromDate.getTime() + 18 * 24 * 60 * 60 * 1000)
  toDate.setHours(23, 59, 59, 999)

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return []

  // Parse schedule, e.g. "T3/T5/CN 18:00"
  const [daysPart, timePart] = cls.schedule.split(' ')
  const scheduleDays = daysPart.split('/') // ['T3', 'T5', 'CN']
  const defaultWeekdayTime = timePart || (cls.schedule.includes('19:15') ? '19:15' : '18:00')

  // Weekday mapping: Date.getDay() -> 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7
  const weekdayToAbbr = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const current = new Date(fromDate)

  // Chỉ sinh các buổi nằm trong khoảng thời gian đã chọn, và tối đa 5 buổi (có thể 1, 2, 3, 4 hoặc 5 buổi)
  while (current <= toDate && sessions.length < 5) {
    const dayOfWeek = current.getDay()
    const abbr = weekdayToAbbr[dayOfWeek]

    if (scheduleDays.includes(abbr)) {
      const year = current.getFullYear()
      const month = String(current.getMonth() + 1).padStart(2, '0')
      const datePart = String(current.getDate()).padStart(2, '0')
      const dateStr = `${year}-${month}-${datePart}`
      const formattedDate = `${datePart}/${month}/${year}`
      const weekdayName = VIETNAMESE_WEEKDAYS[dayOfWeek]
      const time = (dayOfWeek === 0 || dayOfWeek === 6) ? '09:00' : defaultWeekdayTime

      // Gán giáo viên theo buổi
      const charCode = cls.classId.charCodeAt(cls.classId.length - 1)
      const teacherIndex = (current.getDate() + dayOfWeek + charCode) % TEACHER_POOL.length
      const teacher = TEACHER_POOL[teacherIndex]

      // Gán trợ giảng (cho khoảng 65% các ca học)
      const hasTa = (current.getDate() + charCode) % 3 !== 0
      const taIndex = (current.getDate() + charCode * 2) % TA_POOL.length
      const assistantTeacher = hasTa ? TA_POOL[taIndex] : undefined

      // Gán phòng học
      const roomIndex = (charCode + current.getDate()) % ROOM_POOL.length
      const room = ROOM_POOL[roomIndex]

      const attendees = Math.floor(Math.random() * 4) + 6
      const capacity = 15
      const sessIndex = sessions.length + 1

      // Gán chủ đề & nội dung bài học
      const topicList = LESSON_TOPICS_BY_PROGRAM[cls.program] || LESSON_TOPICS_BY_PROGRAM['default']
      const topicItem = topicList[(sessIndex - 1) % topicList.length]

      sessions.push({
        id: `SESS-${cls.classId}-${datePart}${month}`,
        name: `Buổi ${sessIndex} (${cls.program})`,
        date: dateStr,
        time: time,
        weekdayName,
        formattedDate,
        teacher,
        assistantTeacher,
        room,
        lessonTopic: topicItem.topic,
        lessonContent: {
          words: topicItem.words,
          sentences: topicItem.sentences,
          phonics: topicItem.phonics,
        },
        attendees,
        capacity,
      })
    }

    current.setDate(current.getDate() + 1)
  }

  return sessions
}

const formatRangeDate = (date: Date) => {
  const d = String(date.getDate()).padStart(2, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const y = date.getFullYear()
  return `${d}/${m}/${y}`
}

const formatInputDate = (date?: Date) => {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function TrialClassSchedulePanel({
  school,
  program,
  selectedSessions,
  onSelectSession,
}: TrialClassSchedulePanelProps) {
  const isReadyToLoad = Boolean(school && program)

  const matchingClasses = React.useMemo(
    () => (isReadyToLoad ? MOCK_CLASS_OPTIONS.filter((c) => c.program === program) : []),
    [isReadyToLoad, program]
  )

  // Khoảng thời gian mặc định: 7 ngày tới
  const [datePreset, setDatePreset] = React.useState<DatePreset>('7days')
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() =>
    getDateRangeForPreset('7days')
  )
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() => dateRange?.from || new Date(BASE_DATE))
  const [isDatePopoverOpen, setIsDatePopoverOpen] = React.useState(false)

  const fromDate = formatInputDate(dateRange?.from)
  const toDate = formatInputDate(dateRange?.to)

  // Quản lý trạng thái mở rộng/thu gọn của từng lớp học dạng accordion
  const [expandedClassIds, setExpandedClassIds] = React.useState<string[]>(
    matchingClasses[0]?.classId ? [matchingClasses[0].classId] : []
  )
  const [prevKey, setPrevKey] = React.useState(`${school}_${program}`)

  // Quản lý trạng thái mở rộng xem nội dung bài học theo từng ca học
  const [expandedSessionIds, setExpandedSessionIds] = React.useState<string[]>([])

  const toggleSessionExpand = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedSessionIds((prev) =>
      prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]
    )
  }

  // Khi cơ sở hoặc chương trình thay đổi, cập nhật lớp mở rộng
  const currentKey = `${school}_${program}`
  if (prevKey !== currentKey) {
    setPrevKey(currentKey)
    setExpandedClassIds(matchingClasses[0]?.classId ? [matchingClasses[0].classId] : [])
  }

  const toggleClassExpand = (classId: string) => {
    setExpandedClassIds((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    )
  }

  return (
    <div className="flex flex-col space-y-3">
      {/* Header Toolbar phẳng nằm trực tiếp trên nền */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Lịch học & Ca học khả dụng
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {isReadyToLoad && (
            <>
              {/* Nút chọn nhanh: 7 ngày tới */}
              <Button
                type="button"
                size="sm"
                variant={datePreset === '7days' ? 'default' : 'outline'}
                onClick={() => {
                  setDatePreset('7days')
                  setDateRange(getDateRangeForPreset('7days'))
                }}
                className={cn(
                  "h-8 text-xs px-2.5 cursor-pointer font-medium",
                  datePreset === '7days' ? "bg-primary text-primary-foreground font-semibold shadow-2xs" : "bg-card text-foreground shadow-2xs"
                )}
              >
                7 ngày tới
              </Button>

              {/* Nút chọn nhanh: 14 ngày tới */}
              <Button
                type="button"
                size="sm"
                variant={datePreset === '14days' ? 'default' : 'outline'}
                onClick={() => {
                  setDatePreset('14days')
                  setDateRange(getDateRangeForPreset('14days'))
                }}
                className={cn(
                  "h-8 text-xs px-2.5 cursor-pointer font-medium",
                  datePreset === '14days' ? "bg-primary text-primary-foreground font-semibold shadow-2xs" : "bg-card text-foreground shadow-2xs"
                )}
              >
                14 ngày tới
              </Button>

              {/* Popover Calendar chọn khoảng ngày (Không có text 'Thời gian:') */}
              <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal h-8 text-xs px-2.5 bg-card shadow-2xs gap-1.5",
                      datePreset === 'custom' && "border-primary text-primary font-semibold ring-1 ring-primary/20"
                    )}
                  >
                    <CalendarIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                    <strong className="text-foreground font-medium">
                      {dateRange?.from ? formatRangeDate(dateRange.from) : ''} - {dateRange?.to ? formatRangeDate(dateRange.to) : ''}
                    </strong>
                    <ChevronDown className="h-3 w-3 opacity-60 ml-0.5 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 space-y-2 z-50 bg-popover rounded-xl shadow-xl border" align="end">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/50">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Chọn khoảng ngày
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date(BASE_DATE)
                        setCalendarMonth(today)
                        setDateRange({ from: today, to: today })
                        setDatePreset('custom')
                      }}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Hôm nay
                    </button>
                  </div>
                  <Calendar
                    mode="range"
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range)
                      setDatePreset('custom')
                    }}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>

      {/* Selected Session Notification */}
      {selectedSessions.length > 0 ? (
        <div className="rounded-xl border border-primary/40 bg-primary/5 px-4 py-2.5 text-xs text-primary font-medium flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
            <span>
              Đã chọn: <strong>{selectedSessions[0].className}</strong> &middot;{' '}
              <strong>{selectedSessions[0].sessionName}</strong> ({selectedSessions[0].trialDate})
              {selectedSessions[0].teacher && (
                <> &middot; <strong className="text-primary font-semibold">GV: {selectedSessions[0].teacher}</strong></>
              )}
              {selectedSessions[0].assistantTeacher && (
                <> &middot; <strong className="text-primary font-semibold">TG: {selectedSessions[0].assistantTeacher}</strong></>
              )}
              {selectedSessions[0].room && (
                <> &middot; <span>Phòng: {selectedSessions[0].room}</span></>
              )}
            </span>
          </div>
          <span
            className="text-xs opacity-80 cursor-pointer hover:underline shrink-0 ml-2"
            onClick={() => onSelectSession(selectedSessions[0])}
          >
            (Bấm lại để bỏ chọn)
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-4 py-2.5 text-xs text-muted-foreground bg-card shadow-2xs">
          Chưa chọn ca học cụ thể (Phiếu học thử sẽ được lưu ở trạng thái &quot;Chờ xác nhận&quot; để Giáo vụ xếp lớp sau).
        </div>
      )}

      {/* Flat List: Mỗi lớp học là 1 Section riêng biệt dạng thẻ trắng phẳng */}
      <div className="space-y-3">
        {!isReadyToLoad ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center text-muted-foreground bg-card shadow-2xs">
            <Clock className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm font-semibold text-foreground">
              {!school && !program
                ? 'Vui lòng chọn Cơ sở và Chương trình học ở bên trái'
                : !school
                ? 'Vui lòng chọn Cơ sở mong muốn học ở bên trái'
                : 'Vui lòng chọn Chương trình học ở bên trái'}
            </p>
            <p className="mt-1 text-xs opacity-70">
              Sau khi chọn đủ cơ sở và chương trình, danh sách lớp học và ca học khả dụng sẽ tự động hiển thị.
            </p>
          </div>
        ) : matchingClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center text-muted-foreground bg-card shadow-2xs">
            <p className="text-sm">Không tìm thấy lớp nào phù hợp với cơ sở và chương trình đã chọn.</p>
          </div>
        ) : (
          matchingClasses.map((cls) => {
            const isClassFull = cls.enrolledStudents >= cls.maxStudents
            const isExpanded = expandedClassIds.includes(cls.classId)
            const classSessions = isExpanded
              ? generateSessionsForClass(cls, fromDate, toDate)
              : []

            const selectedInThisClass = selectedSessions.find((s) => s.classId === cls.classId)

            return (
              <section
                key={cls.classId}
                className={cn(
                  "bg-card border rounded-xl shadow-2xs overflow-hidden transition-all",
                  isClassFull ? "border-border/60 opacity-80" : "border-border/90 hover:border-border",
                  isExpanded ? "ring-1 ring-primary/20" : ""
                )}
              >
                {/* Class Accordion Header - Giáo viên theo buổi, không để ở cấp lớp */}
                <button
                  type="button"
                  onClick={() => toggleClassExpand(cls.classId)}
                  className={cn(
                    "flex w-full items-center justify-between p-4 text-left transition-colors cursor-pointer",
                    isExpanded ? "bg-muted/15" : "hover:bg-muted/15"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="text-muted-foreground shrink-0">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      {/* Dòng 1: Tên lớp, Level, Đã chọn */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="font-bold text-sm truncate text-foreground">
                          {cls.className}
                        </h4>
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-xs border-amber-300/60 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold"
                        >
                          Level: {cls.className.split(' ').pop()}
                        </Badge>

                        {selectedInThisClass && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-xs bg-primary/15 text-primary font-semibold"
                          >
                            Đã chọn: {selectedInThisClass.sessionName}
                          </Badge>
                        )}
                      </div>

                      {/* Dòng 2: Mã lớp đặt trước lịch học, cùng dòng với lịch học */}
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        {/* Reusable ClassCodeHoverCell (mã lớp kèm hover card chuẩn của hệ thống) */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <ClassCodeHoverCell
                            classCode={cls.classId.toUpperCase()}
                            subject={cls.program}
                            level={cls.className.split(' ').pop() || 'A1'}
                            teacherCode="Ms. Sarah"
                            schedule={cls.schedule}
                            openInNewTab={true}
                          />
                        </div>
                        <span>&middot;</span>
                        <span>
                          Lịch học: <strong className="text-foreground font-medium">{cls.schedule.split(' ')[0].split('/').join(', ')}</strong> &middot; <span className="font-semibold text-primary">{cls.schedule.split(' ')[0].split('/').length} buổi/tuần</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0 pl-3 border-l border-border/40">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span className="font-medium">{cls.enrolledStudents}/{cls.maxStudents} HS</span>
                    </div>
                    <span className="text-xs text-muted-foreground/80 font-normal">
                      {isExpanded ? `${classSessions.length} buổi tiếp theo` : 'Bấm để xem buổi học'}
                    </span>
                  </div>
                </button>

                {/* Danh sách buổi học trong khoảng thời gian đã chọn (Tối đa 5 buổi) */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-border/70 space-y-2 animate-in fade-in slide-in-from-top-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground font-medium pb-1">
                      <span>
                        {classSessions.length > 0
                          ? `Các ca học trong khoảng thời gian (${classSessions.length} buổi):`
                          : 'Không có buổi học trong khoảng thời gian này'}
                      </span>
                      <span>Sĩ số & Bài học</span>
                    </div>

                    {classSessions.length === 0 ? (
                      <div className="py-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                        Không có buổi học nào trong khoảng thời gian đã chọn. Vui lòng mở rộng khoảng thời gian ở trên.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {classSessions.map((session) => {
                          const isSessionFull = session.attendees >= session.capacity
                          const isSelected = selectedSessions.some(
                            (s) => s.classId === cls.classId && s.sessionId === session.id
                          )
                          const isSessionExpanded = expandedSessionIds.includes(session.id)

                          return (
                            <div
                              key={session.id}
                              className={cn(
                                "rounded-lg border transition-all overflow-hidden",
                                isSelected
                                  ? "bg-primary/5 border-primary ring-1 ring-primary/30 shadow-2xs"
                                  : isSessionFull
                                    ? "bg-muted/30 opacity-60 border-border/40"
                                    : "hover:border-border/90 border-border/70 bg-card"
                              )}
                            >
                              {/* Dòng ca học chính */}
                              <div
                                role="button"
                                tabIndex={isSessionFull ? -1 : 0}
                                onClick={() => {
                                  if (isSessionFull) return
                                  onSelectSession({
                                    classId: cls.classId,
                                    className: cls.className,
                                    sessionId: session.id,
                                    sessionName: session.name,
                                    trialDate: `${session.weekdayName}, ${session.formattedDate} ${session.time}`,
                                    teacher: session.teacher,
                                    assistantTeacher: session.assistantTeacher,
                                    room: session.room,
                                    lessonTopic: session.lessonTopic,
                                  })
                                }}
                                className={cn(
                                  "flex w-full items-center justify-between p-3 text-left select-none cursor-pointer transition-colors",
                                  isSelected ? "bg-primary/10" : "hover:bg-muted/30"
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                                  <div
                                    className={cn(
                                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                                      isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/40 bg-background",
                                      isSessionFull && "border-muted-foreground/30"
                                    )}
                                  >
                                    {isSelected && <CheckCircle className="h-3.5 w-3.5" />}
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    {/* Tên ca học với Reusable ClassSessionHoverCard & Icon mở tab chi tiết */}
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <ClassSessionHoverCard
                                        session={{
                                          id: session.id,
                                          title: session.name,
                                          className: cls.className,
                                          classCode: cls.classId.toUpperCase(),
                                          kctName: cls.program,
                                          subject: cls.program,
                                          level: cls.className.split(' ').pop(),
                                          schoolRoom: session.room,
                                          branch: school || 'RinoEdu Linh Đàm',
                                          timeSlot: `${session.time} - ${session.time === '09:00' ? '10:30' : '19:30'}`,
                                          timeLabel: session.time,
                                          date: session.formattedDate,
                                          teacher: session.teacher,
                                          assistantTeacher: session.assistantTeacher,
                                          totalStudents: session.attendees,
                                          capacity: session.capacity,
                                          trialStudents: 2,
                                          lessonSubtitle: session.lessonTopic,
                                          lessonNumber: session.name,
                                          lessonContent: {
                                            sessionNumber: session.name,
                                            words: session.lessonContent.words,
                                            sentences: session.lessonContent.sentences,
                                            phonics: session.lessonContent.phonics,
                                          },
                                          status: 'dang_hoc',
                                        }}
                                        side="right"
                                      >
                                        <div
                                          className="inline-flex items-center gap-1 group/sess cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            window.open('/app/calendar_class_schedule', '_blank')
                                          }}
                                          title="Xem chi tiết buổi học (Mở tab mới)"
                                        >
                                          <span
                                            className={cn(
                                              "text-xs font-bold truncate group-hover/sess:underline group-hover/sess:text-primary transition-colors",
                                              isSelected ? "text-primary font-bold" : "text-foreground"
                                            )}
                                          >
                                            {session.name}
                                          </span>
                                          <ExternalLink className="h-3 w-3 text-muted-foreground/60 group-hover/sess:text-primary group-hover/sess:opacity-100 transition-colors shrink-0" />
                                        </div>
                                      </ClassSessionHoverCard>
                                    </div>

                                    {/* Subtext: Ngày giờ, Giáo viên, Trợ giảng */}
                                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                      <span className="font-semibold text-foreground/90">
                                        {session.weekdayName}, {session.formattedDate}
                                      </span>
                                      <span>&middot;</span>
                                      <span className="font-mono font-medium">{session.time}</span>
                                      <span>&middot;</span>

                                      {/* Teacher Button with PersonnelHoverCard */}
                                      <PersonnelHoverCard
                                        person={{
                                          id: `EMP-${session.teacher.split(' ').map((n) => n[0]).join('').toUpperCase()}`,
                                          name: session.teacher,
                                          role: 'Giáo viên chính',
                                          phone: '0912 345 678',
                                          email: `${session.teacher.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.com`,
                                        }}
                                        align="start"
                                      >
                                        <span
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors"
                                          title={`Xem thông tin giáo viên ${session.teacher}`}
                                        >
                                          <GraduationCap className="h-3.5 w-3.5" />
                                          <span>GV: {session.teacher}</span>
                                        </span>
                                      </PersonnelHoverCard>

                                      {/* Assistant Teacher (if any) with PersonnelHoverCard */}
                                      {session.assistantTeacher && (
                                        <>
                                          <span>&middot;</span>
                                          <PersonnelHoverCard
                                            person={{
                                              id: `EMP-${session.assistantTeacher.split(' ').map((n) => n[0]).join('').toUpperCase()}`,
                                              name: session.assistantTeacher,
                                              role: 'Trợ giảng',
                                              phone: '0988 765 432',
                                              email: `${session.assistantTeacher.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.com`,
                                            }}
                                            align="start"
                                          >
                                            <span
                                              onClick={(e) => e.stopPropagation()}
                                              className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 hover:underline cursor-pointer transition-colors"
                                              title={`Xem thông tin trợ giảng ${session.assistantTeacher}`}
                                            >
                                              <UserCheck className="h-3.5 w-3.5" />
                                              <span>TG: {session.assistantTeacher}</span>
                                            </span>
                                          </PersonnelHoverCard>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Cột bên phải: Sĩ số & Nút mở rộng nội dung bài học */}
                                <div className="flex flex-col items-end gap-1 shrink-0 pl-3 border-l border-border/40 min-w-[85px]">
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                    <Users className="h-3.5 w-3.5" />
                                    <span>{session.attendees}/{session.capacity}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => toggleSessionExpand(session.id, e)}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors"
                                    title="Xem chi tiết nội dung bài học"
                                  >
                                    <BookOpen className="h-3 w-3 shrink-0 text-primary" />
                                    <span>{isSessionExpanded ? 'Ẩn bài học' : 'Nội dung bài'}</span>
                                    {isSessionExpanded ? (
                                      <ChevronUp className="h-3 w-3 shrink-0 text-primary" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3 shrink-0 text-primary" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Mở rộng nội dung bài học dạng dữ liệu phẳng (không tách khối) */}
                              {isSessionExpanded && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="border-t border-border/40 bg-muted/10 px-3.5 py-2.5 text-xs space-y-1.5 animate-in fade-in slide-in-from-top-1"
                                >
                                  <div className="flex items-center justify-between flex-wrap gap-1">
                                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                                      <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                                      <span>Chủ đề:</span>
                                      <span className="text-primary font-semibold">{session.lessonTopic}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono">
                                      Thời lượng: 90 phút &middot; {session.room}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-1 border-t border-border/30">
                                    <div className="leading-relaxed">
                                      <span className="text-foreground font-semibold">Từ vựng: </span>
                                      <span className="text-muted-foreground">{session.lessonContent.words || '—'}</span>
                                    </div>
                                    <div className="leading-relaxed">
                                      <span className="text-foreground font-semibold">Mẫu câu: </span>
                                      <span className="text-muted-foreground">{session.lessonContent.sentences || '—'}</span>
                                    </div>
                                    <div className="leading-relaxed">
                                      <span className="text-foreground font-semibold">Phát âm & Hoạt động: </span>
                                      <span className="text-muted-foreground">{session.lessonContent.phonics || '—'}</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )
          })
        )}
      </div>
    </div>
  )
}
