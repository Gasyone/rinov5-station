'use client'

import { useState, useMemo, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  addTrialClass,
  getTrialClasses,
  nextTrialId,
  type TrialClass,
} from '@/mocks/trialClasses'
import { mockLeads, updateLead, type Lead } from '@/mocks/crmLeads'
import { CrmCustomerCreateDialog } from '@/components/screens/crm-leads/CrmCustomerCreateDialog'
import {
  BookingTestAddChildDialog,
  type NewChildData,
} from '@/components/screens/booking-test/BookingTestAddChildDialog'
import {
  buildTrialContactsList,
  getSubjectForProgram,
} from './trialClassCreateHelpers'
import {
  PROGRAM_OPTIONS,
  SUBJECT_MAP,
  CENTER_DATA,
} from './trialClassConstants'
import type { TrialContactPerson } from './trialClassCreateTypes'
import type { TrialSessionSelection } from './trialClassTypes'
import { TrialClassCreateProgramSection } from './TrialClassCreateProgramSection'
import { TrialClassCreateContactSection } from './TrialClassCreateContactSection'
import { TrialClassSchedulePanel } from './TrialClassSchedulePanel'
import { TrialClassCreateSummary } from './TrialClassCreateSummary'
import { TrialClassSuccessSummaryView } from './TrialClassSuccessSummaryView'
import { mapLeadSubjectToTrialProgram } from '@/components/screens/crm-leads/crmLeadsHelpers'

export function TrialClassCreateScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const paramLeadId = searchParams.get('leadId')
  const paramStudentName = searchParams.get('studentName')
  const paramParentName = searchParams.get('parentName')
  const paramPhone = searchParams.get('phone')

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
          age: lead.studentAge,
          birthYear: lead.birthYear,
          dob: lead.birthYear ? String(lead.birthYear) : undefined,
          currentSchool: lead.schoolName || 'Tiểu học Lương Định Của (Quận 3)',
          academicPerformance:
            lead.academicAbility || lead.academicPerformance || 'Giỏi / Tốt nghiệp loại Ưu',
          leadId: lead.id,
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
        dob: '2018',
        currentSchool: 'Tiểu học Lương Định Của (Quận 3)',
        academicPerformance: 'Giỏi / Tốt nghiệp loại Ưu',
        leadId: undefined,
      }
    }
    return null
  }, [paramLeadId, paramStudentName, paramParentName, paramPhone])

  const [customContacts, setCustomContacts] = useState<TrialContactPerson[]>([])
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false)

  const contactsList = useMemo(() => buildTrialContactsList(customContacts), [customContacts])

  const [contactId, setContactId] = useState(leadInfo?.leadId || '')
  const [childId, setChildId] = useState(leadInfo?.leadId ? `child-${leadInfo.leadId}` : '')

  const leadRecord = useMemo(() => {
    if (paramLeadId) return mockLeads.find((l) => l.id === paramLeadId)
    return null
  }, [paramLeadId])

  const initialProgram = leadRecord?.targetSubject ? mapLeadSubjectToTrialProgram(leadRecord.targetSubject) : ''
  const initialSubject = initialProgram ? getSubjectForProgram(initialProgram) : ''
  const initialSchool = leadRecord?.branch || ''

  const [program, setProgram] = useState(initialProgram)
  const [subject, setSubject] = useState(initialSubject)
  const [school, setSchool] = useState(initialSchool)
  const [notes, setNotes] = useState(leadRecord?.lastNote || '')
  const [selectedSessions, setSelectedSessions] = useState<TrialSessionSelection[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdTrial, setCreatedTrial] = useState<TrialClass | null>(null)
  const [createdSession, setCreatedSession] = useState<TrialSessionSelection | null>(null)

  const selectedContactObj = useMemo(() => {
    if (!contactId) return null
    return contactsList.find((c) => c.id === contactId) || null
  }, [contactId, contactsList])

  const childSelectOptions = useMemo(() => {
    if (!selectedContactObj) return []
    const opts = selectedContactObj.children.map((c) => ({
      value: c.id,
      label: c.targetSubject
        ? `${c.name} (${c.dob ? `${c.dob} · ` : ''}Quan tâm: ${c.targetSubject})`
        : c.name,
    }))
    opts.push({ value: 'add_new_child', label: '+ Thêm con / học viên mới' })
    return opts
  }, [selectedContactObj])

  // Current student and parent info for summary card
  const currentChildName = useMemo(() => {
    if (leadInfo) return leadInfo.childName
    if (selectedContactObj) {
      const child = selectedContactObj.children.find((c) => c.id === childId)
      return child?.name || ''
    }
    return ''
  }, [leadInfo, selectedContactObj, childId])

  const currentParentName = useMemo(() => {
    if (leadInfo) return leadInfo.parentName
    if (selectedContactObj) return selectedContactObj.name
    return ''
  }, [leadInfo, selectedContactObj])

  const currentPhone = useMemo(() => {
    if (leadInfo) return leadInfo.phone
    if (selectedContactObj) return selectedContactObj.phone
    return ''
  }, [leadInfo, selectedContactObj])

  // Handle changing contact/parent
  const handleContactChange = (newContactId: string) => {
    setContactId(newContactId)

    const contact = contactsList.find((c) => c.id === newContactId)
    if (contact && contact.children.length > 0) {
      const firstChild = contact.children[0]
      setChildId(firstChild.id)
    } else {
      setChildId('')
    }
  }

  // Handle changing child
  const handleChildChange = (newChildId: string) => {
    setChildId(newChildId)
  }

  // Handle submitting new contact/lead modal
  const handleAddContactSubmit = (newLeads: Lead[]) => {
    const newLead = newLeads[0]
    if (!newLead) return

    const newChildId = `child-${newLead.id}`
    const newContact: TrialContactPerson = {
      id: `contact-${newLead.id}`,
      name: newLead.parentName,
      phone: newLead.phone,
      isFromLead: true,
      leadId: newLead.id,
      children: [
        {
          id: newChildId,
          name: newLead.studentName,
          dob: String(newLead.birthYear || ''),
          targetSubject: newLead.targetSubject,
          branch: newLead.branch,
          leadId: newLead.id,
        },
      ],
    }

    setCustomContacts((prev) => [newContact, ...prev])
    setContactId(newContact.id)
    setChildId(newChildId)
    setIsAddContactModalOpen(false)
    toast.success(
      `Đã thêm phụ huynh "${newLead.parentName}" và học viên "${newLead.studentName}" thành công!`
    )
  }

  // Handle submitting new child modal
  const handleAddChildSubmit = (newChild: NewChildData) => {
    if (!selectedContactObj) return

    setCustomContacts((prev) => {
      const existing = prev.find((c) => c.id === contactId)
      if (existing) {
        return prev.map((c) =>
          c.id === contactId
            ? {
                ...c,
                children: [
                  ...c.children,
                  {
                    id: newChild.id,
                    name: newChild.name,
                    dob: newChild.birthYear || String(newChild.dob || ''),
                    targetSubject: newChild.course,
                  },
                ],
              }
            : c
        )
      } else {
        const updated: TrialContactPerson = {
          ...selectedContactObj,
          children: [
            ...selectedContactObj.children,
            {
              id: newChild.id,
              name: newChild.name,
              dob: newChild.birthYear || String(newChild.dob || ''),
              targetSubject: newChild.course,
            },
          ],
        }
        return [updated, ...prev]
      }
    })

    setChildId(newChild.id)
    setIsAddChildModalOpen(false)
    toast.success(`Đã thêm học viên "${newChild.name}" thành công!`)
  }

  // Handle changing program
  const handleProgramChange = (newProgram: string) => {
    setProgram(newProgram)
    setSubject(getSubjectForProgram(newProgram))
    // Reset selected sessions when program changes
    setSelectedSessions([])
  }

  // Handle session selection (single session)
  const handleSelectSession = (session: TrialSessionSelection) => {
    setSelectedSessions((current) => {
      const isAlreadySelected = current.some(
        (s) => s.classId === session.classId && s.sessionId === session.sessionId
      )
      return isAlreadySelected ? [] : [session]
    })
  }

  const handleCancel = () => {
    router.push('/app/trial_class')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    let finalParentName = ''
    let finalPhone = ''
    let finalStudentName = ''
    let resolvedLeadId = leadInfo?.leadId

    if (leadInfo) {
      finalParentName = leadInfo.parentName
      finalPhone = leadInfo.phone
      finalStudentName = leadInfo.childName
    } else {
      if (!selectedContactObj) {
        toast.error('Vui lòng chọn phụ huynh')
        return
      }
      finalParentName = selectedContactObj.name
      finalPhone = selectedContactObj.phone

      const foundChild = selectedContactObj.children.find((c) => c.id === childId)
      finalStudentName = foundChild?.name || 'Học viên'
      if (foundChild?.leadId) {
        resolvedLeadId = foundChild.leadId
      }
    }

    if (!finalStudentName) {
      toast.error('Vui lòng nhập tên học viên')
      return
    }

    if (!program) {
      toast.error('Vui lòng chọn chương trình học thử')
      return
    }

    setIsSubmitting(true)

    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
    const existingTrials = getTrialClasses()
    const newId = nextTrialId(existingTrials)

    const resolvedParentRole =
      leadInfo?.parentRole ||
      leadRecord?.parentRole ||
      (selectedContactObj as { role?: string } | null)?.role ||
      (finalParentName.toLowerCase().includes('văn') ||
       finalParentName.toLowerCase().includes('nam') ||
       finalParentName.toLowerCase().includes('tuấn') ||
       finalParentName.toLowerCase().includes('dũng')
        ? 'Bố'
        : 'Mẹ')

    const newTrial: TrialClass = {
      id: newId,
      trialName: `Học thử ${program} — ${finalStudentName}`,
      customerId: `KH-${Date.now().toString().slice(-6)}`,
      studentName: finalStudentName,
      parentName: finalParentName,
      parentRole: resolvedParentRole,
      familyName: `Gia đình ${finalParentName.split(' ').slice(-1)[0] || finalParentName}`,
      familyPhone: finalPhone,
      familyMembers: [
        { name: `${finalParentName} (${resolvedParentRole})`, phone: finalPhone, isPrimary: true },
      ],
      attempt: 'Lần 1',
      school: school,
      branch: school,
      program: program,
      subject: subject,
      sessions: selectedSessions.map((s) => ({
        classId: s.classId,
        className: s.className,
        sessionId: s.sessionId,
        sessionName: s.sessionName,
        trialDate: s.trialDate,
      })),
      creator: 'Người dùng hiện tại',
      owner: selectedSessions[0]?.teacher || 'Người dùng hiện tại',
      status: selectedSessions.length > 0 ? 'confirmed' : 'pending_approval',
      notes: notes,
      auditLog: [
        {
          timestamp: now,
          author: 'Người dùng hiện tại',
          action: 'Tạo booking học thử',
          detail:
            selectedSessions.length > 0
              ? `Đã chọn lớp ${selectedSessions[0].className} - ${selectedSessions[0].sessionName} (${selectedSessions[0].trialDate}) - GV: ${selectedSessions[0].teacher || 'Chưa gán'}${selectedSessions[0].assistantTeacher ? ` - TG: ${selectedSessions[0].assistantTeacher}` : ''}${selectedSessions[0].room ? ` - Phòng: ${selectedSessions[0].room}` : ''}`
              : 'Chưa chọn ca học cụ thể',
        },
      ],
    }

    addTrialClass(newTrial)

    // If linked to CRM lead, update lead trial status
    if (resolvedLeadId) {
      const selectedSession = selectedSessions[0]
      updateLead(resolvedLeadId, {
        trialStatus: 'scheduled',
        trialClassName: selectedSession?.className || 'Lớp chờ xếp',
        trialDate: selectedSession?.trialDate || now.split(' ')[0],
        trialTime: selectedSession?.sessionName || '18:00',
        trialFeedback: notes || 'Đã tạo booking học thử',
      })
    }

    toast.success(`Đã tạo booking học thử thành công cho ${finalStudentName}!`)
    setIsSubmitting(false)

    // Đồng bộ đa tab qua BroadcastChannel & localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'rinov5_crm_lead_updated',
          JSON.stringify({ leadId: resolvedLeadId, timestamp: Date.now() })
        )
        const channel = new BroadcastChannel('rinov5_crm_sync')
        channel.postMessage({ type: 'LEAD_UPDATED', leadId: resolvedLeadId, trial: newTrial })
        channel.close()
      } catch {}
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage({ type: 'LEAD_UPDATED', leadId: resolvedLeadId, trial: newTrial }, '*')
        }
      } catch {}
    }

    // Đổi giao diện sang tóm tắt nội dung học thử (Summary view)
    setCreatedTrial(newTrial)
    setCreatedSession(selectedSessions[0] || null)
  }

  // Program and School options for top selector row
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
      ...PROGRAM_OPTIONS.map((p) => ({
        value: p,
        textValue: p,
        label: p,
        selectedLabel: p,
      })),
    ],
    []
  )

  const subjectOptions = useMemo(() => {
    const uniqueSubjects = Array.from(new Set(Object.values(SUBJECT_MAP)))
    return uniqueSubjects.map((s) => ({
      value: s,
      textValue: s,
      label: s,
      selectedLabel: s,
    }))
  }, [])

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
    []
  )

  if (createdTrial) {
    return (
      <div className="flex h-full min-h-0 flex-col bg-background">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <TrialClassSuccessSummaryView
            trial={createdTrial}
            session={createdSession}
            leadId={paramLeadId}
            schoolAddress={CENTER_DATA.find((c) => c.name === createdTrial.school)?.address}
            onCreateAnother={() => {
              setCreatedTrial(null)
              setCreatedSession(null)
              setSelectedSessions([])
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
          id="trial-create-form"
          onSubmit={handleSubmit}
          className="mx-auto max-w-5xl space-y-2.5"
        >
          <div className="flex flex-col lg:flex-row gap-2.5 items-start">
            {/* CỘT TRÁI (FLEX-1): TOÀN BỘ QUY TRÌNH CHỌN LỊCH VÀ LỚP HỌC THỬ */}
            <div className="flex-1 min-w-0 flex flex-col space-y-2.5">
              {/* 1. HÀNG ĐẦU TIÊN: CHƯƠNG TRÌNH, MÔN HỌC, CƠ SỞ & GỢI Ý CƠ SỞ GẦN NHẤT */}
              <TrialClassCreateProgramSection
                program={program}
                onProgramChange={handleProgramChange}
                subject={subject}
                onSubjectChange={setSubject}
                school={school}
                onSchoolChange={setSchool}
                programOptions={programOptions}
                subjectOptions={subjectOptions}
                schoolSelectOptions={schoolSelectOptions}
                centerData={CENTER_DATA}
              />

              {/* 2. SECTION LỊCH VÀ LỚP HỌC THỬ KHẢ DỤNG */}
              <TrialClassSchedulePanel
                school={school}
                program={program}
                selectedSessions={selectedSessions}
                onSelectSession={handleSelectSession}
              />

              {/* 3. GHI CHÚ ĐƯA XUỐNG DƯỚI CÙNG PANEL TRÁI (CHỈ Ô NHẬP VÀ PLACEHOLDER) */}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập ghi chú cho ca học thử (yêu cầu của phụ huynh, tính cách của bé, lưu ý cho giáo viên...)"
                rows={2}
                className="w-full rounded-xl border border-input bg-card px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[52px] resize-y shadow-2xs transition-colors"
              />
            </div>

            {/* CỘT PHẢI (STICKY ~300px): CONTACT & HỌC VIÊN + STICKY TRIAL SUMMARY CARD */}
            <div className="w-full lg:w-[290px] xl:w-[315px] shrink-0 space-y-2.5 lg:sticky lg:top-0 self-start">
              {/* KHỐI 1: CONTACT & HỌC VIÊN */}
              <TrialClassCreateContactSection
                leadInfo={leadInfo}
                contactId={contactId}
                onContactChange={handleContactChange}
                contactsList={contactsList}
                selectedContactObj={selectedContactObj}
                childId={childId}
                onChildChange={handleChildChange}
                childSelectOptions={childSelectOptions}
                onAddNewContact={() => setIsAddContactModalOpen(true)}
                onAddNewChild={() => setIsAddChildModalOpen(true)}
              />

              {/* KHỐI 2: STICKY TRIAL SUMMARY CARD Ở DƯỚI CONTACT BÊN PHẢI */}
              <TrialClassCreateSummary
                selectedSession={selectedSessions[0] || null}
                school={school}
                schoolAddress={CENTER_DATA.find((c) => c.name === school)?.address}
                program={program}
                subject={subject}
                studentName={currentChildName}
                parentName={currentParentName}
                phone={currentPhone}
                isSubmitting={isSubmitting}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </form>
      </div>

      {/* Modal 1: Thêm Contact / Phụ huynh mới (Modal tạo mới Lead CRM chuẩn) */}
      <CrmCustomerCreateDialog
        open={isAddContactModalOpen}
        onOpenChange={setIsAddContactModalOpen}
        onSubmit={handleAddContactSubmit}
      />

      {/* Modal 2: Thêm Con / Học viên mới cho Contact hiện tại */}
      <BookingTestAddChildDialog
        open={isAddChildModalOpen}
        onOpenChange={setIsAddChildModalOpen}
        parentName={selectedContactObj?.name}
        onSubmit={handleAddChildSubmit}
      />
    </div>
  )
}
