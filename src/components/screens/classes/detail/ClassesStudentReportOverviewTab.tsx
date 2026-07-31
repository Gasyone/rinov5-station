'use client'

import React, { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Sparkles, BookOpen, AlertCircle, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PhaseEvaluation {
  phaseName: string
  duration: string
  score: number
  status: 'excel' | 'good' | 'average'
  comment: string
  recommendation: string
}

export interface SkillMetric {
  name: string
  percentage: number
  scoreText: string
  colorClass: string
}

interface ClassesStudentReportOverviewTabProps {
  studentId: string
}

export function ClassesStudentReportOverviewTab({ studentId }: ClassesStudentReportOverviewTabProps) {
  // Deterministic values based on studentId
  const seed = studentId.charCodeAt(0) + studentId.charCodeAt(studentId.length - 1)

  const skills = useMemo<SkillMetric[]>(() => {
    const speakScore = parseFloat((6.0 + (seed % 3) * 0.5).toFixed(1))
    const listenScore = parseFloat((6.5 + (seed % 4) * 0.5).toFixed(1))
    const readScore = parseFloat((5.5 + (seed % 5) * 0.5).toFixed(1))
    const writeScore = parseFloat((5.0 + (seed % 4) * 0.5).toFixed(1))

    return [
      { name: 'Listening (Nghe)', percentage: Math.round((listenScore / 9.0) * 100), scoreText: `${listenScore}/9.0`, colorClass: 'bg-indigo-500' },
      { name: 'Reading (Đọc)', percentage: Math.round((readScore / 9.0) * 100), scoreText: `${readScore}/9.0`, colorClass: 'bg-sky-500' },
      { name: 'Writing (Viết)', percentage: Math.round((writeScore / 9.0) * 100), scoreText: `${writeScore}/9.0`, colorClass: 'bg-pink-500' },
      { name: 'Speaking (Nói)', percentage: Math.round((speakScore / 9.0) * 100), scoreText: `${speakScore}/9.0`, colorClass: 'bg-emerald-500' },
    ]
  }, [seed])

  const chartData = useMemo(() => {
    // Generate 12 scores demonstrating learning progress curve
    return Array.from({ length: 12 }, (_, i) => {
      const base = 5.5 + (i * 0.2) // upward trend
      const variation = ((seed + i) % 7) * 0.25 - 0.75
      return parseFloat(Math.min(9.5, Math.max(4.0, base + variation)).toFixed(1))
    })
  }, [seed])

  const phases = useMemo<PhaseEvaluation[]>(() => {
    return [
      {
        phaseName: 'Giai đoạn 1: Làm quen & Khởi động (Buổi 1 - 4)',
        duration: 'Tháng 4, 2026',
        score: parseFloat((6.0 + (seed % 10) / 10).toFixed(1)),
        status: 'good',
        comment: 'Học viên thích nghi nhanh với nhịp độ lớp học, có tinh thần tương tác hăng hái. Kỹ năng từ vựng nền ban đầu ở mức cơ bản ổn định.',
        recommendation: 'Cần chú ý thêm phần phát âm nguyên âm dài và ngữ điệu câu đơn giản.',
      },
      {
        phaseName: 'Giai đoạn 2: Phát triển kỹ năng (Buổi 5 - 8)',
        duration: 'Tháng 5, 2026',
        score: parseFloat((6.8 + (seed % 12) / 10).toFixed(1)),
        status: 'good',
        comment: 'Kỹ năng Đọc và Nghe ghi nhận sự bứt phá rõ rệt. Cấu trúc bài viết luận (Writing Task 2) bắt đầu có sự mạch lạc và biết sử dụng liên từ liên kết ý.',
        recommendation: 'Tập trung luyện nghe chép chính tả và đa dạng hoá cấu trúc câu phức trong bài viết.',
      },
      {
        phaseName: 'Giai đoạn 3: Bứt phá & Về đích (Buổi 9 - 12)',
        duration: 'Tháng 6, 2026',
        score: parseFloat((7.6 + (seed % 15) / 10).toFixed(1)),
        status: 'excel',
        comment: 'Hoàn thành xuất sắc các bài kiểm tra thực tế trên lớp. Kỹ năng Nói trôi chảy hơn, phản xạ nhanh và tự tin khi trao đổi ý kiến với giáo viên.',
        recommendation: 'Tiếp tục duy trì đọc thêm tài liệu tiếng Anh học thuật để nâng cao vốn từ vựng Band cao.',
      },
    ]
  }, [seed])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* LEFT COLUMN: Progress Chart & Skill Metrics */}
      <div className="lg:col-span-5 space-y-5 flex flex-col">
        {/* Learning Curve Chart */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs">
          <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            Biểu đồ tiến trình (12 Buổi)
          </h4>
          <div className="h-40 flex items-end justify-between gap-1 pt-6 px-2 relative">
            {/* Grid lines */}
            <div className="absolute inset-x-0 top-6 border-t border-dashed border-zinc-100 dark:border-zinc-800 text-[9px] text-muted-foreground pt-0.5">Band 9.0</div>
            <div className="absolute inset-x-0 top-18 border-t border-dashed border-zinc-100 dark:border-zinc-800 text-[9px] text-muted-foreground pt-0.5">Band 6.0</div>
            <div className="absolute inset-x-0 top-30 border-t border-dashed border-zinc-100 dark:border-zinc-800 text-[9px] text-muted-foreground pt-0.5">Band 3.0</div>

            {chartData.map((val, idx) => {
              const heightPct = Math.round((val / 9.5) * 100)
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                  {/* Tooltip on hover */}
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-5 bg-zinc-850 text-white text-[9px] font-bold px-1 py-0.5 rounded shadow-xs transition-opacity pointer-events-none font-mono">
                    {val}
                  </span>
                  {/* Bar */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={cn(
                      "w-full max-w-[14px] rounded-t-sm transition-all duration-300",
                      idx === 11 || idx === 8
                        ? "bg-amber-400 dark:bg-amber-500" // Test bar highlight
                        : "bg-primary/80 group-hover:bg-primary"
                    )}
                  />
                  <span className="text-[9px] text-muted-foreground font-mono mt-1.5">{idx + 1}</span>
                </div>
              )}
            )}
          </div>
          <div className="flex justify-center gap-4 mt-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span>Buổi học thường</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Buổi kiểm tra</span>
            </div>
          </div>
        </div>

        {/* Skill Metrics */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs flex-1">
          <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            Đánh giá năng lực kỹ năng
          </h4>
          <div className="space-y-3">
            {skills.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px] font-medium">
                  <span className="text-foreground">{skill.name}</span>
                  <span className="font-mono text-muted-foreground font-semibold">{skill.scoreText}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    style={{ width: `${skill.percentage}%` }}
                    className={cn("h-full rounded-full transition-all duration-500", skill.colorClass)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Phase-based comments & General recommendation */}
      <div className="lg:col-span-7 space-y-5">
        {/* Phase Evaluations */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-xs">
          <h4 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <Compass className="h-3.5 w-3.5 text-primary" />
            Nhận xét & Đánh giá theo giai đoạn
          </h4>
          <div className="space-y-4">
            {phases.map((phase, pIdx) => (
              <div
                key={pIdx}
                className="p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-800/10 border border-zinc-100/50 dark:border-zinc-800/60"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold text-foreground">{phase.phaseName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-mono">{phase.duration}</span>
                    <Badge
                      className={cn(
                        "font-mono font-extrabold text-[10px] px-1.5 py-0",
                        phase.score >= 7.0 ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"
                      )}
                    >
                      {phase.score}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{phase.comment}</p>
                <div className="mt-2 pt-2 border-t border-dashed border-zinc-200/50 dark:border-zinc-700/50 flex items-start gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-[11px] text-foreground leading-snug">
                    <span className="font-semibold text-primary">Đề xuất lộ trình: </span>
                    {phase.recommendation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* General Recommendation Panel */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 relative overflow-hidden">
          <div className="absolute right-2 top-2 opacity-5">
            <Sparkles className="h-20 w-20 text-primary" />
          </div>
          <h4 className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            Nhận xét & đề xuất học bạ tổng quan
          </h4>
          <p className="text-xs text-foreground leading-relaxed">
            Học viên có nền tảng tư duy logic tốt và khả năng phản xạ nhanh nhạy. Kỹ năng nghe nói đã có sự tiến bộ vượt bậc qua từng giai đoạn học. Đề xuất học bạ tiếp theo tập trung đẩy mạnh nâng cấp từ vựng học thuật nâng cao và đa dạng hoá các câu ghép phức trong các chủ đề Writing & Speaking chuyên sâu để chinh phục mục tiêu Band điểm mong muốn.
          </p>
        </div>
      </div>
    </div>
  )
}
