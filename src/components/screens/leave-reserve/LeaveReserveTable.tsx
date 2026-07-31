'use client'

import { useState } from 'react'
import { Check, X, Ban } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { ConfirmDialog, ContactCell, LocationCell, PersonnelCell, StudentNotePopover, AppAvatar } from '@/components/shared'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'
import { getRequestSubject, SUBJECT_OPTIONS } from './leaveReserveHelpers'
import { LeaveReserveReasonDialog } from './LeaveReserveReasonDialog'
import { cn } from '@/lib/utils'

interface LeaveReserveTableProps {
  requests: LeaveReserveRequest[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onAction: (id: string, action: 'approved' | 'not_approved' | 'cancel', reason?: string) => void
  onRowClick?: (request: LeaveReserveRequest) => void
}

export function LeaveReserveTable({
  requests,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onAction,
  onRowClick,
}: LeaveReserveTableProps) {
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [cancelId, setCancelId] = useState<string | null>(null)

  const selectedApproveRequest = requests.find((r) => r.id === approveId)
  const selectedRejectRequest = requests.find((r) => r.id === rejectId)
  const selectedCancelRequest = requests.find((r) => r.id === cancelId)

  const pageIds = requests.map((r) => r.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  const getSubjectLabel = (req: LeaveReserveRequest) => {
    const sub = getRequestSubject(req)
    const found = SUBJECT_OPTIONS.find((opt) => opt.value === sub)
    return found ? found.label : 'Tiếng Anh'
  }

  const getTypeText = (type: LeaveReserveRequest['type']) => {
    switch (type) {
      case 'off':
        return 'Nghỉ phép'
      case 'reservation':
        return 'Bảo lưu'
      case 'learn_again':
        return 'Đi học lại'
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
      case 'not_approved':
        return 'Không duyệt'
      case 'cancel':
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
            <TableHead className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-muted/50 font-semibold">Học viên</TableHead>
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
              <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                Không tìm thấy yêu cầu nào phù hợp.
              </TableCell>
            </TableRow>
          ) : (
            requests.map((req) => {
              return (
                <TableRow 
                  key={req.id} 
                  className="group cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onRowClick?.(req)}
                >
                  <TableCell 
                    className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-background text-center group-hover:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={selectedIds.has(req.id)}
                      onCheckedChange={(checked) => onToggleOne(req.id, Boolean(checked))}
                    />
                  </TableCell>
                  <TableCell className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-background group-hover:bg-muted font-medium">
                    <div className="relative z-10 max-w-full overflow-hidden pr-24 flex items-center gap-3">
                      <AppAvatar
                        name={req.studentName}
                        userId={req.studentId}
                        userType="student"
                        size="md"
                      />
                      <div className="min-w-0 flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-semibold text-sm text-foreground truncate">{req.studentName}</span>
                          <Badge variant="outline" className={cn('shrink-0 text-[10px] px-1.5 py-0.5 h-auto', getTypeBadgeClass(req.type))}>
                            {getTypeText(req.type)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          <span>{req.id}</span>
                          <span>•</span>
                          <span>{req.studentCode}</span>
                        </div>
                      </div>

                      {((req.status === 'pending') || (req.status === 'approved' && req.type !== 'learn_again')) && (
                        <div
                          className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {req.status === 'pending' ? (
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
                          ) : (
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              title="Hủy duyệt"
                              className="h-8 w-8 bg-transparent shadow-none hover:bg-zinc-100 text-zinc-500 hover:text-zinc-650 dark:hover:bg-zinc-800/30 rounded-full"
                              onClick={() => setCancelId(req.id)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
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
                    <div className="flex flex-col gap-0.5">
                      <LocationCell branch={req.branch} />
                      <span className="text-xs text-muted-foreground font-medium">
                        Môn: {getSubjectLabel(req)}
                      </span>
                    </div>
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
                        ...(req.requestedBy ? [{ name: req.requestedBy }] : []),
                        ...(req.approvedBy ? [{ name: req.approvedBy.replace(' (Quản lý)', '') }] : [])
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

      {/* Reject Reason Dialog */}
      <LeaveReserveReasonDialog
        open={rejectId !== null}
        onOpenChange={(open) => { if (!open) setRejectId(null) }}
        request={selectedRejectRequest || null}
        mode="reject"
        onConfirm={(id, reason) => {
          onAction(id, 'not_approved', reason)
          setRejectId(null)
        }}
      />

      {/* Cancel Reason Dialog */}
      <LeaveReserveReasonDialog
        open={cancelId !== null}
        onOpenChange={(open) => { if (!open) setCancelId(null) }}
        request={selectedCancelRequest || null}
        mode="cancel"
        onConfirm={(id, reason) => {
          onAction(id, 'cancel', reason)
          setCancelId(null)
        }}
      />
    </>
  )
}
