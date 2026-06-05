'use client'

import { useState } from 'react'
import { 
  MapPin, 
  User, 
  Upload, 
  FileText, 
  UserCog, 
  DoorClosed, 
  ArrowRight,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState, ConfirmDialog } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession, RosterStudent } from './classesDetailTypes'
import { ClassesSessionActionDialog } from './ClassesSessionActionDialog'
import { ClassesSessionDetailDialog } from './ClassesSessionDetailDialog'

interface ClassesDetailSessionsProps {
  cls: ClassRecord
  sessions: RoadmapSession[]
  roster: RosterStudent[]
  onUpdateSession: (id: string, updates: Partial<RoadmapSession>) => void
}

export function ClassesDetailSessions({ 
  cls,
  sessions, 
  roster,
  onUpdateSession 
}: ClassesDetailSessionsProps) {
  
  // Set default filter to 'active' ("Đang học/Tiếp theo") as it is the most operationally relevant
  const [filter, setFilter] = useState<'all' | 'active' | 'upcoming' | 'completed' | 'rescheduled' | 'cancelled'>('active')
  
  // States for session detail dialog
  const [selectedDetailSession, setSelectedDetailSession] = useState<RoadmapSession | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // States to manage the substitution dialog modals
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editType, setEditType] = useState<'teacher' | 'room' | 'upload' | null>(null)

  // Confirm Dialog states for delete
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [sessionToDeleteMat, setSessionToDeleteMat] = useState<{ sessionId: string; materialName: string; isSlide: boolean } | null>(null)

  const handleOpenEdit = (sessionId: string, type: 'teacher' | 'room' | 'upload') => {
    setEditingSessionId(sessionId)
    setEditType(type)
  }

  // Filter calculations matching user requirements
  const getFilteredSessions = (): RoadmapSession[] => {
    switch (filter) {
      case 'all':
        return sessions
      
      case 'active': {
        // "Đang học/Tiếp theo" -> ongoing sessions + first upcoming session
        const ongoing = sessions.filter((s) => s.status === 'ongoing')
        const firstUpcoming = sessions.find((s) => s.status === 'upcoming')
        const list = [...ongoing]
        if (firstUpcoming) {
          list.push(firstUpcoming)
        }
        return list
      }
      
      case 'upcoming':
        return sessions.filter((s) => s.status === 'upcoming')
      
      case 'completed':
        return sessions.filter((s) => s.status === 'completed')
      
      case 'rescheduled':
        return sessions.filter((s) => s.status === 'rescheduled' || !!s.substituteTeacherName)
      
      case 'cancelled':
        return sessions.filter((s) => s.status === 'cancelled')
      
      default:
        return sessions
    }
  }

  const filteredSessions = getFilteredSessions()

  const getSessionStatusLabel = (status: RoadmapSession['status']) => {
    switch (status) {
      case 'completed': return 'Đã học'
      case 'ongoing': return 'Đang học'
      case 'upcoming': return 'Chờ diễn ra'
      case 'rescheduled': return 'Đổi lịch'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  // Visual card block builder
  const renderSessionCard = (session: RoadmapSession) => {
    const isCompleted = session.status === 'completed'
    const isCancelled = session.status === 'cancelled'
    const isOngoing = session.status === 'ongoing'
    
    const slide = session.materials?.find(
      (m) => m.name.toLowerCase().includes('slide') || m.name.toLowerCase().includes('bài giảng')
    ) || null
    const isSlideAttached = !!(slide && slide.url && slide.url !== '#')
    
    return (
      <div 
        key={session.id} 
        className={`p-2.5 px-3 border rounded-xl bg-background shadow-2xs transition-all flex flex-col gap-2 ${
          isOngoing 
            ? 'border-primary/40 bg-primary/[0.03] ring-1 ring-primary/10 shadow-xs' 
            : isCancelled
            ? 'border-muted bg-muted/5 opacity-65 border-dashed'
            : 'border-muted hover:border-muted-foreground/30'
        }`}
      >
        {/* Top Header info */}
        <div className="flex items-center justify-between gap-2 border-b border-muted/50 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary font-mono uppercase bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
              Buổi {session.sessionNumber}
            </span>
            <span className="text-xs font-semibold text-foreground font-mono">
              {session.date} ({session.startTime} - {session.endTime})
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedDetailSession(session)
                setIsDetailOpen(true)
              }}
              className="text-muted-foreground hover:text-primary p-0.5 rounded transition-colors"
              title="Xem chi tiết buổi học"
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          </div>

          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
            isOngoing 
              ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950'
              : getStatusBadgeClass(session.status)
          }`}>
            {getSessionStatusLabel(session.status)}
          </span>
        </div>

        {/* Topic Title & Subtitle + Teacher/Room consolidated in a single line or tight block */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2.5 my-0.5">
          {/* Topic Title & Subtitle */}
          <div className="min-w-0 flex-1">
            <h5 className={`text-xs font-bold leading-snug ${isCancelled ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {session.topic}
            </h5>
            {session.description && (
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-normal font-normal truncate">
                {session.description}
              </p>
            )}
          </div>

          {/* Compact Teacher & Room Inline Bar */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs shrink-0 self-center bg-muted/40 px-2 py-0.5 rounded-md border border-muted/30">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">GV:</span>
              <span className="font-semibold text-foreground font-sans">
                {session.substituteTeacherName ? (
                  <span className="flex items-center gap-0.5">
                    <span className="line-through text-muted-foreground/60">{session.teacherName}</span>
                    <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/50 mx-0.5" />
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{session.substituteTeacherName}</span>
                  </span>
                ) : (
                  session.teacherName
                )}
              </span>
            </span>
            <span className="text-muted-foreground/30 font-mono">|</span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">Phòng:</span>
              <span className="font-semibold text-foreground font-sans">
                {session.defaultRoom && session.room !== session.defaultRoom ? (
                  <span className="flex items-center gap-0.5">
                    <span className="line-through text-muted-foreground/60">{session.defaultRoom}</span>
                    <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/50 mx-0.5" />
                    <span className="text-amber-600 dark:text-amber-400 font-bold">{session.room}</span>
                  </span>
                ) : (
                  session.room
                )}
              </span>
            </span>
          </div>
        </div>

        {/* Bottom Panel: Materials (left) & Actions (right) consolidated */}
        <div className="border-t border-dashed border-muted/70 pt-2 flex flex-wrap items-center justify-between gap-2 mt-0.5">
          {/* Materials */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {session.materials && session.materials.length > 0 ? (
              session.materials
                .filter((mat) => {
                  const isSlide = mat.name.toLowerCase().includes('slide') || mat.name.toLowerCase().includes('bài giảng')
                  const isAttached = !!(mat.url && mat.url !== '#')
                  return !(isSlide && isAttached)
                })
                .map((mat, matIdx) => (
                  <div key={matIdx} className="flex items-center gap-1 bg-muted/50 border px-1.5 py-0.5 rounded text-[10px] text-muted-foreground hover:border-primary/30 transition-all">
                    <a 
                      href={mat.url && mat.url !== '#' ? mat.url : undefined} 
                      target="_blank" 
                      rel="noreferrer"
                      className="hover:underline flex items-center gap-1 font-sans font-medium text-primary"
                      onClick={(e) => {
                        if (!mat.url || mat.url === '#') {
                          e.preventDefault()
                          alert('Tài liệu chưa có đường dẫn trực tuyến!')
                        }
                      }}
                    >
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{mat.name} {mat.type ? `[${mat.type}]` : ''}</span>
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSessionToDeleteMat({ sessionId: session.id, materialName: mat.name, isSlide: false })
                        setDeleteConfirmOpen(true)
                      }}
                      className="text-muted-foreground hover:text-destructive font-bold text-[11px] ml-1 px-1 shrink-0 transition-colors"
                      title="Xóa tài liệu"
                    >
                      ×
                    </button>
                  </div>
                ))
            ) : (
              <span className="text-[10px] text-muted-foreground/60 italic">
                {isCancelled ? 'Bài học đã hủy' : 'Chưa có bài giảng'}
              </span>
            )}
            {/* If the filtered list is empty and slide is attached, show placeholder if no other materials exist */}
            {session.materials && session.materials.length > 0 && 
             session.materials.filter((mat) => {
               const isSlide = mat.name.toLowerCase().includes('slide') || mat.name.toLowerCase().includes('bài giảng')
               const isAttached = !!(mat.url && mat.url !== '#')
               return !(isSlide && isAttached)
             }).length === 0 && (
              <span className="text-[10px] text-muted-foreground/60 italic">
                Chỉ có Slide bài giảng đính kèm
              </span>
            )}
          </div>

          {/* Right actions / attached slide */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Attached Slide Link (if attached) */}
            {isSlideAttached && slide ? (
              <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-[10px] font-semibold text-primary transition-all">
                <a 
                  href={slide.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:underline flex items-center gap-1 font-sans"
                >
                  <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{slide.name} {slide.type ? `[${slide.type}]` : ''}</span>
                </a>
                {!isCompleted && !isCancelled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSessionToDeleteMat({ sessionId: session.id, materialName: slide.name, isSlide: true })
                      setDeleteConfirmOpen(true)
                    }}
                    className="text-primary hover:text-destructive font-bold text-[12px] ml-1.5 px-0.5 shrink-0 transition-colors"
                    title="Xóa slide bài giảng"
                  >
                    ×
                  </button>
                )}
              </div>
            ) : null}

            {/* Other Actions (GV, Phòng, Upload Slide) */}
            {!isCompleted && !isCancelled && (
              <div className="flex gap-1">
                {session.status !== 'ongoing' && (
                  <>
                    <Button 
                      size="xs" 
                      variant="outline" 
                      className="rounded-md h-6 text-[10px] px-2 font-medium bg-background border-muted-foreground/20 hover:bg-muted hover:text-foreground text-muted-foreground"
                      onClick={() => handleOpenEdit(session.id, 'teacher')}
                      title="Đổi giáo viên"
                    >
                      <UserCog className="h-3 w-3 mr-1 shrink-0" /> GV
                    </Button>
                    
                    <Button 
                      size="xs" 
                      variant="outline" 
                      className="rounded-md h-6 text-[10px] px-2 font-medium bg-background border-muted-foreground/20 hover:bg-muted hover:text-foreground text-muted-foreground"
                      onClick={() => handleOpenEdit(session.id, 'room')}
                      title="Đổi phòng"
                    >
                      <DoorClosed className="h-3 w-3 mr-1 shrink-0" /> Phòng
                    </Button>
                  </>
                )}
                
                {/* Only show the slide upload button if it is NOT attached yet */}
                {!isSlideAttached && (
                  <Button 
                    size="xs" 
                    variant="outline" 
                    className="rounded-md h-6 text-[10px] px-2 font-medium bg-background border-muted-foreground/20 hover:bg-muted hover:text-foreground text-muted-foreground"
                    onClick={() => handleOpenEdit(session.id, 'upload')}
                    title="Upload bài giảng"
                  >
                    <Upload className="h-3 w-3 mr-1 shrink-0" /> Upload
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    )
  }

  const activeSession = sessions.find((s) => s.id === editingSessionId) || null

  return (
    <div className="space-y-4 pt-1">
      
      {/* Sessions segment toolbar filters (Sticky to top) */}
      <div className="sticky top-0 bg-background z-10 flex flex-wrap items-center justify-between gap-3 pb-3 pt-1 border-b mb-3">
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant={filter === 'all' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('all')}
            className="rounded-lg text-xs"
          >
            Tất cả ({sessions.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('active')}
            className="rounded-lg text-xs"
          >
            Đang học/Tiếp theo ({
              sessions.filter((s) => s.status === 'ongoing').length + 
              (sessions.find((s) => s.status === 'upcoming') ? 1 : 0)
            })
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('upcoming')}
            className="rounded-lg text-xs"
          >
            Sắp tới ({sessions.filter((s) => s.status === 'upcoming').length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('completed')}
            className="rounded-lg text-xs"
          >
            Đã học ({sessions.filter((s) => s.status === 'completed').length})
          </Button>
          <Button
            variant={filter === 'rescheduled' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('rescheduled')}
            className="rounded-lg text-xs"
          >
            Đổi lịch ({sessions.filter((s) => s.status === 'rescheduled' || !!s.substituteTeacherName).length})
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'ghost'}
            size="xs"
            onClick={() => setFilter('cancelled')}
            className="rounded-lg text-xs"
          >
            Hủy ({sessions.filter((s) => s.status === 'cancelled').length})
          </Button>
        </div>
      </div>

      {/* List rendering filtered sessions (one row per session) */}
      {filteredSessions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filteredSessions.map((session) => renderSessionCard(session))}
        </div>
      ) : (
        <div className="py-8">
          <EmptyState
            title="Không tìm thấy buổi học"
            description="Hiện tại không có buổi học nào tương ứng với bộ lọc đang chọn."
          />
        </div>
      )}

      {/* Interactive substitution and slides upload Modal Dialog */}
      {editingSessionId !== null && editType !== null && (
        <ClassesSessionActionDialog
          key={`${editingSessionId}-${editType}`}
          isOpen={editingSessionId !== null && editType !== null}
          onClose={() => {
            setEditingSessionId(null)
            setEditType(null)
          }}
          session={activeSession}
          type={editType}
          onSave={onUpdateSession}
        />
      )}

      {/* Confirm deletion Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xác nhận xóa tài liệu"
        description={
          <span>
            Bạn có chắc chắn muốn xóa tài liệu <strong>{sessionToDeleteMat?.materialName}</strong> không? Hành động này không thể hoàn tác.
          </span>
        }
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={() => {
          if (sessionToDeleteMat) {
            const { sessionId, materialName, isSlide } = sessionToDeleteMat
            const targetSession = sessions.find((s) => s.id === sessionId)
            if (targetSession) {
              let updatedMats = []
              if (isSlide) {
                updatedMats = targetSession.materials?.map((m) => {
                  if (m.name === materialName) {
                    return { ...m, url: '#' }
                  }
                  return m
                }) || []
              } else {
                updatedMats = targetSession.materials?.filter((m) => m.name !== materialName) || []
              }
              onUpdateSession(sessionId, { materials: updatedMats })
            }
          }
          setDeleteConfirmOpen(false)
        }}
      />

      {/* Session detail dialog */}
      {isDetailOpen && selectedDetailSession && (
        <ClassesSessionDetailDialog
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false)
            setSelectedDetailSession(null)
          }}
          session={selectedDetailSession}
          sessions={sessions}
          cls={cls}
          roster={roster}
        />
      )}

    </div>
  )
}
