'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { ExpandableSearch } from '@/components/controls'
import { UserPlus, Trash2, Plus, Users } from 'lucide-react'
import { mockStudents } from '@/mocks/students'
import {
  getMockRemainingSessions,
  getMockSaleNote,
  getMockPackage,
} from './classesCreateTypes'

export interface StudentItem {
  id: string
  name: string
  code: string
  status?: string
}

interface ClassesCreateRosterProps {
  students: StudentItem[]
  onAddStudent: (student: StudentItem) => void
  onRemoveStudent: (id: string) => void
  onRemoveAllStudents?: () => void
  onAddMultipleStudents?: (students: StudentItem[]) => void
  subject?: string
  level?: string
  classRatio?: string
}

interface StudentCardItemProps {
  studentId: string
  name: string
  code: string
  level: string
  isSelected: boolean
  saleNote?: string
  onRemove?: () => void
  onAdd?: () => void
  isSelectMode?: boolean
}

function StudentCardItem({
  studentId,
  name,
  code,
  level,
  isSelected,
  saleNote,
  onRemove,
  onAdd,
  isSelectMode = false,
}: StudentCardItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const currentPackage = getMockPackage(studentId, level)
  const remainingSessions = getMockRemainingSessions(studentId)
  const noteContent = saleNote || getMockSaleNote(studentId)
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(-2)
    .join('')
    .toUpperCase()

  const isLongNote = noteContent.length > 35

  return (
    <div
      className={`p-3 rounded-xl border transition-all flex flex-col gap-2 group ${
        isSelected
          ? 'border-primary/40 bg-primary/5 hover:bg-primary/10'
          : 'bg-card hover:border-primary/40 hover:shadow-xs'
      }`}
    >
      {/* Top Row: Avatar + Main Student Details + Action Button */}
      <div className="flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`h-9 w-9 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
              isSelected
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground truncate">{name}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground shrink-0">
                {level || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
              <span className="font-mono text-[10px] text-muted-foreground/80">{code}</span>
              <span>•</span>
              <span className="truncate">{currentPackage}</span>
              <span>•</span>
              <span className="font-semibold text-foreground">{remainingSessions}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1 shrink-0">
          {!isSelectMode ? (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-bold text-destructive px-3 py-1 rounded-lg border border-transparent bg-transparent hover:bg-background hover:border-border hover:shadow-2xs transition-all cursor-pointer select-none"
              title="Xóa khỏi lớp"
            >
              Xóa
            </button>
          ) : isSelected ? (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs font-bold text-primary px-3 py-1 rounded-lg border border-transparent bg-transparent hover:bg-background hover:border-border hover:text-destructive hover:shadow-2xs transition-all cursor-pointer select-none"
              title="Click để bỏ chọn"
            >
              Đã chọn
            </button>
          ) : (
            <button
              type="button"
              onClick={onAdd}
              className="text-xs font-bold text-primary px-3 py-1 rounded-lg border border-transparent bg-transparent hover:bg-background hover:border-border hover:shadow-2xs transition-all cursor-pointer select-none"
              title="Thêm vào lớp"
            >
              Thêm
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Full-width Note with inline italic Xem thêm / Thu gọn */}
      {noteContent && (
        <div className="w-full border-t border-border/40 pt-1.5 mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
          <span className="font-normal text-muted-foreground mr-1">Ghi chú:</span>
          <span>
            {isExpanded ? (
              <>
                {noteContent}{' '}
                {isLongNote && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="text-[11px] italic font-medium text-primary hover:underline cursor-pointer ml-1 inline-block"
                  >
                    Thu gọn
                  </button>
                )}
              </>
            ) : (
              <>
                {isLongNote ? `${noteContent.slice(0, 35)}... ` : noteContent}
                {isLongNote && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(true)}
                    className="text-[11px] italic font-medium text-primary hover:underline cursor-pointer ml-1 inline-block"
                  >
                    Xem thêm
                  </button>
                )}
              </>
            )}
          </span>
        </div>
      )}
    </div>
  )
}

export function ClassesCreateRoster({
  students,
  onAddStudent,
  onRemoveStudent,
  onRemoveAllStudents,
  onAddMultipleStudents,
  subject = '',
  level = '',
  classRatio = '1:10',
}: ClassesCreateRosterProps) {
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTab, setFilterTab] = useState<'suitable' | 'waiting' | 'trial' | 'enroll_later' | 'pending_transfer' | 'all'>('suitable')

  // Parse maximum capacity from classRatio (e.g. '1:10' -> 10)
  const maxCapacity = useMemo(() => {
    const parts = classRatio.split(':')
    if (parts.length === 2 && !isNaN(Number(parts[1]))) {
      return Number(parts[1])
    }
    return 15
  }, [classRatio])

  const selectedIdsSet = useMemo(() => {
    return new Set(students.map((s) => s.id))
  }, [students])

  // Filter available waiting students for right column & move selected students to the bottom
  const availableStudents = useMemo(() => {
    const filtered = mockStudents.filter((student) => {
      // Basic text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameMatch = student.name.toLowerCase().includes(q)
        const codeMatch = student.id.toLowerCase().includes(q)
        const phoneMatch = student.phone?.includes(q)
        if (!nameMatch && !codeMatch && !phoneMatch) return false
      }

      // Tab filter
      if (filterTab === 'suitable') {
        const sSub = subject.toLowerCase()
        const sLev = level.toLowerCase()
        const stLev = (student.level || '').toLowerCase()
        const stProg = (student.curriculum || '').toLowerCase()

        if (sSub || sLev) {
          const matchesSubject = !sSub || stLev.includes(sSub) || stProg.includes(sSub)
          const matchesLevel = !sLev || stLev.includes(sLev)
          const isSubjectMatch =
            (sSub.includes('ielts') && stLev.includes('ielts')) ||
            (sSub.includes('toeic') && stLev.includes('toeic')) ||
            (sSub.includes('toán') && stLev.includes('toán')) ||
            (sSub.includes('english') && stLev.includes('english'))

          if (!matchesSubject && !isSubjectMatch && !matchesLevel) return false
        }
      } else if (filterTab === 'waiting') {
        const waitingStatuses = ['wait_for_assignment', 'draft_class', 'pending_payment', 'pending']
        if (!waitingStatuses.includes(student.status)) return false
      } else if (filterTab === 'trial') {
        if (student.status !== 'trial') return false
      } else if (filterTab === 'enroll_later') {
        if (student.status !== 'enroll_later') return false
      } else if (filterTab === 'pending_transfer') {
        const transferStatuses = ['pending_transfer', 'fee_transfer']
        if (!transferStatuses.includes(student.status)) return false
      }

      return true
    })

    // Move selected students to the bottom of the list
    return [...filtered].sort((a, b) => {
      const aSelected = selectedIdsSet.has(a.id) ? 1 : 0
      const bSelected = selectedIdsSet.has(b.id) ? 1 : 0
      return aSelected - bSelected
    })
  }, [searchQuery, filterTab, subject, level, selectedIdsSet])

  // Calculate real-time counts for all tabs
  const tabCounts = useMemo(() => {
    let suitableCount = 0
    let waitingCount = 0
    let trialCount = 0
    let enrollLaterCount = 0
    let pendingTransferCount = 0
    let allCount = 0

    const sSub = subject.toLowerCase()
    const sLev = level.toLowerCase()
    const waitingStatuses = ['wait_for_assignment', 'draft_class', 'pending_payment', 'pending']
    const transferStatuses = ['pending_transfer', 'fee_transfer']

    mockStudents.forEach((student) => {
      // Basic text search filter if searchQuery exists
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const nameMatch = student.name.toLowerCase().includes(q)
        const codeMatch = student.id.toLowerCase().includes(q)
        const phoneMatch = student.phone?.includes(q)
        if (!nameMatch && !codeMatch && !phoneMatch) return
      }

      allCount++

      // Check suitable
      const stLev = (student.level || '').toLowerCase()
      const stProg = (student.curriculum || '').toLowerCase()
      if (sSub || sLev) {
        const matchesSubject = !sSub || stLev.includes(sSub) || stProg.includes(sSub)
        const matchesLevel = !sLev || stLev.includes(sLev)
        const isSubjectMatch =
          (sSub.includes('ielts') && stLev.includes('ielts')) ||
          (sSub.includes('toeic') && stLev.includes('toeic')) ||
          (sSub.includes('toán') && stLev.includes('toán')) ||
          (sSub.includes('english') && stLev.includes('english'))

        if (matchesSubject || isSubjectMatch || matchesLevel) {
          suitableCount++
        }
      } else {
        suitableCount++
      }

      // Check waiting
      if (waitingStatuses.includes(student.status)) {
        waitingCount++
      }

      // Check trial
      if (student.status === 'trial') {
        trialCount++
      }

      // Check enroll_later
      if (student.status === 'enroll_later') {
        enrollLaterCount++
      }

      // Check pending_transfer
      if (transferStatuses.includes(student.status)) {
        pendingTransferCount++
      }
    })

    return {
      suitable: suitableCount,
      waiting: waitingCount,
      trial: trialCount,
      enroll_later: enrollLaterCount,
      pending_transfer: pendingTransferCount,
      all: allCount,
    }
  }, [searchQuery, subject, level])

  const unselectedFilteredStudents = useMemo(() => {
    return availableStudents.filter((s) => !selectedIdsSet.has(s.id))
  }, [availableStudents, selectedIdsSet])

  const handleRemoveAllConfirm = () => {
    if (onRemoveAllStudents) {
      onRemoveAllStudents()
    }
    setConfirmRemoveAll(false)
  }

  const handleAddAllFiltered = () => {
    if (onAddMultipleStudents && unselectedFilteredStudents.length > 0) {
      const itemsToAdd: StudentItem[] = unselectedFilteredStudents.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.id,
        status: s.status,
      }))
      onAddMultipleStudents(itemsToAdd)
    } else {
      unselectedFilteredStudents.forEach((s) => {
        onAddStudent({
          id: s.id,
          name: s.name,
          code: s.id,
          status: s.status,
        })
      })
    }
  }

  const capacityPercent = Math.min(100, Math.round((students.length / maxCapacity) * 100))
  const isNearCapacity = capacityPercent >= 90

  const getTabClass = (isActive: boolean) =>
    `text-[11px] h-6.5 px-2.5 rounded-full shrink-0 font-medium transition-all border cursor-pointer ${
      isActive
        ? 'bg-primary text-primary-foreground border-primary font-semibold shadow-2xs'
        : 'bg-background text-foreground/80 border-border/80 hover:bg-muted hover:text-foreground hover:border-muted-foreground/40'
    }`

  type TabType = 'suitable' | 'waiting' | 'trial' | 'enroll_later' | 'pending_transfer' | 'all'

  const allTabs: { id: TabType; label: string; count: number }[] = [
    { id: 'suitable', label: 'Phù hợp Trình độ', count: tabCounts.suitable },
    { id: 'waiting', label: 'Chờ xếp lớp', count: tabCounts.waiting },
    { id: 'trial', label: 'Học thử', count: tabCounts.trial },
    { id: 'enroll_later', label: 'Xếp lớp sau', count: tabCounts.enroll_later },
    { id: 'pending_transfer', label: 'Chờ chuyển lớp', count: tabCounts.pending_transfer },
    { id: 'all', label: 'Tất cả', count: tabCounts.all },
  ]

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-0 overflow-hidden py-0">
      {/* LEFT COLUMN: SELECTED STUDENTS IN CLASS */}
      <div className="flex flex-col border rounded-xl bg-background overflow-hidden min-h-0 shadow-xs">
        {/* Header bar */}
        <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Học viên trong lớp</h3>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Danh sách học viên đã được xếp vào lớp học này.
            </p>
          </div>
          <div className="flex items-center gap-3 text-right">
            {students.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setConfirmRemoveAll(true)}
                className="text-[11px] h-7 font-semibold text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Xóa tất cả ({students.length})
              </Button>
            )}
            <div>
              <div className="text-xs font-bold text-foreground">
                Đã chọn: <span className={isNearCapacity ? 'text-amber-600 dark:text-amber-400' : 'text-primary'}>{students.length}</span> / {maxCapacity} học viên
              </div>
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden mt-1.5 ml-auto">
                <div
                  className={`h-full transition-all duration-300 ${
                    isNearCapacity ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Selected Student Cards List */}
        {students.length > 0 ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
            {students.map((student) => {
              const studentDetails = mockStudents.find((s) => s.id === student.id)
              const currentLevel = studentDetails?.level || '—'
              const saleNote = getMockSaleNote(student.id, studentDetails?.notes)

              return (
                <StudentCardItem
                  key={student.id}
                  studentId={student.id}
                  name={student.name}
                  code={student.code}
                  level={currentLevel}
                  isSelected={true}
                  saleNote={saleNote}
                  onRemove={() => onRemoveStudent(student.id)}
                  isSelectMode={false}
                />
              )
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-muted/5">
            <EmptyState
              title="Chưa có học viên nào"
              description="Bấm 'Thêm' ở kho danh sách chờ bên phải để xếp học viên vào lớp."
              icon={<UserPlus className="h-7 w-7 text-muted-foreground" />}
            />
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: WAITING STUDENTS POOL CARDS */}
      <div className="flex flex-col border rounded-xl bg-background overflow-hidden min-h-0 shadow-xs">
        {/* Header & Search */}
        <div className="p-3 border-b bg-muted/30 space-y-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-foreground truncate">Kho học viên chờ xếp lớp</h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Expandable Search icon placed BEFORE "Thêm tất cả" button */}
              <ExpandableSearch
                value={searchQuery}
                onValueChange={setSearchQuery}
                placeholder="Tìm tên, mã học viên, SĐT..."
                inputClassName="h-7 text-xs w-44 sm:w-48"
              />

              {unselectedFilteredStudents.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAddAllFiltered}
                  className="text-[11px] h-7 font-semibold shrink-0"
                >
                  <Plus className="h-3 w-3 mr-1" /> Thêm tất cả ({unselectedFilteredStudents.length})
                </Button>
              )}
            </div>
          </div>

          {/* Filter Tab pills showing ALL 6 tabs inline with flex-wrap & gray borders */}
          <div className="flex items-center gap-1.5 flex-wrap pb-0.5">
            {allTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilterTab(t.id)}
                className={getTabClass(filterTab === t.id)}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>
        </div>

        {/* Waiting Student Cards List */}
        {availableStudents.length > 0 ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2.5">
            {availableStudents.map((student) => {
              const isSelected = selectedIdsSet.has(student.id)
              const currentLevel = student.level || '—'
              const saleNote = getMockSaleNote(student.id, student.notes)

              return (
                <StudentCardItem
                  key={student.id}
                  studentId={student.id}
                  name={student.name}
                  code={student.id}
                  level={currentLevel}
                  isSelected={isSelected}
                  saleNote={saleNote}
                  onRemove={() => onRemoveStudent(student.id)}
                  onAdd={() =>
                    onAddStudent({
                      id: student.id,
                      name: student.name,
                      code: student.id,
                      status: student.status,
                    })
                  }
                  isSelectMode={true}
                />
              )
            })}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-muted/5">
            <EmptyState
              title="Không tìm thấy học viên"
              description="Không có học viên khả dụng phù hợp với tìm kiếm hoặc bộ lọc hiện tại."
            />
          </div>
        )}
      </div>

      {/* Confirm dialog ONLY for ALL students removal */}
      <ConfirmDialog
        open={confirmRemoveAll}
        onOpenChange={setConfirmRemoveAll}
        title="Xóa tất cả học viên khỏi lớp"
        description={`Bạn có chắc chắn muốn xóa tất cả ${students.length} học viên khỏi danh sách lớp đang tạo? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa tất cả"
        variant="destructive"
        onConfirm={handleRemoveAllConfirm}
      />
    </div>
  )
}
