'use client'

import { useMemo } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, ChevronRight, ChevronDown } from 'lucide-react'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { generateRoadmapSessions } from '@/components/screens/classes/detail/classesDetailHelpers'
import { StudentClassAssignmentSessionSubtable } from './StudentClassAssignmentSessionSubtable'
import type { ClassRecord, ScheduleSlot } from '@/mocks/classRecords'

const CLASS_STATUS_LABELS: Record<string, string> = {
  nhap: 'Nháp',
  cho_khai_giang: 'Chờ khai giảng',
  dang_hoc: 'Đang học',
  tam_dung: 'Tạm nghỉ',
  huy: 'Đã kết thúc',
}

interface StudentClassAssignmentClassRowProps {
  cls: ClassRecord
  isSelected: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onSelectClass: () => void
  selectedSessionDate: string
  onSelectSession: (val: string) => void
}

function isOnlineClass(cls: ClassRecord): boolean {
  return (
    cls.room?.toLowerCase() === 'online' ||
    cls.name?.toLowerCase().includes('online') ||
    cls.code?.toLowerCase().includes('online')
  )
}

function formatClassScheduleInline(
  slots?: ScheduleSlot[],
  fallback?: string
): string {
  if (!slots || slots.length === 0) return fallback || 'Chưa gán lịch'
  return slots
    .map((s) => {
      const datePart = s.date ? ` (${s.date})` : ''
      return `${s.dayOfWeek}${datePart}: ${s.startTime}–${s.endTime}`
    })
    .join(' • ')
}

export function StudentClassAssignmentClassRow({
  cls,
  isSelected,
  isExpanded,
  onToggleExpand,
  onSelectClass,
  selectedSessionDate,
  onSelectSession,
}: StudentClassAssignmentClassRowProps) {
  const isOnline = isOnlineClass(cls)

  // Generate sessions for this class (rolling 5 sessions)
  const sessions = useMemo(() => {
    const clsWithSyllabus = {
      ...cls,
      syllabus:
        cls.syllabus && cls.syllabus !== '—' && cls.syllabus !== ''
          ? cls.syllabus
          : 'Lộ trình chuẩn',
    }
    const allSessions = generateRoadmapSessions(clsWithSyllabus)
    if (allSessions.length === 0) return []

    const activeIndex = allSessions.findIndex(
      (s) => s.status === 'ongoing' || s.status === 'upcoming'
    )
    const startIdx =
      activeIndex === -1
        ? Math.max(0, allSessions.length - 5)
        : Math.max(0, activeIndex - 1)

    return allSessions.slice(startIdx, startIdx + 5)
  }, [cls])

  return (
    <>
      {/* Parent Row: Class Item */}
      <TableRow
        onClick={() => {
          onSelectClass()
          if (!isExpanded) {
            onToggleExpand()
          }
        }}
        className={`cursor-pointer hover:bg-muted/40 transition-colors align-middle border-b ${
          isSelected ? 'bg-primary/5 hover:bg-primary/8 font-medium' : ''
        }`}
      >
        {/* 1. Toggle Expand & Radio Button */}
        <TableCell
          className="w-[60px] py-2.5 px-2 text-center align-middle"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={onToggleExpand}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title={isExpanded ? 'Thu gọn buổi học' : 'Xem các buổi học'}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-primary" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            <input
              type="radio"
              name="selectedClass"
              checked={isSelected}
              onChange={() => {
                onSelectClass()
                if (!isExpanded) {
                  onToggleExpand()
                }
              }}
              className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 cursor-pointer"
            />
          </div>
        </TableCell>

        {/* 2. Lớp học & Trạng thái */}
        <TableCell className="py-2.5 px-2 text-xs align-middle">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-foreground">
                {cls.name || cls.code}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold px-1 py-0 border-transparent ${getStatusBadgeClass(
                  cls.status
                )}`}
              >
                {CLASS_STATUS_LABELS[cls.status] || cls.status}
              </Badge>
              {isOnline && (
                <Badge
                  variant="outline"
                  className="text-[10px] font-semibold px-1 py-0 text-muted-foreground"
                >
                  Online Tutor
                </Badge>
              )}
            </div>
            <span className="text-[11px] font-mono text-muted-foreground font-semibold">
              {cls.code || cls.id.toUpperCase()} • {cls.level}{' '}
              {cls.subLevel ? `(${cls.subLevel})` : ''}
            </span>
          </div>
        </TableCell>

        {/* 3. Cạnh phải: Dòng trên (Sĩ số + Phòng gộp 1 dòng), Dòng dưới (Lịch học 1 dòng) */}
        <TableCell className="w-[45%] text-right py-2.5 px-2 pr-4 text-xs align-middle">
          <div className="flex flex-col items-end gap-1">
            {/* Dòng trên: Sĩ số + Phòng */}
            <div className="flex items-center justify-end gap-2 font-semibold text-foreground text-xs leading-tight">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {cls.enrolledStudents}/{cls.maxStudents}
                </span>
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-primary font-medium text-xs">
                Phòng: {cls.room || '—'}
              </span>
            </div>

            {/* Dòng dưới: Lịch học 1 dòng (Thứ + Ngày, giờ) */}
            <div className="text-[11.5px] text-muted-foreground font-normal whitespace-nowrap">
              {formatClassScheduleInline(cls.scheduleSlots, cls.schedule)}
            </div>
          </div>
        </TableCell>
      </TableRow>

      {/* Child Treeview Node: Expanded Sessions Subtable */}
      {isExpanded && (
        <TableRow className="bg-muted/15 hover:bg-muted/15 border-b select-none">
          <TableCell colSpan={3} className="p-0">
            <div className="pl-7 pr-2 py-0.5 bg-muted/20">
              <StudentClassAssignmentSessionSubtable
                sessions={sessions}
                selectedSessionDate={selectedSessionDate}
                isClassSelected={isSelected}
                onSelectSession={(sessionStr) => {
                  onSelectClass()
                  onSelectSession(sessionStr)
                }}
              />
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
