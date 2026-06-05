'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Panel } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { Student } from '@/mocks/students'
import { ScheduleSummary } from '@/components/screens/classes/ScheduleSummary'
import { Plus, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface StudentDetailClassesTabProps {
  student: Student
}

export function StudentDetailClassesTab({ student }: StudentDetailClassesTabProps) {
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)

  const classes = student.enrolledClasses && student.enrolledClasses.length > 0
    ? student.enrolledClasses.map(cls => ({
        code: cls.classCode,
        name: cls.className,
        type: cls.type,
        scheduleSlots: cls.scheduleSlots,
        teacherName: cls.teacherName,
        status: cls.status,
        progress: cls.progress,
      }))
    : student.enrolledClass
    ? [
        {
          code: `CLS-${student.id.toUpperCase()}`,
          name: student.enrolledClass,
          type: 'offline' as const,
          scheduleSlots: [
            { dayOfWeek: 'Thứ 7', date: '07/06', startTime: '14:00', endTime: '16:00' }
          ],
          teacherName: 'Ms. Emily Watson',
          status: 'active',
          progress: '12 / 24 buổi',
        },
      ]
    : []

  const initials = (name: string) => {
    if (!name) return ''
    return name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
  }

  return (
    <div className="w-full space-y-4">
      {/* Tab Header Actions */}
      <div className="flex justify-between items-center bg-transparent border-0 select-none pb-2">
        <p className="text-xs text-muted-foreground">
          Đang theo học {classes ? classes.length : 0} lớp.
        </p>
        <Button
          type="button"
          size="sm"
          onClick={() => setIsMergeModalOpen(true)}
          className="whitespace-nowrap h-8"
        >
          <Plus className="h-4 w-4 mr-1.5 inline-block" /> Ghép lớp
        </Button>
      </div>

      <Panel title="Danh sách lớp đang học">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-semibold w-[15%]">Mã lớp</TableHead>
                <TableHead className="font-semibold w-[25%]">Tên lớp / Phân loại</TableHead>
                <TableHead className="font-semibold w-[25%]">Lịch học cố định</TableHead>
                <TableHead className="font-semibold w-[20%]">Giáo viên phụ trách</TableHead>
                <TableHead className="font-semibold w-[10%]">Tiến độ</TableHead>
                <TableHead className="font-semibold w-[10%]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-20 text-center text-muted-foreground italic">
                    Chưa ghi danh vào lớp học nào.
                  </TableCell>
                </TableRow>
              ) : (
                classes.map((cls, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-xs font-semibold">{cls.code}</TableCell>
                    <TableCell className="font-medium text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span>{cls.name}</span>
                        <Badge variant="outline" className={`text-[9px] w-fit font-semibold px-1.5 py-0.5 uppercase ${getStatusBadgeClass(cls.type)}`}>
                          {cls.type === 'offline' ? 'Offline' : 'Online Tutor'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <ScheduleSummary scheduleSlots={cls.scheduleSlots} className={cls.name} />
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary" title={cls.teacherName}>
                          {initials(cls.teacherName)}
                        </div>
                        <span className="font-medium text-foreground text-xs">{cls.teacherName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-foreground">{cls.progress}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClass(cls.status)}>
                        {cls.status === 'active' ? 'Đang học' : cls.status === 'session_ended' ? 'Hết buổi' : cls.status === 'pending_transfer' ? 'Chờ chuyển' : 'Không hoạt động'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Panel>

      {/* Modal Ghép lớp (Chưa phát triển) */}
      <Dialog open={isMergeModalOpen} onOpenChange={setIsMergeModalOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl border bg-background p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">Ghép lớp học viên</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center space-y-4">
            <GraduationCap className="h-12 w-12 text-primary/80 mx-auto animate-bounce" />
            <p className="text-sm text-foreground font-semibold">Chức năng Ghép lớp đang được phát triển.</p>
            <p className="text-xs text-muted-foreground">Chúng tôi sẽ sớm cập nhật tính năng này trong các phiên bản tiếp theo.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsMergeModalOpen(false)} className="rounded-lg">
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
