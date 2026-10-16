'use client'

import { useState, useMemo } from 'react'
import {
  Calendar,
  CheckCircle2,
  Clock,
  History,
  Phone,
  UserCheck,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ClassRecord, TeacherHistoryEntry, SubstituteTeacher } from '@/mocks/classRecords'

interface ClassesTeacherHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cls: ClassRecord
}

export function ClassesTeacherHistoryDialog({
  open,
  onOpenChange,
  cls,
}: ClassesTeacherHistoryDialogProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'assignment' | 'substitute'>('all')

  // Real or realistic fallback assignment history
  const assignments: TeacherHistoryEntry[] = useMemo(() => {
    if (cls.teacherHistory && cls.teacherHistory.length > 0) {
      return cls.teacherHistory
    }
    return [
      {
        name: cls.teacher || 'Hoàng Thị Mai',
        role: 'Chủ nhiệm / GV Chính',
        startDate: cls.startDate || '15/07/2026',
        phone: cls.teacherPhone || '0912 345 678',
        isCurrent: true,
      },
      {
        name: 'Nguyễn Thị Hoa',
        role: 'GV Tiếng Anh',
        startDate: '01/01/2026',
        endDate: cls.startDate || '15/07/2026',
        phone: '0903 234 567',
        reason: 'Điều chuyển phụ trách lớp mới theo phân bổ nhân sự',
        isCurrent: false,
      },
      {
        name: 'David Wilson',
        role: 'GV Bản ngữ',
        startDate: '01/01/2026',
        endDate: '30/04/2026',
        phone: '0988 776 554',
        reason: 'Hoàn thành kỳ giảng dạy bản ngữ 4 tháng',
        isCurrent: false,
      },
    ]
  }, [cls])

  // Real or realistic fallback substitute history
  const substitutes: SubstituteTeacher[] = useMemo(() => {
    if (cls.substituteTeachers && cls.substituteTeachers.length > 0) {
      return cls.substituteTeachers
    }
    return [
      {
        name: 'Trịnh Minh Đức',
        date: '06/06/2026',
        reason: 'Giáo viên chính nghỉ phép đột xuất (việc gia đình)',
      },
      {
        name: cls.teacher || 'Hoàng Thị Mai',
        date: '04/06/2026',
        reason: 'Dạy thay giáo viên Phạm Mỹ Linh (nghỉ ốm)',
      },
    ]
  }, [cls])

  const showAssignments = activeTab === 'all' || activeTab === 'assignment'
  const showSubstitutes = activeTab === 'all' || activeTab === 'substitute'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl">
        {/* Header */}
        <DialogHeader className="p-4 pb-3 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <History className="h-4.5 w-4.5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Lịch sử thay đổi & phân công giáo viên
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Lớp {cls.name} ({cls.code}) • Cơ sở: {cls.branch}
              </DialogDescription>
            </div>
          </div>

          {/* Current Staffing Summary Card */}
          <div className="mt-3 grid grid-cols-2 gap-2 p-2 rounded-lg bg-background border border-border/60 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[11px] shrink-0">
                {(cls.teacher || 'G').charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">GV Chủ nhiệm / Chính</span>
                <span className="font-semibold text-foreground truncate block text-xs">{cls.teacher || 'Hoàng Thị Mai'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-border/60 pl-2">
              <div className="h-7 w-7 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-[11px] shrink-0">
                {(cls.assistant || 'H').charAt(0)}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-muted-foreground uppercase font-medium block">Trợ giảng hiện tại</span>
                <span className="font-semibold text-foreground truncate block text-xs">{cls.assistant || 'Hoàng Anh'}</span>
              </div>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 pt-1">
            <Button
              type="button"
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setActiveTab('all')}
              className="h-6 text-[11px]"
            >
              Tất cả ({assignments.length + substitutes.length})
            </Button>
            <Button
              type="button"
              variant={activeTab === 'assignment' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setActiveTab('assignment')}
              className="h-6 text-[11px]"
            >
              Phân công chính ({assignments.length})
            </Button>
            <Button
              type="button"
              variant={activeTab === 'substitute' ? 'default' : 'outline'}
              size="xs"
              onClick={() => setActiveTab('substitute')}
              className="h-6 text-[11px]"
            >
              Dạy thay / Đổi ca ({substitutes.length})
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. Official Assignment History */}
          {showAssignments && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-primary" />
                  Lịch sử phân công chính thức ({assignments.length})
                </span>
              </div>

              <div className="space-y-2">
                {assignments.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'p-2.5 rounded-lg border text-xs transition-colors',
                      item.isCurrent
                        ? 'border-emerald-300/80 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-emerald-950/20'
                        : 'border-border/60 bg-muted/15'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={cn(
                            'h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
                            item.isCurrent
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {item.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-foreground text-xs">{item.name}</span>
                            <span className="text-[11px] text-muted-foreground font-normal">({item.role})</span>
                            {item.isCurrent ? (
                              <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 text-[10px] h-4.5 font-semibold gap-1">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                <span>Đang phụ trách</span>
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] h-4.5 text-muted-foreground">
                                Đã bàn giao
                              </Badge>
                            )}
                          </div>

                          {item.phone && (
                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                              <Phone className="h-2.5 w-2.5" />
                              <span>{item.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1 justify-end font-mono">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {item.startDate} {item.endDate ? `→ ${item.endDate}` : '→ Nay'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.reason && (
                      <div className="mt-2 pt-1.5 border-t border-border/40 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground me-1">Lý do điều chuyển:</span>
                        {item.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Substitute / Cover Teaching History */}
          {showSubstitutes && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  Lịch sử dạy thay / đổi ca ({substitutes.length})
                </span>
              </div>

              <div className="space-y-2">
                {substitutes.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-6 w-6 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-[10.5px] shrink-0">
                          {sub.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground text-xs">{sub.name}</span>
                          <span className="text-[11px] text-muted-foreground ml-1.5">(Giáo viên dạy thay)</span>
                        </div>
                      </div>

                      <Badge variant="outline" className="text-[10px] h-4.5 font-mono text-amber-700 dark:text-amber-400 border-amber-300/60">
                        {sub.date}
                      </Badge>
                    </div>

                    {sub.reason && (
                      <div className="mt-1.5 pt-1.5 border-t border-border/40 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground me-1">Lý do:</span>
                        {sub.reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/60 bg-muted/10 flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => onOpenChange(false)}
            className="h-7 px-3 text-xs"
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
