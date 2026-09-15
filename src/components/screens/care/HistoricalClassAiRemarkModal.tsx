'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  Bot,
  CheckCircle2,
  RotateCcw,
  User,
  GraduationCap,
  AlertCircle,
  Save,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { type SimulatedPackage } from './studentCareDetailTypes'

export interface ClassRemarkState {
  text: string
  isAiGenerated: boolean
  lastEditedBy?: string
  lastEditedAt?: string
}

interface HistoricalClassAiRemarkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pkg: SimulatedPackage | null
  teacherName: string
  studentName?: string
  currentRemark?: ClassRemarkState
  onSaveRemark: (pkgId: string, updatedRemark: ClassRemarkState) => void
}

const AI_SUGGESTIONS = [
  'Nhấn mạnh vào khả năng tư duy logic và tính tự giác làm bài tập.',
  'Bổ sung lưu ý rèn luyện tính cẩn thận và kiểm tra lại bài trước khi nộp.',
  'Khẳng định đã đạt chuẩn đầu ra và đề xuất chuyển tiếp lên cấp độ mới.',
]

export function HistoricalClassAiRemarkModal({
  open,
  onOpenChange,
  pkg,
  teacherName,
  studentName = 'Học viên',
  currentRemark,
  onSaveRemark,
}: HistoricalClassAiRemarkModalProps) {
  const [remarkText, setRemarkText] = useState(currentRemark?.text || '')
  const [isGenerating, setIsGenerating] = useState(false)

  if (!pkg) return null

  const handleRegenerateWithAi = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const isEnglish = !pkg.packageName.toLowerCase().includes('toán')
      const regenerated = isEnglish
        ? `${studentName} hoàn thành khóa học với tinh thần học tập hăng hái, phản xạ ngôn ngữ tiến bộ rõ rệt và tương tác tự tin trong các giờ thảo luận nhóm. Điểm kiểm tra tổng kết đạt ${pkg.lastTestScore || 9.0}. Cần chú ý củng cố kỹ năng viết đoạn văn và mở rộng vốn từ vựng học thuật. Kiến nghị: Đạt chuẩn đầu ra, đủ năng lực chuyển tiếp lên chương trình tiếp theo.`
        : `${studentName} nắm vững phương pháp tư duy suy luận logic, giải quyết tốt các bài toán đố nâng cao và duy trì tinh thần làm bài tập đầy đủ. Kết quả thi cuối khóa đạt ${pkg.lastTestScore || 9.0} điểm. Giáo viên khuyến nghị con rèn luyện tính kiên nhẫn khi trình bày các bước toán hình. Kiến nghị: Đạt chuẩn đầu ra, đủ điều kiện chuyển tiếp lên trình độ tiếp theo.`
      
      setRemarkText(regenerated)
      setIsGenerating(false)
      toast.info('Đã tạo lại nhận xét tổng kết bằng AI!')
    }, 600)
  }

  const handleApplySuggestion = (suggestion: string) => {
    setRemarkText((prev) => `${prev.trim()} ${suggestion}`)
  }

  const handleSave = () => {
    if (!remarkText.trim()) {
      toast.error('Vui lòng không để trống nội dung nhận xét!')
      return
    }

    const updated: ClassRemarkState = {
      text: remarkText.trim(),
      isAiGenerated: false,
      lastEditedBy: teacherName || 'Giáo viên bộ môn',
      lastEditedAt: new Date().toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    }

    onSaveRemark(pkg.id, updated)
    toast.success('Đã lưu nhận xét học thuật thành công!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <DialogTitle className="text-base font-bold text-foreground">
              Nhận xét học tập Lớp học (AI Tổng hợp)
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Nhận xét này được AI tổng hợp tự động từ kết quả học tập của học viên. Giáo viên hoặc chuyên viên chăm sóc có thể rà soát và điều chỉnh trước khi gửi phụ huynh.
          </DialogDescription>
        </DialogHeader>

        {/* Thẻ tóm tắt thông tin lớp & học viên */}
        <div className="p-3 rounded-lg bg-muted/20 border border-border/60 text-xs space-y-1.5 text-left">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 font-bold text-foreground">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              <span>{pkg.className}</span>
              <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {pkg.classCode}
              </span>
            </div>
            <Badge className="text-[10px] py-0.2 px-2 bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 border-none">
              Trình độ: {pkg.level} — Level {pkg.subLevel}
            </Badge>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span>Học viên: <strong className="text-foreground font-semibold">{studentName}</strong></span>
            </span>
            <span className="text-border">•</span>
            <span>GV phụ trách: <strong className="text-foreground font-semibold">{teacherName}</strong></span>
            <span className="text-border">•</span>
            <span>Điểm KT: <strong className="text-amber-600 font-bold">{pkg.lastTestScore || 9.0}</strong></span>
          </div>
        </div>

        {/* Khu vực biên soạn nhận xét */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <label htmlFor="remark-textarea" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span>Nội dung nhận xét tổng kết</span>
              {currentRemark?.isAiGenerated ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-1.5 py-0.2 rounded border border-violet-200 dark:border-violet-800/40">
                  <Bot className="h-2.5 w-2.5" /> Bản thảo do AI đề xuất
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/40">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Đã có chỉnh sửa từ GV
                </span>
              )}
            </label>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isGenerating}
              onClick={handleRegenerateWithAi}
              className="h-6 px-2 text-[11px] font-medium text-violet-700 dark:text-violet-300 hover:bg-violet-100/50 dark:hover:bg-violet-900/40 gap-1 cursor-pointer"
            >
              <RotateCcw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Đang tạo...' : 'AI Viết lại'}</span>
            </Button>
          </div>

          <Textarea
            id="remark-textarea"
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            rows={5}
            className="text-xs leading-relaxed resize-none focus-visible:ring-violet-500"
            placeholder="Nhập nội dung nhận xét của giáo viên về quá trình học tập, năng lực và khuyến nghị tiếp theo..."
          />
          <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
            <span>{remarkText.length} ký tự</span>
            <span>Khuyến nghị từ 100 - 300 ký tự để súc tích khi gửi phụ huynh.</span>
          </div>
        </div>

        {/* Gợi ý nhanh từ AI để bổ sung vào nhận xét */}
        <div className="space-y-1.5 text-left pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-violet-500" />
            <span>Gợi ý chèn nhanh tiêu chí đánh giá:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {AI_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySuggestion(sug)}
                className="text-[10.5px] text-left px-2 py-1 rounded-md bg-muted/40 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-300 border border-border/60 hover:border-violet-200 transition-colors cursor-pointer"
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between pt-2 border-t border-border/60">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Sau khi lưu, nhận xét sẽ chuyển trạng thái &quot;Đã duyệt bởi GV&quot;.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="h-8 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Lưu nhận xét</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
