'use client'

import { ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { TutorialVideo } from './tutorialTypes'

interface TutorialVideoPlayerModalProps {
  video: TutorialVideo | null
  isOpen: boolean
  onClose: () => void
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export function TutorialVideoPlayerModal({
  video,
  isOpen,
  onClose,
}: TutorialVideoPlayerModalProps) {
  if (!video) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="w-[95vw] sm:max-w-[95vw] md:max-w-[92vw] lg:max-w-[1360px] xl:max-w-[1480px] p-0 overflow-hidden rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl flex flex-col"
        showCloseButton={true}
      >
        {/* Header: Clean & Minimal */}
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-2.5 sm:py-3 border-b border-zinc-800/80 bg-zinc-900/70 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <YouTubeIcon className="h-5 w-5 text-red-500 shrink-0" />
            <DialogTitle className="text-sm sm:text-base font-semibold text-zinc-100 truncate">
              {video.title}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2 pr-7">
            {/* Open on YouTube */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-7 px-2.5 text-xs gap-1.5 border-zinc-700 bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700 hover:text-white"
            >
              <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 text-blue-400" />
                <span className="hidden sm:inline">Mở trên YouTube</span>
              </a>
            </Button>
          </div>
        </DialogHeader>

        {/* Video Player Frame 16:9 full size */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
