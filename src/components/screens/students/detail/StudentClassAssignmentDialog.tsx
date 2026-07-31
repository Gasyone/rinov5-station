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
import { EmptyState, ConfirmDialog } from '@/components/shared'
import { ExpandableSearch } from '@/components/controls'
import { mockClassRecords } from '@/mocks/classRecords'
import { generateRoadmapSessions } from '@/components/screens/classes/detail/classesDetailHelpers'
import { AlertCircle, AlertTriangle } from 'lucide-react'
import type { EnrolledClass } from '@/mocks/students'

// Sub-components & Helpers
import { StudentClassAssignmentTable } from './StudentClassAssignmentTable'
import { StudentClassAssignmentSessions } from './StudentClassAssignmentSessions'
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
  const [step, setStep] = useState<1 | 2>(1)
  const [activeTab, setActiveTab] = useState<'suitable' | 'all' | 'nhap' | 'cho_khai_giang' | 'dang_hoc'>('suitable')
  const [branchFilter, setBranchFilter] = useState<string>(studentBranch)
  const [gradeGroupFilter, setGradeGroupFilter] = useState<string>('all')
  const [dayFilter, setDayFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [startSessionDate, setStartSessionDate] = useState<string>('')
  const [sessionFilter, setSessionFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'>('all')

  // Reset session filter when class selection changes
  useEffect(() => {
    setSessionFilter('all')
  }, [selectedClassId])

  // Load and map mock class records (v1 does not have mo_chieu_sinh, map to cho_khai_giang)
  const classesList = useMemo(() => {
    return mockClassRecords.map((c) => {
      const status = c.status === 'mo_chieu_sinh' ? ('cho_khai_giang' as const) : c.status
      return { ...c, status }
    })
  }, [])

  // Filter classes based on active tab and dropdown/search filters
  const filteredClasses = useMemo(() => {
    return classesList.filter((cls) => {
      // 1. Tab filter
      if (activeTab === 'suitable') {
        // Suitable: branch matches student branch, level matches student level, and status is active (dang_hoc / cho_khai_giang)
        const isBranchMatch = cls.branch === studentBranch
        
        const isLevelMatch = studentLevel
          ? (cls.level.toLowerCase().includes(studentLevel.toLowerCase()) ||
             studentLevel.toLowerCase().includes(cls.level.toLowerCase()))
          : true

        const isActiveStatus = 
          cls.status === 'dang_hoc' || 
          cls.status === 'cho_khai_giang'

        if (!isBranchMatch || !isLevelMatch || !isActiveStatus) {
          return false
        }
      } else if (activeTab !== 'all') {
        // Filter by class status matching tab ID
        if (cls.status !== activeTab) {
          return false
        }
      }

      // 2. Branch dropdown filter (if not "all")
      if (branchFilter !== 'all' && cls.branch !== branchFilter) {
        return false
      }

      // 3. Grade Group dropdown filter (if not "all")
      if (gradeGroupFilter !== 'all') {
        if (gradeGroupFilter === 'Young Learners') {
          const ylLevels = ['movers', 'flyers', 'ket prep', 'pet prep']
          if (!ylLevels.includes(cls.level.toLowerCase())) return false
        } else if (gradeGroupFilter === 'Math') {
          if (!cls.level.toLowerCase().includes('math')) return false
        } else {
          if (!cls.level.toLowerCase().includes(gradeGroupFilter.toLowerCase())) return false
        }
      }

      // 4. Day dropdown filter (if not "all")
      if (dayFilter !== 'all') {
        const matchesSlot = cls.scheduleSlots.some(
          (slot) => slot.dayOfWeek.toLowerCase() === dayFilter.toLowerCase()
        )
        const matchesScheduleText = cls.schedule.toLowerCase().includes(dayFilter.toLowerCase())
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
  }, [classesList, activeTab, branchFilter, gradeGroupFilter, dayFilter, searchQuery, studentBranch, studentLevel])

  // Find the selected class details
  const selectedClass = useMemo(() => {
    return classesList.find((c) => c.id === selectedClassId) || null
  }, [classesList, selectedClassId])

  // Generate rolling 5 sessions for the selected class using the roadmap helper
  const selectedClassSessions = useMemo(() => {
    if (!selectedClass) return []
    // Provide a fallback syllabus if not present so generateRoadmapSessions always generates mock sessions
    const clsWithSyllabus = {
      ...selectedClass,
      syllabus: selectedClass.syllabus && selectedClass.syllabus !== '—' && selectedClass.syllabus !== '' 
        ? selectedClass.syllabus 
        : 'Lộ trình chuẩn'
    }
    const allSessions = generateRoadmapSessions(clsWithSyllabus)

    // Find index of first ongoing or first upcoming session
    const activeIndex = allSessions.findIndex(s => s.status === 'ongoing' || s.status === 'upcoming')
    const startIdx = activeIndex === -1 ? Math.max(0, allSessions.length - 5) : Math.max(0, activeIndex - 1)
    
    return allSessions.slice(startIdx, startIdx + 5)
  }, [selectedClass])

  // Filter sessions based on session status tab filter
  const filteredSessions = useMemo(() => {
    switch (sessionFilter) {
      case 'all':
        return selectedClassSessions
      case 'active': {
        const ongoing = selectedClassSessions.filter((s) => s.status === 'ongoing')
        const firstUpcoming = selectedClassSessions.find((s) => s.status === 'upcoming')
        const list = [...ongoing]
        if (firstUpcoming) {
          list.push(firstUpcoming)
        }
        return list
      }
      case 'upcoming':
        return selectedClassSessions.filter((s) => s.status === 'upcoming')
      case 'completed':
        return selectedClassSessions.filter((s) => s.status === 'completed')
      case 'cancelled':
        return selectedClassSessions.filter((s) => s.status === 'cancelled')
      default:
        return selectedClassSessions
    }
  }, [selectedClassSessions, sessionFilter])

  // Automatically select the first ongoing/upcoming session when sessions list updates
  useEffect(() => {
    if (selectedClassSessions && selectedClassSessions.length > 0) {
      const activeSession = selectedClassSessions.find(s => s.status === 'ongoing' || s.status === 'upcoming') || selectedClassSessions[0]
      const val = `${activeSession.date} (Buổi ${activeSession.sessionNumber}: ${activeSession.topic})`
      setStartSessionDate(val)
    } else {
      setStartSessionDate('')
    }
  }, [selectedClassSessions])

  // Calculate warnings
  const isClassFull = selectedClass ? selectedClass.enrolledStudents >= selectedClass.maxStudents : false
  
  const isLevelMismatch = useMemo(() => {
    if (!selectedClass || !studentLevel) return false
    const sLevel = studentLevel.toLowerCase()
    const cLevel = selectedClass.level.toLowerCase()
    return !sLevel.includes(cLevel) && !cLevel.includes(sLevel)
  }, [selectedClass, studentLevel])

  const conflictingClasses = useMemo(() => {
    if (!selectedClass || !studentClasses || studentClasses.length === 0) return []
    
    const conflicts: { className: string; dayOfWeek: string; timeSlot: string }[] = []
    
    // Only check against active enrolled classes
    const activeEnrolledClasses = studentClasses.filter(c => c.status === 'active')
    
    for (const enrolledClass of activeEnrolledClasses) {
      if (!enrolledClass.scheduleSlots || !selectedClass.scheduleSlots) continue
      
      for (const selectedSlot of selectedClass.scheduleSlots) {
        for (const enrolledSlot of enrolledClass.scheduleSlots) {
          if (checkSlotsOverlap(selectedSlot, enrolledSlot)) {
            conflicts.push({
              className: enrolledClass.className,
              dayOfWeek: selectedSlot.dayOfWeek,
              timeSlot: `${selectedSlot.startTime}-${selectedSlot.endTime}`
            })
          }
        }
      }
    }
    
    return conflicts
  }, [selectedClass, studentClasses])

  const [showWarningOpen, setShowWarningOpen] = useState(false)

  const handleConfirm = () => {
    if (selectedClass) {
      onConfirm({
        id: selectedClass.id,
        name: selectedClass.name || selectedClass.code,
        startSession: startSessionDate || undefined,
      })
      onOpenChange(false)
      setSelectedClassId(null)
      setStep(1)
    }
  }

  const handleConfirmAttempt = () => {
    if (selectedClass) {
      const cleanCurrent = currentClassCode?.trim().toLowerCase()
      const cleanSelectedCode = selectedClass.code?.trim().toLowerCase()
      const cleanSelectedId = selectedClass.id?.trim().toLowerCase()
      const isTransfer = cleanCurrent && cleanCurrent !== cleanSelectedCode && cleanCurrent !== cleanSelectedId
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
    setStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(val); }}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1200px] h-[750px] flex flex-col p-0 overflow-hidden bg-background shadow-2xl rounded-xl">
        <DialogHeader className="px-5 pt-4 pb-3 border-b bg-muted/20">
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-base font-bold text-foreground flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pr-8">
              <span>Ghép lớp học viên</span>
              <span className="text-xs font-normal text-muted-foreground bg-background px-3 py-1 rounded-full border shadow-2xs">
                Gói học: <strong className="text-foreground">{packageName}</strong> (Còn <strong className="text-emerald-600 font-semibold">{pkgRemainingSessions} buổi</strong>)
              </span>
            </DialogTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-x-3 gap-y-1 flex-wrap">
              <span>Học viên: <strong className="text-foreground">{studentName}</strong></span>
              <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                {studentCode}
              </span>
              {studentLevel && (
                <>
                  <span className="text-muted-foreground/30">|</span>
                  <span>Trình độ: <strong className="text-primary font-semibold">{studentLevel}</strong></span>
                </>
              )}
                  <span className="text-muted-foreground/30">|</span>
                  <span>Cơ sở gốc: <strong className="text-foreground">{studentBranch}</strong></span>
            </div>
          </div>
        </DialogHeader>

        {/* Selected Class Breadcrumbs (Step 2 only) */}
        {step === 2 && selectedClass && (
          <div className="px-5 py-2 border-b bg-primary/[0.03] select-none flex items-center justify-between">
            <div className="text-xs text-foreground font-semibold flex items-center gap-2 flex-wrap">
              <span className="text-muted-foreground">Đang ghép vào lớp:</span>
              <span className="text-primary font-bold">{selectedClass.name || selectedClass.code}</span>
              <span className="text-muted-foreground/30">|</span>
              <span>Giáo viên: <strong>{selectedClass.teacher}</strong></span>
              <span className="text-muted-foreground/30">|</span>
              <span>Sĩ số: <strong>{selectedClass.enrolledStudents}/{selectedClass.maxStudents}</strong></span>
              <span className="text-muted-foreground/30">|</span>
              <span>Phòng: <strong>{selectedClass.room}</strong></span>
            </div>
            <button 
              onClick={() => setStep(1)} 
              className="text-xs text-primary font-bold hover:underline cursor-pointer flex items-center gap-1 shrink-0"
            >
              ← Thay đổi lớp
            </button>
          </div>
        )}

        {/* Status Tab Filter Bar (Step 1 only) */}
        {step === 1 && (
          <div className="flex flex-wrap gap-1 px-5 py-1.5 bg-muted/10 select-none">
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
                    ? (c.level.toLowerCase().includes(studentLevel.toLowerCase()) ||
                       studentLevel.toLowerCase().includes(c.level.toLowerCase()))
                    : true
                  const isActiveStatus = c.status === 'dang_hoc' || c.status === 'cho_khai_giang'
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
                    setSelectedClassId(null)
                  }}
                  className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {tab.label} ({count})
                </button>
              )
            })}
          </div>
        )}

        {/* Filters Toolbar (Step 1 only) */}
        {step === 1 && (
          <div className="px-5 py-1.5 border-b flex flex-wrap items-center justify-between bg-background select-none gap-3">
            <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
              <div className="w-[160px] shrink-0">
                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger size="sm" className="w-full h-7 text-xs bg-background py-0.5">
                    <SelectValue placeholder="Trường" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trường</SelectItem>
                    <SelectItem value="RinoEdu Nguyễn Tuân">RinoEdu Nguyễn Tuân</SelectItem>
                    <SelectItem value="RinoEdu Linh Đàm">RinoEdu Linh Đàm</SelectItem>
                    <SelectItem value="RinoEdu Smart City">RinoEdu Smart City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[150px] shrink-0">
                <Select value={gradeGroupFilter} onValueChange={setGradeGroupFilter}>
                  <SelectTrigger size="sm" className="w-full h-7 text-xs bg-background py-0.5">
                    <SelectValue placeholder="Khối lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả khối lớp</SelectItem>
                    <SelectItem value="IELTS">Khối IELTS</SelectItem>
                    <SelectItem value="TOEIC">Khối TOEIC</SelectItem>
                    <SelectItem value="Young Learners">Khối Young Learners</SelectItem>
                    <SelectItem value="Math">Khối Toán</SelectItem>
                    <SelectItem value="Beginner">Khối Beginner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[140px] shrink-0">
                <Select value={dayFilter} onValueChange={setDayFilter}>
                  <SelectTrigger size="sm" className="w-full h-7 text-xs bg-background py-0.5">
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
            </div>
            <ExpandableSearch
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder="Tìm tên lớp, GV, phòng..."
              inputClassName="h-7 text-xs sm:w-60"
              className="shrink-0"
            />
          </div>
        )}

        {/* Flat Table Area (Fixed height scroll container) */}
        <div className="flex-1 overflow-y-auto min-h-0 px-5 pb-2 pt-0">
          {step === 1 ? (
            filteredClasses.length === 0 ? (
              <EmptyState
                title="Không tìm thấy lớp học"
                description="Không có lớp học nào phù hợp với bộ lọc hiện tại."
                className="py-12"
              />
            ) : (
              <StudentClassAssignmentTable
                filteredClasses={filteredClasses}
                selectedClassId={selectedClassId}
                onSelectClass={setSelectedClassId}
              />
            )
          ) : (
            // Step 2: Render Sessions selection Table
            <StudentClassAssignmentSessions
              selectedClassSessions={selectedClassSessions}
              filteredSessions={filteredSessions}
              sessionFilter={sessionFilter}
              onSetSessionFilter={setSessionFilter}
              startSessionDate={startSessionDate}
              onSelectSession={setStartSessionDate}
            />
          )}
        </div>

        <DialogFooter className="px-5 py-3 border-t bg-muted/10 flex flex-row items-center justify-between sm:justify-between gap-4">
          <div className="flex-1 min-w-0 text-left pr-4 select-none">
            {(isClassFull || isLevelMismatch || conflictingClasses.length > 0) && selectedClass && (
              <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium space-y-0.5">
                {isClassFull && (
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span className="truncate">Lớp đầy sĩ số ({selectedClass.enrolledStudents}/{selectedClass.maxStudents})</span>
                  </div>
                )}
                {isLevelMismatch && (
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span className="truncate">Trình độ lệch (Lớp {selectedClass.level} vs Học viên {studentLevel})</span>
                  </div>
                )}
                {conflictingClasses.map((conflict, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <span className="truncate">
                      Trùng lịch học lớp <strong>{conflict.className}</strong> ({conflict.dayOfWeek} {conflict.timeSlot})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-lg h-9 px-4">
                Quay lại
              </Button>
            )}
            <Button
              onClick={() => {
                if (step === 1) {
                  if (selectedClassId) setStep(2)
                } else {
                  handleConfirmAttempt()
                }
              }}
              disabled={step === 1 ? !selectedClassId : !startSessionDate}
              className="rounded-lg h-9 px-5"
            >
              {step === 1 ? 'Tiếp tục' : 'Xác nhận ghép'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
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
                Học viên đang học ở lớp <strong className="font-semibold text-foreground">{currentClassName || currentClassCode}</strong>.
              </p>
              <p>
                Hành động này sẽ <strong className="font-semibold text-destructive">xóa (thoát) học viên khỏi lớp cũ</strong> và chuyển sang lớp mới <strong className="font-semibold text-foreground">{selectedClass.name || selectedClass.code}</strong>.
              </p>
              <p>Bạn có chắc chắn muốn tiếp tục?</p>
            </div>
          }
        />
      )}
    </Dialog>
  )
}
