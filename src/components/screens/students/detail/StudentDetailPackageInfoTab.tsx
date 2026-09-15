'use client'

import { useMemo, useState } from 'react'
import {
  Pencil,
  BookOpen,
  Building,
  FileText,
  Layers,
  History,
} from 'lucide-react'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'
import type { Student } from '@/mocks/students'
import { ChangeCSStaffPopover, AppAvatar } from '@/components/shared'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { StudentDetailSessionsDialog } from './StudentDetailSessionsDialog'
import { toast } from 'sonner'

const CSM_OPTIONS_BY_BRANCH: Record<string, string[]> = {
  'RinoEdu Nguyễn Tuân': ['CSM Quỳnh Anh', 'CSM Minh Phương', 'CSM Khánh Linh'],
  'RinoEdu Linh Đàm': ['CSM Hoàng Nam', 'CSM Thu Hà', 'CSM Đức Anh'],
  'RinoEdu Cầu Giấy': ['CSM Hải Yến', 'CSM Thùy Trang'],
}

export interface StudentDetailPackageInfoTabProps {
  program: StudentProgram
  student: Student
  onEditLevel: () => void
  onUpdateSessions?: (packageId: string, studiedSessions: number) => void
}

export function StudentDetailPackageInfoTab({
  program,
  student,
  onEditLevel,
  onUpdateSessions,
}: StudentDetailPackageInfoTabProps) {
  const currentBranch = student.branch || 'RinoEdu Nguyễn Tuân'
  const csmOptions = useMemo(() => {
    return CSM_OPTIONS_BY_BRANCH[currentBranch] || ['CSM Quỳnh Anh', 'CSM Minh Phương', 'CSM Hoàng Nam', 'CSM Thu Hà']
  }, [currentBranch])

  const [selectedCsm, setSelectedCsm] = useState<string>(() => csmOptions[0] || 'CSM Quỳnh Anh')
  const [isEditSessionsOpen, setIsEditSessionsOpen] = useState(false)

  const isMathSubject = useMemo(() => {
    if (program.subject === 'math' || student.subject === 'math') return true
    const name = program.name.toLowerCase()
    return name.includes('toán') || name.includes('math')
  }, [program, student])

  const currentPackage = useMemo(() => {
    if (!program.packages || program.packages.length === 0) return null
    if (program.currentClass) {
      const linked = program.packages.find((p) => p.linkedClassCode === program.currentClass?.classCode)
      if (linked) return linked
    }
    const active = program.packages.find((p) => p.status === 'active' && p.remainingSessions > 0)
    if (active) return active
    const anyActive = program.packages.find((p) => p.status === 'active')
    if (anyActive) return anyActive
    return program.packages[0]
  }, [program.packages, program.currentClass])

  const [overrideStudied, setOverrideStudied] = useState<number | null>(null)

  const totalSessionsCount = currentPackage ? currentPackage.totalSessions : (program.totalSessions || 96)
  const baseStudiedSessions = currentPackage
    ? Math.max(0, currentPackage.totalSessions - currentPackage.remainingSessions)
    : (program.studiedSessions || 0)

  const studiedSessionsCount = overrideStudied !== null ? overrideStudied : baseStudiedSessions
  const remainingSessionsCount = Math.max(0, totalSessionsCount - studiedSessionsCount)

  const handleSaveSessions = (newStudied: number) => {
    setOverrideStudied(newStudied)
    if (onUpdateSessions) {
      const targetPkgId = currentPackage?.id || program.packages[0]?.id || 'pkg-1'
      onUpdateSessions(targetPkgId, newStudied)
    }
    toast.success('Cập nhật số buổi học thành công!')
  }

  const pastPackages = useMemo(() => {
    if (!currentPackage || !program.packages) return []
    return program.packages.filter((p) => p.id !== currentPackage.id)
  }, [program.packages, currentPackage])

  const getPackageStatusBadge = (status: StudentPackage['status'], remaining: number) => {
    if (remaining === 0 || status === 'expired') {
      return (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
          Hết hạn
        </span>
      )
    }
    if (status === 'transferred') {
      return (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          Đã chuyển phí
        </span>
      )
    }
    if (status === 'suspended' || status === 'reserved') {
      return (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          Bảo lưu
        </span>
      )
    }
    if (status === 'cancelled') {
      return (
        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          Đã hủy
        </span>
      )
    }
    return (
      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
        Đang học
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-3 text-xs">
      {/* 1. Trình độ học viên theo chương trình */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <BookOpen className="h-3.5 w-3.5 text-primary" /> Trình độ ({program.name})
          </span>
          <button
            type="button"
            onClick={onEditLevel}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1 rounded hover:bg-muted"
            title="Chỉnh sửa trình độ"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Trình độ</div>
            <span className="font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md inline-block">
              {program.level || student.level || 'Toán 1:6'}
            </span>
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Trình độ phụ</div>
            <strong className="text-foreground font-semibold">
              {program.subLevel || student.subLevel || 'A'}
            </strong>
          </div>
          {isMathSubject && (
            <div>
              <div className="text-xs text-muted-foreground font-medium mb-0.5">Khối / Lớp</div>
              <strong className="text-foreground font-semibold">
                {student.schoolClass || 'Lớp 6'}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* 2. Thông tin chương trình: Thời gian & Gói hiện tại */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <Layers className="h-3.5 w-3.5 text-primary" /> Thông tin chương trình
          </span>
          <button
            type="button"
            onClick={() => setIsEditSessionsOpen(true)}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1 rounded hover:bg-muted"
            title="Cập nhật số buổi học"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {/* Thời gian */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-muted-foreground font-medium mb-0.5">Bắt đầu sớm nhất</div>
              <strong className="text-foreground font-semibold font-mono">{program.startDate || '—'}</strong>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium mb-0.5">Kết thúc muộn nhất</div>
              <strong className="text-foreground font-semibold font-mono">{program.endDate || '—'}</strong>
            </div>
          </div>
        </div>

        {/* Gói hiện tại ở cột trái, Số buổi ở cột phải, Icon (n) nếu có nhiều gói */}
        <div className="pt-2 border-t border-border/40">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Cột trái: Gói hiện tại */}
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground font-medium mb-0.5 flex items-center gap-1.5">
                <span>Gói hiện tại</span>
                {pastPackages.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <span
                        role="button"
                        tabIndex={0}
                        className="px-1.5 py-0.2 rounded text-[10.5px] font-medium text-muted-foreground hover:text-foreground border border-border/40 bg-muted/40 hover:bg-muted transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                        title={`Xem danh sách ${pastPackages.length} gói trước đó`}
                      >
                        <History className="h-2.5 w-2.5" />
                        <span>({pastPackages.length})</span>
                      </span>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[340px] p-3 space-y-2 shadow-xl">
                      <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                        <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                          <History className="h-3.5 w-3.5 text-primary" />
                          Các gói trước đó ({pastPackages.length})
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                          {program.name}
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-0.5">
                        {pastPackages.map((pkg) => {
                          const studied = pkg.totalSessions - pkg.remainingSessions
                          return (
                            <div
                              key={pkg.id}
                              className="rounded-lg border border-border/50 bg-muted/20 p-2 space-y-1 text-xs"
                            >
                              <div className="flex items-start justify-between gap-1.5">
                                <span className="font-semibold text-foreground text-xs truncate max-w-[190px]" title={pkg.packageName}>
                                  {pkg.packageName}
                                </span>
                                {getPackageStatusBadge(pkg.status, pkg.remainingSessions)}
                              </div>
                              <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                                <span>
                                  Đã học: <strong className="text-foreground">{studied}/{pkg.totalSessions}</strong> buổi
                                </span>
                                <span>
                                  Còn lại: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{pkg.remainingSessions}</strong> buổi
                                </span>
                              </div>
                              {(pkg.purchaseDate || pkg.endDate) && (
                                <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 pt-0.5 border-t border-border/30">
                                  <span>Mua: {pkg.purchaseDate || '—'}</span>
                                  <span>Hạn: {pkg.endDate || '—'}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <strong className="text-foreground font-semibold truncate block" title={currentPackage?.packageName}>
                {currentPackage?.packageName || '—'}
              </strong>
            </div>

            {/* Cột phải: Số buổi: xx/xx (Còn xx buổi) */}
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground font-medium mb-0.5">Số buổi</div>
              <div className="font-semibold text-foreground text-xs">
                {totalSessionsCount > 0 ? (
                  <>
                    <span className="font-mono text-foreground font-medium">
                      {studiedSessionsCount}/{totalSessionsCount}
                    </span>{' '}
                    <span className="text-[11px] font-normal text-muted-foreground">
                      (Còn <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{remainingSessionsCount}</strong> buổi)
                    </span>
                  </>
                ) : (
                  '—'
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Cơ sở & Phụ trách */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <Building className="h-3.5 w-3.5 text-primary" /> Cơ sở & Phụ trách
          </span>
          <ChangeCSStaffPopover
            currentCSName={selectedCsm}
            branchName={currentBranch}
            onCSChange={(newName) => setSelectedCsm(newName)}
            iconOnly
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Cơ sở</div>
            <strong className="text-foreground font-bold">
              {currentBranch}
            </strong>
          </div>

          <div>
            <div className="text-xs text-muted-foreground font-medium mb-0.5">Phụ trách</div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
              <AppAvatar
                name={selectedCsm}
                size="xs"
                className="h-5 w-5 border border-primary/10 shrink-0"
              />
              <span>{selectedCsm}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Ghi chú */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <FileText className="h-3.5 w-3.5 text-primary" /> Ghi chú
          </span>
        </div>

        <div className="text-xs text-foreground/90 leading-relaxed font-medium bg-muted/30 p-2 rounded-lg">
          {student.notes || 'Học lực khá, hơi nhút nhát, cần giáo viên chú ý gọi phát biểu bài thường xuyên.'}
        </div>
      </div>

      {/* Modal: Cập nhật số buổi học */}
      <StudentDetailSessionsDialog
        open={isEditSessionsOpen}
        onOpenChange={setIsEditSessionsOpen}
        totalSessions={totalSessionsCount}
        initialStudiedSessions={studiedSessionsCount}
        onSave={handleSaveSessions}
      />
    </div>
  )
}
