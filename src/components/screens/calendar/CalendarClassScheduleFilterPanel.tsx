'use client'

import React, { useMemo, useState } from 'react'
import { RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FilterGroupAsidePanel,
  FilterCollapsibleSection,
  createFilterGroup,
  type FilterGroupConfig,
} from '@/components/filters'
import { BranchRoomTreeFilter } from './BranchRoomTreeFilter'
import { ProgramLevelTreeFilter } from './ProgramLevelTreeFilter'
import type { ClassSession } from '@/mocks/calendarSchedule'
import type { FilterState } from './calendarClassScheduleTypes'
import { DEFAULT_FILTER_STATE } from './calendarClassScheduleTypes'
import { countActiveFilters } from './calendarClassScheduleHelpers'
import { toast } from 'sonner'

interface CalendarClassScheduleFilterPanelProps {
  onClose: () => void
  appliedFilters: FilterState
  onApply: (newFilters: FilterState) => void
  allSessions: ClassSession[]
  branches: string[]
  roomsByBranch: Record<string, string[]>
}

export function CalendarClassScheduleFilterPanel({
  onClose,
  appliedFilters,
  onApply,
  allSessions,
  branches,
  roomsByBranch,
}: CalendarClassScheduleFilterPanelProps) {
  // Draft filter state (không lọc realtime trên lịch, khởi tạo theo appliedFilters khi mở)
  const [draftFilters, setDraftFilters] = useState<FilterState>(appliedFilters)

  // Tính số lượng lọc đang chọn trong bản nháp và bản đã áp dụng
  const draftActiveCount = useMemo(() => countActiveFilters(draftFilters), [draftFilters])
  const appliedActiveCount = useMemo(() => countActiveFilters(appliedFilters), [appliedFilters])

  const draftBranchRoomCount = useMemo(() => {
    return Object.values(draftFilters.branchRoomFilters || {}).reduce((acc, curr) => acc + curr.length, 0)
  }, [draftFilters.branchRoomFilters])

  // Danh mục môn học thực tế
  const subjects = useMemo(() => [...new Set(allSessions.map((s) => s.subject))].sort(), [allSessions])

  // Bản đồ Môn học / Chương trình -> Danh sách trình độ
  const levelsBySubject = useMemo(() => {
    const map: Record<string, Set<string>> = {}
    subjects.forEach((subj) => {
      map[subj] = new Set<string>()
    })
    allSessions.forEach((s) => {
      if (s.subject && s.level) {
        if (!map[s.subject]) {
          map[s.subject] = new Set<string>()
        }
        map[s.subject].add(s.level)
      }
    })
    const result: Record<string, string[]> = {}
    Object.entries(map).forEach(([subj, levelSet]) => {
      result[subj] = Array.from(levelSet).sort()
    })
    return result
  }, [subjects, allSessions])

  const draftProgramLevelCount = useMemo(() => {
    return Object.values(draftFilters.subjectLevelFilters || {}).reduce(
      (acc, curr) => acc + (curr.length > 0 ? curr.length : 1),
      0
    )
  }, [draftFilters.subjectLevelFilters])

  // Danh sách giáo viên: lấy cả GV chính và GV dạy thay, sắp xếp tiếng Việt
  const teachers = useMemo(() => {
    const set = new Set<string>()
    allSessions.forEach((s) => {
      if (s.teacher) set.add(s.teacher)
      if (s.substituteTeacher) set.add(s.substituteTeacher)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'vi'))
  }, [allSessions])

  // Xử lý toggle các checkbox thuộc tính trong bản nháp
  const handleToggle = (sectionId: string, value: string) => {
    setDraftFilters((prev) => {
      const toggle = (arr: string[] = []) =>
        arr.includes(value) ? arr.filter((i) => i !== value) : [...arr, value]

      switch (sectionId) {
        case 'periods':
          return { ...prev, periodFilters: toggle(prev.periodFilters) }

        case 'status_and_type': {
          if (value.startsWith('status:')) {
            const statusVal = value.replace('status:', '')
            return {
              ...prev,
              statusFilters: (prev.statusFilters || []).includes(statusVal)
                ? (prev.statusFilters || []).filter((s) => s !== statusVal)
                : [...(prev.statusFilters || []), statusVal],
            }
          } else if (value === 'type:opening') {
            return {
              ...prev,
              conditionFilters: prev.conditionFilters.includes('opening')
                ? prev.conditionFilters.filter((c) => c !== 'opening')
                : [...prev.conditionFilters, 'opening'],
            }
          } else if (value.startsWith('type:')) {
            const typeVal = value.replace('type:', '')
            return {
              ...prev,
              sessionTypeFilters: prev.sessionTypeFilters.includes(typeVal)
                ? prev.sessionTypeFilters.filter((t) => t !== typeVal)
                : [...prev.sessionTypeFilters, typeVal],
            }
          }
          return prev
        }

        case 'personnel': {
          if (value === 'flag:substitute') {
            return {
              ...prev,
              conditionFilters: prev.conditionFilters.includes('substitute')
                ? prev.conditionFilters.filter((c) => c !== 'substitute')
                : [...prev.conditionFilters, 'substitute'],
            }
          } else if (value === 'flag:has_assistant') {
            return {
              ...prev,
              conditionFilters: prev.conditionFilters.includes('has_assistant')
                ? prev.conditionFilters.filter((c) => c !== 'has_assistant')
                : [...prev.conditionFilters, 'has_assistant'],
            }
          } else {
            return { ...prev, teacherFilters: toggle(prev.teacherFilters) }
          }
        }


        case 'students_and_attendance': {
          if (value.startsWith('att:')) {
            const attVal = value.replace('att:', '')
            return {
              ...prev,
              attendanceFilters: prev.attendanceFilters.includes(attVal)
                ? prev.attendanceFilters.filter((a) => a !== attVal)
                : [...prev.attendanceFilters, attVal],
            }
          } else if (value.startsWith('trial:')) {
            const trialVal = value.replace('trial:', '')
            return {
              ...prev,
              trialFilters: prev.trialFilters.includes(trialVal)
                ? prev.trialFilters.filter((t) => t !== trialVal)
                : [...prev.trialFilters, trialVal],
            }
          } else if (value.startsWith('cap:')) {
            const capVal = value.replace('cap:', '')
            return {
              ...prev,
              capacityFilters: prev.capacityFilters.includes(capVal)
                ? prev.capacityFilters.filter((c) => c !== capVal)
                : [...prev.capacityFilters, capVal],
            }
          }
          return prev
        }

        default:
          return prev
      }
    })
  }

  // Xóa nhanh một nhóm trong bản nháp
  const handleClearSection = (sectionId: string) => {
    setDraftFilters((prev) => {
      switch (sectionId) {
        case 'periods':
          return { ...prev, periodFilters: [] }
        case 'status_and_type':
          return {
            ...prev,
            statusFilters: [],
            sessionTypeFilters: [],
            conditionFilters: prev.conditionFilters.filter((c) => c !== 'opening'),
          }
        case 'personnel':
          return {
            ...prev,
            teacherFilters: [],
            conditionFilters: prev.conditionFilters.filter(
              (c) => c !== 'substitute' && c !== 'has_assistant'
            ),
          }
        case 'students_and_attendance':
          return {
            ...prev,
            attendanceFilters: [],
            trialFilters: [],
            capacityFilters: [],
          }
        default:
          return prev
      }
    })
  }

  // Xử lý chọn Cơ sở & Phòng học trong TreeView (Draft)
  const handleToggleBranch = (branch: string) => {
    setDraftFilters((prev) => {
      const currentMap = prev.branchRoomFilters || {}
      const branchRooms = roomsByBranch[branch] || []
      const currentSelected = currentMap[branch] || []
      const isAllSelected = branchRooms.length > 0 && branchRooms.every((r) => currentSelected.includes(r))

      const next = { ...currentMap }
      if (isAllSelected) {
        delete next[branch]
      } else {
        next[branch] = [...branchRooms]
      }
      return { ...prev, branchRoomFilters: next }
    })
  }

  const handleToggleRoom = (branch: string, room: string) => {
    setDraftFilters((prev) => {
      const currentMap = prev.branchRoomFilters || {}
      const currentSelected = currentMap[branch] || []
      const nextRooms = currentSelected.includes(room)
        ? currentSelected.filter((r) => r !== room)
        : [...currentSelected, room]

      const next = { ...currentMap }
      if (nextRooms.length === 0) {
        delete next[branch]
      } else {
        next[branch] = nextRooms
      }
      return { ...prev, branchRoomFilters: next }
    })
  }

  const handleClearBranchRooms = () => {
    setDraftFilters((prev) => ({
      ...prev,
      branchRoomFilters: {},
    }))
  }

  // Xử lý chọn Chương trình & Trình độ trong TreeView (Draft)
  const handleToggleSubject = (subject: string) => {
    setDraftFilters((prev) => {
      const currentMap = prev.subjectLevelFilters || {}
      const subjLevels = levelsBySubject[subject] || []
      const currentSelected = currentMap[subject] || []
      const isAllSelected = subjLevels.length > 0 && subjLevels.every((l) => currentSelected.includes(l))

      const next = { ...currentMap }
      if (isAllSelected) {
        delete next[subject]
      } else {
        next[subject] = [...subjLevels]
      }

      const nextSubjectFilters = Object.keys(next)
      const nextLevelFilters = Array.from(new Set(Object.values(next).flat()))

      return {
        ...prev,
        subjectLevelFilters: next,
        subjectFilters: nextSubjectFilters,
        levelFilters: nextLevelFilters,
      }
    })
  }

  const handleToggleLevel = (subject: string, level: string) => {
    setDraftFilters((prev) => {
      const currentMap = prev.subjectLevelFilters || {}
      const currentSelected = currentMap[subject] || []
      const nextLevels = currentSelected.includes(level)
        ? currentSelected.filter((l) => l !== level)
        : [...currentSelected, level]

      const next = { ...currentMap }
      if (nextLevels.length === 0) {
        delete next[subject]
      } else {
        next[subject] = nextLevels
      }

      const nextSubjectFilters = Object.keys(next)
      const nextLevelFilters = Array.from(new Set(Object.values(next).flat()))

      return {
        ...prev,
        subjectLevelFilters: next,
        subjectFilters: nextSubjectFilters,
        levelFilters: nextLevelFilters,
      }
    })
  }

  const handleClearProgramLevels = () => {
    setDraftFilters((prev) => ({
      ...prev,
      subjectLevelFilters: {},
      subjectFilters: [],
      levelFilters: [],
    }))
  }

  // Reset toàn bộ lựa chọn trong bản nháp
  const handleResetDraft = () => {
    setDraftFilters(DEFAULT_FILTER_STATE)
  }

  // Áp dụng bộ lọc từ bản nháp ra màn hình chính
  const handleApply = () => {
    onApply(draftFilters)
    if (draftActiveCount > 0) {
      toast.success(`Đã áp dụng bộ lọc (${draftActiveCount} điều kiện)`)
    } else {
      toast.success('Đã xóa tất cả bộ lọc')
    }
  }

  // Đóng panel: hoàn tác các thay đổi chưa áp dụng
  const handleClose = () => {
    onClose()
  }

  // 1. Tùy chọn Ca học (Khoảng thời gian)
  const periodOptions = useMemo(
    () => [
      {
        value: 'morning',
        label: 'Sáng (trước 12:00)',
      },
      {
        value: 'afternoon',
        label: 'Chiều (12:00 - 18:00)',
      },
      {
        value: 'evening',
        label: 'Tối (sau 18:00)',
      },
    ],
    []
  )

  // 2. Tùy chọn Trạng thái & Loại buổi học (Gom Trạng thái + Loại buổi + Khai giảng)
  const statusAndTypeOptions = useMemo(
    () => [
      {
        value: 'status:confirmed',
        label: 'Sắp diễn ra / Đã xác nhận',
      },
      {
        value: 'status:completed',
        label: 'Đã hoàn thành',
      },
      {
        value: 'status:rescheduled',
        label: 'Đổi ngày',
      },
      {
        value: 'status:cancelled',
        label: 'Buổi học đã hủy',
      },
      {
        value: 'type:class_session',
        label: 'Buổi thường',
      },
      {
        value: 'type:test_session',
        label: 'Buổi kiểm tra',
      },
      {
        value: 'type:opening',
        label: 'Buổi khai giảng',
      },
      {
        value: 'type:supplementary',
        label: 'Buổi bổ trợ',
      },
      {
        value: 'type:project',
        label: 'Buổi dự án',
      },
      {
        value: 'type:workshop',
        label: 'Workshop',
      },
    ],
    []
  )

  const statusAndTypeSelectedValues = useMemo(
    () => [
      ...(draftFilters.statusFilters || []).map((s) => `status:${s}`),
      ...(draftFilters.sessionTypeFilters || []).map((t) => `type:${t}`),
      ...(draftFilters.conditionFilters.includes('opening') ? ['type:opening'] : []),
    ],
    [draftFilters.statusFilters, draftFilters.sessionTypeFilters, draftFilters.conditionFilters]
  )

  // 3. Tùy chọn Nhân sự lớp học (Search tên GV + GV + Dạy thay + Trợ giảng)
  const personnelOptions = useMemo(
    () => [
      {
        value: 'flag:substitute',
        label: 'Giáo viên dạy thay',
      },
      {
        value: 'flag:has_assistant',
        label: 'Có trợ giảng hỗ trợ',
      },
      ...teachers.map((teacher) => ({
        value: teacher,
        label: teacher,
      })),
    ],
    [teachers]
  )

  const personnelSelectedValues = useMemo(
    () => [
      ...draftFilters.teacherFilters,
      ...(draftFilters.conditionFilters.includes('substitute') ? ['flag:substitute'] : []),
      ...(draftFilters.conditionFilters.includes('has_assistant') ? ['flag:has_assistant'] : []),
    ],
    [draftFilters.teacherFilters, draftFilters.conditionFilters]
  )

  // 4. Tùy chọn Học viên & Chuyên cần (Điểm danh + Học thử/bù)
  const studentsAndAttendanceOptions = useMemo(
    () => [
      {
        value: 'att:attended',
        label: 'Đã điểm danh',
      },
      {
        value: 'att:unattended',
        label: 'Chưa điểm danh',
      },
      {
        value: 'att:has_absent',
        label: 'Có học sinh vắng',
      },
      {
        value: 'trial:has_trial',
        label: 'Có học viên học thử',
      },
      {
        value: 'trial:has_makeup',
        label: 'Có học viên học bù',
      },
    ],
    []
  )

  const studentsAndAttendanceSelectedValues = useMemo(
    () => [
      ...draftFilters.attendanceFilters.map((a) => `att:${a}`),
      ...draftFilters.trialFilters.map((t) => `trial:${t}`),
    ],
    [draftFilters.attendanceFilters, draftFilters.trialFilters]
  )

  // Cấu hình các nhóm lọc thuộc tính dạng Accordion (Ca học, Trạng thái, Nhân sự, Học viên)
  const filterGroups = useMemo<FilterGroupConfig[]>(
    () => [
      // 1. Ca học (Đổi tên từ Khoảng thời gian)
      createFilterGroup({
        id: 'periods',
        title: 'Ca học',
        options: periodOptions,
        selectedValues: draftFilters.periodFilters,
        searchable: false,
      }),

      // 2. Trạng thái & Loại buổi
      createFilterGroup({
        id: 'status_and_type',
        title: 'Trạng thái & Loại buổi',
        options: statusAndTypeOptions,
        selectedValues: statusAndTypeSelectedValues,
        scrollable: true,
        searchable: false,
      }),

      // 3. Nhân sự lớp học (CÓ TÌM KIẾM NHANH TÊN GV)
      createFilterGroup({
        id: 'personnel',
        title: 'Nhân sự lớp học',
        options: personnelOptions,
        selectedValues: personnelSelectedValues,
        searchable: true,
        scrollable: true,
      }),

      // 4. Học viên & Chuyên cần (Gom Điểm danh + Học thử/bù + Sĩ số)
      createFilterGroup({
        id: 'students_and_attendance',
        title: 'Học viên & Chuyên cần',
        options: studentsAndAttendanceOptions,
        selectedValues: studentsAndAttendanceSelectedValues,
        scrollable: true,
        searchable: false,
      }),
    ],
    [
      periodOptions,
      draftFilters.periodFilters,
      statusAndTypeOptions,
      statusAndTypeSelectedValues,
      personnelOptions,
      personnelSelectedValues,
      studentsAndAttendanceOptions,
      studentsAndAttendanceSelectedValues,
    ]
  )

  return (
    <FilterGroupAsidePanel
      title="Bộ lọc lịch học trung tâm"
      groups={filterGroups}
      activeCount={draftActiveCount}
      onToggle={handleToggle}
      onClearSection={handleClearSection}
      onClose={handleClose}
      footer={
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDraft}
            disabled={draftActiveCount === 0 && appliedActiveCount === 0}
            className="flex-1 h-8 text-xs font-medium cursor-pointer"
            title="Xóa tất cả điều kiện đang chọn trong bộ lọc"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            Xóa bộ lọc
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="flex-1 h-8 text-xs font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Check className="h-3.5 w-3.5 mr-1" />
            Áp dụng {draftActiveCount > 0 ? `(${draftActiveCount})` : ''}
          </Button>
        </div>
      }
    >
      {/* 1. Cơ sở & Phòng học (Treeview) */}
      <FilterCollapsibleSection
        title="Cơ sở & Phòng học"
        defaultOpen={true}
        badgeCount={draftBranchRoomCount}
        onClear={draftBranchRoomCount > 0 ? handleClearBranchRooms : undefined}
      >
        <BranchRoomTreeFilter
          branches={branches}
          roomsByBranch={roomsByBranch}
          allSessions={allSessions}
          selectedBranchRooms={draftFilters.branchRoomFilters || {}}
          onToggleBranch={handleToggleBranch}
          onToggleRoom={handleToggleRoom}
          searchable={false}
        />
      </FilterCollapsibleSection>

      {/* 2. Chương trình & Trình độ (Treeview dạng như Cơ sở & Phòng học, đặt trước Ca học) */}
      <FilterCollapsibleSection
        title="Chương trình & Trình độ"
        defaultOpen={true}
        badgeCount={draftProgramLevelCount}
        onClear={draftProgramLevelCount > 0 ? handleClearProgramLevels : undefined}
      >
        <ProgramLevelTreeFilter
          subjects={subjects}
          levelsBySubject={levelsBySubject}
          allSessions={allSessions}
          selectedSubjectLevels={draftFilters.subjectLevelFilters || {}}
          onToggleSubject={handleToggleSubject}
          onToggleLevel={handleToggleLevel}
          showCount={false}
        />
      </FilterCollapsibleSection>
    </FilterGroupAsidePanel>
  )
}
