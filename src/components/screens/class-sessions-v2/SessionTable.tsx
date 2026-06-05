'use client'

import { useState, Fragment } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTablePagination } from '@/components/data-table'
import { StatusBadge } from '@/components/shared'
import { ChevronRight, ChevronDown, CalendarDays, Calendar, User, MoreHorizontal, AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ClassSession } from '@/mocks/classSessions'
import type { SessionGroup } from './classSessionTypes'
import { STATUS_LABELS } from './classSessionTypes'
import { isSubstitute, formatDate } from './classSessionHelpers'

interface SessionTableProps {
  groups: SessionGroup[]
  selectedIds: Set<string>
  onToggleSelect: (id: string) => void
  onAction: (action: string, session: ClassSession) => void
}

function GroupHeaderRow({
  group,
  isExpanded,
  selectedCount,
  onToggleExpand,
}: {
  group: SessionGroup
  isExpanded: boolean
  selectedCount: number
  onToggleExpand: () => void
}) {
  return (
    <TableRow className="bg-muted/50 hover:bg-muted">
      <TableCell colSpan={7} className="p-0">
        <button
          type="button"
          onClick={onToggleExpand}
          className="w-full flex items-center gap-2 px-3 py-2 text-left"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
          <span className="text-sm font-semibold">{group.className}</span>
          <span className="text-xs text-muted-foreground">{group.classCode}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            {group.teacher}
          </span>
          <Badge variant="secondary" className="text-xs ml-auto">
            {group.sessions.length} buổi
          </Badge>
          {selectedCount > 0 && (
            <Badge variant="default" className="text-xs">
              Đã chọn {selectedCount}
            </Badge>
          )}
        </button>
      </TableCell>
    </TableRow>
  )
}

function SessionRow({
  session,
  isSelected,
  onToggleSelect,
  onAction,
}: {
  session: ClassSession
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onAction: (action: string, session: ClassSession) => void
}) {
  const [moreOpen, setMoreOpen] = useState(false)
  const isSub = isSubstitute(session)
  const hasActions = session.status !== 'completed' && session.status !== 'audited'

  return (
    <TableRow
      className={cn(
        'group cursor-pointer',
        isSelected && 'bg-accent',
        session.status === 'cancelled' && 'opacity-60',
      )}
    >
      <TableCell className={cn(
        'sticky left-0 z-30 w-12 min-w-12 max-w-12 text-center group-hover:bg-muted',
        isSelected ? 'bg-accent' : 'bg-background',
      )}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(session.id)}
          aria-label={`Chọn ${session.code}`}
        />
      </TableCell>
      <TableCell className={cn(
        'sticky left-12 z-20 w-64 min-w-64 max-w-64 group-hover:bg-muted',
        isSelected ? 'bg-accent' : 'bg-background',
      )}>
        <div className="relative z-10 max-w-full overflow-hidden pr-28">
          <div className="min-w-0 truncate font-semibold" title={session.topic}>
            {session.topic}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{session.code}</span>
            {session.hasConflict && (
              <span className="flex items-center gap-0.5 text-amber-600">
                <AlertCircle className="h-3 w-3" />
                Xung đột
              </span>
            )}
          </div>
        </div>

        {hasActions && (
          <div
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
            onClick={(e) => e.stopPropagation()}
          >
            {session.status === 'scheduled' && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Mở điểm danh"
                onClick={() => onAction('attendance', session)}
                className="bg-transparent shadow-none hover:bg-transparent"
              >
                <Check className="h-4 w-4 text-primary" />
              </Button>
            )}
            {session.status === 'in_progress' && (
              <Button
                variant="ghost"
                size="icon-sm"
                title="Tiếp tục điểm danh"
                onClick={() => onAction('attendance', session)}
                className="bg-transparent shadow-none hover:bg-transparent"
              >
                <Check className="h-4 w-4 text-emerald-600" />
              </Button>
            )}
            <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="bg-transparent shadow-none hover:bg-transparent"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                {session.status === 'scheduled' && (
                  <DropdownMenuItem onClick={() => onAction('reschedule', session)}>
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Dời lịch
                  </DropdownMenuItem>
                )}
                {session.status === 'scheduled' && (
                  <DropdownMenuItem variant="destructive" onClick={() => onAction('cancel', session)}>
                    <Calendar className="h-4 w-4 mr-1.5" />
                    Hủy buổi
                  </DropdownMenuItem>
                )}
                {session.status === 'cancelled' && (
                  <DropdownMenuItem onClick={() => onAction('makeup', session)}>
                    <CalendarDays className="h-4 w-4 mr-1.5" />
                    Tạo học bù
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </TableCell>
      <TableCell className="min-w-[140px]">
        <div className="flex items-center gap-1">
          <span className="text-sm">{isSub ? session.substituteTeacher : session.teacher}</span>
          {isSub && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              dạy thay
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="min-w-[160px]">
        <div className="text-sm">{session.dayOfWeek}</div>
        <div className="text-xs text-muted-foreground">
          {session.startTime}–{session.endTime}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatDate(session.date)}
        </div>
      </TableCell>
      <TableCell className="w-[90px] text-sm">{session.room}</TableCell>
      <TableCell className="w-[90px]">
        <div className="text-sm">{session.attended}/{session.total}</div>
        {session.total > 0 && (
          <div className="text-xs text-muted-foreground">
            {Math.round((session.attended / session.total) * 100)}%
          </div>
        )}
      </TableCell>
      <TableCell className="w-[130px]">
        <StatusBadge status={session.status} label={STATUS_LABELS[session.status] ?? session.status} />
      </TableCell>
    </TableRow>
  )
}

export function SessionTable({
  groups,
  selectedIds,
  onToggleSelect,
  onAction,
}: SessionTableProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(groups.slice(0, 3).map((g) => g.classId)),
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const toggleGroup = (classId: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(classId)) next.delete(classId)
      else next.add(classId)
      return next
    })
  }

  const totalSessions = groups.reduce((n, g) => n + g.sessions.length, 0)

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border border-border bg-card">
      <div className="min-h-0 flex-1 overflow-auto">
        <Table containerClassName="min-w-[850px]" className="min-w-[850px]">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted text-center">
                <Checkbox checked={false} onCheckedChange={() => {}} aria-label="Chọn tất cả" />
              </TableHead>
              <TableHead className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-muted">Topic</TableHead>
              <TableHead className="min-w-[140px]">Giáo viên</TableHead>
              <TableHead className="min-w-[160px]">Thời gian</TableHead>
              <TableHead className="w-[90px]">Phòng</TableHead>
              <TableHead className="w-[90px]">Sĩ số</TableHead>
              <TableHead className="w-[130px]">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => {
              const isExpanded = expandedKeys.has(group.classId)
              const selectedCount = group.sessions.filter((s) => selectedIds.has(s.id)).length

              return (
                <Fragment key={group.classId}>
                  <GroupHeaderRow
                    group={group}
                    isExpanded={isExpanded}
                    selectedCount={selectedCount}
                    onToggleExpand={() => toggleGroup(group.classId)}
                  />
                  {isExpanded &&
                    group.sessions.map((session) => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        isSelected={selectedIds.has(session.id)}
                        onToggleSelect={onToggleSelect}
                        onAction={onAction}
                      />
                    ))}
                </Fragment>
              )
            })}
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Không có buổi học nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        page={page}
        total={totalSessions}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </div>
  )
}