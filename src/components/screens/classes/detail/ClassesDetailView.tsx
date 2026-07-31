'use client'

import { useState } from 'react'

import { DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ClassRecord } from '@/mocks/classRecords'
import { cn } from '@/lib/utils'

// Import Sub-components
import { ClassesDetailOverview } from './ClassesDetailOverview'
import { ClassesDetailRoster } from './ClassesDetailRoster'
import { ClassesDetailSessions } from './ClassesDetailSessions'
import { ClassesDetailSchedule } from './ClassesDetailSchedule'
import { ClassesRoadmapWizardView } from './ClassesRoadmapWizardView'
import {
  ClassesDetailHeader,
  type ClassesStatusChangeRequest,
} from './ClassesDetailHeader'

import { toast } from 'sonner'

// Import Subcomponents & Helpers
import { ClassesDetailDialogs } from './ClassesDetailDialogs'
import { ClassesDetailInteractionPanel } from './ClassesDetailInteractionPanel'
import { SelectedStudentItem } from '../RosterSessionSelectionDialog'
import { mockStudents } from '@/mocks/students'
import {
  generateMockRoster,
  generateRoadmapSessions,
  determineRosterStudentStatus,
  getFirstTabWithError,
  validateClassForm,
  getSessionUpdateLogMessage,
} from './classesDetailHelpers'
import type { ClassNote, ClassAuditLog, RoadmapSession, RosterStudent } from './classesDetailTypes'


interface ClassesDetailViewProps {
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

export function ClassesDetailView({
  cls,
  initialEditMode = false,
  initialTab = 'roster',
  initialRoadmapWizard = false,
  initialStudentSelect = false,
  onSave,
  onStatusChange,
  hideClassType = false,
}: ClassesDetailViewProps) {
  const [activeTab, setActiveTab] = useState('roster')

  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false)
  const [tempSelectedStudents, setTempSelectedStudents] = useState<SelectedStudentItem[] | null>(null)
  const [isSessionSelectOpen, setIsSessionSelectOpen] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [isRoadmapWizardOpen, setIsRoadmapWizardOpen] = useState(false)
  const [syllabusState, setSyllabusState] = useState<string>('')
  const [roadmapLastChangedInfo, setRoadmapLastChangedInfo] = useState<string | null>(
    'Lộ trình được thay đổi vào 2026-05-28 10:15:30 bởi Mai Mây'
  )

  // State to hold roadmap & actual sessions list locally to support interactive updates
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

  // Adjust state during render when prop changes (React recommended pattern)
  if (cls && cls.id !== prevClsId) {
    setPrevClsId(cls.id)
    setSessionsState(generateRoadmapSessions(cls))
    setRosterState(generateMockRoster(cls))
    setSyllabusState(cls.syllabus || '')
    setEditFormState(cls)
    const nextEditing = !!initialEditMode
    setIsEditing(nextEditing)
    if (nextEditing) {
      setActiveTab('overview')
    } else {
      setActiveTab(initialTab)
    }
    setIsRoadmapWizardOpen(!!initialRoadmapWizard)
    setIsStudentSelectOpen(!!initialStudentSelect)
  }

  // Mock notes for this class (simulate local state)
  const [notes, setNotes] = useState<ClassNote[]>([
    {
      id: '1',
      text: 'Lớp học vận hành ổn định. Học viên Nguyễn Văn A phản ánh phòng học hơi lạnh ở buổi 2.',
      author: 'Giáo vụ Lan',
      timestamp: '10:00 02/06/2026',
    },
    {
      id: '2',
      text: 'Đã nhắc nhở giáo viên chủ nhiệm nộp đề cương buổi 5 đúng hạn.',
      author: 'Giáo vụ Lan',
      timestamp: '14:30 01/06/2026',
    },
  ])

  // Mock activity logs (simulate system audit trail)
  const [logs, setLogs] = useState<ClassAuditLog[]>([
    {
      id: 'l1',
      action: 'Điểm danh buổi học đầu tiên hoàn thành. Lớp chuyển sang Đang học.',
      operator: 'Hệ thống',
      timestamp: '18:00 02/06/2026',
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

    // Add Note
    setNotes((prev) => [
      {
        id: Math.random().toString(),
        text: newNoteText,
        author: 'Giáo vụ Lan',
        timestamp: timestampStr,
      },
      ...prev,
    ])

    // Log this action to the audit logs tab
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

    // If class is Awaiting Opening or Active, validate the updated form state
    if (editFormState.status === 'cho_khai_giang' || editFormState.status === 'dang_hoc') {
      const errors = validateClassForm(editFormState, rosterState.length)
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        setActiveTab(getFirstTabWithError(errors))
        toast.error('Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ.')
        return
      }
    } else {
      // For Draft classes, only name and branch are strictly required to save basic edit
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
    // Update local state and logs
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
          setIsEditing(true)
          setEditFormState(cls)
          setActiveTab(getFirstTabWithError(errors))
          toast.error('Không đủ điều kiện chờ khai giảng. Vui lòng bổ sung thông tin đỏ.')
          return
        }
      }

      setValidationErrors({})

      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getFullYear()}`

      const newLogs = [
        { id: Math.random().toString(), action: actionText, operator: 'Giáo vụ Lan', timestamp: timeStr },
      ]

      if (newStatus === 'huy') {
        // Clear roster state and save
        setRosterState([])
        newLogs.unshift({
          id: Math.random().toString(),
          action: 'Đã giải phóng toàn bộ học viên khỏi danh sách Roster do hủy/kết thúc lớp học.',
          operator: 'Hệ thống',
          timestamp: timeStr,
        })
        if (onSave) {
          onSave({
            ...cls,
            status: 'huy',
            enrolledStudents: 0,
          })
        }
      }

      if (onStatusChange) {
        onStatusChange(cls.id, newStatus)
      }

      setLogs((prev) => [...newLogs, ...prev])
    }
  }

  // Handle single-session updates (teacher, room, materials)
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

        // Add Log entry
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
    const actionText = `Đã xếp lớp/thêm ${addedCount} học viên mới vào danh sách lớp học. Buổi bắt đầu: ${selectedSessionValStr}`

    setLogs((prev) => [
      {
        id: Math.random().toString(),
        action: actionText,
        operator: 'Giáo vụ Lan',
        timestamp: timeStr,
      },
      ...prev,
    ])

    setTempSelectedStudents(null)
    setIsSessionSelectOpen(false)

    if (onSave) {
      onSave({
        ...cls,
        enrolledStudents: updatedRoster.filter(
          (s) => s.status === 'active' || s.status === 'new' || s.status === 'trial'
        ).length,
      })
    }
  }

  if (!cls) return null

  // Calculate percentage of enrolled students vs max
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

              // Append to audit logs
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
          <ClassesDetailHeader
            cls={cls}
            isEditing={isEditing}
            rosterCount={rosterState.length}
            enrollmentPercentage={enrollmentPercentage}
            isCapacityWarning={isCapacityWarning}
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

          {/* 2. Split Body: 70% Left Tabs / 30% Right Notes & Logs */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-2">
            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[1fr_410px] h-full">
              {/* Left: 70% Content Area */}
              <main className="flex min-h-0 flex-col overflow-hidden h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col h-full">
                  <TabsList variant="line" className="shrink-0 justify-start border-b border-border/50 p-0 gap-6 h-9 w-full">
                    <TabsTrigger
                      value="roster"
                      className={cn(
                        "px-1 pb-2 pt-1 font-semibold text-xs flex items-center gap-1.5 hover:text-foreground",
                        hasRosterError && "text-destructive data-[state=active]:text-destructive"
                      )}
                    >
                      Học viên{' '}
                      {hasRosterError && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive shrink-0 animate-pulse" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="sessions"
                      className="px-1 pb-2 pt-1 font-semibold text-xs flex items-center gap-1.5 hover:text-foreground"
                    >
                      Buổi học
                    </TabsTrigger>
                    <TabsTrigger
                      value="schedule"
                      className={cn(
                        "px-1 pb-2 pt-1 font-semibold text-xs flex items-center gap-1.5 hover:text-foreground",
                        hasScheduleError && "text-destructive data-[state=active]:text-destructive"
                      )}
                    >
                      Lịch học{' '}
                      {hasScheduleError && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive shrink-0 animate-pulse" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="overview"
                      className={cn(
                        "px-1 pb-2 pt-1 font-semibold text-xs flex items-center gap-1.5 ml-auto hover:text-foreground",
                        hasOverviewError && "text-destructive data-[state=active]:text-destructive"
                      )}
                    >
                      Tổng quan{' '}
                      {hasOverviewError && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive shrink-0 animate-pulse" />
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab scroll container */}
                  <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col h-full">
                    {/* Tab Roster học viên */}
                    <TabsContent value="roster" className="m-0 focus-visible:outline-none">
                      <ClassesDetailRoster
                        students={rosterState}
                        onAddStudent={() => setIsStudentSelectOpen(true)}
                        onStudentClick={(id) => setSelectedStudentId(id)}
                        rosterError={validationErrors?.roster}
                        onRemoveStudent={(studentId) => {
                          const student = rosterState.find((s) => s.id === studentId)
                          if (!student) return

                          const nextRoster = rosterState.filter((s) => s.id !== studentId)
                          setRosterState(nextRoster)

                          // Log this removal
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

                          // Check if class is 'dang_hoc' and there are no active students left
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

                    {/* Tab Buổi học thực tế */}
                    <TabsContent value="sessions" className="m-0 focus-visible:outline-none">
                      <ClassesDetailSessions
                        cls={cls}
                        sessions={sessionsState}
                        roster={rosterState}
                        onUpdateSession={handleUpdateSession}
                        classNotes={notes}
                        classLogs={logs}
                        onAddClassNote={handleAddNote}
                      />
                    </TabsContent>

                    {/* Tab Lịch học tuần cố định */}
                    <TabsContent value="schedule" className="m-0 focus-visible:outline-none">
                      <ClassesDetailSchedule
                        cls={cls}
                        validationErrors={validationErrors}
                        onUpdateSchedule={(newSlots) => {
                          // Clear schedule errors
                          setValidationErrors((prev) => {
                            if (!prev || Object.keys(prev).length === 0) return prev
                            const copy = { ...prev }
                            let changed = false
                            if (copy.schedule) {
                              delete copy.schedule
                              changed = true
                            }
                            Object.keys(copy).forEach((k) => {
                              if (k.startsWith('room_') || k.startsWith('teacher_')) {
                                delete copy[k]
                                changed = true
                              }
                            })
                            return changed ? copy : prev
                          })

                          const now = new Date()
                          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
                            .getMinutes()
                            .toString()
                            .padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(
                            now.getMonth() + 1
                          )
                            .toString()
                            .padStart(2, '0')}/${now.getFullYear()}`
                          setLogs((prev) => [
                            {
                              id: Math.random().toString(),
                              action: `Đã cập nhật cấu hình lịch học cố định (${newSlots.length} ca học cố định hàng tuần).`,
                              operator: 'Giáo vụ Lan',
                              timestamp: timeStr,
                            },
                            ...prev,
                          ])
                        }}
                      />
                    </TabsContent>

                    {/* Tab Tổng quan (Moved to last) */}
                    <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                      <ClassesDetailOverview
                        cls={editFormState || cls}
                        isEditing={isEditing}
                        editFormState={editFormState}
                        onEditStateChange={handleEditFormStateChange}
                        hideClassType={hideClassType}
                        validationErrors={validationErrors}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </main>

              {/* Right: 30% Notes & Logs Side Panel */}
              <ClassesDetailInteractionPanel notes={notes} logs={logs} onAddNote={handleAddNote} />
            </div>
          </div>
        </>
      )}

      {/* Detail screen popups and dialog managers */}
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
    </div>
  )
}
