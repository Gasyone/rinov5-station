'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Panel } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { Student } from '@/mocks/students'

interface StudentDetailClassesTabProps {
  student: Student
}

export function StudentDetailClassesTab({ student }: StudentDetailClassesTabProps) {
  const classes = student.enrolledClass
    ? [
        {
          name: student.enrolledClass,
          code: `CLS-${student.id.toUpperCase()}`,
          branch: student.branch,
          schedule: 'Thứ 7 (14:00 - 16:00)',
          status: 'active',
          progress: '12 / 24 buổi',
        },
      ]
    : []

  const upcomingSessions = student.enrolledClass
    ? [
        {
          id: 'SS-101',
          name: 'Buổi 13: Writing Task 1 - Bar Charts',
          date: '2025-05-24',
          time: '14:00 - 16:00',
          room: 'Phòng 204 (Tầng 2)',
          teacher: 'Ms. Emily Watson',
        },
        {
          id: 'SS-102',
          name: 'Buổi 14: Writing Task 1 - Line Graphs',
          date: '2025-05-31',
          time: '14:00 - 16:00',
          room: 'Phòng 204 (Tầng 2)',
          teacher: 'Ms. Emily Watson',
        },
        {
          id: 'SS-103',
          name: 'Buổi 15: Listening - Multiple Choice',
          date: '2025-06-07',
          time: '14:00 - 16:00',
          room: 'Phòng 204 (Tầng 2)',
          teacher: 'Ms. Emily Watson',
        },
      ]
    : []

  return (
    <div className="space-y-6">
      <Panel title="Danh sách lớp đang học">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Mã lớp</TableHead>
              <TableHead className="font-semibold">Tên lớp</TableHead>
              <TableHead className="font-semibold">Lịch học cố định</TableHead>
              <TableHead className="font-semibold">Tiến độ</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-muted-foreground italic">
                  Chưa ghi danh vào lớp học nào.
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono text-xs font-semibold">{cls.code}</TableCell>
                  <TableCell className="font-medium text-sm">{cls.name}</TableCell>
                  <TableCell className="text-sm">{cls.schedule}</TableCell>
                  <TableCell className="text-sm">{cls.progress}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeClass(cls.status)}>
                      Đang học
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Panel>

      <Panel title="Lịch học 3 buổi tiếp theo">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Buổi học</TableHead>
              <TableHead className="font-semibold">Ngày học</TableHead>
              <TableHead className="font-semibold">Ca học</TableHead>
              <TableHead className="font-semibold">Phòng học</TableHead>
              <TableHead className="font-semibold">Giáo viên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingSessions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-20 text-center text-muted-foreground italic">
                  Chưa có lịch học sắp tới.
                </TableCell>
              </TableRow>
            ) : (
              upcomingSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="text-sm font-medium">{session.name}</TableCell>
                  <TableCell className="text-sm">{new Date(session.date).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-sm">{session.time}</TableCell>
                  <TableCell className="text-sm">{session.room}</TableCell>
                  <TableCell className="text-sm">{session.teacher}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}
