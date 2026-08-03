'use client'

import { useState } from 'react'
import { Calendar, Clock, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react'
import { AudioPlayButton } from './AudioPlayButton'
import { CareTagHoverCard } from '@/components/shared'
import { formatFullStaffName } from './operationsAlertHelpers'
import type { StudentCareAlert } from '@/mocks/careAlerts'

import { PersonnelHoverCard } from '@/components/shared'

function getCSStaffPerson(name: string) {
  return {
    id: 'EMP-NTA',
    name: name || 'Nguyễn Thị Ngọc Anh',
    role: 'Chuyên viên CSKH',
    phone: '0901612940',
    email: 'ngocanh@rinoedu.com',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=NgocAnh'
  }
}

interface StudentActiveCareCardProps {
  student?: StudentCareAlert
  chatRecipient: string
  isCaredStatus: boolean
}

export function StudentActiveCareCard({
  student,
  chatRecipient,
  isCaredStatus,
}: StudentActiveCareCardProps) {
  const [showMissedCalls, setShowMissedCalls] = useState(false)

  if (isCaredStatus) return null

  const csStaffName = formatFullStaffName(student?.csStaff || 'Nguyễn Thị Ngọc Anh')

  return (
    <div className="space-y-1 text-left select-none pt-1">
      {/* Active Care Card Item */}
      <div className="space-y-1">
        {/* Header row */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5 pb-1 select-none">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 shrink-0">
              Đang xử lý
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9.5px] font-extrabold bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950 dark:text-sky-300 flex items-center gap-1">
              <span>CS</span>
            </span>
            <PersonnelHoverCard person={getCSStaffPerson(csStaffName)}>
              <span className="font-bold text-foreground text-xs cursor-pointer hover:underline hover:text-primary transition-colors">
                {csStaffName}
              </span>
            </PersonnelHoverCard>
            <span className="text-muted-foreground text-xs font-medium">• Cuộc gọi: {chatRecipient}</span>
            <span className="font-mono text-[10.5px] font-semibold text-muted-foreground bg-zinc-100 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded-md shrink-0">
              2026-07-20 14:00
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
              Hẹn gọi lại: 20/07 14:00
            </span>
          </div>
        </div>

        {/* Active Care Card Body */}
        <div className="rounded-lg border border-amber-200/80 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20 p-1.5 shadow-2xs space-y-1 text-xs text-left">

          {/* Continuous Stream: Audio + Note + Parent Feedback Label & Text */}
          <div className="text-xs text-foreground/90 font-normal leading-relaxed">
            <span className="inline-flex items-center align-middle mr-2">
              <AudioPlayButton duration="02:45" />
            </span>
            <span className="align-middle">Trao đổi về tình hình nghỉ học 2 buổi liên tiếp và điểm thi giảm sút</span>
            <span className="align-middle">
              {' '}
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                • Phụ huynh phản hồi:
              </span>{' '}
              <span className="italic font-medium text-emerald-700 dark:text-emerald-400">
                “Bố bận việc gia đình, xin bảo lưu kết quả 1 tháng để con về quê giải quyết việc”
              </span>
            </span>
          </div>

          {/* Missed Call History Accordion (Borderless link) */}
          <div className="pt-0.5 select-none">
            <button
              type="button"
              onClick={() => setShowMissedCalls(!showMissedCalls)}
              className="w-full text-left text-[11px] font-normal italic text-rose-500 hover:text-rose-600 dark:text-rose-400 flex items-center justify-between cursor-pointer py-0.5 bg-transparent border-0 p-0 transition-colors"
            >
              <span className="flex items-center gap-1.5 underline decoration-rose-300">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 no-underline" />
                <span>Lịch sử (3) lần gọi nhỡ / không liên hệ được trước đó</span>
                <span className="font-mono text-[9.5px] text-muted-foreground font-normal ml-1">18/07 - 19/07</span>
              </span>
              {showMissedCalls ? <ChevronUp className="h-3.5 w-3.5 text-rose-400 shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-rose-400 shrink-0" />}
            </button>

            {showMissedCalls && (
              <div className="mt-1.5 pl-2.5 border-l-2 border-rose-200 dark:border-rose-800 space-y-1 text-[10.5px] text-muted-foreground font-medium animate-in fade-in-50 duration-150">
                <div className="p-1 rounded-md hover:bg-rose-50/50 transition-colors space-y-0.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-[11px]">• 18/07 09:30: Gọi KNM (Không nghe máy)</span>
                    <span className="text-[9px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-200/60 dark:border-sky-800 shrink-0">
                      📅 Hẹn gọi lại: 18/07 14:15
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/90 italic pl-2 leading-relaxed w-full">
                    * Ghi chú: Chuông reo 5 tiếng phụ huynh không nghe máy, hẹn gọi lại ca chiều
                  </p>
                </div>

                <div className="p-1 rounded-md hover:bg-rose-50/50 transition-colors space-y-0.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-[11px]">• 18/07 14:15: Máy bận / Số bận</span>
                    <span className="text-[9px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-200/60 dark:border-sky-800 shrink-0">
                      📅 Hẹn gọi lại: 19/07 10:00
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/90 italic pl-2 leading-relaxed w-full">
                    * Ghi chú: Số điện thoại bận cuộc gọi khác, hẹn gọi lại sáng hôm sau
                  </p>
                </div>

                <div className="p-1 rounded-md hover:bg-rose-50/50 transition-colors space-y-0.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-[11px]">• 19/07 10:00: Gọi KNM (Không nghe máy)</span>
                    <span className="text-[9px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-1.5 py-0.5 rounded border border-sky-200/60 dark:border-sky-800 shrink-0">
                      📅 Hẹn gọi lại: 20/07 14:00
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/90 italic pl-2 leading-relaxed w-full">
                    * Ghi chú: Máy bận/tắt máy, chuyển lịch chăm sóc cho ca tiếp theo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
