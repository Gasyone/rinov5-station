'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ContactCell, PersonnelHoverCard } from '@/components/shared'
import {
  ExternalLink,
  Share2,
  ArrowLeftRight,
  Phone,
  RefreshCw,
  Calendar,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { mockCareAlerts, type StudentCareAlert } from '@/mocks/careAlerts'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { getStatusBadgeClass, type StatusSemantic } from '@/lib/statusColors'
import { stableHash, getInitials, getAvatarColor, getHistoryLogsForStudent, getRenewalClassification, getRenewalClassificationLabel, getOfficialStatus, getOfficialStatusLabel, parseAttendanceRate, getStudentOrderInfo } from './renewalHelpers'
import { RenewalHistoryPopover } from './RenewalHistoryPopover'
import { RenewalClassCodeHoverCell } from './RenewalClassCodeHoverCell'
import { mockClassRecords } from '@/mocks/classRecords'
import { getAcademicIssues, isCared, isInProgress, getRescheduleInfo } from '../operationsAlertHelpers'
import { OperationsAlertCareHistoryModal } from '../OperationsAlertCareHistoryModal'


// --- Academic Stats Cell (same pattern as operations care) ---
function AcademicStatsCell({ cls }: { cls: StudentCareAlert }) {
  const ratio = cls.attendanceRatio || '0/0';
  const ccPct = parseAttendanceRate(ratio);

  const last = cls.lastTestScore;
  const prior = cls.priorTestScore;
  const avg = (last + prior) / 2;

  let pctChange = 0;
  if (prior > 0) {
    pctChange = ((last - prior) / prior) * 100;
  } else if (last > 0) {
    pctChange = 100;
  }

  const changeText = pctChange > 0
    ? `↑${pctChange.toFixed(0)}%`
    : pctChange < 0
    ? `↓${Math.abs(pctChange).toFixed(0)}%`
    : '0%';

  const changeColor = pctChange > 0
    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
    : pctChange < 0
    ? 'text-rose-600 dark:text-rose-400 font-bold'
    : 'text-muted-foreground';

  const [, total] = ratio.split('/').map(Number);
  const displayTotal = (total && total > 0) ? total : 5;
  const done = Math.round((cls.homeworkCompletion / 100) * displayTotal);

  return (
    <div className="flex items-center py-0.5 select-none min-h-[48px]">
      <div className="flex flex-col gap-0.5 text-left text-[11px] leading-tight font-medium text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-1">
          <span className="text-zinc-400 dark:text-zinc-500 font-normal shrink-0">CC:</span>
          <span className="font-bold text-foreground">{ratio}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-normal">({ccPct}%)</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-zinc-400 dark:text-zinc-500 font-normal shrink-0">Điểm:</span>
          <span className="font-bold text-foreground">{last}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-normal">/</span>
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">{avg.toFixed(1)}</span>
          <span className={cn("text-[10px]", changeColor)}>({changeText})</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-400 dark:text-zinc-500 font-normal shrink-0">BTVN:</span>
          <span className="font-bold text-foreground">{done}/{displayTotal}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-normal">({cls.homeworkCompletion}%)</span>
        </div>
      </div>
    </div>
  );
}


export interface RenewalAlertRowProps {
  cls: StudentCareAlert
  isSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  viewMode?: 'service' | 'academic' | 'total'
  onOpenCallModal?: (student: StudentCareAlert) => void
  onRefresh?: () => void
  onViewDetail?: (id: string) => void
}

export function RenewalAlertRow({
  cls,
  isSelected,
  onSelectChange,
  viewMode = 'service',
  onOpenCallModal,
  onRefresh,
  onViewDetail,
}: RenewalAlertRowProps) {
  // Family contacts
  const contacts = getFamilyContacts(cls.studentId, cls.studentName)
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]



  const getCareTags = () => {
    const getSlaInfo = (code: string, _slaStr: string) => {
      void _slaStr
      const h = stableHash(cls.studentId + code)
      const mod = h % 3
      
      if (mod === 0) {
        return { isOverdue: true, isDueToday: false }
      } else if (mod === 1) {
        return { isOverdue: false, isDueToday: true }
      } else {
        return { isOverdue: false, isDueToday: false }
      }
    }
    
    const tags: Array<{
      label: string;
      semantic: StatusSemantic;
      description: string;
      isOverdue: boolean;
      isDueToday?: boolean;
      displayLabel?: string;
    }> = [];
    const hash = stableHash(cls.studentId);
    const avgScore = ((cls.lastTestScore + cls.priorTestScore) / 2).toFixed(1);

    // 0. CS Chủ động (CSCĐ) -> Triggered by academic issues
    const academicIssues = getAcademicIssues(cls);
    if (academicIssues.length > 0) {
      tags.push({
        label: 'CSCĐ',
        semantic: 'error' as const,
        description: 'Chăm sóc Chủ động: ' + academicIssues.join(', '),
        isOverdue: false,
        isDueToday: false
      });
    }

    // 1. CS Đặc biệt (Red / Error) -> ĐB
    if (cls.careAlert === 'C90B' || cls.homeworkCompletion < 70 || parseFloat(avgScore) < 5.0) {
      const slaInfo = getSlaInfo('ĐB1', '24 giờ')
      tags.push({
        label: `ĐB1`,
        semantic: 'error' as const,
        description: 'Chăm sóc Đặc biệt: Cần chăm sóc khẩn cấp do có cảnh báo vận hành hoặc học thuật yếu.',
        isOverdue: slaInfo.isOverdue,
        isDueToday: slaInfo.isDueToday
      });
    }
    
    // 2. CS Định kỳ (Purple) -> ĐK
    if (hash % 3 === 0) {
      const dk1Info = getSlaInfo('ĐK1', '5 ngày')
      tags.push({
        label: `ĐK1`,
        semantic: 'purple' as const,
        description: 'Chăm sóc Định kỳ Kỳ 1: Trao đổi học tập định kỳ hàng tháng.',
        isOverdue: dk1Info.isOverdue,
        isDueToday: dk1Info.isDueToday
      });
      const dk2Info = getSlaInfo('ĐK2', '5 ngày')
      tags.push({
        label: `ĐK2`,
        semantic: 'purple' as const,
        description: 'Chăm sóc Định kỳ Kỳ 2: Trao đổi gia hạn khóa học.',
        isOverdue: dk2Info.isOverdue,
        isDueToday: dk2Info.isDueToday
      });
    } else if (hash % 4 === 0) {
      const dk1Info = getSlaInfo('ĐK1', '5 ngày')
      tags.push({
        label: `ĐK1`,
        semantic: 'purple' as const,
        description: 'Chăm sóc Định kỳ: Điểm chạm kiểm tra định kỳ hàng tháng/giữa kỳ.',
        isOverdue: dk1Info.isOverdue,
        isDueToday: dk1Info.isDueToday
      });
    }
    
    // 3. CS Theo buổi (Warning / Amber) -> TB
    if (cls.remainingSessions <= 5 || hash % 5 === 0) {
      const tb1Info = getSlaInfo('TB1', '3 ngày')
      tags.push({
        label: `TB1`,
        semantic: 'warning' as const,
        description: 'Chăm sóc Theo buổi: Chăm sóc phát sinh sau buổi học do nghỉ học/đi muộn hoặc sắp hết buổi.',
        isOverdue: tb1Info.isOverdue,
        isDueToday: tb1Info.isDueToday
      });
    }

    if (hash % 6 === 0) {
      const tb2Info = getSlaInfo('TB2', '2 ngày')
      tags.push({
        label: `TB2`,
        semantic: 'warning' as const,
        description: 'Chăm sóc Theo buổi: Nhắc nhở thiếu bài tập về nhà.',
        isOverdue: tb2Info.isOverdue,
        isDueToday: tb2Info.isDueToday
      });
    }

    const classification = getRenewalClassification(cls);
    
    // Determine if CSTP is active
    let showCSTP = false;
    if (cls.activeCSTP !== undefined) {
      showCSTP = cls.activeCSTP;
    } else {
      showCSTP = classification !== 'tai_phi';
    }

    if (showCSTP) {
      const cstpInfo = getSlaInfo('CSTP', '5 ngày')
      tags.push({
        label: `CSTP`,
        semantic: 'success' as const,
        description: 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới.',
        isOverdue: cstpInfo.isOverdue,
        isDueToday: cstpInfo.isDueToday
      });
    }
    
    const completed = cls.completedCareTags || [];

    // 5. CS Thường (Neutral / Zinc) -> T
    if (tags.length === 0) {
      tags.push({
        label: `T1`,
        semantic: 'neutral' as const,
        description: 'Chăm sóc Thường: Tương tác chăm sóc, thăm hỏi định kỳ thông thường.',
        isOverdue: false,
        isDueToday: false
      });
    }
    
    // Append interaction count to label
    return tags.map(tag => {
      const isCompleted = completed.includes(tag.label) || (cls.callConfirmation !== 'Chưa gọi' && cls.callConfirmation !== 'KNM');
      if (tag.label === 'T1') return { ...tag, displayLabel: tag.label, isCompleted };
      const baseCount = hash % 2 + 1; // baseline contacts
      const addedLogs = cls.interactionLogs.filter(l => l.notes.includes(tag.label)).length;
      const count = baseCount + addedLogs;
      return {
        ...tag,
        isCompleted,
        displayLabel: count === 1 ? tag.label : `${tag.label} (${count})`
      };
    });
  }

  return (
    <tr
      onClick={() => onViewDetail?.(cls.id)}
      className={cn(
        'group border-b border-border/40 hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors cursor-pointer align-middle',
        cls.careAlert === 'C90B' && cls.confirmC90B === 'CHƯA XÁC NHẬN'
          ? 'bg-red-50/30 dark:bg-red-950/5'
          : '',
        isSelected ? 'bg-primary/5' : ''
      )}
    >
      {/* Checkbox */}
      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(val) => onSelectChange(cls.id, val === true)}
          aria-label={`Chọn ${cls.studentName} - ${cls.classCode}`}
        />
      </td>

      {/* Học viên */}
      <td className="py-3 px-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                getAvatarColor(cls.studentId)
              )}
            >
              {getInitials(cls.studentName)}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="font-bold text-zinc-900 dark:text-zinc-50 text-sm truncate" title={cls.englishName ? `${cls.studentName} (${cls.englishName})` : cls.studentName}>
                  {cls.studentName} {cls.englishName ? `(${cls.englishName})` : ''}
                </span>
                {cls.studentFolderLink && (
                  <a
                    href={cls.studentFolderLink}
                    target="_blank"
                    rel="noreferrer"
                    title="Thư mục học viên"
                    className="text-muted-foreground hover:text-primary shrink-0 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <div className="text-[10px] text-muted-foreground font-medium mt-0.5">
                {cls.subject} - {cls.level}
              </div>
            </div>
          </div>

          {/* Hover actions */}
          <div 
            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-150 shrink-0" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Only show create buttons when student has no active CSTP tag */}
            {(() => {
              const activeTags = getCareTags()
              const hasActiveCSTP = activeTags.some(t => t.label === 'CSTP')
              if (hasActiveCSTP) return null
              return (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  title="Tạo thẻ Tái phí mới"
                  className="h-6 w-6 rounded-md shrink-0 shadow-none hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                  onClick={() => {
                    const record = mockCareAlerts.find(a => a.id === cls.id);
                    if (record) {
                      record.activeCSTP = true;
                      if (record.completedCareTags) {
                        record.completedCareTags = record.completedCareTags.filter(t => t !== 'CSTP');
                      }
                      if (onRefresh) onRefresh();
                    }
                    toast.success(`Đã tạo thẻ Chăm sóc Tái phí cho ${cls.studentName}`, {
                      description: 'Thẻ CSTP mới đã được khởi tạo. Bạn có thể bắt đầu chăm sóc.',
                    })
                  }}
                >
                  <RefreshCw className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                </Button>
              )
            })()}

            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => {
                const link = cls.learningResultsLink || `https://rinov5.com/report/${cls.studentId}`
                navigator.clipboard.writeText(link)
                toast.success(`Đã sao chép link báo cáo!`)
              }}
              title="Sao chép link báo cáo"
              className="h-6 w-6 hover:bg-muted/80 rounded-md shrink-0 shadow-none"
            >
              <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </Button>
          </div>
        </div>
      </td>

      {/* Liên hệ */}
      <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
        <ContactCell
          name={primaryContact ? `GĐ ${cls.studentName.split(' ').pop()?.toUpperCase()}` : '-'}
          phone={primaryContact?.phone}
          studentId={cls.studentId}
          studentName={cls.studentName}
          masked={true}
          additionalContacts={
            contacts && contacts.length > 1
              ? contacts.map((c) => ({ name: `${c.name} (${c.relationship})`, phone: c.phone }))
              : undefined
          }
        />
      </td>

      {/* Phụ trách */}
      <td className="py-3 px-3 min-w-[160px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-1.5 text-left">
          {/* CS ở trên */}
          {cls.csStaff && (
            <PersonnelHoverCard
              person={{
                name: cls.csStaff,
                role: 'Chuyên viên CS (CSM)',
                phone: '0912 345 678',
                email: `${cls.csStaff.toLowerCase().replace(/\s+/g, '')}@rinoedu.vn`
              }}
            >
              <div className="flex items-center gap-1.5 cursor-pointer hover:bg-muted/40 p-0.5 rounded transition-colors duration-150 w-fit">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] px-1 font-bold border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 rounded animate-in fade-in duration-300">
                    CS
                  </span>
                  <span className="text-foreground text-[10px] hover:text-emerald-600 dark:hover:text-emerald-400">{cls.csStaff}</span>
                </div>
              </div>
            </PersonnelHoverCard>
          )}

          {/* GV ở dưới (có thể có nhiều GV) */}
          {(() => {
            const teachers = [
              ...new Set([
                ...(cls.teacherCode ? cls.teacherCode.split(/[,;\s/]+/).map((t) => t.trim()) : []),
                ...(cls.substituteTeacher ? cls.substituteTeacher.split(/[,;\s/]+/).map((t) => t.trim()) : []),
              ]),
            ].filter(Boolean)

            return teachers.map((teacher, idx) => (
              <PersonnelHoverCard
                key={idx}
                person={{
                  name: teacher,
                  role: 'Giáo viên Học thuật (GV)',
                  phone: '0987 654 321',
                  email: `${teacher.toLowerCase().replace(/\s+/g, '')}@rinoedu.vn`
                }}
              >
                <div className="flex items-center gap-1.5 cursor-pointer hover:bg-muted/40 p-0.5 rounded transition-colors duration-150 w-fit">
                  <div className="flex items-center gap-1">
                    <span className="text-[8px] px-1 font-bold border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400 rounded">
                      GV
                    </span>
                    <span className="text-foreground text-[10px] hover:text-violet-600 dark:hover:text-violet-400">{teacher}</span>
                  </div>
                </div>
              </PersonnelHoverCard>
            ))
          })()}
        </div>
      </td>

      {/* Lớp học */}
      <td className="py-3 px-3 min-w-[200px]">
        {(() => {
          const studentInfo = mockStudents.find((s) => s.id === cls.studentId);
          const isWaitAssignment = studentInfo?.status === 'wait_for_assignment';
          const hasClassHistory = cls.status === 'Chờ chuyển lớp' || studentInfo?.status === 'pending_transfer' || stableHash(cls.studentId) % 4 === 0;

          const classRecord = mockClassRecords.find((c) => c.code === cls.classCode);
          const className = classRecord 
            ? classRecord.name 
            : (cls.subject === 'Toán tư duy' ? `Toán ${cls.level}` : `Anh ${cls.level}`);

          return (
            <div className="flex flex-col gap-1 text-left">
              {/* Hàng 1: Tên lớp & Icon chuyển lớp */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className={cn(
                  "truncate shrink-0",
                  cls.status === 'Chờ chuyển lớp'
                    ? "text-xs text-muted-foreground font-normal"
                    : "text-zinc-600 dark:text-zinc-400 text-xs"
                )} title={className}>
                  {isWaitAssignment || studentInfo?.status === 'reserve' || cls.status === 'Hết buổi'
                    ? 'Chưa có lớp'
                    : cls.status === 'Chờ chuyển lớp'
                      ? 'Đang chuyển lớp'
                      : className
                  }
                </span>
                
                {/* Icon lịch sử chuyển lớp */}
                {hasClassHistory && (
                  <RenewalHistoryPopover
                    type="class_history"
                    studentId={cls.studentId}
                    studentName={cls.studentName}
                    subject={cls.subject}
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        title="Lịch sử chuyển lớp & Ghép lớp"
                        className="h-4.5 w-4.5 p-0 shrink-0 text-primary hover:bg-muted rounded-md border border-border shadow-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowLeftRight className="h-3 w-3" />
                      </Button>
                    }
                  />
                )}
              </div>

              {/* Hàng 2: Mã lớp & Trạng thái */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {isWaitAssignment ? (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200/50 uppercase tracking-wide">
                    Chờ ghép lớp
                  </span>
                ) : studentInfo?.status === 'reserve' ? (
                  <span className="text-[10px] font-semibold text-violet-755 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 px-1.5 py-0.5 rounded border border-violet-200/50 w-fit">
                    Bảo lưu
                  </span>
                ) : cls.status === 'Hết buổi' ? (
                  <span className="text-[10px] font-semibold text-zinc-650 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/40 px-1.5 py-0.5 rounded border border-zinc-200 w-fit">
                    Hết phí
                  </span>
                ) : cls.status === 'Chờ chuyển lớp' ? (
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200/50 w-fit">
                    Chờ ghép lớp mới
                  </span>
                ) : (
                  <>
                    <span onClick={(e) => e.stopPropagation()}>
                      <RenewalClassCodeHoverCell
                        classCode={cls.classCode}
                        subject={cls.subject}
                        level={cls.level}
                        teacherCode={cls.teacherCode}
                        schedule={cls.schedule}
                      />
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[8px] px-1.5 py-0 h-3.5 font-semibold uppercase tracking-wide shrink-0',
                        cls.status === 'Đang học'
                          ? getStatusBadgeClass('dang_hoc')
                          : cls.status === 'Chờ chuyển lớp'
                            ? getStatusBadgeClass('pending_transfer')
                            : getStatusBadgeClass('session_ended')
                      )}
                    >
                      {cls.status}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          );
        })()}
      </td>

      {/* Gói sản phẩm */}
      <td className="py-3 px-3">
        {(() => {
          const hasPackageHistory = cls.status === 'Chờ chuyển lớp' || stableHash(cls.studentId) % 3 === 0
          return (
            <div className="flex flex-col gap-0.5 min-w-[155px]">
              <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
                <span className="text-zinc-600 dark:text-zinc-400 text-xs truncate shrink-0">{cls.level}</span>
                {hasPackageHistory && (
                  <RenewalHistoryPopover
                    type="package_history"
                    studentId={cls.studentId}
                    studentName={cls.studentName}
                    subject={cls.subject}
                    trigger={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        title="Lịch sử chuyển đổi gói sản phẩm"
                        className="h-4.5 w-4.5 p-0 shrink-0 text-primary hover:bg-muted rounded-md border border-border shadow-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowLeftRight className="h-3 w-3" />
                      </Button>
                    }
                  />
                )}
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">Hết hạn: {cls.expectedEndDate}</span>
            </div>
          )
        })()}
      </td>

      {/* Lịch sử chăm sóc */}
      <td className="py-3 px-3 min-w-[260px]" onClick={(e) => e.stopPropagation()}>
        {(() => {
          const isCompleted = isCared(cls)
          const inProgress = isInProgress(cls)
          const isUncared = !isCompleted && !inProgress

          const allLogs = getHistoryLogsForStudent(cls.studentId)
          const logs = isUncared ? [] : allLogs
          const latestLog = logs[0]
          const rescheduleInfo = getRescheduleInfo(cls)
          const attemptCount = logs.length

          const cellContent = (
            <div className="flex flex-col gap-1 py-0.5 text-left max-w-[260px] cursor-pointer group/care">
              {/* Hàng 1: Text Chăm sóc (XX) / Chưa chăm sóc + Lịch hẹn gọi lại */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={cn(
                    'text-[10px] font-bold transition-colors',
                    isUncared
                      ? 'text-zinc-500 dark:text-zinc-400 select-none'
                      : inProgress
                      ? 'text-sky-700 dark:text-sky-400 group-hover/care:underline'
                      : 'text-emerald-700 dark:text-emerald-400 group-hover/care:underline'
                  )}
                  title={isUncared ? undefined : 'Click hoặc rê chuột để xem Popover chi tiết Lịch sử chăm sóc'}
                >
                  {isUncared ? 'Chưa chăm sóc' : `Chăm sóc (${attemptCount})`}
                </span>

                {/* Lịch hẹn gọi lại */}
                {rescheduleInfo.isRescheduled && (
                  <span
                    className="text-[10px] font-semibold text-violet-700 dark:text-violet-300 flex items-center gap-1 whitespace-nowrap"
                    title="Lịch hẹn gọi lại"
                  >
                    <Calendar className="h-3 w-3 shrink-0 text-violet-600 dark:text-violet-400" />
                    <span>Hẹn: {rescheduleInfo.rescheduleDate} {rescheduleInfo.rescheduleTime}</span>
                  </span>
                )}
              </div>

              {/* Hàng 2 & 3: Nội dung chăm sóc & Phụ huynh phản hồi */}
              {isUncared ? (
                <div className="text-[10px] italic text-amber-600 dark:text-amber-400 font-medium">
                  Cần liên hệ trao đổi với phụ huynh ngay
                </div>
              ) : (
                latestLog && (
                  <>
                    <div
                      className="text-[10px] text-muted-foreground truncate group-hover/care:text-foreground transition-colors"
                      title={`Nội dung CS (${latestLog.date}): ${latestLog.note}`}
                    >
                      <span className="font-mono text-zinc-500">{latestLog.date}:</span> {latestLog.note}
                    </div>
                    {isCompleted && (
                      <div
                        className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium truncate group-hover/care:underline transition-colors"
                        title={`Phụ huynh phản hồi: ${latestLog.note}`}
                      >
                        Phụ huynh phản hồi: &ldquo;{latestLog.note.includes('phụ huynh') ? latestLog.note.substring(latestLog.note.indexOf('phụ huynh') + 9).trim() || latestLog.note : 'Mẹ cảm ơn cô giáo đã nhắc nhở'}&rdquo;
                      </div>
                    )}
                  </>
                )
              )}
            </div>
          )

          if (isUncared) {
            return cellContent
          }

          return (
            <OperationsAlertCareHistoryModal
              cls={cls}
              onRefresh={onRefresh}
              trigger={cellContent}
              defaultTab="renewal"
            />
          )
        })()}
      </td>

      {/* Trạng thái tái phí */}
      <td className="py-3 px-3 min-w-[140px]">
        {(() => {
          const classification = getRenewalClassification(cls)
          const label = getRenewalClassificationLabel(classification)

          return (
            <div className="flex flex-col items-start gap-0.5">
              <Badge
                variant="outline"
                className={cn(
                  'text-[9px] px-2 py-0.5 font-bold uppercase tracking-wide',
                  getStatusBadgeClass(classification)
                )}
              >
                {label}
              </Badge>
            </div>
          )
        })()}
      </td>

      {/* Đơn hàng */}
      <td className="py-3 px-3 min-w-[240px]" onClick={(e) => e.stopPropagation()}>
        {(() => {
          const order = getStudentOrderInfo(cls)
          return (
            <div className="flex flex-col gap-0.5 max-w-[240px] text-left">
              {order.orderCode ? (
                <>
                  {/* Dòng 1: Gói học & Số tiền (Điều hướng chuẩn tới Landing Page Báo Giá /quote/${order.orderCode}) */}
                  <div className="flex items-center gap-1 text-xs text-emerald-800 dark:text-emerald-300 truncate">
                    <a
                      href={`/quote/${order.orderCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-emerald-800 dark:text-emerald-300 truncate"
                      title={`Mở Landing Page Báo Giá & Chi tiết Đơn hàng (${order.orderCode})`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{order.packageName}</span>
                      {order.packageAmount && (
                        <span className="font-mono text-[11px] font-normal text-muted-foreground shrink-0">
                          ({order.packageAmount})
                        </span>
                      )}
                    </a>
                  </div>

                  {/* Dòng 2: Mã đơn nháp • Lần thanh toán (Ví dụ: Cọc 50%) */}
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground flex-wrap">
                    <a
                      href={`/quote/${order.orderCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-foreground hover:text-primary hover:underline cursor-pointer"
                      title="Xem Landing Page Báo giá & Chi tiết Đơn hàng nháp"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.orderCode}
                    </a>
                    {order.paymentTerm && (
                      <>
                        <span>•</span>
                        <span className="text-amber-700 dark:text-amber-400">
                          {order.paymentTerm}
                        </span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-[11px] italic text-muted-foreground">
                  Chưa có đơn hàng
                </span>
              )}
            </div>
          )
        })()}
      </td>
    </tr>
  )
}

