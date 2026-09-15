'use client'

import { StudentDetailPackageInfoTab } from './StudentDetailPackageInfoTab'
import type { StudentProgram } from './studentDetailTypes'
import type { Student } from '@/mocks/students'

interface StudentDetailV2SidePanelProps {
  program: StudentProgram
  student: Student
  onEditLevel: () => void
  onUpdateSessions?: (packageId: string, studiedSessions: number) => void
}

export function StudentDetailV2SidePanel({
  program,
  student,
  onEditLevel,
  onUpdateSessions,
}: StudentDetailV2SidePanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto pr-1">
      <StudentDetailPackageInfoTab
        program={program}
        student={student}
        onEditLevel={onEditLevel}
        onUpdateSessions={onUpdateSessions}
      />
    </div>
  )
}
