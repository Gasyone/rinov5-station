'use client'

import { useState } from 'react'
import {
  User,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  History,
  Eye,
  CalendarPlus,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  StatusBadge,
  AppAvatar,
  StudentProfileHoverCard,
  PersonnelHoverCard,
  type StudentProfileItem,
} from '@/components/shared'
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
}

export function StudentDetailRecommendedClasses({
  recommendedClasses,
  currentPackage,
  packages,
  onSelectClassRecord,
  onOpenAssignClass,
}: StudentDetailRecommendedClassesProps) {
  const [expandedUpcomingClasses, setExpandedUpcomingClasses] = useState<Record<string, boolean>>({})

  const toggleExpandUpcoming = (classCode: string) => {
    setExpandedUpcomingClasses((prev) => ({
      ...prev,
      [classCode]: !prev[classCode],
    }))
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
          const teachers = (rec.teacher || '').split(/[,/&]| và /).map((t) => t.trim()).filter(Boolean)

          const isExpanded = !!expandedUpcomingClasses[rec.code]
          const upcomingList = [
            { no: 14, date: '28/07/2026', time: '17:45 - 19:15', topic: 'Bài 14: Reading Skills Practice', room: rec.room || 'A101', teacher: teachers[0] || 'Cô Lan', label: 'Hôm nay / Sắp tới' },
            { no: 15, date: '30/07/2026', time: '17:45 - 19:15', topic: 'Bài 15: Listening & Speaking Drills', room: rec.room || 'A101', teacher: teachers[1] || 'Cô Nga', label: 'Sắp diễn ra' },
            { no: 16, date: '01/08/2026', time: '17:45 - 19:15', topic: 'Bài 16: Writing Task 1 Strategy', room: rec.room || 'A101', teacher: teachers[0] || 'Cô Lan', label: 'Sắp diễn ra' },
            { no: 17, date: '04/08/2026', time: '17:45 - 19:15', topic: 'Bài 17: Grammar & Collocations', room: rec.room || 'A101', teacher: teachers[0] || 'Cô Lan', label: 'Sắp diễn ra' },
            { no: 18, date: '06/08/2026', time: '17:45 - 19:15', topic: 'Bài 18: Mid-term Assessment', room: rec.room || 'A101', teacher: teachers[1] || 'Cô Nga', label: 'Sắp diễn ra' },
          ]

          const perf = getClassPerformance(rec.code)
          const attendanceNum = parseFloat(perf.attendanceRate) || 91.7
          const hwNum = parseFloat(perf.homeworkSubmissionRate) || 91.7

          const teacherHistoryList = [
            { name: teachers[0] || 'Cô Lan', role: 'Chủ nhiệm', startDate: '01/05/2026', isCurrent: true },
            { name: teachers[1] || 'Cô Nga', role: 'Giảng dạy', startDate: '01/05/2026', isCurrent: true },
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

          return (
            <div
              key={rec.id}
              className="border border-border/60 rounded-xl overflow-hidden bg-card shadow-2xs transition-all duration-200 hover:border-border"
            >
              {/* Card Header: Minimalist & Clean */}
              <div className="border-b border-border/40 px-4 py-3 bg-muted/10 dark:bg-zinc-900/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                  <div className="flex flex-col min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="font-bold text-foreground text-sm sm:text-base truncate max-w-[280px]">
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

                  <div className="shrink-0 pt-1 sm:pt-0">
                    <div className="flex items-center gap-3 bg-muted/40 dark:bg-zinc-800/40 px-3 py-1.5 rounded-lg border border-border/30">
                      <div className="text-center space-y-0.5 min-w-[55px]">
                        <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">Chuyên cần</div>
                        <div className="text-xs font-bold text-foreground">{attendanceNum}%</div>
                      </div>
                      <div className="h-5 w-[1px] bg-border/40" />
                      <div className="text-center space-y-0.5 min-w-[45px]">
                        <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">BTVN</div>
                        <div className="text-xs font-bold text-foreground">{hwNum}%</div>
                      </div>
                      <div className="h-5 w-[1px] bg-border/40" />
                      <div className="text-center space-y-0.5 min-w-[55px]">
                        <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">Điểm TB</div>
                        <div className="text-xs font-bold text-foreground">
                          {perf.latestScore.score !== '—' ? perf.latestScore.score : '7.0'}
                          <span className="text-[9.5px] font-normal text-muted-foreground">/10</span>
                        </div>
                      </div>
                      <div className="h-5 w-[1px] bg-border/40" />
                      <div className="text-center space-y-0.5 min-w-[45px]">
                        <div className="text-[9.5px] text-muted-foreground font-medium uppercase tracking-wider">Rating</div>
                        <div className="text-xs font-bold text-foreground flex items-center justify-center gap-0.5">
                          4.5<Star className="h-3 w-3 text-amber-500 fill-amber-500 inline" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Body */}
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
                            id: `stu-rec-${sIdx + 1}`,
                            name: sName,
                            code: `STU-2026-0${sIdx + 1}`,
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
                              <div className="cursor-pointer transition-transform hover:scale-110" title={`Xem profile học viên: ${sName}`}>
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
                          onClick={() => onSelectClassRecord(rec, 'roster')}
                          className="h-5 px-2 rounded-full bg-muted hover:bg-muted/80 text-[9.5px] font-semibold text-muted-foreground hover:text-foreground flex items-center justify-center shrink-0 cursor-pointer transition-colors border border-border/40"
                          title={`Nhấp để xem danh sách toàn bộ ${enrolled} học viên trong lớp ${rec.name}`}
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
                    {rec.scheduleSlots && rec.scheduleSlots.length > 0 ? (
                      (() => {
                        const teachers = (rec.teacher || '')
                          .split(/[,/&]| và /)
                          .map((t) => t.trim())
                          .filter(Boolean)
                        return (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {rec.scheduleSlots.map((slot, idx) => {
                              const slotTeacher = (slot.teachers && slot.teachers.length > 0)
                                ? slot.teachers[0]
                                : (teachers[idx % teachers.length] || teachers[0] || 'Cô Lan')

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
                                    <div className="flex items-center justify-center gap-1 truncate max-w-[100px] cursor-pointer hover:opacity-80 transition-opacity text-[10px] text-muted-foreground" title={`Nhấp/Rê chuột để xem thông tin giáo viên: ${slotTeacher}`}>
                                      <AppAvatar
                                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${slotTeacher}`}
                                        name={slotTeacher}
                                        size="xs"
                                        className="h-3.5 w-3.5 shrink-0 border border-primary/20 cursor-pointer"
                                      />
                                      <span className="font-medium text-foreground text-[10px] truncate">{slotTeacher}</span>
                                    </div>
                                  </PersonnelHoverCard>
                                </div>
                              )
                            })}

                            <ClassTeacherHistoryPopover
                              trigger={historyTrigger}
                              currentTeacher={rec.teacher}
                              teacherHistory={teacherHistoryList}
                            />
                          </div>
                        )
                      })()
                    ) : (
                      <div className="text-xs text-muted-foreground italic text-right">
                        {rec.schedule || 'Chưa cập nhật lịch học'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Buổi học tiếp theo - Streamlined Bar */}
                <div className="space-y-1.5 text-xs pt-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpandUpcoming(rec.code)}
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

                    <SyllabusProfileHoverCard cls={rec} align="end">
                      <span
                        role="button"
                        tabIndex={0}
                        className="text-xs font-medium text-primary hover:underline cursor-pointer truncate max-w-[260px] block text-right"
                        title="Nhấp chuột để xem thông tin Khung chương trình"
                      >
                        KCT: {rec.syllabus && rec.syllabus !== '—' ? rec.syllabus : 'IELTS Junior v2.1'}
                      </span>
                    </SyllabusProfileHoverCard>
                  </div>

                  {!isExpanded ? (
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-muted/30 dark:bg-zinc-900/30 border border-border/30 px-3 py-2 rounded-lg">
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-semibold text-primary">
                          28/07/2026 (17:45 – 19:15)
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium text-foreground truncate max-w-[320px]">
                          Bài 14: Reading Skills Practice
                        </span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground shrink-0">
                        Phòng {rec.room || 'A101'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <div className="space-y-1">
                        {upcomingList.map((sess) => (
                          <div
                            key={sess.no}
                            className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-xs"
                          >
                            <div className="flex flex-wrap items-center gap-2 min-w-0">
                              <span className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[9.5px] font-bold text-primary shrink-0">
                                Buổi {sess.no}
                              </span>
                              <span className="font-mono text-xs font-semibold text-foreground">{sess.date} ({sess.time})</span>
                              <span className="text-[11px] text-muted-foreground truncate max-w-[220px]" title={sess.topic}>
                                • {sess.topic}
                              </span>
                              <span className="text-[10.5px] font-mono text-muted-foreground">• Phòng {sess.room}</span>
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
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer hover:opacity-80 transition-opacity" title={`Rê chuột/Nhấp để xem thông tin giáo viên: ${sess.teacher}`}>
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

                {/* Card Footer: Action buttons */}
                <div className="pt-2 border-t border-border/30 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="text-[10.5px] h-7 px-3 font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => onSelectClassRecord(rec, 'sessions')}
                    title="Xem lịch chi tiết các buổi để chọn ghép lớp"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Chi tiết buổi học
                  </Button>

                  <Button
                    type="button"
                    size="xs"
                    className="text-[10.5px] h-7 px-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
                    onClick={() => {
                      const pkgToAssign = currentPackage || packages[0]
                      if (pkgToAssign) onOpenAssignClass(pkgToAssign)
                    }}
                  >
                    <CalendarPlus className="h-3.5 w-3.5 mr-1" /> Ghép lớp này
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
