'use client'

import {
  Phone,
  Award,
  BookOpen,
  MapPin,
  CalendarDays,
  Calendar,
  GraduationCap,
  UserCheck,
  Clock,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Panel, AppAvatar, PersonnelHoverCard } from '@/components/shared'
import { ClassCodeHoverCell } from './ClassCodeHoverCell'
import { parseAttendanceRate } from './operationsAlertHelpers'
import { type StudentCareAlert, getFamilyContacts } from '@/mocks/careAlerts'
import { type SimulatedPackage } from './studentCareDetailTypes'

interface StudentCareInfoTabProps {
  student: StudentCareAlert
  activePackage: SimulatedPackage | null
  studentBranch: string
  nextLessonInfo: {
    session: string
    topic: string
    time: string
  }
  contacts: ReturnType<typeof getFamilyContacts>
  siblings: StudentCareAlert[]
  setLocalStudentId: (id: string) => void
}

export function StudentCareInfoTab({
  student,
  activePackage,
  studentBranch,
  nextLessonInfo,
  contacts,
  siblings,
  setLocalStudentId,
}: StudentCareInfoTabProps) {
  return (
    <>
      {/* Selected Package Details Summary (Smart Cards) */}
      {activePackage && (
        <div className="grid grid-cols-2 gap-2 shrink-0">
          {/* Card 1: Chuyên cần */}
          <div className="bg-muted/10 border border-border/60 rounded-md px-2 py-1.5 flex flex-col justify-center text-left select-none">
            <div className="flex items-center justify-between w-full">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">
                Chuyên cần
              </span>
              <span className="text-xs font-bold text-foreground">
                {activePackage.attendanceRatio}
              </span>
            </div>
            <div className={cn(
              "text-[10px] font-semibold leading-none mt-0.5",
              parseAttendanceRate(activePackage.attendanceRatio) >= 80 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-rose-600 dark:text-rose-400"
            )}>
              {parseAttendanceRate(activePackage.attendanceRatio)}%
            </div>
          </div>

          {/* Card 2: Tỷ lệ BTVN */}
          <div className="bg-muted/10 border border-border/60 rounded-md px-2 py-1.5 flex flex-col justify-center text-left select-none">
            <div className="flex items-center justify-between w-full">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">
                Tỷ lệ BTVN
              </span>
              <span className="text-xs font-bold text-foreground">
                {activePackage.homeworkCompletion}%
              </span>
            </div>
            <div className={cn(
              "text-[10px] font-semibold leading-none mt-0.5",
              activePackage.homeworkCompletion >= 80 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-rose-600 dark:text-rose-400"
            )}>
              {activePackage.homeworkCompletion >= 80 ? 'Đạt' : 'Yếu'}
            </div>
          </div>

          {/* Card 3: Điểm thi TB */}
          <div className="bg-muted/10 border border-border/60 rounded-md px-2 py-1.5 flex flex-col justify-center text-left select-none">
            <div className="flex items-center justify-between w-full">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">
                Điểm thi TB
              </span>
              <span className="text-xs font-bold text-foreground">
                {activePackage.lastTestScore > 0 ? activePackage.lastTestScore.toFixed(1) : '—'}
              </span>
            </div>
            <div className={cn(
              "text-[9.5px] font-semibold leading-none mt-0.5 truncate",
              activePackage.lastTestScore >= activePackage.priorTestScore 
                ? "text-emerald-600 dark:text-emerald-400" 
                : "text-rose-600 dark:text-rose-400"
            )}>
              Lần trước: {activePackage.priorTestScore > 0 ? activePackage.priorTestScore.toFixed(1) : '—'}
            </div>
          </div>
          {/* Card 4: Còn lại */}
          <div className="bg-muted/10 border border-border/60 rounded-md px-2 py-1.5 flex flex-col justify-center text-left select-none">
            <div className="flex items-center justify-between w-full">
              <span className="text-[9.5px] font-bold text-muted-foreground uppercase tracking-wide">
                Còn lại
              </span>
              <span className="text-xs font-bold text-foreground">
                {activePackage.remainingSessions}/{activePackage.totalSessions}
              </span>
            </div>
            <div className="text-[9.5px] font-semibold text-muted-foreground leading-none mt-0.5 truncate">
              Hạn: {activePackage.endDate}
            </div>
          </div>
        </div>
      )}

      {/* Class Info Panel */}
      {activePackage && (
        <Panel title="Thông tin lớp học">
          <div className="space-y-3.5 pt-2 text-xs">
            {/* 1. Lớp học liên kết: BookOpen icon */}
            <div className="flex items-start gap-2.5">
              <BookOpen className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-foreground mb-0.5">{activePackage.className}</div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">Mã lớp:</span>
                  <ClassCodeHoverCell
                    classCode={activePackage.classCode}
                    subject={activePackage.className === 'Lớp Tiếng Anh Giao Tiếp 00019' ? 'IELTS' : 'Tiếng Anh'}
                    level={activePackage.level}
                    teacherCode={activePackage.teacherCode}
                    schedule={activePackage.schedule}
                  />
                </div>
              </div>
            </div>

            {/* 2. Trình độ học viên: Award icon */}
            <div className="flex items-start gap-2.5">
              <Award className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-foreground">
                  {activePackage.level} &mdash; Level {activePackage.subLevel}
                </span>
                <span className="ml-1.5 text-[8.5px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-1 py-px rounded select-none">
                  Trình độ học viên
                </span>
              </div>
            </div>

            {/* 3. Lịch học cố định xếp thành từng dòng: Calendar icon */}
            <div className="flex items-start gap-2.5">
              <Calendar className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 space-y-0.5">
                {activePackage.schedule.split(',').map((line, idx) => (
                  <div key={idx} className="font-semibold text-foreground">{line.trim()}</div>
                ))}
              </div>
            </div>

            {/* 4. Phụ trách: UserCheck icon + Avatar */}
            <div className="flex items-start gap-2.5">
              <UserCheck className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <PersonnelHoverCard
                  person={{
                    id: 'EMP-LA',
                    name: 'Lan Anh (CSM)',
                    role: 'Quản lý vận hành (CSM)',
                    phone: '0901234567',
                    email: 'lananh@rinoedu.vn',
                    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LanAnh'
                  }}
                >
                  <div className="inline-flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-0.5 rounded transition-all">
                    <AppAvatar src="https://api.dicebear.com/7.x/adventurer/svg?seed=LanAnh" name="Lan Anh (CSM)" size="xs" className="h-5 w-5 border border-sky-100 shrink-0" />
                    <span className="font-semibold text-foreground text-[11px] hover:underline">Lan Anh (CSM)</span>
                  </div>
                </PersonnelHoverCard>
              </div>
            </div>

            {/* 5. Giáo viên: GraduationCap icon + Avatar(s) xếp dòng */}
            <div className="flex items-start gap-2.5">
              <GraduationCap className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <PersonnelHoverCard
                    person={{
                      id: 'EMP-GV1',
                      name: activePackage.teacherCode === 'GV_F010' ? 'Cô Lan' : activePackage.teacherCode,
                      role: 'Giáo viên chính',
                      phone: '0911223344',
                      email: 'teacher1@rinoedu.vn',
                      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${activePackage.teacherCode}`
                    }}
                  >
                    <div className="inline-flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-0.5 rounded transition-all">
                      <AppAvatar src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${activePackage.teacherCode}`} name={activePackage.teacherCode} size="xs" className="h-5 w-5 border border-violet-100 shrink-0" />
                      <span className="font-semibold text-foreground font-mono text-[11px] hover:underline">{activePackage.teacherCode} ({activePackage.teacherCode === 'GV_F010' ? 'Cô Lan' : activePackage.teacherCode})</span>
                    </div>
                  </PersonnelHoverCard>
                </div>
                <div>
                  <PersonnelHoverCard
                    person={{
                      id: 'EMP-GV2',
                      name: 'GV_T203',
                      role: 'Trợ giảng lớp học',
                      phone: '0988776655',
                      email: 'assistant@rinoedu.vn',
                      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=GV_T203'
                    }}
                  >
                    <div className="inline-flex items-center gap-2 cursor-pointer hover:bg-muted/40 p-0.5 rounded transition-all">
                      <AppAvatar src="https://api.dicebear.com/7.x/adventurer/svg?seed=GV_T203" name="GV_T203" size="xs" className="h-5 w-5 border border-zinc-205 shrink-0" />
                      <span className="font-semibold text-foreground font-mono text-[11px] hover:underline">GV_T203</span>
                    </div>
                  </PersonnelHoverCard>
                </div>
              </div>
            </div>

            {/* 6. Cơ sở & Phòng học: MapPin icon */}
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-foreground">
                  {studentBranch} &bull; Phòng {(activePackage.classCode.charCodeAt(activePackage.classCode.length - 1) % 5) + 301}
                </span>
                <span className="ml-1.5 text-[8.5px] font-bold text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400 px-1 py-px rounded select-none">
                  Cơ sở & Phòng
                </span>
              </div>
            </div>

            {/* 7. Ngày nhập học & Ngày hết hạn: CalendarDays icon */}
            <div className="flex items-start gap-2.5">
              <CalendarDays className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 space-y-1">
                <div>
                  <span className="text-muted-foreground mr-1">Ngày nhập học:</span>
                  <span className="font-semibold text-foreground">{student.startDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground mr-1">Ngày hết hạn:</span>
                  <span className="font-semibold text-foreground">{activePackage.endDate}</span>
                </div>
              </div>
            </div>

            {/* 8. Buổi học tiếp theo: Clock icon */}
            <div className="flex items-start gap-2.5">
              <Clock className="h-4 w-4 text-zinc-400 dark:text-zinc-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-foreground">
                    {nextLessonInfo.session}: {nextLessonInfo.topic}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {nextLessonInfo.time}
                </span>
              </div>
            </div>
          </div>
        </Panel>
      )}

      {/* Family Contacts Panel */}
      <Panel title="Liên hệ gia đình">
        <div className="space-y-3 pt-2">
          {contacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border/60 flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-bold text-foreground truncate">{contact.name}</p>
                  {contact.isPrimary && (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-bold px-1.5 py-px text-[8.5px] rounded border-none shadow-none leading-none select-none">
                      Chính
                    </Badge>
                  )}
                </div>
                <p className="text-[11px] font-mono text-foreground font-semibold">{contact.phone}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 hover:text-emerald-700 shrink-0 border border-emerald-100"
                title={`Gọi cho ${contact.name}`}
                onClick={() => {
                  toast.success(`Đang gọi tới ${contact.name} (${contact.phone})`)
                }}
              >
                <Phone className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
          {siblings.length > 0 && (
            <div className="pt-3 border-t border-border/60 mt-3 space-y-2.5">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                Học viên cùng gia đình ({siblings.length})
              </p>
              <div className="space-y-2">
                {siblings.map((sib) => (
                  <div
                    key={sib.studentId}
                    className="p-2.5 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100/60 dark:border-amber-900/30 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{sib.studentName}</p>
                      <p className="text-[10px] text-muted-foreground font-semibold">{sib.studentId} &bull; {sib.subject}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="xs"
                      className="h-6 text-[10px] font-bold border-amber-250 bg-amber-50 hover:bg-amber-100 text-amber-700 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer shrink-0"
                      onClick={() => {
                        setLocalStudentId(sib.studentId)
                        toast.success(`Đang chuyển sang hồ sơ của ${sib.studentName}`)
                      }}
                      title={`Chuyển sang hồ sơ của ${sib.studentName}`}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Chuyển
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Panel>
    </>
  )
}
