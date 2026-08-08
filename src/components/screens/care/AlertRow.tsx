import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ContactCell, PersonnelHoverCard, CareTagHoverCard } from '@/components/shared'
import {
  ExternalLink,
  ArrowLeftRight,
  Calendar,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type StudentCareAlert } from '@/mocks/careAlerts'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { getStatusBadgeClass, getStatusColors } from '@/lib/statusColors'
import { stableHash, getInitials, getAvatarColor, getHistoryLogsForStudent, getStudentCareTags, getCareTagAssignees, getUnassignedStaffStatus, parseAttendanceRate, getRescheduleInfo, isOverdue, isToday, isInProgress, isCared, type CareTag } from './operationsAlertHelpers'
import { OperationsAlertHistoryPopover } from './OperationsAlertHistoryPopover'
import { RenewalHistoryPopover } from './renewal/RenewalHistoryPopover'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { StudentCareItemsDialog } from './StudentCareItemsDialog'
import { useAuthStore } from '@/stores/useAuthStore'


// Mock class records
import { mockClassRecords } from '@/mocks/classRecords'

function AcademicStatsCell({ cls }: { cls: StudentCareAlert }) {
  const ratio = cls.attendanceRatio || '0/0';
  const ccPct = parseAttendanceRate(ratio);
  
  // Điểm gần nhất và điểm trung bình
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

  // BTVN: Số làm / Tổng
  const [, total] = ratio.split('/').map(Number);
  const displayTotal = (total && total > 0) ? total : 5;
  const done = Math.round((cls.homeworkCompletion / 100) * displayTotal);



  return (
    <div className="flex items-center py-0.5 select-none min-h-[44px]">
      <div className="flex flex-col gap-0.5 text-left text-[10px] leading-tight font-medium text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-1">
          <span className="text-zinc-400 dark:text-zinc-500 font-normal shrink-0 text-[10px]">CC:</span>
          <span className="font-medium text-zinc-600 dark:text-zinc-400 text-[10px]">{ratio}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-normal text-[9.5px]">({ccPct}%)</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-zinc-400 dark:text-zinc-500 font-normal shrink-0 text-[10px]">Điểm:</span>
          <span className="font-medium text-zinc-600 dark:text-zinc-400 text-[10px]">{last}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-normal text-[9.5px]">/</span>
          <span className="font-normal text-zinc-500 text-[9.5px]">{avg.toFixed(1)}</span>
          <span className={cn("text-[9px]", changeColor)}>({changeText})</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-zinc-400 dark:text-zinc-500 font-normal shrink-0 text-[10px]">BTVN:</span>
          <span className="font-medium text-zinc-600 dark:text-zinc-400 text-[10px]">{done}/{displayTotal}</span>
          <span className="text-zinc-400 dark:text-zinc-500 font-normal text-[9.5px]">({cls.homeworkCompletion}%)</span>
        </div>
      </div>
    </div>
  );
}

export interface AlertRowProps {
  cls: StudentCareAlert
  isSelected: boolean
  onSelectChange: (id: string, checked: boolean) => void
  viewMode?: 'service' | 'academic' | 'total'
  rowIndex: number
  onRefresh?: () => void
  onViewDetail?: (id: string) => void
  onOpenRoadmapModal?: (cls: StudentCareAlert) => void
}

function getCareTagFullLabel(tag: CareTag): string {
  if (tag.label === 'CSCĐ') return 'CSCĐ: Cảnh báo học thuật'
  if (tag.label === 'ĐB1' || tag.label.startsWith('ĐB')) return `${tag.label}: CS Đặc biệt`
  if (tag.label === 'ĐK1') return 'ĐK1: CS học tập Định kỳ'
  if (tag.label === 'ĐK2') return 'ĐK2: CS học phí Định kỳ'
  if (tag.label === 'TB1') return 'TB1: CS chuyên cần & gói phí'
  if (tag.label === 'TB2') return 'TB2: CS bài tập về nhà'
  if (tag.label === 'CSTP') return 'CSTP: Chăm sóc Tái phí'
  return `${tag.label}: ${tag.displayLabel || tag.description}`
}

export function AlertRow({ cls, isSelected, onSelectChange, rowIndex, onRefresh, onViewDetail, onOpenRoadmapModal }: AlertRowProps) {
  const { user } = useAuthStore()
  const currentRole = user?.role || 'csm'
  const showTagsInColumn = true

  // Family contacts
  const contacts = getFamilyContacts(cls.studentId, cls.studentName)
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0]

  const allTags = getStudentCareTags(cls)
    .filter((tag) => !tag.isCompleted)
    .sort((a, b) => {
      const aIsDB = a.label.startsWith('ĐB') || a.label.startsWith('CSĐB')
      const bIsDB = b.label.startsWith('ĐB') || b.label.startsWith('CSĐB')
      if (aIsDB && !bIsDB) return -1
      if (!aIsDB && bIsDB) return 1
      return 0
    })

  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false)
  const visibleCount = allTags.length > 2 ? 2 : allTags.length
  const visibleTags = allTags.slice(0, visibleCount)
  const remainingCount = allTags.length - visibleCount

  const renderTagBadge = (tag: CareTag, idx: number) => {
    const isSpecialCare = tag.label.startsWith('ĐB')
    const isOverdue = !tag.isCompleted && tag.isOverdue
    const isDueToday = !tag.isCompleted && tag.isDueToday

    let colorClass = 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400'
    if (tag.isCompleted) {
      colorClass = 'border-zinc-200 bg-zinc-50 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-600 line-through'
    } else if (isSpecialCare || tag.semantic === 'error') {
      colorClass = getStatusColors('error').badge
    } else if (tag.semantic === 'purple' || tag.label.startsWith('ĐK')) {
      colorClass = getStatusColors('purple').badge
    } else if (tag.semantic === 'warning' || tag.label.startsWith('TB')) {
      colorClass = getStatusColors('warning').badge
    } else if (tag.semantic === 'success' || tag.label === 'CSTP') {
      colorClass = getStatusColors('success').badge
    } else if (tag.semantic === 'info' || tag.label === 'CSCĐ') {
      colorClass = getStatusColors('info').badge
    }

    const fullText = getCareTagFullLabel(tag)
    const assignees = getCareTagAssignees(tag)

    return (
      <CareTagHoverCard
        key={idx}
        code={tag.label}
        fullLabel={fullText}
        colorClass={colorClass}
        description={tag.description}
        configRule={tag.configRule}
        realDataIssue={tag.realDataIssue || tag.description}
        occurredDate={tag.occurredDate || '20/07/2026'}
        dueDate={cls.expectedEndDate || '23/09/2026'}
        isOverdue={isOverdue}
        isDueToday={isDueToday}
        slaText={tag.slaText}
      >
        <Badge
          variant="outline"
          className={cn(
            'text-xs px-2.5 py-1 min-h-[30px] font-semibold flex items-center gap-1.5 shrink-0 relative border whitespace-nowrap text-left w-fit leading-none cursor-help transition-opacity hover:opacity-90 rounded-lg shadow-none',
            colorClass
          )}
        >
          {!tag.isCompleted && (
            <>
              {isOverdue && (
                <span className="flex h-2 w-2 shrink-0 rounded-full bg-red-600 animate-pulse" title="Quá hạn" />
              )}
              {isDueToday && (
                <span className="flex h-2 w-2 shrink-0 rounded-full bg-amber-500" title="Đến hạn hôm nay" />
              )}
            </>
          )}
          <span className="font-semibold text-xs">{tag.label}</span>
          <span className="text-[10px] font-bold opacity-85 shrink-0 ml-0.5" title={`Phụ trách: ${assignees.join(' · ')}`}>
            {assignees.length > 1 ? 'CS · GV' : assignees[0] || 'CS'}
          </span>
        </Badge>
      </CareTagHoverCard>
    )
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
      <td className="py-1.5 px-2 text-center" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(val) => onSelectChange(cls.id, val === true)}
          aria-label={`Chọn ${cls.studentName} - ${cls.classCode}`}
        />
      </td>

      {/* Học viên */}
      <td className="py-1.5 px-2 min-w-[210px]">
        <div className="flex items-center justify-between gap-2 min-w-0 w-full">
          {/* Avatar + Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 hover:opacity-80 transition-opacity',
                getAvatarColor(cls.studentId)
              )}
            >
              {getInitials(cls.studentName)}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="font-bold text-foreground text-xs truncate hover:underline hover:text-primary" title={cls.englishName ? `${cls.studentName} (${cls.englishName})` : cls.studentName}>
                  {cls.studentName} {cls.englishName ? `(${cls.englishName})` : ''}
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">
                {cls.subject} - {cls.level}
              </div>
            </div>
          </div>

          {/* Icon Lộ trình Chăm sóc - Thường ẩn, hiện khi hover row (group-hover), kích thước h-5 w-5 */}
          <button
            type="button"
            title="Xem Lộ trình chăm sóc & Hành trình Học tập 6 Tháng"
            className="opacity-0 group-hover:opacity-100 p-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-full transition-opacity cursor-pointer shrink-0"
            onClick={(e) => {
              e.stopPropagation()
              onOpenRoadmapModal?.(cls)
            }}
          >
            <MapPin className="h-5 w-5 text-sky-600" />
          </button>
        </div>
      </td>

      {/* Liên hệ */}
      <td className="py-1.5 px-2 min-w-[130px]" onClick={(e) => e.stopPropagation()}>
        <ContactCell
          name={primaryContact ? `GĐ ${cls.studentName.split(' ').pop()?.toUpperCase()}` : '-'}
          phone={primaryContact?.phone}
          studentId={cls.studentId}
          studentName={cls.studentName}
          masked={true}
          showCallButton={false}
          additionalContacts={
            contacts && contacts.length > 1
              ? contacts.map((c) => ({ name: `${c.name} (${c.relationship})`, phone: c.phone }))
              : undefined
          }
        />
      </td>

      {/* Phụ trách */}
      <td className="py-1.5 px-2 min-w-[135px]" onClick={(e) => e.stopPropagation()}>
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
                  <span className="font-normal text-muted-foreground text-[10px] hover:text-emerald-600 dark:hover:text-emerald-400">{cls.csStaff}</span>
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
                    <span className="font-normal text-muted-foreground text-[10px] hover:text-violet-600 dark:hover:text-violet-400">{teacher}</span>
                  </div>
                </div>
              </PersonnelHoverCard>
            ))
          })()}
        </div>
      </td>

      {/* Lớp học */}
      <td className="py-1.5 px-2 min-w-[165px]">
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
                    : "font-normal text-zinc-500 dark:text-zinc-400 text-xs"
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
                  <OperationsAlertHistoryPopover
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
                  <span className="text-[10px] font-semibold text-violet-750 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/20 px-1.5 py-0.5 rounded border border-violet-200/50 w-fit">
                    Bảo lưu
                  </span>
                ) : cls.status === 'Hết buổi' ? (
                  <span className="text-[10px] font-semibold text-zinc-655 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/40 px-1.5 py-0.5 rounded border border-zinc-200 w-fit">
                    Hết phí
                  </span>
                ) : cls.status === 'Chờ chuyển lớp' ? (
                  <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-200/50 w-fit">
                    Chờ ghép lớp mới
                  </span>
                ) : (
                  <>
                    <span onClick={(e) => e.stopPropagation()}>
                      <ClassCodeHoverCell
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
      <td className="py-1.5 px-2 min-w-[140px]">
        {(() => {
          const hasPackageHistory = cls.status === 'Chờ chuyển lớp' || stableHash(cls.studentId) % 3 === 0
          return (
            <div className="flex flex-col gap-0.5 min-w-[135px]">
              <div className="flex items-center gap-1.5 flex-nowrap whitespace-nowrap">
                <span className="text-zinc-500 dark:text-zinc-400 text-xs truncate shrink-0">{cls.level}</span>
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

      {/* Thống kê học tập */}
      <td className="py-1.5 px-2 min-w-[135px]">
        <AcademicStatsCell cls={cls} />
      </td>

      {/* Nội dung chăm sóc (Hiển thị hàng ngang flex-wrap, tối đa 2 dòng) */}
      <td className="py-1.5 px-2 min-w-[260px]" onClick={(e) => e.stopPropagation()}>
        {(() => {
          const unassignedInfo = getUnassignedStaffStatus(cls)
          return (
            <div className="flex flex-col gap-1 py-0.5 max-w-[290px]">
              {showTagsInColumn && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {allTags.length > 0 ? (
                    <>
                      {visibleTags.map((tag, idx) => renderTagBadge(tag, idx))}
                      {remainingCount > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsItemsModalOpen(true)
                          }}
                          className="h-6 px-1.5 text-[11px] font-extrabold text-primary border-primary/40 bg-primary/5 hover:bg-primary/15 rounded-md shrink-0 shadow-none cursor-pointer"
                          title="Xem toàn bộ danh sách hạng mục chăm sóc"
                        >
                          +{remainingCount}
                        </Button>
                      )}
                    </>
                  ) : (
                    <span className="text-zinc-400 italic text-[10px]">-</span>
                  )}
                </div>
              )}

              {/* Text màu cam thông báo Chưa gán CS/GV bên dưới nhãn chăm sóc */}
              {unassignedInfo.isUnassigned && (
                <div className="text-left pt-0.5">
                  <span className="text-amber-600 dark:text-amber-400 text-[10.5px] font-medium leading-tight block">
                    {unassignedInfo.unassignedText}
                  </span>
                </div>
              )}

              {!showTagsInColumn && !unassignedInfo.isUnassigned && (
                <span className="text-zinc-400 italic text-[10px]">-</span>
              )}

              {remainingCount > 0 && (
                <StudentCareItemsDialog
                  open={isItemsModalOpen}
                  onOpenChange={setIsItemsModalOpen}
                  studentName={cls.studentName}
                  studentId={cls.studentId}
                  tags={allTags}
                />
              )}
            </div>
          )
        })()}
      </td>

      {/* Trạng thái */}
      <td className="py-1.5 px-2 min-w-[140px] whitespace-nowrap">
        {(() => {
          const isCompleted = isCared(cls)
          const isInProgressCall = isInProgress(cls)

          // 1. Trạng thái Vòng đời chăm sóc (Main Care Lifecycle Status - khớp màu chuẩn 100% với các Tab lọc)
          const lifecycleStatus = isCompleted
            ? { label: 'Hoàn thành', badgeClass: getStatusBadgeClass('completed') }
            : isInProgressCall
              ? { label: 'Đang xử lý', badgeClass: getStatusBadgeClass('in_progress') }
              : { label: 'Chưa chăm sóc', badgeClass: getStatusBadgeClass('info') }

          // 2. Nhãn phụ & SLA (Auxiliary Status & Time: Quá hạn [Đỏ], Đến hạn [Vàng], Hẹn gọi lại [Tím])
          const rescheduleInfo = getRescheduleInfo(cls)
          const isOverdueAlert = isOverdue(cls)
          const isDueTodayAlert = isToday(cls)
          const slaDeadline = cls.expectedEndDate || '23/09/2026'

          const studentLogs = getHistoryLogsForStudent(cls.studentId)
          const latestLog = studentLogs[0]
          const latestDate = latestLog ? latestLog.date : '12/07/2026'

          return (
            <div className="space-y-1 text-left">
              {/* Dòng 1: Trạng thái Vòng đời chăm sóc */}
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className={cn("text-[10px] font-semibold px-1.5 py-0.5", lifecycleStatus.badgeClass)}>
                  {lifecycleStatus.label}
                </Badge>
              </div>

              {/* Dòng 2: Thời gian SLA (Gần nhất / Quá hạn / Đến hạn / Hạn) */}
              <div className="text-[10px] font-mono">
                {isCompleted ? (
                  <span className="text-muted-foreground font-normal">Gần nhất: {latestDate}</span>
                ) : isOverdueAlert ? (
                  <span className="text-red-600 dark:text-red-400 font-normal">Quá hạn: {slaDeadline}</span>
                ) : isDueTodayAlert ? (
                  <span className="text-amber-600 dark:text-amber-400 font-normal">Đến hạn: {slaDeadline}</span>
                ) : (
                  <span className="text-muted-foreground font-normal">Hạn: {slaDeadline}</span>
                )}
              </div>

              {/* Dòng 3: Nhãn hẹn gọi lại (Nếu có hẹn gọi lại, hiển thị đầy đủ không bị ẩn bớt dòng Hạn ở trên) */}
              {rescheduleInfo.isRescheduled && !isCompleted && (
                <div className="flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300 px-1.5 py-0.5 rounded border border-violet-200 dark:border-violet-900 w-fit">
                  <Calendar className="h-3 w-3 shrink-0 text-violet-600 dark:text-violet-400" />
                  <span>Hẹn: {rescheduleInfo.rescheduleDate} {rescheduleInfo.rescheduleTime}</span>
                </div>
              )}
            </div>
          )
        })()}
      </td>
    </tr>
  )
}
