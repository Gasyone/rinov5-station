'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ContactCell, PersonnelHoverCard, StatusBadge } from '@/components/shared'
import {
  ExternalLink,
  RefreshCw,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { mockCareAlerts, type StudentCareAlert } from '@/mocks/careAlerts'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { getStatusBadgeClass, type StatusSemantic } from '@/lib/statusColors'
import { stableHash, getInitials, getAvatarColor, getHistoryLogsForStudent, getRenewalClassification, getRenewalClassificationLabel, getStudentOrderInfo, getExpiryTier } from './renewalHelpers'
import { RenewalClassCodeHoverCell } from './RenewalClassCodeHoverCell'
import { getAcademicIssues, isCared, isInProgress, getRescheduleInfo } from '../operationsAlertHelpers'
import { formatRelativeCareTime } from '../AlertRow'
import { OperationsAlertCareHistoryModal } from '../OperationsAlertCareHistoryModal'
import {
  resolveStudentPlacementStatus,
  PLACEMENT_STATUS_META,
} from '../class-card/studentCareClassCardHelpers'

export interface RenewalAlertRowProps {
  cls: StudentCareAlert
  isSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  viewMode?: 'service' | 'academic' | 'total'
  rowIndex?: number
  onOpenCallModal?: (student: StudentCareAlert) => void
  onRefresh?: () => void
  onViewDetail?: (id: string) => void
}

export function RenewalAlertRow({
  cls,
  isSelected,
  onSelectChange,
  rowIndex,
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

  const isEvenRow = typeof rowIndex === 'number' ? rowIndex % 2 === 1 : false
  const stickyBgClass = isSelected
    ? '!bg-sky-100 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
  const rowBgClass = isSelected
    ? '!bg-sky-50 dark:!bg-sky-950'
    : isEvenRow
      ? 'bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
      : 'bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800'

  return (
    <tr
      onClick={() => onViewDetail?.(cls.id)}
      className={cn(
        'group cursor-pointer transition-colors align-middle [&>td]:py-1.5 [&>td]:px-2.5 border-b-0',
        rowBgClass
      )}
    >
      {/* Checkbox (Sticky Left 0) */}
      <td
        className={cn(
          'sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center px-1 transition-colors',
          stickyBgClass
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={(val) => onSelectChange(cls.id, val === true)}
          aria-label={`Chọn ${cls.studentName} - ${cls.classCode}`}
        />
      </td>

      {/* Học viên (Sticky Left 8) */}
      <td
        className={cn(
          'sticky left-8 z-30 w-[220px] min-w-[200px] max-w-[240px] px-2.5 transition-colors',
          stickyBgClass
        )}
      >
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                'h-6.5 w-6.5 rounded flex items-center justify-center text-xs font-medium shrink-0 hover:opacity-80 transition-opacity',
                getAvatarColor(cls.studentId)
              )}
            >
              {getInitials(cls.studentName)}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground text-xs truncate hover:underline hover:text-primary leading-tight" title={cls.englishName ? `${cls.studentName} (${cls.englishName})` : cls.studentName}>
                {cls.studentName} {cls.englishName ? `(${cls.englishName})` : ''}
              </p>
              <p className="text-xs text-muted-foreground font-normal leading-none mt-0.5 truncate">
                {cls.subject} - {cls.level}
              </p>
            </div>
          </div>

          {/* Hover actions */}
          {(() => {
            const activeTags = getCareTags()
            const hasActiveCSTP = activeTags.some(t => t.label === 'CSTP')
            if (hasActiveCSTP) return null
            return (
              <div 
                className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-150 shrink-0" 
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon-xs"
                  title="Tạo thẻ Tái phí mới"
                  className="h-5 w-5 rounded shrink-0 shadow-none hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
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
              </div>
            )
          })()}
        </div>
      </td>

      {/* Liên hệ */}
      <td className="min-w-[125px]" onClick={(e) => e.stopPropagation()}>
        <ContactCell
          name={
            primaryContact
              ? `${primaryContact.name}${primaryContact.relationship ? ` (${primaryContact.relationship})` : ''}`
              : '-'
          }
          phone={primaryContact?.phone}
          studentId={cls.studentId}
          studentName={cls.studentName}
          masked={true}
          showCallButton={false}
          showPhoneIcon={false}
          nameClassName="text-xs font-normal text-foreground"
          phoneClassName="text-xs font-mono text-muted-foreground"
        />
      </td>

      {/* Người chăm sóc */}
      <td className="min-w-[125px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-0.5 text-left">
          {/* Người chăm sóc CS */}
          {cls.csStaff ? (
            <PersonnelHoverCard
              person={{
                name: cls.csStaff,
                role: 'Chuyên viên CS (CSM)',
                phone: '0912 345 678',
                email: `${cls.csStaff.toLowerCase().replace(/\s+/g, '')}@rinoedu.vn`
              }}
            >
              <div className="flex items-center gap-1 cursor-pointer hover:bg-muted/40 px-1 py-0 rounded transition-colors w-fit leading-tight">
                <span className="text-xs text-muted-foreground font-normal">
                  CS
                </span>
                <span className="text-foreground text-xs hover:text-primary font-normal leading-tight">{cls.csStaff}</span>
              </div>
            </PersonnelHoverCard>
          ) : (
            <span className="text-xs text-muted-foreground italic">Chưa phân công</span>
          )}
        </div>
      </td>

      {/* Nội dung chăm sóc */}
      <td className="min-w-[220px]" onClick={(e) => e.stopPropagation()}>
        {(() => {
          const isCompleted = isCared(cls)
          const inProgress = isInProgress(cls)
          const isUncared = !isCompleted && !inProgress

          const parseLogDate = (d: string) => {
            if (!d) return 0
            if (d.includes('-')) {
              return new Date(d).getTime() || 0
            }
            const parts = d.split('/')
            if (parts.length === 3) {
              return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10)).getTime()
            }
            return 0
          }

          const allLogs = getHistoryLogsForStudent(cls.studentId)
          const clsLogs = (cls.interactionLogs || []).map((l) => {
            let formattedDate = l.date
            if (l.date.includes('-')) {
              const parts = l.date.split('-')
              if (parts.length === 3) formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`
            }
            return {
              action: l.callConfirmation === 'Đã gọi' ? 'Cuộc gọi chăm sóc' : l.callConfirmation,
              staff: l.staffName,
              date: formattedDate,
              note: l.notes,
              channel: (l.callConfirmation === 'Đã nhắn Zalo' ? 'zalo' : 'telephone') as 'zalo' | 'telephone',
              duration: l.audioDuration,
              tag: l.notes.includes('[CSTP]') ? 'CSTP' : 'T1',
              semantic: 'success' as const,
            }
          })

          const combinedLogs = [...clsLogs, ...allLogs]
          combinedLogs.sort((a, b) => parseLogDate(b.date) - parseLogDate(a.date))

          // Màn tái phí chỉ lấy các log chăm sóc tái phí (CSTP)
          const renewalLogs = combinedLogs.filter(
            (log) => log.tag === 'CSTP' || log.action.toLowerCase().includes('tái phí') || log.note.toLowerCase().includes('tái phí') || log.note.includes('[CSTP]')
          )

          const logs = isUncared ? [] : renewalLogs
          const latestLog = logs[0]
          const rescheduleInfo = getRescheduleInfo(cls)

          const cellContent = (
            <div className="flex flex-col gap-0.5 py-0 text-left max-w-[260px] cursor-pointer group/care">
              {/* Dòng 1 (trên): Nội dung chăm sóc gần nhất */}
              {isUncared ? (
                <div className="text-xs text-muted-foreground">
                  <span className="font-normal text-muted-foreground">Chưa chăm sóc</span>
                </div>
              ) : (
                latestLog && (
                  <div
                    className={cn(
                      'text-xs text-muted-foreground group-hover/care:text-foreground transition-colors leading-tight',
                      rescheduleInfo.isRescheduled ? 'truncate' : 'line-clamp-2 break-words'
                    )}
                    title={`${latestLog.date} (${formatRelativeCareTime(latestLog.date)}): ${latestLog.note}`}
                  >
                    <span className="font-semibold text-foreground dark:text-zinc-100 mr-1 shrink-0">
                      {formatRelativeCareTime(latestLog.date)}:
                    </span>
                    <span className="text-zinc-600 dark:text-zinc-400">{latestLog.note}</span>
                  </div>
                )
              )}

              {/* Dòng 2 (dưới): Lịch hẹn gọi lại (Màu tím nhạt) */}
              {rescheduleInfo.isRescheduled && (
                <div
                  className="text-xs text-purple-500 dark:text-purple-400 flex items-center gap-1 whitespace-nowrap leading-tight mt-0.5"
                  title="Lịch hẹn gọi lại tiếp theo"
                >
                  <Calendar className="h-3 w-3 shrink-0 text-purple-400 dark:text-purple-300" />
                  <span>Hẹn gọi lại: {rescheduleInfo.rescheduleDate} {rescheduleInfo.rescheduleTime}</span>
                </div>
              )}
            </div>
          )

          if (isUncared && !rescheduleInfo.isRescheduled) {
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
      <td className="w-28 min-w-28 max-w-32 whitespace-nowrap">
        {(() => {
          const classification = getRenewalClassification(cls)
          const label = getRenewalClassificationLabel(classification)

          return (
            <div className="flex flex-col items-start gap-0.5">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs font-medium px-1.5 py-0 h-5 leading-none',
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
      <td className="min-w-[200px] max-w-[240px]" onClick={(e) => e.stopPropagation()}>
        {(() => {
          const order = getStudentOrderInfo(cls)
          return (
            <div className="flex flex-col gap-0.5 max-w-[240px] text-left">
              {order.orderCode ? (
                <>
                  {/* Dòng 1: Tên gói */}
                  <div className="flex items-center gap-1.5 font-medium text-foreground leading-tight">
                    <a
                      href={`/quote/${order.orderCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-emerald-800 dark:text-emerald-300 truncate text-xs"
                      title={`Mở Landing Page Báo Giá & Chi tiết Đơn hàng (${order.orderCode})`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{order.packageName}</span>
                    </a>
                  </div>

                  {/* Dòng 2: Mã đơn • Trạng thái thanh toán */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap leading-tight mt-0.5">
                    <a
                      href={`/quote/${order.orderCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-foreground hover:text-primary hover:underline cursor-pointer"
                      title="Xem Landing Page Báo giá & Chi tiết Đơn hàng"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {order.orderCode}
                    </a>
                    {order.paymentStatusLabel && (
                      <>
                        <span>•</span>
                        <StatusBadge
                          status={order.paymentStatus || 'paid'}
                          label={order.paymentStatusLabel}
                          className="text-xs px-1.5 py-0 h-4 font-semibold shrink-0"
                        />
                      </>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs italic text-muted-foreground">
                  Chưa ghép đơn hàng
                </span>
              )}
            </div>
          )
        })()}
      </td>

      {/* Lớp học */}
      <td className="min-w-[145px]">
        {(() => {
          const studentInfo = mockStudents.find(
            (s) => s.id === cls.studentId || s.name.toLowerCase() === cls.studentName.toLowerCase()
          )
          const placementStatus = resolveStudentPlacementStatus(cls, studentInfo)
          const isHoldingClass =
            placementStatus === 'reserve' &&
            Boolean(cls.classCode && cls.classCode !== '-') &&
            !cls.studentNote?.toLowerCase().includes('thoát lớp')

          const hasClassCode = Boolean(cls.classCode && cls.classCode !== '-')
          const showClassHover =
            hasClassCode &&
            (placementStatus === 'active' ||
              placementStatus === 'draft_class' ||
              placementStatus === 'awaiting_opening' ||
              placementStatus === 'trial' ||
              isHoldingClass)
          const classification = getRenewalClassification(cls)
          const expiryTier = getExpiryTier(cls.expectedEndDate, cls.remainingSessions, classification)

          return (
            <div className="flex flex-col gap-0.5 text-left">
              {/* Hàng 1: Mã lớp cùng trạng thái */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {showClassHover ? (
                  <span onClick={(e) => e.stopPropagation()}>
                    <RenewalClassCodeHoverCell
                      classCode={cls.classCode}
                      subject={cls.subject}
                      level={cls.level}
                      subLevel={cls.subLevel}
                      teacherCode={cls.teacherCode}
                      schedule={cls.schedule}
                    />
                  </span>
                ) : hasClassCode ? (
                  <span className="text-xs text-foreground font-mono font-medium">
                    {cls.classCode}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Chưa có lớp
                  </span>
                )}

                <StatusBadge
                  status={placementStatus}
                  label={
                    isHoldingClass
                      ? 'Bảo lưu (Giữ lớp)'
                      : PLACEMENT_STATUS_META[placementStatus]?.label || 'Đang học'
                  }
                  className="text-xs px-1.5 py-0 h-4 font-semibold shrink-0"
                />
              </div>

              {/* Hàng 2: Hạn */}
              {cls.expectedEndDate && (
                <div className="flex items-center gap-1 flex-nowrap text-xs leading-tight mt-0.5">
                  {expiryTier.label ? (
                    <span className={cn('font-bold shrink-0', expiryTier.textClass)}>
                      {expiryTier.label}
                    </span>
                  ) : null}
                  <span className="text-muted-foreground whitespace-nowrap">
                    Hạn: {cls.expectedEndDate}
                  </span>
                </div>
              )}
            </div>
          )
        })()}
      </td>
    </tr>
  )
}

