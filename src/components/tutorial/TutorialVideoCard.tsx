'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Eye, Clock, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TutorialVideo } from './tutorialTypes'
import { Badge } from '@/components/ui/badge'

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

interface TutorialVideoCardProps {
  video: TutorialVideo
  isMatched?: boolean
  onSelect: (video: TutorialVideo) => void
}

export function TutorialVideoCard({
  video,
  isMatched = false,
  onSelect,
}: TutorialVideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(video)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(video)
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group text-left relative flex flex-col rounded-xl border bg-card text-card-foreground shadow-xs transition-all duration-200 cursor-pointer overflow-hidden',
        'hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5',
        isMatched && 'border-primary/20 bg-primary/[0.02]'
      )}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <Image
          src={video.thumbnailUrl}
          alt={video.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 400px"
          className={cn(
            'object-cover transition-transform duration-300',
            isHovered ? 'scale-105' : 'scale-100'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200',
              isHovered
                ? 'scale-110 bg-blue-500 shadow-blue-500/40 ring-4 ring-white/30'
                : 'scale-95 bg-black/60 backdrop-blur-xs text-white/90'
            )}
          >
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Badges on Top */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none">
          {video.badgeText ? (
            <Badge className="bg-amber-500/95 hover:bg-amber-500 text-white border-0 text-[10px] font-semibold px-2 py-0.5 shadow-sm flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>{video.badgeText}</span>
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-xs border-0 text-[10px] font-medium px-2 py-0.5">
              {video.category}
            </Badge>
          )}

          {isMatched && (
            <Badge className="bg-emerald-600/90 text-white border-0 text-[10px] font-medium px-1.5 py-0.5 shadow-xs">
              Khớp màn hình này
            </Badge>
          )}
        </div>

        {/* Badges on Bottom */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[11px] font-medium pointer-events-none">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-xs rounded-md px-1.5 py-0.5">
            <Eye className="h-3 w-3 text-red-400" />
            <span>{video.viewsText}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-xs rounded-md px-1.5 py-0.5">
            <Clock className="h-3 w-3 text-amber-300" />
            <span>{video.duration}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-3.5 gap-2">
        <h4 className="font-semibold text-sm leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h4>

        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {video.description}
        </p>

        {/* Footer info */}
        <div className="mt-auto pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5 truncate">
            <YouTubeIcon className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <span className="truncate">{video.author}</span>
          </div>
          <span className="shrink-0">{video.publishedDate}</span>
        </div>
      </div>
    </div>
  )
}
