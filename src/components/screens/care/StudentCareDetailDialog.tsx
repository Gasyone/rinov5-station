'use client'

import { useState } from 'react'
import { StudentCareDetailDialogV1 } from './StudentCareDetailDialogV1'
import { StudentCareDetailDialogV2 } from './StudentCareDetailDialogV2'
import { type StudentCareAlert } from '@/mocks/careAlerts'

export interface StudentCareDetailDialogProps {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  alerts: StudentCareAlert[]
  onRefresh?: () => void
}

export function StudentCareDetailDialog(props: StudentCareDetailDialogProps) {
  const [version, setVersion] = useState<1 | 2>(1)

  if (version === 2) {
    return (
      <StudentCareDetailDialogV2
        {...props}
        version={version}
        onChangeVersion={setVersion}
      />
    )
  }

  return (
    <StudentCareDetailDialogV1
      {...props}
      version={version}
      onChangeVersion={setVersion}
    />
  )
}
