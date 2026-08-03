'use client'

import { StudentDetailPackageInfoTab } from './StudentDetailPackageInfoTab'
import type { StudentPackage } from './studentDetailTypes'
import type { EnrolledClass, Student } from '@/mocks/students'

interface StudentDetailV2SidePanelProps {
  packagesList: StudentPackage[]
  selectedPackageId: string
  setSelectedPackageId: (id: string) => void
  student: Student
  activeClass: EnrolledClass | null
  onEditLevel: () => void
  onEditSessions: () => void
}

export function StudentDetailV2SidePanel({
  packagesList,
  selectedPackageId,
  setSelectedPackageId,
  student,
  activeClass,
  onEditLevel,
  onEditSessions,
}: StudentDetailV2SidePanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto pr-1">
      <StudentDetailPackageInfoTab
        packagesList={packagesList}
        selectedPackageId={selectedPackageId}
        setSelectedPackageId={setSelectedPackageId}
        student={student}
        activeClass={activeClass}
        onEditLevel={onEditLevel}
        onEditSessions={onEditSessions}
      />
    </div>
  )
}

