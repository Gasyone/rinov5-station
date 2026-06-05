'use client'

import { useState } from 'react'
import {
  Play,
  MessageSquare,
  Clock,
  SendHorizontal,
  Pencil,
  GraduationCap,
  BookOpen,
  MapPin,
  Sparkles,
  Pause,
  Ban,
  Undo
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { InfoField, StatusBadge, ConfirmDialog } from '@/components/shared'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS } from '@/mocks/classRecords'

// Import Sub-components
import { ClassesDetailOverview } from './ClassesDetailOverview'
import { ClassesDetailRoster } from './ClassesDetailRoster'
import { ClassesDetailRoadmap } from './ClassesDetailRoadmap'
import { ClassesDetailSessions } from './ClassesDetailSessions'
import { ClassesDetailSchedule } from './ClassesDetailSchedule'
import { StudentSelectionDialog } from '../StudentSelectionDialog'
import { ClassesRoadmapWizardView } from './ClassesRoadmapWizardView'

// Import Helper utilities
import { generateMockRoster, generateRoadmapSessions } from './classesDetailHelpers'
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
  hideClassType = false
}: ClassesDetailViewProps) {
  const [activeTab, setActiveTab] = useState('roster')
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'logs'>('notes')
  const [noteInput, setNoteInput] = useState('')
  const [isStudentSelectOpen, setIsStudentSelectOpen] = useState(false)
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
  const [confirmStatusChange, setConfirmStatusChange] = useState<{
    newStatus: ClassRecord['status']
    actionText: string
    title: string
    description: string
  } | null>(null)

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
    if (!editFormState.name.trim()) {
      alert('Tên lớp không được để trống!')
      return
    }
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
    if (onStatusChange && cls) {
      onStatusChange(cls.id, newStatus)
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
      setLogs((prev) => [
        { id: Math.random().toString(), action: actionText, operator: 'Giáo vụ Lan', timestamp: timeStr },
        ...prev
      ])
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
  const isSĩSốCảnhBáo = enrollmentPercentage >= 90

  return (
    <div className="grid h-full w-full grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden bg-background">
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
            lastChangedInfo={roadmapLastChangedInfo}
            onBack={() => setIsRoadmapWizardOpen(false)}
            onSave={(updatedSessions, logMessage, newSyllabusName) => {
              setSessionsState(updatedSessions)
              setSyllabusState(newSyllabusName)
              
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
          {/* 1. Header Banner thông minh */}
          <DialogHeader className="shrink-0 border-b bg-muted/10 px-6 pb-4 pt-6">
            <div className="flex flex-col gap-4">
              
              {/* Top row: Title + State + Buttons (with Next Session below) */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <DialogTitle className="flex flex-wrap items-center gap-2 text-xl font-bold text-foreground">
                    {cls.name}
                    <StatusBadge status={cls.status} label={CLASS_STATUS_LABELS[cls.status]} />
                    <Badge variant="outline" className="rounded-md font-mono text-xs">
                      {cls.code}
                    </Badge>
                  </DialogTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {cls.branch}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Chương trình: {cls.level || 'Chưa gán'} • Level (trình độ): {cls.subLevel || 'Chưa gán'}
                    </span>
                  </div>
                </div>
                
                {/* Action buttons & Next Session Chip right under */}
                <div className="flex flex-col items-end shrink-0 pr-8 gap-2">
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(false)
                            setEditFormState(cls)
                          }}
                          className="rounded-lg text-xs h-8 px-3"
                        >
                          Hủy
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleSave}
                          className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg text-xs h-8 px-3 font-semibold"
                        >
                          Lưu thay đổi
                        </Button>
                      </>
                    ) : (
                      <>
                        {cls.status !== 'huy' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setIsEditing(true)
                              setEditFormState(cls)
                            }}
                            className="rounded-lg h-8 text-xs"
                          >
                            <Pencil className="h-4 w-4 mr-1.5" /> Chỉnh sửa
                          </Button>
                        )}

                        {/* Nháp transitions */}
                        {cls.status === 'nhap' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="rounded-lg h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/95 font-semibold"
                              onClick={() => handleStatusChange('cho_khai_giang', 'Đã kích hoạt lớp học sang trạng thái Chờ khai giảng.')}
                            >
                              <Play className="h-4 w-4 mr-1.5" /> Kích hoạt chờ khai giảng
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-lg h-8 text-xs"
                              onClick={() => setConfirmStatusChange({
                                newStatus: 'huy',
                                actionText: 'Đã hủy/kết thúc lớp học nháp.',
                                title: 'Hủy/Kết thúc lớp học',
                                description: 'Bạn có chắc chắn muốn hủy/kết thúc lớp học nháp này? Trạng thái lớp sẽ chuyển sang Đã kết thúc.'
                              })}
                            >
                              <Ban className="h-4 w-4 mr-1.5" /> Hủy/Kết thúc lớp
                            </Button>
                          </>
                        )}

                        {/* Chờ khai giảng transitions */}
                        {cls.status === 'cho_khai_giang' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg h-8 text-xs"
                              onClick={() => setConfirmStatusChange({
                                newStatus: 'nhap',
                                actionText: 'Đã chuyển lớp học trở lại trạng thái Nháp.',
                                title: 'Quay về lớp Nháp',
                                description: 'Bạn có chắc chắn muốn chuyển lớp học này quay trở lại trạng thái Nháp để điều chỉnh thông tin?'
                              })}
                            >
                              <Undo className="h-4 w-4 mr-1.5" /> Quay về nháp
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-lg h-8 text-xs"
                              onClick={() => setConfirmStatusChange({
                                newStatus: 'huy',
                                actionText: 'Đã hủy lịch chờ khai giảng của lớp học.',
                                title: 'Hủy/Kết thúc lớp học',
                                description: 'Bạn có chắc chắn muốn hủy lịch khai giảng của lớp này? Trạng thái lớp sẽ được chuyển sang Đã kết thúc.'
                              })}
                            >
                              <Ban className="h-4 w-4 mr-1.5" /> Hủy/Kết thúc lớp
                            </Button>
                          </>
                        )}

                        {/* Đang học transitions */}
                        {cls.status === 'dang_hoc' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg h-8 text-xs border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 dark:text-amber-300 font-semibold"
                              onClick={() => setConfirmStatusChange({
                                newStatus: 'tam_dung',
                                actionText: 'Đã chuyển lớp học sang trạng thái Tạm nghỉ.',
                                title: 'Tạm nghỉ lớp học',
                                description: 'Bạn có chắc chắn muốn tạm ngưng vận hành lớp học này và chuyển sang trạng thái Tạm nghỉ?'
                              })}
                            >
                              <Pause className="h-4 w-4 mr-1.5" /> Tạm nghỉ
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-8 text-xs font-semibold"
                              onClick={() => setConfirmStatusChange({
                                newStatus: 'huy',
                                actionText: 'Tốt nghiệp & Kết thúc lớp học thành công.',
                                title: 'Tốt nghiệp & Kết thúc lớp học',
                                description: 'Bạn có chắc chắn muốn tốt nghiệp học viên và kết thúc lớp học này? Trạng thái lớp sẽ chuyển sang Đã kết thúc.'
                              })}
                            >
                              <GraduationCap className="h-4 w-4 mr-1.5" /> Tốt nghiệp & Kết thúc
                            </Button>
                          </>
                        )}

                        {/* Tạm nghỉ transitions */}
                        {cls.status === 'tam_dung' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-8 text-xs font-semibold"
                              onClick={() => handleStatusChange('dang_hoc', 'Đã kích hoạt lớp học đang tạm nghỉ quay trở lại Đang học.')}
                            >
                              <Play className="h-4 w-4 mr-1.5" /> Mở lại (Đang học)
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="rounded-lg h-8 text-xs"
                              onClick={() => setConfirmStatusChange({
                                newStatus: 'huy',
                                actionText: 'Đã hủy/kết thúc lớp học đang tạm nghỉ.',
                                title: 'Hủy/Kết thúc lớp học',
                                description: 'Bạn có chắc chắn muốn hủy/kết thúc hẳn lớp học đang tạm nghỉ này? Trạng thái lớp sẽ chuyển sang Đã kết thúc.'
                              })}
                            >
                              <Ban className="h-4 w-4 mr-1.5" /> Hủy/Kết thúc lớp
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Buổi học tiếp theo positioned right under action buttons */}
                  {cls.nextSession && (
                    <div className="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 border border-primary/20 text-primary text-[10px] font-semibold max-w-xs justify-end shadow-xs">
                      <Play className="h-3 w-3 animate-pulse" />
                      <span>Buổi kế tiếp: <strong>{cls.nextSession.date} ({cls.nextSession.time} · {cls.nextSession.room})</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Info Grid for Summary (Removed tuition, added opening & trial counts) */}
              <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoField label="Giáo viên chủ nhiệm" value={cls.teacher} supporting={`SĐT: ${cls.teacherPhone}`} />
                <InfoField label="Lịch cố định hàng tuần" value={cls.schedule} supporting={`Phòng học mặc định: ${cls.room}`} />
                <InfoField 
                  label="Sĩ số Roster" 
                  value={
                    <div className="flex items-center gap-2">
                      <span className={isSĩSốCảnhBáo ? 'font-bold text-destructive' : 'font-bold'}>
                        {cls.enrolledStudents} / {cls.maxStudents} học viên
                      </span>
                      <span className="text-xs text-muted-foreground">({enrollmentPercentage}%)</span>
                    </div>
                  }
                  supporting={
                    <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                      <div 
                        className={`h-full rounded-full ${isSĩSốCảnhBáo ? 'bg-destructive' : 'bg-primary'}`} 
                        style={{ width: `${Math.min(100, enrollmentPercentage)}%` }}
                      />
                    </div>
                  }
                />
                <InfoField 
                  label="Ngày khai giảng" 
                  value={new Date(cls.startDate).toLocaleDateString('vi-VN')} 
                  supporting={
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground font-medium">
                      <Sparkles className="h-3 w-3 text-purple-600" />
                      <span>Học viên Trial: <strong>{cls.trialStudents ?? 0} học viên</strong></span>
                    </div>
                  }
                />
              </div>

            </div>
          </DialogHeader>

          {/* 2. Split Body: 70% Left Tabs / 30% Right Notes & Logs */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-4">
            <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_320px]">
              
              {/* Left: 70% Content Area */}
              <main className="flex min-h-0 flex-col overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
                  <TabsList variant="line" className="shrink-0 justify-start border-none p-0 gap-6 h-9 w-full">
                    <TabsTrigger 
                      value="roster" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                    >
                      Học viên (Roster)
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
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                    >
                      Lịch học cố định
                    </TabsTrigger>
                    <TabsTrigger 
                      value="overview" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 ml-auto focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none shadow-none border-none"
                    >
                      Tổng quan
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab scroll container */}
                  <div className="flex-1 min-h-0 overflow-y-auto pr-2">
                    
                    {/* Tab Roster học viên */}
                    <TabsContent value="roster" className="m-0 focus-visible:outline-none">
                      <ClassesDetailRoster 
                        students={rosterState} 
                        onAddStudent={() => setIsStudentSelectOpen(true)} 
                        onRemoveStudent={(studentId) => {
                          const student = rosterState.find(s => s.id === studentId)
                          if (!student) return
                          
                          setRosterState((prev) => prev.filter((s) => s.id !== studentId))
                          
                          // Log this removal
                          const now = new Date()
                          const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
                          setLogs((prev) => [
                            { id: Math.random().toString(), action: `Đã xóa học viên ${student.name} khỏi lớp học.`, operator: 'Giáo vụ Lan', timestamp: timeStr },
                            ...prev
                          ])
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
                        onUpdateSchedule={(newSlots) => {
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
                        onEditStateChange={setEditFormState}
                        hideClassType={hideClassType}
                      />
                    </TabsContent>

                  </div>
                </Tabs>
              </main>

              {/* Right: 30% Notes & Logs Side Panel */}
              <aside className="flex min-h-0 flex-col overflow-hidden border-l pl-6">
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
                      <div className="min-h-0 flex-1 overflow-y-auto space-y-3 pr-1">
                        {notes.map((note) => (
                          <div key={note.id} className="rounded-xl border bg-muted/25 p-3 shadow-xs border-muted">
                            <p className="text-xs text-foreground leading-relaxed">{note.text}</p>
                            <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                              <span className="font-semibold text-primary">{note.author}</span>
                              <span className="font-mono">{note.timestamp}</span>
                            </div>
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
            const existing = rosterState.find((s) => s.id === item.id)
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

          // Append log entry
          setLogs((prev) => [
            { 
              id: Math.random().toString(), 
              action: `Đã xếp lớp/thêm ${selectedList.length} học viên mới vào danh sách lớp học.`, 
              operator: 'Giáo vụ Lan', 
              timestamp: timeStr 
            },
            ...prev
          ])
          
          setIsStudentSelectOpen(false)
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
    </div>
  )
}
