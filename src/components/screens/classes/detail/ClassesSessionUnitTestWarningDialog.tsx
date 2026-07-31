'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface ClassesSessionUnitTestWarningDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ClassesSessionUnitTestWarningDialog({
  isOpen,
  onClose,
}: ClassesSessionUnitTestWarningDialogProps) {
  const [confirmed, setConfirmed] = useState(false)

  const handleConfirm = () => {
    if (confirmed) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-[95vw] sm:max-w-[680px] p-6 rounded-2xl border bg-white dark:bg-zinc-950 shadow-2xl overflow-y-auto max-h-[90vh] gap-5"
      >
        <DialogHeader className="space-y-1 text-center">
          <DialogTitle className="text-zinc-850 dark:text-zinc-100 text-lg sm:text-xl font-extrabold tracking-tight">
            Trong buổi kiểm tra, thầy cô lưu ý:
          </DialogTitle>
          <p className="text-zinc-500 dark:text-zinc-400 italic text-sm sm:text-base font-semibold">
            Important notes for the Unit Test:
          </p>
        </DialogHeader>

        {/* Content List */}
        <div className="space-y-4 text-left my-2">
          {/* Item 1 */}
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-zinc-400 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 select-none">
              1
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-xs sm:text-[13px] leading-snug">
                Chiếu video hướng dẫn (trên Class-in) và yêu cầu học sinh quay lại Class-in sau khi hoàn thành bài Test online.
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 italic text-[11px] sm:text-xs leading-normal mt-0.5">
                Show the instructional video (included on Class-in) and ask students to get back to Class-in after finishing the Online Test
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-zinc-400 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 select-none">
              2
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-xs sm:text-[13px] leading-snug">
                Luôn kiểm tra trạng thái làm test của học sinh trên ERP như sau:
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 italic text-[11px] sm:text-xs leading-normal mt-0.5">
                Always check the student&apos;s test status on ERP as follows:
              </p>
              
              {/* Badges Explanation */}
              <div className="space-y-2 mt-2 pl-1">
                <div className="flex items-start text-xs sm:text-[13px] leading-tight">
                  <span className="bg-[#ef4444] text-white px-2 py-0.5 text-[9px] font-extrabold rounded-sm mr-2 shrink-0 select-none uppercase tracking-wide">
                    Not Start
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Học sinh chưa bắt đầu làm bài kiểm tra (Students have not started the Test yet)
                  </span>
                </div>
                <div className="flex items-start text-xs sm:text-[13px] leading-tight">
                  <span className="bg-[#f97316] text-white px-2 py-0.5 text-[9px] font-extrabold rounded-sm mr-2 shrink-0 select-none uppercase tracking-wide">
                    Doing
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Học sinh đang làm bài kiểm tra (Students are doing the test)
                  </span>
                </div>
                <div className="flex items-start text-xs sm:text-[13px] leading-tight">
                  <span className="bg-[#22c55e] text-white px-2 py-0.5 text-[9px] font-extrabold rounded-sm mr-2 shrink-0 select-none uppercase tracking-wide">
                    Done
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Học sinh đã làm xong bài kiểm tra và nộp bài (Students have finished the Test and submitted)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-zinc-400 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 select-none">
              3
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-zinc-800 dark:text-zinc-200 text-xs sm:text-[13px] leading-snug">
                Luôn nhận xét kết quả test trước 9h sáng hôm sau, nhận xét sau thời gian quy định không được ghi nhận công.
              </p>
              <p className="text-zinc-500 dark:text-zinc-400 italic text-[11px] sm:text-xs leading-normal mt-0.5">
                Always comment on test results before 9:00 a.m. the next morning. Comments after the specified time will not be credited.
              </p>
            </div>
          </div>
        </div>

        {/* Pink Alert Box */}
        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl text-center">
          <p className="text-red-650 dark:text-red-400 text-xs sm:text-[13px] font-bold leading-normal">
            Please ask operators for immediate support if students cannot take the Online test.
          </p>
        </div>

        {/* Checkbox Confirmation & Action */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="regulations-confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              className="border-zinc-300 rounded-sm"
            />
            <Label
              htmlFor="regulations-confirm"
              className="text-zinc-650 dark:text-zinc-300 font-bold text-xs sm:text-sm cursor-pointer select-none leading-none"
            >
              I&apos;ve read carefully and will comply with Vuihoc&apos;s regulations
            </Label>
          </div>

          <Button
            type="button"
            disabled={!confirmed}
            onClick={handleConfirm}
            className="w-full max-w-[280px] h-10 rounded-full font-bold text-sm uppercase transition-all bg-[#e4e4e7] dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer data-[state=checked]:bg-zinc-800 data-[state=checked]:text-white dark:data-[state=checked]:bg-zinc-200 dark:data-[state=checked]:text-zinc-900"
            style={
              confirmed
                ? {
                    backgroundColor: '#18181b',
                    color: '#ffffff',
                  }
                : undefined
            }
          >
            TIẾP TỤC
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
