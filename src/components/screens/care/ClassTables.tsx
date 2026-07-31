'use client'

import { toast } from 'sonner'
import { Star, MessageSquare, ExternalLink, SquarePen } from 'lucide-react'
import { type SessionHistory } from './StudentCareReportTab'

function getDayOfWeek(dateStr: string): string {
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return days[d.getDay()]
}

export function AttendanceStatusBadge({ 
  status, 
  onOpenLeave 
}: { 
  status: SessionHistory['attendance']
  onOpenLeave?: () => void 
}) {
  if (status === 'absent') {
    return (
      <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 text-[10px] font-normal text-rose-600 border border-rose-200/50 select-none">
        Vắng
      </span>
    )
  }
  if (status === 'excused') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="inline-flex items-center rounded-md bg-rose-50 dark:bg-rose-950/20 px-2.5 py-0.5 text-[10px] font-normal text-rose-600 border border-rose-200/50 select-none">
          Vắng
        </span>
        {onOpenLeave && (
          <button
            type="button"
            onClick={onOpenLeave}
            className="text-[9px] font-normal text-amber-600 hover:text-amber-700 hover:underline cursor-pointer bg-transparent border-none p-0 inline-flex items-center gap-0.5 mt-0.5 shrink-0"
          >
            <span>Nghỉ phép</span>
            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
          </button>
        )}
      </div>
    )
  }
  if (status === 'late') {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-[10px] font-normal text-amber-600 border border-amber-200/50 select-none">
        Đến muộn
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-0.5 text-[10px] font-normal text-emerald-600 border border-emerald-200/50 select-none">
      ✓ Đã đến
    </span>
  )
}

export function RenderEnglishSkillScore({ score, skill, topic }: { score?: string; skill: string; topic: string }) {
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

interface ClassTablesProps {
  regularSessions: SessionHistory[]
  testSessions: SessionHistory[]
  isEnglish: boolean
  onOpenLeave?: (date: string) => void
}

export function ClassTables({ regularSessions, testSessions, isEnglish, onOpenLeave }: ClassTablesProps) {

  return (
    <div className="space-y-6">



      {/* 2. Lịch sử buổi học thường */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider px-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Lịch sử buổi học
        </h3>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-[11px] border-collapse bg-transparent table-fixed">
            <thead>
              <tr className="border-b border-border/85 text-muted-foreground">
                <th className="py-2.5 px-3 text-left font-bold w-[40px]">#</th>
                <th className="py-2.5 px-3 text-left font-bold w-[280px]">Bài học & Thời gian</th>
                <th className="py-2.5 px-3 text-center font-bold w-[140px]">Điểm danh</th>
                <th className="py-2.5 px-3 text-center font-bold w-[140px]">BTVN</th>
                <th className="py-2.5 px-3 text-left font-bold w-[320px]">Đánh giá & Nhận xét</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {regularSessions.map((s) => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-muted-foreground font-normal w-[40px]">{s.sessionNumber}</td>

                  <td className="py-2.5 px-3 w-[280px]">
                    <span className="font-normal text-foreground">{s.topic}</span>
                    <div className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                      {getDayOfWeek(s.date)}, {s.date}
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-center w-[140px]">
                    <AttendanceStatusBadge status={s.attendance} onOpenLeave={onOpenLeave ? () => onOpenLeave(s.date) : undefined} />
                  </td>

                  <td className="py-2.5 px-3 text-center w-[140px]">
                    {s.homework === 'submitted' || s.homework === 'late' ? (
                      <button
                        type="button"
                        onClick={() => toast.success(`Đang mở bài làm BT-${String(s.sessionNumber).padStart(2, '0')} của học viên`)}
                        className="text-primary font-normal hover:underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 text-xs"
                      >
                        BT-{String(s.sessionNumber).padStart(2, '0')} <ExternalLink className="h-3 w-3" />
                      </button>
                    ) : (
                      <span className="text-red-500 font-normal dark:text-red-400">Chưa nộp</span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 w-[320px]">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="font-normal text-foreground">{s.rating}</span>
                        <span className="text-[10px] text-muted-foreground">/5</span>
                      </div>
                      {s.comment ? (
                        <p className="text-[10px] text-muted-foreground leading-snug italic font-normal">
                          &ldquo;{s.comment}&rdquo;
                        </p>
                      ) : (
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-655 italic">
                          Chưa có nhận xét
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
