'use client'

import { ConfirmDialog } from '@/components/shared'
import { StudentSelectionDialog } from '../StudentSelectionDialog'
import { RosterSessionSelectionDialog, type SelectedStudentItem } from '../RosterSessionSelectionDialog'
import { StudentDetailDialog } from '@/components/screens/students/detail/StudentDetailDialog'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession, RosterStudent } from './classesDetailTypes'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'

interface ClassesDetailDialogsProps {
  cls: ClassRecord
  sessionsState: RoadmapSession[]
  rosterState: RosterStudent[]
  isStudentSelectOpen: boolean
  setIsStudentSelectOpen: (open: boolean) => void
  isSessionSelectOpen: boolean
  setIsSessionSelectOpen: (open: boolean) => void
  tempSelectedStudents: SelectedStudentItem[] | null
  setTempSelectedStudents: (students: SelectedStudentItem[] | null) => void
  selectedStudentId: string | null
  setSelectedStudentId: (id: string | null) => void
  confirmStatusChange: ClassesStatusChangeRequest | null
  setConfirmStatusChange: (req: ClassesStatusChangeRequest | null) => void
  onStatusChangeConfirm: () => void
  onRosterConfirm: (selectedSession: RoadmapSession) => void
}

export function ClassesDetailDialogs({
  cls,
  sessionsState,
  rosterState,
  isStudentSelectOpen,
  setIsStudentSelectOpen,
  isSessionSelectOpen,
  setIsSessionSelectOpen,
  tempSelectedStudents,
  setTempSelectedStudents,
  selectedStudentId,
  setSelectedStudentId,
  confirmStatusChange,
  setConfirmStatusChange,
  onStatusChangeConfirm,
  onRosterConfirm,
}: ClassesDetailDialogsProps) {
  return (
    <>
      {/* Student placement selector dialog */}
      <StudentSelectionDialog
        open={isStudentSelectOpen}
        onOpenChange={setIsStudentSelectOpen}
        initialSelectedIds={rosterState.map((s) => s.id)}
        subject={cls.level}
        onConfirm={(selectedList) => {
          setTempSelectedStudents(selectedList)
          setIsStudentSelectOpen(false)
          setIsSessionSelectOpen(true)
        }}
      />

      {/* Starting session selection dialog */}
      <RosterSessionSelectionDialog
        open={isSessionSelectOpen}
        onOpenChange={setIsSessionSelectOpen}
        classRecord={cls}
        sessions={sessionsState}
        selectedStudents={tempSelectedStudents || []}
        onConfirm={onRosterConfirm}
      />

      {/* Confirm dialog for status transitions */}
      <ConfirmDialog
        open={!!confirmStatusChange}
        onOpenChange={(open) => {
          if (!open) setConfirmStatusChange(null)
        }}
        title={confirmStatusChange?.title || ''}
        description={confirmStatusChange?.description || ''}
        confirmLabel="Đồng ý"
        cancelLabel="Hủy"
        variant={confirmStatusChange?.newStatus === 'huy' ? 'destructive' : 'default'}
        onConfirm={onStatusChangeConfirm}
      />

      <StudentDetailDialog
        studentId={selectedStudentId}
        open={!!selectedStudentId}
        onOpenChange={(open) => {
          if (!open) setSelectedStudentId(null)
        }}
        fromClassName={cls.name}
      />
    </>
  )
}
