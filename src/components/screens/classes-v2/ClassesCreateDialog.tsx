'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel, Panel, EmptyState } from '@/components/shared'
import { BranchSelect, InlineSelect, SearchableCombobox } from '@/components/controls'
import { mockClassRecords, type ClassRecord, type ScheduleSlot } from '@/mocks/classRecords'
import { mockTeachers } from '@/mocks/teacherRecords'
import { mockStudents } from '@/mocks/students'
import { Plus, ArrowRight, ChevronLeft, UserPlus, Trash2, Globe } from 'lucide-react'
import { TeacherDirectoryDialog } from '../classes/TeacherDirectoryDialog'
import { StudentSelectionDialog } from '../classes/StudentSelectionDialog'

interface StudentItem {
  id: string
  name: string
  code: string
  status: string
}

interface ScheduleDayState {
  enabled: boolean
  startTime: string
  endTime: string
  room: string
  teacher: string
}

interface ClassesCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newClass: ClassRecord) => void
  editClassId?: string
}

const WEEKDAY_DAYS = [
  { id: 'monday', label: 'Thứ 2' },
  { id: 'tuesday', label: 'Thứ 3' },
  { id: 'wednesday', label: 'Thứ 4' },
  { id: 'thursday', label: 'Thứ 5' },
  { id: 'friday', label: 'Thứ 6' },
  { id: 'saturday', label: 'Thứ 7' },
  { id: 'sunday', label: 'Chủ nhật' },
]

const DURATION_OPTIONS = [
  { value: '60', label: '60 phút' },
  { value: '90', label: '90 phút' },
  { value: '100', label: '100 phút' },
  { value: '120', label: '120 phút' },
  { value: '150', label: '150 phút' },
  { value: '180', label: '180 phút' },
]

const CLASS_TYPES = [
  { value: 'Chính thức', label: 'Lớp Chính thức' },
  { value: 'Workshop', label: 'Lớp Workshop' },
]

const CLASS_RATIOS = [
  { value: '1:1', label: '1:1' },
  { value: '1:6', label: '1:6' },
  { value: '1:10', label: '1:10' },
  { value: '1:15', label: '1:15' },
  { value: '1:20', label: '1:20' },
]

const CURRICULUM_FRAMES = [
  { value: 'STATION_OMO_OFFLINE_STARTERS A', label: 'STATION_OMO_OFFLINE_STARTERS A' },
  { value: 'STATION_OMO_OFFLINE_KINDIE A', label: 'STATION_OMO_OFFLINE_KINDIE A' },
  { value: 'Station_Toán tư duy (Col 4 tuổi)', label: 'Station_Toán tư duy (Col 4 tuổi)' },
  { value: 'Toán tư duy (Eins 8 tuổi)', label: 'Toán tư duy (Eins 8 tuổi)' },
  { value: 'WS_MUSIC_BASIC_2026', label: 'WS_MUSIC_BASIC_2026' },
]

const CURRICULUM_FRAME_DETAILS: Record<string, { subject: string; level: string }> = {
  'STATION_OMO_OFFLINE_STARTERS A': { subject: 'Beginner', level: 'Beginner' },
  'STATION_OMO_OFFLINE_KINDIE A': { subject: 'Beginner', level: 'Beginner' },
  'Station_Toán tư duy (Col 4 tuổi)': { subject: 'English', level: 'Beginner' },
  'Toán tư duy (Eins 8 tuổi)': { subject: 'English', level: 'Beginner' },
  'WS_MUSIC_BASIC_2026': { subject: 'Flyers', level: 'Flyers' },
}

const initialScheduleDays: Record<string, ScheduleDayState> = {
  monday: { enabled: false, startTime: '17:30', endTime: '', room: '', teacher: '' },
  tuesday: { enabled: false, startTime: '17:30', endTime: '', room: '', teacher: '' },
  wednesday: { enabled: false, startTime: '17:30', endTime: '', room: '', teacher: '' },
  thursday: { enabled: false, startTime: '17:30', endTime: '', room: '', teacher: '' },
  friday: { enabled: false, startTime: '17:30', endTime: '', room: '', teacher: '' },
  saturday: { enabled: false, startTime: '17:30', endTime: '', room: '', teacher: '' },
  sunday: { enabled: false, startTime: '17:30', endTime: '', room: '', teacher: '' },
}

const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime || !durationMinutes) return ''
  const [h, m] = startTime.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return ''
  const startMinutes = h * 60 + m
  const endMinutes = startMinutes + durationMinutes
  const endH = Math.floor(endMinutes / 60) % 24
  const endM = endMinutes % 60
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`
}

const getMockRoomCount = (dayId: string, startTime: string): number => {
  if (!startTime) return 0
  const hour = parseInt(startTime.split(':')[0]) || 17
  const dayLength = dayId.length
  const hash = (dayLength + hour) % 4
  return [14, 8, 12, 10][hash]
}

const getMockTeacherCount = (dayId: string, startTime: string): number => {
  if (!startTime) return 0
  const hour = parseInt(startTime.split(':')[0]) || 17
  const dayLength = dayId.length
  const hash = (dayLength + hour) % 4
  return [9, 6, 8, 5][hash]
}

const getMockRemainingSessions = (id: string): string => {
  const sessions = [12, 24, 36, 8, 16, 42, 4]
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % sessions.length
  return `${sessions[idx]} buổi`
}

const getMockSaleNote = (id: string, notes?: string): string => {
  if (notes) return notes
  const mockNotes = [
    'Học viên có nhu cầu học thử trước khi đóng phí.',
    'Sale note: Phụ huynh muốn xếp lớp học ca tối Thứ 2/Thứ 6.',
    'Chờ xếp lớp sau khi hoàn thành đóng phí đợt 2.',
    'Yêu cầu giáo viên bản ngữ dạy kèm IELTS Writing.',
    'Mong muốn học lớp sỹ số nhỏ để kèm cặp kỹ hơn.',
    'Học viên học lực khá, cần test đầu vào cẩn thận.',
  ]
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockNotes.length
  return mockNotes[idx]
}

const getMockPackage = (id: string, level?: string): string => {
  const packages = ['Tiêu chuẩn', 'Cao cấp Pro', 'Cấp tốc 1-1', 'Cam kết đầu ra']
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % packages.length
  const prefix = level || 'IELTS'
  return `${prefix} ${packages[idx]}`
}

export function ClassesCreateDialog({ open, onOpenChange, onSuccess, editClassId }: ClassesCreateDialogProps) {
  const branchOptions = [...new Set(mockClassRecords.map((c) => c.branch))].sort()
  const isEditMode = !!editClassId

  // Find class to edit
  const editClass = useMemo(() => {
    if (!editClassId) return null
    return mockClassRecords.find((c) => c.id === editClassId) || null
  }, [editClassId])

  // States
  const [currentStep, setCurrentStep] = useState(1)
  const [className, setClassName] = useState('')
  const [classCode, setClassCode] = useState('')
  const [subject, setSubject] = useState('')
  const [curriculumFrame, setCurriculumFrame] = useState('')
  const [classType, setClassType] = useState('Chính thức')
  const [classRatio, setClassRatio] = useState('1:10')
  const [level, setLevel] = useState('')
  const [branch, setBranch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [duration, setDuration] = useState(90)
  const [scheduleDays, setScheduleDays] = useState<Record<string, ScheduleDayState>>(initialScheduleDays)

  // Global Teacher Directory Modal state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false)
  const [activeDayIdForTeacherModal, setActiveDayIdForTeacherModal] = useState<string | null>(null)
  
  // Roster state
  const [students, setStudents] = useState<StudentItem[]>([])

  // Student selection dialog states
  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false)

  // Check if core fields should be disabled
  const disableCoreFields = isEditMode && (editClass ? editClass.enrolledStudents > 0 : false)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (editClass && open) {
      setClassName(editClass.name)
      setClassCode(editClass.code)
      setSubject(editClass.level)
      setCurriculumFrame(editClass.syllabus || '')
      setClassType(editClass.classType || 'Chính thức')
      setClassRatio(editClass.maxStudents ? `1:${editClass.maxStudents}` : '1:10')
      setBranch(editClass.branch)
      setStartDate(editClass.startDate)
      setEndDate(editClass.endDate || '')
      
      const nextSchedule = { ...initialScheduleDays }
      if (editClass.scheduleSlots) {
        editClass.scheduleSlots.forEach((slot) => {
          const dayId = WEEKDAY_DAYS.find((d) => d.label === slot.dayOfWeek)?.id
          if (dayId) {
            nextSchedule[dayId] = {
              enabled: true,
              startTime: slot.startTime,
              endTime: slot.endTime,
              room: slot.room || '',
              teacher: slot.teachers?.[0] || '',
            }
          }
        })
      }
      setScheduleDays(nextSchedule)

      // Set mock students
      const mockClassStudents = mockStudents.slice(0, editClass.enrolledStudents).map((s) => ({
        id: s.id,
        name: s.name,
        code: `HV-${s.id.toUpperCase()}`,
        status: s.status,
      }))
      setStudents(mockClassStudents)
      setCurrentStep(1)
    } else if (open) {
      // Reset creation state
      setClassName('')
      setClassCode('')
      setSubject('')
      setCurriculumFrame('')
      setClassType('Chính thức')
      setClassRatio('1:10')
      setLevel('')
      setBranch('')
      setStartDate('')
      setEndDate('')
      setDuration(90)
      setScheduleDays(initialScheduleDays)
      setStudents([])
      setCurrentStep(1)
    }
  }, [editClass, open])
  /* eslint-enable react-hooks/set-state-in-effect */

  // Filter room options based on branch selection
  const filteredRoomOptions = useMemo(() => {
    if (!branch) return []
    const branchRooms: Record<string, string[]> = {
      'RinoEdu Linh Đàm': ['Phòng A101', 'Phòng A102', 'Phòng A103', 'Phòng Lab A', 'Phòng Lab B', 'Phòng Hội thảo'],
      'RinoEdu Nguyễn Tuân': ['Phòng B201', 'Phòng B202', 'Phòng C301', 'Phòng C302', 'Phòng Lab A', 'Phòng Hội thảo'],
      'RinoEdu Smart City': ['Phòng D401', 'Phòng D402', 'Phòng Hội thảo'],
    }
    const rooms = branchRooms[branch] || ['Phòng 101', 'Phòng 102', 'Phòng 201', 'Phòng 202']
    return rooms.map((r) => ({ value: r, label: r }))
  }, [branch])

  // Syllabus selection rules
  const handleCurriculumFrameChange = (val: string) => {
    setCurriculumFrame(val)
    const details = CURRICULUM_FRAME_DETAILS[val]
    if (details) {
      setSubject(details.subject)
      setLevel(details.level)

      // Auto generate code if not manually set
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

  // Handle room or teacher changes per day
  const handleDayValueChange = (dayId: string, field: 'room' | 'teacher', value: string) => {
    setScheduleDays((prev) => ({
      ...prev,
      [dayId]: {
        ...prev[dayId],
        [field]: value,
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
        teachers: dayState.teacher ? [dayState.teacher] : [],
        room: dayState.room || undefined,
      }
    })

    const scheduleLabel = scheduleSlots.map((slot) => slot.dayOfWeek.replace('Thứ ', 'T')).join('/')
    const scheduleTime = scheduleSlots.length > 0
      ? `${scheduleSlots[0].startTime}–${scheduleSlots[0].endTime}`
      : '---'

    const maxStudentsLimit = Number(classRatio.replace('1:', '')) || 20

    const savedClass: ClassRecord = {
      id: editClassId || `cls-${Date.now()}`,
      code: classCode.trim() || `CLS-${(subject || 'TA').toUpperCase()}-${Date.now().toString().slice(-3)}`,
      name: className.trim(),
      level: subject || 'English',
      subLevel: editClass?.subLevel || '—',
      learningPath: `${subject || 'English'} Pathway`,
      syllabus: curriculumFrame || '—',
      branch: branch,
      teacher: scheduleSlots[0]?.teachers?.[0] || editClass?.teacher || 'Chưa xếp lớp',
      teacherPhone: editClass?.teacherPhone || '—',
      room: scheduleSlots.find((slot) => slot.room)?.room || '---',
      schedule: scheduleLabel ? `${scheduleLabel} ${scheduleTime}` : 'Chưa xếp lịch',
      scheduleSlots,
      startDate: startDate || '---',
      endDate: endDate || '---',
      maxStudents: maxStudentsLimit,
      enrolledStudents: students.length,
      status: editClass?.status || 'nhap',
      tuitionFee: editClass?.tuitionFee || 3000000,
      classType: classType as 'Chính thức' | 'Workshop',
    }

    onSuccess(savedClass)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1380px] w-full h-[88vh] flex flex-col p-0 overflow-hidden rounded-2xl border bg-background shadow-xl">
        <DialogTitle className="sr-only">{isEditMode ? 'Chỉnh sửa lớp học' : 'Tạo lớp học mới'}</DialogTitle>
        
        {/* Header containing step tracker */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-foreground mr-4">
              {isEditMode ? `Cập nhật lớp: ${editClass?.code}` : 'Tạo lớp học mới'}
            </span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold transition-colors ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                1. Thông tin lớp & Lịch học
              </span>
              <span className="h-px w-4 bg-border" />
              <span className={`text-sm font-bold transition-colors ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                2. Học viên
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
                        disabled={isEditMode}
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Khung chương trình">
                      <InlineSelect
                        value={curriculumFrame}
                        options={CURRICULUM_FRAMES}
                        placeholder="Chọn khung chương trình"
                        onValueChange={handleCurriculumFrameChange}
                        className="w-full justify-between"
                        disabled={disableCoreFields}
                      />
                    </FieldLabel>
                    <FieldLabel label="Môn học">
                      <Input 
                        value={subject}
                        readOnly
                        placeholder="Tự động theo khung..."
                        className="bg-muted text-muted-foreground cursor-not-allowed"
                      />
                    </FieldLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FieldLabel label="Loại lớp">
                      <InlineSelect
                        value={classType}
                        options={CLASS_TYPES}
                        placeholder="Chọn loại lớp"
                        onValueChange={setClassType}
                        className="w-full justify-between"
                      />
                    </FieldLabel>
                    <FieldLabel label="Sĩ số tối đa">
                      <InlineSelect
                        value={classRatio}
                        options={CLASS_RATIOS}
                        placeholder="Chọn tỷ lệ"
                        onValueChange={setClassRatio}
                        className="w-full justify-between"
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
                        onValueChange={setBranch}
                        className="w-full justify-between"
                        disabled={disableCoreFields}
                      />
                    </FieldLabel>
                    <FieldLabel label="Trình độ">
                      <Input 
                        value={level}
                        readOnly
                        placeholder="Tự động theo khung..."
                        className="bg-muted text-muted-foreground cursor-not-allowed"
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
                                      options={filteredRoomOptions}
                                      placeholder="Chọn phòng học..."
                                      onValueChange={(val) => handleDayValueChange(day.id, 'room', val)}
                                      className="w-full justify-between h-8 text-[12px] bg-background"
                                      variant="solid"
                                    />
                                  </FieldLabel>

                                  {/* Teacher selection (SearchableCombobox format) */}
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
                                          options={mockTeachers.map((t) => ({
                                            id: t.name,
                                            label: t.name,
                                            subLabel: `${t.code} • ${t.branch}`,
                                            initials: t.name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase(),
                                          }))}
                                          value={state.teacher}
                                          onChange={(val) => handleDayValueChange(day.id, 'teacher', val as string)}
                                          placeholder="Chọn giáo viên..."
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
            <div className="flex flex-col gap-4 flex-1 min-h-0">
              
              {/* Trigger Modal Button */}
              <div className="flex justify-between items-center py-1.5 bg-transparent border-0 select-none">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Danh sách học viên lớp học</h4>
                  <p className="text-xs text-muted-foreground">Đã thêm {students.length} học viên vào lớp.</p>
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={() => setIsStudentSelectOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-1.5" /> Chọn học viên từ danh bạ
                </Button>
              </div>

              {/* Students table roster or empty state */}
              {students.length > 0 ? (
                <div className="flex-1 overflow-auto rounded-lg border">
                  <table className="min-w-full divide-y divide-border table-fixed">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[30%]">Học viên</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[15%]">Trình độ</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[25%]">Gói đăng ký</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[15%]">Số buổi còn lại</th>
                        <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[15%]">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {students.map((student) => {
                        const studentDetails = mockStudents.find((s) => s.id === student.id)
                        const currentLevel = studentDetails?.level || '—'
                        const currentPackage = getMockPackage(student.id, currentLevel)
                        const initials = student.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(-2)
                          .join('')
                          .toUpperCase()
                        return (
                          <tr key={student.id} className="group hover:bg-muted/10 transition-colors">
                            <td className="px-4 py-2 text-sm font-medium">
                              <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                                    {initials}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-foreground truncate">{student.name}</div>
                                    <div className="text-[11px] text-muted-foreground font-mono truncate">
                                      {student.code}
                                    </div>
                                  </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2 shrink-0 flex items-center gap-1.5">
                                  <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="icon-sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                                    onClick={() => handleRemoveStudent(student.id)}
                                    title="Xóa học viên"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-2 text-xs font-semibold text-foreground">
                              <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                {currentLevel}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-xs text-muted-foreground truncate" title={currentPackage}>
                              {currentPackage}
                            </td>
                            <td className="px-4 py-2 text-sm font-semibold text-foreground">
                              {getMockRemainingSessions(student.id)}
                            </td>
                            <td className="px-4 py-2 text-xs text-muted-foreground font-medium italic truncate" title={getMockSaleNote(student.id)}>
                              {getMockSaleNote(student.id)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 border border-dashed rounded-lg flex items-center justify-center p-8 bg-muted/10">
                  <EmptyState 
                    title="Chưa có học viên nào" 
                    description="Nhấp chọn học viên từ danh bạ để đưa học viên vào danh sách roster."
                    icon={<UserPlus className="h-7 w-7 text-muted-foreground" />}
                  />
                </div>
              )}

            </div>
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
                  <Plus className="h-4 w-4 mr-1.5 inline-block" /> Lưu nháp
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
                <Plus className="h-4 w-4 mr-1.5 inline-block" /> {isEditMode ? 'Cập nhật' : 'Tạo lớp'}
              </Button>
            )}
          </div>
        </div>

        {/* Sub-Dialog: Student Selector Modal */}
        <StudentSelectionDialog
          open={isStudentSelectOpen}
          onOpenChange={setIsStudentSelectOpen}
          initialSelectedIds={students.map((s) => s.id)}
          onConfirm={(selectedList) => {
            setStudents(selectedList)
            setIsStudentSelectOpen(false)
          }}
          subject={subject}
        />

        {/* Global Teacher Directory Dialog */}
        <TeacherDirectoryDialog
          open={isTeacherModalOpen}
          onOpenChange={setIsTeacherModalOpen}
          startTime={activeDayIdForTeacherModal ? scheduleDays[activeDayIdForTeacherModal]?.startTime : undefined}
          endTime={activeDayIdForTeacherModal ? scheduleDays[activeDayIdForTeacherModal]?.endTime : undefined}
          dayOfWeek={activeDayIdForTeacherModal || undefined}
          onSelectTeacher={(teacherId, teacherName) => {
            if (activeDayIdForTeacherModal) {
              setScheduleDays((prev) => ({
                ...prev,
                [activeDayIdForTeacherModal]: {
                  ...prev[activeDayIdForTeacherModal],
                  teacher: teacherName,
                },
              }))
              setIsTeacherModalOpen(false)
            }
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
