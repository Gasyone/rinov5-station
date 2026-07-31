'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarStack } from '@/components/shared'
import { ScheduleSummary } from '@/components/screens/classes/ScheduleSummary'
import { Users } from 'lucide-react'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { getInitials } from './studentDetailHelpers'
import type { ClassRecord } from '@/mocks/classRecords'

const CLASS_STATUS_LABELS: Record<string, string> = {
  nhap: 'Nháp',
  cho_khai_giang: 'Chờ khai giảng',
  dang_hoc: 'Đang học',
  tam_dung: 'Tạm nghỉ',
  huy: 'Đã kết thúc',
}

interface StudentClassAssignmentTableProps {
  filteredClasses: ClassRecord[]
  selectedClassId: string | null
  onSelectClass: (id: string) => void
}

function isOnlineClass(cls: ClassRecord): boolean {
  return (
    cls.room?.toLowerCase() === 'online' ||
    cls.name?.toLowerCase().includes('online') ||
    cls.code?.toLowerCase().includes('online')
  )
}

export function StudentClassAssignmentTable({
  filteredClasses,
  selectedClassId,
  onSelectClass,
}: StudentClassAssignmentTableProps) {
  return (
    <Table className="w-full">
      <TableHeader className="sticky top-0 z-10 bg-background">
        <TableRow className="hover:bg-transparent border-b">
          <TableHead className="w-[5%] text-center px-1 sticky top-0 bg-background z-10 border-b"></TableHead>
          <TableHead className="w-[28%] px-2 sticky top-0 bg-background z-10 border-b">Lớp học</TableHead>
          <TableHead className="w-[20%] px-2 sticky top-0 bg-background z-10 border-b">Lịch học</TableHead>
          <TableHead className="w-[12%] px-2 sticky top-0 bg-background z-10 border-b">Số buổi học</TableHead>
          <TableHead className="w-[18%] px-2 sticky top-0 bg-background z-10 border-b">Ngày học tiếp theo</TableHead>
          <TableHead className="w-[12%] px-2 sticky top-0 bg-background z-10 border-b">Giáo viên</TableHead>
          <TableHead className="w-[10%] text-right px-2 pr-4 sticky top-0 bg-background z-10 border-b">Sĩ số & Phòng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredClasses.map((cls) => {
          const isSelected = selectedClassId === cls.id
          const isOnline = isOnlineClass(cls)
          const teacherList =
            cls.teacher && cls.teacher !== '—'
              ? cls.teacher.split(',').map((t: string) => t.trim())
              : []
          const hasMultipleTeachers = teacherList.length > 1
          const stackItems = teacherList.map((t: string) => ({
            label: t,
            initials: getInitials(t),
          }))
          return (
            <TableRow
              key={cls.id}
              onClick={() => onSelectClass(cls.id)}
              className={`cursor-pointer hover:bg-muted/40 align-middle border-b-0 ${
                isSelected ? 'bg-primary/5 hover:bg-primary/5' : ''
              }`}
            >
              <TableCell className="text-center py-2.5 px-1 align-middle" onClick={(e) => e.stopPropagation()}>
                <input
                  type="radio"
                  name="selectedClass"
                  checked={isSelected}
                  onChange={() => onSelectClass(cls.id)}
                  className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300"
                />
              </TableCell>
              <TableCell className="py-2.5 px-2 font-semibold text-foreground text-xs align-middle">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-foreground font-bold">{cls.name || cls.code}</span>
                    <Badge
                      variant="outline"
                      className={`text-[8px] font-semibold px-1 py-0 border-transparent ${getStatusBadgeClass(
                        cls.status
                      )}`}
                    >
                      {CLASS_STATUS_LABELS[cls.status] || cls.status}
                    </Badge>
                    {isOnline && (
                      <Badge variant="outline" className="text-[8px] font-semibold px-1 py-0 text-muted-foreground">
                        Online Tutor
                      </Badge>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-muted-foreground font-semibold">
                    {cls.code || cls.id.toUpperCase()} • {cls.level} {cls.subLevel ? `(${cls.subLevel})` : ''}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-2.5 px-2 text-xs font-medium text-foreground align-middle">
                {cls.scheduleSlots && cls.scheduleSlots.length > 0 ? (
                  <ScheduleSummary
                    scheduleSlots={cls.scheduleSlots}
                    className={cls.name || cls.code}
                    displayMode="dayOfWeek"
                  />
                ) : (
                  <span className="text-muted-foreground">{cls.schedule || 'Chưa gán lịch'}</span>
                )}
              </TableCell>
              <TableCell className="py-2.5 px-2 text-xs text-foreground align-middle">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground">
                    {cls.scheduleSlots && cls.scheduleSlots.length > 0
                      ? `${cls.scheduleSlots.length} buổi / tuần`
                      : '—'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-2.5 px-2 text-xs text-foreground align-middle">
                {cls.nextSession ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground">
                      {cls.nextSession.date} ({cls.nextSession.time})
                    </span>
                    {cls.nextSession.topic && (
                      <span
                        className="text-[10px] text-muted-foreground truncate max-w-[140px]"
                        title={cls.nextSession.topic}
                      >
                        {cls.nextSession.topic}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground/60">—</span>
                )}
              </TableCell>
              <TableCell className="py-2.5 px-2 text-xs text-muted-foreground align-middle">
                {teacherList.length === 0 ? (
                  <span className="text-muted-foreground/60">Chưa gán</span>
                ) : hasMultipleTeachers ? (
                  <div className="flex items-center gap-2">
                    <AvatarStack items={stackItems} size="xs" />
                    <span className="text-muted-foreground text-[10px] font-semibold">
                      {teacherList.length} GV
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5.5 w-5.5 border bg-primary/10 text-primary text-[9px] font-bold">
                      <AvatarFallback className="font-bold">{getInitials(teacherList[0])}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground truncate max-w-[100px]">
                      {teacherList[0]}
                    </span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right py-2.5 px-2 pr-4 text-xs align-middle">
                <div className="flex items-center justify-end gap-1.5 font-semibold text-foreground">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {cls.enrolledStudents}/{cls.maxStudents}
                  </span>
                </div>
                <div className="text-[10px] text-primary mt-0.5 font-medium">Phòng: {cls.room || '—'}</div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
