'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { EmptyState, StatusBadge } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { EnrolledClass } from '@/mocks/students'
import { GraduationCap, MapPin, Plus, Eye } from 'lucide-react'
import { ScheduleSummary } from '@/components/screens/classes/ScheduleSummary'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { toast } from 'sonner'

interface StudentDetailClassesProps {
  classes: EnrolledClass[]
}

export function StudentDetailClasses({ classes }: StudentDetailClassesProps) {
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false)
  const [selectedClassRecord, setSelectedClassRecord] = useState<ClassRecord | null>(null)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false)

  const initials = (name: string) => {
    if (!name) return ''
    return name.split(' ').map((w) => w[0]).slice(-2).join('').toUpperCase()
  }

  const handleViewClassDetail = (classCode: string) => {
    const found = mockClassRecords.find((c) => c.code === classCode)
    if (found) {
      setSelectedClassRecord(found)
      setIsClassDetailOpen(true)
    } else {
      toast.error('Không tìm thấy thông tin chi tiết của lớp học này.')
    }
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

      {/* Main content: classes table or empty state */}
      {!classes || classes.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-8 w-8 text-muted-foreground" />}
          title="Chưa xếp lớp học nào"
          description="Học viên này chưa được phân bổ vào bất kỳ lớp học chính thức hoặc thử nghiệm nào."
          className="py-12"
        />
      ) : (
        <div className="w-full overflow-x-auto">
          <Table containerClassName="w-full">
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-[35%]">Lớp học</TableHead>
                <TableHead>Chủ nhiệm / Phòng</TableHead>
                <TableHead className="w-[25%]">Lịch học cố định</TableHead>
                <TableHead>Tiến độ lớp</TableHead>
                <TableHead>Thời gian học</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.classCode} className="hover:bg-muted/20">
                  {/* Lớp & Mã lớp */}
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-foreground text-xs truncate">{cls.className}</span>
                          <Badge variant="outline" className={`font-semibold px-1 py-0 rounded text-[8px] uppercase shrink-0 ${getStatusBadgeClass(cls.type)}`}>
                            {cls.type === 'offline' ? 'Offline' : 'Online Tutor'}
                          </Badge>
                        </div>
                        <span className="text-[9px] text-primary font-semibold font-mono">{cls.classCode}</span>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        title="Xem chi tiết lớp học"
                        onClick={() => handleViewClassDetail(cls.classCode)}
                        className="h-7 w-7 hover:bg-muted shrink-0 text-muted-foreground hover:text-primary rounded-md"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                      </Button>
                    </div>
                  </TableCell>
 
                   {/* GV & Phòng */}
                   <TableCell className="py-3 px-4 text-xs">
                     <div className="flex items-center gap-1.5 mb-1">
                       <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary" title={cls.teacherName}>
                         {initials(cls.teacherName)}
                       </div>
                       <span className="font-medium text-foreground">{cls.teacherName}</span>
                     </div>
                     <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium">
                       <MapPin className="h-3 w-3 shrink-0" />
                       Phòng: {cls.room || '-'}
                     </div>
                   </TableCell>
 
                   {/* Lịch học */}
                   <TableCell className="py-3 px-4">
                     {cls.scheduleSlots && cls.scheduleSlots.length > 0 ? (
                       <ScheduleSummary scheduleSlots={cls.scheduleSlots} className={cls.className} />
                     ) : (
                       <span className="text-muted-foreground/50 text-xs">-</span>
                     )}
                   </TableCell>
 
                   {/* Tiến độ */}
                   <TableCell className="py-3 px-4 text-xs font-semibold text-foreground">
                     {cls.progress || '-'}
                   </TableCell>
 
                   {/* Thời gian */}
                   <TableCell className="py-3 px-4 text-xs text-muted-foreground font-medium">
                     <div>Từ: {cls.startDate ? new Date(cls.startDate).toLocaleDateString('vi-VN') : '-'}</div>
                     <div className="text-[10px]">Đến: {cls.endDate ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '-'}</div>
                   </TableCell>
 
                   {/* Trạng thái */}
                   <TableCell className="py-3 px-4">
                     <StatusBadge
                       status={cls.status}
                       label={
                         cls.status === 'active'
                           ? 'Đang học'
                           : cls.status === 'session_ended'
                           ? 'Hết buổi'
                           : cls.status === 'pending_transfer'
                           ? 'Chờ chuyển'
                           : cls.status === 'wait_for_assignment'
                           ? 'Chờ xếp'
                           : cls.status === 'absent' || cls.status === 'excused'
                           ? 'Xin nghỉ'
                           : 'Không hoạt động'
                       }
                     />
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
         </div>
       )}

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

      {/* Modal Chi tiết Lớp học */}
      {selectedClassRecord && (
        <ClassesDetailDialog
          cls={selectedClassRecord}
          open={isClassDetailOpen}
          onOpenChange={setIsClassDetailOpen}
        />
      )}
    </div>
  )
}
