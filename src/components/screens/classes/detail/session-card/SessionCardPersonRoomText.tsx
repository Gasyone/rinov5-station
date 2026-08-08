'use client'

import { toast } from 'sonner'
import { ArrowRight, RotateCcw } from 'lucide-react'
import type { RoadmapSession } from '../classesDetailTypes'
import { cleanTeacherName, cleanAssistantName } from '../classesDetailHelpers'
import { PersonnelHoverCard } from '@/components/shared'
import { getTeacherPersonnel, getAssistantPersonnel } from './sessionCardTypes'

export interface SessionCardPersonRoomTextProps {
  session: RoadmapSession
  onUpdateSession?: (id: string, updates: Partial<RoadmapSession>) => void
  onRevertTeacher?: () => void
  onRevertAssistant?: () => void
  onRevertRoom?: () => void
}

export function SessionCardPersonRoomText({
  session,
  onUpdateSession,
  onRevertTeacher,
  onRevertAssistant,
  onRevertRoom,
}: SessionCardPersonRoomTextProps) {
  const isCompleted = session.status === 'completed'
  const isPendingOrUpcoming = !isCompleted

  const hasRoomChange = !!session.defaultRoom && session.room !== session.defaultRoom
  const hasTeacherCover = !!session.substituteTeacherName
  const hasTACover = !!session.substituteAssistantName

  const defaultTA = session.defaultAssistantName || session.assistantName || 'Hoàng Anh'
  const activeTA = session.substituteAssistantName || session.assistantName || 'Hoàng Anh'

  return (
    <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
      {/* Giáo viên (GV) */}
      <span className="flex items-center gap-1">
        <span>GV:</span>
        <span className="font-medium text-foreground">
          {hasTeacherCover ? (
            <span className="inline-flex items-center gap-1">
              <PersonnelHoverCard person={getTeacherPersonnel(session.teacherName)}>
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground/60 line-through hover:text-primary hover:underline cursor-pointer transition-colors"
                >
                  {cleanTeacherName(session.teacherName)}
                </span>
              </PersonnelHoverCard>

              <ArrowRight className="h-3 w-3 text-muted-foreground/50" />

              <PersonnelHoverCard person={getTeacherPersonnel(session.substituteTeacherName!)}>
                <span
                  onClick={(e) => e.stopPropagation()}
                  className="font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer transition-colors"
                >
                  {cleanTeacherName(session.substituteTeacherName!)}
                </span>
              </PersonnelHoverCard>

              {isPendingOrUpcoming && (onRevertTeacher || onUpdateSession) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onRevertTeacher) {
                      onRevertTeacher()
                    } else {
                      onUpdateSession?.(session.id, {
                        substituteTeacherName: undefined,
                        coverType: undefined,
                        coverNote: undefined,
                      })
                      toast.success('Đã xóa giáo viên cover, khôi phục giáo viên chính!')
                    }
                  }}
                  className="ml-0.5 p-0.5 rounded text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Xóa giáo viên cover (Khôi phục GV chính)"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              )}
            </span>
          ) : (
            <PersonnelHoverCard person={getTeacherPersonnel(session.teacherName)}>
              <span
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary hover:underline cursor-pointer transition-colors"
              >
                {cleanTeacherName(session.teacherName)}
              </span>
            </PersonnelHoverCard>
          )}
        </span>
      </span>

      {/* Trợ giảng (TG) */}
      <span className="text-muted-foreground/40">•</span>

      <span className="inline-flex items-center gap-1">
        <span>TG:</span>
        {hasTACover ? (
          <span className="inline-flex items-center gap-1">
            <PersonnelHoverCard person={getAssistantPersonnel(defaultTA)}>
              <span
                onClick={(e) => e.stopPropagation()}
                className="text-muted-foreground/60 line-through hover:text-primary hover:underline cursor-pointer transition-colors"
              >
                {cleanAssistantName(defaultTA)}
              </span>
            </PersonnelHoverCard>

            <ArrowRight className="h-3 w-3 text-muted-foreground/50" />

            <PersonnelHoverCard person={getAssistantPersonnel(activeTA)}>
              <span
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer transition-colors"
              >
                {cleanAssistantName(activeTA)}
              </span>
            </PersonnelHoverCard>

            {isPendingOrUpcoming && (onRevertAssistant || onUpdateSession) && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onRevertAssistant) {
                    onRevertAssistant()
                  } else {
                    onUpdateSession?.(session.id, {
                      substituteAssistantName: undefined,
                    })
                    toast.success('Đã xóa trợ giảng cover, khôi phục trợ giảng chính!')
                  }
                }}
                className="ml-0.5 p-0.5 rounded text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                title="Xóa trợ giảng cover (Khôi phục TA chính)"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </span>
        ) : activeTA ? (
          <PersonnelHoverCard person={getAssistantPersonnel(activeTA)}>
            <span
              onClick={(e) => e.stopPropagation()}
              className="font-medium text-foreground hover:text-primary hover:underline cursor-pointer transition-colors"
            >
              {cleanAssistantName(activeTA)}
            </span>
          </PersonnelHoverCard>
        ) : (
          <span className="text-muted-foreground/50 text-[11px]">Chưa có</span>
        )}
      </span>

      {/* Phòng học */}
      <span className="text-muted-foreground/40">•</span>

      <span className="flex items-center gap-1">
        <span>Phòng:</span>
        <span className="font-medium text-foreground">
          {hasRoomChange ? (
            <span className="inline-flex items-center gap-1">
              <span className="text-muted-foreground/60 line-through">{session.defaultRoom}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              <span className="font-semibold text-amber-600 dark:text-amber-400">{session.room}</span>

              {isPendingOrUpcoming && (onRevertRoom || onUpdateSession) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onRevertRoom) {
                      onRevertRoom()
                    } else {
                      onUpdateSession?.(session.id, {
                        room: session.defaultRoom!,
                      })
                      toast.success('Đã hủy đổi phòng, khôi phục phòng học gốc!')
                    }
                  }}
                  className="ml-0.5 p-0.5 rounded text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Hủy đổi phòng (Khôi phục phòng gốc)"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              )}
            </span>
          ) : (
            session.room
          )}
        </span>
      </span>
    </div>
  )
}
