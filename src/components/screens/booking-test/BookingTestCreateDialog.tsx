'use client'

import { useState, useMemo, type FormEvent } from 'react'
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Plus,
  UserX,
} from 'lucide-react'
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
import type { BookingSubject, BookingTest } from '@/mocks/bookingTests'
import { mockStudents } from '@/mocks/students'

interface BookingTestCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schoolOptions: string[]
  teacherOptions: string[]
  activeSubject: string
  onSubmit: (newBooking: BookingTest) => void
}

export const PROGRAM_CONFIG: Record<
  string,
  { subject: BookingSubject; levels: string[] }
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
  { id: 't4', name: 'Phạm Văn Giang', shortName: 'PG', role: 'CS', colorClass: 'bg-teal-600 text-white' },
  { id: 't5', name: 'Trần Thị Mai', shortName: 'TM', role: 'CS', colorClass: 'bg-amber-600 text-white' },
  { id: 't6', name: 'Đỗ Thị Part-time', shortName: 'ĐỔ', role: 'Khác', colorClass: 'bg-violet-600 text-white' },
]

interface ContactPerson {
  id: string
  name: string
  phone: string
  children: Array<{ id: string; name: string; dob?: string }>
}

export function BookingTestCreateDialog({
  open,
  onOpenChange,
  schoolOptions,
  teacherOptions,
  activeSubject,
  onSubmit,
}: BookingTestCreateDialogProps) {
  // 1. 3 Ngày đầu tiên (Hôm nay, Ngày mai, Ngày kia) + Min date cho Ngày khác (từ ngày thứ 4 trở đi)
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

  // 2. Gom nhóm danh sách Contact (Phụ huynh) và Con từ mockStudents
  const contactsList = useMemo<ContactPerson[]>(() => {
    const map = new Map<string, ContactPerson>()

    mockStudents.forEach((student) => {
      const pName = student.parentName || `Phụ huynh ${student.name}`
      const pPhone = student.parentPhone || student.phone || '0900000000'
      const key = `${pName}_${pPhone}`

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: pName,
          phone: pPhone,
          children: [],
        })
      }

      const contact = map.get(key)!
      if (!contact.children.some((c) => c.id === student.id)) {
        contact.children.push({
          id: student.id,
          name: student.name,
          dob: student.dob,
        })
      }
    })

    return Array.from(map.values())
  }, [])

  const defaultContact = contactsList[0]
  const [contactId, setContactId] = useState(defaultContact?.id || 'custom')
  const [childId, setChildId] = useState(defaultContact?.children[0]?.id || 'custom_child')

  // Trường thông tin tự nhập (khi chọn Contact/Con mới)
  const [customParentName, setCustomParentName] = useState('')
  const [customPhone, setCustomPhone] = useState('')
  const [customChildName, setCustomChildName] = useState('')

  // Chương trình & Level (Môn tự động suy ra từ Chương trình)
  const initialProgram =
    activeSubject === 'math' ? 'Chương trình Toán tư duy' : 'Chương trình Station'
  const [program, setProgram] = useState(initialProgram)
  const [level, setLevel] = useState(
    PROGRAM_CONFIG[initialProgram]?.levels[0] || ''
  )

  const [school, setSchool] = useState(
    schoolOptions[0] || 'RinoEdu Nguyễn Tuân'
  )
  const [teacher, setTeacher] = useState(teacherOptions[0] || 'Sarah J.')
  const [testDate, setTestDate] = useState(dateOptions.first3[0]?.dateStr || '')
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1] || '09:00')
  const [notes, setNotes] = useState('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const calendarSelectedDate = useMemo(() => {
    if (!testDate) return undefined
    const [yyyy, mm, dd] = testDate.split('-').map(Number)
    if (yyyy && mm && dd) {
      return new Date(yyyy, mm - 1, dd)
    }
    return undefined
  }, [testDate])

  const minDateObj = useMemo(() => {
    const [yyyy, mm, dd] = dateOptions.minCustomDateStr.split('-').map(Number)
    const d = new Date(yyyy, mm - 1, dd)
    d.setHours(0, 0, 0, 0)
    return d
  }, [dateOptions.minCustomDateStr])

  const handleCalendarSelect = (date: Date | undefined) => {
    if (!date) return
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    setTestDate(`${yyyy}-${mm}-${dd}`)
    setDatePickerOpen(false)
  }

  // Mapping danh sách các cô giáo khả dụng theo từng Khung giờ
  const slotTeachersMap = useMemo(() => {
    const allTeachers =
      teacherOptions.length > 0
        ? teacherOptions.map((tName, i) => {
            const found = MOCK_TEACHERS.find((m) => m.name === tName)
            return (
              found || {
                id: `t_${i}`,
                name: tName,
                shortName: tName.slice(0, 2).toUpperCase(),
                colorClass: 'bg-primary/80 text-primary-foreground',
              }
            )
          })
        : MOCK_TEACHERS

    return TIME_SLOTS.map((slot, sIdx) => {
      const available = allTeachers.filter(
        (_, tIdx) => (sIdx + tIdx) % 2 === 0 || tIdx === sIdx % allTeachers.length
      )
      return {
        slot,
        teachers: available.length > 0 ? available : allTeachers.slice(0, 3),
      }
    })
  }, [teacherOptions])

  const currentSlotTeachers = useMemo(() => {
    const found = slotTeachersMap.find((s) => s.slot === selectedSlot)
    return found ? found.teachers : MOCK_TEACHERS
  }, [slotTeachersMap, selectedSlot])

  const isFirst3Selected = dateOptions.first3.some((d) => d.dateStr === testDate)

  // Khi đổi Contact: tự động chọn đứa con đầu tiên của Contact đó
  const handleContactChange = (newContactId: string) => {
    setContactId(newContactId)
    if (newContactId !== 'custom') {
      const contact = contactsList.find((c) => c.id === newContactId)
      if (contact && contact.children.length > 0) {
        setChildId(contact.children[0].id)
      } else {
        setChildId('custom_child')
      }
    }
  }

  const handleResetAndClose = () => {
    setCustomParentName('')
    setCustomPhone('')
    setCustomChildName('')
    setNotes('')
    onOpenChange(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const selectedContactObj = contactsList.find((c) => c.id === contactId)
    let parentName = ''
    let phone = ''
    let childName = ''

    if (contactId === 'custom' || !selectedContactObj) {
      parentName = customParentName.trim() || 'Phụ huynh khách hàng'
      phone = customPhone.trim() || '0900000000'
      childName = customChildName.trim() || 'Học viên mới'
    } else {
      parentName = selectedContactObj.name
      phone = selectedContactObj.phone
      if (childId === 'custom_child') {
        childName = customChildName.trim() || 'Học viên mới'
      } else {
        const foundChild = selectedContactObj.children.find(
          (c) => c.id === childId
        )
        childName = foundChild ? foundChild.name : 'Học viên mới'
      }
    }

    const currentProgramConfig =
      PROGRAM_CONFIG[program] || PROGRAM_CONFIG['Chương trình Station']
    const subject = currentProgramConfig.subject

    const newBooking: BookingTest = {
      id: `E${Math.floor(1000 + Math.random() * 9000)}`,
      childName,
      familyName: `Gia đình ${parentName}`,
      phone,
      familyMembers: [
        {
          name: `${parentName} (Phụ huynh)`,
          phone,
          isPrimary: true,
        },
      ],
      status: 'booked_assessment',
      attendance: 'pending',
      subject,
      eventType: 'test',
      program,
      school,
      room: 'Phòng A1',
      classroom: 'Phòng A1',
      testTime: `${testDate} ${selectedSlot}`,
      testResult: {
        level: level,
      },
      createdBy: 'Người dùng hiện tại',
      ops: 'Người dùng hiện tại',
      teacher: teacher || '',
      tester: teacher || '',
      interviewer: 'Người dùng hiện tại',
      msg: notes.trim() || '-',
      notes: notes.trim()
        ? [
            {
              text: notes.trim(),
              author: 'Người dùng hiện tại',
              timestamp: new Date()
                .toISOString()
                .slice(0, 16)
                .replace('T', ' '),
            },
          ]
        : [],
    }

    onSubmit(newBooking)
    handleResetAndClose()
  }

  // Dropdown options
  const contactSelectOptions = [
    ...contactsList.map((c) => ({
      value: c.id,
      label: `${c.name} - ${c.phone}`,
    })),
    { value: 'custom', label: '+ Thêm Contact / Phụ huynh mới' },
  ]

  const selectedContactObj = contactsList.find((c) => c.id === contactId)
  const childSelectOptions = [
    ...(selectedContactObj?.children.map((ch) => ({
      value: ch.id,
      label: `${ch.name} ${ch.dob ? `(${ch.dob})` : ''}`,
    })) || []),
    { value: 'custom_child', label: '+ Thêm con / học viên mới' },
  ]

  const schoolSelectOptions = (
    schoolOptions.length > 0 ? schoolOptions : ['RinoEdu Nguyễn Tuân']
  ).map((s) => ({
    value: s,
    label: s,
  }))

  const programOptions = Object.keys(PROGRAM_CONFIG).map((p) => ({
    value: p,
    label: p,
  }))

  const levelOptions = (PROGRAM_CONFIG[program]?.levels || []).map((l) => ({
    value: l,
    label: l,
  }))

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleResetAndClose()
        else onOpenChange(true)
      }}
    >
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto bg-[#f8fafc] dark:bg-zinc-900 opacity-100 px-6 py-4 gap-3 border-none shadow-xl">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base font-semibold">
            Tạo mới Đặt lịch đánh giá năng lực
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-1">
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* CỘT TRÁI (35% BỀ RỘNG) - THẺ TRẮNG KHÔNG VIỀN */}
            <div className="w-full md:w-[35%] shrink-0 space-y-3 bg-white dark:bg-zinc-950 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground pb-1">
                  Đối tượng & Chương trình
                </div>

                {/* chọn Contact / Phụ huynh */}
                <FieldLabel label="Contact / Phụ huynh" required>
                  <InlineSelect
                    value={contactId}
                    onValueChange={handleContactChange}
                    options={contactSelectOptions}
                    ariaLabel="Chọn phụ huynh"
                  />
                </FieldLabel>

                {/* Nếu chọn Contact có sẵn -> Chọn Con của họ */}
                {contactId !== 'custom' && selectedContactObj && (
                  <FieldLabel label="Con / Học viên" required>
                    <InlineSelect
                      value={childId}
                      onValueChange={setChildId}
                      options={childSelectOptions}
                      ariaLabel="Chọn con / học viên"
                    />
                  </FieldLabel>
                )}

                {/* Nếu thêm con mới dưới Contact hiện tại */}
                {contactId !== 'custom' && childId === 'custom_child' && (
                  <FieldLabel label="Tên con / Học viên mới" required>
                    <input
                      type="text"
                      value={customChildName}
                      onChange={(e) => setCustomChildName(e.target.value)}
                      placeholder="Nhập tên học viên..."
                      className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      required
                    />
                  </FieldLabel>
                )}

                {/* Nếu thêm Contact mới hoàn toàn */}
                {contactId === 'custom' && (
                  <div className="space-y-2 rounded-md bg-muted/30 p-2.5 border">
                    <div className="grid grid-cols-1 gap-2">
                      <FieldLabel label="Tên phụ huynh" required>
                        <input
                          type="text"
                          value={customParentName}
                          onChange={(e) => setCustomParentName(e.target.value)}
                          placeholder="Nhập tên phụ huynh..."
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                        />
                      </FieldLabel>
                      <FieldLabel label="SĐT phụ huynh" required>
                        <input
                          type="tel"
                          value={customPhone}
                          onChange={(e) => setCustomPhone(e.target.value)}
                          placeholder="Nhập SĐT phụ huynh..."
                          className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          required
                        />
                      </FieldLabel>
                    </div>
                    <FieldLabel label="Tên con / Học viên" required>
                      <input
                        type="text"
                        value={customChildName}
                        onChange={(e) => setCustomChildName(e.target.value)}
                        placeholder="Nhập tên con / học viên..."
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      />
                    </FieldLabel>
                  </div>
                )}

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
                <div className="space-y-2.5">
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

                {/* Ghi chú */}
                <FieldLabel label="Ghi chú">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Nhập ghi chú chi tiết..."
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </FieldLabel>
              </div>
            </div>

            {/* CỘT PHẢI (65% BỀ RỘNG) */}
            <div className="w-full md:w-[65%] min-w-0 flex flex-col space-y-3">
              {/* 4 Nút Chọn Ngày - THẺ TRẮNG KHÔNG VIỀN */}
              <div className="bg-white dark:bg-zinc-950 rounded-xl p-3.5 shadow-2xs">
                <FieldLabel label="Lựa chọn Ngày đánh giá & Ca test" required>
                  <div className="grid grid-cols-4 gap-2 pt-0.5">
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
                              ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
                              : 'bg-background hover:bg-muted text-foreground'
                          )}
                        >
                          {item.label}
                        </button>
                      )
                    })}

                    {/* Nút 4: Ngày khác (Mở Lịch chọn ngày trực tiếp) */}
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            'flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors text-center truncate cursor-pointer',
                            !isFirst3Selected
                              ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
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
                </FieldLabel>
              </div>

              {/* 2-COLUMN SPLIT VIEW: BÊN TRÁI CHỌN KHUNG GIỜ, BÊN PHẢI CHỌN GIÁO VIÊN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5 flex-1">
                {/* BẢNG TRÁI: DANH SÁCH KHUNG GIỜ - THẺ TRẮNG KHÔNG VIỀN */}
                <div className="rounded-xl p-3.5 bg-white dark:bg-zinc-950 shadow-2xs flex flex-col justify-between flex-1">
                  <div className="space-y-2 flex-1 flex flex-col">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-1 flex items-center justify-between">
                      <span>Khung giờ test</span>
                      <span className="text-primary font-semibold">{selectedSlot}</span>
                    </div>

                    <div className="space-y-2.5 flex-1 min-h-[300px] overflow-y-auto pr-1">
                      {TIME_GROUPS.map((group) => (
                        <div key={group.title} className="space-y-1">
                          <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                            <span>{group.icon}</span>
                            <span>{group.title}</span>
                          </span>

                          <div className="grid grid-cols-2 gap-1.5">
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
                                    'flex items-center justify-between rounded-md border px-2 py-1.5 text-xs transition-all cursor-pointer',
                                    isSlotSelected
                                      ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
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
                                        ? 'bg-primary-foreground/20 text-primary-foreground'
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

                {/* BẢNG PHẢI: DANH SÁCH NHÂN SỰ PHỤ TRÁCH - THẺ TRẮNG KHÔNG VIỀN */}
                <div className="rounded-xl p-3.5 bg-white dark:bg-zinc-950 shadow-2xs flex flex-col justify-between flex-1">
                  <div className="space-y-2 flex-1 flex flex-col">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pb-1 flex items-center justify-between">
                      <span>Phụ trách ca {selectedSlot}</span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {currentSlotTeachers.length} nhân sự
                      </span>
                    </div>

                    <div className="space-y-1.5 flex-1 min-h-[300px] overflow-y-auto pr-1">
                      {/* Lựa chọn 0: Chưa gán Phụ trách */}
                      <div
                        onClick={() => setTeacher('')}
                        className={cn(
                          'flex items-center justify-between rounded-md border p-2 cursor-pointer transition-all',
                          teacher === ''
                            ? 'border-amber-500 bg-amber-50/50 text-amber-900 dark:bg-amber-950/20 dark:text-amber-300 font-semibold ring-1 ring-amber-500/30'
                            : 'border-border bg-muted/20 hover:bg-muted/50 text-muted-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                            <UserX className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">Chưa gán Phụ trách</p>
                            <p className="text-[10px] opacity-75 truncate">Phân công nhân sự sau</p>
                          </div>
                        </div>
                        {teacher === '' && <Check className="h-4 w-4 text-amber-600 shrink-0" />}
                      </div>

                      {/* Danh sách các nhân sự phụ trách khả dụng */}
                      {currentSlotTeachers.map((t) => {
                        const isSelectedTeacher = teacher === t.name
                        return (
                          <div
                            key={t.id}
                            onClick={() => setTeacher(t.name)}
                            className={cn(
                              'flex items-center justify-between rounded-md border p-2 cursor-pointer transition-all',
                              isSelectedTeacher
                                ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30 shadow-xs'
                                : 'border-border bg-muted/20 hover:bg-muted/50 text-foreground'
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={cn(
                                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white',
                                  t.colorClass || 'bg-primary'
                                )}
                              >
                                {t.shortName}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-bold">{t.name}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span
                                    className={cn(
                                      'inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold',
                                      t.role === 'CS'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                        : t.role === 'Khác'
                                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                    )}
                                  >
                                    {t.role || 'Giáo viên'}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground font-normal truncate">
                                    • Ca {selectedSlot}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {isSelectedTeacher ? (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                                <Check className="h-2.5 w-2.5" />
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
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
            </div>
          </div>

          <DialogFooter className="pt-3 border-t mt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetAndClose}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm">
              Tạo lịch test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
