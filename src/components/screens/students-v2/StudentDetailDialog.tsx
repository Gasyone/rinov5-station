'use client'

import { useState, useMemo } from 'react'
import {
  MessageSquare,
  Clock,
  SendHorizontal,
  Pencil,
  BookOpen,
  MapPin,
  Sparkles,
  Phone,
  LifeBuoy,
  Play
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InfoField, StatusBadge, EmptyState } from '@/components/shared'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockStudents, type Student } from '@/mocks/students'
import { STUDENT_STATUS_LABELS } from './studentTypes'
import { useCallStore } from '@/stores/useCallStore'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Import V2 Tab Components
import { StudentDetailOverviewTab } from './StudentDetailOverviewTab'
import { StudentDetailClassesTab } from './StudentDetailClassesTab'
import { StudentDetailScheduleTab } from './StudentDetailScheduleTab'
import { StudentDetailAcademicTab } from './StudentDetailAcademicTab'
import { StudentDetailBookingTrialTab } from './StudentDetailBookingTrialTab'
import { StudentDetailOrdersTab } from './StudentDetailOrdersTab'
import { StudentDetailTicketsTab } from './StudentDetailTicketsTab'
import { StudentDetailGlobalLogsTab } from './StudentDetailGlobalLogsTab'

// Import V2 Helpers
import {
  getStudentPackagesV2,
  getStudentGlobalLogsV2,
  getStudentScheduleSessionsV2,
  type StudentGlobalLogV2
} from './studentsV2Helpers'

interface StudentNoteV2 {
  id: string
  text: string
  author: string
  timestamp: string
}

interface StudentDetailDialogProps {
  studentId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTicket?: (studentId: string) => void
}

export function StudentDetailDialog({
  studentId,
  open,
  onOpenChange,
  onCreateTicket
}: StudentDetailDialogProps) {
  const [activeTab, setActiveTab] = useState('classes')
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'logs'>('notes')
  const [noteInput, setNoteInput] = useState('')

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editFormState, setEditFormState] = useState<Student | null>(null)
  const [revision, setRevision] = useState(0)

  // Local notes and audit logs state
  const [prevStudentId, setPrevStudentId] = useState<string | null>(null)
  const [notes, setNotes] = useState<StudentNoteV2[]>([])
  const [sideLogs, setSideLogs] = useState<StudentGlobalLogV2[]>([])

  const student = useMemo(() => {
    return studentId ? mockStudents.find((s) => s.id === studentId) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, revision])

  // Sync state when studentId changes
  if (student && student.id !== prevStudentId) {
    setPrevStudentId(student.id)
    setIsEditing(false)
    setEditFormState(student)
    
    // Set base mock notes
    setNotes([
      {
        id: `note-${student.id}-1`,
        text: `Mẹ phản hồi học viên rất hào hứng sau buổi học đầu tiên, mong muốn giáo viên quan tâm phần phát âm hơn.`,
        author: 'CSM Minh Phương',
        timestamp: '10:00 01/06/2026',
      },
      {
        id: `note-${student.id}-2`,
        text: `Sales note: Học viên nhút nhát, cần xếp lớp sỹ số nhỏ để tương tác được nhiều. Phụ huynh đồng ý cam kết đầu ra.`,
        author: student.saleName || 'Sale Consultant',
        timestamp: '15:30 15/05/2026',
      },
    ])

    // Set base side logs
    setSideLogs([
      {
        id: 'init-l',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date().toLocaleDateString('vi-VN'),
        action: `Mở hồ sơ chi tiết học viên V2 ${student.name}.`,
        operator: 'Hệ thống',
      }
    ])
  }

  // Get packages and system logs
  const packages = useMemo(() => (student ? getStudentPackagesV2(student) : []), [student])
  const globalTimelineLogs = useMemo(() => (student ? getStudentGlobalLogsV2(student) : []), [student])
  const scheduleSessions = useMemo(() => (student ? getStudentScheduleSessionsV2(student) : []), [student])

  const handleSaveStudent = () => {
    if (!editFormState || !student) return
    if (!editFormState.name?.trim()) {
      toast.error('Họ và tên không được để trống!')
      return
    }

    const idx = mockStudents.findIndex((s) => s.id === student.id)
    if (idx !== -1) {
      mockStudents[idx] = {
        ...mockStudents[idx],
        ...editFormState,
      }
    }

    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `Đã cập nhật thông tin chi tiết học viên (V2).`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setRevision((r) => r + 1)
    setIsEditing(false)
    toast.success('Cập nhật thông tin học viên thành công!')
  }

  const handleAddNote = () => {
    if (!noteInput.trim()) return
    const now = new Date()
    const timestampStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`
    
    const newNoteText = noteInput.trim()
    
    setNotes((prev) => [
      {
        id: Math.random().toString(),
        text: newNoteText,
        author: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setSideLogs((prev) => [
      {
        id: Math.random().toString(),
        action: `Đã thêm ghi chú tương tác (V2): "${newNoteText.substring(0, 35)}${newNoteText.length > 35 ? '...' : ''}"`,
        operator: 'Giáo vụ Lan',
        timestamp: timestampStr
      },
      ...prev
    ])

    setNoteInput('')
  }

  if (!student) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <EmptyState
            title="Không tìm thấy học viên"
            description="Học viên này không tồn tại hoặc đã bị xóa khỏi hệ thống."
          />
        </DialogContent>
      </Dialog>
    )
  }

  const studentCode = `STU-00${student.id.replace('s', '')}`
  const studentAvatar = student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid h-[90vh] max-h-[900px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] bg-background">
        
        {/* 1. Header Banner */}
        <DialogHeader className="shrink-0 border-b bg-muted/10 px-6 pb-4 pt-6">
          <div className="flex flex-col gap-4">
            
            {/* Top row: Title + Badges + Action Buttons */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar className="h-12 w-12 shrink-0 border-2 border-primary/10">
                  <AvatarImage src={studentAvatar} alt={student.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                    {student.name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <DialogTitle className="flex flex-wrap items-center gap-2 text-xl font-bold text-foreground">
                    {student.name}
                    <StatusBadge status={student.status} label={STUDENT_STATUS_LABELS[student.status] ?? student.status} />
                    <Badge variant="outline" className="rounded-md font-mono text-xs">
                      {studentCode}
                    </Badge>
                  </DialogTitle>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {student.branch}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Trình độ: {student.level || '-'} • Sub-level: {student.subLevel || 'Chưa test'} • Lớp: {student.schoolClass || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-end shrink-0 pr-8 gap-2">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false)
                          setEditFormState(student)
                        }}
                        className="rounded-lg text-xs h-8 px-3"
                      >
                        Hủy
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveStudent}
                        className="bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg text-xs h-8 px-3 font-semibold"
                      >
                        Lưu thay đổi
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Gọi điện cho phụ huynh"
                        onClick={() =>
                          useCallStore.getState().startCall({
                            studentId: student.id,
                            studentName: student.name,
                            parentPhone: student.parentPhone || '0987654321',
                            parentName: student.parentName || `Phụ huynh em ${student.name}`,
                          })
                        }
                        className="rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 h-8 px-3 text-xs"
                      >
                        <Phone className="h-3.5 w-3.5 mr-1.5" /> Gọi điện
                      </Button>

                      {onCreateTicket && (
                        <Button
                          variant="outline"
                          size="sm"
                          title="Tạo Ticket Chăm sóc"
                          onClick={() => {
                            onOpenChange(false)
                            onCreateTicket(student.id)
                          }}
                          className="rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 h-8 px-3 text-xs"
                        >
                          <LifeBuoy className="h-3.5 w-3.5 mr-1.5" /> Tạo Ticket
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditing(true)
                          setEditFormState(student)
                          setActiveTab('overview')
                        }}
                        className="rounded-lg h-8 px-3 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1.5" /> Chỉnh sửa hồ sơ
                      </Button>
                    </>
                  )}
                </div>

                {/* Next lesson badge */}
                {student.enrolledClasses && student.enrolledClasses.length > 0 && student.enrolledClasses[0].nextLessonDate && (
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 border border-primary/20 text-primary text-[10px] font-semibold justify-end shadow-xs whitespace-nowrap">
                    <Play className="h-3 w-3 text-primary animate-pulse shrink-0" />
                    <span>Buổi học tiếp theo: <strong>{student.enrolledClasses[0].nextLessonDate} ({student.enrolledClasses[0].className} · {student.enrolledClasses[0].room || 'P201'})</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Cơ sở đào tạo" value={student.branch} />
              <InfoField label="Ngày nhập học" value={new Date(student.enrollmentDate).toLocaleDateString('vi-VN')} />
              <InfoField
                label="Số gói đã mua"
                value={`${packages.length} gói`}
                supporting={
                  <span className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground font-semibold">
                    <Sparkles className="h-3 w-3 text-purple-600 animate-pulse" />
                    <span>Gói đang kích hoạt</span>
                  </span>
                }
              />
            </div>
          </div>
        </DialogHeader>

        {/* 2. Split Body Layout (70% Left Tabs / 30% Right Sidebar) */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-6 pt-4">
          <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[1fr_320px]">
            
            {/* Left CONTENT: Main Tabs */}
            <main className="flex min-h-0 flex-col overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex min-h-0 flex-1 flex-col">
                <TabsList variant="line" className="shrink-0 justify-start border-none p-0 gap-4 sm:gap-6 h-9 w-full overflow-x-auto scrollbar-none">
                  <TabsTrigger
                    value="classes"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Lớp học đang học
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Lịch học
                  </TabsTrigger>
                  <TabsTrigger
                    value="academic"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Năng lực & Đánh giá
                  </TabsTrigger>
                  <TabsTrigger
                    value="booking-trial"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Test & Học thử
                  </TabsTrigger>
                  <TabsTrigger
                    value="packages"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Danh sách gói học
                  </TabsTrigger>
                  <TabsTrigger
                    value="tickets"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Yêu cầu hỗ trợ (Tickets)
                  </TabsTrigger>
                  <TabsTrigger
                    value="overview"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Thông tin tổng quan
                  </TabsTrigger>
                  <TabsTrigger
                    value="logs"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs flex items-center gap-1.5 ml-auto focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none border-none shrink-0"
                  >
                    Lịch sử toàn cục
                  </TabsTrigger>
                </TabsList>

                {/* Tab content wrapper */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 pt-4">
                  <TabsContent value="classes" className="m-0 focus-visible:outline-none">
                    <StudentDetailClassesTab student={student} />
                  </TabsContent>
                  <TabsContent value="schedule" className="m-0 focus-visible:outline-none">
                    <StudentDetailScheduleTab sessions={scheduleSessions} />
                  </TabsContent>
                  <TabsContent value="academic" className="m-0 focus-visible:outline-none">
                    <StudentDetailAcademicTab student={student} />
                  </TabsContent>
                  <TabsContent value="booking-trial" className="m-0 focus-visible:outline-none">
                    <StudentDetailBookingTrialTab student={student} />
                  </TabsContent>
                  <TabsContent value="packages" className="m-0 focus-visible:outline-none">
                    <StudentDetailOrdersTab />
                  </TabsContent>
                  <TabsContent value="tickets" className="m-0 focus-visible:outline-none">
                    <StudentDetailTicketsTab studentId={student.id} />
                  </TabsContent>
                  <TabsContent value="overview" className="m-0 focus-visible:outline-none">
                    <StudentDetailOverviewTab
                      student={student}
                      isEditing={isEditing}
                      editFormState={editFormState}
                      onEditStateChange={setEditFormState}
                    />
                  </TabsContent>
                  <TabsContent value="logs" className="m-0 focus-visible:outline-none">
                    <StudentDetailGlobalLogsTab logs={globalTimelineLogs} />
                  </TabsContent>
                </div>
              </Tabs>
            </main>

            {/* Right: Notes & Logs Side panel */}
            <aside className="flex min-h-0 flex-col overflow-hidden border-l pl-6">
              <Tabs
                value={activeSideTab}
                onValueChange={(val) => setActiveSideTab(val as 'notes' | 'logs')}
                className="flex min-h-0 flex-1 flex-col"
              >
                <TabsList variant="line" className="shrink-0 w-full border-none p-0 gap-6 h-9 flex justify-start">
                  <TabsTrigger
                    value="notes"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus:ring-0 shadow-none border-none"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Tương tác ({notes.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="logs"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 font-semibold text-xs h-9 py-0 flex items-center gap-1.5 focus:outline-none focus:ring-0 shadow-none border-none"
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Nhật ký nhanh ({sideLogs.length})
                  </TabsTrigger>
                </TabsList>

                {/* Tab content: Interactive Notes */}
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

                    {/* Note Input Textarea */}
                    <div className="relative shrink-0 border-none pt-3 mt-3 bg-background">
                      <Textarea
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Ghi chú tương tác học tập/CSKH..."
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

                {/* Tab Content: Quick logs */}
                <TabsContent value="logs" className="min-h-0 flex-1 overflow-y-auto m-0 pt-3 pr-1 focus-visible:outline-none">
                  <div className="relative border-l border-border pl-4 ml-2 space-y-4 pt-1">
                    {sideLogs.map((log) => (
                      <div key={log.id} className="relative text-xs">
                        <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                        <div className="text-[10px] text-muted-foreground font-mono">{log.timestamp}</div>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{log.action}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Thao tác bởi: {log.operator}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </aside>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
