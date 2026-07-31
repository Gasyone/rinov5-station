/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useMemo, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/shared'
import type { RoadmapSession } from './detail/classesDetailTypes'
import type { ClassRecord } from '@/mocks/classRecords'

export interface SelectedStudentItem {
  id: string
  name: string
  code: string
  status: string
}

interface RosterSessionSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classRecord: ClassRecord
  sessions: RoadmapSession[]
  selectedStudents: SelectedStudentItem[]
  onConfirm: (startSession: RoadmapSession) => void
}

function getDayOfWeekText(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10) - 1
    const year = parseInt(parts[2], 10)
    const dateObj = new Date(year, month, day)
    const dayIndex = dateObj.getDay()
    const dayNames = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
    return `${dayNames[dayIndex]}, ${dateStr}`
  }
  return dateStr
}

export function RosterSessionSelectionDialog({
  open,
  onOpenChange,
  classRecord,
  sessions,
  selectedStudents,
  onConfirm,
}: RosterSessionSelectionDialogProps) {
  const [startSessionDate, setStartSessionDate] = useState<string>('')

  const currentEnrolled = classRecord.enrolledStudents || 0
  const maxStudents = classRecord.maxStudents || 15
  const selectCount = selectedStudents.length
  const totalAfter = currentEnrolled + selectCount
  const isFull = currentEnrolled >= maxStudents
  const isOverCapacity = totalAfter > maxStudents

  // Only list 5 sessions as requested
  const displaySessions = useMemo(() => {
    return sessions.slice(0, 5)
  }, [sessions])

  // Automatically select the first session when dialog opens
  useEffect(() => {
    if (open && displaySessions && displaySessions.length > 0) {
      const activeSession = displaySessions[0]
      const val = `${activeSession.date} (Buổi ${activeSession.sessionNumber}: ${activeSession.topic})`
      setStartSessionDate(val)
    }
  }, [open, displaySessions])

  const handleConfirm = () => {
    const selectedSession = displaySessions.find(
      (s) => `${s.date} (Buổi ${s.sessionNumber}: ${s.topic})` === startSessionDate
    )
    if (selectedSession) {
      onConfirm(selectedSession)
    }
  }

  const getInitials = (name: string) => {
    if (!name || name === '—') return ''
    return name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase()
  }

  const studentNamesText = selectedStudents.map((s) => s.name).join(', ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1000px] h-[650px] flex flex-col p-0 overflow-hidden bg-background shadow-2xl rounded-xl">
        <DialogHeader className="px-5 pt-4 pb-3 border-b bg-muted/20">
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-base font-bold text-foreground">
              Chọn buổi bắt đầu học viên mới
            </DialogTitle>
            <div className="text-xs text-muted-foreground flex items-center gap-x-3 gap-y-1 flex-wrap">
              <span>Học viên: <strong className="text-foreground">{studentNamesText}</strong></span>
              <span className="text-muted-foreground/30">|</span>
              <span>Lớp: <strong className="text-primary font-semibold">{classRecord.name || classRecord.code}</strong></span>
              <span className="text-muted-foreground/30">|</span>
              <span>Khung chương trình: <strong className="text-foreground">{classRecord.syllabus || '—'}</strong></span>
              <span className="text-muted-foreground/30">|</span>
              <span>Trình độ: <strong className="text-foreground">{classRecord.level || '—'} {classRecord.subLevel ? `(${classRecord.subLevel})` : ''}</strong></span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1.5">
                Sĩ số hiện tại: 
                <strong className={isFull ? "text-destructive font-bold" : "text-foreground"}>
                  {currentEnrolled}/{maxStudents}
                </strong>
                {isFull && (
                  <span className="text-[9px] bg-destructive/10 text-destructive border border-destructive/20 px-1.5 py-0.25 rounded font-bold uppercase tracking-wider shrink-0">
                    Đầy
                  </span>
                )}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {displaySessions.length === 0 ? (
            <EmptyState
              title="Không tìm thấy buổi học"
              description="Lớp học này hiện tại chưa được lập lộ trình buổi học."
              className="py-12"
            />
          ) : (
            <div className="space-y-3 pt-0.5">
              <Table className="w-full">
                <TableHeader className="sticky top-0 z-10 bg-background">
                  <TableRow className="hover:bg-transparent border-b">
                    <TableHead className="w-[5%] text-center px-1 sticky top-0 bg-background z-10 border-b"></TableHead>
                    <TableHead className="w-[22%] px-2 sticky top-0 bg-background z-10 border-b">Thời gian</TableHead>
                    <TableHead className="w-[18%] px-2 sticky top-0 bg-background z-10 border-b">Dung lượng phòng</TableHead>
                    <TableHead className="w-[37%] px-2 sticky top-0 bg-background z-10 border-b">Nội dung bài học</TableHead>
                    <TableHead className="w-[18%] px-2 pr-4 sticky top-0 bg-background z-10 border-b">Giảng viên</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displaySessions.map((session: RoadmapSession) => {
                    const sessionValStr = `${session.date} (Buổi ${session.sessionNumber}: ${session.topic})`
                    const isSelected = startSessionDate === sessionValStr
                    return (
                      <TableRow
                        key={session.id}
                        onClick={() => setStartSessionDate(sessionValStr)}
                        className={`cursor-pointer hover:bg-muted/40 align-middle border-b-0 ${
                          isSelected ? 'bg-primary/5 hover:bg-primary/5' : ''
                        }`}
                      >
                        <TableCell className="text-center py-2.5 px-1 align-middle" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="radio"
                            name="selectedSession"
                            checked={isSelected}
                            onChange={() => setStartSessionDate(sessionValStr)}
                            className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="py-2.5 px-2 text-xs font-semibold text-foreground align-middle">
                          <div>{getDayOfWeekText(session.date)}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-normal">{session.startTime} - {session.endTime}</div>
                        </TableCell>
                          <TableCell className="py-2.5 px-2 text-xs text-foreground align-middle">
                            <span className="font-semibold text-foreground">{classRecord.maxStudents || 15} chỗ</span>
                          </TableCell>
                          <TableCell className="py-2.5 px-2 text-xs text-foreground align-middle">
                            <div className="font-bold truncate max-w-[280px]" title={session.topic}>{session.topic}</div>
                            {session.description && (
                              <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[280px] truncate" title={session.description}>
                                {session.description}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="py-2.5 px-2 pr-4 text-xs text-muted-foreground align-middle">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5.5 w-5.5 border bg-primary/10 text-primary text-[9px] font-bold shrink-0">
                                <AvatarFallback className="font-bold">
                                  {getInitials(session.substituteTeacherName || session.teacherName)}
                                </AvatarFallback>
                              </Avatar>
                              {session.substituteTeacherName ? (
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className="line-through text-muted-foreground/60 truncate max-w-[80px]">{session.teacherName}</span>
                                  <span className="text-amber-600 dark:text-amber-400 font-bold truncate max-w-[80px]">
                                    {session.substituteTeacherName}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-semibold text-foreground truncate max-w-[100px]">{session.teacherName}</span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
        </div>

        <DialogFooter className="px-5 py-3 border-t bg-muted/10 flex flex-row items-center justify-between sm:justify-between gap-4">
          <div className="flex-1 min-w-0 text-left pr-4 select-none">
            {(isFull || isOverCapacity) && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                <span>
                  {isFull 
                    ? `Lớp đã đầy sĩ số (${currentEnrolled}/${maxStudents})`
                    : `Cảnh báo: Thêm học viên sẽ vượt quá sĩ số tối đa (${totalAfter}/${maxStudents})`
                  }
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-lg h-9 px-4">
              Hủy
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!startSessionDate}
              className="rounded-lg h-9 px-5"
            >
              Đồng ý
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
