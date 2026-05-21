'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Panel } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'

export function StudentDetailAcademicTab() {
  const attendanceHistory = [
    {
      session: 'Buổi 12: Writing - Academic Vocabulary',
      date: '2025-05-17',
      status: 'present',
      label: 'Có mặt',
      note: 'Đi học đúng giờ',
    },
    {
      session: 'Buổi 11: Speaking - Part 2 Card cues',
      date: '2025-05-10',
      status: 'absent',
      label: 'Vắng phép',
      note: 'Xin nghỉ ốm',
    },
    {
      session: 'Buổi 10: Reading - True/False/Not Given',
      date: '2025-05-03',
      status: 'present',
      label: 'Có mặt',
      note: 'Muộn 5 phút',
    },
  ]

  const assessments = [
    {
      session: 'Buổi 12: Writing - Academic Vocabulary',
      comment: 'Viết tốt, sử dụng nhiều cấu trúc so sánh hay. Cần chú ý lỗi chia động từ.',
      score: '6.5',
      teacher: 'Ms. Emily Watson',
    },
    {
      session: 'Buổi 10: Reading - True/False/Not Given',
      comment: 'Hoàn thành tốt phần đọc hiểu, nắm chắc cách loại trừ phương án sai.',
      score: '7.0',
      teacher: 'Ms. Emily Watson',
    },
  ]

  const homework = [
    {
      title: 'BTVN Buổi 12: IELTS Writing Task 1 Practice',
      score: '8 / 10',
      status: 'completed',
      submittedDate: '2025-05-19',
      review: 'Excellent structure and logical flow.',
    },
    {
      title: 'BTVN Buổi 10: Reading Comprehension Test 3',
      score: '7 / 10',
      status: 'completed',
      submittedDate: '2025-05-05',
      review: 'Good, but double check the spelling next time.',
    },
  ]

  return (
    <div className="space-y-6">
      <Panel title="Lịch sử điểm danh (3 buổi gần nhất)">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Buổi học</TableHead>
              <TableHead className="font-semibold">Ngày học</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold">Ghi chú</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceHistory.map((att, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-sm font-medium">{att.session}</TableCell>
                <TableCell className="text-sm">{new Date(att.date).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClass(att.status)}>
                    {att.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{att.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Panel title="Đánh giá & Nhận xét từ Giáo viên">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Buổi học</TableHead>
              <TableHead className="font-semibold">Nhận xét chi tiết</TableHead>
              <TableHead className="font-semibold">Điểm số</TableHead>
              <TableHead className="font-semibold">Giáo viên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assessments.map((ass, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-sm font-medium">{ass.session}</TableCell>
                <TableCell className="text-sm max-w-[300px]">{ass.comment}</TableCell>
                <TableCell className="text-sm font-mono font-bold text-emerald-600">{ass.score}</TableCell>
                <TableCell className="text-sm">{ass.teacher}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>

      <Panel title="Kết quả Bài tập về nhà">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Tên bài tập</TableHead>
              <TableHead className="font-semibold">Ngày nộp</TableHead>
              <TableHead className="font-semibold">Điểm số</TableHead>
              <TableHead className="font-semibold">Đánh giá của Trợ giảng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {homework.map((hw, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-sm font-medium">{hw.title}</TableCell>
                <TableCell className="text-sm">{new Date(hw.submittedDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell className="text-sm font-mono font-bold text-indigo-600">{hw.score}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{hw.review}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Panel>
    </div>
  )
}
