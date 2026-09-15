'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState, StudentHeaderInfoCard, ConfirmDialog, type ParentMemberInfo } from '@/components/shared'
import { mockStudents, type EnrolledClass } from '@/mocks/students'
import { toast } from 'sonner'

// Import Tab Components
import { StudentDetailClasses } from './StudentDetailClasses'
import { StudentDetailLevelDialog } from './StudentDetailLevelDialog'
import { StudentDetailV2SidePanel } from './StudentDetailV2SidePanel'
import { StudentDetailProgramsBar } from './StudentDetailProgramsBar'
import { StudentClassAssignmentDialog } from './StudentClassAssignmentDialog'

// Import Helper utilities
import { getStudentPackages, getStudentFamilyMembers, getStudentPrograms } from './studentDetailHelpers'
import type { StudentPackage } from './studentDetailTypes'
import { mockClassRecords } from '@/mocks/classRecords'
import { LeaveReserveCreateDialog } from '@/components/screens/leave-reserve/LeaveReserveCreateDialog'
import { StudentCareEarlyReturnDialog } from '@/components/screens/care/StudentCareEarlyReturnDialog'
import { formatDateISO } from '@/components/screens/leave-reserve/leaveReserveHelpers'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'

export interface StudentDetailDialogV2Props {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTicket?: (studentId: string) => void
  fromClassName?: string
  onToggleVersion?: () => void
}

export function StudentDetailDialogV2({
  studentId,
  open,
  onOpenChange,
}: StudentDetailDialogV2Props) {
  const [selectedProgramId, setSelectedProgramId] = useState<string>('prog-math')

  const [revision, setRevision] = useState(0)

  // State to hold packages and enrolled classes locally
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)
  const [packagesList, setPackagesList] = useState<StudentPackage[]>([])
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([])

  // Dialog States
  const [isEditLevelOpen, setIsEditLevelOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isConfirmDropOpen, setIsConfirmDropOpen] = useState(false)
  const [isCreateLeaveReserveOpen, setIsCreateLeaveReserveOpen] = useState(false)
  const [createLeaveReserveType, setCreateLeaveReserveType] = useState<'off' | 'reservation'>('off')
  const [isEarlyReturnOpen, setIsEarlyReturnOpen] = useState(false)

  const student = useMemo(() => {
    if (!studentId) return null
    const cleanId = studentId.split('-')[0]
    return mockStudents.find((s) => s.id === cleanId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, revision])

  // Sync state when studentId changes
  if (student && student.id !== prevStudentId) {
    setPrevStudentId(student.id)
    const pkgs = getStudentPackages(student)
    setPackagesList(pkgs)

    const initialClasses = (student.enrolledClasses || []).map((c) => {
      const matchingPkg = pkgs.find((p) => p.linkedClassCode === c.classCode)
      return {
        ...c,
        packageId: matchingPkg?.id || undefined,
      }
    })
    setEnrolledClasses(initialClasses)
  }

  // Derive programs list from current packages and classes
  const programs = useMemo(() => {
    if (!student) return []
    return getStudentPrograms(student, packagesList, enrolledClasses)
  }, [student, packagesList, enrolledClasses])

  const selectedProgram = useMemo(() => {
    if (programs.length === 0) return null
    return programs.find((p) => p.id === selectedProgramId) || programs[0]
  }, [programs, selectedProgramId])

  const isStudentReserved = useMemo(() => {
    return selectedProgram?.programStatus === 'reserved' || student?.status === 'reserve'
  }, [selectedProgram, student])

  const isWaitingForAssignment = useMemo(() => {
    if (isStudentReserved) return false
    return (
      selectedProgram?.programStatus === 'wait_for_assignment' ||
      selectedProgram?.programStatus === 'dropped' ||
      !selectedProgram?.currentClass ||
      student?.status === 'wait_for_assignment' ||
      student?.status === 'pending' ||
      student?.status === 'draft_class' ||
      student?.status === 'enroll_later' ||
      student?.status === 'pending_transfer' ||
      (enrolledClasses.length === 0 && !selectedProgram?.currentClass)
    )
  }, [isStudentReserved, selectedProgram, student, enrolledClasses])

  const handleOpenEditLevel = () => {
    setIsEditLevelOpen(true)
  }

  const handleSaveLevel = (newLevel: string, newSubLevel: string, newSchoolClass?: string, newEngName?: string) => {
    if (student) {
      const idx = mockStudents.findIndex((s) => s.id === student.id)
      if (idx !== -1) {
        mockStudents[idx] = {
          ...mockStudents[idx],
          level: newLevel,
          subLevel: newSubLevel,
          schoolClass: newSchoolClass || mockStudents[idx].schoolClass,
          englishName: newEngName !== undefined ? newEngName : mockStudents[idx].englishName,
        }
      }
    }

    if (selectedProgram?.currentClass) {
      setEnrolledClasses((prev) =>
        prev.map((c) =>
          c.classCode === selectedProgram.currentClass?.classCode
            ? { ...c, level: newLevel, subLevel: newSubLevel }
            : c
        )
      )
    }

    setRevision((r) => r + 1)
    setIsEditLevelOpen(false)
    toast.success('Cập nhật thông tin thành công!')
  }

  const handleSaveEnglishName = (newEngName: string) => {
    if (student) {
      const idx = mockStudents.findIndex((s) => s.id === student.id)
      if (idx !== -1) {
        mockStudents[idx] = {
          ...mockStudents[idx],
          englishName: newEngName,
        }
      }
    }

    setRevision((r) => r + 1)
    toast.success('Cập nhật tên tiếng Anh thành công!')
  }

  const handleCreateLeaveReserveSubmit = (newReq: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>) => {
    const idPrefix = newReq.type === 'off' ? 'NP' : 'BL'
    const newId = `${idPrefix}${String(mockLeaveReserveRequests.length + 1).padStart(3, '0')}`
    const createdRequest: LeaveReserveRequest = {
      ...newReq,
      id: newId,
      status: 'pending',
      requestedDate: formatDateISO(new Date()),
    }
    mockLeaveReserveRequests.unshift(createdRequest)
    setIsCreateLeaveReserveOpen(false)
    toast.success(
      `Tạo ${newReq.type === 'off' ? 'đơn xin nghỉ phép' : 'đơn bảo lưu'} thành công (${newId})!`,
      {
        description: `Học viên: ${newReq.studentName} • Bắt đầu: ${newReq.startDate}`,
      }
    )
  }

  const handleUpdateSessions = (packageId: string, newStudied: number) => {
    setPackagesList((prev) =>
      prev.map((p) => {
        if (p.id === packageId) {
          const remaining = Math.max(0, p.totalSessions - newStudied)
          return {
            ...p,
            remainingSessions: remaining,
          }
        }
        return p
      })
    )
    if (student) {
      const sIdx = mockStudents.findIndex((s) => s.id === student.id)
      if (sIdx !== -1) {
        mockStudents[sIdx] = {
          ...mockStudents[sIdx],
          remainingSessions: Math.max(0, (mockStudents[sIdx].totalSessions || 96) - newStudied),
        }
      }
    }
    setRevision((r) => r + 1)
  }

  const parentMembers = useMemo<ParentMemberInfo[]>(() => {
    if (!student) return []
    const raw = getStudentFamilyMembers(student)
    if (!raw || raw.length === 0) return []
    return raw.map((m, idx) => ({
      name: m.name,
      relationship: m.relationship,
      isPrimary: idx === 0,
      phone: m.phone,
    }))
  }, [student])

  const handleConfirmAssignment = (pkgId: string, classItem: { id: string; name: string; startSession?: string }) => {
    const pkg = packagesList.find((p) => p.id === pkgId) || selectedProgram?.packages[0]
    const actualPkgId = pkg?.id || pkgId
    const oldClassCode = pkg?.linkedClassCode || selectedProgram?.currentClass?.classCode
    const foundClass = mockClassRecords.find((c) => c.id === classItem.id || c.code === classItem.id)
    const assignedClassCode = foundClass?.code || classItem.id

    setPackagesList((prev) =>
      prev.map((p) => {
        if (p.id === actualPkgId) {
          return {
            ...p,
            linkedClassCode: assignedClassCode,
            linkedClassName: classItem.name,
            startSessionDate: classItem.startSession,
          }
        }
        return p
      })
    )

    const newEnrolledClass: EnrolledClass = {
      classCode: assignedClassCode,
      className: foundClass?.name || classItem.name,
      type: foundClass?.room?.toLowerCase() === 'online' ? 'online' : 'offline',
      scheduleSlots: foundClass?.scheduleSlots || [],
      teacherName: foundClass?.teacher || '—',
      status: 'active',
      progress: '0 / 24 buổi',
      branch: foundClass?.branch || student?.branch || 'RinoEdu Nguyễn Tuân',
      room: foundClass?.room || '—',
      level: selectedProgram?.level || student?.level || 'Toán 1:6',
      subLevel: selectedProgram?.subLevel || student?.subLevel || 'A',
      programName: selectedProgram?.name,
      startDate: new Date().toISOString().split('T')[0],
      nextLessonDate: classItem.startSession,
      packageId: actualPkgId,
    }

    setEnrolledClasses((prev) => {
      let updated = [...prev]
      updated = updated.map((c) => {
        if (oldClassCode && c.classCode === oldClassCode) {
          return { ...c, status: 'dropped' as const }
        }
        return c
      })

      const existsIdx = updated.findIndex((c) => c.classCode === newEnrolledClass.classCode)
      if (existsIdx !== -1) {
        updated[existsIdx] = { ...updated[existsIdx], status: 'active' as const, packageId: actualPkgId }
      } else {
        updated.push(newEnrolledClass)
      }
      return updated
    })

    setIsAssignOpen(false)
    const isTransfer = !!oldClassCode
    toast.success(isTransfer ? 'Chuyển lớp thành công!' : 'Ghép lớp thành công!')
  }

  const handleChangeClassStatus = (classCode: string, newStatus: EnrolledClass['status']) => {
    setEnrolledClasses((prev) =>
      prev.map((c) => (c.classCode === classCode ? { ...c, status: newStatus } : c))
    )

    if (newStatus === 'dropped') {
      setPackagesList((prev) =>
        prev.map((p) => {
          if (p.linkedClassCode === classCode) {
            return {
              ...p,
              linkedClassCode: undefined,
              linkedClassName: undefined,
              startSessionDate: undefined,
            }
          }
          return p
        })
      )
    }
  }

  if (!student) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle className="sr-only">Không tìm thấy học viên</DialogTitle>
          <EmptyState
            title="Không tìm thấy học viên"
            description="Học viên này không tồn tại hoặc đã bị xóa khỏi hệ thống."
          />
        </DialogContent>
      </Dialog>
    )
  }

  const studentCode = `STU-00${student.id.replace('s', '')}`
  const studentAvatar = student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`

  const studentIdx = parseInt(student.id.replace('s', '')) || 1
  const cid = `VH2309${93 + studentIdx}`
  const uid = `1111${84 + studentIdx}`
  const sid = `1930${59 + studentIdx}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[900px] flex-col overflow-hidden p-5 pt-3.5 sm:max-w-[95vw] lg:max-w-[1380px] bg-gray-50 dark:bg-zinc-950 border-primary/20 shadow-2xl">
        {/* Top Header Bar: Dialog Title & close clearance */}
        <div className="flex items-center justify-between pb-1 select-none shrink-0 pr-8">
          <DialogTitle className="text-xs font-normal text-muted-foreground">
            Chi tiết học viên
          </DialogTitle>
        </div>

        {/* Split Body Layout: Full height top to bottom, flush to both edges */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_420px] overflow-hidden">
          {/* Left CONTENT: Student Info Card + Main Programs & Classes */}
          <main className="flex min-h-0 flex-col overflow-hidden space-y-2">
            {/* Student Info Card */}
            <StudentHeaderInfoCard
              studentAvatar={studentAvatar}
              studentName={student.name}
              englishName={student.englishName}
              onSaveEnglishName={handleSaveEnglishName}
              birthDate={student.dob ? new Date(student.dob).toLocaleDateString('vi-VN') : '15/03/2005'}
              gender={student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
              address="Số 49 Nguyễn Tuân, Nam Từ Liêm, Hà Nội"
              cid={cid}
              uid={uid}
              sid={sid}
              initialNote={student.notes || 'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.'}
              parents={parentMembers}
              onLeave={() => {
                setCreateLeaveReserveType('off')
                setIsCreateLeaveReserveOpen(true)
              }}
              onReserve={() => {
                setCreateLeaveReserveType('reservation')
                setIsCreateLeaveReserveOpen(true)
              }}
              onResume={() => {
                setIsEarlyReturnOpen(true)
              }}
              onTransfer={() => setIsAssignOpen(true)}
              onDrop={() => setIsConfirmDropOpen(true)}
              onAssignClass={() => setIsAssignOpen(true)}
              isReserved={isStudentReserved}
              isWaitingForAssignment={isWaitingForAssignment}
            />

            {/* Programs Bar + Classes List (Left Panel) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 flex flex-col space-y-3 pt-1">
              {/* Program Tabs + [+ Ghép lớp] on the same row */}
              <div className="shrink-0">
                <StudentDetailProgramsBar
                  programs={programs}
                  selectedProgramId={selectedProgram?.id || 'prog-math'}
                  onSelectProgram={setSelectedProgramId}
                  onOpenAssignClass={() => setIsAssignOpen(true)}
                />
              </div>

              {/* Classes content for selected program */}
              {selectedProgram && (
                <StudentDetailClasses
                  program={selectedProgram}
                  studentName={student.name}
                  studentCode={studentCode}
                  studentBranch={student.branch}
                  studentLevel={selectedProgram.level || student.level}
                  onChangeClassStatus={handleChangeClassStatus}
                  onOpenAssignClass={() => setIsAssignOpen(true)}
                  onDirectAssign={(classItem) => handleConfirmAssignment(selectedProgram.packages[0]?.id || 'pkg-1', classItem)}
                />
              )}
            </div>
          </main>

          {/* Right: Side panel with Program Info, flush to right edge, aligned with student info */}
          <aside className="flex min-h-0 flex-col overflow-hidden">
            {selectedProgram && (
              <StudentDetailV2SidePanel
                program={selectedProgram}
                student={student}
                onEditLevel={handleOpenEditLevel}
                onUpdateSessions={handleUpdateSessions}
              />
            )}
          </aside>
        </div>
      </DialogContent>

      {/* Dialog: Chỉnh sửa Trình độ & Thông tin */}
      <StudentDetailLevelDialog
        open={isEditLevelOpen}
        onOpenChange={setIsEditLevelOpen}
        initialLevel={selectedProgram?.level || student?.level || ''}
        initialSubLevel={selectedProgram?.subLevel || student?.subLevel || ''}
        initialSchoolClass={student?.schoolClass || 'Lớp 6'}
        initialEnglishName={student?.englishName || ''}
        onSave={handleSaveLevel}
      />

      {/* Dialog: Chọn ghép / chuyển lớp học */}
      {selectedProgram && (
        <StudentClassAssignmentDialog
          open={isAssignOpen}
          onOpenChange={setIsAssignOpen}
          studentName={student.name}
          studentCode={studentCode}
          studentBranch={student.branch}
          studentLevel={selectedProgram.level || student.level}
          packageName={selectedProgram.packages[0]?.packageName || `Chương trình ${selectedProgram.name}`}
          pkgRemainingSessions={selectedProgram.remainingSessions}
          studentClasses={enrolledClasses}
          currentClassCode={selectedProgram.currentClass?.classCode}
          currentClassName={selectedProgram.currentClass?.className}
          onConfirm={(classItem) => handleConfirmAssignment(selectedProgram.packages[0]?.id || 'pkg-1', classItem)}
        />
      )}

      {/* Dialog: Xác nhận thoát lớp */}
      <ConfirmDialog
        open={isConfirmDropOpen}
        onOpenChange={setIsConfirmDropOpen}
        title="Xác nhận thoát lớp"
        description={`Bạn có chắc chắn muốn cho học viên ${student?.name} thoát khỏi lớp ${selectedProgram?.currentClass?.classCode || 'hiện tại'}?`}
        confirmLabel="Xác nhận thoát lớp"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={() => {
          if (selectedProgram?.currentClass?.classCode) {
            handleChangeClassStatus(selectedProgram.currentClass.classCode, 'dropped')
          }
          setIsConfirmDropOpen(false)
          toast.success(`Đã cho học viên ${student?.name} thoát khỏi lớp thành công.`)
        }}
      />

      {/* Dialog: Tạo đơn nghỉ phép / bảo lưu */}
      {student && (
        <LeaveReserveCreateDialog
          key={`${student.id}-${createLeaveReserveType}`}
          open={isCreateLeaveReserveOpen}
          onOpenChange={setIsCreateLeaveReserveOpen}
          initialType={createLeaveReserveType}
          initialStudentId={student.id}
          onSubmit={handleCreateLeaveReserveSubmit}
        />
      )}

      {/* Dialog: Xác nhận đi học lại sớm (khi đang bảo lưu) */}
      {student && (
        <StudentCareEarlyReturnDialog
          key={`early-return-${student.id}`}
          open={isEarlyReturnOpen}
          onOpenChange={setIsEarlyReturnOpen}
          studentName={student.name}
          studentCode={studentCode}
          studentId={student.id}
          packageName={selectedProgram?.name || 'Khóa học'}
          className={selectedProgram?.currentClass?.className || 'Lớp học'}
          classCode={selectedProgram?.currentClass?.classCode || 'CLS-001'}
          isHoldingClass={Boolean(selectedProgram?.currentClass?.classCode)}
          expectedReturnDate={selectedProgram?.reservedInfo?.expiryDate || '16/09/2026'}
          remainingSessions={selectedProgram?.remainingSessions ?? 20}
          branchName={student.branch || 'RinoEdu Nguyễn Tuân'}
          onSuccess={() => {
            setIsEarlyReturnOpen(false)
            if (student) {
              const sIdx = mockStudents.findIndex((s) => s.id === student.id)
              if (sIdx !== -1) {
                mockStudents[sIdx] = {
                  ...mockStudents[sIdx],
                  status: 'active',
                }
              }
            }
            setRevision((r) => r + 1)
            toast.success(`Học viên ${student.name} đã hoàn tất thủ tục quay lại học!`)
          }}
        />
      )}
    </Dialog>
  )
}
