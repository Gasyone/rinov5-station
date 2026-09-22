'use client'

import { useMemo, useState } from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { mockClassRecords, CLASS_STATUS_LABELS } from '@/mocks/classRecords'
import type { ClassRecord } from '@/mocks/classRecords'
import { Calendar, MapPin, Users, History, BookOpen, ExternalLink, GraduationCap } from 'lucide-react'
import { ClassesDetailDialog } from '../classes/detail/ClassesDetailDialog'
import { ClassTeacherHistoryPopover } from './ClassTeacherHistoryPopover'
import { SyllabusProfileHoverCard } from '../classes/SyllabusProfileHoverCard'
import { StatusBadge } from '@/components/shared'
import { PersonnelHoverCard } from '@/components/shared/PersonnelHoverCard'

interface ClassCodeHoverCellProps {
  classCode: string
  subject: string
  level: string
  subLevel?: string
  teacherCode: string
  schedule: string
  openInNewTab?: boolean
}

function getClassDetail(
  classCode: string,
  studentSubject?: string,
  studentLevel?: string,
  studentTeacher?: string,
  studentSchedule?: string,
  studentSubLevel?: string
): ClassRecord {
  const found = mockClassRecords.find((c) => c.code === classCode)
  if (found) {
    if (studentSubLevel && !found.subLevel) {
      return { ...found, subLevel: studentSubLevel }
    }
    return found
  }

  // Generate dynamic fallback
  const subjectName = studentSubject || 'Tiếng Anh'
  const levelName = studentLevel || (subjectName === 'Toán tư duy' ? 'Toán 1:6' : 'IELTS')
  const teacherName = studentTeacher || 'GV'
  const scheduleStr = studentSchedule || 'T2/4/6 18:00–19:30'
  const subLevelName = studentSubLevel || (subjectName === 'Toán tư duy' ? 'A' : '5.0–5.5')

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
    level: levelName,
    subLevel: subLevelName,
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
    assistant: 'Trần Minh Châu',
    assistantPhone: '0905445566'
  }
}

export function ClassCodeHoverCell({
  classCode,
  subject,
  level,
  subLevel,
  teacherCode,
  schedule,
  openInNewTab = false,
}: ClassCodeHoverCellProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const classDetail = useMemo(() => {
    return getClassDetail(classCode, subject, level, teacherCode, schedule, subLevel)
  }, [classCode, subject, level, teacherCode, schedule, subLevel])

  const teachers = useMemo(() => {
    return (classDetail.teacher || '').split(/[,/&]+/).map((t) => t.trim()).filter(Boolean)
  }, [classDetail.teacher])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (openInNewTab) {
      window.open('/app/classes', '_blank')
    } else {
      setIsDetailOpen(true)
    }
  }

  return (
    <>
      <HoverCard openDelay={100} closeDelay={150}>
        <HoverCardTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className="font-mono text-xs font-normal text-sky-600 dark:text-sky-400 hover:underline cursor-pointer transition-colors inline-flex items-center gap-0.5 text-left"
            onClick={handleClick}
            title={openInNewTab ? "Xem hồ sơ chi tiết lớp học (Mở tab mới)" : "Nhấp để xem hồ sơ chi tiết lớp học"}
          >
            <span>{classCode}</span>
            {openInNewTab && <ExternalLink className="h-2.5 w-2.5 opacity-60 ml-0.5" />}
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
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-xs font-mono font-semibold uppercase tracking-wider">
                  {classDetail.code}
                </span>
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded-md text-xs font-semibold">
                  {classDetail.level}
                </span>
                {classDetail.subLevel && (
                  <span className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded-md text-xs font-semibold">
                    {classDetail.subLevel}
                  </span>
                )}
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

              {/* 2. Trình độ & Trình độ phụ (1 dòng: Trình độ: Trình độ X - Trình độ phụ Y) */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0 text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground text-xs">Trình độ:</span>
                </div>
                <span
                  className="font-semibold text-foreground text-right text-xs truncate max-w-[190px]"
                  title={
                    classDetail.level && classDetail.subLevel
                      ? `${classDetail.level} - ${classDetail.subLevel}`
                      : classDetail.level || classDetail.subLevel || '—'
                  }
                >
                  {classDetail.level && classDetail.subLevel
                    ? `${classDetail.level} - ${classDetail.subLevel}`
                    : classDetail.level || classDetail.subLevel || '—'}
                </span>
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

                      const slotAssistant = slot.assistantName
                        || classDetail.assistant
                        || (idx % 2 === 0 ? 'Trần Minh Châu' : 'Nguyễn Thu Hà')

                      const teacherPersonObj = {
                        id: `EMP-${slotTeacher.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'GV'}`,
                        name: slotTeacher,
                        role: classDetail.level === 'MATH' || classDetail.name?.toLowerCase().includes('toán') ? 'Giáo viên Toán' : 'Giáo viên Tiếng Anh',
                        phone: classDetail.teacherPhone || '0901234567',
                        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${slotTeacher}`,
                        email: `${slotTeacher.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
                      }

                      const assistantPersonObj = {
                        id: `EMP-${slotAssistant.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'TG'}`,
                        name: slotAssistant,
                        role: 'Trợ giảng',
                        phone: classDetail.assistantPhone || '0905445566',
                        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${slotAssistant}`,
                        email: `${slotAssistant.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
                      }

                      return (
                        <div key={idx} className="flex items-center justify-between gap-2 border-b border-border/20 last:border-b-0 pb-1.5 last:pb-0">
                          {/* Bên trái: Thứ + Thời gian ở dưới (Xóa viền, nền của thứ) */}
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className="text-xs font-semibold text-foreground">
                              {slot.dayOfWeek}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {slot.startTime}–{slot.endTime}
                            </span>
                          </div>

                          {/* Cạnh phải: Tên GV & TG ở dưới, xóa avatar (GV: ... TG: ...) */}
                          <div className="flex flex-col gap-0.5 text-xs text-left">
                            <PersonnelHoverCard person={teacherPersonObj} align="end">
                              <div
                                className="cursor-pointer hover:opacity-80 transition-opacity truncate max-w-[130px]"
                                title={`Rê chuột để xem thông tin giáo viên: ${slotTeacher}`}
                              >
                                <span className="text-muted-foreground font-medium">GV: </span>
                                <span className="font-semibold text-foreground hover:underline">{slotTeacher}</span>
                              </div>
                            </PersonnelHoverCard>

                            <PersonnelHoverCard person={assistantPersonObj} align="end">
                              <div
                                className="cursor-pointer hover:opacity-80 transition-opacity truncate max-w-[130px]"
                                title={`Rê chuột để xem thông tin trợ giảng: ${slotAssistant}`}
                              >
                                <span className="text-muted-foreground font-medium">TG: </span>
                                <span className="font-semibold text-foreground hover:underline">{slotAssistant}</span>
                              </div>
                            </PersonnelHoverCard>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="font-semibold text-foreground text-xs leading-none">
                        {classDetail.schedule || '—'}
                      </span>
                      {classDetail.teacher && (
                        <span className="text-xs text-muted-foreground">
                          <span>GV: </span>
                          <span className="font-semibold text-foreground">{classDetail.teacher}</span>
                        </span>
                      )}
                      {classDetail.assistant && (
                        <span className="text-xs text-muted-foreground">
                          <span>TG: </span>
                          <span className="font-semibold text-foreground">{classDetail.assistant}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Dưới góc trái nhóm thông tin lịch học: Text màu xanh "Lịch sử đổi 3 lần giáo viên" */}
                  <div className="pt-1.5 flex items-center justify-start">
                    <ClassTeacherHistoryPopover
                      currentTeacher={classDetail.teacher || 'Hoàng Thị Mai'}
                      trigger={
                        <button
                          type="button"
                          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer inline-flex items-center gap-1 text-left bg-transparent border-0 p-0"
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
                    <span className="text-muted-foreground text-xs">Phòng học:</span>
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
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200/50 shrink-0">
                    +{classDetail.trialStudents || 2} mới, Trial
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full pt-2 border-t border-border/30 text-xs text-muted-foreground italic text-center hover:text-primary hover:underline cursor-pointer bg-transparent border-none p-0 flex items-center justify-center gap-1"
              onClick={(e) => {
                e.preventDefault()
                handleClick(e)
              }}
            >
              <span>Nhấp để đi tới chi tiết lớp học {openInNewTab ? '(Mở tab mới)' : ''}</span>
              {openInNewTab && <ExternalLink className="h-2.5 w-2.5 inline opacity-70" />}
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
