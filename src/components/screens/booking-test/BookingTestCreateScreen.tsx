'use client'

import { useState, useMemo, type FormEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  addBookingTest,
  getBookingTests,
  type BookingTest,
} from '@/mocks/bookingTests'
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
  getSlotTimeRange,
} from './bookingTestCreateTypes'
import {
  buildBookingTestContactsList,
  BOOKING_TEST_CENTER_DATA,
} from './bookingTestHelpers'
import { BookingTestCreateStudentForm } from './BookingTestCreateStudentForm'
import { BookingTestCreateProgramSection } from './BookingTestCreateProgramSection'
import { BookingTestCreateScheduleSection } from './BookingTestCreateScheduleSection'
import { BookingTestCreateStaffSection } from './BookingTestCreateStaffSection'
import { BookingTestCreateSummary } from './BookingTestCreateSummary'
import { BookingTestSuccessSummaryView } from './BookingTestSuccessSummaryView'
import { BookingTestAddChildDialog, type NewChildData } from './BookingTestAddChildDialog'
import type { ContactPerson } from './ContactSearchableSelect'

export function BookingTestCreateScreen() {
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
          school: lead.branch || '',
          program: lead.targetSubject ? mapLeadSubjectToBookingProgram(lead.targetSubject) : '',
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
        school: paramBranch || '',
        program: paramSubject ? mapLeadSubjectToBookingProgram(paramSubject) : '',
        notes: '',
      }
    }
    return null
  }, [paramLeadId, paramStudentName, paramParentName, paramPhone, paramBranch, paramSubject])

  const bookings = useMemo(() => getBookingTests(), [])

  // 1. 4 Ngày đầu tiên (thứ và ngày ra trước, viết tắt T2..CN, Nay/Mai/Ngày kia trong ngoặc, nhiều hơn bỏ ngoặc)
  const dateOptions = useMemo(() => {
    const today = new Date()
    const formatDateStr = (d: Date) => {
      const yyyy = d.getFullYear()
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    }
    const getDayShort = (d: Date) => {
      const day = d.getDay() // 0 = CN, 1 = T2, 2 = T3, 3 = T4, 4 = T5, 5 = T6, 6 = T7
      return day === 0 ? 'CN' : `T${day + 1}`
    }
    const formatDisplay = (d: Date) => {
      const mm = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      const dayShort = getDayShort(d)
      return `${dayShort}, ${dd}/${mm}`
    }

    const d0 = new Date(today)
    const d1 = new Date(today); d1.setDate(today.getDate() + 1)
    const d2 = new Date(today); d2.setDate(today.getDate() + 2)
    const d3 = new Date(today); d3.setDate(today.getDate() + 3)
    const d4 = new Date(today); d4.setDate(today.getDate() + 4)

    return {
      first4: [
        { dateStr: formatDateStr(d0), label: formatDisplay(d0) },
        { dateStr: formatDateStr(d1), label: formatDisplay(d1) },
        { dateStr: formatDateStr(d2), label: formatDisplay(d2) },
        { dateStr: formatDateStr(d3), label: formatDisplay(d3) },
      ],
      minCustomDateStr: formatDateStr(d4),
    }
  }, [])

  // 2. Danh sách Contact (Phụ huynh) và Con từ mockStudents + customContacts
  const [customContacts, setCustomContacts] = useState<ContactPerson[]>([])
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false)

  const contactsList = useMemo<ContactPerson[]>(() => {
    return buildBookingTestContactsList(customContacts)
  }, [customContacts])

  const [contactId, setContactId] = useState(leadInfo ? 'lead_contact' : '')
  const [childId, setChildId] = useState(leadInfo ? 'lead_child' : '')

  // Chương trình & Level (prefill từ leadInfo nếu có)
  const [program, setProgram] = useState(leadInfo?.program || '')
  const [level, setLevel] = useState(leadInfo?.age && leadInfo.age <= 6 ? 'Pre-Starters (<=6)' : '')

  const handleProgramChange = (newProgram: string) => {
    setProgram(newProgram)
    setLevel('')
  }

  const [school, setSchool] = useState(leadInfo?.school || '')
  const [teacher, setTeacher] = useState('')
  const [testDate, setTestDate] = useState(dateOptions.first4[0]?.dateStr || '')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [notes, setNotes] = useState(leadInfo?.notes || '')
  const [createdBooking, setCreatedBooking] = useState<BookingTest | null>(null)

  const handleSchoolChange = (newSchool: string) => {
    setSchool(newSchool)
    setTeacher('')
  }

  const handleTestDateChange = (newDate: string) => {
    setTestDate(newDate)
    setTeacher('')
  }

  const activeSubject = program ? PROGRAM_CONFIG[program]?.subject : undefined

  // Mapping danh sách các khung giờ và số lượng nhân sự trực thực tế từ Shift Roster & Conflict Engine
  // CHỈ tính toán khi người dùng đã chọn đầy đủ cả cơ sở và ngày test
  const dailySlotsSummary = useMemo(() => {
    if (!school || !testDate) return []
    return getDailySlotSummary({
      school,
      dateStr: testDate,
      subject: activeSubject,
      extraBookings: bookings,
    })
  }, [school, testDate, activeSubject, bookings])

  // Danh sách nhân sự phụ trách được phân bổ cho ca đang chọn (selectedSlot)
  // CHỈ tải khi đã chọn đầy đủ cả cơ sở, ngày test và khung giờ
  const currentSlotStaffList = useMemo(() => {
    if (!school || !testDate || !selectedSlot) return []
    return getDutyStaffForSlot({
      school,
      dateStr: testDate,
      slotTime: selectedSlot,
      subject: activeSubject,
      extraBookings: bookings,
    })
  }, [school, testDate, selectedSlot, activeSubject, bookings])

  // Tổng hợp lịch rảnh của tất cả giáo viên chi nhánh trong ngày (cho chế độ Teacher-First)
  const dayStaffList = useMemo(() => {
    if (!school || !testDate) return []
    return getBranchTeachersDailySummary({
      school,
      dateStr: testDate,
      subject: activeSubject,
      extraBookings: bookings,
    })
  }, [school, testDate, activeSubject, bookings])

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
    if (!school || !testDate) {
      // Khi chưa chọn cơ sở hoặc ngày, không tự động gán nhân sự trực
      setTeacher('')
      return
    }
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!program) {
      toast.error('Vui lòng chọn chương trình test')
      return
    }
    if (!school) {
      toast.error('Vui lòng chọn trung tâm / cơ sở test')
      return
    }
    if (!testDate) {
      toast.error('Vui lòng chọn ngày đánh giá năng lực')
      return
    }
    if (!selectedSlot) {
      toast.error('Vui lòng chọn khung giờ test')
      return
    }

    const finalChildName = currentChildName?.trim() || '(Lịch test khống)'
    const finalParentName = currentParentName?.trim() || '(Chưa gán)'
    const finalPhone = currentPhone?.trim() || '---'

    const currentProgramConfig =
      PROGRAM_CONFIG[program] || PROGRAM_CONFIG['Chương trình Station']
    const subject = currentProgramConfig.subject

    const resolvedParentRole =
      leadInfo?.parentRole ||
      selectedContactObj?.role ||
      (finalParentName.toLowerCase().includes('văn') ||
       finalParentName.toLowerCase().includes('nam') ||
       finalParentName.toLowerCase().includes('tuấn') ||
       finalParentName.toLowerCase().includes('dũng')
        ? 'Bố'
        : 'Mẹ')

    const newBooking: BookingTest = {
      id: `E${Math.floor(1000 + Math.random() * 9000)}`,
      childName: finalChildName,
      parentName: finalParentName,
      parentRole: resolvedParentRole,
      familyName: currentParentName ? `Gia đình ${finalParentName}` : '(Chưa gán)',
      phone: finalPhone,
      familyMembers: currentParentName
        ? [
            {
              name: `${finalParentName} (${resolvedParentRole})`,
              phone: finalPhone,
              isPrimary: true,
            },
          ]
        : [],
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

    // Đồng bộ đa tab qua BroadcastChannel & localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'rinov5_crm_lead_updated',
          JSON.stringify({ leadId: paramLeadId, timestamp: Date.now() })
        )
        const channel = new BroadcastChannel('rinov5_crm_sync')
        channel.postMessage({ type: 'LEAD_UPDATED', leadId: paramLeadId, booking: newBooking })
        channel.close()
      } catch {}
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'LEAD_UPDATED', leadId: paramLeadId, booking: newBooking }, '*')
        }
      } catch {}
    }

    // Đổi giao diện sang tóm tắt nội dung lịch hẹn (Summary view)
    setCreatedBooking(newBooking)
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

  const CENTER_DATA = BOOKING_TEST_CENTER_DATA

  const schoolSelectOptions = useMemo(
    () => [
      {
        value: '',
        textValue: 'Chọn trung tâm',
        label: (
          <div className="flex items-center py-0.5 min-w-0">
            <span className="text-muted-foreground font-normal text-xs">
              Chọn trung tâm
            </span>
          </div>
        ),
        selectedLabel: (
          <span className="text-muted-foreground font-normal text-xs">
            Chọn trung tâm
          </span>
        ),
      },
      ...CENTER_DATA.map((c) => ({
        value: c.name,
        textValue: `${c.name} (${c.distanceStr})`,
        label: (
          <div className="flex flex-col w-full py-0.5 min-w-0">
            <div className="flex items-center justify-between w-full gap-2">
              <span className="font-medium text-foreground text-xs">{c.name}</span>
              <span className="text-muted-foreground font-normal tabular-nums shrink-0 text-xs">
                {c.distanceStr}
              </span>
            </div>
            <span className="text-xs text-muted-foreground/75 truncate font-normal leading-normal mt-0.5">
              {c.address}
            </span>
          </div>
        ),
        selectedLabel: (
          <div className="flex items-center justify-between w-full gap-2 text-xs">
            <span className="truncate font-medium text-foreground">{c.name}</span>
            <span className="text-muted-foreground font-normal tabular-nums shrink-0 text-xs">
              {c.distanceStr}
            </span>
          </div>
        ),
      })),
    ],
    [CENTER_DATA]
  )

  const programOptions = useMemo(
    () => [
      {
        value: '',
        textValue: 'Chọn chương trình',
        label: (
          <div className="flex items-center py-0.5 min-w-0">
            <span className="text-muted-foreground font-normal text-xs">
              Chọn chương trình
            </span>
          </div>
        ),
        selectedLabel: (
          <span className="text-muted-foreground font-normal text-xs">
            Chọn chương trình
          </span>
        ),
      },
      ...Object.keys(PROGRAM_CONFIG).map((p) => ({
        value: p,
        textValue: p,
        label: p,
        selectedLabel: p,
      })),
    ],
    []
  )

  const levelOptions = useMemo(() => {
    if (!program) return []
    const levels = (PROGRAM_CONFIG[program]?.levels || []).map((l) => ({
      value: l,
      label: l,
      selectedLabel: l,
    }))
    return [
      {
        value: '',
        textValue: 'Level dự kiến',
        label: (
          <div className="flex items-center py-0.5 min-w-0">
            <span className="text-muted-foreground font-normal text-xs">
              Level dự kiến
            </span>
          </div>
        ),
        selectedLabel: (
          <span className="text-muted-foreground font-normal text-xs">
            Level dự kiến
          </span>
        ),
      },
      ...levels,
    ]
  }, [program])

  const activeDateOption = dateOptions.first4.find((d) => d.dateStr === testDate)
  const activeDateLabel = testDate ? (activeDateOption ? activeDateOption.label : testDate) : ''

  if (createdBooking) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <BookingTestSuccessSummaryView
            booking={createdBooking}
            leadId={paramLeadId}
            schoolAddress={CENTER_DATA.find((c) => c.name === createdBooking.school)?.address}
            dateLabel={activeDateLabel}
            timeRange={getSlotTimeRange(selectedSlot, 30)}
            onCreateAnother={() => {
              setCreatedBooking(null)
              setSelectedSlot('')
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Main Form Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2 lg:px-6">
        <form
          id="booking-create-form"
          onSubmit={handleSubmit}
          className="mx-auto max-w-5xl space-y-2.5"
        >
          <div className="flex flex-col lg:flex-row gap-2.5 items-start">
            {/* CỘT TRÁI (FLEX-1): TOÀN BỘ QUY TRÌNH THAO TÁC ĐẶT LỊCH TEST */}
            <div className="flex-1 min-w-0 flex flex-col space-y-2.5">
              {/* 1. HÀNG ĐẦU TIÊN: CHƯƠNG TRÌNH, LEVEL, CƠ SỞ & TEXT LINK GỢI Ý CƠ SỞ GẦN NHẤT */}
              <BookingTestCreateProgramSection
                program={program}
                onProgramChange={handleProgramChange}
                level={level}
                onLevelChange={setLevel}
                school={school}
                onSchoolChange={handleSchoolChange}
                programOptions={programOptions}
                levelOptions={levelOptions}
                schoolSelectOptions={schoolSelectOptions}
                centerData={CENTER_DATA}
              />

              {/* 2. SECTION LỊCH VÀ KHUNG GIỜ TEST (1 SECTION DUY NHẤT) */}
              <BookingTestCreateScheduleSection
                mode="slot_first"
                testDate={testDate}
                onTestDateChange={handleTestDateChange}
                selectedSlot={selectedSlot}
                onSlotChange={handleSlotSelection}
                dateOptions={dateOptions}
                dailySlotsSummary={dailySlotsSummary}
                selectedTeacher={teacher}
                teacherSlotConflicts={teacherSlotConflicts}
                school={school}
              />

              {/* 3. PHỤ TRÁCH CA ĐÃ CHỌN */}
              <BookingTestCreateStaffSection
                mode="slot_first"
                selectedSlot={selectedSlot}
                teacher={teacher}
                onTeacherChange={setTeacher}
                currentSlotStaffList={currentSlotStaffList}
                dayStaffList={dayStaffList}
                school={school}
                testDate={testDate}
              />

              {/* 4. GHI CHÚ ĐƯA XUỐNG DƯỚI CÙNG PANEL TRÁI, DƯỚI CHỌN PHỤ TRÁCH */}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ghi chú cho ca test (yêu cầu phụ huynh, đặc điểm học viên...)"
                rows={2}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[48px] resize-y"
              />
            </div>

            {/* CỘT PHẢI (STICKY ~300px): CONTACT & HỌC VIÊN + STICKY BOOKING SUMMARY CARD */}
            <div className="w-full lg:w-[290px] xl:w-[310px] shrink-0 space-y-2.5 lg:sticky lg:top-0 self-start">
              {/* KHỐI 1: CONTACT & HỌC VIÊN */}
              <BookingTestCreateStudentForm
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
              />

              {/* KHỐI 2: STICKY BOOKING SUMMARY CARD Ở DƯỚI CONTACT BÊN PHẢI */}
              <BookingTestCreateSummary
                dateLabel={activeDateLabel}
                selectedSlot={selectedSlot}
                school={school}
                schoolAddress={CENTER_DATA.find((c) => c.name === school)?.address}
                program={program}
                level={level}
                studentName={currentChildName}
                parentName={currentParentName}
                phone={currentPhone}
                teacherName={teacher}
                teacherRole={
                  currentSlotStaffList.find(
                    (s) => s.employee.name.toLowerCase() === teacher.toLowerCase()
                  )?.employee.role || 'Giáo viên'
                }
              />
            </div>
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
