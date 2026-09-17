'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { ClassRecord } from '@/mocks/classRecords'
import type { RoadmapSession, RosterStudent } from '../classesDetailTypes'
import { LiveTeachingHeader } from './LiveTeachingHeader'
import { LiveMaterialViewer } from './LiveMaterialViewer'
import { LiveShorthandRosterDrawer } from './LiveShorthandRosterDrawer'
import { LiveLessonGuideDrawer } from './LiveLessonGuideDrawer'
import { LiveTeachingConclusionView } from './LiveTeachingConclusionView'
import {
  type TeachingMaterial,
  type StudentLiveLog,
  MATH_MATERIALS,
  ENGLISH_MATERIALS,
  MATH_LESSON_GUIDE,
  ENGLISH_LESSON_GUIDE,
} from './liveTeachingTypes'

interface LiveTeachingDialogProps {
  isOpen: boolean
  onClose: () => void
  session: RoadmapSession
  cls: ClassRecord
  roster: RosterStudent[]
  isMath?: boolean
  onFinishAndOpenBulkFeedback: (prefilledFeedbackMap: Record<string, string>) => void
}

export function LiveTeachingDialog({
  isOpen,
  onClose,
  session,
  cls,
  roster,
  isMath: isMathProp,
  onFinishAndOpenBulkFeedback,
}: LiveTeachingDialogProps) {
  const isMath = useMemo(() => {
    if (typeof isMathProp === 'boolean') return isMathProp
    const l = (cls.level || '').toLowerCase()
    const n = (cls.name || '').toLowerCase()
    const t = (session.topic || '').toLowerCase()
    return (
      l.includes('math') ||
      l.includes('toán') ||
      n.includes('math') ||
      n.includes('toán') ||
      t.includes('math') ||
      t.includes('toán') ||
      t.includes('pooka') ||
      t.includes('wooka')
    )
  }, [isMathProp, cls.level, cls.name, session.topic])

  const materials = useMemo(() => {
    return isMath ? MATH_MATERIALS : ENGLISH_MATERIALS
  }, [isMath])

  const [activeMaterial, setActiveMaterial] = useState<TeachingMaterial>(materials[0])
  const [isRosterOpen, setIsRosterOpen] = useState(true)
  const [isLessonGuideOpen, setIsLessonGuideOpen] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [studentLogs, setStudentLogs] = useState<Record<string, StudentLiveLog>>({})
  const [viewStage, setViewStage] = useState<'teaching' | 'concluding'>('teaching')

  // Reset stage & active material whenever the dialog opens or subject changes
  useEffect(() => {
    if (isOpen) {
      setViewStage('teaching')
      setActiveMaterial(materials[0])
    }
  }, [isOpen, materials])

  const handleUpdateStudentLog = (studentId: string, updatedLog: StudentLiveLog) => {
    setStudentLogs((prev) => ({
      ...prev,
      [studentId]: updatedLog,
    }))
  }

  const handleToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {})
      setIsFullScreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullScreen(false)
    }
  }

  // Switch to the dedicated Conclusion & Rating view when teacher ends live session
  const handleStartConclusion = () => {
    setViewStage('concluding')
  }

  // Handle final completion from Conclusion view
  const handleSaveAndComplete = (evaluations: Record<string, string>) => {
    toast.success('Đã lưu toàn bộ đánh giá và nhận xét của buổi học!')
    onFinishAndOpenBulkFeedback(evaluations)
    onClose()
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="!fixed !inset-0 !top-0 !left-0 !right-0 !bottom-0 !translate-x-0 !translate-y-0 !transform-none !w-screen !h-screen !max-w-none !max-h-none !m-0 !p-0 !rounded-none !border-none bg-background flex flex-col min-h-0 overflow-hidden z-[99999]"
      >
        <DialogTitle className="sr-only">
          Màn hình giảng dạy và tốc ký học viên - {session.topic || cls.name}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Chế độ giảng dạy trực tiếp kết hợp mở học liệu (PDF / Video / Audio), xem giáo án, tốc ký và tổng kết đánh giá
        </DialogDescription>

        {viewStage === 'teaching' ? (
          <>
            {/* ── Top Header with Dynamic Material Selector & Lesson Guide Trigger ── */}
            <LiveTeachingHeader
              classNameTitle={cls.name || (isMath ? 'Toán Kindi — J1' : 'Cambridge English Junior')}
              sessionTopic={session.topic || (isMath ? 'J1_Pooka, Wooka (Tiết 2)' : 'Classroom Objects & Story Time')}
              sessionNumber={session.sessionNumber || 2}
              materials={materials}
              activeMaterial={activeMaterial}
              onSelectMaterial={setActiveMaterial}
              onOpenLessonGuide={() => setIsLessonGuideOpen(true)}
              isRosterOpen={isRosterOpen}
              onToggleRoster={() => setIsRosterOpen((prev) => !prev)}
              isFullScreen={isFullScreen}
              onToggleFullScreen={handleToggleFullScreen}
              onEndSession={handleStartConclusion}
              onClose={onClose}
            />

            {/* ── Body: Viewer (Canvas for PDF/Video/Audio) + Collapsible Shorthand Drawer ── */}
            <div className="flex-1 flex min-h-0 overflow-hidden relative">
              {/* Dynamic Material Viewer (Auto-renders PDF / Video / Audio) */}
              <LiveMaterialViewer
                material={activeMaterial}
                lessonTitle={session.topic || (isMath ? 'J1_Pooka, Wooka (Tiết 2)' : 'Classroom Objects & Story Time')}
                isMath={isMath}
              />

              {/* Collapsible Shorthand Roster Drawer (Floating right) */}
              <LiveShorthandRosterDrawer
                isOpen={isRosterOpen}
                onClose={() => setIsRosterOpen(false)}
                students={roster}
                isMath={isMath}
                studentLogs={studentLogs}
                onUpdateStudentLog={handleUpdateStudentLog}
              />
            </div>

            {/* ── Slide-over Drawer: Giáo án & Mục tiêu bài học (Chuẩn KCT) ── */}
            <LiveLessonGuideDrawer
              isOpen={isLessonGuideOpen}
              onClose={() => setIsLessonGuideOpen(false)}
              session={session}
              cls={cls}
              isMath={isMath}
            />
          </>
        ) : (
          /* ── Màn hình Kết Thúc Ca Dạy: Bảng Ma Trận Tương Tác 1 Màn Hình Duy Nhất ── */
          <LiveTeachingConclusionView
            students={roster}
            studentLogs={studentLogs}
            isMath={isMath}
            classNameTitle={cls.name || (isMath ? 'Toán Kindi — J1' : 'Cambridge English Junior')}
            sessionTopic={session.topic || (isMath ? 'J1_Pooka, Wooka (Tiết 2)' : 'Classroom Objects & Story Time')}
            onBackToTeaching={() => setViewStage('teaching')}
            onCompleteAndSave={handleSaveAndComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

