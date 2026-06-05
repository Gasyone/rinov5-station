'use client'

import { useState, Fragment } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared'
import { DataTablePagination } from '@/components/data-table'
import { ChevronRight, ChevronDown, ExternalLink } from 'lucide-react'
import type { SessionFeedback } from '@/mocks/sessionFeedback'
import type { SessionFeedbackGroup } from './sessionFeedbackTypes'
import { getFeedbackCompletionRate, formatDate } from './sessionFeedbackHelpers'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { ATTENDANCE_LABELS } from '@/mocks/sessionFeedback'

interface SessionFeedbackTableProps {
  groups: SessionFeedbackGroup[]
  onOpenFeedbackForm: (feedback: SessionFeedback) => void
}

function GroupHeaderRow({
  group,
  isExpanded,
  onToggleExpand,
}: {
  group: SessionFeedbackGroup
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  const rate = getFeedbackCompletionRate(group)

  return (
    <TableRow className="bg-muted/30 hover:bg-muted/40">
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
          <span className="font-mono text-xs">{group.sessionCode}</span>
          <span className="text-sm font-semibold">{group.topic || group.className}</span>
          <span className="text-xs text-muted-foreground">{group.className}</span>
          <span className="text-xs text-muted-foreground">{formatDate(group.date)}</span>
          <Badge variant="secondary" className="text-xs ml-auto">
            {rate.completed}/{rate.total} nhận xét
          </Badge>
          {rate.percentage === 100 && rate.total > 0 && (
            <Badge className={`text-xs ${getStatusBadgeClass('approved')}`}>
              ✓ Hoàn thành
            </Badge>
          )}
        </button>
      </TableCell>
    </TableRow>
  )
}

function FeedbackRow({
  feedback,
  onOpenForm,
}: {
  feedback: SessionFeedback
  onOpenForm: (f: SessionFeedback) => void
}) {
  return (
    <TableRow className="group hover:bg-muted/50">
      <TableCell className="sticky left-0 z-30 w-10 min-w-10 max-w-10 text-center bg-card group-hover:bg-muted">
        <Checkbox checked={false} disabled aria-label={`Chọn ${feedback.studentName}`} />
      </TableCell>
      <TableCell className="sticky left-10 z-20 min-w-[160px] max-w-[220px] bg-card group-hover:bg-muted">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium truncate">{feedback.studentName}</span>
          {feedback.homeworkScore !== undefined && (
            <span className="text-xs text-muted-foreground">Điểm: {feedback.homeworkScore}/10</span>
          )}
        </div>
      </TableCell>
      <TableCell className="min-w-[100px]">
        <StatusBadge status={feedback.attendance} label={ATTENDANCE_LABELS[feedback.attendance]} />
      </TableCell>
      <TableCell className="min-w-[200px]">
        {feedback.homeworkUrl && feedback.homeworkTitle ? (
          <a
            href={feedback.homeworkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{feedback.homeworkTitle}</span>
          </a>
        ) : feedback.homeworkStatus === 'missing' ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <span className="text-sm text-muted-foreground">{feedback.homeworkTitle}</span>
        )}
      </TableCell>
      <TableCell className="min-w-[100px] hidden md:table-cell">
        <span className="text-sm">{feedback.progress === 'improved' ? 'Tiến bộ' : feedback.progress === 'stable' ? 'Ổn định' : 'Cần QT'}</span>
      </TableCell>
      <TableCell className="min-w-[100px] hidden lg:table-cell">
        {feedback.feedback ? (
          <span className="text-sm line-clamp-1 text-muted-foreground" title={feedback.feedback}>
            {feedback.feedback}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="w-[130px]">
        <div className="flex items-center gap-2">
          <StatusBadge
            status={feedback.status}
            label={feedback.status === 'completed' ? 'Đã NX' : feedback.status === 'pending' ? 'Chưa NX' : 'Cần TL'}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onOpenForm(feedback)}
          >
            {feedback.status === 'completed' ? 'Sửa' : 'Nhận xét'}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function SessionFeedbackTable({
  groups,
  onOpenFeedbackForm,
}: SessionFeedbackTableProps) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
    () => new Set(groups.length > 0 ? [groups[0]?.sessionId] : []),
  )
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const toggleGroup = (sessionId: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev)
      if (next.has(sessionId)) next.delete(sessionId)
      else next.add(sessionId)
      return next
    })
  }

  const totalStudents = groups.reduce((n, g) => n + g.feedbacks.length, 0)
  const totalPages = Math.max(1, Math.ceil(totalStudents / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)

  return (
    <div className="flex h-full min-h-0 flex-col rounded-lg border border-border bg-card overflow-hidden">
      <div className="min-h-0 flex-1 overflow-auto">
        <Table containerClassName="min-w-full" className="min-w-[800px]">
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
              <TableHead className="sticky left-0 z-30 w-10 min-w-10 max-w-10 bg-muted/50" />
              <TableHead className="sticky left-10 z-20 min-w-[160px] max-w-[220px] bg-muted/50">Học viên</TableHead>
              <TableHead className="min-w-[100px]">Điểm danh</TableHead>
              <TableHead className="min-w-[200px]">Bài tập về nhà</TableHead>
              <TableHead className="min-w-[100px] hidden md:table-cell">Tiến bộ</TableHead>
              <TableHead className="min-w-[100px] hidden lg:table-cell">Nhận xét</TableHead>
              <TableHead className="w-[130px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => {
              const isExpanded = expandedKeys.has(group.sessionId)

              return (
                <Fragment key={group.sessionId}>
                  <GroupHeaderRow
                    group={group}
                    isExpanded={isExpanded}
                    onToggleExpand={() => toggleGroup(group.sessionId)}
                  />
                  {isExpanded &&
                    group.feedbacks.map((feedback) => (
                      <FeedbackRow
                        key={feedback.id}
                        feedback={feedback}
                        onOpenForm={onOpenFeedbackForm}
                      />
                    ))}
                </Fragment>
              )
            })}
            {groups.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  Không có nhận xét nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        page={safePage}
        total={totalStudents}
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