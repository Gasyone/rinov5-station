'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState, ConfirmDialog } from '@/components/shared'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { mockStudents, type EnrolledClass } from '@/mocks/students'
import { toast } from 'sonner'

// Import Tab Components & Sub-columns
import { StudentDetailAcademicColumn } from './StudentDetailAcademicColumn'
import { StudentDetailPackageWalletColumn } from './StudentDetailPackageWalletColumn'
import { StudentDetailLevelDialog } from './StudentDetailLevelDialog'
import { StudentDetailProgramsBar, defaultHistoricalOldPackages } from './StudentDetailProgramsBar'
import { StudentClassAssignmentDialog } from './StudentClassAssignmentDialog'
import { StudentDetailProfilePanel } from './StudentDetailProfilePanel'
import { StudentDetailScheduleSlotsDialog } from './StudentDetailScheduleSlotsDialog'
import { StudentDetailSessionsDialog } from './StudentDetailSessionsDialog'
import { StudentProgramQuotaSummaryCard } from './StudentProgramQuotaSummaryCard'
import {
  StudentDetailEditProfileDialog,
  type StudentProfileUpdateData,
} from './StudentDetailEditProfileDialog'

// Import Helper utilities
import { getStudentPackages, getStudentPrograms } from './studentDetailHelpers'
import type { StudentPackage, StudentAvailableSlot } from './studentDetailTypes'
import { mockClassRecords } from '@/mocks/classRecords'
import { LeaveReserveCreateDialog } from '@/components/screens/leave-reserve/LeaveReserveCreateDialog'
import { StudentCareEarlyReturnDialog } from '@/components/screens/care/StudentCareEarlyReturnDialog'
import { StudentCareDetailDialog } from '@/components/screens/care/StudentCareDetailDialog'
import { mockCareAlerts } from '@/mocks/careAlerts'
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
  const [selectedProgramId, setSelectedProgramId] = useState<string>('')

  const [revision, setRevision] = useState(0)

  // State to hold packages and enrolled classes locally
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)
  const [packagesList, setPackagesList] = useState<StudentPackage[]>([])
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([])

  // Dialog States
  const [customScheduleSlots, setCustomScheduleSlots] = useState<Record<string, StudentAvailableSlot[]>>({})
  const [customProgramSessions, setCustomProgramSessions] = useState<Record<string, number>>({})
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isEditLevelOpen, setIsEditLevelOpen] = useState(false)
  const [isEditScheduleSlotsOpen, setIsEditScheduleSlotsOpen] = useState(false)
  const [isEditSessionsOpen, setIsEditSessionsOpen] = useState(false)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [assignTargetPkgId, setAssignTargetPkgId] = useState<string | null>(null)
  const [isConfirmDropOpen, setIsConfirmDropOpen] = useState(false)
  const [isCreateLeaveReserveOpen, setIsCreateLeaveReserveOpen] = useState(false)
  const [createLeaveReserveType, setCreateLeaveReserveType] = useState<'off' | 'reservation'>('off')
  const [isEarlyReturnOpen, setIsEarlyReturnOpen] = useState(false)
  const [isRenewalDetailOpen, setIsRenewalDetailOpen] = useState(false)
  const [expandedProgramIds, setExpandedProgramIds] = useState<Record<string, boolean>>({})

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
    const initProgs = getStudentPrograms(student, pkgs, initialClasses)
    if (initProgs.length > 0) {
      setSelectedProgramId(initProgs[0].id)
    }
  }

  // Derive programs list from current packages and classes
  const programs = useMemo(() => {
    if (!student) return []
    return getStudentPrograms(student, packagesList, enrolledClasses)
  }, [student, packagesList, enrolledClasses])

  const selectedProgram = useMemo(() => {
    if (programs.length === 0) return null
    const base = programs.find((p) => p.id === selectedProgramId) || programs[0]
    let result = base
    if (customScheduleSlots[base.id]) {
      result = {
        ...result,
        availableSlots: customScheduleSlots[base.id],
      }
    }
    if (customProgramSessions[base.id] !== undefined) {
      const studied = customProgramSessions[base.id]
      const total = base.totalSessions || 44
      result = {
        ...result,
        studiedSessions: studied,
        remainingSessions: Math.max(0, total - studied),
      }
    }
    return result
  }, [programs, selectedProgramId, customScheduleSlots, customProgramSessions])

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

  // Determine Deducting Package (Active in-use) vs Queued (Next in line)
  const { activeDeductingPackage, nextQueuedPackage } = useMemo(() => {
    if (!selectedProgram || activePackages.length === 0) {
      return { activeDeductingPackage: null, nextQueuedPackage: null }
    }

    // Prioritize package linked to current class or first package with remaining sessions
    const activePkg: StudentPackage | null =
      activePackages.find((p) => p.linkedClassCode && p.linkedClassCode === selectedProgram.currentClass?.classCode && p.remainingSessions > 0) ||
      activePackages.find((p) => p.remainingSessions > 0) ||
      activePackages[0]

    const remaining = activePackages.filter((p) => p.id !== activePkg.id)
    const nextPkg: StudentPackage | null = remaining.find((p) => p.remainingSessions > 0) || null

    return {
      activeDeductingPackage: activePkg,
      nextQueuedPackage: nextPkg,
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

  const handleSaveScheduleSlots = (newSlots: StudentAvailableSlot[]) => {
    if (selectedProgram) {
      setCustomScheduleSlots((prev) => ({
        ...prev,
        [selectedProgram.id]: newSlots,
      }))
    }
    setRevision((r) => r + 1)
    toast.success('Cập nhật khung giờ học viên rảnh thành công!')
  }

  const handleSaveSessions = (newStudied: number) => {
    if (selectedProgram) {
      setCustomProgramSessions((prev) => ({
        ...prev,
        [selectedProgram.id]: newStudied,
      }))
    }
    setRevision((r) => r + 1)
    setIsEditSessionsOpen(false)
    toast.success('Cập nhật số buổi học thành công!')
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

  const handleConfirmAssignment = (pkgId: string, classItem: { id: string; name: string; startSession?: string; notes?: string }) => {
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
            notes: classItem.notes,
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
      notes: classItem.notes,
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

  const handleSaveProfile = (updatedData: StudentProfileUpdateData) => {
    if (!student) return
    const target = mockStudents.find((s) => s.id === student.id)
    if (target) {
      target.name = updatedData.name
      target.englishName = updatedData.englishName
      if (updatedData.avatar) target.avatar = updatedData.avatar
      target.gender = updatedData.gender
      target.dob = updatedData.dob
    }
    setRevision((r) => r + 1)
    toast.success('Đã cập nhật thông tin học viên thành công!')
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
      <DialogContent className="flex max-h-[92vh] sm:max-h-[88vh] flex-col overflow-hidden p-2.5 sm:p-3.5 pt-2 sm:pt-2 gap-1 w-[96vw] max-w-[96vw] sm:max-w-[94vw] md:max-w-[90vw] lg:max-w-[1060px] xl:max-w-[1120px] bg-gray-50 dark:bg-zinc-950 border-primary/20 shadow-2xl rounded-xl sm:rounded-2xl">
        {/* Top Header Bar: Dialog Title */}
        <div className="flex items-center justify-between select-none shrink-0 pr-8">
          <DialogTitle className="text-xs font-normal text-muted-foreground">
            Chi tiết xếp lớp
          </DialogTitle>
        </div>

        {/* ── BỐ CỤC 2 CỘT: CỘT TRÁI (TAB CHƯƠNG TRÌNH, LỚP HỌC), CỘT PHẢI (HỒ SƠ HỌC VIÊN TRÊN CÙNG, TRÌNH ĐỘ, GIỜ RẢNH, VÍ GÓI HỌC) ── */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px] min-h-0 flex-1 gap-2 lg:gap-2.5 overflow-y-auto lg:overflow-hidden">
          {/* CỘT TRÁI: TAB CHƯƠNG TRÌNH/GÓI HỌC (SÁT HEADER) + TIẾN TRÌNH HỌC TẬP & LỚP HỌC */}
          <div className="flex min-h-0 flex-col space-y-2 pr-0 lg:pr-1 lg:overflow-y-auto scrollbar-thin shrink-0 lg:shrink">
            {/* 1. KHUNG SECTION GÓI HỌC: Đóng khung cả cụm, có button thu gọn/mở rộng ở giữa dưới tab gói (mặc định thường đóng) */}
            {(() => {
              const currentProgId = selectedProgram?.id || programs[0]?.id || ''
              const isPackageInfoExpanded = Boolean(expandedProgramIds[currentProgId])

              return (
                <div className="relative rounded-xl border border-border/80 bg-card px-1.5 py-1.5 sm:px-2 sm:py-2 shadow-2xs text-left shrink-0 mb-3">
                  {/* Tab các gói học (ở trên, luôn có đường line ở dưới) */}
                  <div className="pb-1.5 sm:pb-2 border-b border-border/50 -mx-1.5 sm:-mx-2 px-1.5 sm:px-2">
                    <StudentDetailProgramsBar
                      programs={programs}
                      selectedProgramId={currentProgId}
                      onSelectProgram={setSelectedProgramId}
                      historicalPackages={student.id === 's-baohan' ? defaultHistoricalOldPackages : []}
                    />
                  </div>

                  {/* Thông tin chi tiết gói học đang chọn (Dòng 1 Tên gói học luôn hiển thị ở chế độ thu gọn; Dòng 2 & 3 hiển thị khi mở rộng) */}
                  {selectedProgram && (
                    <div className="pt-1.5 pb-2 sm:pb-2.5">
                      <StudentProgramQuotaSummaryCard
                        program={selectedProgram}
                        studentBranch={student.branch}
                        isExpanded={isPackageInfoExpanded}
                        onOpenRenewalDetail={() => setIsRenewalDetailOpen(true)}
                        onEditSessions={() => setIsEditSessionsOpen(true)}
                      />
                    </div>
                  )}

                  {/* Button thu gọn / mở rộng nằm ở giữa cạnh dưới cùng của section, bám theo cạnh đáy */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedProgramIds((prev) => ({
                          ...prev,
                          [currentProgId]: !prev[currentProgId],
                        }))
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-background px-2.5 py-0.5 text-[10.5px] font-normal text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40 transition-colors cursor-pointer shadow-3xs select-none"
                      title={isPackageInfoExpanded ? 'Thu gọn thông tin gói học' : 'Mở rộng thông tin gói học'}
                      aria-expanded={isPackageInfoExpanded}
                    >
                      <span>{isPackageInfoExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
                      {isPackageInfoExpanded ? (
                        <ChevronUp className="h-3 w-3 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              )
            })()}

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
                onOpenRenewalDetail={() => setIsRenewalDetailOpen(true)}
                onOpenEarlyReturn={() => setIsEarlyReturnOpen(true)}
              />
            )}
          </div>

          {/* CỘT PHẢI: HỒ SƠ HỌC VIÊN (TRÊN CÙNG) + TRÌNH ĐỘ MỤC TIÊU + KHUNG GIỜ + VÍ GÓI HỌC */}
          <div className="flex min-h-0 flex-col space-y-2 pr-0 lg:pr-0.5 lg:overflow-y-auto scrollbar-thin shrink-0 lg:shrink pb-2 lg:pb-0">
            {/* 1. Thẻ thông tin học viên chuẩn màn chăm sóc (chuyển sang panel phải, trên cùng) */}
            <StudentDetailProfilePanel
              student={student}
              onEditProfile={() => setIsEditProfileOpen(true)}
            />

            {/* 2. Trình độ học viên + Khung giờ học viên rảnh */}
            {selectedProgram && (
              <StudentDetailPackageWalletColumn
                program={selectedProgram}
                studentBranch={student.branch}
                studentSaleName={student.saleName}
                csmName={selectedProgram.csmName}
                onEditScheduleSlots={() => setIsEditScheduleSlotsOpen(true)}
                onEditLevel={handleOpenEditLevel}
              />
            )}
          </div>
        </div>
      </DialogContent>

      {/* Dialog: Chi tiết màn Tái phí (StudentCareDetailDialog) */}
      {student && (
        <StudentCareDetailDialog
          studentId={student.id}
          open={isRenewalDetailOpen}
          onOpenChange={setIsRenewalDetailOpen}
          alerts={mockCareAlerts}
          onRefresh={() => setRevision((r) => r + 1)}
        />
      )}

      {/* Dialog: Chỉnh sửa Khung giờ học viên rảnh */}
      <StudentDetailScheduleSlotsDialog
        open={isEditScheduleSlotsOpen}
        onOpenChange={setIsEditScheduleSlotsOpen}
        initialSlots={selectedProgram?.availableSlots || []}
        onSave={handleSaveScheduleSlots}
      />

      {/* Dialog: Chỉnh sửa Trình độ & Thông tin */}
      <StudentDetailLevelDialog
        open={isEditLevelOpen}
        onOpenChange={setIsEditLevelOpen}
        initialLevel={selectedProgram?.level || student?.level || ''}
        initialSubLevel={selectedProgram?.subLevel || student?.subLevel || ''}
        initialSchoolClass={student?.schoolClass || 'Lớp 6'}
        isEnglish={
          selectedProgram?.subject === 'english' ||
          Boolean(selectedProgram?.name.toLowerCase().includes('tiếng anh'))
        }
        onSave={handleSaveLevel}
      />

      {/* Dialog: Chỉnh sửa thông tin cá nhân & Ảnh học viên */}
      {student && (
        <StudentDetailEditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          initialData={{
            name: student.name,
            englishName: student.englishName,
            avatar: student.avatar,
            gender: student.gender,
            dob: student.dob,
          }}
          onSave={handleSaveProfile}
        />
      )}

      {/* Dialog: Cập nhật số buổi học ở TỔNG chương trình */}
      <StudentDetailSessionsDialog
        open={isEditSessionsOpen}
        onOpenChange={setIsEditSessionsOpen}
        totalSessions={selectedProgram?.totalSessions || 24}
        initialStudiedSessions={
          selectedProgram
            ? selectedProgram.studiedSessions ?? Math.max(0, selectedProgram.totalSessions - selectedProgram.remainingSessions)
            : 0
        }
        onSave={handleSaveSessions}
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
          studentSubLevel={selectedProgram.subLevel || student.subLevel}
          availableSlots={selectedProgram.availableSlots}
          packageName={activeAssignPackage?.packageName || selectedProgram.packages[0]?.packageName || `Chương trình ${selectedProgram.name}`}
          pkgRemainingSessions={activeAssignPackage?.remainingSessions ?? selectedProgram.remainingSessions}
          pkgTotalSessions={activeAssignPackage?.totalSessions ?? selectedProgram.totalSessions ?? (student.totalSessions || 96)}
          pkgStudiedSessions={activeAssignPackage ? (activeAssignPackage.totalSessions - activeAssignPackage.remainingSessions) : (selectedProgram.studiedSessions ?? 80)}
          studentClasses={enrolledClasses}
          currentClassCode={activeAssignPackage?.linkedClassCode || selectedProgram.currentClass?.classCode}
          currentClassName={activeAssignPackage?.linkedClassName || selectedProgram.currentClass?.className}
          student={student}
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
