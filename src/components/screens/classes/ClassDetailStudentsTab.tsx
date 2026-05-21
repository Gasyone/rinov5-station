'use client'

import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Panel, ConfirmDialog } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { mockStudents } from '@/mocks/students'

interface ClassDetailStudentsTabProps {
  classNameFilter: string
}

export function ClassDetailStudentsTab({ classNameFilter }: ClassDetailStudentsTabProps) {
  const initialStudents = useMemo(() => {
    return mockStudents.filter((s) => s.enrolledClass === classNameFilter)
  }, [classNameFilter])

  const [students, setStudents] = useState(initialStudents)
  const [removeStudentId, setRemoveStudentId] = useState<string | null>(null)

  const selectedStudent = students.find((s) => s.id === removeStudentId)

  const handleRemove = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId))
  }

  return (
    <div className="space-y-6">
      <Panel
        title="Danh sách học viên trong lớp"
        actions={
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Thêm học viên
          </Button>
        }
      >
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-semibold">Mã học viên</TableHead>
              <TableHead className="font-semibold">Họ tên</TableHead>
              <TableHead className="font-semibold">Số điện thoại</TableHead>
              <TableHead className="font-semibold">Tỷ lệ chuyên cần</TableHead>
              <TableHead className="font-semibold">Trạng thái</TableHead>
              <TableHead className="font-semibold text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-20 text-center text-muted-foreground italic">
                  Không có học viên nào trong lớp này.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {`STU-00${student.id.replace('s', '')}`}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{student.name}</TableCell>
                  <TableCell className="text-sm">{student.phone || '-'}</TableCell>
                  <TableCell className="text-sm">92% (11/12 buổi)</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeClass(student.status)}>
                      Đang học
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setRemoveStudentId(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Panel>

      <ConfirmDialog
        open={removeStudentId !== null}
        onOpenChange={(open) => { if (!open) setRemoveStudentId(null) }}
        title="Xóa học viên khỏi lớp"
        description={
          selectedStudent
            ? `Bạn có chắc chắn muốn xóa học viên ${selectedStudent.name} khỏi lớp ${classNameFilter}?`
            : ''
        }
        variant="destructive"
        onConfirm={() => {
          if (removeStudentId) {
            handleRemove(removeStudentId)
            setRemoveStudentId(null)
          }
        }}
      />
    </div>
  )
}
