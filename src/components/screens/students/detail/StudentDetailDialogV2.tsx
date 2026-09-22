'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState, ConfirmDialog } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Printer, Edit3 } from 'lucide-react'
import { mockStudents, type EnrolledClass } from '@/mocks/students'
import { toast } from 'sonner'

// Import Tab Components & Sub-columns
import { StudentDetailAcademicColumn } from './StudentDetailAcademicColumn'
import { StudentDetailPackageWalletColumn } from './StudentDetailPackageWalletColumn'
import { StudentDetailLevelDialog } from './StudentDetailLevelDialog'
import { StudentDetailProgramsBar } from './StudentDetailProgramsBar'
import { StudentClassAssignmentDialog } from './StudentClassAssignmentDialog'
import { StudentDetailProfilePanel } from './StudentDetailProfilePanel'

// Import Helper utilities
import { getStudentPackages, getStudentPrograms } from './studentDetailHelpers'
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
  const [assignTargetPkgId, setAssignTargetPkgId] = useState<string | null>(null)
  const [isConfirmDropOpen, setIsConfirmDropOpen] = useState(false)
  const [isCreateLeaveReserveOpen, setIsCreateLeaveReserveOpen] = useState(false)
  const [createLeaveReserveType, setCreateLeaveReserveType] = useState<'off' | 'reservation'>('off')
  const [isEarlyReturnOpen, setIsEarlyReturnOpen] = useState(false)

  const student = useMemo(() => {
    if (!studentId) return null

    // 1. Exact match by id (e.g. "s-baohan", "s-baonam", "s1", "s2")
    const directMatch = mockStudents.find((s) => s.id === studentId)
    if (directMatch) return directMatch

    // 2. Case-insensitive match
    const lowerMatch = mockStudents.find((s) => s.id.toLowerCase() === studentId.toLowerCase())
    if (lowerMatch) return lowerMatch

    // 3. Match formatted student code (e.g. "STU-00-baohan", "STU-001", "STU-00-baonam")
    const codeMatch = mockStudents.find((s) => {
      const codeClean = s.id.startsWith('s-')
        ? `STU-00-${s.id.replace('s-', '')}`
        : `STU-00${s.id.replace('s', '')}`
      return codeClean.toLowerCase() === studentId.toLowerCase()
    })
    if (codeMatch) return codeMatch

    // 4. Prefix match (for composite keys like "s-baohan-LD_TOAN_00032")
    const prefixMatch = mockStudents.find((s) => studentId.startsWith(s.id))
    if (prefixMatch) return prefixMatch

    // 5. Match by stripped STU prefix: "STU-00-baohan" -> "s-baohan", "STU-001" -> "s1"
    const strippedId = studentId.replace(/^STU-00-?/, '').replace(/^STU-/, '')
    const strippedMatch = mockStudents.find(
      (s) =>
        s.id === strippedId ||
        s.id === `s-${strippedId}` ||
        s.id === `s${strippedId}` ||
        s.id.toLowerCase().includes(strippedId.toLowerCase())
    )
    if (strippedMatch) return strippedMatch

    // 6. Legacy fallback
    const firstPart = studentId.split('-')[0]
    return mockStudents.find((s) => s.id === firstPart) || null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, revision])

  // Sync state when studentId changes
  if (student && student.id !== prevStudentId) {
    setPrevStudentId(student.id)
    const pkgs = getStudentPackages(student)
    setPackagesList(pkgs)

    const initialClasses = (student.enrolledClasses || []).map((c) => {
      const matchingPkg = pkgs.find((p: StudentPackage) => p.linkedClassCode === c.classCode)
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

  const activeAssignPackage = useMemo(() => {
    if (!selectedProgram) return null
    if (assignTargetPkgId) {
      return selectedProgram.packages.find((p) => p.id === assignTargetPkgId) || selectedProgram.packages[0]
    }
    return selectedProgram.packages[0]
  }, [selectedProgram, assignTargetPkgId])

  // Active / current packages (remaining sessions > 0 or active status)
  const activePackages = useMemo(() => {
    if (!selectedProgram) return []
    return selectedProgram.packages.filter(
      (p) => p.status !== 'transferred' && p.status !== 'cancelled' && (p.remainingSessions > 0 || p.status === 'active')
    )
  }, [selectedProgram])

  // Ended / historical packages
  const historicalPackages = useMemo(() => {
    if (!selectedProgram) return []
    return selectedProgram.packages.filter(
      (p) => p.status === 'transferred' || p.status === 'cancelled' || p.remainingSessions === 0
    )
  }, [selectedProgram])

  // Determine Deducting Package (Active in-use) vs Queued (Next in line)
  const { activeDeductingPackage, nextQueuedPackage, otherActivePackages } = useMemo(() => {
    if (!selectedProgram || activePackages.length === 0) {
      return { activeDeductingPackage: null, nextQueuedPackage: null, otherActivePackages: [] }
    }

    // Prioritize package linked to current class or first package with remaining sessions
    const activePkg: StudentPackage | null =
      activePackages.find((p) => p.linkedClassCode && p.linkedClassCode === selectedProgram.currentClass?.classCode && p.remainingSessions > 0) ||
      activePackages.find((p) => p.remainingSessions > 0) ||
      activePackages[0]

    const remaining = activePackages.filter((p) => p.id !== activePkg.id)
    const nextPkg: StudentPackage | null = remaining.find((p) => p.remainingSessions > 0) || null
    const others = remaining.filter((p) => p.id !== nextPkg?.id)

    return {
      activeDeductingPackage: activePkg,
      nextQueuedPackage: nextPkg,
      otherActivePackages: others,
    }
  }, [activePackages, selectedProgram])

  const handleOpenAssignForPackage = (pkgId?: string) => {
    setAssignTargetPkgId(pkgId || null)
    setIsAssignOpen(true)
  }

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

  const studentCode = student.id.startsWith('s-')
    ? `STU-00-${student.id.replace('s-', '')}`
    : `STU-00${student.id.replace('s', '')}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[900px] flex-col overflow-hidden p-5 pt-3.5 sm:max-w-[95vw] lg:max-w-[1380px] bg-gray-50 dark:bg-zinc-950 border-primary/20 shadow-2xl">
        {/* Top Header Bar: Dialog Title & quick actions */}
        <div className="flex items-center justify-between select-none shrink-0 pr-8">
          <DialogTitle className="text-sm font-normal text-muted-foreground">
            Chi tiết xếp lớp
          </DialogTitle>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => toast.info('Đang kết nối máy in để in thẻ học viên...')}
              className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer shadow-3xs"
              title="In thẻ học viên"
            >
              <Printer className="h-3.5 w-3.5 mr-1" />
              <span>In hồ sơ</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenEditLevel}
              className="h-7 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer shadow-3xs"
              title="Chỉnh sửa thông tin học viên & trình độ"
            >
              <Edit3 className="h-3.5 w-3.5 mr-1" />
              <span>Chỉnh sửa</span>
            </Button>
          </div>
        </div>

        {/* ── BỐ CỤC 2 CỘT: CỘT TRÁI (HỒ SƠ, TAB CHƯƠNG TRÌNH, LỚP HỌC), CỘT PHẢI (TRÌNH ĐỘ, GIỜ RẢNH, VÍ GÓI HỌC) ── */}
        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_430px] overflow-hidden pt-1">
          {/* CỘT TRÁI: THÔNG TIN HỌC VIÊN + TAB CHƯƠNG TRÌNH + TIẾN TRÌNH HỌC TẬP & LỚP HỌC */}
          <div className="flex min-h-0 flex-col overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
            {/* 1. Thẻ thông tin học viên chuẩn màn chăm sóc (đưa sang trái, trên tab chương trình) */}
            <StudentDetailProfilePanel student={student} />

            {/* 2. Tab chương trình môn học + Thao tác nhanh (ở panel trái) */}
            <div className="pt-0.5 pb-0.5">
              <StudentDetailProgramsBar
                programs={programs}
                selectedProgramId={selectedProgram?.id || 'prog-math'}
                onSelectProgram={setSelectedProgramId}
                onOpenAssignClass={() => handleOpenAssignForPackage()}
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
                onTransfer={() => handleOpenAssignForPackage()}
                onDrop={() => setIsConfirmDropOpen(true)}
                onAssignClass={() => handleOpenAssignForPackage()}
                isReserved={isStudentReserved}
                isWaitingForAssignment={isWaitingForAssignment}
              />
            </div>

            {/* 3. Tiến trình học tập, Lớp hiện tại, Cơ sở phụ trách, Cấn trừ buổi, Thao tác, Lịch sử lớp */}
            {selectedProgram && (
              <StudentDetailAcademicColumn
                program={selectedProgram}
                studentName={student.name}
                studentCode={studentCode}
                studentBranch={student.branch}
                studentLevel={selectedProgram.level || student.level}
                activeDeductingPackage={activeDeductingPackage}
                nextQueuedPackage={nextQueuedPackage}
                onOpenAssignClass={(pkgId) => handleOpenAssignForPackage(pkgId)}
                onLeaveClass={() => {
                  setCreateLeaveReserveType('off')
                  setIsCreateLeaveReserveOpen(true)
                }}
                onReserveClass={() => {
                  setCreateLeaveReserveType('reservation')
                  setIsCreateLeaveReserveOpen(true)
                }}
                onDropClass={() => setIsConfirmDropOpen(true)}
              />
            )}
          </div>

          {/* CỘT PHẢI: PANEL PHẢI NHỎ - TRÌNH ĐỘ MỤC TIÊU LÊN SÁT TRÊN CÙNG + KHUNG GIỜ + VÍ GÓI HỌC */}
          <div className="flex min-h-0 flex-col overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
            {/* Trình độ mục tiêu (sát trên cùng) + Khung giờ rảnh + Ví gói học (không có học phí) */}
            {selectedProgram && (
              <StudentDetailPackageWalletColumn
                program={selectedProgram}
                activeDeductingPackage={activeDeductingPackage}
                nextQueuedPackage={nextQueuedPackage}
                otherActivePackages={otherActivePackages}
                historicalPackages={historicalPackages}
                onReservePackage={() => {
                  setCreateLeaveReserveType('reservation')
                  setIsCreateLeaveReserveOpen(true)
                }}
                onOpenAssignClass={(pkgId) => handleOpenAssignForPackage(pkgId)}
              />
            )}
          </div>
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
          onOpenChange={(val) => {
            setIsAssignOpen(val)
            if (!val) setAssignTargetPkgId(null)
          }}
          studentName={student.name}
          studentCode={studentCode}
          studentBranch={student.branch}
          studentLevel={selectedProgram.level || student.level}
          packageName={activeAssignPackage?.packageName || selectedProgram.packages[0]?.packageName || `Chương trình ${selectedProgram.name}`}
          pkgRemainingSessions={activeAssignPackage?.remainingSessions ?? selectedProgram.remainingSessions}
          studentClasses={enrolledClasses}
          currentClassCode={activeAssignPackage?.linkedClassCode || selectedProgram.currentClass?.classCode}
          currentClassName={activeAssignPackage?.linkedClassName || selectedProgram.currentClass?.className}
          onConfirm={(classItem) => handleConfirmAssignment(activeAssignPackage?.id || selectedProgram.packages[0]?.id || 'pkg-1', classItem)}
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
