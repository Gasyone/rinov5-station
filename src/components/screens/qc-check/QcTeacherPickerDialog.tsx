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
  // Giáo viên
  {
    id: 'st-tc-01',
    name: 'Cô Hoàng Thu Thảo',
    code: 'GV-0104',
    role: 'Giáo viên Tiếng Anh',
    department: 'teacher',
    branch: 'RinoEdu Smart City',
    activeIncidentsCount: 1,
    phone: '0901234001',
  },
  {
    id: 'st-tc-02',
    name: 'Thầy Hoàng Minh',
    code: 'GV-0105',
    role: 'Giáo viên Robotics & STEM',
    department: 'teacher',
    branch: 'RinoEdu Nguyễn Tuân',
    activeIncidentsCount: 2,
    phone: '0901234002',
  },
  {
    id: 'st-tc-03',
    name: 'Thầy Trần Quang Huy',
    code: 'GV-0108',
    role: 'Giáo viên Lập trình',
    department: 'teacher',
    branch: 'RinoEdu Linh Đàm',
    activeIncidentsCount: 0,
    phone: '0901234003',
  },
  {
    id: 'st-tc-04',
    name: 'Cô Đỗ Mai Hương',
    code: 'GV-0112',
    role: 'Giáo viên Mỹ thuật sáng tạo',
    department: 'teacher',
    branch: 'RinoEdu Nguyễn Tuân',
    activeIncidentsCount: 1,
    phone: '0901234004',
  },
  // Kỹ thuật & CSVC
  {
    id: 'st-fc-01',
    name: 'Võ Minh Tuấn (Kỹ thuật cơ sở)',
    code: 'KT-0021',
    role: 'Chuyên viên Kỹ thuật & Thiết bị',
    department: 'facility',
    branch: 'RinoEdu Nguyễn Tuân',
    activeIncidentsCount: 3,
    phone: '0902345001',
  },
  {
    id: 'st-fc-02',
    name: 'Tổ IT CSVC',
    code: 'KT-0000',
    role: 'Tổ Hỗ trợ Công nghệ & CSVC',
    department: 'facility',
    branch: 'Toàn hệ thống',
    activeIncidentsCount: 5,
    phone: '0902345002',
  },
  {
    id: 'st-fc-03',
    name: 'Nguyễn Văn Tùng (Quản trị cơ sở)',
    code: 'QT-0033',
    role: 'Quản lý CSVC & An ninh điểm trường',
    department: 'facility',
    branch: 'RinoEdu Smart City',
    activeIncidentsCount: 2,
    phone: '0902345003',
  },
  // Vận hành & CSM
  {
    id: 'st-op-01',
    name: 'Phạm Đức Thắng',
    code: 'VH-0012',
    role: 'Quản lý Vận hành Cơ sở',
    department: 'operations',
    branch: 'RinoEdu Nguyễn Tuân',
    activeIncidentsCount: 2,
    phone: '0903456001',
  },
  {
    id: 'st-op-02',
    name: 'Lê Thị Hương',
    code: 'VH-0019',
    role: 'Chuyên viên Vận hành Điểm trường',
    department: 'operations',
    branch: 'RinoEdu Smart City',
    activeIncidentsCount: 1,
    phone: '0903456002',
  },
  {
    id: 'st-op-03',
    name: 'Trần Văn Kiên',
    code: 'QC-0001',
    role: 'Thanh tra & Quản lý Chất lượng (QC)',
    department: 'operations',
    branch: 'Toàn hệ thống',
    activeIncidentsCount: 4,
    phone: '0903456003',
  },
  {
    id: 'st-op-04',
    name: 'Lê Thị Lan',
    code: 'CS-0008',
    role: 'Chuyên viên Chăm sóc Khách hàng (CSM)',
    department: 'operations',
    branch: 'RinoEdu Nguyễn Tuân',
    activeIncidentsCount: 1,
    phone: '0903456004',
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
