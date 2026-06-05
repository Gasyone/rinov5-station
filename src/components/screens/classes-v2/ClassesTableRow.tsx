'use client'

import { Eye, Pencil, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  TableCell,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { StatusBadge, PersonnelCell, LocationCell } from '@/components/shared'
import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import { ScheduleSummary } from './ScheduleSummary'

interface ClassesTableRowProps {
  cls: ClassRecord
  isSelected: boolean
  onToggle: (id: string, checked: boolean) => void
  onRowClick: (id: string) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function ClassesTableRow({
  cls,
  isSelected,
  onToggle,
  onRowClick,
  onView,
  onEdit,
  onDelete,
}: ClassesTableRowProps) {
  const capacityPct = cls.maxStudents > 0 ? Math.round((cls.enrolledStudents / cls.maxStudents) * 100) : 0

  return (
    <TooltipProvider delayDuration={300}>
      <TableRow className="group cursor-pointer border-b-0" onClick={() => onRowClick(cls.id)}>
      {/* Checkbox */}
      <TableCell
        className="sticky left-0 z-30 w-10 min-w-10 max-w-10 bg-background/90 text-center group-hover:bg-muted"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(cls.id, Boolean(checked))}
        />
      </TableCell>

      {/* Lớp học + actions on hover (STICKY) */}
      <TableCell
        className="sticky left-10 z-20 w-[420px] min-w-[420px] max-w-[420px] bg-background/90 group-hover:bg-muted"
        onClick={() => onView(cls.id)}
      >
        <div className="relative z-10 max-w-full overflow-hidden pr-20">
          <div className="min-w-0 space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="truncate font-semibold cursor-help">{cls.name}</p>
              </TooltipTrigger>
              <TooltipContent>{cls.name}</TooltipContent>
            </Tooltip>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">{cls.code}</span>
              <Badge variant="outline" className="rounded-md text-[10px] font-bold">
                {cls.level}
              </Badge>
            </div>
          </div>
          <div
            className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 group-hover:flex"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon-sm" title="Xem chi tiết" onClick={() => onView(cls.id)} className="bg-transparent shadow-none hover:bg-transparent">
              <Eye className="h-4 w-4 text-primary" />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Chỉnh sửa" onClick={() => onEdit(cls.id)} className="bg-transparent shadow-none hover:bg-transparent">
              <Pencil className="h-4 w-4 text-muted-foreground" />
            </Button>
            {(cls.status === 'nhap' || cls.status === 'cho_khai_giang') && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="bg-transparent shadow-none hover:bg-transparent">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {cls.status === 'nhap' && (
                    <>
                      <DropdownMenuItem variant="destructive" onSelect={() => onDelete(cls.id)}>Xóa lớp</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onView(cls.id)}>Xem & Kích hoạt</DropdownMenuItem>
                    </>
                  )}
                  {cls.status === 'cho_khai_giang' && (
                    <DropdownMenuItem variant="destructive" onSelect={() => onDelete(cls.id)}>Hủy lớp</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </TableCell>

      {/* Loại */}
      <TableCell className="min-w-36 text-sm">
        <Badge variant={cls.classType === 'Workshop' ? 'secondary' : 'outline'} className={cls.classType === 'Workshop' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-transparent font-medium' : 'border-border text-foreground font-medium'}>
          {cls.classType || 'Chính thức'}
        </Badge>
      </TableCell>

      {/* Chương trình */}
      <TableCell className="min-w-48">
        <div><span className="text-sm font-medium">{cls.level}</span></div>
        {cls.learningPath && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-[10px] text-muted-foreground truncate mt-0.5 cursor-help">{cls.learningPath}</div>
            </TooltipTrigger>
            <TooltipContent>{cls.learningPath}</TooltipContent>
          </Tooltip>
        )}
      </TableCell>

      {/* Khung chương trình */}
      <TableCell className="min-w-56 text-sm">
        <div className="space-y-0.5">
          {cls.syllabus && cls.syllabus !== '—' ? (
            <span className="font-semibold text-foreground">{cls.syllabus}</span>
          ) : (
            <span className="text-muted-foreground italic">Chưa gán</span>
          )}
          <div className="text-[10px] text-muted-foreground font-mono">{cls.code}</div>
        </div>
      </TableCell>

      {/* Trình độ */}
      <TableCell className="min-w-40">
        <div className="space-y-0.5">
          <span className="text-sm font-medium">{cls.level}</span>
          {cls.subLevel && <div className="text-[10px] text-muted-foreground">{cls.subLevel}</div>}
        </div>
      </TableCell>

      {/* Giáo viên */}
      <TableCell className="min-w-48">
        <PersonnelCell
          items={[
            {
              name: cls.teacher,
              phone: cls.teacherPhone,
              role: 'Giáo viên chủ nhiệm',
            },
            ...(cls.substituteTeachers || []).map((t) => ({
              name: t.name,
              role: 'Giáo viên dạy thay',
              isSubstitute: true,
              date: t.date,
              reason: t.reason,
            })),
          ]}
          size="sm"
          mode="stack"
        />
      </TableCell>

      {/* Sĩ số */}
      <TableCell className="min-w-32">
        <div className="space-y-0.5">
          <div>
            <span className="text-sm font-semibold">{cls.enrolledStudents}/{cls.maxStudents}</span>
            <span className={`ml-1 text-xs ${capacityPct >= 90 ? 'text-destructive' : capacityPct >= 70 ? 'text-warning' : 'text-muted-foreground'}`}>
              ({capacityPct}%)
            </span>
          </div>
          {typeof cls.trialStudents === 'number' && cls.trialStudents > 0 && (
            <div className="text-[10px] text-muted-foreground">Học thử: {cls.trialStudents}</div>
          )}
        </div>
      </TableCell>

      {/* Lịch học */}
      <TableCell className="min-w-64">
        <ScheduleSummary scheduleSlots={cls.scheduleSlots} className={cls.name} />
      </TableCell>

      {/* Buổi học tiếp theo */}
      <TableCell className="min-w-52">
        {cls.nextSession ? (
          <div className="space-y-0.5 max-w-full overflow-hidden">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-semibold text-foreground shrink-0">{cls.nextSession.date}</span>
              <span className="text-xs text-muted-foreground shrink-0">{cls.nextSession.time}</span>
              <Badge variant={cls.nextSession.status === 'in_progress' ? 'default' : 'secondary'} className="text-[9px] px-1 py-0 leading-tight shrink-0">
                {cls.nextSession.status === 'in_progress' ? 'Đang học' : 'Sắp tới'}
              </Badge>
            </div>
            {cls.nextSession.topic && (
              <div className="text-xs text-muted-foreground truncate" title={cls.nextSession.topic}>
                {cls.nextSession.topic}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Chi nhánh */}
      <TableCell className="min-w-48 text-sm">
        <LocationCell branch={cls.branch} room={cls.room} />
      </TableCell>

      {/* Trạng thái */}
      <TableCell className="min-w-36">
        <StatusBadge status={cls.status} label={CLASS_STATUS_LABELS[cls.status]} />
      </TableCell>

      {/* Thời gian */}
      <TableCell className="min-w-44 text-sm text-muted-foreground">
        {new Date(cls.startDate).toLocaleDateString('vi-VN')} — {cls.endDate ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '—'}
      </TableCell>
      </TableRow>
    </TooltipProvider>
  )
}

