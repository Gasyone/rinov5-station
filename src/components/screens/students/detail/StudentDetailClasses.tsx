'use client'

import { useState, useMemo, useEffect } from 'react'
import { BookOpen, Plus, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared'
import type { EnrolledClass } from '@/mocks/students'
import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { toast } from 'sonner'
import type { StudentPackage } from './studentDetailTypes'
import { StudentClassAssignmentDialog } from './StudentClassAssignmentDialog'
import { StudentDetailClassCard } from './StudentDetailClassCard'
import { StudentDetailRecommendedClasses } from './StudentDetailRecommendedClasses'

export interface StudentDetailClassesProps {
  classes: EnrolledClass[]
  packages: StudentPackage[]
  selectedPackageId: string
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  hideSectionHeader?: boolean
  onConfirmAssignment: (pkgId: string, classItem: { id: string; name: string; startSession?: string }) => void
  onChangeClassStatus: (classCode: string, newStatus: EnrolledClass['status']) => void
  onRegisterAssignHandler?: (handler: (pkg: StudentPackage) => void) => void
}

export function StudentDetailClasses({
  classes,
  packages,
  selectedPackageId,
  studentName,
  studentCode,
  studentBranch,
  studentLevel,
  hideSectionHeader = false,
  onConfirmAssignment,
  onChangeClassStatus,
  onRegisterAssignHandler,
}: StudentDetailClassesProps) {
  const [selectedClassRecord, setSelectedClassRecord] = useState<ClassRecord | null>(null)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false)
  const [initialTabForDetail, setInitialTabForDetail] = useState<string>('schedule')

  // Dialog State: Class Assignment
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedPkgToAssign, setSelectedPkgToAssign] = useState<StudentPackage | null>(null)

  const [confirmDropOpen, setConfirmDropOpen] = useState(false)
  const [selectedClassToManage, setSelectedClassToManage] = useState<EnrolledClass | null>(null)

  const handleOpenAssignClass = (pkg: StudentPackage) => {
    setSelectedPkgToAssign(pkg)
    setAssignOpen(true)
  }

  // Register handler with parent for external trigger
  useEffect(() => {
    if (onRegisterAssignHandler) {
      onRegisterAssignHandler(handleOpenAssignClass)
    }
  }, [onRegisterAssignHandler])

  const handleConfirmAssignment = (classItem: { id: string; name: string; startSession?: string }) => {
    if (!selectedPkgToAssign) return
    onConfirmAssignment(selectedPkgToAssign.id, classItem)
    setAssignOpen(false)
    setSelectedPkgToAssign(null)
  }

  const currentPackage = useMemo(() => {
    if (selectedPackageId === 'all') {
      return packages.find((p) => p.status === 'active' && p.remainingSessions > 0) || packages[0] || null
    }
    return packages.find((p) => p.id === selectedPackageId) || null
  }, [packages, selectedPackageId])

  const handleSelectClassRecord = (record: ClassRecord, tab: string = 'schedule') => {
    setSelectedClassRecord(record)
    setInitialTabForDetail(tab)
    setIsClassDetailOpen(true)
  }

  // Sort classes: Active / waiting / pending transfer first, dropped last
  const sortedClasses = useMemo(() => {
    if (!classes) return []
    const statusPriority: Record<string, number> = {
      active: 1,
      wait_for_assignment: 2,
      pending_transfer: 3,
      dropped: 4,
      session_ended: 5,
    }
    return [...classes].sort((a, b) => {
      const prioA = statusPriority[a.status] || 99
      const prioB = statusPriority[b.status] || 99
      return prioA - prioB
    })
  }, [classes])

  // Check if current package / student is unassigned or has no active class
  const showRecommendedSection = useMemo(() => {
    if (!sortedClasses || sortedClasses.length === 0) return true
    const activeOrPending = sortedClasses.some(
      (c) => c.status === 'active' || c.status === 'wait_for_assignment' || c.status === 'pending_transfer'
    )
    if (!activeOrPending) return true
    if (currentPackage && !currentPackage.linkedClassCode) return true
    return false
  }, [sortedClasses, currentPackage])

  // Suitable matching recommended classes
  const recommendedClasses = useMemo(() => {
    const assignedCodes = new Set(sortedClasses.map((c) => c.classCode.toLowerCase()))
    return mockClassRecords
      .filter(
        (c) =>
          !assignedCodes.has(c.code.toLowerCase()) &&
          (c.status === 'mo_chieu_sinh' || c.status === 'cho_khai_giang' || c.status === 'dang_hoc')
      )
      .slice(0, 3)
  }, [sortedClasses])

  return (
    <div className="w-full space-y-3 pt-0">
      {/* Section Header: Lớp học + Nút thao tác nghiệp vụ (Chuyển lớp, Nghỉ, Ghép lớp) */}
      {!hideSectionHeader && (
        <div className="pb-1 mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-xs text-primary">Lớp học</span>
          </div>

          <div className="flex items-center gap-2">
            {(() => {
              const activeClass = sortedClasses.find(
                (c) => c.status === 'active' || c.status === 'wait_for_assignment' || c.status === 'pending_transfer'
              )
              if (activeClass) {
                const activeLinkedPkg =
                  packages.find(
                    (p) => p.linkedClassCode === activeClass.classCode || p.id === activeClass.packageId
                  ) || currentPackage

                return (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="text-[10px] h-7 px-2.5 flex items-center gap-1 border-primary/20 hover:border-primary text-primary hover:bg-primary/5 cursor-pointer font-semibold shadow-2xs"
                      onClick={() => {
                        if (activeLinkedPkg) handleOpenAssignClass(activeLinkedPkg)
                      }}
                      title="Đổi sang lớp học khác"
                    >
                      <ArrowLeftRight className="h-3 w-3" /> Chuyển lớp
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="xs"
                      className="text-[10px] h-7 px-2.5 flex items-center gap-1 text-destructive hover:text-destructive border-destructive/20 hover:border-destructive hover:bg-destructive/5 cursor-pointer font-semibold shadow-2xs"
                      onClick={() => {
                        setSelectedClassToManage(activeClass)
                        setConfirmDropOpen(true)
                      }}
                      title="Duyệt thoát khỏi lớp này"
                    >
                      Nghỉ
                    </Button>
                  </>
                )
              } else if (currentPackage && currentPackage.remainingSessions > 0) {
                return (
                  <Button
                    type="button"
                    size="sm"
                    className="whitespace-nowrap h-7 text-xs font-medium cursor-pointer"
                    onClick={() => handleOpenAssignClass(currentPackage)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1 inline-block" /> Ghép lớp
                  </Button>
                )
              }
              return null
            })()}
          </div>
        </div>
      )}

      {/* Main content: Enrolled classes list or Empty placeholder */}
      {!sortedClasses || sortedClasses.length === 0 ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-dashed border-border/60 bg-transparent px-4 py-3.5 text-xs text-center text-muted-foreground flex items-center justify-center">
            <span>Học viên chưa được ghép vào lớp học nào cho gói này.</span>
          </div>
          {showRecommendedSection && (
            <StudentDetailRecommendedClasses
              recommendedClasses={recommendedClasses}
              currentPackage={currentPackage}
              packages={packages}
              onSelectClassRecord={handleSelectClassRecord}
              onOpenAssignClass={handleOpenAssignClass}
            />
          )}
        </div>
      ) : (
        <div className="w-full space-y-4">
          {sortedClasses.map((cls) => {
            const classRecord =
              mockClassRecords.find(
                (c) => c.code.toLowerCase() === cls.classCode.toLowerCase()
              ) || null

            return (
              <StudentDetailClassCard
                key={cls.classCode}
                cls={cls}
                classRecord={classRecord}
                studentLevel={studentLevel}
                studentBranch={studentBranch}
                onSelectClassRecord={handleSelectClassRecord}
              />
            )
          })}

          {showRecommendedSection && (
            <StudentDetailRecommendedClasses
              recommendedClasses={recommendedClasses}
              currentPackage={currentPackage}
              packages={packages}
              onSelectClassRecord={handleSelectClassRecord}
              onOpenAssignClass={handleOpenAssignClass}
            />
          )}
        </div>
      )}

      {/* Dialog: Chi tiết lớp học */}
      <ClassesDetailDialog
        cls={selectedClassRecord}
        open={isClassDetailOpen}
        onOpenChange={setIsClassDetailOpen}
        initialTab={initialTabForDetail}
      />

      {/* Dialog: Chọn ghép/chuyển lớp học */}
      {selectedPkgToAssign && (
        <StudentClassAssignmentDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          studentName={studentName}
          studentCode={studentCode}
          studentBranch={studentBranch}
          studentLevel={studentLevel}
          packageName={selectedPkgToAssign.packageName}
          pkgRemainingSessions={selectedPkgToAssign.remainingSessions}
          studentClasses={classes}
          currentClassCode={selectedPkgToAssign.linkedClassCode}
          currentClassName={selectedPkgToAssign.linkedClassName}
          onConfirm={handleConfirmAssignment}
        />
      )}

      {/* Modal xác nhận Thôi học / Nghỉ lớp */}
      <ConfirmDialog
        open={confirmDropOpen}
        onOpenChange={setConfirmDropOpen}
        title="Xác nhận Thôi học / Rút khỏi lớp"
        description={`Bạn có chắc chắn muốn duyệt cho học viên ${studentName} thôi học khỏi lớp "${selectedClassToManage?.className}"? Hành động này sẽ chuyển trạng thái của học viên thành Đã thoát lớp.`}
        confirmLabel="Xác nhận Thôi học"
        variant="destructive"
        onConfirm={() => {
          if (selectedClassToManage) {
            onChangeClassStatus(selectedClassToManage.classCode, 'dropped')
            toast.success(`Đã cập nhật trạng thái thôi học lớp ${selectedClassToManage.className}!`)
          }
          setConfirmDropOpen(false)
        }}
      />
    </div>
  )
}
