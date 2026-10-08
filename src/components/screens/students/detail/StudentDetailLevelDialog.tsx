'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useMemo } from 'react'
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
  initialEnglishName?: string
  isEnglish?: boolean
  onSave: (level: string, subLevel: string, schoolClass?: string, englishName?: string) => void
}

const BASE_LEVEL_OPTIONS = [
  'Toán 1:6',
  'Toán 1:1',
  'Toán nâng cao',
  'Toán tư duy',
  'IELTS',
  'TOEIC',
  'Beginner',
  'STEM',
  'Math',
  'English',
  'Japanese',
]

const BASE_SUB_LEVEL_OPTIONS = [
  'A',
  'B',
  'C',
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'C2',
  '5.0-5.5',
  '5.5-6.0',
  '6.0-6.5',
  '6.5-7.0',
  '7.0-7.5',
  '7.5+',
  'Algebra v1',
  'Geometry v1',
]

const SCHOOL_CLASS_OPTIONS = [
  'Lớp 1',
  'Lớp 2',
  'Lớp 3',
  'Lớp 4',
  'Lớp 5',
  'Lớp 6',
  'Lớp 7',
  'Lớp 8',
  'Lớp 9',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
].map((sc) => ({
  value: sc,
  label: sc,
}))

export function StudentDetailLevelDialog({
  open,
  onOpenChange,
  initialLevel,
  initialSubLevel,
  initialSchoolClass = 'Lớp 6',
  isEnglish = false,
  onSave,
}: StudentDetailLevelDialogProps) {
  const [level, setLevel] = useState(initialLevel)
  const [subLevel, setSubLevel] = useState(initialSubLevel)
  const [schoolClass, setSchoolClass] = useState(initialSchoolClass)

  // Danh sách options level linh hoạt, tự động bổ sung initialLevel nếu chưa có
  const levelOptions = useMemo(() => {
    const list = [...BASE_LEVEL_OPTIONS]
    if (initialLevel && !list.includes(initialLevel)) {
      list.unshift(initialLevel)
    }
    return list.map((l) => ({ value: l, label: l }))
  }, [initialLevel])

  // Danh sách options sub-level linh hoạt, tự động bổ sung initialSubLevel nếu chưa có
  const subLevelOptions = useMemo(() => {
    const list = [...BASE_SUB_LEVEL_OPTIONS]
    if (initialSubLevel && !list.includes(initialSubLevel)) {
      list.unshift(initialSubLevel)
    }
    return list.map((sl) => ({ value: sl, label: sl }))
  }, [initialSubLevel])

  // Đồng bộ state khi mở modal
  useEffect(() => {
    if (open) {
      setLevel(initialLevel)
      setSubLevel(initialSubLevel)
      setSchoolClass(initialSchoolClass || 'Lớp 6')
    }
  }, [open, initialLevel, initialSubLevel, initialSchoolClass])

  const handleSave = () => {
    onSave(level, subLevel, isEnglish ? undefined : schoolClass)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[320px] bg-background p-3 sm:p-3.5 rounded-xl border shadow-xl gap-2">
        <DialogHeader className="pb-1.5 border-b border-border/50 text-left">
          <DialogTitle className="text-xs sm:text-[12.5px] font-bold flex items-center gap-1.5 text-foreground leading-tight">
            <Pencil className="h-3.5 w-3.5 text-primary shrink-0" /> Cập nhật thông tin trình độ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-1 text-left">
          {/* Trình độ (Level) */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Trình độ (Level)
            </label>
            <InlineSelect
              value={level}
              options={levelOptions}
              placeholder="Chọn trình độ"
              onValueChange={setLevel}
              className="w-full justify-between h-7.5 text-xs bg-background border border-border"
              variant="solid"
            />
          </div>

          {/* Sub-level (Trình độ phụ) */}
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              Sub-level (Trình độ phụ)
            </label>
            <InlineSelect
              value={subLevel}
              options={subLevelOptions}
              placeholder="Chọn sub-level"
              onValueChange={setSubLevel}
              className="w-full justify-between h-7.5 text-xs bg-background border border-border"
              variant="solid"
            />
          </div>

          {/* Lớp phổ thông / truyền thống (nếu không phải môn ngoại ngữ chuyên biệt) */}
          {!isEnglish && (
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Lớp (Lớp phổ thông / truyền thống)
              </label>
              <InlineSelect
                value={schoolClass}
                options={SCHOOL_CLASS_OPTIONS}
                placeholder="Chọn lớp"
                onValueChange={setSchoolClass}
                className="w-full justify-between h-7.5 text-xs bg-background border border-border"
                variant="solid"
              />
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-1.5 pt-2 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 px-2.5 text-xs cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-7 px-3 bg-primary text-primary-foreground text-xs font-semibold cursor-pointer shadow-3xs"
          >
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
