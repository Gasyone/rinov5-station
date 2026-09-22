'use client'

import React from 'react'

export function parseEvaluationPair(
  content: string = '',
  marker1: string,
  marker2: string
): { part1: string; part2: string } {
  if (!content) return { part1: '', part2: '' }

  const index2 = content.indexOf(marker2)
  if (index2 !== -1) {
    const rawPart1 = content.slice(0, index2).trim()
    const rawPart2 = content.slice(index2 + marker2.length).trim()

    const cleanPart1 = rawPart1.startsWith(marker1)
      ? rawPart1.slice(marker1.length).trim()
      : rawPart1.replace(new RegExp(`^${marker1}\\s*`, 'i'), '').trim()

    return { part1: cleanPart1, part2: rawPart2 }
  }

  const cleanPart1 = content.startsWith(marker1)
    ? content.slice(marker1.length).trim()
    : content.replace(new RegExp(`^${marker1}\\s*`, 'i'), '').trim()

  return { part1: cleanPart1, part2: '' }
}

interface FormattedEvaluationContentProps {
  content: string
  type: 'general' | 'academic'
  className?: string
}

export function FormattedEvaluationContent({
  content,
  type,
  className = '',
}: FormattedEvaluationContentProps) {
  if (!content) {
    return (
      <div className="text-sm text-muted-foreground/60 italic font-sans">
        Chưa có nội dung đánh giá.
      </div>
    )
  }

  if (type === 'general') {
    const { part1: diemNoiBat, part2: diemCanLuuY } = parseEvaluationPair(
      content,
      'Điểm nổi bật:',
      'Điểm cần lưu ý:'
    )

    // Nếu văn bản không theo cấu trúc trên, hiển thị nguyên bản dạng text
    if (!diemNoiBat && !diemCanLuuY) {
      return (
        <div className={`text-sm text-foreground leading-relaxed font-sans whitespace-pre-line ${className}`}>
          {content}
        </div>
      )
    }

    return (
      <div className={`space-y-4 font-sans ${className}`}>
        {diemNoiBat && (
          <p className="text-sm text-foreground leading-relaxed">
            <span className="text-emerald-600 dark:text-emerald-400">
              Điểm nổi bật:{' '}
            </span>
            <span>{diemNoiBat}</span>
          </p>
        )}

        {diemCanLuuY && (
          <p className="text-sm text-foreground leading-relaxed">
            <span className="text-amber-600 dark:text-amber-400">
              Điểm cần lưu ý:{' '}
            </span>
            <span>{diemCanLuuY}</span>
          </p>
        )}
      </div>
    )
  }

  // Loại academic (Từ vựng & Phonics, Cấu trúc & Mẫu câu)
  const { part1: tuVungPhonics, part2: cauTrucMauCau } = parseEvaluationPair(
    content,
    'Từ vựng & Phonics:',
    'Cấu trúc & Mẫu câu:'
  )

  if (!tuVungPhonics && !cauTrucMauCau) {
    return (
      <div className={`text-sm text-foreground leading-relaxed font-sans whitespace-pre-line ${className}`}>
        {content}
      </div>
    )
  }

  return (
    <div className={`space-y-4 font-sans ${className}`}>
      {tuVungPhonics && (
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-sky-600 dark:text-sky-400">
            Từ vựng & Phonics:{' '}
          </span>
          <span>{tuVungPhonics}</span>
        </p>
      )}

      {cauTrucMauCau && (
        <p className="text-sm text-foreground leading-relaxed">
          <span className="text-purple-600 dark:text-purple-400">
            Cấu trúc & Mẫu câu:{' '}
          </span>
          <span>{cauTrucMauCau}</span>
        </p>
      )}
    </div>
  )
}
