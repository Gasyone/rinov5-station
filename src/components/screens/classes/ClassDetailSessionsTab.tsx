'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'

interface ClassDetailSessionsTabProps {
  classNameFilter: string
}

export function ClassDetailSessionsTab({ classNameFilter }: ClassDetailSessionsTabProps) {
  const sessions = [
    {
      id: 'S-01',
      name: 'Buổi 1: Orientation & Diagnostic Test',
      date: '2025-05-10',
      teacher: 'Ms. Emily Watson',
      attendance: 'completed',
      attendanceLabel: 'Đã điểm danh (18/20)',
      assessment: 'completed',
      assessmentLabel: 'Đã nhận xét',
    },
    {
      id: 'S-02',
      name: 'Buổi 2: Academic Reading - Skimming & Scanning',
      date: '2025-05-17',
      teacher: 'Ms. Emily Watson',
      attendance: 'completed',
      attendanceLabel: 'Đã điểm danh (19/20)',
      assessment: 'completed',
      assessmentLabel: 'Đã nhận xét',
    },
    {
      id: 'S-03',
      name: 'Buổi 3: Academic Writing Task 1 - Intro',
      date: '2025-05-24',
      teacher: 'Ms. Emily Watson',
      attendance: 'pending',
      attendanceLabel: 'Chưa điểm danh',
      assessment: 'pending',
      assessmentLabel: 'Chưa nhận xét',
    },
    {
      id: 'S-04',
      name: 'Buổi 4: Speaking Part 1 - Common Topics',
      date: '2025-05-31',
      teacher: 'Ms. Emily Watson',
      attendance: 'upcoming',
      attendanceLabel: 'Chưa diễn ra',
      assessment: 'upcoming',
      assessmentLabel: 'Chưa diễn ra',
    },
  ]

  return (
    <div className="space-y-6">
      <Panel title="Danh sách các buổi học & Tiến độ">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Mã buổi</TableHead>
              <TableHead className="font-semibold">Nội dung bài học</TableHead>
              <TableHead className="font-semibold">Ngày học</TableHead>
              <TableHead className="font-semibold">Giáo viên</TableHead>
              <TableHead className="font-semibold">Điểm danh</TableHead>
              <TableHead className="font-semibold">Nhận xét học tập</TableHead>
              <TableHead className="font-semibold text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs font-semibold">{s.id}</TableCell>
                <TableCell className="font-medium text-sm">{s.name}</TableCell>
                <TableCell className="text-sm">{new Date(s.date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className="text-sm">{s.teacher}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClass(s.attendance)}>
                    {s.attendanceLabel}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClass(s.assessment)}>
                    {s.assessmentLabel}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {s.attendance === 'pending' ? (
                    <Button size="xs" variant="outline" className="text-xs">
                      Điểm danh
                    </Button>
                  ) : s.attendance === 'completed' ? (
                    <Button size="xs" variant="ghost" className="text-xs">
                      Xem lại
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}
