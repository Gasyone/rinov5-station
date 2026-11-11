'use client'

import { useState } from 'react'
import { FileUp, Trash2, Check, FileText } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'
import { MATH_LEVELS, type BookingTest } from '@/mocks/bookingTests'
import { BookingTestRichTextEditor } from './BookingTestRichTextEditor'

interface BookingTestManualUploadDialogProps {
  open: boolean
  booking: BookingTest | null
  authorName?: string
  onOpenChange: (open: boolean) => void
  onUpdateBooking: (id: string, updater: (booking: BookingTest) => BookingTest) => void
}

const MATH_GRADES = [
  'Lớp 1',
  'Lớp 2',
  'Lớp 3',
  'Lớp 4',
  'Lớp 5',
  'Lớp 6',
  'Lớp 7',
  'Lớp 8',
]

interface ManualUploadFormProps {
  booking: BookingTest
  authorName: string
  onClose: () => void
  onUpdateBooking: (id: string, updater: (booking: BookingTest) => BookingTest) => void
}

function ManualUploadForm({
  booking,
  authorName,
  onClose,
  onUpdateBooking,
}: ManualUploadFormProps) {
  // Khối lớp: luôn lấy theo dữ liệu đầu vào hoặc kết quả đã lưu
  const [grade, setGrade] = useState(() => {
    const existingGrade = booking.testResult?.lwrLevel?.trim()
    const expectedGrade = booking.expectedLevel?.trim()
    return (
      (existingGrade && MATH_GRADES.includes(existingGrade) && existingGrade) ||
      (expectedGrade && MATH_GRADES.includes(expectedGrade) && expectedGrade) ||
      'Lớp 1'
    )
  })

  // Điểm số
  const [score, setScore] = useState(() => {
    const existingLwr = booking.testResult?.lwr || ''
    if (existingLwr.includes('/')) {
      return existingLwr.split('/')[0]?.trim() || '15'
    }
    return existingLwr && existingLwr !== '-' ? existingLwr : '15'
  })

  const [maxScore, setMaxScore] = useState(() => {
    const existingLwr = booking.testResult?.lwr || ''
    if (existingLwr.includes('/')) {
      return existingLwr.split('/')[1]?.trim() || '20'
    }
    return '20'
  })

  const [selectedLevel, setSelectedLevel] = useState(
    () => booking.testResult?.level?.trim() || booking.expectedLevel?.trim() || ''
  )

  const [fileName, setFileName] = useState(
    () =>
      booking.testResult?.uploadedFileName ||
      (booking.testResult?.lwr ? `Phieu_cham_toan_${booking.childName.replace(/\s+/g, '_')}.pdf` : '')
  )

  const [fileUrl, setFileUrl] = useState(
    () =>
      booking.testResult?.uploadedFileUrl ||
      booking.resultLink ||
      `https://rinoedu.ai/ket-qua-cham-tay/${booking.id}.pdf`
  )

  const [mathComment, setMathComment] = useState(
    () => booking.testResult?.mathComment || booking.notes?.at(-1)?.text || ''
  )

  const [learningRoadmap, setLearningRoadmap] = useState(
    () => booking.testResult?.learningRoadmap || ''
  )

  const handleFakeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setFileUrl(URL.createObjectURL(file))
      toast.success(`Đã chọn tệp: ${file.name}`)
    }
  }

  const handleSave = () => {
    if (!score.trim()) {
      toast.error('Vui lòng nhập điểm bài thi')
      return
    }

    const finalScore = `${score.trim()}/${maxScore.trim() || '20'}`
    const finalGrade = grade
    const finalFileUrl = fileUrl || `https://rinoedu.ai/ket-qua-cham-tay/${booking.id}.pdf`
    const finalFileName = fileName || `Phieu_cham_toan_${booking.childName.replace(/\s+/g, '_')}.pdf`

    onUpdateBooking(booking.id, (current) => ({
      ...current,
      status:
        current.status === 'booked_assessment' ||
        current.status === 'checkin' ||
        current.status === 'assessing'
          ? 'completed'
          : current.status,
      testSource: 'manual',
      teacher: authorName || current.teacher,
      tester: authorName || current.tester,
      testResult: {
        ...current.testResult,
        testSource: 'manual',
        lwr: finalScore,
        lwrLevel: finalGrade,
        level: selectedLevel || current.testResult?.level,
        uploadedFileName: finalFileName,
        uploadedFileUrl: finalFileUrl,
        mathComment: mathComment.trim(),
        learningRoadmap: learningRoadmap.trim(),
      },
      resultLink: finalFileUrl,
      notes: mathComment.trim()
        ? [
            ...(current.notes || []),
            {
              text: mathComment.trim(),
              author: authorName,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            },
          ]
        : current.notes,
    }))

    toast.success(`Đã cập nhật kết quả chấm tay cho học viên ${booking.childName}`)
    onClose()
  }

  return (
    <>
      {/* Header */}
      <DialogHeader className="space-y-0.5 shrink-0 pb-1.5 border-b border-border/40">
        <div className="flex items-center justify-between gap-2 pr-6">
          <DialogTitle className="text-sm font-normal text-muted-foreground">
            Cập nhật kết quả bài chấm tay (môn Toán)
          </DialogTitle>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          <span>
            Học viên: <span className="font-medium text-foreground">{booking.childName}</span>
          </span>
          <span>•</span>
          <span>{booking.program}</span>
          <span>•</span>
          <span>
            Người chấm: <span className="font-medium text-foreground">{authorName}</span>
          </span>
        </div>
      </DialogHeader>

      {/* Scrollable Form Body */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2.5 text-xs py-0.5">
        {/* Lưới thông số chính: Khối lớp, Điểm số, Trình độ Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. Khối lớp */}
          <div className="space-y-1">
            <FieldLabel label="Khối lớp" />
            <InlineSelect
              value={grade}
              ariaLabel="Chọn khối lớp"
              options={MATH_GRADES.map((g) => ({ value: g, label: g }))}
              onValueChange={setGrade}
              className="h-8 text-xs border border-input bg-background w-full rounded"
            />
          </div>

          {/* 2. Điểm số bài làm */}
          <div className="space-y-1">
            <FieldLabel label="Điểm số bài làm" required />
            <div className="flex items-center gap-1.5">
              <Input
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="15"
                className="h-8 text-xs text-center font-mono font-medium"
              />
              <span className="text-muted-foreground font-mono">/</span>
              <Input
                type="text"
                value={maxScore}
                onChange={(e) => setMaxScore(e.target.value)}
                placeholder="20"
                className="h-8 text-xs text-center font-mono font-medium w-16"
              />
            </div>
          </div>

          {/* 3. Level xếp lớp */}
          <div className="space-y-1">
            <FieldLabel label="Trình độ xếp lớp (Level)" />
            <InlineSelect
              value={selectedLevel}
              ariaLabel="Chọn trình độ môn Toán"
              options={[
                { value: '', label: 'Chưa đặt' },
                ...MATH_LEVELS.map((lvl) => ({ value: lvl, label: lvl })),
              ]}
              onValueChange={setSelectedLevel}
              className="h-8 text-xs border border-input bg-background w-full rounded"
            />
          </div>
        </div>

        {/* 4. Phiếu chấm bài thi đính kèm (PDF / Ảnh chụp) */}
        <div className="space-y-1">
          <FieldLabel label="Phiếu chấm bài thi (PDF / Ảnh chụp)" />
          {fileName ? (
            <div className="flex items-center justify-between p-2 rounded border border-border/70 bg-card text-xs">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span className="font-mono truncate" title={fileName}>
                  {fileName}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  setFileName('')
                  setFileUrl('')
                }}
                className="size-6 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded shrink-0 cursor-pointer"
                title="Xóa tệp"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <label className="flex items-center justify-between px-3 py-1.5 border border-dashed border-primary/40 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer text-xs">
              <div className="flex items-center gap-2 text-primary">
                <FileUp className="h-4 w-4 shrink-0" />
                <span className="font-medium">Bấm để chọn tệp kết quả (PDF, JPG, PNG)</span>
              </div>
              <span className="text-[10.5px] text-muted-foreground">Dung lượng tối đa 10MB</span>
              <input
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={handleFakeFileUpload}
              />
            </label>
          )}
        </div>

        {/* 5. Nhận xét bài làm (Rich Text Editor - Ô to có công cụ biên tập text) */}
        <BookingTestRichTextEditor
          label="Nhận xét bài làm"
          value={mathComment}
          onChange={setMathComment}
          placeholder="Nhập nhận xét chi tiết về tư duy logic, phản xạ tính toán, khả năng suy luận của học viên..."
          minHeight="100px"
        />

        {/* 6. Lộ trình học tập (Rich Text Editor - Ô to có công cụ biên tập text) */}
        <BookingTestRichTextEditor
          label="Lộ trình học tập"
          value={learningRoadmap}
          onChange={setLearningRoadmap}
          placeholder="Nhập lộ trình học tập, kế hoạch phân bổ khóa học và mục tiêu phát triển cho học viên..."
          minHeight="100px"
        />
      </div>

      {/* Footer - Bỏ đường line footer theo yêu cầu */}
      <DialogFooter className="flex items-center justify-end gap-2 pt-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 px-3 text-xs cursor-pointer"
        >
          Hủy
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          className="h-8 px-3 text-xs gap-1.5 cursor-pointer"
        >
          <Check className="h-3.5 w-3.5" />
          <span>Lưu kết quả</span>
        </Button>
      </DialogFooter>
    </>
  )
}

export function BookingTestManualUploadDialog({
  open,
  booking,
  authorName = 'Người dùng hiện tại',
  onOpenChange,
  onUpdateBooking,
}: BookingTestManualUploadDialogProps) {
  if (!booking) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] md:max-w-[960px] lg:max-w-[1000px] w-full max-h-[92vh] p-3.5 sm:p-4 gap-2 flex flex-col overflow-hidden">
        <ManualUploadForm
          key={`${booking.id}-${open}`}
          booking={booking}
          authorName={authorName}
          onClose={() => onOpenChange(false)}
          onUpdateBooking={onUpdateBooking}
        />
      </DialogContent>
    </Dialog>
  )
}
