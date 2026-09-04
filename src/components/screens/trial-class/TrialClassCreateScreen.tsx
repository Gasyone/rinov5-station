'use client'

import { useState, useMemo, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BackButton } from '@/components/shared'
import { toast } from 'sonner'
import {
  addTrialClass,
  getTrialClasses,
  nextTrialId,
  type TrialClass,
} from '@/mocks/trialClasses'
import { mockLeads, updateLead, type Lead } from '@/mocks/crmLeads'
import { SYSTEM_BRANCHES } from '@/components/controls'
import { CrmCustomerCreateDialog } from '@/components/screens/crm-leads/CrmCustomerCreateDialog'
import { BookingTestAddChildDialog, type NewChildData } from '@/components/screens/booking-test/BookingTestAddChildDialog'
import {
  buildTrialContactsList,
  mapLeadSubjectToTrialProgram,
  getSubjectForProgram,
} from './trialClassCreateHelpers'
import type { TrialContactPerson } from './trialClassCreateTypes'
import type { TrialSessionSelection } from './trialClassTypes'
import { TrialClassCreateStudentForm } from './TrialClassCreateStudentForm'
import { TrialClassSchedulePanel } from './TrialClassSchedulePanel'

export function TrialClassCreateScreen() {
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
          phone: lead.phone,
          childName: lead.studentName,
          school: lead.branch || 'RinoEdu Nguyễn Tuân',
          program: mapLeadSubjectToTrialProgram(lead.targetSubject),
          notes: lead.lastNote || '',
          leadId: lead.id,
        }
      }
    }
    if (paramStudentName && paramParentName) {
      return {
        parentName: paramParentName,
        phone: paramPhone || '',
        childName: paramStudentName,
        school: paramBranch || 'RinoEdu Nguyễn Tuân',
        program: mapLeadSubjectToTrialProgram(paramSubject || ''),
        notes: '',
        leadId: undefined,
      }
    }
    return null
  }, [paramLeadId, paramStudentName, paramParentName, paramPhone, paramBranch, paramSubject])

  const [customContacts, setCustomContacts] = useState<TrialContactPerson[]>([])
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false)
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false)

  const contactsList = useMemo(() => buildTrialContactsList(customContacts), [customContacts])

  const [contactId, setContactId] = useState(leadInfo?.leadId || '')
  const [childId, setChildId] = useState('')

  const initialProgram = leadInfo?.program || ''
  const [program, setProgram] = useState(initialProgram)
  const [subject, setSubject] = useState(initialProgram ? getSubjectForProgram(initialProgram) : '')
  const [school, setSchool] = useState(leadInfo?.school || '')
  const [notes, setNotes] = useState(leadInfo?.notes || '')
  const [selectedSessions, setSelectedSessions] = useState<TrialSessionSelection[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Handle changing contact/parent
  const handleContactChange = (newContactId: string) => {
    setContactId(newContactId)

    const contact = contactsList.find((c) => c.id === newContactId)
    if (contact && contact.children.length > 0) {
      const firstChild = contact.children[0]
      setChildId(firstChild.id)
      if (firstChild.targetSubject) {
        const prog = mapLeadSubjectToTrialProgram(firstChild.targetSubject)
        setProgram(prog)
        setSubject(getSubjectForProgram(prog))
      }
      if (firstChild.branch && SYSTEM_BRANCHES.includes(firstChild.branch)) {
        setSchool(firstChild.branch)
      }
    } else {
      setChildId('')
    }
  }

  // Handle changing child
  const handleChildChange = (newChildId: string) => {
    setChildId(newChildId)
    if (newChildId !== 'add_new_child' && selectedContactObj) {
      const child = selectedContactObj.children.find((c) => c.id === newChildId)
      if (child?.targetSubject) {
        const prog = mapLeadSubjectToTrialProgram(child.targetSubject)
        setProgram(prog)
        setSubject(getSubjectForProgram(prog))
      }
      if (child?.branch && SYSTEM_BRANCHES.includes(child.branch)) {
        setSchool(child.branch)
      }
    }
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
    if (newLead.branch && SYSTEM_BRANCHES.includes(newLead.branch)) {
      setSchool(newLead.branch)
    }
    if (newLead.targetSubject) {
      const prog = mapLeadSubjectToTrialProgram(newLead.targetSubject)
      setProgram(prog)
      setSubject(getSubjectForProgram(prog))
    }
    setIsAddContactModalOpen(false)
    toast.success(`Đã thêm phụ huynh "${newLead.parentName}" và học viên "${newLead.studentName}" thành công!`)
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
    if (newChild.course) {
      const prog = mapLeadSubjectToTrialProgram(newChild.course)
      setProgram(prog)
      setSubject(getSubjectForProgram(prog))
    }
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

    const newTrial: TrialClass = {
      id: newId,
      trialName: `Học thử ${program} — ${finalStudentName}`,
      customerId: `KH-${Date.now().toString().slice(-6)}`,
      studentName: finalStudentName,
      parentName: finalParentName,
      familyName: `Gia đình ${finalParentName.split(' ').slice(-1)[0] || finalParentName}`,
      familyPhone: finalPhone,
      familyMembers: [
        { name: `${finalParentName} (Phụ huynh)`, phone: finalPhone, isPrimary: true },
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
    router.push('/app/trial_class')
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-muted/20">
      {/* Header Bar chuẩn Design System - Thu gọn thẳng hàng Option A */}
      <div className="border-b bg-card px-4 py-3 lg:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <BackButton onClick={handleCancel} />
            <div>
              <h1 className="text-base font-bold text-foreground">
                Tạo mới Đặt lịch học thử
              </h1>
              <p className="text-xs text-muted-foreground">
                Ghi nhận nhu cầu học thử, chọn phụ huynh & học viên từ Lead CRM hoặc tạo mới, và ghép ca học phù hợp
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="trial-create-form"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Tạo booking học thử</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 lg:px-6">
        <form
          id="trial-create-form"
          onSubmit={handleSubmit}
          className="mx-auto max-w-7xl space-y-4"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            {/* CỘT TRÁI: ĐỐI TƯỢNG & CHƯƠNG TRÌNH (CỐ ĐỊNH KHI CUỘN) */}
            <TrialClassCreateStudentForm
              className="w-full lg:w-[350px] xl:w-[380px] shrink-0 space-y-3 bg-card border rounded-xl p-4 shadow-2xs self-start lg:sticky lg:top-0"
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
              school={school}
              onSchoolChange={setSchool}
              branchOptions={SYSTEM_BRANCHES}
              program={program}
              onProgramChange={handleProgramChange}
              subject={subject}
              notes={notes}
              onNotesChange={setNotes}
            />

            {/* CỘT PHẢI: LỊCH HỌC & CA HỌC KHẢ DỤNG (TRẢI PHẲNG TỪNG SECTION LỚP HỌC) */}
            <div className="flex-1 min-w-0 flex flex-col space-y-3">
              <TrialClassSchedulePanel
                school={school}
                program={program}
                selectedSessions={selectedSessions}
                onSelectSession={handleSelectSession}
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
