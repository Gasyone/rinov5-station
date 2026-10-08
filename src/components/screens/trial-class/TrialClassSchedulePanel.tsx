'use client'

import * as React from 'react'
import {
  CheckCircle,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Calendar as CalendarIcon,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ClassSessionHoverCard } from '../calendar/ClassSessionHoverCard'
import { Calendar } from '@/components/ui/calendar'
import type { DateRange } from 'react-day-picker'
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

const extractLevel = (className: string, program: string): string => {
  const clean = className.replace(/\s*\([^)]*\)/g, '').trim()
  const withoutProgram = clean.replace(program, '').trim()
  return withoutProgram || 'A1'
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

  // Quản lý trạng thái mở rộng/thu gọn nội dung của từng buổi học
  const [expandedSessionIds, setExpandedSessionIds] = React.useState<string[]>([])

  const toggleSessionExpand = (sessionId: string) => {
    setExpandedSessionIds((prev) =>
      prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]
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

      {/* Flat List: Mỗi lớp học là 1 Section riêng biệt dạng thẻ trắng phẳng */}
      <div className="space-y-3">
        {!isReadyToLoad ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center text-muted-foreground bg-card shadow-2xs">
            <Clock className="mb-2 h-8 w-8 opacity-20" />
            <p className="text-sm font-semibold text-foreground">
              {!school && !program
                ? 'Vui lòng chọn Cơ sở và Chương trình học ở phía trên'
                : !school
                ? 'Vui lòng chọn Cơ sở mong muốn học ở phía trên'
                : 'Vui lòng chọn Chương trình học ở phía trên'}
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
            const classSessions = generateSessionsForClass(cls, fromDate, toDate)
            const classLevel = extractLevel(cls.className, cls.program)

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
                {/* Class Accordion Header - 1 dòng duy nhất: Mã lớp + Level + Sĩ số (x buổi) */}
                <button
                  type="button"
                  onClick={() => toggleClassExpand(cls.classId)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors cursor-pointer",
                    isExpanded ? "bg-muted/15" : "hover:bg-muted/15"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="text-muted-foreground shrink-0">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    <div className="flex items-center gap-2 min-w-0 flex-wrap">
                      {/* Reusable ClassCodeHoverCell (Mã lớp) */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <ClassCodeHoverCell
                          classCode={cls.classId.toUpperCase()}
                          subject={cls.program}
                          level={classLevel}
                          teacherCode="Ms. Sarah"
                          schedule={cls.schedule}
                          openInNewTab={true}
                        />
                      </div>

                      {/* Level - bỏ nhãn "Level:", chỉ hiển thị giá trị level */}
                      <Badge
                        variant="outline"
                        className="h-5 px-1.5 text-xs border-amber-300/60 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold"
                      >
                        {classLevel}
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
                  </div>

                  {/* Sĩ số kèm số buổi: 12/15 HS (3 buổi) */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 pl-2">
                    <Users className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      {cls.enrolledStudents}/{cls.maxStudents} HS ({classSessions.length} buổi)
                    </span>
                  </div>
                </button>

                {/* Danh sách buổi học trong khoảng thời gian đã chọn: Thiết kế dạng List Row phẳng, phân cách bằng đường line */}
                {isExpanded && (
                  <div className="border-t border-border/70 animate-in fade-in slide-in-from-top-1">
                    {classSessions.length === 0 ? (
                      <div className="p-4 text-center text-xs text-muted-foreground bg-muted/15">
                        Không có buổi học nào trong khoảng thời gian đã chọn. Vui lòng mở rộng khoảng thời gian ở trên.
                      </div>
                    ) : (
                      <div className="divide-y divide-border/60">
                        {classSessions.map((session) => {
                          const isSessionFull = session.attendees >= session.capacity
                          const isSelected = selectedSessions.some(
                            (s) => s.classId === cls.classId && s.sessionId === session.id
                          )
                          const isSessionExpanded = expandedSessionIds.includes(session.id)

                          return (
                            <div key={session.id} className="transition-colors">
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
                                    lessonWords: session.lessonContent.words,
                                    lessonSentences: session.lessonContent.sentences,
                                    lessonPhonics: session.lessonContent.phonics,
                                  })
                                }}
                                className={cn(
                                  "flex w-full items-center justify-between px-4 py-2.5 text-left select-none cursor-pointer transition-colors relative",
                                  isSelected
                                    ? "bg-primary/8 dark:bg-primary/15"
                                    : isSessionFull
                                    ? "bg-muted/30 opacity-60 cursor-not-allowed"
                                    : "hover:bg-muted/40 bg-card"
                                )}
                              >
                                {/* Đầu dòng: Radio / Check icon + Tên buổi + Nút mở rộng nội dung */}
                                <div className="flex items-center gap-2.5 min-w-0 mr-3">
                                  <div
                                    className={cn(
                                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                                      isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-muted-foreground/40 bg-background",
                                      isSessionFull && "border-muted-foreground/30"
                                    )}
                                  >
                                    {isSelected && <CheckCircle className="h-3 w-3" />}
                                  </div>

                                  {/* Tên buổi gắn textlink & ClassSessionHoverCard chuẩn hệ thống */}
                                  <div onClick={(e) => e.stopPropagation()} className="min-w-0 flex items-center gap-2">
                                    <ClassSessionHoverCard
                                      session={{
                                        id: session.id,
                                        title: session.lessonTopic || session.name,
                                        lessonSubtitle: session.name,
                                        classCode: cls.classId,
                                        className: cls.className,
                                        kctName: cls.program,
                                        subject: cls.program.includes('STEM')
                                          ? 'STEM'
                                          : cls.program.includes('Toán')
                                          ? 'Toán tư duy'
                                          : 'Tiếng Anh',
                                        level: classLevel,
                                        schoolRoom: session.room,
                                        branch: school || 'RinoEdu',
                                        timeSlot: `${session.time} (90p)`,
                                        timeLabel: session.time,
                                        date: session.date,
                                        teacher: session.teacher,
                                        teacherName: session.teacher,
                                        assistantTeacher: session.assistantTeacher,
                                        taName: session.assistantTeacher,
                                        totalStudents: session.attendees,
                                        capacity: session.capacity,
                                        type: 'class_session',
                                        typeLabel: 'Lớp học thử',
                                        lessonContent: [
                                          session.lessonContent.words
                                            ? `Từ vựng: ${session.lessonContent.words}`
                                            : null,
                                          session.lessonContent.sentences
                                            ? `Mẫu câu: ${session.lessonContent.sentences}`
                                            : null,
                                          session.lessonContent.phonics
                                            ? `Hoạt động: ${session.lessonContent.phonics}`
                                            : null,
                                        ]
                                          .filter(Boolean)
                                          .join(' • '),
                                      }}
                                      side="right"
                                    >
                                      <button
                                        type="button"
                                        className={cn(
                                          "inline-flex items-center gap-1 text-xs font-semibold hover:underline transition-colors cursor-pointer text-left truncate",
                                          isSelected ? "text-primary font-bold" : "text-foreground/90 hover:text-primary"
                                        )}
                                        title="Rê chuột để xem profile chi tiết buổi học"
                                      >
                                        <span className="truncate">{session.name}</span>
                                        <ExternalLink className="h-3 w-3 opacity-60 hover:opacity-100 shrink-0" />
                                      </button>
                                    </ClassSessionHoverCard>
                                  </div>
                                </div>

                                {/* Cuối dòng: Lịch học + Icon nội dung + Nút toggle chevron */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <div className="text-xs text-muted-foreground font-medium text-right mr-1">
                                    <span className={cn(isSelected ? "text-foreground font-semibold" : "text-foreground/90 font-medium")}>
                                      {session.weekdayName}, {session.formattedDate}
                                    </span>
                                    <span className="mx-1 opacity-50">&middot;</span>
                                    <span className="font-mono text-primary font-semibold">{session.time}</span>
                                  </div>

                                  {/* Icon Nội dung (không text, không viền, không nền, đặt trước icon thu gọn/mở rộng) */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleSessionExpand(session.id)
                                    }}
                                    className={cn(
                                      "p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
                                      isSessionExpanded && "text-primary"
                                    )}
                                    title={isSessionExpanded ? "Thu gọn nội dung buổi học" : "Xem nội dung chi tiết buổi học"}
                                  >
                                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                                  </button>

                                  {/* Nút toggle thu gọn / mở rộng */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleSessionExpand(session.id)
                                    }}
                                    className={cn(
                                      "p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
                                      isSessionExpanded && "text-primary"
                                    )}
                                    title={isSessionExpanded ? "Thu gọn nội dung buổi học" : "Mở rộng xem nội dung buổi học"}
                                  >
                                    {isSessionExpanded ? (
                                      <ChevronUp className="h-3.5 w-3.5 shrink-0" />
                                    ) : (
                                      <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Khung nội dung chi tiết buổi học khi mở rộng */}
                              {isSessionExpanded && (
                                <div className="px-4 py-3 bg-muted/20 dark:bg-muted/10 border-t border-border/50 text-xs space-y-2.5 animate-in fade-in slide-in-from-top-1">
                                  {/* Chủ đề bài học */}
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                                    <span className="font-semibold text-foreground text-xs">
                                      Chủ đề: {session.lessonTopic || session.name}
                                    </span>
                                  </div>

                                  {/* Chi tiết nội dung: Từ vựng, mẫu câu, phonics/hoạt động */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-5 text-[11.5px] leading-relaxed">
                                    {session.lessonContent.words && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-muted-foreground shrink-0 font-medium">• Từ vựng:</span>
                                        <span className="text-foreground">{session.lessonContent.words}</span>
                                      </div>
                                    )}
                                    {session.lessonContent.sentences && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-muted-foreground shrink-0 font-medium">• Mẫu câu:</span>
                                        <span className="text-foreground italic">{session.lessonContent.sentences}</span>
                                      </div>
                                    )}
                                    {session.lessonContent.phonics && (
                                      <div className="flex items-start gap-1.5 sm:col-span-2">
                                        <span className="text-muted-foreground shrink-0 font-medium">• Ngữ âm / Hoạt động:</span>
                                        <span className="text-foreground">{session.lessonContent.phonics}</span>
                                      </div>
                                    )}
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
