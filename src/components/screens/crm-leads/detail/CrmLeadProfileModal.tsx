'use client'

import React, { useState } from 'react'
import {
  Users,
  Pencil,
  Save,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CrmLeadParentProfileView } from './CrmLeadParentProfileView'
import { CrmLeadStudentProfileView } from './CrmLeadStudentProfileView'
import type { ParentContact } from './CrmLeadParentCard'
import type { ChildPersonaItem } from './CrmLeadChildCard'

export interface CrmLeadProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedType: 'parent' | 'student'
  selectedId: string
  parents: ParentContact[]
  childList: ChildPersonaItem[]
  onSelectMember: (type: 'parent' | 'student', id: string) => void
  onSwitchLead?: (leadId: string) => void
  onCopyPhone: (phone: string, name: string) => void
  onCall: (phone: string, name: string) => void
  onZalo: (phone: string, name: string) => void
  onSetPrimary?: (parent: ParentContact) => void
  onSaveParent?: (parent: ParentContact) => void
  onSaveStudent?: (student: ChildPersonaItem) => void
}

export function CrmLeadProfileModal({
  open,
  onOpenChange,
  selectedType,
  selectedId,
  parents,
  childList,
  onSelectMember,
  onSwitchLead,
  onCopyPhone,
  onCall,
  onZalo,
  onSetPrimary,
  onSaveParent,
  onSaveStudent,
}: CrmLeadProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false)

  const currentParent =
    (selectedType === 'parent'
      ? parents.find((p) => p.name === selectedId || p.phone === selectedId)
      : parents.find((p) => p.isPrimary)) ||
    parents[0]

  const currentStudent =
    (selectedType === 'student'
      ? childList.find((c) => c.id === selectedId || c.code === selectedId || c.name === selectedId)
      : childList.find((c) => c.isCurrent)) ||
    childList[0]

  const currentKey = `${selectedType}-${selectedId}-${open}`
  const [prevKey, setPrevKey] = useState(currentKey)
  const [editedParent, setEditedParent] = useState<ParentContact>(currentParent)
  const [editedStudent, setEditedStudent] = useState<ChildPersonaItem>(currentStudent)

  if (currentKey !== prevKey) {
    setPrevKey(currentKey)
    if (currentParent) setEditedParent(currentParent)
    if (currentStudent) setEditedStudent(currentStudent)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    if (currentParent) setEditedParent(currentParent)
    if (currentStudent) setEditedStudent(currentStudent)
    setIsEditing(false)
  }

  const handleSave = () => {
    onSaveParent?.(editedParent)
    onSaveStudent?.(editedStudent)
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] sm:max-w-[95vw] md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden border-border/80 shadow-2xl">
        {/* ============================================================ */}
        {/* TOP BAR: TIÊU ĐỀ & NÚT CHẾ ĐỘ EDIT                            */}
        {/* ============================================================ */}
        <div className="bg-muted/40 border-b border-border/60 px-5 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                Hồ sơ Chân dung Lead &amp; Học viên
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-0.5">
                Chân dung toàn diện người bảo trợ và đối tượng học viên phục vụ tư vấn chốt sales
              </DialogDescription>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 pr-8">
            {!isEditing ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="h-8 px-3 text-xs font-bold border-primary text-primary hover:bg-primary/10 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Chỉnh sửa hồ sơ</span>
              </Button>
            ) : (
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="h-8 px-2.5 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  <span>Hủy</span>
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="h-8 px-3.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Lưu thay đổi</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* MAIN BODY: 2 CỘT SONG SONG (PHỤ HUYNH + HỌC VIÊN)             */}
        {/* ============================================================ */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {/* CỘT TRÁI: CHÂN DUNG PHỤ HUYNH / LEAD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                  1. Chân dung Phụ huynh / Người bảo trợ (Lead)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Người trả tiền &amp; quyết định
                </span>
              </div>
              <CrmLeadParentProfileView
                parent={currentParent}
                isEditing={isEditing}
                editedParent={editedParent}
                setEditedParent={setEditedParent}
                allParents={parents}
                onSelectParent={(p) => onSelectMember('parent', p.name)}
                onSetPrimary={onSetPrimary}
                onCopyPhone={onCopyPhone}
                onCall={onCall}
                onZalo={onZalo}
              />
            </div>

            {/* CỘT PHẢI: CHÂN DUNG HỌC VIÊN */}
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-border/70">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                  2. Chân dung Học viên (Đối tượng học tập)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Trực tiếp học &amp; trải nghiệm
                </span>
              </div>
              <CrmLeadStudentProfileView
                student={currentStudent}
                isEditing={isEditing}
                editedStudent={editedStudent}
                setEditedStudent={setEditedStudent}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
