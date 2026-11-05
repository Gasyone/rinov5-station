'use client'

import React, { useState } from 'react'
import {
  ArrowRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  X,
  GitBranch,
  Check,
  Ban,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { WORKFLOW_STEPS } from './qcCheckBusinessModelData'

interface BranchDetail {
  id: string
  title: string
  statusLabel: string
  badgeClass: string
  actor: string
  action: string
  result: string
  rule: string
  fromStep: string
  toStep: string
}

const BRANCH_DETAILS: Record<string, BranchDetail> = {
  closed: {
    id: 'closed',
    title: 'Nhánh 1: Nghiệm thu đạt chuẩn ➔ Đã đóng (Closed)',
    statusLabel: 'Đã đóng (Closed)',
    badgeClass: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    actor: 'Thanh tra viên (QC Inspector) hoặc Bot tự động (System Auto-close)',
    action: 'Kiểm tra hiện trường thực tế, thẩm định ảnh/link minh chứng đạt yêu cầu ➔ Bấm "Nghiệm thu đóng lỗi".',
    result: 'Sự cố kết thúc thành công, chuyển tiếp sang Bước 5 (Thống kê & Quản trị KPI) và đóng vĩnh viễn (Global Terminal).',
    rule: 'Dữ liệu được ghi nhận vào báo cáo KPI và hồ sơ đánh giá chất lượng nhân sự.',
    fromStep: 'Bước 4 (Thẩm định & Phúc tra)',
    toStep: 'Bước 5 (KPI) ➔ [CLOSED] Đã đóng thành công',
  },
  not_met: {
    id: 'not_met',
    title: 'Nhánh 2: Chưa đạt chuẩn ➔ Vòng lặp CAPA hồi tiếp về Bước 2',
    statusLabel: 'Chưa đáp ứng (Not Met)',
    badgeClass: 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    actor: 'Thanh tra viên (QC Inspector) ➔ Bàn giao lại Assignee',
    action: 'Bấm "Đánh giá chưa đạt", ghi chú rõ lý do không đạt và yêu cầu cần khắc phục lại.',
    result: 'Hệ thống tự động kích hoạt Vòng khắc phục mới (Round 2, Round 3...) và đưa sự cố quay ngược lại Bước 2 (Tiếp nhận & Xử lý).',
    rule: 'Bảo tồn 100% lịch sử các lần nộp trước, cảnh báo đỏ nếu lỗi bị trả lại quá 2 lần (Nguy cơ tái vi phạm).',
    fromStep: 'Bước 4 (Thẩm định từ chối)',
    toStep: 'Quay ngược lại Bước 2 (Tiếp nhận & Xử lý)',
  },
  cancelled: {
    id: 'cancelled',
    title: 'Nhánh 3: Bác bỏ sự cố / Lập sai ➔ Đã hủy (Cancelled)',
    statusLabel: 'Đã hủy (Cancelled)',
    badgeClass: 'bg-zinc-500/20 text-zinc-700 dark:text-zinc-300 border-zinc-500/30',
    actor: 'Thanh tra viên hoặc Quản lý chi nhánh (Branch Manager)',
    action: 'Xác nhận sự cố lập nhầm thông tin hoặc nhân sự giải trình hợp lệ không vi phạm ➔ Hủy phiếu kèm lý do.',
    result: 'Sự cố bị vô hiệu hóa, chuyển sang trạng thái kết thúc (Terminal) và KHÔNG tính vào điểm trừ KPI của nhân sự.',
    rule: 'Mọi thao tác hủy phiếu đều được lưu vết chi tiết trong Nhật ký hệ thống (Audit Logs).',
    fromStep: 'Bước 2 (Assignee giải trình) hoặc Bước 4 (QC xác nhận)',
    toStep: '[CANCELLED] Đã hủy phiếu (Không phạt KPI)',
  },
}

export function QcWorkflowDiagramView() {
  const [selectedNode, setSelectedNode] = useState<string>('step_4')

  const isStepSelected = selectedNode.startsWith('step_')
  const currentStepId = isStepSelected ? parseInt(selectedNode.replace('step_', ''), 10) : 4
  const currentStep = WORKFLOW_STEPS.find((s) => s.id === currentStepId) || WORKFLOW_STEPS[3]
  const currentBranch = BRANCH_DETAILS[selectedNode] || null

  return (
    <div className="space-y-4">
      {/* KHỐI 1: SƠ ĐỒ KHÔNG GIAN ĐẦY ĐỦ CÁC ĐƯỜNG NỐI & VÒNG LẶP */}
      <div className="rounded-xl bg-card border border-border/70 p-4 space-y-4 overflow-x-auto custom-scrollbar shadow-xs">
        {/* Header & Chú giải sơ đồ */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs pb-1 border-b border-border/40">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <GitBranch className="h-4 w-4 text-primary" />
            <span>Sơ đồ Luồng Vận hành & Phân nhánh Nghiệp vụ (Workflow Diagram)</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Tiến trình chính</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 ring-2 ring-purple-500/30" />
              <span>Điểm quyết định (QC)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span>Vòng lặp CAPA</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Đóng thành công</span>
            </span>
          </div>
        </div>

        {/* CONTAINER SƠ ĐỒ KHÔNG GIAN (MIN WIDTH 860PX) */}
        <div className="min-w-[860px] space-y-3 pt-1 select-none">
          {/* HÀNG 1: TRỤC TIẾN TRÌNH CHÍNH (BƯỚC 1 ➔ BƯỚC 2 ➔ BƯỚC 3 ➔ BƯỚC 4 QUYẾT ĐỊNH) */}
          <div className="grid grid-cols-12 gap-2 items-center">
            {/* NODE 1: Phát hiện sự cố */}
            <div className="col-span-3">
              <button
                type="button"
                onClick={() => setSelectedNode('step_1')}
                className={cn(
                  'w-full p-2.5 rounded-lg text-left transition-all cursor-pointer flex flex-col gap-1 border',
                  selectedNode === 'step_1'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/40 border-blue-600'
                    : 'bg-card hover:bg-muted/50 text-foreground border-border/60 hover:border-border'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'h-4.5 w-4.5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    selectedNode === 'step_1' ? 'bg-white text-blue-700' : 'bg-blue-500/20 text-blue-600'
                  )}>
                    1
                  </span>
                  <span className={cn(
                    'text-[10px] font-mono px-1 rounded',
                    selectedNode === 'step_1' ? 'bg-white/20 text-white' : 'text-blue-600 dark:text-blue-400 bg-blue-500/10'
                  )}>
                    open
                  </span>
                </div>
                <div className="font-semibold text-xs leading-tight">1. Phát hiện sự cố</div>
                <div className={cn('text-[10.5px] truncate', selectedNode === 'step_1' ? 'text-white/80' : 'text-muted-foreground')}>
                  Thanh tra viên / AI Bot
                </div>
              </button>
            </div>

            {/* Mũi tên kết nối 1 ➔ 2 */}
            <div className="col-span-1 flex flex-col items-center justify-center text-muted-foreground">
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span className="text-[9px] font-mono text-muted-foreground">gán lỗi</span>
            </div>

            {/* NODE 2: Tiếp nhận & Xử lý (Có cổng đón vòng lặp) */}
            <div className="col-span-3 relative">
              {/* Badge đón vòng lặp từ dưới lên */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-amber-500 text-white shadow-xs border border-amber-600">
                  <ArrowUp className="h-2.5 w-2.5 stroke-[2.5]" />
                  <span>Cổng nhận Vòng n+1</span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode('step_2')}
                className={cn(
                  'w-full p-2.5 pb-3 rounded-lg text-left transition-all cursor-pointer flex flex-col gap-1 border',
                  selectedNode === 'step_2'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/40 border-amber-600'
                    : 'bg-card hover:bg-muted/50 text-foreground border-border/60 hover:border-border'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'h-4.5 w-4.5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    selectedNode === 'step_2' ? 'bg-white text-amber-700' : 'bg-amber-500/20 text-amber-600'
                  )}>
                    2
                  </span>
                  <span className={cn(
                    'text-[10px] font-mono px-1 rounded',
                    selectedNode === 'step_2' ? 'bg-white/20 text-white' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                  )}>
                    correcting
                  </span>
                </div>
                <div className="font-semibold text-xs leading-tight">2. Tiếp nhận & Xử lý</div>
                <div className={cn('text-[10.5px] truncate', selectedNode === 'step_2' ? 'text-white/80' : 'text-muted-foreground')}>
                  Assignee lập giải pháp
                </div>
              </button>
            </div>

            {/* Mũi tên kết nối 2 ➔ 3 */}
            <div className="col-span-1 flex flex-col items-center justify-center text-muted-foreground">
              <ArrowRight className="h-4 w-4 text-primary shrink-0" />
              <span className="text-[9px] font-mono text-muted-foreground">khắc phục</span>
            </div>

            {/* NODE 3: Nộp CAPA & Minh chứng */}
            <div className="col-span-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedNode('step_3')}
                className={cn(
                  'flex-1 p-2.5 rounded-lg text-left transition-all cursor-pointer flex flex-col gap-1 border',
                  selectedNode === 'step_3'
                    ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-600/40 border-purple-600'
                    : 'bg-card hover:bg-muted/50 text-foreground border-border/60 hover:border-border'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'h-4.5 w-4.5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    selectedNode === 'step_3' ? 'bg-white text-purple-700' : 'bg-purple-500/20 text-purple-600'
                  )}>
                    3
                  </span>
                  <span className={cn(
                    'text-[10px] font-mono px-1 rounded',
                    selectedNode === 'step_3' ? 'bg-white/20 text-white' : 'text-purple-600 dark:text-purple-400 bg-purple-500/10'
                  )}>
                    corrected
                  </span>
                </div>
                <div className="font-semibold text-xs leading-tight">3. Nộp CAPA & Ảnh</div>
                <div className={cn('text-[10.5px] truncate', selectedNode === 'step_3' ? 'text-white/80' : 'text-muted-foreground')}>
                  Minh chứng hiện trường
                </div>
              </button>

              <div className="flex flex-col items-center justify-center text-muted-foreground shrink-0 px-1">
                <ArrowRight className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="text-[9px] font-mono text-purple-600">nộp QC</span>
              </div>
            </div>
          </div>

          {/* HÀNG 2: BƯỚC 4 LÀ ĐIỂM QUYẾT ĐỊNH (DECISION HUB) TỎA RA 3 NHÁNH */}
          <div className="rounded-xl p-3 border-2 border-purple-500/40 bg-purple-50/20 dark:bg-purple-950/15 space-y-3">
            {/* Header Điểm Quyết Định Bước 4 */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedNode('step_4')}
                className={cn(
                  'px-3 py-1.5 rounded-lg flex items-center gap-2 border transition-all cursor-pointer',
                  selectedNode === 'step_4'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-600/30'
                    : 'bg-background hover:bg-muted text-foreground border-purple-300 dark:border-purple-800'
                )}
              >
                <span className="h-4.5 w-4.5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                  4
                </span>
                <span className="font-bold text-xs">4. Thẩm định & Phúc tra (Điểm Quyết định QC)</span>
                <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-purple-400 bg-purple-500/10">
                  Thanh tra viên nghiệm thu
                </Badge>
              </button>

              <span className="text-[11px] text-muted-foreground italic">
                ➔ Tại đây rẽ thành 3 nhánh kết quả độc lập:
              </span>
            </div>

            {/* 3 NHÁNH RẼ NGHIỆP VỤ */}
            <div className="grid grid-cols-12 gap-2.5 items-stretch">
              {/* CỘT 1: NHÁNH 1 (ĐẠT YÊU CẦU ➔ BƯỚC 5 ➔ CLOSED) */}
              <div className="col-span-5 flex flex-col justify-between p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedNode('closed')}
                  className={cn(
                    'w-full text-left p-2 rounded-md transition-all cursor-pointer border flex items-start gap-2',
                    selectedNode === 'closed'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-card hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800/60 text-foreground'
                  )}
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                      <span>Nhánh 1: Đạt yêu cầu</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-200">closed</span>
                    </div>
                    <div className="text-[10.5px] leading-tight text-muted-foreground mt-0.5">
                      Nghiệm thu đạt chuẩn ➔ Đóng lỗi & chuyển sang ghi nhận KPI
                    </div>
                  </div>
                </button>

                {/* Đường line nối sang Bước 5 */}
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 px-1">
                  <ArrowDown className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-[10px] font-medium">Chuyển tiếp sau nghiệm thu:</span>
                </div>

                {/* Bước 5 & Nút Closed */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedNode('step_5')}
                    className={cn(
                      'flex-1 p-2 rounded-md border text-left transition-all cursor-pointer',
                      selectedNode === 'step_5'
                        ? 'bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                        : 'bg-card hover:bg-muted text-foreground border-border/60'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold">5. Thống kê & Quản trị</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-muted text-muted-foreground">KPI</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">Đánh giá tái phạm</div>
                  </button>

                  <ArrowRight className="h-3.5 w-3.5 text-emerald-600 shrink-0" />

                  {/* Terminal Closed */}
                  <div className="px-2 py-1.5 rounded-md bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 shrink-0 shadow-xs">
                    <Check className="h-3 w-3 stroke-[3]" />
                    <span>ĐÃ ĐÓNG</span>
                  </div>
                </div>
              </div>

              {/* CỘT 2: NHÁNH 2 (CHƯA ĐẠT ➔ VÒNG LẶP CAPA HỒI TIẾP VỀ BƯỚC 2) */}
              <div className="col-span-4 flex flex-col justify-between p-2.5 rounded-lg border border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedNode('not_met')}
                  className={cn(
                    'w-full text-left p-2 rounded-md transition-all cursor-pointer border flex items-start gap-2',
                    selectedNode === 'not_met'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-card hover:bg-amber-100/50 dark:hover:bg-amber-900/30 border-amber-200 dark:border-amber-800/60 text-foreground'
                  )}
                >
                  <RotateCcw className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                      <span>Nhánh 2: Vòng lặp CAPA</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-200">not_met</span>
                    </div>
                    <div className="text-[10.5px] leading-tight text-muted-foreground mt-0.5">
                      Chưa đạt ➔ QC trả về, hệ thống tự động sinh <strong>Vòng n+1</strong>
                    </div>
                  </div>
                </button>

                {/* Hướng dẫn luồng hồi tiếp */}
                <div className="p-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10.5px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <RotateCcw className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Đường line cam chạy ngược về <strong>Bước 2</strong> (xem dải hồi tiếp bên dưới)</span>
                </div>
              </div>

              {/* CỘT 3: NHÁNH 3 (BÁC BỎ SỰ CỐ / LẬP SAI ➔ CANCELLED) */}
              <div className="col-span-3 flex flex-col justify-between p-2.5 rounded-lg border border-zinc-400/40 bg-muted/30 space-y-2">
                <button
                  type="button"
                  onClick={() => setSelectedNode('cancelled')}
                  className={cn(
                    'w-full text-left p-2 rounded-md transition-all cursor-pointer border flex items-start gap-2',
                    selectedNode === 'cancelled'
                      ? 'bg-zinc-700 text-white border-zinc-700 shadow-xs'
                      : 'bg-card hover:bg-muted text-foreground border-border/60'
                  )}
                >
                  <X className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-foreground flex items-center gap-1">
                      <span>Nhánh 3: Bác bỏ</span>
                      <span className="text-[9px] font-mono px-1 rounded bg-muted text-muted-foreground">cancelled</span>
                    </div>
                    <div className="text-[10.5px] leading-tight text-muted-foreground mt-0.5">
                      Lập sai hoặc giải trình hợp lệ
                    </div>
                  </div>
                </button>

                <div className="pt-2 flex items-center justify-between gap-1 text-[10px] text-muted-foreground">
                  <span>Hủy phiếu:</span>
                  <div className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-[10px] flex items-center gap-1 shadow-2xs">
                    <Ban className="h-3 w-3" />
                    <span>ĐÃ HỦY (0 phạt)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HÀNG 3: THANH RAY VÒNG LẶP HỒI TIẾP (CAPA LOOPBACK RAIL ➔ QUAY LẠI BƯỚC 2) */}
          <div className="rounded-lg p-2.5 bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200 relative overflow-hidden">
            <div className="flex items-center gap-2 font-semibold shrink-0">
              <span className="h-5 w-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                🔄
              </span>
              <span>ĐƯỜNG LINE HỒI TIẾP (CAPA RETURN LINE):</span>
            </div>

            {/* Dải mũi tên hồi tiếp chạy sang trái trỏ vào Bước 2 */}
            <div className="flex-1 flex items-center justify-center gap-2 font-mono text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 py-1 px-3 rounded border border-dashed border-amber-500/30">
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5] animate-pulse text-amber-600" />
              <span>[Nhánh 2 Chưa đạt tại Bước 4]</span>
              <span className="text-muted-foreground">➔</span>
              <span>Tự sinh Vòng n+1</span>
              <span className="text-muted-foreground">➔</span>
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.5] text-amber-600" />
              <strong className="underline underline-offset-2">Quay lại đỉnh Bước 2 để Assignee sửa lại</strong>
              <ArrowUp className="h-3.5 w-3.5 stroke-[2.5] text-amber-600 ml-1" />
            </div>

            <div className="text-[10.5px] text-muted-foreground shrink-0 hidden sm:block">
              Chu trình lặp tối đa 2 lần trước khi báo cáo BM
            </div>
          </div>
        </div>
      </div>

      {/* KHỐI 2: BẢNG CHI TIẾT ĐIỂM ĐANG CHỌN TRONG SƠ ĐỒ (INSPECTOR PANEL) */}
      <div className="space-y-2.5">
        {/* Tiêu đề mục đang chọn */}
        <div className="flex items-center justify-between pb-1 border-b border-border/50 text-xs">
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
              {isStepSelected ? currentStep.id : '✦'}
            </span>
            <span>{isStepSelected ? currentStep.title : currentBranch?.title}</span>
            {isStepSelected && (
              <span className="text-muted-foreground font-normal hidden sm:inline">
                — {currentStep.subtitle}
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-[10px]">
            Trạng thái: {isStepSelected ? currentStep.statusLabel : currentBranch?.statusLabel}
          </Badge>
        </div>

        {/* Nội dung chi tiết nếu là Bước trong 5 Bước */}
        {isStepSelected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-2 bg-muted/20 p-3 rounded-lg border border-border/40">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Chủ thể thực hiện (Actor)
                </span>
                <span className="font-medium text-foreground">{currentStep.actor}</span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Hành động chính (Action)
                </span>
                <span className="text-foreground leading-relaxed">{currentStep.action}</span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Thời hạn chuẩn (SLA)
                </span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {currentStep.slaTime}
                </span>
              </div>
            </div>

            <div className="space-y-2 bg-muted/20 p-3 rounded-lg border border-border/40">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Dữ liệu Vào & Ra (I/O)
                </span>
                <div className="text-muted-foreground text-[11px] mt-0.5 space-y-0.5">
                  <div>
                    <strong className="text-foreground">Đầu vào:</strong> {currentStep.input}
                  </div>
                  <div>
                    <strong className="text-foreground">Đầu ra:</strong> {currentStep.output}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Ánh xạ giao diện thực thi
                </span>
                <span className="text-primary font-medium">{currentStep.uiMapping}</span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Nguyên tắc then chốt
                </span>
                <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground text-[11px] mt-0.5">
                  {currentStep.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Nội dung chi tiết nếu là Phân nhánh Quyết định */}
        {!isStepSelected && currentBranch && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-muted/20 p-3 rounded-lg border border-border/40">
            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Điểm xuất phát & Đích đến
                </span>
                <div className="font-medium text-foreground text-[11px] space-y-0.5">
                  <div><strong>Từ:</strong> {currentBranch.fromStep}</div>
                  <div><strong>Đến:</strong> {currentBranch.toStep}</div>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Người có thẩm quyền
                </span>
                <span className="font-medium text-foreground">{currentBranch.actor}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Thao tác kích hoạt
                </span>
                <span className="text-foreground leading-relaxed">{currentBranch.action}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Hệ quả trạng thái
                </span>
                <span className="text-foreground font-medium">{currentBranch.result}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Nguyên tắc quản trị
                </span>
                <span className="text-muted-foreground leading-relaxed">{currentBranch.rule}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
