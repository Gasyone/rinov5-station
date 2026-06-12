'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, EmptyState, StudentNotePopover } from '@/components/shared'
import { UserPlus, Trash2 } from 'lucide-react'
import { mockStudents } from '@/mocks/students'
import {
  getMockRemainingSessions,
  getMockSaleNote,
  getMockPackage,
} from './classesCreateTypes'

interface Student {
  id: string
  name: string
  code: string
  status?: string
}

interface ClassesCreateRosterProps {
  students: Student[]
  onAddStudent: () => void
  onRemoveStudent: (id: string) => void
}

export function ClassesCreateRoster({
  students,
  onAddStudent,
  onRemoveStudent,
}: ClassesCreateRosterProps) {
  const [removeConfirmStudent, setRemoveConfirmStudent] = useState<Student | null>(null)

  const handleRemoveConfirm = () => {
    if (removeConfirmStudent) {
      onRemoveStudent(removeConfirmStudent.id)
    }
    setRemoveConfirmStudent(null)
  }
  return (
    <div className="flex flex-col gap-4 flex-1 min-h-0">
      {/* Selector Action Section */}
      <div className="flex items-center justify-between py-1.5 bg-transparent border-0 select-none">
        <p className="text-xs text-muted-foreground">Đã thêm {students.length} học viên vào lớp.</p>
        <Button
          type="button"
          size="sm"
          onClick={onAddStudent}
          className="whitespace-nowrap"
        >
          <UserPlus className="h-4 w-4 mr-1.5 inline-block" /> Chọn học viên xếp lớp
        </Button>
      </div>

      {/* Students table roster or empty state */}
      {students.length > 0 ? (
        <div className="flex-1 overflow-auto rounded-lg border">
          <table className="min-w-full divide-y divide-border table-fixed">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[30%]">Học viên</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[15%]">Trình độ</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[25%]">Gói đăng ký</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[15%]">Số buổi còn lại</th>
                <th className="px-4 py-2.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wide w-[15%]">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {students.map((student) => {
                const studentDetails = mockStudents.find((s) => s.id === student.id)
                const currentLevel = studentDetails?.level || '—'
                const currentPackage = getMockPackage(student.id, currentLevel)
                const saleNote = getMockSaleNote(student.id)
                const initials = student.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(-2)
                  .join('')
                  .toUpperCase()
                return (
                  <tr key={student.id} className="group hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2 text-sm font-medium">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground truncate">{student.name}</div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate">
                              {student.code}
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2 shrink-0 flex items-center gap-1.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7"
                            onClick={() => setRemoveConfirmStudent(student)}
                            title="Xóa học viên"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-xs font-semibold text-foreground">
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {currentLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground truncate" title={currentPackage}>
                      {currentPackage}
                    </td>
                    <td className="px-4 py-2 text-sm font-semibold text-foreground">
                      {getMockRemainingSessions(student.id)}
                    </td>
                    <td className="px-4 py-2 align-middle">
                      <StudentNotePopover
                        note={saleNote}
                        label="Ghi chú xếp lớp"
                        triggerTextPrefix=""
                        className="w-full justify-start px-0 text-xs"
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex-1 border border-dashed rounded-lg flex items-center justify-center p-8 bg-muted/10">
          <EmptyState
            title="Chưa có học viên nào"
            description="Nhấp vào nút phía trên để chọn học viên từ hệ thống xếp lớp."
            icon={<UserPlus className="h-7 w-7 text-muted-foreground" />}
          />
        </div>
      )}

      {/* Confirm dialog for student removal */}
      <ConfirmDialog
        open={!!removeConfirmStudent}
        onOpenChange={(open) => { if (!open) setRemoveConfirmStudent(null) }}
        title="Xóa học viên khỏi lớp"
        description={removeConfirmStudent ? `Bạn có chắc chắn muốn xóa học viên "${removeConfirmStudent.name}" khỏi danh sách lớp đang tạo? Hành động này không thể hoàn tác.` : ''}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={handleRemoveConfirm}
      />
    </div>
  )
}
