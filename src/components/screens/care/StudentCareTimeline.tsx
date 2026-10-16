'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  parseRecipient,
  parseLogTopic,
  cleanMessageNotes,
  type MergedTimelineItem,
} from './studentCareDetailHelpers'
import { type CareInteractionLog, type StudentCareAlert } from '@/mocks/careAlerts'
import { isCared, getCareNatureAbbrev } from './operationsAlertHelpers'
import { HistoryLogCardItem } from './HistoryLogCardItem'
import { CareJourneyMilestoneCard } from './CareJourneyMilestoneCard'
import type { SimulatedPackage } from './studentCareDetailTypes'
import { getStudentOrderInfo, getRenewalClassification } from './renewal/renewalHelpers'
import {
  type HistoryLogItemData,
  type RoadmapMilestone,
  getRoadmapMilestonesPkg1,
  getRoadmapMilestonesPkg2,
  getRoadmapMilestonesPkg3,
  getRoadmapMilestonesPkg4,
  getPkg2Logs,
  getPkg3Logs,
  getPkg4Logs,
} from './studentCareTimelineMockData'

interface StudentCareTimelineProps {
  student?: StudentCareAlert
  filteredCombinedLogs: MergedTimelineItem[]
  stickyTopOffset?: number
  selectedPackageId?: string
  selectedPackage?: SimulatedPackage | null
  cstpStatus?: string
}

export function StudentCareTimeline({
  student,
  filteredCombinedLogs,
  selectedPackageId = 'pkg-1',
  selectedPackage,
  cstpStatus,
}: StudentCareTimelineProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'roadmap'>('history')
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all')

  const effectiveRenewalStatus = cstpStatus || (student ? getRenewalClassification(student) : 'moi')
  const isRenewalFailed = effectiveRenewalStatus === 'that_bai'
  const isRenewalPaid = effectiveRenewalStatus === 'tai_phi'

  const isMath = useMemo(() => {
    if (selectedPackage?.packageName) {
      return selectedPackage.packageName.toLowerCase().includes('toán')
    }
    return student?.subject === 'Toán tư duy'
  }, [selectedPackage, student])

  const subjectName = isMath ? 'Toán tư duy' : 'Tiếng Anh'

  // 1. Nhật ký chăm sóc theo từng Gói học (Package-specific interaction logs)
  const pkg1Logs: HistoryLogItemData[] = useMemo(() => {
    const list: HistoryLogItemData[] = []
    const studentOrder = student ? getStudentOrderInfo(student) : null

    filteredCombinedLogs.forEach((item) => {
      if (item.type !== 'log') return
      const log = item.data as CareInteractionLog
      if (!log || !log.notes) return

      const topic = parseLogTopic(log.notes)
      const rec = parseRecipient(log.notes, 'Phụ huynh')
      const cleanNotes = cleanMessageNotes(log.notes)
      const isGV =
        log.staffName?.toLowerCase().includes('hoàng thị mai') ||
        log.staffName?.toLowerCase().includes('gv')

      const isCstpLog =
        topic === 'CSTP' ||
        (log.notes || '').includes('[CSTP]') ||
        (log.notes || '').toLowerCase().includes('tái phí')
      const isFailedCstp =
        isCstpLog &&
        ((log.notes || '').toLowerCase().includes('thất bại') ||
          (log.notes || '').includes('dừng học') ||
          Boolean((log.notes || '').match(/\[Lý do:/i)))

      let effectiveLinkedOrder = log.linkedOrder
      if (!effectiveLinkedOrder && isCstpLog && !isFailedCstp) {
        if (student?.linkedOrder) {
          const amt = student.linkedOrder.totalPaidAmount || student.linkedOrder.finalAmount || 0
          effectiveLinkedOrder = {
            orderCode: student.linkedOrder.orderCode,
            packageName: student.linkedOrder.packageName,
            totalPaidAmount: amt,
            amountText: amt > 0 ? `${amt.toLocaleString('vi-VN')}đ` : undefined,
            paymentStatus: student.linkedOrder.paymentStatus || studentOrder?.paymentStatus || 'paid',
            paymentStatusText: studentOrder?.paymentStatusLabel || 'Đã thanh toán',
          }
        } else if (studentOrder?.orderCode) {
          effectiveLinkedOrder = {
            orderCode: studentOrder.orderCode,
            packageName: studentOrder.packageName,
            amountText: studentOrder.packageAmount,
            paymentStatus: studentOrder.paymentStatus,
            paymentStatusText: studentOrder.paymentStatusLabel,
          }
        }
      }

      list.push({
        log,
        topic: isCstpLog ? 'CGH' : topic ? getCareNatureAbbrev(topic) : topic,
        recipient: rec,
        cleanNotes,
        staffRole: isGV ? 'GV' : 'CS',
        staffName: log.staffName,
        date: log.date,
        channel: log.callConfirmation,
        subject: student?.subject || subjectName,
        linkedOrder: effectiveLinkedOrder,
      })
    })

    // Bổ sung dữ liệu mẫu cho Thẻ tái phí (Đơn hàng liên kết tái tục thành công)
    const hasSuccessfulCstpLog = list.some(
      (i) =>
        (i.topic === 'CGH' || i.topic === 'CSTP') &&
        Boolean(i.linkedOrder?.orderCode) &&
        !i.cleanNotes.toLowerCase().includes('thất bại')
    )
    if (!hasSuccessfulCstpLog) {
      const orderCode = student?.linkedOrder?.orderCode || studentOrder?.orderCode || 'OD832001'
      const packageName =
        student?.linkedOrder?.packageName ||
        studentOrder?.packageName ||
        (isMath ? '[MATH_ARCH] Toán Tư Duy Archimedes G2' : '[IE_MOVERS] Tiếng Anh SuperKids Level 4')
      const amtText = student?.linkedOrder?.totalPaidAmount
        ? `${student.linkedOrder.totalPaidAmount.toLocaleString('vi-VN')}đ`
        : studentOrder?.packageAmount || '18.500.000đ'

      list.unshift({
        log: {
          id: `cstp-auto-${student?.studentId || 'sample-success'}`,
          date: '2026-08-15 10:30',
          staffName: student?.csStaff || 'Lê Thị Lan (CS)',
          callConfirmation: 'Đã gọi',
          audioDuration: '02:30',
          notes: `[CGH] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] Đã liên hệ trao đổi lộ trình học tập tiếp theo. Phụ huynh rất hài lòng và đã đồng ý đăng ký gói học mới, hoàn tất thanh toán đơn hàng ${orderCode}.`,
          parentOpinion: 'Lịch học cuối tuần này tiện quá, mẹ vừa chuyển khoản học phí rồi nhé, cô xếp cho con vào lớp cô Mai dạy nhé.',
          linkedOrder: {
            orderCode,
            packageName,
            amountText: amtText,
            paymentStatus: 'paid',
            paymentStatusText: 'Đã thanh toán',
          },
        },
        topic: 'CGH',
        recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
        cleanNotes: `Đã liên hệ trao đổi lộ trình học tập tiếp theo. Phụ huynh rất hài lòng và đã đồng ý đăng ký gói học mới, hoàn tất thanh toán đơn hàng ${orderCode}.`,
        staffRole: 'CS',
        staffName: student?.csStaff || 'Lê Thị Lan',
        date: '2026-08-15 10:30',
        channel: 'Cuộc gọi',
        subject: student?.subject || subjectName,
        linkedOrder: {
          orderCode,
          packageName,
          amountText: amtText,
          paymentStatus: 'paid',
          paymentStatusText: 'Đã thanh toán',
        },
      })
    }

    // Bổ sung dữ liệu mẫu cho Nhãn thất bại (Tái phí đợt 1 thất bại kèm lý do)
    const hasFailedLog = list.some(
      (i) =>
        i.cleanNotes.toLowerCase().includes('thất bại') ||
        i.log.notes?.toLowerCase().includes('thất bại') ||
        Boolean(i.log.notes?.match(/\[Lý do:/i))
    )
    if (!hasFailedLog) {
      list.unshift({
        log: {
          id: `ctp-failed-${student?.studentId || 'sample-fail'}`,
          date: '2026-07-20 15:00',
          staffName: student?.csStaff || 'Lê Thị Lan (CS)',
          callConfirmation: 'Đã gọi',
          audioDuration: '03:15',
          notes:
            '[CGH] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] [Lý do: Trùng lịch học văn hóa / Không thu xếp được lịch] Liên hệ tư vấn tái tục khóa học tiếp theo trước kỳ khai giảng năm học mới. Phụ huynh thông báo con bận lịch học thêm văn hóa ở trường và tạm thời chưa có kế hoạch học thêm ca tối. Đóng ca chăm sóc với kết quả thất bại.',
          parentOpinion:
            'Mẹ cảm ơn cô giáo và trung tâm đã hỗ trợ bé suốt thời gian qua. Đợt này con bận ôn thi chuyển cấp nên gia đình xin phép tạm dừng sau khi kết thúc khóa này.',
        },
        topic: 'CGH',
        recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
        cleanNotes:
          'Liên hệ tư vấn tái tục khóa học tiếp theo trước kỳ khai giảng năm học mới. Phụ huynh thông báo con bận lịch học thêm văn hóa ở trường và tạm thời chưa có kế hoạch học thêm ca tối. Đóng ca chăm sóc với kết quả thất bại.',
        staffRole: 'CS',
        staffName: student?.csStaff || 'Lê Thị Lan',
        date: '2026-07-20 15:00',
        channel: 'Cuộc gọi',
        subject: student?.subject || subjectName,
      })
    }

    return list
  }, [filteredCombinedLogs, student, subjectName, isMath])

  const pkg2Logs = useMemo(() => getPkg2Logs(isMath), [isMath])
  const pkg3Logs = useMemo(() => getPkg3Logs(isMath), [isMath])
  const pkg4Logs = useMemo(() => getPkg4Logs(isMath), [isMath])

  // Filtered logs for current selected package
  const currentPackageLogs = useMemo(() => {
    let rawLogs: HistoryLogItemData[] = []
    if (selectedPackageId === 'pkg-2') {
      rawLogs = pkg2Logs
    } else if (selectedPackageId === 'pkg-3') {
      rawLogs = pkg3Logs
    } else if (selectedPackageId === 'pkg-4') {
      rawLogs = pkg4Logs
    } else {
      rawLogs = pkg1Logs
    }

    return rawLogs.filter((item) => {
      if (staffRoleFilter === 'cskh' && item.staffRole !== 'CS') return false
      if (staffRoleFilter === 'gv' && item.staffRole !== 'GV') return false
      return true
    })
  }, [selectedPackageId, pkg1Logs, pkg2Logs, pkg3Logs, pkg4Logs, staffRoleFilter])

  const isCaredStatus = student ? isCared(student) : false

  // 2. Mốc lộ trình theo từng Gói học (Đầy đủ dữ liệu mẫu cho Thẻ tái phí và Nhãn thất bại)
  const processedRoadmapMilestones = useMemo(() => {
    let milestones: RoadmapMilestone[] = []
    if (selectedPackageId === 'pkg-2') {
      milestones = getRoadmapMilestonesPkg2(isMath, isRenewalFailed, isRenewalPaid, student)
    } else if (selectedPackageId === 'pkg-3') {
      milestones = getRoadmapMilestonesPkg3(isMath)
    } else if (selectedPackageId === 'pkg-4') {
      milestones = getRoadmapMilestonesPkg4()
    } else {
      milestones = getRoadmapMilestonesPkg1(isMath, isRenewalFailed, isRenewalPaid, student)
    }

    return milestones.map((item) => {
      if (isCaredStatus && item.status === 'overdue') {
        return {
          ...item,
          status: 'completed' as const,
        }
      }
      return item
    })
  }, [
    selectedPackageId,
    isMath,
    isRenewalFailed,
    isRenewalPaid,
    student,
    isCaredStatus,
  ])

  const totalHistoryCount = currentPackageLogs.length

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950 rounded-xl border border-border/60 p-2 shadow-2xs text-left">
      {/* Header bar: Lọc Vai trò + Tab buttons */}
      <div 
        className="-mx-2 -mt-2 py-1.5 px-2 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-1.5 mb-1 select-none shrink-0 flex-wrap rounded-t-xl"
      >
        <div className="flex items-center gap-2 text-xs 2xl:text-[13px] flex-wrap">
          {/* Lọc Vai trò phụ trách */}
          <div className="flex items-center gap-1.5">
            <span className="font-normal text-muted-foreground text-xs 2xl:text-[13px]">Lọc:</span>
            <select
              value={staffRoleFilter}
              onChange={(e) => setStaffRoleFilter(e.target.value)}
              className="h-6.5 2xl:h-7 text-xs 2xl:text-[13px] bg-background border border-border rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-primary font-normal text-foreground cursor-pointer"
            >
              <option value="all">Tất cả</option>
              <option value="cskh">CS</option>
              <option value="gv">GV</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setActiveTab('history')}
            className={cn(
              'h-6.5 2xl:h-7.5 text-xs 2xl:text-[13px] px-2.5 2xl:px-3 rounded-md cursor-pointer transition-colors',
              activeTab === 'history'
                ? 'bg-muted text-foreground border border-border font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 font-normal border border-transparent'
            )}
          >
            Lịch sử chăm sóc ({totalHistoryCount})
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setActiveTab('roadmap')}
            className={cn(
              'h-6.5 2xl:h-7.5 text-xs 2xl:text-[13px] px-2.5 2xl:px-3 rounded-md cursor-pointer transition-colors',
              activeTab === 'roadmap'
                ? 'bg-muted text-foreground border border-border font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 font-normal border border-transparent'
            )}
          >
            Mốc chăm sóc
          </Button>
        </div>
      </div>

      <div className="space-y-2 pt-1 pr-0.5">
        {activeTab === 'history' ? (
          <div className="space-y-2 pt-0.5">
            {currentPackageLogs.length === 0 ? (
              <div className="py-6 text-center text-xs 2xl:text-[13px] text-muted-foreground italic">
                Chưa có nhật ký chăm sóc cho gói học này
              </div>
            ) : (
              currentPackageLogs.map((item, idx) => (
                <HistoryLogCardItem
                  key={item.log.id || `pkg-log-${idx}`}
                  log={item.log}
                  topic={item.topic}
                  recipient={item.recipient}
                  cleanNotes={item.cleanNotes}
                  staffRole={item.staffRole}
                  staffName={item.staffName}
                  date={item.date}
                  channel={item.channel}
                  subject={item.subject}
                  linkedOrder={item.linkedOrder}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3 text-xs text-left select-none">
            <div className="space-y-2.5 relative pl-3.5 border-l border-zinc-200 dark:border-zinc-800 ml-2 py-1">
              {processedRoadmapMilestones.map((item: RoadmapMilestone, idx: number) => {
                if (staffRoleFilter === 'cskh' && item.roleOwner !== 'CS PHỤ TRÁCH') return null
                if (staffRoleFilter === 'gv' && item.roleOwner !== 'GV PHỤ TRÁCH') return null

                return (
                  <CareJourneyMilestoneCard
                    key={item.id}
                    item={item}
                    index={idx}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
