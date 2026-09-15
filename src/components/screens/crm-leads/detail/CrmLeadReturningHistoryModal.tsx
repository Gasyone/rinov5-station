'use client'

import {
  Headset,
  Compass,
  Calendar,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import type { Lead } from '@/mocks/crmLeads'

interface CrmLeadReturningHistoryModalProps {
  lead: Lead
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface HistoricalCycleItem {
  id: string
  title: string
  cycleTag: string
  timeRange: string
  status: string
  statusVariant: 'amber' | 'slate' | 'rose' | 'emerald'
  salesStaff: string
  branch: string
  channel: string
  productInterest: string
  parentExpectation: string
  careResultSummary: string
  stopReasonAndHandoff: string
}

export function CrmLeadReturningHistoryModal({
  lead,
  open,
  onOpenChange,
}: CrmLeadReturningHistoryModalProps) {
  // Danh sách các đợt / chu kỳ chăm sóc trước đó (Hỗ trợ hiển thị dạng accordion nhiều lần)
  const previousCycles: HistoricalCycleItem[] = [
    {
      id: 'cycle-2',
      title: 'Đợt 2: Khai giảng Mùa Xuân (T02/2026)',
      cycleTag: 'Đợt gần nhất',
      timeRange: '10/02/2026 - 22/02/2026',
      status: 'Tạm hoãn (Bảo lưu 6 tháng)',
      statusVariant: 'amber',
      salesStaff: 'Lê Hoàng Nam (Sales)',
      branch: lead.branch || 'RinoEdu Linh Đàm',
      channel: lead.source ? `Kênh ${lead.source}` : 'Facebook Ads',
      productInterest: lead.targetSubject || 'Anh văn Nhi đồng (SuperKids)',
      parentExpectation:
        lead.parentExpectation ||
        'Con tự tin phản xạ giao tiếp tự nhiên, phát âm chuẩn quốc tế và chuẩn bị thi chứng chỉ Cambridge',
      careResultSummary:
        'Đã test năng lực đạt 78/100, hoàn thành buổi học thử lớp SK-01 (GV Alex), đã cọc 2.500.000đ giữ ưu đãi học phí.',
      stopReasonAndHandoff:
        lead.returningReason ||
        'Phụ huynh rất hài lòng nhưng xin tạm hoãn vì gia đình chuyển nơi ở và sửa chữa nhà; xin bảo lưu cọc 6 tháng, hẹn chăm sóc lại vào đầu năm học mới tháng 08/2026.',
    },
    {
      id: 'cycle-1',
      title: 'Đợt 1: Tuyển sinh Năm học mới (T09/2025)',
      cycleTag: 'Đợt đầu tiên',
      timeRange: '15/09/2025 - 28/09/2025',
      status: 'Chưa chốt (Nhà xa cơ sở)',
      statusVariant: 'slate',
      salesStaff: 'Phạm Thị Thúy (Sales)',
      branch: 'RinoEdu Ba Đình',
      channel: 'Sự kiện Ngày hội Giáo dục & Hotline',
      productInterest: 'Tiếng Anh Thiếu Nhi & Toán Tư Duy',
      parentExpectation:
        'Rèn luyện tính tự giác, làm quen với tiếng Anh từ nhỏ và phát âm chuẩn bản ngữ',
      careResultSummary:
        'Đã tư vấn lộ trình học 12 tháng qua điện thoại và gửi tài liệu qua Zalo; phụ huynh quan tâm cao nhưng chưa xếp được lịch đưa đón.',
      stopReasonAndHandoff:
        'Nhà ở khu vực Linh Đàm / Hoàng Mai cách quá xa cơ sở Ba Đình. Mẹ bé hẹn khi nào RinoEdu mở cơ sở gần khu Linh Đàm sẽ chủ động đăng ký học ngay.',
    },
  ]

  const getStatusBadge = (status: string, variant: HistoricalCycleItem['statusVariant']) => {
    switch (variant) {
      case 'amber':
        return (
          <Badge variant="outline" className="text-[10px] font-semibold bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 shrink-0">
            {status}
          </Badge>
        )
      case 'rose':
        return (
          <Badge variant="outline" className="text-[10px] font-semibold bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700 shrink-0">
            {status}
          </Badge>
        )
      case 'emerald':
        return (
          <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700 shrink-0">
            {status}
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-semibold bg-slate-100 text-slate-700 border-slate-300 dark:bg-zinc-800 dark:text-zinc-300 shrink-0">
            {status}
          </Badge>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{ maxWidth: '980px', width: '92vw', height: '88vh', maxHeight: '92vh' }}
        className="!w-[92vw] !max-w-[980px] w-[92vw] max-w-[980px] h-[88vh] max-h-[92vh] min-h-[580px] flex flex-col p-0 gap-0 overflow-hidden text-left select-none rounded-2xl"
      >
        {/* Header modal: Bỏ icon, bỏ subtitle, title viết thường không in đậm, nhãn Lead quay lại đồng bộ panel phải */}
        <DialogHeader className="p-4 pb-3 border-b border-border/70 bg-muted/30 shrink-0">
          <div className="flex items-center justify-between gap-2.5 pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <DialogTitle className="text-sm font-normal text-foreground">
                Lịch sử các đợt tiếp cận: <span className="font-medium text-foreground">{lead.studentName}</span>
              </DialogTitle>
              <Badge
                variant="outline"
                className="h-6 text-[11px] font-semibold px-2 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 inline-flex items-center gap-1 shadow-none"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Lead quay lại</span>
              </Badge>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Lịch sử các đợt tiếp cận và chăm sóc trước đây của học viên
          </DialogDescription>
        </DialogHeader>

        {/* Nội dung dạng Accordion làm phẳng, không lồng viền hộp */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 text-xs">
          <Accordion type="single" collapsible defaultValue="cycle-2" className="space-y-2.5">
            {previousCycles.map((cycle) => (
              <AccordionItem
                key={cycle.id}
                value={cycle.id}
                className="border border-border/70 rounded-xl overflow-hidden bg-card shadow-3xs"
              >
                {/* Header đợt: 1 dòng gọn gàng, không lặp lại Sale */}
                <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline transition-colors text-left flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 flex-wrap">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <span className="font-semibold text-xs text-foreground">
                      {cycle.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted/80 font-medium">
                      {cycle.cycleTag}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      ({cycle.timeRange})
                    </span>
                  </div>

                  <div className="mr-2 shrink-0">
                    {getStatusBadge(cycle.status, cycle.statusVariant)}
                  </div>
                </AccordionTrigger>

                {/* Nội dung đợt: Làm phẳng 100%, xóa bỏ 3 hộp viền lồng nhau */}
                <AccordionContent className="px-5 py-3.5 border-t border-border/60 bg-muted/15 space-y-3 text-xs">
                  {/* 1. THANH THÔNG TIN PHỤ TRÁCH 1 DÒNG (Không viền hộp) */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pb-2.5 border-b border-border/40">
                    <span className="flex items-center gap-1.5">
                      <Headset className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                      <span>Tư vấn viên: <strong className="text-foreground font-medium">{cycle.salesStaff}</strong></span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Cơ sở: <strong className="text-foreground font-medium">{cycle.branch}</strong></span>
                    </span>
                    <span className="text-border">•</span>
                    <span className="flex items-center gap-1.5">
                      <span>Kênh: <strong className="text-foreground font-medium capitalize">{cycle.channel}</strong></span>
                    </span>
                  </div>

                  {/* 2. DẢI HIGHLIGHT: LÝ DO TẠM DỪNG / THỎA THUẬN BÀN GIAO (Viền trái nhấn, KHÔNG VIỀN HỘP) */}
                  <div className="p-3 rounded-lg bg-amber-500/8 dark:bg-amber-500/10 border-l-3 border-amber-500 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-900 dark:text-amber-300">
                      <FileText className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Lý do tạm dừng &amp; Thỏa thuận bàn giao:</span>
                    </div>
                    <p className="text-xs text-foreground/90 font-medium italic leading-relaxed pl-5">
                      &ldquo;{cycle.stopReasonAndHandoff}&rdquo;
                    </p>
                  </div>

                  {/* 3. HAI CỘT THÔNG TIN PHẲNG (Mối quan tâm vs Kết quả chăm sóc thực tế) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-0.5">
                    {/* Cột 1: Mối quan tâm & Kỳ vọng */}
                    <div className="space-y-2">
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1.5 pb-1 border-b border-border/30">
                        <Compass className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Mối quan tâm &amp; Kỳ vọng</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div>
                          <span className="text-muted-foreground text-[11px] block">Môn học / Sản phẩm quan tâm:</span>
                          <span className="font-medium text-foreground">{cycle.productInterest}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-[11px] block">Nhu cầu &amp; Kỳ vọng của phụ huynh:</span>
                          <p className="text-muted-foreground leading-relaxed pt-0.5">{cycle.parentExpectation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Cột 2: Kết quả chăm sóc thực tế */}
                    <div className="space-y-2">
                      <div className="font-semibold text-xs text-foreground flex items-center gap-1.5 pb-1 border-b border-border/30">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Kết quả chăm sóc thực tế</span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div>
                          <span className="text-muted-foreground text-[11px] block">Tiến trình đạt được ở đợt này:</span>
                          <p className="text-foreground/90 font-medium leading-relaxed pt-0.5">
                            {cycle.careResultSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  )
}
