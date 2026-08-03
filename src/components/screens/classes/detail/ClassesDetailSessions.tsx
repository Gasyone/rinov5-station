'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDialog, EmptyState, FieldLabel } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'

import { ClassesSessionActionDialog } from './ClassesSessionActionDialog'
import { ClassesSessionCard } from './ClassesSessionCard'
import { ClassesSessionDetailDialog } from './ClassesSessionDetailDialog'
import type { RoadmapSession, RosterStudent } from './classesDetailTypes'

import type { ClassNote, ClassAuditLog } from './classesDetailTypes'

interface ClassesDetailSessionsProps {
  cls: ClassRecord
  sessions: RoadmapSession[]
  roster: RosterStudent[]
  onUpdateSession: (id: string, updates: Partial<RoadmapSession>) => void
  classNotes?: ClassNote[]
  classLogs?: ClassAuditLog[]
  onAddClassNote?: (text: string) => void
}

type SessionFilter = 'all' | 'active' | 'upcoming' | 'completed' | 'cancelled'
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

function countInactiveSessions(sessions: RoadmapSession[]): number {
  return sessions.filter((session) => session.status === 'cancelled' || session.status === 'absent').length
}

function getFilteredSessions(filter: SessionFilter, rollingSessions: RoadmapSession[]): RoadmapSession[] {
  switch (filter) {
    case 'all':
      return rollingSessions
    case 'active': {
      const ongoing = rollingSessions.filter((session) => session.status === 'ongoing')
      const firstUpcoming = rollingSessions.find((session) => session.status === 'upcoming')
      return firstUpcoming ? [...ongoing, firstUpcoming] : ongoing
    }
    case 'upcoming':
      return rollingSessions.filter((session) => session.status === 'upcoming')
    case 'completed':
      return rollingSessions.filter((session) => session.status === 'completed')
    case 'cancelled':
      return rollingSessions.filter((session) => session.status === 'cancelled' || session.status === 'absent')
    default:
      return rollingSessions
  }
}

export function ClassesDetailSessions({
  cls,
  sessions,
  roster,
  onUpdateSession,
  classNotes,
  classLogs,
  onAddClassNote,
}: ClassesDetailSessionsProps) {
  const [filter, setFilter] = useState<SessionFilter>('active')
  const [selectedDetailSession, setSelectedDetailSession] = useState<RoadmapSession | null>(null)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editType, setEditType] = useState<SessionEditType | null>(null)
  const [selectedStudentForUpload, setSelectedStudentForUpload] = useState<RosterStudent | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [sessionToDeleteMat, setSessionToDeleteMat] = useState<{
    sessionId: string
    materialName: string
    isSlide: boolean
  } | null>(null)

  const [cancelingSessionId, setCancelingSessionId] = useState<string | null>(null)
  const [cancelBy, setCancelBy] = useState<CancelBy>('HỌC SINH')
  const [cancelReason, setCancelReason] = useState(studentCancelReasons[0])
  const [cancelDescription, setCancelDescription] = useState('')
  const [cancelErrors, setCancelErrors] = useState<Record<string, string>>({})

  const rollingSessions = useMemo(() => {
    const activeIndex = sessions.findIndex(
      (session) => session.status === 'ongoing' || session.status === 'upcoming'
    )

    if (activeIndex === -1) {
      return sessions.slice(-5)
    }

    const start = Math.max(0, activeIndex - 1)
    return sessions.slice(start, start + 5)
  }, [sessions])

  const filteredSessions = useMemo(
    () => getFilteredSessions(filter, rollingSessions),
    [filter, rollingSessions]
  )

  const activeSession = sessions.find((session) => session.id === editingSessionId) || null

  const handleOpenEdit = (sessionId: string, type: SessionEditType, student?: RosterStudent) => {
    setEditingSessionId(sessionId)
    setEditType(type)
    setSelectedStudentForUpload(student || null)
  }

  const handleCancelByChange = (value: CancelBy) => {
    setCancelBy(value)
    if (value === 'HỌC SINH') {
      setCancelReason(studentCancelReasons[0])
    } else if (value === 'GIÁO VIÊN') {
      setCancelReason(teacherCancelReasons[0])
    } else {
      setCancelReason('Hủy do các sự cố khách quan khác')
    }
    setCancelErrors({})
  }

  const handleOpenCancelModal = (sessionId: string) => {
    setCancelingSessionId(sessionId)
    setCancelBy('HỌC SINH')
    setCancelReason(studentCancelReasons[0])
    setCancelDescription('')
    setCancelErrors({})
  }

  const handleConfirmCancel = () => {
    if (!cancelingSessionId) return

    const newErrors: Record<string, string> = {}
    if (!cancelReason) {
      newErrors.reason = 'Vui lòng chọn hoặc điền lý do hủy buổi.'
    }
    if (!cancelDescription.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả chi tiết lý do.'
    }

    if (Object.keys(newErrors).length > 0) {
      setCancelErrors(newErrors)
      return
    }

    onUpdateSession(cancelingSessionId, {
      status: 'cancelled',
      cancelBy,
      cancelReason,
      cancelDescription,
    })

    toast.success('Đã hủy buổi học thành công.')
    setCancelingSessionId(null)
  }

  const handleConfirmDeleteMaterial = () => {
    if (!sessionToDeleteMat) {
      setDeleteConfirmOpen(false)
      return
    }

    const targetSession = sessions.find((session) => session.id === sessionToDeleteMat.sessionId)
    if (!targetSession) {
      setDeleteConfirmOpen(false)
      return
    }

    const updatedMats = sessionToDeleteMat.isSlide
      ? targetSession.materials?.map((material) =>
          material.name === sessionToDeleteMat.materialName ? { ...material, url: '#' } : material
        ) || []
      : targetSession.materials?.filter((material) => material.name !== sessionToDeleteMat.materialName) || []

    onUpdateSession(sessionToDeleteMat.sessionId, { materials: updatedMats })
    setDeleteConfirmOpen(false)
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <div className="flex flex-wrap items-center gap-6 border-b border-border pb-2">
        <button
          type="button"
          className={cn(
            'px-1 pb-2 text-xs font-semibold border-b-2 transition-all focus:outline-none',
            filter === 'active'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('active')}
        >
          Đang học/Tiếp ({getFilteredSessions('active', rollingSessions).length})
        </button>
        <button
          type="button"
          className={cn(
            'px-1 pb-2 text-xs font-semibold border-b-2 transition-all focus:outline-none',
            filter === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('all')}
        >
          Tất cả ({rollingSessions.length})
        </button>
        <button
          type="button"
          className={cn(
            'px-1 pb-2 text-xs font-semibold border-b-2 transition-all focus:outline-none',
            filter === 'upcoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('upcoming')}
        >
          Sắp tới ({rollingSessions.filter((session) => session.status === 'upcoming').length})
        </button>
        <button
          type="button"
          className={cn(
            'px-1 pb-2 text-xs font-semibold border-b-2 transition-all focus:outline-none',
            filter === 'completed'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('completed')}
        >
          Đã học ({rollingSessions.filter((session) => session.status === 'completed').length})
        </button>
        <button
          type="button"
          className={cn(
            'px-1 pb-2 text-xs font-semibold border-b-2 transition-all focus:outline-none',
            filter === 'cancelled'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          onClick={() => setFilter('cancelled')}
        >
          Hủy ({countInactiveSessions(rollingSessions)})
        </button>
      </div>

      {filteredSessions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredSessions.map((session) => (
            <ClassesSessionCard
              key={session.id}
              session={session}
              onView={(targetSession) => setSelectedDetailSession(targetSession)}
              onCancel={handleOpenCancelModal}
              onEditTeacher={(sessionId) => handleOpenEdit(sessionId, 'teacher')}
              onEditRoom={(sessionId) => handleOpenEdit(sessionId, 'room')}
              onUpload={(sessionId) => handleOpenEdit(sessionId, 'upload')}
              onReschedule={(sessionId) => handleOpenEdit(sessionId, 'reschedule')}
              onDeleteMaterial={(sessionId, materialName, isSlide) => {
                setSessionToDeleteMat({ sessionId, materialName, isSlide })
                setDeleteConfirmOpen(true)
              }}
            />
          ))}
        </div>
      ) : (
        <div className="py-8">
          <EmptyState
            title="Không có buổi học"
            description="Không tìm thấy buổi học phù hợp với bộ lọc hiện tại."
          />
        </div>
      )}

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
                <Select value={cancelBy} onValueChange={handleCancelByChange}>
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
                {cancelErrors.reason && (
                  <p className="mt-1 text-[10px] font-medium text-destructive">{cancelErrors.reason}</p>
                )}
              </FieldLabel>

              <FieldLabel label="Mô tả chi tiết lý do" required>
                <Textarea
                  value={cancelDescription}
                  onChange={(event) => setCancelDescription(event.target.value)}
                  placeholder="Nhập mô tả chi tiết lý do hủy buổi..."
                  className="min-h-[80px] text-xs"
                />
                {cancelErrors.description && (
                  <p className="mt-1 text-[10px] font-medium text-destructive">{cancelErrors.description}</p>
                )}
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
    </div>
  )
}
