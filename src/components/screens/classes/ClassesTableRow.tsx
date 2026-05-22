'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/shared'
import { MoreHorizontal, Pencil, Trash2, Eye, GraduationCap } from 'lucide-react'
import type { ClassRecord, SubstituteTeacher } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import { ScheduleSummary } from './ScheduleSummary'

interface ClassesTableRowProps {
  cls: ClassRecord
  isSelected: boolean
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  onOpenClass: (id: string) => void
  onCancelClass: (id: string) => void
}

export function ClassesTableRow({
  cls,
  isSelected,
  onToggle,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onOpenClass,
  onCancelClass,
}: ClassesTableRowProps) {
  const [hoveredTeacher, setHoveredTeacher] = useState<string | null>(null)
  const capacityPct = cls.maxStudents > 0 ? Math.round((cls.enrolledStudents / cls.maxStudents) * 100) : 0
  const actions = getActions(cls, onView, onEdit, onDelete, onOpenClass, onCancelClass)

  return (
    <TableRow className="cursor-pointer border-b-0" onClick={() => onRowClick(cls.id)}>
      <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(cls.id, Boolean(checked))}
        />
      </TableCell>

      {/* Lớp học: tên + mã code + level badge */}
      <TableCell>
        <p className="font-semibold truncate" title={cls.name}>{cls.name}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span className="font-mono">{cls.code}</span>
          <Badge variant="outline" className="rounded-md text-[10px] font-bold">
            {cls.level}
          </Badge>
        </div>
      </TableCell>

      {/* Chương trình đào tạo */}
      <TableCell className="text-sm">{cls.level || '—'}</TableCell>

      {/* GV chủ nhiệm (avatar) */}
      <TableCell>
        <div className="flex items-center gap-2">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHoveredTeacher(cls.teacher)}
            onMouseLeave={() => setHoveredTeacher(null)}
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                {getInitials(cls.teacher)}
              </AvatarFallback>
            </Avatar>
            {hoveredTeacher === cls.teacher && (
              <TeacherMiniProfile name={cls.teacher} phone={cls.teacherPhone} />
            )}
          </div>
          <span className="text-sm">{cls.teacher}</span>
        </div>
      </TableCell>

      {/* GV dạy thay */}
      <TableCell>
        <div className="flex items-center gap-1">
          {cls.substituteTeachers && cls.substituteTeachers.length > 0 ? (
            cls.substituteTeachers.map((sub, idx) => (
              <div key={idx} className="relative cursor-pointer"
                onMouseEnter={() => setHoveredTeacher(sub.name)}
                onMouseLeave={() => setHoveredTeacher(null)}
              >
                <Avatar className="h-7 w-7 border-2 border-dashed border-muted-foreground/30">
                  <AvatarFallback className="text-xs font-medium bg-amber-100 text-amber-700">
                    {getInitials(sub.name)}
                  </AvatarFallback>
                </Avatar>
                {hoveredTeacher === sub.name && (
                  <TeacherMiniProfile name={sub.name} note={sub.reason} date={sub.date} />
                )}
              </div>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </TableCell>

      {/* Sĩ số */}
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-medium">{cls.enrolledStudents}</span>
            <span className="text-muted-foreground">/ {cls.maxStudents}</span>
          </div>
          <Progress value={capacityPct} className="h-1 w-16" />
        </div>
      </TableCell>

      {/* Lịch học */}
      <TableCell>
        <ScheduleSummary schedule={cls.schedule} scheduleSlots={cls.scheduleSlots} />
      </TableCell>

      {/* Chi nhánh */}
      <TableCell className="text-sm">
        <div>{cls.branch}</div>
        {cls.room && <div className="text-xs text-muted-foreground">Phòng {cls.room}</div>}
      </TableCell>

      {/* Trạng thái */}
      <TableCell>
        <StatusBadge status={cls.status} label={CLASS_STATUS_LABELS[cls.status]} />
      </TableCell>

      {/* Thời gian */}
      <TableCell>
        <div className="text-xs leading-relaxed">
          <div>{new Date(cls.startDate).toLocaleDateString('vi-VN')}</div>
          <div className="text-muted-foreground">→ {cls.endDate ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '—'}</div>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="w-10 text-right" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {actions.map((a) => (
              <DropdownMenuItem
                key={a.label}
                onClick={a.action}
                className={a.danger ? 'text-destructive focus:text-destructive' : ''}
              >
                {a.icon}
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

interface TeacherMiniProfileProps {
  name: string
  phone?: string
  note?: string
  date?: string
}

function TeacherMiniProfile({ name, phone, note }: TeacherMiniProfileProps) {
  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 rounded-lg border bg-popover p-3 shadow-lg animate-in fade-in-0 zoom-in-95">
      <p className="font-semibold text-sm truncate">{name}</p>
      {phone && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">SĐT:</span> {phone}
        </p>
      )}
      {note && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className="font-medium">Lý do:</span> {note}
        </p>
      )}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
        <div className="border-t-8 border-x-8 border-x-transparent border-r-8 border-l-8 border-t-popover" />
      </div>
    </div>
  )
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
}

interface ActionItem {
  label: string
  action: () => void
  danger?: boolean
  icon?: ReactNode
}

function getActions(
  cls: ClassRecord,
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  onDelete: (id: string) => void,
  onOpenClass: (id: string) => void,
  onCancelClass: (id: string) => void,
): ActionItem[] {
  const items: ActionItem[] = []

  if (cls.status === 'nhap') {
    items.push({ label: 'Xem chi tiết', action: () => onView(cls.id), icon: <Eye className="h-4 w-4 mr-2" /> })
    items.push({ label: 'Chỉnh sửa', action: () => onEdit(cls.id), icon: <Pencil className="h-4 w-4 mr-2" /> })
    items.push({ label: 'Xóa', action: () => onDelete(cls.id), danger: true, icon: <Trash2 className="h-4 w-4 mr-2" /> })
    items.push({ label: 'Mở chiêu sinh', action: () => onOpenClass(cls.id), icon: <GraduationCap className="h-4 w-4 mr-2 text-emerald-600" /> })
  } else if (cls.status === 'mo_chieu_sinh') {
    items.push({ label: 'Xem chi tiết', action: () => onView(cls.id), icon: <Eye className="h-4 w-4 mr-2" /> })
    items.push({ label: 'Chỉnh sửa', action: () => onEdit(cls.id), icon: <Pencil className="h-4 w-4 mr-2" /> })
    items.push({ label: 'Hủy lớp', action: () => onCancelClass(cls.id), danger: true, icon: <Trash2 className="h-4 w-4 mr-2" /> })
  } else if (cls.status === 'dang_hoc') {
    items.push({ label: 'Xem chi tiết', action: () => onView(cls.id), icon: <Eye className="h-4 w-4 mr-2" /> })
    items.push({ label: 'Đóng lớp', action: () => onCancelClass(cls.id), icon: <GraduationCap className="h-4 w-4 mr-2" /> })
  } else {
    items.push({ label: 'Xem chi tiết', action: () => onView(cls.id), icon: <Eye className="h-4 w-4 mr-2" /> })
  }

  return items
}
