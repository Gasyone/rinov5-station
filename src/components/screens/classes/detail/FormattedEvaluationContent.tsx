'use client'

import React from 'react'

export interface ParsedItem {
  label: string
  body: string
  colorClass: string
}

/**
 * Phân tích nội dung nhận xét có cấu trúc nhãn (Title/Label) để highlight màu tương ứng.
 * - Mục Nhận xét chung:
 *   + Tiêu đề tích cực (Điểm nổi bật, Điểm mạnh, Ưu điểm...): Xanh lá (Emerald)
 *   + Tiêu đề lưu ý (Điểm cần lưu ý, Cần lưu ý, Cần cải thiện...): Cam / Hổ phách (Amber)
 * - Mục Nhận xét kết quả học tập:
 *   + Tiêu đề kiến thức/từ vựng (Từ vựng & Phonics, Kiến thức & Tư duy...): Xanh da trời (Sky)
 *   + Tiêu đề kỹ năng/cấu trúc (Cấu trúc & Mẫu câu, Kỹ năng giải toán...): Tím (Purple)
 */
export function parseEvaluationContent(
  content: string = '',
  type: 'general' | 'academic'
): ParsedItem[] {
  if (!content || !content.trim()) return []

  const trimmed = content.trim()

  const defaultColor1 =
    type === 'general'
      ? 'text-emerald-700 dark:text-emerald-400 font-normal'
      : 'text-sky-700 dark:text-sky-400 font-normal'

  const defaultColor2 =
    type === 'general'
      ? 'text-amber-700 dark:text-amber-400 font-normal'
      : 'text-purple-700 dark:text-purple-400 font-normal'

  const getColorForLabel = (rawLabel: string, index: number): string => {
    const lower = rawLabel.toLowerCase()
    if (type === 'general') {
      if (
        lower.includes('nổi bật') ||
        lower.includes('mạnh') ||
        lower.includes('ưu điểm') ||
        lower.includes('tốt') ||
        lower.includes('tích cực')
      ) {
        return 'text-emerald-700 dark:text-emerald-400 font-normal'
      }
      if (
        lower.includes('lưu ý') ||
        lower.includes('cải thiện') ||
        lower.includes('hạn chế') ||
        lower.includes('yếu') ||
        lower.includes('nhược điểm') ||
        lower.includes('khó khăn')
      ) {
        return 'text-amber-700 dark:text-amber-400 font-normal'
      }
      return index === 0 ? defaultColor1 : defaultColor2
    }

    // Academic
    if (
      lower.includes('từ vựng') ||
      lower.includes('phonics') ||
      lower.includes('kiến thức') ||
      lower.includes('tư duy') ||
      lower.includes('lý thuyết') ||
      lower.includes('khái niệm')
    ) {
      return 'text-sky-700 dark:text-sky-400 font-normal'
    }
    if (
      lower.includes('cấu trúc') ||
      lower.includes('mẫu câu') ||
      lower.includes('ngữ pháp') ||
      lower.includes('kỹ năng') ||
      lower.includes('phương pháp') ||
      lower.includes('bài tập')
    ) {
      return 'text-purple-700 dark:text-purple-400 font-normal'
    }
    return index === 0 ? defaultColor1 : defaultColor2
  }

  // Tách các khối theo dòng bắt đầu bằng "Nhãn:"
  // Hỗ trợ cả ngắt dòng đôi \n\n lẫn ngắt dòng đơn \n
  const blocks = trimmed.split(/\n(?=[^\n\r:]{2,35}:)/).map((b) => b.trim()).filter(Boolean)

  const items: ParsedItem[] = []

  blocks.forEach((block) => {
    // Kiểm tra xem block có bắt đầu bằng nhãn không
    const match = block.match(/^([^:\n\r]{2,35}:)\s*([\s\S]*)$/)
    if (match) {
      const rawLabel = match[1].trim()
      const rawBody = match[2].trim()

      // Trường hợp người dùng gõ cả 2 nhãn trên 1 dòng đơn mà không ngắt dòng
      // Ví dụ: Điểm nổi bật: ... Điểm cần lưu ý: ...
      const secondaryMarkerRegex =
        type === 'general'
          ? /(?:^|\s)(Điểm cần lưu ý:|Cần lưu ý:|Điểm cần cải thiện:|Lưu ý:)\s*/i
          : /(?:^|\s)(Cấu trúc & Mẫu câu:|Cấu trúc:|Mẫu câu:|Kỹ năng giải toán:|Kỹ năng:)\s*/i

      const inlineSplit = rawBody.search(secondaryMarkerRegex)
      if (inlineSplit !== -1) {
        const firstBody = rawBody.slice(0, inlineSplit).trim()
        const remainder = rawBody.slice(inlineSplit).trim()
        const matchSecond = remainder.match(secondaryMarkerRegex)

        items.push({
          label: rawLabel,
          body: firstBody,
          colorClass: getColorForLabel(rawLabel, items.length),
        })

        if (matchSecond) {
          const secondLabel = matchSecond[1]
          const secondBody = remainder.slice(matchSecond[0].length).trim()
          items.push({
            label: secondLabel,
            body: secondBody,
            colorClass: getColorForLabel(secondLabel, items.length),
          })
        }
      } else {
        items.push({
          label: rawLabel,
          body: rawBody,
          colorClass: getColorForLabel(rawLabel, items.length),
        })
      }
    } else {
      // Đoạn text tự do không có nhãn
      items.push({
        label: '',
        body: block,
        colorClass: '',
      })
    }
  })

  return items
}

/**
 * Hàm phân tách 2 phần đánh giá theo marker (giữ để backward-compatible)
 */
export function parseEvaluationPair(
  content: string = '',
  marker1: string,
  marker2: string
): { part1: string; part2: string } {
  if (!content) return { part1: '', part2: '' }

  const escapeReg = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const reg1 = new RegExp(escapeReg(marker1), 'i')
  const reg2 = new RegExp(escapeReg(marker2), 'i')

  const match1 = content.match(reg1)
  const match2 = content.match(reg2)

  if (!match1 && !match2) {
    return { part1: '', part2: '' }
  }

  if (match2 && match2.index !== undefined) {
    const rawPart1 = content.slice(0, match2.index).trim()
    const rawPart2 = content.slice(match2.index + match2[0].length).trim()

    const cleanPart1 = rawPart1.replace(reg1, '').trim()
    return { part1: cleanPart1, part2: rawPart2 }
  }

  if (match1 && match1.index !== undefined) {
    const cleanPart1 = content.slice(match1.index + match1[0].length).trim()
    return { part1: cleanPart1, part2: '' }
  }

  return { part1: '', part2: '' }
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
  if (!content || !content.trim()) {
    return (
      <div className="text-xs text-muted-foreground/60 italic font-sans py-0.5">
        Chưa có nội dung đánh giá.
      </div>
    )
  }

  const items = parseEvaluationContent(content, type)

  // Nếu không có nhãn nào được phát hiện, hiển thị nguyên bản text thông thường
  const hasAnyLabel = items.some((it) => !!it.label)
  if (!hasAnyLabel) {
    return (
      <div className={`text-xs text-foreground leading-relaxed font-sans whitespace-pre-line ${className}`}>
        {content}
      </div>
    )
  }

  return (
    <div className={`space-y-1.5 font-sans ${className}`}>
      {items.map((item, idx) => (
        <p key={idx} className="text-xs text-foreground/85 leading-relaxed font-normal">
          {item.label && (
            <span className={`${item.colorClass || 'text-foreground font-normal'} select-none mr-1.5 font-normal`}>
              {item.label}
            </span>
          )}
          <span className="whitespace-pre-line text-foreground/80 font-normal">{item.body}</span>
        </p>
      ))}
    </div>
  )
}
