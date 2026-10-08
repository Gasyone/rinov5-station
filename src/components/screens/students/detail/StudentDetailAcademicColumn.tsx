'use client'

import { useState } from 'react'
import {
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentProgram, StudentPackage } from './studentDetailTypes'
import type { EnrolledClass } from '@/mocks/students'
import { ClassesDetailDialog } from '@/components/screens/classes/detail/ClassesDetailDialog'
import { mockClassRecords, type ClassRecord } from '@/mocks/classRecords'
import { LeaveReserveDetailDialog } from '@/components/screens/leave-reserve/LeaveReserveDetailDialog'
import { mockLeaveReserveRequests, type LeaveReserveRequest } from '@/mocks/leaveReserve'
import { SessionDetailDialog } from '@/components/screens/calendar/SessionDetailDialog'
import { OrderDetailDialog } from '@/components/screens/orders/OrderDetailDialog'
import { mockOrders, type Order } from '@/mocks/orders'
import type { ClassSession } from '@/mocks/calendarSchedule'
import { StudentDetailRenewalSection } from './StudentDetailRenewalSection'
import { StudentEnrolledClassCard } from './StudentEnrolledClassCard'
import { StudentDetailPlacementStatusBanner } from './StudentDetailPlacementStatusBanner'

export interface StudentDetailAcademicColumnProps {
  program: StudentProgram
  studentName: string
  studentCode: string
  studentBranch: string
  studentLevel?: string
  activeDeductingPackage?: StudentPackage | null
  nextQueuedPackage?: StudentPackage | null
  onOpenAssignClass: (packageId?: string) => void
  onLeaveClass?: () => void
  onReserveClass?: () => void
  onDropClass?: (classCode: string) => void
  onOpenRenewalDetail?: () => void
  onOpenEarlyReturn?: () => void
}

export function StudentDetailAcademicColumn({
  program,
  studentName,
  studentCode,
  studentBranch,
  activeDeductingPackage,
  onOpenAssignClass,
  onLeaveClass,
  onReserveClass,
  onDropClass,
  onOpenRenewalDetail,
  onOpenEarlyReturn,
}: StudentDetailAcademicColumnProps) {
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true)
  const [selectedClassRecord, setSelectedClassRecord] = useState<ClassRecord | null>(null)
  const [isClassDetailOpen, setIsClassDetailOpen] = useState(false)
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveReserveRequest | null>(null)
  const [isLeaveReserveOpen, setIsLeaveReserveOpen] = useState(false)
  const [selectedSessionForModal, setSelectedSessionForModal] = useState<ClassSession | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const handleOpenOrderDetail = (orderNo: string) => {
    const found =
      mockOrders.find((o) => o.orderNo === orderNo || o.id === orderNo) ||
      mockOrders[0]
    setSelectedOrder(found)
  }

  const currentClass: EnrolledClass | null = program.currentClass

  const currentClassRecord: ClassRecord | null = currentClass
    ? mockClassRecords.find((c) => c.code.toLowerCase() === currentClass.classCode.toLowerCase()) || null
    : null

  const handleOpenClassDetail = (classCode: string) => {
    const found =
      mockClassRecords.find((c) => c.code.toLowerCase() === classCode.toLowerCase()) ||
      (currentClass?.classCode.toLowerCase() === classCode.toLowerCase() && currentClassRecord
        ? currentClassRecord
        : null)

    if (found) {
      setSelectedClassRecord(found)
      setIsClassDetailOpen(true)
      return
    }

    const pastMatch = program.pastClasses.find((c) => c.classCode.toLowerCase() === classCode.toLowerCase())
    if (pastMatch) {
      const scheduleSlots = pastMatch.scheduleSlots?.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        date: s.date || '15/01',
        startTime: s.startTime,
        endTime: s.endTime,
        room: pastMatch.room || 'B201',
        teacherName: pastMatch.teacherName || 'GV_HuiLT20',
      })) || []
      const scheduleStr = scheduleSlots.map((s) => `${s.dayOfWeek}: ${s.startTime}-${s.endTime}`).join(', ') || 'Thứ 2, Thứ 5: 17:30 - 19:00'

      setSelectedClassRecord({
        id: pastMatch.classCode,
        code: pastMatch.classCode,
        name: pastMatch.className,
        level: pastMatch.level || 'Toán 1:6',
        subLevel: pastMatch.subLevel,
        branch: pastMatch.branch || studentBranch,
        status: 'huy',
        teacher: pastMatch.teacherName || 'GV_HuiLT20',
        teacherPhone: '0988776655',
        room: pastMatch.room || 'B201',
        schedule: scheduleStr,
        scheduleSlots,
        startDate: pastMatch.startDate || '2024-01-15',
        endDate: pastMatch.endDate || '2024-04-15',
        maxStudents: 6,
        enrolledStudents: 6,
        classRatio: '1:6',
        tuitionFee: 3600000,
      })
      setIsClassDetailOpen(true)
    }
  }

  const handleOpenLeaveRequest = () => {
    const req =
      mockLeaveReserveRequests.find(
        (r) =>
          r.studentCode === studentCode ||
          r.studentName.toLowerCase() === studentName.toLowerCase()
      ) || mockLeaveReserveRequests[0]
    setSelectedLeaveRequest(req)
    setIsLeaveReserveOpen(true)
  }


  return (
    <div className="flex flex-col space-y-2 min-h-0">
      {/* ── 2. THẺ LỚP ĐANG HỌC HIỆN TẠI HOẶC BANNER TRẠNG THÁI / TÁI PHÍ ── */}
      {(() => {
        const status = program.programStatus

        // A. HẾT BUỔI (session_ended) hoặc CÓ KẾT QUẢ TÁI PHÍ (renewalInfo)
        if (
          status === 'session_ended' ||
          Boolean(program.renewalInfo) ||
          (program.remainingSessions === 0 &&
            !['reserve', 'reserved', 'pending_transfer', 'fee_transfer', 'draft_class', 'pending_payment', 'enroll_later', 'awaiting_opening', 'trial'].includes(status))
        ) {
          return (
            <StudentDetailRenewalSection
              program={program}
              onOpenRenewalDetail={onOpenRenewalDetail}
              onOpenOrderDetail={handleOpenOrderDetail}
              onConsultNewPackage={() => onOpenAssignClass()}
            />
          )
        }

        // B. ĐANG HỌC (active) VÀ CÓ LỚP HIỆN TẠI
        if (status === 'active' && currentClass) {
          return (
            <StudentEnrolledClassCard
              cls={currentClass}
              classRecord={currentClassRecord}
              studentBranch={studentBranch}
              studentLevel={program.level}
              isPast={false}
              onOpenClassDetail={handleOpenClassDetail}
              onOpenAssignClass={() => onOpenAssignClass(activeDeductingPackage?.id)}
              onLeaveClass={onLeaveClass}
              onReserveClass={onReserveClass}
              onDropClass={onDropClass}
              onSelectSession={(sess) => setSelectedSessionForModal(sess)}
            />
          )
        }

        // C. CÁC TRẠNG THÁI VÒNG ĐỜI / LỌC NHANH:
        // Bảo lưu, Chờ chuyển lớp, Chuyển phí, Lớp nháp, Chờ thanh toán, Hẹn xếp sau, Chờ khai giảng, Học thử, Chờ xếp lớp
        return (
          <div className="space-y-2">
            <StudentDetailPlacementStatusBanner
              program={program}
              onOpenAssignClass={() => onOpenAssignClass(activeDeductingPackage?.id)}
              onOpenLeaveRequest={handleOpenLeaveRequest}
              onOpenEarlyReturn={onOpenEarlyReturn}
              onOpenOrderDetail={handleOpenOrderDetail}
            />
            {/* Nếu học viên có lớp gắn kèm (VD: Bảo lưu giữ lớp, Lớp nháp, Chờ khai giảng, Học thử có lớp) */}
            {currentClass && (
              <StudentEnrolledClassCard
                cls={currentClass}
                classRecord={currentClassRecord}
                studentBranch={studentBranch}
                studentLevel={program.level}
                isPast={false}
                onOpenClassDetail={handleOpenClassDetail}
                onOpenAssignClass={() => onOpenAssignClass(activeDeductingPackage?.id)}
                onLeaveClass={onLeaveClass}
                onReserveClass={onReserveClass}
                onDropClass={onDropClass}
                onSelectSession={(sess) => setSelectedSessionForModal(sess)}
              />
            )}
          </div>
        )
      })()}

      {/* ── 3. DÒNG THỜI GIAN LỊCH SỬ CÁC LỚP TRƯỚC ĐÓ (CLASS PLACEMENT HISTORY) ── */}
      <div className="space-y-1 pt-0.5 text-left">
        {/* Nhãn phân khu Lịch sử tách riêng biệt bên ngoài */}
        <div className="flex items-center justify-between px-0.5">
          <span className="text-xs font-normal text-muted-foreground">
            Lịch sử các lớp trước đó ({program.pastClasses.length})
          </span>
          {program.pastClasses.length > 0 && (
            <button
              type="button"
              onClick={() => setIsHistoryExpanded((prev) => !prev)}
              className="text-xs font-normal text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors select-none"
            >
              <span>{isHistoryExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", isHistoryExpanded && "rotate-180")} />
            </button>
          )}
        </div>

        {/* Danh sách các cụm lớp riêng biệt */}
        {isHistoryExpanded && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            {program.pastClasses.length > 0 ? (
              program.pastClasses.map((cls, idx) => (
                <StudentEnrolledClassCard
                  key={cls.classCode || idx}
                  cls={cls}
                  studentBranch={studentBranch}
                  studentLevel={cls.level || program.level}
                  isPast={true}
                  defaultExpanded={idx === 0}
                  onOpenClassDetail={handleOpenClassDetail}
                  onSelectSession={(sess) => setSelectedSessionForModal(sess)}
                />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 py-2.5 px-3 text-center text-xs text-muted-foreground italic">
                Chưa có lịch sử lớp học trước đó trong lộ trình này.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dialog: Chi tiết lớp học */}
      <ClassesDetailDialog
        cls={selectedClassRecord}
        open={isClassDetailOpen}
        onOpenChange={setIsClassDetailOpen}
        initialTab="overview"
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

      {/* Dialog: Chi tiết buổi học (Tái sử dụng modal buổi học đã có) */}
      <SessionDetailDialog
        open={Boolean(selectedSessionForModal)}
        onOpenChange={(open) => !open && setSelectedSessionForModal(null)}
        session={selectedSessionForModal}
      />

      {/* Dialog: Chi tiết đơn hàng tái phí liên kết */}
      {selectedOrder && (
        <OrderDetailDialog
          order={selectedOrder}
          onOpenChange={(open) => !open && setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
