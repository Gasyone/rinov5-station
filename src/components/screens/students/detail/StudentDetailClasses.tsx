'use client'

import { useState } from 'react'
import {
  Plus,
  ArrowLeftRight,
  ArrowRightLeft,
  History,
  Snowflake,
  UserX,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, StatusBadge } from '@/components/shared'
import type { EnrolledClass } from '@/mocks/students'
import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { toast } from 'sonner'
import type { StudentProgram } from './studentDetailTypes'
import { StudentDetailClassCard } from './StudentDetailClassCard'
import { StudentDetailRecommendedClasses } from './StudentDetailRecommendedClasses'

export interface StudentDetailClassesProps {
  program: StudentProgram
  studentName: string
  studentCode?: string
  studentBranch: string
  studentLevel?: string
  onChangeClassStatus: (classCode: string, newStatus: EnrolledClass['status']) => void
  onOpenAssignClass: () => void
  onDirectAssign?: (classItem: { id: string; name: string; startSession?: string }) => void
}

export function StudentDetailClasses({
  program,
  studentName,
  studentCode,
  studentBranch,
  studentLevel,
  onChangeClassStatus,
  onOpenAssignClass,
  onDirectAssign,
}: StudentDetailClassesProps) {
  const [selectedClassRecord, setSelectedClassRecord] = useState<ClassRecord | null>(null)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false)
  const [initialTabForDetail, setInitialTabForDetail] = useState<string>('schedule')

  // Modals for Actions
  const [confirmDropOpen, setConfirmDropOpen] = useState(false)
  const [confirmReserveOpen, setConfirmReserveOpen] = useState(false)
  const [isLeaveReserveOpen, setIsLeaveReserveOpen] = useState(false)
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveReserveRequest | null>(null)

  const handleSelectClassRecord = (record: ClassRecord, tab: string = 'schedule') => {
    setSelectedClassRecord(record)
    setInitialTabForDetail(tab)
    setIsClassDetailOpen(true)
  }

  // Recommended classes suitable for this program
  const currentClassCodes = new Set([
    program.currentClass?.classCode?.toLowerCase(),
    ...program.pastClasses.map((c) => c.classCode.toLowerCase()),
  ].filter(Boolean))

  const recommendedClasses = mockClassRecords
    .filter(
      (c) =>
        !currentClassCodes.has(c.code.toLowerCase()) &&
        (c.status === 'mo_chieu_sinh' || c.status === 'cho_khai_giang' || c.status === 'dang_hoc')
    )
    .slice(0, 3)

  const primaryPackage = program.packages.find((p) => p.remainingSessions > 0) || program.packages[0] || null

  const currentClassRecord = program.currentClass
    ? mockClassRecords.find((c) => c.code.toLowerCase() === program.currentClass?.classCode.toLowerCase()) || null
    : null

  return (
    <div className="w-full space-y-5 pt-1">
      {/* ========================================================
          PHẦN 1: LỚP HIỆN TẠI (Theo trạng thái của chương trình)
         ======================================================== */}
      <section className="space-y-2.5">

        {/* --- CASE A: CHƯA GHÉP LỚP (Theo chuẩn màn Chăm sóc) --- */}
        {program.programStatus === 'wait_for_assignment' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-indigo-200/80 bg-indigo-50/40 dark:bg-indigo-950/20 dark:border-indigo-900/40 select-none animate-in fade-in-50 duration-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <UserX className="h-5 w-5" />
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 text-xs sm:text-sm">
                      Học viên chưa ghép lớp
                    </span>
                    <StatusBadge status="wait_for_assignment" label="Chờ xếp lớp" className="text-xs py-0 px-1.5" />
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>
                      Gói đăng ký: <strong className="font-semibold text-foreground">{primaryPackage?.packageName || program.packages[0]?.packageName || 'Gói Tiêu Chuẩn'}</strong>
                    </span>
                    <span className="text-border">•</span>
                    <span>
                      Số buổi khả dụng: <strong className="font-semibold text-indigo-600 dark:text-indigo-400">{program.remainingSessions} buổi</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={onOpenAssignClass}
                className="shrink-0 h-8 px-3.5 text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Ghép lớp ngay</span>
              </Button>
            </div>

            {/* Recommended classes list */}
            <StudentDetailRecommendedClasses
              recommendedClasses={recommendedClasses}
              currentPackage={primaryPackage}
              packages={program.packages}
              onSelectClassRecord={handleSelectClassRecord}
              onOpenAssignClass={onOpenAssignClass}
              onDirectAssign={onDirectAssign}
            />
          </div>
        )}

        {/* --- CASE B: CHUYỂN LỚP / THOÁT LỚP (Theo chuẩn màn Chăm sóc) --- */}
        {program.programStatus === 'dropped' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-sky-200/80 bg-sky-50/40 dark:bg-sky-950/20 dark:border-sky-900/40 select-none animate-in fade-in-50 duration-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 shrink-0">
                  <ArrowRightLeft className="h-5 w-5" />
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sky-900 dark:text-sky-300 text-xs sm:text-sm">
                      Tiến trình chuyển lớp đang diễn ra
                    </span>
                    <StatusBadge status="wait_for_assignment" label="Chờ xếp lớp" className="text-xs py-0 px-1.5" />
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>
                      Lớp nguồn: <strong className="font-semibold text-foreground">{program.transferInfo?.sourceClass || program.droppedClassInfo?.classCode || 'Lớp cũ'}</strong>
                    </span>
                    <span className="text-sky-500">➔</span>
                    <span>
                      Lớp đích: <strong className="font-semibold text-foreground">{program.transferInfo?.targetClass || 'Chưa ghép lớp'}</strong>
                    </span>
                    <span className="text-border">•</span>
                    <span>
                      Số buổi kết chuyển: <strong className="font-semibold text-sky-600 dark:text-sky-400">{program.remainingSessions} buổi</strong>
                    </span>
                  </div>
                </div>
              </div>

              <Button
                type="button"
                size="sm"
                onClick={onOpenAssignClass}
                className="shrink-0 h-8 px-3.5 text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>Chọn lớp đích / Ghép lớp</span>
              </Button>
            </div>

            {/* Recommended classes list */}
            <StudentDetailRecommendedClasses
              recommendedClasses={recommendedClasses}
              currentPackage={primaryPackage}
              packages={program.packages}
              onSelectClassRecord={handleSelectClassRecord}
              onOpenAssignClass={onOpenAssignClass}
              onDirectAssign={onDirectAssign}
            />
          </div>
        )}

        {/* --- CASE C: BẢO LƯU (Theo chuẩn màn Chăm sóc) --- */}
        {program.programStatus === 'reserved' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/40 select-none animate-in fade-in-50 duration-200 text-left space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <Snowflake className="h-4 w-4" />
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-amber-900 dark:text-amber-300 text-xs sm:text-sm">
                      Khóa học đang bảo lưu
                    </span>
                    {program.reservedInfo?.isHoldingClass ? (
                      <StatusBadge status="reserve" label="Bảo lưu giữ lớp" className="text-xs py-0 px-1.5" />
                    ) : (
                      <StatusBadge status="reserve" label="Bảo lưu" className="text-xs py-0 px-1.5" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">
                    Ngày học lại dự kiến: <strong className="font-semibold text-foreground">{program.reservedInfo?.expiryDate || '16/09/2026'}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground pt-1.5 border-t border-amber-200/60 dark:border-amber-900/40">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>
                    Thời gian: <strong className="font-semibold text-foreground">{program.reservedInfo?.startDate || '15/06/2026'} ➔ {program.reservedInfo?.endDate || '15/09/2026'}</strong> ({program.reservedInfo?.duration || '3 tháng'})
                  </span>
                  <span className="text-border">•</span>
                  <span>
                    Số buổi bảo lưu: <strong className="font-semibold text-amber-700 dark:text-amber-300">{program.reservedInfo?.reservedSessions || program.remainingSessions} buổi</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const req = mockLeaveReserveRequests.find(
                        (r) => r.studentCode === studentCode || r.studentName.toLowerCase() === studentName.toLowerCase()
                      ) || mockLeaveReserveRequests[0]
                      setSelectedLeaveRequest(req)
                      setIsLeaveReserveOpen(true)
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Xem đơn bảo lưu</span>
                  </button>

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={onOpenAssignClass}
                    className="h-7 px-3 text-xs font-semibold border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 cursor-pointer shadow-3xs"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
                    <span>Quay lại học / Ghép lớp</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Nếu bảo lưu giữ lớp: hiển thị thẻ lớp học bên dưới */}
            {program.reservedInfo?.isHoldingClass && program.currentClass && (
              <div className="space-y-1 pt-1">
                <div className="text-xs font-semibold text-muted-foreground px-1">
                  Thông tin lớp học đang được giữ chỗ:
                </div>
                <StudentDetailClassCard
                  cls={program.currentClass}
                  classRecord={currentClassRecord}
                  studentLevel={studentLevel}
                  studentBranch={studentBranch}
                  onSelectClassRecord={handleSelectClassRecord}
                  onTransferClass={onOpenAssignClass}
                  onReserveClass={() => setConfirmReserveOpen(true)}
                  onDropClass={() => setConfirmDropOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* --- CASE D: ĐANG HỌC --- */}
        {program.programStatus === 'active' && program.currentClass && (
          <StudentDetailClassCard
            cls={program.currentClass}
            classRecord={currentClassRecord}
            studentLevel={studentLevel}
            studentBranch={studentBranch}
            onSelectClassRecord={handleSelectClassRecord}
            onTransferClass={onOpenAssignClass}
            onReserveClass={() => setConfirmReserveOpen(true)}
            onDropClass={() => setConfirmDropOpen(true)}
          />
        )}
      </section>

      {/* ========================================================
          PHẦN 2: LỊCH SỬ CÁC LỚP TRƯỚC ĐÓ
         ======================================================== */}
      <section className="space-y-2.5 pt-2 border-t border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">Lịch sử các lớp trước đó</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              {program.pastClasses.length}
            </span>
          </div>
        </div>

        {program.pastClasses.length > 0 ? (
          <div className="space-y-2.5">
            {program.pastClasses.map((pastCls) => {
              const pastRecord =
                mockClassRecords.find(
                  (c) => c.code.toLowerCase() === pastCls.classCode.toLowerCase()
                ) || null

              return (
                <StudentDetailClassCard
                  key={pastCls.classCode}
                  cls={pastCls}
                  classRecord={pastRecord}
                  studentBranch={studentBranch}
                  studentLevel={studentLevel}
                  isPast
                />
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/60 p-4 text-center text-xs text-muted-foreground">
            Chưa có lịch sử lớp học trước đó cho chương trình này.
          </div>
        )}
      </section>

      {/* Dialog: Chi tiết lớp học */}
      <ClassesDetailDialog
        cls={selectedClassRecord}
        open={isClassDetailOpen}
        onOpenChange={setIsClassDetailOpen}
        initialTab={initialTabForDetail}
      />

      {/* Modal xác nhận Thôi học / Thoát lớp */}
      <ConfirmDialog
        open={confirmDropOpen}
        onOpenChange={setConfirmDropOpen}
        title="Xác nhận Thoát lớp / Rút khỏi lớp"
        description={`Bạn có chắc chắn muốn duyệt cho học viên ${studentName} thoát khỏi lớp "${program.currentClass?.className}"? Trạng thái của học viên trong chương trình này sẽ chuyển thành Đã thoát lớp và số buổi còn lại sẽ được bảo lưu.`}
        confirmLabel="Xác nhận Thoát lớp"
        variant="destructive"
        onConfirm={() => {
          if (program.currentClass) {
            onChangeClassStatus(program.currentClass.classCode, 'dropped')
            toast.success(`Đã cập nhật trạng thái thôi học lớp ${program.currentClass.className}!`)
          }
          setConfirmDropOpen(false)
        }}
      />

      {/* Modal xác nhận Bảo lưu */}
      <ConfirmDialog
        open={confirmReserveOpen}
        onOpenChange={setConfirmReserveOpen}
        title="Xác nhận Bảo lưu buổi học"
        description={`Bạn có chắc chắn muốn xác nhận Bảo lưu chương trình "${program.name}" cho học viên ${studentName}? Lớp học hiện tại sẽ được tạm dừng và số buổi còn lại (${program.remainingSessions} buổi) được giữ lại.`}
        confirmLabel="Xác nhận Bảo lưu"
        variant="default"
        onConfirm={() => {
          if (program.currentClass) {
            onChangeClassStatus(program.currentClass.classCode, 'paused')
            toast.success(`Đã cập nhật trạng thái bảo lưu chương trình ${program.name}!`)
          }
          setConfirmReserveOpen(false)
        }}
      />

      {/* Dialog: Xem đơn bảo lưu */}
      {selectedLeaveRequest && (
        <LeaveReserveDetailDialog
          open={isLeaveReserveOpen}
          onOpenChange={setIsLeaveReserveOpen}
          request={selectedLeaveRequest}
          readOnly={true}
        />
      )}
    </div>
  )
}
