'use client'

/* eslint-disable react-hooks/preserve-manual-memoization, react-hooks/immutability */

import { useState, useMemo, useRef, useCallback } from 'react'
import {
  Phone,
  GraduationCap,
  PauseCircle,
  CalendarX,
  Sparkles,
  Layers,
  Award,
  BookOpen,
  Calendar,
  Clock,
  ShieldCheck,
  Building,
  Plus,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState, AppAvatar, InteractionLogsPanel, StudentHeaderInfoCard, type ParentMemberInfo } from '@/components/shared'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockStudents, type EnrolledClass } from '@/mocks/students'
import { useCallStore } from '@/stores/useCallStore'
import { toast } from 'sonner'

// Import Tab Components
import { StudentDetailOverview } from './StudentDetailOverview'
import { StudentDetailClasses } from './StudentDetailClasses'
import { StudentDetailGlobalLogs } from './StudentDetailGlobalLogs'
import { StudentDetailSchedule } from './StudentDetailSchedule'
import { StudentDetailLevelDialog } from './StudentDetailLevelDialog'
import { StudentDetailSessionsDialog } from './StudentDetailSessionsDialog'
import { StudentDetailV2SidePanel } from './StudentDetailV2SidePanel'
import { StudentDetailPackagesBar } from './StudentDetailPackagesBar'

// Import Helper utilities
import { getStudentPackages, getStudentGlobalLogs, getStudentNotes, getStudentScheduleSessions, getStudentFamilyMembers } from './studentDetailHelpers'
import type { StudentNote, StudentGlobalLog, StudentPackage } from './studentDetailTypes'
import { mockClassRecords } from '@/mocks/classRecords'

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
  fromClassName,
  onToggleVersion,
}: StudentDetailDialogV2Props) {
  const [activeTab, setActiveTab] = useState('classes')
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'logs'>('notes')
  const [noteInput, setNoteInput] = useState('')
  const [selectedPackageId, setSelectedPackageId] = useState<string>('all')

  const [revision, setRevision] = useState(0)

  // State to hold notes and system audit logs locally
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)
  const [notes, setNotes] = useState<StudentNote[]>([])
  const [sideLogs, setSideLogs] = useState<StudentGlobalLog[]>([])
  const [packagesList, setPackagesList] = useState<StudentPackage[]>([])
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([])
  
  // States for editing dialogs
  const [isEditLevelOpen, setIsEditLevelOpen] = useState(false)
  const [isEditSessionsOpen, setIsEditSessionsOpen] = useState(false)

  // Ref to hold the assign class handler from StudentDetailClasses
  const assignClassHandlerRef = useRef<((pkg: StudentPackage) => void) | null>(null)
  const handleRegisterAssignHandler = useCallback((handler: (pkg: StudentPackage) => void) => {
    assignClassHandlerRef.current = handler
  }, [])

  const handleOpenEditLevel = () => {
    setIsEditLevelOpen(true)
  }

  const handleSaveLevel = (newLevel: string, newSubLevel: string, newSchoolClass?: string) => {
    if (student) {
      const idx = mockStudents.findIndex((s) => s.id === student.id)
      if (idx !== -1) {
        mockStudents[idx] = {
          ...mockStudents[idx],
          level: newLevel,
          subLevel: newSubLevel,
          schoolClass: newSchoolClass || mockStudents[idx].schoolClass,
        }
      }
    }

    if (activeClass) {
      setEnrolledClasses((prev) =>
        prev.map((c) =>
          c.classCode === activeClass.classCode
            ? { ...c, level: newLevel, subLevel: newSubLevel }
            : c
        )
      )
    }

    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `[V2] Đã cập nhật trình độ học viên: ${newLevel} (${newSubLevel})${newSchoolClass ? ` - ${newSchoolClass}` : ''}.`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setRevision((r) => r + 1)
    setIsEditLevelOpen(false)
    toast.success('Cập nhật trình độ & lớp thành công (V2)!')
  }

  const handleOpenEditSessions = () => {
    if (selectedPackageId === 'all') return
    setIsEditSessionsOpen(true)
  }

  const handleSaveSessions = (newStudiedSessions: number) => {
    if (selectedPackageId === 'all') return
    const pkg = packagesList.find((p) => p.id === selectedPackageId)
    if (!pkg) return

    const total = pkg.totalSessions
    const newRemaining = total - newStudiedSessions
    if (newRemaining < 0) {
      toast.error('Số buổi đã học không được lớn hơn tổng số buổi!')
      return
    }

    setPackagesList((prev) =>
      prev.map((p) =>
        p.id === selectedPackageId
          ? { ...p, remainingSessions: newRemaining }
          : p
      )
    )

    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `[V2] Cập nhật số buổi gói "${pkg.packageName}": Đã học ${newStudiedSessions}/${total} buổi.`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setIsEditSessionsOpen(false)
    toast.success('Cập nhật số buổi thành công (V2)!')
  }

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
    const activePkgs = pkgs.filter(p => p.remainingSessions > 0)
    setSelectedPackageId(activePkgs.length > 0 ? activePkgs[0].id : (pkgs.length > 0 ? pkgs[0].id : 'all'))
    setNotes(getStudentNotes(student))
    
    const initialClasses = (student.enrolledClasses || []).map((c) => {
      const matchingPkg = pkgs.find((p) => p.linkedClassCode === c.classCode)
      return {
        ...c,
        packageId: matchingPkg?.id || undefined,
      }
    })
    setEnrolledClasses(initialClasses)

    setSideLogs([
      {
        id: 'init-v2',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        action: `Mở hồ sơ chi tiết học viên ${student.name} (Giao diện V2).`,
        operator: 'Hệ thống V2',
      }
    ])
  }

  const globalTimelineLogs = useMemo(() => (student ? getStudentGlobalLogs(student) : []), [student])
  const scheduleSessions = useMemo(() => (student ? getStudentScheduleSessions(student) : []), [student])

  const filteredEnrolledClasses = useMemo(() => {
    if (selectedPackageId === 'all') return enrolledClasses
    const activePkg = packagesList.find((p) => p.id === selectedPackageId)
    return enrolledClasses.filter((c) => {
      if (c.packageId) {
        return c.packageId === selectedPackageId
      }
      return activePkg ? c.classCode === activePkg.linkedClassCode : false
    })
  }, [enrolledClasses, packagesList, selectedPackageId])

  const filteredScheduleSessions = useMemo(() => {
    if (selectedPackageId === 'all') return scheduleSessions
    const associatedClassCodes = filteredEnrolledClasses.map((c) => c.classCode)
    return scheduleSessions.filter((s) => associatedClassCodes.includes(s.classCode))
  }, [scheduleSessions, filteredEnrolledClasses, selectedPackageId])

  const activeClass = useMemo(() => {
    if (selectedPackageId === 'all') return null
    const activePkg = packagesList.find((p) => p.id === selectedPackageId)
    if (activePkg?.linkedClassCode) {
      return enrolledClasses.find((c) => c.classCode === activePkg.linkedClassCode) || null
    }
    return null
  }, [enrolledClasses, packagesList, selectedPackageId])

  const selectedPkg = useMemo(() => {
    return packagesList.find((p) => p.id === selectedPackageId) || null
  }, [packagesList, selectedPackageId])

  const birthYear = useMemo(() => {
    return student?.dob ? new Date(student.dob).getFullYear() : '2015'
  }, [student])

  const parentMembers = useMemo<ParentMemberInfo[]>(() => {
    if (!student) return []
    const raw = getStudentFamilyMembers(student)
    if (!raw || raw.length === 0) return []
    return raw.map((m, idx) => ({
      name: m.name,
      relationship: m.relationship,
      isPrimary: idx === 0,
      phone: m.phone,
      note: idx === 0
        ? 'Người liên hệ chính. Rất quan tâm lộ trình của con, thích nhận tin nhắn Zalo hơn gọi trực tiếp.'
        : 'Chỉ liên hệ khi khẩn cấp hoặc không gọi được cho mẹ.',
    }))
  }, [student])

  const handleConfirmAssignment = (pkgId: string, classItem: { id: string; name: string; startSession?: string }) => {
    const pkg = packagesList.find((p) => p.id === pkgId)
    const oldClassCode = pkg?.linkedClassCode
    const foundClass = mockClassRecords.find((c) => c.id === classItem.id || c.code === classItem.id)
    const assignedClassCode = foundClass?.code || classItem.id

    setPackagesList((prev) =>
      prev.map((p) => {
        if (p.id === pkgId) {
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
      startDate: new Date().toISOString().split('T')[0],
      nextLessonDate: classItem.startSession,
      packageId: pkgId,
    }

    setEnrolledClasses((prev) => {
      let updated = [...prev]
      updated = updated.map((c) => {
        if (c.packageId === pkgId && c.classCode !== assignedClassCode) {
          return { ...c, status: 'dropped' as const }
        }
        if (oldClassCode && c.classCode === oldClassCode) {
          return { ...c, status: 'dropped' as const }
        }
        return c
      })

      const existsIdx = updated.findIndex((c) => c.classCode === newEnrolledClass.classCode)
      if (existsIdx !== -1) {
        updated[existsIdx] = { ...updated[existsIdx], status: 'active' as const, packageId: pkgId }
      } else {
        updated.push(newEnrolledClass)
      }
      return updated
    })

    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    const isTransfer = !!oldClassCode
    const actionText = isTransfer
      ? `[V2] Chuyển lớp học viên từ ${pkg?.linkedClassName} sang ${classItem.name}.`
      : `[V2] Ghép học viên vào lớp ${classItem.name}.`

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: actionText,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    toast.success(isTransfer ? `[V2] Chuyển lớp thành công!` : `[V2] Ghép lớp thành công!`)
  }

  const handleChangeClassStatus = (classCode: string, newStatus: EnrolledClass['status']) => {
    setEnrolledClasses((prev) =>
      prev.map((c) => (c.classCode === classCode ? { ...c, status: newStatus, packageId: c.packageId || selectedPackageId } : c))
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

    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `[V2] Đã thôi học lớp ${classCode}.`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])
  }

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    const newNoteText = noteInput.trim()
    
    setNotes((prev) => [
      {
        id: Math.random().toString(),
        text: newNoteText,
        author: 'Giáo vụ Lan (V2)',
        timestamp: timestampStr
      },
      ...prev
    ])

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `[V2] Thêm ghi chú: "${newNoteText.substring(0, 35)}..."`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setNoteInput('')
  }

  if (!student) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="sr-only">
            <DialogTitle>Không tìm thấy học viên</DialogTitle>
          </DialogHeader>
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
      <DialogContent className="flex h-[90vh] max-h-[900px] flex-col overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] bg-gray-50 dark:bg-zinc-950 border-primary/20 shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Chi tiết học viên: {student.name}</DialogTitle>
        </DialogHeader>

        {/* Split Body Layout V2: Full height top to bottom */}
        <div className="grid min-h-0 flex-1 gap-4 p-6 lg:grid-cols-[1fr_430px] overflow-hidden">
          {/* Left CONTENT: Student Info Card + Main Tabs */}
          <main className="flex min-h-0 flex-col overflow-hidden space-y-4">
            {/* Student Info Card (Dùng Component dùng chung StudentHeaderInfoCard) */}
            <StudentHeaderInfoCard
              studentAvatar={studentAvatar}
              studentName={student.name}
              status={student.status === 'active' ? 'Đang học' : student.status}
              birthDate={student.dob ? new Date(student.dob).toLocaleDateString('vi-VN') : '15/03/2005'}
              gender={student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
              address="Số 49 Nguyễn Tuân, Nam Từ Liêm, Hà Nội"
              cid={cid}
              uid={uid}
              sid={sid}
              initialNote={student.notes || 'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.'}
              parents={parentMembers}
            />

            {/* Dynamic Package details pills OUTSIDE and BELOW Student Info Card */}
            <div className="shrink-0">
              <StudentDetailPackagesBar
                packagesList={packagesList}
                selectedPackageId={selectedPackageId}
                setSelectedPackageId={setSelectedPackageId}
                student={student}
                activeClass={activeClass}
                onEditLevel={handleOpenEditLevel}
                onEditSessions={handleOpenEditSessions}
                hideMetadata
              />
            </div>

            {/* Main Section Content: Lớp học */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 pt-2">
              <StudentDetailClasses
                classes={filteredEnrolledClasses}
                packages={packagesList}
                selectedPackageId={selectedPackageId}
                studentName={student.name}
                studentCode={studentCode}
                studentBranch={student.branch}
                studentLevel={student.level}
                onConfirmAssignment={handleConfirmAssignment}
                onChangeClassStatus={handleChangeClassStatus}
                onRegisterAssignHandler={handleRegisterAssignHandler}
              />
            </div>
          </main>

          {/* Right: Full top-to-bottom Side panel */}
          <aside className="flex min-h-0 flex-col overflow-hidden">
            <StudentDetailV2SidePanel
              packagesList={packagesList}
              selectedPackageId={selectedPackageId}
              setSelectedPackageId={setSelectedPackageId}
              student={student}
              activeClass={activeClass}
              onEditLevel={handleOpenEditLevel}
              onEditSessions={handleOpenEditSessions}
              notes={notes}
              sideLogs={sideLogs}
              noteInput={noteInput}
              onNoteInputChange={setNoteInput}
              onAddNote={handleAddNote}
            />
          </aside>
        </div>
      </DialogContent>

      {/* Dialog: Chỉnh sửa Trình độ */}
      <StudentDetailLevelDialog
        open={isEditLevelOpen}
        onOpenChange={setIsEditLevelOpen}
        initialLevel={activeClass?.level || student?.level || ''}
        initialSubLevel={activeClass?.subLevel || student?.subLevel || ''}
        initialSchoolClass={student?.schoolClass || 'Lớp 6'}
        onSave={handleSaveLevel}
      />

      {/* Dialog: Chỉnh sửa Số buổi */}
      <StudentDetailSessionsDialog
        key={selectedPkg?.id ?? 'all'}
        open={isEditSessionsOpen}
        onOpenChange={setIsEditSessionsOpen}
        totalSessions={selectedPkg?.totalSessions || 24}
        initialStudiedSessions={selectedPkg ? selectedPkg.totalSessions - selectedPkg.remainingSessions : 0}
        onSave={handleSaveSessions}
      />
    </Dialog>
  )
}
