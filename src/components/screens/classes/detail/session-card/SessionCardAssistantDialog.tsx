'use client'

import { toast } from 'sonner'
import { UserPlus, UserCheck, RotateCcw } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { RoadmapSession } from '../classesDetailTypes'
import { cleanAssistantName } from '../classesDetailHelpers'

export interface SessionCardAssistantDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  session: RoadmapSession
  onUpdateSession?: (id: string, updates: Partial<RoadmapSession>) => void
  onRequestRevertAssistant: () => void
  setAssistantNameState: (name: string) => void
}

export function SessionCardAssistantDialog({
  isOpen,
  onOpenChange,
  session,
  onUpdateSession,
  onRequestRevertAssistant,
  setAssistantNameState,
}: SessionCardAssistantDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs rounded-xl p-4 z-50" onClick={(e) => e.stopPropagation()}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
            <UserPlus className="h-4 w-4 text-purple-600" />
            <span>Đổi Trợ giảng cho Buổi {session.sessionNumber}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5 py-1">
          {session.substituteAssistantName && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onOpenChange(false)
                onRequestRevertAssistant()
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border border-rose-300 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 hover:bg-rose-100 flex items-center justify-between transition-colors mb-2 cursor-pointer"
            >
              <span>Xóa TA cover (Khôi phục {cleanAssistantName(session.defaultAssistantName || session.assistantName || 'Hoàng Anh')})</span>
              <RotateCcw className="h-3.5 w-3.5 text-rose-600" />
            </button>
          )}

          {['Hoàng Anh', 'Thu Hà', 'Minh Đức', 'Bảo Ngọc'].map((taName) => (
            <button
              key={taName}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                const defaultTA = session.defaultAssistantName || session.assistantName || 'Hoàng Anh'
                if (taName === defaultTA) {
                  if (session.substituteAssistantName) {
                    onOpenChange(false)
                    onRequestRevertAssistant()
                  }
                } else {
                  onUpdateSession?.(session.id, { substituteAssistantName: taName })
                  setAssistantNameState(taName)
                  onOpenChange(false)
                  toast.success(`Đã gán ${taName} làm trợ giảng cho Buổi ${session.sessionNumber}`)
                }
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg border border-border/60 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 text-foreground flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{taName}</span>
              <UserCheck className="h-3.5 w-3.5 text-purple-600 opacity-60" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
