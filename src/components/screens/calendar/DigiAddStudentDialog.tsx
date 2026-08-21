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
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  MOCK_DIGI_STUDENTS,
  DIGI_TIME_SLOTS,
  MOCK_ROOMS_CAPACITY,
  calculateEndTime,
  type DigiStudentProfile,
  type DigiStudentPackage,
  type DigiStudentBooking,
  type DigiLessonItem,
} from '@/mocks/digiSchedule'
import {
  DigiStudentListPanel,
  type StudentScheduleSummary,
} from './DigiStudentListPanel'
import {
  DigiScheduleMatchingPanel,
  type DatePreset,
  type LessonScheduleItem,
} from './DigiScheduleMatchingPanel'

const generateBookingId = () => `DG-NEW-${Math.floor(Math.random() * 900000 + 100000)}`

interface DigiAddStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  roomName: string
  date: string
  existingBookings: DigiStudentBooking[]
  onConfirm: (booking: DigiStudentBooking | DigiStudentBooking[]) => void
}

interface StudentScheduleConfig {
  selectedPackage: DigiStudentPackage | null
  selectedDateKey: string
  dateLessonsMap: Record<string, string[]>
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

/**
 * Tạo danh sách giáo trình đầy đủ tịnh tiến cho gói học (từ Bài 1 đến Bài N)
 */
export function getFullPackageLessons(pkg: DigiStudentPackage): DigiLessonItem[] {
  const baseLessons = pkg.availableLessons || []
  const firstNum = baseLessons[0]?.lessonNumber || 1
  const total = Math.max(pkg.totalLessonsCount || 24, firstNum + 20)

  let topicPrefix = 'Luyện tập & Thực hành'
  if (pkg.packageName.includes('Robotics') || pkg.packageName.includes('STEM')) {
    topicPrefix = 'STEM Robotics & Lập trình'
  } else if (pkg.packageName.includes('Math') || pkg.packageName.includes('Toán')) {
    topicPrefix = 'Toán tư duy logic & Phép tính'
  } else if (pkg.packageName.includes('English') || pkg.packageName.includes('Anh')) {
    topicPrefix = 'Tiếng Anh giao tiếp & Từ vựng'
  }

  const lessons: DigiLessonItem[] = []
  
  // Nạp các bài mẫu đã có sẵn
  baseLessons.forEach((bl) => {
    lessons.push(bl)
  })

  // Bổ sung các bài tiếp theo cho đủ giáo trình tịnh tiến liên tục
  const lastKnownNum = baseLessons.length > 0 ? Math.max(...baseLessons.map((l) => l.lessonNumber)) : firstNum - 1

  for (let num = lastKnownNum + 1; num <= total; num++) {
    const pkgPrefix = pkg.packageId.replace('PKG-', 'LES-')
    lessons.push({
      lessonId: `${pkgPrefix}-${String(num).padStart(2, '0')}`,
      lessonName: `Bài ${num}: ${topicPrefix} phần ${num}`,
      lessonNumber: num,
      durationMinutes: 30,
    })
  }

  return lessons
}

/**
 * Tịnh tiến danh sách bài học theo ngày được chọn:
 * Hôm nay: Bài 1, 2, 3
 * Ngày mai: Bài 4, 5, 6
 * Ngày kia: Bài 7, 8, 9...
 * Hoặc nếu đã chọn bài ở các ngày trước, ngày sau sẽ nối tiếp bài tiếp theo!
 */
function getProgressiveLessonsForDate(
  pkg: DigiStudentPackage,
  targetDateKey: string,
  presetDates: DatePreset[],
  dateLessonsMap: Record<string, string[]>
): DigiLessonItem[] {
  const allLessons = getFullPackageLessons(pkg)
  if (allLessons.length === 0) return []

  // 1. Đếm tổng số bài đã được tích chọn ở các ngày TRƯỚC targetDateKey
  let priorSelectedCount = 0
  let hasPriorSelection = false

  Object.entries(dateLessonsMap).forEach(([dKey, lIds]) => {
    if (dKey < targetDateKey && lIds.length > 0) {
      priorSelectedCount += lIds.length
      hasPriorSelection = true
    }
  })

  let startIndex = 0
  if (hasPriorSelection) {
    // Nếu các ngày trước đã có bài được chọn, ngày này nối tiếp bài ngay sau đó
    startIndex = priorSelectedCount
  } else {
    // Nếu các ngày trước chưa chọn, tịnh tiến đều đặn theo ngày:
    // Hôm nay (index 0) -> 0 (Bài 1, 2, 3)
    // Ngày mai (index 1) -> 3 (Bài 4, 5, 6)
    // Ngày kia (index 2) -> 6 (Bài 7, 8, 9)
    // T2 (index 3)       -> 9 (Bài 10, 11, 12)
    const dateIdx = presetDates.findIndex((p) => p.key === targetDateKey)
    if (dateIdx >= 0) {
      startIndex = dateIdx * 3
    } else {
      const todayKey = presetDates[0]?.key || '2026-08-21'
      const t1 = new Date(todayKey).getTime()
      const t2 = new Date(targetDateKey).getTime()
      const diffDays = Math.max(0, Math.round((t2 - t1) / (1000 * 60 * 60 * 24)))
      startIndex = diffDays * 3
    }
  }

  startIndex = Math.min(startIndex, Math.max(0, allLessons.length - 3))

  return allLessons.slice(startIndex, startIndex + 3)
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
  const [selectedStudents, setSelectedStudents] = useState<DigiStudentProfile[]>([])
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null)
  
  // Cấu hình lịch ĐỘC LẬP cho từng học viên
  const [studentConfigs, setStudentConfigs] = useState<Record<string, StudentScheduleConfig>>({})
  
  const dateInputRef = useRef<HTMLInputElement>(null)
  const roomCapacity = MOCK_ROOMS_CAPACITY[roomName] || 10
  const presetDates = useMemo(() => getPresetDates(), [])

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

  // Học viên đang được active trên Panel Phải
  const activeStudent = useMemo(() => {
    if (!activeStudentId || selectedStudents.length === 0) return null
    return selectedStudents.find((s) => s.id === activeStudentId) || selectedStudents[0] || null
  }, [activeStudentId, selectedStudents])

  // Cấu hình lịch của học viên đang active
  const activeConfig = useMemo<StudentScheduleConfig>(() => {
    if (!activeStudent) {
      return {
        selectedPackage: null,
        selectedDateKey: date || '2026-08-20',
        dateLessonsMap: {},
      }
    }
    return (
      studentConfigs[activeStudent.id] || {
        selectedPackage: activeStudent.packages?.[0] || null,
        selectedDateKey: date || '2026-08-20',
        dateLessonsMap: {},
      }
    )
  }, [activeStudent, studentConfigs, date])

  const isCustomDate = useMemo(() => {
    return !presetDates.some((p) => p.key === activeConfig.selectedDateKey)
  }, [presetDates, activeConfig.selectedDateKey])

  // Bài học đã chọn của active student trong ngày đang xem
  const activeSelectedLessonIds = useMemo(() => {
    return activeConfig.dateLessonsMap[activeConfig.selectedDateKey] || []
  }, [activeConfig.dateLessonsMap, activeConfig.selectedDateKey])

  // Tóm tắt lịch của từng học viên để hiển thị badge ở panel trái
  const studentSchedulesMap: Record<string, StudentScheduleSummary> = useMemo(() => {
    const map: Record<string, StudentScheduleSummary> = {}
    selectedStudents.forEach((student) => {
      const cfg = studentConfigs[student.id]
      if (!cfg || !cfg.selectedPackage) {
        map[student.id] = { lessonCount: 0 }
        return
      }

      let totalLessons = 0
      const activeDates: string[] = []
      Object.entries(cfg.dateLessonsMap || {}).forEach(([dKey, lIds]) => {
        if (lIds.length > 0) {
          totalLessons += lIds.length
          activeDates.push(dKey)
        }
      })

      if (totalLessons === 0) {
        map[student.id] = { lessonCount: 0 }
        return
      }

      let timeRange = ''
      if (activeDates.length === 1) {
        const dDisplay = activeDates[0].split('-').reverse().slice(0, 2).join('/')
        timeRange = dDisplay
      } else {
        timeRange = `${activeDates.length} ngày`
      }

      map[student.id] = {
        lessonCount: totalLessons,
        timeRange,
      }
    })
    return map
  }, [selectedStudents, studentConfigs])

  // Toggle student selection
  const handleToggleStudent = (student: DigiStudentProfile) => {
    setSelectedStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id)
      let next: DigiStudentProfile[]

      if (exists) {
        next = prev.filter((s) => s.id !== student.id)
        if (activeStudentId === student.id) {
          setActiveStudentId(next[0]?.id || null)
        }
      } else {
        next = [...prev, student]
        setActiveStudentId(student.id)
        setStudentConfigs((prevCfgs) => ({
          ...prevCfgs,
          [student.id]: prevCfgs[student.id] || {
            selectedPackage: student.packages?.[0] || null,
            selectedDateKey: date || '2026-08-20',
            dateLessonsMap: {},
          },
        }))
      }
      return next
    })
  }

  const handleClearAllStudents = () => {
    setSelectedStudents([])
    setActiveStudentId(null)
    setStudentConfigs({})
  }

  // Cập nhật gói học riêng cho active student
  const handleSelectPackage = (pkg: DigiStudentPackage) => {
    if (!activeStudent) return
    setStudentConfigs((prev) => ({
      ...prev,
      [activeStudent.id]: {
        ...(prev[activeStudent.id] || { selectedDateKey: date || '2026-08-20' }),
        selectedPackage: pkg,
        dateLessonsMap: {}, // Reset selections for clean progressive setup
      },
    }))
  }

  // Chọn ngày học: Đổi ngày sẽ tự động đổi bài tịnh tiến
  const handleSelectDateKey = (dateKey: string) => {
    if (!activeStudent) return
    setStudentConfigs((prev) => ({
      ...prev,
      [activeStudent.id]: {
        ...(prev[activeStudent.id] || {
          selectedPackage: activeStudent.packages?.[0] || null,
          dateLessonsMap: {},
        }),
        selectedDateKey: dateKey,
      },
    }))
  }

  // Toggle bài học trên ngày đang chọn
  const handleToggleLesson = (lessonId: string) => {
    if (!activeStudent) return
    const curLessonIds = activeConfig.dateLessonsMap[activeConfig.selectedDateKey] || []
    const nextLessonIds = curLessonIds.includes(lessonId)
      ? curLessonIds.filter((id) => id !== lessonId)
      : [...curLessonIds, lessonId]

    setStudentConfigs((prev) => ({
      ...prev,
      [activeStudent.id]: {
        ...activeConfig,
        dateLessonsMap: {
          ...activeConfig.dateLessonsMap,
          [activeConfig.selectedDateKey]: nextLessonIds,
        },
      },
    }))
  }

  // Danh sách bài học tịnh tiến theo ngày
  const progressiveLessons = useMemo(() => {
    if (!activeStudent || !activeConfig.selectedPackage) return []
    return getProgressiveLessonsForDate(
      activeConfig.selectedPackage,
      activeConfig.selectedDateKey,
      presetDates,
      activeConfig.dateLessonsMap
    )
  }, [activeStudent, activeConfig.selectedPackage, activeConfig.selectedDateKey, presetDates, activeConfig.dateLessonsMap])

  const handleToggleSelectAll = () => {
    if (!activeStudent || progressiveLessons.length === 0) return
    const allIds = progressiveLessons.map((l) => l.lessonId)
    const isAll = progressiveLessons.every((l) => activeSelectedLessonIds.includes(l.lessonId))

    setStudentConfigs((prev) => ({
      ...prev,
      [activeStudent.id]: {
        ...activeConfig,
        dateLessonsMap: {
          ...activeConfig.dateLessonsMap,
          [activeConfig.selectedDateKey]: isAll ? [] : allIds,
        },
      },
    }))
  }

  // Calculate lesson schedule slots for the ACTIVE student on the CURRENT date
  const lessonScheduleItems: LessonScheduleItem[] = useMemo(() => {
    if (!activeStudent || progressiveLessons.length === 0) return []
    let currentSlotIdx = 0

    return progressiveLessons.map((lesson) => {
      const slotStartTime = DIGI_TIME_SLOTS[currentSlotIdx] || '20:30'
      const slotEndTime = calculateEndTime(slotStartTime, 30)
      
      // Occupancy check for this slot and date
      const { occupied, capacity } = getSlotOccupancy(
        existingBookings,
        roomName,
        activeConfig.selectedDateKey,
        slotStartTime
      )

      // Count bookings from other students in current dialog session on same date & slot
      let modalOtherOccupied = 0
      selectedStudents.forEach((st) => {
        if (st.id === activeStudent.id) return
        const cfg = studentConfigs[st.id]
        if (!cfg || !cfg.selectedPackage) return

        const stLessonsOnDate = cfg.dateLessonsMap[activeConfig.selectedDateKey] || []
        const progressiveForSt = getProgressiveLessonsForDate(
          cfg.selectedPackage,
          activeConfig.selectedDateKey,
          presetDates,
          cfg.dateLessonsMap
        )

        progressiveForSt.forEach((otherLesson, oIdx) => {
          if (!stLessonsOnDate.includes(otherLesson.lessonId)) return
          const oSlotStart = DIGI_TIME_SLOTS[oIdx] || '20:30'
          if (oSlotStart === slotStartTime) {
            modalOtherOccupied += 1
          }
        })
      })

      const totalOccupied = occupied + modalOtherOccupied
      const remaining = Math.max(0, capacity - totalOccupied)
      const isFull = remaining <= 0

      currentSlotIdx = Math.min(DIGI_TIME_SLOTS.length - 1, currentSlotIdx + 1)

      return {
        lesson,
        slotStartTime,
        slotEndTime,
        slotInfo: {
          occupied: totalOccupied,
          capacity,
          isFull,
          remaining,
        },
      }
    })
  }, [
    activeStudent,
    progressiveLessons,
    activeConfig.selectedDateKey,
    existingBookings,
    roomName,
    selectedStudents,
    studentConfigs,
    presetDates,
  ])

  // Over-capacity check for active student
  const hasOverCapacity = useMemo(() => {
    return lessonScheduleItems
      .filter((item) => activeSelectedLessonIds.includes(item.lesson.lessonId))
      .some((item) => item.slotInfo.isFull)
  }, [lessonScheduleItems, activeSelectedLessonIds])

  // Tổng hợp số học viên đã có bài học được chọn
  const scheduledStudents = useMemo(() => {
    return selectedStudents.filter((s) => {
      const cfg = studentConfigs[s.id]
      if (!cfg || !cfg.selectedPackage) return false
      return Object.values(cfg.dateLessonsMap || {}).some((lIds) => lIds.length > 0)
    })
  }, [selectedStudents, studentConfigs])

  const totalLessonsAll = useMemo(() => {
    return selectedStudents.reduce((sum, s) => {
      const cfg = studentConfigs[s.id]
      if (!cfg) return sum
      return (
        sum +
        Object.values(cfg.dateLessonsMap || {}).reduce((dSum, lIds) => dSum + lIds.length, 0)
      )
    }, 0)
  }, [selectedStudents, studentConfigs])

  const canConfirm = scheduledStudents.length > 0 && !hasOverCapacity

  const handleConfirm = () => {
    if (scheduledStudents.length === 0 || hasOverCapacity) return

    const allNewBookings: DigiStudentBooking[] = []

    scheduledStudents.forEach((student) => {
      const cfg = studentConfigs[student.id]!
      const pkg = cfg.selectedPackage!
      const allPkgLessons = getFullPackageLessons(pkg)
      
      Object.entries(cfg.dateLessonsMap || {}).forEach(([targetDateKey, selectedLessonIds]) => {
        if (selectedLessonIds.length === 0) return

        const activeLessons = allPkgLessons.filter((l) =>
          selectedLessonIds.includes(l.lessonId)
        )
        if (activeLessons.length === 0) return

        const lastIdx = activeLessons.length - 1
        
        const startTime = DIGI_TIME_SLOTS[0] || '18:00'
        const endSlotStart = DIGI_TIME_SLOTS[Math.min(DIGI_TIME_SLOTS.length - 1, lastIdx)] || '18:00'
        const endTime = calculateEndTime(endSlotStart, 30)

        allNewBookings.push({
          id: generateBookingId(),
          studentId: student.id,
          studentName: student.name,
          studentEnglishName: student.englishName,
          studentPhoneMasked: student.phoneMasked,
          packageName: pkg.packageName,
          branch: student.branch,
          selectedLessons: activeLessons.map((item) => ({
            ...item,
            status: 'pending' as const,
          })),
          totalLessons: activeLessons.length,
          totalMinutes: activeLessons.length * 30,
          date: targetDateKey,
          startTime,
          endTime,
          roomName,
          status: 'da_xep_lich',
        })
      })
    })

    onConfirm(allNewBookings)
    handleClose()
  }

  const handleClose = () => {
    setSelectedStudents([])
    setActiveStudentId(null)
    setStudentConfigs({})
    setSearchText('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="w-[96vw] max-w-[1150px] sm:max-w-[1150px] lg:max-w-[1200px] h-[88vh] max-h-[800px] min-h-[580px] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl border-border bg-card"
      >
        {/* Header: Tiêu đề + Nút đóng */}
        <DialogHeader className="px-5 py-3.5 border-b border-border/60 flex flex-row items-center justify-between shrink-0 bg-card">
          <DialogTitle className="text-sm sm:text-base font-bold text-foreground">
            Thêm lịch học viên {selectedStudents.length > 1 && `(${selectedStudents.length} học viên)`}
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

        {/* Body: Tách 2 Panel Trái - Phải */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          {/* Panel Trái: Danh sách học viên */}
          <DigiStudentListPanel
            students={filteredStudents}
            selectedStudents={selectedStudents}
            activeStudentId={activeStudent?.id || null}
            studentSchedulesMap={studentSchedulesMap}
            onToggleStudent={handleToggleStudent}
            onSetActiveStudent={setActiveStudentId}
            onClearAllStudents={handleClearAllStudents}
            searchText={searchText}
            onSearchChange={setSearchText}
            allStudentsCount={MOCK_DIGI_STUDENTS.length}
          />

          {/* Panel Phải: Lựa chọn lịch ĐỘC LẬP cho từng học viên & Tự động tịnh tiến theo ngày */}
          <DigiScheduleMatchingPanel
            selectedStudents={selectedStudents}
            activeStudent={activeStudent}
            studentSchedulesMap={studentSchedulesMap}
            selectedPackage={activeConfig.selectedPackage}
            onSelectPackage={handleSelectPackage}
            selectedDateKey={activeConfig.selectedDateKey}
            onSelectDateKey={handleSelectDateKey}
            presetDates={presetDates}
            isCustomDate={isCustomDate}
            selectedLessonIds={activeSelectedLessonIds}
            onToggleLesson={handleToggleLesson}
            onToggleSelectAll={handleToggleSelectAll}
            lessonScheduleItems={lessonScheduleItems}
            roomCapacity={roomCapacity}
            hasOverCapacity={hasOverCapacity}
            dateInputRef={dateInputRef}
          />
        </div>

        {/* Footer: Tóm tắt thông tin đã chọn + Các nút hành động */}
        <div className="flex items-center justify-between gap-3 px-5 py-3 border-t border-border/60 bg-muted/20 shrink-0">
          {/* Trái: Thông tin tóm tắt đã chọn */}
          <div className="flex items-center gap-2 text-xs min-w-0">
            {scheduledStudents.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-semibold text-foreground truncate max-w-[220px]">
                  {scheduledStudents.length === 1
                    ? scheduledStudents[0].name
                    : `${scheduledStudents.length}/${selectedStudents.length} học viên đã chọn bài`}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Tổng cộng: <strong className="text-foreground font-bold">{totalLessonsAll} bài</strong> ({totalLessonsAll * 30}p)
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
                {selectedStudents.length > 0
                  ? 'Vui lòng tích chọn bài học cho từng học viên ở panel phải'
                  : 'Vui lòng tích chọn học viên từ danh sách bên trái'}
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
              {scheduledStudents.length > 1
                ? `Thêm vào lịch (${scheduledStudents.length} học viên)`
                : 'Thêm vào lịch'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
