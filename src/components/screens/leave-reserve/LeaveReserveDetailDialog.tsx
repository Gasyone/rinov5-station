'use client'

import { useState, useMemo } from 'react'
import {
  X,
  Calendar,
  User,
  FileText,
  Clock,
  Copy,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  History,
  Sparkles,
  ExternalLink,
  MapPin,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppAvatar, ConfirmDialog } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { mockStudents } from '@/mocks/students'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { cn } from '@/lib/utils'
import { TYPE_LABELS, STATUS_LABELS } from './leaveReserveTypes'
import { getRequestSubject, SUBJECT_OPTIONS, maskPhone } from './leaveReserveHelpers'
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
  const [lastRequestId, setLastRequestId] = useState<string | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false)

  // Reset when request changes
  const currentRequestId = request?.id || null
  if (currentRequestId !== lastRequestId) {
    setLastRequestId(currentRequestId)
    setOverrideReq(null)
  }

  const activeReq = overrideReq || request

  const student = useMemo(() => {
    if (!activeReq) return null
    return mockStudents.find((s) => s.id === activeReq.studentId) || null
  }, [activeReq])

  const studentHistory = useMemo(() => {
    if (!activeReq) return []
    return mockLeaveReserveRequests
      .filter((r) => r.studentId === activeReq.studentId)
      .sort((a, b) => new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime())
  }, [activeReq])

  if (!activeReq) return null

  const subjectText = () => {
    const sub = getRequestSubject(activeReq)
    const found = SUBJECT_OPTIONS.find((opt) => opt.value === sub)
    return found ? found.label : 'Tiếng Anh'
  }

  const handleApprove = () => {
    setApproveConfirmOpen(false)
    if (onAction) {
      onAction(activeReq.id, 'approved')
    } else {
      setOverrideReq({ ...activeReq, status: 'approved' })
      toast.success(`Đã phê duyệt đơn ${activeReq.id} thành công!`)
    }
  }

  const handleReject = (reason: string) => {
    setRejectDialogOpen(false)
    if (onAction) {
      onAction(activeReq.id, 'not_approved', reason)
    } else {
      setOverrideReq({ ...activeReq, status: 'not_approved' })
      toast.success(`Đã từ chối đơn ${activeReq.id}!`)
    }
  }

  const handleCancel = (reason: string) => {
    setCancelDialogOpen(false)
    if (onAction) {
      onAction(activeReq.id, 'cancel', reason)
    } else {
      setOverrideReq({ ...activeReq, status: 'cancel' })
      toast.success(`Đã hủy duyệt đơn ${activeReq.id}!`)
    }
  }

  const statusLabel = STATUS_LABELS[activeReq.status] || activeReq.status
  const typeLabel = TYPE_LABELS[activeReq.type] || activeReq.type

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[92vw] max-w-4xl sm:max-w-4xl lg:max-w-5xl bg-card p-0 gap-0 overflow-hidden border border-border shadow-2xl rounded-2xl">
          {/* Accessible Header Bar */}
          <DialogHeader className="px-6 pt-4 pb-2 flex flex-row items-center justify-between space-y-0 text-left">
            <div className="flex items-center gap-2.5">
              <DialogTitle className="text-xs font-medium text-muted-foreground">
                Chi tiết Đơn yêu cầu
              </DialogTitle>
              <span className="text-xs font-mono font-bold bg-muted px-2 py-0.5 rounded-full border border-border/80 text-foreground">
                {activeReq.id}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'text-xs font-semibold px-2.5 py-0.5 rounded-full border',
                  getStatusBadgeClass(activeReq.status)
                )}
              >
                {statusLabel}
              </span>
            </div>
          </DialogHeader>
          <DialogDescription className="sr-only">
            {activeReq.title || `Chi tiết đơn ${activeReq.id} của học viên ${activeReq.studentName}`}
          </DialogDescription>

          <div className="p-6 pt-2 space-y-4 max-h-[82vh] overflow-y-auto">
            {/* Top Student Hero Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Large Avatar */}
                  <div className="relative">
                    <AppAvatar
                      name={activeReq.studentName}
                      src={student?.avatar}
                      size="xl"
                      className="h-14 w-14 rounded-full border-2 border-primary/20 text-lg font-bold"
                    />
                  </div>

                  {/* Student Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-foreground">
                        {activeReq.studentName}
                      </span>
                      <button
                        type="button"
                        className="text-[11px] font-medium text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2 py-0.5 rounded-md border border-border/70 inline-flex items-center gap-1 transition-colors"
                      >
                        <span>+ Thêm tên TA</span>
                        <span className="text-[10px]">✎</span>
                      </button>
                      <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0.5">
                        {typeLabel}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span>NS: {student?.dob || '15/03/2012'}</span>
                      <span>•</span>
                      <span>{student?.gender || 'Nam'}</span>
                      <span>•</span>
                      <span>ĐC: {activeReq.branch}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap pt-0.5">
                      <span className="font-medium text-foreground">
                        {activeReq.parentName || student?.parentName || 'Phạm Mai (Mẹ)'}
                      </span>
                      <span className="text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 px-1.5 py-0.2 rounded border border-sky-200 dark:border-sky-800">
                        Chính
                      </span>
                      <span>•</span>
                      <span className="font-mono font-semibold text-foreground">
                        {activeReq.phone || '0912345678'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(activeReq.phone || '')
                          toast.success('Đã sao chép SĐT!')
                        }}
                        className="text-muted-foreground hover:text-foreground p-0.5 transition-colors"
                        title="Sao chép"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Student Code Pill */}
                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {activeReq.studentCode || `STU-00${activeReq.studentId.replace(/\D/g, '')}`}
                  </span>
                </div>
              </div>

              {/* Student Note bar */}
              <div className="flex items-center gap-2 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60 rounded-lg px-3 py-1.5 text-xs text-amber-900 dark:text-amber-200">
                <span className="text-amber-600 font-bold shrink-0">✎</span>
                <span className="italic font-medium truncate">
                  Ghi chú: {student?.notes || activeReq.reason || 'Học viên tiếp thu tốt, phụ huynh mong muốn theo sát chuyên cần và bài tập.'}
                </span>
              </div>
            </div>

            {/* Body 2x2 Bento Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Thông tin Lớp học & Đơn yêu cầu */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-foreground font-semibold text-xs uppercase tracking-wider">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>Thông tin Lớp học & Đơn yêu cầu</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Cơ sở / Trường</span>
                    <span className="font-semibold text-foreground">{activeReq.branch}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Môn học</span>
                    <span className="font-semibold text-foreground">{subjectText()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Lớp học</span>
                    <span className="font-semibold text-foreground">{activeReq.className}</span>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      ({activeReq.classCode})
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Gói học phí</span>
                    <span className="font-semibold text-foreground">
                      {activeReq.productPackage || 'Gói chuẩn'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40 text-xs flex items-center justify-between bg-muted/20 p-2 rounded">
                  <span className="text-muted-foreground">Thời gian trải nghiệm / Áp dụng:</span>
                  <span className="font-semibold text-foreground font-mono">
                    {activeReq.startDate} {activeReq.endDate && activeReq.endDate !== activeReq.startDate ? `→ ${activeReq.endDate}` : ''}
                  </span>
                </div>
              </div>

              {/* Card 2: Thời hạn & Phụ trách */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-foreground font-semibold text-xs uppercase tracking-wider">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <span>Thời hạn & Phụ trách</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Ngày tạo phiếu</span>
                    <span className="font-semibold text-foreground font-mono">
                      {activeReq.requestedDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Phân loại</span>
                    <span className="font-semibold text-foreground">{typeLabel}</span>
                  </div>
                </div>

                <div className="pt-1 space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs">
                        LN
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Nguồn tạo (Sale / CSM)</span>
                        <span className="font-medium text-foreground">Lê Hoàng Nam</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                        GV
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Giáo viên phụ trách</span>
                        <span className="font-medium text-foreground">Sarah J. ({activeReq.branch})</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-[11px] font-medium cursor-pointer"
                      onClick={() => toast.info('Tính năng đổi người phụ trách đang phát triển!')}
                    >
                      Đổi GV
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card 3: Chi tiết Nghiệp vụ & Hạn mức */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-foreground font-semibold text-xs uppercase tracking-wider">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span>Chi tiết Nghiệp vụ & Hạn mức</span>
                </div>

                {activeReq.type === 'off' ? (
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-amber-50/50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Hạn mức vắng phép</span>
                        <span className="font-bold text-foreground">{activeReq.quota ?? 12} buổi / năm</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Số buổi xin nghỉ đợt này</span>
                        <span className="font-bold text-amber-700 dark:text-amber-400">
                          {activeReq.usedAbsences ? `${activeReq.usedAbsences} buổi` : '1 buổi'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      ✓ Đơn xin nghỉ hợp lệ (đã gửi trước giờ học &gt; 2 tiếng). Sau khi duyệt, học viên có thể đăng ký lịch học bù tại phân hệ Học bù.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2 bg-sky-50/50 dark:bg-sky-950/20 p-2.5 rounded-lg border border-sky-200/60 dark:border-sky-800/40">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Hình thức bảo lưu</span>
                        <span className="font-bold text-foreground">Bảo lưu giữ chỗ</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Hết hạn dự kiến</span>
                        <span className="font-bold text-sky-700 dark:text-sky-400 font-mono">
                          {activeReq.endDate || 'Chưa cập nhật'}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      ✓ Bảo lưu giữ chỗ: Tạm ngưng trừ phí trong thời hạn bảo lưu. Học viên vẫn nằm trong danh sách lớp.
                    </p>
                  </div>
                )}
              </div>

              {/* Card 4: Lịch sử thao tác & Nhật ký */}
              <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-border/50 text-foreground font-semibold text-xs uppercase tracking-wider">
                  <History className="h-4 w-4 text-primary shrink-0" />
                  <span>Lịch sử thao tác & Nhật ký</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Lê Hoàng Nam (Sale)</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {activeReq.requestedDate} 09:30
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Đã tạo đơn yêu cầu theo đề nghị của Phụ huynh qua Zalo/Điện thoại.
                    </p>
                  </div>

                  {activeReq.status !== 'pending' && (
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Quản lý chi nhánh</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {activeReq.requestedDate} 10:15
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground font-medium leading-snug">
                        Trạng thái: <span className="font-bold">{statusLabel}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Card 5: Lịch sử nghỉ phép & bảo lưu của học viên */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/50 text-foreground font-semibold text-xs uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-primary shrink-0" />
                  <span>Lịch sử đơn nghỉ phép & bảo lưu của học viên</span>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-muted px-2 py-0.5 rounded-full border text-muted-foreground">
                  {studentHistory.length} đơn
                </span>
              </div>

              {studentHistory.length === 0 ? (
                <div className="text-center py-4 bg-muted/20 rounded-xl border border-dashed border-border/70 text-muted-foreground text-xs">
                  Học viên chưa có lịch sử đơn nghỉ phép hoặc bảo lưu nào khác.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground text-[11px] text-left">
                        <th className="pb-2 font-medium">Mã đơn</th>
                        <th className="pb-2 font-medium">Loại đơn</th>
                        <th className="pb-2 font-medium">Thời gian</th>
                        <th className="pb-2 font-medium">Lớp học</th>
                        <th className="pb-2 font-medium">Lý do</th>
                        <th className="pb-2 font-medium text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {studentHistory.map((item) => (
                        <tr
                          key={item.id}
                          className={cn(
                            'hover:bg-muted/30 transition-colors',
                            item.id === activeReq.id && 'bg-primary/5 font-medium'
                          )}
                        >
                          <td className="py-2.5 font-mono font-bold text-foreground">
                            {item.id}
                            {item.id === activeReq.id && (
                              <span className="ml-1 text-[9px] bg-primary/20 text-primary px-1 py-0.2 rounded font-sans">
                                Đang xem
                              </span>
                            )}
                          </td>
                          <td className="py-2.5">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {TYPE_LABELS[item.type] || item.type}
                            </Badge>
                          </td>
                          <td className="py-2.5 font-mono text-muted-foreground text-[11px]">
                            {item.startDate} {item.endDate && item.endDate !== item.startDate ? `→ ${item.endDate}` : ''}
                          </td>
                          <td className="py-2.5 text-foreground">
                            {item.className}
                          </td>
                          <td className="py-2.5 text-muted-foreground max-w-[200px] truncate" title={item.reason}>
                            {item.reason || '—'}
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className={cn(
                                'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                                getStatusBadgeClass(item.status)
                              )}
                            >
                              {STATUS_LABELS[item.status] || item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Clean Footer Bar */}
          <div className="px-6 py-4 flex items-center justify-between border-t border-border/40 bg-muted/10">
            {/* Left Destructive / Reject Action */}
            <div>
              {!readOnly && activeReq.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => setRejectDialogOpen(true)}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer transition-colors"
                >
                  Từ chối đơn
                </button>
              )}
              {!readOnly && activeReq.status === 'approved' && activeReq.type !== 'learn_again' && (
                <button
                  type="button"
                  onClick={() => setCancelDialogOpen(true)}
                  className="text-xs font-semibold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer transition-colors"
                >
                  Hủy duyệt đơn
                </button>
              )}
            </div>

            {/* Right Buttons */}
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer font-medium"
              >
                Đóng
              </Button>

              {!readOnly && activeReq.status === 'pending' && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setApproveConfirmOpen(true)}
                  className="font-semibold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer shadow-sm"
                >
                  Phê duyệt đơn
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Approve Dialog */}
      <ConfirmDialog
        open={approveConfirmOpen}
        onOpenChange={setApproveConfirmOpen}
        title="Xác nhận phê duyệt đơn"
        description={`Bạn có chắc chắn muốn phê duyệt đơn yêu cầu ${activeReq.id} cho học viên ${activeReq.studentName}?`}
        confirmLabel="Phê duyệt"
        onConfirm={handleApprove}
      />

      {/* Reject Reason Dialog */}
      <LeaveReserveReasonDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        request={activeReq}
        mode="reject"
        onConfirm={handleReject}
      />

      {/* Cancel Approved Request Dialog */}
      <LeaveReserveReasonDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        request={activeReq}
        mode="cancel"
        onConfirm={handleCancel}
      />
    </>
  )
}
