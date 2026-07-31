'use client'

import { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { 
  PhoneCall,
  Check,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHistoryLogsForStudent, stableHash, getRenewalClassification, getRenewalClassificationLabel, type RenewalClassification } from './renewalHelpers'
import { getAcademicIssues } from '../operationsAlertHelpers'
import { toast } from 'sonner'
import { completeCareTag, updateCareAlertInteraction, updateRenewalClassification, mockCareAlerts, getFamilyContacts } from '@/mocks/careAlerts'
import { AudioPlayButton } from '../AudioPlayButton'
import { useCallStore } from '@/stores/useCallStore'
import { DetailHistoryViews, DetailHeaderView } from '../DetailHistoryViews'
import { getStatusBadgeClass } from '@/lib/statusColors'

interface RenewalHistoryPopoverProps {
  trigger: React.ReactNode
  studentName: string
  studentId: string
  type: 'evaluation' | 'attendance' | 'homework' | 'score' | 'level' | 'sessions' | 'care' | 'class_history' | 'package_history'
  subject: string
  level?: string
  rating?: string
  votes?: number
  generalComment?: string
  recentAttStatus?: string
  attRate?: number
  attendanceRatio?: string
  lateSessions?: number
  avgScore?: string
  highScore?: string
  lowScore?: string
  missedTestsCount?: number
  careCode?: string
  totalCareCount?: number
  latestCareNote?: string
  homeworkCompletion?: number
  onRefresh?: () => void
  activeTagLabel?: string
  readOnly?: boolean
}

export function RenewalHistoryPopover({
  trigger,
  studentName,
  studentId,
  type,
  subject,
  level,
  rating,
  votes,
  generalComment,
  recentAttStatus,
  attRate,
  attendanceRatio,
  lateSessions,
  avgScore,
  highScore,
  lowScore,
  missedTestsCount,
  careCode,
  homeworkCompletion,
  onRefresh,
  activeTagLabel,
  readOnly = false
}: RenewalHistoryPopoverProps) {
  const startCall = useCallStore(s => s.startCall)
  const dialogTitle = useMemo(() => {
    switch (type) {
      case 'evaluation':
        return 'Lịch sử đánh giá chuyên môn'
      case 'attendance':
        return 'Lịch sử chuyên cần & Đi muộn'
      case 'homework':
        return 'Lịch sử hoàn thành Bài tập (BTVN)'
      case 'score':
        return 'Lịch sử điểm số & Xu hướng phát triển'
      case 'level':
        return 'Tiến trình năng lực học thuật'
      case 'sessions':
        return 'Lịch trình & Lịch sử buổi học'
      case 'class_history':
        return 'Lịch sử chuyển lớp & Ghép lớp'
      case 'package_history':
        return 'Lịch sử chuyển đổi gói sản phẩm'
      default:
        return 'Lịch sử chi tiết'
    }
  }, [type])

  const alertRecord = mockCareAlerts.find(a => a.studentId === studentId || a.studentName === studentName);
  const avgTestScore = alertRecord ? ((alertRecord.lastTestScore + alertRecord.priorTestScore) / 2).toFixed(1) : '7.0';

  const [newLogChannel, setNewLogChannel] = useState<'telephone' | 'zalo' | 'direct' | 'facebook'>('telephone');
  const [newLogNotes, setNewLogNotes] = useState('');
  const [confirmCompleteTag, setConfirmCompleteTag] = useState<string | null>(null);

  const getActiveTags = () => {
    if (!alertRecord) return [];
    const tags = [];
    const hash = stableHash(studentId);
    
    // 0. CS Chủ động (CSCĐ) -> Triggered by academic issues
    const academicIssues = getAcademicIssues(alertRecord);
    if (academicIssues.length > 0) {
      tags.push({
        label: 'CSCĐ',
        semantic: 'error' as const,
        description: 'Chăm sóc Chủ động: ' + academicIssues.join(', '),
        isOverdue: false
      });
    }

    // 1. CS Đặc biệt (Red / Error) -> ĐB
    if (alertRecord.careAlert === 'C90B' || alertRecord.homeworkCompletion < 70 || parseFloat(avgTestScore) < 5.0) {
      tags.push({
        label: `ĐB1`,
        semantic: 'error' as const,
        description: 'Chăm sóc Đặc biệt: Cần chăm sóc khẩn cấp do có cảnh báo vận hành hoặc học thuật yếu.',
        isOverdue: hash % 2 === 0
      });
    }
    
    // 2. CS Định kỳ (Purple) -> ĐK
    if (hash % 3 === 0) {
      tags.push({
        label: `ĐK1`,
        semantic: 'purple' as const,
        description: 'Chăm sóc Định kỳ Kỳ 1: Trao đổi học tập định kỳ hàng tháng.',
        isOverdue: hash % 4 === 0
      });
      tags.push({
        label: `ĐK2`,
        semantic: 'purple' as const,
        description: 'Chăm sóc Định kỳ Kỳ 2: Trao đổi gia hạn khóa học.',
        isOverdue: hash % 5 === 0
      });
    } else if (hash % 4 === 0) {
      tags.push({
        label: `ĐK1`,
        semantic: 'purple' as const,
        description: 'Chăm sóc Định kỳ: Điểm chạm kiểm tra định kỳ hàng tháng/giữa kỳ.',
        isOverdue: false
      });
    }
    
    // 3. CS Theo buổi (Warning / Amber) -> TB
    if (alertRecord.remainingSessions <= 5 || hash % 5 === 0) {
      tags.push({
        label: `TB1`,
        semantic: 'warning' as const,
        description: 'Chăm sóc Theo buổi: Chăm sóc phát sinh sau buổi học do nghỉ học/đi muộn hoặc sắp hết buổi.',
        isOverdue: hash % 3 === 0
      });
    }

    if (hash % 6 === 0) {
      tags.push({
        label: `TB2`,
        semantic: 'warning' as const,
        description: 'Chăm sóc Theo buổi: Nhắc nhở thiếu bài tập về nhà.',
        isOverdue: true
      });
    }

    // 4. CS Tái phí (Success / Green) -> CSTP
    tags.push({
      label: `CSTP`,
      semantic: 'success' as const,
      description: 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới.',
      isOverdue: false
    });
    
    const active = tags;
    return active.filter(t => !activeTagLabel || t.label === activeTagLabel);
  }

  const curriculumName = useMemo(() => {
    return subject === 'Toán tư duy'
      ? 'Khung chương trình Toán tư duy chuyên sâu'
      : 'Khung chương trình Tiếng Anh chuẩn Cambridge'
  }, [subject])

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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div onClick={(e) => e.stopPropagation()} className={cn("w-full", type === 'care' && "w-auto inline-flex")}>
          {trigger}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] max-h-[min(580px,85vh)] overflow-y-auto rounded-xl shadow-lg border bg-popover text-popover-foreground z-50 p-4" align="start" side="bottom" sideOffset={5}>
        <DetailHeaderView
          type={type}
          rating={rating}
          votes={votes}
          generalComment={generalComment}
          recentAttStatus={recentAttStatus}
          attRate={attRate}
          attendanceRatio={attendanceRatio}
          lateSessions={lateSessions}
          avgScore={avgScore}
          highScore={highScore}
          lowScore={lowScore}
          missedTestsCount={missedTestsCount}
          homeworkCompletion={homeworkCompletion}
          subject={subject}
          level={level}
          studentName={studentName}
          studentId={studentId}
          curriculumName={curriculumName}
          dialogTitle={dialogTitle}
        />

        <div className="space-y-4">
          {type === 'care' && (() => {
            const activeTags = getActiveTags();
            const tag = activeTags.find(t => t.label === activeTagLabel) || activeTags[0];
            if (!tag) {
              return (
                <div className="space-y-3 text-left">
                  <p className="text-xs text-muted-foreground italic py-4 text-center bg-zinc-50 dark:bg-zinc-900 rounded border border-dashed">
                    Cảnh báo này đã hoàn thành!
                  </p>
                </div>
              );
            }

            const getCareTypeName = (lbl: string) => {
              if (lbl.startsWith('ĐB')) return 'Chăm sóc Đặc biệt';
              if (lbl.startsWith('ĐK')) return 'Chăm sóc Định kỳ';
              return 'Chăm sóc Theo buổi';
            };

            // Show ALL history logs — no longer filtered by tag
            const rawLogs = getHistoryLogsForStudent(studentId);

            const addedLogs = alertRecord?.interactionLogs.filter(l => l.notes.includes(`[${tag.label}]`)) || [];
            const hash = stableHash(studentId);
            const totalAttempts = (hash % 3) + addedLogs.length;

            const isConfirming = confirmCompleteTag === tag.label;

            return (
              <div className="space-y-3.5 text-left">
                {/* 1. Header Row */}
                <div className="flex items-start justify-between border-b border-border/60 pb-2.5">
                  <div className="flex flex-col text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-foreground">
                        {tag.label} &bull; {getCareTypeName(tag.label)}
                      </h4>
                      {tag.label === 'CSTP' && alertRecord && (
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0",
                          getStatusBadgeClass(getRenewalClassification(alertRecord))
                        )}>
                          {getRenewalClassificationLabel(getRenewalClassification(alertRecord))}
                        </span>
                      )}
                    </div>
                    <div className="text-[9px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                      <span>SLA: <strong className={cn(tag.isOverdue ? "text-rose-500" : "text-emerald-500")}>
                        {tag.isOverdue ? "Quá hạn" : "Trong hạn"}
                      </strong></span>
                      &bull;
                      <span>Đã liên hệ: <strong>{totalAttempts} lần</strong></span>
                    </div>
                  </div>
                  
                  {!isConfirming && !readOnly && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        size="xs"
                        variant="outline"
                        className="h-5.5 px-2 text-[10px] font-bold text-emerald-600 border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100 hover:text-emerald-700 flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmCompleteTag(tag.label);
                        }}
                      >
                        <Check className="h-3 w-3" />
                        Hoàn thành
                      </Button>
                    </div>
                  )}
                </div>

                {/* Trạng thái Tái phí */}
                {tag.label === 'CSTP' && (
                  <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900/60 p-2 rounded-lg border border-border/50 text-[11px] gap-2">
                    <span className="font-bold text-muted-foreground uppercase text-[9px] shrink-0">Trạng thái Tái phí:</span>
                    <select
                      value={alertRecord ? getRenewalClassification(alertRecord) : 'can_nhac'}
                      onChange={(e) => {
                        if (alertRecord) {
                          updateRenewalClassification(alertRecord.studentId, e.target.value);
                          toast.success(`Đã chuyển trạng thái sang: ${getRenewalClassificationLabel(e.target.value as RenewalClassification)}`);
                          if (onRefresh) onRefresh();
                        }
                      }}
                      className="bg-transparent font-semibold text-foreground focus:outline-none border-none cursor-pointer text-xs"
                    >
                      <option value="can_nhac">Cân nhắc</option>
                      <option value="tiem_nang">Tiềm năng</option>
                      <option value="hen_tai">Hẹn tái</option>
                      <option value="tai_phi">Đã tái phí</option>
                      <option value="chong_phi">Chồng Phí</option>
                      <option value="rut_phi">Rút phí</option>
                      <option value="that_bai">Thất bại</option>
                    </select>
                  </div>
                )}

                {/* Inline Confirmation */}
                {isConfirming && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded p-2 text-[10px] space-y-1.5">
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      Xác nhận hoàn thành {tag.label}?
                    </p>
                    <p className="text-muted-foreground leading-snug">Học viên sẽ được ẩn thẻ cảnh báo này sau khi hoàn thành.</p>
                    <div className="flex gap-1.5 justify-end">
                      <Button
                        size="xs"
                        className="h-5 text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          completeCareTag(studentId, tag.label);
                          setConfirmCompleteTag(null);
                          toast.success(`Đã hoàn thành cảnh báo ${tag.label}!`);
                          if (onRefresh) onRefresh();
                        }}
                      >
                        Xác nhận
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="h-5 text-[9px] px-2 text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmCompleteTag(null);
                        }}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}

                <p className="text-[11px] font-medium text-foreground/80 leading-relaxed bg-muted/25 p-2 rounded mt-2.5 mb-1">
                  {tag.description}
                </p>

                {/* 3. Add Interaction Form — Send + Call buttons on the LEFT of textarea */}
                {!readOnly && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Ghi nhận tương tác mới
                    </span>
                    
                    <div className="flex gap-1.5 flex-wrap">
                      <Button size="xs" type="button" variant={newLogChannel === 'telephone' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold" onClick={(e) => { e.stopPropagation(); setNewLogChannel('telephone'); }}>Cuộc gọi</Button>
                      <Button size="xs" type="button" variant={newLogChannel === 'zalo' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold" onClick={(e) => { e.stopPropagation(); setNewLogChannel('zalo'); }}>Zalo</Button>
                      <Button size="xs" type="button" variant={newLogChannel === 'direct' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold" onClick={(e) => { e.stopPropagation(); setNewLogChannel('direct'); }}>Trực tiếp</Button>
                      <Button size="xs" type="button" variant={newLogChannel === 'facebook' ? 'default' : 'outline'} className="h-5.5 text-[9px] px-2 font-bold" onClick={(e) => { e.stopPropagation(); setNewLogChannel('facebook'); }}>Facebook</Button>
                    </div>
                    
                    <div className="flex gap-1.5 items-end">
                      <textarea
                        value={newLogNotes}
                        onChange={(e) => setNewLogNotes(e.target.value)}
                        placeholder="Nhập nội dung tương tác (Call/Zalo)..."
                        className="flex-1 border rounded p-2 text-[10px] bg-background focus:outline-none focus:ring-1 focus:ring-primary min-h-[55px] resize-none"
                      />

                      <div className="flex flex-col gap-1 shrink-0">
                        <Button
                          size="xs"
                          type="button"
                          className="h-7 px-2.5 text-[9px] font-bold bg-sky-600 hover:bg-sky-700 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!newLogNotes.trim()) { toast.error("Vui lòng nhập nội dung!"); return; }
                            const channelLabel = newLogChannel === 'telephone' ? 'Đã gọi' : newLogChannel === 'zalo' ? 'Đã nhắn Zalo' : newLogChannel === 'direct' ? 'Đã gặp trực tiếp' : 'Đã nhắn Facebook';
                            const fullNote = `[${tag.label}] ${newLogNotes}`;
                            updateCareAlertInteraction(alertRecord?.id || studentId, { staffName: 'CS Staff', callConfirmation: channelLabel, notes: fullNote });
                            setNewLogNotes('');
                            toast.success("Đã ghi nhận tương tác!");
                            if (onRefresh) onRefresh();
                          }}
                        >
                          Gửi
                        </Button>
                        <Button
                          size="xs"
                          variant="outline"
                          type="button"
                          className="h-7 px-2.5 text-[9px] font-bold text-sky-600 border-sky-200 bg-sky-50/50 hover:bg-sky-100 hover:text-sky-700 flex items-center gap-1"
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

                    {/* Previous dynamic attempts */}
                    {addedLogs.length > 0 && (
                      <div className="space-y-1 text-[10px] text-muted-foreground bg-muted/20 p-2 rounded">
                        <p className="font-bold text-[9px] uppercase tracking-wide text-foreground/80 mb-1">Tương tác vừa ghi nhận:</p>
                        {addedLogs.map((itemLog) => (
                          <div key={itemLog.id} className="flex justify-between items-start gap-2">
                            <span>• <strong>{itemLog.callConfirmation}:</strong> {itemLog.notes.replace(`[${tag.label}] `, '')}</span>
                            <span className="text-[8px] font-mono whitespace-nowrap shrink-0">{itemLog.date}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. History Logs */}
                <div className="space-y-2 mt-4">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Lịch sử chăm sóc ({rawLogs.length})
                  </span>
                  
                  {rawLogs.length === 0 ? (
                    <p className="text-[10px] text-muted-foreground italic py-1">Chưa có lịch sử chăm sóc.</p>
                  ) : (
                    <div className="space-y-3 pr-1">
                      {rawLogs.map((log, logIdx) => {
                        return (
                          <div key={logIdx} className="flex gap-2.5 items-start text-xs border-b border-border/20 pb-2 last:border-b-0 last:pb-0">
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
                              <div className="flex items-center justify-between gap-1.5 flex-wrap">
                                <span className="font-bold text-foreground flex items-center gap-1">
                                  {log.staff} <span className="font-normal text-muted-foreground">•</span> {log.action}
                                </span>
                                <span className="text-[9px] text-muted-foreground/80 font-medium shrink-0">{log.date}</span>
                              </div>

                              {log.channel === 'telephone' && (
                                <div className="mt-1 mb-0.5">
                                  <AudioPlayButton duration={log.duration} />
                                </div>
                              )}
                              
                              <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
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
                                        ? "bg-violet-100 dark:bg-violet-955/40 text-violet-700 dark:text-violet-300"
                                        : "bg-emerald-100 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-300"
                                    )}>
                                      {channelLabel}
                                    </span>
                                  );
                                })()}
                                {log.note}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {type !== 'care' && (
            <DetailHistoryViews
              type={type}
              studentId={studentId}
              studentName={studentName}
              subject={subject}
              level={level}
              rating={rating}
              homeworkCompletion={homeworkCompletion}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

