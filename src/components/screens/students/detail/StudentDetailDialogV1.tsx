'use client'

/* eslint-disable react-hooks/preserve-manual-memoization, react-hooks/immutability */

import { useState, useMemo } from 'react'
import {
  Phone,
  GraduationCap,
  PauseCircle,
  CalendarX,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EmptyState, AppAvatar, InteractionLogsPanel } from '@/components/shared'
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
import { StudentDetailPackagesBar } from './StudentDetailPackagesBar'

// Import Helper utilities
import { getStudentPackages, getStudentGlobalLogs, getStudentNotes, getStudentScheduleSessions } from './studentDetailHelpers'
import type { StudentNote, StudentGlobalLog, StudentPackage } from './studentDetailTypes'
import { mockClassRecords } from '@/mocks/classRecords'

export interface StudentDetailDialogV1Props {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTicket?: (studentId: string) => void
  fromClassName?: string
  onToggleVersion?: () => void
}

export function StudentDetailDialogV1({
  studentId,
  open,
  onOpenChange,
  fromClassName,
  onToggleVersion,
}: StudentDetailDialogV1Props) {
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

  const handleOpenEditLevel = () => {
    setIsEditLevelOpen(true)
  }

  const handleSaveLevel = (newLevel: string, newSubLevel: string) => {
    if (student) {
      const idx = mockStudents.findIndex((s) => s.id === student.id)
      if (idx !== -1) {
        mockStudents[idx] = {
          ...mockStudents[idx],
          level: newLevel,
          subLevel: newSubLevel,
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
        action: `Đã cập nhật trình độ học viên thành: ${newLevel} (${newSubLevel}).`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setRevision((r) => r + 1)
    setIsEditLevelOpen(false)
    toast.success('Cập nhật trình độ thành công!')
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
        action: `Đã cập nhật số buổi gói "${pkg.packageName}": Đã học/Tổng: ${newStudiedSessions}/${total} buổi.`,
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
        id: 'init-l',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        action: `Mở hồ sơ chi tiết học viên ${student.name}.`,
        operator: 'Hệ thống',
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
      ? `Chuyển lớp học viên từ ${pkg?.linkedClassName} sang ${classItem.name}${classItem.startSession ? ` (Buổi học bắt đầu: ${classItem.startSession})` : ''}.`
      : `Ghép học viên vào lớp ${classItem.name}${classItem.startSession ? ` (Buổi học bắt đầu: ${classItem.startSession})` : ''}.`

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: actionText,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    const successText = isTransfer
      ? `Chuyển lớp sang "${classItem.name}" thành công!`
      : `Ghép lớp "${classItem.name}" thành công!`
    toast.success(successText)
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

    const actionLabel = 'thôi học (nghỉ hẳn)'

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `Yêu cầu ${actionLabel} lớp ${classCode} đã được phê duyệt.`,
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
        author: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `Đã thêm ghi chú tương tác: "${newNoteText.substring(0, 35)}${newNoteText.length > 35 ? '...' : ''}"`,
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
      <DialogContent className="grid h-[90vh] max-h-[900px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] bg-background">
        {/* 1. Header Banner */}
        <DialogHeader className="shrink-0 border-b bg-muted/5 px-6 py-2.5 text-left">
          <div className="flex flex-col gap-2 min-w-0">
            {/* Top Row: Switcher + Avatar + Name + Action Buttons */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 border-b border-border/10 pb-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Icon/Button chuyển đổi V1 (Old) / V2 (New) nằm ngay trước Avatar học viên */}
                {onToggleVersion && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleVersion}
                    title="Đang dùng phiên bản V1 (Cũ). Bấm để chuyển sang V2 (Mới)"
                    className="h-8 w-8 p-0 text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 rounded-lg shrink-0 cursor-pointer shadow-xs transition-all flex items-center justify-center"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </Button>
                )}
                <AppAvatar src={studentAvatar} name={student.name} size="md" className="border border-primary/10 shrink-0" />
                <div className="min-w-0">
                  <DialogTitle className="flex flex-wrap items-center gap-2 text-lg font-bold text-foreground leading-none">
                    <span>{student.name}</span>
                    <span className="text-xs font-normal text-muted-foreground select-none">
                      · Năm sinh: <strong className="text-foreground font-semibold">{birthYear}</strong>
                    </span>
                    {fromClassName && (
                      <Badge variant="secondary" className="rounded-md bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-900 text-[10px] py-0 h-5 font-semibold">
                        <GraduationCap className="h-3 w-3 mr-1 text-sky-600 dark:text-sky-400 inline" />
                        Từ lớp: {fromClassName}
                      </Badge>
                    )}
                  </DialogTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground select-none">
                    <span>CID: <strong className="text-foreground font-mono font-semibold">{cid}</strong></span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>UID: <strong className="text-foreground font-mono font-semibold">{uid}</strong></span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>SID: <strong className="text-foreground font-mono font-semibold">{sid}</strong></span>
                    <span className="text-muted-foreground/30">•</span>
                    <span>Trường: <strong className="text-foreground font-semibold">{student.branch}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pr-8">
                <Button
                  variant="outline"
                  size="sm"
                  title="Gọi điện cho phụ huynh"
                  onClick={() =>
                    useCallStore.getState().startCall({
                      studentId: student.id,
                      studentName: student.name,
                      parentPhone: student.parentPhone || '0987654321',
                      parentName: student.parentName || `Phụ huynh em ${student.name}`,
                    })
                  }
                  className="rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs h-8 px-3 font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Phone className="h-3.5 w-3.5" /> Gọi điện
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  title="Bảo lưu học tập"
                  onClick={() => {
                    toast.info('Tính năng Bảo lưu đang được phát triển!')
                  }}
                  className="rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 text-xs h-8 px-3 font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <PauseCircle className="h-3.5 w-3.5" /> Bảo lưu
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  title="Xin nghỉ phép"
                  onClick={() => {
                    toast.info('Tính năng Nghỉ phép đang được phát triển!')
                  }}
                  className="rounded-lg text-destructive hover:text-destructive/90 hover:bg-destructive/5 border-destructive/20 text-xs h-8 px-3 font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <CalendarX className="h-3.5 w-3.5" /> Nghỉ phép
                </Button>
              </div>
            </div>

            {/* Dynamic Package details container */}
            <StudentDetailPackagesBar
              packagesList={packagesList}
              selectedPackageId={selectedPackageId}
              setSelectedPackageId={setSelectedPackageId}
              student={student}
              activeClass={activeClass}
              onEditLevel={handleOpenEditLevel}
              onEditSessions={handleOpenEditSessions}
            />
          </div>
        </DialogHeader>

        {/* 2. Split Body Layout */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-4">
          <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left CONTENT: Main Tabs */}
            <main className="flex min-h-0 flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
                <TabsList variant="line" className="shrink-0 justify-start border-none p-0 gap-6 h-9 w-full">
                  <TabsTrigger
                    value="classes"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none"
                  >
                    Lớp học
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none"
                  >
                    Buổi học
                  </TabsTrigger>

                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none"
                  >
                    Thông tin tổng quan
                  </TabsTrigger>
                  <TabsTrigger
                    value="logs"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 ml-auto focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none"
                  >
                    Lịch sử toàn cục
                  </TabsTrigger>
                </TabsList>

                {/* Tab content wrapper */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 pt-1.5">
                  <TabsContent value="classes" className="m-0 focus-visible:outline-none">
                    <StudentDetailClasses
                      classes={filteredEnrolledClasses}
                      packages={packagesList}
                      selectedPackageId={selectedPackageId}
                      studentName={student.name}
                      studentCode={studentCode}
                      studentBranch={student.branch}
                      studentLevel={student.level}
                      hideSectionHeader={true}
                      onConfirmAssignment={handleConfirmAssignment}
                      onChangeClassStatus={handleChangeClassStatus}
                    />
                  </TabsContent>
                  <TabsContent value="schedule" className="m-0 focus-visible:outline-none">
                    <StudentDetailSchedule sessions={filteredScheduleSessions} />
                  </TabsContent>

                  <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                    <StudentDetailOverview
                      student={student}
                      onUpdateStudent={(updatedStudent) => {
                        const idx = mockStudents.findIndex((s) => s.id === student.id)
                        if (idx !== -1) {
                          mockStudents[idx] = updatedStudent
                        }
                        
                        const now = new Date()
                        const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
                        
                        setSideLogs((prev) => [
                          {
                            id: Math.random().toString(),
                            action: `Cập nhật cơ sở theo học học viên thành: ${updatedStudent.branches?.join(', ') || 'trống'}.`,
                            operator: 'Giáo vụ Lan',
                            timestamp: timestampStr
                          },
                          ...prev
                        ])

                        setRevision((r) => r + 1)
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="logs" className="m-0 focus-visible:outline-none">
                    <StudentDetailGlobalLogs logs={globalTimelineLogs} />
                  </TabsContent>
                </div>
              </Tabs>
            </main>

            {/* Right: Notes & Logs Side panel */}
            <aside className="flex min-h-0 flex-col overflow-hidden border-l pl-6">
              <InteractionLogsPanel
                notes={notes.map((n) => ({
                  id: n.id,
                  text: n.text,
                  performer: n.author,
                  timestamp: n.timestamp,
                }))}
                logs={sideLogs.map((l) => ({
                  id: l.id,
                  text: l.action,
                  performer: l.operator,
                  timestamp: l.timestamp,
                }))}
                noteInput={noteInput}
                onNoteInputChange={setNoteInput}
                onAddNote={handleAddNote}
                notePlaceholder="Ghi chú tương tác học tập/CS..."
                activeTab={activeSideTab}
                onActiveTabChange={setActiveSideTab}
              />
            </aside>
          </div>
        </div>
      </DialogContent>

      {/* Dialog: Chỉnh sửa Trình độ */}
      <StudentDetailLevelDialog
        open={isEditLevelOpen}
        onOpenChange={setIsEditLevelOpen}
        initialLevel={activeClass?.level || student?.level || ''}
        initialSubLevel={activeClass?.subLevel || student?.subLevel || ''}
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
