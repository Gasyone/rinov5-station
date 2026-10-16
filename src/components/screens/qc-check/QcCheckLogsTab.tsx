'use client'

import { Plus, ShieldCheck, AlertTriangle, Play, CheckCheck, History } from 'lucide-react'
import { EmptyState } from '@/components/shared'
import type { QcLog } from '@/mocks/qcChecks'
import { formatDateTime } from './qcCheckHelpers'

interface QcCheckLogsTabProps {
  logs?: QcLog[]
}

export function QcCheckLogsTab({ logs }: QcCheckLogsTabProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="px-6 py-5">
        <EmptyState
          title="Chưa có lịch sử"
          description="Chưa ghi nhận hoạt động nào cho cuộc kiểm tra."
          icon={<History className="h-5 w-5" />}
        />
      </div>
    )
  }

  return (
    <div className="px-6 py-5">
      <div className="relative border-l pl-4 border-slate-200 dark:border-slate-800 space-y-6 ml-2 pt-2">
        {logs.map((log) => {
          let icon = <History className="h-3 w-3" />
          let bgClass = 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'

          if (log.action.includes('Tạo')) {
            icon = <Plus className="h-3.5 w-3.5" />
            bgClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
          } else if (log.action.includes('Phát hành')) {
            icon = <ShieldCheck className="h-3.5 w-3.5" />
            bgClass = 'bg-primary/20 text-primary dark:bg-primary/10 dark:text-primary-foreground'
          } else if (log.action.includes('lỗi') || log.action.includes('Ghi nhận')) {
            icon = <AlertTriangle className="h-3.5 w-3.5" />
            bgClass = 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
          } else if (log.action.includes('khắc phục') || log.action.includes('Chỉnh sửa')) {
            icon = <Play className="h-3.5 w-3.5" />
            bgClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
          } else if (log.action.includes('Đạt') || log.action.includes('Đóng')) {
            icon = <CheckCheck className="h-3.5 w-3.5" />
            bgClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
          }

          return (
            <div key={log.id} className="relative">
              {/* Dot icon */}
              <div
                className={`absolute -left-7 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border bg-background ${bgClass}`}
              >
                {icon}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-semibold text-sm text-foreground">{log.action}</span>
                  <span className="text-xs text-muted-foreground">— thực hiện bởi</span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {log.userName}
                  </span>
                </div>
                {log.details && (
                  <p className="mt-1 text-xs text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50 p-2 rounded border border-dashed border-slate-200/50 max-w-2xl">
                    {log.details}
                  </p>
                )}
                <span className="text-xs text-muted-foreground block mt-1 font-mono">
                  {formatDateTime(log.createdAt)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
