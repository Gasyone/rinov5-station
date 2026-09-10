'use client'

import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lead } from '@/mocks/crmLeads'

interface CrmLeadOpsHandoffTabProps {
  lead: Lead
  onReactivate?: () => void
}

export function CrmLeadOpsHandoffTab({ lead, onReactivate }: CrmLeadOpsHandoffTabProps) {
  const ops = lead.opsHandoff
  const isInactiveOver6Months = (ops?.daysInactive ?? 0) >= 180 || ops?.canReactivate

  if (!ops) {
    return (
      <div className="bg-muted/30 border border-border/70 rounded-xl p-5 text-xs space-y-3">
        <div className="text-foreground font-bold text-sm">
          <span>Quy trình Bàn giao Vận hành (Handoff to School Ops)</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Hiện tại Lead đang thuộc <strong>Chu kỳ Bán hàng của Tư vấn viên (Sales)</strong>. Sau khi phụ huynh
          hoàn tất thủ tục thu học phí (hoặc đặt cọc), hệ thống sẽ tự động:
        </p>
        <div className="space-y-2 pl-2">
          <div className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Đóng chu kỳ bán hàng hiện tại của Sales và tính KPI tuyển sinh.</span>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Tự động chuyển hồ sơ học sinh sang danh sách Chờ xếp lớp của Ban Giáo Vụ (`/app/classes`).</span>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Sales không cần nhận thông báo nhắc nhở chăm sóc nữa (chuyển sang trạng thái chỉ đọc).</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-xs">
      {/* 1. CẢNH BÁO TÁI KÍCH HOẠT NẾU KHÔNG HOẠT ĐỘNG > 180 NGÀY (6 THÁNG) */}
      {isInactiveOver6Months && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-200 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
              <span>Cảnh báo Tái kích hoạt: Đã ngừng học / Không hoạt động {ops.daysInactive} ngày</span>
            </div>
            <Badge className="bg-amber-600 text-white border-none text-[10px]">
              &gt; 6 Tháng
            </Badge>
          </div>

          <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Học viên đã kết thúc khóa học và không có hoạt động trong <strong>{ops.daysInactive} ngày</strong> (vượt mốc 180 ngày). 
            Theo chính sách vòng đời, Lead đủ điều kiện để <strong>mở Chu kỳ Bán mới (Win-back Cycle)</strong> để tư vấn khóa học kế tiếp mà không làm mất lịch sử học vụ cũ.
          </p>

          <div className="flex items-center justify-between pt-1 border-t border-amber-200 dark:border-amber-800/80">
            <span className="text-[11px] text-amber-800 dark:text-amber-400">
              Lần học cuối: <strong>{ops.lastActivityDate}</strong>
            </span>
            <Button
              type="button"
              size="sm"
              className="h-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs gap-1.5 cursor-pointer"
              onClick={onReactivate}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Kích hoạt Chu kỳ Bán mới (Win-back)</span>
            </Button>
          </div>
        </div>
      )}

      {/* 2. THẺ TRẠNG THÁI BÀN GIAO VẬN HÀNH */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div>
              <h4 className="font-bold text-foreground text-sm">
                Đã bàn giao cho Ban Vận hành / Giáo vụ
              </h4>
              <span className="text-[11px] text-muted-foreground">
                Mã học viên:{' '}
                <a
                  href={`/app/students/${ops.studentCode}`}
                  className="font-mono font-bold text-primary hover:underline cursor-pointer"
                  title="Mở hồ sơ chi tiết học viên"
                >
                  {ops.studentCode}
                </a>{' '}
                • Ngày nhập học: {ops.enrolledDate}
              </span>
            </div>

          <Badge className="bg-emerald-600 text-white text-xs">
            {ops.academicStatus === 'studying' ? 'Đang học tích cực' : 'Đã hoàn thành khóa'}
          </Badge>
        </div>

        {/* Thông tin lớp học & Giáo vụ phụ trách */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Lớp học hiện tại:</span>
            <span className="font-bold text-primary flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {ops.currentClass}
            </span>
            <span className="text-[10.5px] text-muted-foreground block truncate">{ops.className}</span>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Giáo vụ phụ trách lớp:</span>
            <span className="font-semibold text-foreground flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-sky-600" />
              {ops.academicOfficer}
            </span>
            <span className="text-[10.5px] text-muted-foreground block">Giáo viên: {ops.teacherName}</span>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Tiến độ buổi học:</span>
            <span className="font-bold text-foreground">{ops.sessionsLearned}</span>
            <span className="text-[10.5px] text-muted-foreground block">Theo gói đào tạo</span>
          </div>

          <div className="bg-muted/40 p-2.5 rounded-lg border border-border/70 space-y-1">
            <span className="text-[11px] text-muted-foreground block">Tỷ lệ chuyên cần:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{ops.attendanceRate}</span>
            <span className="text-[10.5px] text-muted-foreground block">Tương tác lớp học</span>
          </div>
        </div>

        {/* Thông báo trách nhiệm Sales */}
        <div className="p-2.5 rounded-lg bg-muted/50 text-[11px] text-muted-foreground flex items-center justify-between">
          <span>
            ℹ️ Sales chỉ theo dõi trạng thái tham khảo. Việc điểm danh, bảo lưu hoặc chăm sóc hàng ngày do Ban Học vụ đảm nhiệm.
          </span>
        </div>
      </div>
    </div>
  )
}
