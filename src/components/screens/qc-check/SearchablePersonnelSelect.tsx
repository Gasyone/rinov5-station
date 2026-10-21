'use client'

import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, Check, X, User } from 'lucide-react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { QcTargetGroup } from '@/mocks/qcChecks'

export interface PersonnelOption {
  id: string
  name: string
  code: string
  role: string
  department?: string
  targetGroup: QcTargetGroup
}

export const QC_PERSONNEL_CATALOG: PersonnelOption[] = [
  // Giáo viên
  {
    id: 'gv_01',
    name: 'Cô Hoàng Thu Thảo',
    code: 'GV-0031',
    role: 'Giáo viên Tiếng Anh',
    department: 'Tổ Tiếng Anh Giao Tiếp',
    targetGroup: 'teacher',
  },
  {
    id: 'gv_02',
    name: 'Hoàng Minh',
    code: 'GV-0012',
    role: 'Giáo viên Robotics & STEM',
    department: 'Tổ Giáo viên STEM',
    targetGroup: 'teacher',
  },
  {
    id: 'gv_03',
    name: 'Trần Quang Huy',
    code: 'GV-0025',
    role: 'Giáo viên Toán Tư Duy',
    department: 'Tổ Toán Tư Duy',
    targetGroup: 'teacher',
  },
  {
    id: 'gv_04',
    name: 'Lê Thị Thùy Dung',
    code: 'GV-0044',
    role: 'Giáo viên Mầm Non',
    department: 'Tổ Tiếng Anh Mầm Non',
    targetGroup: 'teacher',
  },
  {
    id: 'gv_05',
    name: 'Vũ Minh Anh',
    code: 'GV-0052',
    role: 'Giáo viên Tiểu Học',
    department: 'Tổ Tiểu Học',
    targetGroup: 'teacher',
  },
  {
    id: 'gv_06',
    name: 'Đặng Tuấn Kiệt',
    code: 'GV-0063',
    role: 'Giáo viên Lập trình',
    department: 'Tổ Lập trình Scratch',
    targetGroup: 'teacher',
  },

  // Cơ sở vật chất
  {
    id: 'kt_01',
    name: 'Võ Minh Tuấn',
    code: 'KT-0104',
    role: 'Kỹ thuật viên CSVC',
    department: 'Bộ phận Kỹ thuật & CSVC',
    targetGroup: 'facility',
  },
  {
    id: 'kt_02',
    name: 'Nguyễn Văn Tùng',
    code: 'QL-0088',
    role: 'Quản lý Cơ sở',
    department: 'Ban Quản trị Cơ sở',
    targetGroup: 'facility',
  },
  {
    id: 'kt_03',
    name: 'Bùi Đức Long',
    code: 'KT-0115',
    role: 'Kỹ thuật viên Điện lạnh',
    department: 'Bộ phận Kỹ thuật & CSVC',
    targetGroup: 'facility',
  },
  {
    id: 'kt_04',
    name: 'Trần Hữu Nam',
    code: 'KT-0120',
    role: 'Kỹ thuật viên IT & Mạng',
    department: 'Bộ phận Kỹ thuật & CSVC',
    targetGroup: 'facility',
  },

  // Vận hành
  {
    id: 'cs_01',
    name: 'Nguyễn Thị Mai',
    code: 'CS-0201',
    role: 'Tổ trưởng Chuyên môn & CSM',
    department: 'Ban Vận hành & CSM',
    targetGroup: 'operations',
  },
  {
    id: 'cs_02',
    name: 'Lê Thị Hương',
    code: 'CS-0205',
    role: 'Chuyên viên CSM',
    department: 'Bộ phận CSM',
    targetGroup: 'operations',
  },
  {
    id: 'cs_03',
    name: 'Phạm Đức Thắng',
    code: 'CS-0211',
    role: 'Chuyên viên CSM & Lễ tân',
    department: 'Bộ phận Lễ tân & Đón tiếp',
    targetGroup: 'operations',
  },
  {
    id: 'cs_04',
    name: 'Trần Văn Bình',
    code: 'CS-0218',
    role: 'Chuyên viên Vận hành CS',
    department: 'Ban Vận hành & CSM',
    targetGroup: 'operations',
  },
  {
    id: 'cs_05',
    name: 'Ngô Phương Linh',
    code: 'CS-0225',
    role: 'Chuyên viên Điều phối ca',
    department: 'Ban Vận hành & CSM',
    targetGroup: 'operations',
  },
]

export interface SearchablePersonnelSelectProps {
  value?: string
  targetGroup: QcTargetGroup
  onSelect: (personnel: PersonnelOption) => void
  onClear?: () => void
  placeholder?: string
  className?: string
}

export function SearchablePersonnelSelect({
  value,
  targetGroup,
  onSelect,
  onClear,
  placeholder,
  className,
}: SearchablePersonnelSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Find currently selected personnel option by name
  const selectedPersonnel = useMemo(() => {
    if (!value) return null
    return (
      QC_PERSONNEL_CATALOG.find(
        (p) => p.name.toLowerCase() === value.toLowerCase() && p.targetGroup === targetGroup
      ) ||
      QC_PERSONNEL_CATALOG.find((p) => p.name.toLowerCase() === value.toLowerCase()) || {
        id: 'custom',
        name: value,
        code: targetGroup === 'teacher' ? 'GV' : targetGroup === 'facility' ? 'KT' : 'CS',
        role: targetGroup === 'teacher' ? 'Giáo viên' : targetGroup === 'facility' ? 'Kỹ thuật' : 'Vận hành',
        targetGroup,
      }
    )
  }, [value, targetGroup])

  // Filter options based on targetGroup and search term
  const filteredList = useMemo(() => {
    const list = QC_PERSONNEL_CATALOG.filter((p) => p.targetGroup === targetGroup)
    if (!search.trim()) return list
    const q = search.toLowerCase().trim()
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        (p.department && p.department.toLowerCase().includes(q))
    )
  }, [targetGroup, search])

  const defaultPlaceholder =
    targetGroup === 'teacher'
      ? 'Tìm & chọn giáo viên...'
      : targetGroup === 'facility'
        ? 'Tìm & chọn nhân viên CSVC...'
        : 'Tìm & chọn nhân viên vận hành...'

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-2xs transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer text-left',
            className
          )}
        >
          {selectedPersonnel ? (
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] shrink-0">
                {selectedPersonnel.name.slice(0, 1)}
              </span>
              <span className="font-medium text-foreground truncate text-xs">
                {selectedPersonnel.name}
              </span>
              <Badge
                variant="outline"
                className="text-[10px] px-1 py-0 h-4 font-mono font-bold bg-muted/50 border-border/80 shrink-0"
              >
                {selectedPersonnel.code}
              </Badge>
            </div>
          ) : (
            <span className="text-muted-foreground truncate font-normal">
              {placeholder || defaultPlaceholder}
            </span>
          )}

          <div className="flex items-center gap-1 shrink-0 ml-1">
            {value && onClear ? (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  onClear()
                }}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                title="Xóa lựa chọn"
              >
                <X className="h-3 w-3" />
              </span>
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-70" />
            )}
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-[300px] p-0 bg-popover text-popover-foreground shadow-lg border border-border/80 rounded-lg overflow-hidden text-xs z-50"
      >
        {/* Search Input bar */}
        <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-border/60 bg-muted/30">
          <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên hoặc mã nhân sự..."
            className="h-6 w-full text-xs bg-transparent border-0 outline-none focus:outline-none placeholder:text-muted-foreground text-foreground"
            autoFocus
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Options list */}
        <div className="max-h-52 overflow-y-auto p-1 space-y-0.5">
          {filteredList.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground space-y-2">
              <p>Không tìm thấy nhân sự phù hợp.</p>
              {search.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    onSelect({
                      id: `custom_${Date.now()}`,
                      name: search.trim(),
                      code:
                        targetGroup === 'teacher'
                          ? 'GV-NEW'
                          : targetGroup === 'facility'
                            ? 'KT-NEW'
                            : 'CS-NEW',
                      role:
                        targetGroup === 'teacher'
                          ? 'Giáo viên'
                          : targetGroup === 'facility'
                            ? 'Kỹ thuật viên'
                            : 'Chuyên viên',
                      targetGroup,
                    })
                    setOpen(false)
                    setSearch('')
                  }}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline cursor-pointer bg-primary/10 px-2 py-1 rounded"
                >
                  <User className="h-3 w-3" />
                  <span>Sử dụng: &ldquo;{search.trim()}&rdquo;</span>
                </button>
              )}
            </div>
          ) : (
            filteredList.map((person) => {
              const isSelected = selectedPersonnel?.id === person.id || selectedPersonnel?.name === person.name
              return (
                <div
                  key={person.id}
                  onClick={() => {
                    onSelect(person)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors text-xs',
                    isSelected
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted/70 text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-6 w-6 rounded-full bg-muted flex items-center justify-center font-bold text-[10px] text-foreground shrink-0 border border-border/50">
                      {person.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-medium text-xs text-foreground truncate">
                          {person.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1 py-0 h-3.5 font-mono text-muted-foreground"
                        >
                          {person.code}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-normal truncate">
                        {person.role} {person.department ? `• ${person.department}` : ''}
                      </p>
                    </div>
                  </div>

                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-1.5" />}
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
