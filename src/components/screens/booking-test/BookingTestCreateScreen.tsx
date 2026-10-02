'use client'

import { useState, useMemo, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/shared'
import { toast } from 'sonner'
import {
  addBookingTest,
  getBookingTests,
  type BookingTest,
} from '@/mocks/bookingTests'
import { mockStudents } from '@/mocks/students'
import { mockLeads, updateLead, type Lead } from '@/mocks/crmLeads'
import { mapLeadSubjectToBookingProgram } from '@/components/screens/crm-leads/crmLeadsHelpers'
import { CrmCustomerCreateDialog } from '@/components/screens/crm-leads/CrmCustomerCreateDialog'
import {
  getDailySlotSummary,
  getDutyStaffForSlot,
  getBranchTeachersDailySummary,
} from '@/mocks/shiftRoster'
import {
  PROGRAM_CONFIG,
  TIME_SLOTS,
} from './bookingTestCreateTypes'
import { BookingTestCreateStudentForm } from './BookingTestCreateStudentForm'
import { BookingTestCreateScheduleSection } from './BookingTestCreateScheduleSection'
import { BookingTestCreateStaffSection } from './BookingTestCreateStaffSection'
import { BookingTestAddChildDialog, type NewChildData } from './BookingTestAddChildDialog'
import type { ContactPerson } from './ContactSearchableSelect'

export function BookingTestCreateScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramLeadId = searchParams.get('leadId')
  const paramStudentName = searchParams.get('studentName')
  const paramParentName = searchParams.get('parentName')
  const paramPhone = searchParams.get('phone')
  const paramBranch = searchParams.get('branch')
  const paramSubject = searchParams.get('subject')

  const leadInfo = useMemo(() => {
    if (paramLeadId) {
      const lead = mockLeads.find((l) => l.id === paramLeadId)
      if (lead) {
        return {
          parentName: lead.parentName,
          parentRole: lead.parentRole || 'Mẹ',
          phone: lead.phone,
          address: lead.address,
          childName: lead.studentName,
          dob: lead.birthYear ? `01/01/${lead.birthYear}` : undefined,
          age: lead.studentAge,
          currentSchool: lead.schoolName || 'Tiểu học Lương Định Của (Quận 3)',
          academicPerformance: lead.academicAbility || lead.academicPerformance || 'Giỏi / Tốt nghiệp loại Ưu',
          school: lead.branch || 'RinoEdu Nguyễn Tuân',
          program: mapLeadSubjectToBookingProgram(lead.targetSubject),
          notes: lead.lastNote || '',
        }
      }
    }
    if (paramStudentName && paramParentName) {
      return {
        parentName: paramParentName,
        parentRole: 'Mẹ',
        phone: paramPhone || '',
        address: 'Phường Võ Thị Sáu, Quận 3, TP.HCM',
        childName: paramStudentName,
        age: 8,
        dob: '15/05/2018',
        currentSchool: 'Tiểu học Lương Định Của (Quận 3)',
        academicPerformance: 'Giỏi / Tốt nghiệp loại Ưu',
        school: paramBranch || 'RinoEdu Nguyễn Tuân',
        program: mapLeadSubjectToBookingProgram(paramSubject || ''),
        notes: '',
      }
    }
    return null
  }, [paramLeadId, paramStudentName, paramParentName, paramPhone, paramBranch, paramSubject])

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

  // 2. Danh sách Contact (Phụ huynh) và Con từ mockStudents + customContacts
  const [customContacts, setCustomContacts] = useState<ContactPerson[]>([])
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false)

  const contactsList = useMemo<ContactPerson[]>(() => {
    const map = new Map<string, ContactPerson>()

    // Contact tùy chỉnh/tạo mới qua modal
    customContacts.forEach((c) => {
      map.set(c.id, c)
    })

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
  }, [customContacts])

  const [contactId, setContactId] = useState(leadInfo ? 'lead_contact' : '')
  const [childId, setChildId] = useState(leadInfo ? 'lead_child' : '')

  // Chương trình & Level (rỗng khi tạo mới độc lập)
  const [program, setProgram] = useState(leadInfo?.program || '')
  const [level, setLevel] = useState('')

  const handleProgramChange = (newProgram: string) => {
    setProgram(newProgram)
    setLevel('')
  }

  const [school, setSchool] = useState(leadInfo?.school || 'RinoEdu Linh Đàm')
  const [teacher, setTeacher] = useState('')
  const [testDate, setTestDate] = useState(dateOptions.first3[0]?.dateStr || '')
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1] || '08:30')
  const [notes, setNotes] = useState(leadInfo?.notes || '')

  // Chi nhánh dùng để tra cứu ca trực (fallback Nguyễn Tuân nếu chưa chọn cơ sở)
  const activeSchoolForRoster = school || 'RinoEdu Nguyễn Tuân'
  const activeSubject = program ? PROGRAM_CONFIG[program]?.subject : undefined

  // Mapping danh sách các khung giờ và số lượng nhân sự trực thực tế từ Shift Roster & Conflict Engine
  const dailySlotsSummary = useMemo(() => {
    return getDailySlotSummary({
      school: activeSchoolForRoster,
      dateStr: testDate,
      subject: activeSubject,
      extraBookings: bookings,
    })
  }, [activeSchoolForRoster, testDate, activeSubject, bookings])

  // Danh sách nhân sự phụ trách được phân bổ cho ca đang chọn (selectedSlot)
  const currentSlotStaffList = useMemo(() => {
    return getDutyStaffForSlot({
      school: activeSchoolForRoster,
      dateStr: testDate,
      slotTime: selectedSlot,
      subject: activeSubject,
      extraBookings: bookings,
    })
  }, [activeSchoolForRoster, testDate, selectedSlot, activeSubject, bookings])

  // Tổng hợp lịch rảnh của tất cả giáo viên chi nhánh trong ngày (cho chế độ Teacher-First)
  const dayStaffList = useMemo(() => {
    return getBranchTeachersDailySummary({
      school: activeSchoolForRoster,
      dateStr: testDate,
      subject: activeSubject,
      extraBookings: bookings,
    })
  }, [activeSchoolForRoster, testDate, activeSubject, bookings])

  // Map xung đột các slot của giáo viên đang chọn
  const teacherSlotConflicts = useMemo(() => {
    if (!teacher) return {}
    const foundTeacher = dayStaffList.find((s) => s.employee.name.toLowerCase() === teacher.toLowerCase())
    return foundTeacher?.conflictSlots || {}
  }, [dayStaffList, teacher])

  const selectedContactObj = contactsList.find((c) => c.id === contactId)

  const currentChildName = useMemo(() => {
    if (leadInfo) return leadInfo.childName
    const foundChild = selectedContactObj?.children.find((c) => c.id === childId)
    return foundChild ? foundChild.name : ''
  }, [leadInfo, selectedContactObj, childId])

  const currentParentName = useMemo(() => {
    if (leadInfo) return leadInfo.parentName
    return selectedContactObj ? selectedContactObj.name : ''
  }, [leadInfo, selectedContactObj])

  const currentPhone = useMemo(() => {
    if (leadInfo) return leadInfo.phone
    return selectedContactObj ? selectedContactObj.phone : ''
  }, [leadInfo, selectedContactObj])

  // Khi đổi Contact: tự động chọn đứa con đầu tiên của Contact đó (hoặc để chọn con)
  const handleContactChange = (newContactId: string) => {
    setContactId(newContactId)
    const contact = contactsList.find((c) => c.id === newContactId)
    if (contact && contact.children.length === 1) {
      // Nếu chỉ có đúng 1 con, tự động chọn con đó
      setChildId(contact.children[0].id)
    } else {
      setChildId('')
    }
  }

  // Khi submit Modal Tạo mới Contact/Khách hàng từ crm_my_leads
  const handleAddContactSubmit = (newLeads: Lead[]) => {
    const newLead = newLeads[0]
    if (!newLead) return

    const newChildId = `child-${newLead.id}`
    const newContact: ContactPerson = {
      id: `contact-${newLead.id}`,
      name: newLead.parentName,
      phone: newLead.phone,
      address: newLead.address,
      children: [
        {
          id: newChildId,
          name: newLead.studentName,
          dob: String(newLead.birthYear || ''),
          age: newLead.studentAge,
          currentSchool: newLead.schoolName,
          academicPerformance: newLead.academicAbility || newLead.academicPerformance,
        },
      ],
    }

    setCustomContacts((prev) => [newContact, ...prev])
    setContactId(newContact.id)
    setChildId(newChildId)
    if (newLead.branch) setSchool(newLead.branch)
    if (newLead.targetSubject) setProgram(mapLeadSubjectToBookingProgram(newLead.targetSubject))
    setIsAddContactModalOpen(false)
    toast.success(`Đã thêm phụ huynh "${newLead.parentName}" và học viên "${newLead.studentName}" thành công!`)
  }

  // Khi submit Modal Thêm con mới cho Contact hiện tại
  const handleAddChildSubmit = (newChild: NewChildData) => {
    if (!selectedContactObj) return

    const childPayload = {
      id: newChild.id,
      name: newChild.name,
      dob: newChild.dob,
      age: newChild.age,
      currentSchool: newChild.currentSchool,
      academicPerformance: newChild.academicPerformance,
    }

    setCustomContacts((prev) => {
      const existing = prev.find((c) => c.id === contactId)
      if (existing) {
        return prev.map((c) =>
          c.id === contactId
            ? {
                ...c,
                children: [...c.children, childPayload],
              }
            : c
        )
      } else {
        const updated: ContactPerson = {
          ...selectedContactObj,
          children: [...selectedContactObj.children, childPayload],
        }
        return [updated, ...prev]
      }
    })

    setChildId(newChild.id)
    if (newChild.course) {
      setProgram(mapLeadSubjectToBookingProgram(newChild.course))
    }
    setIsAddChildModalOpen(false)
    toast.success(`Đã thêm học viên "${newChild.name}" thành công!`)
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
    if (paramLeadId) {
      router.push('/app/crm_leads')
    } else {
      router.push('/app/booking_test')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!leadInfo) {
      if (!contactId || !selectedContactObj) {
        toast.error('Vui lòng chọn phụ huynh / người liên hệ')
        return
      }
      if (!childId || !currentChildName) {
        toast.error('Vui lòng chọn con / học viên')
        return
      }
      if (!school) {
        toast.error('Vui lòng chọn trung tâm')
        return
      }
      if (!program) {
        toast.error('Vui lòng chọn chương trình')
        return
      }
      if (!selectedSlot) {
        toast.error('Vui lòng chọn khung giờ test')
        return
      }
    }

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

    if (paramLeadId) {
      updateLead(paramLeadId, {
        testStatus: 'scheduled',
        testDate: testDate,
        testTime: selectedSlot,
        testerTeacherName: teacher,
        testResultLevel: level,
        status: 'danh_gia_trai_nghiem',
      })
    }

    toast.success(`Đã tạo lịch test thành công cho ${newBooking.childName}`)
    if (paramLeadId) {
      router.push('/app/crm_leads')
    } else {
      router.push('/app/booking_test')
    }
  }

  const childSelectOptions = selectedContactObj
    ? [
        ...selectedContactObj.children.map((ch) => ({
          value: ch.id,
          label: `${ch.name} ${ch.age ? `(${ch.age} tuổi${ch.dob ? ` - ${ch.dob}` : ''})` : ch.dob ? `(${ch.dob})` : ''}`,
        })),
        { value: 'add_new_child', label: '+ Thêm con / học viên mới' },
      ]
    : []

  const CENTER_DATA = useMemo(
    () => [
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
    ],
    []
  )

  const schoolSelectOptions = useMemo(
    () =>
      CENTER_DATA.map((c) => ({
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
      })),
    [CENTER_DATA]
  )

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
      {/* Header Bar chuẩn Design System - Thu gọn thẳng hàng Option A */}
      <div className="border-b bg-background px-4 py-1.5 lg:px-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BackButton onClick={() => router.push('/app/booking_test')} />
            <h1 className="text-sm font-bold text-foreground">
              Tạo mới Đặt lịch đánh giá năng lực
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="cursor-pointer h-7.5 text-xs px-3"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="booking-create-form"
              size="sm"
              className="gap-1.5 cursor-pointer h-7.5 text-xs px-3"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Tạo lịch test</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-1.5 lg:px-6">
        <form
          id="booking-create-form"
          onSubmit={handleSubmit}
          className="mx-auto max-w-5xl space-y-2.5"
        >
          <div className="flex flex-col lg:flex-row gap-2.5 items-start">
            {/* CỘT TRÁI: ĐỐI TƯỢNG & CHƯƠNG TRÌNH (THU GỌN VÀ CỐ ĐỊNH STICKY KHI CUỘN) */}
            <BookingTestCreateStudentForm
              className="w-full lg:w-[280px] xl:w-[290px] shrink-0 space-y-2.5 lg:sticky lg:top-0 self-start"
              leadInfo={leadInfo}
              contactId={contactId}
              onContactChange={handleContactChange}
              contactsList={contactsList}
              selectedContactObj={selectedContactObj}
              childId={childId}
              onChildChange={setChildId}
              childSelectOptions={childSelectOptions}
              onAddNewContact={() => setIsAddContactModalOpen(true)}
              onAddNewChild={() => setIsAddChildModalOpen(true)}
              program={program}
              onProgramChange={handleProgramChange}
              programOptions={programOptions}
              level={level}
              onLevelChange={setLevel}
              levelOptions={levelOptions}
              notes={notes}
              onNotesChange={setNotes}
            />

            {/* CỘT PHẢI: LỊCH ĐÁNH GIÁ VÀ NHÂN SỰ TRỰC CA */}
            {!program ? (
              <div className="flex-1 min-w-0 flex flex-col items-center justify-center rounded-lg border border-dashed bg-background p-8 min-h-[460px] text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 mb-3">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-foreground">
                  Chưa chọn Chương trình học
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mt-1.5 leading-relaxed">
                  Giáo viên và ca kiểm tra được phân chia theo từng môn học chuyên môn (Tiếng Anh, Toán tư duy). Vui lòng chọn <span className="font-semibold text-foreground">Chương trình</span> ở cột bên trái để hệ thống hiển thị đúng giáo viên phụ trách.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-lg">
                  {programOptions.map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleProgramChange(opt.value)}
                      className="text-xs h-8 gap-1.5 cursor-pointer hover:border-amber-500/50 hover:bg-amber-500/5 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                    >
                      <BookOpen className="h-3.5 w-3.5 opacity-70" />
                      <span>{opt.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 min-w-0 flex flex-col space-y-2.5">
                {/* 1. LỰA CHỌN NGÀY ĐÁNH GIÁ & KHUNG GIỜ TEST */}
                <BookingTestCreateScheduleSection
                  mode="slot_first"
                  testDate={testDate}
                  onTestDateChange={setTestDate}
                  selectedSlot={selectedSlot}
                  onSlotChange={handleSlotSelection}
                  dateOptions={dateOptions}
                  dailySlotsSummary={dailySlotsSummary}
                  selectedTeacher={teacher}
                  teacherSlotConflicts={teacherSlotConflicts}
                />

                {/* 2. PHỤ TRÁCH CA ĐÃ CHỌN (KÈM BỘ CHỌN TRUNG TÂM Ở HEADER) */}
                <BookingTestCreateStaffSection
                  mode="slot_first"
                  selectedSlot={selectedSlot}
                  teacher={teacher}
                  onTeacherChange={setTeacher}
                  currentSlotStaffList={currentSlotStaffList}
                  dayStaffList={dayStaffList}
                  school={school}
                  onSchoolChange={setSchool}
                  schoolSelectOptions={schoolSelectOptions}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Modal 1: Thêm Contact / Phụ huynh mới (Lấy chuẩn từ modal tạo mới Lead ở CRM My Leads) */}
      <CrmCustomerCreateDialog
        open={isAddContactModalOpen}
        onOpenChange={setIsAddContactModalOpen}
        onSubmit={handleAddContactSubmit}
      />

      {/* Modal 2: Thêm Con / Học viên mới cho Contact hiện tại (Chuẩn các trường từ CRM Leads) */}
      <BookingTestAddChildDialog
        open={isAddChildModalOpen}
        onOpenChange={setIsAddChildModalOpen}
        parentName={selectedContactObj?.name}
        onSubmit={handleAddChildSubmit}
      />
    </div>
  )
}
