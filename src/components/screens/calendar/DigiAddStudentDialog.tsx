'use client'

import React, { useState, useMemo, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Building2,
  BookOpen,
  Calendar,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MOCK_DIGI_STUDENTS,
  DIGI_TIME_SLOTS,
  MOCK_ROOMS_CAPACITY,
  calculateEndTime,
  type DigiStudentProfile,
  type DigiStudentPackage,
  type DigiStudentBooking,
} from '@/mocks/digiSchedule'

const generateBookingId = () => `DG-NEW-${Math.floor(Math.random() * 900000 + 100000)}`

interface DigiAddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomName: string
  date: string
  existingBookings: DigiStudentBooking[]
  onConfirm: (booking: DigiStudentBooking) => void
}

const AVATAR_COLORS = [
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-sky-100 text-sky-700 border-sky-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-rose-100 text-rose-700 border-rose-200',
]

function getInitial(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(-1)
    .map((s) => s[0])
    .join('')
    .toUpperCase()
}

/**
 * Tính dung lượng phòng cho 1 time slot 30p cụ thể
 */
function getSlotOccupancy(
  bookings: DigiStudentBooking[],
  roomName: string,
  targetDate: string,
  slotStart: string
): { occupied: number; capacity: number } {
  const capacity = MOCK_ROOMS_CAPACITY[roomName] || 10
  const slotEnd = calculateEndTime(slotStart, 30)
  const occupied = bookings.filter((b) => {
    const matchesRoom =
      b.roomName === roomName ||
      (roomName === 'Phòng tự học Digi' && b.roomName === 'Phòng Digi') ||
      (roomName === 'Phòng Digi' && b.roomName === 'Phòng tự học Digi')
    if (!matchesRoom || b.date !== targetDate) return false
    if (b.status === 'cancelled' || b.status === 'da_vang') return false
    return b.startTime < slotEnd && b.endTime > slotStart
  }).length
  return { occupied, capacity }
}

function normalizeSearch(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim()
}

interface DatePreset {
  key: string
  label: string
  dateDisplay: string
}

function getPresetDates(): DatePreset[] {
  const today = new Date()
  const list: DatePreset[] = []
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  for (let i = 0; i < 4; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const dateDisplay = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
    
    let label = ''
    if (i === 0) label = 'Hôm nay'
    else if (i === 1) label = 'Ngày mai'
    else label = `${dayNames[d.getDay()]}`

    list.push({ key, label, dateDisplay })
  }
  return list
}

export function DigiAddStudentDialog({
  open,
  onOpenChange,
  roomName,
  date,
  existingBookings,
  onConfirm,
}: DigiAddStudentDialogProps) {
  // --- State ---
  const [searchText, setSearchText] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<DigiStudentProfile | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<DigiStudentPackage | null>(null)
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => date || '2026-08-20')
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([])
  
  const dateInputRef = useRef<HTMLInputElement>(null)
  const roomCapacity = MOCK_ROOMS_CAPACITY[roomName] || 10
  const presetDates = useMemo(() => getPresetDates(), [])

  const isCustomDate = useMemo(() => {
    return !presetDates.some((p) => p.key === selectedDateKey)
  }, [presetDates, selectedDateKey])

  // Filter students based on search
  const filteredStudents = useMemo(() => {
    const rawSearch = searchText.trim()
    const normSearch = normalizeSearch(rawSearch)
    if (!normSearch) return MOCK_DIGI_STUDENTS

    return MOCK_DIGI_STUDENTS.filter((s) => {
      const normName = normalizeSearch(s.name)
      const normEng = normalizeSearch(s.englishName || '')
      const phone = s.phoneMasked || ''
      const normBranch = normalizeSearch(s.branch || '')
      const normPkg = normalizeSearch(s.packageName || '')

      return (
        normName.includes(normSearch) ||
        normEng.includes(normSearch) ||
        phone.includes(rawSearch) ||
        normBranch.includes(normSearch) ||
        normPkg.includes(normSearch) ||
        normName.replace(/nh/g, 'ng').includes(normSearch.replace(/nh/g, 'ng')) ||
        normEng.replace(/nh/g, 'ng').includes(normSearch.replace(/nh/g, 'ng'))
      )
    })
  }, [searchText])

  // Slot occupancy map for selected date
  const slotOccupancyMap = useMemo(() => {
    const map: Record<string, { occupied: number; capacity: number; isFull: boolean; remaining: number }> = {}
    DIGI_TIME_SLOTS.forEach((slot) => {
      const { occupied, capacity } = getSlotOccupancy(existingBookings, roomName, selectedDateKey, slot)
      map[slot] = {
        occupied,
        capacity,
        isFull: occupied >= capacity,
        remaining: Math.max(0, capacity - occupied),
      }
    })
    return map
  }, [existingBookings, roomName, selectedDateKey])

  // When student or package changes, auto-select all available lessons
  const handleSelectStudent = (student: DigiStudentProfile) => {
    setSelectedStudent(student)
    setSearchText('')
    if (student.packages.length > 0) {
      const pkg = student.packages[0]
      setSelectedPackage(pkg)
      setSelectedLessonIds(pkg.availableLessons.map((l) => l.lessonId))
    } else {
      setSelectedPackage(null)
      setSelectedLessonIds([])
    }
  }

  const handleSelectPackage = (pkg: DigiStudentPackage) => {
    setSelectedPackage(pkg)
    setSelectedLessonIds(pkg.availableLessons.map((l) => l.lessonId))
  }

  const handleToggleLesson = (lessonId: string) => {
    setSelectedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    )
  }

  const handleToggleSelectAll = () => {
    if (!selectedPackage) return
    if (selectedLessonIds.length === selectedPackage.availableLessons.length) {
      setSelectedLessonIds([])
    } else {
      setSelectedLessonIds(selectedPackage.availableLessons.map((l) => l.lessonId))
    }
  }

  // Calculate lesson schedule slots (sequential starting from 18:00)
  const lessonScheduleItems = useMemo(() => {
    if (!selectedPackage) return []
    let currentSlotIdx = 0

    return selectedPackage.availableLessons.map((lesson) => {
      const slotStartTime = DIGI_TIME_SLOTS[currentSlotIdx] || '20:30'
      const slotEndTime = calculateEndTime(slotStartTime, 30)
      const slotInfo = slotOccupancyMap[slotStartTime] || {
        occupied: 0,
        capacity: roomCapacity,
        isFull: false,
        remaining: roomCapacity,
      }

      currentSlotIdx = Math.min(DIGI_TIME_SLOTS.length - 1, currentSlotIdx + 1)

      return {
        lesson,
        slotStartTime,
        slotEndTime,
        slotInfo,
      }
    })
  }, [selectedPackage, slotOccupancyMap, roomCapacity])

  // Filter only selected lessons for final timing
  const activeSelectedLessons = useMemo(() => {
    return lessonScheduleItems.filter((item) => selectedLessonIds.includes(item.lesson.lessonId))
  }, [lessonScheduleItems, selectedLessonIds])

  const totalLessons = activeSelectedLessons.length
  const totalMinutes = totalLessons * 30
  const firstSlot = activeSelectedLessons[0]?.slotStartTime || '18:00'
  const lastSlot = activeSelectedLessons[activeSelectedLessons.length - 1]?.slotEndTime || calculateEndTime('18:00', totalMinutes)

  // Validate if any selected slot is over capacity
  const hasOverCapacity = activeSelectedLessons.some((item) => item.slotInfo.isFull)
  const canConfirm = selectedStudent && selectedPackage && totalLessons > 0 && !hasOverCapacity

  const handleConfirm = () => {
    if (!selectedStudent || !selectedPackage || totalLessons === 0 || hasOverCapacity) return

    const newBooking: DigiStudentBooking = {
      id: generateBookingId(),
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentEnglishName: selectedStudent.englishName,
      studentPhoneMasked: selectedStudent.phoneMasked,
      packageName: selectedPackage.packageName,
      branch: selectedStudent.branch,
      selectedLessons: activeSelectedLessons.map((item) => ({
        ...item.lesson,
        status: 'pending' as const,
      })),
      totalLessons,
      totalMinutes,
      date: selectedDateKey,
      startTime: firstSlot,
      endTime: lastSlot,
      roomName,
      status: 'da_xep_lich',
    }

    onConfirm(newBooking)
    handleClose()
  }

  const handleClose = () => {
    setSelectedStudent(null)
    setSelectedPackage(null)
    setSelectedLessonIds([])
    setSearchText('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="w-[94vw] max-w-[780px] h-[84vh] max-h-[720px] min-h-[540px] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl border-border"
      >
        {/* Header: Không icon, không subtitle */}
        <DialogHeader className="px-5 py-3.5 border-b border-border/60 flex flex-row items-center justify-between shrink-0 bg-card">
          <DialogTitle className="text-sm sm:text-base font-bold text-foreground">
            Thêm lịch học viên
          </DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 min-h-0 flex flex-col gap-3.5 p-5 overflow-y-auto custom-scrollbar">
          {/* 1. Học viên */}
          <div className={cn("space-y-1.5 flex flex-col", !selectedStudent && "flex-1 min-h-0")}>
            <label className="text-xs font-normal text-muted-foreground block shrink-0">
              Học viên
            </label>

            {selectedStudent ? (
              /* Đã chọn học viên: Nằm gọn trong ô tìm kiếm với nút xóa/đổi */
              <div className="flex items-center justify-between w-full min-h-[44px] px-3.5 py-2 rounded-xl border border-primary/40 bg-primary/[0.04] text-xs shrink-0 shadow-2xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold shrink-0',
                      AVATAR_COLORS[MOCK_DIGI_STUDENTS.indexOf(selectedStudent) % AVATAR_COLORS.length]
                    )}
                  >
                    {getInitial(selectedStudent.name)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 min-w-0">
                    <span className="font-bold text-foreground text-xs">
                      {selectedStudent.name}
                    </span>
                    {selectedStudent.englishName && (
                      <span className="text-muted-foreground text-[11px] italic">
                        ({selectedStudent.englishName})
                      </span>
                    )}
                    <span className="text-[10px] text-muted-foreground/80">
                      • {selectedStudent.phoneMasked} • {selectedStudent.branch}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null)
                    setSelectedPackage(null)
                    setSelectedLessonIds([])
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer shrink-0 ml-2"
                  title="Đổi học viên"
                >
                  <X className="h-3.5 w-3.5" />
                  <span>Đổi</span>
                </button>
              </div>
            ) : (
              /* Chưa chọn học viên: Ô input tìm kiếm + Danh sách học viên hiển thị trực tiếp rộng rãi */
              <div className="flex-1 min-h-0 flex flex-col gap-2.5">
                <div className="relative shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchText}
                    autoFocus
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Tìm tên, tên tiếng Anh hoặc SĐT..."
                    className="w-full h-9 pl-9 pr-3 text-xs border border-border rounded-lg bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  />
                </div>

                {/* Danh sách học viên dạng bảng/danh sách trực tiếp */}
                <div className="flex-1 min-h-0 border border-border/80 rounded-xl overflow-y-auto divide-y divide-border/50 bg-card custom-scrollbar shadow-2xs">
                  {filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground italic">
                      Không tìm thấy học viên phù hợp với từ khóa &quot;{searchText}&quot;
                    </div>
                  ) : (
                    filteredStudents.map((student, idx) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => handleSelectStudent(student)}
                        className="flex items-center justify-between w-full px-4 py-2.5 text-left hover:bg-accent/60 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full border text-[11px] font-bold shrink-0',
                              AVATAR_COLORS[idx % AVATAR_COLORS.length]
                            )}
                          >
                            {getInitial(student.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {student.name}
                              </span>
                              {student.englishName && (
                                <span className="text-[11px] text-muted-foreground italic">
                                  ({student.englishName})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                              <span>{student.phoneMasked}</span>
                              <span>•</span>
                              <span>{student.branch}</span>
                            </div>
                          </div>
                        </div>

                        <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-semibold text-muted-foreground group-hover:border-primary/40 group-hover:text-primary shrink-0">
                          {student.packages.length} gói học
                        </Badge>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 2. Gói học (Dạng thẻ radio chọn, cơ sở đi kèm gói học — đưa lên trước Ngày học) */}
          {selectedStudent && (
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground block">
                Gói học
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedStudent.packages.map((pkg) => {
                  const isSelected = selectedPackage?.packageId === pkg.packageId
                  return (
                    <div
                      key={pkg.packageId}
                      onClick={() => handleSelectPackage(pkg)}
                      className={cn(
                        'relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-left',
                        isSelected
                          ? 'border-primary bg-primary/[0.05] ring-2 ring-primary/20 shadow-2xs'
                          : 'border-border/80 bg-card hover:border-primary/40 hover:bg-accent/30'
                      )}
                    >
                      {/* Radio Circle Indicator */}
                      <div
                        className={cn(
                          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted-foreground/40 bg-background'
                        )}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-foreground truncate">
                          {pkg.packageName}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                          <Building2 className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                          <span className="truncate">Cơ sở: {selectedStudent.branch}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground/80 mt-0.5 font-medium">
                          {pkg.availableLessons.length} bài học tiếp theo • {pkg.availableLessons.length * 30} phút
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 3. Chọn ngày học (Thu hẹp chiều cao, gọn gàng) */}
          {selectedStudent && (
            <div className="space-y-1.5">
              <label className="text-xs font-normal text-muted-foreground block">
                Ngày học
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {presetDates.map((d) => {
                  const isSelected = selectedDateKey === d.key
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setSelectedDateKey(d.key)}
                      className={cn(
                        'flex flex-col items-center justify-center py-1.5 px-2 rounded-xl border text-xs transition-all cursor-pointer select-none leading-tight min-h-[42px]',
                        isSelected
                          ? 'border-primary bg-primary/[0.08] text-primary ring-1 ring-primary/30 shadow-2xs'
                          : 'border-border/80 bg-card hover:bg-accent/40 text-foreground'
                      )}
                    >
                      <span className={cn('text-[11px] font-medium', isSelected ? 'text-primary' : 'text-foreground')}>
                        {d.label}
                      </span>
                      <span className={cn('text-[10px] mt-0.5', isSelected ? 'text-primary font-bold' : 'text-muted-foreground')}>
                        {d.dateDisplay}
                      </span>
                    </button>
                  )
                })}

                {/* Nút thứ 5: Chọn ngày khác (Mở bộ chọn ngày) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      const input = dateInputRef.current
                      if (input) {
                        try {
                          input.showPicker()
                        } catch {
                          input.focus()
                        }
                      }
                    }}
                    className={cn(
                      'w-full h-full min-h-[42px] flex flex-col items-center justify-center py-1.5 px-2 rounded-xl border text-xs transition-all cursor-pointer select-none leading-tight',
                      isCustomDate
                        ? 'border-primary bg-primary/[0.08] text-primary ring-1 ring-primary/30 shadow-2xs'
                        : 'border-border/80 bg-card hover:bg-accent/40 text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className={cn('text-[11px] font-medium', isCustomDate ? 'text-primary' : 'text-foreground')}>
                        {isCustomDate ? 'Ngày đã chọn' : 'Ngày khác'}
                      </span>
                    </div>
                    <span className={cn('text-[10px] mt-0.5', isCustomDate ? 'text-primary font-bold' : 'text-muted-foreground')}>
                      {isCustomDate ? selectedDateKey.split('-').reverse().slice(0, 2).join('/') : 'Tùy chọn...'}
                    </span>
                  </button>
                  <input
                    ref={dateInputRef}
                    type="date"
                    value={selectedDateKey}
                    onChange={(e) => e.target.value && setSelectedDateKey(e.target.value)}
                    className="absolute inset-0 opacity-0 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Bài học & Khung giờ (Nhãn màu xám text thường, không in đậm) */}
          {selectedStudent && selectedPackage && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-normal text-muted-foreground">
                  Bài học & Khung giờ
                </span>
                <span className="text-[10px] font-normal text-muted-foreground/70">
                  (Dung lượng: {roomCapacity} chỗ/ca)
                </span>
              </div>

              {/* Danh sách từng bài học đi liền với khung giờ và số chỗ ở dưới */}
              <div className="border border-border/80 rounded-xl overflow-hidden divide-y divide-border/60 bg-card">
                {/* Header thanh công cụ chọn tất cả */}
                <div className="flex items-center justify-between px-3 py-2 bg-muted/40 text-[11px] font-semibold text-muted-foreground">
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="flex items-center gap-2 hover:text-foreground cursor-pointer text-left font-bold"
                  >
                    <input
                      type="checkbox"
                      checked={selectedLessonIds.length === selectedPackage.availableLessons.length && selectedPackage.availableLessons.length > 0}
                      onChange={handleToggleSelectAll}
                      className="h-3.5 w-3.5 rounded border-border text-primary cursor-pointer accent-primary"
                    />
                    <span>Chọn tất cả ({selectedPackage.availableLessons.length} bài)</span>
                  </button>
                  <span>Khung giờ & Chỗ trống</span>
                </div>

                {lessonScheduleItems.map(({ lesson, slotStartTime, slotEndTime, slotInfo }) => {
                  const isChecked = selectedLessonIds.includes(lesson.lessonId)
                  const isFull = slotInfo.isFull

                  return (
                    <div
                      key={lesson.lessonId}
                      onClick={() => !isFull && handleToggleLesson(lesson.lessonId)}
                      className={cn(
                        'flex items-center justify-between p-3 gap-3 transition-colors select-none cursor-pointer text-xs',
                        isChecked ? 'bg-primary/[0.03]' : 'hover:bg-accent/40',
                        isFull && 'opacity-60 bg-muted/20 cursor-not-allowed'
                      )}
                    >
                      {/* Cột trái: Checkbox + Tên bài học */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isFull}
                          onChange={() => handleToggleLesson(lesson.lessonId)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-border text-primary cursor-pointer accent-primary shrink-0"
                        />
                        <div className="min-w-0">
                          <span
                            className={cn(
                              'font-bold block truncate',
                              isChecked ? 'text-foreground' : 'text-muted-foreground'
                            )}
                          >
                            {lesson.lessonName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Thời lượng: {lesson.durationMinutes} phút
                          </span>
                        </div>
                      </div>

                      {/* Cột phải: Thời gian không viền/nền, Chỗ trống nằm dưới thời gian */}
                      <div className="flex flex-col items-end gap-0.5 shrink-0 text-right">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {slotStartTime} - {slotEndTime}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-semibold',
                            isFull
                              ? 'text-red-600 dark:text-red-400 font-bold'
                              : slotInfo.remaining <= 2
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          )}
                        >
                          {isFull
                            ? `Hết chỗ (${slotInfo.occupied}/${slotInfo.capacity})`
                            : `${slotInfo.occupied}/${slotInfo.capacity} chỗ (Còn ${slotInfo.remaining})`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              {hasOverCapacity && (
                <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-3.5 py-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Một số bài học đã chọn nằm trong khung giờ hết chỗ.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer: Thông tin ĐÃ CHỌN ở bên trái, các nút ở bên phải */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border/60 bg-muted/20 shrink-0">
          {/* Trái: Thông tin tóm tắt đã chọn */}
          <div className="flex items-center gap-2 text-xs min-w-0">
            {selectedStudent && totalLessons > 0 ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="text-muted-foreground">
                  Đã chọn: <strong className="text-foreground font-bold">{totalLessons} bài</strong> ({totalMinutes}p)
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="font-mono font-bold text-primary">
                  {firstSlot} → {lastSlot}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    'text-[9.5px] px-1.5 py-0 font-bold ml-1',
                    hasOverCapacity
                      ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  )}
                >
                  {hasOverCapacity ? 'Hết chỗ' : 'Hợp lệ'}
                </Badge>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">
                Chưa chọn bài học nào
              </span>
            )}
          </div>

          {/* Phải: Nút Hủy & Thêm vào lịch */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 px-3.5 text-xs font-semibold"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canConfirm}
              onClick={handleConfirm}
              className="h-8 px-4 text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              Thêm vào lịch
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
