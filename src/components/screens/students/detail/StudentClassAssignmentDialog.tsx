'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/shared'
import { mockClassRecords } from '@/mocks/classRecords'
import { generateRoadmapSessions } from '@/components/screens/classes/detail/classesDetailHelpers'
import type { EnrolledClass, Student } from '@/mocks/students'
import type { StudentAvailableSlot } from './studentDetailTypes'
import { checkSlotsOverlap } from './studentDetailHelpers'
import {
  getStudentAssessmentDetails,
  isClassSuitable,
} from './studentClassAssignmentHelpers'
import { StudentClassAssignmentPackageSection } from './StudentClassAssignmentPackageSection'
import { StudentClassAssignmentClassesList } from './StudentClassAssignmentClassesList'
import { StudentClassAssignmentSummaryPanel } from './StudentClassAssignmentSummaryPanel'

export interface StudentClassAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  studentSubLevel?: string
  availableSlots?: StudentAvailableSlot[]
  isTestLevel?: boolean
  packageName: string
  pkgRemainingSessions: number
  pkgTotalSessions?: number
  pkgStudiedSessions?: number
  studentClasses?: EnrolledClass[]
  onConfirm: (classItem: { id: string; name: string; startSession?: string; notes?: string }) => void
  currentClassCode?: string
  currentClassName?: string
  student?: Student | null
}

function getClassAssignmentSessions(cls: typeof mockClassRecords[0]) {
  const clsWithSyllabus = {
    ...cls,
    syllabus:
      cls.syllabus && cls.syllabus !== '—' && cls.syllabus !== ''
        ? cls.syllabus
        : 'Lộ trình chuẩn',
  }
  const allSessions = generateRoadmapSessions(clsWithSyllabus)
  if (allSessions.length === 0) return []

  const activeIndex = allSessions.findIndex(
    (s) => s.status === 'ongoing' || s.status === 'upcoming'
  )
  const startIdx =
    activeIndex === -1
      ? Math.max(0, allSessions.length - 5)
      : Math.max(0, activeIndex - 1)

  return allSessions.slice(startIdx, startIdx + 5)
}

function getDayOfWeekFromDateStr(dateStr: string): string {
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const d = new Date(year, month, day)
    const dayOfWeek = d.getDay()
    const days = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ]
    return days[dayOfWeek] || ''
  }
  return ''
}

export function StudentClassAssignmentDialog({
  open,
  onOpenChange,
  studentName,
  studentCode,
  studentBranch,
  studentLevel = '',
  studentSubLevel,
  availableSlots,
  isTestLevel,
  packageName,
  pkgRemainingSessions,
  pkgTotalSessions,
  pkgStudiedSessions,
  studentClasses = [],
  onConfirm,
  currentClassCode,
  currentClassName,
  student,
}: StudentClassAssignmentDialogProps) {
  // Assessment and parent details
  const assessment = useMemo(() => {
    return getStudentAssessmentDetails(
      student,
      studentName,
      studentCode,
      studentBranch,
      studentLevel,
      isTestLevel
    )
  }, [student, studentName, studentCode, studentBranch, studentLevel, isTestLevel])

  // Tabs & Search State (bỏ tab 'suitable', mặc định 'all')
  const [activeTab, setActiveTab] = useState<
    'all' | 'dang_hoc' | 'cho_khai_giang'
  >('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [startSessionDate, setStartSessionDate] = useState<string>('')
  const [expandedClassIds, setExpandedClassIds] = useState<Set<string>>(
    () => new Set()
  )
  const [internalNotes, setInternalNotes] = useState<string>('')
  const [showTransferConfirm, setShowTransferConfirm] = useState(false)

  // Load classes, exclude tam_dung and huy
  const classesList = useMemo(() => {
    return mockClassRecords
      .filter((c) => c.status !== 'tam_dung' && c.status !== 'huy')
      .map((c) => {
        const status =
          c.status === 'mo_chieu_sinh' ? ('cho_khai_giang' as const) : c.status
        return { ...c, status }
      })
  }, [])

  // Filtered classes according to activeTab and searchQuery
  const filteredClasses = useMemo(() => {
    return classesList.filter((cls) => {
      // 1. Tab filter
      if (activeTab !== 'all' && cls.status !== activeTab) {
        return false
      }

      // 2. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const match =
          cls.name.toLowerCase().includes(q) ||
          cls.code.toLowerCase().includes(q) ||
          cls.teacher.toLowerCase().includes(q) ||
          cls.room.toLowerCase().includes(q)
        if (!match) return false
      }

      return true
    })
  }, [classesList, activeTab, searchQuery])

  // Selected class record
  const selectedClass = useMemo(() => {
    return classesList.find((c) => c.id === selectedClassId) || null
  }, [classesList, selectedClassId])

  // Auto-select initial class when dialog opens
  useEffect(() => {
    if (open) {
      setActiveTab('all')
      const suitable = classesList.filter((c) =>
        isClassSuitable(c, studentBranch, studentLevel)
      )
      const defaultClass = suitable[0] || classesList[0]

      if (defaultClass) {
        setSelectedClassId(defaultClass.id)
        setExpandedClassIds(new Set([defaultClass.id]))

        const sessions = getClassAssignmentSessions(defaultClass)
        const activeSession =
          sessions.find(
            (s) => s.status === 'ongoing' || s.status === 'upcoming'
          ) || sessions[0]

        if (activeSession) {
          const dayName = getDayOfWeekFromDateStr(activeSession.date)
          const dateDisplay = dayName
            ? `${dayName}, ${activeSession.date}`
            : activeSession.date
          setStartSessionDate(
            `${dateDisplay} (Buổi ${activeSession.sessionNumber}: ${activeSession.topic})`
          )
        }
      }
    }
  }, [open, classesList, studentBranch, studentLevel])

  // Select class action
  const handleSelectClass = (clsId: string) => {
    setSelectedClassId(clsId)

    const cls = classesList.find((c) => c.id === clsId)
    if (cls) {
      const sessions = getClassAssignmentSessions(cls)
      const activeSession =
        sessions.find(
          (s) => s.status === 'ongoing' || s.status === 'upcoming'
        ) || sessions[0]

      if (activeSession) {
        const dayName = getDayOfWeekFromDateStr(activeSession.date)
        const dateDisplay = dayName
          ? `${dayName}, ${activeSession.date}`
          : activeSession.date
        setStartSessionDate(
          `${dateDisplay} (Buổi ${activeSession.sessionNumber}: ${activeSession.topic})`
        )
      }
    }
  }

  // Select session action
  const handleSelectSession = (clsId: string, sessionValStr: string) => {
    setSelectedClassId(clsId)
    setStartSessionDate(sessionValStr)
  }

  // Toggle expand individual class
  const handleToggleExpandClass = (clsId: string) => {
    setExpandedClassIds((prev) => {
      const next = new Set(prev)
      if (next.has(clsId)) {
        next.delete(clsId)
      } else {
        next.add(clsId)
      }
      return next
    })
  }

  const conflictingClasses = useMemo(() => {
    if (!selectedClass || !studentClasses || studentClasses.length === 0)
      return []

    const conflicts: {
      className: string
      dayOfWeek: string
      timeSlot: string
    }[] = []

    const activeEnrolledClasses = studentClasses.filter(
      (c) => c.status === 'active'
    )

    for (const enrolledClass of activeEnrolledClasses) {
      if (!enrolledClass.scheduleSlots || !selectedClass.scheduleSlots) continue

      for (const selectedSlot of selectedClass.scheduleSlots) {
        for (const enrolledSlot of enrolledClass.scheduleSlots) {
          if (checkSlotsOverlap(selectedSlot, enrolledSlot)) {
            conflicts.push({
              className: enrolledClass.className,
              dayOfWeek: selectedSlot.dayOfWeek,
              timeSlot: `${selectedSlot.startTime}-${selectedSlot.endTime}`,
            })
          }
        }
      }
    }

    return conflicts
  }, [selectedClass, studentClasses])

  // Is transfer check (hỗ trợ cả trạng thái pending_transfer và so khớp mã lớp hiện tại)
  const isTransfer = useMemo(() => {
    if (student?.status === 'pending_transfer') return true
    if (!currentClassCode || !selectedClass) return false
    const cleanCurrent = currentClassCode.trim().toLowerCase()
    const cleanSelectedCode = selectedClass.code?.trim().toLowerCase()
    const cleanSelectedId = selectedClass.id?.trim().toLowerCase()
    return cleanCurrent !== cleanSelectedCode && cleanCurrent !== cleanSelectedId
  }, [currentClassCode, selectedClass, student?.status])

  // Execute confirm assignment
  const executeConfirm = () => {
    if (selectedClass) {
      onConfirm({
        id: selectedClass.id,
        name: selectedClass.name || selectedClass.code,
        startSession: startSessionDate || undefined,
        notes: internalNotes || undefined,
      })
      onOpenChange(false)
      setSelectedClassId(null)
      setStartSessionDate('')
      setInternalNotes('')
    }
  }

  const handleConfirmAttempt = () => {
    if (isTransfer) {
      setShowTransferConfirm(true)
    } else {
      executeConfirm()
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedClassId(null)
    setStartSessionDate('')
    setInternalNotes('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose()
        else onOpenChange(val)
      }}
    >
      <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-[94vw] md:max-w-[90vw] lg:max-w-[1060px] xl:max-w-[1120px] h-[88vh] max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden bg-background shadow-2xl rounded-xl border">
        {/* Header gọn gàng - Không đường line, text thường không in đậm, khoảng cách tối ưu */}
        <DialogHeader className="shrink-0 px-4 pt-2.5 pb-1">
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle className="text-xs font-normal text-foreground">
              {isTransfer ? 'Chuyển lớp học viên' : 'Xếp lớp học viên'}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body: 2 Panel song song sát header (Trái Flex-1 cuộn độc lập, Phải Cố định không ảnh hưởng bởi cuộn) */}
        <div className="flex-1 min-h-0 px-4 pt-0 pb-2.5 overflow-hidden flex flex-col lg:flex-row gap-3 items-start">
          {/* ==================== PANEL TRÁI (FLEX-1): QUY TRÌNH CHỌN LỚP (CUỘN ĐỘC LẬP) ==================== */}
          <div className="flex-1 min-w-0 flex flex-col space-y-1.5 w-full h-full overflow-y-auto pr-1">
            {/* 1. Phần Gói mua, Loại gói, Số buổi đã học/tổng buổi & Cơ sở */}
            <StudentClassAssignmentPackageSection
              packageName={packageName}
              pkgRemainingSessions={pkgRemainingSessions}
              pkgTotalSessions={pkgTotalSessions}
              pkgStudiedSessions={pkgStudiedSessions}
              studentBranch={studentBranch}
              studentLevel={studentLevel}
            />

            {/* Lớp cũ cần chuyển (nếu đang chuyển lớp) */}
            {isTransfer && currentClassName && (
              <div className="p-2 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/50 text-xs flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-800 dark:text-amber-300 font-normal">
                    Lớp cũ đang theo học:
                  </span>
                  <span className="text-foreground font-medium">
                    {currentClassName} ({currentClassCode})
                  </span>
                </div>
                <span className="text-amber-600 dark:text-amber-400 italic text-xs">
                  Sẽ được chuyển ra khỏi lớp cũ
                </span>
              </div>
            )}

            {/* 2. Danh sách lớp học (Tabs cùng hàng với search, nhãn ★ Lớp phù hợp ở mỗi lớp) */}
            <StudentClassAssignmentClassesList
              classes={filteredClasses}
              allAvailableClasses={classesList}
              selectedClassId={selectedClassId}
              onSelectClass={handleSelectClass}
              startSessionDate={startSessionDate}
              onSelectSession={handleSelectSession}
              expandedClassIds={expandedClassIds}
              onToggleExpandClass={handleToggleExpandClass}
              studentBranch={studentBranch}
              studentLevel={studentLevel}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              internalNotes={internalNotes}
              onNotesChange={setInternalNotes}
              conflictingClasses={conflictingClasses}
            />
          </div>

          {/* ==================== PANEL PHẢI: TIÊU CHÍ & TÓM TẮT ==================== */}
          <div className="w-full lg:w-[310px] xl:w-[320px] shrink-0 h-full overflow-y-auto pl-0.5 pr-1 pb-1">
            <StudentClassAssignmentSummaryPanel
              assessment={assessment}
              selectedClass={selectedClass}
              startSessionDate={startSessionDate}
              packageName={packageName}
              pkgRemainingSessions={pkgRemainingSessions}
              studentBranch={studentBranch}
              isTransfer={isTransfer}
              currentClassName={currentClassName}
              currentClassCode={currentClassCode}
              internalNotes={internalNotes}
              studentLevel={studentLevel}
              studentSubLevel={studentSubLevel}
              availableSlots={availableSlots}
              student={student}
              onConfirm={handleConfirmAttempt}
              onCancel={handleClose}
            />
          </div>
        </div>
      </DialogContent>

      {/* Confirm Transfer Dialog */}
      {showTransferConfirm && selectedClass && (
        <ConfirmDialog
          open={showTransferConfirm}
          onOpenChange={setShowTransferConfirm}
          title="Xác nhận chuyển lớp"
          confirmLabel="Xác nhận chuyển"
          cancelLabel="Hủy"
          variant="destructive"
          onConfirm={executeConfirm}
          description={
            <div className="space-y-2 select-none text-xs">
              <p>
                Học viên đang học ở lớp{' '}
                <span className="font-medium text-foreground">
                  {currentClassName || currentClassCode}
                </span>
                .
              </p>
              <p>
                Hành động này sẽ{' '}
                <span className="font-medium text-destructive">
                  chuyển học viên khỏi lớp cũ
                </span>{' '}
                và phân bổ vào lớp mới{' '}
                <span className="font-medium text-foreground">
                  {selectedClass.name || selectedClass.code}
                </span>
                .
              </p>
              <p>Bạn có chắc chắn muốn tiếp tục?</p>
            </div>
          }
        />
      )}
    </Dialog>
  )
}
