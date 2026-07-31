'use client'

import { useState, useMemo } from 'react'
import { Check, X, Ban, Calendar, User, FileText, Briefcase, History, Copy, Phone } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DetailDialogFrame, DetailDialogTabsList, Panel, InfoField, AppAvatar, ConfirmDialog } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { Badge } from '@/components/ui/badge'
import { mockStudents } from '@/mocks/students'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'

import { TYPE_LABELS } from './leaveReserveTypes'
import { getRequestSubject, SUBJECT_OPTIONS } from './leaveReserveHelpers'
import { LeaveReserveReasonDialog } from './LeaveReserveReasonDialog'

interface LeaveReserveDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: LeaveReserveRequest | null
  onAction?: (id: string, action: 'approved' | 'not_approved' | 'cancel', reason?: string) => void
  readOnly?: boolean
}

export function LeaveReserveDetailDialog({
  open,
  onOpenChange,
  request,
  onAction,
  readOnly = false,
}: LeaveReserveDetailDialogProps) {
  const [overrideReq, setOverrideReq] = useState<LeaveReserveRequest | null>(null)
  const [activeTab, setActiveTab] = useState<string>('detail')
  const [lastRequestId, setLastRequestId] = useState<string | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)

  // Render-phase state reset when request prop changes
  const currentRequestId = request?.id || null
  if (currentRequestId !== lastRequestId) {
    setLastRequestId(currentRequestId)
    setOverrideReq(null)
    setActiveTab('detail')
  }

  // Deriving activeReq from overrideReq or prop request
  const activeReq = overrideReq || request

  // Resolve student from mock database
  const student = useMemo(() => {
    if (!activeReq) return null
    return mockStudents.find((s) => s.id === activeReq.studentId) || null
  }, [activeReq])

  // Resolve other proposal requests for this student (history)
  const studentHistory = useMemo(() => {
    if (!activeReq) return []
    return mockLeaveReserveRequests
      .filter((r) => r.studentId === activeReq.studentId)
      .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
  }, [activeReq])



  const getSubjectText = (req: LeaveReserveRequest) => {
    const sub = getRequestSubject(req)
    const found = SUBJECT_OPTIONS.find((opt) => opt.value === sub)
    return found ? found.label : 'Tiếng Anh'
  }

  if (!activeReq) return null

  // Header status colors
  const statusLabel =
    activeReq.status === 'pending'
      ? 'Chờ duyệt'
      : activeReq.status === 'approved'
      ? 'Đã duyệt'
      : activeReq.status === 'not_approved'
      ? 'Không duyệt'
      : 'Hủy duyệt'

  const headerActions = (
    <div className="flex gap-2">
      {activeReq.status === 'pending' && (
        <>
          <Button
            size="sm"
            onClick={() => setApproveConfirmOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Phê duyệt
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setRejectDialogOpen(true)}
          >
            <X className="h-4 w-4 mr-1" />
            Từ chối
          </Button>
        </>
      )}
      {activeReq.status === 'approved' && activeReq.type !== 'learn_again' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCancelDialogOpen(true)}
          className="border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800"
        >
          <Ban className="h-4 w-4 mr-1" />
          Hủy duyệt
        </Button>
      )}
    </div>
  )

  const tabs = [
    { id: 'detail', label: 'Chi tiết đề xuất' },
    { id: 'history', label: `Lịch sử nghỉ phép (${studentHistory.length})` },
  ]

  const getTypeText = (type: LeaveReserveRequest['type']) => {
    return TYPE_LABELS[type] || type
  }

  const contacts = activeReq.additionalContacts && activeReq.additionalContacts.length > 0
    ? activeReq.additionalContacts
    : [
        { name: 'Phụ huynh', phone: activeReq.phone, email: activeReq.email }
      ]

  return (
    <DetailDialogFrame
      open={open}
      onOpenChange={onOpenChange}
      title={activeReq.title}
      code={activeReq.id}
      status={activeReq.status}
      statusLabel={statusLabel}
      actions={readOnly ? null : headerActions}
      description={`Mã học viên: ${activeReq.studentCode} | Họ tên: ${activeReq.studentName}`}
      className="max-w-4xl"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
        <DetailDialogTabsList tabs={tabs} />

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <TabsContent value="detail" className="m-0 h-full">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
              {/* Left Column: Student Info & Academic Info (md:col-span-3) */}
              <div className="space-y-6 md:col-span-3">
                {/* Student Info Panel */}
                <Panel title="Thông tin học viên" icon={<User className="h-4 w-4 text-muted-foreground" />}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 border-b pb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-0.5">Học viên</span>
                      <span className="text-sm font-semibold">{activeReq.studentName} (SID: {activeReq.studentCode})</span>
                    </div>
                    {contacts.map((contact, i) => (
                      <InfoField
                        key={i}
                        label={contact.name}
                        value={
                          <div className="flex items-center justify-between gap-2 group/phone w-full">
                            <span className="font-semibold">{contact.phone}</span>
                            <div className="flex items-center gap-1 opacity-70 group-hover/phone:opacity-100 transition-opacity">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigator.clipboard.writeText(contact.phone)
                                  toast.success('Đã sao chép số điện thoại!')
                                }}
                                title="Sao chép"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-6 w-6 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast.info('Tính năng gọi điện qua tổng đài đang được phát triển!')
                                }}
                                title="Gọi điện (Đang phát triển)"
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        }
                        supporting={contact.email}
                      />
                    ))}
                  </div>
                </Panel>

                {/* Academic/Package Info Panel */}
                <Panel title="Khung chương trình & Gói học" icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}>
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Môn học" value={getSubjectText(activeReq)} />
                    <InfoField label="Mã lớp học" value={activeReq.classCode} supporting={activeReq.className} />
                    <InfoField label="Trường học (Cơ sở)" value={activeReq.branch} />
                    <InfoField label="Loại giáo viên" value="Việt Nam" />
                    <InfoField label="Trình độ lớp" value={student?.level || 'IELTS'} />
                    <InfoField label="Gói học phí" value={activeReq.productPackage} />
                    <InfoField
                      label="Số buổi còn lại"
                      value={student?.remainingSessions !== undefined ? `${student.remainingSessions} / ${student.totalSessions || 36} buổi` : '18 / 36 buổi'}
                    />
                  </div>
                </Panel>


              </div>

              {/* Right Column: Timeline & Proposal Info (md:col-span-2) */}
              <div className="space-y-6 md:col-span-2">
                {/* Proposal Request Details Panel */}
                <Panel title="Thông tin đề xuất thay đổi" icon={<FileText className="h-4 w-4 text-muted-foreground" />}>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <InfoField
                        label="Loại đề xuất"
                        value={
                          <Badge className={getStatusBadgeClass(activeReq.type)}>
                            {getTypeText(activeReq.type)}
                          </Badge>
                        }
                      />
                      <InfoField label="Ngày đề xuất" value={activeReq.requestedDate} />
                    </div>

                    {activeReq.type === 'learn_again' && (
                      <div className="grid grid-cols-1 gap-4 border-t pt-3">
                        <InfoField
                          label="Ngày đi học lại dự kiến"
                          value={activeReq.startDate}
                          icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
                        />
                      </div>
                    )}

                    {activeReq.type === 'off' && (
                      <div className="grid grid-cols-1 gap-4 border-t pt-3">
                        <InfoField
                          label="Ngày nghỉ"
                          value={activeReq.startDate}
                          icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
                        />
                      </div>
                    )}

                    {activeReq.type === 'reservation' && (
                      <div className="grid grid-cols-2 gap-4 border-t pt-3">
                        <InfoField
                          label="Ngày bắt đầu nghỉ"
                          value={activeReq.startDate}
                          icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
                        />
                        <InfoField
                          label="Ngày kết thúc nghỉ"
                          value={activeReq.endDate}
                          icon={<Calendar className="h-3.5 w-3.5 text-muted-foreground" />}
                        />
                      </div>
                    )}

                    {activeReq.type === 'off' && (
                      <div className="grid grid-cols-2 gap-4 border-t pt-3">
                        <InfoField
                          label="Hạn mức nghỉ phép (Quota)"
                          value={`${activeReq.quota ?? 12} buổi`}
                        />
                        <InfoField
                          label="Số buổi đã nghỉ tích lũy"
                          value={`${activeReq.usedAbsences ?? 0} buổi`}
                        />
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground block mb-1">Lý do đề xuất</span>
                      <p className="text-sm bg-muted/40 p-2.5 rounded border leading-relaxed text-foreground">
                        {activeReq.reason || 'Không có lý do chi tiết.'}
                      </p>
                    </div>
                  </div>
                </Panel>

                {/* Timeline Panel */}
                <Panel title="Dòng thời gian phê duyệt" icon={<History className="h-4 w-4 text-muted-foreground" />}>
                  <div className="py-1">
                    <div className="relative pl-6 border-l-2 border-muted space-y-6">
                      {/* Step 1: Created */}
                      <div className="relative">
                        <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border bg-emerald-500 flex items-center justify-center">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </div>
                        <h4 className="text-sm font-semibold">Khởi tạo đề xuất</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <span>Tạo bởi: {activeReq.requestedBy || 'Hệ thống'}</span>
                          <span className="text-muted-foreground/45">•</span>
                          <span className="text-[10px] font-mono">{activeReq.requestedDate}</span>
                        </p>
                      </div>

                      {/* Step 2: Under Review / Status */}
                      <div className="relative">
                        <div
                          className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border flex items-center justify-center ${
                            activeReq.status === 'pending'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-emerald-500'
                          }`}
                        >
                          {activeReq.status === 'pending' ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          ) : (
                            <Check className="h-2.5 w-2.5 text-white" />
                          )}
                        </div>
                        <h4 className="text-sm font-semibold">
                          {activeReq.status === 'pending'
                            ? 'Đang chờ phê duyệt'
                            : activeReq.status === 'approved'
                            ? 'Đã duyệt'
                            : activeReq.status === 'not_approved'
                            ? 'Không duyệt'
                            : 'Đã hủy duyệt'}
                        </h4>
                        {activeReq.status !== 'pending' && (
                          <div className="space-y-1.5">
                            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                              <span>Xử lý bởi: {activeReq.approvedBy || 'Trần Văn A (Quản lý)'}</span>
                              <span className="text-muted-foreground/45">•</span>
                              <span className="text-[10px] font-mono">{activeReq.approvedDate || activeReq.requestedDate}</span>
                            </p>
                            {activeReq.status === 'cancel' && activeReq.cancelReason && (
                              <p className="text-xs text-rose-600 dark:text-rose-455 mt-1 bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded border border-rose-100 dark:border-rose-900/30 font-medium">
                                <strong>Lý do hủy duyệt:</strong> {activeReq.cancelReason}
                              </p>
                            )}
                            {activeReq.status === 'not_approved' && activeReq.rejectReason && (
                              <p className="text-xs text-rose-600 dark:text-rose-455 mt-1 bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded border border-rose-100 dark:border-rose-900/30 font-medium">
                                <strong>Lý do không duyệt:</strong> {activeReq.rejectReason}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Proposal History of student */}
          <TabsContent value="history" className="m-0 h-full">
            <div className="rounded-lg border bg-card">
              <Table containerClassName="overflow-x-auto">
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-48 font-semibold">Đề xuất</TableHead>
                    <TableHead className="w-56 font-semibold">Thời gian tạo</TableHead>
                    <TableHead className="w-48 font-semibold">Thời gian áp dụng</TableHead>
                    <TableHead className="font-semibold">Lý do</TableHead>
                    <TableHead className="w-32 font-semibold text-center">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        Không có lịch sử đề xuất nào khác cho học viên này.
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentHistory.map((h) => {
                      const isCurrent = h.id === activeReq.id
                      return (
                        <TableRow
                          key={h.id}
                          className={`cursor-pointer hover:bg-muted/50 ${
                            isCurrent ? 'bg-muted font-medium' : ''
                          }`}
                          onClick={() => {
                            setOverrideReq(h)
                            setActiveTab('detail')
                          }}
                        >
                          <TableCell className="text-xs">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="font-mono font-semibold text-primary underline">
                                {h.id} {isCurrent && <span className="text-[10px] font-normal text-muted-foreground">(Hiện tại)</span>}
                              </span>
                              <Badge className={getStatusBadgeClass(h.type)}>
                                {getTypeText(h.type)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <AppAvatar
                                  name={h.requestedBy || 'Hệ thống'}
                                  size="xs"
                                  shape="circle"
                                  className="shrink-0"
                                />
                                <span className="truncate text-xs font-semibold text-foreground">{h.requestedBy || 'Hệ thống'}</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground font-mono mt-1 pl-[26px]">
                                {h.requestedDate}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            {h.type === 'learn_again' ? h.startDate : `${h.startDate} → ${h.endDate}`}
                          </TableCell>
                          <TableCell className="text-xs max-w-xs truncate">
                            {h.reason || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getStatusBadgeClass(h.status)}>
                              {h.status === 'pending'
                                ? 'Chờ duyệt'
                                : h.status === 'approved'
                                ? 'Đã duyệt'
                                : h.status === 'not_approved'
                                ? 'Không duyệt'
                                : 'Hủy duyệt'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <LeaveReserveReasonDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        request={activeReq}
        mode="cancel"
        onConfirm={(id, reason) => {
          onAction?.(id, 'cancel', reason)
          setOverrideReq((prev) => {
            const base = prev || request
            return base ? { ...base, status: 'cancel', approvedBy: 'Trần Văn A (Quản lý)', approvedDate: new Date().toISOString().split('T')[0], cancelReason: reason } : null
          })
          setCancelDialogOpen(false)
        }}
      />

      <LeaveReserveReasonDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        request={activeReq}
        mode="reject"
        onConfirm={(id, reason) => {
          onAction?.(id, 'not_approved', reason)
          setOverrideReq((prev) => {
            const base = prev || request
            return base ? { ...base, status: 'not_approved', approvedBy: 'Trần Văn A (Quản lý)', approvedDate: new Date().toISOString().split('T')[0], rejectReason: reason } : null
          })
          setRejectDialogOpen(false)
        }}
      />

      <ConfirmDialog
        open={approveConfirmOpen}
        onOpenChange={setApproveConfirmOpen}
        title="Xác nhận phê duyệt"
        description={`Bạn có chắc chắn muốn phê duyệt đơn "${activeReq.title}" của học viên ${activeReq.studentName}?`}
        confirmLabel="Phê duyệt"
        variant="default"
        onConfirm={() => {
          onAction?.(activeReq.id, 'approved')
          setOverrideReq((prev) => {
            const base = prev || request
            return base ? { ...base, status: 'approved', approvedBy: 'Trần Văn A (Quản lý)', approvedDate: new Date().toISOString().split('T')[0] } : null
          })
        }}
      />
    </DetailDialogFrame>
  )
}
