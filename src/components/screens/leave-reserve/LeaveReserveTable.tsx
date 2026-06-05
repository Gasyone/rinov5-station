'use client'

import { useState } from 'react'
import { Check, X, Ban } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { ConfirmDialog, EntityCell, ContactCell, LocationCell, PersonnelCell, StudentNotePopover } from '@/components/shared'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

interface LeaveReserveTableProps {
  requests: LeaveReserveRequest[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onAction: (id: string, action: 'approved' | 'rejected' | 'cancelled') => void
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
  const [cancelId, setCancelId] = useState<string | null>(null)

  const selectedApproveRequest = requests.find((r) => r.id === approveId)
  const selectedRejectRequest = requests.find((r) => r.id === rejectId)
  const selectedCancelRequest = requests.find((r) => r.id === cancelId)

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

  const getStatusText = (status: LeaveReserveRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ duyệt'
      case 'approved':
        return 'Đã duyệt'
      case 'rejected':
        return 'Không duyệt'
      case 'cancelled':
        return 'Hủy duyệt'
      default:
        return status
    }
  }

  return (
    <>
      <Table containerClassName="min-w-full overflow-visible" className="min-w-[1750px] align-top">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted/50 text-center">
              <Checkbox
                checked={isPageSelected}
                onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
              />
            </TableHead>
            <TableHead className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-muted/50 font-semibold">Phiếu</TableHead>
            <TableHead className="w-56 min-w-56 max-w-56 font-semibold">Học viên</TableHead>
            <TableHead className="w-56 min-w-56 max-w-56 font-semibold">Liên hệ</TableHead>
            <TableHead className="w-52 min-w-52 max-w-52 font-semibold">Trường học</TableHead>
            <TableHead className="w-52 min-w-52 max-w-52 font-semibold">Lớp học</TableHead>
            <TableHead className="w-56 min-w-56 max-w-56 font-semibold">Gói sản phẩm</TableHead>
            <TableHead className="w-52 min-w-52 max-w-52 font-semibold">Thời gian đề xuất</TableHead>
            <TableHead className="w-52 min-w-52 max-w-52 font-semibold">Nhân sự</TableHead>
            <TableHead className="w-64 min-w-64 max-w-64 font-semibold">Ghi chú</TableHead>
            <TableHead className="w-40 min-w-40 max-w-40 font-semibold">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                Không tìm thấy yêu cầu nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => {
              return (
                <TableRow key={req.id} className="group cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center group-hover:bg-muted">
                    <Checkbox
                      checked={selectedIds.has(req.id)}
                      onCheckedChange={(checked) => onToggleOne(req.id, Boolean(checked))}
                    />
                  </TableCell>
                  <TableCell className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-background group-hover:bg-muted font-medium">
                    <div className="relative z-10 max-w-full overflow-hidden pr-24">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-semibold text-sm text-foreground line-clamp-1">{req.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className={getTypeBadgeClass(req.type)}>
                            {getTypeText(req.type)}
                          </Badge>
                          <span className="font-mono text-xs text-muted-foreground">{req.id}</span>
                        </div>
                      </div>

                      {(req.status === 'pending' || req.status === 'approved') && (
                        <div
                          className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {req.status === 'pending' && (
                            <>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                title="Phê duyệt"
                                className="h-8 w-8 bg-transparent shadow-none hover:bg-emerald-50 text-emerald-600 dark:hover:bg-emerald-950/30 rounded-full"
                                onClick={() => setApproveId(req.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                title="Từ chối"
                                className="h-8 w-8 bg-transparent shadow-none hover:bg-red-50 text-red-600 dark:hover:bg-red-950/30 rounded-full"
                                onClick={() => setRejectId(req.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            title="Hủy duyệt"
                            className="h-8 w-8 bg-transparent shadow-none hover:bg-zinc-100 text-zinc-500 hover:text-zinc-600 dark:hover:bg-zinc-800/30 rounded-full"
                            onClick={() => setCancelId(req.id)}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <EntityCell name={req.studentName} supporting={req.studentCode} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <ContactCell
                      phone={req.phone}
                      name={req.parentName}
                      studentId={req.studentId}
                      studentName={req.studentName}
                      additionalContacts={req.additionalContacts}
                      masked={true}
                    />
                  </TableCell>
                  <TableCell>
                    <LocationCell branch={req.branch} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{req.className}</span>
                      <span className="text-xs text-muted-foreground">{req.classCode}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[180px] truncate" title={req.productPackage}>
                    {req.productPackage}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{req.startDate}</span>
                      <span className="text-xs text-muted-foreground">đến {req.endDate}</span>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <PersonnelCell
                      items={[
                        ...(req.requestedBy ? [{ name: req.requestedBy, role: 'Người tạo' }] : []),
                        ...(req.approvedBy ? [{ name: req.approvedBy.replace(' (Quản lý)', ''), role: 'Người duyệt' }] : [])
                      ]}
                    />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-col gap-0.5 items-start">
                      <StudentNotePopover
                        note={req.reason}
                        label="Lý do đề xuất"
                        triggerTextPrefix=""
                        className="p-0 h-auto hover:bg-transparent"
                      />
                      <span className="text-[10px] text-muted-foreground pl-5 italic shrink-0">
                        Tạo ngày: {req.requestedDate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <Badge variant="outline" className={getStatusBadgeClass(req.status)}>
                        {getStatusText(req.status)}
                      </Badge>
                      {req.approvedBy && (
                        <span className="text-[10px] text-muted-foreground">
                          Bởi: {req.approvedBy} ({req.approvedDate})
                        </span>
                      )}
                    </div>
                  </TableCell>

                </TableRow>
              )
            })
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
            ? `Bạn có chắc chắn muốn phê duyệt đơn "${selectedApproveRequest.title}" của học viên ${selectedApproveRequest.studentName}?`
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
            ? `Bạn có chắc chắn muốn từ chối đơn "${selectedRejectRequest.title}" của học viên ${selectedRejectRequest.studentName}?`
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

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        open={cancelId !== null}
        onOpenChange={(open) => { if (!open) setCancelId(null) }}
        title="Hủy duyệt đơn yêu cầu"
        description={
          selectedCancelRequest
            ? `Bạn có chắc chắn muốn hủy duyệt đơn "${selectedCancelRequest.title}" của học viên ${selectedCancelRequest.studentName}?`
            : ''
        }
        variant="destructive"
        onConfirm={() => {
          if (cancelId) {
            onAction(cancelId, 'cancelled')
            setCancelId(null)
          }
        }}
      />
    </>
  )
}

