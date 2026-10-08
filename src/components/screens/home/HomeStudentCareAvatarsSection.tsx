'use client'

import React from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppAvatar, StudentProfileHoverCard } from '@/components/shared'
import type { CareAvatarItem } from './homeTypes'

interface HomeStudentCareAvatarsSectionProps {
  careItems: CareAvatarItem[]
  onOpenStudentDetail: (studentId: string) => void
  onNavigateCare: () => void
  maxVisible?: number
}

export function HomeStudentCareAvatarsSection({
  careItems,
  onOpenStudentDetail,
  onNavigateCare,
  maxVisible = 7,
}: HomeStudentCareAvatarsSectionProps) {
  const urgentCount = careItems.filter((i) => i.alertBadgeColor === 'red').length
  const visibleItems = careItems.slice(0, maxVisible)
  const remainingCount = careItems.length - visibleItems.length

  return (
    <div className="bg-card border border-border/70 rounded-xl p-2.5 sm:p-3 shadow-xs space-y-2 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-3 h-3" />
          </div>
          <h3 className="text-sm font-medium text-foreground tracking-tight truncate">
            Học viên cần chăm sóc
          </h3>
          <Badge variant="secondary" className="text-xs h-4 px-1.5 font-normal text-muted-foreground bg-muted/80 rounded-full shrink-0">
            {careItems.length}
          </Badge>
          {urgentCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-normal text-rose-600 dark:text-rose-400 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              {urgentCount} gấp
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onNavigateCare}
          className="h-6 text-xs font-normal text-muted-foreground hover:text-foreground gap-0.5 px-1.5 rounded-md hover:bg-muted/60 shrink-0"
        >
          <span>Tất cả</span>
          <ArrowUpRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Compact Avatar Row (Không hiển thị đầy đủ) */}
      {careItems.length === 0 ? (
        <div className="py-1 px-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-normal">
          <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Không có cảnh báo tồn đọng hôm nay</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {visibleItems.map((item) => {
            const ringColor =
              item.alertBadgeColor === 'red'
                ? 'ring-2 ring-rose-500/70 hover:ring-rose-500'
                : item.alertBadgeColor === 'amber'
                ? 'ring-2 ring-amber-500/70 hover:ring-amber-500'
                : 'ring-2 ring-blue-500/60 hover:ring-blue-500'

            const dotBg =
              item.alertBadgeColor === 'red'
                ? 'bg-rose-500'
                : item.alertBadgeColor === 'amber'
                ? 'bg-amber-500'
                : 'bg-blue-500'

            return (
              <StudentProfileHoverCard
                key={item.id}
                student={item.profileItem}
                onOpenDetail={onOpenStudentDetail}
                align="center"
                side="bottom"
              >
                <div
                  className="relative group cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
                  onClick={() => onOpenStudentDetail(item.studentId)}
                  title={`${item.studentName} — ${item.alertLabel}: ${item.reason}`}
                >
                  <AppAvatar
                    name={item.studentName}
                    src={item.avatar}
                    size="sm"
                    className={`ring-offset-2 ring-offset-background shadow-xs transition-all ${ringColor}`}
                  />
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 block h-2 w-2 rounded-full ring-1.5 ring-background ${dotBg}`}
                  />
                </div>
              </StudentProfileHoverCard>
            )
          })}

          {remainingCount > 0 && (
            <button
              type="button"
              onClick={onNavigateCare}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground text-xs font-normal ring-1 ring-border shrink-0 transition-transform hover:scale-105"
              title={`Xem thêm ${remainingCount} học viên`}
            >
              +{remainingCount}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
