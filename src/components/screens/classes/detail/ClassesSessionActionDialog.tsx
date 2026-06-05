'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { 
  User, 
  MapPin, 
  Check,
  Search,
  Globe
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
import { TeacherDirectoryDialog } from '../TeacherDirectoryDialog'
import type { RoadmapSession } from './classesDetailTypes'

interface ClassesSessionActionDialogProps {
  isOpen: boolean
  onClose: () => void
  session: RoadmapSession | null
  type: 'teacher' | 'room' | 'upload' | null
  onSave: (sessionId: string, updates: Partial<RoadmapSession>) => void
}

export function ClassesSessionActionDialog({
  isOpen,
  onClose,
  session,
  type,
  onSave
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

  const [teacherSearch, setTeacherSearch] = useState('')
  const [isTeacherDirectoryOpen, setIsTeacherDirectoryOpen] = useState(false)
  const [coverType, setCoverType] = useState(
    session ? (session.coverType || '') : ''
  )
  const [coverNote, setCoverNote] = useState(
    session ? (session.coverNote || '') : ''
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Early return if dependencies are not loaded
  if (!session || !type) return null

  // Mock substitute teachers list
  const mockTeachers = [
    { value: 'Cô Lan', label: 'Cô Lan (Giáo viên chủ nhiệm)', status: 'active' },
    { value: 'Thầy Hùng', label: 'Thầy Hùng (Tổ trưởng chuyên môn)', status: 'active' },
    { value: 'Cô Hương', label: 'Cô Hương (Giảng viên cao cấp)', status: 'active' },
    { value: 'Cô Nga', label: 'Cô Nga (Giáo viên cơ hữu - Trống lịch)', status: 'available' },
    { value: 'Thầy Quân', label: 'Thầy Quân (Giáo viên cơ hữu - Trống lịch)', status: 'available' }
  ]

  // Mock classrooms
  const mockRooms = [
    { value: 'A101', label: 'Phòng A101 (Tầng 1 - Sức chứa 30 học viên)', status: 'busy' },
    { value: 'A102', label: 'Phòng A102 (Tầng 1 - Trống - Khuyên dùng)', status: 'available' },
    { value: 'B201', label: 'Phòng B201 (Tầng 2 - Trống)', status: 'available' },
    { value: 'C301', label: 'Phòng C301 (Tầng 3 - Trống)', status: 'available' }
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
      if (!coverType) {
        setErrors({ coverType: 'Vui lòng chọn Loại Cover!' })
        return
      }
      onSave(session.id, { 
        substituteTeacherName: selectedTeacher,
        coverType,
        coverNote
      })
      onClose()
    }
  }

  const handleSaveRoom = () => {
    if (!coverType) {
      setErrors({ coverType: 'Vui lòng chọn Loại Cover!' })
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden p-0 rounded-2xl border border-muted shadow-lg">
        
        {/* Banner header for context */}
        <div className="bg-primary/5 px-6 py-4 border-b border-muted">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-primary font-mono uppercase bg-primary/10 px-2 py-0.5 rounded shrink-0">
                Buổi {session.sessionNumber}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-foreground font-mono">
                {session.date} ({session.startTime} - {session.endTime})
              </span>
            </div>
            
            <DialogTitle className="text-base font-bold text-foreground mt-2">
              {type === 'teacher' && 'Đổi giáo viên giảng dạy'}
              {type === 'room' && 'Đổi phòng học'}
              {type === 'upload' && 'Quản lý tài liệu bài giảng'}
            </DialogTitle>
            
            <DialogDescription className="text-xs text-muted-foreground mt-1 truncate">
              Chương trình: <strong>{session.topic}</strong>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          
          {/* A. TEACHER MODE */}
          {type === 'teacher' && (
            <div className="space-y-2">
              {/* General Info box */}
              <div className="rounded-xl border bg-muted/20 p-2.5 text-xs space-y-1.5 border-muted">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giáo viên chủ nhiệm:</span>
                  <span className="font-semibold text-foreground">{session.teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giáo viên hiện tại đứng lớp:</span>
                  <span className="font-semibold text-primary">{session.substituteTeacherName || session.teacherName}</span>
                </div>
              </div>

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

              {/* Cover Note Input */}
              <FieldLabel label="Ghi chú Cover">
                <Input
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Nhập ghi chú điều phối (ví dụ: lý do thay thế...)"
                  className="rounded-lg shadow-xs border-muted text-xs bg-background"
                />
              </FieldLabel>

              {/* Substitute Teacher Selection Section */}
              <FieldLabel label="Chọn Giáo viên giảng dạy thay thế" required>
                <div className="space-y-2">
                  {/* Search input and System-wide coordination button */}
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm theo tên giáo viên..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="pl-9 rounded-lg shadow-xs border-muted text-xs bg-background h-9"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-lg border-muted shrink-0 bg-background"
                      onClick={() => setIsTeacherDirectoryOpen(true)}
                      title="Lọc giáo viên toàn hệ thống"
                      type="button"
                    >
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>

                  {/* List of available teachers (excluding currently active teacher) */}
                  <div className="grid gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {(() => {
                      const currentActiveTeacher = session.substituteTeacherName || session.teacherName
                      const availableTeachers = mockTeachers.filter((t) => t.value !== currentActiveTeacher)
                      const filteredTeachers = availableTeachers.filter((t) =>
                        t.value.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                        t.label.toLowerCase().includes(teacherSearch.toLowerCase())
                      )

                      if (filteredTeachers.length === 0) {
                        return (
                          <p className="text-xs text-muted-foreground italic text-center py-4 bg-muted/5 border border-dashed rounded-lg">
                            Không tìm thấy giáo viên phù hợp
                          </p>
                        )
                      }

                      return filteredTeachers.map((teacher) => (
                        <button
                          key={teacher.value}
                          type="button"
                          onClick={() => setSelectedTeacher(teacher.value)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all ${
                            selectedTeacher === teacher.value
                              ? 'border-primary bg-primary/[0.03] ring-1 ring-primary'
                              : 'border-muted hover:border-muted-foreground/30 bg-background'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${
                              selectedTeacher === teacher.value
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              <User className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground leading-tight">{teacher.value}</p>
                              <p className="text-[10px] text-muted-foreground leading-tight">{teacher.label}</p>
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
                </div>
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

              {/* Cover Note Input */}
              <FieldLabel label="Ghi chú Cover">
                <Input
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  placeholder="Nhập ghi chú điều phối (ví dụ: lý do thay thế...)"
                  className="rounded-lg shadow-xs border-muted text-xs bg-background"
                />
              </FieldLabel>

              {/* Room list selector excluding current room */}
              <FieldLabel label="Chọn Phòng học mới" required>
                <div className="grid gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {(() => {
                    const filteredRooms = mockRooms.filter((room) => room.value !== session.room)
                    return filteredRooms.map((room) => (
                      <button
                        key={room.value}
                        type="button"
                        onClick={() => setSelectedRoom(room.value)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border text-left text-xs transition-all ${
                          selectedRoom === room.value
                            ? 'border-primary bg-primary/[0.03] ring-1 ring-primary'
                            : 'border-muted hover:border-muted-foreground/30 bg-background'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 ${
                            selectedRoom === room.value
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground leading-tight">Phòng {room.value}</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">{room.label}</p>
                          </div>
                        </div>
                        
                        {selectedRoom === room.value && (
                          <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>
                    ))
                  })()}
                </div>
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

        </div>

        {/* Footer actions */}
        <DialogFooter className="px-6 py-4 border-t border-muted bg-muted/10 gap-2 sm:gap-2">
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
        </DialogFooter>

      </DialogContent>
    </Dialog>

    {/* System-wide teacher coordination dialog */}
    {isTeacherDirectoryOpen && (
      <TeacherDirectoryDialog
        open={isTeacherDirectoryOpen}
        onOpenChange={setIsTeacherDirectoryOpen}
        onSelectTeacher={(teacherId, teacherName) => {
          setSelectedTeacher(teacherName)
          setIsTeacherDirectoryOpen(false)
        }}
        startTime={session.startTime}
        dayOfWeek={(() => {
          const parts = session.date.split('/')
          if (parts.length === 3) {
            const dateObj = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
            const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
            return days[dateObj.getDay()]
          }
          return undefined
        })()}
      />
    )}
    </>
  )
}
