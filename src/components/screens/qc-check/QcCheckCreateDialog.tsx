'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { BranchSelect, InlineSelect } from '@/components/controls'
import { FieldLabel } from '@/components/shared'
import {
  QC_CHECK_TYPE_LABELS,
  QC_CHECK_CATEGORIES,
  INSPECTOR_OPTIONS,
  type QcCheckType,
} from '@/mocks/qcChecks'
import { BRANCH_OPTIONS } from './qcCheckHelpers'

export interface CreateQcError {
  errorType: string // 'teacher' | 'facility'
  description: string
  severity: string
  evidence: string
  evidenceImage?: string
  inspectorId: string
  area: string
  notes: string
}

export interface CreateQcForm {
  name: string
  type: QcCheckType
  branch: string
  inspectorId: string
  errors: CreateQcError[]
}

function buildEmptyForm(): CreateQcForm {
  return {
    name: '',
    type: 'daily',
    branch: '',
    inspectorId: '',
    errors: [
      {
        errorType: 'teacher',
        description: '',
        severity: 'medium',
        evidence: 'Ghi nhận trực tiếp khi đánh giá',
        evidenceImage: '',
        inspectorId: '',
        area: '',
        notes: '',
      }
    ],
  }
}

interface QcCheckCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (form: CreateQcForm) => void
}

export function QcCheckCreateDialog({ open, onOpenChange, onSubmit }: QcCheckCreateDialogProps) {
  const [form, setForm] = useState<CreateQcForm>(buildEmptyForm)
  const [generalInspectorId, setGeneralInspectorId] = useState('')

  const handleReset = () => {
    setForm(buildEmptyForm())
    setGeneralInspectorId('')
  }

  const handleUpdateErrorField = (index: number, field: keyof CreateQcError, value: string) => {
    setForm((prev) => {
      const nextErrors = [...prev.errors]
      nextErrors[index] = {
        ...nextErrors[index],
        [field]: value,
      }
      return { ...prev, errors: nextErrors }
    })
  }

  const handleAddErrorRow = () => {
    setForm((prev) => {
      const lastError = prev.errors[prev.errors.length - 1]
      return {
        ...prev,
        errors: [
          ...prev.errors,
          {
            errorType: lastError?.errorType || 'teacher',
            description: '',
            severity: 'medium',
            evidence: 'Ghi nhận trực tiếp khi đánh giá',
            evidenceImage: '',
            inspectorId: generalInspectorId,
            area: lastError?.area || '', // pre-populate with last entered area for typing speed
            notes: '',
          },
        ],
      }
    })
  }

  const handleRemoveErrorRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      errors: prev.errors.filter((_, idx) => idx !== index),
    }))
  }

  const handleSubmit = () => {
    if (!form.branch) {
      alert('Vui lòng chọn trường cho đợt kiểm tra.')
      return
    }
    if (!generalInspectorId) {
      alert('Vui lòng chọn Người kiểm tra.')
      return
    }

    // Validate that rows are either completely empty (to be filtered out) or fully completed
    const hasInvalidRow = form.errors.some((err) => {
      const hasSomeContent = err.area.trim() || err.description.trim() || err.notes.trim() || err.evidenceImage
      const isMissingRequired = !err.area.trim() || !err.description.trim()
      return hasSomeContent && isMissingRequired
    })

    if (hasInvalidRow) {
      alert('Vui lòng điền đầy đủ thông tin Khu vực và Mô tả cho tất cả các dòng lỗi đang nhập dở dang.')
      return
    }

    // Filter out completely blank rows
    const activeErrors = form.errors
      .filter((err) => err.area.trim() && err.description.trim())
      .map((err) => ({
        ...err,
        inspectorId: generalInspectorId,
      }))

    onSubmit({
      ...form,
      inspectorId: generalInspectorId,
      errors: activeErrors,
    })
    handleReset()
  }

  const allowedCategories = QC_CHECK_CATEGORIES.filter(
    (c) => c.id === 'teacher' || c.id === 'facility'
  )

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleReset()
        onOpenChange(open)
      }}
    >
      <DialogContent className="max-h-[92vh] w-[95vw] sm:max-w-[1200px] overflow-y-auto p-6" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="border-b border-border/50 pb-3">
          <DialogTitle className="text-xl font-bold">Tạo đợt kiểm tra chất lượng (QC)</DialogTitle>
        </DialogHeader>

        {/* 2-Column Grid Layout: 1/3 Left (col-span-4) vs 2/3 Right (col-span-8) */}
        <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-12">
          
          {/* Left Column: General Info (1/3 width) */}
          <div className="space-y-4 md:border-r md:border-border/50 md:pr-6 md:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary">1. Thông tin chung</h3>
            
            <FieldLabel label="Tên cuộc kiểm tra">
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="VD: Kiểm tra chuyên môn đột xuất..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
              />
            </FieldLabel>

            <FieldLabel label="Loại đợt kiểm tra">
              <InlineSelect
                value={form.type}
                ariaLabel="Loại đợt kiểm tra"
                options={[
                  { value: 'daily', label: QC_CHECK_TYPE_LABELS['daily'] },
                  { value: 'patrol', label: QC_CHECK_TYPE_LABELS['patrol'] },
                  { value: 'monthly', label: QC_CHECK_TYPE_LABELS['monthly'] },
                ]}
                onValueChange={(v) => setForm((p) => ({ ...p, type: v as QcCheckType }))}
              />
            </FieldLabel>

            <FieldLabel label="Trường *">
              <BranchSelect
                value={form.branch}
                branches={BRANCH_OPTIONS}
                variant="inline"
                includeAll={false}
                onValueChange={(v) => setForm((p) => ({ ...p, branch: v }))}
              />
            </FieldLabel>

            <FieldLabel label="Người kiểm tra (Người ghi nhận) *">
              <InlineSelect
                value={generalInspectorId}
                ariaLabel="Chọn người kiểm tra"
                options={[
                  { value: '', label: 'Chọn người kiểm tra...' },
                  ...INSPECTOR_OPTIONS.map((i) => ({ value: i.id, label: i.name })),
                ]}
                onValueChange={setGeneralInspectorId}
              />
            </FieldLabel>

            {form.errors.filter(e => e.area.trim() && e.description.trim()).length > 0 && (
              <div className="mt-4 bg-primary/5 rounded-lg border border-primary/20 p-3 text-xs text-primary font-medium flex items-center justify-between">
                <span>Số lượng lỗi đã nhập đủ:</span>
                <span className="text-sm font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {form.errors.filter(e => e.area.trim() && e.description.trim()).length}
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Inline Multi-Error Logging (2/3 width) */}
          <div className="space-y-3.5 md:col-span-8 flex flex-col min-h-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-primary">2. Ghi nhận lỗi</h3>
            
            {/* Header row for error list (only on desktop md screens) */}
            <div className="hidden md:flex items-center gap-3 px-3 text-[10px] font-bold text-muted-foreground uppercase tracking-wider shrink-0 mb-0.5">
              <div className="w-7 text-center shrink-0">#</div>
              <div className="flex-1 grid grid-cols-12 gap-2.5">
                <div className="col-span-3">Hạng mục & Mức độ</div>
                <div className="col-span-5">Khu vực & Mô tả chi tiết lỗi *</div>
                <div className="col-span-4">Ghi chú & Ảnh bằng chứng</div>
              </div>
            </div>

            {/* Scrollable Error Cards Container */}
            <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1 min-h-0">
              {form.errors.map((error, idx) => (
                <div
                  key={idx}
                  className="relative rounded-md border border-border bg-card p-2 shadow-xs transition-all hover:border-primary/30 flex gap-2.5 items-stretch"
                >
                  {/* Left Column: Index & Delete */}
                  <div className="w-7 shrink-0 flex flex-col justify-center items-center border-r border-border/40 pr-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground">#{idx + 1}</span>
                    {form.errors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveErrorRow(idx)}
                        className="text-muted-foreground hover:text-destructive mt-1.5 transition-colors"
                        aria-label="Xóa dòng lỗi"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Right Column: Form Inputs Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2">
                    {/* Col 1: Category & Severity */}
                    <div className="md:col-span-3 flex flex-col justify-between gap-1">
                      {/* Category select buttons */}
                      <div className="flex gap-1 h-6.5 shrink-0">
                        {allowedCategories.map((cat) => (
                          <button
                            type="button"
                            key={cat.id}
                            onClick={() => handleUpdateErrorField(idx, 'errorType', cat.id)}
                            className={`flex-1 rounded-md text-[10px] font-bold border transition-all ${
                              error.errorType === cat.id
                                ? 'bg-primary/10 border-primary text-primary shadow-xs'
                                : 'bg-background border-border text-muted-foreground hover:bg-muted/50'
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Severity select dropdown */}
                      <InlineSelect
                        value={error.severity}
                        ariaLabel="Mức độ nghiêm trọng"
                        className="h-6.5 text-[10px] py-0"
                        options={[
                          { value: 'low', label: 'Thấp' },
                          { value: 'medium', label: 'Trung bình' },
                          { value: 'high', label: 'Cao' },
                          { value: 'critical', label: 'Nghiêm trọng' },
                        ]}
                        onValueChange={(val) => handleUpdateErrorField(idx, 'severity', val)}
                      />
                    </div>

                    {/* Col 2: Area & Description */}
                    <div className="md:col-span-5 flex flex-col justify-between gap-1">
                      {/* Area input */}
                      <input
                        type="text"
                        value={error.area}
                        onChange={(e) => handleUpdateErrorField(idx, 'area', e.target.value)}
                        placeholder="Khu vực * (VD: Phòng A201)"
                        className="flex h-6.5 w-full rounded-md border border-input bg-transparent px-2 text-[10px] shadow-xs placeholder:text-muted-foreground/75"
                      />

                      {/* Description input */}
                      <input
                        type="text"
                        value={error.description}
                        onChange={(e) => handleUpdateErrorField(idx, 'description', e.target.value)}
                        placeholder="Mô tả chi tiết lỗi phát hiện được... *"
                        className="flex h-6.5 w-full rounded-md border border-input bg-transparent px-2 text-[10px] shadow-xs placeholder:text-muted-foreground/75"
                      />
                    </div>

                    {/* Col 3: Notes & Evidence Upload */}
                    <div className="md:col-span-4 flex flex-col justify-between gap-1">
                      {/* Notes input */}
                      <input
                        type="text"
                        value={error.notes}
                        onChange={(e) => handleUpdateErrorField(idx, 'notes', e.target.value)}
                        placeholder="Ghi chú thêm cho lỗi này..."
                        className="flex h-6.5 w-full rounded-md border border-input bg-transparent px-2 text-[10px] shadow-xs placeholder:text-muted-foreground/75"
                      />

                      {/* Image upload preview row */}
                      <div className="flex items-center gap-1.5 h-6.5">
                        <label className="flex h-full flex-1 cursor-pointer items-center justify-center rounded-md border border-dashed border-border hover:bg-muted/40 transition-colors text-[9px] font-semibold text-muted-foreground">
                          <span>+ Ảnh bằng chứng</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleUpdateErrorField(idx, 'evidenceImage', URL.createObjectURL(file))
                              }
                            }}
                            className="hidden"
                          />
                        </label>

                        {error.evidenceImage && (
                          <div className="relative group w-9 h-full rounded border overflow-hidden shrink-0 cursor-zoom-in">
                            <img src={error.evidenceImage} alt="Preview" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleUpdateErrorField(idx, 'evidenceImage', '')}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[8px] font-bold transition-opacity"
                            >
                              Xóa
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Error Row Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddErrorRow}
              className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5 font-semibold text-xs h-9 mt-1.5 shrink-0"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Thêm dòng ghi lỗi mới
            </Button>
          </div>
        </div>

        <DialogFooter className="mt-6 border-t border-border/50 pt-4 flex w-full items-center justify-between sm:justify-between shrink-0">
          <div className="text-xs text-muted-foreground font-medium">
            Tổng cộng: <span className="font-bold text-foreground">{form.errors.filter(e => e.area.trim() && e.description.trim()).length}</span> lỗi hoàn thiện
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} disabled={!form.branch || !generalInspectorId}>
              Tạo đợt QC
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
