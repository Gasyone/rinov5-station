'use client'

import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared'
import type { QcComment } from '@/mocks/qcChecks'
import { formatDateTime, getInitials } from './qcCheckHelpers'

interface QcCheckCommentsTabProps {
  comments?: QcComment[]
  onAddComment: (comment: string) => void
}

export function QcCheckCommentsTab({ comments, onAddComment }: QcCheckCommentsTabProps) {
  const [commentText, setCommentText] = useState('')

  const handleSend = () => {
    if (!commentText.trim()) return
    onAddComment(commentText)
    setCommentText('')
  }

  return (
    <div className="m-0 h-full p-0 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {!comments || comments.length === 0 ? (
          <EmptyState
            title="Chưa có trao đổi nào"
            description="Hãy bắt đầu cuộc trao đổi thảo luận với những người liên quan ở đợt QC này."
            icon={<MessageSquare className="h-5 w-5" />}
          />
        ) : (
          <div className="space-y-4">
            {comments.map((comm) => (
              <div key={comm.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card max-w-3xl">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {getInitials(comm.userName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold text-sm">{comm.userName}</span>
                    {comm.userRole && (
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        {comm.userRole}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(comm.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-foreground whitespace-pre-line">{comm.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 p-4 border-t bg-slate-50 dark:bg-slate-900/50 flex gap-3 items-end">
        <textarea
          rows={2}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Nhập nội dung trao đổi, phản hồi của bạn..."
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs focus-visible:outline-hidden"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
        <Button size="sm" onClick={handleSend} className="gap-1.5 h-10 shrink-0">
          <Send className="h-4 w-4" />
          Gửi
        </Button>
      </div>
    </div>
  )
}
