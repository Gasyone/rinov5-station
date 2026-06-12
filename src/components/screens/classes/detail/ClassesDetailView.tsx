'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Clock,
  SendHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog, PersonnelHoverCard } from '@/components/shared'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ClassRecord } from '@/mocks/classRecords'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Import Sub-components
import { ClassesDetailOverview } from './ClassesDetailOverview'
import { ClassesDetailRoster } from './ClassesDetailRoster'
import { ClassesDetailRoadmap } from './ClassesDetailRoadmap'
import { ClassesDetailSessions } from './ClassesDetailSessions'
import { ClassesDetailSchedule } from './ClassesDetailSchedule'
import { StudentSelectionDialog } from '../StudentSelectionDialog'
import { ClassesRoadmapWizardView } from './ClassesRoadmapWizardView'
import {
  ClassesDetailHeader,
  type ClassesStatusChangeRequest,
} from './ClassesDetailHeader'

import { toast } from 'sonner'

// Import Helper utilities
import { StudentDetailDialog } from '@/components/screens/students/detail/StudentDetailDialog'
import { generateMockRoster, generateRoadmapSessions } from './classesDetailHelpers'
import type { ClassNote, ClassAuditLog, RoadmapSession, RosterStudent } from './classesDetailTypes'

function formatNoteTimestamp(timestampStr: string): string {
  try {
    const parts = timestampStr.split(' ')
    if (parts.length !== 2) return timestampStr
    const [timePart, datePart] = parts
    const [hours, minutes] = timePart.split(':').map(Number)
    const [day, month, year] = datePart.split('/').map(Number)
    
    const noteDate = new Date(year, month - 1, day, hours, minutes)
    const now = new Date()
    
    const oneDayMs = 24 * 60 * 60 * 1000
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const noteDateStart = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate())
    const diffDays = Math.floor((todayStart.getTime() - noteDateStart.getTime()) / oneDayMs)
    
    if (diffDays === 0) {
      return timePart
    }
    if (diffDays === 1) {
      return 'Hôm qua'
    }
    if (diffDays > 1 && diffDays < 7) {
      return `${diffDays} ngày trước`
    }
    
    const diffWeeks = Math.floor(diffDays / 7)
    if (diffWeeks > 0 && diffWeeks < 4) {
      return `${diffWeeks} tuần trước`
    }
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`
  } catch {
    return timestampStr
  }
}

function getFirstTabWithError(errors: Record<string, string>): string {
  if (errors.name || errors.branch || errors.level || errors.startDate || errors.syllabus) {
    return 'overview'
  }
  if (errors.roster) {
    return 'roster'
  }
  if (errors.schedule || Object.keys(errors).some(k => k.startsWith('room_') || k.startsWith('teacher_'))) {
    return 'schedule'
  }
  return 'overview'
}

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
  hideClassType = false
}: ClassesDetailViewProps) {
  const [activeTab, setActiveTab] = useState('roster')
  const getInitials = (name: string) => {
    if (!name) return '—'
    return name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
  }
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'logs'>('notes')
  const [noteInput, setNoteInput] = useState('')
  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false)
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

  const hasOverviewError = !!(validationErrors.name || validationErrors.branch || validationErrors.level || validationErrors.startDate || validationErrors.syllabus)
  const hasRosterError = !!validationErrors.roster
  const hasScheduleError = !!(validationErrors.schedule || Object.keys(validationErrors).some(k => k.startsWith('room_') || k.startsWith('teacher_')))

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
    { id: '1', text: 'Lớp học vận hành ổn định. Học viên Nguyễn Văn A phản ánh phòng học hơi lạnh ở buổi 2.', author: 'Giáo vụ Lan', timestamp: '10:00 02/06/2026' },
    { id: '2', text: 'Đã nhắc nhở giáo viên chủ nhiệm nộp đề cương buổi 5 đúng hạn.', author: 'Giáo vụ Lan', timestamp: '14:30 01/06/2026' }
  ])

  // Mock activity logs (simulate system audit trail)
  const [logs, setLogs] = useState<ClassAuditLog[]>([
    { id: 'l1', action: 'Điểm danh buổi học đầu tiên hoàn thành. Lớp chuyển sang Đang học.', operator: 'Hệ thống', timestamp: '18:00 02/06/2026' },
    { id: 'l2', action: 'Kích hoạt lớp học sang trạng thái Chờ khai giảng.', operator: 'Giáo vụ Lan', timestamp: '10:00 02/06/2026' },
    { id: 'l3', action: 'Cấu hình lịch học cố định hàng tuần.', operator: 'Giáo vụ Lan', timestamp: '16:15 01/06/2026' },
    { id: 'l4', action: 'Khởi tạo vỏ lớp học nháp thành công.', operator: 'Giáo vụ Lan', timestamp: '16:00 01/06/2026' }
  ])

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    const newNoteText = noteInput.trim()
    
    // Add Note
    setNotes((prev) => [
      {
        id: Math.random().toString(),
        text: newNoteText,
        author: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    // Log this action to the audit logs tab
    setLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `Đã thêm ghi chú tương tác: "${newNoteText.substring(0, 30)}${newNoteText.length > 30 ? '...' : ''}"`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setNoteInput('')
  }

  const handleSave = () => {
    if (!editFormState) return

    // If class is Awaiting Opening or Active, validate the updated form state
    if (editFormState.status === 'cho_khai_giang' || editFormState.status === 'dang_hoc') {
      const errors: Record<string, string> = {}
      if (!editFormState.name || !editFormState.name.trim()) {
        errors.name = 'Tên lớp không được để trống'
      }
      if (!editFormState.branch || !editFormState.branch.trim() || editFormState.branch === 'all') {
        errors.branch = 'Chưa chọn chi nhánh/trường'
      }
      if (!editFormState.level || !editFormState.level.trim()) {
        errors.level = 'Chưa chọn môn học/trình độ'
      }
      if (!editFormState.startDate || editFormState.startDate === '---' || editFormState.startDate === '') {
        errors.startDate = 'Chưa chọn ngày bắt đầu'
      }
      if (!editFormState.syllabus || !editFormState.syllabus.trim() || editFormState.syllabus === '—') {
        errors.syllabus = 'Chưa chọn chương trình'
      }
      if (rosterState.length === 0) {
        errors.roster = 'Lớp học cần có ít nhất 1 học viên xếp lớp (Roster)'
      }
      
      if (!editFormState.scheduleSlots || editFormState.scheduleSlots.length === 0) {
        errors.schedule = 'Vui lòng kích hoạt ít nhất 1 ngày học trong tuần'
        if (!editFormState.room) {
          errors.room = 'Chưa chọn phòng học cố định'
        }
        if (!editFormState.teacher) {
          errors.teacher = 'Chưa chọn giáo viên chủ nhiệm'
        }
      } else {
        editFormState.scheduleSlots.forEach((slot, index) => {
          const roomVal = slot.room || editFormState.room
          if (!roomVal || roomVal === '---' || roomVal === 'Chưa gán') {
            errors[`room_${index}`] = `Vui lòng chọn phòng học cho ca học thứ ${index + 1} (${slot.dayOfWeek})`
            errors.room = 'Vui lòng chọn phòng học cố định'
          }
          const hasTeacher = (slot.teachers && slot.teachers.length > 0) || (editFormState.teacher && editFormState.teacher !== 'Chưa xếp lớp' && editFormState.teacher !== 'Chưa gán' && editFormState.teacher !== '—')
          if (!hasTeacher) {
            errors[`teacher_${index}`] = `Vui lòng phân công phụ trách cho ca học thứ ${index + 1} (${slot.dayOfWeek})`
            errors.teacher = 'Vui lòng chọn giáo viên chủ nhiệm'
          }
        })
      }

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
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    setLogs((prev) => [
      { id: Math.random().toString(), action: 'Đã chỉnh sửa thông tin cơ bản của lớp học.', operator: 'Giáo vụ Lan', timestamp: timeStr },
      ...prev
    ])
    setIsEditing(false)
  }

  const handleStatusChange = (newStatus: ClassRecord['status'], actionText: string) => {
    if (cls) {
      if (newStatus === 'cho_khai_giang') {
        const errors: Record<string, string> = {}
        if (!cls.name || !cls.name.trim()) {
          errors.name = 'Tên lớp không được để trống'
        }
        if (!cls.branch || !cls.branch.trim() || cls.branch === 'all') {
          errors.branch = 'Chưa chọn chi nhánh/trường'
        }
        if (!cls.level || !cls.level.trim()) {
          errors.level = 'Chưa chọn môn học/trình độ'
        }
        if (!cls.startDate || cls.startDate === '---' || cls.startDate === '') {
          errors.startDate = 'Chưa chọn ngày bắt đầu'
        }
        if (!cls.syllabus || !cls.syllabus.trim() || cls.syllabus === '—') {
          errors.syllabus = 'Chưa chọn chương trình'
        }
        if (rosterState.length === 0) {
          errors.roster = 'Lớp học cần có ít nhất 1 học viên xếp lớp (Roster)'
        }

        if (!cls.scheduleSlots || cls.scheduleSlots.length === 0) {
          errors.schedule = 'Vui lòng kích hoạt ít nhất 1 ngày học trong tuần'
          if (!cls.room) {
            errors.room = 'Chưa chọn phòng học cố định'
          }
          if (!cls.teacher) {
            errors.teacher = 'Chưa chọn giáo viên chủ nhiệm'
          }
        } else {
          cls.scheduleSlots.forEach((slot, index) => {
            const roomVal = slot.room || cls.room
            if (!roomVal || roomVal === '---' || roomVal === 'Chưa gán') {
              errors[`room_${index}`] = `Vui lòng chọn phòng học cho ca học thứ ${index + 1} (${slot.dayOfWeek})`
              errors.room = 'Vui lòng chọn phòng học cố định'
            }
            const hasTeacher = (slot.teachers && slot.teachers.length > 0) || (cls.teacher && cls.teacher !== 'Chưa xếp lớp' && cls.teacher !== 'Chưa gán' && cls.teacher !== '—')
            if (!hasTeacher) {
              errors[`teacher_${index}`] = `Vui lòng phân công phụ trách cho ca học thứ ${index + 1} (${slot.dayOfWeek})`
              errors.teacher = 'Vui lòng chọn giáo viên chủ nhiệm'
            }
          })
        }

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
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
      
      const newLogs = [
        { id: Math.random().toString(), action: actionText, operator: 'Giáo vụ Lan', timestamp: timeStr }
      ]

      if (newStatus === 'huy') {
        // Clear roster state and save
        setRosterState([])
        newLogs.unshift({
          id: Math.random().toString(),
          action: 'Đã giải phóng toàn bộ học viên khỏi danh sách Roster do hủy/kết thúc lớp học.',
          operator: 'Hệ thống',
          timestamp: timeStr
        })
        if (onSave) {
          onSave({
            ...cls,
            status: 'huy',
            enrolledStudents: 0
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
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
        
        let logMsg = `Đã cập nhật Buổi học ${s.sessionNumber}.`
        if (updates.substituteTeacherName !== undefined) {
          const coverOptionsMap: Record<string, string> = {
            'cover-1a': 'Cover 1A - Báo trước ngày học',
            'cover-1b': 'Cover 1B - Báo trong ngày học, trước 17h30',
            'cover-2': 'Cover 2 - Báo 30 phút trước giờ học',
            'cover-3a': 'COVER3A - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV không vào lớp',
            'cover-3b': 'COVER3B - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV vào lớp dạy 5-10 phút thì bị lỗi KT'
          }
          const coverLabel = updates.coverType && coverOptionsMap[updates.coverType] 
            ? ` [Dạng Cover: ${coverOptionsMap[updates.coverType]}]` 
            : ''
          const noteText = updates.coverNote ? ` (Ghi chú: ${updates.coverNote})` : ''
          logMsg = `Buổi học ${s.sessionNumber}: Thay đổi giáo viên giảng dạy thành ${updates.substituteTeacherName || s.teacherName}${coverLabel}${noteText}.`
        } else if (updates.room !== undefined) {
          const coverOptionsMap: Record<string, string> = {
            'cover-1a': 'Cover 1A - Báo trước ngày học',
            'cover-1b': 'Cover 1B - Báo trong ngày học, trước 17h30',
            'cover-2': 'Cover 2 - Báo 30 phút trước giờ học',
            'cover-3a': 'COVER3A - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV không vào lớp',
            'cover-3b': 'COVER3B - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV vào lớp dạy 5-10 phút thì bị lỗi KT'
          }
          const coverLabel = updates.coverType && coverOptionsMap[updates.coverType] 
            ? ` [Dạng Cover: ${coverOptionsMap[updates.coverType]}]` 
            : ''
          const noteText = updates.coverNote ? ` (Ghi chú: ${updates.coverNote})` : ''
          logMsg = `Buổi học ${s.sessionNumber}: Thay đổi phòng học thành ${updates.room}${coverLabel}${noteText}.`
        } else if (updates.materials !== undefined) {
          logMsg = `Buổi học ${s.sessionNumber}: Tải lên giáo án bài giảng mới.`
        }

        // Add Log entry
        setLogs((l) => [
          { id: Math.random().toString(), action: logMsg, operator: 'Giáo vụ Lan', timestamp: timeStr },
          ...l
        ])

        return { ...s, ...updates }
      })
    )
  }

  if (!cls) return null

  // Calculate percentage of enrolled students vs max
  const enrollmentPercentage = Math.round((cls.enrolledStudents / cls.maxStudents) * 100)
  const isCapacityWarning = enrollmentPercentage >= 90


  return (
    <div className="flex flex-col flex-1 min-h-0 w-full gap-0 overflow-hidden bg-background">
      {isRoadmapWizardOpen ? (
        <>
          <DialogTitle className="sr-only">
            Thiết lập & Đổi lộ trình giảng dạy
          </DialogTitle>
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
                  syllabus: newSyllabusName
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
                  timestamp: timeStr
                },
                ...prev
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
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-4">
            <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_320px] h-full">
              
              {/* Left: 70% Content Area */}
              <main className="flex min-h-0 flex-col overflow-hidden h-full">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col h-full">
                  <TabsList variant="line" className="shrink-0 justify-start border-none p-0 gap-6 h-9 w-full">
                    <TabsTrigger 
                      value="roster" 
                      className={`rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none ${
                        hasRosterError ? 'text-destructive data-[state=active]:border-destructive' : ''
                      }`}
                    >
                      Học viên {hasRosterError && <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive shrink-0 animate-pulse" />}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="roadmap" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                    >
                      Lộ trình học tập
                    </TabsTrigger>
                    <TabsTrigger 
                      value="sessions" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                    >
                      Buổi học thực tế
                    </TabsTrigger>
                    <TabsTrigger 
                      value="schedule" 
                      className={`rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none ${
                        hasScheduleError ? 'text-destructive data-[state=active]:border-destructive' : ''
                      }`}
                    >
                      Lịch học cố định {hasScheduleError && <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive shrink-0 animate-pulse" />}
                    </TabsTrigger>
                    <TabsTrigger 
                      value="overview" 
                      className={`rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 ml-auto focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none ${
                        hasOverviewError ? 'text-destructive data-[state=active]:border-destructive' : ''
                      }`}
                    >
                      Tổng quan {hasOverviewError && <span className="inline-block w-1.5 h-1.5 rounded-full bg-destructive shrink-0 animate-pulse" />}
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
                          const student = rosterState.find(s => s.id === studentId)
                          if (!student) return
                          
                          const nextRoster = rosterState.filter((s) => s.id !== studentId)
                          setRosterState(nextRoster)
                          
                          // Log this removal
                          const now = new Date()
                          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
                          
                          const auditLogs = [
                            { id: Math.random().toString(), action: `Đã xóa học viên ${student.name} khỏi lớp học.`, operator: 'Giáo vụ Lan', timestamp: timeStr }
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
                              timestamp: timeStr
                            })
                          }

                          setLogs((prev) => [...auditLogs, ...prev])

                          if (onSave) {
                            onSave({
                              ...cls,
                              status: newStatus,
                              enrolledStudents: finalRoster.filter((s) => s.status === 'active').length
                            })
                          }

                          if (onStatusChange && newStatus !== cls.status) {
                            onStatusChange(cls.id, newStatus)
                          }
                        }}
                      />
                    </TabsContent>

                    {/* Tab Lộ trình lý thuyết */}
                    <TabsContent value="roadmap" className="m-0 focus-visible:outline-none">
                      <ClassesDetailRoadmap 
                        sessions={sessionsState} 
                        syllabusName={syllabusState}
                        lastChangedInfo={roadmapLastChangedInfo}
                        onEditRoadmap={() => setIsRoadmapWizardOpen(true)}
                      />
                    </TabsContent>

                    {/* Tab Buổi học thực tế */}
                    <TabsContent value="sessions" className="m-0 focus-visible:outline-none">
                      <ClassesDetailSessions 
                        cls={cls}
                        sessions={sessionsState}
                        roster={rosterState}
                        onUpdateSession={handleUpdateSession}
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
                            Object.keys(copy).forEach(k => {
                              if (k.startsWith('room_') || k.startsWith('teacher_')) {
                                delete copy[k]
                                changed = true
                              }
                            })
                            return changed ? copy : prev
                          })

                          const now = new Date()
                          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
                          setLogs((prev) => [
                            { 
                              id: Math.random().toString(), 
                              action: `Đã cập nhật cấu hình lịch học cố định (${newSlots.length} ca học cố định hàng tuần).`, 
                              operator: 'Giáo vụ Lan', 
                              timestamp: timeStr 
                            },
                            ...prev
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
              <aside className="flex min-h-0 flex-col overflow-hidden border-l pl-6 h-full">
                <Tabs
                  value={activeSideTab}
                  onValueChange={(value) => setActiveSideTab(value as 'notes' | 'logs')}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  {/* Style tab list with active underlines only, no gray background boxes */}
                  <TabsList variant="line" className="shrink-0 w-full border-none p-0 gap-6 h-9 flex justify-start">
                    <TabsTrigger 
                      value="notes" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Tương tác ({notes.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="logs" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Nhật ký ({logs.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content notes */}
                  <TabsContent value="notes" className="min-h-0 flex-1 flex flex-col overflow-hidden m-0 pt-3 focus-visible:outline-none">
                    <div className="flex h-full min-h-0 flex-col justify-between">
                      <div className="min-h-0 flex-1 overflow-y-auto pr-1 space-y-3 pt-1">
                        {notes.map((note) => (
                          <div key={note.id} className="group py-0.5">
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <PersonnelHoverCard
                                person={{
                                  name: note.author,
                                  phone: '0901234567',
                                  role: 'Bộ phận Giáo vụ'
                                }}
                                align="start"
                              >
                                <div className="flex items-center gap-1.5 cursor-help hover:text-primary transition-colors">
                                  <Avatar className="h-5 w-5 shrink-0">
                                    <AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">
                                      {getInitials(note.author)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-semibold text-foreground/80">{note.author}</span>
                                </div>
                              </PersonnelHoverCard>
                              <span className="font-mono text-[9px]">{formatNoteTimestamp(note.timestamp)}</span>
                            </div>
                            <p className="mt-1 text-xs text-foreground/90 leading-relaxed">{note.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Add note text input */}
                      <div className="relative shrink-0 border-none pt-3 mt-3 bg-background">
                        <Textarea
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          placeholder="Ghi chú tương tác..."
                          rows={2}
                          className="min-h-16 resize-none pr-11 text-xs rounded-xl shadow-xs border-muted focus-visible:ring-primary"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          className="absolute bottom-2 right-2 rounded-lg"
                          disabled={!noteInput.trim()}
                          onClick={handleAddNote}
                        >
                          <SendHorizontal className="h-4 w-4 text-primary" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Tab Content Audit Logs */}
                  <TabsContent value="logs" className="min-h-0 flex-1 overflow-y-auto m-0 pt-3 pr-1 focus-visible:outline-none">
                    <div className="relative border-l border-border pl-4 ml-2 space-y-4 pt-1">
                      {logs.map((log) => (
                        <div key={log.id} className="relative text-xs">
                          {/* Dot indicator */}
                          <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                          <div className="text-[10px] text-muted-foreground font-mono">{log.timestamp}</div>
                          <p className="text-xs font-semibold text-foreground mt-0.5">{log.action}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">Người thực hiện: {log.operator}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </aside>

            </div>
          </div>
        </>
      )}

      {/* Student placement selector dialog */}
      <StudentSelectionDialog
        open={isStudentSelectOpen}
        onOpenChange={setIsStudentSelectOpen}
        initialSelectedIds={rosterState.map((s) => s.id)}
        subject={cls.level}
        onConfirm={(selectedList) => {
          const now = new Date()
          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
          const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`

          const updatedRoster: RosterStudent[] = selectedList.map((item) => {
            const existing = rosterState.find((s) => s.id.split('-')[0] === item.id)
            if (existing) return existing
            
            return {
              id: item.id,
              name: item.name,
              code: item.code,
              status: item.status as RosterStudent['status'],
              dob: '2008-05-12',
              parentName: 'Nguyễn Văn Phụ Huynh',
              parentPhone: '0901234567',
              enrollmentDate: dateStr
            }
          })

          setRosterState(updatedRoster)
          setValidationErrors((prev) => {
            if (!prev || Object.keys(prev).length === 0) return prev
            const copy = { ...prev }
            delete copy.roster
            return copy
          })

          // Calculate added and removed students for log
          const oldIds = new Set(rosterState.map(s => s.id.split('-')[0]))
          const newIds = new Set(selectedList.map(s => s.id))
          
          const addedCount = selectedList.filter(s => !oldIds.has(s.id)).length
          const removedCount = rosterState.filter(s => !newIds.has(s.id.split('-')[0])).length
          
          let actionText = `Đã cập nhật danh sách xếp lớp học viên.`
          if (addedCount > 0 && removedCount > 0) {
            actionText = `Đã cập nhật danh sách xếp lớp: thêm ${addedCount} học viên mới và bớt ${removedCount} học viên khỏi lớp học.`
          } else if (addedCount > 0) {
            actionText = `Đã xếp lớp/thêm ${addedCount} học viên mới vào danh sách lớp học.`
          } else if (removedCount > 0) {
            actionText = `Đã bớt/xóa ${removedCount} học viên khỏi danh sách lớp học.`
          }

          // Append log entry
          setLogs((prev) => [
            { 
              id: Math.random().toString(), 
              action: actionText, 
              operator: 'Giáo vụ Lan', 
              timestamp: timeStr 
            },
            ...prev
          ])
          
          setIsStudentSelectOpen(false)

          if (onSave) {
            onSave({
              ...cls,
              enrolledStudents: updatedRoster.filter((s) => s.status === 'active' || s.status === 'new').length
            })
          }
        }}
      />

      {/* Confirm dialog for status transitions */}
      <ConfirmDialog
        open={!!confirmStatusChange}
        onOpenChange={(open) => { if (!open) setConfirmStatusChange(null) }}
        title={confirmStatusChange?.title || ''}
        description={confirmStatusChange?.description || ''}
        confirmLabel="Đồng ý"
        cancelLabel="Hủy"
        variant={confirmStatusChange?.newStatus === 'huy' ? 'destructive' : 'default'}
        onConfirm={() => {
          if (confirmStatusChange) {
            handleStatusChange(confirmStatusChange.newStatus, confirmStatusChange.actionText)
            setConfirmStatusChange(null)
          }
        }}
      />

      <StudentDetailDialog
        studentId={selectedStudentId}
        open={!!selectedStudentId}
        onOpenChange={(open) => {
          if (!open) setSelectedStudentId(null)
        }}
        fromClassName={cls.name}
      />
    </div>
  )
}
