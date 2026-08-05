'use client'

import React from 'react'
import { FileText, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared'
import { CareConditionConfig } from './careConditionsTypes'

export interface CareConditionExecutionLog {
  id: string
  ticketCode: string
  studentId: string
  studentName: string
  studentPhoneMasked: string
  className: string
  branchName: string
  triggeredAt: string
  assignedRole: string
  assignedStaffName: string
  slaDeadline: string
  slaStatus: 'on_time' | 'warning' | 'overdue'
  slaStatusText: string
  status: 'pending' | 'in_progress' | 'completed'
  statusText: string
  triggerNote: string
}

// Generate realistic execution log data per condition ID
export function getMockExecutionLogs(conditionId: string): CareConditionExecutionLog[] {
  return [
    {
      id: `${conditionId}-LOG-01`,
      ticketCode: 'CS-2026-0801',
      studentId: 'HV-8821',
      studentName: 'Nguyễn Văn An',
      studentPhoneMasked: '091****111',
      className: 'ENG-BEG-01',
      branchName: 'Cơ sở Cầu Giấy',
      triggeredAt: '2026-08-04 04:00',
      assignedRole: 'CS',
      assignedStaffName: 'Nguyễn Thị CS (CS)',
      slaDeadline: '2026-08-05 04:00',
      slaStatus: 'on_time',
      slaStatusText: 'Còn 14 giờ',
      status: 'in_progress',
      statusText: 'Đang xử lý',
      triggerNote: 'Quét tự động định kỳ: Phát sinh điều kiện ngưỡng',
    },
    {
      id: `${conditionId}-LOG-02`,
      ticketCode: 'CS-2026-0795',
      studentId: 'HV-9102',
      studentName: 'Lê Hoàng Minh',
      studentPhoneMasked: '098****345',
      className: 'ENG-BEG-02',
      branchName: 'Cơ sở Đống Đa',
      triggeredAt: '2026-08-03 08:30',
      assignedRole: 'CS + GV',
      assignedStaffName: 'Trần Thị Thu (CS) & Lê Văn B (GV)',
      slaDeadline: '2026-08-04 08:30',
      slaStatus: 'overdue',
      slaStatusText: 'Trễ SLA 5 giờ',
      status: 'pending',
      statusText: 'Chờ tiếp nhận',
      triggerNote: 'Hệ thống tự động sinh phiếu từ kết quả điểm danh',
    },
    {
      id: `${conditionId}-LOG-03`,
      ticketCode: 'CS-2026-0740',
      studentId: 'HV-7412',
      studentName: 'Phạm Thu Trang',
      studentPhoneMasked: '093****888',
      className: 'MATH-ADV-01',
      branchName: 'Cơ sở Cầu Giấy',
      triggeredAt: '2026-08-01 14:15',
      assignedRole: 'GV',
      assignedStaffName: 'Nguyễn Văn Nam (GV)',
      slaDeadline: '2026-08-02 14:15',
      slaStatus: 'on_time',
      slaStatusText: 'Đã hoàn thành đúng hạn',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      triggerNote: 'Đã trao đổi phụ huynh & chốt phương án hỗ trợ',
    },
    {
      id: `${conditionId}-LOG-04`,
      ticketCode: 'CS-2026-0688',
      studentId: 'HV-6650',
      studentName: 'Vũ Đức Anh',
      studentPhoneMasked: '090****999',
      className: 'ENG-INTER-03',
      branchName: 'Cơ sở Thanh Xuân',
      triggeredAt: '2026-07-28 09:00',
      assignedRole: 'CS',
      assignedStaffName: 'Hoàng Mai CS (CS)',
      slaDeadline: '2026-07-29 09:00',
      slaStatus: 'on_time',
      slaStatusText: 'Đã hoàn thành đúng hạn',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      triggerNote: 'Gia đình đã gửi đơn xác nhận lý do cá nhân',
    },
    {
      id: `${conditionId}-LOG-05`,
      ticketCode: 'CS-2026-0612',
      studentId: 'HV-5510',
      studentName: 'Đỗ Hải Nam',
      studentPhoneMasked: '097****222',
      className: 'MATH-ADV-01',
      branchName: 'Cơ sở Cầu Giấy',
      triggeredAt: '2026-07-20 16:45',
      assignedRole: 'CS',
      assignedStaffName: 'Nguyễn Thị CS (CS)',
      slaDeadline: '2026-07-21 16:45',
      slaStatus: 'on_time',
      slaStatusText: 'Đã hoàn thành đúng hạn',
      status: 'completed',
      statusText: 'Đã hoàn thành',
      triggerNote: 'Đã hoàn thành buổi học bù',
    },
  ]
}

interface CareConditionLogTabProps {
  condition: CareConditionConfig
}

export const CareConditionLogTab: React.FC<CareConditionLogTabProps> = ({ condition }) => {
  const logs = getMockExecutionLogs(condition.id)

  const totalCount = logs.length
  const pendingCount = logs.filter((l) => l.status === 'pending' || l.status === 'in_progress').length
  const completedCount = logs.filter((l) => l.status === 'completed').length
  const overdueCount = logs.filter((l) => l.slaStatus === 'overdue').length

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3">
      {/* 4 THẺ SMART CARD VỚI KHUNG BÊN NGOÀI THU GỌN 50% GIỮ NGUYÊN KÍCH THƯỚC NỘI DUNG */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card px-3.5 py-2 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Tổng số phiếu đã sinh
            </span>
            <span className="text-xl font-bold font-mono text-foreground">{totalCount}</span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card px-3.5 py-2 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Đang xử lý
            </span>
            <span className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">{pendingCount}</span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card px-3.5 py-2 flex items-center justify-between shadow-2xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
              Đã hoàn thành
            </span>
            <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div
          className={`rounded-lg border px-3.5 py-2 flex items-center justify-between shadow-2xs ${
            overdueCount > 0 ? 'border-rose-300 bg-rose-50/50 dark:bg-rose-950/30' : 'border-border bg-card'
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wide">
              Cảnh báo trễ SLA
            </span>
            <span className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400">{overdueCount}</span>
          </div>
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* BẢNG NHẬT KÝ PHIẾU PHÁT SINH LOG */}
      {logs.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-6 w-6 text-muted-foreground" />}
          title="Không có nhật ký phát sinh nào"
          description="Chưa có phiếu chăm sóc nào được hệ thống tự động sinh ra cho quy tắc này."
          className="py-8 border rounded-lg flex-1"
        />
      ) : (
        <div className="flex-1 min-h-0 rounded-lg border border-border overflow-y-auto bg-card">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 text-muted-foreground font-semibold uppercase tracking-wider text-[11px] border-b border-border sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3">Mã phiếu</th>
                <th className="py-2.5 px-3">Học viên</th>
                <th className="py-2.5 px-3">Lớp học / Cơ sở</th>
                <th className="py-2.5 px-3">Thời điểm phát sinh</th>
                <th className="py-2.5 px-3">Phụ trách</th>
                <th className="py-2.5 px-3">Trạng thái SLA</th>
                <th className="py-2.5 px-3">Trạng thái phiếu</th>
              </tr>
            </thead>
            <tbody className="divide-y text-foreground">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  {/* Mã phiếu */}
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">
                    {log.ticketCode}
                  </td>

                  {/* Học viên: BỎ SĐT HỌC VIÊN */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground">{log.studentName}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        {log.studentId}
                      </span>
                    </div>
                  </td>

                  {/* Lớp học */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-foreground">{log.className}</span>
                      <span className="text-[11px] text-muted-foreground">{log.branchName}</span>
                    </div>
                  </td>

                  {/* Thời điểm phát sinh */}
                  <td className="py-2.5 px-3 text-muted-foreground font-mono">
                    {log.triggeredAt}
                  </td>

                  {/* Người phụ trách: XẾP THÀNH TỪNG DÒNG, BỎ ICON PHÍA TRƯỚC */}
                  <td className="py-2.5 px-3">
                    <div className="flex flex-col gap-0.5 font-medium text-xs text-foreground">
                      {log.assignedStaffName.split('&').map((staff, idx) => (
                        <span key={idx} className="block whitespace-nowrap">
                          {staff.trim()}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Trạng thái SLA */}
                  <td className="py-2.5 px-3">
                    <Badge
                      variant="outline"
                      className={`text-[10.5px] font-medium px-2 py-0.5 ${
                        log.slaStatus === 'overdue'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300'
                          : log.slaStatus === 'warning'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {log.slaStatusText}
                    </Badge>
                  </td>

                  {/* Trạng thái phiếu */}
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 font-medium ${
                        log.status === 'completed'
                          ? 'text-emerald-600'
                          : log.status === 'in_progress'
                          ? 'text-amber-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          log.status === 'completed'
                            ? 'bg-emerald-500'
                            : log.status === 'in_progress'
                            ? 'bg-amber-500'
                            : 'bg-zinc-400'
                        }`}
                      />
                      <span>{log.statusText}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
