'use client'

import { useState, useMemo, type FormEvent } from 'react'
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
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
import { FieldLabel, PersonnelHoverCard, type PersonnelItem } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { cn } from '@/lib/utils'
import type { BookingTest } from '@/mocks/bookingTests'
import { mockStudents } from '@/mocks/students'
import { mockLeads } from '@/mocks/crmLeads'
import { mockEmployees } from '@/mocks/employees'
import {
  getDailySlotSummary,
  getDutyStaffForSlot,
} from '@/mocks/shiftRoster'
import {
  PROGRAM_CONFIG,
  TIME_SLOTS,
  TIME_GROUPS,
  MOCK_TEACHERS,
} from './bookingTestCreateTypes'
import { BookingTestCreateStudentForm } from './BookingTestCreateStudentForm'
import type { ContactPerson } from './ContactSearchableSelect'

export {
  PROGRAM_CONFIG,
  TIME_SLOTS,
  TIME_GROUPS,
  MOCK_TEACHERS,
}
export type { TeacherAvatarItem } from './bookingTestCreateTypes'

export interface BookingTestInitialData {
  parentName?: string
  parentRole?: string
  phone?: string
  address?: string
  childName?: string
  dob?: string
  age?: number | string
  currentSchool?: string
  academicPerformance?: string
  school?: string
  program?: string
  level?: string
  notes?: string
}

interface BookingTestCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schoolOptions?: string[]
  teacherOptions?: string[]
  activeSubject?: string
  bookings?: BookingTest[]
  onSubmit: (newBooking: BookingTest) => void
  initialData?: BookingTestInitialData | null
}

const DEFAULT_SCHOOLS = [
  'RinoEdu Nguyễn Tuân',
  'Chi nhánh Quận 1',
  'Chi nhánh Cầu Giấy',
  'RinoEdu Smart City',
]

const DEFAULT_TEACHERS = [
  'Sarah J.',
  'Robert L.',
  'Emily W.',
  'Phạm Văn Giang',
  'Trần Thị Mai',
]

export function BookingTestCreateDialog({
  open,
  onOpenChange,
  schoolOptions = DEFAULT_SCHOOLS,
  teacherOptions = DEFAULT_TEACHERS,
  activeSubject = 'all',
  bookings = [],
  onSubmit,
  initialData,
}: BookingTestCreateDialogProps) {
  // 1. 3 Ngày đầu tiên (Hôm nay, Ngày mai, Ngày kia) + Min date cho Ngày khác
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

  // 2. Gom nhóm danh sách Contact (Phụ huynh) và Con từ mockLeads + mockStudents
  const contactsList = useMemo<ContactPerson[]>(() => {
    const map = new Map<string, ContactPerson>()

    // Contact từ mockLeads
    mockLeads.forEach((lead) => {
      if (!lead.parentName) return
      const pName = lead.parentName
      const pPhone = lead.phone || '0900000000'
      const key = `${pName}_${pPhone}`

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: pName,
          role: lead.parentRole || 'Mẹ',
          phone: pPhone,
          address: lead.address,
          children: [],
        })
      }

      const contact = map.get(key)!
      if (lead.address && !contact.address) {
        contact.address = lead.address
      }

      const childKey = `lead_child_${lead.id}`
      if (!contact.children.some((c) => c.name === lead.studentName)) {
        contact.children.push({
          id: childKey,
          name: lead.studentName,
          dob: lead.birthYear ? `01/01/${lead.birthYear}` : undefined,
          age: lead.studentAge,
          currentSchool: lead.schoolName || 'Tiểu học Lương Định Của (Quận 3)',
          academicPerformance: lead.academicAbility || lead.academicPerformance || 'Giỏi / Tốt nghiệp loại Ưu',
        })
      }
    })

    // Contact từ mockStudents
    mockStudents.forEach((student) => {
      const pName = student.parentName || `Phụ huynh ${student.name}`
      const pPhone = student.parentPhone || student.phone || '0900000000'
      const key = `${pName}_${pPhone}`

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: pName,
          role: 'Mẹ',
          phone: pPhone,
          address: 'Phường Võ Thị Sáu, Quận 3, TP.HCM',
          children: [],
        })
      }

      const contact = map.get(key)!
      if (!contact.children.some((c) => c.id === student.id)) {
        let calcAge: number | undefined
        if (student.dob) {
          const birthYear = parseInt(student.dob.slice(0, 4), 10)
          if (!isNaN(birthYear)) {
            calcAge = 2026 - birthYear
          }
        }
        contact.children.push({
          id: student.id,
          name: student.name,
          dob: student.dob,
          age: calcAge || 8,
          currentSchool: 'Tiểu học Lương Định Của (Quận 3)',
          academicPerformance: 'Giỏi / Tốt nghiệp loại Ưu',
        })
      }
    })

    return Array.from(map.values())
  }, [])

  const [contactId, setContactId] = useState('')
  const [childId, setChildId] = useState('')

  // Chương trình & Level
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
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1] || '08:30')
  const [notes, setNotes] = useState('')
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  // Đồng bộ thông tin khi mở với dữ liệu khởi tạo từ Lead hoặc bên ngoài (React 19 render-time adjustment)
  const [prevKey, setPrevKey] = useState<{ open: boolean; initialData?: BookingTestInitialData | null }>({
    open: false,
    initialData: null,
  })

  if (prevKey.open !== open || prevKey.initialData !== initialData) {
    setPrevKey({ open, initialData })
    if (open && initialData) {
      if (initialData.school) {
        setSchool(initialData.school)
      }
      if (initialData.program) {
        setProgram(initialData.program)
        const levels = PROGRAM_CONFIG[initialData.program]?.levels || []
        setLevel(initialData.level && levels.includes(initialData.level) ? initialData.level : (levels[0] || ''))
      }
      if (initialData.notes) {
        setNotes(initialData.notes)
      }
    }
  }

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

  // Mapping danh sách các khung giờ và số lượng nhân sự trực thực tế từ Shift Roster & Conflict Engine
  const dailySlotsSummary = useMemo(() => {
    return getDailySlotSummary({
      school,
      dateStr: testDate,
      extraBookings: bookings,
    })
  }, [school, testDate, bookings])

  // Danh sách nhân sự phụ trách được phân bổ cho ca đang chọn (selectedSlot)
  const currentSlotStaffList = useMemo(() => {
    return getDutyStaffForSlot({
      school,
      dateStr: testDate,
      slotTime: selectedSlot,
      extraBookings: bookings,
    })
  }, [school, testDate, selectedSlot, bookings])

  const isFirst3Selected = dateOptions.first3.some((d) => d.dateStr === testDate)

  const selectedContactObj = contactsList.find((c) => c.id === contactId)

  const currentChildName = useMemo(() => {
    if (initialData?.childName) return initialData.childName
    const foundChild = selectedContactObj?.children.find((c) => c.id === childId)
    return foundChild ? foundChild.name : 'Học viên'
  }, [initialData, selectedContactObj, childId])

  const currentParentName = useMemo(() => {
    if (initialData?.parentName) return initialData.parentName
    return selectedContactObj ? selectedContactObj.name : 'Phụ huynh'
  }, [initialData, selectedContactObj])

  const currentPhone = useMemo(() => {
    if (initialData?.phone) return initialData.phone
    return selectedContactObj ? selectedContactObj.phone : '0900000000'
  }, [initialData, selectedContactObj])

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
    setNotes('')
    onOpenChange(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const currentProgramConfig =
      PROGRAM_CONFIG[program] || PROGRAM_CONFIG['Chương trình Station']
    const subject = currentProgramConfig.subject

    const newBooking: BookingTest = {
      id: `E${Math.floor(1000 + Math.random() * 9000)}`,
      childName: currentChildName,
      familyName: `Gia đình ${currentParentName}`,
      phone: currentPhone,
      familyMembers: [
        {
          name: `${currentParentName} (Phụ huynh)`,
          phone: currentPhone,
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

  const childSelectOptions = selectedContactObj
    ? [
        ...selectedContactObj.children.map((ch) => ({
          value: ch.id,
          label: `${ch.name} ${ch.age ? `(${ch.age} tuổi${ch.dob ? ` - ${ch.dob}` : ''})` : ch.dob ? `(${ch.dob})` : ''}`,
        })),
        { value: 'custom_child', label: '+ Thêm con / học viên mới' },
      ]
    : []

  const DIALOG_CENTER_DATA = [
    {
      name: 'RinoEdu Linh Đàm',
      distance: '1.2 km',
      address: 'Tầng 3, TTTM Rice City, Linh Đàm, Hoàng Mai',
    },
    {
      name: 'RinoEdu Nguyễn Tuân',
      distance: '2.8 km',
      address: 'Số 90 Nguyễn Tuân, Thanh Xuân',
    },
    {
      name: 'RinoEdu Đống Đa',
      distance: '4.5 km',
      address: 'Số 142 Hào Nam, Đống Đa',
    },
    {
      name: 'RinoEdu Cầu Giấy',
      distance: '6.3 km',
      address: 'Tòa Discovery Complex, 302 Cầu Giấy',
    },
  ]

  const schoolSelectOptions = (
    schoolOptions.length > 0 && !schoolOptions.includes('RinoEdu Linh Đàm')
      ? schoolOptions.map((s) => ({
          name: s,
          distance: '2.0 km',
          address: 'Cơ sở đào tạo RinoEdu',
        }))
      : DIALOG_CENTER_DATA
  ).map((c) => ({
    value: c.name,
    textValue: c.name,
    label: (
      <div className="flex flex-col w-full py-0.5 min-w-0">
        <div className="flex items-center justify-between w-full gap-2">
          <span className="font-medium text-foreground text-xs">{c.name}</span>
          <span className="text-muted-foreground font-normal tabular-nums shrink-0 text-xs">
            {c.distance}
          </span>
        </div>
        <span className="text-[11.5px] text-muted-foreground/75 truncate font-normal leading-normal mt-0.5">
          {c.address}
        </span>
      </div>
    ),
    selectedLabel: (
      <div className="flex items-center justify-between w-full gap-2 text-xs">
        <span className="truncate font-medium text-foreground">{c.name}</span>
        <span className="text-muted-foreground font-normal tabular-nums shrink-0 text-xs">
          {c.distance}
        </span>
      </div>
    ),
  }))

  const programOptions = Object.keys(PROGRAM_CONFIG).map((p) => ({
    value: p,
    label: p,
  }))

  const levelOptions = (PROGRAM_CONFIG[program]?.levels || []).map((l) => ({
    value: l,
    label: l,
  }))

  const availableStaffCount = currentSlotStaffList.filter((s) => s.isAvailable).length

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleResetAndClose()
        else onOpenChange(true)
      }}
    >
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-[92vw] max-h-[92vh] overflow-y-auto bg-background px-5 pt-3.5 pb-2.5 gap-2 border border-border/70 shadow-lg">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-base font-semibold">
            Tạo mới Đặt lịch đánh giá năng lực
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2 py-0">
          <div className="flex flex-col md:flex-row gap-3.5 items-stretch">
            {/* CỘT TRÁI: ĐỐI TƯỢNG & CHƯƠNG TRÌNH */}
            <BookingTestCreateStudentForm
              leadInfo={
                initialData?.parentName && initialData?.childName
                  ? {
                      parentName: initialData.parentName,
                      parentRole: initialData.parentRole || 'Mẹ',
                      phone: initialData.phone || '',
                      address: initialData.address,
                      childName: initialData.childName,
                      dob: initialData.dob,
                      age: initialData.age,
                      currentSchool: initialData.currentSchool,
                      academicPerformance: initialData.academicPerformance,
                    }
                  : null
              }
              contactId={contactId}
              onContactChange={handleContactChange}
              selectedContactObj={selectedContactObj}
              childId={childId}
              onChildChange={setChildId}
              childSelectOptions={childSelectOptions}
              school={school}
              onSchoolChange={setSchool}
              schoolSelectOptions={schoolSelectOptions}
              program={program}
              onProgramChange={setProgram}
              programOptions={programOptions}
              level={level}
              onLevelChange={setLevel}
              levelOptions={levelOptions}
              notes={notes}
              onNotesChange={setNotes}
            />

            {/* CỘT PHẢI (65% BỀ RỘNG) - BỐ CỤC DỌC TOÀN BỘ, KHÔNG CHIA ĐÔI */}
            <div className="w-full md:w-[65%] min-w-0 flex flex-col space-y-2">
              {/* SECTION 1: 4 NÚT CHỌN NGÀY */}
              <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-1">
                <FieldLabel label="Lựa chọn Ngày đánh giá & Ca test" required>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-0.5">
                    {dateOptions.first3.map((item) => {
                      const isSelected = testDate === item.dateStr
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => setTestDate(item.dateStr)}
                          className={cn(
                            'flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer h-8',
                            isSelected
                              ? 'bg-primary text-primary-foreground border-primary shadow-xs font-semibold'
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
                            'flex items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer h-8',
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

              {/* SECTION 2: KHUNG GIỜ TEST (30 PHÚT/CA) */}
              <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between pb-1 border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Khung giờ test</span>
                  </div>
                  {selectedSlot && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      Ca: {selectedSlot}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {TIME_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <span>{group.icon}</span>
                        <span>{group.title}</span>
                        <span className="text-xs text-muted-foreground font-normal">({group.slots.length} ca)</span>
                      </div>

                      {/* Lưới 4 cột rộng rãi cho các ca test */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {group.slots.map((slot) => {
                          const isSlotSelected = selectedSlot === slot
                          const slotSummary = dailySlotsSummary.find((s) => s.slot === slot)
                          const availableCount = slotSummary ? slotSummary.availableCount : 0

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot)
                                const nextStaff = getDutyStaffForSlot({
                                  school,
                                  dateStr: testDate,
                                  slotTime: slot,
                                  extraBookings: bookings,
                                })
                                const availableStaff = nextStaff.filter((s) => s.isAvailable)
                                if (availableStaff.length > 0 && !availableStaff.some((s) => s.employee.name === teacher)) {
                                  setTeacher(availableStaff[0].employee.name)
                                }
                              }}
                              className={cn(
                                'flex items-center justify-between rounded-md border px-2 py-1 text-xs transition-all cursor-pointer h-8',
                                isSlotSelected
                                  ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary/40'
                                  : availableCount > 0
                                  ? 'border-border/70 bg-background hover:bg-muted/50 text-foreground'
                                  : 'border-border/50 bg-background/50 text-muted-foreground opacity-60 hover:opacity-90'
                              )}
                            >
                              <span className="font-semibold text-xs tabular-nums shrink-0">
                                {slot}
                              </span>
                              <span
                                className={cn(
                                  'text-xs font-medium shrink-0 ml-1 transition-colors truncate',
                                  isSlotSelected
                                    ? 'bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.2 rounded font-semibold'
                                    : availableCount > 0
                                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                                    : 'text-muted-foreground font-normal'
                                )}
                              >
                                {availableCount > 0 ? `${availableCount} rảnh` : 'Hết chỗ'}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: PHỤ TRÁCH CA ĐÃ CHỌN */}
              <div className="rounded-lg border border-border/70 bg-background p-2.5 space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1 border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <UserX className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Phụ trách ca {selectedSlot}
                    </span>
                    <span className="text-xs text-muted-foreground font-normal">
                      (<span className="font-semibold text-foreground">{availableStaffCount}</span>/{currentSlotStaffList.length} rảnh)
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Trung tâm:</span>
                    <div className="w-[180px] sm:w-[200px]">
                      <InlineSelect
                        value={school}
                        onValueChange={setSchool}
                        options={schoolSelectOptions}
                        placeholder="Chọn trung tâm"
                        ariaLabel="Chọn trung tâm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {/* Lựa chọn 0: Chưa gán Phụ trách */}
                  <div
                    onClick={() => setTeacher('')}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-2 h-[50px] cursor-pointer transition-all',
                      teacher === ''
                        ? 'border-amber-500 bg-amber-50/60 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 font-semibold ring-1 ring-amber-500/40'
                        : 'border-border/70 bg-background hover:bg-muted/40 text-muted-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                        <UserX className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate leading-tight">Chưa gán Phụ trách</p>
                        <p className="text-xs text-muted-foreground opacity-75 truncate leading-tight mt-0.5">Phân công sau</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-1">
                      {teacher === '' && <Check className="h-3.5 w-3.5 text-amber-600 shrink-0" />}
                    </div>
                  </div>

                  {/* Danh sách các nhân sự phụ trách */}
                  {currentSlotStaffList.map((item) => {
                    const t = item.employee
                    const isSelectedTeacher = teacher === t.name
                    const isAvailable = item.isAvailable
                    const emp = mockEmployees.find((e) => e.name.toLowerCase() === t.name.toLowerCase())
                    const nameInitials = t.name.split(' ').map((n) => n[0]).join('').toUpperCase()
                    const personItem: PersonnelItem = {
                      id: emp?.id ? `EMP-${emp.id.toUpperCase()}` : `EMP-${nameInitials}`,
                      name: t.name,
                      avatar: emp?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(t.name)}`,
                      role: emp?.position || t.role || 'Giáo viên',
                      phone: emp?.phone || '0901 223 344',
                      email: emp?.email || `${t.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.com`,
                    }

                    return (
                      <PersonnelHoverCard key={t.id} person={personItem} align="start">
                        <div
                          onClick={() => {
                            if (isAvailable) {
                              setTeacher(t.name)
                            }
                          }}
                          className={cn(
                            'flex items-center justify-between rounded-lg border p-2 h-[50px] transition-all',
                            !isAvailable
                              ? 'opacity-65 cursor-not-allowed bg-background/50 border-dashed'
                              : 'cursor-pointer',
                            isSelectedTeacher && isAvailable
                              ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30'
                              : isAvailable
                              ? 'border-border/70 bg-background hover:bg-muted/40 text-foreground'
                              : 'border-border/50 bg-background/50 text-muted-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
                                t.colorClass || 'bg-primary'
                              )}
                            >
                              {t.shortName}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 min-w-0">
                                <p className="truncate text-xs font-semibold leading-tight">{t.name}</p>
                                <span
                                  className={cn(
                                    'inline-block text-xs px-1 py-0 rounded font-medium border shrink-0 leading-none',
                                    t.role === 'CS'
                                      ? 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                      : t.role === 'Khác'
                                      ? 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                      : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800'
                                  )}
                                >
                                  {t.role || 'Giáo viên'}
                                </span>
                              </div>
                              {isAvailable ? (
                                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate leading-tight mt-0.5">
                                  Rảnh
                                </p>
                              ) : (
                                <p
                                  className="text-xs font-medium text-rose-600 dark:text-rose-400 truncate leading-tight mt-0.5"
                                  title={item.conflictDetail}
                                >
                                  Bận{item.conflictDetail ? ` · ${item.conflictDetail}` : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="shrink-0 ml-1">
                            {isSelectedTeacher && isAvailable && (
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                                <Check className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      </PersonnelHoverCard>
                    )
                  })}

                  {currentSlotStaffList.length === 0 && (
                    <div className="col-span-full py-3 text-center text-xs text-muted-foreground">
                      Chưa có nhân sự nào được phân bổ trực ca này tại cơ sở.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-1.5 pb-0 gap-2 mt-0">
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
