'use client'

import React from 'react'
import { toast } from 'sonner'
import type { ClassSession } from '@/mocks/calendarSchedule'
import { ClassesSessionDetailDialog } from '@/components/screens/classes/detail/ClassesSessionDetailDialog'
import { generateMockRoster, generateRoadmapSessions } from '@/components/screens/classes/detail/classesDetailHelpers'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
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

  const isMathSession = Boolean(
    session.subject?.toLowerCase().includes('toán') ||
    session.subject?.toLowerCase().includes('math') ||
    session.className?.toLowerCase().includes('toán') ||
    session.className?.toLowerCase().includes('math') ||
    session.classCode?.toLowerCase().includes('toan') ||
    session.classCode?.toLowerCase().includes('math') ||
    session.level?.toLowerCase().includes('toán') ||
    session.level?.toLowerCase().includes('math')
  )

  const classCode = session.classCode || (isMathSession ? 'CLS-MATH-019' : 'CLS-IELTS-001')
  const matchedRecord = mockClassRecords.find(c => c.code === classCode || c.id === classCode) ||
    (isMathSession
      ? (mockClassRecords.find(c => c.code.includes('MATH') || c.level.toLowerCase().includes('math')) || mockClassRecords[0])
      : mockClassRecords[0])

  const clsRecord: ClassRecord = {
    ...matchedRecord,
    id: session.classCode || matchedRecord.id,
    code: session.classCode || matchedRecord.code,
    name: session.className || matchedRecord.name,
    level: isMathSession
      ? (session.level?.toLowerCase().includes('math') || session.level?.toLowerCase().includes('toán')
          ? session.level
          : `Math ${session.level || 'Kindi'}`)
      : (session.level || matchedRecord.level),
    branch: session.branch || matchedRecord.branch,
    teacher: session.teacher || matchedRecord.teacher,
    room: session.schoolRoom || matchedRecord.room,
    schedule: session.timeLabel && session.endTimeLabel ? `${session.timeLabel}–${session.endTimeLabel}` : matchedRecord.schedule,
    syllabus: isMathSession ? (matchedRecord.syllabus || 'Station_Toán tư duy (Col 4 tuổi)') : matchedRecord.syllabus,
  }
  const roster = generateMockRoster(clsRecord)
  const sessionsList = generateRoadmapSessions(clsRecord)
  
  const isProject = session.type === 'project' || 
    (session.title || '').toLowerCase().includes('project') || 
    (session.title || '').toLowerCase().includes('dự án')
  const defaultProjectUrl = session.projectUrl || 'https://scratch.mit.edu/projects/612048882'

  const sessionNumber = typeof session.lessonNumber === 'number' ? session.lessonNumber : 4

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
    type: session.type || (isProject ? 'project' : undefined),
    projectUrl: isProject ? defaultProjectUrl : undefined,
    materials: [
      { name: isProject ? `Slide hướng dẫn dự án` : `Slide bài giảng`, url: '#' },
      { 
        name: isProject ? `Project: Link mở bài mini project` : `Bài tập về nhà`, 
        url: isProject ? defaultProjectUrl : '#' 
      }
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
