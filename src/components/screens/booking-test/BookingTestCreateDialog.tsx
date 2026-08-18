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
import { FieldLabel } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { BookingTest } from '@/mocks/bookingTests'
import { mockStudents } from '@/mocks/students'
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

export {
  PROGRAM_CONFIG,
  TIME_SLOTS,
  TIME_GROUPS,
  MOCK_TEACHERS,
}
export type { TeacherAvatarItem } from './bookingTestCreateTypes'

interface BookingTestCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  schoolOptions: string[]
  teacherOptions: string[]
  activeSubject: string
  bookings?: BookingTest[]
  onSubmit: (newBooking: BookingTest) => void
}

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
  bookings = [],
  onSubmit,
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

  // Trường thông tin tự nhập
  const [customParentName, setCustomParentName] = useState('')
  const [customPhone, setCustomPhone] = useState('')
  const [customChildName, setCustomChildName] = useState('')

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
    if (contactId === 'custom') {
      return customChildName.trim() || 'Học viên mới'
    }
    if (childId === 'custom_child') {
      return customChildName.trim() || 'Học viên mới'
    }
    const foundChild = selectedContactObj?.children.find((c) => c.id === childId)
    return foundChild ? foundChild.name : 'Học viên mới'
  }, [contactId, childId, customChildName, selectedContactObj])

  const currentParentName = useMemo(() => {
    if (contactId === 'custom' || !selectedContactObj) {
      return customParentName.trim() || 'Phụ huynh khách hàng'
    }
    return selectedContactObj.name
  }, [contactId, selectedContactObj, customParentName])

  const currentPhone = useMemo(() => {
    if (contactId === 'custom' || !selectedContactObj) {
      return customPhone.trim() || '0900000000'
    }
    return selectedContactObj.phone
  }, [contactId, selectedContactObj, customPhone])

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

  // Dropdown options
  const contactSelectOptions = [
    ...contactsList.map((c) => ({
      value: c.id,
      label: `${c.name} - ${c.phone}`,
    })),
    { value: 'custom', label: '+ Thêm Contact / Phụ huynh mới' },
  ]

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

  const availableStaffCount = currentSlotStaffList.filter((s) => s.isAvailable).length

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleResetAndClose()
        else onOpenChange(true)
      }}
    >
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl w-[92vw] max-h-[92vh] overflow-y-auto bg-[#f8fafc] dark:bg-zinc-900 opacity-100 px-5 pt-3.5 pb-2.5 gap-2 border-none shadow-xl">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-base font-semibold">
            Tạo mới Đặt lịch đánh giá năng lực
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2 py-0">
          <div className="flex flex-col md:flex-row gap-3.5 items-stretch">
            {/* CỘT TRÁI: ĐỐI TƯỢNG & CHƯƠNG TRÌNH */}
            <BookingTestCreateStudentForm
              contactId={contactId}
              onContactChange={handleContactChange}
              contactSelectOptions={contactSelectOptions}
              selectedContactObj={selectedContactObj}
              childId={childId}
              onChildChange={setChildId}
              childSelectOptions={childSelectOptions}
              customChildName={customChildName}
              onCustomChildNameChange={setCustomChildName}
              customParentName={customParentName}
              onCustomParentNameChange={setCustomParentName}
              customPhone={customPhone}
              onCustomPhoneChange={setCustomPhone}
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
              <div className="bg-white dark:bg-zinc-950 rounded-xl p-2.5 shadow-2xs">
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
                            'flex items-center justify-center rounded-md border px-2 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer',
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
                            'flex items-center justify-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors text-center truncate cursor-pointer',
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

              {/* SECTION 2: KHUNG GIỜ TEST (30 PHÚT/CA) - HIỂN THỊ FULL TOÀN BỘ CÁC CA */}
              <div className="rounded-xl p-3 bg-white dark:bg-zinc-950 shadow-2xs space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between pb-0.5 border-b border-border/50">
                  <span>Khung giờ test (30 phút/ca)</span>
                  <span className="text-primary font-bold text-xs">Ca đang chọn: {selectedSlot}</span>
                </div>

                <div className="space-y-2.5">
                  {TIME_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1">
                      <div className="text-[10.5px] font-semibold text-muted-foreground flex items-center gap-1">
                        <span>{group.icon}</span>
                        <span>{group.title}</span>
                        <span className="text-[9.5px] text-muted-foreground font-normal">({group.slots.length} ca)</span>
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
                                'flex items-center justify-between rounded-md border px-2 py-1 text-xs transition-all cursor-pointer h-[32px]',
                                isSlotSelected
                                  ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs ring-1 ring-primary/40'
                                  : availableCount > 0
                                  ? 'border-border bg-muted/20 hover:bg-muted text-foreground'
                                  : 'border-border/60 bg-muted/10 text-muted-foreground opacity-60 hover:opacity-90'
                              )}
                            >
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 opacity-70 shrink-0" />
                                <span>{slot}</span>
                              </span>
                              <span
                                className={cn(
                                  'text-[9px] px-1.5 py-0.2 rounded font-medium',
                                  isSlotSelected
                                    ? 'bg-primary-foreground/20 text-primary-foreground'
                                    : availableCount > 0
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold'
                                    : 'bg-muted text-muted-foreground font-normal'
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

              {/* SECTION 3: PHỤ TRÁCH CA ĐÃ CHỌN - ĐẶT THÀNH SECTION DƯỚI CÙNG CỐ ĐỊNH CHIỀU CAO THẺ */}
              <div className="rounded-xl p-3 bg-white dark:bg-zinc-950 shadow-2xs space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between pb-0.5 border-b border-border/50">
                  <span>Phụ trách ca {selectedSlot}</span>
                  <span className="text-[11px] text-muted-foreground font-normal">
                    <span className="font-semibold text-foreground">{availableStaffCount}</span>/{currentSlotStaffList.length} nhân sự rảnh
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {/* Lựa chọn 0: Chưa gán Phụ trách */}
                  <div
                    onClick={() => setTeacher('')}
                    className={cn(
                      'flex items-center justify-between rounded-lg border p-2 h-[54px] cursor-pointer transition-all',
                      teacher === ''
                        ? 'border-amber-500 bg-amber-50/60 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200 font-semibold ring-1 ring-amber-500/40 shadow-2xs'
                        : 'border-border bg-muted/20 hover:bg-muted/50 text-muted-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                        <UserX className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate">Chưa gán Phụ trách</p>
                        <p className="text-[10px] text-muted-foreground opacity-75 truncate">Phân công nhân sự sau</p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-1">
                      {teacher === '' && <Check className="h-4 w-4 text-amber-600 shrink-0" />}
                    </div>
                  </div>

                  {/* Danh sách các nhân sự phụ trách */}
                  {currentSlotStaffList.map((item) => {
                    const t = item.employee
                    const isSelectedTeacher = teacher === t.name
                    const isAvailable = item.isAvailable

                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          if (isAvailable) {
                            setTeacher(t.name)
                          }
                        }}
                        className={cn(
                          'flex items-center justify-between rounded-lg border p-2 h-[54px] transition-all',
                          !isAvailable
                            ? 'opacity-65 cursor-not-allowed bg-muted/10 border-dashed'
                            : 'cursor-pointer',
                          isSelectedTeacher && isAvailable
                            ? 'border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/30 shadow-2xs'
                            : isAvailable
                            ? 'border-border bg-muted/20 hover:bg-muted/50 text-foreground'
                            : ''
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className={cn(
                              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white',
                              t.colorClass || 'bg-primary'
                            )}
                          >
                            {t.shortName}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="truncate text-xs font-bold">{t.name}</p>
                              <span
                                className={cn(
                                  'inline-block text-[9px] px-1.5 py-0.2 rounded font-semibold border shrink-0',
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
                              <p className="text-[10px] text-muted-foreground truncate">Khả dụng trực ca</p>
                            ) : (
                              <p className="text-[10px] text-rose-600 dark:text-rose-400 font-medium truncate" title={item.conflictDetail}>
                                ⚠️ {item.conflictDetail || 'Đang bận lịch khác'}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 ml-1">
                          {isSelectedTeacher && isAvailable ? (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          ) : isAvailable ? (
                            <span className="text-[9px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                              Rảnh
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-rose-600 bg-rose-50 dark:bg-rose-950 px-1.5 py-0.5 rounded border border-rose-200 shrink-0">
                              Bận
                            </span>
                          )}
                        </div>
                      </div>
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
