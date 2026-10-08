'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { EmptyState, StatusBadge, ContactCell, AppAvatar } from '@/components/shared'
import { DataTableFrame, DataTablePagination } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { GraduationCap, Cake, RotateCcw, UserPlus } from 'lucide-react'
import type { Student, EnrolledClass } from '@/mocks/students'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { STUDENT_STATUS_LABELS } from './studentTypes'
import { getBirthdayInfo, getStudentAge, formatNextSessionShort, getPlacementAttempt, getLessonName } from './studentsHelpers'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import { cn } from '@/lib/utils'

interface StudentsTableProps {
  students: Student[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onView: (studentId: string) => void
  onCreateTicket?: (studentId: string) => void
  onAssignClass?: (student: Student, packageName?: string) => void
  onEarlyReturn?: (student: Student, enrolledClass?: EnrolledClass) => void
  className?: string
  pagination?: {
    page: number
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    selectedCount?: number
    onClearSelection?: () => void
  }
}

export function StudentsTable({
  students,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onView,
  onAssignClass,
  onEarlyReturn,
  className,
  pagination,
}: StudentsTableProps) {
  const pageIds = students.map((s) => s.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))


  if (students.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap className="h-7 w-7 text-muted-foreground" />}
        title="Không có học viên phù hợp."
        description="Điều chỉnh tìm kiếm, trường, trạng thái hoặc bộ lọc."
        className="py-10 border border-border rounded-lg bg-card"
      />
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <DataTableFrame
        className={cn("flex flex-col min-h-0", className)}
        footer={
          pagination ? (
            <DataTablePagination
              page={pagination.page}
              total={pagination.total}
              pageSize={pagination.pageSize}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
              selectedCount={pagination.selectedCount}
              onClearSelection={pagination.onClearSelection}
              size="sm"
            />
          ) : null
        }
      >
        <table className="w-full min-w-max text-xs text-left border-separate border-spacing-0">
            <thead className="sticky top-0 z-40 bg-muted">
              <tr className="bg-muted hover:bg-muted [&>th]:h-8 [&>th]:py-1 [&>th]:text-xs [&>th]:font-normal [&>th]:text-muted-foreground [&>th]:border-b [&>th]:border-border/80">
                {/* Checkbox: sticky top-0 left-0 z-50 */}
                <th className="sticky top-0 left-0 z-50 w-8 min-w-8 max-w-8 text-center px-1 bg-muted border-b border-border/80">
                  <Checkbox
                    checked={isPageSelected}
                    onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
                    className="h-3.5 w-3.5 translate-y-[1px]"
                    aria-label="Chọn tất cả học viên"
                  />
                </th>
                {/* Học viên: sticky top-0 left-8 z-50 */}
                <th className="sticky top-0 left-8 z-50 w-[210px] min-w-[210px] max-w-[210px] px-2.5 bg-muted text-left border-b border-border/80">
                  Học viên
                </th>
                {/* Liên hệ */}
                <th className="sticky top-0 z-40 w-[160px] min-w-[150px] max-w-[175px] px-2.5 bg-muted text-left border-b border-border/80">
                  Liên hệ
                </th>
                {/* Gói đăng ký */}
                <th className="sticky top-0 z-40 w-[160px] min-w-[145px] max-w-[185px] px-2.5 bg-muted text-left border-b border-border/80">
                  Gói đăng ký
                </th>
                {/* Trình độ & Lớp học */}
                <th className="sticky top-0 z-40 w-[155px] min-w-[140px] max-w-[175px] px-2.5 bg-muted text-left border-b border-border/80">
                  Trình độ & Lớp học
                </th>
                {/* Buổi học bắt đầu */}
                <th className="sticky top-0 z-40 w-[175px] min-w-[160px] max-w-[195px] px-2.5 bg-muted text-left border-b border-border/80">
                  Buổi học bắt đầu
                </th>
                {/* Trạng thái */}
                <th className="sticky top-0 z-40 w-[110px] min-w-[100px] max-w-[120px] px-2 bg-muted text-left border-b border-border/80">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, studentIdx) => {
                const familyContacts = getFamilyContacts(student.id, student.name)
                const primaryContact = familyContacts.find((c) => c.isPrimary) || familyContacts[0]
                const parentDisplayName = student.parentName
                  ? (/\(.*\)/.test(student.parentName)
                      ? student.parentName
                      : `${student.parentName}${primaryContact?.relationship ? ` (${primaryContact.relationship})` : ''}`)
                  : (primaryContact?.name
                      ? `${primaryContact.name}${primaryContact.relationship ? ` (${primaryContact.relationship})` : ''}`
                      : undefined)
                const parentPhone = student.parentPhone || primaryContact?.phone

                // Compute subRows: fallback to dynamic virtual row representing their purchased package if no class assigned
                const subRows: EnrolledClass[] = student.enrolledClasses && student.enrolledClasses.length > 0
                  ? student.enrolledClasses
                  : [
                      {
                        classCode: `UNASSIGNED-${student.id}`,
                        className: 'Chưa xếp lớp',
                        type: 'offline',
                        scheduleSlots: [],
                        teacherName: '-',
                        status: 'wait_for_assignment',
                        progress: student.totalSessions !== undefined && student.remainingSessions !== undefined
                          ? `${student.totalSessions - student.remainingSessions} / ${student.totalSessions} buổi`
                          : `0 / ${student.totalSessions || 24} buổi`,
                        programName: student.packageName || 'Chương trình học',
                        linkedPackageName: student.packageName,
                        pathCode: '-',
                        curriculumName: student.curriculum || '-',
                        curriculumCode: '-',
                        nextLessonName: '-',
                        nextLessonDate: '-',
                        branch: '-',
                        room: '-',
                        level: student.level || '-',
                        subLevel: student.subLevel || '-',
                        startDate: undefined,
                        endDate: undefined,
                      }
                    ]

                const M = subRows.length
                const isSelected = selectedIds.has(student.id)
                const isEven = studentIdx % 2 === 0
                const stickyBgClass = isSelected
                  ? '!bg-sky-100 dark:!bg-sky-950'
                  : isEven
                    ? 'bg-slate-50 dark:bg-zinc-900 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
                    : 'bg-white dark:bg-zinc-950 group-hover:bg-slate-100 dark:group-hover:bg-zinc-800'
                const rowBgClass = isSelected
                  ? '!bg-sky-50 dark:!bg-sky-950'
                  : isEven
                    ? 'bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800'
                    : 'bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-800'

                return subRows.map((cls, idx) => {
                  const isFirstRow = idx === 0

                  return (
                    <tr
                      key={`${student.id}-${cls.classCode}`}
                      className={cn(
                        "group transition-colors text-xs border-b-0",
                        rowBgClass
                      )}
                    >
                      {/* DÒNG HỌC VIÊN (GỘP - CHỈ HIỂN THỊ Ở DÒNG ĐẦU TIÊN) */}
                      {isFirstRow && (
                        <>
                          {/* 1. Checkbox */}
                          <td
                            rowSpan={M}
                            className={cn(
                              "sticky left-0 z-30 w-8 min-w-8 max-w-8 overflow-hidden text-center py-1.5 px-1 transition-colors align-top",
                              stickyBgClass
                            )}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => onToggleOne(student.id, Boolean(checked))}
                              className="h-3.5 w-3.5 translate-y-[1px]"
                              aria-label={`Chọn học viên ${student.name}`}
                            />
                          </td>

                          {/* 2. Học viên */}
                          <td
                            rowSpan={M}
                            className={cn(
                              "sticky left-8 z-30 w-[210px] min-w-[210px] max-w-[210px] py-1.5 px-2.5 transition-colors align-top cursor-pointer",
                              stickyBgClass
                            )}
                            onClick={() => onView(student.id)}
                          >
                            <div className="relative z-10 max-w-full overflow-hidden group/student">
                              <div className="flex items-center gap-2 min-w-0">
                                <AppAvatar
                                  name={student.name}
                                  size="sm"
                                  shape="square"
                                  userId={student.id}
                                  userType="student"
                                  className="shrink-0 rounded-md"
                                />
                                <div className="min-w-0 space-y-0.5">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <p className="truncate font-semibold text-xs text-foreground group-hover/student:text-primary transition-colors cursor-pointer leading-tight">
                                        {student.englishName ? `${student.name} (${student.englishName})` : student.name}
                                      </p>
                                    </TooltipTrigger>
                                    <TooltipContent>{student.name}{student.englishName ? ` (${student.englishName})` : ''}</TooltipContent>
                                  </Tooltip>
                                  {(() => {
                                    const bday = getBirthdayInfo(student.dob)
                                    const genderLabel = student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'
                                    const age = student.dob ? getStudentAge(student.dob) : null
                                    const ageText = age !== null && age > 0 ? `${age}t` : '—'
                                    const birthYear = bday ? bday.birthYear : (student.dob ? new Date(student.dob).getFullYear() : '—')

                                    return (
                                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground leading-tight truncate">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <span className="truncate cursor-default hover:text-foreground transition-colors">
                                              {genderLabel} • {ageText} • {birthYear}
                                            </span>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {bday?.fullDob ? `Ngày sinh: ${bday.fullDob}` : 'Chưa cập nhật ngày sinh'}
                                          </TooltipContent>
                                        </Tooltip>

                                        {bday?.hasBirthday && (
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <span
                                                className="inline-flex items-center shrink-0 cursor-pointer select-none"
                                                onClick={(e) => e.stopPropagation()}
                                              >
                                                <Cake
                                                  className={cn(
                                                    "h-3.5 w-3.5 shrink-0 transition-transform hover:scale-115",
                                                    bday.isToday
                                                      ? "text-pink-500 fill-pink-500/20 animate-pulse"
                                                      : "text-sky-400 fill-sky-400/20"
                                                  )}
                                                />
                                              </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="text-xs">
                                              🎂 {bday.isToday ? `Hôm nay là sinh nhật em! (${bday.fullDob})` : `Sinh nhật trong tháng: ${bday.fullDob}`}
                                            </TooltipContent>
                                          </Tooltip>
                                        )}
                                      </div>
                                    )
                                  })()}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* 3. Liên hệ */}
                          <td
                            rowSpan={M}
                            className="align-top py-1.5 px-2.5 w-[160px] min-w-[150px] max-w-[175px] text-xs"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <ContactCell
                              name={parentDisplayName}
                              phone={parentPhone}
                              studentName={student.name}
                              masked={true}
                              className="gap-0.5"
                              nameClassName="text-xs font-normal leading-tight"
                              phoneClassName="text-xs font-normal leading-tight font-mono text-muted-foreground"
                              showPhoneIcon={false}
                              showCallButton={false}
                              showFamilyIcon={false}
                              additionalContacts={
                                familyContacts.length > 1
                                  ? familyContacts.map((c) => ({
                                      name: `${c.name} (${c.relationship})`,
                                      phone: c.phone,
                                    }))
                                  : undefined
                              }
                            />
                          </td>
                        </>
                      )}

                      {/* CHI TIẾT TỪNG LỚP HỌC (RENDER Ở MỖI DÒNG) */}

                      {/* 5. Gói đăng ký */}
                      <td className="align-top py-1.5 px-2.5 w-[160px] min-w-[145px] max-w-[185px] text-xs">
                        <div className="space-y-0.5 leading-tight max-w-[160px]">
                          {(() => {
                            const packageName = cls.linkedPackageName || student.packageName || cls.programName || 'Gói học'
                            return (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="font-normal text-foreground text-xs truncate cursor-help" title={packageName}>
                                    {packageName}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>{packageName}</TooltipContent>
                              </Tooltip>
                            )
                          })()}
                          <div className="text-xs text-muted-foreground font-normal leading-tight truncate">
                            {cls.progress}
                          </div>
                        </div>
                      </td>

                      {/* 6. Trình độ & Lớp học */}
                      <td className="align-top py-1.5 px-2.5 w-[155px] min-w-[140px] max-w-[175px] text-xs">
                        <div className="space-y-0.5 leading-tight max-w-[155px]">
                          {/* Dòng 1: Trình độ - Trình độ phụ của học viên (Nếu có) */}
                          {(() => {
                            const level = cls.level || student.level
                            const subLevel = cls.subLevel || student.subLevel
                            const hasSub = Boolean(subLevel && subLevel !== '-' && subLevel !== level)
                            const levelDisplay = hasSub ? `${level} - ${subLevel}` : (level || subLevel || '-')

                            return (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="font-normal text-foreground text-xs leading-tight truncate cursor-help" title={levelDisplay}>
                                    {levelDisplay}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>{levelDisplay}</TooltipContent>
                              </Tooltip>
                            )
                          })()}

                          {/* Dòng 2: Lớp ghép, chưa ghép lớp, hoặc lớp cũ đã ghép (hiển thị (N), nếu lớp ghép từ 2 lần trở lên ở trước mã lớp) */}
                          {(() => {
                            if (cls.classCode.startsWith('UNASSIGNED')) {
                              return (
                                <span className="text-xs font-normal text-muted-foreground italic leading-tight block truncate">
                                  Chưa ghép lớp
                                </span>
                              )
                            }

                            const attempt = getPlacementAttempt(student, cls)

                            return (
                              <div className="flex items-center gap-1 leading-tight max-w-[155px] truncate" onClick={(e) => e.stopPropagation()}>
                                {attempt > 1 && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="font-semibold text-amber-600 dark:text-amber-400 text-xs shrink-0 select-none cursor-help">
                                        ({attempt})
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>Lớp ghép lần {attempt}</TooltipContent>
                                  </Tooltip>
                                )}
                                <ClassCodeHoverCell
                                  classCode={cls.classCode}
                                  subject={cls.programName || 'IELTS'}
                                  level={cls.level || '5.0-5.5'}
                                  teacherCode={cls.teacherName}
                                  schedule={cls.scheduleSlots && cls.scheduleSlots.length > 0 ? `${cls.scheduleSlots[0]?.dayOfWeek} ${cls.scheduleSlots[0]?.startTime}` : 'T2/4/6 18:00–19:30'}
                                />
                              </div>
                            )
                          })()}
                        </div>
                      </td>

                      {/* 7. Buổi học bắt đầu */}
                      <td
                        className="align-top py-1.5 px-2.5 w-[175px] min-w-[160px] max-w-[195px] text-xs cursor-pointer"
                        onClick={() => onView(student.id)}
                      >
                        {(() => {
                          const isReserved = cls.status === 'reserve' || cls.status === 'paused' || student.status === 'reserve'
                          const isWaitingAssignment = cls.status === 'wait_for_assignment' || cls.classCode.startsWith('UNASSIGNED') || student.status === 'wait_for_assignment'

                          if (isReserved) {
                            return (
                              <div className="space-y-1 leading-tight" onClick={(e) => e.stopPropagation()}>
                                <div className="text-xs font-normal text-amber-600 dark:text-amber-400">
                                  Đang bảo lưu
                                </div>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  className="h-6 px-2 text-[11px] gap-1 font-normal border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                                  onClick={() => onEarlyReturn?.(student, cls)}
                                >
                                  <RotateCcw className="h-3 w-3" />
                                  <span>Đi học lại</span>
                                </Button>
                              </div>
                            )
                          }

                          if (isWaitingAssignment) {
                            const targetPkg = cls.linkedPackageName || student.packageName || cls.programName
                            return (
                              <div className="space-y-1 leading-tight" onClick={(e) => e.stopPropagation()}>
                                <div className="text-xs font-normal text-muted-foreground italic">
                                  Chưa có lịch
                                </div>
                                <Button
                                  variant="outline"
                                  size="xs"
                                  className="h-6 px-2 text-[11px] gap-1 font-normal border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                                  onClick={() => onAssignClass?.(student, targetPkg)}
                                >
                                  <UserPlus className="h-3 w-3" />
                                  <span>Ghép lớp</span>
                                </Button>
                              </div>
                            )
                          }

                          const lessonName = getLessonName(student, cls)

                          return (
                            <div className="space-y-0.5 leading-tight max-w-[175px]">
                              {/* Dòng 1 (Ở trên): Tên buổi học */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="font-normal text-foreground text-xs leading-tight truncate cursor-help" title={lessonName}>
                                    {lessonName}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>{lessonName}</TooltipContent>
                              </Tooltip>

                              {/* Dòng 2 (Ở dưới): Lịch học */}
                              <div className="w-fit leading-tight" onClick={(e) => e.stopPropagation()}>
                                <ClassSessionHoverCard
                                  session={{
                                    id: `sess-${cls.classCode}`,
                                    className: cls.className,
                                    classCode: cls.classCode,
                                    subject: cls.programName || 'Tiếng Anh',
                                    level: cls.level || 'IELTS',
                                    timeSlot: cls.scheduleSlots?.[0]?.startTime ? `${cls.scheduleSlots[0].startTime} - ${cls.scheduleSlots[0].endTime}` : '17:00 - 18:30',
                                    schoolRoom: cls.room || 'B201',
                                    branch: cls.branch || 'RinoEdu Nguyễn Tuân',
                                    teacherName: cls.teacherName || 'Thầy Hùng & Cô Mai',
                                    taName: 'Trần Văn Hoàng',
                                    totalStudents: 15,
                                    trialStudents: 2,
                                    status: 'scheduled',
                                  }}
                                  side="right"
                                >
                                  <span
                                    className="font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer inline-flex items-center gap-0.5 truncate leading-tight"
                                    title={`Lịch bắt đầu: ${formatNextSessionShort(cls)}`}
                                  >
                                    {formatNextSessionShort(cls)}
                                  </span>
                                </ClassSessionHoverCard>
                              </div>
                            </div>
                          )
                        })()}
                      </td>

                      {/* 8. Trạng thái (chỉ có trạng thái thôi) */}
                      <td className="align-top py-1.5 px-2 w-[110px] min-w-[100px] max-w-[120px] text-xs">
                        <StatusBadge
                          status={cls.status}
                          label={STUDENT_STATUS_LABELS[cls.status] ?? cls.status}
                          className="text-xs h-5 py-0 px-1.5 leading-none font-normal"
                        />
                      </td>
                    </tr>
                  )
                })
              })}
            </tbody>
          </table>
      </DataTableFrame>
    </TooltipProvider>
  )
}
