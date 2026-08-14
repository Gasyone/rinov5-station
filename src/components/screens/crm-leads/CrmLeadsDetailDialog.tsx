'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Lead } from '@/mocks/crmLeads'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { InfoField, Panel } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { SOURCE_LABEL_MAP, STATUS_LABEL_MAP } from './crmLeadsTypes'
import { Baby, Phone, Mail, UserCheck, Calendar, Copy, Check, Sparkles, GraduationCap, User, Users } from 'lucide-react'
import { CrmLeadsBookingTestModal } from './CrmLeadsBookingTestModal'
import { CrmLeadsTrialClassModal } from './CrmLeadsTrialClassModal'

interface CrmLeadsDetailDialogProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CrmLeadsDetailDialog({
  lead,
  open,
  onOpenChange,
}: CrmLeadsDetailDialogProps) {
  const [copied, setCopied] = useState(false)
  const [isTestModalOpen, setIsTestModalOpen] = useState(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)

  if (!lead) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(lead.phone)
    setCopied(true)
    toast.success(`Đã sao chép số điện thoại: ${lead.phone}`)
    setTimeout(() => setCopied(false), 2000)
  }

  const birthYear = lead.birthYear ?? 2026 - lead.studentAge
  const leadChildObj = {
    id: lead.id,
    name: lead.studentName,
    age: lead.studentAge,
    birthYear,
    targetSubject: lead.targetSubject,
    notes: lead.lastNote,
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pr-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Baby className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <span>{lead.studentName}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      ({lead.studentAge}t - {birthYear})
                    </span>
                  </DialogTitle>
                  <div className="text-xs text-muted-foreground">
                    Mã Lead: <span className="font-mono">{lead.code}</span> • Phụ huynh: <span className="font-semibold text-foreground">{lead.parentName}</span> ({lead.parentRole || 'Phụ huynh'})
                  </div>
                </div>
              </div>
              <Badge className={getStatusBadgeClass(lead.status)}>
                {STATUS_LABEL_MAP[lead.status] ?? lead.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nút Tác nghiệp Nhanh cho Học viên */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-3 rounded-lg border border-border/60">
              <div className="text-sm font-medium text-foreground">
                Khóa học quan tâm: <span className="font-bold text-emerald-700 dark:text-emerald-400">{lead.targetSubject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary/10 text-xs font-medium cursor-pointer"
                  onClick={() => setIsTestModalOpen(true)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Đặt lịch Kiểm tra năng lực</span>
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 border-violet-500/30 text-violet-700 hover:bg-violet-50 dark:text-violet-300 dark:hover:bg-violet-950 text-xs font-medium cursor-pointer"
                  onClick={() => setIsTrialModalOpen(true)}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Đăng ký Lớp học thử</span>
                </Button>
              </div>
            </div>

            {/* Thông tin Phụ huynh (Người đại diện) */}
            <Panel title="Thông tin Phụ huynh (Người đại diện bảo trợ)">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField
                  label="Họ tên Phụ huynh"
                  value={
                    <div className="flex items-center gap-1.5 font-semibold">
                      <User className="h-4 w-4 text-primary" />
                      <span>{lead.parentName}</span>
                      {lead.parentRole && (
                        <Badge variant="outline" className="text-xs">
                          {lead.parentRole}
                        </Badge>
                      )}
                    </div>
                  }
                />
                <InfoField
                  label="Số điện thoại (Đầy đủ)"
                  value={
                    <div className="flex items-center gap-2 font-mono font-medium text-emerald-700 dark:text-emerald-400">
                      <Phone className="h-4 w-4" />
                      <span>{lead.phone}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="h-6 w-6 ml-1 cursor-pointer"
                        title="Sao chép số điện thoại"
                        onClick={handleCopy}
                      >
                        {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                  }
                />
                <InfoField
                  label="Email"
                  value={
                    lead.email ? (
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.email}</span>
                      </div>
                    ) : (
                      '---'
                    )
                  }
                />
                <InfoField
                  label="Địa chỉ gia đình"
                  value={lead.address}
                />
                <InfoField
                  label="Nguồn Lead"
                  value={SOURCE_LABEL_MAP[lead.source] ?? lead.source}
                />
                <InfoField
                  label="Chi nhánh tiếp nhận"
                  value={lead.branch}
                />
                <InfoField
                  label="Tư vấn viên phụ trách"
                  value={
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                      <span>{lead.assignedTo}</span>
                    </div>
                  }
                />
                <InfoField
                  label="Ngày khởi tạo"
                  value={
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{lead.createdAt}</span>
                    </div>
                  }
                />
              </div>
            </Panel>

            {/* Liên kết các bé cùng Gia đình */}
            {lead.familySiblings && lead.familySiblings.length > 0 && (
              <Panel title="Liên kết gia đình (Anh / Chị / Em)">
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-sky-50 dark:bg-sky-950/40 border border-sky-200 text-sky-900 dark:text-sky-200 text-xs">
                  <Users className="h-4 w-4 text-sky-600 shrink-0" />
                  <span>Phụ huynh này còn có các Lead học viên khác trong hệ thống: </span>
                  <span className="font-bold">{lead.familySiblings.join(', ')}</span>
                </div>
              </Panel>
            )}

            {/* Ghi chú tư vấn mới nhất */}
            {lead.lastNote && (
              <Panel title="Ghi chú tư vấn mới nhất">
                <p className="text-sm text-foreground bg-muted/40 p-3 rounded-md border border-border/50">
                  {lead.lastNote}
                </p>
              </Panel>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal 1: Đặt lịch Kiểm tra & Đánh giá năng lực */}
      <CrmLeadsBookingTestModal
        lead={lead}
        child={leadChildObj}
        open={isTestModalOpen}
        onOpenChange={setIsTestModalOpen}
      />

      {/* Modal 2: Đăng ký Lớp học thử */}
      <CrmLeadsTrialClassModal
        lead={lead}
        child={leadChildObj}
        open={isTrialModalOpen}
        onOpenChange={setIsTrialModalOpen}
      />
    </>
  )
}

