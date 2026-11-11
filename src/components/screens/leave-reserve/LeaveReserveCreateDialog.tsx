'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import { StudentCombobox, type StudentOption } from '@/components/controls'
import { mockStudents } from '@/mocks/students'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import {
  formatDateISO,
  addDays,
  addMonths,
  getSubjectMaxHoldSessions,
  getPastAllowedDate,
  generateStudentClassTree,
  getStudentLeaveQuotaStats,
} from './leaveReserveHelpers'
import type { StudentClassSession, LeaveReservePackageItem } from './leaveReserveTypes'
import { LeaveReservePolicyPanel } from './LeaveReservePolicyPanel'
import { LeaveReserveOffForm } from './LeaveReserveOffForm'
import { LeaveReserveReservationForm } from './LeaveReserveReservationForm'

interface LeaveReserveCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialType?: 'off' | 'reservation'
  initialStudentId?: string
  initialClassCode?: string
  initialClassName?: string
  initialPackageName?: string
  initialRemainingSessions?: number
  initialTotalSessions?: number
  packagesList?: Array<{
    id: string
    packageName: string
    remainingSessions: number
    totalSessions: number
    classCode: string
    className: string
  }>
  selectedPackageId?: string
  onSubmit: (
    req: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>,
    extraReqs?: Array<Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>>
  ) => void
}

export function LeaveReserveCreateDialog(props: LeaveReserveCreateDialogProps) {
  if (!props.open) return null
  return <LeaveReserveCreateDialogInner {...props} />
}

function LeaveReserveCreateDialogInner({
  open,
  onOpenChange,
  initialType = 'off',
  initialStudentId,
  initialClassCode,
  initialClassName,
  initialPackageName,
  initialRemainingSessions,
  initialTotalSessions,
  packagesList,
  selectedPackageId,
  onSubmit,
}: LeaveReserveCreateDialogProps) {
  const todayStr = useMemo(() => formatDateISO(new Date()), [])
  const type = initialType

  const [studentId, setStudentId] = useState<string>(initialStudentId || mockStudents[0]?.id || '')

  // Reservation specific sub-type: hold_seat vs no_hold_seat
  const [reserveMode, setReserveMode] = useState<'hold_seat' | 'no_hold_seat'>('hold_seat')

  const [startDate, setStartDate] = useState<string>(todayStr)
  const [endDate, setEndDate] = useState<string>(todayStr)
  const [reason, setReason] = useState<string>('')

  // Find active student (supports 'bao-han', 's-baohan', or exact match)
  const activeStudentId = initialStudentId || studentId
  const selectedStudent = useMemo(() => {
    return (
      mockStudents.find(
        (s) =>
          s.id === activeStudentId ||
          s.id === `s-${activeStudentId}` ||
          (activeStudentId === 'bao-han' && s.id === 's-baohan') ||
          s.name === activeStudentId
      ) || mockStudents[0]
    )
  }, [activeStudentId])

  // Derive active package options (Toán / Tiếng Anh)
  const packageOptions: LeaveReservePackageItem[] = useMemo(() => {
    if (!selectedStudent) return []

    // If student has multiple enrolledClasses in mockStudents, use them
    if (selectedStudent.enrolledClasses && selectedStudent.enrolledClasses.length > 0) {
      return selectedStudent.enrolledClasses.map((c, idx) => {
        const isMath = c.className.toLowerCase().includes('toán') || c.classCode.toLowerCase().includes('toan')
        return {
          id: c.packageId || `pkg-${idx + 1}`,
          packageName:
            c.linkedPackageName ||
            (isMath
              ? '[MATH_TUTOR] Toán Tư Duy Toán 1:6_96 buổi'
              : '[IE_MOVERS] Tiếng Anh SuperKids 1:6_48 buổi'),
          subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
          classCode: c.classCode,
          className: c.className,
          remainingSessions: c.remainingSessions ?? (isMath ? 12 : 24),
          totalSessions: c.totalSessions ?? (isMath ? 96 : 48),
          schedule: c.scheduleSlots?.map((s) => `${s.dayOfWeek} (${s.startTime} - ${s.endTime})`).join(', ') || '',
        }
      })
    }

    // Fallback: If packagesList passed from props
    if (packagesList && packagesList.length > 0) {
      return packagesList.map((p) => {
        const isMath = p.packageName.toLowerCase().includes('toán')
        return {
          id: p.id,
          packageName: p.packageName,
          subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
          classCode: p.classCode,
          className: p.className,
          remainingSessions: p.remainingSessions,
          totalSessions: p.totalSessions,
        }
      })
    }

    return [
      {
        id: 'pkg-1',
        packageName: initialPackageName || selectedStudent.packageName || 'Gói chuẩn',
        subject: selectedStudent.level?.includes('Toán') ? 'Toán tư duy' : 'Chương trình',
        classCode: initialClassCode || 'CLS-GEN-01',
        className: initialClassName || selectedStudent.enrolledClass || 'Lớp học hiện tại',
        remainingSessions: initialRemainingSessions ?? selectedStudent.remainingSessions ?? 12,
        totalSessions: initialTotalSessions ?? selectedStudent.totalSessions ?? 96,
      },
    ]
  }, [
    selectedStudent,
    packagesList,
    initialClassCode,
    initialClassName,
    initialPackageName,
    initialRemainingSessions,
    initialTotalSessions,
  ])

  // Find matching default package from initialClassCode, initialPackageName, or selectedPackageId
  const initialDefaultTab = useMemo(() => {
    if (initialClassCode) {
      const match = packageOptions.find((p) => p.classCode === initialClassCode)
      if (match) return match.classCode
    }
    if (selectedPackageId) {
      const match = packageOptions.find((p) => p.id === selectedPackageId)
      if (match) return match.classCode
    }
    if (initialPackageName) {
      const isEnglish = !initialPackageName.toLowerCase().includes('toán')
      const match = packageOptions.find((p) =>
        isEnglish ? !p.subject.toLowerCase().includes('toán') : p.subject.toLowerCase().includes('toán')
      )
      if (match) return match.classCode
    }
    return packageOptions[0]?.classCode || ''
  }, [initialClassCode, selectedPackageId, initialPackageName, packageOptions])

  // Active package tab: Mặc định vào đúng gói mà người dùng đã chọn mở modal
  const [activePackageTab, setActivePackageTab] = useState<string>(initialDefaultTab)

  // Student's enrolled classes list
  const studentClasses = useMemo(() => {
    if (!selectedStudent) return []
    if (selectedStudent.enrolledClasses && selectedStudent.enrolledClasses.length > 0) {
      return selectedStudent.enrolledClasses
    }
    return [
      {
        classCode: 'CLS-GEN-01',
        className: selectedStudent.enrolledClass || 'Lớp học hiện tại',
        type: 'offline' as const,
        scheduleSlots: [],
        teacherName: 'Giáo viên phụ trách',
        status: 'active' as const,
        progress: '10/24',
        branch: selectedStudent.branch,
      },
    ]
  }, [selectedStudent])

  const selectedClass = useMemo(() => {
    if (activePackageTab) {
      const found = studentClasses.find((c) => c.classCode === activePackageTab)
      if (found) return found
    }
    return studentClasses[0]
  }, [studentClasses, activePackageTab])

  // Subject limit info for hold seat
  const subjectHoldInfo = useMemo(() => {
    return getSubjectMaxHoldSessions(selectedClass?.className || selectedStudent?.enrolledClass)
  }, [selectedClass, selectedStudent])

  // Generate Treeview of all classes & upcoming sessions for leave mode
  const allClassTrees = useMemo(() => {
    if (!selectedStudent) return []
    return generateStudentClassTree(
      selectedStudent,
      mockLeaveReserveRequests,
      4
    )
  }, [selectedStudent])

  // Filter class trees based on activePackageTab
  const displayedClassTrees = useMemo(() => {
    if (!activePackageTab) return allClassTrees
    return allClassTrees.filter((t) => t.classCode === activePackageTab)
  }, [allClassTrees, activePackageTab])

  // Student Quota stats based on history & selected package tab
  const quotaStats = useMemo(() => {
    return getStudentLeaveQuotaStats(selectedStudent, mockLeaveReserveRequests, activePackageTab)
  }, [selectedStudent, activePackageTab])

  // Active package object for Policy panel
  const activePackageForPolicy = useMemo(() => {
    return packageOptions.find((p) => p.classCode === activePackageTab) || packageOptions[0]
  }, [packageOptions, activePackageTab])

  // First available session for initial default
  const defaultFirstSessionId = useMemo(() => {
    for (const tree of displayedClassTrees) {
      const found = tree.sessions.find((s) => !s.alreadyRequested)
      if (found) return found.id
    }
    return undefined
  }, [displayedClassTrees])

  // Set of selected session IDs for leave mode
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(() => {
    return defaultFirstSessionId ? new Set([defaultFirstSessionId]) : new Set()
  })

  // Khi chuyển tab gói học, chọn buổi học khả dụng đầu tiên của gói đó
  const handlePackageTabChange = (tabId: string) => {
    setActivePackageTab(tabId)
    const targetTree = allClassTrees.find((t) => t.classCode === tabId)
    const firstAvailable = targetTree?.sessions.find((s) => !s.alreadyRequested)
    if (firstAvailable) {
      setSelectedSessionIds(new Set([firstAvailable.id]))
    } else {
      setSelectedSessionIds(new Set())
    }
  }

  // Student options for combobox (chỉ dùng khi không có studentId từ trước)
  const studentOptions: StudentOption[] = useMemo(() => {
    return mockStudents.map((s) => ({
      id: s.id,
      label: `${s.name} (${s.branch})`,
      familyName: s.parentName ? `PH: ${s.parentName}` : undefined,
      phone: s.phone,
      avatar: s.avatar,
    }))
  }, [])

  // Toggle session selection in treeview
  const handleToggleSession = (session: StudentClassSession) => {
    setSelectedSessionIds((prev) => {
      const next = new Set(prev)
      if (next.has(session.id)) {
        next.delete(session.id)
      } else {
        next.add(session.id)
      }
      return next
    })
  }

  // Handle Reserve Mode switch (Giữ chỗ vs Không giữ chỗ)
  const handleReserveModeChange = (mode: 'hold_seat' | 'no_hold_seat') => {
    setReserveMode(mode)
    const baseStart = startDate ? new Date(startDate) : new Date()
    if (mode === 'hold_seat') {
      const days = subjectHoldInfo.maxSessions * 3
      const computedEnd = formatDateISO(addDays(baseStart, days))
      setEndDate(computedEnd)
    } else {
      const computedEnd = formatDateISO(addMonths(baseStart, 1))
      setEndDate(computedEnd)
    }
  }

  // Quick past date helper (Bảo lưu quá khứ 1 buổi trước)
  const handlePastReservationDate = () => {
    const pastDate = getPastAllowedDate()
    setStartDate(pastDate)
    const baseStart = new Date(pastDate)
    if (reserveMode === 'hold_seat') {
      const computedEnd = formatDateISO(addDays(baseStart, subjectHoldInfo.maxSessions * 3))
      setEndDate(computedEnd)
    } else {
      const computedEnd = formatDateISO(addMonths(baseStart, 1))
      setEndDate(computedEnd)
    }
  }

  const isStartDateInPast = useMemo(() => {
    if (!startDate) return false
    const today = new Date().toISOString().split('T')[0]
    return startDate < today
  }, [startDate])

  const handleClearAndClose = () => {
    setReason('')
    setSelectedSessionIds(defaultFirstSessionId ? new Set([defaultFirstSessionId]) : new Set())
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent || !reason.trim()) return

    const selectedSessionsList = allClassTrees
      .flatMap((t) => t.sessions)
      .filter((s) => selectedSessionIds.has(s.id))

    if (type === 'off' && selectedSessionsList.length === 0) return

    if (type === 'off') {
      // Group selected sessions by classCode so that if multiple packages are selected, requests are generated for each
      const sessionsByClass = new Map<string, StudentClassSession[]>()
      for (const session of selectedSessionsList) {
        const list = sessionsByClass.get(session.classCode) || []
        list.push(session)
        sessionsByClass.set(session.classCode, list)
      }

      const requestsToCreate: Array<Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>> = []

      for (const [clsCode, sessions] of sessionsByClass.entries()) {
        const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date))
        const reqStartDate = sorted[0].date
        const reqEndDate = sorted[sorted.length - 1].date
        const foundCls = studentClasses.find((c) => c.classCode === clsCode)
        const isMath =
          foundCls?.className.toLowerCase().includes('toán') || clsCode.toLowerCase().includes('toan')
        const subjName = isMath ? 'Toán tư duy' : 'Tiếng Anh'
        const title = `Đơn xin nghỉ phép - ${selectedStudent.name} (${subjName} - ${sessions.length} buổi)`

        requestsToCreate.push({
          studentId: selectedStudent.id,
          studentName: selectedStudent.name,
          studentCode:
            selectedStudent.id === 's-baohan'
              ? '10700325'
              : `STU-00${selectedStudent.id.replace(/\D/g, '') || '01'}`,
          branch: selectedStudent.branch,
          type: 'off',
          startDate: reqStartDate,
          endDate: reqEndDate || reqStartDate,
          reason: reason.trim(),
          title,
          phone: selectedStudent.phone || '',
          email: selectedStudent.email || '',
          className: foundCls?.className || selectedStudent.enrolledClass || 'Lớp chưa xếp',
          classCode: clsCode,
          productPackage: foundCls?.linkedPackageName || selectedStudent.packageName || 'Gói chuẩn',
          parentName: selectedStudent.parentName ? `Phụ huynh: ${selectedStudent.parentName}` : undefined,
          additionalContacts: selectedStudent.parentPhone
            ? [{ name: `Phụ huynh: ${selectedStudent.parentName || 'Người giám hộ'}`, phone: selectedStudent.parentPhone }]
            : [],
          quota: quotaStats.totalQuota,
          usedAbsences: sessions.length,
        })
      }

      if (requestsToCreate.length > 0) {
        const [first, ...rest] = requestsToCreate
        onSubmit(first, rest)
      }
    } else {
      const appliedClass = studentClasses[0]
      const title = `Đơn xin bảo lưu - ${selectedStudent.name} (${reserveMode === 'hold_seat' ? 'Giữ chỗ' : 'Không giữ chỗ'})`
      onSubmit({
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        studentCode:
          selectedStudent.id === 's-baohan'
            ? '10700325'
            : `STU-00${selectedStudent.id.replace(/\D/g, '') || '01'}`,
        branch: selectedStudent.branch,
        type: 'reservation',
        startDate: startDate,
        endDate: endDate || startDate,
        reason: reason.trim(),
        title,
        phone: selectedStudent.phone || '',
        email: selectedStudent.email || '',
        className: appliedClass?.className || selectedStudent.enrolledClass || 'Lớp chưa xếp',
        classCode: appliedClass?.classCode || 'CLS-GEN-01',
        productPackage: selectedStudent.packageName || 'Gói chuẩn',
        parentName: selectedStudent.parentName ? `Phụ huynh: ${selectedStudent.parentName}` : undefined,
        additionalContacts: selectedStudent.parentPhone
          ? [{ name: `Phụ huynh: ${selectedStudent.parentName || 'Người giám hộ'}`, phone: selectedStudent.parentPhone }]
          : [],
        quota: quotaStats.totalQuota,
        usedAbsences: 0,
      })
    }

    handleClearAndClose()
  }

  const selectedSessionsCount = selectedSessionIds.size
  const isSubmitDisabled =
    !reason.trim() ||
    (type === 'off' && selectedSessionsCount === 0) ||
    (type === 'reservation' && !startDate)

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClearAndClose()
        else onOpenChange(true)
      }}
    >
      <DialogContent className="w-[96vw] max-w-5xl lg:max-w-[1040px] xl:max-w-[1080px] bg-card p-0 gap-0 overflow-hidden border border-border shadow-2xl rounded-xl">
        {/* Header: Viết hoa chữ cái đầu, text thường, nhỏ, màu nhạt, không in đậm */}
        <DialogHeader className="px-5 py-2.5 border-b border-border/40">
          <DialogTitle className="text-xs font-normal text-muted-foreground tracking-normal">
            {type === 'off' ? 'Đăng ký nghỉ phép' : 'Đơn xin bảo lưu học tập'}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Tạo đơn yêu cầu xin nghỉ phép hoặc bảo lưu học tập cho học viên
        </DialogDescription>

        {/* 2-Column Body: Form on Left + Policy & Student Panel on Right */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-4 max-h-[75vh] overflow-y-auto">
            {/* Left Column: Form Controls (7 cols) */}
            <div className="space-y-3 md:col-span-7">
              {/* Chỉ hiển thị ô search học viên khi KHÔNG đi từ học viên cụ thể */}
              {!initialStudentId && (
                <div className="space-y-1">
                  <FieldLabel label="Học viên" required>
                    <StudentCombobox
                      options={studentOptions}
                      value={selectedStudent?.id || ''}
                      onChange={(val) => {
                        setStudentId(val)
                      }}
                      placeholder="Tìm theo tên, SĐT hoặc mã học viên..."
                      className="w-full"
                    />
                  </FieldLabel>
                </div>
              )}

              {/* SECTION: Nghỉ phép with Treeview of classes & upcoming sessions */}
              {type === 'off' && (
                <LeaveReserveOffForm
                  student={selectedStudent}
                  packageOptions={packageOptions}
                  activePackageTab={activePackageTab}
                  onPackageTabChange={handlePackageTabChange}
                  classTrees={displayedClassTrees}
                  selectedSessionIds={selectedSessionIds}
                  onToggleSession={handleToggleSession}
                  quotaStats={quotaStats}
                />
              )}

              {/* SECTION: Bảo lưu with Hold vs No-Hold and Past Reserve */}
              {type === 'reservation' && (
                <LeaveReserveReservationForm
                  reserveMode={reserveMode}
                  onReserveModeChange={handleReserveModeChange}
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  onPastReservationDate={handlePastReservationDate}
                  isStartDateInPast={isStartDateInPast}
                  subjectHoldInfo={subjectHoldInfo}
                />
              )}

              {/* Reason Textarea (Viết hoa chữ cái đầu, text thường, không in đậm) */}
              <div className="space-y-1">
                <label className="text-xs font-normal text-muted-foreground">
                  {type === 'off' ? 'Lý do nghỉ phép' : 'Lý do xin bảo lưu'} <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="request-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    type === 'off'
                      ? 'Nhập lý do nghỉ phép (ví dụ: Học viên ốm sốt, bận việc gia đình...)'
                      : 'Ví dụ: Học viên đi học quân sự, du học trao đổi, lý do cá nhân...'
                  }
                  className="w-full min-h-[56px] max-h-[80px] rounded-md border border-input bg-background p-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-normal"
                  required
                />
              </div>
            </div>

            {/* Right Column: Thông tin học viên + Lịch sử nghỉ phép + Quy định (5 cols) */}
            <LeaveReservePolicyPanel
              type={type}
              student={selectedStudent}
              studentId={selectedStudent?.id}
              studentName={selectedStudent?.name}
              packageName={activePackageForPolicy?.packageName || initialPackageName}
              remainingSessions={activePackageForPolicy?.remainingSessions ?? initialRemainingSessions}
              totalSessions={activePackageForPolicy?.totalSessions ?? initialTotalSessions}
              activePackageTab={activePackageTab}
              activePackage={activePackageForPolicy}
            />
          </div>

          {/* Compact Footer (Nút Bỏ qua & Xác nhận) */}
          <div className="px-5 py-2.5 border-t border-border/40 flex items-center justify-end gap-2 bg-muted/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAndClose}
              className="cursor-pointer h-8 text-xs px-4"
            >
              Bỏ qua
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitDisabled}
              className="font-semibold cursor-pointer h-8 text-xs px-5 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Xác nhận
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
