'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import type { ClassRecord } from '@/mocks/classRecords'
import { ClassesDetailView } from '../classes/detail/ClassesDetailView'

interface ClassesDetailSheetProps {
  cls: ClassRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (id: string) => void
  onClassesChange: React.Dispatch<React.SetStateAction<ClassRecord[]>>
}

export function ClassesDetailSheet({
  cls,
  open,
  onOpenChange,
  onEdit,
  onClassesChange,
}: ClassesDetailSheetProps) {
  if (!cls) return null

  const handleSave = (updatedClass: ClassRecord) => {
    onClassesChange((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    )
  }

  const handleStatusChange = (id: string, newStatus: ClassRecord['status']) => {
    onClassesChange((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="grid h-full max-h-screen grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] bg-background">
        <SheetHeader className="sr-only">
          <SheetTitle>Chi tiết lớp học {cls.name}</SheetTitle>
          <SheetDescription>Mã lớp học {cls.code}</SheetDescription>
        </SheetHeader>
        <ClassesDetailView
          cls={cls}
          initialEditMode={false}
          initialTab="roster"
          initialRoadmapWizard={false}
          initialStudentSelect={false}
          onEdit={onEdit}
          onSave={handleSave}
          onStatusChange={handleStatusChange}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  )
}
