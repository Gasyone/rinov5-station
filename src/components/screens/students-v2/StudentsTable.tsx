'use client'

import { useState, Fragment } from 'react'
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
import { EmptyState, StatusBadge, EntityCell, ContactCell } from '@/components/shared'
import { Eye, GraduationCap, Phone, Calendar, ChevronDown, ChevronRight, CornerDownRight, LifeBuoy } from 'lucide-react'
import type { Student, EnrolledClass } from '@/mocks/students'
import { getFamilyContacts } from '@/mocks/careAlerts'
import { STUDENT_STATUS_LABELS } from './studentTypes'
import { ScheduleSummary } from '@/components/screens/classes/ScheduleSummary'
import { Badge } from '@/components/ui/badge'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { useCallStore } from '@/stores/useCallStore'

interface StudentsTableProps {
  students: Student[]
  selectedIds: Set<string>
  onToggleAll: (checked: boolean, ids: string[]) => void
  onToggleOne: (id: string, checked: boolean) => void
  onView: (studentId: string) => void
  onCreateTicket: (studentId: string) => void
}

function getStudentStudyDuration(classes?: EnrolledClass[]) {
  if (!classes || classes.length === 0) return null
  
  let minStart: string | undefined
  let maxEnd: string | undefined
  
  classes.forEach((c) => {
    if (c.startDate) {
      if (!minStart || c.startDate < minStart) {
        minStart = c.startDate
      }
    }
    if (c.endDate) {
      if (!maxEnd || c.endDate > maxEnd) {
        maxEnd = c.endDate
      }
    }
  })
  
  return {
    startDate: minStart,
    endDate: maxEnd,
  }
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

  // Trạng thái mở rộng dòng học viên
  const [expandedStudentIds, setExpandedStudentIds] = useState<string[]>([])

  const toggleExpand = (studentId: string) => {
    setExpandedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    )
  }

  const initials = (name: string) => {
    if (!name) return ''
    return name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
  }

  return (
    <Table containerClassName="min-w-full overflow-visible" className="min-w-[1950px] align-top">
      <TableHeader>
        <TableRow className="border-b bg-muted hover:bg-muted">
          <TableHead className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-muted text-center border-r border-border/10">
            <Checkbox
              checked={isPageSelected}
              onCheckedChange={(checked) => onToggleAll(Boolean(checked), pageIds)}
            />
          </TableHead>
          <TableHead className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-muted border-r border-border/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Học viên</TableHead>
          <TableHead className="min-w-64">Liên hệ / GV phụ trách</TableHead>
          <TableHead className="min-w-60">Lớp học</TableHead>
          <TableHead className="min-w-52">Ngày sinh / Lịch học</TableHead>
          <TableHead className="min-w-44">Trạng thái</TableHead>
          <TableHead className="min-w-44">Trình độ & Sub level</TableHead>
          <TableHead className="min-w-60">Ghi danh (Lớp/Môn)</TableHead>
          <TableHead className="min-w-44">Thời gian học</TableHead>
          <TableHead className="min-w-56">Trường & Phòng học</TableHead>
          <TableHead className="min-w-72">Lộ trình & Khung chương trình</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.length === 0 ? (
          <TableRow className="border-b-0">
            <TableCell colSpan={11} className="h-48 text-center">
              <EmptyState
                icon={<GraduationCap className="h-7 w-7 text-muted-foreground" />}
                title="Không có học viên nào"
                description="Điều chỉnh tìm kiếm hoặc bộ lọc, hoặc thêm học viên mới."
                className="py-10"
              />
            </TableCell>
          </TableRow>
        ) : (
          students.map((student) => {
            const isExpanded = expandedStudentIds.includes(student.id)
            const classesCount = student.enrolledClasses?.length || 0
            const activeClassesCount = student.enrolledClasses?.filter(c => c.status === 'active').length || 0
            const familyContacts = getFamilyContacts(student.id, student.name)

            return (
              <Fragment key={student.id}>
                {/* DÒNG CHA (HỌC VIÊN) */}
                <TableRow className="group cursor-pointer border-b-0 hover:bg-muted transition-colors">
                  <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-white dark:bg-zinc-950 text-center group-hover:bg-muted border-r border-border/10">
                    <Checkbox
                      checked={selectedIds.has(student.id)}
                      onCheckedChange={(checked) => onToggleOne(student.id, Boolean(checked))}
                    />
                  </TableCell>
                  <TableCell 
                    className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-white dark:bg-zinc-950 group-hover:bg-muted border-r border-border/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
                    onClick={() => toggleExpand(student.id)}
                  >
                    <div className="relative z-10 max-w-full overflow-hidden pr-20">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpand(student.id)
                          }}
                          className="h-5 w-5 p-0 hover:bg-muted shrink-0 mr-1"
                        >
                          {classesCount > 0 ? (
                            isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )
                          ) : (
                            <span className="w-4 h-4 block" />
                          )}
                        </Button>

                        <EntityCell name={student.name} supporting={`STU-00${student.id.replace('s', '')}`} />
                      </div>

                      <div
                        className="absolute right-1 top-1/2 hidden -translate-y-1/2 items-center gap-1 group-hover:flex"
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

                  {/* LIÊN HỆ */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    <ContactCell
                      name={student.parentName}
                      phone={student.parentPhone}
                      studentId={student.id}
                      studentName={student.name}
                      masked={true}
                      additionalContacts={familyContacts.length > 1 ? familyContacts : undefined}
                    />
                  </TableCell>

                  {/* LỚP HỌC (Để trống ở dòng học viên) */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    <span className="text-muted-foreground/30 font-mono text-[10px]">-</span>
                  </TableCell>

                  {/* NGÀY SINH / LỊCH HỌC */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    <div className="flex items-center gap-1.5 text-xs text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {new Date(student.dob).toLocaleDateString('vi-VN')}
                    </div>
                  </TableCell>

                  {/* TRẠNG THÁI */}
                  <TableCell onClick={() => onView(student.id)}>
                    <StatusBadge status={student.status} label={STUDENT_STATUS_LABELS[student.status] ?? student.status} />
                  </TableCell>

                  {/* TRÌNH ĐỘ & SUB LEVEL */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    <div className="font-semibold text-foreground text-xs">{student.level || '-'}</div>
                    <div className="text-[9px] text-muted-foreground">{student.subLevel || '-'}</div>
                  </TableCell>

                  {/* GHI DANH LỚP TỔNG QUÁT */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    {activeClassesCount > 0 ? (
                      <Badge variant="secondary" className="font-semibold text-[10px] bg-primary/10 text-primary hover:bg-primary/20 border-transparent">
                        {activeClassesCount} lớp đang học
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/30 font-mono text-[10px]">-</span>
                    )}
                  </TableCell>

                  {/* THỜI GIAN HỌC */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    {(() => {
                      const duration = getStudentStudyDuration(student.enrolledClasses)
                      if (!duration || (!duration.startDate && !duration.endDate)) {
                        return <span className="text-muted-foreground/30 font-mono text-[10px]">-</span>
                      }
                      return (
                        <>
                          <div className="text-[10px] text-foreground font-medium">
                            Từ: {duration.startDate ? new Date(duration.startDate).toLocaleDateString('vi-VN') : '-'}
                          </div>
                          <div className="text-[9px] text-muted-foreground">
                            Đến: {duration.endDate ? new Date(duration.endDate).toLocaleDateString('vi-VN') : '-'}
                          </div>
                        </>
                      )
                    })()}
                  </TableCell>

                  {/* TRƯỜNG & PHÒNG HỌC (Để trống ở dòng học viên) */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    <span className="text-muted-foreground/30 font-mono text-[10px]">-</span>
                  </TableCell>

                  {/* LỘ TRÌNH & KHUNG CHƯƠNG TRÌNH (Để trống ở dòng học viên) */}
                  <TableCell onClick={() => toggleExpand(student.id)}>
                    <span className="text-muted-foreground/30 font-mono text-[10px]">-</span>
                  </TableCell>
                </TableRow>

                {/* DÒNG CON (CHI TIẾT CÁC LỚP HỌC KHI MỞ RỘNG) */}
                {isExpanded && classesCount > 0 && (
                  student.enrolledClasses?.map((cls) => (
                    <TableRow 
                      key={cls.classCode}
                      className="text-[11px] bg-zinc-50/70 dark:bg-zinc-900/60 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 border-b border-border/40 border-l border-l-border/80 transition-colors"
                      onClick={() => onView(student.id)}
                    >
                      {/* Checkbox trống (Sticky để giữ thẳng cột) */}
                      <TableCell className="sticky left-0 z-30 w-12 min-w-12 max-w-12 bg-zinc-50 dark:bg-zinc-900 text-center py-2 border-r border-border/10" onClick={(e) => e.stopPropagation()} />

                      <TableCell className="sticky left-12 z-20 w-80 min-w-80 max-w-80 bg-zinc-50 dark:bg-zinc-900 group-hover:bg-muted pl-6 py-2 border-r border-border/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        <div className="flex items-center gap-2">
                          <CornerDownRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                          <div className="flex flex-col">
                            <div className="font-semibold text-foreground text-xs">{cls.programName || 'Chương trình học'}</div>
                            <div className="text-[10px] text-muted-foreground font-medium">
                              {(() => {
                                const match = cls.progress.match(/\/ (\d+ buổi)/)
                                return match ? match[1] : '24 buổi'
                              })()}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-2" />

                      {/* Lớp học và Mã lớp */}
                      <TableCell className="py-2">
                        <div className="font-semibold text-foreground text-xs">{cls.className}</div>
                        <div className="text-[9px] text-primary font-semibold font-mono">{cls.classCode}</div>
                      </TableCell>

                      <TableCell className="py-2">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary" title={cls.teacherName}>
                            {initials(cls.teacherName)}
                          </div>
                          <span className="text-xs font-medium text-foreground">{cls.teacherName}</span>
                        </div>
                      </TableCell>

                      {/* Lịch học */}
                      <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
                        <ScheduleSummary scheduleSlots={cls.scheduleSlots} className={cls.className} />
                      </TableCell>

                      {/* Trạng thái lớp */}
                      <TableCell className="py-2">
                        <StatusBadge status={cls.status} label={cls.status === 'active' ? 'Đang học' : cls.status === 'session_ended' ? 'Hết buổi' : cls.status === 'pending_transfer' ? 'Chờ chuyển' : 'Không hoạt động'} />
                      </TableCell>

                      {/* Trình độ lớp sub-row */}
                      <TableCell className="py-2">
                        <div className="font-medium text-foreground text-xs">{cls.level || '-'}</div>
                        <div className="text-[9px] text-muted-foreground">{cls.subLevel || '-'}</div>
                      </TableCell>

                      {/* Phân loại lớp / Ghi danh (Lớp/Môn) */}
                      <TableCell className="py-2">
                        <div className="flex flex-col gap-1 items-start">
                          <Badge variant="outline" className={`font-semibold px-1.5 py-0.5 rounded text-[9px] uppercase ${getStatusBadgeClass(cls.type)}`}>
                            {cls.type === 'offline' ? 'Offline' : 'Online Tutor'}
                          </Badge>
                          <div className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                            Đã học: <span className="font-semibold text-foreground">{cls.progress}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Thời gian học lớp sub-row */}
                      <TableCell className="py-2">
                        <div className="text-[10px] text-foreground font-medium">
                          Từ: {cls.startDate ? new Date(cls.startDate).toLocaleDateString('vi-VN') : '-'}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          Đến: {cls.endDate ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '-'}
                        </div>
                      </TableCell>

                      {/* Trường & phòng học lớp sub-row */}
                      <TableCell className="py-2">
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

                      {/* Chương trình & Mã lộ trình lớp sub-row */}
                      <TableCell className="py-2">
                        <div className="text-xs font-medium text-foreground line-clamp-1 max-w-[200px]" title={cls.programName}>
                          {cls.programName || '-'}
                        </div>
                        <div className="text-[9px] text-primary font-semibold font-mono" title={cls.pathCode}>
                          {cls.pathCode || '-'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </Fragment>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}
