/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { EmptyState, StudentNotePopover } from '@/components/shared'
import { mockStudents } from '@/mocks/students'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { MultiSelectDropdown } from '@/components/controls'

export interface SelectedStudentItem {
  id: string
  name: string
  code: string
  status: string
}

interface StudentSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSelectedIds: string[]
  onConfirm: (selected: SelectedStudentItem[]) => void
  subject?: string
}

const AVAILABLE_PLACEMENT_STATUSES = [
  'pending_payment',
  'draft_class',
  'wait_for_assignment',
  'enroll_later',
  'pending_transfer',
  'fee_transfer',
  'awaiting_opening',
  'trial',
  'pending',
  'suspend',
]

const getMockPackage = (id: string, level?: string): string => {
  const packages = ['Tiêu chuẩn', 'Cao cấp Pro', 'Cấp tốc 1-1', 'Cam kết đầu ra']
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % packages.length
  const prefix = level || 'IELTS'
  return `${prefix} ${packages[idx]}`
}

const getMockPackageExpiryDate = (id: string): string => {
  const dates = ['15/12/2026', '20/10/2026', '31/01/2027', '05/09/2026', '12/11/2026', '28/02/2027']
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % dates.length
  return dates[idx]
}

const getMockRemainingSessions = (id: string): string => {
  const sessions = [12, 24, 36, 8, 16, 42, 4]
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % sessions.length
  return `${sessions[idx]} buổi`
}

const getMockSaleNote = (id: string, notes?: string): string => {
  if (notes) return notes
  const mockNotes = [
    'Học viên có nhu cầu học thử trước khi đóng phí.',
    'Sale note: Phụ huynh muốn xếp lớp học ca tối Thứ 2/Thứ 6.',
    'Chờ xếp lớp sau khi hoàn thành đóng phí đợt 2.',
    'Yêu cầu giáo viên bản ngữ dạy kèm IELTS Writing.',
    'Mong muốn học lớp sỹ số nhỏ để kèm cặp kỹ hơn.',
    'Học viên học lực khá, cần test đầu vào cẩn thiện.',
  ]
  const idx = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % mockNotes.length
  return mockNotes[idx]
}

const maskPhone = (phone?: string): string => {
  if (!phone) return '—'
  const p = phone.trim()
  if (p.length < 7) return p
  return `${p.slice(0, 4)}***${p.slice(-3)}`
}

export function StudentSelectionDialog({
  open,
  onOpenChange,
  initialSelectedIds,
  onConfirm,
  subject = '',
}: StudentSelectionDialogProps) {
  const [studentSearch, setStudentSearch] = useState('')
  const [studentTab, setStudentTab] = useState<'all' | 'suitable' | 'trial' | 'waiting' | 'enroll_later' | 'pending_transfer' | 'suspend'>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])

  const normalizedInitialIds = useMemo(() => {
    return initialSelectedIds.map((id) => id.split('-')[0])
  }, [initialSelectedIds])

  const newStudentsCount = useMemo(() => {
    return selectedIds.size
  }, [selectedIds])

  // Dynamic selector options
  const levelOptions = useMemo(() => {
    const levels = [...new Set(mockStudents.map((s) => s.level).filter(Boolean))].sort()
    return levels.map((l) => ({ value: l, label: l }))
  }, [])

  const packageOptions = useMemo(() => {
    const packages = [
      ...new Set(
        mockStudents.map((s) => s.packageName || getMockPackage(s.id, s.level)).filter(Boolean)
      ),
    ].sort()
    return packages.map((p) => ({ value: p, label: p }))
  }, [])

  // Sync selectedIds and filters when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedIds(new Set())
      setStudentSearch('')
      setStudentTab('all')
      setSelectedLevels([])
      setSelectedPackages([])
    }
  }, [open])

  // Filter students based on status eligibility and tabs
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const isInitiallySelected = normalizedInitialIds.includes(student.id)
      if (isInitiallySelected) {
        return false
      }

      // 1. Only show students eligible for placement (ignore active/graduated/inactive)
      if (!AVAILABLE_PLACEMENT_STATUSES.includes(student.status)) {
        return false
      }

      // 2. Search query filter
      if (studentSearch.trim()) {
        const q = studentSearch.toLowerCase()
        const match =
          student.name.toLowerCase().includes(q) ||
          student.id.toLowerCase().includes(q) ||
          (student.phone && student.phone.includes(q)) ||
          (student.email && student.email.toLowerCase().includes(q))
        if (!match) return false
      }

      // 3. Level filter
      if (selectedLevels.length > 0 && (!student.level || !selectedLevels.includes(student.level))) {
        return false
      }

      // 4. Package filter
      if (selectedPackages.length > 0) {
        const pkgName = student.packageName || getMockPackage(student.id, student.level)
        if (!selectedPackages.includes(pkgName)) {
          return false
        }
      }

      // 5. Tab filter
      if (studentTab === 'suitable') {
        const sub = subject.toLowerCase()
        return student.status === 'wait_for_assignment' || (student.level && student.level.toLowerCase().includes(sub))
      }
      if (studentTab === 'trial') {
        return student.status === 'trial'
      }
      if (studentTab === 'waiting') {
        return student.status === 'wait_for_assignment'
      }
      if (studentTab === 'enroll_later') {
        return student.status === 'enroll_later'
      }
      if (studentTab === 'pending_transfer') {
        return student.status === 'pending_transfer'
      }
      if (studentTab === 'suspend') {
        return (student.status as string) === 'suspend'
      }

      return true
    })
  }, [studentSearch, studentTab, subject, normalizedInitialIds, selectedLevels, selectedPackages])

  const tabCounts = useMemo(() => {
    const eligible = mockStudents.filter((student) => {
      const isInitiallySelected = normalizedInitialIds.includes(student.id)
      if (isInitiallySelected) return false

      const isEligible = AVAILABLE_PLACEMENT_STATUSES.includes(student.status)
      if (!isEligible) return false

      if (selectedLevels.length > 0 && (!student.level || !selectedLevels.includes(student.level))) {
        return false
      }

      if (selectedPackages.length > 0) {
        const pkgName = student.packageName || getMockPackage(student.id, student.level)
        if (!selectedPackages.includes(pkgName)) {
          return false
        }
      }

      return true
    })
    const sub = subject.toLowerCase()
    
    return {
      all: eligible.length,
      suitable: eligible.filter((s) => (s.status as string) === 'wait_for_assignment' || (s.level && s.level.toLowerCase().includes(sub))).length,
      trial: eligible.filter((s) => (s.status as string) === 'trial').length,
      waiting: eligible.filter((s) => (s.status as string) === 'wait_for_assignment').length,
      enroll_later: eligible.filter((s) => (s.status as string) === 'enroll_later').length,
      pending_transfer: eligible.filter((s) => (s.status as string) === 'pending_transfer').length,
      suspend: eligible.filter((s) => (s.status as string) === 'suspend').length,
    }
  }, [subject, normalizedInitialIds, selectedLevels, selectedPackages])

  const handleStudentSelectToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleConfirm = () => {
    const selectedList: SelectedStudentItem[] = mockStudents
      .filter((s) => selectedIds.has(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        code: `STU-00${s.id.replace('s', '')}`,
        status: s.status,
      }))
    onConfirm(selectedList)
  }

  const statusTabLabels: Record<string, string> = {
    trial: 'Trial',
    wait_for_assignment: 'Chờ xếp',
    enroll_later: 'Xếp lớp sau',
    pending_transfer: 'Chờ chuyển lớp',
    reserve: 'Bảo lưu',
    suspend: 'Tạm dừng',
    pending_payment: 'Chờ đóng phí',
    draft_class: 'Nháp',
    fee_transfer: 'Chuyển phí',
    awaiting_opening: 'Chờ khai giảng',
    pending: 'Chờ xử lý',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl h-[75vh] flex flex-col p-0 overflow-hidden rounded-2xl border bg-background shadow-xl">
        <DialogTitle className="sr-only">Chọn học viên xếp lớp</DialogTitle>

        <div className="px-5 py-3 border-b space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-bold text-foreground">Chọn học viên xếp lớp</h3>
          </div>

          {/* Filter Tabs (Left) + MultiSelect Filters (Right) on the same row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            <div className="flex items-center gap-1.5 overflow-x-auto select-none custom-scrollbar pb-0.5 min-w-0 flex-1">
              <Button
                variant={studentTab === 'suitable' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setStudentTab('suitable')}
                className={`h-7 text-xs px-3 shrink-0 rounded-lg gap-1.5 transition-all duration-200 ${
                  studentTab !== 'suitable'
                    ? 'border-primary/60 bg-primary/5 text-primary font-bold hover:bg-primary/10 shadow-xs'
                    : 'font-bold shadow-xs'
                }`}
              >
                <span>Phù hợp Trình độ</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  studentTab === 'suitable'
                    ? 'bg-background text-primary'
                    : 'bg-primary/20 text-primary'
                }`}>
                  {tabCounts.suitable}
                </span>
              </Button>
              <Button
                variant={studentTab === 'all' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setStudentTab('all')}
                className="h-7 text-xs px-3 shrink-0 rounded-lg gap-1.5"
              >
                <span>Tất cả</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  studentTab === 'all'
                    ? 'bg-background text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tabCounts.all}
                </span>
              </Button>
              <Button
                variant={studentTab === 'trial' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setStudentTab('trial')}
                className="h-7 text-xs px-3 shrink-0 rounded-lg gap-1.5"
              >
                <span>Học thử</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  studentTab === 'trial'
                    ? 'bg-background text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tabCounts.trial}
                </span>
              </Button>
              <Button
                variant={studentTab === 'waiting' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setStudentTab('waiting')}
                className="h-7 text-xs px-3 shrink-0 rounded-lg gap-1.5"
              >
                <span>Chờ xếp lớp</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  studentTab === 'waiting'
                    ? 'bg-background text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tabCounts.waiting}
                </span>
              </Button>

              <Button
                variant={studentTab === 'enroll_later' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setStudentTab('enroll_later')}
                className="h-7 text-xs px-3 shrink-0 rounded-lg gap-1.5"
              >
                <span>Xếp lớp sau</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  studentTab === 'enroll_later'
                    ? 'bg-background text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tabCounts.enroll_later}
                </span>
              </Button>
              <Button
                variant={studentTab === 'pending_transfer' ? 'default' : 'outline'}
                size="xs"
                onClick={() => setStudentTab('pending_transfer')}
                className="h-7 text-xs px-3 shrink-0 rounded-lg gap-1.5"
              >
                <span>Chờ chuyển lớp</span>
                <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                  studentTab === 'pending_transfer'
                    ? 'bg-background text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tabCounts.pending_transfer}
                </span>
              </Button>
            </div>

            {/* Dropdown Filters (Right) */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <MultiSelectDropdown
                value={selectedLevels}
                onValueChange={setSelectedLevels}
                options={levelOptions}
                placeholder="Trình độ"
                className="h-7 w-36 text-xs bg-background"
              />
              <MultiSelectDropdown
                value={selectedPackages}
                onValueChange={setSelectedPackages}
                options={packageOptions}
                placeholder="Gói đăng ký"
                className="h-7 w-44 text-xs bg-background"
              />
            </div>
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
          {filteredStudents.length > 0 ? (
            <div className="min-w-[900px]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 px-6 py-2.5 bg-muted/40 border-b text-xs font-bold text-muted-foreground uppercase tracking-wider sticky top-0 bg-background z-10">
                <div className="col-span-3 flex items-center gap-3">
                  <span>Học viên</span>
                </div>
                <div className="col-span-1">Trình độ</div>
                <div className="col-span-2">Gói đăng ký</div>
                <div className="col-span-2 text-right">Số buổi còn lại</div>
                <div className="col-span-2 pl-4">Ghi chú từ Sale</div>
                <div className="col-span-2 text-right">Trạng thái</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border/60">
                {filteredStudents.map((student) => {
                  const isChecked = selectedIds.has(student.id)
                  const initials = student.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(-2)
                    .join('')
                    .toUpperCase()
                  const studentCode = `STU-00${student.id.replace('s', '')}`

                  return (
                    <div
                      key={student.id}
                      onClick={() => handleStudentSelectToggle(student.id)}
                      className={`grid grid-cols-12 gap-3 px-6 py-3 items-center cursor-pointer transition-all duration-150 ${
                        isChecked
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleStudentSelectToggle(student.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-foreground truncate">{student.name}</div>
                          <div className="text-[11px] text-muted-foreground font-mono truncate">
                            {studentCode} • {maskPhone(student.phone)}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {student.level}
                        </span>
                      </div>
                      <div className="col-span-2 min-w-0">
                        <div className="text-xs text-muted-foreground font-medium truncate">
                          {getMockPackage(student.id, student.level)}
                        </div>
                        <div className="text-[11px] text-muted-foreground/70 font-mono truncate">
                          Hạn: {getMockPackageExpiryDate(student.id)}
                        </div>
                      </div>
                      <div className="col-span-2 text-right text-xs font-semibold text-foreground">
                        {getMockRemainingSessions(student.id)}
                      </div>
                      <div className="col-span-2 pl-4 flex items-center min-w-0" onClick={(e) => e.stopPropagation()}>
                        <StudentNotePopover
                          note={getMockSaleNote(student.id, student.notes)}
                          label="Ghi chú từ Sale"
                          triggerTextPrefix=""
                          className="px-1"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusBadgeClass(
                            student.status
                          )}`}
                        >
                          {statusTabLabels[student.status] || student.status}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <EmptyState
                title="Không tìm thấy học viên khả dụng"
                description="Thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc tab."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button size="sm" onClick={handleConfirm}>
            Đồng ý ({newStudentsCount})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
