'use client'

import { useState, useMemo } from 'react'
import {
  Headset,
  ArrowLeftRight,
  ChevronDown,
  Search,
  Check,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PersonnelHoverCard, AppAvatar, type PersonnelItem } from '@/components/shared'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface CSStaffMember {
  id: string
  name: string
  code: string
  role?: string
  phone?: string
  email?: string
  avatar: string
}

export interface AssistantStaff {
  id: string
  name: string
  role: string
  titleHeader?: string
  badge?: string
  phone: string
  email: string
  avatar: string
}

export interface TeacherStaff {
  id: string
  name: string
  role: string
  phone?: string
  email?: string
  avatar: string
}

export interface StudentCarePersonnelClusterProps {
  assignedCS: string
  onAssignedCSChange: (csName: string) => void
  csStaffList: CSStaffMember[]
  mainTeacher: TeacherStaff
  assistants?: AssistantStaff[]
  className?: string
}

export function StudentCarePersonnelCluster({
  assignedCS,
  onAssignedCSChange,
  csStaffList,
  mainTeacher,
  assistants = [],
  className,
}: StudentCarePersonnelClusterProps) {
  const [isCsPopoverOpen, setIsCsPopoverOpen] = useState(false)
  const [csSearchQuery, setCsSearchQuery] = useState('')

  // Clean teacher name to remove "GV." or "GV " prefix if inline label already says "GV:"
  const cleanedTeacherName = useMemo(() => {
    return mainTeacher.name.replace(/^GV\.?\s*/i, '').trim()
  }, [mainTeacher.name])

  // Current active CS object
  const currentCSObj = useMemo(() => {
    return (
      csStaffList.find((c) => c.name.toLowerCase() === assignedCS.toLowerCase()) ||
      csStaffList[0] || {
        id: 'cs-mai',
        name: assignedCS || 'Trần Thị Mai',
        code: 'EMP-CS-001',
        role: 'Chuyên viên CSKH',
        phone: '0901 112 233',
        email: 'mai.tt@rinoedu.vn',
        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mai',
      }
    )
  }, [assignedCS, csStaffList])

  const filteredCsList = useMemo(() => {
    if (!csSearchQuery.trim()) return csStaffList
    const q = csSearchQuery.toLowerCase()
    return csStaffList.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.role && item.role.toLowerCase().includes(q))
    )
  }, [csSearchQuery, csStaffList])

  const csPersonnelItem: PersonnelItem = useMemo(
    () => ({
      id: currentCSObj.code,
      name: currentCSObj.name,
      role: currentCSObj.role || 'Chuyên viên Chăm sóc Khách hàng (CS)',
      phone: currentCSObj.phone || '0901 112 233',
      email: currentCSObj.email || 'mai.tt@rinoedu.vn',
      avatar: currentCSObj.avatar,
    }),
    [currentCSObj]
  )

  const teacherPersonnelItem: PersonnelItem = useMemo(
    () => ({
      id: mainTeacher.id,
      name: cleanedTeacherName,
      role: mainTeacher.role || 'Giáo viên phụ trách',
      phone: mainTeacher.phone || '0912 345 678',
      email: mainTeacher.email || 'giaovien@rinoedu.vn',
      avatar: mainTeacher.avatar,
    }),
    [mainTeacher, cleanedTeacherName]
  )

  const handleSelectCS = (staff: CSStaffMember) => {
    onAssignedCSChange(staff.name)
    setIsCsPopoverOpen(false)
    setCsSearchQuery('')
    toast.success(`Đã chuyển người phụ trách CS sang: ${staff.name}`)
  }

  return (
    <div
      className={cn(
        'shrink-0 flex flex-col items-start xl:items-end justify-center gap-1 select-none',
        className
      )}
    >
      {/* ── Hàng 1: Người phụ trách CS (có icon đổi) ── */}
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-muted-foreground text-[11px] font-medium flex items-center gap-1">
          <Headset className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>Phụ trách:</span>
        </span>

        {/* Hover xem thông tin chi tiết CS */}
        <PersonnelHoverCard person={csPersonnelItem} align="end">
          <button
            type="button"
            className="font-bold text-xs text-foreground hover:text-primary transition-colors cursor-pointer decoration-dotted underline underline-offset-3 decoration-muted-foreground/40 hover:decoration-primary px-1 py-0.5 rounded hover:bg-muted/50"
            title="Di chuột để xem hồ sơ người phụ trách CS"
          >
            {currentCSObj.name}
          </button>
        </PersonnelHoverCard>

        {/* Nút đổi người phụ trách CS với Popover tìm kiếm & chọn */}
        <Popover open={isCsPopoverOpen} onOpenChange={setIsCsPopoverOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-5 w-5 rounded inline-flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors cursor-pointer shrink-0"
              title="Đổi người phụ trách CS"
              aria-label="Đổi người phụ trách CS"
            >
              <ArrowLeftRight className="h-3 w-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className="w-72 p-2 space-y-2 max-h-80 flex flex-col z-50 shadow-md bg-popover text-popover-foreground"
          >
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-muted/50 rounded-md border border-border/60">
              <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <input
                value={csSearchQuery}
                onChange={(e) => setCsSearchQuery(e.target.value)}
                placeholder="Tìm nhân sự CS..."
                className="w-full bg-transparent text-xs outline-none p-0 placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
            <div className="text-[10.5px] font-semibold text-muted-foreground uppercase px-1 pb-0.5 border-b border-border/40">
              Chọn nhân sự phụ trách CS
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 max-h-52 pr-0.5">
              {filteredCsList.length === 0 ? (
                <div className="py-3 text-center text-xs text-muted-foreground">
                  Không tìm thấy nhân sự phù hợp
                </div>
              ) : (
                filteredCsList.map((staff) => {
                  const isSelected =
                    staff.name.toLowerCase() === assignedCS.toLowerCase()
                  return (
                    <div
                      key={staff.id}
                      onClick={() => handleSelectCS(staff)}
                      className={cn(
                        'flex items-center justify-between px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors min-h-[34px]',
                        isSelected
                          ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 font-medium'
                          : 'hover:bg-muted/70 text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <AppAvatar
                          src={staff.avatar}
                          name={staff.name}
                          size="xs"
                          className="h-6 w-6 border border-border/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold block truncate">
                            {staff.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {staff.code} {staff.role ? `• ${staff.role}` : ''}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400 shrink-0 ml-1" />
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* ── Hàng 2: GV Phụ trách & N+ Trợ giảng ── */}
      <div className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
        <span className="text-muted-foreground text-[11px] font-medium">GV:</span>

        {/* Hover xem chi tiết GV */}
        <PersonnelHoverCard person={teacherPersonnelItem} align="end">
          <button
            type="button"
            className="font-bold text-xs text-foreground hover:text-primary transition-colors cursor-pointer px-1 py-0.5 rounded hover:bg-muted/50"
            title="Di chuột để xem hồ sơ giáo viên"
          >
            {cleanedTeacherName}
          </button>
        </PersonnelHoverCard>

        {/* Nút mở rộng +N trợ giảng / GV phụ */}
        {assistants.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800 text-[11px] font-semibold border border-sky-200/80 transition-colors cursor-pointer shadow-3xs"
                title={`Xem thêm ${assistants.length} trợ giảng / giáo viên phụ`}
              >
                <span>+{assistants.length}</span>
                <ChevronDown className="h-3 w-3 text-sky-600 dark:text-sky-400 stroke-[2.5]" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-72 p-3.5 rounded-xl shadow-lg border bg-popover text-popover-foreground z-50 text-left space-y-3"
            >
              {assistants.map((ast, idx) => (
                <div key={ast.id || idx} className="space-y-2.5">
                  {/* Tiêu đề & badge theo mẫu ảnh 2 */}
                  <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                    <h4 className="text-xs font-bold text-foreground">
                      {ast.titleHeader || 'Trợ giảng buổi học'}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {ast.badge || 'Trợ giảng'}
                    </span>
                  </div>

                  {/* Avatar + Tên + Chức danh */}
                  <div className="flex items-center gap-2.5">
                    <AppAvatar
                      src={ast.avatar}
                      name={ast.name}
                      size="sm"
                      className="h-10 w-10 border border-border/60 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground leading-tight">
                        {ast.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {ast.role}
                      </p>
                    </div>
                  </div>

                  {/* SĐT & Email */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Số điện thoại:</span>
                      <span className="font-bold text-foreground font-mono">
                        {ast.phone}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-bold text-foreground font-mono truncate max-w-[170px]">
                        {ast.email}
                      </span>
                    </div>
                  </div>

                  {idx < assistants.length - 1 && (
                    <div className="border-t border-border/40 my-2" />
                  )}
                </div>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
