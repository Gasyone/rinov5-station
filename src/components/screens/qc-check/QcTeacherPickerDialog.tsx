'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Search, Check, Building2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'

export interface AvailableStaff {
  id: string
  name: string
  code: string
  role: string
  department: 'teacher' | 'facility' | 'operations'
  branch: string
  activeIncidentsCount: number
  phone?: string
}

export const MOCK_QC_STAFF_LIST: AvailableStaff[] = [
  // Giáo viên & Trợ giảng
  {
    id: 'st-tc-01',
    name: 'Trần Hồng Thiệp',
    code: 'GV-0018',
    role: 'Giáo viên Toán tư duy',
    department: 'teacher',
    branch: 'Linh Đàm',
    activeIncidentsCount: 4,
    phone: '0982 112 334',
  },
  {
    id: 'st-tc-02',
    name: 'Đỗ Bảo Ngọc',
    code: 'GV-0021',
    role: 'Giáo viên Toán tư duy',
    department: 'teacher',
    branch: 'Linh Đàm',
    activeIncidentsCount: 3,
    phone: '0975 223 445',
  },
  {
    id: 'st-tc-03',
    name: 'Trúc Anh',
    code: 'TA-0005',
    role: 'Trợ giảng (TA)',
    department: 'teacher',
    branch: 'Tonkin',
    activeIncidentsCount: 3,
    phone: '0963 334 556',
  },
  {
    id: 'st-tc-04',
    name: 'FATIH KESKIN',
    code: 'GV-NN-003',
    role: 'Giáo viên Tiếng Anh Bản ngữ',
    department: 'teacher',
    branch: 'Vin SA1',
    activeIncidentsCount: 2,
    phone: '0901 998 877',
  },
  {
    id: 'st-tc-05',
    name: 'Roman',
    code: 'GV-NN-005',
    role: 'Giáo viên Kindie Bản ngữ',
    department: 'teacher',
    branch: '170 Nguyễn Tuân',
    activeIncidentsCount: 1,
    phone: '0903 887 766',
  },
  {
    id: 'st-tc-06',
    name: 'Maria',
    code: 'GV-NN-008',
    role: 'Giáo viên Kindie',
    department: 'teacher',
    branch: 'Vin SA1',
    activeIncidentsCount: 1,
    phone: '0905 776 655',
  },
  // Kỹ thuật & CSVC
  {
    id: 'st-fc-01',
    name: 'QuangBD',
    code: 'KT-0012',
    role: 'Kỹ thuật viên CSVC',
    department: 'facility',
    branch: 'Tonkin',
    activeIncidentsCount: 3,
    phone: '0934 112 233',
  },
  {
    id: 'st-fc-02',
    name: 'VanLT4',
    code: 'KT-0014',
    role: 'Quản lý Cơ sở & CSVC',
    department: 'facility',
    branch: '170 Nguyễn Tuân',
    activeIncidentsCount: 2,
    phone: '0945 223 344',
  },
  // Vận hành, CS & Sale
  {
    id: 'st-op-01',
    name: 'ChiTTK3',
    code: 'CS-0033',
    role: 'Chuyên viên CS / Lễ tân',
    department: 'operations',
    branch: '170 Nguyễn Tuân',
    activeIncidentsCount: 3,
    phone: '0967 334 455',
  },
  {
    id: 'st-op-02',
    name: 'HauTB',
    code: 'SL-0082',
    role: 'Chuyên viên Tư vấn Tuyển sinh',
    department: 'operations',
    branch: '170 Nguyễn Tuân',
    activeIncidentsCount: 2,
    phone: '0978 445 566',
  },
  {
    id: 'st-op-03',
    name: 'ThuyPT9',
    code: 'SL-0099',
    role: 'Chuyên viên Tư vấn Tuyển sinh',
    department: 'operations',
    branch: 'Tonkin',
    activeIncidentsCount: 2,
    phone: '0989 556 677',
  },
  {
    id: 'st-op-04',
    name: 'MaiNTN6',
    code: 'SL-0066',
    role: 'Chuyên viên Tư vấn Tuyển sinh',
    department: 'operations',
    branch: 'KDV',
    activeIncidentsCount: 2,
    phone: '0912 667 788',
  },
  {
    id: 'st-op-05',
    name: 'HongPT',
    code: 'SL-0022',
    role: 'Chuyên viên Tư vấn Tuyển sinh',
    department: 'operations',
    branch: 'Linh Đàm',
    activeIncidentsCount: 1,
    phone: '0923 778 899',
  },
]

export interface QcTeacherPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedStaffId?: string
  branchName?: string
  targetGroup?: 'teacher' | 'facility' | 'operations'
  currentAssignee?: string
  onSelect: (staff: AvailableStaff) => void
}

export function QcTeacherPickerDialog({
  open,
  onOpenChange,
  selectedStaffId,
  branchName,
  targetGroup,
  currentAssignee,
  onSelect,
}: QcTeacherPickerDialogProps) {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'teacher' | 'facility' | 'operations'>(
    targetGroup || 'all'
  )

  const currentCleanName = currentAssignee
    ? currentAssignee.replace(/\s*\(.*?\)/g, '').trim().toLowerCase()
    : ''

  const filteredStaffList = useMemo(() => {
    return MOCK_QC_STAFF_LIST.filter((s) => {
      const isNotCurrent = !currentCleanName || !s.name.toLowerCase().includes(currentCleanName)
      const matchesTab = selectedTab === 'all' || s.department === selectedTab
      const q = searchKeyword.toLowerCase().trim()
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q)

      return isNotCurrent && matchesTab && matchesSearch
    })
  }, [currentCleanName, selectedTab, searchKeyword])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[480px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden text-left z-[80]">
        <DialogHeader className="p-3.5 pb-2.5 border-b border-border/70 bg-muted/20">
          <DialogTitle className="text-sm font-bold text-foreground">
            Chọn giáo viên / nhân sự
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground truncate">
            {branchName ? `Cơ sở: ${branchName} • ` : ''}Chọn nhân sự tiếp nhận phân công
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 space-y-2.5 flex-1 min-h-0 flex flex-col">
          {/* Tabs bộ lọc */}
          <div className="flex items-center gap-1 border-b pb-1.5 shrink-0">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'teacher', label: 'Giáo viên' },
              { value: 'facility', label: 'CSVC / Kỹ thuật' },
              { value: 'operations', label: 'Vận hành / CSM' },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedTab(tab.value as typeof selectedTab)}
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer',
                  selectedTab === tab.value
                    ? 'bg-primary text-primary-foreground font-semibold shadow-2xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative shrink-0">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo tên, chức vụ, bộ phận, cơ sở..."
              className="h-8 pl-8 pr-7 text-xs bg-background"
              autoFocus
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                className="absolute right-2 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Danh sách giáo viên / nhân sự */}
          <div className="flex-1 overflow-y-auto space-y-1 rounded-md border border-border/70 p-1 bg-background/50 max-h-[340px]">
            {filteredStaffList.length === 0 ? (
              <div className="text-center py-6 text-xs text-muted-foreground italic">
                Không tìm thấy nhân sự phù hợp
              </div>
            ) : (
              filteredStaffList.map((staff) => {
                const isSelected = selectedStaffId === staff.id
                return (
                  <div
                    key={staff.id}
                    onClick={() => {
                      onSelect(staff)
                      onOpenChange(false)
                    }}
                    className={cn(
                      'p-2 rounded-md border transition-all cursor-pointer flex items-center justify-between gap-2 select-none text-xs',
                      isSelected
                        ? 'bg-primary/10 border-primary ring-1 ring-primary/40 font-medium'
                        : 'bg-card hover:bg-muted/60 border-border/50 hover:border-primary/40'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AppAvatar name={staff.name} size="sm" className="h-7 w-7 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-foreground text-xs truncate">
                            {staff.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ({staff.code})
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span>{staff.role}</span>
                          <span>•</span>
                          <span className="truncate flex items-center gap-0.5">
                            <Building2 className="h-2.5 w-2.5" />
                            {staff.branch}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        {staff.activeIncidentsCount} sự cố
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
