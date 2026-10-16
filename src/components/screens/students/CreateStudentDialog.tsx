'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import { toast } from 'sonner'
import { UserPlus, Loader2, Database } from 'lucide-react'
import type { Student } from '@/mocks/students'

interface CreateStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newStudent: Student) => void
}

export function CreateStudentDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateStudentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female'>('Female')
  const [dob, setDob] = useState('2016-01-15')
  const [branch, setBranch] = useState('CS1')
  const [schoolName, setSchoolName] = useState('')
  const [packageName, setPackageName] = useState('Tiếng Anh Giao Tiếp')
  const [packageSessions, setPackageSessions] = useState(24)
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setName('')
    setEnglishName('')
    setPhone('')
    setEmail('')
    setGender('Female')
    setDob('2016-01-15')
    setBranch('CS1')
    setSchoolName('')
    setPackageName('Tiếng Anh Giao Tiếp')
    setPackageSessions(24)
    setNotes('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Vui lòng nhập tên học viên')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          englishName: englishName.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          gender,
          dob,
          branch,
          schoolName: schoolName.trim() || undefined,
          packageName,
          packageSessions: Number(packageSessions) || 24,
          notes: notes.trim() || undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Lỗi khi lưu học viên')
      }

      toast.success('Đã lưu học viên thật vào Cơ sở dữ liệu SQLite!', {
        description: `Mã học viên: ${data.data.id} - ${data.data.name}`,
        icon: <Database className="h-4 w-4 text-emerald-500" />,
      })

      onSuccess(data.data as Student)
      resetForm()
      onOpenChange(false)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định'
      toast.error(`Không thể tạo học viên: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-semibold">
            <UserPlus className="h-5 w-5 text-primary" />
            Nhập Học Viên Mới (Lưu CSDL Thật)
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required>Họ và tên học viên</FieldLabel>
              <Input
                placeholder="VD: Trần Bảo Anh"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-8 text-xs"
              />
            </div>
            <div>
              <FieldLabel>Tên tiếng Anh (nếu có)</FieldLabel>
              <Input
                placeholder="VD: Anna Tran"
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Số điện thoại liên hệ</FieldLabel>
              <Input
                placeholder="VD: 0912345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="VD: hocvien@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <FieldLabel>Giới tính</FieldLabel>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="Female">Nữ</option>
                <option value="Male">Nam</option>
              </select>
            </div>
            <div>
              <FieldLabel>Ngày sinh</FieldLabel>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <FieldLabel>Cơ sở / Chi nhánh</FieldLabel>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="CS1">CS1 - Hoàng Mai</option>
                <option value="CS2">CS2 - Cầu Giấy</option>
                <option value="CS3">CS3 - Ba Đình</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Gói học đăng ký</FieldLabel>
              <select
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="Tiếng Anh Giao Tiếp">Tiếng Anh Giao Tiếp</option>
                <option value="Toán Tư Duy Tiểu Học">Toán Tư Duy Tiểu Học</option>
                <option value="STEM Robotics">STEM Robotics</option>
                <option value="Tiếng Anh Thiếu Nhi A1">Tiếng Anh Thiếu Nhi A1</option>
              </select>
            </div>
            <div>
              <FieldLabel>Số buổi trong gói</FieldLabel>
              <Input
                type="number"
                min={1}
                max={120}
                value={packageSessions}
                onChange={(e) => setPackageSessions(Number(e.target.value))}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Trường phổ thông đang theo học</FieldLabel>
            <Input
              placeholder="VD: Tiểu học Đoàn Thị Điểm"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div>
            <FieldLabel>Ghi chú ban đầu</FieldLabel>
            <Input
              placeholder="Ghi chú thêm về học lực, nhu cầu phụ huynh..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-8 text-xs"
            />
          </div>

          <div className="rounded-md bg-muted/60 p-2.5 text-xs text-muted-foreground flex items-start gap-2 border border-border/50">
            <Database className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>
              Dữ liệu sau khi nhấn <strong>Lưu vào CSDL</strong> sẽ được ghi vĩnh viễn vào file database SQLite nội bộ và hiển thị ngay trên bảng điều khiển.
            </span>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" disabled={loading} className="gap-1.5">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Lưu vào CSDL
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
