'use client'

import React, { useState } from 'react'
import {
  Plus,
  AlertCircle,
  Wrench,
  BookOpen,
  Users,
  Sparkles,
  MessageSquareWarning,
  Trash2,
  History,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { getStatusBadgeClass } from '@/lib/statusColors'

export type QualityCategory = 'equipment' | 'syllabus' | 'discipline' | 'teaching' | 'other'

export type QualityStatus = 'chua_xuly' | 'dang_xuly' | 'da_xuly' | 'da_dong'

export interface QualityIssue {
  id: string
  category: QualityCategory
  description: string
  status: QualityStatus
  createdAt: string
  author: string
  sessionName?: string
}

const CATEGORY_MAP: Record<QualityCategory, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  equipment: { label: 'Thiết bị & Phòng', icon: Wrench },
  syllabus: { label: 'Giáo trình & Bài giảng', icon: BookOpen },
  discipline: { label: 'Kỷ luật & Tương tác', icon: Users },
  teaching: { label: 'Chất lượng giảng dạy', icon: Sparkles },
  other: { label: 'Vấn đề khác', icon: MessageSquareWarning },
}

const STATUS_LABELS: Record<QualityStatus, string> = {
  chua_xuly: 'Chưa xử lý',
  dang_xuly: 'Đang xử lý',
  da_xuly: 'Đã xử lý',
  da_dong: 'Đã đóng',
}

// Mock historical quality records from previous sessions
const MOCK_HISTORICAL_ISSUES: QualityIssue[] = [
  {
    id: 'hist-1',
    category: 'equipment',
    description: 'Điều hòa phòng 2 thổi trực tiếp vào dãy bàn 1 làm học sinh lạnh.',
    status: 'da_xuly',
    createdAt: '15/07/2026 18:30',
    author: 'GV Mỹ Linh',
    sessionName: 'Buổi 2: Family & Friends',
  },
  {
    id: 'hist-2',
    category: 'discipline',
    description: 'Học viên Alex nói chuyện nhiều trong giờ làm bài nhóm.',
    status: 'da_dong',
    createdAt: '10/07/2026 19:10',
    author: 'Trợ giảng',
    sessionName: 'Buổi 1: Story time',
  },
]

interface ClassesSessionQualityEvaluationProps {
  sessionId: string
  sessionTopic?: string
  sessionStatus?: 'completed' | 'ongoing' | 'upcoming' | 'cancelled' | 'absent'
}

export function ClassesSessionQualityEvaluation({
  sessionId,
  sessionStatus,
}: ClassesSessionQualityEvaluationProps) {
  const isUpcoming = sessionStatus === 'upcoming'

  // Mock default issues per session
  const [issuesMap, setIssuesMap] = useState<Record<string, QualityIssue[]>>(() => ({
    [sessionId]: [
      {
        id: 'iss-1',
        category: 'equipment',
        description: 'Micro phòng 2 bị chập chờn khi trợ giảng bật loa.',
        status: 'chua_xuly',
        createdAt: '17:50',
        author: 'GV Mỹ Linh',
      },
      {
        id: 'iss-2',
        category: 'syllabus',
        description: 'Slide bài giảng phần Speaking 2 thiếu 1 video demo.',
        status: 'dang_xuly',
        createdAt: '18:15',
        author: 'Trợ giảng',
      },
    ],
  }))

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(isUpcoming)
  const [newCategory, setNewCategory] = useState<QualityCategory>('equipment')
  const [newDescription, setNewDescription] = useState('')
  const newStatus: QualityStatus = 'chua_xuly'

  const issues = isUpcoming ? [] : (issuesMap[sessionId] || [])

  const handleDeleteIssue = (issueId: string) => {
    setIssuesMap((prev) => ({
      ...prev,
      [sessionId]: (prev[sessionId] || []).filter((iss) => iss.id !== issueId),
    }))
    toast.success('Đã xóa ghi nhận cải thiện!')
  }

  const handleAddIssue = () => {
    if (!newDescription.trim()) {
      toast.error('Vui lòng nhập nội dung vấn đề cần cải thiện!')
      return
    }

    const newIssue: QualityIssue = {
      id: `iss-${Date.now()}`,
      category: newCategory,
      description: newDescription.trim(),
      status: newStatus,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      author: 'Giáo viên',
    }

    setIssuesMap((prev) => ({
      ...prev,
      [sessionId]: [newIssue, ...(prev[sessionId] || [])],
    }))

    setNewDescription('')
    setIsAddDialogOpen(false)
    toast.success('Đã thêm ghi nhận chất lượng!')
  }

  return (
    <div className="shrink-0 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs p-3.5 space-y-3">
      {/* Title Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 truncate">
            Chất lượng
          </h3>
          {issues.length > 0 && (
            <Badge variant="secondary" className="rounded-full text-[10px] font-bold px-1.5 py-0 h-4">
              {issues.length}
            </Badge>
          )}
        </div>
        {!isUpcoming && (
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() => setIsAddDialogOpen(true)}
            className="h-6 text-[10px] gap-1 px-2 rounded-lg cursor-pointer border-amber-200 dark:border-amber-900/60 bg-amber-50/50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 shrink-0"
          >
            <Plus className="h-3 w-3" /> Thêm vấn đề
          </Button>
        )}
      </div>

      {/* Current Session Issues List / Notice for Upcoming */}
      {isUpcoming ? (
        <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 p-2.5 text-center text-xs text-muted-foreground italic">
          Buổi học chưa bắt đầu
        </div>
      ) : issues.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 p-3 text-center text-xs text-muted-foreground italic">
          Chưa có vấn đề cần cải thiện nào được ghi nhận cho buổi này.
        </div>
      ) : (
        <div className="space-y-2">
          {issues.map((issue) => {
            const CatIcon = CATEGORY_MAP[issue.category]?.icon || AlertCircle
            return (
              <div
                key={issue.id}
                className="rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 p-2.5 space-y-1.5 transition-all hover:border-zinc-200"
              >
                {/* Category & Static Readonly Status Badge */}
                <div className="flex items-center justify-between gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    <CatIcon className="h-3 w-3 text-zinc-400 shrink-0" />
                    {CATEGORY_MAP[issue.category]?.label}
                  </span>

                  {/* Readonly Status Badge (no dropdown, status managed in CARE/CS) */}
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className={`rounded-full text-[10px] font-bold px-2 py-0.5 border ${getStatusBadgeClass(
                        issue.status
                      )}`}
                    >
                      {STATUS_LABELS[issue.status]}
                    </Badge>

                    <button
                      type="button"
                      onClick={() => handleDeleteIssue(issue.id)}
                      className="p-1 text-zinc-400 hover:text-red-500 rounded-md transition-colors cursor-pointer"
                      title="Xóa vấn đề"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-normal">
                  {issue.description}
                </p>

                {/* Footer metadata */}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
                  <span>Bởi: {issue.author}</span>
                  <span>{issue.createdAt}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Expand Full Quality History Section */}
      <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="w-full flex items-center justify-between text-[11px] font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" />
            Xem toàn bộ lịch sử chất lượng
          </span>
          {isHistoryExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {isHistoryExpanded && (
          <div className="mt-2 space-y-2 animate-in fade-in-50">
            <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Lịch sử các buổi trước ({MOCK_HISTORICAL_ISSUES.length})
            </div>
            {MOCK_HISTORICAL_ISSUES.map((hist) => {
              const CatIcon = CATEGORY_MAP[hist.category]?.icon || AlertCircle
              return (
                <div
                  key={hist.id}
                  className="rounded-lg border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-1 text-[10px]">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      {hist.sessionName}
                    </span>
                    <Badge
                      variant="outline"
                      className={`rounded-full text-[9px] font-bold px-1.5 py-0 border ${getStatusBadgeClass(
                        hist.status
                      )}`}
                    >
                      {STATUS_LABELS[hist.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <CatIcon className="h-3 w-3" />
                    <span>{CATEGORY_MAP[hist.category]?.label}</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 dark:text-zinc-300">{hist.description}</p>
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                    <span>{hist.author}</span>
                    <span>{hist.createdAt}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Issue Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl p-4 gap-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Ghi nhận vấn đề cần cải thiện
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-1">
            {/* Category Select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Phân loại vấn đề
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as QualityCategory)}
                className="w-full h-8 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {(Object.keys(CATEGORY_MAP) as QualityCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_MAP[cat].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Nội dung chi tiết vấn đề
              </label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Mô tả cụ thể sự cố hoặc vấn đề cần khắc phục cho buổi học này..."
                className="text-xs min-h-[80px] rounded-lg border-zinc-200 dark:border-zinc-800"
                rows={3}
              />
            </div>

            {/* Initial Status Note (Read-only default: Chưa xử lý) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Trạng thái khởi tạo
              </label>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`rounded-full text-[10px] font-bold px-2 py-0.5 border ${getStatusBadgeClass(
                    newStatus
                  )}`}
                >
                  {STATUS_LABELS[newStatus]}
                </Badge>
                <span className="text-[10px] text-muted-foreground italic">
                  (Trạng thái sẽ được bộ phận CS/CARE cập nhật sau)
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddDialogOpen(false)}
              className="h-8 text-xs rounded-lg"
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleAddIssue}
              className="h-8 text-xs rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold"
            >
              Lưu vấn đề
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
