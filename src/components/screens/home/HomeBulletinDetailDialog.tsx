'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Pin, ArrowUpRight, Check, CheckCheck } from 'lucide-react'
import { AppAvatar } from '@/components/shared'
import type { BulletinPost } from './homeTypes'

interface HomeBulletinDetailDialogProps {
  post: BulletinPost | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onToggleAcknowledge: (id: string) => void
  onNavigate: (url: string) => void
}

export function HomeBulletinDetailDialog({
  post,
  open,
  onOpenChange,
  onToggleAcknowledge,
  onNavigate,
}: HomeBulletinDetailDialogProps) {
  if (!post) return null

  const isHighlight = post.isUrgent || post.category === 'urgent'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-5 gap-4">
        <DialogHeader className="space-y-2">
          {/* Badges & Meta */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {post.isPinned && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 text-xs font-normal border border-indigo-500/30">
                  <Pin className="w-3 h-3 rotate-45 shrink-0" />
                  <span>Đã ghim</span>
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-normal border ${post.badgeColor}`}>
                {post.categoryLabel}
              </span>
              {isHighlight && (
                <span className="text-xs px-2 py-0.5 rounded-full font-normal bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                  Khẩn cấp
                </span>
              )}
            </div>

            <span className="text-xs font-mono text-muted-foreground/80">
              {post.createdAt}
            </span>
          </div>

          <DialogTitle className="text-sm sm:text-base font-semibold text-foreground text-left leading-snug">
            {post.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chi tiết thông báo vận hành
          </DialogDescription>
        </DialogHeader>

        {/* Tác giả */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border/50">
          <AppAvatar
            name={post.authorName}
            src={post.authorAvatar}
            size="sm"
            className="shrink-0"
          />
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground">
              {post.authorName}
            </div>
            <div className="text-xs text-muted-foreground">
              {post.authorRole}
            </div>
          </div>
        </div>

        {/* Nội dung đầy đủ */}
        <div className="p-3 rounded-lg border border-border/60 bg-card/60 text-xs text-foreground/90 leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto custom-scrollbar">
          {post.content}
        </div>

        {/* Tác vụ */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
          <button
            type="button"
            onClick={() => onToggleAcknowledge(post.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer select-none ${
              post.isAcknowledged
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-medium'
                : 'text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/60'
            }`}
          >
            {post.isAcknowledged ? (
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <Check className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>
              {post.isAcknowledged ? 'Đã tiếp nhận' : 'Xác nhận tiếp nhận'} ({post.acknowledgedCount || 0})
            </span>
          </button>

          {post.actionLabel && post.actionUrl && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => {
                onOpenChange(false)
                onNavigate(post.actionUrl!)
              }}
              className="h-8 text-xs font-normal gap-1.5 px-3 rounded-lg shadow-2xs"
            >
              <span>{post.actionLabel}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
