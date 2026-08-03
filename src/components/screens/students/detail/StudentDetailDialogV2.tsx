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
import { StudentDetailClasses } from './StudentDetailClasses'
import { StudentDetailLevelDialog } from './StudentDetailLevelDialog'
import { StudentDetailSessionsDialog } from './StudentDetailSessionsDialog'
import { StudentDetailV2SidePanel } from './StudentDetailV2SidePanel'
import { StudentDetailPackagesBar } from './StudentDetailPackagesBar'

// Import Helper utilities
import { getStudentPackages, getStudentNotes, getStudentFamilyMembers } from './studentDetailHelpers'
import type { StudentNote, StudentGlobalLog, StudentPackage } from './studentDetailTypes'
import { mockClassRecords } from '@/mocks/classRecords'

import { cn } from '@/lib/utils'

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
  const [mainTab, setMainTab] = useState<'classes' | 'logs'>('classes')
  const [selectedPackageId, setSelectedPackageId] = useState<string>('all')

  const [revision, setRevision] = useState(0)

  // State to hold notes and system audit logs locally
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)
  const [, setNotes] = useState<StudentNote[]>([])
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
        action: `Đã cập nhật trình độ học viên: ${newLevel} (${newSubLevel})${newSchoolClass ? ` - ${newSchoolClass}` : ''}.`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setRevision((r) => r + 1)
    setIsEditLevelOpen(false)
    toast.success('Cập nhật trình độ & lớp thành công!')
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
        action: `Cập nhật số buổi gói "${pkg.packageName}": Đã học ${newStudiedSessions}/${total} buổi.`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setIsEditSessionsOpen(false)
    toast.success('Cập nhật số buổi thành công!')
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
        id: 'init-detail',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        action: `Mở hồ sơ chi tiết học viên ${student.name}.`,
        operator: 'Hệ thống',
      }
    ])
  }

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
      ? `Chuyển lớp học viên từ ${pkg?.linkedClassName} sang ${classItem.name}.`
      : `Ghép học viên vào lớp ${classItem.name}.`

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: actionText,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    toast.success(isTransfer ? `Chuyển lớp thành công!` : `Ghép lớp thành công!`)
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
        action: `Đã thôi học lớp ${classCode}.`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])
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

        {/* Split Body Layout: Full height top to bottom */}
        <div className="grid min-h-0 flex-1 gap-4 p-6 lg:grid-cols-[1fr_430px] overflow-hidden">
          {/* Left CONTENT: Header + Student Info Card + Main Tabs */}
          <main className="flex min-h-0 flex-col overflow-hidden space-y-3">
            {/* Top Subtitle Label: Chi tiết xếp lớp */}
            <div className="text-xs font-medium text-muted-foreground select-none shrink-0">
              Chi tiết xếp lớp
            </div>

            {/* Student Info Card */}
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

            {/* Main Tabs Section: Xếp lớp & Nhật ký (Tab menu LÊN TRÊN GÓI HỌC) */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden pt-1">
              <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as 'classes' | 'logs')} className="flex min-h-0 flex-1 flex-col h-full space-y-3">
                {/* 1. Tab menu */}
                <TabsList className="shrink-0 grid w-full grid-cols-2 gap-1 bg-muted/60 p-1 h-9 rounded-lg border border-border/40">
                  <TabsTrigger
                    value="classes"
                    className={cn(
                      "h-7 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                      "hover:text-foreground"
                    )}
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Xếp lớp</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="logs"
                    className={cn(
                      "h-7 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                      "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                      "hover:text-foreground"
                    )}
                  >
                    <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span>Nhật ký</span>
                    <span className="ml-1.5 rounded-full bg-muted-foreground/15 px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground data-[state=active]:!bg-muted data-[state=active]:!text-foreground">
                      {sideLogs.length}
                    </span>
                  </TabsTrigger>
                </TabsList>

                {/* 2. Content */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                  <TabsContent value="classes" className="m-0 focus-visible:outline-none flex flex-col space-y-3">
                    {/* Dynamic Package details pills (GÓI HỌC Ở DƯỚI TAB MENU) */}
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
                  </TabsContent>

                  <TabsContent value="logs" className="m-0 focus-visible:outline-none h-full pt-1">
                    <div className="space-y-3 pr-1">
                      {sideLogs.length === 0 ? (
                        <div className="py-8 text-center text-xs text-muted-foreground italic">
                          Chưa có nhật ký hoạt động.
                        </div>
                      ) : (
                        sideLogs.map((log) => (
                          <div key={log.id} className="rounded-xl border border-border/60 bg-card p-3.5 space-y-1.5 shadow-2xs text-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <AppAvatar
                                  name={log.operator}
                                  size="xs"
                                  className="h-6 w-6 border border-primary/10"
                                />
                                <span className="font-bold text-foreground">{log.operator}</span>
                              </div>
                              <span className="text-[10px] font-mono text-muted-foreground">{log.timestamp}</span>
                            </div>
                            <p className="text-xs text-foreground/90 leading-relaxed pl-8">{log.action}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
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
