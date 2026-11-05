'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Video,
  Play,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useUIStore } from '@/stores/useUIStore'
import { screens } from '@/config/screens'
import { getTutorialVideosForScreen } from '@/mocks/tutorialVideos'
import type { TutorialVideo } from './tutorialTypes'
import { TutorialVideoPlayerModal } from './TutorialVideoPlayerModal'
import { cn } from '@/lib/utils'

export function TutorialVideoButton() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<TutorialVideo | null>(null)

  const pathname = usePathname()
  const storeMenuId = useUIStore((s) => s.currentMenuId)
  const customHeaderTitle = useUIStore((s) => s.customHeaderTitle)

  // Determine active menuId
  const activeMenuId = useMemo(() => {
    if (storeMenuId) return storeMenuId
    if (pathname) {
      const match = pathname.split('/app/')[1]
      if (match) return match.split('/')[0]
      if (pathname === '/booking-test') return 'booking_test'
      if (pathname === '/booking-trial') return 'trial_class'
    }
    return 'dashboard'
  }, [storeMenuId, pathname])

  const cleanScreenId = activeMenuId ? activeMenuId.split('/')[0].toLowerCase() : 'dashboard'
  const screenLabel =
    customHeaderTitle ||
    screens[cleanScreenId]?.label ||
    (activeMenuId ? activeMenuId : 'Bàn làm việc (Home)')

  // Matched videos for this screen
  const { matchedVideos, otherVideos } = useMemo(() => {
    return getTutorialVideosForScreen(activeMenuId)
  }, [activeMenuId])

  // Click on a video: close popover, open player modal directly
  const handleSelectVideo = (video: TutorialVideo) => {
    setIsPopoverOpen(false)
    setSelectedVideo(video)
  }

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Video hướng dẫn sử dụng"
            className={cn(
              'relative inline-flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold transition-all',
              'border-red-500/20 bg-red-500/5 text-red-600 hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-700',
              'dark:text-red-400 dark:border-red-500/30 dark:bg-red-500/10 dark:hover:bg-red-500/20',
              isPopoverOpen && 'bg-red-500/15 border-red-500/50'
            )}
            title="Video hướng dẫn theo màn hình"
          >
            <div className="relative flex items-center justify-center">
              <Video className="h-3.5 w-3.5 fill-red-500/20" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] font-medium tracking-tight">
              HDSD
            </span>
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white shadow-xs">
              {matchedVideos.length}
            </span>
          </Button>
        </PopoverTrigger>

        {/* Simple Popover List (like Notifications) */}
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-[340px] sm:w-[380px] p-0 shadow-2xl border border-border bg-popover text-popover-foreground rounded-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/70 px-3.5 py-2.5 bg-muted/20">
            <span className="text-sm font-normal text-foreground truncate">
              Video hướng dẫn
            </span>

            <Badge
              variant="outline"
              className="text-[10px] font-medium px-2 py-0.5 border-primary/20 bg-primary/5 text-primary truncate max-w-[170px]"
            >
              {screenLabel}
            </Badge>
          </div>

          {/* Simple Video List: Title & Danh mục */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50">
            {matchedVideos.map((video) => (
              <div
                key={video.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectVideo(video)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelectVideo(video)
                  }
                }}
                className="group flex items-center gap-3 p-3 transition-colors hover:bg-accent/60 cursor-pointer text-left"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-24 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    unoptimized
                    sizes="96px"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-xs group-hover:scale-110 transition-transform">
                      <Play className="h-3 w-3 fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 backdrop-blur-xs rounded text-[9px] font-mono text-white">
                    {video.duration}
                  </div>
                </div>

                {/* Info: Chỉ Title & Danh mục */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {video.category}
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors" />
              </div>
            ))}

            {/* Other universal videos if matched is small */}
            {matchedVideos.length < 3 && otherVideos.length > 0 && (
              <>
                <div className="px-3.5 py-1.5 bg-muted/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  <span>Hướng dẫn chung khác</span>
                </div>
                {otherVideos.slice(0, 2).map((video) => (
                  <div
                    key={video.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectVideo(video)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectVideo(video)
                      }
                    }}
                    className="group flex items-center gap-3 p-3 transition-colors hover:bg-accent/60 cursor-pointer text-left"
                  >
                    <div className="relative aspect-video w-24 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/60">
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        unoptimized
                        sizes="96px"
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-xs group-hover:scale-110 transition-transform">
                          <Play className="h-3 w-3 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 px-1 py-0.2 bg-black/70 backdrop-blur-xs rounded text-[9px] font-mono text-white">
                        {video.duration}
                      </div>
                    </div>

                    {/* Info: Chỉ Title & Danh mục */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 truncate">
                        {video.category}
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors" />
                  </div>
                ))}
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {/* Direct Video Player Modal */}
      <TutorialVideoPlayerModal
        isOpen={Boolean(selectedVideo)}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  )
}
