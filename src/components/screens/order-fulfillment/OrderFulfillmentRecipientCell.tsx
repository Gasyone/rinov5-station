'use client'

import React from 'react'
import { MapPin, User, Users } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { OrderFulfillmentRecord } from '@/mocks/orderFulfillments'
import {
  getRecipientDisplayInfo,
  maskPhoneNumber,
} from './orderFulfillmentHelpers'

interface OrderFulfillmentRecipientCellProps {
  record: OrderFulfillmentRecord
  copiedId?: string | null
  onCopyPhone?: (e: React.MouseEvent, phone: string | undefined, id: string) => void
}

export function OrderFulfillmentRecipientCell({
  record,
}: OrderFulfillmentRecipientCellProps) {
  const info = getRecipientDisplayInfo(record)
  const phone = info.representativePhone

  const deliveryAddress =
    record.deliveryMethod === 'shipping' && record.shippingAddress
      ? record.shippingAddress
      : `Nhận tại: ${record.branch}`

  if (info.isMultiRecipient) {
    return (
      <div className="flex flex-col gap-0.5 min-w-0">
        {/* Dòng 1: Chỉ hiển thị N người nhận (Xóa viền, xóa nền, xóa chữ lớp) */}
        <div className="flex items-center min-w-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 font-semibold text-xs text-primary hover:underline cursor-pointer transition-colors select-none p-0 bg-transparent border-0"
                title="Bấm để xem danh sách chi tiết người nhận"
              >
                <Users className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{info.recipientCount} người nhận</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-72 p-3 text-xs shadow-lg z-50 space-y-2 bg-background border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                <div className="flex items-center gap-1.5 font-semibold text-xs text-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  <span>Danh sách người nhận ({info.recipientCount})</span>
                </div>
              </div>

              {info.recipientList.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {info.recipientList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1 px-1.5 rounded bg-muted/40 text-[11px]"
                    >
                      <span className="font-medium text-foreground truncate">
                        {idx + 1}. {item.name}
                      </span>
                      {item.phone && (
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {maskPhoneNumber(item.phone)}
                        </span>
                      )}
                    </div>
                  ))}
                  {info.recipientCount > info.recipientList.length && (
                    <p className="text-[10px] text-muted-foreground italic text-center pt-1">
                      ... và {info.recipientCount - info.recipientList.length} người nhận khác trong danh sách
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Bàn giao đồng loạt theo danh sách tại cơ sở {record.branch}.
                </p>
              )}

              <div className="pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground flex items-center justify-between">
                <span className="truncate max-w-[150px]">Đại diện: {info.representativeName}</span>
                {info.representativePhone && (
                  <span className="font-mono">{maskPhoneNumber(info.representativePhone)}</span>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Dòng 2: Địa chỉ nhận hàng (Xóa sđt và thông tin cũ) */}
        <div
          className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 min-w-0"
          title={deliveryAddress}
        >
          <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
          <span className="truncate">{deliveryAddress}</span>
        </div>
      </div>
    )
  }

  // Mode đơn lẻ (1 người nhận)
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      {/* Dòng 1: Tên người nhận (Hover hiện thông tin đầy đủ gồm SĐT, Học viên) */}
      <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex items-center gap-1.5 font-semibold text-foreground truncate cursor-help group/rec max-w-full">
              <User className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover/rec:text-primary transition-colors" />
              <span className="truncate group-hover/rec:text-primary transition-colors">
                {info.representativeName}
              </span>
              {info.representativeRole && (
                <span className="text-[10px] font-normal text-muted-foreground px-1 py-0 rounded bg-muted shrink-0">
                  {info.representativeRole}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            align="start"
            className="p-2.5 space-y-1 text-xs max-w-xs shadow-xl bg-popover text-popover-foreground border border-border"
          >
            <div className="font-semibold text-foreground border-b pb-1 flex items-center justify-between gap-2">
              <span>{info.representativeName}</span>
              {info.representativeRole && (
                <span className="text-[10px] font-normal text-muted-foreground">
                  ({info.representativeRole})
                </span>
              )}
            </div>
            {phone && (
              <div className="text-[11px] flex items-center justify-between gap-2 text-foreground font-mono pt-0.5">
                <span className="text-muted-foreground font-sans text-[11px]">SĐT liên hệ:</span>
                <span>{phone}</span>
              </div>
            )}
            {record.studentName && (
              <div className="text-[11px] flex items-center justify-between gap-2 text-muted-foreground pt-0.5">
                <span>Học viên:</span>
                <strong className="text-foreground font-medium">{record.studentName}</strong>
              </div>
            )}
            <div className="text-[10px] text-muted-foreground pt-1 border-t flex items-center justify-between">
              <span>Hình thức nhận:</span>
              <span>{record.deliveryMethod === 'shipping' ? 'Giao tận nơi' : 'Nhận tại cơ sở'}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Dòng 2: Địa chỉ nhận hàng (Xóa sđt và thông tin cũ) */}
      <div
        className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5 min-w-0"
        title={deliveryAddress}
      >
        <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
        <span className="truncate">{deliveryAddress}</span>
      </div>
    </div>
  )
}
