'use client'

import { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  UserX,
  LayoutGrid,
  CalendarDays,
  Lock,
} from 'lucide-react'
import { toast } from 'sonner'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import { Lead, LeadChild } from '@/mocks/crmLeads'
import { formatChildLabel } from './crmLeadsHelpers'

interface CrmLeadsBookingTestModalProps {
  lead: Lead | null
  child: LeadChild | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const PROGRAM_CONFIG: Record<
  string,
  { subject: 'english' | 'math'; levels: string[] }
> = {
  'Chương trình Station': {
    subject: 'english',
    levels: [
      'Pre-Starters (<=6)',
      'Starters (>6 và <=8)',
      'Mover (>8 và <=10)',
      'Flyers (>10)',
    ],
  },
  'Chương trình Toán tư duy': {
    subject: 'math',
    levels: ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7'],
  },
  'Chương trình Station Grammar': {
    subject: 'english',
    levels: ['Level 0-1', 'Level 2', 'Level 3', 'Level 4'],
  },
}

export const TIME_SLOTS = [
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
]

export const TIME_GROUPS = [
  {
    title: 'Buổi sáng',
    icon: '☀️',
    slots: ['08:30', '09:00', '09:30', '10:00', '10:30'],
  },
  {
    title: 'Buổi chiều',
    icon: '🌤',
    slots: ['14:00', '14:30', '15:00', '15:30', '17:30'],
  },
  {
    title: 'Buổi tối',
    icon: '🌙',
    slots: ['18:00', '18:30', '19:00'],
  },
]

export interface TeacherAvatarItem {
  id: string
  name: string
  shortName: string
  role?: 'Giáo viên' | 'CS' | 'Khác'
  colorClass?: string
}

export const MOCK_TEACHERS: TeacherAvatarItem[] = [
  { id: 't1', name: 'Sarah J.', shortName: 'SJ', role: 'Giáo viên', colorClass: 'bg-emerald-600 text-white' },
  { id: 't2', name: 'Robert L.', shortName: 'RL', role: 'Giáo viên', colorClass: 'bg-blue-600 text-white' },
  { id: 't3', name: 'Emily W.', shortName: 'EW', role: 'Giáo viên', colorClass: 'bg-indigo-600 text-white' },
  { id: 't4', name: 'Phạm Văn Giang', shortName: 'PG', role: 'Giáo viên', colorClass: 'bg-teal-600 text-white' },
  { id: 't5', name: 'Trần Thị Mai', shortName: 'TM', role: 'CS', colorClass: 'bg-amber-600 text-white' },
]

export function CrmLeadsBookingTestModal({
  lead,
  child,
  open,
  onOpenChange,
  onSuccess,
}: CrmLeadsBookingTestModalProps) {
  // Chế độ xem: 'grid' (Khung giờ & Nhân sự) vs 'timeline' (Lưới Timeline Matrix Full Section)
  const [viewMode, setViewMode] = useState<'grid' | 'timeline'>('grid')

  const dateOptions = useMemo(() => {
    const today = new Date()
    const formatDateStr = (d: Date) => {
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
    const formatDisplay = (d: Date, prefix: string) => {
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${prefix} (${dd}/${mm})`
    }

    const d0 = new Date(today)
    const d1 = new Date(today); d1.setDate(today.getDate() + 1)
    const d2 = new Date(today); d2.setDate(today.getDate() + 2)
    const d3 = new Date(today); d3.setDate(today.getDate() + 3)

    return {
      first3: [
        { dateStr: formatDateStr(d0), label: formatDisplay(d0, 'Hôm nay') },
        { dateStr: formatDateStr(d1), label: formatDisplay(d1, 'Ngày mai') },
        { dateStr: formatDateStr(d2), label: formatDisplay(d2, 'Ngày kia') },
      ],
      minCustomDateStr: formatDateStr(d3),
    }
  }, [])

  const [program, setProgram] = useState('Chương trình Station')
  const [level, setLevel] = useState('Pre-Starters (<=6)')
  const [school, setSchool] = useState('RinoEdu Nguyễn Tuân')
  const [teacher, setTeacher] = useState('Sarah J.')
  const [testDate, setTestDate] = useState(dateOptions.first3[0]?.dateStr || '')
  const [selectedSlot, setSelectedSlot] = useState('09:00')
  const [notes, setNotes] = useState('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const [prevKey, setPrevKey] = useState({ leadId: lead?.id, childId: child?.id })
  if (prevKey.leadId !== lead?.id || prevKey.childId !== child?.id) {
    setPrevKey({ leadId: lead?.id, childId: child?.id })
    if (lead?.branch) setSchool(lead.branch)
    if (child?.notes) setNotes(child.notes)
  }

  if (!lead || !child) return null

  const calendarSelectedDate = (() => {
    if (!testDate) return undefined
    const [yyyy, mm, dd] = testDate.split('-').map(Number)
    if (yyyy && mm && dd) {
      return new Date(yyyy, mm - 1, dd)
    }
    return undefined
  })()

  const minDateObj = (() => {
    const [yyyy, mm, dd] = dateOptions.minCustomDateStr.split('-').map(Number)
    const d = new Date(yyyy, mm - 1, dd)
    d.setHours(0, 0, 0, 0)
    return d
  })()

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    setTestDate(`${yyyy}-${mm}-${dd}`)
    setDatePickerOpen(false)
  }

  // Danh sách giáo viên trực ca khả dụng cho từng slot
  const slotTeachersMap = TIME_SLOTS.map((slot, sIdx) => {
    const available = MOCK_TEACHERS.filter(
      (_, tIdx) => (sIdx + tIdx) % 2 === 0 || tIdx === sIdx % MOCK_TEACHERS.length
    )
    return {
      slot,
      teachers: available.length > 0 ? available : MOCK_TEACHERS.slice(0, 3),
    }
  })

  // Hàm xác định trạng thái của ô (slot, teacher): 'available' | 'booked' | 'off'
  const getCellStatus = (slot: string, teacherId: string, sIdx: number, tIdx: number) => {
    const slotObj = slotTeachersMap.find((s) => s.slot === slot)
    const isAvailable = slotObj?.teachers.some((t) => t.id === teacherId)

    if (!isAvailable) return 'off'

    // Giả lập 1 số ô có lịch bận thực tế để trực quan
    const isBooked = (sIdx * 3 + tIdx * 7) % 5 === 1
    if (isBooked) return 'booked'

    return 'available'
  }

  const currentSlotTeachers =
    slotTeachersMap.find((s) => s.slot === selectedSlot)?.teachers || MOCK_TEACHERS

  const isFirst3Selected = dateOptions.first3.some((d) => d.dateStr === testDate)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const teacherText = teacher ? ` (GV: ${teacher})` : ' (Chưa gán phụ trách)'
    toast.success(
      `Tạo lịch đánh giá năng lực thành công cho ${child.name}! (${testDate} - Ca ${selectedSlot}${teacherText})`
    )
    onOpenChange(false)
    onSuccess?.()
  }

  const schoolSelectOptions = [
    { value: 'Chi nhánh Quận 1', label: 'RinoEdu Chi nhánh Quận 1' },
    { value: 'Chi nhánh Cầu Giấy', label: 'RinoEdu Chi nhánh Cầu Giấy' },
    { value: 'RinoEdu Nguyễn Tuân', label: 'RinoEdu Nguyễn Tuân' },
    { value: 'RinoEdu Smart City', label: 'RinoEdu Smart City' },
  ]

  const programOptions = Object.keys(PROGRAM_CONFIG).map((p) => ({
    value: p,
    label: p,
  }))

  const levelOptions = (PROGRAM_CONFIG[program]?.levels || []).map((l) => ({
    value: l,
    label: l,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-[92vw] max-h-[92vh] overflow-y-auto bg-[#f8fafc] dark:bg-zinc-900 opacity-100 px-5 py-3.5 gap-2 border-none shadow-xl">
        <DialogHeader className="pb-0.5">
          <div className="flex items-center justify-between pr-6">
            <DialogTitle className="text-base font-semibold">
              Tạo mới Đặt lịch đánh giá năng lực
            </DialogTitle>

            {/* Bộ chuyển đổi Chế độ xem */}
            <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all cursor-pointer text-xs font-medium',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-800 text-sky-600 font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Dạng Ô giờ & Nhân sự</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('timeline')}
                className={cn(
                  'flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all cursor-pointer text-xs font-medium',
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-zinc-800 text-sky-600 font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Dạng Lưới Timeline Matrix</span>
              </button>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2 py-0.5">
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            {/* CỘT TRÁI (35% BỀ RỘNG) - ĐỐI TƯỢNG & CHƯƠNG TRÌNH */}
            <div className="w-full md:w-[35%] shrink-0 space-y-2 bg-white dark:bg-zinc-950 rounded-xl p-3 shadow-2xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-0.5">
                  Đối tượng & Chương trình
                </div>

                {/* Contact / Phụ huynh */}
                <FieldLabel label="Contact / Phụ huynh" required>
                  <div className="w-full rounded-md border border-input bg-muted/40 px-2.5 py-1.5 text-xs font-medium text-foreground">
                    {lead.parentName} - {lead.phone}
                  </div>
                </FieldLabel>

                {/* Con / Học viên */}
                <FieldLabel label="Con / Học viên" required>
                  <div className="w-full rounded-md border border-input bg-emerald-50/50 dark:bg-emerald-950/20 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    {formatChildLabel(child)}
                  </div>
                </FieldLabel>

                {/* Trường / Cơ sở */}
                <FieldLabel label="Trường / Cơ sở" required>
                  <InlineSelect
                    value={school}
                    onValueChange={setSchool}
                    options={schoolSelectOptions}
                    ariaLabel="Chọn trường / cơ sở"
                  />
                </FieldLabel>

                {/* Chương trình & Level */}
                <div className="space-y-2">
                  <FieldLabel label="Chọn chương trình" required>
                    <InlineSelect
                      value={program}
                      onValueChange={(val) => {
                        setProgram(val)
                        const cfg = PROGRAM_CONFIG[val]
                        if (cfg && cfg.levels.length > 0) {
                          setLevel(cfg.levels[0])
                        }
                      }}
                      options={programOptions}
                      ariaLabel="Chọn chương trình"
                    />
                  </FieldLabel>

                  <FieldLabel label="Chọn level" required>
                    <InlineSelect
                      value={level}
                      onValueChange={setLevel}
                      options={levelOptions}
                      ariaLabel="Chọn level"
                    />
                  </FieldLabel>
                </div>

                {/* Ghi chú: Sử dụng resize-none + min-h cố định để tránh đẩy vỡ khung */}
                <FieldLabel label="Ghi chú">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập ghi chú chi tiết..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </FieldLabel>
              </div>
            </div>

            {/* CỘT PHẢI (65% BỀ RỘNG) */}
            <div className="w-full md:w-[65%] min-w-0 flex flex-col space-y-2 justify-between">
              {/* 4 Nút Chọn Ngày */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl p-2.5 shadow-2xs shrink-0">
                <div className="grid grid-cols-4 gap-2">
                  {dateOptions.first3.map((item) => {
                    const isSelected = testDate === item.dateStr
                    return (
                      <button
                        key={item.dateStr}
                        type="button"
                        onClick={() => setTestDate(item.dateStr)}
                        className={cn(
                          'flex items-center justify-center rounded-md border px-2 py-1.5 text-xs font-medium transition-colors text-center truncate cursor-pointer',
                          isSelected
                            ? 'bg-sky-500 text-white border-sky-500 shadow-xs font-semibold'
                            : 'bg-background hover:bg-muted text-foreground'
                        )}
                      >
                        {item.label}
                      </button>
                    )
                  })}

                  {/* Nút 4: Ngày khác */}
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          'flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors text-center truncate cursor-pointer',
                          !isFirst3Selected
                            ? 'bg-sky-500 text-white border-sky-500 shadow-xs font-semibold'
                            : 'bg-background hover:bg-muted text-foreground'
                        )}
                      >
                        <CalendarIcon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {!isFirst3Selected && testDate
                            ? (() => {
                                const parts = testDate.split('-')
                                return parts.length === 3 ? `${parts[2]}/${parts[1]}` : testDate
                              })()
                            : 'Ngày khác'}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-auto p-0 z-50">
                      <Calendar
                        mode="single"
                        selected={calendarSelectedDate}
                        onSelect={handleCalendarSelect}
                        disabled={(date) => date < minDateObj}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* CHẾ ĐỘ 1: DẠNG Ô GIỜ (GRID VIEW CHUẨN MẪU) */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-[340px]">
                  {/* BẢNG TRÁI: KHUNG GIỜ TEST */}
                  <div className="rounded-xl p-2.5 bg-white dark:bg-zinc-950 shadow-2xs flex flex-col justify-between flex-1 min-h-0">
                    <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-0.5 flex items-center justify-between">
                        <span>Khung giờ test</span>
                        <span className="text-sky-600 font-semibold">{selectedSlot}</span>
                      </div>

                      <div className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                        {TIME_GROUPS.map((group) => (
                          <div key={group.title} className="space-y-1">
                            <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                              <span>{group.icon}</span>
                              <span>{group.title}</span>
                            </span>

                            <div className="grid grid-cols-2 gap-1">
                              {group.slots.map((slot) => {
                                const isSlotSelected = selectedSlot === slot
                                const slotTeachers = slotTeachersMap.find((s) => s.slot === slot)?.teachers || []

                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => {
                                      setSelectedSlot(slot)
                                      if (slotTeachers.length > 0 && !slotTeachers.some((t) => t.name === teacher)) {
                                        setTeacher(slotTeachers[0].name)
                                      }
                                    }}
                                    className={cn(
                                      'flex items-center justify-between rounded-md border px-2 py-1 text-xs transition-all cursor-pointer',
                                      isSlotSelected
                                        ? 'border-sky-500 bg-sky-500 text-white font-semibold shadow-xs'
                                        : 'border-border bg-muted/20 hover:bg-muted text-foreground'
                                    )}
                                  >
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3 opacity-70 shrink-0" />
                                      <span>{slot}</span>
                                    </span>
                                    <span
                                      className={cn(
                                        'text-[9px] px-1 py-0.2 rounded font-medium',
                                        isSlotSelected
                                          ? 'bg-white/20 text-white'
                                          : 'bg-muted text-muted-foreground'
                                      )}
                                    >
                                      {slotTeachers.length} Phụ trách
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* BẢNG PHẢI: PHỤ TRÁCH CA */}
                  <div className="rounded-xl p-2.5 bg-white dark:bg-zinc-950 shadow-2xs flex flex-col justify-between flex-1 min-h-0">
                    <div className="space-y-1.5 flex-1 flex flex-col min-h-0">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-0.5 flex items-center justify-between">
                        <span>Phụ trách ca {selectedSlot}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {currentSlotTeachers.length} nhân sự
                        </span>
                      </div>

                      <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1">
                        <div
                          onClick={() => setTeacher('')}
                          className={cn(
                            'flex items-center justify-between rounded-md border p-1.5 cursor-pointer transition-all',
                            teacher === ''
                              ? 'border-amber-500 bg-amber-50/50 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300 font-semibold ring-1 ring-amber-500/30'
                              : 'border-border bg-muted/20 hover:bg-muted/50 text-muted-foreground'
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                              <UserX className="h-3 w-3" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">Chưa gán Phụ trách</p>
                            </div>
                          </div>
                          {teacher === '' && <Check className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                        </div>

                        {currentSlotTeachers.map((t) => {
                          const isSelectedTeacher = teacher === t.name
                          return (
                            <div
                              key={t.id}
                              onClick={() => setTeacher(t.name)}
                              className={cn(
                                'flex items-center justify-between rounded-md border p-1.5 cursor-pointer transition-all',
                                isSelectedTeacher
                                  ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-100 font-semibold ring-1 ring-sky-500/30 shadow-xs'
                                  : 'border-border bg-muted/20 hover:bg-muted/50 text-foreground'
                              )}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <div
                                  className={cn(
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white',
                                    t.colorClass || 'bg-sky-600'
                                  )}
                                >
                                  {t.shortName}
                                </div>
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-semibold">{t.name}</p>
                                </div>
                              </div>

                              {isSelectedTeacher ? (
                                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sky-500 text-white shrink-0">
                                  <Check className="h-2.5 w-2.5" />
                                </span>
                              ) : (
                                <span className="text-[9px] font-normal text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1 py-0.2 rounded border border-emerald-200 shrink-0">
                                  Rảnh
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CHẾ ĐỘ 2: DẠNG LƯỚI TIMELINE MATRIX FULL SECTION - TỰ ĐỘNG THÍCH ỨNG CHIỀU CAO (KHÔNG BỊ TRỤN/CẮT CỤT) */}
              {viewMode === 'timeline' && (
                <div className="rounded-xl border border-border bg-white dark:bg-zinc-950 shadow-2xs p-0 overflow-hidden flex-1 flex flex-col min-h-[340px]">
                  {/* Header Section thanh thoát */}
                  <div className="px-3 py-2 border-b bg-muted/30 flex items-center justify-between shrink-0">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Timeline Ca Trực & Nhân Sự ({testDate})</span>
                    </span>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Rảnh
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Bận/Có lịch
                      </span>
                    </div>
                  </div>

                  {/* Bảng Ma trận tự động lấp đầy 100% chiều cao linh hoạt mà không bị giới hạn cứng max-h */}
                  <div className="flex-1 min-h-0 overflow-x-auto overflow-y-auto p-0 m-0">
                    <table className="w-full border-collapse text-xs whitespace-nowrap p-0 m-0">
                      <thead>
                        <tr className="bg-muted/80 backdrop-blur-xs sticky top-0 z-10 border-b">
                          <th className="p-2 text-left font-normal text-muted-foreground w-[80px] border-r">
                            Khung giờ
                          </th>
                          {MOCK_TEACHERS.map((t) => (
                            <th key={t.id} className="p-2 text-center font-normal text-foreground border-r last:border-r-0 min-w-[95px]">
                              <div className="flex items-center justify-center gap-1">
                                <span className={cn('h-1.5 w-1.5 rounded-full', t.colorClass || 'bg-sky-500')} />
                                <span className="truncate">{t.name}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {TIME_SLOTS.map((slot, sIdx) => {
                          const isRowSelected = selectedSlot === slot

                          return (
                            <tr
                              key={slot}
                              className={cn(
                                'border-b last:border-b-0 hover:bg-muted/20 transition-colors',
                                isRowSelected && 'bg-sky-50/30 dark:bg-sky-950/20'
                              )}
                            >
                              {/* Cột Khung giờ */}
                              <td className="p-1 font-mono font-normal text-muted-foreground border-r bg-muted/10 text-center text-xs">
                                <span>{slot}</span>
                              </td>

                              {/* Ma trận các ô nhân sự */}
                              {MOCK_TEACHERS.map((t, tIdx) => {
                                const cellStatus = getCellStatus(slot, t.id, sIdx, tIdx)
                                const isSelectedCell = selectedSlot === slot && teacher === t.name

                                return (
                                  <td
                                    key={t.id}
                                    className="p-1 text-center border-r last:border-r-0 align-middle"
                                  >
                                    {cellStatus === 'available' && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedSlot(slot)
                                          setTeacher(t.name)
                                        }}
                                        className={cn(
                                          'w-full py-1 px-1.5 rounded font-normal text-[10px] transition-all cursor-pointer flex items-center justify-center gap-1',
                                          isSelectedCell
                                            ? 'bg-sky-500 text-white font-semibold shadow-2xs'
                                            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 hover:bg-emerald-100'
                                        )}
                                      >
                                        {isSelectedCell ? (
                                          <>
                                            <Check className="h-3 w-3 shrink-0" />
                                            <span>{slot}</span>
                                          </>
                                        ) : (
                                          <span>Rảnh</span>
                                        )}
                                      </button>
                                    )}

                                    {cellStatus === 'booked' && (
                                      <button
                                        type="button"
                                        disabled
                                        title="Nhân sự đã có lịch test/dạy khác trong khung giờ này"
                                        className="w-full py-1 px-1.5 rounded font-normal text-[10px] bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 cursor-not-allowed opacity-75 flex items-center justify-center gap-1"
                                      >
                                        <Lock className="h-2.5 w-2.5 shrink-0 opacity-60" />
                                        <span>Bận</span>
                                      </button>
                                    )}

                                    {cellStatus === 'off' && (
                                      <span className="text-[10px] text-muted-foreground/30 italic">---</span>
                                    )}
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2 border-t mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
              Tạo lịch test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
