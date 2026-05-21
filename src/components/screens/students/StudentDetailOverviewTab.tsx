'use client'

import { useState } from 'react'
import { Panel, InfoField, FieldLabel } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Student } from '@/mocks/students'

interface StudentDetailOverviewTabProps {
  student: Student
}

export function StudentDetailOverviewTab({ student }: StudentDetailOverviewTabProps) {
  const [notes, setNotes] = useState<string[]>(
    student.notes ? [student.notes] : ['Học viên tích cực, chăm chỉ phát biểu.', 'Cần củng cố thêm từ vựng IELTS.']
  )
  const [newNote, setNewNote] = useState('')

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    setNotes((prev) => [newNote.trim(), ...prev])
    setNewNote('')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Panel title="Thông tin cá nhân & Liên hệ">
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Họ và tên" value={student.name} />
            <InfoField label="Mã học viên" value={`STU-00${student.id.replace('s', '')}`} />
            <InfoField label="Giới tính" value={student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : 'Khác'} />
            <InfoField label="Ngày sinh" value={new Date(student.dob).toLocaleDateString('vi-VN')} />
            <InfoField label="Trình độ / Level" value={student.level} />
            <InfoField label="Ngày ghi danh" value={new Date(student.enrollmentDate).toLocaleDateString('vi-VN')} />
          </div>
        </Panel>

        <Panel title="Thông tin phụ huynh / Người giám hộ">
          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Họ tên phụ huynh" value={student.parentName || '-'} />
            <InfoField label="Số điện thoại" value={student.parentPhone || '-'} />
            <InfoField label="Mối quan hệ" value={student.parentName ? 'Bố/Mẹ' : '-'} />
            <InfoField label="Email liên hệ" value={student.email.replace('an@', 'parent.an@')} />
          </div>
        </Panel>
      </div>

      <Panel title="Ghi chú vận hành & Chăm sóc">
        <form onSubmit={handleAddNote} className="mb-4 flex gap-2">
          <div className="flex-1">
            <FieldLabel label="Thêm ghi chú" className="sr-only">
              <input
                id="new-note"
                type="text"
                placeholder="Nhập ghi chú vận hành mới..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </FieldLabel>
          </div>
          <Button type="submit" size="sm">Thêm</Button>
        </form>

        <div className="space-y-2">
          {notes.map((note, index) => (
            <Card key={index} className="p-3 bg-muted/40 border border-border rounded-lg">
              <p className="text-sm text-foreground">{note}</p>
              <div className="mt-1 text-[10px] text-muted-foreground flex justify-between">
                <span>Người viết: Trần Thế Vinh (CSM)</span>
                <span>Vừa xong</span>
              </div>
            </Card>
          ))}
        </div>
      </Panel>
    </div>
  )
}
