'use client'

import { useState, useMemo, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, BackButton } from '@/components/shared'
import { toast } from 'sonner'
import {
  addBookingTest,
  getBookingTests,
  type BookingTest,
} from '@/mocks/bookingTests'
import { mockStudents } from '@/mocks/students'
import {
  getDailySlotSummary,
  getDutyStaffForSlot,
} from '@/mocks/shiftRoster'
import {
  PROGRAM_CONFIG,
  TIME_SLOTS,
} from './bookingTestCreateTypes'
import { BookingTestCreateStudentForm } from './BookingTestCreateStudentForm'
import { BookingTestCreateScheduleSection } from './BookingTestCreateScheduleSection'
import { BookingTestCreateStaffSection } from './BookingTestCreateStaffSection'

interface ContactPerson {
  id: string
  name: string
  phone: string
  children: Array<{ id: string; name: string; dob?: string }>
}

export function BookingTestCreateScreen() {
  const router = useRouter()
  const bookings = useMemo(() => getBookingTests(), [])

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
  const initialProgram = 'Chương trình Station'
  const [program, setProgram] = useState(initialProgram)
  const [level, setLevel] = useState(
    PROGRAM_CONFIG[initialProgram]?.levels[0] || ''
  )

  const [school, setSchool] = useState('RinoEdu Nguyễn Tuân')
  const [teacher, setTeacher] = useState('Sarah J.')
  const [testDate, setTestDate] = useState(dateOptions.first3[0]?.dateStr || '')
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1] || '08:30')
  const [notes, setNotes] = useState('')

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

  const handleSlotSelection = (slot: string) => {
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
  }

  const handleCancel = () => {
    router.push('/app/booking_test')
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

    addBookingTest(newBooking)
    toast.success(`Đã tạo lịch test thành công cho ${newBooking.childName}`)
    router.push('/app/booking_test')
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
    { value: 'custom_child', label: '+ Thêm con / học viên mới' },
    ...(selectedContactObj?.children.map((ch) => ({
      value: ch.id,
      label: `${ch.name} ${ch.dob ? `(${ch.dob})` : ''}`,
    })) || []),
  ]

  const schoolSelectOptions = [
    'RinoEdu Nguyễn Tuân',
    'RinoEdu Cầu Giấy',
    'RinoEdu Linh Đàm',
    'RinoEdu Đống Đa',
  ].map((s) => ({
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
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Header Bar chuẩn Design System */}
      <div className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <BackButton onClick={handleCancel} />
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              Tạo mới Đặt lịch đánh giá năng lực
            </h1>
            <p className="text-xs text-muted-foreground">
              Đặt lịch kiểm tra đầu vào và phân bổ nhân sự trực ca tại chi nhánh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="booking-create-form"
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Tạo lịch test
          </Button>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6">
        <form
          id="booking-create-form"
          onSubmit={handleSubmit}
          className="mx-auto max-w-7xl space-y-4"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* CỘT TRÁI: ĐỐI TƯỢNG & CHƯƠNG TRÌNH */}
            <BookingTestCreateStudentForm
              className="w-full lg:w-[380px] xl:w-[420px] shrink-0 space-y-3 bg-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between"
              contactId={contactId}
              onContactChange={handleContactChange}
              contactsList={contactsList}
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


            {/* CỘT PHẢI: LỊCH ĐÁNH GIÁ VÀ NHÂN SỰ TRỰC CA */}
            <div className="flex-1 min-w-0 flex flex-col space-y-4">
              <BookingTestCreateScheduleSection
                testDate={testDate}
                onTestDateChange={setTestDate}
                selectedSlot={selectedSlot}
                onSlotChange={handleSlotSelection}
                dateOptions={dateOptions}
                dailySlotsSummary={dailySlotsSummary}
              />

              <BookingTestCreateStaffSection
                selectedSlot={selectedSlot}
                teacher={teacher}
                onTeacherChange={setTeacher}
                currentSlotStaffList={currentSlotStaffList}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

