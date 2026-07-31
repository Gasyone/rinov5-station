'use client'

import { useState } from 'react'
import {
  User,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  Star,
} from 'lucide-react'
import {
  StatusBadge,
  AppAvatar,
  StudentProfileHoverCard,
  PersonnelHoverCard,
  type StudentProfileItem,
} from '@/components/shared'
import { cn } from '@/lib/utils'
import { type ClassRecord } from '@/mocks/classRecords'
import type { EnrolledClass } from '@/mocks/students'
import { ClassTeacherHistoryPopover } from '@/components/screens/care/ClassTeacherHistoryPopover'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { SyllabusProfileHoverCard } from '@/components/screens/classes/SyllabusProfileHoverCard'
import { getClassPerformance } from './studentDetailClassesHelpers'

export interface StudentDetailClassCardProps {
  cls: EnrolledClass
  classRecord: ClassRecord | null
  studentLevel?: string
  studentBranch?: string
  onSelectClassRecord: (record: ClassRecord, tab?: string) => void
}

export function StudentDetailClassCard({
  cls,
  classRecord,
  studentLevel,
  studentBranch,
  onSelectClassRecord,
}: StudentDetailClassCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const classStatus = classRecord
    ? classRecord.status
    : cls.status === 'dropped'
    ? 'huy'
    : cls.status === 'session_ended'
    ? 'huy'
    : cls.status === 'paused'
    ? 'tam_dung'
    : cls.status === 'wait_for_assignment'
    ? 'cho_khai_giang'
    : cls.status === 'pending_transfer'
    ? 'tam_dung'
    : 'dang_hoc'

  const isClassInactive =
    classStatus === 'tam_dung' ||
    classStatus === 'huy' ||
    cls.status === 'dropped' ||
    cls.status === 'session_ended'

  const classStatusLabel = (() => {
    switch (classStatus) {
      case 'nhap':
        return 'Nháp'
      case 'mo_chieu_sinh':
        return 'Mở chiêu sinh'
      case 'cho_khai_giang':
        return 'Chờ khai giảng'
      case 'dang_hoc':
        return 'Đang học'
      case 'tam_dung':
        return 'Tạm nghỉ'
      case 'huy':
        return 'Đã kết thúc'
      default:
        return 'Không rõ'
    }
  })()

  const record = classRecord
  const enrolled = record?.enrolledStudents || 15
  const max = record?.maxStudents || 20
  const pct = max > 0 ? Math.round((enrolled / max) * 100) : 0
  const newCount = record?.trialStudents || 2

  const studentList = [
    'Nguyễn An',
    'Trần Bình',
    'Lê Chi',
    'Phạm Dũng',
    'Trần Tuấn',
    'Đặng Hồng',
    'Nguyễn Hoàng',
    'Trương Bảo',
    'Lê Minh',
    'Phạm Quỳnh',
  ]
  const displayAvatars = studentList.slice(0, 5)
  const remaining = enrolled > 5 ? enrolled - 5 : 0

  const teacherList =
    cls.teacherName && cls.teacherName !== '—'
      ? cls.teacherName.split(/[,/&]| và /).map((t) => t.trim()).filter(Boolean)
      : []

  const teacherHistoryList = [
    { name: teacherList[0] || 'Cô Lan', role: 'Chủ nhiệm', startDate: '01/05/2026', isCurrent: true },
    { name: teacherList[1] || 'Cô Nga', role: 'Giảng dạy', startDate: '01/05/2026', isCurrent: true },
    { name: 'Thầy Hùng', role: 'GV cũ', startDate: '01/01/2026', endDate: '30/04/2026', reason: 'Chuyển ca dạy', isCurrent: false },
  ]

  const historyTrigger = (
    <span
      role="button"
      tabIndex={0}
      className="px-1.5 py-0.5 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/40 rounded transition-all cursor-pointer flex items-center gap-1 text-[10px] font-medium shrink-0"
      title={`Xem lịch sử đổi giáo viên (${teacherHistoryList.length} giáo viên)`}
    >
      <History className="h-3 w-3" />
      <span>Lịch sử GV ({teacherHistoryList.length})</span>
    </span>
  )

  const upcomingList = [
    { no: 14, date: '28/07/2026', time: '17:45 - 19:15', topic: 'Bài 14: Reading Skills Practice', room: 'A101', teacher: 'Cô Lan', label: 'Hôm nay / Sắp tới' },
    { no: 15, date: '30/07/2026', time: '17:45 - 19:15', topic: 'Bài 15: Listening & Speaking Drills', room: 'A101', teacher: 'Cô Nga', label: 'Sắp diễn ra' },
    { no: 16, date: '01/08/2026', time: '17:45 - 19:15', topic: 'Bài 16: Writing Task 1 Strategy', room: 'A101', teacher: 'Cô Lan', label: 'Sắp diễn ra' },
    { no: 17, date: '04/08/2026', time: '17:45 - 19:15', topic: 'Bài 17: Grammar & Collocations', room: 'A101', teacher: 'Cô Lan', label: 'Sắp diễn ra' },
    { no: 18, date: '06/08/2026', time: '17:45 - 19:15', topic: 'Bài 18: Mid-term Assessment', room: 'A101', teacher: 'Cô Nga', label: 'Sắp diễn ra' },
  ]

  const syllabusRecord: ClassRecord = classRecord || {
    id: cls.classCode,
    code: cls.classCode,
    name: cls.className,
    level: cls.level || 'IELTS',
    subLevel: cls.subLevel || '5.0-5.5',
    syllabus: cls.curriculumName || 'IELTS Junior v2.1',
    learningPath: 'IELTS Foundation → Academic',
    branch: cls.branch || studentBranch || 'RinoEdu Nguyễn Tuân',
    teacher: cls.teacherName,
    teacherPhone: '0901234567',
    room: cls.room || 'A101',
    schedule: 'Thứ 2, Thứ 4, Thứ 6 (18:00 - 19:30)',
    scheduleSlots: cls.scheduleSlots || [],
    startDate: cls.startDate || '2026-05-01',
    endDate: cls.endDate || '2026-08-01',
    maxStudents: 15,
    enrolledStudents: 12,
    status: 'dang_hoc',
    tuitionFee: 3500000,
  }

  const perf = getClassPerformance(cls.classCode)
  const attendanceNum = parseFloat(perf.attendanceRate) || 0
  const hwNum = parseFloat(perf.homeworkSubmissionRate) || 0

  return (
    <div
      className={cn(
        'border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs transition-all duration-200 hover:border-border',
        isClassInactive && 'opacity-60 bg-muted/20'
      )}
    >
      {/* Card Header: Minimalist & Clean */}
      <div className="border-b border-border/40 px-4 py-3 bg-muted/10 dark:bg-zinc-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          {/* Left: Class Name, Status, Code & Metadata */}
          <div className="flex flex-col min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-bold text-foreground text-sm sm:text-base truncate max-w-[280px]">
                {cls.className}
              </span>
              <StatusBadge status={classStatus} label={classStatusLabel} />
              {isClassInactive && (
                <span className="text-[10px] text-muted-foreground italic font-medium">
                  {cls.status === 'dropped' || cls.status === 'session_ended'
                    ? '(Đã thoát lớp)'
                    : '(Lớp đã nghỉ/kết thúc)'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap min-w-0 text-xs text-muted-foreground">
              <div className="w-fit">
                <ClassCodeHoverCell
                  classCode={cls.classCode}
                  subject={cls.level || 'IELTS'}
                  level={cls.subLevel || '5.0-5.5'}
                  teacherCode={cls.teacherName}
                  schedule={
                    cls.scheduleSlots && cls.scheduleSlots.length > 0
                      ? `${cls.scheduleSlots[0]?.dayOfWeek} ${cls.scheduleSlots[0]?.startTime}`
                      : 'T2/4/6 18:00–19:30'
                  }
                />
              </div>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-xs text-muted-foreground font-normal truncate">
                {cls.level || 'IELTS'} {cls.subLevel ? `- ${cls.subLevel}` : ''}
                {(cls.level?.toLowerCase().includes('math') ||
                  cls.level?.toLowerCase().includes('toán') ||
                  classRecord?.grade) && (
                  <span> • {classRecord?.grade || 'Lớp 6'}</span>
                )}
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-xs text-muted-foreground font-normal">
                Loại lớp: {classRecord?.classRatio || '1:7'}
              </span>
            </div>
          </div>

          {/* Right: Sleek Metrics Strip */}
          <div className="shrink-0 pt-1 sm:pt-0">
            <div className="flex items-center gap-3 bg-muted/40 dark:bg-zinc-800/40 px-3 py-1.5 rounded-lg border border-border/30">
              <div className="text-center space-y-0.5 min-w-[55px]">
                <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">Chuyên cần</div>
                <div className="text-xs font-bold text-foreground">
                  {attendanceNum > 0 ? `${attendanceNum}%` : '—'}
                </div>
              </div>
              <div className="h-5 w-[1px] bg-border/40" />
              <div className="text-center space-y-0.5 min-w-[45px]">
                <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">BTVN</div>
                <div className="text-xs font-bold text-foreground">
                  {hwNum > 0 ? `${hwNum}%` : '—'}
                </div>
              </div>
              <div className="h-5 w-[1px] bg-border/40" />
              <div className="text-center space-y-0.5 min-w-[55px]">
                <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">Điểm TB</div>
                <div className="text-xs font-bold text-foreground">
                  {perf.latestScore.score !== '—' ? (
                    <>
                      {perf.latestScore.score}
                      <span className="text-[9.5px] font-normal text-muted-foreground">/10</span>
                    </>
                  ) : (
                    '—'
                  )}
                </div>
              </div>
              <div className="h-5 w-[1px] bg-border/40" />
              <div className="text-center space-y-0.5 min-w-[45px]">
                <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">Rating</div>
                <div className="text-xs font-bold text-foreground flex items-center justify-center gap-0.5">
                  4.5
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500 inline" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-12 gap-2 items-center py-0.5">
          {/* Cột 1: SĨ SỐ (Căn trái - col-span-5) */}
          <div className="col-span-12 sm:col-span-5 space-y-1.5 flex flex-col justify-center text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                {enrolled}/{max} <span className="text-muted-foreground font-normal text-[11px]">({pct}%)</span>
              </span>
              <span className="text-[9.5px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200/50 shrink-0">
                +{newCount} mới, Trial
              </span>
            </div>

            <div className="h-1.5 rounded-full bg-muted overflow-hidden w-full max-w-[200px]">
              <div
                className="h-full rounded-full bg-primary/80 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex items-center justify-between w-full max-w-[220px] pt-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {displayAvatars.map((sName, sIdx) => {
                  const studentItem: StudentProfileItem = {
                    id: `stu-enrolled-${sIdx + 1}`,
                    name: sName,
                    code: `STU-2026-00${sIdx + 1}`,
                    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${sName}`,
                    status: 'Đang học',
                    birthDate: '15/03/2005',
                    gender: sIdx % 2 === 0 ? 'Nam' : 'Nữ',
                    branch: 'RinoEdu Nguyễn Tuân',
                    parentName: `${sName.split(' ').slice(-1)[0]} Bố Nguyễn Văn A`,
                    parentPhone: `098765432${sIdx}`,
                    parentRelation: sIdx % 2 === 0 ? 'Bố' : 'Mẹ',
                    attendanceRate: '91.7%',
                    homeworkRate: '91.7%',
                    avgScore: '7.0 / 9.0',
                  }

                  return (
                    <StudentProfileHoverCard
                      key={sName}
                      student={studentItem}
                      align="center"
                      side="top"
                    >
                      <div
                        className="cursor-pointer transition-transform hover:scale-110"
                        title={`Xem profile học viên: ${sName}`}
                      >
                        <AppAvatar
                          src={studentItem.avatar}
                          name={sName}
                          size="sm"
                          className="h-5.5 w-5.5 border border-border/40 shadow-2xs cursor-pointer transition-all"
                        />
                      </div>
                    </StudentProfileHoverCard>
                  )
                })}
              </div>
              {remaining > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const clsRec = classRecord || {
                      id: cls.classCode,
                      code: cls.classCode,
                      name: cls.className,
                      programName: cls.programName || 'IELTS Junior',
                      subject: cls.programName || 'IELTS Junior',
                      level: cls.level || studentLevel,
                      branch: cls.branch || studentBranch,
                      teacher: cls.teacherName,
                      teacherPhone: '0901234567',
                      room: cls.room || 'A101',
                      schedule: 'Thứ 2, Thứ 4, Thứ 6 (18:00 - 19:30)',
                      scheduleSlots: cls.scheduleSlots || [],
                      startDate: cls.startDate || '2026-05-01',
                      endDate: cls.endDate || '2026-08-01',
                      maxStudents: 15,
                      enrolledStudents: 12,
                      status: 'dang_hoc',
                      tuitionFee: 3500000,
                    }
                    onSelectClassRecord(clsRec as ClassRecord, 'roster')
                  }}
                  className="h-5 px-2 rounded-full bg-muted hover:bg-muted/80 text-[9.5px] font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 cursor-pointer transition-colors border border-border/40"
                  title={`Nhấp để xem danh sách toàn bộ ${enrolled} học viên trong lớp ${cls.className}`}
                >
                  +{remaining}
                </button>
              )}
            </div>
          </div>

          {/* Cột 2: CỘT KHOẢNG TRỐNG Ở GIỮA (Đăng để trống - col-span-1) */}
          <div className="hidden sm:block sm:col-span-1" />

          {/* Cột 3: LỊCH HỌC (Căn phải - col-span-6) */}
          <div className="col-span-12 sm:col-span-6 flex items-center justify-end gap-1.5 text-xs">
            {classRecord?.scheduleSlots && classRecord.scheduleSlots.length > 0 ? (
              (() => {
                const teachers = (classRecord.teacher || '')
                  .split(/[,/&]| và /)
                  .map((t) => t.trim())
                  .filter(Boolean)
                return (
                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                    {classRecord.scheduleSlots.map((slot, idx) => {
                      const slotTeacher =
                        slot.teachers && slot.teachers.length > 0
                          ? slot.teachers[0]
                          : teachers[idx % teachers.length] || teachers[0] || 'Cô Lan'

                      const teacherPersonObj = {
                        id: `EMP-${slotTeacher.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'CL'}`,
                        name: slotTeacher,
                        role: 'Giáo viên Tiếng Anh',
                        phone: '0901234567',
                        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${slotTeacher}`,
                        email: `${slotTeacher.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
                      }

                      return (
                        <div
                          key={idx}
                          className="rounded-md border border-border/40 px-1.5 py-1 space-y-0.5 bg-card/30 flex flex-col items-center justify-center shrink-0 min-w-[105px]"
                        >
                          <div className="flex items-center gap-1 justify-center">
                            <span className="inline-flex items-center rounded bg-primary/10 px-1 py-0 text-[9px] font-bold text-primary shrink-0">
                              {slot.dayOfWeek}
                            </span>
                            <span className="font-mono text-[10px] font-semibold text-foreground shrink-0">
                              {slot.startTime}–{slot.endTime}
                            </span>
                          </div>

                          <PersonnelHoverCard person={teacherPersonObj} align="center">
                            <div
                              className="flex items-center justify-center gap-1 truncate max-w-[100px] cursor-pointer hover:opacity-80 transition-opacity text-[10px] text-muted-foreground"
                              title={`Nhấp/Rê chuột để xem thông tin giáo viên: ${slotTeacher}`}
                            >
                              <AppAvatar
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${slotTeacher}`}
                                name={slotTeacher}
                                size="xs"
                                className="h-3.5 w-3.5 shrink-0 border border-primary/20 cursor-pointer"
                              />
                              <span className="font-medium text-foreground text-[10px] truncate">
                                {slotTeacher}
                              </span>
                            </div>
                          </PersonnelHoverCard>
                        </div>
                      )
                    })}

                    <ClassTeacherHistoryPopover
                      trigger={historyTrigger}
                      currentTeacher={cls.teacherName}
                      teacherHistory={teacherHistoryList}
                    />
                  </div>
                )
              })()
            ) : (
              <div className="text-xs text-muted-foreground italic text-right">
                {classRecord?.schedule || 'Chưa cập nhật lịch học'}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Buổi học tiếp theo - Streamlined Bar */}
        <div className="space-y-1.5 text-xs pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Buổi học tiếp theo:</span>
              {isExpanded ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              )}
            </button>

            <SyllabusProfileHoverCard cls={syllabusRecord} align="end">
              <span
                role="button"
                tabIndex={0}
                className="text-xs font-medium text-primary hover:underline cursor-pointer truncate max-w-[260px] block text-right"
                title="Nhấp chuột để xem thông tin Khung chương trình"
              >
                KCT: {cls.curriculumName || 'IELTS Junior v2.1'}
              </span>
            </SyllabusProfileHoverCard>
          </div>

          {!isExpanded ? (
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 px-3 py-2 rounded-lg">
              <div className="flex flex-wrap items-center gap-2 min-w-0">
                <span className="inline-flex items-center rounded bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                  Bắt đầu: Buổi {upcomingList[0]?.no || 14}
                </span>
                <span className="font-mono text-xs font-semibold text-primary">
                  {upcomingList[0]?.date || '28/07/2026'} ({upcomingList[0]?.time || '17:45 – 19:15'})
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium text-foreground truncate max-w-[320px]">
                  {upcomingList[0]?.topic || 'Bài 14: Reading Skills Practice'}
                </span>
              </div>
              <span className="text-xs font-mono text-muted-foreground shrink-0">
                Phòng {cls.room || 'A101'}
              </span>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1">
              <div className="space-y-1">
                {upcomingList.map((sess, idx) => (
                  <div
                    key={sess.no}
                    className={cn(
                      "flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg transition-colors text-xs",
                      idx === 0
                        ? "bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40"
                        : "bg-muted/30 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                      <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[9.5px] font-bold text-primary shrink-0">
                        Buổi {sess.no}
                      </span>
                      {idx === 0 && (
                        <span className="inline-flex items-center rounded bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                          Bắt đầu
                        </span>
                      )}
                      <span className="font-mono text-xs font-semibold text-foreground">
                        {sess.date} ({sess.time})
                      </span>
                      <span
                        className="text-[11px] text-muted-foreground truncate max-w-[220px]"
                        title={sess.topic}
                      >
                        • {sess.topic}
                      </span>
                      <span className="text-[10.5px] font-mono text-muted-foreground">
                        • Phòng {sess.room}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {(() => {
                        const teacherPersonObj = {
                          id: `EMP-${sess.teacher.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'CL'}`,
                          name: sess.teacher,
                          role: 'Giáo viên Tiếng Anh',
                          phone: '0901234567',
                          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${sess.teacher}`,
                          email: `${sess.teacher.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
                        }
                        return (
                          <PersonnelHoverCard person={teacherPersonObj} align="end">
                            <div
                              className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:opacity-80 transition-opacity"
                              title={`Rê chuột/Nhấp để xem thông tin giáo viên: ${sess.teacher}`}
                            >
                              <AppAvatar
                                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${sess.teacher}`}
                                name={sess.teacher}
                                size="sm"
                                className="h-5 w-5 shrink-0 border border-primary/20 cursor-pointer"
                              />
                              <span className="font-medium text-foreground">{sess.teacher}</span>
                            </div>
                          </PersonnelHoverCard>
                        )
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
