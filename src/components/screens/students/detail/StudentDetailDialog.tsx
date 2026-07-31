'use client'

import { StudentDetailDialogV2 } from './StudentDetailDialogV2'

export interface StudentDetailDialogProps {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTicket?: (studentId: string) => void
  fromClassName?: string
}

export function StudentDetailDialog(props: StudentDetailDialogProps) {
  return <StudentDetailDialogV2 {...props} />
}

