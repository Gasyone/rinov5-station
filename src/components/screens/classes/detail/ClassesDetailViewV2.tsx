'use client'

import { useState } from 'react'
import { DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ClassRecord } from '@/mocks/classRecords'
import { cn } from '@/lib/utils'
import { BookOpen, Calendar, Clock, FolderOpen, GraduationCap, LayoutGrid, Map, Sparkles, Users } from 'lucide-react'
import { EmptyState } from '@/components/shared'

// Import Sub-components
import { ClassesDetailOverview } from './ClassesDetailOverview'
import { ClassesDetailRoster } from './ClassesDetailRoster'
import { ClassesDetailSessionsV2 } from './ClassesDetailSessionsV2'
import { ClassesDetailSchedule } from './ClassesDetailSchedule'
import { ClassesAddScheduleDialog } from './ClassesAddScheduleDialog'
import { ClassesRoadmapWizardView } from './ClassesRoadmapWizardView'
import { ClassesSessionMediaTab } from './ClassesSessionMediaTab'
import { ClassesDetailHeaderV2 } from './ClassesDetailHeaderV2'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'

import { toast } from 'sonner'
import { ClassesDetailDialogs } from './ClassesDetailDialogs'
import { ClassesDetailInteractionPanelV2 } from './ClassesDetailInteractionPanelV2'
import { ClassesStudentCareOverlayPanel } from './ClassesStudentCareOverlayPanel'
import { ClassesStudentMonthlyReportOverlayPanel } from './ClassesStudentMonthlyReportOverlayPanel'
import type { SelectedStudentItem } from '../RosterSessionSelectionDialog'
import { mockStudents } from '@/mocks/students'
import {
  generateMockRoster,
  generateRoadmapSessions,
  determineRosterStudentStatus,
  getFirstTabWithError,
  validateClassForm,
  getSessionUpdateLogMessage,
  formatNoteTimestamp,
} from './classesDetailHelpers'
import type { ClassNote, ClassAuditLog, RoadmapSession, RosterStudent } from './classesDetailTypes'

interface ClassesDetailViewV2Props {
  cls: ClassRecord | null
  initialEditMode?: boolean
  initialTab?: string
  initialRoadmapWizard?: boolean
  initialStudentSelect?: boolean
  onEdit?: (id: string) => void
  onSave?: (updatedClass: ClassRecord) => void
  onStatusChange?: (id: string, newStatus: ClassRecord['status']) => void
  onClose?: () => void
  hideClassType?: boolean
}

export function ClassesDetailViewV2({
  cls,
  initialEditMode = false,
  initialTab = 'roster',
  onSave,
  onStatusChange,
  hideClassType = true,
}: ClassesDetailViewV2Props) {
  const [activeTab, setActiveTab] = useState(initialTab || 'roster')

  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false)
  const [tempSelectedStudents, setTempSelectedStudents] = useState<SelectedStudentItem[] | null>(null)
  const [isSessionSelectOpen, setIsSessionSelectOpen] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [activeCareStudent, setActiveCareStudent] = useState<RosterStudent | null>(null)
  const [activeMonthlyReportStudent, setActiveMonthlyReportStudent] = useState<RosterStudent | null>(null)
  const [isRoadmapWizardOpen, setIsRoadmapWizardOpen] = useState(false)
  const [syllabusState, setSyllabusState] = useState<string>('')
  const [roadmapLastChangedInfo, setRoadmapLastChangedInfo] = useState<string | null>(
    'Lộ trình được thay đổi vào 2026-05-28 10:15:30 bởi Mai Mây'
  )

  const [prevClsId, setPrevClsId] = useState<string | null>(null)
  const [sessionsState, setSessionsState] = useState<RoadmapSession[]>([])
  const [rosterState, setRosterState] = useState<RosterStudent[]>([])

  const [isEditing, setIsEditing] = useState(false)
  const [editFormState, setEditFormState] = useState<ClassRecord | null>(null)
  const [confirmStatusChange, setConfirmStatusChange] = useState<ClassesStatusChangeRequest | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const hasOverviewError = !!(
    validationErrors.name ||
    validationErrors.branch ||
    validationErrors.level ||
    validationErrors.startDate ||
    validationErrors.syllabus
  )
  const hasRosterError = !!validationErrors.roster
  const hasScheduleError = !!(
    validationErrors.schedule ||
    Object.keys(validationErrors).some((k) => k.startsWith('room_') || k.startsWith('teacher_'))
  )

  const handleEditFormStateChange = (nextState: ClassRecord | null) => {
    setEditFormState(nextState)
    if (!nextState) return
    setValidationErrors((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev
      const copy = { ...prev }
      let changed = false
      if (copy.name && nextState.name && nextState.name.trim() !== '') {
        delete copy.name
        changed = true
      }
      if (copy.syllabus && nextState.syllabus && nextState.syllabus.trim() !== '') {
        delete copy.syllabus
        changed = true
      }
      if (copy.branch && nextState.branch && nextState.branch.trim() !== '') {
        delete copy.branch
        changed = true
      }
      if (copy.level && nextState.level && nextState.level.trim() !== '') {
        delete copy.level
        changed = true
      }
      if (copy.startDate && nextState.startDate && nextState.startDate.trim() !== '') {
        delete copy.startDate
        changed = true
      }
      if (copy.room && nextState.room && nextState.room.trim() !== '') {
        delete copy.room
        changed = true
      }
      if (copy.teacher && nextState.teacher && nextState.teacher.trim() !== '') {
        delete copy.teacher
        changed = true
      }
      return changed ? copy : prev
    })
  }

  if (cls && cls.id !== prevClsId) {
    setPrevClsId(cls.id)
    setSessionsState(generateRoadmapSessions(cls))
    setRosterState(generateMockRoster(cls))
    setSyllabusState(cls.syllabus || '')
    setEditFormState(cls)
    const nextEditing = !!initialEditMode
    setIsEditing(nextEditing)
    if (nextEditing) {
      setActiveTab('sessions')
    } else {
      setActiveTab(initialTab === 'overview' ? 'sessions' : initialTab)
    }
  }

  const [notes, setNotes] = useState<ClassNote[]>([
    {
      id: 'n1',
      text: 'Lớp học vận hành ổn định. Học viên Nguyễn Văn A phản ánh phòng học hơi lạnh ở buổi 2.',
      author: 'Giáo vụ Lan',
      timestamp: '02/06/2026',
    },
    {
      id: 'n2',
      text: 'Đã nhắc nhở giáo viên chủ nhiệm nộp đề cương buổi 5 đúng hạn.',
      author: 'Giáo vụ Lan',
      timestamp: '01/06/2026',
    },
  ])

  const [logs, setLogs] = useState<ClassAuditLog[]>([
    {
      id: 'l1',
      action: 'Thêm mới học viên Phạm Văn B vào danh sách lớp.',
      operator: 'Giáo vụ Lan',
      timestamp: '14:20 02/06/2026',
    },
    {
      id: 'l2',
      action: 'Kích hoạt lớp học sang trạng thái Chờ khai giảng.',
      operator: 'Giáo vụ Lan',
      timestamp: '10:00 02/06/2026',
    },
    {
      id: 'l3',
      action: 'Cấu hình lịch học cố định hàng tuần.',
      operator: 'Giáo vụ Lan',
      timestamp: '16:15 01/06/2026',
    },
    {
      id: 'l4',
      action: 'Khởi tạo vỏ lớp học nháp thành công.',
      operator: 'Giáo vụ Lan',
      timestamp: '16:00 01/06/2026',
    },
  ])

  const handleAddNote = (newNoteText: string) => {
    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`

    setNotes((prev) => [
      {
        id: Math.random().toString(),
        text: newNoteText,
        author: 'Giáo vụ Lan',
        timestamp: timestampStr,
      },
      ...prev,
    ])

    setLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `Đã thêm ghi chú tương tác: "${newNoteText.substring(0, 30)}${
          newNoteText.length > 30 ? '...' : ''
        }"`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr,
      },
      ...prev,
    ])
  }

  const handleSave = () => {
    if (!editFormState) return

    if (editFormState.status === 'cho_khai_giang' || editFormState.status === 'dang_hoc') {
      const errors = validateClassForm(editFormState, rosterState.length)
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        setActiveTab(getFirstTabWithError(errors))
        toast.error('Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ.')
        return
      }
    } else {
      const errors: Record<string, string> = {}
      if (!editFormState.name || !editFormState.name.trim()) {
        errors.name = 'Tên lớp không được để trống'
      }
      if (!editFormState.branch || !editFormState.branch.trim() || editFormState.branch === 'all') {
        errors.branch = 'Chưa chọn chi nhánh/trường'
      }
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        setActiveTab('overview')
        toast.error('Vui lòng nhập đầy đủ thông tin đỏ!')
        return
      }
    }

    setValidationErrors({})
    if (onSave) {
      onSave(editFormState)
    }
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        action: 'Đã chỉnh sửa thông tin cơ bản của lớp học.',
        operator: 'Giáo vụ Lan',
        timestamp: timeStr,
      },
      ...prev,
    ])
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus: ClassRecord['status'], actionText: string) => {
    if (cls) {
      if (newStatus === 'cho_khai_giang') {
        const errors = validateClassForm(cls, rosterState.length)
        if (Object.keys(errors).length > 0) {
          setValidationErrors(errors)
          setActiveTab(getFirstTabWithError(errors))
          toast.error('Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ.')
          return
        }
      }

      setValidationErrors({})
      if (onStatusChange) {
        onStatusChange(cls.id, newStatus)
      }
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getFullYear()}`
      setLogs((prev) => [
        {
          id: Math.random().toString(),
          action: actionText,
          operator: 'Giáo vụ Lan',
          timestamp: timeStr,
        },
        ...prev,
      ])
      toast.success('Đã cập nhật trạng thái lớp học!')
    }
  }

  const handleUpdateSession = (sessionId: string, updates: Partial<RoadmapSession>) => {
    setSessionsState((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s

        const now = new Date()
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
          .toString()
          .padStart(2, '0')}/${now.getFullYear()}`

        const logMsg = getSessionUpdateLogMessage(s, updates)

        setLogs((l) => [
          { id: Math.random().toString(), action: logMsg, operator: 'Giáo vụ Lan', timestamp: timeStr },
          ...l,
        ])

        return { ...s, ...updates }
      })
    )
  }

  const handleStatusChangeConfirm = () => {
    if (confirmStatusChange) {
      handleStatusChange(confirmStatusChange.newStatus, confirmStatusChange.actionText)
      setConfirmStatusChange(null)
    }
  }

  const handleRosterConfirm = (selectedSession: RoadmapSession) => {
    if (!cls) return
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${now.getFullYear()}`
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now
      .getDate()
      .toString()
      .padStart(2, '0')}`

    const selectedSessionValStr = `${selectedSession.date} (Buổi ${selectedSession.sessionNumber}: ${selectedSession.topic})`

    const newRosterStudents: RosterStudent[] = (tempSelectedStudents || []).map((item) => {
      const rosterStatus = determineRosterStudentStatus(item.status, selectedSession.status)
      const mockStudent = mockStudents.find((s) => s.id === item.id)

      return {
        id: item.id,
        name: item.name,
        code: item.code,
        status: rosterStatus,
        dob: '2008-05-12',
        parentName: 'Nguyễn Văn Phụ Huynh',
        parentPhone: '0901234567',
        enrollmentDate: dateStr,
        startSession: selectedSessionValStr,
        level: mockStudent?.level || 'IELTS',
      }
    })

    const updatedRoster = [...rosterState, ...newRosterStudents]
    setRosterState(updatedRoster)
    setValidationErrors((prev) => {
      if (!prev || Object.keys(prev).length === 0) return prev
      const copy = { ...prev }
      delete copy.roster
      return copy
    })

    const addedCount = newRosterStudents.length
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `Đã xếp ${addedCount} học viên vào lớp bắt đầu từ buổi học ${selectedSessionValStr}.`,
        operator: 'Giáo vụ Lan',
        timestamp: timeStr,
      },
      ...prev,
    ])

    if (onSave) {
      onSave({
        ...cls,
        enrolledStudents: updatedRoster.filter((s) => s.status === 'active').length,
      })
    }

    setTempSelectedStudents(null)
    setIsSessionSelectOpen(false)
    toast.success(`Đã xếp ${addedCount} học viên vào lớp thành công!`)
  }

  if (!cls) return null

  const enrollmentPercentage = Math.round((cls.enrolledStudents / cls.maxStudents) * 100)
  const isCapacityWarning = enrollmentPercentage >= 90

  return (
    <div className="flex flex-col flex-1 min-h-0 w-full gap-0 overflow-hidden bg-background">
      {isRoadmapWizardOpen ? (
        <>
          <DialogTitle className="sr-only">Thiết lập & Đổi lộ trình giảng dạy</DialogTitle>
          <ClassesRoadmapWizardView
            sessions={sessionsState}
            classRoom={cls.room || 'Chưa gán'}
            classTeacher={cls.teacher || 'Chưa gán'}
            classNameStr={cls.name}
            syllabusName={syllabusState}
            classStartDate={cls.startDate}
            lastChangedInfo={roadmapLastChangedInfo}
            onBack={() => setIsRoadmapWizardOpen(false)}
            onSave={(updatedSessions, logMessage, newSyllabusName) => {
              setSessionsState(updatedSessions)
              setSyllabusState(newSyllabusName)

              if (onSave && cls) {
                onSave({
                  ...cls,
                  syllabus: newSyllabusName,
                })
              }

              const now = new Date()
              const monthStr = (now.getMonth() + 1).toString().padStart(2, '0')
              const dateStr = now.getDate().toString().padStart(2, '0')
              const hourStr = now.getHours().toString().padStart(2, '0')
              const minStr = now.getMinutes().toString().padStart(2, '0')
              const secStr = now.getSeconds().toString().padStart(2, '0')

              const formatStr = `${now.getFullYear()}-${monthStr}-${dateStr} ${hourStr}:${minStr}:${secStr}`
              setRoadmapLastChangedInfo(`Lộ trình được thay đổi vào ${formatStr} bởi Mai Mây`)

              const timeStr = `${hourStr}:${minStr} ${dateStr}/${monthStr}/${now.getFullYear()}`

              setLogs((prev) => [
                {
                  id: Math.random().toString(),
                  action: logMessage,
                  operator: 'Giáo vụ Lan',
                  timestamp: timeStr,
                },
                ...prev,
              ])
            }}
          />
        </>
      ) : (
        <>
          {/* Main Layout: Left Column (Header Card + Tabs & Roster/Sessions) & Right Column Panel */}
          <div className="grid min-h-0 flex-1 gap-4 p-6 lg:grid-cols-[1fr_410px] h-full overflow-hidden bg-background">
            {/* Left Panel Container */}
            <main className="flex min-h-0 flex-col overflow-hidden h-full space-y-4">
              {/* Section Thông tin lớp học (Header trái) */}
              <ClassesDetailHeaderV2
                cls={cls}
                isEditing={isEditing}
                rosterCount={rosterState.length}
                onStartEdit={() => {
                  setIsEditing(true)
                  setEditFormState(cls)
                }}
                onCancelEdit={() => {
                  setIsEditing(false)
                  setEditFormState(cls)
                }}
                onSave={handleSave}
                onStatusChange={handleStatusChange}
                onRequestStatusChange={setConfirmStatusChange}
              />

              {/* Body Section underneath Left Section Header */}
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col h-full">
                  {/* Segmented Control Filter Tabs (5 Tabs: Tổng quan, Học viên, Buổi học, Tài liệu & media, Lịch sử cập nhật) */}
                  <TabsList className="shrink-0 grid w-full grid-cols-5 gap-1 bg-muted/60 p-1 h-9 rounded-lg border border-border/40 mb-1">
                    <TabsTrigger
                      value="overview"
                      className={cn(
                        "h-7 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                        "hover:text-foreground"
                      )}
                    >
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                      <span>Tổng quan</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="roster"
                      className={cn(
                        "h-7 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                        "hover:text-foreground",
                        hasRosterError && "text-destructive data-[state=active]:!text-destructive"
                      )}
                    >
                      <Users className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                      <span>Học viên</span>
                      <span className="ml-1 rounded-full bg-muted-foreground/15 px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground data-[state=active]:!bg-muted data-[state=active]:!text-foreground">
                        {rosterState.length}
                      </span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="sessions"
                      className={cn(
                        "h-7 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                        "hover:text-foreground"
                      )}
                    >
                      <GraduationCap className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                      <span>Buổi học</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="media"
                      className={cn(
                        "h-7 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                        "hover:text-foreground"
                      )}
                    >
                      <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                      <span>Tài liệu & media</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="logs"
                      className={cn(
                        "h-7 rounded-md bg-transparent text-muted-foreground font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                        "data-[state=active]:!bg-background data-[state=active]:!text-foreground data-[state=active]:!font-bold data-[state=active]:shadow-2xs",
                        "hover:text-foreground"
                      )}
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0 text-[#0088cc]" />
                      <span>Lịch sử cập nhật</span>
                      <span className="ml-1 rounded-full bg-muted-foreground/15 px-1.5 py-0.2 text-[10px] font-bold text-muted-foreground data-[state=active]:!bg-muted data-[state=active]:!text-foreground">
                        {logs.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Scrollable Container */}
                  <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col h-full pt-3">
                    {/* Tab 0: Placeholder Tổng quan */}
                    <TabsContent value="overview" className="m-0 focus-visible:outline-none flex-1 flex flex-col items-center justify-center py-10">
                      <EmptyState
                        icon={<Sparkles className="h-7 w-7 text-[#0088cc]" />}
                        title="Tính năng Tổng quan Lớp học đang phát triển"
                        description="Khu vực tổng quan phân tích dữ liệu lớp học đang được xây dựng (Placeholder). Vui lòng chuyển sang tab Học viên hoặc Buổi học để xem thông tin chi tiết."
                        className="border-dashed border-border/70 rounded-2xl bg-muted/15 py-12 px-6 max-w-lg mx-auto"
                      />
                    </TabsContent>

                    {/* Tab 1: Roster */}
                    <TabsContent value="roster" className="m-0 focus-visible:outline-none">
                      <ClassesDetailRoster
                        students={rosterState}
                        onAddStudent={() => setIsStudentSelectOpen(true)}
                        onStudentClick={(id) => setSelectedStudentId(id)}
                        onCareClick={(student) => {
                          setActiveCareStudent(student)
                          setActiveMonthlyReportStudent(null)
                        }}
                        onMonthlyReportOverlayClick={(student) => {
                          setActiveMonthlyReportStudent(student)
                          setActiveCareStudent(null)
                        }}
                        rosterError={validationErrors?.roster}
                        onRemoveStudent={(studentId) => {
                          const student = rosterState.find((s) => s.id === studentId)
                          if (!student) return

                          const nextRoster = rosterState.filter((s) => s.id !== studentId)
                          setRosterState(nextRoster)

                          const now = new Date()
                          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
                            .getMinutes()
                            .toString()
                            .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(
                            now.getMonth() + 1
                          )
                            .toString()
                            .padStart(2, '0')}/${now.getFullYear()}`

                          const auditLogs = [
                            {
                              id: Math.random().toString(),
                              action: `Đã xóa học viên ${student.name} khỏi lớp học.`,
                              operator: 'Giáo vụ Lan',
                              timestamp: timeStr,
                            },
                          ]

                          const activeStudentsCount = nextRoster.filter(
                            (s) => s.status === 'active' || s.status === 'new' || s.status === 'trial'
                          ).length

                          let newStatus = cls.status
                          let finalRoster = nextRoster
                          if (cls.status === 'dang_hoc' && activeStudentsCount === 0) {
                            newStatus = 'huy'
                            finalRoster = []
                            setRosterState([])
                            auditLogs.unshift({
                              id: Math.random().toString(),
                              action: `Lớp học tự động chuyển sang Đã kết thúc do không còn học viên đang học. Đã giải phóng toàn bộ học viên khỏi roster.`,
                              operator: 'Hệ thống',
                              timestamp: timeStr,
                            })
                          }

                          setLogs((prev) => [...auditLogs, ...prev])

                          if (onSave) {
                            onSave({
                              ...cls,
                              status: newStatus,
                              enrolledStudents: finalRoster.filter((s) => s.status === 'active').length,
                            })
                          }

                          if (onStatusChange && newStatus !== cls.status) {
                            onStatusChange(cls.id, newStatus)
                          }
                        }}
                      />
                    </TabsContent>

                    {/* Tab 3: Sessions */}
                    <TabsContent value="sessions" className="m-0 focus-visible:outline-none">
                      <ClassesDetailSessionsV2
                        cls={cls}
                        sessions={sessionsState}
                        roster={rosterState}
                        onUpdateSession={handleUpdateSession}
                        classNotes={notes}
                        classLogs={logs}
                        onAddClassNote={handleAddNote}
                        onEditRoadmap={() => setIsRoadmapWizardOpen(true)}
                      />
                    </TabsContent>

                    {/* Tab 4: Tài liệu & media (Danh sách tổng hợp từ tất cả các buổi học) */}
                    <TabsContent value="media" className="m-0 focus-visible:outline-none flex-1">
                      <ClassesSessionMediaTab
                        rosterStudents={rosterState.map((s) => ({
                          id: s.id,
                          name: s.name,
                          code: s.code,
                          initials: s.name ? s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : 'HV',
                        }))}
                        className={cls?.name || 'Lớp học'}
                      />
                    </TabsContent>

                    {/* Tab 4: Logs (Lịch sử cập nhật) */}
                    <TabsContent value="logs" className="m-0 focus-visible:outline-none flex-1">
                      <div className="space-y-3 p-4 rounded-2xl border border-border/70 bg-card/40">
                        <div className="flex items-center justify-between border-b pb-2.5">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                              Lịch Sử Cập Nhật Lớp Học ({logs.length})
                            </h4>
                          </div>
                        </div>

                        <div className="space-y-2.5 pt-1">
                          {logs.length === 0 ? (
                            <EmptyState
                              icon={<Clock className="h-7 w-7 text-muted-foreground/40" />}
                              title="Chưa có lịch sử cập nhật nào"
                              description="Lịch sử cập nhật trạng thái, thêm học viên và đổi lịch học sẽ được ghi vết tự động tại đây."
                              className="border-dashed border-border/70 rounded-xl bg-muted/15 py-8"
                            />
                          ) : (
                            logs.map((log) => (
                              <div key={log.id} className="rounded-xl border border-border/60 bg-background p-3 text-xs space-y-1 shadow-2xs">
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                  <span className="font-bold text-foreground flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    {log.operator}
                                  </span>
                                  <span className="font-mono text-[10px]">{formatNoteTimestamp(log.timestamp)}</span>
                                </div>
                                <p className="font-medium text-foreground/90 leading-relaxed ps-3 border-s-2 border-primary/30 mt-1">
                                  {log.action}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </main>

            {/* Right Side Panel: Class Info, Interactions OR Overlay Student Care Panel OR Overlay Monthly Report Panel */}
            {activeCareStudent ? (
              <ClassesStudentCareOverlayPanel
                student={activeCareStudent}
                onClose={() => setActiveCareStudent(null)}
              />
            ) : activeMonthlyReportStudent ? (
              <ClassesStudentMonthlyReportOverlayPanel
                student={activeMonthlyReportStudent}
                onClose={() => setActiveMonthlyReportStudent(null)}
              />
            ) : (
              <ClassesDetailInteractionPanelV2
                cls={cls}
                notes={notes}
                logs={logs}
                roster={rosterState}
                onAddNote={handleAddNote}
                isEditing={isEditing}
                editFormState={editFormState}
                onEditStateChange={handleEditFormStateChange}
                validationErrors={validationErrors}
                onStartEdit={() => setIsEditing(true)}
                onRescheduleClick={() => setIsScheduleModalOpen(true)}
                onCancelEdit={() => {
                  setIsEditing(false)
                  setEditFormState(cls)
                  setValidationErrors({})
                }}
                onSave={handleSave}
                onRequestStatusChange={setConfirmStatusChange}
                onAddStudent={() => setIsStudentSelectOpen(true)}
                onEditRoadmap={() => setIsRoadmapWizardOpen(true)}
              />
            )}
          </div>
        </>
      )}

      {/* Dialogs Layer */}
      <ClassesDetailDialogs
        cls={cls}
        sessionsState={sessionsState}
        rosterState={rosterState}
        isStudentSelectOpen={isStudentSelectOpen}
        setIsStudentSelectOpen={setIsStudentSelectOpen}
        isSessionSelectOpen={isSessionSelectOpen}
        setIsSessionSelectOpen={setIsSessionSelectOpen}
        tempSelectedStudents={tempSelectedStudents}
        setTempSelectedStudents={setTempSelectedStudents}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
        confirmStatusChange={confirmStatusChange}
        setConfirmStatusChange={setConfirmStatusChange}
        onStatusChangeConfirm={handleStatusChangeConfirm}
        onRosterConfirm={handleRosterConfirm}
      />

      {/* Schedule Edit Modal (triggered from right panel Đổi lịch button) */}
      {isScheduleModalOpen && (
        <ClassesAddScheduleDialog
          open={isScheduleModalOpen}
          onOpenChange={setIsScheduleModalOpen}
          cls={cls}
          onSave={(newSlots) => {
            setIsScheduleModalOpen(false)
            toast.success(`Đã cập nhật cấu hình lịch học cố định thành công (${newSlots.length} ca học/tuần)!`)
          }}
        />
      )}
    </div>
  )
}
