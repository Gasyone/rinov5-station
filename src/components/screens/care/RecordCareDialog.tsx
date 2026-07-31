'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import { toast } from 'sonner'
import { HeartHandshake, Pin } from 'lucide-react'
import { updateCareAlertInteraction, mockCareAlerts, type StudentCareAlert } from '@/mocks/careAlerts'

export interface StandardTag {
  code: string
  name: string
  sla: string
  criteria: string
  description: string
}

export const ALL_STANDARD_TAGS: StandardTag[] = [
  { code: 'ĐB1', name: 'Chăm sóc Đặc biệt', sla: '24 giờ', criteria: 'Cảnh báo C90B, BTVN < 70% hoặc Điểm thi < 5.0', description: 'Kế hoạch chăm sóc khẩn cấp đối với các cảnh báo vận hành hoặc học lực yếu kém.' },
  { code: 'ĐK1', name: 'CS học tập Định kỳ', sla: '5 ngày', criteria: 'Điểm chạm tương tác định kỳ hàng tháng', description: 'Trao đổi lộ trình học tập định kỳ và thu thập phản hồi của phụ huynh.' },
  { code: 'ĐK2', name: 'CS học phí Định kỳ', sla: '5 ngày', criteria: 'Cận hạn học phí hoặc có lịch sử nợ phí', description: 'Liên hệ nhắc phí và trao đổi lộ trình gia hạn khóa học.' },
  { code: 'TB1', name: 'CS chuyên cần & gói phí', sla: '3 ngày', criteria: 'Buổi còn lại ≤ 5 hoặc chuyên cần < 80%', description: 'Theo dõi chuyên cần, nhắc nhở đi học đúng giờ và nhắc phí cận hạn.' },
  { code: 'TB2', name: 'CS bài tập & học lực', sla: '2 ngày', criteria: 'Thiếu bài tập về nhà hoặc điểm thi giảm sút', description: 'CS phối hợp giáo viên gửi bài tập làm bù và điều chỉnh nhịp học.' },
  { code: 'CSTP', name: 'Chăm sóc Tái phí', sla: '5 ngày', criteria: 'Liên hệ gia hạn và đóng phí khóa học mới', description: 'Chăm sóc Tái phí: Liên hệ trao đổi gia hạn và đóng phí khóa học mới.' },
  { code: 'T1', name: 'Chăm sóc thông thường', sla: '3 ngày', criteria: 'Chăm sóc định kỳ phát sinh', description: 'Tương tác chăm sóc, thăm hỏi định kỳ thông thường.' },
]

interface RecordCareDialogProps {
  cls: StudentCareAlert
  onRefresh?: () => void
  trigger?: React.ReactNode
  onSuccess?: (tagCode: string) => void
  excludeTags?: string[]
}

export function RecordCareDialog({ cls, onRefresh, trigger, onSuccess, excludeTags = [] }: RecordCareDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState('')
  const [notes, setNotes] = useState('')

  // Custom Tag fields (visible when selectedTag === 'KHAC')
  const [customCode, setCustomCode] = useState('T-YC')
  const [customName, setCustomName] = useState('Chăm sóc Khác')
  const [customSla, setCustomSla] = useState('3')
  const [customCriteria, setCustomCriteria] = useState('Yêu cầu phát sinh từ phụ huynh hoặc giáo viên')
  const [customDescription, setCustomDescription] = useState('')

  // Filter out excluded tags
  const visibleTags = ALL_STANDARD_TAGS.filter(t => !excludeTags.includes(t.code))

  const handleOpen = () => {
    setOpen(true)
    if (visibleTags.length > 0) {
      setSelectedTag(visibleTags[0].code)
    } else {
      setSelectedTag('KHAC')
    }
    setNotes('')
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    const isCustom = selectedTag === 'KHAC'
    const tagCode = isCustom ? customCode.trim().toUpperCase() : selectedTag
    const tagName = isCustom ? customName.trim() : (ALL_STANDARD_TAGS.find(t => t.code === selectedTag)?.name || '')
    const tagCriteria = isCustom ? customCriteria.trim() : (ALL_STANDARD_TAGS.find(t => t.code === selectedTag)?.criteria || '')
    const tagSlaStr = isCustom ? `${customSla} ngày` : (ALL_STANDARD_TAGS.find(t => t.code === selectedTag)?.sla || '3 ngày')
    const tagSlaDays = isCustom ? (parseInt(customSla) || 3) : 3

    if (!tagCode) {
      toast.error('Vui lòng nhập mã thẻ chăm sóc!')
      return
    }

    if (isCustom && !tagName) {
      toast.error('Vui lòng nhập tên thẻ chăm sóc tùy chỉnh!')
      return
    }

    // Auto-create a system event log using updateCareAlertInteraction so it saves in mock alerts
    const criteriaText = tagCriteria ? ` [Tiêu chí: ${tagCriteria}]` : ''
    const purposeText = notes.trim() ? ` Mục đích: ${notes.trim()}` : ''
    const fullNote = `[${tagCode}]${criteriaText}${purposeText}`

    // Update in mock database
    const success = updateCareAlertInteraction(
      cls.id,
      {
        staffName: 'CS Staff',
        callConfirmation: 'Đã nhắn Zalo',
        notes: fullNote,
      },
      undefined,
      undefined
    )

    if (success) {
      // Add custom or standard tag to student's customCareTags if not already present
      const record = mockCareAlerts.find(a => a.id === cls.id || a.studentId === cls.id)
      if (record) {
        if (!record.customCareTags) {
          record.customCareTags = []
        }
        if (!record.customCareTags.some(t => t.code === tagCode)) {
          const standardMatch = ALL_STANDARD_TAGS.find(t => t.code === tagCode)
          record.customCareTags.push({
            code: tagCode,
            name: standardMatch ? standardMatch.name : tagName,
            description: standardMatch 
              ? standardMatch.description 
              : (customDescription.trim() || `Yêu cầu ${tagName} (SLA: ${tagSlaStr})`),
            sla: standardMatch 
              ? (parseInt(standardMatch.sla) || 3) 
              : tagSlaDays
          })
        }
      }

      toast.success(`Đã kích hoạt và ghim thẻ chăm sóc "${tagName}" thành công!`)
      onSuccess?.(tagCode)
      setOpen(false)
      if (onRefresh) onRefresh()
    } else {
      toast.error('Có lỗi xảy ra khi kích hoạt thẻ.')
    }
  }

  const selectedTagObject = ALL_STANDARD_TAGS.find(t => t.code === selectedTag)

  return (
    <>
      {trigger ? (
        <span onClick={handleOpen} className="cursor-pointer">{trigger}</span>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          title="Thực hiện chăm sóc"
          className="h-6 w-6 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md shrink-0 shadow-none"
          onClick={handleOpen}
        >
          <HeartHandshake className="h-3.5 w-3.5 text-rose-600 dark:text-rose-450" />
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[440px] select-none text-left">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
                <Pin className="h-4 w-4 text-violet-500 rotate-45" />
                Kích hoạt thẻ Chăm sóc học viên
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3.5 py-4">
              {/* Student Metadata Header */}
              <div className="p-2.5 bg-muted/20 border border-border/30 rounded-lg space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Học viên:</span>
                  <span className="font-bold text-foreground">{cls.studentName} ({cls.studentId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Lớp / Môn học:</span>
                  <span className="font-semibold text-foreground">{cls.classCode} &bull; {cls.subject}</span>
                </div>
              </div>

              {/* Tag Selection Select */}
              <FieldLabel label="Loại thẻ chăm sóc cần ghim" required>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer font-semibold"
                >
                  {visibleTags.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.code} - {t.name} (SLA: {t.sla})
                    </option>
                  ))}
                  <option value="KHAC">+ Thẻ chăm sóc khác (Tùy chỉnh)</option>
                </select>
              </FieldLabel>

              {/* Standard Tag Info Panel */}
              {selectedTag !== 'KHAC' && selectedTagObject && (
                <div className="space-y-3.5">
                  <FieldLabel label="Tiêu chí kích hoạt">
                    <Input
                      type="text"
                      value={selectedTagObject.criteria}
                      disabled
                      className="text-xs bg-muted/40 font-medium h-9 border border-input disabled:opacity-85 text-foreground"
                    />
                  </FieldLabel>

                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="SLA giải quyết">
                      <Input
                        type="text"
                        value={selectedTagObject.sla}
                        disabled
                        className="text-xs bg-muted/40 font-semibold h-9 border border-input disabled:opacity-85 text-foreground text-center"
                      />
                    </FieldLabel>
                    <div className="flex flex-col justify-end pb-1.5 text-[10px] text-muted-foreground font-medium leading-tight">
                      Thời gian phản hồi cam kết của hệ thống.
                    </div>
                  </div>

                  <div className="p-2.5 bg-violet-500/5 border border-violet-500/10 rounded-lg text-[10.5px] leading-relaxed text-muted-foreground font-medium">
                    <strong className="text-foreground">Mô tả:</strong> {selectedTagObject.description}
                  </div>
                </div>
              )}

              {/* Custom Tag Inputs (Visible only when selectedTag === 'KHAC') */}
              {selectedTag === 'KHAC' && (
                <div className="space-y-3.5 border-t border-dashed border-border/60 pt-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <FieldLabel label="Mã thẻ chăm sóc" required>
                      <Input
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        placeholder="VD: T-VIP, T-YC..."
                        className="h-9 text-xs uppercase font-semibold focus-visible:ring-violet-500"
                        maxLength={12}
                      />
                    </FieldLabel>

                    <FieldLabel label="SLA (ngày)" required>
                      <Input
                        type="number"
                        value={customSla}
                        onChange={(e) => setCustomSla(e.target.value)}
                        className="h-9 text-xs font-semibold focus-visible:ring-violet-500 text-center"
                        min={1}
                        max={90}
                      />
                    </FieldLabel>
                  </div>

                  <FieldLabel label="Tên thẻ chăm sóc" required>
                    <Input
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="VD: Chăm sóc học viên đặc biệt..."
                      className="h-9 text-xs font-semibold focus-visible:ring-violet-500"
                    />
                  </FieldLabel>

                  <FieldLabel label="Tiêu chí kích hoạt" required>
                    <Input
                      value={customCriteria}
                      onChange={(e) => setCustomCriteria(e.target.value)}
                      placeholder="VD: Yêu cầu đặc biệt từ phía phụ huynh..."
                      className="h-9 text-xs font-medium focus-visible:ring-violet-500"
                    />
                  </FieldLabel>

                  <FieldLabel label="Mô tả chi tiết">
                    <Textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Mô tả mục tiêu chăm sóc của thẻ tùy chỉnh này..."
                      className="text-xs min-h-[64px] max-h-[100px] resize-none focus-visible:ring-violet-500 py-2 px-3 leading-relaxed"
                    />
                  </FieldLabel>
                </div>
              )}

              {/* Note / Purpose Input */}
              <FieldLabel label="Lí do kích hoạt / Ghi chú mục đích" required>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập lí do kích hoạt thẻ hoặc lưu ý đặc biệt cho đợt chăm sóc này..."
                  className="text-xs min-h-[80px] max-h-[140px] resize-none focus-visible:ring-violet-500 py-2 px-3 leading-relaxed"
                  required
                />
              </FieldLabel>
            </div>

            <DialogFooter className="mt-2.5 flex items-center justify-end gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 cursor-pointer shadow-none"
                >
                  Hủy
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="sm"
                className="text-xs h-8 bg-violet-600 hover:bg-violet-700 text-white font-bold cursor-pointer"
              >
                Kích hoạt & Ghim
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
