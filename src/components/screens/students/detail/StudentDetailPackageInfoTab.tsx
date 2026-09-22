'use client'

import { useMemo, useState } from 'react'
import {
  Pencil,
  BookOpen,
  Building,
  FileText,
  Clock,
} from 'lucide-react'
import type { StudentProgram } from './studentDetailTypes'
import type { Student } from '@/mocks/students'
import { ChangeCSStaffPopover, AppAvatar } from '@/components/shared'
import { StudentDetailSessionsDialog } from './StudentDetailSessionsDialog'
import { getStudentAvailableSlots } from './studentDetailHelpers'
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

  const availableSlots = useMemo(() => {
    return getStudentAvailableSlots(student)
  }, [student])

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

  const handleSaveSessions = (newStudied: number) => {
    setOverrideStudied(newStudied)
    if (onUpdateSessions) {
      const targetPkgId = currentPackage?.id || program.packages[0]?.id || 'pkg-1'
      onUpdateSessions(targetPkgId, newStudied)
    }
    toast.success('Cập nhật số buổi học thành công!')
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

      {/* 2. Khung giờ học viên có thể học (Khung giờ rảnh phục vụ xếp lớp) */}
      <div className="rounded-xl border border-border/70 bg-card p-3 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between pb-0.5">
          <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5 text-primary" /> Khung giờ học viên rảnh
          </span>
          <span className="text-[10.5px] text-muted-foreground font-medium bg-muted/60 px-1.5 py-0.2 rounded border border-border/30">
            Ưu tiên xếp lịch
          </span>
        </div>

        <div className="space-y-1.5">
          {availableSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-start justify-between gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-xs border border-border/40"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{slot.dayOfWeek}: {slot.timeRange}</span>
                </div>
                {slot.note && (
                  <p className="text-[10.5px] text-muted-foreground pl-3">{slot.note}</p>
                )}
              </div>
            </div>
          ))}
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
