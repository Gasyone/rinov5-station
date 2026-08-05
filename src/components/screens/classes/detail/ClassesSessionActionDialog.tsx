'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { 
  User, 
  MapPin, 
  Check,
  Search
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'

import type { RoadmapSession, RosterStudent } from './classesDetailTypes'
import { getInitials, getAvatarColor } from './classesSessionDetailHelpers'

interface ClassesSessionActionDialogProps {
  isOpen: boolean
  onClose: () => void
  session: RoadmapSession | null
  type: 'teacher' | 'room' | 'upload' | 'reschedule' | null
  onSave: (sessionId: string, updates: Partial<RoadmapSession>) => void
  student?: RosterStudent | null
}

export function ClassesSessionActionDialog({
  isOpen,
  onClose,
  session,
  type,
  onSave,
  student
}: ClassesSessionActionDialogProps) {
  // Call React Hooks unconditionally at the very top of the component
  const [selectedTeacher, setSelectedTeacher] = useState(
    session ? (session.substituteTeacherName || session.teacherName) : ''
  )
  const [selectedRoom, setSelectedRoom] = useState(
    session ? session.room : ''
  )

  const slideMaterial = session ? (session.materials?.find(
    (m) => m.name.toLowerCase().includes('slide') || m.name.toLowerCase().includes('bài giảng')
  ) || null) : null

  const [lectureName, setLectureName] = useState(
    slideMaterial ? slideMaterial.name : (session ? `Slide bài giảng Buổi ${session.sessionNumber}` : '')
  )
  const [lectureType, setLectureType] = useState<'Phải làm' | 'Tham khảo'>(
    (slideMaterial?.type as 'Phải làm' | 'Tham khảo') || 'Phải làm'
  )
  const [lectureLink, setLectureLink] = useState(
    slideMaterial && slideMaterial.url !== '#' ? slideMaterial.url : ''
  )

  const [roomSearch, setRoomSearch] = useState('')

  const [coverType, setCoverType] = useState(
    session ? (session.coverType || '') : ''
  )
  const [coverNote, setCoverNote] = useState(
    session ? (session.coverNote || '') : ''
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCover, setIsCover] = useState(!!session?.coverType)
  const [teacherPickerOpen, setTeacherPickerOpen] = useState(false)
  const [roomPickerOpen, setRoomPickerOpen] = useState(false)

  const [rescheduleDate, setRescheduleDate] = useState(
    session ? (session.rescheduleDate || session.date || '') : ''
  )
  const [rescheduleReason, setRescheduleReason] = useState(
    session ? (session.rescheduleNote || '') : ''
  )

  // Early return if dependencies are not loaded
  if (!session || !type) return null

  // Mock substitute teachers list
  const mockTeachers = [
    { id: 'GV001', value: 'Cô Lan', label: 'Giáo viên cơ hữu', status: 'active', conflict: 'Trùng lịch dạy lớp IELTS-A2', conflictTime: '18:00 - 19:30', isCover: false },
    { id: 'GV002', value: 'Thầy Hùng', label: 'Tổ trưởng chuyên môn', status: 'active', isCover: false },
    { id: 'GV003', value: 'Cô Hương', label: 'Giảng viên cao cấp', status: 'active', isCover: false },
    { id: 'GV004', value: 'Cô Nga', label: 'Giáo viên cơ hữu', status: 'available', conflict: 'Trùng lịch dạy lớp TOEFL-iBT', conflictTime: '17:30 - 19:00', isCover: false },
    { id: 'GV005', value: 'Thầy Quân', label: 'Giáo viên cơ hữu', status: 'available', isCover: false },
    { id: 'GV006', value: 'Cô Mai', label: 'Giáo viên cover', status: 'available', isCover: true },
    { id: 'GV007', value: 'Thầy Đức', label: 'Giáo viên cover', status: 'available', conflict: 'Trùng lịch dạy lớp KET-B1', conflictTime: '18:30 - 20:00', isCover: true },
    { id: 'GV008', value: 'Cô Trang', label: 'Giáo viên cover', status: 'available', isCover: true }
  ]

  // Mock classrooms
  const mockRooms = [
    { value: 'A101', floor: 'Tầng 1', capacity: 30, note: 'Đang có lớp khác trong khung giờ này', status: 'busy' },
    { value: 'A102', floor: 'Tầng 1', capacity: 24, note: 'Khuyên dùng cho lớp IELTS, gần khu lễ tân', status: 'available' },
    { value: 'B201', floor: 'Tầng 2', capacity: 20, note: 'Phù hợp lớp nhóm nhỏ, có bảng tương tác', status: 'available' },
    { value: 'C301', floor: 'Tầng 3', capacity: 28, note: 'Không gian yên tĩnh, phù hợp lớp luyện thi', status: 'available' },
    { value: 'D401', floor: 'Tầng 4', capacity: 18, note: 'Phòng nhỏ, ưu tiên lớp dưới 18 học viên', status: 'available' }
  ]

  const handleSaveTeacher = () => {
    // If choice is identical to base teacher, substitute is unset
    if (selectedTeacher === session.teacherName) {
      onSave(session.id, { 
        substituteTeacherName: undefined,
        coverType: undefined,
        coverNote: undefined
      })
      onClose()
    } else {
      if (isCover && !coverType) {
        setErrors({ coverType: 'Vui lòng chọn Loại Cover!' })
        return
      }
      onSave(session.id, { 
        substituteTeacherName: selectedTeacher,
        coverType: isCover ? coverType : undefined,
        coverNote: isCover ? coverNote : undefined
      })
      onClose()
    }
  }

  const handleSaveRoom = () => {
    if (!coverType) {
      setErrors({ coverType: 'Vui lòng chọn Loại Cover!' })
      return
    }
    if (!selectedRoom || selectedRoom === session.room) {
      setErrors({ room: 'Vui lòng chọn phòng học mới!' })
      return
    }
    onSave(session.id, { 
      room: selectedRoom,
      coverType,
      coverNote
    })
    onClose()
  }

  const handleSaveUpload = () => {
    const newErrors: Record<string, string> = {}
    const cleanName = lectureName.trim()
    if (!cleanName) {
      newErrors.lectureName = 'Vui lòng nhập Tên bài giảng!'
    }

    const cleanLink = lectureLink.trim()
    if (!cleanLink) {
      newErrors.lectureLink = 'Vui lòng nhập Đường dẫn (Link) video bài học!'
    } else {
      // URL validation check (must contain a dot and no spaces)
      const isUrl = cleanLink.includes('.') && !cleanLink.includes(' ')
      if (!isUrl) {
        newErrors.lectureLink = 'Vui lòng nhập đúng định dạng link liên kết (ví dụ: drive.google.com/...)'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const url = cleanLink.startsWith('http') ? cleanLink : `https://${cleanLink}`
    
    const newMat = { 
      name: cleanName, 
      url: url,
      type: lectureType
    }
    const currentMaterials = session.materials || []
    const filteredMats = currentMaterials.filter(
      (m) => !m.name.toLowerCase().includes('slide') && !m.name.toLowerCase().includes('bài giảng')
    )
    const updatedMats = [...filteredMats, newMat]
    onSave(session.id, {
      materials: updatedMats
    })
    onClose()
  }

  const handleSaveReschedule = () => {
    if (!rescheduleDate) {
      setErrors({ rescheduleDate: 'Vui lòng chọn ngày học mới!' })
      return
    }
    let formattedDate = rescheduleDate
    if (rescheduleDate.includes('-')) {
      const parts = rescheduleDate.split('-')
      if (parts.length === 3) {
        formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`
      }
    }

    onSave(session.id, {
      originalDate: session.originalDate || session.date,
      date: formattedDate,
      rescheduleDate: formattedDate,
      rescheduleNote: rescheduleReason,
    })
    toast.success(`Đã đổi lịch học thành công sang ngày ${formattedDate}!`)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent 
          className="sm:max-w-[480px] overflow-hidden p-0 rounded-2xl border border-muted shadow-lg flex flex-col gap-0 max-h-[90vh]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          
          {/* Banner header for context */}
          <div className="bg-primary/5 px-5 py-3 border-b border-muted">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground font-mono">
                  {session.date} ({session.startTime} - {session.endTime})
                </span>
              </div>
              
              <DialogTitle className="text-base font-bold text-foreground mt-2">
                {type === 'teacher' && 'Đổi giáo viên giảng dạy'}
                {type === 'room' && 'Đổi phòng học'}
                {type === 'upload' && 'Quản lý tài liệu bài giảng'}
                {type === 'reschedule' && 'Đổi lịch ngày học'}
              </DialogTitle>
              
              <DialogDescription className="text-xs text-muted-foreground mt-1 truncate">
                Chương trình: <strong>{session.topic}</strong>
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Content Body */}
          <div className="p-3 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
            {student && (
              <div className="flex items-center justify-between gap-3 px-3 py-2 bg-zinc-50 border rounded-xl border-zinc-200/80 mb-1">
                <span className="text-xs text-muted-foreground font-medium">Tải tài liệu cho học viên:</span>
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                    getAvatarColor(student.id)
                  )}>
                    {getInitials(student.name)}
                  </div>
                  <span className="text-xs">{student.name} ({student.code})</span>
                </div>
              </div>
            )}
            
            {/* A. TEACHER MODE */}
            {type === 'teacher' && (
              <div className="space-y-2">
                {/* General Info box */}
                <div className="rounded-lg border bg-muted/10 p-2 text-xs flex items-center justify-between border-muted">
                  <span className="text-muted-foreground font-medium">Giáo viên hiện tại:</span>
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <User className="h-3 w-3" />
                    </div>
                    <span>{session.substituteTeacherName || session.teacherName}</span>
                  </div>
                </div>

                {/* Substitute Teacher Selection — opens picker popover */}
                <FieldLabel
                  label={
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1">
                        Chọn Giáo viên giảng dạy thay thế
                        <span className="text-destructive">*</span>
                      </span>
                      <label className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isCover}
                          onChange={(e) => {
                            setIsCover(e.target.checked)
                            if (!e.target.checked) {
                              setCoverType('')
                              setCoverNote('')
                              setErrors((prev) => ({ ...prev, coverType: '' }))
                            }
                          }}
                          className="rounded border-muted text-primary focus:ring-primary h-3 w-3"
                        />
                        <span>Tìm mở rộng</span>
                      </label>
                    </div>
                  }
                >
                  <span className="text-[10px] text-muted-foreground block mb-1.5 font-normal leading-tight">
                    Hệ thống sẽ tìm các GV dạy môn học này (Bao gồm cả GV đang có lịch trùng, GV Cover chéo...)
                  </span>
                  <Popover open={teacherPickerOpen} onOpenChange={setTeacherPickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full flex items-center gap-2 rounded-lg border shadow-xs text-xs bg-background h-9 px-3 text-left transition-colors hover:border-muted-foreground/40",
                          selectedTeacher && selectedTeacher !== (session.substituteTeacherName || session.teacherName)
                            ? "border-primary ring-1 ring-primary/20"
                            : "border-muted"
                        )}
                      >
                        {selectedTeacher && selectedTeacher !== (session.substituteTeacherName || session.teacherName) ? (
                          <>
                            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <User className="h-3 w-3" />
                            </div>
                            <span className="font-semibold text-foreground truncate">{selectedTeacher}</span>
                            {(() => {
                              const found = mockTeachers.find((t) => t.value === selectedTeacher)
                              return found ? (
                                <>
                                  <span className="text-[9px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-sm">{found.id}</span>
                                  {found.isCover && (
                                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-sm">Mở rộng</span>
                                  )}
                                </>
                              ) : null
                            })()}
                          </>
                        ) : (
                          <>
                            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">Chọn giáo viên thay thế...</span>
                          </>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-1 z-50 bg-background border border-muted rounded-xl shadow-xl"
                      align="start"
                      sideOffset={4}
                    >
                      {/* Teacher list */}
                      <div className="grid gap-1 max-h-[220px] overflow-y-auto p-1 custom-scrollbar">
                        {(() => {
                          const currentActiveTeacher = session.substituteTeacherName || session.teacherName
                          const availableTeachers = mockTeachers.filter((t) => {
                            if (t.value === currentActiveTeacher) return false
                            if (!isCover && t.isCover) return false
                            return true
                          })

                          if (availableTeachers.length === 0) {
                            return (
                              <p className="text-xs text-muted-foreground italic text-center py-6 bg-muted/5 border border-dashed rounded-lg">
                                Không tìm thấy giáo viên phù hợp
                              </p>
                            )
                          }

                          return availableTeachers.map((teacher) => (
                            <button
                              key={teacher.value}
                              type="button"
                              onClick={() => {
                                setSelectedTeacher(teacher.value)
                                setTeacherPickerOpen(false)
                              }}
                              className={`w-full flex items-center justify-between p-1.5 rounded-lg border text-left text-xs transition-all ${
                                selectedTeacher === teacher.value
                                  ? 'border-primary bg-primary/[0.03] ring-1 ring-primary'
                                  : 'border-transparent hover:border-muted bg-background'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 ${
                                  selectedTeacher === teacher.value
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  <User className="h-3.5 w-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-foreground truncate">{teacher.value}</span>
                                    <span className="text-[9px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded-sm">{teacher.id}</span>
                                    {isCover && teacher.isCover && (
                                      <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-sm">Mở rộng</span>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-0.5 mt-0.5 text-[10px] text-muted-foreground leading-tight">
                                    <span className="truncate">{teacher.label}</span>
                                    {teacher.conflict && (
                                      <span className="text-amber-600 dark:text-amber-400 font-medium whitespace-normal">
                                        ⚠️ {teacher.conflict} ({teacher.conflictTime})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {selectedTeacher === teacher.value && (
                                <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                            </button>
                          ))
                        })()}
                      </div>
                    </PopoverContent>
                  </Popover>
                </FieldLabel>

                {/* Cover Type & Note — always visible, stacked */}
                <FieldLabel label="Loại Cover" required>
                  <Select 
                    value={coverType} 
                    onValueChange={(val) => {
                      setCoverType(val)
                      if (errors.coverType) {
                        setErrors((prev) => ({ ...prev, coverType: '' }))
                      }
                    }}
                  >
                    <SelectTrigger className={cn(
                      "w-full min-w-0 rounded-lg shadow-xs border text-xs bg-background h-9",
                      errors.coverType ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive" : "border-muted"
                    )}>
                      <SelectValue placeholder="Chọn loại Cover..." className="truncate text-left block w-full min-w-0" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-muted shadow-lg bg-background z-50 w-[var(--radix-select-trigger-width)]">
                      <SelectItem value="cover-1a" className="text-xs whitespace-normal py-1.5 text-left leading-normal">Cover 1A - Báo trước ngày học</SelectItem>
                      <SelectItem value="cover-1b" className="text-xs whitespace-normal py-1.5 text-left leading-normal">Cover 1B - Báo trong ngày học, trước 17h30</SelectItem>
                      <SelectItem value="cover-2" className="text-xs whitespace-normal py-1.5 text-left leading-normal">Cover 2 - Báo 30 phút trước giờ học</SelectItem>
                      <SelectItem value="cover-3a" className="text-xs whitespace-normal py-1.5 text-left leading-normal">COVER3A - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV không vào lớp</SelectItem>
                      <SelectItem value="cover-3b" className="text-xs whitespace-normal py-1.5 text-left leading-normal">COVER3B - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV vào lớp dạy 5-10 phút thì bị lỗi KT</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.coverType && (
                    <span className="text-[10px] text-destructive font-medium mt-1 block">
                      {errors.coverType}
                    </span>
                  )}
                </FieldLabel>

                <FieldLabel label="Ghi chú Cover">
                  <Textarea
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Nhập ghi chú điều phối (lý do thay thế, ghi chú nội bộ...)"
                    rows={2}
                    className="rounded-lg shadow-xs border-muted text-xs bg-background resize-y"
                  />
                </FieldLabel>
              </div>
            )}

            {/* B. ROOM MODE */}
            {type === 'room' && (
              <div className="space-y-2">
                <div className="rounded-xl border bg-muted/20 p-2.5 text-xs space-y-1.5 border-muted">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phòng học mặc định lớp:</span>
                    <span className="font-semibold text-foreground">A101</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phòng đang gán cho buổi:</span>
                    <span className="font-semibold text-primary">{session.room}</span>
                  </div>
                </div>

                {/* Room picker popover with searchable available rooms */}
                <FieldLabel label="Chọn Phòng học mới" required>
                  <Popover open={roomPickerOpen} onOpenChange={setRoomPickerOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <div
                          className={cn(
                            "relative rounded-lg border shadow-xs bg-background transition-colors hover:border-muted-foreground/40",
                            selectedRoom && selectedRoom !== session.room
                              ? "border-primary ring-1 ring-primary/20"
                              : errors.room
                                ? "border-destructive ring-1 ring-destructive/20"
                                : "border-muted"
                          )}
                        >
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          <Input
                            value={roomSearch}
                            onFocus={() => setRoomPickerOpen(true)}
                            onClick={() => setRoomPickerOpen(true)}
                            onKeyDown={(event) => {
                              if (event.key === 'Escape') {
                                setRoomPickerOpen(false)
                              }
                            }}
                            onChange={(e) => {
                              setRoomSearch(e.target.value)
                              setRoomPickerOpen(true)
                              if (selectedRoom !== session.room) {
                                setSelectedRoom('')
                              }
                              if (errors.room) {
                                setErrors((prev) => ({ ...prev, room: '' }))
                              }
                            }}
                            placeholder="Tìm và chọn phòng khả dụng..."
                            className="h-9 border-0 bg-transparent pl-9 pr-3 text-xs shadow-none focus-visible:ring-0 w-full"
                          />
                        </div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onCloseAutoFocus={(e) => e.preventDefault()}
                      className="w-[var(--radix-popover-trigger-width)] p-1 z-50 bg-background border border-muted rounded-xl shadow-xl"
                      align="start"
                      sideOffset={4}
                    >
                      <div className="grid max-h-[220px] gap-1 overflow-y-auto pr-1 custom-scrollbar p-1">
                        {(() => {
                          const query = roomSearch.trim().toLowerCase()
                          const availableRooms = mockRooms.filter((room) => room.status === 'available' && room.value !== session.room)
                          const filteredRooms = availableRooms.filter((room) => {
                            if (!query) return true
                            const displayName = `phòng ${room.value}`.toLowerCase()
                            return (
                              room.value.toLowerCase().includes(query) ||
                              displayName.includes(query) ||
                              room.floor.toLowerCase().includes(query)
                            )
                          })

                          if (filteredRooms.length === 0) {
                            return (
                              <p className="text-xs text-muted-foreground italic text-center py-6 bg-muted/5 border border-dashed rounded-lg">
                                Không tìm thấy phòng khả dụng phù hợp
                              </p>
                            )
                          }

                          return filteredRooms.map((room) => (
                            <button
                              key={room.value}
                              type="button"
                              onClick={() => {
                                setSelectedRoom(room.value)
                                setRoomPickerOpen(false)
                                setRoomSearch(`Phòng ${room.value}`)
                                if (errors.room) {
                                  setErrors((prev) => ({ ...prev, room: '' }))
                                }
                              }}
                              className={cn(
                                "w-full rounded-lg border border-transparent bg-transparent p-2 text-left text-xs transition-all hover:border-muted hover:bg-muted/60",
                                selectedRoom === room.value
                                  ? "text-primary"
                                  : "text-foreground"
                              )}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-start gap-2">
                                  <div className={cn(
                                    "h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                                    selectedRoom === room.value
                                      ? "text-primary"
                                      : "text-muted-foreground"
                                  )}>
                                    <MapPin className="h-3.5 w-3.5" />
                                  </div>
                                  <span className="min-w-0 truncate font-bold text-foreground">Phòng {room.value}</span>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <span className="text-[10px] font-semibold text-muted-foreground">
                                    Hạn mức {room.capacity}
                                  </span>
                                  {selectedRoom === room.value && (
                                    <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                                      <Check className="h-3 w-3" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        })()}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {errors.room && (
                    <span className="text-[10px] text-destructive font-medium mt-1 block">
                      {errors.room}
                    </span>
                  )}
                </FieldLabel>

                {/* Cover Type Selection (Dropdown Select) */}
                <FieldLabel label="Loại Cover" required>
                  <Select
                    value={coverType}
                    onValueChange={(val) => {
                      setCoverType(val)
                      if (errors.coverType) {
                        setErrors((prev) => ({ ...prev, coverType: '' }))
                      }
                    }}
                  >
                    <SelectTrigger className={cn(
                      "w-full min-w-0 rounded-lg shadow-xs border text-xs bg-background h-9",
                      errors.coverType ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive" : "border-muted"
                    )}>
                      <SelectValue placeholder="Chọn loại Cover..." className="truncate text-left block w-full min-w-0" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-muted shadow-lg bg-background z-50 w-[var(--radix-select-trigger-width)]">
                      <SelectItem value="cover-1a" className="text-xs whitespace-normal py-1.5 text-left leading-normal">Cover 1A - Báo trước ngày học</SelectItem>
                      <SelectItem value="cover-1b" className="text-xs whitespace-normal py-1.5 text-left leading-normal">Cover 1B - Báo trong ngày học, trước 17h30</SelectItem>
                      <SelectItem value="cover-2" className="text-xs whitespace-normal py-1.5 text-left leading-normal">Cover 2 - Báo 30 phút trước giờ học</SelectItem>
                      <SelectItem value="cover-3a" className="text-xs whitespace-normal py-1.5 text-left leading-normal">COVER3A - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV không vào lớp</SelectItem>
                      <SelectItem value="cover-3b" className="text-xs whitespace-normal py-1.5 text-left leading-normal">COVER3B - Add GV cover khi lớp đã diễn ra ( sau mốc ST) - GV vào lớp dạy 5-10 phút thì bị lỗi KT</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.coverType && (
                    <span className="text-[10px] text-destructive font-medium mt-1 block">
                      {errors.coverType}
                    </span>
                  )}
                </FieldLabel>

                <FieldLabel label="Ghi chú Cover">
                  <Textarea
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Nhập ghi chú điều phối (ví dụ: lý do thay thế...)"
                    rows={3}
                    className="min-h-20 rounded-lg shadow-xs border-muted text-xs bg-background resize-y"
                  />
                </FieldLabel>
              </div>
            )}

            {/* C. UPLOAD MODE */}
            {type === 'upload' && (
              <div className="space-y-4">
                
                <FieldLabel label="Tên bài giảng" required>
                  <Input
                    value={lectureName}
                    onChange={(e) => {
                      setLectureName(e.target.value)
                      if (errors.lectureName) {
                        setErrors((prev) => ({ ...prev, lectureName: '' }))
                      }
                    }}
                    placeholder="Nhập tên bài giảng / video buổi học..."
                    className={cn(
                      "rounded-lg shadow-xs text-xs bg-background",
                      errors.lectureName ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive" : "border-muted"
                    )}
                  />
                  {errors.lectureName && (
                    <span className="text-[10px] text-destructive font-medium mt-1 block">
                      {errors.lectureName}
                    </span>
                  )}
                </FieldLabel>

                <FieldLabel label="Yêu cầu học tập" required>
                  <Select
                    value={lectureType}
                    onValueChange={(val) => setLectureType(val as 'Phải làm' | 'Tham khảo')}
                  >
                    <SelectTrigger className="w-full min-w-0 rounded-lg shadow-xs border border-muted text-xs bg-background h-9">
                      <SelectValue placeholder="Chọn yêu cầu..." className="truncate text-left block w-full min-w-0" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-muted shadow-lg bg-background z-50">
                      <SelectItem value="Phải làm" className="text-xs">Phải làm</SelectItem>
                      <SelectItem value="Tham khảo" className="text-xs">Tham khảo</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldLabel>

                <FieldLabel label="Đường dẫn (Link) video bài học" required>
                  <Input
                    value={lectureLink}
                    onChange={(e) => {
                      setLectureLink(e.target.value)
                      if (errors.lectureLink) {
                        setErrors((prev) => ({ ...prev, lectureLink: '' }))
                      }
                    }}
                    placeholder="Nhập link video bài học (ví dụ: drive.google.com/file/...)"
                    className={cn(
                      "rounded-lg shadow-xs text-xs bg-background",
                      errors.lectureLink ? "border-destructive focus-visible:ring-destructive/20 focus-visible:border-destructive" : "border-muted"
                    )}
                  />
                  {errors.lectureLink && (
                    <span className="text-[10px] text-destructive font-medium mt-1 block">
                      {errors.lectureLink}
                    </span>
                  )}
                </FieldLabel>

              </div>
            )}

            {/* D. RESCHEDULE MODE */}
            {type === 'reschedule' && (
              <div className="space-y-3">
                <div className="rounded-xl border bg-muted/20 p-2.5 text-xs space-y-1.5 border-muted">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">Lịch học hiện tại:</span>
                    <span className="font-semibold text-foreground">
                      {session.originalDate || session.date} ({session.startTime} - {session.endTime})
                    </span>
                  </div>
                </div>

                <FieldLabel label="Chọn ngày học mới" required>
                  <Input
                    type="date"
                    value={
                      rescheduleDate.includes('/')
                        ? rescheduleDate.split('/').reverse().join('-')
                        : rescheduleDate
                    }
                    onChange={(e) => {
                      setRescheduleDate(e.target.value)
                      if (errors.rescheduleDate) {
                        setErrors((prev) => ({ ...prev, rescheduleDate: '' }))
                      }
                    }}
                    className={cn(
                      'h-9 text-xs bg-background rounded-lg',
                      errors.rescheduleDate ? 'border-destructive' : 'border-muted'
                    )}
                  />
                  {errors.rescheduleDate && (
                    <span className="text-[10px] text-destructive font-medium mt-1 block">
                      {errors.rescheduleDate}
                    </span>
                  )}
                </FieldLabel>

                <FieldLabel label="Lý do đổi lịch">
                  <Textarea
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    placeholder="Nhập lý do dời lịch / đổi ngày học..."
                    rows={3}
                    className="rounded-lg shadow-xs border-muted text-xs bg-background resize-y"
                  />
                </FieldLabel>
              </div>
            )}

          </div>

          {/* Footer actions */}
          <DialogFooter className="px-5 py-3 border-t border-muted bg-muted/10 gap-2 sm:gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClose} 
              className="rounded-lg text-xs"
            >
              Hủy
            </Button>
            
            {type === 'teacher' && (
              <Button 
                size="sm" 
                onClick={handleSaveTeacher}
                className="rounded-lg text-xs bg-primary"
              >
                Lưu thay đổi giáo viên
              </Button>
            )}

            {type === 'room' && (
              <Button 
                size="sm" 
                onClick={handleSaveRoom}
                className="rounded-lg text-xs bg-primary"
              >
                Lưu thay đổi phòng
              </Button>
            )}

            {type === 'upload' && (
              <Button 
                size="sm" 
                onClick={handleSaveUpload}
                className="rounded-lg text-xs bg-primary"
              >
                Lưu lại
              </Button>
            )}

            {type === 'reschedule' && (
              <Button 
                size="sm" 
                onClick={handleSaveReschedule}
                className="rounded-lg text-xs bg-primary"
              >
                Lưu thay đổi lịch học
              </Button>
            )}
          </DialogFooter>

        </DialogContent>
      </Dialog>


    </>
  )
}
