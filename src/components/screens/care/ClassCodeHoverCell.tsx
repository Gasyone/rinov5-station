'use client'

import { useMemo, useState } from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { mockClassRecords, CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import type { ClassRecord } from '@/mocks/classRecords'
import { Calendar, MapPin, Users, History, BookOpen, UserPlus } from 'lucide-react'
import { ClassesDetailDialog } from '../classes/detail/ClassesDetailDialog'
import { ClassTeacherHistoryPopover } from './ClassTeacherHistoryPopover'
import { SyllabusProfileHoverCard } from '../classes/SyllabusProfileHoverCard'
import { AppAvatar } from '@/components/shared/AppAvatar'
import { StatusBadge } from '@/components/shared'
import { PersonnelHoverCard } from '@/components/shared/PersonnelHoverCard'

interface ClassCodeHoverCellProps {
  classCode: string
  subject: string
  level: string
  teacherCode: string
  schedule: string
}

function getClassDetail(
  classCode: string,
  studentSubject?: string,
  studentLevel?: string,
  studentTeacher?: string,
  studentSchedule?: string
): ClassRecord {
  const found = mockClassRecords.find((c) => c.code === classCode)
  if (found) return found

  // Generate dynamic fallback
  const subjectName = studentSubject || 'Tiếng Anh'
  const levelName = studentLevel || 'Level'
  const teacherName = studentTeacher || 'GV'
  const scheduleStr = studentSchedule || 'T2/4/6 18:00–19:30'

  // Parse scheduleStr to create mock scheduleSlots
  const slots: ClassRecord['scheduleSlots'] = []
  if (scheduleStr.includes('18:00') || scheduleStr.includes('19:30') || scheduleStr.includes('T2/4/6') || scheduleStr.includes('Thứ')) {
    slots.push({ dayOfWeek: 'Thứ 2', date: '02/06', startTime: '18:00', endTime: '19:30' })
    slots.push({ dayOfWeek: 'Thứ 4', date: '04/06', startTime: '18:00', endTime: '19:30' })
    slots.push({ dayOfWeek: 'Thứ 6', date: '06/06', startTime: '18:00', endTime: '19:30' })
  } else {
    slots.push({ dayOfWeek: 'Thứ 4', date: '04/06', startTime: '17:30', endTime: '19:30' })
  }

  return {
    id: `dynamic-${classCode}`,
    code: classCode,
    name: `${subjectName} ${levelName}`,
    level: subjectName === 'Toán tư duy' ? 'MATH' : 'ENGLISH',
    branch: 'RinoEdu Linh Đàm',
    teacher: teacherName,
    teacherPhone: '0901234567',
    room: 'A101',
    schedule: scheduleStr,
    scheduleSlots: slots,
    startDate: '2026-05-01',
    endDate: '2026-08-01',
    maxStudents: 20,
    enrolledStudents: 15,
    status: 'dang_hoc',
    tuitionFee: 3000000,
    assistant: 'Giáo vụ Lan'
  }
}

export function ClassCodeHoverCell({ classCode, subject, level, teacherCode, schedule }: ClassCodeHoverCellProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const classDetail = useMemo(() => {
    return getClassDetail(classCode, subject, level, teacherCode, schedule)
  }, [classCode, subject, level, teacherCode, schedule])

  const teachers = useMemo(() => {
    return (classDetail.teacher || '').split(/[,/&]+/).map((t) => t.trim()).filter(Boolean)
  }, [classDetail.teacher])

  return (
    <>
      <HoverCard openDelay={100} closeDelay={150}>
        <HoverCardTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className="font-mono text-[10px] font-normal text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors inline-flex items-center text-left"
            onClick={(e) => {
              e.stopPropagation()
              setIsDetailOpen(true)
            }}
            title="Nhấp để xem hồ sơ chi tiết lớp học"
          >
            {classCode}
          </span>
        </HoverCardTrigger>
        <HoverCardContent 
          className="w-80 p-4 rounded-xl shadow-md border bg-popover text-popover-foreground z-50 text-left" 
          align="start"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="pb-2 border-b border-border/60">
              <div className="flex items-center justify-between gap-2 min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate max-w-[190px]" title={classDetail.name}>
                  {classDetail.name}
                </h4>
                <StatusBadge
                  status={classDetail.status}
                  label={CLASS_STATUS_LABELS[classDetail.status] || 'Đang học'}
                />
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-[9px] font-mono font-semibold uppercase tracking-wider">
                  {classDetail.code}
                </span>
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-md text-[9px] font-semibold">
                  {classDetail.level}
                </span>
              </div>
            </div>

            {/* Info fields with titles */}
            <div className="space-y-2.5 text-xs">
              {/* 1. Khung chương trình (KCT) - Có nhãn rõ ràng, hover hiện modal/card KCT */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground text-xs">Khung chương trình:</span>
                </div>
                <SyllabusProfileHoverCard cls={classDetail} align="start">
                  <span
                    role="button"
                    tabIndex={0}
                    className="font-semibold text-primary hover:underline cursor-pointer truncate max-w-[150px] text-right text-xs"
                    title="Rê chuột để xem hồ sơ Khung chương trình"
                  >
                    {classDetail.syllabus || 'IELTS Junior v2.1'}
                  </span>
                </SyllabusProfileHoverCard>
              </div>

              {/* 2. Lịch học */}
              <div className="space-y-1.5 border-t border-border/30 pt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>Lịch học:</span>
                </div>
                <div className="pl-5 space-y-1.5">
                  {classDetail.scheduleSlots && classDetail.scheduleSlots.length > 0 ? (
                    classDetail.scheduleSlots.map((slot, idx) => {
                      const slotTeacher = (slot.teachers && slot.teachers.length > 0)
                        ? slot.teachers[0]
                        : (teachers[idx % teachers.length] || teachers[0] || 'Cô Lan')

                      return (
                        <div key={idx} className="flex items-center justify-between gap-2 border-b border-border/20 last:border-b-0 pb-1 last:pb-0">
                          {/* Bên trái: Thứ + Thời gian ở dưới */}
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary w-fit">
                              {slot.dayOfWeek}
                            </span>
                            <span className="font-mono font-semibold text-foreground text-[11px]">
                              {slot.startTime}–{slot.endTime}
                            </span>
                          </div>

                          {/* Cạnh phải: Avatar + Tên giáo viên (có hover card PersonnelHoverCard) */}
                          <div className="flex items-center gap-1.5">
                            {(() => {
                              const teacherPersonObj = {
                                id: `EMP-${slotTeacher.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'CL'}`,
                                name: slotTeacher,
                                role: 'Giáo viên Tiếng Anh',
                                phone: '0901234567',
                                avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${slotTeacher}`,
                                email: `${slotTeacher.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
                              }
                              return (
                                <PersonnelHoverCard person={teacherPersonObj} align="end">
                                  <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity" title={`Rê chuột để xem thông tin giáo viên: ${slotTeacher}`}>
                                    <Avatar className="h-6 w-6 shrink-0 border border-primary/20 bg-primary/10 text-primary text-[8.5px] font-bold cursor-pointer">
                                      <AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${slotTeacher}`} alt={slotTeacher} />
                                      <AvatarFallback className="font-bold">
                                        {slotTeacher.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs font-semibold text-foreground truncate max-w-[100px] hover:underline">{slotTeacher}</span>
                                  </div>
                                </PersonnelHoverCard>
                              )
                            })()}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <span className="font-semibold text-foreground text-xs leading-none">
                      {classDetail.schedule || '—'}
                    </span>
                  )}

                  {/* Dưới góc trái nhóm thông tin lịch học: Text màu xanh "Lịch sử đổi 3 lần giáo viên" */}
                  <div className="pt-1.5 flex items-center justify-start">
                    <ClassTeacherHistoryPopover
                      currentTeacher={classDetail.teacher || 'Hoàng Thị Mai'}
                      trigger={
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer inline-flex items-center gap-1 text-left bg-transparent border-0 p-0"
                          title="Bấm để xem lịch sử phân công giáo viên"
                        >
                          <History className="h-3 w-3 shrink-0 text-sky-600 dark:text-sky-400" />
                          <span>Lịch sử đổi 3 lần giáo viên</span>
                        </button>
                      }
                    />
                  </div>
                </div>
              </div>

              {/* 3. Cơ sở & Phòng học (Tách thành 2 dòng không bị ẩn thông tin) */}
              <div className="space-y-1 border-t border-border/30 pt-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="font-semibold text-foreground text-xs">Cơ sở:</span>
                  </div>
                  <span className="font-semibold text-foreground text-xs text-right truncate max-w-[180px]">
                    {classDetail.branch || '—'}
                  </span>
                </div>
                {classDetail.room && (
                  <div className="flex items-center justify-between gap-2 pl-5">
                    <span className="text-muted-foreground text-[11px]">Phòng học:</span>
                    <span className="font-medium text-foreground text-xs">
                      Phòng {classDetail.room}
                    </span>
                  </div>
                )}
              </div>

              {/* 4. Sĩ số */}
              <div className="flex items-center justify-between gap-2 border-t border-border/30 pt-2">
                <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-semibold text-foreground text-xs">Sĩ số:</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-xs leading-none">
                    {classDetail.enrolledStudents}/{classDetail.maxStudents}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200/50 shrink-0">
                    +{classDetail.trialStudents || 2} mới, Trial
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full pt-2 border-t border-border/30 text-[10px] text-muted-foreground italic text-center hover:text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDetailOpen(true)
              }}
            >
              Nhấp để đi tới chi tiết lớp học
            </button>
          </div>
        </HoverCardContent>
      </HoverCard>

      <ClassesDetailDialog
        cls={classDetail}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </>
  )
}
