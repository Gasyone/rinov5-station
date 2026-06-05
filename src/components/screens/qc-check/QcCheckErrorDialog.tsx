'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InlineSelect } from '@/components/controls'
import { FieldLabel } from '@/components/shared'
import { Checkbox } from '@/components/ui/checkbox'
import { Link, Image as ImageIcon, Sparkles, Check } from 'lucide-react'
import {
  QC_ERROR_SEVERITY_LABELS,
  QC_ERROR_STATUS_LABELS,
  QC_ERROR_TYPE_LABELS,
  QC_CHECK_ITEMS,
  QC_CHECK_CATEGORIES,
  type QcError,
  type QcErrorSeverity,
  type QcErrorStatus,
  type QcCheckItemCategory,
  type QcErrorType,
} from '@/mocks/qcChecks'

export interface QcErrorForm {
  itemId: string
  errorType: QcErrorType
  description: string
  severity: QcErrorSeverity
  status: QcErrorStatus
  evidence: string
  evidenceLink?: string
  evidenceImage?: string
  requiresCorrectiveAction: boolean
  correctiveAction: string
  correctiveEvidence: string
  correctiveLink?: string
  correctiveImage?: string
  assignee: string
  notes: string
  deadline?: string
}

const SAMPLE_IMAGES = [
  {
    name: 'Phòng bừa bộn',
    url: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=400',
    category: 'classroom',
  },
  {
    name: 'Thiết bị lỗi',
    url: 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=400',
    category: 'equipment',
  },
  {
    name: 'Vệ sinh chưa sạch',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    category: 'hygiene',
  },
  {
    name: 'Mất an toàn',
    url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    category: 'safety',
  },
]

function buildEmptyForm(): QcErrorForm {
  return {
    itemId: '',
    errorType: 'process',
    description: '',
    severity: 'medium',
    status: 'open',
    evidence: '',
    evidenceLink: '',
    evidenceImage: '',
    requiresCorrectiveAction: false,
    correctiveAction: '',
    correctiveEvidence: '',
    correctiveLink: '',
    correctiveImage: '',
    assignee: '',
    notes: '',
    deadline: '',
  }
}

interface QcCheckErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (form: QcErrorForm) => void
  initialData?: QcError | null
  mode?: 'create' | 'edit'
}

export function QcCheckErrorDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
  mode = 'create',
}: QcCheckErrorDialogProps) {
  const [form, setForm] = useState<QcErrorForm>(buildEmptyForm)
  const [activeCategory, setActiveCategory] = useState<QcCheckItemCategory>('classroom')

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        if (initialData) {
          setForm({
            itemId: initialData.itemId,
            errorType: initialData.errorType,
            description: initialData.description,
            severity: initialData.severity,
            status: initialData.status,
            evidence: initialData.evidence,
            evidenceLink: initialData.evidenceLink || '',
            evidenceImage: initialData.evidenceImage || '',
            requiresCorrectiveAction: initialData.requiresCorrectiveAction,
            correctiveAction: initialData.correctiveAction || '',
            correctiveEvidence: initialData.correctiveEvidence || '',
            correctiveLink: initialData.correctiveLink || '',
            correctiveImage: initialData.correctiveImage || '',
            assignee: initialData.assignee || '',
            notes: initialData.notes || '',
            deadline: initialData.deadline || '',
          })
          const item = QC_CHECK_ITEMS.find((i) => i.id === initialData.itemId)
          if (item) {
            setActiveCategory(item.category)
          }
        } else {
          setForm(buildEmptyForm())
          setActiveCategory('classroom')
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [open, initialData])

  const handleReset = () => {
    setForm(buildEmptyForm())
    setActiveCategory('classroom')
  }

  const handleSubmit = () => {
    if (!form.itemId || !form.description || !form.evidence) return
    onSubmit(form)
    handleReset()
  }

  const filteredItems = QC_CHECK_ITEMS.filter((item) => item.category === activeCategory)
  const selectedItem = QC_CHECK_ITEMS.find((i) => i.id === form.itemId)

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleReset()
        onOpenChange(open)
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Ghi nhận lỗi QC' : 'Chỉnh sửa lỗi QC / Phương án khắc phục'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Mô tả lỗi, đính kèm bằng chứng trực quan và chỉ định người khắc phục.'
              : 'Cập nhật nội dung lỗi hoặc phương án & bằng chứng khắc phục mới gửi lại QC duyệt.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Hạng mục & loại lỗi */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel label="Hạng mục lỗi">
                <div className="mb-2 flex flex-wrap gap-1">
                  {QC_CHECK_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`rounded-md px-2 py-1 text-xs transition-colors ${
                        activeCategory === cat.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                <InlineSelect
                  value={form.itemId}
                  ariaLabel="Hạng mục lỗi"
                  options={[
                    { value: '', label: 'Chọn hạng mục' },
                    ...filteredItems.map((item) => ({ value: item.id, label: item.label })),
                  ]}
                  onValueChange={(v) => setForm((p) => ({ ...p, itemId: v }))}
                />
              </FieldLabel>
              {selectedItem && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Danh mục: {QC_CHECK_CATEGORIES.find((c) => c.id === selectedItem.category)?.label}
                </p>
              )}
            </div>
            <FieldLabel label="Loại lỗi">
              <InlineSelect
                value={form.errorType}
                ariaLabel="Loại lỗi"
                options={Object.entries(QC_ERROR_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                onValueChange={(v) => setForm((p) => ({ ...p, errorType: v as QcErrorType }))}
              />
            </FieldLabel>
          </div>

          {/* Mức độ & Trạng thái */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel label="Mức độ nghiêm trọng">
              <InlineSelect
                value={form.severity}
                ariaLabel="Mức độ nghiêm trọng"
                options={Object.entries(QC_ERROR_SEVERITY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                onValueChange={(v) => setForm((p) => ({ ...p, severity: v as QcErrorSeverity }))}
              />
            </FieldLabel>
            <FieldLabel label="Trạng thái lỗi">
              <InlineSelect
                value={form.status}
                ariaLabel="Trạng thái lỗi"
                options={Object.entries(QC_ERROR_STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                onValueChange={(v) => setForm((p) => ({ ...p, status: v as QcErrorStatus }))}
              />
            </FieldLabel>
          </div>

          {/* Mô tả */}
          <FieldLabel label="Mô tả lỗi *">
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Mô tả chi tiết lỗi phát hiện..."
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
            />
          </FieldLabel>

          {/* Bằng chứng lỗi & Đính kèm */}
          <div className="space-y-3 rounded-md border bg-slate-50/50 p-4 dark:bg-slate-900/30">
            <h4 className="text-sm font-semibold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Bằng chứng phát hiện lỗi *
            </h4>

            <FieldLabel label="Chi tiết bằng chứng *">
              <textarea
                rows={2}
                value={form.evidence}
                onChange={(e) => setForm((p) => ({ ...p, evidence: e.target.value }))}
                placeholder="Mô tả bằng chứng: ảnh chụp, log, kết quả đo..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
              />
            </FieldLabel>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldLabel label="Liên kết đính kèm (Link)">
                <div className="relative">
                  <Link className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.evidenceLink}
                    onChange={(e) => setForm((p) => ({ ...p, evidenceLink: e.target.value }))}
                    placeholder="https://example.com/proof"
                    className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs"
                  />
                </div>
              </FieldLabel>

              <FieldLabel label="Đường dẫn ảnh bằng chứng (URL)">
                <div className="relative">
                  <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="url"
                    value={form.evidenceImage}
                    onChange={(e) => setForm((p) => ({ ...p, evidenceImage: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs"
                  />
                </div>
              </FieldLabel>
            </div>

            {/* Presets picker */}
            <div>
              <span className="text-xs text-muted-foreground font-medium block mb-2">Chọn nhanh ảnh mẫu minh họa:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_IMAGES.map((img) => (
                  <button
                    key={img.url}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, evidenceImage: img.url }))}
                    className={`group relative overflow-hidden rounded-md border text-left text-xs transition-all hover:border-primary ${
                      form.evidenceImage === img.url ? 'border-primary ring-1 ring-primary' : 'border-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 p-1.5 pr-2">
                      <img src={img.url} alt={img.name} className="h-6 w-6 rounded-sm object-cover" />
                      <span className="font-medium">{img.name}</span>
                      {form.evidenceImage === img.url && (
                        <Check className="h-3 w-3 text-primary ml-1 shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
                {form.evidenceImage && (
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setForm((p) => ({ ...p, evidenceImage: '' }))}
                  >
                    Xóa ảnh
                  </Button>
                )}
              </div>
            </div>

            {form.evidenceImage && (
              <div className="mt-2 flex items-center gap-3 rounded-lg border bg-background p-2 max-w-sm">
                <img src={form.evidenceImage} alt="Preview" className="h-14 w-14 rounded-md object-cover border" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate">Xem trước ảnh bằng chứng</p>
                  <p className="text-[10px] text-muted-foreground truncate font-mono">{form.evidenceImage}</p>
                </div>
              </div>
            )}
          </div>

          {/* Hành động khắc phục section */}
          <div className="rounded-md border bg-muted/30 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="requires-corrective-action"
                checked={form.requiresCorrectiveAction}
                onCheckedChange={(checked) =>
                  setForm((p) => ({ ...p, requiresCorrectiveAction: !!checked }))
                }
              />
              <label htmlFor="requires-corrective-action" className="text-sm font-semibold cursor-pointer">
                Phát sinh Hành động khắc phục (Corrective Action)
              </label>
            </div>

            {form.requiresCorrectiveAction && (
              <div className="space-y-4 pt-1">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldLabel label="Người phụ trách">
                    <InlineSelect
                      value={form.assignee}
                      ariaLabel="Người phụ trách"
                      options={[
                        { value: '', label: 'Chọn người phụ trách' },
                        { value: 'Nguyễn Thị Mai', label: 'Nguyễn Thị Mai' },
                        { value: 'Trần Văn Bình', label: 'Trần Văn Bình' },
                        { value: 'Lê Thị Hương', label: 'Lê Thị Hương' },
                        { value: 'Phạm Đức Thắng', label: 'Phạm Đức Thắng' },
                        { value: 'Hoàng Thị Lan', label: 'Hoàng Thị Lan' },
                        { value: 'Võ Minh Tuấn', label: 'Võ Minh Tuấn' },
                        { value: 'Nguyễn Văn Tùng', label: 'Nguyễn Văn Tùng' },
                      ]}
                      onValueChange={(v) => setForm((p) => ({ ...p, assignee: v }))}
                    />
                  </FieldLabel>
                  <FieldLabel label="Thời hạn xử lý">
                    <input
                      type="datetime-local"
                      value={form.deadline ? form.deadline.slice(0, 16) : ''}
                      onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </FieldLabel>
                </div>

                <FieldLabel label="Mô tả hành động khắc phục">
                  <textarea
                    rows={2}
                    value={form.correctiveAction}
                    onChange={(e) => setForm((p) => ({ ...p, correctiveAction: e.target.value }))}
                    placeholder="Mô tả hành động đã/sẽ thực hiện để ngăn ngừa lỗi lặp lại..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
                  />
                </FieldLabel>

                <div className="space-y-3 rounded-md border bg-emerald-50/20 p-3.5 dark:bg-emerald-950/10">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 block mb-1">
                    Báo cáo & bằng chứng khắc phục lỗi
                  </span>

                  <FieldLabel label="Mô tả bằng chứng khắc phục">
                    <textarea
                      rows={2}
                      value={form.correctiveEvidence}
                      onChange={(e) => setForm((p) => ({ ...p, correctiveEvidence: e.target.value }))}
                      placeholder="Mô tả kết quả khắc phục: đã dọn dẹp, đã sửa..."
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs"
                    />
                  </FieldLabel>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FieldLabel label="Link bằng chứng khắc phục">
                      <div className="relative">
                        <Link className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="url"
                          value={form.correctiveLink}
                          onChange={(e) => setForm((p) => ({ ...p, correctiveLink: e.target.value }))}
                          placeholder="https://example.com/resolved-proof"
                          className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs"
                        />
                      </div>
                    </FieldLabel>

                    <FieldLabel label="Ảnh bằng chứng khắc phục (URL)">
                      <div className="relative">
                        <ImageIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          type="url"
                          value={form.correctiveImage}
                          onChange={(e) => setForm((p) => ({ ...p, correctiveImage: e.target.value }))}
                          placeholder="https://images.unsplash.com/..."
                          className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm shadow-xs"
                        />
                      </div>
                    </FieldLabel>
                  </div>

                  {/* Quick image picker for correction */}
                  <div className="mt-2">
                    <span className="text-[11px] text-muted-foreground font-medium block mb-1.5">
                      Chọn nhanh ảnh khắc phục (Đã sửa xong):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            correctiveImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
                          }))
                        }
                        className={`group relative overflow-hidden rounded-md border text-left text-xs transition-all hover:border-primary ${
                          form.correctiveImage === 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'
                            ? 'border-primary ring-1 ring-primary'
                            : 'border-muted'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 p-1 pr-2">
                          <img
                            src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400"
                            alt="Toilet clean"
                            className="h-5 w-5 rounded-sm object-cover"
                          />
                          <span className="text-[11px]">Đã dọn sạch</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            correctiveImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
                          }))
                        }
                        className={`group relative overflow-hidden rounded-md border text-left text-xs transition-all hover:border-primary ${
                          form.correctiveImage === 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'
                            ? 'border-primary ring-1 ring-primary'
                            : 'border-muted'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 p-1 pr-2">
                          <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400"
                            alt="Room clean"
                            className="h-5 w-5 rounded-sm object-cover"
                          />
                          <span className="text-[11px]">Đã ngăn nắp</span>
                        </div>
                      </button>
                      {form.correctiveImage && (
                        <Button
                          size="xs"
                          variant="ghost"
                          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setForm((p) => ({ ...p, correctiveImage: '' }))}
                        >
                          Xóa ảnh
                        </Button>
                      )}
                    </div>
                  </div>

                  {form.correctiveImage && (
                    <div className="mt-2 flex items-center gap-3 rounded-lg border bg-background p-2 max-w-sm">
                      <img
                        src={form.correctiveImage}
                        alt="Preview resolve"
                        className="h-14 w-14 rounded-md object-cover border"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-emerald-700 truncate">Ảnh bằng chứng khắc phục</p>
                        <p className="text-[10px] text-muted-foreground truncate font-mono">{form.correctiveImage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <FieldLabel label="Ghi chú">
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Ghi chú thêm..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            />
          </FieldLabel>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!form.itemId || !form.description || !form.evidence}
          >
            {mode === 'create' ? 'Ghi nhận lỗi' : 'Lưu cập nhật'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
