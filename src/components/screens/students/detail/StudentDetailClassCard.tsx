'use client'

import {
  History,
  Star,
} from 'lucide-react'
import {
  StatusBadge,
  AppAvatar,
  PersonnelHoverCard,
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
  isPast?: boolean
  onSelectClassRecord?: (record: ClassRecord, tab?: string) => void
  onTransferClass?: () => void
  onReserveClass?: () => void
  onDropClass?: () => void
}

function formatShortDay(dayStr?: string): string {
  if (!dayStr) return 'T2'
  const d = dayStr.trim().toLowerCase()
  if (d.includes('2') || d.includes('hai')) return 'T2'
  if (d.includes('3') || d.includes('ba')) return 'T3'
  if (d.includes('4') || d.includes('tư') || d.includes('bốn')) return 'T4'
  if (d.includes('5') || d.includes('năm')) return 'T5'
  if (d.includes('6') || d.includes('sáu')) return 'T6'
  if (d.includes('7') || d.includes('bảy')) return 'T7'
  if (d.includes('chủ nhật') || d.includes('cn')) return 'CN'
  return dayStr
}

export function StudentDetailClassCard({
  cls,
  classRecord,
  studentBranch,
  isPast = false,
}: StudentDetailClassCardProps) {
  const isCompleted = cls.status === 'session_ended' || cls.progress?.includes('Hoàn thành') || cls.progress?.includes('học xong')

  const classStatus = isPast
    ? isCompleted
      ? 'completed'
      : cls.status === 'dropped'
      ? 'huy'
      : 'completed'
    : classRecord
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
    !isPast &&
    (classStatus === 'tam_dung' ||
    classStatus === 'huy' ||
    cls.status === 'dropped' ||
    cls.status === 'session_ended')

  const classStatusLabel = isPast
    ? isCompleted
      ? 'Hoàn thành'
      : cls.status === 'dropped'
      ? 'Đã thôi học'
      : 'Đã kết thúc'
    : (() => {
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
      className="px-1.5 py-0.5 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/40 rounded transition-all cursor-pointer flex items-center gap-1 text-xs font-medium shrink-0"
      title={`Xem lịch sử đổi giáo viên (${teacherHistoryList.length} giáo viên)`}
    >
      <History className="h-3 w-3" />
      <span>({teacherHistoryList.length})</span>
    </span>
  )

  const upcomingList = [
    { no: 14, day: 'T3', date: '28/07', time: '17:45 – 19:15', topic: 'Bài 14: Reading Skills Practice', room: cls.room || 'A101', teacher: teacherList[0] || 'Cô Lan', label: 'Hôm nay / Sắp tới' },
    { no: 15, day: 'T5', date: '30/07', time: '17:45 – 19:15', topic: 'Bài 15: Listening & Speaking Drills', room: cls.room || 'A101', teacher: teacherList[1] || 'Cô Nga', label: 'Sắp diễn ra' },
    { no: 16, day: 'T7', date: '01/08', time: '17:45 – 19:15', topic: 'Bài 16: Writing Task 1 Strategy', room: cls.room || 'A101', teacher: teacherList[0] || 'Cô Lan', label: 'Sắp diễn ra' },
    { no: 17, day: 'T3', date: '04/08', time: '17:45 – 19:15', topic: 'Bài 17: Grammar & Collocations', room: cls.room || 'A101', teacher: teacherList[0] || 'Cô Lan', label: 'Sắp diễn ra' },
    { no: 18, day: 'T5', date: '06/08', time: '17:45 – 19:15', topic: 'Bài 18: Mid-term Assessment', room: cls.room || 'A101', teacher: teacherList[1] || 'Cô Nga', label: 'Sắp diễn ra' },
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
  const attendanceNum = parseFloat(perf.attendanceRate) || 91.7
  const hwNum = parseFloat(perf.homeworkSubmissionRate) || 91.7

  const totalSessions = cls.totalSessions || 24
  const usedSessions =
    cls.usedSessions ||
    (cls.progress
      ? parseInt(cls.progress.match(/(\d+)\s*\//)?.[1] || '24', 10)
      : 24)
  const pctUsed =
    totalSessions > 0 ? Math.round((usedSessions / totalSessions) * 100) : 100

  const scheduleSlots =
    cls.scheduleSlots && cls.scheduleSlots.length > 0
      ? cls.scheduleSlots
      : classRecord?.scheduleSlots && classRecord.scheduleSlots.length > 0
      ? classRecord.scheduleSlots
      : [
          { dayOfWeek: 'Thứ 3', startTime: '17:00', endTime: '18:30' },
          { dayOfWeek: 'Thứ 5', startTime: '17:00', endTime: '18:30' },
        ]

  return (
    <div
      className={cn(
        'border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs transition-all duration-200 hover:border-border',
        isPast && 'opacity-95',
        isClassInactive && 'opacity-60 bg-muted/20'
      )}
    >
      {/* ========================================================
          CARD HEADER: Đồng bộ 100% với thẻ lớp đề xuất
          - Trái: Tên lớp, Trạng thái, Mã lớp, Trình độ, Loại lớp
          - Phải:
            + Dòng 1: Sĩ số xx/xx (+ x mới) [xóa viền/nền] + Lịch học [text thường]
            + Dòng 2: KCT đưa lên trước GV + Danh sách giáo viên + icon (x)
         ======================================================== */}
      <div className="border-b border-border/40 px-4 py-2.5 bg-muted/10 dark:bg-zinc-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-left">
          {/* Trái: Tên lớp, Status, Mã lớp, Trình độ, Loại lớp */}
          <div className="flex flex-col min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-bold text-foreground text-sm sm:text-base truncate max-w-[280px]">
                {cls.className}
              </span>
              {!isPast && (
                <>
                  <StatusBadge status={classStatus} label={classStatusLabel} />
                  {isClassInactive && (
                    <span className="text-xs text-muted-foreground italic font-medium">
                      {cls.status === 'dropped' || cls.status === 'session_ended'
                        ? '(Đã thoát lớp)'
                        : '(Lớp đã nghỉ/kết thúc)'}
                    </span>
                  )}
                </>
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
                    scheduleSlots.length > 0
                      ? `${formatShortDay(scheduleSlots[0]?.dayOfWeek)} ${scheduleSlots[0]?.startTime}`
                      : 'T3/5 17:00–18:30'
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

          {/* Phải: Dòng 1 (Sĩ số + Lịch học), Dòng 2 (KCT + GV) */}
          <div className="flex flex-col items-start sm:items-end justify-center space-y-1.5 shrink-0 pt-1 sm:pt-0">
            {/* Dòng 1: Sĩ số (không viền, không nền) + Lịch học (text thường) */}
            <div className="flex items-center gap-2 flex-wrap">
              {!isPast && (
                <>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-foreground">{enrolled}/{max}</span>
                    <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 shrink-0">
                      (+{newCount} mới, Trial)
                    </span>
                  </div>
                  <span className="text-muted-foreground/30">•</span>
                </>
              )}

              <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground font-normal">
                {scheduleSlots.length > 0 ? (
                  scheduleSlots.map((slot, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-muted-foreground font-normal text-xs"
                    >
                      <span>{formatShortDay(slot.dayOfWeek)}</span>
                      <span className="font-mono text-xs">{slot.startTime}–{slot.endTime}</span>
                      {idx < scheduleSlots.length - 1 && (
                        <span className="text-muted-foreground/30">•</span>
                      )}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic font-normal">
                    {cls.startDate ? `Bắt đầu ${cls.startDate}` : 'Chưa cập nhật lịch'}
                  </span>
                )}
              </div>
            </div>

            {/* Dòng 2: KCT lên trước GV + Danh sách giáo viên + icon (x) */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <SyllabusProfileHoverCard cls={syllabusRecord} align="end">
                <span
                  role="button"
                  tabIndex={0}
                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  title="Nhấp chuột để xem thông tin Khung chương trình"
                >
                  <span className="text-[11px] font-medium text-muted-foreground">KCT:</span>{' '}
                  <span className="font-medium text-foreground">
                    {cls.curriculumName || syllabusRecord.syllabus || 'IELTS Junior v2.1'}
                  </span>
                </span>
              </SyllabusProfileHoverCard>

              <span className="text-muted-foreground/30">•</span>

              <span className="text-[11px] text-muted-foreground font-medium">GV:</span>
              {teacherList.map((tName, idx) => {
                const teacherPersonObj = {
                  id: `EMP-${tName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'EMP'}`,
                  name: tName,
                  role: 'Giáo viên',
                  phone: '0901234567',
                  avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${tName}`,
                  email: `${tName.toLowerCase().replace(/[^a-z0-9]/g, '')}@rinoedu.vn`,
                }

                return (
                  <PersonnelHoverCard key={idx} person={teacherPersonObj} align="end">
                    <div
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title={`Rê chuột/Nhấp để xem thông tin giáo viên: ${tName}`}
                    >
                      <AppAvatar
                        src={teacherPersonObj.avatar}
                        name={tName}
                        size="xs"
                        className="h-4 w-4 shrink-0 border border-primary/20"
                      />
                      <span className="font-medium text-foreground truncate max-w-[120px]">{tName}</span>
                    </div>
                  </PersonnelHoverCard>
                )
              })}

              <ClassTeacherHistoryPopover
                trigger={historyTrigger}
                currentTeacher={cls.teacherName}
                teacherHistory={teacherHistoryList}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          CARD BODY: Đồng bộ 100% với thẻ lớp đề xuất
          - 1. Dải chỉ số ngang: Chuyên cần, BTVN, Điểm TB, Rating, Tỷ lệ lấp đầy
          - 2. Dòng buổi học tiếp theo & Selection mở ra 5 buổi tiếp theo
         ======================================================== */}
      <div className="p-3 space-y-2.5">
        {isPast ? (
          <div className="space-y-2">
            {/* Dòng 1: Buổi ghép (Hiển thị đúng thông tin theo lớp ghép bên trên, dàn đều 2 đầu) */}
            <div className="flex items-center justify-between gap-3 text-xs bg-muted/25 dark:bg-zinc-800/20 border border-border/40 px-3 py-2 rounded-lg flex-wrap">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="text-xs font-normal text-muted-foreground shrink-0">
                  Buổi ghép:
                </span>
                <span className="font-mono text-xs font-normal text-foreground shrink-0">
                  {cls.startSessionDate
                    ? cls.startSessionDate
                    : cls.nextLessonDate
                    ? cls.nextLessonDate
                    : `${upcomingList[0]?.day}, ${cls.startDate || '15/01/2024'} (${upcomingList[0]?.time})`}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-foreground truncate font-normal">
                  {cls.nextLessonName || upcomingList[0]?.topic || 'Bài 01: Khảo sát & Khởi động chuyên đề'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-xs font-normal">
                <span className="font-mono">Phòng {cls.room || 'P.101'}</span>
                <span className="text-muted-foreground/40">•</span>
                <span>{cls.teacherName || teacherList[0] || 'GV phụ trách'}</span>
              </div>
            </div>

            {/* Dòng 2: Thống kê gồm: Thời gian bắt đầu - kết thúc, Số buổi đã dùng, Cơ sở đào tạo (Chia dàn đều 3 cột) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-muted/25 dark:bg-zinc-800/20 border border-border/40 px-3 py-2 rounded-lg items-center">
              {/* Cột 1: Thời gian */}
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs font-normal text-muted-foreground shrink-0">
                  Thời gian:
                </span>
                <span className="font-mono text-xs font-normal text-foreground truncate">
                  {cls.startDate || '15/01/2024'} → {cls.endDate || '15/04/2024'}
                </span>
              </div>

              {/* Cột 2: Số buổi đã dùng */}
              <div className="flex items-center gap-1.5 min-w-0 sm:justify-center">
                <span className="text-xs font-normal text-muted-foreground shrink-0">
                  Số buổi đã dùng:
                </span>
                <span className="text-foreground font-normal truncate">
                  <strong className="font-medium text-foreground">{usedSessions}/{totalSessions} buổi</strong>
                  <span className="text-muted-foreground ml-1">({pctUsed}%)</span>
                </span>
              </div>

              {/* Cột 3: Cơ sở đào tạo */}
              <div className="flex items-center gap-1.5 min-w-0 sm:justify-end">
                <span className="text-xs font-normal text-muted-foreground shrink-0">
                  Cơ sở đào tạo:
                </span>
                <span className="text-foreground font-normal truncate" title={cls.branch || studentBranch || 'RinoEdu Nguyễn Tuân'}>
                  {cls.branch || studentBranch || 'RinoEdu Nguyễn Tuân'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Dải chỉ số ngang (cho lớp đang học) */}
            <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/25 dark:bg-zinc-800/30 border border-border/30 text-xs flex-wrap">
              <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-medium text-[11.5px]">Chuyên cần:</span>
                  <strong className="text-foreground font-bold">{attendanceNum}%</strong>
                </div>
                <span className="text-border/60">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-medium text-[11.5px]">BTVN:</span>
                  <strong className="text-foreground font-bold">{hwNum}%</strong>
                </div>
                <span className="text-border/60">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-medium text-[11.5px]">Điểm TB:</span>
                  <strong className="text-foreground font-bold">
                    {perf.latestScore.score !== '—' ? perf.latestScore.score : '7.0'}
                    <span className="text-[10px] font-normal text-muted-foreground">/10</span>
                  </strong>
                </div>
                <span className="text-border/60">•</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground font-medium text-[11.5px]">Rating:</span>
                  <strong className="text-foreground font-bold flex items-center gap-0.5">
                    4.5 <Star className="h-3 w-3 text-amber-500 fill-amber-500 inline" />
                  </strong>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground font-medium">
                Tỷ lệ lấp đầy: <strong className="text-foreground font-semibold">{pct}%</strong>
              </div>
            </div>

            {/* 2. Dòng thông tin: Buổi ghép (lớp hiện tại, dàn đều 2 đầu) */}
            <div className="flex items-center justify-between gap-3 text-xs bg-muted/25 dark:bg-zinc-800/20 border border-border/40 px-3 py-2 rounded-lg flex-wrap">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="text-xs font-normal text-muted-foreground shrink-0">
                  Buổi ghép:
                </span>
                <span className="font-mono text-xs font-normal text-foreground shrink-0">
                  {cls.startSessionDate
                    ? cls.startSessionDate
                    : cls.nextLessonDate
                    ? cls.nextLessonDate
                    : `${upcomingList[0]?.day}, ${upcomingList[0]?.date} (${upcomingList[0]?.time})`}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-foreground truncate font-normal">
                  {upcomingList[0]?.topic || 'Bài 14: Reading Skills Practice'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-muted-foreground text-xs font-normal">
                <span className="font-mono">Phòng {cls.room || 'B201'}</span>
                <span className="text-muted-foreground/40">•</span>
                <span>{upcomingList[0]?.teacher}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
