'use client'

import { useUIStore } from '@/stores/useUIStore'
import { CARE_OPERATIONS_EXPLAIN_TOPICS } from './careOperationsExplainData'
import {
  Lightbulb,
  X,
  Target,
  Users,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function ExplainDrawer() {
  const isExplainMode = useUIStore((s) => s.isExplainMode)
  const activeExplainTopic = useUIStore((s) => s.activeExplainTopic)
  const setActiveExplainTopic = useUIStore((s) => s.setActiveExplainTopic)

  if (!isExplainMode || !activeExplainTopic) return null

  const topic = CARE_OPERATIONS_EXPLAIN_TOPICS[activeExplainTopic]
  if (!topic) return null

  const topicKeys = Object.keys(CARE_OPERATIONS_EXPLAIN_TOPICS)
  const currentIndex = topicKeys.indexOf(activeExplainTopic)
  const prevTopic = currentIndex > 0 ? topicKeys[currentIndex - 1] : null
  const nextTopic = currentIndex < topicKeys.length - 1 ? topicKeys[currentIndex + 1] : null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Thuyết minh Nghiệp vụ PO"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl transition-all duration-200 animate-in slide-in-from-right sm:max-w-lg"
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between border-b border-border bg-muted/30 px-5 py-4">
        <div className="space-y-1.5 pr-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <Lightbulb className="h-3 w-3 fill-amber-500/30" />
            </span>
            <Badge variant="outline" className="border-amber-500/40 bg-amber-500/10 text-xs font-semibold text-amber-800 dark:text-amber-300">
              {topic.category}
            </Badge>
          </div>
          <h3 className="text-base font-bold text-foreground leading-snug">
            {topic.title}
          </h3>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setActiveExplainTopic(null)}
          className="rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Đóng bảng thuyết minh"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Body content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-xs text-foreground/90">
        {/* Section 1: WHAT */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>1. WHAT - Đây là gì trên giao diện?</span>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80">
            {topic.what}
          </p>
        </div>

        {/* Section 2: WHY */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3.5 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <Target className="h-3.5 w-3.5" />
            <span>2. WHY - Ý đồ của PO & Bài toán giải quyết</span>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80">
            {topic.why}
          </p>
        </div>

        {/* Section 3: WHO */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
            <Users className="h-3.5 w-3.5" />
            <span>3. WHO - Đối tượng sử dụng & Vai trò</span>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80 font-medium">
            {topic.who}
          </p>
        </div>

        {/* Section 4: BUSINESS RULES */}
        <div className="rounded-lg border border-border/70 bg-card p-3.5 shadow-2xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>4. BUSINESS RULES - Quy tắc vận hành ngầm định</span>
          </div>
          <ul className="space-y-1.5 pl-1">
            {topic.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/80">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 5: Traceability */}
        {(topic.userStory || topic.businessFunction) && (
          <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              <span>Tài liệu đặc tả gốc:</span>
            </div>
            <div className="flex items-center gap-2 font-mono font-semibold text-foreground">
              {topic.userStory && <span>{topic.userStory}</span>}
              {topic.businessFunction && <span>({topic.businessFunction})</span>}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex shrink-0 items-center justify-between border-t border-border bg-muted/30 px-5 py-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!prevTopic}
          onClick={() => prevTopic && setActiveExplainTopic(prevTopic)}
          className="h-8 gap-1 text-xs"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Chủ đề trước</span>
        </Button>

        <span className="text-[11px] text-muted-foreground font-mono">
          {currentIndex + 1} / {topicKeys.length}
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!nextTopic}
          onClick={() => nextTopic && setActiveExplainTopic(nextTopic)}
          className="h-8 gap-1 text-xs"
        >
          <span>Tiếp theo</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
