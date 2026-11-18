'use client'

import React from 'react'
import { MessageCircleHeart, Quote } from 'lucide-react'

interface MonthlyReportParentMessageCardProps {
  message: string
}

/**
 * Lời nhắn RinoEdu gửi phụ huynh — trình bày dạng thư tay:
 * căn trái, một đoạn liền mạch, chữ nghiêng, có tiêu đề + chữ ký để nổi bật
 * như một phần nội dung chính chứ không phải ghi chú phụ.
 */
export function MonthlyReportParentMessageCard({ message }: MonthlyReportParentMessageCardProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-orange-200/80 bg-white box-shadow-report print:hidden">
      {/* Dải nhấn thương hiệu bên trái */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#EA2D2D] to-[#F98A3A]"
      />
      {/* Dấu ngoặc kép trang trí */}
      <Quote
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 h-8 w-8 rotate-180 text-orange-100 sm:right-3 sm:top-3 sm:h-10 sm:w-10"
        strokeWidth={1.5}
      />

      <div className="relative space-y-2.5 py-4 pl-5 pr-4 sm:py-5 sm:pl-7 sm:pr-6">
        {/* Tiêu đề lời nhắn */}
        <div className="flex items-center gap-1.5 pr-10">
          <MessageCircleHeart className="h-[20px] w-[20px] shrink-0 text-[#EA2D2D]" />
          <h3 className="text-[18px] font-bold tracking-tight text-slate-900 sm:text-[20px]">
            Lời nhắn gửi Ba mẹ
          </h3>
        </div>

        {/* Nội dung lời nhắn — một đoạn liền mạch, căn trái, chữ nghiêng */}
        <p className="break-words text-left text-[17px] italic leading-[1.7] text-slate-900 sm:text-[18px]">
          {message}
        </p>

        {/* Lời cảm ơn */}
        <div className="border-t border-dashed border-orange-200 pt-2.5">
          <span className="text-[16px] font-bold italic text-slate-900 sm:text-[17px]">
            Trân trọng cảm ơn Ba mẹ!
          </span>
        </div>
      </div>
    </section>
  )
}
