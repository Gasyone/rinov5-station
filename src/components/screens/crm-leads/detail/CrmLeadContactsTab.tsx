'use client'

import React, { useState, useMemo } from 'react'
import {
  User,
  UserCheck,
  Copy,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
}

export function CrmLeadContactsTab({
  lead,
  onSwitchLead,
  onUpdateLead,
  activeParentName,
  onSwitchParentPersona,
  basePath,
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
      {/* BỐ CỤC 2 CỘT SONG SONG: PANEL TRÁI (CHÂN DUNG LEAD & PHỤ HUYNH) | PANEL PHẢI (CHÂN DUNG HỌC VIÊN) */}
      {/* Không giàn cả 2 cột nữa                                      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 items-start">
        {/* PANEL TRÁI: CHÂN DUNG LEAD / THÔNG TIN PHỤ HUYNH */}
        <div className="space-y-3.5">
          {/* Header Bối cảnh Lead: Mã Lead, Ngày tạo & Chuyển đổi Phụ huynh chăm sóc */}
          <div className="rounded-xl border border-sky-200/90 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20 p-3 space-y-2.5 shadow-2xs">
            {/* HÀNG 1: Tiêu đề + Mã Lead + Ngày tạo */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="font-bold text-foreground text-xs flex items-center gap-1.5 shrink-0">
                <UserCheck className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
                Chân dung Lead
              </span>
              <span className="text-muted-foreground/40 shrink-0">•</span>
              <button
                type="button"
                onClick={() => {
                  const code = lead.code || 'LD-10291-A'
                  navigator.clipboard.writeText(code)
                  toast.success(`Đã sao chép mã Lead: ${code}`)
                }}
                className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                title="Nhấp để sao chép mã Lead"
              >
                <span>Mã: {lead.code || 'LD-10291-A'}</span>
                <Copy className="h-3 w-3 text-muted-foreground/70 hover:text-foreground" />
              </button>
              <span className="text-muted-foreground/40 shrink-0">•</span>
              <span className="text-xs text-muted-foreground font-normal shrink-0">
                Ngày tạo: {lead.createdAt || '10/08/2026'}
              </span>
            </div>

            {/* HÀNG 2: Section Chọn Phụ Huynh & Thẻ các con khác của Phụ huynh */}
            {(parentContacts.length > 1 || siblingLeads.length > 0) && (
              <div className="pt-2 border-t border-sky-200/70 dark:border-sky-800/60 space-y-2">
                {/* Chọn phụ huynh */}
                {parentContacts.length > 1 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                      Phụ huynh:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {parentContacts.map((p) => {
                        const isSelected = selectedParent.name === p.name
                        return (
                          <button
                            key={p.name}
                            type="button"
                            onClick={() => handleSwitchParent(p)}
                            className={cn(
                              'h-6.5 px-2.5 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer border shrink-0',
                              isSelected
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                : 'bg-background hover:bg-muted text-foreground border-border/70'
                            )}
                          >
                            <User className="h-2.5 w-2.5" />
                            <span>
                              {p.role}: {p.name}
                            </span>
                            {p.isPrimary && (
                              <span
                                className={cn(
                                  'text-[8px] px-1 rounded-xs font-bold uppercase',
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
                                )}
                              >
                                Chính
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Thẻ các con khác của phụ huynh / gia đình */}
                {siblingLeads.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap pt-0.5">
                    <span className="text-[11px] text-muted-foreground font-medium shrink-0">
                      Con khác:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {siblingLeads.map((sib) => (
                        <a
                          key={sib.id}
                          href={sib.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-md text-[11px] font-medium text-sky-700 dark:text-sky-300 bg-white dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/90 dark:border-sky-800 transition-colors shadow-3xs cursor-pointer select-none group/sib shrink-0"
                          title={`Mở hồ sơ Lead của ${sib.name} trong tab mới`}
                        >
                          <span>{sib.name}</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-60 group-hover/sib:opacity-100 group-hover/sib:translate-x-0.5 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chi tiết hồ sơ phụ huynh */}
          <CrmLeadParentProfileView
            parent={selectedParent}
            isEditing={isEditingParent}
            editedParent={editedParent}
            setEditedParent={setEditedParent}
            allParents={parentContacts}
            onSelectParent={handleSwitchParent}
            onSetPrimary={handleSetPrimaryParent}
            onCopyPhone={handleCopy}
            onCall={handleCall}
            onZalo={handleZalo}
            onStartEdit={handleStartEditParent}
            onCancelEdit={handleCancelEditParent}
            onSave={handleSaveParent}
            onZoom={() => handleOpenZoom('parent')}
          />
        </div>

        {/* PANEL PHẢI: CHÂN DUNG HỌC VIÊN */}
        <CrmLeadStudentProfileView
          student={selectedStudent}
          isEditing={isEditingStudent}
          editedStudent={editedStudent}
          setEditedStudent={setEditedStudent}
          onStartEdit={handleStartEditStudent}
          onCancelEdit={handleCancelEditStudent}
          onSave={handleSaveStudent}
          onZoom={() => handleOpenZoom('student')}
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
