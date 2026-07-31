'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { InlineSelect } from '@/components/controls'

interface StudentDetailLevelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialLevel: string
  initialSubLevel: string
  initialSchoolClass?: string
  onSave: (level: string, subLevel: string, schoolClass?: string) => void
}

const LEVEL_OPTIONS = ['IELTS', 'TOEIC', 'Beginner', 'STEM', 'Math', 'Japanese', 'English'].map((l) => ({
  value: l,
  label: l,
}))

const SUB_LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', '5.0-5.5', '5.5-6.0', '6.0-6.5', '6.5-7.0', '7.0-7.5', '7.5+', 'Algebra v1', 'Geometry v1'].map((sl) => ({
  value: sl,
  label: sl,
}))

const SCHOOL_CLASS_OPTIONS = ['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'Lớp 10', 'Lớp 11', 'Lớp 12'].map((sc) => ({
  value: sc,
  label: sc,
}))

export function StudentDetailLevelDialog({
  open,
  onOpenChange,
  initialLevel,
  initialSubLevel,
  initialSchoolClass = 'Lớp 6',
  onSave,
}: StudentDetailLevelDialogProps) {
  const [level, setLevel] = useState(initialLevel)
  const [subLevel, setSubLevel] = useState(initialSubLevel)
  const [schoolClass, setSchoolClass] = useState(initialSchoolClass)

  // Sync state when dialog opens or initial values change
  useEffect(() => {
    if (open) {
      setLevel(initialLevel)
      setSubLevel(initialSubLevel)
      setSchoolClass(initialSchoolClass || 'Lớp 6')
    }
  }, [open, initialLevel, initialSubLevel, initialSchoolClass])

  const handleSave = () => {
    onSave(level, subLevel, schoolClass)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] bg-background p-5 rounded-xl border shadow-lg">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="text-sm font-bold flex items-center gap-1.5">
            <Pencil className="h-4 w-4 text-primary" /> Cập nhật trình độ & Lớp học
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Trình độ (Level)</label>
            <InlineSelect
              value={level}
              options={LEVEL_OPTIONS}
              placeholder="Chọn trình độ"
              onValueChange={setLevel}
              className="w-full justify-between h-9 bg-background border border-border"
              variant="solid"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Sub-level (Trình độ phụ)</label>
            <InlineSelect
              value={subLevel}
              options={SUB_LEVEL_OPTIONS}
              placeholder="Chọn sub-level"
              onValueChange={setSubLevel}
              className="w-full justify-between h-9 bg-background border border-border"
              variant="solid"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Lớp (Lớp phổ thông / truyền thống)</label>
            <InlineSelect
              value={schoolClass}
              options={SCHOOL_CLASS_OPTIONS}
              placeholder="Chọn lớp"
              onValueChange={setSchoolClass}
              className="w-full justify-between h-9 bg-background border border-border"
              variant="solid"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs cursor-pointer">
            Hủy
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-primary text-primary-foreground text-xs font-semibold cursor-pointer">
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
