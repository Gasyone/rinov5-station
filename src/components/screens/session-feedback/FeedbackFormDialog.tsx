'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import type { SessionFeedback, HomeworkStatus, AttendanceStatus, ProgressLevel } from '@/mocks/sessionFeedback'
import { ATTENDANCE_LABELS, PROGRESS_LABELS } from '@/mocks/sessionFeedback'

interface FeedbackFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedback: SessionFeedback | null
  onSave: (feedback: SessionFeedback) => void
}

export function FeedbackFormDialog({
  open,
  onOpenChange,
  feedback,
  onSave,
}: FeedbackFormDialogProps) {
  const [homeworkTitle, setHomeworkTitle] = useState(() =>
    feedback ? feedback.homeworkTitle ?? '' : '',
  )
  const [homeworkUrl, setHomeworkUrl] = useState(() =>
    feedback ? feedback.homeworkUrl ?? '' : '',
  )
  const [homeworkScore, setHomeworkScore] = useState(() =>
    feedback ? feedback.homeworkScore?.toString() ?? '' : '',
  )
  const [homeworkNote, setHomeworkNote] = useState(() =>
    feedback ? feedback.homeworkNote ?? '' : '',
  )
  const [homeworkStatus, setHomeworkStatus] = useState<HomeworkStatus>(() =>
    feedback ? feedback.homeworkStatus : 'missing',
  )
  const [attendance, setAttendance] = useState<AttendanceStatus>(() =>
    feedback ? feedback.attendance : 'present',
  )
  const [progress, setProgress] = useState<ProgressLevel>(() =>
    feedback ? feedback.progress : 'stable',
  )
  const [feedbackText, setFeedbackText] = useState(() =>
    feedback ? feedback.feedback ?? '' : '',
  )
  const [recommendation, setRecommendation] = useState(() =>
    feedback ? feedback.recommendation ?? '' : '',
  )

  const handleSave = () => {
    if (!feedback) return

    const updated: SessionFeedback = {
      ...feedback,
      homeworkStatus,
      homeworkTitle: homeworkTitle || undefined,
      homeworkUrl: homeworkUrl || undefined,
      homeworkScore: homeworkScore ? Number(homeworkScore) : undefined,
      homeworkNote: homeworkNote || undefined,
      attendance,
      progress,
      feedback: feedbackText || undefined,
      recommendation: recommendation || undefined,
      status: feedbackText ? 'completed' : 'pending',
    }

    onSave(updated)
    toast.success('Đã lưu nhận xét')
    onOpenChange(false)
  }

  if (!feedback) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nhận xét học viên</DialogTitle>
          <DialogDescription>
            {feedback.studentName} — Buổi {feedback.sessionCode} ({feedback.className})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-sm">Điểm danh</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant={attendance === val ? 'default' : 'outline'}
                  size="sm"
                  className="justify-start"
                  onClick={() => setAttendance(val)}
                >
                  {ATTENDANCE_LABELS[val]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Bài tập về nhà</Label>
            <div className="grid grid-cols-2 gap-2">
              {(['done', 'missing', 'late', 'partial'] as HomeworkStatus[]).map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant={homeworkStatus === val ? 'default' : 'outline'}
                  size="sm"
                  className="justify-start"
                  onClick={() => setHomeworkStatus(val)}
                >
                  {val === 'done' ? 'Đã nộp' : val === 'missing' ? 'Chưa nộp' : val === 'late' ? 'Nộp muộn' : 'Nộp một phần'}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hw-title" className="text-sm">
              Tên bài tập
            </Label>
            <Input
              id="hw-title"
              value={homeworkTitle}
              onChange={(e) => setHomeworkTitle(e.target.value)}
              placeholder="VD: Bài tập Unit 5 - Reading"
              className="h-9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hw-url" className="text-sm">
              Link bài tập
            </Label>
            <Input
              id="hw-url"
              value={homeworkUrl}
              onChange={(e) => setHomeworkUrl(e.target.value)}
              placeholder="https://..."
              className="h-9"
            />
          </div>

          {homeworkStatus === 'done' && (
            <div className="space-y-2">
              <Label htmlFor="hw-score" className="text-sm">
                Điểm bài tập (0-10)
              </Label>
              <Input
                id="hw-score"
                type="number"
                min={0}
                max={10}
                value={homeworkScore}
                onChange={(e) => setHomeworkScore(e.target.value)}
                placeholder="VD: 8"
                className="h-9"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="hw-note" className="text-sm">
              Nhận xét bài tập
            </Label>
            <Textarea
              id="hw-note"
              value={homeworkNote}
              onChange={(e) => setHomeworkNote(e.target.value)}
              placeholder="Nhận xét chi tiết về bài tập về nhà..."
              className="min-h-[60px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Tiến bộ</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['improved', 'stable', 'needs_attention'] as ProgressLevel[]).map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant={progress === val ? 'default' : 'outline'}
                  size="sm"
                  className="justify-start"
                  onClick={() => setProgress(val)}
                >
                  {PROGRESS_LABELS[val]}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback-text" className="text-sm">
              Nhận xét chung
            </Label>
            <Textarea
              id="feedback-text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Nhận xét tổng quát về buổi học..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommendation" className="text-sm">
              Khuyến nghị
            </Label>
            <Textarea
              id="recommendation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="Gợi ý cho học viên..."
              className="min-h-[60px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave}>
            Lưu nhận xét
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}