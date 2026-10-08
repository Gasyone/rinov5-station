'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect, useRef } from 'react'
import { User, Camera, Upload, RotateCcw, Calendar, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppAvatar } from '@/components/shared'
import { cn } from '@/lib/utils'

export interface StudentProfileUpdateData {
  name: string
  englishName?: string
  avatar?: string
  gender: 'Male' | 'Female' | 'Other'
  dob: string
}

interface StudentDetailEditProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: {
    name: string
    englishName?: string
    avatar?: string
    gender?: 'Male' | 'Female' | 'Other'
    dob?: string
  }
  onSave: (data: StudentProfileUpdateData) => void
}

const SAMPLE_AVATARS = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Lily',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack',
]

export function StudentDetailEditProfileDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: StudentDetailEditProfileDialogProps) {
  const [name, setName] = useState(initialData.name)
  const [englishName, setEnglishName] = useState(initialData.englishName || '')
  const [avatar, setAvatar] = useState(initialData.avatar || '')
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(initialData.gender || 'Female')
  const [dob, setDob] = useState(initialData.dob || '2015-08-25')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setName(initialData.name || '')
      setEnglishName(initialData.englishName || '')
      setAvatar(initialData.avatar || '')
      setGender(initialData.gender || 'Female')
      setDob(initialData.dob || '2015-08-25')
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
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-background p-3.5 sm:p-4 rounded-xl border shadow-xl">
        <DialogHeader className="pb-2 border-b border-border/60">
          <DialogTitle className="text-xs sm:text-[13px] font-bold flex items-center gap-1.5 text-foreground leading-tight">
            <User className="h-3.5 w-3.5 text-primary shrink-0" />
            Chỉnh sửa thông tin học viên
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2 text-left">
          {/* 1. KHU VỰC ẢNH ĐẠI DIỆN + UPLOAD */}
          <div className="flex items-center gap-3 p-2 bg-muted/30 border border-border/40 rounded-lg">
            <div className="relative group shrink-0">
              <AppAvatar
                src={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${name || 'student'}`}
                name={name || 'Học viên'}
                className="h-14 w-14 rounded-full border-2 border-background shadow-xs ring-1 ring-border/50"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 text-white rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px]"
                title="Tải ảnh lên từ máy"
              >
                <Camera className="h-4 w-4" />
                <span className="text-[9px] font-medium leading-none mt-0.5">Đổi ảnh</span>
              </button>
            </div>

            <div className="flex-1 min-w-0 space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-6.5 px-2 text-[11px] font-medium text-foreground cursor-pointer gap-1"
                >
                  <Upload className="h-3 w-3 text-primary" />
                  <span>Tải ảnh lên</span>
                </Button>
                <button
                  type="button"
                  onClick={handleResetAvatar}
                  className="p-1 text-muted-foreground hover:text-foreground rounded cursor-pointer transition-colors"
                  title="Tạo lại ảnh ngẫu nhiên theo tên"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>

              {/* Avatar mẫu chọn nhanh */}
              <div className="flex items-center gap-1 pt-0.5">
                <span className="text-[10px] text-muted-foreground mr-0.5">Mẫu:</span>
                {SAMPLE_AVATARS.map((sampleUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(sampleUrl)}
                    className={cn(
                      "h-5 w-5 rounded-full overflow-hidden border transition-all cursor-pointer hover:scale-110",
                      avatar === sampleUrl
                        ? "border-primary ring-1 ring-primary"
                        : "border-border/60 opacity-80 hover:opacity-100"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sampleUrl} alt="Sample" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. HỌ VÀ TÊN (TIẾNG VIỆT) */}
          <div className="space-y-1">
            <label className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide">
              Họ và tên tiếng Việt <span className="text-destructive">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Bảo Hân"
              className="h-8 text-xs font-medium"
            />
          </div>

          {/* 3. TÊN TIẾNG ANH */}
          <div className="space-y-1">
            <label className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide">
              Tên tiếng Anh (English Name)
            </label>
            <Input
              value={englishName}
              onChange={(e) => setEnglishName(e.target.value)}
              placeholder="VD: Hannah"
              className="h-8 text-xs"
            />
          </div>

          {/* 4. GIỚI TÍNH & NGÀY SINH (2 CỘT GỌN GÀNG) */}
          <div className="grid grid-cols-2 gap-2">
            {/* Giới tính */}
            <div className="space-y-1">
              <label className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide">
                Giới tính
              </label>
              <div className="flex items-center p-0.5 bg-muted/50 border border-border/60 rounded-md h-8">
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
                      "flex-1 h-7 text-[11px] font-medium rounded transition-all cursor-pointer flex items-center justify-center gap-0.5 select-none",
                      gender === g.key
                        ? "bg-background text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
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
              <label className="text-[10.5px] font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span>Ngày sinh</span>
              </label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-1.5 pt-2 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7 px-2.5 text-xs cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!name.trim()}
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
