'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table } from '@/components/ui/table'
import { StatusBadge } from '@/components/shared'
import { User, ExternalLink, Image as ImageIcon, Link2 } from 'lucide-react'
import {
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
  QC_ERROR_TYPE_LABELS,
  INSPECTOR_OPTIONS,
  getInitials,
} from '@/mocks/qcChecks'
import type { QcExtendedError } from './qcRemediationTypes'
import { formatDate, formatShortDate } from './qcRemediationHelpers'
import { isErrorOverdue } from './qcRemediationTypes'

interface QcRemediationTableProps {
  errors: QcExtendedError[]
  selectedIds: Set<string>
  onToggleAll: () => void
  onToggleOne: (id: string) => void
  onRowClick: (id: string) => void
  onAssign: (errorId: string, assigneeId: string) => void
}

export function QcRemediationTable({
  errors,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onRowClick,
  onAssign,
}: QcRemediationTableProps) {
  const [assigneeSearch, setAssigneeSearch] = useState('')

  if (errors.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        Không có lỗi nào cần xử lý.
      </div>
    )
  }

  const isAllSelected = errors.length > 0 && errors.every((e) => selectedIds.has(e.id))

  function renderEvidenceBadge(
    link?: string,
    image?: string,
    text?: string
  ) {
    if (!link && !image && !text) return <span className="text-muted-foreground">—</span>

    if (text && !link && !image) {
      return (
        <Badge variant="outline" className="gap-1 rounded text-[10px] truncate max-w-[120px]">
          <ImageIcon className="h-3 w-3 shrink-0" />
          Mô tả
        </Badge>
      )
    }

    if (image || link) {
      return (
        <Badge variant="outline" className="gap-1 rounded text-[10px]">
          {image ? (
            <ImageIcon className="h-3 w-3" />
          ) : (
            <Link2 className="h-3 w-3" />
          )}
          {image && <ExternalLink className="h-3 w-3" />}
        </Badge>
      )
    }
    return <span className="text-muted-foreground">—</span>
  }

  function renderRemediationBadge(hasRemediation: boolean, hasAction: boolean) {
    if (hasRemediation && hasAction) {
      return (
        <div className="flex flex-col gap-0.5">
          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">
            Đã khắc phục
          </Badge>
          <Badge className="border-blue-200 bg-blue-50 text-blue-700 text-[10px]">
            Đã có hành động
          </Badge>
        </div>
      )
    }
    if (hasRemediation) {
      return <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px]">Đã khắc phục</Badge>
    }
    return <span className="text-muted-foreground text-xs">Chưa</span>
  }

  return (
    <div className="min-w-full">
      <Table containerClassName="!overflow-x-visible" className="min-w-[1400px] align-top">
        <thead>
          <tr className="bg-muted/50 border-b-0">
            <th className="w-[40px] px-3 py-2">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={onToggleAll}
                aria-label="Chọn tất cả"
              />
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium">Hạng mục lỗi</th>
            <th className="w-[100px] px-3 py-2 text-left text-xs font-medium">Sự kiện QC</th>
            <th className="w-[90px] px-3 py-2 text-left text-xs font-medium">Ngày</th>
            <th className="w-[80px] px-3 py-2 text-left text-xs font-medium">Loại</th>
            <th className="w-[80px] px-3 py-2 text-left text-xs font-medium">Mức độ</th>
            <th className="w-[80px] px-3 py-2 text-left text-xs font-medium">Bằng chứng</th>
            <th className="px-3 py-2 text-left text-xs font-medium">Mô tả lỗi</th>
            <th className="w-[120px] px-3 py-2 text-left text-xs font-medium">Thành viên</th>
            <th className="w-[120px] px-3 py-2 text-left text-xs font-medium">Feedback ảnh/Link</th>
            <th className="w-[120px] px-3 py-2 text-left text-xs font-medium">Khắc phục / Hành động</th>
            <th className="w-[120px] px-3 py-2 text-left text-xs font-medium">Trạng thái</th>
            <th className="w-[90px] px-3 py-2 text-left text-xs font-medium">Hoàn thành</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((error) => {
            const isLate = isErrorOverdue(error)
            const hasCorrectiveAction = !!(error.correctiveAction && error.correctiveAction.length > 0)
            const assignedInspector = INSPECTOR_OPTIONS.find((i) => i.id === error.assignee)

            return (
              <tr
                key={error.id}
                className={`transition-colors border-b-0 ${
                  selectedIds.has(error.id) ? 'bg-muted/50' : 'hover:bg-muted/50'
                } ${isLate ? 'bg-violet-50/40 dark:bg-violet-950/20' : ''}`}
                onClick={() => onRowClick(error.id)}
              >
                <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.has(error.id)}
                    onCheckedChange={() => onToggleOne(error.id)}
                    aria-label={`Chọn ${error.code}`}
                  />
                </td>

                {/* Hạng mục lỗi */}
                <td className="px-3 py-2.5 cursor-pointer max-w-[200px]">
                  <p className="text-xs font-medium truncate">{error.itemLabel}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{error.code}</p>
                </td>

                {/* Sự kiện QC */}
                <td className="px-3 py-2.5 cursor-pointer text-xs">
                  <span className="font-medium">{error.eventCode}</span>
                  {error.eventName && (
                    <span className="block text-muted-foreground max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {error.eventName}
                    </span>
                  )}
                </td>

                {/* Ngày ghi nhận */}
                <td className="px-3 py-2.5 cursor-pointer text-xs">{formatShortDate(error.createdAt)}</td>

                {/* Loại lỗi */}
                <td className="px-3 py-2.5 cursor-pointer">
                  <Badge variant="outline" className="rounded text-[10px]">
                    {QC_ERROR_TYPE_LABELS[error.errorType] ?? error.errorType}
                  </Badge>
                </td>

                {/* Mức độ */}
                <td className="px-3 py-2.5 cursor-pointer">
                  <Badge className={
                    error.severity === 'critical'
                      ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'
                      : error.severity === 'high'
                        ? 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400'
                        : error.severity === 'medium'
                          ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400'
                          : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                  }>
                    {QC_ERROR_SEVERITY_LABELS[error.severity]}
                  </Badge>
                </td>

                {/* Bằng chứng */}
                <td className="px-3 py-2.5 cursor-pointer">
                  {renderEvidenceBadge(error.evidenceLink, error.evidenceImage, error.evidence)}
                </td>

                {/* Mô tả lỗi */}
                <td className="px-3 py-2.5 cursor-pointer max-w-[200px]">
                  {error.description ? (
                    <p className="text-xs text-muted-foreground line-clamp-2" title={error.description}>
                      {error.description}
                    </p>
                  ) : (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </td>

                {/* Thành viên / Assign */}
                <td className="px-3 py-2.5 text-xs" onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const filteredInspectors = INSPECTOR_OPTIONS.filter((ins) =>
                      ins.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
                      (ins.role && ins.role.toLowerCase().includes(assigneeSearch.toLowerCase()))
                    )

                    return assignedInspector ? (
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                          {getInitials(assignedInspector.name)}
                        </div>
                        <span className="truncate max-w-[80px] text-xs">{assignedInspector.name}</span>
                        <DropdownMenu onOpenChange={(open) => { if (!open) setAssigneeSearch('') }}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-xs" className="h-5 w-5 shrink-0">
                              <User className="h-3 w-3 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-[200px]">
                            <div className="p-2 border-b">
                              <Input
                                placeholder="Tìm nhân sự..."
                                value={assigneeSearch}
                                onChange={(e) => setAssigneeSearch(e.target.value)}
                                className="h-8 w-full text-xs"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                            </div>
                            {filteredInspectors.length === 0 ? (
                              <div className="p-2 text-xs text-muted-foreground text-center">
                                Không tìm thấy nhân sự
                              </div>
                            ) : (
                              filteredInspectors.map((ins) => (
                                <DropdownMenuItem
                                  key={ins.id}
                                  onClick={() => onAssign(error.id, ins.id)}
                                  className="text-xs"
                                >
                                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary mr-2">
                                    {getInitials(ins.name)}
                                  </div>
                                  <span className="truncate">{ins.name}</span>
                                  {assignedInspector?.id === ins.id && ' (hiện tại)'}
                                </DropdownMenuItem>
                              ))
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <DropdownMenu onOpenChange={(open) => { if (!open) setAssigneeSearch('') }}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 gap-1 text-xs text-muted-foreground border-dashed">
                            <User className="h-3 w-3" />
                            Gán người xử lý
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[200px]">
                          <div className="p-2 border-b">
                            <Input
                              placeholder="Tìm nhân sự..."
                              value={assigneeSearch}
                              onChange={(e) => setAssigneeSearch(e.target.value)}
                              className="h-8 w-full text-xs"
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                          {filteredInspectors.length === 0 ? (
                            <div className="p-2 text-xs text-muted-foreground text-center">
                              Không tìm thấy nhân sự
                            </div>
                          ) : (
                            filteredInspectors.map((ins) => (
                              <DropdownMenuItem
                                key={ins.id}
                                onClick={() => onAssign(error.id, ins.id)}
                                className="text-xs"
                              >
                                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary mr-2">
                                  {getInitials(ins.name)}
                                </div>
                                <span className="truncate">{ins.name}</span>
                                {ins.role && (
                                  <span className="ml-1 text-muted-foreground text-[10px]">— {ins.role}</span>
                                )}
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  })()}
                </td>

                {/* Feedback ảnh/Link */}
                <td className="px-3 py-2.5 cursor-pointer">
                  {renderEvidenceBadge(error.correctiveLink, error.correctiveImage)}
                </td>

                {/* Khắc phục / Hành động */}
                <td className="px-3 py-2.5 cursor-pointer">
                  {renderRemediationBadge(
                    error.status === 'corrected' || error.status === 'closed',
                    hasCorrectiveAction
                  )}
                </td>

                {/* Trạng thái */}
                <td className="px-3 py-2.5 cursor-pointer">
                  <div className="flex flex-col gap-1 items-start">
                    <StatusBadge
                      status={error.status === 'not_met' ? 'error' : `qc_error_${error.status}`}
                      label={QC_ERROR_STATUS_LABELS[error.status]}
                    />
                    {isLate && (
                      <Badge className="border-violet-200 bg-violet-50 text-violet-700 text-[10px] dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400 font-medium">
                        Trễ hạn
                      </Badge>
                    )}
                    {error.status === 'not_met' && (
                      <p className="text-[10px] text-destructive font-medium">
                        Cần cập nhật lại
                      </p>
                    )}
                  </div>
                </td>

                {/* Ngày hoàn thành */}
                <td className="px-3 py-2.5 cursor-pointer text-xs tabular-nums">
                  {error.completionDate ? formatDate(error.completionDate) : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
