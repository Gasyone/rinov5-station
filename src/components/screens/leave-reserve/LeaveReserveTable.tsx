'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusBadgeClass, getStatusColors } from '@/lib/statusColors'
import { ConfirmDialog, EntityCell } from '@/components/shared'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

interface LeaveReserveTableProps {
  requests: LeaveReserveRequest[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onAction: (id: string, action: 'approved' | 'rejected') => void
}

export function LeaveReserveTable({
  requests,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onAction,
}: LeaveReserveTableProps) {
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)

  const selectedApproveRequest = requests.find((r) => r.id === approveId)
  const selectedRejectRequest = requests.find((r) => r.id === rejectId)

  const pageIds = requests.map((r) => r.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  const getTypeText = (type: LeaveReserveRequest['type']) => {
    switch (type) {
      case 'leave':
        return 'Nghỉ phép'
      case 'reserve':
        return 'Bảo lưu'
      case 'suspend':
        return 'Nghỉ học tạm thời'
      default:
        return type
    }
  }

  const getTypeBadgeClass = (type: LeaveReserveRequest['type']) => {
    return getStatusBadgeClass(type)
  }

  const successColors = getStatusColors('success')
  const errorColors = getStatusColors('error')

  return (
    <div className="w-full overflow-auto">
      <Table containerClassName="min-w-full overflow-visible" className="min-w-[1000px] align-top">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted/50 text-center">
              <Checkbox
                checked={isPageSelected}
                onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
              />
            </TableHead>
            <TableHead className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-muted/50 font-semibold">Học viên</TableHead>
            <TableHead className="w-[100px] font-semibold">Mã đơn</TableHead>
            <TableHead className="font-semibold">Trung tâm</TableHead>
            <TableHead className="font-semibold">Loại đơn</TableHead>
            <TableHead className="font-semibold">Thời gian</TableHead>
            <TableHead className="font-semibold">Lý do</TableHead>
            <TableHead className="font-semibold">Trạng thái</TableHead>
            <TableHead className="font-semibold text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                Không tìm thấy yêu cầu nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => (
              <TableRow key={req.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center group-hover:bg-muted">
                  <Checkbox
                    checked={selectedIds.has(req.id)}
                    onCheckedChange={(checked) => onToggleOne(req.id, Boolean(checked))}
                  />
                </TableCell>
                <TableCell className="sticky left-12 z-20 w-64 min-w-64 max-w-64 bg-background group-hover:bg-muted">
                  <div className="relative z-10 max-w-full overflow-hidden pr-24">
                    <EntityCell name={req.studentName} supporting={req.studentCode} />
                    {req.status === 'pending' && (
                      <div
                        className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Phê duyệt"
                          className="bg-transparent shadow-none hover:bg-transparent"
                          onClick={() => setApproveId(req.id)}
                        >
                          <Check className={`h-4 w-4 ${successColors.text}`} />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          title="Từ chối"
                          className="bg-transparent shadow-none hover:bg-transparent"
                          onClick={() => setRejectId(req.id)}
                        >
                          <X className={`h-4 w-4 ${errorColors.text}`} />
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs font-semibold">{req.id}</TableCell>
                <TableCell className="text-sm">{req.branch}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getTypeBadgeClass(req.type)}>
                    {getTypeText(req.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">
                  <div className="flex flex-col">
                    <span>Từ: {req.startDate}</span>
                    <span>Đến: {req.endDate}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm max-w-[200px] truncate" title={req.reason}>
                  {req.reason}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <Badge variant="outline" className={getStatusBadgeClass(req.status)}>
                      {req.status === 'pending'
                        ? 'Chờ duyệt'
                        : req.status === 'approved'
                        ? 'Đã duyệt'
                        : 'Từ chối'}
                    </Badge>
                    {req.approvedBy && (
                      <span className="text-[10px] text-muted-foreground">
                        Bởi: {req.approvedBy} ({req.approvedDate})
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {req.status === 'pending' ? (
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className={`h-8 w-8 ${successColors.text} hover:${successColors.bg} hover:${getStatusColors('success').text.replace('dark:', 'dark:hover:')}`}
                        onClick={() => setApproveId(req.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className={`h-8 w-8 ${successColors.text} ${successColors.badge.split(' ').filter(c => c.startsWith('border-')).join(' ')} hover:${successColors.bg}`}
                        onClick={() => setApproveId(req.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className={`h-8 w-8 ${errorColors.text} ${errorColors.badge.split(' ').filter(c => c.startsWith('border-')).join(' ')} hover:${errorColors.bg}`}
                        onClick={() => setRejectId(req.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Hoàn tất</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Confirm Approve Dialog */}
      <ConfirmDialog
        open={approveId !== null}
        onOpenChange={(open) => { if (!open) setApproveId(null) }}
        title="Phê duyệt đơn yêu cầu"
        description={
          selectedApproveRequest
            ? `Bạn có chắc chắn muốn phê duyệt đơn ${getTypeText(selectedApproveRequest.type).toLowerCase()} của học viên ${selectedApproveRequest.studentName}?`
            : ''
        }
        onConfirm={() => {
          if (approveId) {
            onAction(approveId, 'approved')
            setApproveId(null)
          }
        }}
      />

      {/* Confirm Reject Dialog */}
      <ConfirmDialog
        open={rejectId !== null}
        onOpenChange={(open) => { if (!open) setRejectId(null) }}
        title="Từ chối đơn yêu cầu"
        description={
          selectedRejectRequest
            ? `Bạn có chắc chắn muốn từ chối đơn ${getTypeText(selectedRejectRequest.type).toLowerCase()} của học viên ${selectedRejectRequest.studentName}?`
            : ''
        }
        variant="destructive"
        onConfirm={() => {
          if (rejectId) {
            onAction(rejectId, 'rejected')
            setRejectId(null)
          }
        }}
      />
    </div>
  )
}
