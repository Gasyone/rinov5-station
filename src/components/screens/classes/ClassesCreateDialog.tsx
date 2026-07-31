'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { ArrowRight, ChevronLeft, Plus } from 'lucide-react'
import { mockClassRecords, type ClassRecord, type ScheduleSlot } from '@/mocks/classRecords'
import { mockTeachers } from '@/mocks/teacherRecords'
import { ClassesCreateRoster } from './ClassesCreateRoster'

// Sub-components
import { ClassesCreateBasicInfo } from './ClassesCreateBasicInfo'
import { ClassesCreateScheduleDays } from './ClassesCreateScheduleDays'

import {
  WEEKDAY_DAYS,
  initialScheduleDays,
  calculateEndTime,
  getCurriculumDetails,
} from './classesCreateTypes'

interface Student {
  id: string
  name: string
  code: string
  status?: string
}

interface ScheduleSlotState {
  dayOfWeek?: string
  startTime: string
  endTime: string
  teachers: string[]
  room: string
}

interface ScheduleDayState {
  enabled: boolean
  startTime: string
  endTime: string
  teachers: string[]
  room: string
  hasSecondary?: boolean
  secondarySlot?: ScheduleSlotState
}

interface ClassesCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newClass: ClassRecord) => void
}

export function ClassesCreateDialog({ open, onOpenChange, onSuccess }: ClassesCreateDialogProps) {
  const branchOptions = [...new Set(mockClassRecords.map((c) => c.branch))].sort()

  // State variables
  const [currentStep, setCurrentStep] = useState(1)
  const [className, setClassName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [subject, setSubject] = useState('')
  const [curriculumFrame, setCurriculumFrame] = useState('')
  const classType = 'Chính thức'
  const [classRatio, setClassRatio] = useState('1:10')
  const [teacherType, setTeacherType] = useState('')
  const [level, setLevel] = useState('')
  const [subLevel, setSubLevel] = useState('')
  const [grade, setGrade] = useState('')
  const [branch, setBranch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [duration, setDuration] = useState(90)
  const [teacherId, setTeacherId] = useState('')
  const assistantId = ''
  const [room, setRoom] = useState('')
  const [scheduleDays, setScheduleDays] = useState<Record<string, ScheduleDayState>>(initialScheduleDays)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Step 2 Students Roster state
  const [students, setStudents] = useState<Student[]>([])

  const handleSubjectChange = (val: string) => {
    setSubject(val)
    const abbrMap: Record<string, string> = {
      IELTS: 'IELTS',
      TOEIC: 'TOEIC',
      Beginner: 'BEG',
      English: 'ENG',
      Japanese: 'JPN',
      Movers: 'MOV',
      Flyers: 'FLY',
      'KET Prep': 'KET',
      'PET Prep': 'PET',
    }
    const code = abbrMap[val] || val.toUpperCase().slice(0, 3)
    const existingCount = mockClassRecords.filter((c) => c.level === val).length
    const nextNum = String(existingCount + 1).padStart(3, '0')
    const newCode = `CLS-${code}-${nextNum}`

    if (!classCode || classCode.startsWith('CLS-')) {
      setClassCode(newCode)
    }
  }

  const handleSyllabusChange = (val: string) => {
    setCurriculumFrame(val)
    if (validationErrors.curriculumFrame) {
      setValidationErrors((prev) => {
        const copy = { ...prev }
        delete copy.curriculumFrame
        return copy
      })
    }
    const details = getCurriculumDetails(val)
    if (details) {
      setSubject(details.subject)
      setLevel(details.level)
      setSubLevel(details.subLevel)

      const abbrMap: Record<string, string> = {
        IELTS: 'IELTS',
        TOEIC: 'TOEIC',
        Beginner: 'BEG',
        English: 'ENG',
        Japanese: 'JPN',
        Movers: 'MOV',
        Flyers: 'FLY',
        'KET Prep': 'KET',
        'PET Prep': 'PET',
      }
      const code = abbrMap[details.subject] || details.subject.toUpperCase().slice(0, 3)
      const existingCount = mockClassRecords.filter((c) => c.level === details.subject).length
      const nextNum = String(existingCount + 1).padStart(3, '0')
      const newCode = `CLS-${code}-${nextNum}`
      if (!classCode || classCode.startsWith('CLS-')) {
        setClassCode(newCode)
      }
    }
  }

  // Duration changes recalculate end time for all enabled days
  const handleDurationChange = (nextDurationStr: string) => {
    const nextDuration = Number(nextDurationStr) || 90
    setDuration(nextDuration)
    setScheduleDays((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((dayId) => {
        if (next[dayId].enabled) {
          next[dayId] = {
            ...next[dayId],
            endTime: calculateEndTime(next[dayId].startTime, nextDuration),
          }
        }
      })
      return next
    })
  }

  // Toggle day checkbox
  const handleToggleDay = (dayId: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      const nextEnabled = !day.enabled
      const nextEndTime = nextEnabled ? calculateEndTime(day.startTime, duration) : ''
      return {
        ...prev,
        [dayId]: {
          ...day,
          enabled: nextEnabled,
          endTime: nextEndTime,
        },
      }
    })
  }

  // Handle start time input
  const handleStartTimeChange = (dayId: string, nextStartTime: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      return {
        ...prev,
        [dayId]: {
          ...day,
          startTime: nextStartTime,
          endTime: calculateEndTime(nextStartTime, duration),
        },
      }
    })
  }

  // Handle room change for a specific day
  const handleRoomChange = (dayId: string, roomVal: string) => {
    setScheduleDays((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        room: roomVal,
      },
    }))
  }

  // Handle teacher/assistant selection for a specific day
  const handleTeacherSelect = (dayId: string, tId: string, roleIndex: 0 | 1) => {
    setScheduleDays((prev) => {
      const prevDay = prev[dayId]
      const nextTeachers = [...prevDay.teachers]
      nextTeachers[roleIndex] = tId
      return {
        ...prev,
        [dayId]: {
          ...prevDay,
          teachers: nextTeachers,
        },
      }
    })
  }

  const handleAddSecondarySlot = (dayId: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      const dayObj = WEEKDAY_DAYS.find((d) => d.id === dayId)
      const defaultSecondaryStart = '19:15'
      return {
        ...prev,
        [dayId]: {
          ...day,
          hasSecondary: true,
          secondarySlot: day.secondarySlot || {
            dayOfWeek: dayObj?.label || 'Thứ 2',
            startTime: defaultSecondaryStart,
            endTime: calculateEndTime(defaultSecondaryStart, duration),
            teachers: [],
            room: '',
          },
        },
      }
    })
  }

  const handleRemoveSecondarySlot = (dayId: string) => {
    setScheduleDays((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        hasSecondary: false,
      },
    }))
  }

  const handleSecondaryDayOfWeekChange = (dayId: string, nextDayOfWeek: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      return {
        ...prev,
        [dayId]: {
          ...day,
          secondarySlot: {
            ...day.secondarySlot,
            dayOfWeek: nextDayOfWeek,
          },
        },
      }
    })
  }

  const handleSecondaryStartTimeChange = (dayId: string, nextStartTime: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      return {
        ...prev,
        [dayId]: {
          ...day,
          secondarySlot: {
            ...day.secondarySlot,
            startTime: nextStartTime,
            endTime: calculateEndTime(nextStartTime, duration),
          },
        },
      }
    })
  }

  const handleSecondaryRoomChange = (dayId: string, roomVal: string) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      return {
        ...prev,
        [dayId]: {
          ...day,
          secondarySlot: {
            ...day.secondarySlot,
            room: roomVal,
          },
        },
      }
    })
  }

  const handleSecondaryTeacherSelect = (dayId: string, tId: string, roleIndex: 0 | 1) => {
    setScheduleDays((prev) => {
      const day = prev[dayId]
      if (!day.secondarySlot) return prev
      const nextTeachers = [...(day.secondarySlot.teachers || [])]
      nextTeachers[roleIndex] = tId
      return {
        ...prev,
        [dayId]: {
          ...day,
          secondarySlot: {
            ...day.secondarySlot,
            teachers: nextTeachers,
          },
        },
      }
    })
  }

  const handleAddStudent = (student: Student) => {
    setStudents((prev) => {
      if (prev.some((s) => s.id === student.id)) return prev
      return [...prev, student]
    })
  }

  const handleAddMultipleStudents = (newStudents: Student[]) => {
    setStudents((prev) => {
      const existingIds = new Set(prev.map((s) => s.id))
      const uniqueNew = newStudents.filter((s) => !existingIds.has(s.id))
      return [...prev, ...uniqueNew]
    })
  }

  const handleRemoveStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
  }

  // Schedule Summary details
  const scheduleSummaryList = Object.entries(scheduleDays)
    .filter(([, day]) => day.enabled)
    .map(([dayId, day]) => ({
      dayId,
      startTime: day.startTime,
      endTime: day.endTime,
      label: WEEKDAY_DAYS.find((d) => d.id === dayId)?.label || dayId,
    }))

  // Form submission
  const handleFormSubmit = (statusParam: 'nhap' | 'cho_khai_giang' = 'nhap') => {
    const errors: Record<string, string> = {}

    if (statusParam === 'cho_khai_giang') {
      if (!className.trim()) {
        errors.className = 'Vui lòng nhập tên lớp'
      }
      if (!branch) {
        errors.branch = 'Vui lòng chọn chi nhánh/trường'
      }
      if (!subject) {
        errors.subject = 'Vui lòng chọn môn học'
      }
      if (!startDate) {
        errors.startDate = 'Vui lòng chọn ngày bắt đầu'
      }
      if (!curriculumFrame) {
        errors.curriculumFrame = 'Vui lòng chọn chương trình'
      }
      if (students.length === 0) {
        errors.students = 'Lớp học cần có ít nhất 1 học viên xếp lớp'
      }

      const enabledDays = Object.entries(scheduleDays).filter(([, day]) => day.enabled)
      if (enabledDays.length === 0) {
        errors.schedule = 'Vui lòng kích hoạt ít nhất 1 ngày học trong tuần'
      } else {
        enabledDays.forEach(([dayId, day]) => {
          if (!day.room) {
            errors[`room_${dayId}`] = 'Vui lòng chọn phòng học cho ngày này'
          }
          if (day.teachers.length === 0) {
            errors[`teacher_${dayId}`] = 'Vui lòng phân công phụ trách cho ngày này'
          }
        })
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        toast.error('Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ.')
        const hasStep1Errors = Object.keys(errors).some((key) => key !== 'students')
        if (hasStep1Errors) {
          setCurrentStep(1)
        }
        return
      }
    } else {
      // For draft, only check className and branch
      if (!className.trim()) {
        errors.className = 'Vui lòng nhập tên lớp'
        setValidationErrors(errors)
        toast.error('Vui lòng nhập tên lớp!')
        setCurrentStep(1)
        return
      }
      if (!branch) {
        errors.branch = 'Vui lòng chọn trường'
        setValidationErrors(errors)
        toast.error('Vui lòng chọn trường!')
        setCurrentStep(1)
        return
      }
    }

    setValidationErrors({})

    const scheduleSlots: ScheduleSlot[] = scheduleSummaryList.map((sch) => {
      const dayState = scheduleDays[sch.dayId]
      return {
        dayOfWeek: sch.label,
        date: '---',
        startTime: sch.startTime,
        endTime: sch.endTime,
        teachers: dayState.teachers,
        room: dayState.room || undefined,
      }
    })

    const scheduleLabel = scheduleSlots
      .map((slot) => slot.dayOfWeek.replace('Thứ ', 'T'))
      .join('/')
    const scheduleTime =
      scheduleSlots.length > 0
        ? `${scheduleSlots[0].startTime}–${scheduleSlots[0].endTime}`
        : '---'

    const teacherObj = mockTeachers.find((t) => t.id === teacherId)
    const teacherName = teacherObj ? teacherObj.name : 'Chưa xếp lớp'
    const teacherPhone = teacherObj ? teacherObj.phone : '—'

    const assistantObj = mockTeachers.find((t) => t.id === assistantId)
    const assistantName = assistantObj ? assistantObj.name : 'Chưa gán'
    const assistantPhone = assistantObj ? assistantObj.phone : '—'

    const newClass: ClassRecord = {
      id: `cls-${Date.now()}`,
      code: classCode.trim() || `CLS-${(subject || 'TA').toUpperCase()}-${Date.now().toString().slice(-3)}`,
      name: className.trim(),
      level: subject || 'English',
      subLevel: subLevel.trim() || level || '—',
      learningPath: `${subject || 'English'} Pathway`,
      syllabus: curriculumFrame || '—',
      branch: branch,
      teacher: teacherName,
      teacherPhone: teacherPhone,
      room: room || scheduleSlots.find((slot) => slot.room)?.room || '---',
      schedule: scheduleLabel ? `${scheduleLabel} ${scheduleTime}` : 'Chưa xếp lịch',
      scheduleSlots,
      startDate: startDate || '---',
      endDate: endDate || '---',
      maxStudents: 20,
      enrolledStudents: students.length,
      status: statusParam,
      tuitionFee: 3000000,
      classType: classType as 'Chính thức' | 'Workshop',
      classRatio: classRatio,
      teacherType: teacherType,
      grade: (subject === 'Toán' || subject === 'math' || subject.toLowerCase().includes('toán')) ? grade : undefined,
      assistant: assistantName,
      assistantPhone: assistantPhone,
    }

    onSuccess(newClass)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1380px] w-full h-[88vh] flex flex-col p-0 overflow-hidden rounded-2xl border bg-background shadow-xl">
        <DialogTitle className="sr-only">Tạo lớp học mới</DialogTitle>

        {/* Header containing step tracker */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-bold transition-colors ${
                  currentStep === 1 ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                1. Thông tin lớp
              </span>
              <span className="h-px w-4 bg-border" />
              <span
                className={`text-sm font-bold transition-colors ${
                  currentStep === 2 ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                2. Thêm học viên
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable body content */}
        <div className={`flex-1 flex flex-col min-h-0 ${currentStep === 2 ? 'px-6 py-0 overflow-hidden' : 'px-6 py-4 overflow-y-auto custom-scrollbar'}`}>
          {/* STEP 1: CLASS FORM INFO */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {/* Left Column: Basic Details */}
              <div className="space-y-4">
                <ClassesCreateBasicInfo
                  classNameStr={className}
                  setClassName={setClassName}
                  classCode={classCode}
                  setClassCode={setClassCode}
                  subject={subject}
                  onSubjectChange={handleSubjectChange}
                  curriculumFrame={curriculumFrame}
                  onSyllabusChange={handleSyllabusChange}
                  classRatio={classRatio}
                  setClassRatio={setClassRatio}
                  teacherType={teacherType}
                  setTeacherType={setTeacherType}
                  branch={branch}
                  setBranch={setBranch}
                  setRoom={setRoom}
                  room={room}
                  teacherId={teacherId}
                  setTeacherId={setTeacherId}
                  level={level}
                  setLevel={setLevel}
                  subLevel={subLevel}
                  setSubLevel={setSubLevel}
                  grade={grade}
                  setGrade={setGrade}
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  validationErrors={validationErrors}
                  setValidationErrors={setValidationErrors}
                  branchOptions={branchOptions}
                />
              </div>

              {/* Right Column: Time schedule */}
              <div className="space-y-4 border-l pl-0 lg:pl-3 border-border">
                <ClassesCreateScheduleDays
                  duration={duration}
                  onDurationChange={handleDurationChange}
                  scheduleDays={scheduleDays}
                  onToggleDay={handleToggleDay}
                  onStartTimeChange={handleStartTimeChange}
                  onRoomChange={handleRoomChange}
                  onTeacherSelect={handleTeacherSelect}
                  onAddSecondarySlot={handleAddSecondarySlot}
                  onRemoveSecondarySlot={handleRemoveSecondarySlot}
                  onSecondaryDayOfWeekChange={handleSecondaryDayOfWeekChange}
                  onSecondaryStartTimeChange={handleSecondaryStartTimeChange}
                  onSecondaryRoomChange={handleSecondaryRoomChange}
                  onSecondaryTeacherSelect={handleSecondaryTeacherSelect}
                  branch={branch}
                  validationErrors={validationErrors}
                />
              </div>
            </div>
          )}

          {/* STEP 2: STUDENTS ROSTER */}
          {currentStep === 2 && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {validationErrors.students && (
                <div className="mx-6 mt-1 mb-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 text-center shrink-0">
                  ⚠️ {validationErrors.students}
                </div>
              )}
              <ClassesCreateRoster
                students={students}
                onAddStudent={handleAddStudent}
                onRemoveStudent={handleRemoveStudent}
                onRemoveAllStudents={() => setStudents([])}
                onAddMultipleStudents={handleAddMultipleStudents}
                subject={subject}
                level={level}
                classRatio={classRatio}
              />
            </div>
          )}
        </div>

        {/* Footer containing navigation controls */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1.5 inline-block" /> Quay lại
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>

            {currentStep === 1 ? (
              <>
                <Button variant="secondary" onClick={() => handleFormSubmit('nhap')}>
                  <Plus className="h-4 w-4 mr-1.5 inline-block" /> Tạo nháp
                </Button>
                <Button onClick={() => setCurrentStep(2)}>
                  Tiếp theo <ArrowRight className="h-4 w-4 ml-1.5 inline-block" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" onClick={() => handleFormSubmit('nhap')}>
                  <Plus className="h-4 w-4 mr-1.5 inline-block" /> Tạo lớp nháp
                </Button>
                <Button onClick={() => handleFormSubmit('cho_khai_giang')}>Khai giảng</Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
