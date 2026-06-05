'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel, Panel } from '@/components/shared'
import { BranchSelect, InlineSelect, SearchableCombobox, SubjectSelect } from '@/components/controls'
import { CLASS_LEVELS, mockClassRecords, type ClassRecord, type ScheduleSlot } from '@/mocks/classRecords'
import { mockTeachers } from '@/mocks/teacherRecords'
import { Plus, ArrowRight, ChevronLeft, Globe } from 'lucide-react'
import { TeacherDirectoryDialog } from './TeacherDirectoryDialog'
import { StudentSelectionDialog } from './StudentSelectionDialog'
import { ClassesCreateRoster } from './ClassesCreateRoster'

interface Student {
  id: string
  name: string
  code: string
  status?: string
}

interface ScheduleDayState {
  enabled: boolean
  startTime: string
  endTime: string
  teachers: string[]
  room: string
}

interface ClassesCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newClass: ClassRecord) => void
}

import {
  WEEKDAY_DAYS,
  DURATION_OPTIONS,
  TEACHER_TYPES,
  CLASS_RATIOS,
  CURRICULUM_FRAMES,
  ROOM_OPTIONS,
  initialScheduleDays,
  calculateEndTime,
  getMockRoomCount,
  getMockTeacherCount,
  getCurriculumDetails,
  getRoomsForBranch,
} from './classesCreateTypes'

const sortedTeachers = [...mockTeachers].sort((a, b) => a.name.localeCompare(b.name, 'vi'))

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
  const [branch, setBranch] = useState('')
  const [subLevel, setSubLevel] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [duration, setDuration] = useState(90)
  const [teacherId, setTeacherId] = useState('')
  const [assistantId, setAssistantId] = useState('')
  const [room, setRoom] = useState('')
  const [scheduleDays, setScheduleDays] = useState<Record<string, ScheduleDayState>>(initialScheduleDays)

  // Global Teacher Directory Modal state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false)
  const [activeDayIdForTeacherModal, setActiveDayIdForTeacherModal] = useState<string | null>(null)

  // Map teachers to SearchableCombobox option format
  const teacherComboboxOptions = useMemo(() => {
    return sortedTeachers.map((t) => ({
      id: t.id,
      label: t.name,
      subLabel: `${t.code} • ${t.phone}`,
      initials: t.name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
    }))
  }, [])

  // Step 2 Students Roster state
  const [students, setStudents] = useState<Student[]>([])
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)

  const handleSubjectChange = (val: string) => {
    setSubject(val)
    const abbrMap: Record<string, string> = {
      'IELTS': 'IELTS',
      'TOEIC': 'TOEIC',
      'Beginner': 'BEG',
      'English': 'ENG',
      'Japanese': 'JPN',
      'Movers': 'MOV',
      'Flyers': 'FLY',
      'KET Prep': 'KET',
      'PET Prep': 'PET'
    }
    const code = abbrMap[val] || val.toUpperCase().slice(0, 3)
    const existingCount = mockClassRecords.filter((c) => c.level === val).length
    const nextNum = String(existingCount + 1).padStart(3, '0')
    const newCode = `CLS-${code}-${nextNum}`

    // Only set if classCode is empty or if it was previously auto-generated (i.e. starts with CLS-)
    if (!classCode || classCode.startsWith('CLS-')) {
      setClassCode(newCode)
    }
  }

  const handleSyllabusChange = (val: string) => {
    setCurriculumFrame(val)
    const details = getCurriculumDetails(val)
    if (details) {
      setSubject(details.subject)
      setLevel(details.level)
      setSubLevel(details.subLevel)

      const abbrMap: Record<string, string> = {
        'IELTS': 'IELTS',
        'TOEIC': 'TOEIC',
        'Beginner': 'BEG',
        'English': 'ENG',
        'Japanese': 'JPN',
        'Movers': 'MOV',
        'Flyers': 'FLY',
        'KET Prep': 'KET',
        'PET Prep': 'PET'
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
  const handleFormSubmit = () => {
    if (!className.trim()) {
      alert('Vui lòng nhập tên lớp!')
      return
    }
    if (!branch) {
      alert('Vui lòng chọn trường!')
      return
    }

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

    const scheduleLabel = scheduleSlots.map((slot) => slot.dayOfWeek.replace('Thứ ', 'T')).join('/')
    const scheduleTime = scheduleSlots.length > 0
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
      status: 'nhap',
      tuitionFee: 3000000,
      classType: classType as 'Chính thức' | 'Workshop',
      classRatio: classRatio,
      teacherType: teacherType,
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
              <span className={`text-sm font-bold transition-colors ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                1. Thông tin lớp
              </span>
              <span className="h-px w-4 bg-border" />
              <span className={`text-sm font-bold transition-colors ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                2. Thêm học viên
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable body content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar flex flex-col">
          
          {/* STEP 1: CLASS FORM INFO */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              
              {/* Left Column: Basic Details */}
              <div className="space-y-4">
                <Panel title="Thông tin cơ bản" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Tên lớp" required>
                      <Input 
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="VD: IELTS Junior 1A" 
                      />
                    </FieldLabel>
                    <FieldLabel label="Mã lớp">
                      <Input 
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Hệ thống tự động sinh..." 
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Môn học">
                      <SubjectSelect
                        value={subject}
                        subjects={CLASS_LEVELS}
                        variant="inline"
                        includeAll={false}
                        placeholder="Chọn môn học"
                        onValueChange={handleSubjectChange}
                        disabled={!!curriculumFrame}
                        className="w-full justify-between"
                      />
                    </FieldLabel>
                    <FieldLabel label="Khung chương trình">
                      <InlineSelect
                        value={curriculumFrame}
                        options={CURRICULUM_FRAMES}
                        placeholder="Chọn khung chương trình"
                        onValueChange={handleSyllabusChange}
                        className="w-full justify-between"
                        variant="solid"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Sĩ số">
                      <InlineSelect
                        value={classRatio}
                        options={CLASS_RATIOS}
                        placeholder="Chọn tỷ lệ"
                        onValueChange={setClassRatio}
                        className="w-full justify-between"
                        variant="solid"
                      />
                    </FieldLabel>
                    <FieldLabel label="Loại giáo viên">
                      <InlineSelect
                        value={teacherType}
                        options={TEACHER_TYPES}
                        placeholder="Chọn loại giáo viên"
                        onValueChange={setTeacherType}
                        className="w-full justify-between"
                        variant="solid"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Giáo viên chủ nhiệm">
                      <SearchableCombobox
                        options={teacherComboboxOptions}
                        value={teacherId}
                        onChange={setTeacherId}
                        placeholder="Chọn giáo viên..."
                      />
                    </FieldLabel>
                    <FieldLabel label="Trợ giảng chỉ định">
                      <SearchableCombobox
                        options={teacherComboboxOptions}
                        value={assistantId}
                        onChange={setAssistantId}
                        placeholder="Chọn trợ giảng..."
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Trường" required>
                      <BranchSelect
                        value={branch}
                        branches={branchOptions}
                        variant="inline"
                        includeAll={false}
                        onValueChange={(val) => {
                          setBranch(val)
                          setRoom('')
                        }}
                        className="w-full justify-between"
                      />
                    </FieldLabel>
                    <FieldLabel label="Phòng học cố định">
                      <InlineSelect
                        value={room}
                        options={getRoomsForBranch(branch)}
                        placeholder={branch ? "Chọn phòng học..." : "Vui lòng chọn trường trước"}
                        onValueChange={setRoom}
                        disabled={!branch}
                        className="w-full justify-between"
                        variant="solid"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Trình độ chính">
                      <InlineSelect
                        value={level}
                        options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
                        placeholder="Chọn trình độ"
                        onValueChange={setLevel}
                        disabled={!!curriculumFrame}
                        className="w-full justify-between"
                        variant="solid"
                      />
                    </FieldLabel>
                    <FieldLabel label="Trình độ phụ">
                      <InlineSelect
                        value={subLevel}
                        options={CLASS_LEVELS.map((l) => ({ value: l, label: l }))}
                        placeholder="Chọn trình độ"
                        onValueChange={setSubLevel}
                        disabled={!!curriculumFrame}
                        className="w-full justify-between"
                        variant="solid"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Ngày bắt đầu">
                      <Input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </FieldLabel>
                    <FieldLabel label="Ngày kết thúc">
                      <Input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </FieldLabel>
                  </div>
                </Panel>
              </div>

              {/* Right Column: Time schedule */}
              <div className="space-y-4 border-l pl-0 lg:pl-6 border-border">
                <Tabs defaultValue="list" className="w-full">
                  <Panel 
                    title="Thời lượng & Lịch học" 
                    className="space-y-4"
                    actions={
                      <TabsList className="grid grid-cols-2 h-8 w-[160px] p-0.5">
                        <TabsTrigger value="list" className="text-xs h-7">List</TabsTrigger>
                        <TabsTrigger value="calendar" className="text-xs h-7">Calendar</TabsTrigger>
                      </TabsList>
                    }
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <FieldLabel label="Thời lượng">
                        <InlineSelect
                          value={String(duration)}
                          options={DURATION_OPTIONS}
                          placeholder="Thời lượng"
                          onValueChange={handleDurationChange}
                          className="w-full justify-between"
                          variant="solid"
                        />
                      </FieldLabel>
                    </div>

                    <TabsContent value="list" className="space-y-3 pt-2 mt-2">
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        Các ngày học trong tuần
                      </span>
                      <div className="space-y-3">
                        {WEEKDAY_DAYS.map((day) => {
                          const state = scheduleDays[day.id]
                          return (
                            <div key={day.id} className={`border rounded-xl p-3 space-y-3 transition-all duration-200 ${state.enabled ? 'bg-muted/30 border-muted-foreground/20 shadow-sm' : 'bg-background hover:bg-muted/5 border-border'}`}>
                              <div className="flex items-center justify-between">
                                <label className="flex cursor-pointer items-center gap-2.5 shrink-0 select-none">
                                  <Checkbox 
                                    checked={state.enabled}
                                    onCheckedChange={() => handleToggleDay(day.id)}
                                  />
                                  <span className="text-[13px] font-bold text-foreground">
                                    {day.label}
                                  </span>
                                </label>

                                {state.enabled && (
                                  <div className="flex items-center gap-2">
                                    <Input 
                                      type="time"
                                      value={state.startTime}
                                      onChange={(e) => handleStartTimeChange(day.id, e.target.value)}
                                      className="h-8 w-24 rounded border px-2 text-[12px] bg-background"
                                    />
                                    <span className="text-[11px] text-muted-foreground">đến</span>
                                    <Input 
                                      type="time"
                                      value={state.endTime}
                                      readOnly
                                      className="h-8 w-24 rounded border bg-muted/40 px-2 text-[12px] opacity-70 cursor-not-allowed"
                                    />
                                  </div>
                                )}
                              </div>

                              {state.enabled && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-dashed">
                                  {/* Room Selection */}
                                  <FieldLabel 
                                    label={
                                      <div className="flex items-center justify-between w-full">
                                        <span>Phòng học</span>
                                        {state.startTime && (
                                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                            {getMockRoomCount(day.id, state.startTime)} trống
                                          </span>
                                        )}
                                      </div>
                                    }
                                    className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                                  >
                                    <InlineSelect
                                      value={state.room}
                                      options={ROOM_OPTIONS}
                                      placeholder="Chọn phòng học..."
                                      onValueChange={(val) => handleRoomChange(day.id, val)}
                                      className="w-full justify-between h-8 text-[12px] bg-background"
                                      variant="solid"
                                    />
                                  </FieldLabel>

                                  {/* Single teacher selection */}
                                  <FieldLabel 
                                    label={
                                      <div className="flex items-center justify-between w-full">
                                        <span>Giáo viên giảng dạy</span>
                                        {state.startTime && (
                                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold normal-case">
                                            {getMockTeacherCount(day.id, state.startTime)} khả dụng
                                          </span>
                                        )}
                                      </div>
                                    }
                                    className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider w-full"
                                  >
                                    <div className="flex items-center gap-1.5 w-full">
                                      <div className="flex-1 min-w-0">
                                        <SearchableCombobox
                                          options={teacherComboboxOptions}
                                          value={state.teachers[0] || ''}
                                          onChange={(val) => {
                                            setScheduleDays((prev) => ({
                                              ...prev,
                                              [day.id]: {
                                                ...prev[day.id],
                                                teachers: val ? [val as string] : [],
                                              },
                                            }))
                                          }}
                                          placeholder="Chọn giáo viên giảng dạy..."
                                        />
                                      </div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8 shrink-0"
                                        onClick={() => {
                                          setActiveDayIdForTeacherModal(day.id)
                                          setIsTeacherModalOpen(true)
                                        }}
                                        title="Lọc giáo viên toàn hệ thống"
                                      >
                                        <Globe className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </FieldLabel>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </TabsContent>

                    <TabsContent value="calendar" className="mt-4">
                      <div className="border border-dashed rounded-xl p-8 text-center text-muted-foreground bg-muted/5">
                        Giao diện Calendar (Chưa cấu hình)
                      </div>
                    </TabsContent>
                  </Panel>
                </Tabs>
              </div>

            </div>
          )}

          {/* STEP 2: STUDENTS ROSTER */}
          {currentStep === 2 && (
            <ClassesCreateRoster
              students={students}
              onAddStudent={() => setIsStudentModalOpen(true)}
              onRemoveStudent={handleRemoveStudent}
            />
          )}

        </div>

        {/* Footer containing navigation controls */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          {currentStep > 1 ? (
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1.5 inline-block" /> Quay lại
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>

            {currentStep === 1 ? (
              <>
                <Button 
                  variant="secondary" 
                  onClick={handleFormSubmit}
                >
                  <Plus className="h-4 w-4 mr-1.5 inline-block" /> Tạo nháp
                </Button>
                <Button 
                  onClick={() => setCurrentStep(2)}
                >
                  Tiếp theo <ArrowRight className="h-4 w-4 ml-1.5 inline-block" />
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleFormSubmit}
              >
                <Plus className="h-4 w-4 mr-1.5 inline-block" /> Tạo lớp
              </Button>
            )}
          </div>
        </div>



      </DialogContent>

      {/* Global Teacher Directory Dialog */}
      <TeacherDirectoryDialog
        open={isTeacherModalOpen}
        onOpenChange={setIsTeacherModalOpen}
        startTime={activeDayIdForTeacherModal ? scheduleDays[activeDayIdForTeacherModal]?.startTime : undefined}
        endTime={activeDayIdForTeacherModal ? scheduleDays[activeDayIdForTeacherModal]?.endTime : undefined}
        dayOfWeek={activeDayIdForTeacherModal || undefined}
        onSelectTeacher={(teacherId) => {
          if (activeDayIdForTeacherModal) {
            setScheduleDays((prev) => ({
              ...prev,
              [activeDayIdForTeacherModal]: {
                ...prev[activeDayIdForTeacherModal],
                teachers: [teacherId],
              },
            }))
            setIsTeacherModalOpen(false)
          }
        }}
      />

      {/* Global Student Selection Dialog */}
      <StudentSelectionDialog
        open={isStudentModalOpen}
        onOpenChange={setIsStudentModalOpen}
        initialSelectedIds={students.map((s) => s.id)}
        onConfirm={(selectedList) => {
          setStudents(selectedList)
          setIsStudentModalOpen(false)
        }}
        subject={subject}
      />
    </Dialog>
  )
}
