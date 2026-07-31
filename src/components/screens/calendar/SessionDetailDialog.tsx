'use client'

import React from 'react'
import { toast } from 'sonner'
import type { ClassSession } from '@/mocks/calendarSchedule'
import { ClassesSessionDetailDialog } from '@/components/screens/classes/detail/ClassesSessionDetailDialog'
import { generateMockRoster, generateRoadmapSessions } from '@/components/screens/classes/detail/classesDetailHelpers'
import { mockClassRecords } from '@/mocks/classRecords'
import type { RoadmapSession } from '@/components/screens/classes/detail/classesDetailTypes'

interface SessionDetailDialogProps {
  session: ClassSession | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onQuickAttendance?: () => void
}

export function SessionDetailDialog({
  session,
  open,
  onOpenChange,
}: SessionDetailDialogProps) {
  if (!session) return null

  const classCode = session.classCode || 'CLS-IELTS-001'
  const clsRecord = mockClassRecords.find(c => c.code === classCode || c.id === classCode) || mockClassRecords[0]
  const roster = generateMockRoster(clsRecord)
  const sessionsList = generateRoadmapSessions(clsRecord)
  
  const sessionNumber = 4
  const matchedSession: RoadmapSession = {
    id: session.id,
    sessionNumber,
    date: session.dateDisplay || session.date,
    startTime: session.timeLabel,
    endTime: session.endTimeLabel,
    topic: session.title || session.className,
    description: session.status === 'completed' ? (session.lessonSubtitle || '') : '',
    room: session.schoolRoom || clsRecord.room,
    defaultRoom: clsRecord.room,
    teacherName: session.teacher || clsRecord.teacher,
    substituteTeacherName: session.substituteTeacher,
    status: session.status === 'cancelled' ? 'cancelled' : session.status === 'completed' ? 'completed' : 'upcoming',
    materials: [
      { name: `Slide bài giảng`, url: '#' },
      { name: `Bài tập về nhà`, url: '#' }
    ],
    syllabusName: clsRecord.syllabus || 'Lộ trình mặc định'
  }
  
  const finalSessions = sessionsList.length > 0 
    ? sessionsList.map(s => s.sessionNumber === sessionNumber ? matchedSession : s)
    : [matchedSession]

  return (
    <ClassesSessionDetailDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      session={matchedSession}
      sessions={finalSessions}
      cls={clsRecord}
      roster={roster}
      onCancel={() => toast.success('Đã hủy buổi học thành công (Demo).')}
      onEditTeacher={() => toast.success('Đã gửi yêu cầu đổi giáo viên (Demo).')}
      onEditRoom={() => toast.success('Đã gửi yêu cầu đổi phòng học (Demo).')}
      onUpload={() => toast.success('Đã tải tài liệu lên thành công (Demo).')}
    />
  )
}
