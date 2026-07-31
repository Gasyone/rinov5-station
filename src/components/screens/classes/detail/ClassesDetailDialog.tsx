'use client'

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ClassRecord } from '@/mocks/classRecords'
import { ClassesDetailViewV2 } from './ClassesDetailViewV2'

export interface ClassesDetailDialogProps {
  cls: ClassRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  initialEditMode?: boolean
  initialTab?: string
  initialRoadmapWizard?: boolean
  initialStudentSelect?: boolean
  onEdit?: (id: string) => void
  onSave?: (updatedClass: ClassRecord) => void
  onStatusChange?: (id: string, newStatus: ClassRecord['status']) => void
}

export function ClassesDetailDialog({
  cls,
  open,
  onOpenChange,
  initialEditMode = false,
  initialTab = 'roster',
  initialRoadmapWizard = false,
  initialStudentSelect = false,
  onEdit,
  onSave,
  onStatusChange,
}: ClassesDetailDialogProps) {
  if (!cls) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[900px] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1440px]">
        <DialogTitle className="sr-only">
          Chi tiết lớp học {cls.name}
        </DialogTitle>
        <ClassesDetailViewV2
          cls={cls}
          initialEditMode={initialEditMode}
          initialTab={initialTab}
          initialRoadmapWizard={initialRoadmapWizard}
          initialStudentSelect={initialStudentSelect}
          onEdit={onEdit}
          onSave={onSave}
          onStatusChange={onStatusChange}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export { ClassesDetailDialogV2 } from './ClassesDetailDialogV2'

