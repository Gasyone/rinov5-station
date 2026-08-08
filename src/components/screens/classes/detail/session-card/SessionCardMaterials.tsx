'use client'

import { Eye, FileText, Image as ImageIcon, Video, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RoadmapSession } from '../classesDetailTypes'
import { getMaterialMeta } from './sessionCardTypes'

export interface SessionCardMaterialsProps {
  session: RoadmapSession
  onDeleteMaterial?: (sessionId: string, materialName: string, isSlide: boolean) => void
  onPreviewMedia?: (media: { name: string; url: string; type?: string; thumbnailUrl?: string }) => void
}

export function SessionCardMaterials({
  session,
  onDeleteMaterial,
  onPreviewMedia,
}: SessionCardMaterialsProps) {
  const materials = session.materials || []

  if (materials.length === 0) return null

  return (
    <div
      className="mt-2 pt-2 border-t border-border/40 space-y-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
          <span>Tài liệu & Media đã đăng ({materials.length})</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {materials.map((mat, idx) => {
          const meta = getMaterialMeta(mat.name)
          return (
            <div
              key={idx}
              className="group relative flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-card overflow-hidden transition-all hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-2xs"
            >
              {/* Thumbnail Container */}
              <div
                className="relative aspect-video w-full bg-muted/40 overflow-hidden cursor-pointer flex items-center justify-center"
                onClick={() => onPreviewMedia?.({ name: mat.name, url: mat.url, thumbnailUrl: meta.thumbnailUrl })}
              >
                {meta.isImage || meta.isVideo ? (
                  <>
                    <img
                      src={meta.thumbnailUrl}
                      alt={mat.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="h-4 w-4 text-white drop-shadow-md" />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
                    <FileText className="h-6 w-6 text-sky-600 dark:text-sky-400 mb-1" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">PDF / DOC</span>
                  </div>
                )}

                {/* Badge Type Overlay */}
                <Badge
                  variant="secondary"
                  className={cn(
                    'absolute top-1 right-1 text-[9px] px-1 py-0 font-semibold backdrop-blur-xs shadow-2xs',
                    meta.isVideo ? 'bg-purple-600/90 text-white' :
                    meta.isSlide ? 'bg-emerald-600/90 text-white' : 'bg-zinc-800/80 text-white'
                  )}
                >
                  {meta.isVideo ? 'VIDEO' : meta.isSlide ? 'SLIDE' : 'ẢNH'}
                </Badge>
              </div>

              {/* Info footer */}
              <div className="p-1.5 flex items-center justify-between gap-1 min-w-0 bg-background">
                <span className="text-[11px] font-medium text-foreground truncate min-w-0" title={mat.name}>
                  {mat.name}
                </span>

                {onDeleteMaterial && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteMaterial(session.id, mat.name, meta.isSlide)
                    }}
                    className="p-1 rounded text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 cursor-pointer"
                    title="Xóa tệp này"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
