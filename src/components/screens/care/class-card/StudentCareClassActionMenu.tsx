'use client'

import React from 'react'
import {
  MoreVertical,
  ChevronDown,
  UserPlus,
  ExternalLink,
  Snowflake,
  ArrowRightLeft,
  RotateCcw,
  FileText,
  CalendarOff,
  FileEdit,
  CreditCard,
  CalendarClock,
  Sparkles,
  GraduationCap,
  RefreshCw,
  History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import type { StudentCareClassActionMenuProps } from './studentCareClassCardTypes'

export function StudentCareClassActionMenu({
  placementStatus,
  onOpenPlacementTab,
  onCreateLeaveReserve,
  onOpenEarlyReturnDialog,
  onOpenLeaveReserveDialog,
}: StudentCareClassActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs font-medium gap-1 text-muted-foreground hover:text-foreground rounded-md bg-background hover:bg-muted/60 border-border/70 cursor-pointer shadow-3xs"
          title="Danh sách thao tác học vụ"
        >
          <MoreVertical className="h-3.5 w-3.5" />
          <span>Thao tác</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-54">
        {/* 1. CHỜ XẾP LỚP */}
        {placementStatus === 'wait_for_assignment' && (
          <>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2 font-medium text-indigo-600 dark:text-indigo-400 focus:text-indigo-700"
            >
              <UserPlus className="h-4 w-4 text-indigo-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span>Ghép lớp</span>
                <span className="text-[10px] text-muted-foreground font-normal">Mở tab Xếp lớp học viên</span>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('reservation')}
              className="cursor-pointer gap-2"
            >
              <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Bảo lưu</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 2. CHỜ CHUYỂN LỚP */}
        {placementStatus === 'pending_transfer' && (
          <>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2 font-medium text-sky-600 dark:text-sky-400 focus:text-sky-700"
            >
              <ArrowRightLeft className="h-4 w-4 text-sky-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span>Ghép lớp đích</span>
                <span className="text-[10px] text-muted-foreground font-normal">Mở tab Xếp lớp học viên</span>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('reservation')}
              className="cursor-pointer gap-2"
            >
              <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Bảo lưu</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 3. LỚP NHÁP */}
        {placementStatus === 'draft_class' && (
          <>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2 font-medium text-zinc-700 dark:text-zinc-300"
            >
              <FileEdit className="h-4 w-4 text-zinc-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span>Xác nhận xếp lớp</span>
                <span className="text-[10px] text-muted-foreground font-normal">Chốt sổ lớp chính thức</span>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2"
            >
              <UserPlus className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>Điều chỉnh ghép lớp</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('reservation')}
              className="cursor-pointer gap-2"
            >
              <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Bảo lưu</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 4. CHỜ KHAI GIẢNG */}
        {placementStatus === 'awaiting_opening' && (
          <>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2 font-medium text-cyan-700 dark:text-cyan-300"
            >
              <Sparkles className="h-4 w-4 text-cyan-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span>Đổi lớp khác</span>
                <span className="text-[10px] text-muted-foreground font-normal">Chuyển trước khai giảng</span>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('off')}
              className="cursor-pointer gap-2"
            >
              <CalendarOff className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Nghỉ phép trước hạn</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('reservation')}
              className="cursor-pointer gap-2"
            >
              <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Bảo lưu</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 5. CHỜ THANH TOÁN */}
        {placementStatus === 'pending_payment' && (
          <>
            <DropdownMenuItem
              onClick={() => toast.info('Chuyển hướng đến phiếu thu / đơn hàng để xác nhận thanh toán')}
              className="cursor-pointer gap-2 font-medium text-amber-700 dark:text-amber-400"
            >
              <CreditCard className="h-4 w-4 text-amber-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span>Xác nhận phiếu thu</span>
                <span className="text-[10px] text-muted-foreground font-normal">Hoàn tất thanh toán</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('reservation')}
              className="cursor-pointer gap-2"
            >
              <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Bảo lưu</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 6. XẾP LỚP SAU */}
        {placementStatus === 'enroll_later' && (
          <>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2 font-medium text-violet-700 dark:text-violet-400"
            >
              <CalendarClock className="h-4 w-4 text-violet-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span>Xếp lớp ngay</span>
                <span className="text-[10px] text-muted-foreground font-normal">Kích hoạt xếp lớp sớm</span>
              </div>
              <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('reservation')}
              className="cursor-pointer gap-2"
            >
              <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Bảo lưu</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 7. CHUYỂN PHÍ */}
        {placementStatus === 'fee_transfer' && (
          <>
            <DropdownMenuItem
              onClick={() => toast.info('Xem chi tiết tiến trình chuyển đổi học phí')}
              className="cursor-pointer gap-2 font-medium text-sky-700 dark:text-sky-400"
            >
              <RefreshCw className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Chi tiết chuyển phí</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2"
            >
              <UserPlus className="h-4 w-4 text-indigo-500 shrink-0" />
              <span>Mở tab Xếp lớp</span>
              <ExternalLink className="h-3 w-3 ml-auto opacity-60 shrink-0" />
            </DropdownMenuItem>
          </>
        )}

        {/* 8. HỌC THỬ (TRIAL) */}
        {placementStatus === 'trial' && (
          <>
            <DropdownMenuItem
              onClick={() => toast.success('Mở đơn hàng chuyển sang học viên chính thức')}
              className="cursor-pointer gap-2 font-medium text-violet-700 dark:text-violet-400"
            >
              <GraduationCap className="h-4 w-4 text-violet-500 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span>Chuyển chính thức</span>
                <span className="text-[10px] text-muted-foreground font-normal">Đăng ký khóa học dài hạn</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('off')}
              className="cursor-pointer gap-2"
            >
              <CalendarOff className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Nghỉ phép</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 9. ĐANG BẢO LƯU */}
        {placementStatus === 'reserve' && (
          <>
            <DropdownMenuItem
              onClick={onOpenEarlyReturnDialog}
              className="cursor-pointer gap-2 font-medium text-emerald-600 dark:text-emerald-400 focus:text-emerald-700"
            >
              <RotateCcw className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Đi học lại</span>
            </DropdownMenuItem>
            {onOpenLeaveReserveDialog && (
              <DropdownMenuItem
                onClick={onOpenLeaveReserveDialog}
                className="cursor-pointer gap-2"
              >
                <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Xem đơn bảo lưu</span>
              </DropdownMenuItem>
            )}
          </>
        )}

        {/* 10. HẾT BUỔI */}
        {placementStatus === 'session_ended' && (
          <>
            <DropdownMenuItem
              onClick={() => toast.info('Mở luồng tạo đơn hàng tái phí')}
              className="cursor-pointer gap-2 font-medium text-emerald-700 dark:text-emerald-400"
            >
              <RefreshCw className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Tạo đơn tái phí</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onOpenPlacementTab}
              className="cursor-pointer gap-2"
            >
              <History className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Xem lịch sử lớp học</span>
            </DropdownMenuItem>
          </>
        )}

        {/* 11. ĐANG HỌC BÌNH THƯỜNG */}
        {placementStatus === 'active' && (
          <>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('off')}
              className="cursor-pointer gap-2"
            >
              <CalendarOff className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Nghỉ phép</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCreateLeaveReserve?.('reservation')}
              className="cursor-pointer gap-2"
            >
              <Snowflake className="h-4 w-4 text-sky-500 shrink-0" />
              <span>Bảo lưu</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
