'use client'

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  PhoneCall,
  Info
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHistoryLogsForStudent, stableHash, getRenewalClassification, getRenewalClassificationLabel } from './renewalHelpers'
import { toast } from 'sonner'
import { completeCareTag, updateCareAlertInteraction, updateRenewalClassification, mockCareAlerts, getFamilyContacts } from '@/mocks/careAlerts'
import { AudioPlayButton } from '../AudioPlayButton'
import { useCallStore } from '@/stores/useCallStore'
import { getStatusBadgeClass } from '@/lib/statusColors'

interface CSTPHistoryPopoverProps {
  trigger: React.ReactNode
  studentName: string
  studentId: string
  subject: string
  careCode?: string
  totalCareCount?: number
  onRefresh?: () => void
  readOnly?: boolean
  tagLabel?: string
}

function getMonthYearString(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        return `Tháng ${parseInt(parts[1], 10)}/${parts[2]}`
      }
    }
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return ''
    return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`
  } catch {
    return ''
  }
}

export function CSTPHistoryPopover({
  trigger,
  studentName,
  studentId,
  subject,
  careCode,
  totalCareCount = 1,
  onRefresh,
  readOnly = false,
  tagLabel = 'CSTP'
}: CSTPHistoryPopoverProps) {
  const startCall = useCallStore(s => s.startCall);
  const alertRecord = mockCareAlerts.find(a => a.studentId === studentId || a.studentName === studentName);
  
  const [open, setOpen] = useState(false);
  const [newLogChannel, setNewLogChannel] = useState<'telephone' | 'zalo' | 'direct' | 'facebook'>('zalo');
  const [newLogNotes, setNewLogNotes] = useState('');
  const [callStatusMarking, setCallStatusMarking] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const handleInteractionWithStatus = (status?: 'dang_cham_soc' | 'can_nhac' | 'tiem_nang' | 'hen_tai') => {
    if (status && alertRecord) {
      updateRenewalClassification(alertRecord.studentId, status);
    }

    if (newLogNotes.trim()) {
      let channelLabel: 'Đã nhắn Zalo' | 'KNM' | 'Đã gọi' | 'Đã gặp trực tiếp' | 'Đã nhắn Facebook' | 'Chưa gọi' = 'Đã nhắn Zalo';
      if (newLogChannel === 'telephone') {
        channelLabel = (callStatusMarking === 'knm' || callStatusMarking === 'may_ban' || callStatusMarking === 'sdt_sai') 
          ? 'KNM' 
          : 'Đã gọi';
      } else if (newLogChannel === 'direct') {
        channelLabel = 'Đã gặp trực tiếp';
      } else if (newLogChannel === 'facebook') {
        channelLabel = 'Đã nhắn Facebook';
      }

      const fullNote = `[${tagLabel}] ${newLogNotes}`;
      updateCareAlertInteraction(alertRecord?.id || studentId, {
        staffName: 'CS Staff',
        callConfirmation: channelLabel,
        notes: fullNote
      });
      setNewLogNotes('');
      setCallStatusMarking(null);
    }

    setOpen(false);

    if (status) {
      const statusLabels = {
        dang_cham_soc: 'Chăm sóc',
        can_nhac: 'Cân nhắc',
        tiem_nang: 'Tiềm năng',
        hen_tai: 'Hẹn tái'
      };
      toast.success(`Đã ghi nhận tương tác và cập nhật trạng thái: ${statusLabels[status]}!`);
    } else {
      toast.success("Đã ghi nhận tương tác!");
    }

    if (onRefresh) onRefresh();
  };

  const getStaffInitials = (staffName: string) => {
    const isGV = staffName.includes('(GV)') || staffName.toLowerCase().includes('gv') || staffName.toLowerCase().includes('giáo viên');
    return isGV ? 'GV' : 'CS';
  }

  const getStaffAvatarColor = (staffName: string) => {
    const isGV = staffName.includes('(GV)') || staffName.toLowerCase().includes('gv') || staffName.toLowerCase().includes('giáo viên');
    return isGV 
      ? 'bg-violet-50 text-violet-750 border-violet-200 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-850'
      : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-850';
  }

  const tagDescription = tagLabel === 'UPSALE'
    ? 'Chăm sóc Bán thêm (Upsale): Tư vấn khóa học, sản phẩm hoặc môn học mới cho học viên.'
    : 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới.';

  // Show ALL history logs — no longer filtered by tag
  const rawLogs = getHistoryLogsForStudent(studentId);

  const addedLogs = alertRecord?.interactionLogs.filter(l => l.notes.includes(`[${tagLabel}]`)) || [];
  const hash = stableHash(studentId);
  const totalAttempts = (hash % 3) + addedLogs.length + totalCareCount;

  const currentClassification = alertRecord 
    ? getRenewalClassification(alertRecord)
    : 'dang_cham_soc';

  const handleToggleCompletion = (targetStatus: 'chong_phi' | 'tai_phi') => {
    if (!newLogNotes.trim() && addedLogs.length === 0) {
      setWarningMessage("Bạn chưa ghi nhận nội dung chăm sóc!");
      return;
    }

    setWarningMessage(null);

    if (newLogNotes.trim()) {
      let channelLabel: 'Đã nhắn Zalo' | 'KNM' | 'Đã gọi' | 'Đã gặp trực tiếp' | 'Đã nhắn Facebook' | 'Chưa gọi' = 'Đã nhắn Zalo';
      if (newLogChannel === 'telephone') {
        channelLabel = (callStatusMarking === 'knm' || callStatusMarking === 'may_ban' || callStatusMarking === 'sdt_sai') 
          ? 'KNM' 
          : 'Đã gọi';
      } else if (newLogChannel === 'direct') {
        channelLabel = 'Đã gặp trực tiếp';
      } else if (newLogChannel === 'facebook') {
        channelLabel = 'Đã nhắn Facebook';
      }

      const fullNote = `[${tagLabel}] ${newLogNotes}`;
      updateCareAlertInteraction(alertRecord?.id || studentId, {
        staffName: 'CS Staff',
        callConfirmation: channelLabel,
        notes: fullNote
      });
      setNewLogNotes('');
      setCallStatusMarking(null);
    }

    completeCareTag(studentId, tagLabel);
    updateRenewalClassification(studentId, targetStatus);
    setOpen(false);
    toast.success(`Đã cập nhật trạng thái và hoàn thành cảnh báo!`);
    if (onRefresh) onRefresh();
  };

  return (
    <Popover open={open} onOpenChange={(val) => { setOpen(val); if (!val) setWarningMessage(null); }}>
      <PopoverTrigger asChild>
        <div onClick={(e) => e.stopPropagation()}>
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] max-h-[min(580px,85vh)] overflow-y-auto rounded-xl shadow-lg border bg-popover text-popover-foreground z-50 p-4" align="start" side="bottom" sideOffset={5}>
        <div className="pb-2 border-b border-border/60 mb-3 text-left">
          <h4 className="text-xs font-bold flex items-center gap-2 text-foreground">
            Học viên: <span className="font-bold text-foreground">{studentName}</span> ({studentId}) &bull; {subject}
          </h4>
        </div>

        <div className="space-y-4">
          <div className="space-y-3.5 text-left">
            {/* 1. Header Row (Tag Badge & Name & SLA & Top Action buttons) */}
            <div className="flex items-start justify-between border-b border-border/60 pb-2.5">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="text-xs font-bold text-foreground">
                    {tagLabel} &bull; Chăm sóc Tái phí
                  </h4>
                  <span title={tagDescription} className="cursor-help inline-flex items-center"><Info className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground shrink-0" /></span>
                  {alertRecord && (
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0",
                      getStatusBadgeClass(currentClassification)
                    )}>
                      {getRenewalClassificationLabel(currentClassification)}
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <span>SLA: <strong className="text-emerald-500">Trong hạn SLA</strong></span>
                  &bull;
                  <span>Đã liên hệ: <strong>{totalAttempts} lần</strong></span>
                </div>
              </div>
              
              {!readOnly && (
                <div className="flex items-center gap-3 shrink-0 select-none">
                  <div className="flex items-center gap-1">
                    <Checkbox
                      id={`popover-chong-phi-${studentId}`}
                      checked={currentClassification === 'chong_phi'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleToggleCompletion('chong_phi');
                        }
                      }}
                      className="h-3.5 w-3.5 rounded shadow-none border-zinc-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`popover-chong-phi-${studentId}`}
                      className="text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer select-none leading-none"
                    >
                      Chồng phí
                    </label>
                  </div>
                  <div className="flex items-center gap-1">
                    <Checkbox
                      id={`popover-tai-phi-${studentId}`}
                      checked={currentClassification === 'tai_phi'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleToggleCompletion('tai_phi');
                        }
                      }}
                      className="h-3.5 w-3.5 rounded shadow-none border-zinc-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 cursor-pointer"
                    />
                    <label
                      htmlFor={`popover-tai-phi-${studentId}`}
                      className="text-[10px] font-bold text-muted-foreground hover:text-foreground cursor-pointer select-none leading-none"
                    >
                      Đã tái phí
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Add Interaction Form — Send + Call buttons on the LEFT of textarea */}
            {!readOnly && (
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Ghi nhận tương tác mới
                </span>
                
                <div className="flex gap-1.5 flex-wrap">
                  <Button size="xs" type="button" variant={newLogChannel === 'zalo' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); setNewLogChannel('zalo'); setCallStatusMarking(null); }}>Zalo</Button>
                  <Button size="xs" type="button" variant={newLogChannel === 'telephone' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); setNewLogChannel('telephone'); }}>Cuộc gọi</Button>
                  <Button size="xs" type="button" variant={newLogChannel === 'direct' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); setNewLogChannel('direct'); setCallStatusMarking(null); }}>Trực tiếp</Button>
                  <Button size="xs" type="button" variant={newLogChannel === 'facebook' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold cursor-pointer" onClick={(e) => { e.stopPropagation(); setNewLogChannel('facebook'); setCallStatusMarking(null); }}>Facebook</Button>
                </div>

                {newLogChannel === 'telephone' && (
                  <div className="flex items-center gap-1 w-full pt-0.5 select-none">
                    {([
                      { id: 'knm', label: 'Không nghe máy', color: 'border-rose-200/60 bg-rose-50/50 hover:bg-rose-50 text-rose-700 dark:border-rose-950/40 dark:bg-rose-950/10' },
                      { id: 'may_ban', label: 'Máy bận / Số bận', color: 'border-amber-200/60 bg-amber-50/50 hover:bg-amber-50 text-amber-700 dark:border-amber-950/40 dark:bg-amber-950/10' },
                      { id: 'hen_goi_lai', label: 'Hẹn gọi lại', color: 'border-sky-200/60 bg-sky-50/50 hover:bg-sky-50 text-sky-700 dark:border-sky-950/40 dark:bg-sky-950/10' },
                      { id: 'sdt_sai', label: 'SĐT không đúng', color: 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 text-zinc-700 dark:border-zinc-800/40 dark:bg-zinc-900/20' },
                    ] as const).map((opt) => {
                      const isSel = callStatusMarking === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setCallStatusMarking(callStatusMarking === opt.id ? null : opt.id); }}
                          className={cn(
                            "flex-1 h-7 text-[9px] font-bold border rounded px-0.5 text-center transition-all cursor-pointer shadow-3xs truncate",
                            isSel
                              ? "bg-zinc-800 border-zinc-800 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-900 font-extrabold"
                              : opt.color
                          )}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                )}
                
                {/* Textarea with Send + Call buttons on the LEFT */}
                <div className="space-y-1">
                  <div className="flex gap-1.5 items-end">
                    <textarea
                      value={newLogNotes}
                      onChange={(e) => {
                        setNewLogNotes(e.target.value);
                        if (warningMessage) setWarningMessage(null);
                      }}
                      placeholder="Nhập nội dung tương tác (Call/Zalo)..."
                      className="flex-1 border rounded p-2 text-[10px] bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[55px] resize-none"
                    />

                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        size="xs"
                        type="button"
                        className="h-7 px-2.5 text-[9px] font-bold bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!newLogNotes.trim()) { toast.error("Vui lòng nhập nội dung!"); return; }
                          handleInteractionWithStatus(undefined);
                        }}
                      >
                        Gửi
                      </Button>
                    <Button
                      size="xs"
                      variant="outline"
                      type="button"
                      className="h-7 px-2.5 text-[9px] font-bold text-sky-600 border-sky-200 bg-sky-50/50 hover:bg-sky-100 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const contacts = getFamilyContacts(studentId, studentName);
                        const primaryContact = contacts[0];
                        const phone = primaryContact?.phone || '0912345' + (stableHash(studentId) % 900 + 100);
                        const pName = primaryContact?.name || 'Phụ huynh học viên';
                        startCall({ studentId, studentName, parentPhone: phone, parentName: pName, scheduleItemId: careCode || `CS-${stableHash(studentId) % 100}` });
                        toast.success(`Đang kết nối cuộc gọi tới: ${pName} (${phone})`);
                      }}
                    >
                      <PhoneCall className="h-3 w-3" />
                      Gọi
                    </Button>
                  </div>
                </div>
                {warningMessage && (
                  <p className="text-[10px] text-rose-600 font-semibold mt-1 animate-pulse">
                    ⚠️ {warningMessage}
                  </p>
                )}
              </div>

                {addedLogs.length > 0 && (
                  <div className="space-y-1 text-[10px] text-muted-foreground bg-muted/20 p-2 rounded">
                    <p className="font-bold text-[9px] uppercase tracking-wide text-foreground/80 mb-1">Tương tác vừa ghi nhận:</p>
                    {addedLogs.map((itemLog) => (
                      <div key={itemLog.id} className="flex justify-between items-start gap-2">
                        <span>• <strong>{itemLog.callConfirmation}:</strong> {itemLog.notes.replace(`[${tagLabel}] `, '')}</span>
                        <span className="text-[8px] font-mono whitespace-nowrap shrink-0">{itemLog.date}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end items-center gap-1.5 flex-wrap w-full">
                  <Button
                    size="xs"
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-6 text-[9px] px-2 font-semibold text-emerald-600 border-emerald-250 bg-emerald-50 hover:bg-emerald-100 cursor-pointer",
                      currentClassification === 'dang_cham_soc' && "ring-1 ring-emerald-400 font-bold"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInteractionWithStatus('dang_cham_soc');
                    }}
                  >
                    Chăm sóc
                  </Button>

                  <Button
                    size="xs"
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-6 text-[9px] px-2 font-semibold text-zinc-650 dark:text-zinc-400 cursor-pointer",
                      currentClassification === 'can_nhac' && "bg-zinc-100 border-zinc-350 dark:bg-zinc-800 font-bold"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInteractionWithStatus('can_nhac');
                    }}
                  >
                    Cân nhắc
                  </Button>

                  <Button
                    size="xs"
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-6 text-[9px] px-2 font-semibold text-amber-600 border-amber-250 bg-amber-50 hover:bg-amber-100 cursor-pointer",
                      currentClassification === 'tiem_nang' && "ring-1 ring-amber-400 font-bold"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInteractionWithStatus('tiem_nang');
                    }}
                  >
                    Tiềm năng
                  </Button>

                  <Button
                    size="xs"
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-6 text-[9px] px-2 font-semibold text-sky-600 border-sky-200 bg-sky-50 hover:bg-sky-100 cursor-pointer",
                      currentClassification === 'hen_tai' && "ring-1 ring-sky-400 font-bold"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInteractionWithStatus('hen_tai');
                    }}
                  >
                    Hẹn tái
                  </Button>
                </div>
              </div>
            )}

            {/* 4. History Logs — show ALL logs, not filtered by tag */}
            <div className="space-y-2 mt-4">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Lịch sử chăm sóc ({rawLogs.length})
              </span>
              
              {rawLogs.length === 0 ? (
                <p className="text-[10px] text-muted-foreground italic py-1">Chưa có lịch sử chăm sóc.</p>
              ) : (
                <div className="space-y-3 pr-1">
                  {(() => {
                    let lastMonthYear = ''
                    return rawLogs.map((log, logIdx) => {
                      const currentMonthYear = getMonthYearString(log.date)
                      const showDivider = currentMonthYear && lastMonthYear && currentMonthYear !== lastMonthYear
                      lastMonthYear = currentMonthYear

                      return (
                        <React.Fragment key={logIdx}>
                          {showDivider && (
                            <div className="flex items-center gap-2 my-3.5 select-none px-1">
                              <div className="flex-1 border-t border-dashed border-border/80"></div>
                              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded-full">
                                {currentMonthYear}
                              </span>
                              <div className="flex-1 border-t border-dashed border-border/80"></div>
                            </div>
                          )}

                          <div className="group flex gap-2.5 items-start text-xs border-b border-border/20 pb-2 last:border-b-0 last:pb-0 relative">
                            <div 
                              className={cn(
                                "h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold border border-background shadow-sm shrink-0 mt-0.5",
                                getStaffAvatarColor(log.staff)
                              )}
                              title={`Người thực hiện: ${log.staff}`}
                            >
                              {getStaffInitials(log.staff)}
                            </div>

                            <div className="flex-1 flex flex-col text-left gap-0.5">
                                  <p className="text-[11px] text-foreground leading-normal font-medium whitespace-pre-wrap">
                                    {(() => {
                                      const isGV = log.staff.includes('(GV)') || log.staff.toLowerCase().includes('gv') || log.staff.toLowerCase().includes('giáo viên');
                                      const channel = (log.channel || 'zalo') as string;
                                      const channelLabel = channel === 'telephone' 
                                        ? 'Call' 
                                        : channel === 'direct' 
                                        ? 'Trực tiếp' 
                                        : channel === 'facebook' 
                                        ? 'Facebook' 
                                        : 'Zalo';
                                      return (
                                        <span className={cn(
                                          "font-bold text-[8px] px-1 py-0.2 rounded mr-1 inline-block shrink-0 uppercase select-none",
                                          isGV 
                                            ? "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-350"
                                            : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-350"
                                        )}>
                                          {channelLabel}
                                        </span>
                                      );
                                    })()}
                                    {log.note}
                                  </p>

                              {log.channel === 'telephone' && (
                                <div className="mt-1.5 mb-0.5">
                                  <AudioPlayButton duration={log.duration || '0:00'} className="mt-0 w-auto" />
                                </div>
                              )}

                              {/* Secondary details at the bottom, hidden by default (opacity-0), shown on hover (opacity-100) */}
                              <div className="mt-1.5 flex items-center justify-between gap-1.5 flex-wrap text-[9.5px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                <span>
                                  <span className="font-semibold text-zinc-655 dark:text-zinc-400">{log.staff}</span>
                                  {" "}<span>{log.action}</span>
                                </span>
                                <span className="font-mono text-[9px]">{log.date}</span>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      )
                    })
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
