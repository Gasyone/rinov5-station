'use client'

import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FieldLabel, EmptyState } from '@/components/shared'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { StudentPackage } from './studentDetailTypes'
import { Link as LinkIcon, BookOpen, Pencil, ArrowLeftRight, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { StudentClassAssignmentDialog } from './StudentClassAssignmentDialog'
import type { EnrolledClass } from '@/mocks/students'
import { mockClassRecords } from '@/mocks/classRecords'

interface StudentDetailPackagesProps {
  packages: StudentPackage[]
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  studentClasses?: EnrolledClass[]
  onConfirmAssignment?: (pkgId: string, classItem: { id: string; name: string; startSession?: string }) => void
}

export function StudentDetailPackages({
  packages,
  studentName,
  studentCode,
  studentBranch,
  studentLevel,
  studentClasses = [],
  onConfirmAssignment,
}: StudentDetailPackagesProps) {
  const [prevPackages, setPrevPackages] = useState<StudentPackage[]>(packages)
  const [localPackages, setLocalPackages] = useState<StudentPackage[]>(packages)
  const [filter, setFilter] = useState<'all' | 'unlinked' | 'linked' | 'ended' | 'transferred' | 'cancelled'>('all')

  // Dialog State: Class Assignment
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedPkgToAssign, setSelectedPkgToAssign] = useState<StudentPackage | null>(null)

  // Sync state with props when packages change (e.g. different student loaded)
  if (packages !== prevPackages) {
    setPrevPackages(packages)
    setLocalPackages(packages)
  }

  const filteredPackages = useMemo(() => {
    switch (filter) {
      case 'unlinked':
        return localPackages.filter((p) => !p.linkedClassCode && p.remainingSessions > 0)
      case 'linked':
        return localPackages.filter((p) => !!p.linkedClassCode && p.remainingSessions > 0)
      case 'ended':
        return localPackages.filter((p) => p.remainingSessions === 0 && p.status !== 'transferred' && p.status !== 'cancelled')
      case 'transferred':
        return localPackages.filter((p) => p.status === 'transferred')
      case 'cancelled':
        return localPackages.filter((p) => p.status === 'cancelled')
      default:
        return localPackages
    }
  }, [localPackages, filter])

  // Dialog State: Edit Sessions
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState<StudentPackage | null>(null)
  const [completedInput, setCompletedInput] = useState('')

  // Dialog State: Transfer Fee
  const [transferOpen, setTransferOpen] = useState(false)
  const [sourcePkg, setSourcePkg] = useState<StudentPackage | null>(null)
  const [targetPkgId, setTargetPkgId] = useState('')
  const [transferAmountInput, setTransferAmountInput] = useState('')

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  // Calculate remaining value of a package based on remaining sessions ratio
  const getRemainingValue = (pkg: StudentPackage) => {
    if (pkg.totalSessions === 0) return 0
    return Math.round((pkg.price * pkg.remainingSessions) / pkg.totalSessions)
  }

  // Open Edit Sessions Dialog
  const handleOpenEditSessions = (pkg: StudentPackage) => {
    setSelectedPkg(pkg)
    const completed = pkg.totalSessions - pkg.remainingSessions
    setCompletedInput(completed.toString())
    setEditOpen(true)
  }

  // Submit Edit Sessions
  const handleSubmitSessions = () => {
    if (!selectedPkg) return
    const completedNum = parseInt(completedInput, 10)

    if (isNaN(completedNum) || completedNum < 0 || completedNum > selectedPkg.totalSessions) {
      toast.error(`Số buổi đã học phải nằm trong khoảng từ 0 đến ${selectedPkg.totalSessions}.`)
      return
    }

    setLocalPackages((prev) =>
      prev.map((p) => {
        if (p.id === selectedPkg.id) {
          return {
            ...p,
            remainingSessions: p.totalSessions - completedNum,
          }
        }
        return p
      })
    )

    toast.success(`Cập nhật số buổi đã học cho gói "${selectedPkg.packageName}" thành công!`)
    setEditOpen(false)
    setSelectedPkg(null)
  }

  // Open Transfer Fee Dialog
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleOpenTransfer = (pkg: StudentPackage) => {
    setSourcePkg(pkg)
    setTargetPkgId('')
    const remainingValue = getRemainingValue(pkg)
    setTransferAmountInput(remainingValue.toString())
    setTransferOpen(true)
  }

  // Submit Transfer Fee
  const handleSubmitTransfer = () => {
    if (!sourcePkg) return
    if (!targetPkgId) {
      toast.error('Vui lòng chọn gói học nhận phí chuyển khoản.')
      return
    }

    const amountNum = parseInt(transferAmountInput, 10)
    const remainingValue = getRemainingValue(sourcePkg)

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Số tiền chuyển phí phải lớn hơn 0.')
      return
    }

    if (amountNum > remainingValue) {
      toast.error(`Số tiền chuyển phí không được vượt quá giá trị còn lại (${formatCurrency(remainingValue)}).`)
      return
    }

    const targetPkg = localPackages.find((p) => p.id === targetPkgId)
    if (!targetPkg) return

    setLocalPackages((prev) =>
      prev.map((p) => {
        if (p.id === sourcePkg.id) {
          // Adjust price downward by transfer amount
          const newPrice = Math.max(0, p.price - amountNum)
          // Also proportionally adjust sessions or keep them, let's keep them and just transfer price for simple accounting.
          return {
            ...p,
            price: newPrice,
          }
        }
        if (p.id === targetPkgId) {
          // Adjust price upward
          return {
            ...p,
            price: p.price + amountNum,
          }
        }
        return p
      })
    )

    toast.success(`Chuyển ${formatCurrency(amountNum)} từ gói "${sourcePkg.packageName}" sang gói "${targetPkg.packageName}" thành công!`)
    setTransferOpen(false)
    setSourcePkg(null)
  }

  const handleOpenAssignClass = (pkg: StudentPackage) => {
    setSelectedPkgToAssign(pkg)
    setAssignOpen(true)
  }

  const handleConfirmAssignment = (classItem: { id: string; name: string; startSession?: string }) => {
    if (!selectedPkgToAssign) return

    if (onConfirmAssignment) {
      onConfirmAssignment(selectedPkgToAssign.id, classItem)
    } else {
      const foundClass = mockClassRecords.find((c) => c.id === classItem.id || c.code === classItem.id)
      const assignedClassCode = foundClass?.code || classItem.id
      setLocalPackages((prev) =>
        prev.map((p) => {
          if (p.id === selectedPkgToAssign.id) {
            return {
              ...p,
              linkedClassCode: assignedClassCode,
              linkedClassName: classItem.name,
              startSessionDate: classItem.startSession,
            }
          }
          return p
        })
      )

      const startText = classItem.startSession ? ` (Bắt đầu từ: ${classItem.startSession})` : ''
      toast.success(`Ghép lớp "${classItem.name}" thành công${startText} cho học viên "${studentName}"!`)
    }

    setAssignOpen(false)
    setSelectedPkgToAssign(null)
  }

  return (
    <div className="w-full pt-0 space-y-4">
      {/* Packages tab filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b mb-3 select-none">
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { value: 'all', label: 'Tất cả' },
              { value: 'unlinked', label: 'Chưa ghép lớp' },
              { value: 'linked', label: 'Đã ghép lớp' },
              { value: 'ended', label: 'Hết buổi' },
              { value: 'transferred', label: 'Chuyển phí' },
              { value: 'cancelled', label: 'Gói hủy' }
            ] as const
          ).map((item) => {
            const getCount = () => {
              if (item.value === 'all') return localPackages.length
              if (item.value === 'unlinked') return localPackages.filter((p) => !p.linkedClassCode && p.remainingSessions > 0).length
              if (item.value === 'linked') return localPackages.filter((p) => !!p.linkedClassCode && p.remainingSessions > 0).length
              if (item.value === 'ended') return localPackages.filter((p) => p.remainingSessions === 0 && p.status !== 'transferred' && p.status !== 'cancelled').length
              if (item.value === 'transferred') return localPackages.filter((p) => p.status === 'transferred').length
              if (item.value === 'cancelled') return localPackages.filter((p) => p.status === 'cancelled').length
              return 0
            }
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === item.value 
                    ? 'bg-primary text-primary-foreground shadow-xs' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {item.label} ({getCount()})
              </button>
            )
          })}
        </div>
      </div>

      {filteredPackages.length === 0 ? (
        <div className="py-8">
          <EmptyState
            title="Không tìm thấy gói học"
            description="Không có gói học nào phù hợp với bộ lọc đang chọn."
            className="py-12"
          />
        </div>
      ) : (
        <Table containerClassName="w-full">
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="w-[30%]">Tên gói học</TableHead>
              <TableHead className="w-[18%]">Số buổi học</TableHead>
              <TableHead className="w-[17%]">Ngày mua</TableHead>
              <TableHead className="w-[20%]">Lớp liên kết</TableHead>
              <TableHead className="w-[15%]">Buổi bắt đầu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.map((pkg) => (
            <TableRow key={pkg.id} className="hover:bg-muted/20 group">
              <TableCell className="font-semibold text-foreground text-xs py-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="h-4 w-4 text-primary/70 shrink-0" />
                      <span className="truncate font-semibold text-foreground text-xs" title={pkg.packageName}>{pkg.packageName}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono pl-6">{pkg.id}</span>
                  </div>
                  {/* Action Buttons visible on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      title="Cập nhật số buổi học"
                      onClick={() => handleOpenEditSessions(pkg)}
                      className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      title="Chuyển phí học viên (Chưa phát triển)"
                      onClick={() => toast.info('Tính năng chuyển phí đang được phát triển.')}
                      className="h-6 w-6 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 rounded-md"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5" />
                    </Button>
                    {!pkg.linkedClassCode && (
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        title="Ghép lớp cho học viên"
                        onClick={() => handleOpenAssignClass(pkg)}
                        className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-xs font-semibold text-foreground">
                {pkg.totalSessions - pkg.remainingSessions} / {pkg.totalSessions} buổi
                <div className="text-[10px] text-muted-foreground font-normal">
                  Còn lại: {pkg.remainingSessions} buổi
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(pkg.purchaseDate).toLocaleDateString('vi-VN')}
              </TableCell>
              <TableCell className="py-3.5">
                {pkg.linkedClassCode ? (
                  <div className="flex flex-col gap-0.5">
                    <Badge variant="secondary" className="font-semibold text-[10px] w-fit bg-primary/10 text-primary border-transparent">
                      {pkg.linkedClassName}
                    </Badge>
                    <span className="text-[9px] font-mono text-muted-foreground font-semibold flex items-center gap-1">
                      <LinkIcon className="h-2.5 w-2.5 shrink-0" /> {pkg.linkedClassCode}
                    </span>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-[9px] font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                    Chưa gắn lớp / Chờ xếp
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-3.5 text-xs text-muted-foreground">
                {pkg.startSessionDate ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-foreground text-[10px]">
                      {pkg.startSessionDate.split(' (')[0]}
                    </span>
                    <span className="text-[9px] text-muted-foreground truncate max-w-[120px]" title={pkg.startSessionDate.split(' (')[1]?.replace(')', '')}>
                      {pkg.startSessionDate.split(' (')[1]?.replace(')', '') || ''}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground/50">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog 1: Cập nhật số buổi học */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật buổi học</DialogTitle>
          </DialogHeader>
          {selectedPkg && (
            <div className="grid gap-4 py-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Gói học: </span>
                <span className="font-bold text-foreground">{selectedPkg.packageName}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldLabel label="Tổng số buổi">
                  <Input
                    type="text"
                    disabled
                    value={`${selectedPkg.totalSessions} buổi`}
                    className="bg-muted text-muted-foreground"
                  />
                </FieldLabel>
                <FieldLabel label="Số buổi đã học" required>
                  <Input
                    type="number"
                    min={0}
                    max={selectedPkg.totalSessions}
                    value={completedInput}
                    onChange={(e) => setCompletedInput(e.target.value)}
                  />
                </FieldLabel>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitSessions}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog 2: Chuyển phí học viên */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chuyển phí học viên</DialogTitle>
          </DialogHeader>
          {sourcePkg && (
            <div className="grid gap-4 py-4">
              <div className="text-xs space-y-1">
                <div>
                  <span className="text-muted-foreground">Gói chuyển đi: </span>
                  <span className="font-bold text-foreground">{sourcePkg.packageName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Giá trị còn lại có thể chuyển: </span>
                  <span className="font-bold text-emerald-600">{formatCurrency(getRemainingValue(sourcePkg))}</span>
                </div>
              </div>

              {localPackages.filter((p) => p.id !== sourcePkg.id).length === 0 ? (
                <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200">
                  Không tìm thấy gói học khác khả dụng của học viên này để nhận phí chuyển nhượng.
                </div>
              ) : (
                <>
                  <FieldLabel label="Gói nhận học phí" required>
                    <Select value={targetPkgId} onValueChange={setTargetPkgId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn gói nhận phí" />
                      </SelectTrigger>
                      <SelectContent>
                        {localPackages
                          .filter((p) => p.id !== sourcePkg.id)
                          .map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.packageName} ({formatCurrency(p.price)})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FieldLabel>

                  <FieldLabel label="Số tiền muốn chuyển" required>
                    <Input
                      type="number"
                      min={1}
                      max={getRemainingValue(sourcePkg)}
                      value={transferAmountInput}
                      onChange={(e) => setTransferAmountInput(e.target.value)}
                    />
                  </FieldLabel>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmitTransfer}
              disabled={localPackages.filter((p) => p.id !== sourcePkg?.id).length === 0}
            >
              Chuyển phí
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog 3: Ghép lớp cho học viên */}
      {assignOpen && selectedPkgToAssign && (
        <StudentClassAssignmentDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          studentName={studentName}
          studentCode={studentCode}
          studentBranch={studentBranch}
          studentLevel={studentLevel}
          packageName={selectedPkgToAssign.packageName}
          pkgRemainingSessions={selectedPkgToAssign.remainingSessions}
          studentClasses={studentClasses}
          onConfirm={handleConfirmAssignment}
          currentClassCode={selectedPkgToAssign.linkedClassCode}
          currentClassName={selectedPkgToAssign.linkedClassName}
        />
      )}
    </div>
  )
}
