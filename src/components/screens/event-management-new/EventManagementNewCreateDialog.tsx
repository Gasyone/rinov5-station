'use client'

import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel, ConfirmDialog } from '@/components/shared'
import { BranchSelect, InlineSelect } from '@/components/controls'
import { EventItem } from '@/mocks/eventManagement'
import { validateEventDates } from './eventManagementNewHelpers'
import { EventFormState, INITIAL_FORM_STATE } from './eventManagementNewTypes'

interface EventManagementNewCreateDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Omit<EventItem, 'id' | 'registeredCount' | 'checkedInCount' | 'statusLabel'> & { id?: string }) => void
  editingEvent?: EventItem
}

const EVENT_TYPE_OPTIONS = [
  { value: 'seminar', label: 'Hội thảo' },
  { value: 'open_day', label: 'Ngày hội mở' },
  { value: 'trial', label: 'Trải nghiệm học thử' },
  { value: 'other', label: 'Khác' }
]

const BRANCH_OPTIONS = [
  'RinoEdu Linh Đàm',
  'RinoEdu Nguyễn Tuân',
  'RinoEdu Smart City',
]

const ORGANIZER_OPTIONS = [
  { value: 'Phòng Tuyển sinh', label: 'Phòng Tuyển sinh' },
  { value: 'Phòng Marketing', label: 'Phòng Marketing' },
  { value: 'Phòng Đào tạo', label: 'Phòng Đào tạo' }
]

export function EventManagementNewCreateDialog({ isOpen, onClose, onSave, editingEvent }: EventManagementNewCreateDialogProps) {
  const [form, setForm] = useState<EventFormState>(INITIAL_FORM_STATE)
  const [errorMsg, setErrorMsg] = useState('')
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    Promise.resolve().then(() => {
      if (editingEvent) {
        setForm({
          title: editingEvent.title,
          type: editingEvent.type,
          branch: editingEvent.branch,
          startDate: editingEvent.startDate,
          endDate: editingEvent.endDate,
          capacity: editingEvent.capacity,
          location: editingEvent.location,
          organizer: editingEvent.organizer,
          description: editingEvent.description || "",
          status: editingEvent.status
        })
        setIsDirty(false)
      } else {
        setForm(INITIAL_FORM_STATE)
        setIsDirty(false)
      }
      setErrorMsg('')
    })
  }, [editingEvent, isOpen])

  const handleFieldChange = (key: keyof EventFormState, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  const handleSubmit = (status: EventFormState['status']) => {
    if (!form.title.trim()) {
      setErrorMsg('Tên sự kiện không được bỏ trống.')
      return
    }
    if (!form.startDate || !form.endDate) {
      setErrorMsg('Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc.')
      return
    }
    if (!form.capacity || form.capacity <= 0) {
      setErrorMsg('Sức chứa tối đa phải là số lớn hơn 0.')
      return
    }
    if (!form.location.trim()) {
      setErrorMsg('Vui lòng nhập địa điểm tổ chức.')
      return
    }

    const dateVal = validateEventDates(form.startDate, form.endDate)
    if (!dateVal.isValid) {
      setErrorMsg(dateVal.message || 'Thời gian sự kiện không hợp lệ.')
      return
    }

    const typeLabel = EVENT_TYPE_OPTIONS.find(t => t.value === form.type)?.label || 'Khác'

    onSave({
      id: editingEvent?.id,
      title: form.title,
      type: form.type,
      typeLabel,
      branch: form.branch,
      startDate: form.startDate,
      endDate: form.endDate,
      capacity: Number(form.capacity),
      location: form.location,
      organizer: form.organizer,
      description: form.description,
      status: editingEvent ? form.status : status,
      agenda: editingEvent?.agenda || []
    })
    onClose()
  }

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowConfirmCancel(true)
    } else {
      onClose()
    }
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => { if (!open) handleCloseAttempt(); }}>
        <SheetContent side="right" className="w-full sm:max-w-xl flex flex-col p-6 overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>{editingEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}</SheetTitle>
            <SheetDescription>
              {editingEvent 
                ? 'Cập nhật lại các thông tin cấu hình và thời gian của sự kiện.' 
                : 'Thiết lập các thông số chính cho buổi sự kiện tuyển sinh mới.'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-6">
            {/* Title */}
            <FieldLabel label="Tên Sự kiện *" required>
              <Input
                placeholder="VD: Hội thảo tuyển sinh Hè 2026"
                value={form.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                maxLength={150}
              />
            </FieldLabel>

            {/* Grid options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldLabel label="Loại Sự kiện *" required>
                <InlineSelect
                  value={form.type}
                  onValueChange={(val: string) => handleFieldChange('type', val)}
                  options={EVENT_TYPE_OPTIONS}
                />
              </FieldLabel>

              <FieldLabel label="Trường *" required>
                <BranchSelect
                  value={form.branch}
                  branches={BRANCH_OPTIONS}
                  variant="inline"
                  includeAll={false}
                  onValueChange={(val: string) => handleFieldChange('branch', val)}
                />
              </FieldLabel>
            </div>

            {/* Time Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldLabel label="Thời gian bắt đầu *" required>
                <Input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => handleFieldChange('startDate', e.target.value)}
                />
              </FieldLabel>

              <FieldLabel label="Thời gian kết thúc *" required>
                <Input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => handleFieldChange('endDate', e.target.value)}
                />
              </FieldLabel>
            </div>

            {/* Capacity & Organizer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldLabel label="Sức chứa tối đa *" required>
                <Input
                  type="number"
                  min="1"
                  placeholder="VD: 50"
                  value={form.capacity}
                  onChange={(e) => handleFieldChange('capacity', Number(e.target.value))}
                />
              </FieldLabel>

              <FieldLabel label="Ban tổ chức *" required>
                <InlineSelect
                  value={form.organizer}
                  onValueChange={(val: string) => handleFieldChange('organizer', val)}
                  options={ORGANIZER_OPTIONS}
                />
              </FieldLabel>
            </div>

            <FieldLabel label="Địa điểm cụ thể *" required>
              <Input
                placeholder="VD: Phòng Hội thảo Tầng 2"
                value={form.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
              />
            </FieldLabel>

            {/* Description */}
            <FieldLabel label="Mô tả sự kiện">
              <Textarea
                placeholder="Nhập tóm tắt nội dung chính và thông tin lưu ý..."
                value={form.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                rows={4}
                maxLength={1000}
              />
            </FieldLabel>

            {errorMsg && (
              <p className="text-xs text-destructive font-medium bg-destructive/10 p-2.5 rounded-md">
                {errorMsg}
              </p>
            )}
          </div>

          <SheetFooter className="mt-6 border-t pt-4 flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={handleCloseAttempt}>
              Hủy bỏ
            </Button>
            {editingEvent ? (
              <Button onClick={() => handleSubmit(form.status)}>
                Lưu thay đổi
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => handleSubmit('nhap')}>
                  Lưu nháp
                </Button>
                <Button onClick={() => handleSubmit('mo_dang_ky')}>
                  Công bố
                </Button>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Hủy bỏ thay đổi?"
        description="Các thông tin bạn vừa nhập sẽ bị mất và không thể khôi phục. Bạn có chắc chắn muốn hủy bỏ không?"
        confirmLabel="Đồng ý hủy"
        cancelLabel="Tiếp tục nhập"
        onConfirm={() => { setShowConfirmCancel(false); onClose(); }}
      />
    </>
  )
}
