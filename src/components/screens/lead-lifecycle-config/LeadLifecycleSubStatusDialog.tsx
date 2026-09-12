'use client'

import React, { useState, useEffect } from 'react'
import {
  PipelineStageConfig,
  PipelineSubStatusConfig,
} from './leadLifecycleTypes'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { FieldLabel } from '@/components/shared'
import { Lock, AlertCircle, Link2, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadLifecycleSubStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stage: PipelineStageConfig | null
  initialSubStatus?: PipelineSubStatusConfig | null
  onSaveSubStatus: (stageId: string, subStatus: PipelineSubStatusConfig) => void
  onDeleteSubStatus?: (stageId: string, subStatusId: string) => void
}

const COLOR_PRESETS = [
  { value: '#64c8f5', label: 'Xanh lơ' },
  { value: '#38bdf8', label: 'Xanh sky' },
  { value: '#3b82f6', label: 'Xanh dương' },
  { value: '#10b981', label: 'Xanh ngọc' },
  { value: '#059669', label: 'Xanh lá' },
  { value: '#fbbf24', label: 'Vàng hổ phách' },
  { value: '#f59e0b', label: 'Cam nhạt' },
  { value: '#ea580c', label: 'Cam đậm' },
  { value: '#f87171', label: 'Đỏ nhạt' },
  { value: '#ef4444', label: 'Đỏ tươi' },
  { value: '#ec4899', label: 'Hồng sen' },
  { value: '#a855f7', label: 'Tím' },
  { value: '#6366f1', label: 'Chàm' },
  { value: '#64748b', label: 'Xám đá' },
]

export const LeadLifecycleSubStatusDialog: React.FC<LeadLifecycleSubStatusDialogProps> = ({
  open,
  onOpenChange,
  stage,
  initialSubStatus,
  onSaveSubStatus,
  onDeleteSubStatus,
}) => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [requiresNote, setRequiresNote] = useState(false)
  const [suggestsCallback, setSuggestsCallback] = useState(false)
  const [description, setDescription] = useState('')
  const [validationError, setValidationError] = useState('')

  const isEditing = Boolean(initialSubStatus)
  const isSystemLabel = initialSubStatus?.origin === 'system'

  useEffect(() => {
    if (open) {
      if (initialSubStatus) {
        setName(initialSubStatus.name)
        setCode(initialSubStatus.code)
        setColor(initialSubStatus.color || '#3b82f6')
        setRequiresNote(Boolean(initialSubStatus.requiresNote))
        setSuggestsCallback(Boolean(initialSubStatus.suggestsCallback))
        setDescription(initialSubStatus.description || '')
      } else {
        setName('')
        setCode('')
        setColor(stage?.color || '#3b82f6')
        setRequiresNote(false)
        setSuggestsCallback(false)
        setDescription('')
      }
      setValidationError('')
    }
  }, [open, initialSubStatus, stage])

  const handleNameChange = (val: string) => {
    setName(val)
    if (!isEditing && !code) {
      // Tự sinh mã code slug tiếng Việt không dấu
      const slug = val
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .trim()
        .replace(/\s+/g, '_')
        .toUpperCase()
      setCode(slug)
    }
  }

  const handleSave = () => {
    // Không cho phép chỉnh sửa nhãn hệ thống
    if (isSystemLabel) return
    if (!stage) return
    if (!name.trim()) {
      setValidationError('Vui lòng nhập tên nhãn trạng thái')
      return
    }
    if (!code.trim()) {
      setValidationError('Vui lòng nhập mã viết tắt (Code)')
      return
    }

    const updatedSubStatus: PipelineSubStatusConfig = {
      id: initialSubStatus?.id || `sub-${Date.now()}`,
      code: code.trim().toUpperCase(),
      name: name.trim(),
      color,
      origin: 'custom', // Chỉ cho phép tạo hoặc lưu nhãn tùy biến
      leadCount: initialSubStatus?.leadCount || 0,
      requiresNote,
      suggestsCallback,
      description: description.trim(),
      isActive: initialSubStatus ? initialSubStatus.isActive : true,
      isSystemCore: false,
    }

    onSaveSubStatus(stage.id, updatedSubStatus)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-5">
        <DialogHeader className="pb-3 border-b">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-base font-semibold text-foreground">
              {isSystemLabel
                ? 'Thông tin Nhãn Hệ thống'
                : isEditing
                ? 'Chỉnh sửa Nhãn'
                : 'Thêm Nhãn Mới'}
            </DialogTitle>
            {isSystemLabel && (
              <Badge variant="outline" className="gap-1 text-xs font-normal border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
                <Lock className="h-3 w-3" />
                Cố định Hệ thống
              </Badge>
            )}
          </div>
          {stage && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Giai đoạn: <span className="font-semibold text-foreground">{stage.name}</span>{' '}
              <span className="font-mono text-[11px]">({stage.code})</span>
            </p>
          )}
        </DialogHeader>

        {/* 1. TRƯỜNG HỢP: NHÃN HỆ THỐNG (CHỈ XEM, KHÔNG TÙY BIẾN) */}
        {isSystemLabel && initialSubStatus ? (
          <div className="space-y-3.5 py-2 text-xs">
            {/* Banner Thông báo Khóa Nhãn Hệ Thống */}
            <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/60 dark:bg-blue-950/30 dark:border-blue-900/60 flex items-start gap-2.5">
              <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-blue-950 dark:text-blue-200">
                  Nhãn liên kết hệ thống cố định
                </div>
                <div className="text-blue-800 dark:text-blue-300 text-[11px] mt-0.5 leading-relaxed">
                  Nhãn này được tự động kích hoạt bởi phân hệ{' '}
                  <strong className="underline underline-offset-2">
                    {initialSubStatus.systemModuleLabel || 'Nghiệp vụ cốt lõi'}
                  </strong>{' '}
                  khi có sự kiện phát sinh trong quy trình. Hệ thống không cho phép tùy biến hoặc xóa bỏ nhãn này để đảm bảo tính toàn vẹn dữ liệu.
                </div>
              </div>
            </div>

            {/* Chi tiết Nhãn Hệ thống (Read-Only) */}
            <div className="space-y-2.5 bg-muted/20 p-3.5 rounded-lg border border-border/70">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground text-[11px] block">Tên nhãn trạng thái</span>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-foreground mt-0.5">
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: initialSubStatus.color }}
                    />
                    <span>{initialSubStatus.name}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Mã kỹ thuật (Code)</span>
                  <span className="font-mono text-xs font-semibold text-foreground mt-0.5 block">
                    {initialSubStatus.code}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/50">
                <div>
                  <span className="text-muted-foreground text-[11px] block">Phân hệ liên kết</span>
                  <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300 font-medium mt-0.5">
                    <Link2 className="h-3 w-3" />
                    <span>{initialSubStatus.systemModuleLabel || 'Tự động hệ thống'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px] block">Sự kiện kích hoạt</span>
                  <span className="text-xs text-foreground mt-0.5 block">
                    {initialSubStatus.systemEventTrigger || 'Khi phát sinh giao dịch/lịch hẹn'}
                  </span>
                </div>
              </div>

              {initialSubStatus.description && (
                <div className="pt-2 border-t border-border/50">
                  <span className="text-muted-foreground text-[11px] block">Mô tả / Hướng dẫn</span>
                  <p className="text-xs text-foreground mt-0.5 italic">
                    {initialSubStatus.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 2. TRƯỜNG HỢP: NHÃN TÙY BIẾN (TẠO MỚI HOẶC CHỈNH SỬA) */
          <div className="space-y-3.5 py-2 text-xs">
            {validationError && (
              <div className="p-2.5 rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Tên Nhãn & Mã Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <FieldLabel required>Tên Nhãn</FieldLabel>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Hẹn gọi lại sau, Bố mẹ đang bận..."
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel required>Mã Code</FieldLabel>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: HEN_GOI_LAI"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Bảng Màu Sắc Nhận Diện */}
            <div className="space-y-1.5">
              <FieldLabel>Màu sắc Nhận diện</FieldLabel>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setColor(preset.value)}
                    className={cn(
                      'h-6 w-6 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center transition-transform cursor-pointer',
                      color === preset.value && 'scale-115 ring-2 ring-primary ring-offset-2'
                    )}
                    style={{ backgroundColor: preset.value }}
                    title={preset.label}
                  />
                ))}
                <div className="ml-2 flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <span>Mã:</span>
                  <span className="font-semibold text-foreground">{color}</span>
                </div>
              </div>
            </div>

            {/* Ràng buộc Nghiệp vụ */}
            <div className="p-2.5 rounded-lg border border-border bg-muted/20 space-y-2">
              <span className="font-medium text-xs text-foreground block">
                Quy tắc &amp; Ràng buộc Tác nghiệp
              </span>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={requiresNote}
                    onCheckedChange={(checked) => setRequiresNote(Boolean(checked))}
                  />
                  <span className="text-xs text-foreground">
                    Bắt buộc nhập lý do / ghi chú khi chọn nhãn này
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={suggestsCallback}
                    onCheckedChange={(checked) => setSuggestsCallback(Boolean(checked))}
                  />
                  <span className="text-xs text-foreground">
                    Tự động gợi ý mở lịch hẹn gọi lại chăm sóc (Callback)
                  </span>
                </label>
              </div>
            </div>

            {/* Mô tả / Hướng dẫn áp dụng */}
            <div className="space-y-1">
              <FieldLabel>Mô tả / Hướng dẫn Sử dụng</FieldLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập ghi chú hướng dẫn tư vấn viên khi áp dụng nhãn này..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>
          </div>
        )}

        <DialogFooter className="pt-2 border-t flex flex-row items-center justify-between sm:justify-between gap-2 w-full">
          {isSystemLabel ? (
            <div className="flex items-center justify-end w-full">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs cursor-pointer"
              >
                Đóng
              </Button>
            </div>
          ) : (
            <>
              <div>
                {isEditing && !isSystemLabel && onDeleteSubStatus && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (stage && initialSubStatus) {
                        onOpenChange(false)
                        onDeleteSubStatus(stage.id, initialSubStatus.id)
                      }
                    }}
                    className="h-8 text-xs gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Xóa nhãn</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 text-xs cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
                >
                  {isEditing ? 'Lưu cập nhật' : 'Thêm nhãn'}
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

