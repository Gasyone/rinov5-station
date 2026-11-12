import React from 'react'

/**
 * Safely parses inline markdown and supported HTML style tags into React elements.
 */
function parseInline(text: string, keyPrefix: string = 'inline'): React.ReactNode[] {
  if (!text) return []

  // Tokenize for:
  // 1. <span style="color:[^"]*">...</span>
  // 2. <mark style="background-color:[^"]*">...</mark>
  // 3. <u>...</u>
  // 4. **...**
  // 5. *...*
  // 6. ~~...~~
  const tokenRegex = /(<span style=["']color:\s*[^"']+["']>[\s\S]*?<\/span>|<mark style=["']background-color:\s*[^"']+["']>[\s\S]*?<\/mark>|<u>[\s\S]*?<\/u>|\*\*[\s\S]*?\*\*|\*[^*\n]+?\*|~~[\s\S]*?~~)/gi

  const parts = text.split(tokenRegex)
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`

    // Span color
    const spanMatch = part.match(/^<span style=["']color:\s*([^"']+)["']>([\s\S]*?)<\/span>$/i)
    if (spanMatch) {
      const color = spanMatch[1].trim()
      const inner = spanMatch[2]
      return (
        <span key={key} style={{ color }}>
          {parseInline(inner, `${key}-inner`)}
        </span>
      )
    }

    // Mark highlight
    const markMatch = part.match(/^<mark style=["']background-color:\s*([^"']+)["']>([\s\S]*?)<\/mark>$/i)
    if (markMatch) {
      const bg = markMatch[1].trim()
      const inner = markMatch[2]
      return (
        <mark
          key={key}
          style={{ backgroundColor: bg }}
          className="px-1 py-0.5 rounded"
        >
          {parseInline(inner, `${key}-inner`)}
        </mark>
      )
    }

    // Underline
    const uMatch = part.match(/^<u>([\s\S]*?)<\/u>$/i)
    if (uMatch) {
      return (
        <u key={key} className="underline underline-offset-2">
          {parseInline(uMatch[1], `${key}-inner`)}
        </u>
      )
    }

    // Bold
    const boldMatch = part.match(/^\*\*([\s\S]*?)\*\*$/)
    if (boldMatch) {
      return (
        <strong key={key} className="font-semibold">
          {parseInline(boldMatch[1], `${key}-inner`)}
        </strong>
      )
    }

    // Italic
    const italicMatch = part.match(/^\*([^*\n]+?)\*$/)
    if (italicMatch) {
      return (
        <em key={key} className="italic">
          {italicMatch[1]}
        </em>
      )
    }

    // Strikethrough
    const strikeMatch = part.match(/^~~([\s\S]*?)~~$/)
    if (strikeMatch) {
      return (
        <del key={key} className="line-through opacity-70">
          {strikeMatch[1]}
        </del>
      )
    }

    return part
  })
}

/**
 * Main export: Render rich content text with bullet points, numbered lists, and inline styles.
 */
export function renderRichText(content: string = ''): React.ReactNode {
  if (!content) return null

  const lines = content.split('\n')

  return (
    <span className="inline-block w-full">
      {lines.map((line, idx) => {
        const trimmed = line.trim()
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('• ')
        const isNumbered = /^\d+\.\s/.test(trimmed)

        if (isBullet) {
          const bulletContent = trimmed.replace(/^[-•]\s*/, '')
          return (
            <span key={idx} className="flex items-start gap-1.5 my-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0 mt-1.5" />
              <span className="flex-1 leading-relaxed">
                {parseInline(bulletContent, `bullet-${idx}`)}
              </span>
            </span>
          )
        }

        if (isNumbered) {
          const numMatch = trimmed.match(/^(\d+\.)\s*(.*)$/)
          if (numMatch) {
            return (
              <span key={idx} className="flex items-start gap-1.5 my-0.5">
                <span className="text-xs font-semibold text-primary shrink-0 min-w-[16px]">
                  {numMatch[1]}
                </span>
                <span className="flex-1 leading-relaxed">
                  {parseInline(numMatch[2], `num-${idx}`)}
                </span>
              </span>
            )
          }
        }

        return (
          <React.Fragment key={idx}>
            {idx > 0 && <br />}
            {parseInline(line, `line-${idx}`)}
          </React.Fragment>
        )
      })}
    </span>
  )
}
