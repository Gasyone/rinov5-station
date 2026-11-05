'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GitBranch,
  Clock,
  Users,
  AlertTriangle,
  Flame,
  AlertCircle,
  Info,
  ArrowRight,
  GraduationCap,
  Building2,
  Headphones,
  Wrench,
  ShieldCheck,
  Layers,
  Activity,
  FileCheck2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  RACI_ROWS,
  CORE_BUSINESS_RULES,
} from './qcCheckBusinessModelData'
import { QcWorkflowDiagramView } from './QcWorkflowDiagramView'

export interface QcCheckBusinessModelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QcCheckBusinessModelDialog({
  open,
  onOpenChange,
}: QcCheckBusinessModelDialogProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'entities' | 'sla_matrix' | 'raci' | 'rules'>('workflow')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-[95vw] sm:max-w-[1050px] overflow-hidden flex flex-col p-0 gap-0 shadow-lg border-border">
        {/* Header - Tối giản, không icon rườm rà, không subtitle */}
        <DialogHeader className="shrink-0 px-5 pt-4 pb-2.5 border-b bg-card">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-foreground">
              Mô hình Nghiệp vụ & Vận hành QC Check
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Mô hình nghiệp vụ và quy trình vận hành kiểm soát chất lượng QC Check
          </DialogDescription>

          {/* Navigation Tabs */}
          <div className="pt-2">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as typeof activeTab)}
              className="w-full"
            >
              <TabsList className="h-8 p-0.5 bg-muted/60 w-full justify-start overflow-x-auto flex flex-nowrap">
                <TabsTrigger value="workflow" className="text-xs px-3 h-7 gap-1.5 shrink-0">
                  <GitBranch className="h-3.5 w-3.5" />
                  <span>Chu trình Vận hành</span>
                </TabsTrigger>
                <TabsTrigger value="entities" className="text-xs px-3 h-7 gap-1.5 shrink-0">
                  <Layers className="h-3.5 w-3.5" />
                  <span>Thực thể & Đối tượng</span>
                </TabsTrigger>
                <TabsTrigger value="sla_matrix" className="text-xs px-3 h-7 gap-1.5 shrink-0">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Ma trận SLA</span>
                </TabsTrigger>
                <TabsTrigger value="raci" className="text-xs px-3 h-7 gap-1.5 shrink-0">
                  <Users className="h-3.5 w-3.5" />
                  <span>Phân định Trách nhiệm</span>
                </TabsTrigger>
                <TabsTrigger value="rules" className="text-xs px-3 h-7 gap-1.5 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Quy tắc Vàng</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        {/* Content Body - Bỏ bớt các lớp viền lặp, giao diện phẳng & tinh giản */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar bg-background">
          {/* TAB 1: WORKFLOW LIFECYCLE - Sơ đồ quy trình vận hành trực quan */}
          {activeTab === 'workflow' && <QcWorkflowDiagramView />}

          {/* TAB 2: ENTITIES & RELATIONSHIPS */}
          {activeTab === 'entities' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Entity 1 */}
                <div className="bg-muted/30 p-3.5 rounded-lg space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>1. Nhóm đối tượng</span>
                    </span>
                    <Badge variant="secondary" className="text-[10px]">3 nhóm</Badge>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="p-2 rounded bg-background/80">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-primary" />
                        <span>Giáo viên (Teacher)</span>
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        Điểm danh, tác phong giảng dạy, soạn giáo án, nhận xét học viên.
                      </div>
                    </div>

                    <div className="p-2 rounded bg-background/80">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        <span>Cơ sở vật chất (Facility)</span>
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        Chất lượng phòng học, điều hòa, máy chiếu, an toàn vệ sinh.
                      </div>
                    </div>

                    <div className="p-2 rounded bg-background/80">
                      <div className="font-semibold text-foreground flex items-center gap-1">
                        <Headphones className="h-3.5 w-3.5 text-primary" />
                        <span>Vận hành (Operations / CS)</span>
                      </div>
                      <div className="text-muted-foreground mt-0.5">
                        Chăm sóc học viên vắng, phản hồi phụ huynh, xếp lịch học bù.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Entity 2 */}
                <div className="bg-primary/5 p-3.5 rounded-lg space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-primary/20">
                    <span className="font-semibold text-primary flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>2. Sự cố QC (Incident)</span>
                    </span>
                    <Badge className="bg-primary text-primary-foreground text-[10px]">Cốt lõi</Badge>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-muted-foreground">
                    <li>• <strong className="text-foreground">Mã sự cố:</strong> Định danh duy nhất (ERR_xxx).</li>
                    <li>• <strong className="text-foreground">Nguồn:</strong> Thủ công (Thanh tra) hoặc Tự động (Bot/AI).</li>
                    <li>• <strong className="text-foreground">Mức độ vi phạm:</strong> Thấp, Trung bình, Cao, Khẩn cấp.</li>
                    <li>• <strong className="text-foreground">Trạng thái:</strong> Mở, Đang khắc phục, Chờ duyệt, Đã đóng.</li>
                    <li>• <strong className="text-foreground">Ngữ cảnh:</strong> Cơ sở, Lớp, Phòng, Buổi học.</li>
                    <li>• <strong className="text-foreground">Thời hạn SLA:</strong> Deadline tính tự động.</li>
                  </ul>
                </div>

                {/* Entity 3 */}
                <div className="bg-muted/30 p-3.5 rounded-lg space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-border/40">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-primary" />
                      <span>3. Vòng khắc phục (CAPA)</span>
                    </span>
                    <Badge variant="secondary" className="text-[10px]">1..N vòng</Badge>
                  </div>
                  <div className="space-y-2 text-[11px]">
                    <div className="p-2 rounded bg-background/80">
                      <div className="font-semibold text-foreground">Cấp 1: Người nộp (Assignee)</div>
                      <div className="text-muted-foreground mt-0.5">
                        Hành động sửa lỗi + Kế hoạch phòng ngừa + Ảnh/link minh chứng.
                      </div>
                    </div>
                    <div className="p-2 rounded bg-background/80">
                      <div className="font-semibold text-foreground">Cấp 2: Người duyệt (Inspector)</div>
                      <div className="text-muted-foreground mt-0.5">
                        Đánh giá Chấp thuận / Chưa đạt + Ghi chú thẩm định.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Flow Strip */}
              <div className="p-2.5 rounded-lg bg-muted/20 flex items-center justify-between flex-wrap gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  <span>Cơ sở & Lớp</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span>Nhân sự phụ trách</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span>Sự cố QC</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Đợt khắc phục (CAPA)</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 hidden sm:block" />
                <div className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-blue-500" />
                  <span>KPI & Đào tạo lại</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLA MATRIX */}
          {activeTab === 'sla_matrix' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                {/* Critical */}
                <div className="p-3 rounded-lg bg-destructive/10 space-y-1.5">
                  <div className="flex items-center justify-between pb-1 border-b border-destructive/20 font-semibold text-destructive">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" />
                      <span>Khẩn cấp (Critical)</span>
                    </span>
                    <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">2h - 4h</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <p><strong className="text-foreground">Định nghĩa:</strong> An toàn học sinh, mất điện toàn trường, GV vắng không có người thay.</p>
                    <p><strong className="text-foreground">Hạn phản hồi:</strong> 30 phút.</p>
                  </div>
                </div>

                {/* High */}
                <div className="p-3 rounded-lg bg-orange-500/10 space-y-1.5">
                  <div className="flex items-center justify-between pb-1 border-b border-orange-500/20 font-semibold text-orange-600 dark:text-orange-400">
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Cao (High)</span>
                    </span>
                    <span className="text-[10px] bg-orange-500/20 px-1.5 py-0.5 rounded">12h</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <p><strong className="text-foreground">Định nghĩa:</strong> Hỏng máy chiếu/mic trong giờ, phụ huynh khiếu nại gay gắt.</p>
                    <p><strong className="text-foreground">Hạn phản hồi:</strong> 2 giờ.</p>
                  </div>
                </div>

                {/* Medium */}
                <div className="p-3 rounded-lg bg-amber-500/10 space-y-1.5">
                  <div className="flex items-center justify-between pb-1 border-b border-amber-500/20 font-semibold text-amber-600 dark:text-amber-400">
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>Trung bình (Medium)</span>
                    </span>
                    <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">24h</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <p><strong className="text-foreground">Định nghĩa:</strong> Quên điểm danh ca học, chưa chăm sóc HS vắng, nộp giáo án muộn.</p>
                    <p><strong className="text-foreground">Hạn phản hồi:</strong> 4 giờ.</p>
                  </div>
                </div>

                {/* Low */}
                <div className="p-3 rounded-lg bg-sky-500/10 space-y-1.5">
                  <div className="flex items-center justify-between pb-1 border-b border-sky-500/20 font-semibold text-sky-600 dark:text-sky-400">
                    <span className="flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      <span>Thấp (Low)</span>
                    </span>
                    <span className="text-[10px] bg-sky-500/20 px-1.5 py-0.5 rounded">48h - 72h</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <p><strong className="text-foreground">Định nghĩa:</strong> Bảng chưa lau sạch, nhận xét học viên chưa kỹ lưỡng.</p>
                    <p><strong className="text-foreground">Hạn phản hồi:</strong> 12 giờ.</p>
                  </div>
                </div>
              </div>

              {/* 3 Mốc thời hạn */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                  <div>
                    <span className="font-semibold">Quá hạn (Overdue):</span>
                    <span className="text-[11px] text-muted-foreground ml-1">Vượt SLA, ưu tiên ghim đầu bảng.</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold">Đến hạn (Due soon):</span>
                    <span className="text-[11px] text-muted-foreground ml-1">Hạn chót trong ngày, cần tập trung xử lý.</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <span className="font-semibold">Chưa đến hạn:</span>
                    <span className="text-[11px] text-muted-foreground ml-1">Trong thời hạn cho phép.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RACI MATRIX */}
          {activeTab === 'raci' && (
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground pb-1">
                <span className="font-semibold text-primary">R: Phụ trách làm</span>
                <span className="font-semibold text-amber-600">A: Phê duyệt</span>
                <span className="font-semibold text-blue-600">C: Tham vấn</span>
                <span className="font-semibold text-zinc-500">I: Nhận thông tin</span>
              </div>

              <div className="overflow-x-auto rounded-lg bg-muted/20">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-border/50 text-muted-foreground font-semibold">
                      <th className="py-2 px-3">Giai đoạn vận hành</th>
                      <th className="py-2 px-2 text-center">Thanh tra (Inspector)</th>
                      <th className="py-2 px-2 text-center">Người phụ trách (Assignee)</th>
                      <th className="py-2 px-2 text-center">Quản lý cơ sở</th>
                      <th className="py-2 px-2 text-center">Bot tự động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {RACI_ROWS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/30">
                        <td className="py-2 px-3 font-medium text-foreground">{row.activity}</td>
                        <td className="py-2 px-2 text-center font-bold text-primary">{row.inspector}</td>
                        <td className="py-2 px-2 text-center font-medium text-foreground">{row.assignee}</td>
                        <td className="py-2 px-2 text-center text-muted-foreground">{row.branchHead}</td>
                        <td className="py-2 px-2 text-center text-muted-foreground">{row.bot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: CORE BUSINESS RULES */}
          {activeTab === 'rules' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              {CORE_BUSINESS_RULES.map((rule) => (
                <div
                  key={rule.number}
                  className={cn(
                    'p-3 rounded-lg bg-muted/25 space-y-1',
                    rule.number === 5 && 'md:col-span-2'
                  )}
                >
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <span
                      className={cn(
                        'h-5 w-5 rounded flex items-center justify-center shrink-0 text-[11px] font-bold',
                        rule.badgeColorClass
                      )}
                    >
                      {rule.number}
                    </span>
                    <span>{rule.title}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed pl-7 text-[11px]">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
