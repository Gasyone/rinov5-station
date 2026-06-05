'use client'

import { useState } from 'react'
import { CheckCircle, Copy, FileText, Phone, Users, Clock, MessageSquare, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FieldLabel, InfoField, Panel, ConfirmDialog, DetailDialogFrame } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { RenewalCareRecord } from './renewalTypes'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { toast } from 'sonner'
import { getStatusColors } from '@/lib/statusColors'
import { cn } from '@/lib/utils'

interface RenewalActionDialogProps {
  record: RenewalCareRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveAction: (
    id: string,
    actionType: 'Khách cọc' | 'Hoàn tất' | 'Đóng full' | 'Từ chối' | 'Liên hệ lại',
    notes: string,
    churnReason?: 'Học phí cao' | 'Chuyển nơi ở' | 'Không tiến bộ' | 'Trùng lịch học' | 'Dịch vụ chưa tốt' | 'Khác'
  ) => void
}

export function RenewalActionDialog({
  record,
  open,
  onOpenChange,
  onSaveAction
}: RenewalActionDialogProps) {
  const [copiedPhoneKey, setCopiedPhoneKey] = useState('')
  const [activeSideTab, setActiveSideTab] = useState<'notes' | 'audit'>('notes')

  // States for the Action Confirmation Dialog modal
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [activeAction, setActiveAction] = useState<'Khách cọc' | 'Hoàn tất' | 'Đóng full' | 'Từ chối' | 'Liên hệ lại' | null>(null)
  const [confirmNotes, setConfirmNotes] = useState('')
  const [confirmChurnReason, setConfirmChurnReason] = useState<'Học phí cao' | 'Chuyển nơi ở' | 'Không tiến bộ' | 'Trùng lịch học' | 'Dịch vụ chưa tốt' | 'Khác' | undefined>(undefined)

  if (!record) return null

  const familyMembers = getFamilyContacts(record.studentId, record.studentName)
  const maskPhone = (p: string) => p.length >= 10 ? `${p.slice(0, 3)}****${p.slice(-3)}` : p

  const handleActionClick = (type: 'Khách cọc' | 'Hoàn tất' | 'Đóng full' | 'Từ chối' | 'Liên hệ lại') => {
    setActiveAction(type)
    setConfirmNotes('')
    setConfirmChurnReason(undefined)
    setConfirmOpen(true)
  }

  const handleConfirmAction = () => {
    if (!activeAction) return
    onSaveAction(record.id, activeAction, confirmNotes.trim(), activeAction === 'Từ chối' ? confirmChurnReason : undefined)
    setConfirmOpen(false)
    onOpenChange(false) // Close the main action center Dialog
  }

  return (
    <>
      <DetailDialogFrame
        open={open}
        onOpenChange={onOpenChange}
        title={
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>{record.studentName}</span>
          </div>
        }
        code={record.studentId}
        description={`Tác nghiệp và ghi nhận chăm sóc tái phí học viên lớp ${record.classCode}`}
        status={record.renewalStatus === 'Thành công' ? 'active' : record.renewalStatus === 'Thất bại' ? 'deactivated' : 'in_progress'}
        statusLabel={record.renewalStatus}
        bodyClassName="flex flex-col h-full overflow-hidden p-6"
      >
        {/* Summary Section */}
        <section className="grid gap-x-8 gap-y-4 border-b border-border pb-4 sm:grid-cols-2 lg:grid-cols-5 shrink-0">
          <InfoField label="Học viên" value={record.studentName} supporting={record.studentId} />
          <InfoField label="Môn học / Lớp" value={`${record.subject} - ${record.classCode}`} />
          <InfoField label="Ngày bắt đầu" value={record.startDate} />
          <InfoField 
            label="Hạn hết phí" 
            value={record.expirationDate.split('-').reverse().join('/')} 
            valueClassName="text-primary font-bold font-mono" 
          />
          <InfoField label="CS phụ trách" value={record.csStaff} />
        </section>

        {/* Body Columns Grid */}
        <div className="grid min-h-0 flex-1 gap-8 lg:grid-cols-[1fr_320px] overflow-hidden mt-6">
          {/* Left Column (Main Scrollable) */}
          <main className="min-h-0 space-y-6 overflow-y-auto pr-2">
            {/* Family Panel */}
            <Panel title="Gia đình" icon={<Users className="h-4 w-4" />}>
              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.phone}
                    className="flex items-center justify-between gap-3 rounded-md p-2 transition-colors hover:bg-muted/50 border border-border/20 bg-muted/10"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs font-semibold text-foreground">{member.name}</p>
                        <Badge variant="outline" className="text-[8px] px-1 h-3.5 font-semibold text-muted-foreground border-muted-foreground/35 py-0 font-bold">
                          {member.relationship}
                        </Badge>
                        {member.isPrimary && (
                          <Badge className="text-[8px] px-1 h-3.5 bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-bold py-0">
                            Chính
                          </Badge>
                        )}
                      </div>
                      <p className="font-mono text-[10px] text-muted-foreground mt-0.5">
                        {maskPhone(member.phone)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Gọi ${member.name}`}
                        onClick={() => {
                          toast.success(`Đang thực hiện cuộc gọi giả lập đến ${member.name} (${member.phone})...`);
                        }}
                        className="h-6 w-6 p-0 hover:bg-primary/10 rounded-sm"
                      >
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Sao chép số điện thoại của ${member.name}`}
                        onClick={() => {
                          navigator.clipboard.writeText(member.phone);
                          setCopiedPhoneKey(`detail-${member.phone}`);
                          toast.success(`Đã sao chép SĐT của ${member.name}!`);
                          setTimeout(() => setCopiedPhoneKey(''), 2000);
                        }}
                        className="h-6 w-6 p-0 hover:bg-primary/10 rounded-sm"
                      >
                        {copiedPhoneKey === `detail-${member.phone}` ? (
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Actions Panel */}
            <Panel title="Tác vụ Chăm sóc & Tái phí" icon={<FileText className="h-4 w-4" />}>
              <div className="space-y-4 pt-1">
                <p className="text-xs text-muted-foreground leading-normal">
                  Chọn kết quả cuộc gọi / trạng thái gia hạn để thực hiện tác nghiệp. Hệ thống sẽ mở biểu mẫu nhập chi tiết nội dung cuộc gọi:
                </p>
                
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleActionClick('Liên hệ lại')}
                    className={cn("text-xs h-10 justify-start gap-2 cursor-pointer select-none border", getStatusColors('info').badge, "hover:bg-sky-100/50 dark:hover:bg-sky-900/20")}
                  >
                    <Phone className="h-4 w-4 shrink-0 text-sky-500" />
                    Hẹn gọi lại
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleActionClick('Khách cọc')}
                    className={cn("text-xs h-10 justify-start gap-2 cursor-pointer select-none border", getStatusColors('success').badge, "hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20")}
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    Khách cọc
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleActionClick('Đóng full')}
                    className={cn("text-xs h-10 justify-start gap-2 cursor-pointer select-none border", getStatusColors('success').badge, "hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20")}
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    Đóng đủ phí
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleActionClick('Hoàn tất')}
                    className={cn("text-xs h-10 justify-start gap-2 cursor-pointer select-none border", getStatusColors('completed').badge, "hover:bg-cyan-100/50 dark:hover:bg-cyan-900/20")}
                  >
                    <CheckCircle className="h-4 w-4 shrink-0 text-cyan-500" />
                    Hoàn tất gói
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleActionClick('Từ chối')}
                    className={cn("text-xs h-10 justify-start gap-2 cursor-pointer select-none border col-span-2 sm:col-span-1", getStatusColors('error').badge, "hover:bg-red-100/50 dark:hover:bg-red-900/20")}
                  >
                    <XCircle className="h-4 w-4 shrink-0 text-red-500" />
                    Từ chối học tiếp
                  </Button>
                </div>
              </div>
            </Panel>
          </main>

          {/* Right Column (Side Tabs Panel) */}
          <aside className="flex min-h-0 flex-col overflow-hidden">
            <Tabs
              value={activeSideTab}
              onValueChange={(value) => setActiveSideTab(value as 'notes' | 'audit')}
              className="flex min-h-0 flex-1 flex-col"
            >
              <TabsList className="shrink-0 grid grid-cols-2 h-9">
                <TabsTrigger value="notes" className="text-xs h-8 gap-1 cursor-pointer select-none">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Nhật ký cuộc gọi
                </TabsTrigger>
                <TabsTrigger value="audit" className="text-xs h-8 gap-1 cursor-pointer select-none">
                  <Clock className="h-3.5 w-3.5" />
                  Lịch sử trạng thái
                </TabsTrigger>
              </TabsList>

              {/* Notes tab content */}
              <TabsContent value="notes" className="min-h-0 flex-1 overflow-hidden flex flex-col pt-2 mt-0">
                <div className="flex h-full min-h-0 flex-col">
                  <div className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1 space-y-2.5">
                    {record.interactionLogs.length > 0 ? (
                      record.interactionLogs.map((log) => (
                        <div key={log.id} className="rounded-md bg-muted p-2.5 border border-border/20">
                          <p className="text-xs text-foreground font-medium leading-relaxed">{log.notes}</p>
                          <div className="mt-1.5 flex items-center justify-between text-[9px] text-muted-foreground">
                            <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                              {log.staffName} &middot; <span className="font-bold text-primary">{log.actionType}</span>
                            </span>
                            <span className="font-mono">{log.date.split('-').reverse().join('/')}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="pt-6 text-center text-xs text-muted-foreground italic">
                        Chưa có lịch sử cuộc gọi/tác nghiệp.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Audit history tab content */}
              <TabsContent value="audit" className="min-h-0 flex-1 overflow-y-auto pr-1 pt-2 mt-0">
                {record.interactionLogs.length > 0 ? (
                  <div className="space-y-3 pt-1 pl-1 border-l border-border/50 ml-1.5">
                    {record.interactionLogs.map((log) => (
                      <div key={`${log.id}-audit`} className="flex items-start gap-2.5 text-xs relative">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary -ml-[5px] ring-2 ring-background" />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-foreground text-[11px]">Tác nghiệp cuộc gọi</p>
                          <p className="text-[10px] text-muted-foreground leading-tight">{log.notes.slice(0, 50)}...</p>
                          <p className="mt-0.5 text-[8px] text-muted-foreground font-semibold">
                            {log.date.split('-').reverse().join('/')} &middot; {log.staffName} ({log.actionType})
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-xs text-muted-foreground italic">
                    Chưa có lịch sử trạng thái tác nghiệp.
                      </p>
                )}
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </DetailDialogFrame>

      {/* Confirmation Dialog that is overlayed when an action is selected */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={
          activeAction === 'Từ chối'
            ? 'Xác nhận từ chối học tiếp?'
            : activeAction === 'Khách cọc'
            ? 'Xác nhận đặt cọc tái phí?'
            : activeAction === 'Đóng full'
            ? 'Xác nhận đóng đủ học phí?'
            : activeAction === 'Hoàn tất'
            ? 'Xác nhận hoàn tất gói học?'
            : 'Xác nhận ghi nhận liên hệ?'
        }
        description={
          activeAction === 'Từ chối'
            ? 'Ghi nhận học viên từ chối học tiếp (Thất bại). Vui lòng chọn lý do cụ thể và nhập nội dung cuộc gọi để lưu trữ.'
            : activeAction === 'Khách cọc'
            ? 'Xác nhận phụ huynh đã đặt cọc tái phí. Hệ thống sẽ tự động gia hạn hạn hết phí thêm 30 ngày.'
            : activeAction === 'Đóng full'
            ? 'Xác nhận phụ huynh đã đóng đủ toàn bộ phí gia hạn khóa mới.'
            : activeAction === 'Hoàn tất'
            ? 'Xác nhận phụ huynh đã hoàn tất mọi thủ tục tái phí gói học.'
            : 'Ghi chép nội dung cuộc gọi chăm sóc và đặt lịch/hẹn liên hệ lại với phụ huynh.'
        }
        confirmLabel={
          activeAction === 'Từ chối'
            ? 'Từ chối học tiếp'
            : activeAction === 'Khách cọc'
            ? 'Đã đặt cọc'
            : activeAction === 'Đóng full'
            ? 'Xác nhận đóng đủ'
            : activeAction === 'Hoàn tất'
            ? 'Xác nhận hoàn tất'
            : 'Lưu liên hệ'
        }
        variant={activeAction === 'Từ chối' ? 'destructive' : 'default'}
        confirmDisabled={!confirmNotes.trim() || (activeAction === 'Từ chối' && !confirmChurnReason)}
        onConfirm={handleConfirmAction}
      >
        <div className="space-y-4 mt-3">
          {activeAction === 'Từ chối' && (
            <FieldLabel label="Lý do rời bỏ (Churn Reason)" required>
              <InlineSelect
                value={confirmChurnReason || ''}
                onValueChange={(val) => setConfirmChurnReason(val as 'Học phí cao' | 'Chuyển nơi ở' | 'Không tiến bộ' | 'Trùng lịch học' | 'Dịch vụ chưa tốt' | 'Khác')}
                placeholder="Chọn lý do cụ thể..."
                className="h-9 border-solid text-xs shadow-xs"
                options={[
                  { value: 'Học phí cao', label: 'Học phí cao' },
                  { value: 'Chuyển nơi ở', label: 'Chuyển nơi ở / Chuyển trường' },
                  { value: 'Không tiến bộ', label: 'Con không tiến bộ' },
                  { value: 'Trùng lịch học', label: 'Trùng lịch học khác' },
                  { value: 'Dịch vụ chưa tốt', label: 'Dịch vụ chưa tốt' },
                  { value: 'Khác', label: 'Lý do khác' }
                ]}
              />
            </FieldLabel>
          )}

          <FieldLabel label="Nội dung cuộc gọi / Chi tiết kết quả trao đổi" required>
            <Textarea
              value={confirmNotes}
              onChange={(e) => setConfirmNotes(e.target.value)}
              placeholder="Nhập phản hồi chi tiết của phụ huynh, nguyện vọng hoặc lý do gia hạn..."
              className="min-h-[100px] text-xs leading-normal resize-none bg-background border border-input focus-visible:ring-[3px]"
              required
            />
          </FieldLabel>
        </div>
      </ConfirmDialog>
    </>
  )
}
