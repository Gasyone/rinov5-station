'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState, StatusBadge, EntityCell, ContactCell, PersonnelCell } from '@/components/shared'
import { Eye, GraduationCap, Phone, Calendar, LifeBuoy, Users } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Student, EnrolledClass } from '@/mocks/students'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { STUDENT_STATUS_LABELS } from './studentTypes'
import { ScheduleSummary } from '@/components/screens/classes/ScheduleSummary'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { useCallStore } from '@/stores/useCallStore'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { ClassSessionHoverCard } from '@/components/screens/calendar/ClassSessionHoverCard'
import { cn } from '@/lib/utils'

interface StudentsTableProps {
  students: Student[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onView: (studentId: string) => void
  onCreateTicket: (studentId: string) => void
}



export function StudentsTable({
  students,
  selectedIds,
  onToggleAll,
  onToggleOne,
  onView,
  onCreateTicket,
}: StudentsTableProps) {
  const pageIds = students.map((s) => s.id)
  const isPageSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))

  const initials = (name: string) => {
    if (!name) return ''
    return name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
  }

  const getAge = (dobString: string) => {
    if (!dobString) return 0
    const birthDate = new Date(dobString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return Math.max(0, age)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Table containerClassName="w-full overflow-x-visible" className="min-w-[1900px] align-top">
      <TableHeader>
        <TableRow className="border-b bg-muted hover:bg-muted">
          <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted text-center">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          <TableHead className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-muted border-r border-border/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Học viên</TableHead>
          <TableHead className="min-w-56">Liên hệ</TableHead>
          <TableHead className="min-w-40">Ngày sinh / Tuổi</TableHead>
          <TableHead className="min-w-64">Gói đăng ký</TableHead>
          <TableHead className="min-w-40">Trình độ học viên</TableHead>
          <TableHead className="min-w-60">Lớp học</TableHead>
          <TableHead className="min-w-48">GV phụ trách</TableHead>
          <TableHead className="min-w-36">Trạng thái</TableHead>
          <TableHead className="min-w-56">Trường & Phòng học</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={10} className="h-48 text-center">
              <EmptyState
                icon={<GraduationCap className="h-7 w-7 text-muted-foreground" />}
                title="Không có học viên nào"
                description="Điều chỉnh tìm kiếm hoặc bộ lọc, hoặc thêm học viên mới."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          students.flatMap((student, studentIdx) => {
            const familyContacts = getFamilyContacts(student.id, student.name)

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
            const isEven = studentIdx % 2 === 0
            const rowBgClass = isEven ? "bg-white dark:bg-zinc-950" : "bg-zinc-50 dark:bg-zinc-900"

            return subRows.map((cls, idx) => {
              const isFirstRow = idx === 0
              const isLastRow = idx === M - 1
              
              // Visual separator logic: solid border for the last row of the student, dashed border for intermediate rows.
              const borderClass = isLastRow 
                ? "border-b border-border" 
                : "border-b border-dashed border-border/30"

              return (
                <TableRow
                  key={`${student.id}-${cls.classCode}`}
                  className={cn(
                    "group transition-colors align-top hover:bg-muted/40",
                    rowBgClass,
                    borderClass
                  )}
                >
                  {/* DÒNG HỌC VIÊN (GỘP - CHỈ HIỂN THỊ Ở DÒNG ĐẦU TIÊN) */}
                  {isFirstRow && (
                    <>
                      {/* 1. Checkbox */}
                      <TableCell 
                        rowSpan={M} 
                        className={cn(
                          "sticky left-0 z-30 w-12 min-w-12 max-w-12 text-center align-top pt-3",
                          rowBgClass
                        )}
                      >
                        <Checkbox
                          checked={selectedIds.has(student.id)}
                          onCheckedChange={(checked) => onToggleOne(student.id, Boolean(checked))}
                        />
                      </TableCell>

                      {/* 2. Học viên */}
                      <TableCell
                        rowSpan={M}
                        className={cn(
                          "sticky left-12 z-20 w-80 min-w-80 max-w-80 border-r border-border/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] align-top pt-3 cursor-pointer",
                          rowBgClass
                        )}
                        onClick={() => onView(student.id)}
                      >
                        <div className="relative z-10 max-w-full overflow-hidden pr-20">
                          <EntityCell name={student.name} supporting={`STU-00${student.id.replace('s', '')}`} />

                          <div
                            className="absolute right-1 top-1/2 -translate-y-1/2 items-center gap-1 hidden group-hover:flex"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Xem hồ sơ"
                              onClick={() => onView(student.id)}
                              className="bg-transparent shadow-none hover:bg-transparent"
                            >
                              <Eye className="h-4 w-4 text-primary" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Tạo yêu cầu hỗ trợ"
                              onClick={() => onCreateTicket(student.id)}
                              className="bg-transparent shadow-none hover:bg-transparent text-amber-500 hover:text-amber-600"
                            >
                              <LifeBuoy className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon-sm"
                              title="Gọi điện cho phụ huynh"
                              onClick={() =>
                                useCallStore.getState().startCall({
                                  studentId: student.id,
                                  studentName: student.name,
                                  parentPhone: student.parentPhone || '0987654321',
                                  parentName: student.parentName || `Phụ huynh em ${student.name}`,
                                })
                              }
                              className="bg-transparent shadow-none hover:bg-transparent text-emerald-600 hover:text-emerald-700"
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>

                      {/* 3. Liên hệ */}
                      <TableCell rowSpan={M} className="align-top pt-3">
                        <ContactCell
                          name={student.parentName}
                          phone={student.parentPhone}
                          studentId={student.id}
                          studentName={student.name}
                          masked={true}
                          additionalContacts={familyContacts.length > 1 ? familyContacts : undefined}
                        />
                      </TableCell>

                      {/* 4. Ngày sinh / Tuổi */}
                      <TableCell rowSpan={M} className="align-top pt-3">
                        <div className="flex flex-col gap-0.5 items-start">
                          <div className="text-xs font-semibold text-muted-foreground/80">
                            {student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'}
                            {student.dob ? ` · ${getAge(student.dob)} tuổi` : ''}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-foreground">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            {new Date(student.dob).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </TableCell>

                    </>
                  )}

                  {/* CHI TIẾT TỪNG LỚP HỌC (RENDER Ở MỖI DÒNG) */}
                  
                  {/* 5. Gói đăng ký */}
                  <TableCell className="align-top py-2.5">
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground text-xs">{cls.programName || 'Chương trình học'}</div>
                      <div className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                        Đã học: <span className="font-semibold text-foreground">{cls.progress}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 6. Trình độ (per-class row) */}
                  <TableCell className="align-top py-2.5">
                    <div className="font-semibold text-foreground text-xs">{cls.level || '-'}</div>
                    <div className="text-[9px] text-muted-foreground">{cls.subLevel || '-'}</div>
                  </TableCell>

                  {/* 7. Lớp học (Chuyển lên trước GV phụ trách) */}
                  <TableCell className="align-top py-2.5 cursor-pointer" onClick={() => onView(student.id)}>
                    {cls.classCode.startsWith('UNASSIGNED') ? (
                      <span className="text-muted-foreground font-medium text-xs">Chưa xếp lớp</span>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-foreground text-xs">{cls.className}</span>
                          <Badge variant="outline" className={`font-semibold px-1 py-0 rounded text-[8px] uppercase shrink-0 ${getStatusBadgeClass(cls.type)}`}>
                            {cls.type === 'offline' || cls.type === 'station' ? 'Station' : 'Online Tutor'}
                          </Badge>
                        </div>
                        <div className="w-fit" onClick={(e) => e.stopPropagation()}>
                          <ClassCodeHoverCell
                            classCode={cls.classCode}
                            subject={cls.programName || 'IELTS'}
                            level={cls.level || '5.0-5.5'}
                            teacherCode={cls.teacherName}
                            schedule={cls.scheduleSlots && cls.scheduleSlots.length > 0 ? `${cls.scheduleSlots[0]?.dayOfWeek} ${cls.scheduleSlots[0]?.startTime}` : 'T2/4/6 18:00–19:30'}
                          />
                        </div>
                      </>
                    )}
                  </TableCell>

                  {/* 8. GV phụ trách */}
                  <TableCell className="align-top py-2.5">
                    <div className="flex flex-col gap-1 py-0.5" onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        if (!cls.teacherName || cls.teacherName === '-') {
                          return <span className="text-muted-foreground/50">-</span>
                        }
                        
                        const teacherNames = cls.teacherName.split(/[,/&]| và /).map((t) => t.trim()).filter(Boolean)
                        
                        const allTeachers = teacherNames.map((name, index) => {
                          const isSubstitute = index > 0
                          return {
                            name,
                            role: isSubstitute ? `GV dạy thay (0${index + 3}/06)` : 'CS',
                            isSubstitute,
                            phone: '',
                            date: isSubstitute ? `0${index + 3}/06` : '',
                            reason: isSubstitute ? 'Dạy thay theo lịch' : '',
                          }
                        })

                        if (allTeachers.length === 0) {
                          return <span className="text-muted-foreground/50">-</span>
                        }

                        if (allTeachers.length <= 2) {
                          return allTeachers.map((t, idx) => (
                            <PersonnelCell
                              key={idx}
                              items={[{ ...t, role: undefined }]}
                              size="sm"
                              mode="single"
                            />
                          ))
                        }

                        // Nếu từ 3 trở lên
                        return (
                          <>
                            {/* Teacher 1 with Popover Trigger */}
                            <div className="flex items-center gap-1.5 min-w-0">
                              <PersonnelCell
                                items={[{ ...allTeachers[0], role: undefined }]}
                                size="sm"
                                mode="single"
                                className="flex-1 min-w-0"
                              />
                              <Popover>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 w-5 p-0 text-muted-foreground hover:text-foreground shrink-0"
                                      >
                                        <Users className="h-3.5 w-3.5" />
                                      </Button>
                                    </PopoverTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>Xem danh sách giáo viên</TooltipContent>
                                </Tooltip>
                                <PopoverContent className="w-64 p-0" align="start">
                                  <div className="px-3 py-2 border-b bg-muted/30">
                                    <h4 className="text-[10px] font-bold text-muted-foreground uppercase">
                                      Danh sách giáo viên ({allTeachers.length})
                                    </h4>
                                  </div>
                                  <div className="p-2 space-y-1.5 max-h-[240px] overflow-y-auto">
                                    {allTeachers.map((t, idx) => (
                                      <div key={idx} className="flex items-center gap-2 rounded-lg p-1 hover:bg-muted/50">
                                        <PersonnelCell
                                          items={[t]}
                                          size="sm"
                                          mode="single"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            {/* Teacher 2 */}
                            <PersonnelCell
                              items={[{ ...allTeachers[1], role: undefined }]}
                              size="sm"
                              mode="single"
                            />
                          </>
                        )
                      })()}
                    </div>
                  </TableCell>

                  {/* 9. Trạng thái (per-class row) */}
                  <TableCell className="align-top py-2.5">
                    <div className="flex flex-col gap-1 items-start">
                      <StatusBadge status={cls.status} label={STUDENT_STATUS_LABELS[cls.status] ?? cls.status} />
                      
                      {cls.status !== 'dropped' && cls.status !== 'session_ended' && (
                        <ClassSessionHoverCard
                          session={{
                            id: `sess-${cls.classCode}`,
                            className: cls.className,
                            classCode: cls.classCode,
                            subject: cls.programName || 'Tiếng Anh',
                            level: cls.level || 'IELTS',
                            timeSlot: '17:00 - 18:30',
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
                          <span className="text-[10px] text-muted-foreground hover:text-primary hover:underline cursor-pointer font-medium inline-flex items-center gap-0.5 whitespace-nowrap">
                            Buổi ghép: <span className="font-semibold text-sky-600 dark:text-sky-400 font-mono">{cls.nextLessonDate && cls.nextLessonDate !== '-' ? (cls.nextLessonDate.includes('(') ? cls.nextLessonDate.replace(/Thứ\s+[^\s,]+,\s*/gi, '') : `${cls.nextLessonDate} (18:00 - 20:00)`) : '04/06 (18:00 - 20:00)'}</span>
                          </span>
                        </ClassSessionHoverCard>
                      )}
                    </div>
                  </TableCell>

                  {/* 10. Trường & Phòng học */}
                  <TableCell className="align-top py-2.5">
                    {cls.type === 'online_tutor' ? (
                      <div className="text-muted-foreground text-xs">-</div>
                    ) : (
                      <>
                        <div className="text-xs font-semibold text-foreground line-clamp-1 max-w-[160px]" title={cls.branch}>
                          {cls.branch || '-'}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                          Phòng: {cls.room || '-'}
                        </div>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )
            })
          })
        )}
      </TableBody>
    </Table>
    </TooltipProvider>
  )
}
