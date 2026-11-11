'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Sparkles,
  LayoutGrid,
  Filter,
  Layers,
  BookOpen,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TutorialVideoCard } from './TutorialVideoCard'
import type { TutorialVideo } from './tutorialTypes'
import { screens } from '@/config/screens'

interface TutorialVideoListModalProps {
  isOpen: boolean
  onClose: () => void
  currentScreenId: string | null
  customTitle?: string | null
  matchedVideos: TutorialVideo[]
  otherVideos: TutorialVideo[]
  allVideos: TutorialVideo[]
  onSelectVideo: (video: TutorialVideo) => void
}

export function TutorialVideoListModal({
  isOpen,
  onClose,
  currentScreenId,
  customTitle,
  matchedVideos,
  otherVideos,
  allVideos,
  onSelectVideo,
}: TutorialVideoListModalProps) {
  const [activeTab, setActiveTab] = useState<'matched' | 'all'>('matched')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const cleanScreenId = currentScreenId ? currentScreenId.split('/')[0].toLowerCase() : 'dashboard'
  const screenLabel =
    customTitle ||
    screens[cleanScreenId]?.label ||
    (currentScreenId ? currentScreenId : 'Bàn làm việc (Home)')

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>()
    allVideos.forEach((v) => set.add(v.category))
    return Array.from(set)
  }, [allVideos])

  // Filtered list based on tab, search and category
  const displayedVideos = useMemo(() => {
    const baseList = activeTab === 'matched' ? matchedVideos : allVideos
    return baseList.filter((v) => {
      const matchSearch =
        !searchQuery.trim() ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchCategory =
        selectedCategory === 'all' || v.category === selectedCategory

      return matchSearch && matchCategory
    })
  }, [activeTab, matchedVideos, allVideos, searchQuery, selectedCategory])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden rounded-2xl bg-background border border-border shadow-2xl flex flex-col"
        showCloseButton={true}
      >
        {/* Header */}
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-border bg-muted/30 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                  <BookOpen className="h-4 w-4" />
                </div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Video Hướng dẫn Sử dụng Rinov5
                </DialogTitle>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>Màn hình đang mở:</span>
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 font-semibold px-2 py-0.5"
                >
                  {screenLabel}
                </Badge>
                <span>• Khớp {matchedVideos.length} video chuyên đề</span>
              </div>
            </div>

            {/* Quick Tab Switcher */}
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as 'matched' | 'all')}
              className="w-auto"
            >
              <TabsList className="h-8 p-1 bg-muted">
                <TabsTrigger
                  value="matched"
                  className="h-6 px-3 text-xs data-[state=checked]:bg-background data-[state=checked]:shadow-xs"
                >
                  <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
                  Màn hình này ({matchedVideos.length})
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className="h-6 px-3 text-xs data-[state=checked]:bg-background data-[state=checked]:shadow-xs"
                >
                  <Layers className="h-3 w-3 mr-1" />
                  Tất cả ({allVideos.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm video hướng dẫn theo thao tác, phân hệ..."
                className="pl-8 h-8 text-xs bg-background shadow-none border-border"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`h-7 px-2.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Tất cả phân hệ
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`h-7 px-2.5 rounded-full text-xs font-medium shrink-0 transition-colors ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Video Grid Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-background">
          {displayedVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedVideos.map((video) => (
                <TutorialVideoCard
                  key={video.id}
                  video={video}
                  isMatched={video.screenIds.includes(cleanScreenId)}
                  onSelect={onSelectVideo}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Filter className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-foreground">
                  Không tìm thấy video hướng dẫn phù hợp
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Thử từ khóa khác hoặc chuyển sang tab &quot;Tất cả&quot; để duyệt toàn bộ kho tài liệu video của Rinov5.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setActiveTab('all')
                }}
                className="text-xs h-8"
              >
                Đặt lại bộ lọc & Xem tất cả
              </Button>
            </div>
          )}

          {/* Section: Video gợi ý thêm nếu đang ở tab matched */}
          {activeTab === 'matched' && otherVideos.length > 0 && !searchQuery && (
            <div className="mt-8 pt-5 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>Các video hướng dẫn chung nổi bật</span>
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('all')}
                  className="h-7 text-xs text-primary hover:text-primary/90"
                >
                  Xem toàn bộ ({allVideos.length}) →
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {otherVideos.slice(0, 2).map((video) => (
                  <TutorialVideoCard
                    key={video.id}
                    video={video}
                    isMatched={false}
                    onSelect={onSelectVideo}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
