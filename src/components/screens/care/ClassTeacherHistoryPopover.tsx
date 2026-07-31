'use client'

import React from 'react'
import { History } from 'lucide-react'
import { TeacherHistoryPopover } from '@/components/shared'
import type { TeacherHistoryEntry } from '@/mocks/classRecords'

interface ClassTeacherHistoryPopoverProps {
  trigger?: React.ReactNode
  teacherHistory?: TeacherHistoryEntry[]
  currentTeacher?: string
  currentTeacherPhone?: string
}

/**
 * Wrapper around TeacherHistoryPopover for backward compatibility.
 * Used by CARE screens — delegates entirely to the shared component.
 */
export function ClassTeacherHistoryPopover({
  trigger,
  teacherHistory = [],
  currentTeacher,
  currentTeacherPhone,
}: ClassTeacherHistoryPopoverProps) {
  // Provide default hardcoded history if none passed (for demo compatibility)
  const defaultHistory: TeacherHistoryEntry[] = teacherHistory.length > 0
    ? teacherHistory
    : [
        { name: currentTeacher || 'Cô Hoàng Thị Mai', role: 'Chủ nhiệm', startDate: '15/07/2026', phone: '0912 345 678', isCurrent: true },
        { name: 'Cô Nguyễn Thị Hoa', role: 'GV cũ', startDate: '01/01/2026', endDate: '15/07/2026', reason: 'Học viên dời sang lớp mới LD_TA_00019', isCurrent: false },
        { name: 'Thầy David Wilson', role: 'GV Bản ngữ', startDate: '01/01/2026', endDate: '30/04/2026', reason: 'Hoàn thành kỳ giảng dạy bản ngữ 4 tháng', isCurrent: false },
      ]

  const defaultTrigger = (
    <span
      role="button"
      tabIndex={0}
      className="text-xs text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-medium cursor-pointer transition-colors"
      title={`Xem lịch sử đổi giáo viên (${defaultHistory.length} giáo viên)`}
    >
      Lịch sử đổi GV ({defaultHistory.length})
    </span>
  )

  return (
    <TeacherHistoryPopover
      trigger={trigger || defaultTrigger}
      history={defaultHistory}
      currentTeacher={currentTeacher}
      currentTeacherPhone={currentTeacherPhone}
      align="end"
    />
  )
}
