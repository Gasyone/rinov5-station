'use client'

import React, { useState } from 'react'
import { Eye } from 'lucide-react'
import { MediaPreviewModal, type MediaPreviewItem } from '@/components/shared'
import { renderRichText } from '@/lib/renderRichText'
import type { WeekReviewItem } from '../classes/detail/monthlyReportHelpers'

interface MonthlyReportSectionBProps {
  monthName: string
  b1Content?: string
  weeks: WeekReviewItem[]
}

interface SessionPlanItem {
  title: string
  body: string
}

function parseB1Sessions(content?: string): SessionPlanItem[] {
  if (!content || !content.trim()) return []

  // Tách theo các khối có dòng trống hoặc dấu xuống dòng kép
  const rawBlocks = content.trim().split(/\n\s*\n/)
  const result: SessionPlanItem[] = []

  for (const block of rawBlocks) {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (lines.length === 0) continue

    const first = lines[0]
    // Nếu dòng đầu là tiêu đề buổi/bài
    if (
      first.toLowerCase().startsWith('buổi') ||
      first.toLowerCase().startsWith('bài') ||
      first.toLowerCase().startsWith('lesson') ||
      first.includes(':')
    ) {
      const title = first.replace(/^[-•*]\s*/, '').replace(/:$/, '')
      const body = lines.slice(1).join('\n')
      result.push({ title, body: body || first })
    } else {
      result.push({
        title: lines[0],
        body: lines.slice(1).join('\n') || lines[0],
      })
    }
  }

  // Nếu không tách được theo block rỗng, thử tách theo từ khóa 'Buổi' hoặc 'Bài'
  if (result.length <= 1 && (content.includes('Buổi ') || content.includes('Bài '))) {
    const regex = /(?:^|\n)((?:Buổi|Bài|Lesson)\s+\d+[^:\n]*:?)/gi
    const parts = content.split(regex).filter(Boolean)
    if (parts.length >= 2) {
      const reParsed: SessionPlanItem[] = []
      for (let i = 0; i < parts.length; i += 2) {
        const title = parts[i]?.trim().replace(/:$/, '') || `Bài ${Math.floor(i / 2) + 1}`
        const body = parts[i + 1]?.trim() || ''
        if (title) {
          reParsed.push({ title, body })
        }
      }
      if (reParsed.length > 0) return reParsed
    }
  }

  return result
}

export function MonthlyReportSectionB({
  monthName,
  b1Content,
  weeks,
}: MonthlyReportSectionBProps) {
  const [previewMedia, setPreviewMedia] = useState<MediaPreviewItem | null>(null)

  const validWeeks = weeks.filter((w) => w.content && w.content.trim().length > 0)
  const sessions = parseB1Sessions(b1Content)

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl box-shadow-report p-3 sm:p-5 border border-slate-100/90 space-y-3.5 sm:space-y-4">
      {/* ── HEADER SECTION B ── */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#FF9E08] to-[#F05A28] text-white text-xs font-bold shadow-2xs">
          B
        </span>
        <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 tracking-tight">
          Kế hoạch học tập tháng tới {monthName}
        </h3>
      </div>

      {/* ── 1. NỘI DUNG BÀI HỌC TRỌNG TÂM (CHIA THEO TỪNG BÀI/BUỔI, TEXT SOẠN THẢO THƯỜNG) ── */}
      <div className="space-y-2.5">
        <h4 className="text-xs sm:text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF9E08]" />
          <span>1. Nội dung bài học trọng tâm</span>
        </h4>

        {sessions.length > 0 ? (
          <div className="space-y-2 sm:space-y-2.5">
            {sessions.map((session, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-3 sm:p-3.5 space-y-1.5 shadow-3xs"
              >
                {/* Tiêu đề buổi/bài */}
                <h5 className="font-semibold text-xs sm:text-[13.5px] text-amber-900 leading-snug">
                  {session.title}
                </h5>

                {/* Nội dung dạng soạn thảo giàu định dạng (màu sắc, in đậm, bullet) */}
                <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal break-words">
                  {renderRichText(session.body)}
                </div>
              </div>
            ))}
          </div>
        ) : b1Content && b1Content.trim() ? (
          <div className="rounded-xl border border-slate-200/90 bg-slate-50/40 p-3 sm:p-4 text-xs sm:text-[13px] leading-relaxed text-slate-700 font-normal shadow-3xs break-words">
            {renderRichText(b1Content)}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs sm:text-[13px] text-slate-400 italic">
            Chưa có nội dung bài học tháng tới.
          </div>
        )}
      </div>

      {/* ── 2. LỘ TRÌNH ÔN TẬP RIÊNG TẠI NHÀ (TIMELINE ROADMAP, ẢNH TO BẰNG VIỀN NGOÀI CÙNG) ── */}
      {validWeeks.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <h4 className="text-xs sm:text-[13px] font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9E08]" />
            <span>2. Lộ trình ôn tập riêng tại nhà</span>
          </h4>

          {/* Trục Roadmap Timeline nối các tuần */}
          <div className="relative pl-4.5 sm:pl-7 space-y-2.5 before:absolute before:left-2 sm:before:left-2.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-orange-300 before:to-amber-200">
            {validWeeks.map((item, idx) => {
              const hasAttachment = Boolean(item.thumbnailUrl || item.docLink)

              return (
                <div key={idx} className="relative group">
                  {/* Điểm mốc số tuần trên Timeline */}
                  <div className="absolute -left-4.5 sm:-left-7 top-2.5 h-5 w-5 sm:h-5.5 sm:w-5.5 rounded-full bg-white border-2 border-[#FF9E08] text-[#FF9E08] font-bold text-[10px] sm:text-[11px] flex items-center justify-center shadow-3xs group-hover:scale-110 group-hover:bg-[#FF9E08] group-hover:text-white transition-all">
                    {idx + 1}
                  </div>

                  {/* Card nội dung tuần: Responsive Mobile-first (dọc trên mobile, ngang trên desktop) */}
                  <div className="rounded-xl border border-slate-200/90 bg-white hover:border-amber-400/90 flex flex-col sm:flex-row items-stretch justify-between shadow-3xs overflow-hidden transition-all hover:shadow-xs min-h-[58px]">
                    {/* Phần nội dung & tiêu đề Tuần (gọn gàng, không bị ép hẹp) */}
                    <div className="flex-1 min-w-0 py-2.5 px-3 sm:px-3.5 space-y-1">
                      <h5 className="font-semibold text-xs sm:text-[13px] text-amber-800 leading-none">
                        {item.title || `Tuần ${idx + 1}`}
                      </h5>
                      <div className="text-xs sm:text-[12.5px] leading-relaxed text-slate-700 font-normal break-words">
                        {renderRichText(item.content)}
                      </div>
                    </div>

                    {/* Ảnh phiếu bài tập: Trên mobile trải ngang vừa vặn, trên desktop tràn khít bên phải */}
                    {hasAttachment && item.thumbnailUrl && (
                      <div
                        onClick={() => {
                          setPreviewMedia({
                            name: `${item.title || `Tuần ${idx + 1}`} - Phiếu bài tập`,
                            url: item.thumbnailUrl!,
                            thumbnailUrl: item.thumbnailUrl,
                          })
                        }}
                        className="shrink-0 w-full sm:w-28 md:w-32 h-28 sm:h-auto self-stretch relative group/img cursor-pointer overflow-hidden border-t sm:border-t-0 sm:border-l border-slate-200/80 bg-slate-100"
                        title="Bấm để xem phóng to phiếu bài tập"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title || 'Phiếu bài tập'}
                          className="absolute inset-0 w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center text-white gap-1 text-[11px] font-medium sm:opacity-0 sm:group-hover/img:opacity-100 transition-opacity">
                          <Eye className="h-3.5 w-3.5" />
                          <span>Xem phiếu bài tập</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal xem ảnh lớn khi bấm Xem trên Thumbnail */}
      {previewMedia && (
        <MediaPreviewModal
          previewMedia={previewMedia}
          onClose={() => setPreviewMedia(null)}
        />
      )}
    </div>
  )
}
