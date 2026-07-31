'use client'

import { useMemo, useState } from 'react'
import { InfoField, Panel, FieldLabel, PersonnelHoverCard, AppAvatar, TeacherHistoryPopover } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { InlineSelect } from '@/components/controls'
import { 
  Users, 
  UserPlus,
  UserCog,
  GraduationCap,
  MapPin,
  BookOpen,
  UserCheck,
  CalendarClock,
  CalendarDays,
  Layers,
  Pencil,
  Undo,
  Play,
  FileText,
  Copy,
  AlertTriangle,
  AlertCircle,
  Pause,
  Ban,
  Route,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { SyllabusProfileHoverCard } from '../SyllabusProfileHoverCard'

import type { ClassRecord } from '@/mocks/classRecords'
import { CLASS_LEVELS } from '@/mocks/classRecords'
import { mockTeachers } from '@/mocks/teacherRecords'
import {
  getRoomsForBranch,
} from '../classesCreateTypes'
import type { ClassesStatusChangeRequest } from './ClassesDetailHeader'

interface ClassesDetailOverviewProps {
  cls: ClassRecord
  isEditing?: boolean
  editFormState?: ClassRecord | null
  onEditStateChange?: (val: ClassRecord) => void
  hideClassType?: boolean
  validationErrors?: Record<string, string>
  onStartEdit?: () => void
  onRescheduleClick?: () => void
  onCancelEdit?: () => void
  onSave?: () => void
  onRequestStatusChange?: (request: ClassesStatusChangeRequest) => void
  onEditRoadmap?: () => void
}

export function ClassesDetailOverview({ 
  cls,
  isEditing = false,
  editFormState,
  onEditStateChange,
  hideClassType = false,
  validationErrors,
  onStartEdit,
  onRescheduleClick,
  onCancelEdit,
  onSave,
  onRequestStatusChange,
  onEditRoadmap,
}: ClassesDetailOverviewProps) {


  // Popover States for Teacher Selection
  const [teacherSearch, setTeacherSearch] = useState('')
  const [isTeacherPopoverOpen, setIsTeacherPopoverOpen] = useState(false)



  // Sort teachers alphabetically (Vietnamese locale-aware)
  const sortedTeachers = useMemo(() => [...mockTeachers].sort((a, b) => a.name.localeCompare(b.name, 'vi')), [])

  const filteredTeachers = useMemo(() => {
    const sorted = sortedTeachers.filter((t) => t.status === 'active')
    if (!teacherSearch) return sorted
    const q = teacherSearch.toLowerCase()
    return sorted.filter((t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q))
  }, [sortedTeachers, teacherSearch])
  
  const handleFieldChange = (field: keyof ClassRecord, value: ClassRecord[keyof ClassRecord]) => {
    if (onEditStateChange && editFormState) {
      onEditStateChange({
        ...editFormState,
        [field]: value
      })
    }
  }

  const teacherRecord = useMemo(() => {
    const name = isEditing ? editFormState?.teacher : cls.teacher
    if (!name) return null
    return mockTeachers.find((t) => t.name === name) || null
  }, [isEditing, editFormState?.teacher, cls.teacher])

  if (isEditing && editFormState) {
    const isNotStarted = editFormState.status === 'nhap' || editFormState.status === 'mo_chieu_sinh' || editFormState.status === 'cho_khai_giang'
    return (
      <div className="space-y-4 pt-1 flex-1 flex flex-col min-h-0">
        <Panel 
          title="Thông tin" 
          actions={
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs font-semibold gap-1"
                onClick={onCancelEdit}
              >
                <Undo className="h-3.5 w-3.5" />
                <span>Hủy</span>
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-7 px-2.5 text-xs font-semibold gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onSave}
              >
                <Play className="h-3.5 w-3.5" />
                <span>Lưu thay đổi</span>
              </Button>
            </div>
          }
          className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-3.5"
        >
          <div className="grid gap-y-3 grid-cols-1">
            <FieldLabel label="Tên lớp" required error={validationErrors?.name}>
              <Input 
                value={editFormState.name || ''} 
                onChange={(e) => handleFieldChange('name', e.target.value)} 
                className={`h-9 bg-background ${validationErrors?.name ? 'border-destructive focus-visible:ring-destructive text-destructive' : ''}`}
              />
            </FieldLabel>

            <FieldLabel label="Mã lớp" required>
              <Input 
                value={editFormState.code || ''} 
                onChange={(e) => handleFieldChange('code', e.target.value)} 
                className="h-9 bg-background"
              />
            </FieldLabel>

            <FieldLabel label="Trình độ">
              <InlineSelect
                value={editFormState.subLevel || ''}
                options={['5.0–5.5', '5.5–6.0', '6.0–6.5', '6.5–7.0', '450–550', '550–650', 'A1–A2', 'A2', 'A1'].map((l) => ({ value: l, label: l }))}
                placeholder="Chọn trình độ"
                onValueChange={(val) => handleFieldChange('subLevel', val)}
                className="w-full justify-between h-9 bg-background"
                variant="solid"
              />
            </FieldLabel>

            <FieldLabel label="Loại giáo viên">
              <InlineSelect
                value={editFormState.teacherType || 'Việt Nam'}
                options={[
                  { value: 'Việt Nam', label: 'Việt Nam' },
                  { value: 'Nước ngoài', label: 'Nước ngoài' },
                  { value: 'Song ngữ', label: 'Song ngữ' }
                ]}
                placeholder="Chọn loại giáo viên"
                onValueChange={(val) => handleFieldChange('teacherType', val)}
                className="w-full justify-between h-9 bg-background"
                variant="solid"
              />
            </FieldLabel>

            <FieldLabel label="Phòng học cố định" error={validationErrors?.room}>
              <InlineSelect
                value={editFormState.room || ''}
                options={getRoomsForBranch(editFormState.branch || '')}
                placeholder={editFormState.branch ? "Chọn phòng học..." : "Vui lòng chọn trường trước"}
                onValueChange={(val) => handleFieldChange('room', val)}
                disabled={!editFormState.branch}
                className={`w-full justify-between h-9 bg-background ${validationErrors?.room ? 'border-destructive text-destructive' : ''}`}
                variant="solid"
              />
            </FieldLabel>

            <FieldLabel label="Ngày khai giảng" error={validationErrors?.startDate}>
              <Input
                type="date"
                value={editFormState.startDate || ''}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
                disabled={!isNotStarted}
                className={`h-9 bg-background ${validationErrors?.startDate ? 'border-destructive focus-visible:ring-destructive text-destructive' : ''}`}
              />
            </FieldLabel>

            <FieldLabel label="Ngày bế giảng dự kiến" error={validationErrors?.endDate}>
              <Input 
                type="date"
                value={editFormState.endDate || ''}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
                className="h-9 bg-background"
              />
            </FieldLabel>
          </div>
        </Panel>
      </div>
    )
  }

  interface DefaultTeacher {
    id: string
    name: string
    phone: string
    email: string
    isLeave?: boolean
    leaveReason?: string
  }

  // Distinct teachers per schedule day
  const defaultDays: Array<{
    dayOfWeek: string
    startTime: string
    endTime: string
    room: string
    teacher: DefaultTeacher
    assistant?: { id: string; name: string; phone: string; email: string }
  }> = [
    {
      dayOfWeek: 'Thứ 2',
      startTime: '18:00',
      endTime: '19:30',
      room: cls.room || 'A101',
      teacher: { id: 'EMP-LAN', name: 'Cô Lan', phone: '0912345678', email: 'lan.nt@rinoedu.edu.vn' },
      assistant: { id: 'EMP-HA', name: 'Hoàng Anh', phone: '0934567890', email: 'hoanganh@rinoedu.com' },
    },
    {
      dayOfWeek: 'Thứ 4',
      startTime: '18:00',
      endTime: '19:30',
      room: cls.room || 'A101',
      teacher: { id: 'EMP-LINH', name: 'Cô Mỹ Linh', phone: '0987654321', email: 'linh.pm@rinoedu.edu.vn', isLeave: true, leaveReason: 'Xin nghỉ phép cá nhân' },
    },
    {
      dayOfWeek: 'Thứ 6',
      startTime: '18:00',
      endTime: '19:30',
      room: cls.room || 'A101',
      teacher: { id: 'EMP-RED', name: 'Coenrad Redman', phone: '0909123456', email: 'coenrad.r@rinoedu.edu.vn' },
      assistant: { id: 'EMP-NGOC', name: 'Bảo Ngọc', phone: '0911223344', email: 'baongoc@rinoedu.com' },
    },
  ]

  const scheduleDays = (cls.scheduleSlots && cls.scheduleSlots.length > 0)
    ? cls.scheduleSlots.map((slot, idx) => {
        const defaultItem = defaultDays[idx % defaultDays.length]
        const slotTeacherName = (slot as { teacherName?: string }).teacherName
        const slotIsLeave = (slot as { isLeave?: boolean }).isLeave
        const slotLeaveReason = (slot as { leaveReason?: string }).leaveReason
        return {
          ...slot,
          assistant: defaultItem.assistant,
          teacher: slotTeacherName ? {
            id: `EMP-${slotTeacherName.split(' ').map((n) => n[0]).join('').toUpperCase()}`,
            name: slotTeacherName,
            phone: '0901234567',
            email: `${slotTeacherName.toLowerCase().replace(/\s+/g, '')}@rinoedu.edu.vn`,
            isLeave: slotIsLeave ?? false,
            leaveReason: slotLeaveReason
          } : {
            ...defaultItem.teacher,
            isLeave: slotIsLeave ?? defaultItem.teacher.isLeave ?? false,
            leaveReason: slotLeaveReason ?? defaultItem.teacher.leaveReason
          }
        }
      })
    : defaultDays

  // Read-only view
  const isMath = Boolean(
    cls.level?.toLowerCase().includes('toán') ||
    cls.level?.toLowerCase().includes('math') ||
    cls.name?.toLowerCase().includes('toán') ||
    cls.name?.toLowerCase().includes('math')
  )

  return (
    <div className="space-y-4 pt-1 flex-1 flex flex-col min-h-0">
      {/* Khung 1: Cụm Thông tin */}
      <Panel 
        title="Thông tin" 
        headerClassName="-mx-3.5 -mt-3.5 mb-3 px-3.5 py-2.5 bg-muted/40 dark:bg-muted/20 border-b border-border/50 rounded-t-xl"
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="text-[11px] font-semibold text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors focus:outline-none"
              >
                <span>Cập nhật</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs z-50">
              <DropdownMenuItem
                onClick={() => onStartEdit?.()}
                className="gap-2 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5 text-primary" />
                <span>Cập nhật thông tin</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => onEditRoadmap?.()}
                className="gap-2 cursor-pointer font-medium"
              >
                <Route className="h-3.5 w-3.5 text-primary" />
                <span>Đổi lộ trình</span>
              </DropdownMenuItem>

              {(cls.status === 'tam_dung' || cls.status === 'huy') ? (
                <DropdownMenuItem
                  onClick={() => {
                    if (onRequestStatusChange) {
                      onRequestStatusChange({
                        newStatus: 'dang_hoc',
                        actionText: 'Đã kích hoạt lớp học đang tạm nghỉ quay trở lại Đang học.',
                        title: 'Mở lại lớp học',
                        description: 'Bạn có chắc chắn muốn mở lại và tiếp tục vận hành lớp học này?',
                      })
                    } else {
                      toast.success('Đã mở lại lớp học!')
                    }
                  }}
                  className="gap-2 text-emerald-600 dark:text-emerald-400 focus:text-emerald-600 cursor-pointer font-medium"
                >
                  <Play className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Mở lại lớp học</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    if (onRequestStatusChange) {
                      onRequestStatusChange({
                        newStatus: 'tam_dung',
                        actionText: 'Đã chuyển lớp học sang trạng thái Tạm nghỉ.',
                        title: 'Tạm nghỉ lớp học',
                        description: 'Bạn có chắc chắn muốn tạm ngưng vận hành lớp học này và chuyển sang trạng thái Tạm nghỉ?',
                      })
                    } else {
                      toast.info('Đã gửi yêu cầu Tạm nghỉ lớp học!')
                    }
                  }}
                  className="gap-2 text-amber-600 dark:text-amber-400 focus:text-amber-600 cursor-pointer font-medium"
                >
                  <Pause className="h-3.5 w-3.5" />
                  <span>Tạm nghỉ lớp học</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => {
                  if (onRequestStatusChange) {
                    onRequestStatusChange({
                      newStatus: 'huy',
                      actionText: 'Đã đóng lớp học.',
                      title: 'Xác nhận Đóng lớp?',
                      description: 'Bạn có chắc chắn muốn đóng lớp học này?',
                    })
                  } else {
                    toast.info('Đã gửi yêu cầu Đóng lớp học!')
                  }
                }}
                className="gap-2 text-destructive focus:text-destructive cursor-pointer font-semibold"
              >
                <Ban className="h-3.5 w-3.5" />
                <span>Đóng lớp</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-3 overflow-hidden"
      >
        {/* Grid 2 cột: Nhãn mờ (text-muted-foreground) + Giá trị */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-0.5">
          {/* Item 1: Tên lớp (IN ĐẬM) */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Tên lớp</span>
            <span className="text-xs md:text-[13px] font-bold text-foreground block truncate">{cls.name}</span>
          </div>

          {/* Item 2: Mã lớp (Có icon copy) */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Mã lớp</span>
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs md:text-[13px] font-normal text-foreground font-mono truncate">{cls.code}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  if (cls.code) {
                    navigator.clipboard.writeText(cls.code)
                    toast.success(`Đã sao chép mã lớp: ${cls.code}`)
                  }
                }}
                className="h-5 w-5 rounded text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                title="Sao chép mã lớp"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Item 3: Cơ sở đào tạo (IN ĐẬM) */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Cơ sở đào tạo</span>
            <span className="text-xs md:text-[13px] font-bold text-foreground block truncate">{cls.branch}</span>
          </div>

          {/* Item 4: Phòng học (IN ĐẬM) */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Phòng học</span>
            <span className="text-xs md:text-[13px] font-bold text-foreground block truncate">{cls.room || 'A101'}</span>
          </div>

          {/* Item 5: Khung chương trình (Đã đổi vị trí lên trước Môn học - IN ĐẬM + MÀU XANH NHẸ) */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Khung chương trình</span>
            <SyllabusProfileHoverCard cls={cls}>
              <span className="text-xs md:text-[13px] font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer inline-flex items-center gap-1 truncate">
                {cls.syllabus || 'IELTS Junior v2.1'}
              </span>
            </SyllabusProfileHoverCard>
          </div>

          {/* Item 6: Trình độ (IN ĐẬM) */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Trình độ</span>
            <span className="text-xs md:text-[13px] font-bold text-foreground block truncate">
              {cls.level || (isMath ? 'Toán THCS' : 'IELTS')}
              {(cls.subLevel || (isMath ? 'Nâng cao' : '5.0–5.5')) ? ` (${cls.subLevel || (isMath ? 'Nâng cao' : '5.0–5.5')})` : ''}
            </span>
          </div>

          {/* Item 7: Môn học (Đã chuyển xuống vị trí cũ của Khung chương trình) */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Môn học</span>
            <span className="text-xs md:text-[13px] font-normal text-foreground block truncate">{isMath ? 'Môn Toán' : 'Tiếng Anh'}</span>
          </div>

          {/* Item 8: Loại lớp */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Loại lớp</span>
            <span className="text-xs md:text-[13px] font-normal text-foreground block truncate">{cls.classRatio || (cls.maxStudents ? `1:${cls.maxStudents}` : '1:20')}</span>
          </div>

          {/* Item 9: Loại giáo viên */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Loại giáo viên</span>
            <span className="text-xs md:text-[13px] font-normal text-foreground block truncate">{cls.teacherType || 'Việt Nam'}</span>
          </div>

          {/* Item 10 (Nếu là Môn toán): Lớp phổ thông */}
          {isMath && (
            <div className="min-w-0 space-y-0.5">
              <span className="text-[11px] font-medium text-muted-foreground block">Lớp phổ thông</span>
              <span className="text-xs md:text-[13px] font-normal text-foreground block truncate">{cls.grade || 'Lớp 7'}</span>
            </div>
          )}

          {/* Item 11: Thời gian */}
          <div className="min-w-0 space-y-0.5">
            <span className="text-[11px] font-medium text-muted-foreground block">Thời gian</span>
            <span className="text-xs md:text-[13px] font-normal text-foreground block truncate">
              {cls.startDate && cls.startDate !== '---' ? new Date(cls.startDate).toLocaleDateString('vi-VN') : '01/05/2026'} – {cls.endDate && cls.endDate !== '---' ? new Date(cls.endDate).toLocaleDateString('vi-VN') : '01/08/2026'}
            </span>
          </div>
        </div>
      </Panel>

      {/* Khung 2: Cụm Lịch học */}
      <Panel 
        title="Lịch học" 
        headerClassName="-mx-3.5 -mt-3.5 mb-3 px-3.5 py-2.5 bg-muted/40 dark:bg-muted/20 border-b border-border/50 rounded-t-xl"
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[11px] font-semibold text-primary hover:bg-primary/10 hover:text-primary gap-1"
            onClick={() => onRescheduleClick?.()}
          >
            <span>Đổi lịch</span>
          </Button>
        }
        className="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-3.5 overflow-hidden"
      >
        <div className="space-y-2.5">
          {scheduleDays.map((slot, idx) => (
            <div key={idx} className="flex items-start justify-between gap-2 py-2 border-b border-border/40 last:border-none">
              {/* Cột 1: Lịch học (Thứ & Giờ) */}
              <div className="flex flex-col gap-0.5 w-[75px] shrink-0">
                <div className="font-medium text-foreground text-xs">
                  {slot.dayOfWeek}
                </div>
                <div className="text-muted-foreground text-[11px] font-normal">
                  {slot.startTime}–{slot.endTime}
                </div>
              </div>

              {/* Cột 2 & 3: Tách Cột Giáo viên (GV) & Cột Trợ giảng (TG) riêng ra, không dùng Avatar, chỉ hiện tên đầy đủ */}
              <div className="flex items-start gap-4 ml-auto shrink-0">
                {/* Cột Giáo viên chính */}
                <div className="flex flex-col min-w-0 w-[140px] shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">GV</span>
                  <PersonnelHoverCard
                    person={{
                      id: slot.teacher.id,
                      name: slot.teacher.name,
                      role: `Giáo viên (${slot.dayOfWeek})`,
                      phone: slot.teacher.phone,
                      email: slot.teacher.email
                    }}
                    align="end"
                  >
                    <div className="cursor-help inline-flex items-center gap-1 flex-wrap text-xs font-normal text-foreground leading-snug">
                      <span>{slot.teacher.name}</span>
                      {(slot.teacher as { isLeave?: boolean }).isLeave && (
                        <span className="text-rose-600 dark:text-rose-400 italic font-normal">
                          (Nghỉ)
                        </span>
                      )}
                    </div>
                  </PersonnelHoverCard>
                </div>

                {/* Cột Trợ giảng (TG) */}
                <div className="flex flex-col min-w-0 w-[110px] shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">TG</span>
                  {slot.assistant ? (
                    <PersonnelHoverCard
                      person={{
                        id: slot.assistant.id,
                        name: slot.assistant.name,
                        role: `Trợ giảng (${slot.dayOfWeek})`,
                        phone: slot.assistant.phone,
                        email: slot.assistant.email
                      }}
                      align="end"
                    >
                      <span className="cursor-help text-xs font-normal text-foreground block truncate" title={slot.assistant.name}>
                        {slot.assistant.name}
                      </span>
                    </PersonnelHoverCard>
                  ) : (
                    <span className="text-[11px] text-muted-foreground/50 italic font-normal block">
                      Chưa có
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Textlink "Lịch sử đổi Xx lần giáo viên" ở dưới cùng section, phía cạnh phải */}
        <div className="flex items-center justify-end pt-2 border-t border-border/40 mt-1">
          <TeacherHistoryPopover
            history={cls.teacherHistory || [
              { name: 'Cô Hoàng Thị Mai', role: 'Chủ nhiệm', startDate: '15/07/2026', phone: '0912 345 678', isCurrent: true },
              { name: 'Cô Nguyễn Thị Hoa (GV TA)', role: 'GV Tiếng Anh', startDate: '01/01/2026', endDate: '15/07/2026', reason: 'Học viên dời sang lớp mới LD_TA_00019', isCurrent: false },
              { name: 'Thấy David Wilson (GV NN)', role: 'GV Bản ngữ', startDate: '01/01/2026', endDate: '30/04/2026', reason: 'Hoàn thành kỳ giảng dạy bản ngữ 4 tháng', isCurrent: false },
            ]}
            currentTeacher={cls.teacher}
            currentTeacherPhone={cls.teacherPhone}
            align="end"
            trigger={
              <button
                type="button"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary/80 hover:underline cursor-pointer transition-colors focus:outline-none"
              >
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>Lịch sử đổi {cls.teacherHistory?.length || 3} lần giáo viên</span>
              </button>
            }
          />
        </div>
      </Panel>
    </div>
  )
}
