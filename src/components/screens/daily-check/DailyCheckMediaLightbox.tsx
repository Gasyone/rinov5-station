'use client'
/* eslint-disable @next/next/no-img-element */

import React from 'react'
import { X } from 'lucide-react'
import type { FlatMediaItem } from './DailyCheckFlatMediaManager'

export interface DailyCheckMediaLightboxProps {
  media: FlatMediaItem | null
  onClose: () => void
}

export function DailyCheckMediaLightbox({ media, onClose }: DailyCheckMediaLightboxProps) {
  if (!media) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in-0 duration-150"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition-colors"
          title="Đóng"
        >
          <X className="h-4 w-4" />
        </button>

        {media.mediaType === 'video' ? (
          <video
            src={media.url}
            controls
            autoPlay
            className="w-full max-h-[75vh] object-contain"
          />
        ) : (
          <img
            src={media.url}
            alt={media.name}
            className="w-full max-h-[75vh] object-contain"
          />
        )}

        <div className="absolute bottom-2 left-3 right-3 text-center pointer-events-none">
          <span className="inline-block bg-black/60 text-white/90 text-xs px-2.5 py-1 rounded backdrop-blur-xs font-normal truncate max-w-[80%]">
            {media.name}
          </span>
        </div>
      </div>
    </div>
  )
}
