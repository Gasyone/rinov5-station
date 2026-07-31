'use client'

import { MapPin, Building } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface LocationCellProps {
  /** Tên chi nhánh hoặc cơ sở chính */
  branch: string
  /** Tên phòng học hoặc vị trí cụ thể (ví dụ: Phòng 102, Sảnh tư vấn) */
  room?: string | null
  /** Hiển thị biểu tượng tòa nhà/bản đồ bên cạnh */
  showIcon?: boolean
  className?: string
}

/**
 * Component hiển thị thông tin Chi nhánh & Phòng học chuẩn hóa trong bảng.
 * Giúp hiển thị ngắn gọn thông tin địa điểm và tự động hiển thị tooltip nếu tên chi nhánh quá dài.
 *
 * @see docs/DESIGN_SYSTEM.md §4.2 List Page Pattern
 */
export function LocationCell({
  branch,
  room,
  showIcon = false,
  className,
}: LocationCellProps) {
  if (!branch) {
    return <span className="text-sm text-muted-foreground italic">-</span>
  }

  const content = (
    <div className={cn('flex flex-col gap-0.5 min-w-0 text-left', className)}>
      <div className="flex items-center gap-1.5 text-xs text-foreground">
        {showIcon && <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
        <span className="truncate" title={branch}>{branch}</span>
      </div>
      {room && (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {showIcon && <MapPin className="h-3 w-3 shrink-0" />}
          <span className="truncate" title={room}>
            {room.toLowerCase().startsWith('phòng') ? room : `Phòng ${room}`}
          </span>
        </div>
      )}
    </div>
  )

  // Nếu tên chi nhánh quá dài (ví dụ > 30 ký tự), bọc Tooltip để tránh mất chữ
  if (branch.length > 25) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help max-w-full">{content}</div>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            <p className="font-semibold">{branch}</p>
            {room && <p className="text-muted-foreground">{room}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}
