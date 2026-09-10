/* eslint-disable @next/next/no-img-element */
'use client'

import { Camera, FileText, Paperclip } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { OrderFulfillmentRecord } from '@/mocks/orderFulfillments'

interface OrderFulfillmentPodPopoverProps {
  record: OrderFulfillmentRecord
}

export function OrderFulfillmentPodPopover({ record }: OrderFulfillmentPodPopoverProps) {
  const totalPodCount = (record.podImages?.length || 0) + (record.attachments?.length || 0)

  if (totalPodCount === 0) {
    return (
      <span className="text-[10px] text-muted-foreground/60 italic">
        Chưa có POD
      </span>
    )
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/90 bg-primary/10 hover:bg-primary/15 px-1.5 py-0.5 rounded border border-primary/20 transition-colors cursor-pointer w-fit"
            title="Xem bằng chứng giao nhận (POD)"
          >
            <Camera className="h-2.5 w-2.5" />
            <span>POD ({totalPodCount})</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={4}
          className="w-72 p-3 shadow-xl border bg-popover text-popover-foreground text-xs space-y-2"
        >
          <div className="font-semibold text-xs text-foreground flex items-center justify-between border-b pb-1.5">
            <span className="flex items-center gap-1.5">
              <Paperclip className="h-3.5 w-3.5 text-primary" />
              <span>Bằng chứng giao nhận (POD)</span>
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{record.id}</span>
          </div>

          {/* Danh sách ảnh */}
          {record.podImages && record.podImages.length > 0 && (
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-muted-foreground">Ảnh chụp ký nhận:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {record.podImages.map((imgUrl, i) => (
                  <a
                    key={i}
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group/img relative aspect-video rounded overflow-hidden border border-border bg-muted block"
                  >
                    <img
                      src={imgUrl}
                      alt="Ảnh POD"
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                    />
                    <span className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-medium">
                      Phóng to ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Danh sách file đính kèm */}
          {record.attachments && record.attachments.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[11px] font-medium text-muted-foreground">Tệp đính kèm:</span>
              <div className="space-y-1">
                {record.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-1.5 rounded bg-muted/50 text-[11px] border border-border/50"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileText className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      <span className="truncate font-medium text-foreground" title={att.name}>
                        {att.name}
                      </span>
                    </div>
                    {att.size && (
                      <span className="text-[10px] text-muted-foreground font-mono shrink-0 ml-1">
                        {att.size}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
