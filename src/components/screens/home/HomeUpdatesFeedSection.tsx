'use client'

import React, { useState, useMemo } from 'react'
import {
  Megaphone,
  Pin,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Check,
  CheckCheck,
  ArrowRight,
  MessageSquare,
  ListTodo,
  Radio,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { AppAvatar, EmptyState } from '@/components/shared'
import { INITIAL_BULLETIN_POSTS } from './homeBulletinMocks'
import { HomeCreatePostDialog } from './HomeCreatePostDialog'
import { HomeBulletinDetailDialog } from './HomeBulletinDetailDialog'
import type { DailyTodoItem, BulletinPost, BulletinCategory } from './homeTypes'

export function formatAbbreviatedTime(raw: string): string {
  if (!raw) return ''
  const lower = raw.toLowerCase().trim()

  // Giây: "30 giây trước" -> "30s"
  if (lower.includes('giây')) {
    const num = lower.replace(/\D/g, '')
    return num ? `${num}s` : '10s'
  }
  // Phút: "15 phút trước" -> "15ph"
  if (lower.includes('phút')) {
    const num = lower.replace(/\D/g, '')
    return num ? `${num}ph` : '15ph'
  }
  // Giờ: "2 giờ trước" -> "2h"
  if (lower.includes('giờ') && lower.includes('trước')) {
    const num = lower.replace(/\D/g, '')
    return num ? `${num}h` : '1h'
  }
  // Hôm nay hh:mm -> hh:mm
  if (lower.includes('hôm nay')) {
    const timeMatch = raw.match(/\d{1,2}:\d{2}/)
    return timeMatch ? timeMatch[0] : '08:30'
  }
  // Hôm qua hh:mm -> "1ng"
  if (lower.includes('hôm qua')) {
    return '1ng'
  }
  // Ngày trước: "2 ngày trước" -> "2ng"
  if (lower.includes('ngày')) {
    const num = lower.replace(/\D/g, '')
    return num ? `${num}ng` : '1ng'
  }
  // Tuần trước: "1 tuần trước" -> "1tu"
  if (lower.includes('tuần')) {
    const num = lower.replace(/\D/g, '')
    return num ? `${num}tu` : '1tu'
  }
  // Format dạng hh:mm
  if (/^\d{1,2}:\d{2}$/.test(raw.trim())) {
    return raw.trim()
  }

  return raw
}

interface HomeUpdatesFeedSectionProps {
  todos: DailyTodoItem[]
  onNavigate: (url: string) => void
  userName?: string
}

export function HomeUpdatesFeedSection({
  todos,
  onNavigate,
  userName = 'Admin',
}: HomeUpdatesFeedSectionProps) {
  // Default view is BẢNG TIN per user request
  const [activeTab, setActiveTab] = useState<'feed' | 'tasks'>('feed')
  const [posts, setPosts] = useState<BulletinPost[]>(INITIAL_BULLETIN_POSTS)
  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'all' | 'pinned' | 'urgent' | 'handover' | 'operational'>('all')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<BulletinPost | null>(null)
  const [completedTodoIds, setCompletedTodoIds] = useState<Set<string>>(new Set())

  // Toggle todo completion
  const toggleTodo = (id: string) => {
    setCompletedTodoIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Toggle acknowledge post
  const toggleAcknowledge = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isAck = !p.isAcknowledged
          return {
            ...p,
            isAcknowledged: isAck,
            acknowledgedCount: Math.max(0, (p.acknowledgedCount || 0) + (isAck ? 1 : -1)),
          }
        }
        return p
      })
    )
    setSelectedPostForDetail((prev) => {
      if (!prev || prev.id !== postId) return prev
      const isAck = !prev.isAcknowledged
      return {
        ...prev,
        isAcknowledged: isAck,
        acknowledgedCount: Math.max(0, (prev.acknowledgedCount || 0) + (isAck ? 1 : -1)),
      }
    })
  }

  // Handle new post creation
  const handleCreatePost = (newPost: BulletinPost) => {
    setPosts((prev) => [newPost, ...prev])
    setFeedCategoryFilter('all')
  }

  // Filtered & sorted posts: Pinned posts always float to the top
  const filteredPosts = useMemo(() => {
    let list = [...posts]

    if (feedCategoryFilter === 'pinned') {
      list = list.filter((p) => p.isPinned)
    } else if (feedCategoryFilter === 'urgent') {
      list = list.filter((p) => p.isUrgent || p.category === 'urgent')
    } else if (feedCategoryFilter === 'handover') {
      list = list.filter((p) => p.category === 'handover')
    } else if (feedCategoryFilter === 'operational') {
      list = list.filter((p) => p.category === 'operational')
    }

    // Sort: Pinned first, then by urgency, then as is
    return list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      if (a.isUrgent && !b.isUrgent) return -1
      if (!a.isUrgent && b.isUrgent) return 1
      return 0
    })
  }, [posts, feedCategoryFilter])

  const pinnedCount = posts.filter((p) => p.isPinned).length
  const urgentCount = posts.filter((p) => p.isUrgent || p.category === 'urgent').length

  const totalTodosCount = todos.length
  const completedTodosCount = completedTodoIds.size
  const todoProgressPercent = totalTodosCount > 0 ? Math.round((completedTodosCount / totalTodosCount) * 100) : 100

  return (
    <div className="bg-card border border-border/70 rounded-xl p-2 sm:p-2.5 shadow-xs flex flex-col h-full space-y-1.5 min-h-0 overflow-hidden">
      {/* 1. Header Bảng tin: Icon + Title + Nút Đăng tin + View mode switcher */}
      <div className="flex items-center justify-between gap-1.5 pb-1 border-b border-border/50 shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Radio className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-medium text-foreground/90 truncate flex items-center gap-1">
            <span>Bảng tin vận hành</span>
            <Badge variant="secondary" className="text-xs h-4.5 px-1.5 font-normal text-muted-foreground bg-muted/80 rounded-full shrink-0">
              {posts.length}
            </Badge>
          </h3>
        </div>

        {/* Action Controls: Nút Đăng tin & Tab chuyển đổi chế độ xem */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="h-6 px-2 text-xs font-normal gap-1 rounded-md border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            title="Đăng thông báo mới lên bảng tin"
          >
            <Plus className="w-3 h-3" />
            <span>Đăng tin</span>
          </Button>

          <div className="inline-flex items-center rounded-md bg-muted/60 p-0.5 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('feed')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              Bảng tin
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tasks')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                activeTab === 'tasks'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              Việc cần xử lý
            </button>
          </div>
        </div>
      </div>

      {/* 2. CHẾ ĐỘ 1: BẢNG TIN VẬN HÀNH (DEFAULT TỔNG HỢP THÔNG TIN) */}
      {activeTab === 'feed' ? (
        <div className="flex-1 min-h-0 flex flex-col space-y-1.5">
          {/* Bộ lọc nhanh các phân loại thông tin */}
          <div className="flex items-center justify-between gap-1 shrink-0 px-0.5">
            <div className="flex items-center gap-1 flex-wrap text-xs">
              <button
                type="button"
                onClick={() => setFeedCategoryFilter('all')}
                className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                  feedCategoryFilter === 'all'
                    ? 'bg-primary/10 text-primary font-medium border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFeedCategoryFilter('pinned')}
                className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer flex items-center gap-0.5 ${
                  feedCategoryFilter === 'pinned'
                    ? 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium border border-indigo-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Pin className="w-3 h-3 rotate-45" />
                <span>Đã ghim</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedCategoryFilter('urgent')}
                className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer flex items-center gap-0.5 ${
                  feedCategoryFilter === 'urgent'
                    ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 font-medium border border-rose-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                <span>Khẩn cấp</span>
              </button>
              <button
                type="button"
                onClick={() => setFeedCategoryFilter('handover')}
                className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                  feedCategoryFilter === 'handover'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-medium border border-amber-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                Bàn giao
              </button>
              <button
                type="button"
                onClick={() => setFeedCategoryFilter('operational')}
                className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                  feedCategoryFilter === 'operational'
                    ? 'bg-sky-500/10 text-sky-700 dark:text-sky-400 font-medium border border-sky-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                Vận hành
              </button>
            </div>

            <span className="text-xs text-muted-foreground font-normal shrink-0">
              {pinnedCount} ghim • {urgentCount} khẩn
            </span>
          </div>

          {/* Danh sách các bài đăng bản tin - Cuộn nội bộ độc lập */}
          {filteredPosts.length === 0 ? (
            <EmptyState
              title="Không có tin thông báo nào trong mục này"
              className="py-6 text-xs flex-1"
            />
          ) : (
            <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
              {filteredPosts.map((post) => {
                const isHighlight = post.isUrgent || post.category === 'urgent'
                const isPinned = post.isPinned

                return (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPostForDetail(post)}
                    className={`rounded-lg border px-2.5 py-1.5 transition-all space-y-0.5 shadow-3xs cursor-pointer group ${
                      isHighlight
                        ? 'border-l-4 border-l-rose-500 border-border/70 bg-rose-500/5 dark:bg-rose-500/10 hover:bg-rose-500/15'
                        : isPinned
                        ? 'border-l-4 border-l-primary border-border/70 bg-primary/5 dark:bg-primary/10 hover:bg-primary/15'
                        : 'border-border/70 bg-card/80 hover:bg-muted/50'
                    }`}
                  >
                    {/* DÒNG 1: Tiêu đề, Huy hiệu và Tác giả • Thời gian viết tắt (Hover hiện Icon action) */}
                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {isPinned && (
                          <span
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 text-xs font-normal border border-indigo-500/30 shrink-0"
                            title="Thông báo được ghim ưu tiên"
                          >
                            <Pin className="w-3 h-3 rotate-45 shrink-0" />
                            <span>Ghim</span>
                          </span>
                        )}

                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-normal border shrink-0 ${post.badgeColor}`}
                        >
                          {post.categoryLabel}
                        </span>

                        <h4 className="text-sm font-medium text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                          {post.title}
                        </h4>
                      </div>

                      {/* Phía sau: Icon Action xuất hiện khi Hover + Tác giả • Thời gian viết tắt (xs, xph, xng, xtu...) */}
                      <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground">
                        {/* Action icons: chỉ hiện khi hover */}
                        <div
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Nút xác nhận đọc */}
                          <button
                            type="button"
                            onClick={() => toggleAcknowledge(post.id)}
                            className={`h-5 px-1.5 rounded flex items-center gap-0.5 text-xs transition-colors cursor-pointer ${
                              post.isAcknowledged
                                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 font-medium'
                                : 'text-muted-foreground hover:text-foreground bg-muted/80 hover:bg-muted border border-border/60'
                            }`}
                            title={post.isAcknowledged ? 'Đã đọc' : 'Đánh dấu đã đọc'}
                          >
                            {post.isAcknowledged ? (
                              <CheckCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            ) : (
                              <Check className="w-3 h-3 shrink-0" />
                            )}
                            <span>{post.acknowledgedCount || 0}</span>
                          </button>

                          {/* Nút link hành động xử lý nếu có */}
                          {post.actionLabel && post.actionUrl && (
                            <button
                              type="button"
                              onClick={() => onNavigate(post.actionUrl!)}
                              className="h-5 px-1.5 rounded flex items-center gap-0.5 text-xs text-primary hover:bg-primary/10 transition-colors cursor-pointer border border-primary/20"
                              title={post.actionLabel}
                            >
                              <span className="truncate max-w-[80px]">{post.actionLabel}</span>
                              <ArrowUpRight className="w-3 h-3 shrink-0" />
                            </button>
                          )}
                        </div>

                        <span className="truncate max-w-[85px] hidden sm:inline">{post.authorName}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="font-mono text-muted-foreground/80 font-normal text-xs">
                          {formatAbbreviatedTime(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    {/* DÒNG 2 (DÒNG PHỤ): Chỉ 1 dòng duy nhất, nếu dài hiển thị ... */}
                    <p className="text-xs text-muted-foreground/80 truncate leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        /* 3. CHẾ ĐỘ 2: VIỆC CẦN XỬ LÝ (TO-DO CHECKLIST VẬN HÀNH) */
        <div className="space-y-1.5 flex-1 min-h-0 flex flex-col justify-between">
          {/* Thanh tiến độ */}
          <div className="space-y-0.5 px-0.5 shrink-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-normal">
              <span>Tiến độ hoàn thành ca trực</span>
              <span className="font-normal text-muted-foreground tabular-nums">
                {completedTodosCount}/{totalTodosCount} ({todoProgressPercent}%)
              </span>
            </div>
            <div className="w-full h-1 bg-muted/80 rounded-full overflow-hidden">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  completedTodosCount === totalTodosCount && totalTodosCount > 0
                    ? 'bg-emerald-500'
                    : 'bg-primary'
                }`}
                style={{ width: `${todoProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Danh sách nhiệm vụ todo */}
          <div className="space-y-1.5 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
            {todos.map((todo) => {
              const isDone = completedTodoIds.has(todo.id)

              return (
                <div
                  key={todo.id}
                  className={`group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border transition-all text-xs ${
                    isDone
                      ? 'border-border/50 bg-muted/20 opacity-60'
                      : todo.urgency === 'high'
                      ? 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50'
                      : 'border-border/70 bg-card/70 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Checkbox
                      checked={isDone}
                      onCheckedChange={() => toggleTodo(todo.id)}
                      className="rounded"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-medium text-sm truncate ${
                            isDone
                              ? 'line-through text-muted-foreground'
                              : 'text-foreground/90'
                          }`}
                        >
                          {todo.title}
                        </span>
                        {todo.count > 0 && (
                          <Badge
                            variant={todo.urgency === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs h-4.5 px-1.5 font-normal rounded-full shrink-0"
                          >
                            {todo.count}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground block truncate">
                        {todo.description}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate(todo.actionUrl)}
                    className="h-6.5 text-xs font-normal text-muted-foreground hover:text-foreground gap-0.5 shrink-0 px-2 rounded-md hover:bg-muted/60"
                  >
                    <span>{todo.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Ghi chú lưu ý dưới đáy */}
          <div className="p-1.5 rounded-lg bg-muted/30 border border-border/40 flex items-start gap-1.5 text-xs text-muted-foreground shrink-0">
            <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-normal text-muted-foreground">Lưu ý ca trực: </span>
              <span className="truncate">
                Kiểm tra điều hòa phòng 204 trước ca 17:30. Học viên mới nhận thẻ tại quầy lễ tân.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal đăng thông báo mới cho Admin / Quản lý */}
      <HomeCreatePostDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        userName={userName}
        onCreatePost={handleCreatePost}
      />

      {/* 4. Modal xem toàn văn thông báo chi tiết khi bị rút gọn 2 dòng */}
      <HomeBulletinDetailDialog
        post={selectedPostForDetail}
        open={Boolean(selectedPostForDetail)}
        onOpenChange={(open) => !open && setSelectedPostForDetail(null)}
        onToggleAcknowledge={toggleAcknowledge}
        onNavigate={onNavigate}
      />
    </div>
  )
}
