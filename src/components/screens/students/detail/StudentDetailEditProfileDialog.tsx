'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  Camera,
  Upload,
  RotateCcw,
  Check,
  StickyNote,
  History,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/controls'
import { AppAvatar } from '@/components/shared'
import { cn } from '@/lib/utils'
import type { Student } from '@/mocks/students'
import { getStudentNotes } from './studentDetailHelpers'

export interface StudentProfileUpdateData {
  name: string
  englishName?: string
  avatar?: string
  gender: 'Male' | 'Female' | 'Other'
  dob: string
  notes?: string
}

export interface StudentNoteHistoryItem {
  id: string
  text: string
  author: string
  timestamp: string
}

interface StudentDetailEditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    id?: string
    name: string
    englishName?: string
    avatar?: string
    gender?: 'Male' | 'Female' | 'Other'
    dob?: string
    notes?: string
    noteHistory?: StudentNoteHistoryItem[]
  }
  student?: Student
  onSave: (data: StudentProfileUpdateData) => void
}

export function StudentDetailEditProfileDialog({
  open,
  onOpenChange,
  initialData,
  student,
  onSave,
}: StudentDetailEditProfileDialogProps) {
  const [name, setName] = useState(initialData.name)
  const [englishName, setEnglishName] = useState(initialData.englishName || '')
  const [avatar, setAvatar] = useState(initialData.avatar || '')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(initialData.gender || 'Female')
  const [dob, setDob] = useState(initialData.dob || '2015-08-25')
  const [notes, setNotes] = useState(initialData.notes || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(initialData.name || '')
      setEnglishName(initialData.englishName || '')
      setAvatar(initialData.avatar || '')
      setGender(initialData.gender || 'Female')
      setDob(initialData.dob || '2015-08-25')
      setNotes(initialData.notes || '')
    }
  }, [open, initialData])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert file ảnh thành base64 data URL
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      if (dataUrl) {
        setAvatar(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleResetAvatar = () => {
    setAvatar(`https://api.dicebear.com/7.x/adventurer/svg?seed=${name.trim() || 'student'}`)
  }

  const handleSave = () => {
    if (!name.trim()) return

    onSave({
      name: name.trim(),
      englishName: englishName.trim() || undefined,
      avatar: avatar.trim() || undefined,
      gender,
      dob: dob.trim(),
      notes: notes.trim(),
    })
    onOpenChange(false)
  }

  // Danh sách lịch sử ghi chú
  const notesHistory: StudentNoteHistoryItem[] = useMemo(() => {
    if (initialData.noteHistory && initialData.noteHistory.length > 0) {
      return initialData.noteHistory
    }
    if (student) {
      const helperNotes = getStudentNotes(student)
      if (helperNotes.length > 0) {
        return helperNotes.map((n) => ({
          ...n,
          author: n.author === 'Sale Consultant' ? 'Nguyễn Hoàng Sale' : n.author,
        }))
      }
    }
    // Fallback lịch sử ghi chú mặc định theo đúng ảnh mẫu
    return [
      {
        id: 'note-default-1',
        author: 'CSM Minh Phương',
        timestamp: '10:00 01/06/2026',
        text: 'Mẹ phản hồi học viên rất hào hứng sau buổi học đầu tiên, mong muốn giáo viên quan tâm phần phát âm hơn.',
      },
      {
        id: 'note-default-2',
        author: 'Nguyễn Hoàng Sale',
        timestamp: '15:30 15/05/2026',
        text: 'Sales note: Học viên nhút nhát, cần xếp lớp sỹ số nhỏ để tương tác được nhiều. Phụ huynh đồng ý cam kết đầu ra.',
      },
    ]
  }, [initialData.noteHistory, student])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[530px] max-h-[90vh] overflow-y-auto bg-background p-3.5 sm:p-4 rounded-xl border shadow-xl">
        {/* Header: giảm padding, bỏ icon, title text thường màu nhạt không in đậm */}
        <DialogHeader className="pb-1.5 border-b border-border/50">
          <DialogTitle className="text-xs sm:text-[13px] font-normal text-muted-foreground leading-tight text-left">
            Chỉnh sửa thông tin học viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1.5 text-left">
          {/* 1. KHU VỰC THÔNG TIN CƠ BẢN: CHIA TRÁI PHẢI */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 sm:gap-4">
            {/* CỘT TRÁI: ẢNH ĐẠI DIỆN HỌC VIÊN + ĐẶT LẠI ẢNH CÙNG HÀNG TẢI ẢNH LÊN */}
            <div className="sm:w-36 flex flex-col items-center text-center gap-2 shrink-0 pt-0.5">
              <div className="relative group shrink-0">
                <AppAvatar
                  src={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name || 'student'}`}
                  name={name || 'Học viên'}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-background shadow-md ring-2 ring-border/60 transition-transform group-hover:scale-[1.02]"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/45 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs"
                  title="Tải ảnh lên từ máy"
                >
                  <Camera className="h-4 w-4" />
                  <span className="text-[9.5px] font-medium leading-none mt-1">Đổi ảnh</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Tải ảnh lên + Đặt lại ảnh (chỉ icon, bỏ viền, nền, text) */}
              <div className="flex items-center gap-1.5 w-full justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-7 px-2.5 text-xs font-medium text-foreground cursor-pointer gap-1.5 flex-1 min-w-0"
                  title="Tải ảnh lên từ máy"
                >
                  <Upload className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">Tải ảnh lên</span>
                </Button>
                <button
                  type="button"
                  onClick={handleResetAvatar}
                  className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/70 rounded-md transition-colors cursor-pointer shrink-0"
                  title="Đặt lại ảnh ngẫu nhiên theo tên học viên"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CỘT PHẢI: CÁC TRƯỜNG THÔNG TIN CÁ NHÂN (TITLE VIẾT THƯỜNG, KHÔNG VIẾT HOA) */}
            <div className="flex-1 min-w-0 space-y-2.5 w-full">
              {/* Họ và tên tiếng Việt */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground flex items-center gap-1">
                  <span>Họ và tên tiếng Việt</span>
                  <span className="text-destructive">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Lê Nguyễn Bảo Hân"
                  className="h-8 text-xs font-medium"
                />
              </div>

              {/* Tên tiếng Anh */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-foreground">
                  Tên tiếng Anh (English name)
                </label>
                <Input
                  value={englishName}
                  onChange={(e) => setEnglishName(e.target.value)}
                  placeholder="VD: Hannah"
                  className="h-8 text-xs"
                />
              </div>

              {/* Giới tính & Ngày sinh (2 cột đồng nhất chiều cao và căn chỉnh thẳng hàng) */}
              <div className="grid grid-cols-2 gap-2">
                {/* Giới tính */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground h-4.5 flex items-center">
                    Giới tính
                  </label>
                  <div className="flex items-center p-0.5 bg-muted/50 border border-input rounded-md h-8 w-full box-border">
                    {(
                      [
                        { key: 'Male', label: 'Nam' },
                        { key: 'Female', label: 'Nữ' },
                        { key: 'Other', label: 'Khác' },
                      ] as const
                    ).map((g) => (
                      <button
                        key={g.key}
                        type="button"
                        onClick={() => setGender(g.key)}
                        className={cn(
                          'flex-1 h-full text-xs font-medium rounded transition-all cursor-pointer flex items-center justify-center gap-0.5 select-none',
                          gender === g.key
                            ? 'bg-background text-foreground shadow-xs font-semibold'
                            : 'text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {gender === g.key && <Check className="h-2.5 w-2.5 text-primary" />}
                        <span>{g.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ngày sinh */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground h-4.5 flex items-center">
                    Ngày sinh
                  </label>
                  <DatePicker
                    value={dob}
                    onChange={setDob}
                    placeholder="Chọn ngày sinh"
                    captionLayout="dropdown"
                    startMonth={new Date(2000, 0)}
                    endMonth={new Date(2028, 11)}
                    showClear
                    showToday
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. GHI CHÚ VÀ LỊCH SỬ GHI CHÚ (THÊM TEXT "LỊCH SỬ" CẠNH ICON Ở CẠNH PHẢI) */}
          <div className="border-t border-border/60 pt-2.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <StickyNote className="h-3.5 w-3.5 text-amber-500" />
                <span>Ghi chú học viên</span>
              </label>

              {/* Popover Lịch sử ghi chú từ icon + text ở cạnh phải */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 -mr-1 hover:bg-muted/80 rounded text-xs font-normal text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 cursor-pointer transition-colors"
                    title="Xem lịch sử ghi chú"
                  >
                    <History className="h-3.5 w-3.5" />
                    <span>Lịch sử</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-3 text-xs space-y-2 z-[60] shadow-md bg-popover"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <History className="h-3.5 w-3.5 text-primary" />
                      <span>Lịch sử ghi chú</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">
                      {notesHistory.length} ghi chú
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-0.5">
                    {notesHistory.length > 0 ? (
                      notesHistory.map((note) => (
                        <div
                          key={note.id}
                          className="p-2.5 rounded-lg bg-muted/40 border border-border/50 space-y-1 text-left"
                        >
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground/90">
                              {note.author}
                            </span>
                            <span className="font-mono text-xs">
                              {note.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {note.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-muted-foreground italic">
                        Chưa có lịch sử ghi chú nào
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú về học viên (tính cách, thói quen, lưu ý học tập...)"
              rows={3}
              className="text-xs resize-none min-h-[64px] leading-relaxed bg-background"
            />
          </div>
        </div>

        {/* Footer (Bỏ đường line footer đi, giảm padding/gap) */}
        <div className="flex justify-end gap-1.5 pt-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 px-3 text-xs cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!name.trim()}
            onClick={handleSave}
            className="h-7 px-3.5 bg-primary text-primary-foreground text-xs font-medium cursor-pointer shadow-3xs"
          >
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
