'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { CalendarDays, CheckCircle2, Clock, RefreshCw, Route } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ConfirmDialog, FieldLabel } from '@/components/shared'
import type { ClassRecord, ScheduleSlot } from '@/mocks/classRecords'

import { ClassesAddScheduleDialog } from './ClassesAddScheduleDialog'
import { ClassesSessionActionDialog } from './ClassesSessionActionDialog'
import { ClassesSessionCard } from './ClassesSessionCard'
import { ClassesSessionDetailDialog } from './ClassesSessionDetailDialog'
import type { RoadmapSession, RosterStudent, ClassNote, ClassAuditLog } from './classesDetailTypes'

interface ClassesDetailSessionsV2Props {
  cls: ClassRecord
  sessions: RoadmapSession[]
  roster: RosterStudent[]
  onUpdateSession: (id: string, updates: Partial<RoadmapSession>) => void
  classNotes?: ClassNote[]
  classLogs?: ClassAuditLog[]
  onAddClassNote?: (text: string) => void
  onEditRoadmap?: () => void
}

type SessionEditType = 'teacher' | 'room' | 'upload' | 'reschedule'
type CancelBy = 'HỌC SINH' | 'GIÁO VIÊN' | 'KHÁC'

const studentCancelReasons = [
  'Cancel 10 phút',
  'Cancel 20 phút',
  'Học sinh nghỉ đột xuất',
  'Học sinh gặp sự cố kĩ thuật trong giờ (trước ST+15/30)',
  'Học sinh gặp sự cố kĩ thuật trong giờ (sau ST+15/30)',
]

const teacherCancelReasons = [
  'Hủy 1A - Báo trước ngày học',
  'Hủy 1B - Báo trong ngày học, trước 17h30',
  'Hủy 2 - Báo trước 30 phút trước giờ học',
  'Hủy 3A - Giáo viên không vào lớp',
  'Hủy 3B - Giáo viên vào lớp nhưng xin nghỉ đột xuất',
  'Giáo viên gặp sự cố kĩ thuật trong giờ (trước ST+15/30)',
  'Giáo viên gặp sự cố kĩ thuật trong giờ (sau ST+15/30)',
]

export function ClassesDetailSessionsV2({
  cls,
  sessions,
  roster,
  onUpdateSession,
  classNotes,
  classLogs,
  onAddClassNote,
  onEditRoadmap,
}: ClassesDetailSessionsV2Props) {
  const [selectedDetailSession, setSelectedDetailSession] = useState<RoadmapSession | null>(null)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editType, setEditType] = useState<SessionEditType | null>(null)
  const [selectedStudentForUpload, setSelectedStudentForUpload] = useState<RosterStudent | null>(null)

  const [sessionToDeleteMat, setSessionToDeleteMat] = useState<{
    sessionId: string
    materialName: string
    isSlide: boolean
  } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const [cancelingSessionId, setCancelingSessionId] = useState<string | null>(null)
  const [cancelBy, setCancelBy] = useState<CancelBy>('HỌC SINH')
  const [cancelReason, setCancelReason] = useState<string>('')
  const [cancelDescription, setCancelDescription] = useState<string>('')

  // Grouping Sessions into 3 Flat Groups: Hôm nay, Sắp tới, Đã học
  const todaySessions = useMemo(() => {
    const ongoing = sessions.filter((s) => s.status === 'ongoing')
    if (ongoing.length > 0) return ongoing
    // Pick first upcoming as current/today if no ongoing
    const firstUpcoming = sessions.find((s) => s.status === 'upcoming')
    return firstUpcoming ? [firstUpcoming] : []
  }, [sessions])

  const upcomingSessions = useMemo(() => {
    const todayIds = new Set(todaySessions.map((s) => s.id))
    return sessions.filter((s) => s.status === 'upcoming' && !todayIds.has(s.id))
  }, [sessions, todaySessions])

  const completedSessions = useMemo(() => {
    return sessions.filter((s) => s.status === 'completed' || s.status === 'cancelled' || s.status === 'absent')
  }, [sessions])

  const activeSession = useMemo(() => {
    if (!editingSessionId) return null
    return sessions.find((s) => s.id === editingSessionId) ?? null
  }, [editingSessionId, sessions])

  const handleOpenEdit = (sessionId: string, type: SessionEditType, student?: RosterStudent) => {
    setEditingSessionId(sessionId)
    setEditType(type)
    if (student) setSelectedStudentForUpload(student)
  }

  const handleOpenCancelModal = (sessionId: string) => {
    setCancelingSessionId(sessionId)
    setCancelBy('HỌC SINH')
    setCancelReason('')
    setCancelDescription('')
  }

  const handleConfirmDeleteMaterial = () => {
    if (!sessionToDeleteMat) return
    const target = sessions.find((s) => s.id === sessionToDeleteMat.sessionId)
    if (!target) return

    const updated = (target.materials || []).filter((m) => m.name !== sessionToDeleteMat.materialName)
    onUpdateSession(sessionToDeleteMat.sessionId, { materials: updated })
    toast.success('Đã xóa tài liệu khỏi buổi học')
    setSessionToDeleteMat(null)
    setDeleteConfirmOpen(false)
  }

  const handleConfirmCancel = () => {
    if (!cancelingSessionId) return
    if (!cancelReason && cancelBy !== 'KHÁC') {
      toast.error('Vui lòng chọn lý do hủy buổi!')
      return
    }
    onUpdateSession(cancelingSessionId, {
      status: 'cancelled',
      cancelBy,
      cancelReason: cancelBy === 'KHÁC' ? 'Hủy do các sự cố khách quan khác' : cancelReason,
      cancelDescription,
    })
    toast.success('Đã ghi nhận hủy buổi học!')
    setCancelingSessionId(null)
  }

  return (
    <div className="space-y-6 pb-6 pt-1">

      {/* GROUP 1: HÔM NAY */}
      <section className="space-y-2">
        <div className="flex items-center justify-between pt-1 pb-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold text-foreground">
              Hôm nay
            </h3>
            <span className="text-xs text-muted-foreground font-normal">
              ({todaySessions.length})
            </span>
          </div>
        </div>

        {todaySessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/50 bg-muted/5 p-4 text-center text-xs text-muted-foreground italic">
            Không có buổi học nào hôm nay
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {todaySessions.map((session) => (
              <ClassesSessionCard
                key={`v2-today-${session.id}`}
                session={session}
                roster={roster}
                onView={(s) => setSelectedDetailSession(s)}
                onCancel={handleOpenCancelModal}
                onEditTeacher={(id) => handleOpenEdit(id, 'teacher')}
                onEditRoom={(id) => handleOpenEdit(id, 'room')}
                onUpload={(id) => handleOpenEdit(id, 'upload')}
                onReschedule={(id) => handleOpenEdit(id, 'reschedule')}
                onDeleteMaterial={(id, name, isSlide) => {
                  setSessionToDeleteMat({ sessionId: id, materialName: name, isSlide })
                  setDeleteConfirmOpen(true)
                }}
                onUpdateSession={onUpdateSession}
              />
            ))}
          </div>
        )}
      </section>

      {/* GROUP 2: SẮP TỚI */}
      <section className="space-y-2 pt-2">
        <div className="flex items-center gap-2 pt-2 pb-1">
          <Clock className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-xs font-bold text-foreground">
            Sắp tới
          </h3>
          <span className="text-xs text-muted-foreground font-normal">
            ({upcomingSessions.length})
          </span>
        </div>

        {upcomingSessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/50 bg-muted/5 p-4 text-center text-xs text-muted-foreground italic">
            Không có buổi học nào sắp tới
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {upcomingSessions.map((session) => (
              <ClassesSessionCard
                key={`v2-upcoming-${session.id}`}
                session={session}
                roster={roster}
                onView={(s) => setSelectedDetailSession(s)}
                onCancel={handleOpenCancelModal}
                onEditTeacher={(id) => handleOpenEdit(id, 'teacher')}
                onEditRoom={(id) => handleOpenEdit(id, 'room')}
                onUpload={(id) => handleOpenEdit(id, 'upload')}
                onReschedule={(id) => handleOpenEdit(id, 'reschedule')}
                onDeleteMaterial={(id, name, isSlide) => {
                  setSessionToDeleteMat({ sessionId: id, materialName: name, isSlide })
                  setDeleteConfirmOpen(true)
                }}
                onUpdateSession={onUpdateSession}
              />
            ))}
          </div>
        )}
      </section>

      {/* GROUP 3: ĐÃ HỌC */}
      <section className="space-y-2 pt-2">
        <div className="flex items-center gap-2 pt-2 pb-1">
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xs font-bold text-foreground">
            Đã học
          </h3>
          <span className="text-xs text-muted-foreground font-normal">
            ({completedSessions.length})
          </span>
        </div>

        {completedSessions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/50 bg-muted/5 p-4 text-center text-xs text-muted-foreground italic">
            Chưa có buổi học nào hoàn thành
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {completedSessions.map((session) => (
              <ClassesSessionCard
                key={`v2-completed-${session.id}`}
                session={session}
                roster={roster}
                onView={(s) => setSelectedDetailSession(s)}
                onCancel={handleOpenCancelModal}
                onEditTeacher={(id) => handleOpenEdit(id, 'teacher')}
                onEditRoom={(id) => handleOpenEdit(id, 'room')}
                onUpload={(id) => handleOpenEdit(id, 'upload')}
                onReschedule={(id) => handleOpenEdit(id, 'reschedule')}
                onDeleteMaterial={(id, name, isSlide) => {
                  setSessionToDeleteMat({ sessionId: id, materialName: name, isSlide })
                  setDeleteConfirmOpen(true)
                }}
                onUpdateSession={onUpdateSession}
              />
            ))}
          </div>
        )}
      </section>

      {/* Confirm Delete Material Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xóa tài liệu"
        description={
          sessionToDeleteMat
            ? `Bạn có chắc muốn xóa tài liệu "${sessionToDeleteMat.materialName}" khỏi buổi học này?`
            : ''
        }
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={handleConfirmDeleteMaterial}
      />

      {/* Session Details Dialog */}
      {selectedDetailSession && (
        <ClassesSessionDetailDialog
          isOpen={!!selectedDetailSession}
          onClose={() => setSelectedDetailSession(null)}
          session={selectedDetailSession}
          sessions={sessions}
          cls={cls}
          roster={roster}
          onCancel={handleOpenCancelModal}
          onEditTeacher={(id) => handleOpenEdit(id, 'teacher')}
          onEditRoom={(id) => handleOpenEdit(id, 'room')}
          onUpload={(id, student) => handleOpenEdit(id, 'upload', student)}
          classNotes={classNotes}
          classLogs={classLogs}
          onAddClassNote={onAddClassNote}
          isOpenedFromClassScreen={true}
        />
      )}

      {/* Session Action Edit Dialog (Teacher, Room, Upload) */}
      {editingSessionId !== null && editType !== null && (
        <ClassesSessionActionDialog
          key={`${editingSessionId}-${editType}`}
          isOpen={editingSessionId !== null}
          onClose={() => {
            setEditingSessionId(null)
            setEditType(null)
            setSelectedStudentForUpload(null)
          }}
          session={activeSession}
          type={editType}
          onSave={onUpdateSession}
          student={selectedStudentForUpload}
        />
      )}

      {/* Cancel Session Modal */}
      {cancelingSessionId !== null && (
        <Dialog open={cancelingSessionId !== null} onOpenChange={(open) => { if (!open) setCancelingSessionId(null) }}>
          <DialogContent className="max-w-[450px] rounded-lg bg-background p-5 shadow-2xl">
            <DialogHeader className="mb-4 border-b pb-3">
              <DialogTitle className="text-base font-bold text-foreground">
                Khai báo buổi hủy
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <FieldLabel label="Hủy do" required>
                <Select value={cancelBy} onValueChange={(val) => setCancelBy(val as CancelBy)}>
                  <SelectTrigger className="h-9 w-full text-xs">
                    <SelectValue placeholder="Chọn đối tượng hủy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HỌC SINH">HỌC SINH</SelectItem>
                    <SelectItem value="GIÁO VIÊN">GIÁO VIÊN</SelectItem>
                    <SelectItem value="KHÁC">KHÁC</SelectItem>
                  </SelectContent>
                </Select>
              </FieldLabel>

              <FieldLabel label="Lý do hủy buổi" required>
                {cancelBy === 'KHÁC' ? (
                  <Input value="Hủy do các sự cố khách quan khác" disabled className="h-9 w-full bg-muted text-xs text-muted-foreground" />
                ) : (
                  <Select value={cancelReason} onValueChange={setCancelReason}>
                    <SelectTrigger className="h-9 w-full text-xs">
                      <SelectValue placeholder="Chọn lý do hủy" />
                    </SelectTrigger>
                    <SelectContent>
                      {(cancelBy === 'HỌC SINH' ? studentCancelReasons : teacherCancelReasons).map((reason) => (
                        <SelectItem key={reason} value={reason} className="text-xs">
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FieldLabel>

              <FieldLabel label="Mô tả chi tiết lý do" required>
                <Textarea
                  value={cancelDescription}
                  onChange={(event) => setCancelDescription(event.target.value)}
                  placeholder="Nhập mô tả chi tiết lý do hủy buổi..."
                  className="min-h-[80px] text-xs"
                />
              </FieldLabel>
            </div>

            <DialogFooter className="mt-5 flex flex-row items-center justify-end gap-2 border-t pt-3">
              <Button type="button" variant="outline" size="sm" className="h-8 px-4 text-xs font-semibold" onClick={() => setCancelingSessionId(null)}>
                Đóng
              </Button>
              <Button type="button" size="sm" className="h-8 px-4 text-xs font-semibold" onClick={handleConfirmCancel}>
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Schedule Edit Modal */}
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
