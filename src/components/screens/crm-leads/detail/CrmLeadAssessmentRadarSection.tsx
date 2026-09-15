'use client'

import React, { useMemo } from 'react'
import {
  ThumbsUp,
  AlertTriangle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StudentSubjectItem } from './CrmLeadChildCard'

export interface CrmLeadAssessmentRadarSectionProps {
  currentSubject: StudentSubjectItem
  isMathSubject: boolean
}

export function CrmLeadAssessmentRadarSection({
  currentSubject,
  isMathSubject,
}: CrmLeadAssessmentRadarSectionProps) {
  // Dữ liệu 5 kỹ năng đánh giá
  const skillsData = useMemo(() => {
    const s = currentSubject.testRadarSkills || {}
    if (isMathSubject) {
      return [
        {
          key: 'reflex',
          label: 'Phản xạ logic',
          score: s.reflex ?? 85,
          color: 'text-sky-600 dark:text-sky-400',
        },
        {
          key: 'pronunciation',
          label: 'Hình khối',
          score: s.pronunciation ?? 90,
          color: 'text-rose-600 dark:text-rose-400',
        },
        {
          key: 'vocabGrammar',
          label: 'Số học nhẩm',
          score: s.vocabGrammar ?? 80,
          color: 'text-amber-600 dark:text-amber-400',
        },
        {
          key: 'readingWriting',
          label: 'Đọc hiểu đề',
          score: s.readingWriting ?? 90,
          color: 'text-emerald-600 dark:text-emerald-400',
        },
        {
          key: 'listening',
          label: 'Tập trung logic',
          score: s.listening ?? 85,
          color: 'text-indigo-600 dark:text-indigo-400',
        },
      ]
    }
    return [
      {
        key: 'reflex',
        label: 'Phản xạ',
        score: s.reflex ?? 31,
        color: 'text-sky-600 dark:text-sky-400',
      },
      {
        key: 'pronunciation',
        label: 'Phát âm',
        score: s.pronunciation ?? 75,
        color: 'text-rose-600 dark:text-rose-400',
      },
      {
        key: 'vocabGrammar',
        label: 'Từ - Cấu trúc',
        score: s.vocabGrammar ?? 65,
        color: 'text-amber-600 dark:text-amber-400',
      },
      {
        key: 'readingWriting',
        label: 'Đọc - Viết',
        score: s.readingWriting ?? 70,
        color: 'text-emerald-600 dark:text-emerald-400',
      },
      {
        key: 'listening',
        label: 'Nghe hiểu',
        score: s.listening ?? 80,
        color: 'text-indigo-600 dark:text-indigo-400',
      },
    ]
  }, [currentSubject.testRadarSkills, isMathSubject])

  // Tìm kỹ năng điểm cao nhất và các kỹ năng cần cải thiện
  const sortedSkills = useMemo(() => {
    return [...skillsData].sort((a, b) => b.score - a.score)
  }, [skillsData])

  const topSkill = sortedSkills[0]
  const weakSkills = sortedSkills.slice(-3).reverse()

  // Phân tích điểm cải thiện thành danh sách bullet
  const improvementBullets = useMemo(() => {
    if (currentSubject.testImprovements) {
      const parts = currentSubject.testImprovements
        .split(/[.;]/)
        .map((p) => p.trim())
        .filter((p) => p.length > 5)
      if (parts.length >= 2) return parts.slice(0, 2)
    }
    return isMathSubject
      ? [
          'Cần cẩn thận hơn khi giải các bài toán đố có nhiều bước logic.',
          'Chú ý trình bày rõ ràng từng bước tính toán trung gian.',
        ]
      : [
          'Chỉ nói được từ đơn, chú ý tránh nói tiếng Anh xen lẫn tiếng Việt.',
          'Nói chưa đúng ngữ điệu, sai trọng âm, cần luyện tập phản xạ giao tiếp tự nhiên.',
        ]
  }, [currentSubject.testImprovements, isMathSubject])

  return (
    // PHẲNG: BỎ VIỀN NGOÀI & BỎ NỀN XÁM BG-MUTED/30
    <div className="pt-2 border-t border-border/60 space-y-2.5">
      {/* HEADER: TIÊU ĐỀ + TỔNG ĐIỂM */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="font-bold text-foreground flex items-center gap-1.5">
          <span>
            {isMathSubject
              ? 'Năng lực 5 kỹ năng (Đánh giá Năng lực Toán & Logic)'
              : 'Năng lực 5 kỹ năng (Placement Test Tiếng Anh)'}
          </span>
        </span>

        <span className="text-xs font-semibold text-foreground">
          Tổng điểm:{' '}
          <span className="text-rose-600 dark:text-rose-400 font-extrabold text-sm">
            {currentSubject.testScore || (isMathSubject ? '9.2/10' : '8.5/10')}
          </span>
        </span>
      </div>

      {/* 5 THẺ KỸ NĂNG: CÓ VIỀN CHO TỪNG MỤC, KHÔNG CÓ LINE PROCESS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
        {skillsData.map((item, idx) => (
          <div
            key={item.key}
            className={cn(
              'p-2 rounded-lg bg-card border border-border/80 space-y-0.5 shadow-3xs transition-colors hover:border-border',
              idx === 4 ? 'col-span-2 sm:col-span-1' : ''
            )}
          >
            <span className="text-muted-foreground text-[10.5px] font-medium block truncate">
              {item.label}
            </span>
            <div className={cn('font-extrabold text-sm', item.color)}>
              {item.score}%
            </div>
          </div>
        ))}
      </div>

      {/* CỤM ĐÁNH GIÁ ĐIỂM MẠNH & CẦN CẢI THIỆN: 2 CALLOUT BOX CHUẨN ẢNH MẪU 2 */}
      <div className="space-y-2 pt-0.5">
        {/* Box 1: Điểm mạnh (Nền xanh lá nhẹ, icon ngón tay like xanh 👍) */}
        <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/60 flex items-start gap-2.5 text-xs text-left shadow-3xs">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0 mt-0.5">
            <ThumbsUp className="h-3.5 w-3.5 fill-current" />
          </div>
          <div className="space-y-0.5 flex-1 min-w-0 text-foreground leading-relaxed">
            <p className="text-xs">
              Con đã thể hiện sự tự tin ở kỹ năng{' '}
              <strong className="font-bold text-emerald-800 dark:text-emerald-300">
                {topSkill.label} ({topSkill.score}%)
              </strong>
              .
            </p>
            <p className="text-[11.5px] text-foreground/90">
              Con hãy phát huy điểm mạnh của mình như:{' '}
              <span className="font-medium text-foreground">
                {currentSubject.testStrengths ||
                  (isMathSubject
                    ? 'Tư duy hình học không gian và tính nhẩm cực tốt.'
                    : 'Ghi nhớ từ vựng qua hình ảnh tốt, phản xạ nhanh với các chủ đề quen thuộc.')}
              </span>
            </p>
          </div>
        </div>

        {/* Box 2: Cần cải thiện (Nền vàng cam nhẹ, icon tam giác cảnh báo ⚠️) */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-left shadow-3xs">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
            <AlertTriangle className="h-3.5 w-3.5 fill-amber-500/20 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="space-y-1 flex-1 min-w-0 text-foreground leading-relaxed">
            <p className="text-xs">
              Con cần luyện tập thêm về{' '}
              <strong className="font-bold text-amber-900 dark:text-amber-300">
                {weakSkills.map((ws) => `${ws.label} (${ws.score}%)`).join(', ')}
              </strong>
              .
            </p>
            <div className="text-[11.5px] text-foreground/90 space-y-0.5">
              <p>
                Ngoài ra, con cần chú ý{' '}
                <span className="font-semibold underline decoration-amber-500 underline-offset-2">
                  cải thiện
                </span>{' '}
                về:
              </p>
              <ul className="space-y-0.5 pl-1 text-[11px] text-muted-foreground font-medium">
                {improvementBullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 shrink-0">•</span>
                    <span>{bullet.startsWith('• ') ? bullet.slice(2) : bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
