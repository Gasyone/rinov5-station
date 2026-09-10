'use client'

import { useMemo, useState } from 'react'
import {
  CheckSquare,
  GraduationCap,
  RotateCcw,
  Search,
  Square,
  Users,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FieldLabel } from '@/components/shared'
import { InlineSelect, SYSTEM_BRANCHES } from '@/components/controls'
import { mockStudents, type Student } from '@/mocks/students'
import { mockClasses } from '@/mocks/classes'
import { maskPhoneNumber } from './orderFulfillmentHelpers'
import { cn } from '@/lib/utils'

export interface SelectedStudentItem {
  id: string
  name: string
  enrolledClass?: string
  parentName?: string
  parentPhone?: string
  phone?: string
  branch?: string
}

interface OrderFulfillmentStudentPickerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedStudents: SelectedStudentItem[]
  onConfirm: (students: SelectedStudentItem[]) => void
  defaultBranch?: string
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Đang học',
  draft_class: 'Chờ xếp lớp',
  wait_for_assignment: 'Chờ giao lớp',
  pending_transfer: 'Chờ chuyển lớp',
  reserve: 'Bảo lưu',
  session_ended: 'Đã kết thúc',
  trial: 'Học thử',
  pending_payment: 'Chờ đóng phí',
}

export function OrderFulfillmentStudentPickerModal({
  open,
  onOpenChange,
  selectedStudents,
  onConfirm,
  defaultBranch,
}: OrderFulfillmentStudentPickerModalProps) {
  const [search, setSearch] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [selectedBranch, setSelectedBranch] = useState<string>(defaultBranch || 'all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const [prevOpen, setPrevOpen] = useState(open)
  // Map of selected student IDs -> SelectedStudentItem
  const [localMap, setLocalMap] = useState<Map<string, SelectedStudentItem>>(() => {
    const map = new Map<string, SelectedStudentItem>()
    selectedStudents.forEach((s) => map.set(s.id, s))
    return map
  })

  // Sync initial selection whenever dialog opens
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      const map = new Map<string, SelectedStudentItem>()
      selectedStudents.forEach((s) => map.set(s.id, s))
      setLocalMap(map)
      if (defaultBranch && selectedBranch === 'all') {
        setSelectedBranch(defaultBranch)
      }
    }
  }

  // Class options from mockClasses & mockStudents
  const classOptions = useMemo(() => {
    const set = new Set<string>()
    mockClasses.forEach((c) => set.add(c.name))
    mockStudents.forEach((s) => {
      if (s.enrolledClass) set.add(s.enrolledClass)
    })
    const list = Array.from(set).sort()
    return [
      { value: 'all', label: 'Tất cả lớp học' },
      ...list.map((cls) => ({ value: cls, label: `Lớp ${cls}` })),
    ]
  }, [])

  // Branch options
  const branchOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả cơ sở' },
      ...SYSTEM_BRANCHES.map((b) => ({ value: b, label: b })),
    ],
    []
  )

  // Status options
  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'Tất cả trạng thái' },
      { value: 'active', label: 'Đang học' },
      { value: 'draft_class', label: 'Chờ xếp lớp' },
      { value: 'reserve', label: 'Bảo lưu' },
      { value: 'trial', label: 'Học thử' },
    ],
    []
  )

  // Filter students based on criteria
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((s) => {
      if (selectedBranch !== 'all' && s.branch !== selectedBranch) return false
      if (selectedClass !== 'all' && s.enrolledClass !== selectedClass) return false
      if (selectedStatus !== 'all' && s.status !== selectedStatus) return false

      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchName = s.name.toLowerCase().includes(q)
        const matchId = s.id.toLowerCase().includes(q)
        const matchParent = s.parentName?.toLowerCase().includes(q)
        const matchPhone =
          (s.parentPhone && s.parentPhone.includes(q)) ||
          (s.phone && s.phone.includes(q))
        if (!matchName && !matchId && !matchParent && !matchPhone) return false
      }
      return true
    })
  }, [search, selectedBranch, selectedClass, selectedStatus])

  // Is all visible students selected?
  const isAllVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => localMap.has(s.id))

  const handleToggleStudent = (student: Student) => {
    setLocalMap((prev) => {
      const next = new Map(prev)
      if (next.has(student.id)) {
        next.delete(student.id)
      } else {
        next.set(student.id, {
          id: student.id,
          name: student.name,
          enrolledClass: student.enrolledClass,
          parentName: student.parentName,
          parentPhone: student.parentPhone,
          phone: student.phone,
          branch: student.branch,
        })
      }
      return next
    })
  }

  const handleSelectAllVisible = () => {
    setLocalMap((prev) => {
      const next = new Map(prev)
      if (isAllVisibleSelected) {
        // Unselect all visible
        filteredStudents.forEach((s) => next.delete(s.id))
      } else {
        // Select all visible
        filteredStudents.forEach((s) =>
          next.set(s.id, {
            id: s.id,
            name: s.name,
            enrolledClass: s.enrolledClass,
            parentName: studentRecord(s).parentName,
            parentPhone: studentRecord(s).parentPhone,
            phone: s.phone,
            branch: s.branch,
          })
        )
      }
      return next
    })
  }

  function studentRecord(s: Student) {
    return {
      parentName: s.parentName,
      parentPhone: s.parentPhone,
    }
  }

  const handleClearAllSelected = () => {
    setLocalMap(new Map())
  }

  const handleConfirm = () => {
    const list = Array.from(localMap.values())
    onConfirm(list)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] flex flex-col p-5 text-xs text-foreground">
        <DialogHeader className="pr-6 pb-2 border-b space-y-1 shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-primary">
            <Users className="h-5 w-5 text-primary" />
            <span>Chọn học viên nhận quà & vật phẩm</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Lọc theo lớp học, trạng thái học viên hoặc tìm kiếm theo tên/SĐT để đưa vào danh sách phát quà.
          </DialogDescription>
        </DialogHeader>

        {/* BỘ LỌC TÌM KIẾM */}
        <div className="space-y-2 py-2 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div className="sm:col-span-1">
              <FieldLabel label="Lớp học">
                <InlineSelect
                  value={selectedClass}
                  options={classOptions}
                  onValueChange={setSelectedClass}
                  ariaLabel="Chọn lớp học"
                />
              </FieldLabel>
            </div>

            <div className="sm:col-span-1">
              <FieldLabel label="Cơ sở">
                <InlineSelect
                  value={selectedBranch}
                  options={branchOptions}
                  onValueChange={setSelectedBranch}
                  ariaLabel="Chọn cơ sở"
                />
              </FieldLabel>
            </div>

            <div className="sm:col-span-1">
              <FieldLabel label="Trạng thái HV">
                <InlineSelect
                  value={selectedStatus}
                  options={statusOptions}
                  onValueChange={setSelectedStatus}
                  ariaLabel="Chọn trạng thái"
                />
              </FieldLabel>
            </div>

            <div className="sm:col-span-1">
              <FieldLabel label="Tìm kiếm">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tên, mã HV, SĐT..."
                    className="h-8 pl-8 text-xs"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </FieldLabel>
            </div>
          </div>

          {/* THANH HÀNH ĐỘNG NHANH */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span>
                Tìm thấy <strong className="text-foreground">{filteredStudents.length}</strong> học viên phù hợp
              </span>
              {selectedClass !== 'all' && (
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                  Lớp: {selectedClass}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2 gap-1 cursor-pointer"
                onClick={handleSelectAllVisible}
                disabled={filteredStudents.length === 0}
              >
                {isAllVisibleSelected ? (
                  <>
                    <Square className="h-3 w-3 text-muted-foreground" />
                    <span>Bỏ chọn trang này</span>
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-3 w-3 text-primary" />
                    <span>Chọn tất cả {filteredStudents.length} bạn</span>
                  </>
                )}
              </Button>

              {localMap.size > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-[11px] px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 gap-1 cursor-pointer"
                  onClick={handleClearAllSelected}
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Bỏ chọn hết</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* BẢNG DANH SÁCH HỌC VIÊN */}
        <div className="flex-1 min-h-0 overflow-y-auto border rounded-md">
          <Table className="w-full text-xs">
            <TableHeader className="sticky top-0 bg-muted/70 backdrop-blur z-10">
              <TableRow>
                <TableHead className="w-[40px] px-3">
                  <Checkbox
                    checked={isAllVisibleSelected}
                    onCheckedChange={handleSelectAllVisible}
                    aria-label="Chọn tất cả học viên hiển thị"
                  />
                </TableHead>
                <TableHead className="w-[28%] min-w-[160px]">Học viên</TableHead>
                <TableHead className="w-[18%] min-w-[110px]">Lớp đang học</TableHead>
                <TableHead className="w-[24%] min-w-[140px]">Phụ huynh liên hệ</TableHead>
                <TableHead className="w-[18%] min-w-[110px]">Cơ sở</TableHead>
                <TableHead className="w-[12%] min-w-[80px]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs">
                    Không tìm thấy học viên nào phù hợp bộ lọc đã chọn.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((st) => {
                  const isChecked = localMap.has(st.id)
                  const displayPhone = st.parentPhone || st.phone || ''
                  return (
                    <TableRow
                      key={st.id}
                      className={cn(
                        isChecked
                          ? 'bg-primary/5 dark:bg-primary/10'
                          : 'hover:bg-muted/40 cursor-pointer'
                      )}
                      onClick={() => handleToggleStudent(st)}
                    >
                      <TableCell className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleStudent(st)}
                          aria-label={`Chọn học viên ${st.name}`}
                        />
                      </TableCell>
                      <TableCell className="py-2 font-medium">
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold">{st.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Mã: {st.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2">
                        {st.enrolledClass ? (
                          <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal gap-1">
                            <GraduationCap className="h-3 w-3 text-primary" />
                            <span>{st.enrolledClass}</span>
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex flex-col text-[11px]">
                          <span className="text-foreground font-medium">
                            {st.parentName || 'Phụ huynh'}
                          </span>
                          <span className="text-muted-foreground font-mono text-[10px]">
                            {maskPhoneNumber(displayPhone)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 text-[11px] text-muted-foreground truncate max-w-[120px]">
                        {st.branch || '—'}
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            'text-[10px] py-0 px-1.5 font-normal',
                            st.status === 'active' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                            st.status === 'reserve' && 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          )}
                        >
                          {STATUS_LABELS[st.status] || st.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* FOOTER */}
        <DialogFooter className="pt-3 border-t flex-row items-center justify-between sm:justify-between shrink-0">
          <div className="text-xs text-foreground">
            Đã chọn: <strong className="text-primary text-sm font-bold">{localMap.size}</strong> học viên
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 cursor-pointer"
              disabled={localMap.size === 0}
              onClick={handleConfirm}
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span>Xác nhận chọn ({localMap.size} học viên)</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
