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

interface ClassesSessionCommentWarningDialogProps {
  isOpen: boolean
  onClose: (action: 'comment' | 'later' | 'cancel') => void
}

export function ClassesSessionCommentWarningDialog({
  isOpen,
  onClose,
}: ClassesSessionCommentWarningDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose('cancel')
      }
    }}>
      <DialogContent 
        showCloseButton={false}
        className="max-w-[95vw] sm:max-w-[700px] p-6 rounded-2xl border bg-white dark:bg-zinc-950 shadow-xl overflow-hidden gap-4"
      >
        <DialogHeader className="space-y-3.5">
          <DialogTitle className="text-zinc-800 dark:text-zinc-100 text-sm sm:text-base font-bold leading-snug text-left">
            Thầy cô quên chưa nhận xét / Teachers, please don&apos;t forget to provide comment
          </DialogTitle>
          <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed text-left flex flex-col gap-1.5 font-medium">
            <span>
              Theo quy định của VUIHOC, giáo viên cần nhận xét trước thời gian quy định để được tính công!
            </span>
            <span>
              According to VUIHOC regulations, teachers need to give comment before the specified deadline to be eligible for salary!
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 w-full">
          <Button
            type="button"
            onClick={() => onClose('comment')}
            className="flex-1 h-auto py-2.5 px-5 rounded-full bg-[#ff5700] hover:bg-[#e04c00] active:bg-[#c94400] text-white font-bold text-xs sm:text-sm border-none shadow-xs transition-colors cursor-pointer whitespace-normal text-center leading-tight flex items-center justify-center"
          >
            Nhận xét ngay / Comment now
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onClose('later')}
            className="flex-1 h-auto py-2.5 px-5 rounded-full bg-[#e4e4e7] hover:bg-[#d4d4d8] text-[#27272a] font-bold text-xs sm:text-sm border-none transition-colors cursor-pointer dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 whitespace-normal text-center leading-tight flex items-center justify-center"
          >
            Tôi sẽ nhận xét sau / I will comment later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
