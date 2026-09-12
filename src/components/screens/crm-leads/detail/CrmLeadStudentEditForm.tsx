'use client'

import React from 'react'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { ChildPersonaItem, StudentSubjectItem } from './CrmLeadChildCard'

export interface CrmLeadStudentEditFormProps {
  editedStudent: ChildPersonaItem
  setEditedStudent: React.Dispatch<React.SetStateAction<ChildPersonaItem>>
  subjectsList?: StudentSubjectItem[]
  currentSubject?: StudentSubjectItem
  onCancel?: () => void
  onSave?: () => void
}

export function CrmLeadStudentEditForm({
  editedStudent,
  setEditedStudent,
  onCancel,
  onSave,
}: CrmLeadStudentEditFormProps) {
  return (
    <div className="space-y-3.5 p-3.5 rounded-xl border border-border/80 bg-card shadow-2xs">
      {/* Header Form Chỉnh Sửa */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60 flex-wrap gap-2">
        <span className="text-xs font-bold text-foreground">
          Chỉnh sửa chân dung học viên
        </span>
        <div className="flex items-center gap-1.5">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-7 px-2.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors border-border/80"
              title="Hủy chỉnh sửa"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              <span>Hủy</span>
            </Button>
          )}
          {onSave && (
            <Button
              type="button"
              size="sm"
              onClick={onSave}
              className="h-7 px-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer transition-colors shadow-2xs"
              title="Lưu thay đổi"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              <span>Lưu</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tâm lý & Phương pháp học tập */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-foreground">
          Tâm lý &amp; Phương pháp học tập
        </span>
        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">
              Mục tiêu học tập của con *
            </label>
            <Textarea
              value={editedStudent.learningGoal || ''}
              onChange={(e) => setEditedStudent((s) => ({ ...s, learningGoal: e.target.value }))}
              placeholder="VD: Tự tin thuyết trình tiếng Anh 3 phút trước lớp, đạt 14/15 khiên Cambridge..."
              className="min-h-16 text-xs bg-transparent shadow-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Phong cách tiếp thu (VARK Style)</label>
              <Input
                value={editedStudent.learningStyle || ''}
                onChange={(e) => setEditedStudent((s) => ({ ...s, learningStyle: e.target.value }))}
                placeholder="VD: Trực quan (Visual) & Vận động (Kinesthetic)..."
                className="h-8 text-xs bg-transparent shadow-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Tính cách &amp; Tâm lý lớp học</label>
              <Input
                value={editedStudent.personality || ''}
                onChange={(e) => setEditedStudent((s) => ({ ...s, personality: e.target.value }))}
                placeholder="VD: Ngoan ngoãn, thích khen ngợi..."
                className="h-8 text-xs bg-transparent shadow-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-muted-foreground">Sở thích &amp; Đam mê ngoài giờ</label>
            <Input
              value={editedStudent.interests || ''}
              onChange={(e) => setEditedStudent((s) => ({ ...s, interests: e.target.value }))}
              placeholder="VD: Mê lắp ráp Lego Technic, vẽ truyện tranh..."
              className="h-8 text-xs bg-transparent shadow-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Điểm mạnh nổi bật</label>
              <Textarea
                value={editedStudent.strengths || ''}
                onChange={(e) => setEditedStudent((s) => ({ ...s, strengths: e.target.value }))}
                placeholder="VD: Ghi nhớ từ vựng nhanh..."
                className="min-h-14 text-xs bg-transparent shadow-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-muted-foreground">Điểm cần rèn giũa</label>
              <Textarea
                value={editedStudent.weaknesses || ''}
                onChange={(e) => setEditedStudent((s) => ({ ...s, weaknesses: e.target.value }))}
                placeholder="VD: Còn ngại nói câu dài..."
                className="min-h-14 text-xs bg-transparent shadow-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
