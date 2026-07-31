'use client'

import { useState } from 'react'
import { StudentDetailDialogV1 } from './StudentDetailDialogV1'
import { StudentDetailDialogV2 } from './StudentDetailDialogV2'

export interface StudentDetailDialogProps {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTicket?: (studentId: string) => void
  fromClassName?: string
  defaultVersion?: 'v1' | 'v2'
}

export function StudentDetailDialog({
  studentId,
  open,
  onOpenChange,
  onCreateTicket,
  fromClassName,
  defaultVersion = 'v2',
}: StudentDetailDialogProps) {
  const [version, setVersion] = useState<'v1' | 'v2'>(defaultVersion)

  const handleToggleVersion = () => {
    setVersion((prev) => (prev === 'v1' ? 'v2' : 'v1'))
  }

  if (version === 'v2') {
    return (
      <StudentDetailDialogV2
        studentId={studentId}
        open={open}
        onOpenChange={onOpenChange}
        onCreateTicket={onCreateTicket}
        fromClassName={fromClassName}
        onToggleVersion={handleToggleVersion}
      />
    )
  }

  return (
    <StudentDetailDialogV1
      studentId={studentId}
      open={open}
      onOpenChange={onOpenChange}
      onCreateTicket={onCreateTicket}
      fromClassName={fromClassName}
      onToggleVersion={handleToggleVersion}
    />
  )
}
