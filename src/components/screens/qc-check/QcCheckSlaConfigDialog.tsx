'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  SlidersHorizontal,
  Clock,
  RotateCcw,
  CheckCircle2,
  FileCheck2,
  Award,
  Sparkles,
  Edit2,
  Undo2,
  Save,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  type QcCriteriaSlaConfig,
  DEFAULT_SLA_CONFIGS,
  REVIEWER_ROLE_LABELS,
} from './qcCheckSlaTypes'
import { QC_TARGET_GROUP_LABELS } from '@/mocks/qcChecks'
import { cn } from '@/lib/utils'

interface QcCheckSlaConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (configs: QcCriteriaSlaConfig[]) => void
}

export function QcCheckSlaConfigDialog({
  open,
  onOpenChange,
  onSave,
}: QcCheckSlaConfigDialogProps) {
  const [configs, setConfigs] = useState<QcCriteriaSlaConfig[]>(DEFAULT_SLA_CONFIGS)
  const [activeGroup, setActiveGroup] = useState<string>('all')
  const [editingConfig, setEditingConfig] = useState<QcCriteriaSlaConfig | null>(null)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  // Lọc danh sách theo nhóm đối tượng
  const filteredConfigs = configs.filter((c) => {
    if (activeGroup === 'all') return true
    return c.targetGroup === activeGroup
  })

  // Bật/tắt trạng thái áp dụng tiêu chí
  const handleToggleActive = (id: string, active: boolean) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: active } : c))
    )
    setHasChanges(true)
  }

  // Mở form chỉnh sửa 1 tiêu chí
  const handleStartEdit = (config: QcCriteriaSlaConfig) => {
    setEditingConfig({ ...config })
  }

  // Lưu chỉnh sửa 1 tiêu chí vào danh sách tạm
  const handleSaveEdit = () => {
    if (!editingConfig) return
    setConfigs((prev) =>
      prev.map((c) => (c.id === editingConfig.id ? editingConfig : c))
    )
    setEditingConfig(null)
    setHasChanges(true)
    toast.success(`Đã cập nhật tiêu chí "${editingConfig.name}"`)
  }

  // Khôi phục cài đặt gốc
  const handleResetDefaults = () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ tiêu chí & SLA về mặc định của hệ thống?')) {
      setConfigs(DEFAULT_SLA_CONFIGS)
      setHasChanges(true)
      toast.info('Đã khôi phục các tiêu chí SLA về cấu hình chuẩn')
    }
  }

  // Lưu toàn bộ cài đặt
  const handleSaveAll = () => {
    onSave?.(configs)
    setHasChanges(false)
    toast.success('Đã lưu thành công bộ thiết lập Tiêu chí & SLA QC!')
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[92vh] w-[95vw] sm:max-w-[1000px] overflow-hidden flex flex-col p-0 gap-0">
          {/* Header */}
          <DialogHeader className="shrink-0 px-5 py-3.5 border-b bg-card">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <SlidersHorizontal className="h-4 w-4" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    Thiết lập Tiêu chí & Cam kết SLA QC
                    {hasChanges && (
                      <span className="text-[11px] font-normal text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        Chưa lưu thay đổi
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Cấu hình thời hạn xử lý (SLA), ngưỡng cảnh báo tái phạm và quy chuẩn nghiệm thu theo từng nhóm lỗi.
                  </DialogDescription>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetDefaults}
                  className="h-8 text-xs gap-1.5"
                >
                  <Undo2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Khôi phục mặc định
                </Button>
              </div>
            </div>

            {/* Tabs Filter theo nhóm */}
            <div className="pt-2.5">
              <Tabs value={activeGroup} onValueChange={setActiveGroup} className="w-full">
                <TabsList className="h-8 p-0.5 bg-muted/60">
                  <TabsTrigger value="all" className="text-xs px-3 h-7">
                    Tất cả ({configs.length})
                  </TabsTrigger>
                  <TabsTrigger value="teacher" className="text-xs px-3 h-7">
                    👨‍🏫 Giáo viên ({configs.filter((c) => c.targetGroup === 'teacher').length})
                  </TabsTrigger>
                  <TabsTrigger value="facility" className="text-xs px-3 h-7">
                    🏢 Cơ sở vật chất ({configs.filter((c) => c.targetGroup === 'facility').length})
                  </TabsTrigger>
                  <TabsTrigger value="operations" className="text-xs px-3 h-7">
                    🎧 Vận hành & CS ({configs.filter((c) => c.targetGroup === 'operations').length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </DialogHeader>

          {/* Body: Danh sách tiêu chí */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {filteredConfigs.map((cfg) => {
                return (
                  <div
                    key={cfg.id}
                    className={cn(
                      'rounded-lg border p-3.5 transition-all bg-card/60 hover:bg-card flex flex-col gap-2.5',
                      !cfg.isActive && 'opacity-60 bg-muted/20'
                    )}
                  >
                    {/* Hàng 1: Tiêu đề + Trạng thái bật/tắt + Nút Sửa */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-foreground">
                            {cfg.name}
                          </h4>
                          <Badge variant="outline" className="text-[10px] font-medium px-1.5 py-0">
                            {QC_TARGET_GROUP_LABELS[cfg.targetGroup]}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            #{cfg.criteria}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {cfg.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Label htmlFor={`switch-${cfg.id}`} className="text-xs cursor-pointer">
                            {cfg.isActive ? 'Áp dụng' : 'Tạm tắt'}
                          </Label>
                          <Switch
                            id={`switch-${cfg.id}`}
                            checked={cfg.isActive}
                            onCheckedChange={(checked) => handleToggleActive(cfg.id, checked)}
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(cfg)}
                          className="h-7 px-2 text-xs gap-1 hover:bg-accent cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 text-muted-foreground" />
                          <span>Chỉnh sửa</span>
                        </Button>
                      </div>
                    </div>

                    {/* Hàng 2: Khung thông số SLA & Quy chuẩn */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-1 border-t border-border/60 text-xs">
                      {/* Cột SLA thời hạn */}
                      <div className="space-y-1 bg-muted/30 p-2 rounded border border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" />
                          Thời hạn SLA (giờ)
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span className="text-[11px] px-1.5 py-0.2 rounded font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Nghiêm trọng: {cfg.slaHours.critical}h
                          </span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            Cao: {cfg.slaHours.high}h
                          </span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded font-mono text-muted-foreground bg-background border">
                            Vừa: {cfg.slaHours.medium}h
                          </span>
                        </div>
                      </div>

                      {/* Cột Cảnh báo lặp lại */}
                      <div className="space-y-1 bg-muted/30 p-2 rounded border border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <RotateCcw className="h-3 w-3 text-amber-600" />
                          Ngưỡng tái phạm
                        </span>
                        <div className="pt-0.5 text-xs text-foreground">
                          Từ <strong className="text-amber-700 dark:text-amber-400 font-bold">{cfg.recurrenceThreshold} lần</strong> / {cfg.recurrencePeriodDays} ngày
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Bắt buộc lập phương án phòng ngừa
                        </p>
                      </div>

                      {/* Cột Bằng chứng & Nghiệm thu */}
                      <div className="space-y-1 bg-muted/30 p-2 rounded border border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <FileCheck2 className="h-3 w-3 text-emerald-600" />
                          Quy chuẩn giải trình
                        </span>
                        <div className="space-y-0.5 pt-0.5">
                          <div className="flex items-center gap-1 text-[11px]">
                            <Check className={cn('h-3 w-3', cfg.requireEvidence ? 'text-emerald-600' : 'text-muted-foreground/40')} />
                            <span>{cfg.requireEvidence ? 'Bắt buộc ảnh/link minh chứng' : 'Không bắt buộc ảnh'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px]">
                            <Check className={cn('h-3 w-3', cfg.requireApproval ? 'text-emerald-600' : 'text-muted-foreground/40')} />
                            <span>{cfg.requireApproval ? `Duyệt: ${REVIEWER_ROLE_LABELS[cfg.defaultReviewerRole]}` : 'Tự động đóng khi nộp'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Cột Điểm trừ KPI */}
                      <div className="space-y-1 bg-muted/30 p-2 rounded border border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                          <Award className="h-3 w-3 text-destructive" />
                          Trừ điểm KPI
                        </span>
                        <div className="flex items-center gap-1 flex-wrap pt-0.5 text-[11px] font-mono">
                          <span className="text-destructive font-semibold">-{cfg.kpiPenaltyPoints.critical}đ (Khẩn)</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-amber-700">-{cfg.kpiPenaltyPoints.high}đ (Cao)</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">-{cfg.kpiPenaltyPoints.low}đ (Nhẹ)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="shrink-0 px-5 py-3 border-t bg-card flex items-center justify-between sm:justify-between">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>SLA áp dụng tự động tính giờ đến hạn và gán nhãn quá hạn khi thanh tra tạo lỗi.</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs"
              >
                Đóng
              </Button>
              <Button
                size="sm"
                onClick={handleSaveAll}
                className="h-8 text-xs font-semibold gap-1.5 bg-primary"
              >
                <Save className="h-3.5 w-3.5" />
                Lưu thiết lập
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sub-Dialog: Chỉnh sửa chi tiết một tiêu chí */}
      {editingConfig && (
        <Dialog open={!!editingConfig} onOpenChange={(open) => !open && setEditingConfig(null)}>
          <DialogContent className="max-w-[550px] p-5 space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-primary" />
                Cấu hình tiêu chí: {editingConfig.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Tùy chỉnh thời gian cam kết SLA, ngưỡng tái phạm và phân quyền phê duyệt.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 text-xs">
              {/* Nhóm SLA giờ */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  Thời hạn xử lý SLA theo mức độ (Tính bằng giờ)
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-rose-700">Nghiêm trọng</span>
                    <Input
                      type="number"
                      min={1}
                      value={editingConfig.slaHours.critical}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          slaHours: { ...editingConfig.slaHours, critical: Number(e.target.value) || 1 },
                        })
                      }
                      className="h-8 text-xs text-center font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-amber-700">Mức Cao</span>
                    <Input
                      type="number"
                      min={1}
                      value={editingConfig.slaHours.high}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          slaHours: { ...editingConfig.slaHours, high: Number(e.target.value) || 1 },
                        })
                      }
                      className="h-8 text-xs text-center font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Mức Vừa</span>
                    <Input
                      type="number"
                      min={1}
                      value={editingConfig.slaHours.medium}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          slaHours: { ...editingConfig.slaHours, medium: Number(e.target.value) || 1 },
                        })
                      }
                      className="h-8 text-xs text-center"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">Mức Nhẹ</span>
                    <Input
                      type="number"
                      min={1}
                      value={editingConfig.slaHours.low}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          slaHours: { ...editingConfig.slaHours, low: Number(e.target.value) || 1 },
                        })
                      }
                      className="h-8 text-xs text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Ngưỡng lặp lại */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Ngưỡng cảnh báo lặp lại</Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={editingConfig.recurrenceThreshold}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          recurrenceThreshold: Number(e.target.value) || 2,
                        })
                      }
                      className="h-8 text-xs w-20 text-center font-bold"
                    />
                    <span className="text-muted-foreground text-xs">lần (bắt buộc phòng ngừa)</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Chu kỳ theo dõi tái phạm</Label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="number"
                      min={7}
                      max={365}
                      value={editingConfig.recurrencePeriodDays}
                      onChange={(e) =>
                        setEditingConfig({
                          ...editingConfig,
                          recurrencePeriodDays: Number(e.target.value) || 30,
                        })
                      }
                      className="h-8 text-xs w-20 text-center font-bold"
                    />
                    <span className="text-muted-foreground text-xs">ngày gần nhất</span>
                  </div>
                </div>
              </div>

              {/* Quy chuẩn minh chứng & duyệt */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-xs font-bold text-foreground">Quy định xử lý & Nghiệm thu</Label>

                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border">
                  <div>
                    <div className="font-semibold">Bắt buộc ảnh/link minh chứng khi khắc phục</div>
                    <div className="text-[11px] text-muted-foreground">Không cho nộp giải trình trống hoặc chỉ có chữ</div>
                  </div>
                  <Switch
                    checked={editingConfig.requireEvidence}
                    onCheckedChange={(checked) =>
                      setEditingConfig({ ...editingConfig, requireEvidence: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-muted/40 border">
                  <div>
                    <div className="font-semibold">Bắt buộc Cấp 2 nghiệm thu duyệt đạt</div>
                    <div className="text-[11px] text-muted-foreground">Nếu tắt, sự cố sẽ tự động đóng ngay khi nhân sự nộp giải trình</div>
                  </div>
                  <Switch
                    checked={editingConfig.requireApproval}
                    onCheckedChange={(checked) =>
                      setEditingConfig({ ...editingConfig, requireApproval: checked })
                    }
                  />
                </div>
              </div>

              {/* Vai trò duyệt mặc định */}
              <div className="space-y-1 pt-2 border-t">
                <Label className="text-xs font-semibold">Người duyệt nghiệm thu mặc định (Cấp 2)</Label>
                <select
                  value={editingConfig.defaultReviewerRole}
                  onChange={(e) =>
                    setEditingConfig({
                      ...editingConfig,
                      defaultReviewerRole: e.target.value as QcCriteriaSlaConfig['defaultReviewerRole'],
                    })
                  }
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="qc_inspector">Thanh tra viên QC (Mặc định)</option>
                  <option value="branch_manager">Trưởng cơ sở (Branch Manager)</option>
                  <option value="academic_lead">Trưởng bộ môn (Academic Lead)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingConfig(null)}
                className="h-8 text-xs"
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className="h-8 text-xs font-semibold gap-1 bg-primary"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Cập nhật tiêu chí
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
