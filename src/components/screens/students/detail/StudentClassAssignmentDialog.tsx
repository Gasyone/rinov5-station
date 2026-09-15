'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmDialog } from '@/components/shared'
import { ExpandableSearch } from '@/components/controls'
import { mockClassRecords } from '@/mocks/classRecords'
import { generateRoadmapSessions } from '@/components/screens/classes/detail/classesDetailHelpers'
import { AlertCircle, AlertTriangle, ChevronsUpDown } from 'lucide-react'
import type { EnrolledClass } from '@/mocks/students'
import type { ClassRecord } from '@/mocks/classRecords'

// Treeview Table & Helpers
import { StudentClassAssignmentTreeTable } from './StudentClassAssignmentTreeTable'
import { checkSlotsOverlap } from './studentDetailHelpers'

interface StudentClassAssignmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  packageName: string
  pkgRemainingSessions: number
  studentClasses?: EnrolledClass[]
  onConfirm: (classItem: { id: string; name: string; startSession?: string }) => void
  currentClassCode?: string
  currentClassName?: string
}

function getClassAssignmentSessions(cls: ClassRecord) {
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
  packageName,
  pkgRemainingSessions,
  studentClasses = [],
  onConfirm,
  currentClassCode,
  currentClassName,
}: StudentClassAssignmentDialogProps) {
  const [activeTab, setActiveTab] = useState<
    'suitable' | 'all' | 'nhap' | 'cho_khai_giang' | 'dang_hoc'
  >('suitable')
  const [branchFilter, setBranchFilter] = useState<string>(studentBranch)
  const [gradeGroupFilter, setGradeGroupFilter] = useState<string>('all')
  const [dayFilter, setDayFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [startSessionDate, setStartSessionDate] = useState<string>('')
  const [expandedClassIds, setExpandedClassIds] = useState<Set<string>>(
    () => new Set()
  )
  const [showWarningOpen, setShowWarningOpen] = useState(false)

  // Load and map mock class records, exclude 'tam_dung' (tạm nghỉ) and 'huy' (đã kết thúc) as they cannot be assigned
  const classesList = useMemo(() => {
    return mockClassRecords
      .filter((c) => c.status !== 'tam_dung' && c.status !== 'huy')
      .map((c) => {
        const status =
          c.status === 'mo_chieu_sinh' ? ('cho_khai_giang' as const) : c.status
        return { ...c, status }
      })
  }, [])

  // Filter classes based on active tab and dropdown/search filters
  const filteredClasses = useMemo(() => {
    return classesList.filter((cls) => {
      // 1. Tab filter
      if (activeTab === 'suitable') {
        const isBranchMatch = cls.branch === studentBranch

        const isLevelMatch = studentLevel
          ? cls.level.toLowerCase().includes(studentLevel.toLowerCase()) ||
            studentLevel.toLowerCase().includes(cls.level.toLowerCase())
          : true

        const isActiveStatus =
          cls.status === 'dang_hoc' || cls.status === 'cho_khai_giang'

        if (!isBranchMatch || !isLevelMatch || !isActiveStatus) {
          return false
        }
      } else if (activeTab !== 'all') {
        if (cls.status !== activeTab) {
          return false
        }
      }

      // 2. Branch dropdown filter
      if (branchFilter !== 'all' && cls.branch !== branchFilter) {
        return false
      }

      // 3. Grade Group dropdown filter
      if (gradeGroupFilter !== 'all') {
        if (gradeGroupFilter === 'Young Learners') {
          const ylLevels = ['movers', 'flyers', 'ket prep', 'pet prep']
          if (!ylLevels.includes(cls.level.toLowerCase())) return false
        } else if (gradeGroupFilter === 'Math') {
          if (!cls.level.toLowerCase().includes('math')) return false
        } else {
          if (!cls.level.toLowerCase().includes(gradeGroupFilter.toLowerCase()))
            return false
        }
      }

      // 4. Day dropdown filter
      if (dayFilter !== 'all') {
        const matchesSlot = cls.scheduleSlots.some(
          (slot) => slot.dayOfWeek.toLowerCase() === dayFilter.toLowerCase()
        )
        const matchesScheduleText = cls.schedule
          .toLowerCase()
          .includes(dayFilter.toLowerCase())
        if (!matchesSlot && !matchesScheduleText) return false
      }

      // 5. Search query
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
  }, [
    classesList,
    activeTab,
    branchFilter,
    gradeGroupFilter,
    dayFilter,
    searchQuery,
    studentBranch,
    studentLevel,
  ])

  // Find the selected class details
  const selectedClass = useMemo(() => {
    return classesList.find((c) => c.id === selectedClassId) || null
  }, [classesList, selectedClassId])

  // Auto-expand & auto-select suitable class when dialog is opened
  useEffect(() => {
    if (open) {
      const suitable = classesList.filter((c) => {
        const isBranchMatch = c.branch === studentBranch
        const isLevelMatch = studentLevel
          ? c.level.toLowerCase().includes(studentLevel.toLowerCase()) ||
            studentLevel.toLowerCase().includes(c.level.toLowerCase())
          : true
        const isActiveStatus =
          c.status === 'dang_hoc' || c.status === 'cho_khai_giang'
        return isBranchMatch && isLevelMatch && isActiveStatus
      })

      // If no suitable classes, default to 'all' so screen isn't empty!
      const initialTab = suitable.length > 0 ? 'suitable' : 'all'
      setActiveTab(initialTab)

      const targetList = initialTab === 'suitable' ? suitable : classesList
      const defaultClass = targetList[0] || classesList[0]
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
          const dateDisplay = dayName ? `${dayName}, ${activeSession.date}` : activeSession.date
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
    setExpandedClassIds((prev) => {
      const next = new Set(prev)
      next.add(clsId)
      return next
    })

    const cls = classesList.find((c) => c.id === clsId)
    if (cls) {
      const sessions = getClassAssignmentSessions(cls)
      const activeSession =
        sessions.find(
          (s) => s.status === 'ongoing' || s.status === 'upcoming'
        ) || sessions[0]

      if (activeSession) {
        const dayName = getDayOfWeekFromDateStr(activeSession.date)
        const dateDisplay = dayName ? `${dayName}, ${activeSession.date}` : activeSession.date
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

  // Toggle expand all / collapse all
  const isAllExpanded =
    filteredClasses.length > 0 &&
    expandedClassIds.size === filteredClasses.length

  const handleToggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedClassIds(new Set())
    } else {
      setExpandedClassIds(new Set(filteredClasses.map((c) => c.id)))
    }
  }

  // Warnings calculation
  const isClassFull = selectedClass
    ? selectedClass.enrolledStudents >= selectedClass.maxStudents
    : false

  const isLevelMismatch = useMemo(() => {
    if (!selectedClass || !studentLevel) return false
    const sLevel = studentLevel.toLowerCase()
    const cLevel = selectedClass.level.toLowerCase()
    return !sLevel.includes(cLevel) && !cLevel.includes(sLevel)
  }, [selectedClass, studentLevel])

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

  const handleConfirm = () => {
    if (selectedClass) {
      onConfirm({
        id: selectedClass.id,
        name: selectedClass.name || selectedClass.code,
        startSession: startSessionDate || undefined,
      })
      onOpenChange(false)
      setSelectedClassId(null)
      setStartSessionDate('')
    }
  }

  const handleConfirmAttempt = () => {
    if (selectedClass) {
      const cleanCurrent = currentClassCode?.trim().toLowerCase()
      const cleanSelectedCode = selectedClass.code?.trim().toLowerCase()
      const cleanSelectedId = selectedClass.id?.trim().toLowerCase()
      const isTransfer =
        cleanCurrent &&
        cleanCurrent !== cleanSelectedCode &&
        cleanCurrent !== cleanSelectedId
      if (isTransfer) {
        setShowWarningOpen(true)
      } else {
        handleConfirm()
      }
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedClassId(null)
    setStartSessionDate('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose()
        else onOpenChange(val)
      }}
    >
      <DialogContent className="w-[94vw] sm:max-w-[94vw] md:max-w-[880px] lg:max-w-[940px] h-[86vh] max-h-[660px] min-h-[420px] flex flex-col p-0 overflow-hidden bg-background shadow-2xl rounded-xl">
        {/* Header with Student & Package Details */}
        <DialogHeader className="px-5 py-2.5 border-b bg-muted/20 shrink-0">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-sm font-bold text-foreground flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pr-8">
              <span>Ghép lớp học viên</span>
              <span className="text-xs font-normal text-muted-foreground bg-background px-2.5 py-0.5 rounded-full border shadow-2xs">
                Gói học: <strong className="text-foreground">{packageName}</strong>{' '}
                (Còn{' '}
                <strong className="text-emerald-600 font-semibold">
                  {pkgRemainingSessions} buổi
                </strong>
                )
              </span>
            </DialogTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-x-3 gap-y-1 flex-wrap">
              <span>
                Học viên: <strong className="text-foreground">{studentName}</strong>
              </span>
              <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                {studentCode}
              </span>
              {studentLevel && (
                <>
                  <span className="text-muted-foreground/30">|</span>
                  <span>
                    Trình độ:{' '}
                    <strong className="text-primary font-semibold">
                      {studentLevel}
                    </strong>
                  </span>
                </>
              )}
              <span className="text-muted-foreground/30">|</span>
              <span>
                Cơ sở gốc:{' '}
                <strong className="text-foreground">{studentBranch}</strong>
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Status Tab Filter Bar */}
        <div className="flex flex-wrap gap-1 px-5 py-1 bg-muted/10 select-none shrink-0 border-b border-border/30">
          {([
            { id: 'suitable', label: 'Lớp phù hợp' },
            { id: 'all', label: 'Tất cả lớp' },
            { id: 'nhap', label: 'Nháp' },
            { id: 'cho_khai_giang', label: 'Chờ khai giảng' },
            { id: 'dang_hoc', label: 'Đang học' },
          ] as const).map((tab) => {
            const count = classesList.filter((c) => {
              if (tab.id === 'suitable') {
                const isBranchMatch = c.branch === studentBranch
                const isLevelMatch = studentLevel
                  ? c.level.toLowerCase().includes(studentLevel.toLowerCase()) ||
                    studentLevel.toLowerCase().includes(c.level.toLowerCase())
                  : true
                const isActiveStatus =
                  c.status === 'dang_hoc' || c.status === 'cho_khai_giang'
                return isBranchMatch && isLevelMatch && isActiveStatus
              }
              if (tab.id === 'all') return true
              return c.status === tab.id
            }).length

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                }}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {tab.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Filters Toolbar */}
        <div className="px-5 py-1 border-b flex flex-wrap items-center justify-between bg-background select-none gap-2 shrink-0">
          <div className="flex flex-wrap gap-1.5 items-center flex-1 min-w-0">
            <div className="w-[145px] shrink-0">
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger
                  size="sm"
                  className="w-full h-7 text-xs bg-background py-0.5"
                >
                  <SelectValue placeholder="Trường" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trường</SelectItem>
                  <SelectItem value="RinoEdu Nguyễn Tuân">
                    RinoEdu Nguyễn Tuân
                  </SelectItem>
                  <SelectItem value="RinoEdu Linh Đàm">
                    RinoEdu Linh Đàm
                  </SelectItem>
                  <SelectItem value="RinoEdu Smart City">
                    RinoEdu Smart City
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[130px] shrink-0">
              <Select
                value={gradeGroupFilter}
                onValueChange={setGradeGroupFilter}
              >
                <SelectTrigger
                  size="sm"
                  className="w-full h-7 text-xs bg-background py-0.5"
                >
                  <SelectValue placeholder="Khối lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khối lớp</SelectItem>
                  <SelectItem value="IELTS">Khối IELTS</SelectItem>
                  <SelectItem value="TOEIC">Khối TOEIC</SelectItem>
                  <SelectItem value="Young Learners">
                    Khối Young Learners
                  </SelectItem>
                  <SelectItem value="Math">Khối Toán</SelectItem>
                  <SelectItem value="Beginner">Khối Beginner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[120px] shrink-0">
              <Select value={dayFilter} onValueChange={setDayFilter}>
                <SelectTrigger
                  size="sm"
                  className="w-full h-7 text-xs bg-background py-0.5"
                >
                  <SelectValue placeholder="Chọn thứ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả các thứ</SelectItem>
                  <SelectItem value="Thứ 2">Thứ 2</SelectItem>
                  <SelectItem value="Thứ 3">Thứ 3</SelectItem>
                  <SelectItem value="Thứ 4">Thứ 4</SelectItem>
                  <SelectItem value="Thứ 5">Thứ 5</SelectItem>
                  <SelectItem value="Thứ 6">Thứ 6</SelectItem>
                  <SelectItem value="Thứ 7">Thứ 7</SelectItem>
                  <SelectItem value="Chủ nhật">Chủ nhật</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleToggleExpandAll}
              className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronsUpDown className="h-3.5 w-3.5 mr-1" />
              {isAllExpanded ? 'Thu gọn' : 'Mở rộng'}
            </Button>
          </div>
          <ExpandableSearch
            value={searchQuery}
            onValueChange={setSearchQuery}
            placeholder="Tìm tên lớp, GV, phòng..."
            inputClassName="h-7 text-xs sm:w-44"
            className="shrink-0"
          />
        </div>

        {/* Treeview Table Scrollable Area */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-1 pt-0">
          <StudentClassAssignmentTreeTable
            classes={filteredClasses}
            selectedClassId={selectedClassId}
            onSelectClass={handleSelectClass}
            selectedSessionDate={startSessionDate}
            onSelectSession={handleSelectSession}
            expandedClassIds={expandedClassIds}
            onToggleExpandClass={handleToggleExpandClass}
            studentBranch={studentBranch}
            studentLevel={studentLevel}
          />
        </div>

        {/* Dialog Footer with Live Selection & Warnings */}
        <DialogFooter className="px-5 py-2 border-t bg-muted/10 flex flex-row items-center justify-between sm:justify-between gap-4 shrink-0">
          <div className="flex-1 min-w-0 text-left pr-4 select-none">
            {selectedClass ? (
              <div className="space-y-1">
                {/* Live Assignment Summary */}
                <div className="text-xs text-foreground font-semibold flex items-center gap-1.5 flex-wrap">
                  <span className="text-muted-foreground">Đang ghép vào:</span>
                  <span className="text-primary font-bold">
                    {selectedClass.name || selectedClass.code}
                  </span>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="text-muted-foreground">Phòng:</span>
                  <span>{selectedClass.room || '—'}</span>
                  <span className="text-muted-foreground/40">|</span>
                  <span className="text-muted-foreground">Buổi bắt đầu:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {startSessionDate || 'Chưa chọn'}
                  </span>
                </div>

                {/* Warnings */}
                {(isClassFull ||
                  isLevelMismatch ||
                  conflictingClasses.length > 0) && (
                  <div className="text-xs text-amber-700 dark:text-amber-400 font-medium space-y-0.5 pt-0.5">
                    {isClassFull && (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="truncate">
                          Lớp đầy sĩ số ({selectedClass.enrolledStudents}/
                          {selectedClass.maxStudents})
                        </span>
                      </div>
                    )}
                    {isLevelMismatch && (
                      <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="truncate">
                          Trình độ lệch (Lớp {selectedClass.level} vs Học viên{' '}
                          {studentLevel})
                        </span>
                      </div>
                    )}
                    {conflictingClasses.map((conflict, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="truncate">
                          Trùng lịch học lớp <strong>{conflict.className}</strong>{' '}
                          ({conflict.dayOfWeek} {conflict.timeSlot})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Chưa chọn lớp học ghép
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-lg h-8 px-4 text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmAttempt}
              disabled={!selectedClassId || !startSessionDate}
              className="rounded-lg h-8 px-5 text-xs cursor-pointer"
            >
              Xác nhận ghép
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Confirm Transfer Dialog */}
      {showWarningOpen && selectedClass && (
        <ConfirmDialog
          open={showWarningOpen}
          onOpenChange={setShowWarningOpen}
          title="Xác nhận chuyển lớp"
          confirmLabel="Xác nhận chuyển"
          cancelLabel="Hủy"
          variant="destructive"
          onConfirm={handleConfirm}
          description={
            <div className="space-y-2 select-none">
              <p>
                Học viên đang học ở lớp{' '}
                <strong className="font-semibold text-foreground">
                  {currentClassName || currentClassCode}
                </strong>
                .
              </p>
              <p>
                Hành động này sẽ{' '}
                <strong className="font-semibold text-destructive">
                  xóa (thoát) học viên khỏi lớp cũ
                </strong>{' '}
                và chuyển sang lớp mới{' '}
                <strong className="font-semibold text-foreground">
                  {selectedClass.name || selectedClass.code}
                </strong>
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
