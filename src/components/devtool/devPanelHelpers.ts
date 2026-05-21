export interface DevPanelHierarchyItem {
  name: string
  type: string
}

interface BuildContextMarkdownInput {
  pathname: string | null
  menuId: string | null
  screenLabel?: string
  screenDescription?: string
  componentName?: string
  navigationLabel?: string
  componentHierarchy: DevPanelHierarchyItem[]
  authState: unknown
  uiState: unknown
}

export function buildDevPanelContextMarkdown({
  pathname,
  menuId,
  screenLabel,
  screenDescription,
  componentName,
  navigationLabel,
  componentHierarchy,
  authState,
  uiState,
}: BuildContextMarkdownInput): string {
  const lines: string[] = []

  lines.push('# Page Context')
  lines.push('')
  lines.push('## Route Information')
  lines.push(`- **Route Path**: \`${pathname}\``)
  lines.push(`- **Menu ID**: \`${menuId || 'N/A'}\``)
  lines.push(`- **Screen Label**: \`${screenLabel || 'N/A'}\``)
  lines.push(`- **Screen Description**: \`${screenDescription || 'N/A'}\``)
  lines.push('')

  lines.push('## Component Information')
  lines.push('- **Component File**: `src/app/(dashboard)/app/[menuId]/page.tsx`')
  lines.push(`- **Component Name**: \`${componentName || 'MenuPage'}\``)
  if (navigationLabel) {
    lines.push(`- **Navigation Label**: \`${navigationLabel}\``)
  }
  lines.push('')

  lines.push('## Component Hierarchy')
  componentHierarchy.forEach((item, index) => {
    lines.push(`${'  '.repeat(index)}- ${item.name} (${item.type})`)
  })
  lines.push('')

  lines.push('## Zustand Stores')
  lines.push('')
  lines.push('### Auth Store')
  lines.push('```json')
  lines.push(JSON.stringify(authState, null, 2))
  lines.push('```')
  lines.push('')

  lines.push('### UI Store')
  lines.push('```json')
  lines.push(JSON.stringify(uiState, null, 2))
  lines.push('```')
  lines.push('')

  lines.push('## Tech Stack')
  lines.push('- Next.js 16.2.6 + React 19 + TypeScript 5')
  lines.push('- TailwindCSS v4 + shadcn/ui')
  lines.push('- Zustand for state management')
  lines.push('- lucide-react for icons')
  lines.push('')

  return lines.join('\n')
}
