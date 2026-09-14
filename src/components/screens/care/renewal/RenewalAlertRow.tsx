'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ContactCell, PersonnelHoverCard } from '@/components/shared'
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
import { stableHash, getInitials, getAvatarColor, getHistoryLogsForStudent, getRenewalClassification, getRenewalClassificationLabel, getStudentOrderInfo, getProductSku, getExpiryTier } from './renewalHelpers'
import { RenewalClassCodeHoverCell } from './RenewalClassCodeHoverCell'
import { getAcademicIssues, isCared, isInProgress, getRescheduleInfo } from '../operationsAlertHelpers'
import { OperationsAlertCareHistoryModal } from '../OperationsAlertCareHistoryModal'

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
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
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
              </div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">
                {cls.subject} - {cls.level}
              </div>
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
              </div>
            )
          })()}
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
                  <span className="text-xs px-1 font-bold border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 rounded animate-in fade-in duration-300">
                    CS
                  </span>
                  <span className="text-foreground text-xs hover:text-emerald-600 dark:hover:text-emerald-400">{cls.csStaff}</span>
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
                    <span className="text-xs px-1 font-bold border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-400 rounded">
                      GV
                    </span>
                    <span className="text-foreground text-xs hover:text-violet-600 dark:hover:text-violet-400">{teacher}</span>
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
          const studentInfo = mockStudents.find((s) => s.id === cls.studentId)
          const isWaitAssignment = studentInfo?.status === 'wait_for_assignment'
          const hasClassHistory = cls.status === 'Chờ chuyển lớp' || studentInfo?.status === 'pending_transfer' || stableHash(cls.studentId) % 4 === 0
          const classCount = hasClassHistory ? 2 : 1

          return (
            <div className="flex flex-col gap-1 text-left">
              {/* Hàng 1: (N) Trình độ */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="truncate shrink-0 text-zinc-700 dark:text-zinc-300 font-medium text-xs" title={`(${classCount}) ${cls.level}`}>
                  <span className="font-bold mr-1 text-foreground">({classCount})</span>
                  {cls.level}
                </span>
              </div>

              {/* Hàng 2: Mã lớp & Trạng thái */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {isWaitAssignment || cls.status === 'Chưa ghép lớp' ? (
                  <>
                    <span className="text-xs text-muted-foreground font-mono">Chưa có mã lớp</span>
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200/50">
                      Chờ ghép lớp
                    </span>
                  </>
                ) : studentInfo?.status === 'reserve' || cls.status === 'Bảo lưu' ? (
                  <>
                    <span className="text-xs text-muted-foreground font-mono">{cls.classCode}</span>
                    <span className="text-xs font-semibold text-violet-755 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 px-1.5 py-0.5 rounded border border-violet-200/50 w-fit">
                      Bảo lưu
                    </span>
                  </>
                ) : cls.status === 'Hết buổi' ? (
                  <>
                    <span className="text-xs text-muted-foreground font-mono">{cls.classCode}</span>
                    <span className="text-xs font-semibold text-zinc-650 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/40 px-1.5 py-0.5 rounded border border-zinc-200 w-fit">
                      Hết phí
                    </span>
                  </>
                ) : cls.status === 'Chờ chuyển lớp' ? (
                  <>
                    <span className="text-xs text-muted-foreground font-mono">{cls.classCode}</span>
                    <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200/50 w-fit">
                      Chờ ghép lớp mới
                    </span>
                  </>
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
                        'text-xs px-1.5 py-0 h-3.5 font-semibold shrink-0',
                        getStatusBadgeClass('dang_hoc')
                      )}
                    >
                      Đang học
                    </Badge>
                  </>
                )}
              </div>
            </div>
          )
        })()}
      </td>

      {/* Gói sản phẩm */}
      <td className="py-3 px-3">
        {(() => {
          const hasPackageHistory = cls.status === 'Chờ chuyển lớp' || stableHash(cls.studentId) % 3 === 0
          const packageCount = hasPackageHistory ? 2 : 1
          const skuName = getProductSku(cls)
          const expiryTier = getExpiryTier(cls.expectedEndDate, cls.remainingSessions)

          return (
            <div className="flex flex-col gap-0.5 min-w-[200px] max-w-[280px]">
              {/* Hàng 1: (N) Tên gói học mới nhất */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium text-xs truncate shrink-0 max-w-[240px]" title={`(${packageCount}) ${skuName}`}>
                  <span className="font-bold mr-1 text-foreground">({packageCount})</span>
                  {skuName}
                </span>
              </div>
              {/* Hàng 2: Nhãn kỳ hạn (T1, T2, T3) & Hạn học phí */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[10px] px-1 py-0 h-4 font-bold shrink-0 leading-none',
                    expiryTier.badgeClass
                  )}
                >
                  {expiryTier.label}
                </Badge>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Hạn: {cls.expectedEndDate}
                </span>
              </div>
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
          const attemptCount = logs.length

          const cellContent = (
            <div className="flex flex-col gap-1 py-0.5 text-left max-w-[260px] cursor-pointer group/care">
              {/* Dòng 1 (trên): Lịch sử chăm sóc gần nhất với (n) ở trước ngày và nội dung */}
              {isUncared ? (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-zinc-500 mr-1">(0)</span>
                  <span className="italic text-amber-600 dark:text-amber-400 font-medium">Chưa chăm sóc</span>
                </div>
              ) : (
                latestLog && (
                  <div
                    className="text-xs text-muted-foreground truncate group-hover/care:text-foreground transition-colors"
                    title={`(${attemptCount}) ${latestLog.date}: ${latestLog.note}`}
                  >
                    <span
                      className={cn(
                        'font-bold mr-1',
                        inProgress
                          ? 'text-sky-700 dark:text-sky-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      )}
                    >
                      ({attemptCount})
                    </span>
                    <span className="font-mono text-zinc-500 mr-1">{latestLog.date}:</span>
                    <span>{latestLog.note}</span>
                  </div>
                )
              )}

              {/* Dòng 2 (dưới): Lịch hẹn gọi lại */}
              {rescheduleInfo.isRescheduled && (
                <div
                  className="text-xs text-purple-700 dark:text-purple-400 flex items-center gap-1 whitespace-nowrap"
                  title="Lịch hẹn gọi lại tiếp theo"
                >
                  <Calendar className="h-3 w-3 shrink-0 text-purple-600 dark:text-purple-400" />
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
      <td className="py-3 px-3 min-w-[140px]">
        {(() => {
          const classification = getRenewalClassification(cls)
          const label = getRenewalClassificationLabel(classification)

          return (
            <div className="flex flex-col items-start gap-0.5">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs px-2 py-0.5 font-semibold',
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
                  {/* Dòng 1: Tên gói */}
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
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
                    </a>
                  </div>

                  {/* Dòng 2: Mã đơn • Số tiền tổng đã thanh toán */}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
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
                    {order.packageAmount && (
                      <>
                        <span>•</span>
                        <span className="font-mono font-semibold text-emerald-700 dark:text-emerald-400">
                          TT: {order.packageAmount}
                        </span>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <span className="text-xs italic text-muted-foreground">
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

