'use client'

import { useState } from 'react'
import {
  ChevronDown,
  History,
  Star,
} from 'lucide-react'
import {
  StatusBadge,
  AppAvatar,
  PersonnelHoverCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CLASS_STATUS_LABELS, type ClassRecord } from '@/mocks/classRecords'
import { ClassTeacherHistoryPopover } from '@/components/screens/care/ClassTeacherHistoryPopover'
import { ClassCodeHoverCell } from '@/components/screens/care/ClassCodeHoverCell'
import { SyllabusProfileHoverCard } from '@/components/screens/classes/SyllabusProfileHoverCard'
import { getClassPerformance } from './studentDetailClassesHelpers'
import { cn } from '@/lib/utils'
import type { StudentPackage } from './studentDetailTypes'

export interface StudentDetailRecommendedClassesProps {
  recommendedClasses: ClassRecord[]
  currentPackage: StudentPackage | null
  packages: StudentPackage[]
  onSelectClassRecord: (record: ClassRecord, tab?: string) => void
  onOpenAssignClass: (pkg: StudentPackage) => void
  onDirectAssign?: (classItem: { id: string; name: string; startSession?: string }) => void
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

export function StudentDetailRecommendedClasses({
  recommendedClasses,
  currentPackage,
  packages,
  onOpenAssignClass,
  onDirectAssign,
}: StudentDetailRecommendedClassesProps) {
  const [selectedSessionNoByClass, setSelectedSessionNoByClass] = useState<Record<string, number>>({})

  const handleConfirmDirectAssign = (
    recItem: ClassRecord,
    sess: { no: number; day: string; date: string; time: string; topic: string }
  ) => {
    const sessionStr = `${sess.day}, ${sess.date} (${sess.time})`
    if (onDirectAssign) {
      onDirectAssign({
        id: recItem.code || recItem.id,
        name: recItem.name,
        startSession: sessionStr,
      })
    } else {
      const pkgToAssign = currentPackage || packages[0]
      if (pkgToAssign) {
        onOpenAssignClass(pkgToAssign)
      }
    }
  }

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-foreground uppercase tracking-wide">
            Các lớp học phù hợp (Khuyến nghị ghép lớp)
          </span>
          <span className="text-[10.5px] text-muted-foreground font-medium">
            ({recommendedClasses.length} lớp tương thích)
          </span>
        </div>
      </div>

      <div className="space-y-3.5">
        {recommendedClasses.map((rec) => {
          const enrolled = rec.enrolledStudents || 15
          const max = rec.maxStudents || 20
          const pct = max > 0 ? Math.round((enrolled / max) * 100) : 0
          const newCount = rec.trialStudents || 2
          const teachers = (rec.teacher || '').split(/[,/&]| và /).map((t) => t.trim()).filter(Boolean)

          // Upcoming sessions list: no 'Buổi xx' prefix, no year, day of week prefix (Tx)
          const upcomingList = [
            { no: 14, day: 'T3', date: '28/07', time: '17:45–19:15', topic: 'Bài 14: Reading Skills Practice', room: rec.room || 'B201', teacher: teachers[0] || 'Nguyễn Mạnh Hùng' },
            { no: 15, day: 'T5', date: '30/07', time: '17:45–19:15', topic: 'Bài 15: Listening & Speaking Drills', room: rec.room || 'B201', teacher: teachers[1] || 'Hoàng Thị Mai' },
            { no: 16, day: 'T7', date: '01/08', time: '17:45–19:15', topic: 'Bài 16: Writing Task 1 Strategy', room: rec.room || 'B201', teacher: teachers[0] || 'Nguyễn Mạnh Hùng' },
            { no: 17, day: 'T3', date: '04/08', time: '17:45–19:15', topic: 'Bài 17: Grammar & Collocations', room: rec.room || 'B201', teacher: teachers[0] || 'Nguyễn Mạnh Hùng' },
            { no: 18, day: 'T5', date: '06/08', time: '17:45–19:15', topic: 'Bài 18: Mid-term Assessment', room: rec.room || 'B201', teacher: teachers[1] || 'Hoàng Thị Mai' },
          ]

          const selectedNo = selectedSessionNoByClass[rec.code] ?? 14
          const currentSelectedSession = upcomingList.find((s) => s.no === selectedNo) || upcomingList[0]

          const perf = getClassPerformance(rec.code)
          const attendanceNum = parseFloat(perf.attendanceRate) || 91.7
          const hwNum = parseFloat(perf.homeworkSubmissionRate) || 91.7

          const teacherHistoryList = [
            { name: teachers[0] || 'Nguyễn Mạnh Hùng', role: 'Chủ nhiệm', startDate: '01/05/2026', isCurrent: true },
            { name: teachers[1] || 'Hoàng Thị Mai', role: 'Giảng dạy', startDate: '01/05/2026', isCurrent: true },
            { name: 'Thầy Hùng', role: 'GV cũ', startDate: '01/01/2026', endDate: '30/04/2026', reason: 'Chuyển ca dạy', isCurrent: false },
          ]

          // Xóa text Lịch sử GV đi, để icon (x) thôi
          const historyTrigger = (
            <span
              role="button"
              tabIndex={0}
              className="px-1.5 py-0.5 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/40 rounded transition-all cursor-pointer flex items-center gap-1 text-[11px] font-medium shrink-0"
              title={`Xem lịch sử đổi giáo viên (${teacherHistoryList.length} giáo viên)`}
            >
              <History className="h-3 w-3" />
              <span>({teacherHistoryList.length})</span>
            </span>
          )

          return (
            <div
              key={rec.id}
              className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs transition-all duration-200 hover:border-border"
            >
              {/* ========================================================
                  CARD HEADER:
                  - Trái: Tên lớp, Trạng thái, Mã lớp, Trình độ, Loại lớp
                  - Phải:
                    + Dòng trên: Sĩ số xx/xx (+ x mới) [xóa viền/nền] + Lịch học [text thường]
                    + Dòng dưới: KCT đưa lên trước GV + Danh sách giáo viên + icon (x)
                 ======================================================== */}
              <div className="border-b border-border/40 px-4 py-2.5 bg-muted/10 dark:bg-zinc-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-left">
                  {/* Trái: Tên lớp & Mã lớp */}
                  <div className="flex flex-col min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="font-bold text-foreground text-sm sm:text-base truncate max-w-[260px]">
                        {rec.name}
                      </span>
                      <StatusBadge
                        status={rec.status}
                        label={CLASS_STATUS_LABELS[rec.status] || 'Mở chiêu sinh'}
                      />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap min-w-0 text-xs text-muted-foreground">
                      <div className="w-fit">
                        <ClassCodeHoverCell
                          classCode={rec.code}
                          subject={rec.level || 'IELTS'}
                          level={rec.subLevel || '5.0-5.5'}
                          teacherCode={rec.teacher}
                          schedule={rec.schedule}
                        />
                      </div>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-xs text-muted-foreground font-normal truncate">
                        {rec.level} {rec.subLevel ? `- ${rec.subLevel}` : ''}
                        {(rec.level?.toLowerCase().includes('math') || rec.level?.toLowerCase().includes('toán') || rec.grade) && (
                          <span> • {rec.grade || 'Lớp 6'}</span>
                        )}
                      </span>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        Loại lớp: {rec.classRatio || '1:7'}
                      </span>
                    </div>
                  </div>

                  {/* Phải: Dòng 1 (Sĩ số + Lịch học), Dòng 2 (KCT + GV) */}
                  <div className="flex flex-col items-start sm:items-end justify-center space-y-1.5 shrink-0 pt-1 sm:pt-0">
                    {/* Dòng 1: Sĩ số (xóa nền, viền) + Lịch học (xóa viền, nền, text thường) */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Sĩ số: Không nền, không viền */}
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-foreground">{enrolled}/{max}</span>
                        <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 shrink-0">
                          (+{newCount} mới, Trial)
                        </span>
                      </div>

                      <span className="text-muted-foreground/30">•</span>

                      {/* Lịch học: xóa viền, xóa nền, text thường không in đậm */}
                      <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground font-normal">
                        {rec.scheduleSlots && rec.scheduleSlots.length > 0 ? (
                          rec.scheduleSlots.map((slot, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-muted-foreground font-normal text-xs"
                            >
                              <span>{formatShortDay(slot.dayOfWeek)}</span>
                              <span className="font-mono text-xs">{slot.startTime}–{slot.endTime}</span>
                              {idx < rec.scheduleSlots.length - 1 && (
                                <span className="text-muted-foreground/30">•</span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic font-normal">
                            {rec.schedule || 'Chưa cập nhật lịch'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dòng 2: KCT đưa lên trước GV + Danh sách giáo viên + icon (x) */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      {/* KCT lên trước GV */}
                      <SyllabusProfileHoverCard cls={rec} align="end">
                        <span
                          role="button"
                          tabIndex={0}
                          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          title="Nhấp chuột để xem thông tin Khung chương trình"
                        >
                          <span className="text-[11px] font-medium text-muted-foreground">KCT:</span>{' '}
                          <span className="font-medium text-foreground">
                            {rec.syllabus && rec.syllabus !== '—' ? rec.syllabus : 'IELTS Junior v2.1'}
                          </span>
                        </span>
                      </SyllabusProfileHoverCard>

                      <span className="text-muted-foreground/30">•</span>

                      <span className="text-[11px] text-muted-foreground font-medium">GV:</span>
                      {teachers.map((tName, idx) => {
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
                        currentTeacher={rec.teacher}
                        teacherHistory={teacherHistoryList}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  CARD BODY:
                  - 1. Dải chỉ số: Chuyên cần, BTVN, Điểm TB, Rating, Tỷ lệ lấp đầy
                  - 2. Buổi đầu tiên & Droplist Chọn buổi bên phải
                 ======================================================== */}
              <div className="p-3 space-y-2.5">
                {/* 1. Dải chỉ số: Chuyên cần, BTVN, Điểm TB, Rating */}
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

                {/* 2. Buổi đầu tiên & Droplist Chọn buổi bên phải */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-muted/25 dark:bg-zinc-800/20 border border-border/40 px-3 py-2 rounded-lg">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    <span className="font-bold text-foreground font-mono">
                      {currentSelectedSession.day}, {currentSelectedSession.date} ({currentSelectedSession.time})
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium text-foreground truncate max-w-[280px]" title={currentSelectedSession.topic}>
                      {currentSelectedSession.topic}
                    </span>
                    <span className="text-muted-foreground/60 hidden sm:inline">•</span>
                    <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                      Phòng {currentSelectedSession.room}
                    </span>
                    <span className="text-muted-foreground/60 hidden md:inline">•</span>
                    <span className="text-xs text-muted-foreground font-medium hidden md:inline">
                      {currentSelectedSession.teacher}
                    </span>
                  </div>

                  {/* Cạnh phải: Droplist và nút [Chọn] */}
                  <div className="flex items-center gap-1 shrink-0">
                    <DropdownMenu>
                      <div className="inline-flex rounded-md shadow-2xs">
                        <Button
                          type="button"
                          size="xs"
                          onClick={() => handleConfirmDirectAssign(rec, currentSelectedSession)}
                          className="h-7 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-r-none cursor-pointer"
                          title="Chọn buổi này và ghép lớp ngay"
                        >
                          Chọn
                        </Button>

                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            size="xs"
                            className="h-7 px-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-l-none border-l border-emerald-500/40 cursor-pointer"
                            title="Mở danh sách các buổi tiếp theo để chọn buổi khác"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                      </div>

                      <DropdownMenuContent align="end" className="w-[380px] p-1.5 space-y-1">
                        <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground border-b border-border/40">
                          Chọn buổi ghép lớp ({rec.name})
                        </div>
                        {upcomingList.map((sess, idx) => (
                          <DropdownMenuItem
                            key={sess.no}
                            onClick={() => {
                              setSelectedSessionNoByClass((prev) => ({ ...prev, [rec.code]: sess.no }))
                              handleConfirmDirectAssign(rec, sess)
                            }}
                            className={cn(
                              "flex flex-col items-start gap-0.5 p-2 rounded-md cursor-pointer text-xs",
                              currentSelectedSession.no === sess.no && "bg-emerald-50 dark:bg-emerald-950/40 font-semibold"
                            )}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-foreground font-mono">
                                {sess.day}, {sess.date} ({sess.time})
                              </span>
                              {idx === 0 && (
                                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded">
                                  Buổi đầu
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] truncate w-full">
                              <span className="truncate">{sess.topic}</span>
                              <span>•</span>
                              <span>Phòng {sess.room}</span>
                              <span>•</span>
                              <span>{sess.teacher}</span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
