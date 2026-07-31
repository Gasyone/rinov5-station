'use client'

import { ClassCodeHoverCell } from '../ClassCodeHoverCell'

interface RenewalClassCodeHoverCellProps {
  classCode: string
  subject: string
  level: string
  teacherCode: string
  schedule: string
}

export function RenewalClassCodeHoverCell(props: RenewalClassCodeHoverCellProps) {
  return <ClassCodeHoverCell {...props} />
}
