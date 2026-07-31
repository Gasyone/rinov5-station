'use client'

import React, { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { DetailHistoryViews, DetailHeaderView } from './DetailHistoryViews'

interface OperationsAlertHistoryPopoverProps {
  trigger: React.ReactNode
  studentName: string
  studentId: string
  type: 'evaluation' | 'attendance' | 'homework' | 'score' | 'level' | 'sessions' | 'class_history'
  subject: string
  level?: string
  rating?: string
  votes?: number
  generalComment?: string
  recentAttStatus?: string
  attRate?: number
  attendanceRatio?: string
  lateSessions?: number
  avgScore?: string
  highScore?: string
  lowScore?: string
  missedTestsCount?: number
  homeworkCompletion?: number
}

export function OperationsAlertHistoryPopover({
  trigger,
  studentName,
  studentId,
  type,
  subject,
  level,
  rating,
  votes,
  generalComment,
  recentAttStatus,
  attRate,
  attendanceRatio,
  lateSessions,
  avgScore,
  highScore,
  lowScore,
  missedTestsCount,
  homeworkCompletion,
}: OperationsAlertHistoryPopoverProps) {
  const dialogTitle = useMemo(() => {
    switch (type) {
      case 'evaluation':
        return 'Lịch sử đánh giá chuyên môn'
      case 'attendance':
        return 'Lịch sử chuyên cần & Đi muộn'
      case 'homework':
        return 'Lịch sử hoàn thành Bài tập (BTVN)'
      case 'score':
        return 'Lịch sử điểm số & Xu hướng phát triển'
      case 'level':
        return 'Tiến trình năng lực học thuật'
      case 'sessions':
        return 'Lịch trình & Lịch sử buổi học'
      default:
        return 'Lịch sử chi tiết'
    }
  }, [type])

  const [open, setOpen] = useState(false)

  const curriculumName = useMemo(() => {
    return subject === 'Toán tư duy'
      ? 'Khung chương trình Toán tư duy chuyên sâu'
      : 'Khung chương trình Tiếng Anh chuẩn Cambridge'
  }, [subject])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div onClick={(e) => e.stopPropagation()} className="w-full">
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[480px] max-h-[min(580px,85vh)] overflow-y-auto rounded-xl shadow-lg border bg-popover text-popover-foreground z-50 p-4"
        align="start"
        side="bottom"
        sideOffset={5}
      >
        <DetailHeaderView
          type={type}
          rating={rating}
          votes={votes}
          generalComment={generalComment}
          recentAttStatus={recentAttStatus}
          attRate={attRate}
          attendanceRatio={attendanceRatio}
          lateSessions={lateSessions}
          avgScore={avgScore}
          highScore={highScore}
          lowScore={lowScore}
          missedTestsCount={missedTestsCount}
          homeworkCompletion={homeworkCompletion}
          subject={subject}
          level={level}
          studentName={studentName}
          studentId={studentId}
          curriculumName={curriculumName}
          dialogTitle={dialogTitle}
        />

        <div className="space-y-4">
          <DetailHistoryViews
            type={type}
            studentId={studentId}
            studentName={studentName}
            subject={subject}
            level={level}
            rating={rating}
            homeworkCompletion={homeworkCompletion}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
