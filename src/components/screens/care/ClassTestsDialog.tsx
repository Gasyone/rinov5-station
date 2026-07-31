'use client'

import React, { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { MessageSquare, SquarePen, Star } from 'lucide-react'
import { type SessionHistory } from './StudentCareReportTab'

interface ClassTestsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testSessions: SessionHistory[]
  isEnglish: boolean
  className: string
}

function getDayOfWeek(dateStr: string): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return days[d.getDay()]
}

function RenderEnglishSkillScore({ score, skill, topic }: { score?: string; skill: string; topic: string }) {
  if (!score) return <span className="text-zinc-300 dark:text-zinc-600">—</span>

  if (score === 'NOT START') {
    return <span className="text-zinc-400 dark:text-zinc-600 font-normal uppercase text-[9.5px]">NOT START</span>
  }

  if (score === 'SCORE') {
    return (
      <button
        type="button"
        onClick={() => toast.info(`Nhập điểm cho kỹ năng ${skill} bài thi: ${topic}`)}
        className="px-2 py-0.5 rounded bg-primary text-primary-foreground font-semibold text-[9.5px] cursor-pointer shadow-2xs hover:bg-primary/95 hover:shadow-sm"
      >
        SCORE
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => toast.info(`Đang mở báo cáo chi tiết kỹ năng ${skill} của bài thi ${topic} (${score})`)}
      className="text-primary font-normal hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
    >
      {score}
    </button>
  )
}

export function ClassTestsDialog({
  open,
  onOpenChange,
  testSessions,
  isEnglish,
  className
}: ClassTestsDialogProps) {
  // Statistics
  const stats = useMemo(() => {
    let completed = 0
    const total = testSessions.length
    let sumScore = 0

    testSessions.forEach((s) => {
      if (isEnglish) {
        // For English, check if overall is a valid score (not 'NOT START', 'SCORE', '—')
        if (s.overall && s.overall !== 'NOT START' && s.overall !== 'SCORE' && s.overall !== '—') {
          completed++
          const val = parseFloat(s.overall.split('/')[0])
          if (!isNaN(val)) {
            sumScore += val
          }
        }
      } else {
        // For Math, check if score is not null
        if (s.score !== null && s.score !== undefined) {
          completed++
          sumScore += s.score
        }
      }
    })

    const avg = completed > 0 ? (sumScore / completed).toFixed(1) : '—'
    return { completed, total, avg }
  }, [testSessions, isEnglish])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col max-h-[85vh] gap-0 overflow-hidden p-0 sm:max-w-[90vw] lg:max-w-[960px] select-none text-left">
        <DialogHeader className="p-4 border-b border-border/50 shrink-0 flex flex-row items-center justify-between gap-4 pr-12">
          <div className="min-w-0">
            <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              Bảng điểm bài kiểm tra định kỳ
            </DialogTitle>
            <p className="text-[10px] text-muted-foreground mt-1 font-semibold leading-none">
              Lớp học: <span className="text-zinc-800 dark:text-zinc-200">{className}</span>
            </p>
          </div>

          {/* Right Header stats */}
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30 min-w-[64px]">
              <span className="text-[7.5px] text-emerald-600/80 dark:text-emerald-400/80 uppercase font-bold tracking-wider leading-none">Điểm TB</span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 leading-none">{stats.avg}</span>
            </div>
            <div className="flex flex-col items-center px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-200/50 dark:border-violet-900/30 min-w-[64px]">
              <span className="text-[7.5px] text-violet-600/80 dark:text-violet-400/80 uppercase font-bold tracking-wider leading-none">Hoàn thành</span>
              <span className="text-[11px] font-bold text-violet-700 dark:text-violet-400 mt-0.5 leading-none">{stats.completed}/{stats.total}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {testSessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground italic">
              Không có dữ liệu bài kiểm tra nào.
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-border/80 rounded-xl bg-muted/5 dark:bg-zinc-950/20 shadow-3xs">
              {isEnglish ? (
                /* English test table layout without Attendance */
                <table className="w-full text-[11px] border-collapse bg-transparent table-fixed">
                  <thead>
                    <tr className="border-b border-border/85 text-muted-foreground bg-muted/20 dark:bg-zinc-900/40">
                      <th className="py-2.5 px-3 text-left font-bold w-[40px]">#</th>
                      <th className="py-2.5 px-3 text-left font-bold w-[260px]">Bài học & Thời gian</th>
                      <th className="py-2.5 px-3 text-center font-bold w-[80px]">Listening</th>
                      <th className="py-2.5 px-3 text-center font-bold w-[80px]">Reading</th>
                      <th className="py-2.5 px-3 text-center font-bold w-[80px]">Writing</th>
                      <th className="py-2.5 px-3 text-center font-bold w-[90px]">Speaking</th>
                      <th className="py-2.5 px-3 text-center font-bold w-[80px]">Overall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {testSessions.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors bg-transparent">
                        <td className="py-2.5 px-3 font-mono text-muted-foreground font-normal w-[40px]">{s.sessionNumber}</td>

                        <td className="py-2.5 px-3 w-[260px]">
                          <span className="font-semibold text-amber-700 dark:text-amber-500">{s.topic}</span>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            {getDayOfWeek(s.date)}, {s.date}
                          </div>
                        </td>

                        {/* Listening score */}
                        <td className="py-2.5 px-3 text-center w-[80px]">
                          <RenderEnglishSkillScore score={s.listening} skill="Listening" topic={s.topic} />
                        </td>

                        {/* Reading score */}
                        <td className="py-2.5 px-3 text-center w-[80px]">
                          <RenderEnglishSkillScore score={s.reading} skill="Reading" topic={s.topic} />
                        </td>

                        {/* Writing score */}
                        <td className="py-2.5 px-3 text-center w-[80px]">
                          <RenderEnglishSkillScore score={s.writing} skill="Writing" topic={s.topic} />
                        </td>

                        {/* Speaking score + edit note icon */}
                        <td className="py-2.5 px-3 text-center w-[90px]">
                          <div className="flex items-center justify-center gap-1">
                            <RenderEnglishSkillScore score={s.speaking} skill="Speaking" topic={s.topic} />
                            {s.speaking && s.speaking !== 'NOT START' && s.speaking !== 'SCORE' && (
                              <SquarePen className="h-3 w-3 text-primary/75 shrink-0" />
                            )}
                          </div>
                        </td>

                        {/* Overall score */}
                        <td className="py-2.5 px-3 text-center font-bold text-foreground w-[80px]">
                          {s.overall === 'NOT START' || s.overall === '—' ? (
                            <span className="text-zinc-400 dark:text-zinc-655 font-normal">{s.overall}</span>
                          ) : (
                            s.overall
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Math test table layout without Attendance */
                <table className="w-full text-[11px] border-collapse bg-transparent table-fixed">
                  <thead>
                    <tr className="border-b border-border/85 text-muted-foreground bg-muted/20 dark:bg-zinc-900/40">
                      <th className="py-2.5 px-3 text-left font-bold w-[40px]">#</th>
                      <th className="py-2.5 px-3 text-left font-bold w-[260px]">Bài học & Thời gian</th>
                      <th className="py-2.5 px-3 text-center font-bold w-[120px]">KTĐK</th>
                      <th className="py-2.5 px-3 text-left font-bold w-[380px]">Nhận xét</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {testSessions.map((s) => (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors bg-transparent">
                        <td className="py-2.5 px-3 font-mono text-muted-foreground font-normal w-[40px]">{s.sessionNumber}</td>

                        <td className="py-2.5 px-3 w-[260px]">
                          <span className="font-semibold text-amber-700 dark:text-amber-500">{s.topic}</span>
                          <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                            {getDayOfWeek(s.date)}, {s.date}
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center w-[120px]">
                          {s.score !== null ? (
                            <button
                              type="button"
                              onClick={() => toast.info(`Đang mở báo cáo bài kiểm tra: ${s.topic} (${s.score}/10)`)}
                              className="text-primary font-semibold hover:underline cursor-pointer bg-transparent border-none p-0 text-xs"
                            >
                              {s.score.toFixed(1)}/10
                            </button>
                          ) : (
                            <span className="text-zinc-300 dark:text-zinc-655">—</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 w-[380px]">
                          <div className="flex flex-col gap-0.5 text-left">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">
                                NHẬN XÉT BÀI KIỂM TRA
                              </span>
                              <MessageSquare className="h-3 w-3 text-zinc-350 dark:text-zinc-655 shrink-0" />
                            </div>
                            {s.comment ? (
                              <p className="text-[10px] text-muted-foreground leading-snug italic font-normal">
                                {s.comment}
                              </p>
                            ) : (
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 italic">
                                Chưa nhận xét
                              </p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
