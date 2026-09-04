'use client'

import { useState, type FormEvent } from 'react'
import { GraduationCap, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  BIRTH_YEAR_OPTIONS,
  POPULAR_SCHOOL_OPTIONS,
  COURSE_OPTIONS,
} from '../crm-leads/crmCustomerCreateTypes'
import {
  SearchSelect,
  CreatableSearchSelect,
  SmallLabel,
} from '../crm-leads/CrmCustomerCreateSearchSelect'

export interface NewChildData {
  id: string
  name: string
  birthYear?: string
  dob?: string
  age?: string | number
  currentSchool?: string
  course?: string
  academicPerformance?: string
  phone?: string
  vuihocAccount?: string
}

interface BookingTestAddChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parentName?: string
  onSubmit: (child: NewChildData) => void
}

export function BookingTestAddChildDialog({
  open,
  onOpenChange,
  parentName,
  onSubmit,
}: BookingTestAddChildDialogProps) {
  const currentYear = 2026

  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [age, setAge] = useState('')
  const [currentSchool, setCurrentSchool] = useState('')
  const [course, setCourse] = useState('')
  const [academicPerformance, setAcademicPerformance] = useState('')
  const [phone, setPhone] = useState('')
  const [vuihocAccount, setVuihocAccount] = useState('')
  const [error, setError] = useState('')

  const handleBirthYearChange = (year: string) => {
    setBirthYear(year)
    const y = parseInt(year, 10)
    if (!isNaN(y) && y <= currentYear) {
      setAge(String(currentYear - y))
    }
  }

  const handleReset = () => {
    setName('')
    setBirthYear('')
    setAge('')
    setCurrentSchool('')
    setCourse('')
    setAcademicPerformance('')
    setPhone('')
    setVuihocAccount('')
    setError('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập tên của con / học viên.')
      return
    }

    const newChild: NewChildData = {
      id: `child-${Date.now()}`,
      name: name.trim(),
      birthYear: birthYear || undefined,
      dob: birthYear || undefined,
      age: age.trim() || undefined,
      currentSchool: currentSchool.trim() || undefined,
      course: course || undefined,
      academicPerformance: academicPerformance.trim() || undefined,
      phone: phone.trim() || undefined,
      vuihocAccount: vuihocAccount.trim() || undefined,
    }

    onSubmit(newChild)
    handleReset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleReset()
        onOpenChange(val)
      }}
    >
      <DialogContent className="sm:max-w-lg bg-card text-foreground">
        <DialogHeader className="pb-2 border-b border-border/70">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold">
                Thêm Con / Học viên mới
              </DialogTitle>
              {parentName && (
                <p className="text-xs text-muted-foreground">
                  Phụ huynh: <span className="font-semibold text-foreground">{parentName}</span>
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-1">
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 p-2 rounded-md font-medium">
              {error}
            </div>
          )}

          {/* Tên con */}
          <div>
            <SmallLabel label="Tên con" required />
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (error) setError('')
              }}
              placeholder="Nhập tên của con..."
              className="h-8 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
              autoFocus
            />
          </div>

          {/* Năm sinh & Độ tuổi */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <SmallLabel label="Năm sinh của con" />
              <SearchSelect
                value={birthYear}
                onValueChange={handleBirthYearChange}
                options={BIRTH_YEAR_OPTIONS}
                placeholder="Chọn năm sinh..."
                className="h-8"
              />
            </div>
            <div>
              <SmallLabel label="Độ tuổi của con (sửa tay được)" />
              <Input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="VD: 6 tuổi..."
                className="h-8 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal font-medium"
              />
            </div>
          </div>

          {/* Trường đang học hiện tại của học viên */}
          <div>
            <SmallLabel label="Trường đang học hiện tại của học viên" />
            <CreatableSearchSelect
              value={currentSchool}
              onValueChange={setCurrentSchool}
              options={POPULAR_SCHOOL_OPTIONS}
              placeholder="Chọn hoặc nhập tên trường..."
              className="h-8"
            />
          </div>

          {/* Khoá học quan tâm & Học lực hiện tại */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <SmallLabel label="Khoá học quan tâm" />
              <SearchSelect
                value={course}
                onValueChange={setCourse}
                options={COURSE_OPTIONS}
                placeholder="Chọn khoá học..."
                className="h-8"
              />
            </div>
            <div>
              <SmallLabel label="Học lực hiện tại" />
              <Input
                value={academicPerformance}
                onChange={(e) => setAcademicPerformance(e.target.value)}
                placeholder="Giỏi / Khá / TB..."
                className="h-8 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
              />
            </div>
          </div>

          {/* SĐT riêng của con & Tài khoản Vuihoc */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <SmallLabel label="SĐT riêng của con (nếu có)" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="SĐT riêng..."
                className="h-8 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
              />
            </div>
            <div>
              <SmallLabel label="Tài khoản Vuihoc" />
              <Input
                value={vuihocAccount}
                onChange={(e) => setVuihocAccount(e.target.value)}
                placeholder="Tài khoản online..."
                className="h-8 text-xs bg-background placeholder:text-xs placeholder:text-muted-foreground/50 placeholder:font-normal"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                handleReset()
                onOpenChange(false)
              }}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs gap-1.5 font-medium">
              <Plus className="h-3.5 w-3.5" />
              Lưu học viên
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
