'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import type { Lead } from '@/mocks/crmLeads'
import { CrmLeadParentProfileView } from './CrmLeadParentProfileView'
import { CrmLeadStudentProfileView } from './CrmLeadStudentProfileView'
import { CrmLeadProfileModal } from './CrmLeadProfileModal'
import type { ParentContact } from './CrmLeadParentCard'
import type { ChildPersonaItem } from './CrmLeadChildCard'
import {
  buildPrimaryParent,
  buildOtherParents,
  buildChildContacts,
} from './leadContactsHelper'
import { getSiblingLeads } from './leadSiblingsHelper'

export interface CrmLeadContactsTabProps {
  lead: Lead
  onAddParent?: () => void
  onAddChild?: () => void
  onOpenFullProfile?: () => void
  onSwitchLead?: (newLeadId: string) => void
  onUpdateLead?: (updatedLead: Lead) => void
  activeParentName?: string | null
  onSwitchParentPersona?: (parentName: string) => void
  basePath?: string
  onOpenBookingTest?: () => void
  onOpenTrialClass?: () => void
}

export function CrmLeadContactsTab({
  lead,
  onSwitchLead,
  onUpdateLead,
  activeParentName,
  onSwitchParentPersona,
  basePath,
  onOpenBookingTest,
  onOpenTrialClass,
}: CrmLeadContactsTabProps) {
  // Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'parent' | 'student'>('parent')
  const [isEditingParent, setIsEditingParent] = useState(false)
  const [isEditingStudent, setIsEditingStudent] = useState(false)

  // Primary Parent Contact
  const primaryParent: ParentContact = useMemo(() => buildPrimaryParent(lead), [lead])

  const otherParents: ParentContact[] = useMemo(() => buildOtherParents(lead), [lead])

  const parentContacts: ParentContact[] = useMemo(
    () => [primaryParent, ...otherParents],
    [primaryParent, otherParents]
  )

  // Children Contacts
  const childContacts: ChildPersonaItem[] = useMemo(() => buildChildContacts(lead), [lead])

  const siblingLeads = useMemo(
    () => getSiblingLeads(lead, undefined, basePath || '/app/crm_my_leads'),
    [lead, basePath]
  )

  const [localSelectedParentName, setLocalSelectedParentName] = useState<string | null>(null)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)

  const effectiveParentName =
    activeParentName !== undefined && activeParentName !== null
      ? activeParentName
      : localSelectedParentName

  const selectedParent = useMemo(() => {
    if (effectiveParentName) {
      const found = parentContacts.find((p) => p.name === effectiveParentName)
      if (found) return found
    }
    return primaryParent
  }, [effectiveParentName, parentContacts, primaryParent])

  const selectedStudent = useMemo(() => {
    if (selectedStudentId) {
      const found = childContacts.find((c) => c.id === selectedStudentId)
      if (found) return found
    }
    return childContacts[0]
  }, [selectedStudentId, childContacts])

  // In-place edit state
  const [prevParentName, setPrevParentName] = useState(selectedParent.name)
  const [prevStudentId, setPrevStudentId] = useState(selectedStudent.id)
  const [editedParent, setEditedParent] = useState<ParentContact>(primaryParent)
  const [editedStudent, setEditedStudent] = useState<ChildPersonaItem>(childContacts[0])

  if (selectedParent.name !== prevParentName) {
    setPrevParentName(selectedParent.name)
    if (!isEditingParent) {
      setEditedParent(selectedParent)
    }
  }

  if (selectedStudent.id !== prevStudentId) {
    setPrevStudentId(selectedStudent.id)
    if (!isEditingStudent) {
      setEditedStudent(selectedStudent)
    }
  }

  const handleOpenZoom = (type: 'parent' | 'student') => {
    setModalType(type)
    setIsProfileModalOpen(true)
  }

  const handleStartEditParent = () => {
    setEditedParent(selectedParent)
    setIsEditingParent(true)
  }

  const handleCancelEditParent = () => {
    setEditedParent(selectedParent)
    setIsEditingParent(false)
  }

  const handleSaveParent = (targetParent: ParentContact = editedParent) => {
    let updatedLead: Lead = { ...lead }
    if (targetParent.isPrimary || selectedParent.isPrimary) {
      updatedLead = {
        ...updatedLead,
        parentName: targetParent.name,
        parentRole: targetParent.role,
        phone: targetParent.phone,
        email: targetParent.email,
        address: targetParent.address || updatedLead.address,
        parentOccupation: targetParent.occupation,
        financialSegment: targetParent.financialSegment,
        budgetPerMonth: targetParent.budgetPerMonth,
        decisionMakerRole: targetParent.decisionMakerRole,
        preferredContactMethod: targetParent.preferredChannel || targetParent.preferredContactMethod,
        bestTimeToCall: targetParent.bestTimeToCall,
        parentExpectation: targetParent.parentExpectation,
        parentPainPoint: targetParent.parentPainPoint,
        parentPersonalityNote: targetParent.parentPersonalityNote,
      }
    } else {
      const currentOthers = lead.otherParents || otherParents
      const updatedOthers = currentOthers.map((op) =>
        op.name === selectedParent.name
          ? {
              ...op,
              name: targetParent.name,
              role: targetParent.role,
              phone: targetParent.phone,
              email: targetParent.email,
              occupation: targetParent.occupation,
              address: targetParent.address,
              financialSegment: targetParent.financialSegment,
              budgetPerMonth: targetParent.budgetPerMonth,
              decisionMakerRole: targetParent.decisionMakerRole,
              preferredContactMethod: targetParent.preferredChannel || targetParent.preferredContactMethod,
              preferredChannel: targetParent.preferredChannel,
              bestTimeToCall: targetParent.bestTimeToCall,
              parentExpectation: targetParent.parentExpectation,
              parentPainPoint: targetParent.parentPainPoint,
              parentPersonalityNote: targetParent.parentPersonalityNote,
            }
          : op
      )
      updatedLead = { ...updatedLead, otherParents: updatedOthers }
    }
    setLocalSelectedParentName(targetParent.name)
    onSwitchParentPersona?.(targetParent.name)
    setEditedParent(targetParent)
    onUpdateLead?.(updatedLead)
    setIsEditingParent(false)
    toast.success(`Đã lưu thông tin Chân dung Phụ huynh (${targetParent.name})!`)
  }

  const handleStartEditStudent = () => {
    setEditedStudent(selectedStudent)
    setIsEditingStudent(true)
  }

  const handleCancelEditStudent = () => {
    setEditedStudent(selectedStudent)
    setIsEditingStudent(false)
  }

  const handleSaveStudent = (targetStudent: ChildPersonaItem = editedStudent) => {
    let updatedLead: Lead = { ...lead }
    if (targetStudent.isCurrent) {
      updatedLead = {
        ...updatedLead,
        studentName: targetStudent.name,
        studentEnglishName: targetStudent.englishName,
        studentAge: targetStudent.age,
        studentGender: targetStudent.gender as 'Nam' | 'Nữ',
        schoolName: targetStudent.school,
        studentCurrentGrade: targetStudent.grade,
        targetSubject: targetStudent.targetSubject,
        status: (targetStudent.status as Lead['status']) || lead.status,
        studentPhone: targetStudent.studentPhone,
        studentPersonality: targetStudent.personality,
        studentInterests: targetStudent.interests,
        studentLearningStyle: targetStudent.learningStyle,
        studentStrengths: targetStudent.strengths,
        studentWeaknesses: targetStudent.weaknesses,
        studentLearningGoal: targetStudent.learningGoal,
        lastNote: targetStudent.notes || lead.lastNote,
      }
    }
    setSelectedStudentId(targetStudent.id)
    setEditedStudent(targetStudent)
    onUpdateLead?.(updatedLead)
    setIsEditingStudent(false)
    toast.success(`Đã lưu thông tin Chân dung Học viên (${targetStudent.name})!`)
  }

  // Switch which parent persona is currently viewed (does NOT mutate lead or swap primary status!)
  const handleSwitchParent = (p: ParentContact) => {
    setLocalSelectedParentName(p.name)
    setEditedParent(p)
    setIsEditingParent(false)
    onSwitchParentPersona?.(p.name)
  }

  // Explicitly promote a parent to be the primary contact of the Lead
  const handleSetPrimaryParent = (p: ParentContact) => {
    if (p.isPrimary) return

    const newOtherParents = parentContacts
      .filter((item) => item.name !== p.name)
      .map((item) => ({
        name: item.name,
        role: item.role,
        phone: item.phone,
        email: item.email,
        occupation: item.occupation,
        preferredChannel: item.preferredChannel,
        zaloStatus: item.zaloStatus,
        address: item.address,
        note: item.note,
        financialSegment: item.financialSegment,
        budgetPerMonth: item.budgetPerMonth,
        decisionMakerRole: item.decisionMakerRole,
        preferredContactMethod: item.preferredContactMethod,
        bestTimeToCall: item.bestTimeToCall,
        parentExpectation: item.parentExpectation,
        parentPainPoint: item.parentPainPoint,
        parentPersonalityNote: item.parentPersonalityNote,
      }))

    const updatedLead: Lead = {
      ...lead,
      parentName: p.name,
      parentRole: p.role,
      phone: p.phone,
      email: p.email || lead.email,
      address: p.address || lead.address,
      parentOccupation: p.occupation || lead.parentOccupation,
      financialSegment: p.financialSegment || lead.financialSegment,
      budgetPerMonth: p.budgetPerMonth || lead.budgetPerMonth,
      decisionMakerRole: p.decisionMakerRole || lead.decisionMakerRole,
      preferredContactMethod: p.preferredChannel || p.preferredContactMethod || lead.preferredContactMethod,
      bestTimeToCall: p.bestTimeToCall || lead.bestTimeToCall,
      parentExpectation: p.parentExpectation || lead.parentExpectation,
      parentPainPoint: p.parentPainPoint || lead.parentPainPoint,
      parentPersonalityNote: p.parentPersonalityNote || p.note || lead.parentPersonalityNote,
      otherParents: newOtherParents,
    }

    setLocalSelectedParentName(p.name)
    onSwitchParentPersona?.(p.name)
    onUpdateLead?.(updatedLead)
    toast.success(`Đã đặt ${p.role} (${p.name}) làm người liên hệ chính!`)
  }

  // Handlers
  const handleCopy = (phone: string, name: string) => {
    navigator.clipboard
      .writeText(phone)
      .then(() => toast.success(`Đã sao chép SĐT ${name}: ${phone}`))
      .catch(() => toast.error('Không thể sao chép SĐT'))
  }

  const handleCall = (phone: string, name: string) => {
    toast.info(`Đang kích hoạt cuộc gọi tới ${name} (${phone})...`)
    window.open(`tel:${phone}`, '_self')
  }

  const handleZalo = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    toast.info(`Mở cửa sổ chat Zalo với ${name}...`)
    window.open(`https://zalo.me/${cleanPhone}`, '_blank')
  }

  return (
    <div className="space-y-4 text-xs text-left select-none">
      {/* ============================================================ */}
      {/* BỐ CỤC 1 CỘT PANEL TRÁI: HỌC VIÊN Ở TRÊN - PHỤ HUYNH Ở DƯỚI   */}
      {/* 1. Thông tin học viên (Lead) luôn hiển thị                   */}
      {/* 2. Thông tin phụ huynh / Lead (gộp chân dung & phụ huynh)     */}
      {/* 3. Con khác của gia đình (đưa xuống dưới cùng)                */}
      {/* ============================================================ */}
      <div className="space-y-4">
        {/* ============================================================ */}
        {/* 1. KHỐI TRÊN: THÔNG TIN HỌC VIÊN                             */}
        {/* ============================================================ */}
        <CrmLeadStudentProfileView
          student={selectedStudent}
          isEditing={isEditingStudent}
          editedStudent={editedStudent}
          setEditedStudent={setEditedStudent}
          onStartEdit={handleStartEditStudent}
          onCancelEdit={handleCancelEditStudent}
          onSave={handleSaveStudent}
          onZoom={() => handleOpenZoom('student')}
          onOpenBookingTest={onOpenBookingTest}
          onOpenTrialClass={onOpenTrialClass}
        />

        {/* ============================================================ */}
        {/* 2. KHỐI DƯỚI: THÔNG TIN PHỤ HUYNH                            */}
        {/* (Gộp chân dung lead, thông tin phụ huynh & con khác)         */}
        {/* ============================================================ */}
        <CrmLeadParentProfileView
          parent={selectedParent}
          isEditing={isEditingParent}
          editedParent={editedParent}
          setEditedParent={setEditedParent}
          allParents={parentContacts}
          siblingLeads={siblingLeads}
          onSelectParent={handleSwitchParent}
          onSetPrimary={handleSetPrimaryParent}
          onCopyPhone={handleCopy}
          onCall={handleCall}
          onZalo={handleZalo}
          onStartEdit={handleStartEditParent}
          onCancelEdit={handleCancelEditParent}
          onSave={handleSaveParent}
          onZoom={() => handleOpenZoom('parent')}
          leadCode={lead.code || 'LD-10291-A'}
          leadCreatedAt={lead.createdAt || '10/08/2026'}
        />
      </div>

      {/* ============================================================ */}
      {/* MODAL PHÓNG TO TOÀN DIỆN (NẾU CẦN XEM RỘNG HƠN)               */}
      {/* ============================================================ */}
      <CrmLeadProfileModal
        open={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        selectedType={modalType}
        selectedId={modalType === 'parent' ? selectedParent.name : selectedStudent.id}
        parents={parentContacts}
        childList={childContacts}
        onSelectMember={(type, id) => {
          if (type === 'parent') {
            setLocalSelectedParentName(id)
            onSwitchParentPersona?.(id)
            const found = parentContacts.find((p) => p.name === id)
            if (found) setEditedParent(found)
          } else {
            setSelectedStudentId(id)
            const found = childContacts.find((c) => c.id === id)
            if (found) setEditedStudent(found)
          }
        }}
        onSwitchLead={onSwitchLead}
        onCopyPhone={handleCopy}
        onCall={handleCall}
        onZalo={handleZalo}
        onSetPrimary={handleSetPrimaryParent}
        onSaveParent={handleSaveParent}
        onSaveStudent={handleSaveStudent}
      />
    </div>
  )
}
