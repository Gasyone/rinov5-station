'use client'

import { useState } from 'react'
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  Video,
  X,
  GraduationCap,
  Building2,
  Headset,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
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
  QC_TARGET_GROUP_LABELS,
  QC_CRITERIA_LABELS,
  QC_TARGET_GROUP_CRITERIA,
  type QcTargetGroup,
  type QcEvaluationCriteria,
} from '@/mocks/qcChecks'
import {
  BRANCH_OPTIONS,
  getQuickTemplates,
  type QuickTemplateItem,
} from './qcCheckHelpers'
import { SearchablePersonnelSelect } from './SearchablePersonnelSelect'
import {
  type CreateIncidentItem,
  type CreateBatchIncidentForm,
  type QcCreatePrefill,
  SAMPLE_CLASSES,
  SAMPLE_ROOMS,
  SAMPLE_EQUIPMENT,
  SEVERITY_OPTIONS,
  buildEmptyItem,
  buildEmptyBatchForm,
  buildInitialBatchForm,
} from './qcCheckCreateTypes'

export type { CreateIncidentItem, CreateBatchIncidentForm, QcCreatePrefill }
export {
  SAMPLE_CLASSES,
  SAMPLE_ROOMS,
  SAMPLE_EQUIPMENT,
  SEVERITY_OPTIONS,
  buildEmptyItem,
  buildEmptyBatchForm,
  buildInitialBatchForm,
}

interface QcCheckCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (form: CreateBatchIncidentForm) => void
  prefill?: QcCreatePrefill | null
}

export function QcCheckCreateDialog({ open, onOpenChange, onSubmit, prefill }: QcCheckCreateDialogProps) {
  const [form, setForm] = useState<CreateBatchIncidentForm>(() => buildInitialBatchForm(prefill))
  const [editingLinkIdx, setEditingLinkIdx] = useState<number | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const handleReset = () => {
    setForm(buildEmptyBatchForm())
    setEditingLinkIdx(null)
  }

  const handleUpdateItem = (
    index: number,
    field: keyof CreateIncidentItem,
    value: CreateIncidentItem[keyof CreateIncidentItem]
  ) => {
    setForm((prev) => {
      const nextIncidents = [...prev.incidents]
      const current = { ...nextIncidents[index], [field]: value }

      // Auto adjust defaults when changing targetGroup
      if (field === 'targetGroup') {
        const group = value as QcTargetGroup
        const allowedCriteria = QC_TARGET_GROUP_CRITERIA[group]
        if (!allowedCriteria.includes(current.criteria)) {
          current.criteria = allowedCriteria[0]
        }
        if (group === 'teacher') {
          current.sessionInfo = current.sessionInfo || 'Buổi 1'
          if (!current.teacherName) {
            current.teacherName = 'Cô Hoàng Thu Thảo'
            current.assignee = 'Cô Hoàng Thu Thảo'
          }
        } else if (group === 'facility') {
          current.roomId = current.roomId || SAMPLE_ROOMS[1]
          if (!current.facilityStaffName) {
            current.facilityStaffName = 'Võ Minh Tuấn'
            current.assignee = 'Võ Minh Tuấn'
          }
        } else {
          if (!current.csmName) {
            current.csmName = 'Nguyễn Thị Mai'
            current.assignee = 'Nguyễn Thị Mai'
          }
        }
      }

      nextIncidents[index] = current
      return { ...prev, incidents: nextIncidents }
    })
  }

  const handleApplyTemplate = (index: number, tpl: QuickTemplateItem) => {
    setForm((prev) => {
      const nextIncidents = [...prev.incidents]
      nextIncidents[index] = {
        ...nextIncidents[index],
        title: tpl.title,
        criteria: tpl.criteria,
        severity: tpl.severity,
        description: tpl.desc,
      }
      return { ...prev, incidents: nextIncidents }
    })
  }

  const handleAddRow = () => {
    setForm((prev) => {
      const lastGroup = prev.incidents[prev.incidents.length - 1]?.targetGroup || 'teacher'
      return {
        ...prev,
        incidents: [...prev.incidents, buildEmptyItem(lastGroup)],
      }
    })
  }

  const handleRemoveRow = (index: number) => {
    setForm((prev) => ({
      ...prev,
      incidents: prev.incidents.filter((_, idx) => idx !== index),
    }))
  }

  const handleSubmit = () => {
    if (!form.branch) {
      toast.error('Vui lòng chọn cơ sở ghi nhận sự cố.')
      return
    }

    for (let i = 0; i < form.incidents.length; i++) {
      const inc = form.incidents[i]
      const label = form.incidents.length > 1 ? `sự cố #${i + 1}` : 'sự cố'
      if (inc.targetGroup === 'teacher' && !inc.teacherName?.trim() && !inc.assignee?.trim()) {
        toast.error(`Vui lòng chọn giáo viên phụ trách cho ${label}.`)
        return
      }
      if (inc.targetGroup === 'facility' && !inc.facilityStaffName?.trim() && !inc.assignee?.trim()) {
        toast.error(`Vui lòng chọn nhân sự phụ trách CSVC cho ${label}.`)
        return
      }
      if (inc.targetGroup === 'operations' && !inc.csmName?.trim() && !inc.assignee?.trim()) {
        toast.error(`Vui lòng chọn nhân viên vận hành cho ${label}.`)
        return
      }
    }

    const invalid = form.incidents.some((item) => !item.description.trim() && !item.title.trim())
    if (invalid) {
      toast.error('Vui lòng điền tiêu đề hoặc mô tả cho tất cả các sự cố đang nhập.')
      return
    }

    // Sync sessionNumber / notes from sessionInfo if available
    const normalizedForm: CreateBatchIncidentForm = {
      ...form,
      incidents: form.incidents.map((inc) => {
        const parsedNum = inc.sessionInfo ? parseInt(inc.sessionInfo.replace(/\D+/g, ''), 10) : undefined
        return {
          ...inc,
          sessionNumber: !isNaN(Number(parsedNum)) ? parsedNum : inc.sessionNumber,
          notes: inc.sessionInfo
            ? inc.notes
              ? `${inc.notes} • Lịch: ${inc.sessionInfo}`
              : `Lịch: ${inc.sessionInfo}`
            : inc.notes,
        }
      }),
    }

    onSubmit(normalizedForm)
    handleReset()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleReset()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent
        className="max-h-[92vh] w-[95vw] sm:max-w-[1100px] overflow-hidden flex flex-col p-3 sm:px-4 sm:py-2.5 gap-1.5"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Datalist for autocomplete class name / code */}
        <datalist id="classDatalist">
          {SAMPLE_CLASSES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        {/* Header: Title nhỏ, text thường, màu xám nhạt (Không border line). Bên phải: Textlink Thêm lỗi + Chọn chi nhánh */}
        <DialogHeader className="pb-1 shrink-0">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-xs sm:text-sm font-normal text-muted-foreground">
              Ghi nhận sự cố chất lượng (QC Incident)
            </DialogTitle>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline hover:text-primary/80 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Thêm lỗi</span>
              </button>

              <div className="h-3 w-px bg-border/80" />

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-muted-foreground whitespace-nowrap">Cơ sở:</span>
                <div className="w-[180px]">
                  <BranchSelect
                    value={form.branch}
                    branches={BRANCH_OPTIONS}
                    variant="inline"
                    includeAll={false}
                    className="h-7 text-xs bg-muted/30 hover:bg-muted/50 border-border/70"
                    onValueChange={(v) => setForm((p) => ({ ...p, branch: v }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Form Body - Scrollable Container */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-2 py-0.5 pr-0.5">
          {form.incidents.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-border bg-card p-2.5 sm:p-3 shadow-2xs transition-all hover:border-primary/40 relative"
            >
              {/* Tách 2 cột: Cột trái (Đối tượng) - Cột phải (Ghi nhận sự cố) */}
              <div className="grid grid-cols-12 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                {/* ─── CỘT BÊN TRÁI: ĐỐI TƯỢNG (Col 4) ─── */}
                <div className="col-span-12 sm:col-span-4 pr-0 sm:pr-3 space-y-2">
                  {/* Tab chọn đối tượng */}
                  <div className="flex items-center gap-1.5">
                    {form.incidents.length > 1 && (
                      <span className="font-bold text-sm text-primary shrink-0 select-none px-0.5">
                        {idx + 1}
                      </span>
                    )}
                    <div className="flex w-full rounded-md border border-border/80 p-0.5 bg-muted/40">
                      {(['teacher', 'facility', 'operations'] as QcTargetGroup[]).map((group) => {
                        const Icon = group === 'teacher' ? GraduationCap : group === 'facility' ? Building2 : Headset
                        const isActive = item.targetGroup === group
                        return (
                          <button
                            key={group}
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'targetGroup', group)}
                            className={`flex-1 flex items-center justify-center gap-1 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span className="truncate">{QC_TARGET_GROUP_LABELS[group]}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Chi tiết bối cảnh đối tượng */}
                  <div className="space-y-2 pt-0.5">
                    {item.targetGroup === 'teacher' && (
                      <>
                        <FieldLabel label="Giáo viên phụ trách *" className="gap-1">
                          <SearchablePersonnelSelect
                            targetGroup="teacher"
                            value={item.teacherName || item.assignee}
                            onSelect={(p) => {
                              handleUpdateItem(idx, 'teacherName', p.name)
                              handleUpdateItem(idx, 'assignee', p.name)
                            }}
                            onClear={() => {
                              handleUpdateItem(idx, 'teacherName', '')
                              handleUpdateItem(idx, 'assignee', '')
                            }}
                          />
                        </FieldLabel>

                        <FieldLabel label="Lớp học / Mã lớp *" className="gap-1">
                          <input
                            type="text"
                            list="classDatalist"
                            value={item.className || ''}
                            onChange={(e) => handleUpdateItem(idx, 'className', e.target.value)}
                            placeholder="Nhập mã hoặc tên lớp..."
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
                          />
                        </FieldLabel>

                        <FieldLabel label="Tên buổi & Lịch học *" className="gap-1">
                          <input
                            type="text"
                            value={item.sessionInfo || ''}
                            onChange={(e) => handleUpdateItem(idx, 'sessionInfo', e.target.value)}
                            placeholder="VD: Buổi 3 - T2 (18h00 - 19h30)..."
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </FieldLabel>
                      </>
                    )}

                    {item.targetGroup === 'facility' && (
                      <>
                        <FieldLabel label="Nhân sự phụ trách CSVC *" className="gap-1">
                          <SearchablePersonnelSelect
                            targetGroup="facility"
                            value={item.facilityStaffName || item.assignee}
                            onSelect={(p) => {
                              handleUpdateItem(idx, 'facilityStaffName', p.name)
                              handleUpdateItem(idx, 'assignee', p.name)
                            }}
                            onClear={() => {
                              handleUpdateItem(idx, 'facilityStaffName', '')
                              handleUpdateItem(idx, 'assignee', '')
                            }}
                          />
                        </FieldLabel>

                        <FieldLabel label="Phòng học / Khu vực *" className="gap-1">
                          <InlineSelect
                            value={item.roomId || ''}
                            ariaLabel="Chọn phòng học"
                            className="h-8 text-xs"
                            options={SAMPLE_ROOMS.map((r) => ({ value: r, label: r }))}
                            onValueChange={(v) => handleUpdateItem(idx, 'roomId', v)}
                          />
                        </FieldLabel>

                        <FieldLabel label="Hạng mục / Thiết bị" className="gap-1">
                          <InlineSelect
                            value={item.notes || ''}
                            ariaLabel="Chọn thiết bị"
                            className="h-8 text-xs"
                            options={[
                              { value: '', label: 'Chung toàn khu vực' },
                              ...SAMPLE_EQUIPMENT.map((eq) => ({ value: eq, label: eq })),
                            ]}
                            onValueChange={(v) => handleUpdateItem(idx, 'notes', v)}
                          />
                        </FieldLabel>
                      </>
                    )}

                    {item.targetGroup === 'operations' && (
                      <>
                        <FieldLabel label="Nhân viên Vận hành *" className="gap-1">
                          <SearchablePersonnelSelect
                            targetGroup="operations"
                            value={item.csmName || item.assignee}
                            onSelect={(p) => {
                              handleUpdateItem(idx, 'csmName', p.name)
                              handleUpdateItem(idx, 'assignee', p.name)
                            }}
                            onClear={() => {
                              handleUpdateItem(idx, 'csmName', '')
                              handleUpdateItem(idx, 'assignee', '')
                            }}
                          />
                        </FieldLabel>

                        <FieldLabel label="Lớp học / Mã lớp liên quan" className="gap-1">
                          <input
                            type="text"
                            list="classDatalist"
                            value={item.className || ''}
                            onChange={(e) => handleUpdateItem(idx, 'className', e.target.value)}
                            placeholder="Mã hoặc tên lớp..."
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-medium"
                          />
                        </FieldLabel>

                        <FieldLabel label="Buổi học & Lịch học" className="gap-1">
                          <input
                            type="text"
                            value={item.sessionInfo || ''}
                            onChange={(e) => handleUpdateItem(idx, 'sessionInfo', e.target.value)}
                            placeholder="VD: Buổi 2..."
                            className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </FieldLabel>
                      </>
                    )}
                  </div>
                </div>

                {/* ─── CỘT BÊN PHẢI: GHI NHẬN SỰ CỐ (Col 8) ─── */}
                <div className="col-span-12 sm:col-span-8 pl-0 sm:pl-3 pt-2 sm:pt-0 space-y-2">
                  {/* Top Bar của Ghi nhận: Tiêu chí bên trái, Mức độ 4 Icon & Nút xóa bên phải */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-1.5">
                    <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
                      <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                        Tiêu chí: <span className="text-destructive">*</span>
                      </span>
                      <div className="flex-1 max-w-[240px]">
                        <InlineSelect
                          value={item.criteria}
                          ariaLabel="Tiêu chí đánh giá"
                          className="h-7 text-xs"
                          options={QC_TARGET_GROUP_CRITERIA[item.targetGroup].map((c) => ({
                            value: c,
                            label: QC_CRITERIA_LABELS[c],
                          }))}
                          onValueChange={(v) => handleUpdateItem(idx, 'criteria', v as QcEvaluationCriteria)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">Mức độ:</span>
                        <div className="flex rounded-md border border-border/70 p-0.5 bg-muted/30">
                          {SEVERITY_OPTIONS.map((sev) => {
                            const SevIcon = sev.icon
                            const isActive = item.severity === sev.value
                            return (
                              <button
                                key={sev.value}
                                type="button"
                                onClick={() => handleUpdateItem(idx, 'severity', sev.value)}
                                title={sev.title}
                                className={`p-1 rounded transition-all cursor-pointer flex items-center justify-center ${
                                  isActive
                                    ? `${sev.activeClass} shadow-2xs`
                                    : `${sev.inactiveClass} opacity-85 hover:opacity-100`
                                }`}
                              >
                                <SevIcon className="h-3.5 w-3.5" />
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {form.incidents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Xóa lỗi này"
                          aria-label="Xóa lỗi"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dòng Mẫu nhanh (bên trái) + Icon Tải ảnh & Thêm link (bên phải) */}
                  <div className="flex items-center justify-between gap-1.5 pb-0.5 text-[11px]">
                    {/* Bên trái: Gợi ý mẫu nhanh */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0">
                      {(() => {
                        const templates = getQuickTemplates(item.targetGroup, item.criteria)
                        if (templates.length === 0) return null
                        return (
                          <>
                            <span className="flex items-center gap-1 text-muted-foreground shrink-0 font-medium">
                              <Sparkles className="h-3 w-3 text-amber-500" />
                              Mẫu nhanh:
                            </span>
                            {templates.map((tpl, tplIdx) => (
                              <button
                                key={tplIdx}
                                type="button"
                                onClick={() => handleApplyTemplate(idx, tpl)}
                                className="shrink-0 rounded border border-border/70 bg-background/80 hover:bg-primary/10 hover:border-primary/50 hover:text-primary px-2 py-0.5 text-muted-foreground transition-all truncate max-w-[240px] cursor-pointer"
                                title={tpl.title}
                              >
                                {tpl.title}
                              </button>
                            ))}
                          </>
                        )
                      })()}
                    </div>

                    {/* Bên phải: Icon Tải ảnh & Thêm link (không viền, không nền, có màu, highlight) */}
                    <div className="flex items-center gap-1 shrink-0 ml-auto pl-1">
                      {/* Icon Tải ảnh / Video */}
                      <label
                        title="Tải lên ảnh hoặc video minh chứng"
                        className={cn(
                          'p-1 rounded cursor-pointer transition-all flex items-center justify-center text-sky-600 dark:text-sky-400 hover:text-sky-700 hover:bg-sky-500/15',
                          item.evidenceImage && 'bg-sky-500/15 ring-1 ring-sky-500/30'
                        )}
                      >
                        <ImageIcon className="h-4 w-4" />
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const isVid = file.type.startsWith('video/')
                              handleUpdateItem(idx, 'evidenceImage', URL.createObjectURL(file))
                              if (isVid) {
                                handleUpdateItem(
                                  idx,
                                  'notes',
                                  (item.notes ? `${item.notes} • ` : '') + 'Video minh chứng'
                                )
                              }
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Icon Thêm link */}
                      <button
                        type="button"
                        onClick={() => setEditingLinkIdx(editingLinkIdx === idx ? null : idx)}
                        title="Thêm liên kết ảnh, video hoặc tài liệu"
                        className={cn(
                          'p-1 rounded cursor-pointer transition-all flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-500/15',
                          (editingLinkIdx === idx || item.evidenceLink) &&
                            'bg-indigo-500/15 ring-1 ring-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-semibold'
                        )}
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Ô tiêu đề tóm tắt (không có label) */}
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleUpdateItem(idx, 'title', e.target.value)}
                    placeholder="Tiêu đề tóm tắt sự cố * (hoặc chọn mẫu nhanh bên trên)..."
                    className="flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 text-xs font-semibold shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />

                  {/* Ô mô tả chi tiết vi phạm (có thể mở rộng resize-y) */}
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                    placeholder="Mô tả chi tiết vi phạm (nội dung, ảnh hưởng, thời điểm phát hiện)..."
                    className="flex w-full resize-y min-h-[52px] rounded-md border border-input bg-background p-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />

                  {/* Khi thêm link, hiển thị ô nhập link ở dưới ô mô tả chi tiết, cùng ảnh/video đính kèm */}
                  {(editingLinkIdx === idx || item.evidenceLink || item.evidenceImage) && (
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {/* Ô nhập link ảnh / video khi click icon link */}
                      {editingLinkIdx === idx && (
                        <div className="relative flex items-center flex-1 min-w-[200px] max-w-[360px]">
                          <LinkIcon className="h-3 w-3 text-indigo-500 absolute left-2 pointer-events-none" />
                          <input
                            type="text"
                            value={item.evidenceLink || ''}
                            onChange={(e) => handleUpdateItem(idx, 'evidenceLink', e.target.value)}
                            placeholder="Dán link ảnh, video, drive minh chứng..."
                            className="flex h-7 w-full rounded-md border border-input bg-background pl-6.5 pr-6 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === 'Escape') {
                                setEditingLinkIdx(null)
                              }
                            }}
                          />
                          {item.evidenceLink && (
                            <button
                              type="button"
                              onClick={() => handleUpdateItem(idx, 'evidenceLink', '')}
                              className="absolute right-1.5 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                              title="Xóa link"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Hiển thị link ảnh / video đã đính kèm (khi không sửa) */}
                      {item.evidenceLink && editingLinkIdx !== idx && (
                        <div className="flex items-center gap-1.5 h-7 px-2 rounded-md border border-border bg-muted/40 text-xs max-w-[320px]">
                          <LinkIcon className="h-3 w-3 text-indigo-500 shrink-0" />
                          <a
                            href={item.evidenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                            title={item.evidenceLink}
                          >
                            {item.evidenceLink}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'evidenceLink', '')}
                            className="text-muted-foreground hover:text-destructive shrink-0 p-0.5 cursor-pointer"
                            title="Xóa link"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}

                      {/* Thumbnail ảnh / video đã upload */}
                      {item.evidenceImage && (
                        <div
                          className="relative group h-7 w-12 rounded border border-border overflow-hidden shrink-0 bg-muted/40 shadow-2xs cursor-pointer"
                          onClick={() => setPreviewImageUrl(item.evidenceImage || null)}
                          title="Bấm để xem ảnh lớn"
                        >
                          {item.notes?.includes('Video minh chứng') ? (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
                              <Video className="h-3.5 w-3.5 text-rose-400" />
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={item.evidenceImage} alt="Minh chứng" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleUpdateItem(idx, 'evidenceImage', '')
                              if (item.notes?.includes('Video minh chứng')) {
                                handleUpdateItem(
                                  idx,
                                  'notes',
                                  item.notes.replace('Video minh chứng', '').replace(/^• | • $/g, '').trim()
                                )
                              }
                            }}
                            className="absolute top-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-black/75 hover:bg-destructive text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Xóa ảnh/video"
                          >
                            <X className="h-2 w-2" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer (Không border line) */}
        <DialogFooter className="pt-1 pb-0 flex w-full items-center justify-between sm:justify-between shrink-0">
          <div className="text-xs text-muted-foreground">
            Tổng cộng: <span className="font-semibold text-foreground">{form.incidents.length}</span> sự cố
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2.5" onClick={() => onOpenChange(false)}>
              Hủy bỏ
            </Button>
            <Button size="sm" className="h-7 text-xs px-3" onClick={handleSubmit} disabled={!form.branch}>
              Ghi nhận {form.incidents.length} sự cố
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* Lightbox Preview for Create Dialog */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
          onClick={(e) => {
            e.stopPropagation()
            setPreviewImageUrl(null)
          }}
        >
          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-10 right-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer text-base"
                title="Đóng xem ảnh"
              >
                &times;
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewImageUrl}
              alt="Minh chứng vi phạm"
              className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </Dialog>
  )
}
