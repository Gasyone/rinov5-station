'use client'

import { useState } from 'react'
import { Plus, X, Image as ImageIcon } from 'lucide-react'
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
  QC_ERROR_SEVERITY_LABELS,
  INSPECTOR_OPTIONS,
  type QcTargetGroup,
  type QcEvaluationCriteria,
  type QcErrorSeverity,
} from '@/mocks/qcChecks'
import { BRANCH_OPTIONS } from './qcCheckHelpers'

export interface CreateIncidentItem {
  targetGroup: QcTargetGroup
  criteria: QcEvaluationCriteria
  title: string
  description: string
  severity: QcErrorSeverity
  // Context fields
  className?: string
  sessionNumber?: number
  roomId?: string
  teacherName?: string
  csmName?: string
  // Evidence & Assignee
  evidence: string
  evidenceImage?: string
  evidenceLink?: string
  assignee: string
  deadline?: string
  notes?: string
}

export interface CreateBatchIncidentForm {
  branch: string
  inspectorId: string
  incidents: CreateIncidentItem[]
}

const SAMPLE_CLASSES = [
  'IELTS Intensive K24',
  'Toán Tư Duy Bồi Dưỡng T5',
  'Tiếng Anh Mầm Non K12',
  'Tiếng Anh Giao Tiếp E3',
  'Lập trình Scratch Nhí S2',
]

const SAMPLE_ROOMS = [
  'Phòng A101',
  'Phòng A201',
  'Phòng A203',
  'Phòng B102',
  'Phòng Lab 2',
  'Sảnh chính tầng 1',
  'Hành lang tầng 3',
  'Nhà vệ sinh tầng 2',
]

const SAMPLE_TEACHERS = [
  'Thầy Hoàng Minh',
  'Cô Lê Thùy Dung',
  'Thầy Trần Quang Huy',
  'Cô Hoàng Thu Thảo',
  'Thầy Nguyễn Văn Đức',
]

const SAMPLE_CSMS = [
  'Nguyễn Thị Mai',
  'Lê Thị Hương',
  'Phạm Đức Thắng',
  'Trần Văn Bình',
]

function buildEmptyItem(defaultGroup: QcTargetGroup = 'teacher'): CreateIncidentItem {
  return {
    targetGroup: defaultGroup,
    criteria: defaultGroup === 'teacher' ? 'attendance' : defaultGroup === 'facility' ? 'facility_quality' : 'student_care',
    title: '',
    description: '',
    severity: 'medium',
    className: defaultGroup === 'teacher' ? SAMPLE_CLASSES[0] : '',
    sessionNumber: defaultGroup === 'teacher' ? 1 : undefined,
    roomId: defaultGroup === 'facility' ? SAMPLE_ROOMS[1] : '',
    teacherName: defaultGroup === 'teacher' ? SAMPLE_TEACHERS[0] : '',
    csmName: defaultGroup === 'operations' ? SAMPLE_CSMS[0] : '',
    evidence: 'Ghi nhận trực tiếp khi kiểm tra',
    evidenceImage: '',
    evidenceLink: '',
    assignee: defaultGroup === 'teacher' ? SAMPLE_TEACHERS[0] : defaultGroup === 'facility' ? 'Võ Minh Tuấn (Kỹ thuật)' : SAMPLE_CSMS[0],
    deadline: '',
    notes: '',
  }
}

function buildEmptyBatchForm(): CreateBatchIncidentForm {
  return {
    branch: BRANCH_OPTIONS[0],
    inspectorId: 'ins_01',
    incidents: [buildEmptyItem('teacher')],
  }
}

interface QcCheckCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (form: CreateBatchIncidentForm) => void
}

export function QcCheckCreateDialog({ open, onOpenChange, onSubmit }: QcCheckCreateDialogProps) {
  const [form, setForm] = useState<CreateBatchIncidentForm>(buildEmptyBatchForm)

  const handleReset = () => {
    setForm(buildEmptyBatchForm())
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
        if (group === 'teacher') {
          current.criteria = 'attendance'
          current.className = current.className || SAMPLE_CLASSES[0]
          current.sessionNumber = current.sessionNumber || 1
          current.teacherName = current.teacherName || SAMPLE_TEACHERS[0]
          current.assignee = current.teacherName || SAMPLE_TEACHERS[0]
        } else if (group === 'facility') {
          current.criteria = 'facility_quality'
          current.roomId = current.roomId || SAMPLE_ROOMS[1]
          current.assignee = 'Võ Minh Tuấn (Kỹ thuật)'
        } else {
          current.criteria = 'student_care'
          current.csmName = current.csmName || SAMPLE_CSMS[0]
          current.assignee = current.csmName || SAMPLE_CSMS[0]
        }
      }

      nextIncidents[index] = current
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
      alert('Vui lòng chọn cơ sở ghi nhận sự cố.')
      return
    }

    const invalid = form.incidents.some((item) => !item.description.trim() && !item.title.trim())
    if (invalid) {
      alert('Vui lòng điền tiêu đề hoặc mô tả cho tất cả các sự cố đang nhập.')
      return
    }

    onSubmit(form)
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
        className="max-h-[92vh] w-[95vw] sm:max-w-[1100px] overflow-hidden flex flex-col p-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-border/50 pb-3 shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center justify-between">
            <span>Ghi nhận sự cố chất lượng (QC Incident)</span>
            <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
              Hỗ trợ ghi nhận hàng loạt trong 1 lần
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-5 py-4 pr-1">
          {/* Section 1: General Info */}
          <div className="rounded-lg border border-border/70 bg-card p-3.5 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
              1. Thông tin phiên ghi nhận
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FieldLabel label="Cơ sở / Chi nhánh *">
                <BranchSelect
                  value={form.branch}
                  branches={BRANCH_OPTIONS}
                  variant="inline"
                  includeAll={false}
                  onValueChange={(v) => setForm((p) => ({ ...p, branch: v }))}
                />
              </FieldLabel>

              <FieldLabel label="Người ghi nhận (Kiểm tra viên / Chuyên môn) *">
                <InlineSelect
                  value={form.inspectorId}
                  ariaLabel="Chọn người kiểm tra"
                  options={INSPECTOR_OPTIONS.map((i) => ({ value: i.id, label: `${i.name} (${i.role})` }))}
                  onValueChange={(v) => setForm((p) => ({ ...p, inspectorId: v }))}
                />
              </FieldLabel>
            </div>
          </div>

          {/* Section 2: Batch Incidents */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                2. Danh sách các sự cố phát hiện ({form.incidents.length})
              </h4>
              <span className="text-xs text-muted-foreground">
                Ghi nhận bất kỳ lúc nào, có thể thêm nhiều sự cố cùng lúc
              </span>
            </div>

            <div className="space-y-3.5">
              {form.incidents.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40 relative"
                >
                  {/* Top Bar of Item */}
                  <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-foreground">
                        Sự cố {idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Target Group Segmented Buttons */}
                      <div className="flex rounded-md border p-0.5 bg-muted/30">
                        {(['teacher', 'facility', 'operations'] as QcTargetGroup[]).map((group) => (
                          <button
                            key={group}
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'targetGroup', group)}
                            className={`px-2 py-1 text-xs font-semibold rounded transition-all ${
                              item.targetGroup === group
                                ? 'bg-primary text-primary-foreground shadow-2xs'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {QC_TARGET_GROUP_LABELS[group]}
                          </button>
                        ))}
                      </div>

                      {form.incidents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(idx)}
                          className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                          aria-label="Xóa sự cố"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Context Fields based on Target Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3 bg-muted/20 p-2.5 rounded-md border border-border/40">
                    {item.targetGroup === 'teacher' && (
                      <>
                        <FieldLabel label="Lớp học">
                          <InlineSelect
                            value={item.className || ''}
                            ariaLabel="Chọn lớp học"
                            options={SAMPLE_CLASSES.map((c) => ({ value: c, label: c }))}
                            onValueChange={(v) => handleUpdateItem(idx, 'className', v)}
                          />
                        </FieldLabel>

                        <FieldLabel label="Buổi học số">
                          <input
                            type="number"
                            min={1}
                            max={60}
                            value={item.sessionNumber ?? 1}
                            onChange={(e) => handleUpdateItem(idx, 'sessionNumber', Number(e.target.value) || 1)}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                          />
                        </FieldLabel>

                        <FieldLabel label="Giáo viên đứng lớp">
                          <InlineSelect
                            value={item.teacherName || ''}
                            ariaLabel="Chọn giáo viên"
                            options={SAMPLE_TEACHERS.map((t) => ({ value: t, label: t }))}
                            onValueChange={(v) => {
                              handleUpdateItem(idx, 'teacherName', v)
                              handleUpdateItem(idx, 'assignee', v)
                            }}
                          />
                        </FieldLabel>
                      </>
                    )}

                    {item.targetGroup === 'facility' && (
                      <>
                        <FieldLabel label="Phòng học / Khu vực">
                          <InlineSelect
                            value={item.roomId || ''}
                            ariaLabel="Chọn phòng học"
                            options={SAMPLE_ROOMS.map((r) => ({ value: r, label: r }))}
                            onValueChange={(v) => handleUpdateItem(idx, 'roomId', v)}
                          />
                        </FieldLabel>

                        <FieldLabel label="Người phụ trách sửa chữa">
                          <input
                            type="text"
                            value={item.assignee}
                            onChange={(e) => handleUpdateItem(idx, 'assignee', e.target.value)}
                            placeholder="VD: Kỹ thuật Võ Minh Tuấn"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                          />
                        </FieldLabel>

                        <FieldLabel label="Hạn xử lý (Deadline)">
                          <input
                            type="datetime-local"
                            value={item.deadline ? item.deadline.slice(0, 16) : ''}
                            onChange={(e) => handleUpdateItem(idx, 'deadline', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                          />
                        </FieldLabel>
                      </>
                    )}

                    {item.targetGroup === 'operations' && (
                      <>
                        <FieldLabel label="Nhân viên CS / Vận hành">
                          <InlineSelect
                            value={item.csmName || ''}
                            ariaLabel="Chọn nhân viên CS"
                            options={SAMPLE_CSMS.map((c) => ({ value: c, label: c }))}
                            onValueChange={(v) => {
                              handleUpdateItem(idx, 'csmName', v)
                              handleUpdateItem(idx, 'assignee', v)
                            }}
                          />
                        </FieldLabel>

                        <FieldLabel label="Lớp học liên quan (nếu có)">
                          <InlineSelect
                            value={item.className || ''}
                            ariaLabel="Chọn lớp học"
                            options={[
                              { value: '', label: 'Không gắn lớp cụ thể' },
                              ...SAMPLE_CLASSES.map((c) => ({ value: c, label: c })),
                            ]}
                            onValueChange={(v) => handleUpdateItem(idx, 'className', v)}
                          />
                        </FieldLabel>

                        <FieldLabel label="Buổi học số (nếu có)">
                          <input
                            type="number"
                            min={1}
                            max={60}
                            value={item.sessionNumber ?? ''}
                            onChange={(e) => handleUpdateItem(idx, 'sessionNumber', e.target.value ? Number(e.target.value) : undefined)}
                            placeholder="VD: 1"
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                          />
                        </FieldLabel>
                      </>
                    )}
                  </div>

                  {/* Criteria, Severity & Assignee */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <FieldLabel label="Tiêu chí đánh giá *">
                      <InlineSelect
                        value={item.criteria}
                        ariaLabel="Tiêu chí đánh giá"
                        options={Object.entries(QC_CRITERIA_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                        onValueChange={(v) => handleUpdateItem(idx, 'criteria', v as QcEvaluationCriteria)}
                      />
                    </FieldLabel>

                    <FieldLabel label="Mức độ nghiêm trọng *">
                      <InlineSelect
                        value={item.severity}
                        ariaLabel="Mức độ nghiêm trọng"
                        options={Object.entries(QC_ERROR_SEVERITY_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                        onValueChange={(v) => handleUpdateItem(idx, 'severity', v as QcErrorSeverity)}
                      />
                    </FieldLabel>

                    <FieldLabel label="Người phụ trách khắc phục *">
                      <input
                        type="text"
                        value={item.assignee}
                        onChange={(e) => handleUpdateItem(idx, 'assignee', e.target.value)}
                        placeholder="Chỉ định người xử lý..."
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                      />
                    </FieldLabel>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2 mb-3">
                    <FieldLabel label="Tiêu đề tóm tắt sự cố *">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(idx, 'title', e.target.value)}
                        placeholder="VD: Quên điểm danh trên phần mềm sau buổi 3..."
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs font-medium"
                      />
                    </FieldLabel>

                    <FieldLabel label="Mô tả chi tiết vi phạm *">
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleUpdateItem(idx, 'description', e.target.value)}
                        placeholder="Mô tả cụ thể hành vi vi phạm, số lượng học sinh bị ảnh hưởng, thời điểm..."
                        className="flex w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs shadow-xs"
                      />
                    </FieldLabel>
                  </div>

                  {/* Evidence Upload */}
                  <div className="rounded-md border border-dashed border-border/80 bg-muted/20 p-3">
                    <span className="text-xs font-semibold text-muted-foreground block mb-2">
                      Bằng chứng phát hiện vi phạm:
                    </span>
                    <div className="flex items-center gap-3">
                      <label className="flex h-9 px-3 cursor-pointer items-center justify-center rounded-md border border-border bg-background hover:bg-muted/50 transition-colors text-xs font-semibold text-primary gap-1.5">
                        <ImageIcon className="h-4 w-4" />
                        <span>+ Đính kèm ảnh bằng chứng</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleUpdateItem(idx, 'evidenceImage', URL.createObjectURL(file))
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="text"
                        value={item.evidenceLink || ''}
                        onChange={(e) => handleUpdateItem(idx, 'evidenceLink', e.target.value)}
                        placeholder="Dán link bằng chứng / log hệ thống (nếu có)..."
                        className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs"
                      />

                      {item.evidenceImage && (
                        <div className="relative group w-12 h-9 rounded border overflow-hidden shrink-0">
                          <img src={item.evidenceImage} alt="Proof" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'evidenceImage', '')}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold"
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Row Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRow}
              className="w-full border-dashed border-primary/50 text-primary hover:bg-primary/5 font-semibold text-xs h-9"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Thêm sự cố khác vào đợt ghi nhận này
            </Button>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="border-t border-border/50 pt-3 flex w-full items-center justify-between sm:justify-between shrink-0">
          <div className="text-xs text-muted-foreground font-medium">
            Tổng cộng: <span className="font-bold text-foreground">{form.incidents.length}</span> sự cố sẽ được ghi nhận
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} disabled={!form.branch}>
              Ghi nhận {form.incidents.length} sự cố
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
