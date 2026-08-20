'use client'

import { useState, useMemo, useEffect } from 'react'
import { AlertTriangle, CheckCircle2, UserCheck } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FieldLabel, AppAvatar } from '@/components/shared'
import { SegmentedControl, StudentCombobox, type StudentOption } from '@/components/controls'
import { mockStudents } from '@/mocks/students'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'
import { cn } from '@/lib/utils'
import {
  formatDateISO,
  addDays,
  addMonths,
  maskPhone,
  generateStudentSessions,
  getSubjectMaxHoldSessions,
  isEligibleForReserve,
  getPastAllowedDate,
} from './leaveReserveHelpers'
import { LeaveReservePolicyPanel } from './LeaveReservePolicyPanel'
import { LeaveReserveOffForm } from './LeaveReserveOffForm'
import { LeaveReserveReservationForm } from './LeaveReserveReservationForm'

interface LeaveReserveCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialType?: 'off' | 'reservation'
  onSubmit: (req: Omit<LeaveReserveRequest, 'id' | 'status' | 'requestedDate'>) => void
}

export function LeaveReserveCreateDialog({
  open,
  onOpenChange,
  initialType = 'off',
  onSubmit,
}: LeaveReserveCreateDialogProps) {
  const todayStr = useMemo(() => formatDateISO(new Date()), [])
  const [type, setType] = useState<'off' | 'reservation'>(initialType)
  const [studentId, setStudentId] = useState<string>(mockStudents[0]?.id || '')
  const [selectedClassCode, setSelectedClassCode] = useState<string>('all')

  // Reservation specific sub-type: hold_seat vs no_hold_seat
  const [reserveMode, setReserveMode] = useState<'hold_seat' | 'no_hold_seat'>('hold_seat')

  const [startDate, setStartDate] = useState<string>(todayStr)
  const [endDate, setEndDate] = useState<string>(todayStr)
  const [reason, setReason] = useState<string>('')
  const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set())

  // Find selected student data
  const selectedStudent = useMemo(() => {
    return mockStudents.find((s) => s.id === studentId) || mockStudents[0]
  }, [studentId])

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
    return studentClasses.find((c) => c.classCode === selectedClassCode) || studentClasses[0]
  }, [studentClasses, selectedClassCode])

  // Subject limit info for hold seat
  const subjectHoldInfo = useMemo(() => {
    return getSubjectMaxHoldSessions(selectedClass?.className || selectedStudent?.enrolledClass)
  }, [selectedClass, selectedStudent])

  // Eligibility evaluation
  const eligibility = useMemo(() => {
    return isEligibleForReserve(selectedStudent)
  }, [selectedStudent])

  // Sync initial type and dates when dialog opens
  useEffect(() => {
    if (open) {
      setType(initialType)
      const today = new Date()
      const tStr = formatDateISO(today)
      setStartDate(tStr)
      if (initialType === 'off') {
        setEndDate(tStr)
      } else {
        setReserveMode('hold_seat')
        const maxSessions = getSubjectMaxHoldSessions(selectedClass?.className || selectedStudent?.enrolledClass).maxSessions
        const computedEnd = formatDateISO(addDays(today, maxSessions * 3))
        setEndDate(computedEnd)
      }
    }
  }, [open, initialType])

  // Reset form when switching main types (Off vs Reservation)
  const handleTypeChange = (newType: string) => {
    const t = newType as 'off' | 'reservation'
    setType(t)
    const today = new Date()
    const tStr = formatDateISO(today)
    setStartDate(tStr)
    if (t === 'off') {
      setEndDate(tStr)
    } else {
      setReserveMode('hold_seat')
      const computedEnd = formatDateISO(addDays(today, subjectHoldInfo.maxSessions * 3))
      setEndDate(computedEnd)
    }
  }

  // Student options for combobox
  const studentOptions: StudentOption[] = useMemo(() => {
    return mockStudents.map((s) => ({
      id: s.id,
      label: `${s.name} (${s.branch})`,
      familyName: s.parentName ? `PH: ${s.parentName}` : undefined,
      phone: s.phone,
      avatar: s.avatar,
    }))
  }, [])

  // Available sessions on the selected start date for 'off' mode across ALL classes of student
  const availableSessions = useMemo(() => {
    if (!selectedStudent || !startDate) return []
    return generateStudentSessions(selectedStudent, startDate, 'all')
  }, [selectedStudent, startDate])

  // Key derived from session ids to prevent reference-based infinite re-renders
  const availableSessionIdsKey = useMemo(() => {
    return availableSessions.map((s) => s.id).join(',')
  }, [availableSessions])

  // Default select all sessions when available sessions change
  useEffect(() => {
    if (!availableSessionIdsKey) {
      setSelectedSessionIds(new Set())
    } else {
      setSelectedSessionIds(new Set(availableSessionIdsKey.split(',')))
    }
  }, [availableSessionIdsKey])

  const toggleSession = (id: string) => {
    setSelectedSessionIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAllSessions = () => {
    if (selectedSessionIds.size === availableSessions.length) {
      setSelectedSessionIds(new Set())
    } else {
      setSelectedSessionIds(new Set(availableSessions.map((s) => s.id)))
    }
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
    setStudentId(mockStudents[0]?.id || '')
    setSelectedClassCode('all')
    const today = new Date()
    const todayStr = formatDateISO(today)
    setStartDate(todayStr)
    setEndDate(todayStr)
    setReason('')
    setSelectedSessionIds(new Set())
    onOpenChange(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent || !startDate || !reason.trim()) return

    const appliedClass = selectedClassCode === 'all' ? studentClasses[0] : selectedClass

    let title = ''
    if (type === 'off') {
      title = `Đơn xin nghỉ phép - ${selectedStudent.name} (${selectedSessionIds.size} buổi)`
    } else {
      title = `Đơn xin bảo lưu - ${selectedStudent.name} (${reserveMode === 'hold_seat' ? 'Giữ chỗ' : 'Không giữ chỗ'})`
    }

    onSubmit({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentCode: `STU-00${selectedStudent.id.replace(/\D/g, '') || '01'}`,
      branch: selectedStudent.branch,
      type,
      startDate,
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
      quota: 12,
      usedAbsences: type === 'off' ? selectedSessionIds.size : 0,
    })

    handleClearAndClose()
  }

  const isSubmitDisabled =
    !startDate ||
    !reason.trim() ||
    (type === 'off' && selectedSessionIds.size === 0)

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClearAndClose()
        else onOpenChange(true)
      }}
    >
      <DialogContent className="w-[92vw] max-w-4xl sm:max-w-4xl lg:max-w-5xl bg-card p-0 gap-0 overflow-hidden border border-border shadow-2xl rounded-2xl">
        {/* Clean Header - NO Subtitle & NO Horizontal Border Line */}
        <DialogHeader className="px-6 pt-5 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <DialogTitle className="text-xl font-bold text-foreground tracking-tight">
              Tạo đơn yêu cầu mới
            </DialogTitle>

            <div className="w-full sm:w-auto min-w-[240px]">
              <SegmentedControl
                value={type}
                options={[
                  {
                    value: 'off',
                    label: 'Nghỉ phép',
                  },
                  {
                    value: 'reservation',
                    label: 'Bảo lưu',
                  },
                ]}
                onValueChange={handleTypeChange}
              />
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Tạo đơn yêu cầu xin nghỉ phép hoặc bảo lưu học tập cho học viên
        </DialogDescription>

        {/* 2-Column Body: Form on Left + Policy Panel on Right */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-4 pt-1 max-h-[74vh] overflow-y-auto">
            {/* Left Column: Form Controls (7 cols) */}
            <div className="space-y-3 md:col-span-7">
              {/* Student Selector */}
              <div className="space-y-2">
                <FieldLabel label="Học viên" required>
                  <StudentCombobox
                    options={studentOptions}
                    value={selectedStudent?.id || ''}
                    onChange={(val) => {
                      setStudentId(val)
                      setSelectedClassCode('all')
                    }}
                    placeholder="Tìm theo tên, SĐT hoặc mã học viên..."
                    className="w-full"
                  />
                </FieldLabel>

                {/* Selected Student Card (New Hero Card Structure) */}
                {selectedStudent && (
                  <div className="rounded-2xl border border-border/80 bg-card p-3 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <AppAvatar
                          name={selectedStudent.name}
                          src={selectedStudent.avatar}
                          size="lg"
                          className="h-11 w-11 rounded-full border border-primary/20 text-base font-bold"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-sm font-bold text-foreground">{selectedStudent.name}</span>
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded border">
                              + Thêm tên TA ✎
                            </span>
                            <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                              {type === 'off' ? 'Nghỉ phép' : 'Bảo lưu'}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span>NS: {selectedStudent.dob || '15/03/2012'}</span>
                            <span>•</span>
                            <span>{selectedStudent.gender || 'Nam'}</span>
                            <span>•</span>
                            <span>ĐC: {selectedStudent.branch}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
                            <span className="font-medium text-foreground">
                              {selectedStudent.parentName || 'Phạm Mai (Mẹ)'}
                            </span>
                            <span className="text-[9px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 px-1 py-0.2 rounded border border-sky-200">
                              Chính
                            </span>
                            <span>•</span>
                            <span className="font-mono font-semibold text-foreground">
                              {maskPhone(selectedStudent.parentPhone || selectedStudent.phone)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border">
                          STU-00{selectedStudent.id.replace(/\D/g, '') || '01'}
                        </span>
                        {type === 'reservation' && (
                          <span
                            className={cn(
                              'inline-flex items-center text-[9px] font-semibold px-1.5 py-0.5 rounded-full border',
                              eligibility.eligible
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300'
                            )}
                          >
                            {eligibility.eligible ? (
                              <>
                                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                                Đủ ĐK ({eligibility.remaining}b ≥ 16b)
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                                Chưa đủ 16b
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/60 rounded-lg px-2.5 py-1 text-[11px] text-amber-900 dark:text-amber-200">
                      <span className="text-amber-600 font-bold shrink-0">✎</span>
                      <span className="italic font-medium truncate">
                        Ghi chú: {selectedStudent.notes || 'Học viên tiếp thu tốt, phụ huynh mong muốn theo sát chuyên cần và bài tập.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: Nghỉ phép with 4-button Date Selector & Multi-session Checklist */}
              {type === 'off' && (
                <LeaveReserveOffForm
                  startDate={startDate}
                  onDateChange={(date) => {
                    setStartDate(date)
                    setEndDate(date)
                  }}
                  availableSessions={availableSessions}
                  selectedSessionIds={selectedSessionIds}
                  onToggleSession={toggleSession}
                  onToggleSelectAllSessions={toggleSelectAllSessions}
                  quotaRemaining={selectedStudent?.remainingSessions ?? 10}
                />
              )}

              {/* SECTION: Bảo lưu with Hold vs No-Hold and Past Reserve (No class restriction) */}
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

              {/* Reason Textarea */}
              <FieldLabel label={type === 'off' ? 'Lý do xin nghỉ phép' : 'Lý do xin bảo lưu'} required>
                <textarea
                  id="request-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    type === 'off'
                      ? 'Ví dụ: Học viên ốm sốt, gia đình có việc bận, đi du lịch...'
                      : 'Ví dụ: Học viên đi học quân sự, du học trao đổi, lý do cá nhân...'
                  }
                  className="w-full min-h-[60px] rounded-md border border-input bg-background p-2.5 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                />
              </FieldLabel>
            </div>

            {/* Right Column: Policy & Guidelines + Student History Cards (5 cols) */}
            <LeaveReservePolicyPanel
              type={type}
              studentId={selectedStudent?.id}
              studentName={selectedStudent?.name}
            />
          </div>

          {/* Clean Footer - NO Top Border Line */}
          <div className="px-6 py-4 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={handleClearAndClose} className="cursor-pointer">
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitDisabled}
              className="font-semibold cursor-pointer"
            >
              Gửi đơn yêu cầu
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
