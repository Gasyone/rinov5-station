import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ContactCell, PersonnelHoverCard, CareTagHoverCard, StatusBadge } from '@/components/shared'
import {
  Calendar,
  MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type StudentCareAlert } from '@/mocks/careAlerts'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { mockStudents } from '@/mocks/students'
import { getStatusBadgeClass, getStatusColors } from '@/lib/statusColors'
import { getInitials, getAvatarColor, getHistoryLogsForStudent, getStudentCareTags, getCareTagAssignees, getRescheduleInfo, isOverdue, isToday, isInProgress, isCared, type CareTag } from './operationsAlertHelpers'
import { getProductSku } from './renewal/renewalHelpers'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { StudentCareItemsDialog } from './StudentCareItemsDialog'
import { OperationsAlertCareHistoryModal } from './OperationsAlertCareHistoryModal'
import {
  resolveStudentPlacementStatus,
  PLACEMENT_STATUS_META,
} from './class-card/studentCareClassCardHelpers'

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

export function AlertRow({ cls, isSelected, onSelectChange, onRefresh, onViewDetail, onOpenRoadmapModal }: AlertRowProps) {
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
          <span className="text-xs font-bold opacity-85 shrink-0 ml-0.5" title={`Phụ trách: ${assignees.join(' · ')}`}>
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
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 hover:opacity-80 transition-opacity',
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
              <div className="text-xs text-muted-foreground font-medium">
                {cls.subject} - {cls.level}
              </div>
            </div>
          </div>

          {/* Icon Mốc Chăm sóc - Thường ẩn, hiện khi hover row (group-hover), kích thước h-5 w-5 */}
          <button
            type="button"
            title="Xem Mốc chăm sóc & Hành trình Học tập 6 Tháng"
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
                  <span className="text-xs px-1 font-bold border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 rounded animate-in fade-in duration-300">
                    CS
                  </span>
                  <span className="font-normal text-muted-foreground text-xs hover:text-emerald-600 dark:hover:text-emerald-400">{cls.csStaff}</span>
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
                    <span className="font-normal text-muted-foreground text-xs hover:text-violet-600 dark:hover:text-violet-400">{teacher}</span>
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

          return (
            <div className="flex flex-col gap-1 text-left">
              {/* Hàng 1: Trình độ */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="truncate shrink-0 text-zinc-700 dark:text-zinc-300 font-medium text-xs" title={cls.level}>
                  {cls.level}
                </span>
              </div>

              {/* Hàng 2: Mã lớp & Trạng thái */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {showClassHover ? (
                  <span onClick={(e) => e.stopPropagation()}>
                    <ClassCodeHoverCell
                      classCode={cls.classCode}
                      subject={cls.subject}
                      level={cls.level}
                      teacherCode={cls.teacherCode}
                      schedule={cls.schedule}
                    />
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground font-mono">
                    {hasClassCode ? cls.classCode : 'Chưa có mã lớp'}
                  </span>
                )}

                <StatusBadge
                  status={placementStatus}
                  label={
                    isHoldingClass
                      ? 'Bảo lưu (Giữ lớp)'
                      : PLACEMENT_STATUS_META[placementStatus]?.label || 'Đang học'
                  }
                  className="text-[10px] px-1.5 py-0 h-4 font-semibold shrink-0"
                />
              </div>
            </div>
          )
        })()}
      </td>

      {/* Gói sản phẩm */}
      <td className="py-1.5 px-2 min-w-[180px]">
        {(() => {
          const skuName = getProductSku(cls)

          return (
            <div className="flex flex-col gap-0.5 min-w-[180px] max-w-[260px]">
              {/* Hàng 1: Tên gói học mới nhất */}
              <div className="flex items-center gap-1.5 flex-nowrap">
                <span className="text-zinc-700 dark:text-zinc-300 font-medium text-xs truncate shrink-0 max-w-[230px]" title={skuName}>
                  {skuName}
                </span>
              </div>
              {/* Hàng 2: Hạn học phí */}
              {cls.expectedEndDate && (
                <div className="flex items-center gap-1.5 flex-nowrap text-xs">
                  <span className="text-muted-foreground whitespace-nowrap">
                    Hạn: {cls.expectedEndDate}
                  </span>
                </div>
              )}
            </div>
          )
        })()}
      </td>

      {/* Nội dung chăm sóc (Hiển thị hàng ngang flex-wrap, tối đa 2 dòng) */}
      <td className="py-1.5 px-2 min-w-[260px]" onClick={(e) => e.stopPropagation()}>
        {(() => {
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
                          className="h-6 px-1.5 text-xs font-extrabold text-primary border-primary/40 bg-primary/5 hover:bg-primary/15 rounded-md shrink-0 shadow-none cursor-pointer"
                          title="Xem toàn bộ danh sách hạng mục chăm sóc"
                        >
                          +{remainingCount}
                        </Button>
                      )}
                    </>
                  ) : (
                    <span className="text-zinc-400 italic text-xs">-</span>
                  )}
                </div>
              )}

              {!showTagsInColumn && (
                <span className="text-zinc-400 italic text-xs">-</span>
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

      {/* Lịch sử chăm sóc */}
      <td className="py-1.5 px-2 min-w-[260px]" onClick={(e) => e.stopPropagation()}>
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

          // Màn vận hành chỉ hiển thị các log chăm sóc vận hành (loại trừ CSTP / tái phí)
          const operationalLogs = combinedLogs.filter(
            (log) => log.tag !== 'CSTP' && !log.action.toLowerCase().includes('tái phí') && !log.note.toLowerCase().includes('tái phí') && !log.note.includes('[CSTP]')
          )

          const logs = isUncared ? [] : operationalLogs
          const latestLog = logs[0]
          const rescheduleInfo = getRescheduleInfo(cls)
          const attemptCount = logs.length

          const cellContent = (
            <div className="flex flex-col gap-1 py-0.5 text-left max-w-[260px] cursor-pointer group/care">
              {/* Dòng 1 (trên): Lịch sử chăm sóc gần nhất với (n) ở trước ngày và nội dung */}
              {isUncared && !rescheduleInfo.isRescheduled ? (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-zinc-500 mr-1">(0)</span>
                  <span className="italic text-amber-600 dark:text-amber-400 font-medium">Chưa chăm sóc</span>
                </div>
              ) : latestLog ? (
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
              ) : (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-bold text-sky-700 dark:text-sky-400 mr-1">(0)</span>
                  <span className="italic text-sky-600 dark:text-sky-400 font-medium">Đã lên lịch hẹn</span>
                </div>
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
              defaultTab="operational"
            />
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

          // 2. Nhãn phụ & SLA (Auxiliary Status & Time: Quá hạn [Đỏ], Đến hạn [Vàng], Hạn)
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
                <Badge variant="outline" className={cn("text-xs font-semibold px-1.5 py-0.5", lifecycleStatus.badgeClass)}>
                  {lifecycleStatus.label}
                </Badge>
              </div>

              {/* Dòng 2: Thời gian SLA (Gần nhất / Quá hạn / Đến hạn / Hạn) */}
              <div className="text-xs font-mono">
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
            </div>
          )
        })()}
      </td>
    </tr>
  )
}
