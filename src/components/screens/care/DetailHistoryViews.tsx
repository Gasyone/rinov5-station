'use client'

import { 
  Star,
  CheckCircle2, 
  Clock, 
  Minus, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ExternalLink, 
  Award, 
  Calendar,
  BookOpen,
  History
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getStatusBadgeClass } from '@/lib/statusColors'
import { toast } from 'sonner'

interface DetailHistoryViewsProps {
  type: 'evaluation' | 'attendance' | 'homework' | 'score' | 'level' | 'sessions' | 'class_history' | 'package_history'
  studentId: string
  studentName: string
  subject: string
  level?: string
  rating?: string
  homeworkCompletion?: number
}

function stableHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export function DetailHistoryViews({
  type,
  studentId,
  subject
}: DetailHistoryViewsProps) {
  return (
    <div className="space-y-4">
      {type === 'evaluation' && (
        <div className="space-y-4">
          {[
            { session: 6, date: '06/07/2026', rating: 4.5, comment: 'Tiến bộ rõ rệt trong tuần qua, hăng hái đóng góp ý kiến.' },
            { session: 4, date: '02/07/2026', rating: 4.0, comment: 'Tương tác tốt với các bạn cùng lớp, hoàn thành nhiệm vụ nhóm.' },
            { session: 2, date: '28/06/2026', rating: 3.5, comment: 'Còn nói chuyện riêng, cần nhắc nhở tập trung hơn.' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 relative pb-1 text-left">
              {idx !== 2 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
              )}
              <div className="h-5.5 w-5.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Buổi {item.session}</span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">★ {item.rating}</span>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/30 dark:bg-muted/10 p-2 rounded-lg border border-border/40">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'attendance' && (
        <div className="space-y-4">
          {[
            { session: 6, date: '06/07/2026', status: 'present', label: 'Đi học đúng giờ', time: '18:00' },
            { session: 5, date: '02/07/2026', status: 'late', label: 'Đi muộn 15 phút', time: '18:15' },
            { session: 4, date: '28/06/2026', status: 'present', label: 'Đi học đúng giờ', time: '18:02' },
            { session: 3, date: '24/06/2026', status: 'excused', label: 'Nghỉ học có phép (Mẹ báo bé mệt)', time: '—' },
            { session: 2, date: '20/06/2026', status: 'absent', label: 'Vắng mặt không phép (CS đã liên hệ hỏi thăm)', time: '—' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 relative pb-1 text-left">
              {idx !== 4 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
              )}
              <div className={cn(
                "h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                item.status === 'present' && "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900",
                item.status === 'late' && "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-emerald-900",
                item.status === 'excused' && "bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700",
                item.status === 'absent' && "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900"
              )}>
                {item.status === 'present' && <CheckCircle2 className="h-3 w-3" />}
                {item.status === 'late' && <Clock className="h-3 w-3" />}
                {item.status === 'excused' && <Minus className="h-3 w-3" />}
                {item.status === 'absent' && <XCircle className="h-3 w-3" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">Buổi {item.session}</span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                  <Badge variant="outline" className={cn(
                    "text-[9px] px-1 py-0 h-4 font-semibold shrink-0 uppercase",
                    item.status === 'present' && getStatusBadgeClass('present'),
                    item.status === 'late' && getStatusBadgeClass('late'),
                    item.status === 'excused' && getStatusBadgeClass('excused'),
                    item.status === 'absent' && getStatusBadgeClass('absent')
                  )}>
                    {item.status === 'present' ? 'Đi học' : item.status === 'late' ? 'Đi muộn' : item.status === 'excused' ? 'Nghỉ có phép' : 'Nghỉ không phép'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/20 dark:bg-muted/10 px-2 py-1.5 rounded-lg border border-border/30">
                  {item.label} {item.time !== '—' && `• Giờ vào lớp: ${item.time}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'homework' && (
        <div className="space-y-4">
          {[
            { session: 6, date: '06/07/2026', completion: 100, score: '10/10' },
            { session: 5, date: '02/07/2026', completion: 70, score: '7/10' },
            { session: 4, date: '28/06/2026', completion: 50, score: '5/10' },
            { session: 3, date: '24/06/2026', completion: 0, score: '0/10' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 relative pb-1 text-left">
              {idx !== 3 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
              )}
              <div className={cn(
                "h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                item.completion >= 80 && "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900",
                item.completion > 0 && item.completion < 80 && "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-emerald-900",
                item.completion === 0 && "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900"
              )}>
                {item.completion >= 80 && <CheckCircle2 className="h-3 w-3" />}
                {item.completion > 0 && item.completion < 80 && <AlertTriangle className="h-3 w-3" />}
                {item.completion === 0 && <XCircle className="h-3 w-3" />}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Bài tập buổi {item.session}</span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.completion > 0 ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info(`Đang tải bài tập buổi ${item.session}...`);
                      }}
                      className="text-[10px] text-primary hover:underline font-bold flex items-center gap-0.5"
                    >
                      <ExternalLink className="h-2.5 w-2.5 inline shrink-0" />
                      BT{item.session} - {item.score} ({item.completion}%)
                    </a>
                  ) : (
                    <span className="text-[10px] text-rose-600 font-bold">Chưa nộp</span>
                  )}
                </div>
                
                {/* Uploader info */}
                <div className="flex items-center gap-1.5 mt-1.5 p-1 px-1.5 bg-muted/40 dark:bg-zinc-800/40 rounded border border-border/40 w-fit">
                  <div className="h-4.5 w-4.5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    LH
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    GV. Lâm Tuấn Huy &bull; Đính kèm: <span className="font-mono text-foreground/85 font-medium">{item.date}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'score' && (
        <div className="space-y-4">
          <div className="p-3 bg-muted/20 dark:bg-muted/10 rounded-xl border border-border/40 space-y-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Biểu đồ xu hướng điểm số</span>
            <div className="h-20 flex items-end justify-between px-4 pt-4 border-b border-border">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-foreground">4.0</span>
                <div className="w-4 bg-rose-500 rounded-t h-8" />
                <span className="text-[9px] text-muted-foreground">Đầu vào</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-foreground">6.0</span>
                <div className="w-4 bg-amber-500 rounded-t h-12" />
                <span className="text-[9px] text-muted-foreground">Lần 1</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-foreground">8.5</span>
                <div className="w-4 bg-emerald-500 rounded-t h-16" />
                <span className="text-[9px] text-muted-foreground">Lần 2</span>
              </div>
            </div>
          </div>

          {[
            { title: 'Kiểm tra Định kỳ Lần 2', date: '02/07/2026', score: 8.5, max: 10, diff: 2.5, trend: 'up' },
            { title: 'Kiểm tra Định kỳ Lần 1', date: '18/06/2026', score: 6.0, max: 10, diff: 2.0, trend: 'up' },
            { title: 'Kiểm tra Đầu vào', date: '01/05/2026', score: 4.0, max: 10, diff: 0, trend: 'stable' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 relative pb-1 text-left">
              {idx !== 2 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
              )}
              <div className={cn(
                "h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                item.score >= 8.0 && "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900",
                item.score >= 5.0 && item.score < 8.0 && "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-emerald-900",
                item.score < 5.0 && "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900"
              )}>
                {item.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                {item.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                {item.trend === 'stable' && <Minus className="h-3 w-3" />}
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{item.title}</span>
                  <span className="text-xs font-bold text-foreground">{item.score}/{item.max}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Ngày làm bài: {item.date}</span>
                  {item.diff > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+{item.diff} điểm</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'level' && (
        <div className="space-y-4">
          {[
            { level: 'B1 (Intermediate)', date: 'Tháng 7/2026', label: 'Xu hướng: Tiến bộ rõ rệt', status: 'active' },
            { level: 'A2+ (High Elementary)', date: 'Tháng 6/2026', label: 'Xu hướng: Ổn định tích lũy', status: 'past' },
            { level: 'A2 (Elementary)', date: 'Tháng 5/2026', label: 'Xu hướng: Điểm kiểm tra đầu vào thấp', status: 'past' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 relative pb-1 text-left">
              {idx !== 2 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
              )}
              <div className={cn(
                "h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                item.status === 'active' ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900" : "bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700"
              )}>
                <Award className="h-3 w-3" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className={cn("text-xs font-bold", item.status === 'active' ? "text-rose-700 dark:text-rose-400" : "text-foreground")}>
                    {item.level}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'class_history' && (
        <div className="space-y-4">
          {(() => {
            const hash = stableHash(studentId);
            const isMath = subject === 'Toán tư duy';
            const currentClass = isMath ? 'LD_TOAN_00007' : 'LD_TA_00008';
            
            const timeline = hash % 2 === 0 ? [
              { date: '10/07/2026', status: 'processing', desc: `Đang xử lý chuyển lớp từ lớp ${currentClass} sang lớp ${isMath ? 'LD_TOAN_00012' : 'LD_TA_00012'}.`, reason: 'Lý do: Trùng lịch học thêm ở trường.', staff: 'AnhNT33 (CSM)' },
              { date: '15/05/2026', status: 'completed', desc: `Đã ghép lớp thành công vào lớp ${currentClass}.`, reason: 'Lịch học: T3/T5 18:00 - 19:30.', staff: 'MinhLH (GV)' }
            ] : [
              { date: '08/07/2026', status: 'completed', desc: `Đã chuyển lớp thành công từ lớp ${isMath ? 'LD_TOAN_00001' : 'LD_TA_00001'} sang lớp ${currentClass}.`, reason: 'Lý do: Phụ huynh muốn đổi ca tối muộn hơn.', staff: 'AnhNT33 (CSM)' },
              { date: '01/04/2026', status: 'completed', desc: `Đã ghép lớp thành công vào lớp ${isMath ? 'LD_TOAN_00001' : 'LD_TA_00001'}.`, reason: 'Lịch học: T2/T6 19:30 - 21:00.', staff: 'MinhLH (GV)' }
            ];

            return timeline.map((item, idx) => (
              <div key={idx} className="flex gap-3 relative pb-1 text-left text-xs">
                {idx !== timeline.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div className={cn(
                  "h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                  item.status === 'processing' ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-amber-900" : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900"
                )}>
                  {item.status === 'processing' ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-foreground leading-snug text-[11px] font-medium">{item.desc}</p>
                  <p className="text-muted-foreground text-[10px] italic">{item.reason}</p>
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground/80 mt-1 font-medium">
                    <span>Người thực hiện: {item.staff}</span>
                    <span className="text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {type === 'sessions' && (
        <div className="space-y-4">
          {[
            { session: 8, date: '16/07/2026', type: 'upcoming', topic: 'Hàm số và đồ thị bậc nhất' },
            { session: 7, date: '12/07/2026', type: 'upcoming', topic: 'Giải bài toán bằng cách lập phương trình' },
            { session: 6, date: '06/07/2026', type: 'past', status: 'present', label: 'Đi học đúng giờ • BTVN: 100%' },
            { session: 5, date: '02/07/2026', type: 'past', status: 'late', label: 'Đi muộn 15 phút • BTVN: 70%' },
            { session: 4, date: '28/06/2026', type: 'past', status: 'present', label: 'Đi học đúng giờ • BTVN: 50%' },
            { session: 3, date: '24/06/2026', type: 'past', status: 'excused', label: 'Nghỉ học có phép • BTVN: 0%' },
            { session: 2, date: '20/06/2026', type: 'past', status: 'absent', label: 'Vắng không phép • CS đã hỏi thăm' },
            { session: 1, date: '16/06/2026', type: 'past', status: 'present', label: 'Đi học đúng giờ • BTVN: 80%' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 relative pb-1 text-left">
              {idx !== 7 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
              )}
              <div className={cn(
                "h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                item.type === 'upcoming' && "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900",
                item.type === 'past' && item.status === 'present' && "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900",
                item.type === 'past' && item.status === 'late' && "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/20 dark:border-emerald-900",
                item.type === 'past' && item.status === 'excused' && "bg-zinc-100 border-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700",
                item.type === 'past' && item.status === 'absent' && "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900"
              )}>
                {item.type === 'upcoming' && <Calendar className="h-3 w-3" />}
                {item.type === 'past' && item.status === 'present' && <CheckCircle2 className="h-3 w-3" />}
                {item.type === 'past' && item.status === 'late' && <Clock className="h-3 w-3" />}
                {item.type === 'past' && item.status === 'excused' && <Minus className="h-3 w-3" />}
                {item.type === 'past' && item.status === 'absent' && <XCircle className="h-3 w-3" />}
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Buổi {item.session}</span>
                  <span className="text-[10px] text-muted-foreground">{item.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.type === 'upcoming' ? (
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Chủ đề: {item.topic}</span>
                  ) : (
                    item.label
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'package_history' && (
        <div className="space-y-4">
          {(() => {
            const hash = stableHash(studentId);
            const timeline = hash % 2 === 0 ? [
              { date: '05/07/2026', status: 'completed', desc: `Đã chuyển đổi gói sản phẩm từ gói "Tiếng Anh Standard 6 tháng" sang gói "Tiếng Anh Level 4 (1 năm)".`, reason: 'Lý do: Phụ huynh đăng ký lộ trình dài hạn để hưởng ưu đãi.', staff: 'AnhNT33 (CSM)' },
              { date: '10/01/2026', status: 'completed', desc: `Đã kích hoạt thành công gói "Tiếng Anh Standard 6 tháng".`, reason: 'Lịch học lớp mới.', staff: 'BaoNgoc (Sale)' }
            ] : [
              { date: '28/06/2026', status: 'completed', desc: `Đã chuyển đổi gói sản phẩm từ gói "Toán Einstein 0 (6 tháng)" sang gói "Toán Einstein 0 (1 năm)".`, reason: 'Lý do: Nâng cấp gói sau khi kết thúc 3 tháng đầu kết quả tốt.', staff: 'AnhNT33 (CSM)' },
              { date: '15/12/2025', status: 'completed', desc: `Đã kích hoạt thành công gói "Toán Einstein 0 (6 tháng)".`, reason: 'Khai giảng lớp mới.', staff: 'BaoNgoc (Sale)' }
            ];

            return timeline.map((item, idx) => (
              <div key={idx} className="flex gap-3 relative pb-1 text-left text-xs">
                {idx !== timeline.length - 1 && (
                  <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />
                )}
                <div className="h-5.5 w-5.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-foreground leading-snug text-[11px] font-medium">{item.desc}</p>
                  <p className="text-muted-foreground text-[10px] italic">
                    {item.reason.startsWith('Lý do:') ? item.reason : `Lý do: ${item.reason}`}
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground/80 mt-1 font-medium">
                    <span>Người thực hiện: {item.staff}</span>
                    <span className="text-muted-foreground">{item.date}</span>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  )
}

interface DetailHeaderViewProps {
  type: string
  rating?: string | number
  votes?: number
  generalComment?: string
  recentAttStatus?: string
  attRate?: number
  attendanceRatio?: string
  lateSessions?: number
  avgScore?: string | number
  highScore?: string | number
  lowScore?: string | number
  missedTestsCount?: number
  homeworkCompletion?: number
  subject?: string
  level?: string
  studentName?: string
  studentId?: string
  curriculumName?: string
  dialogTitle?: string
}

export function DetailHeaderView({
  type,
  rating,
  votes,
  generalComment,
  recentAttStatus,
  attRate,
  attendanceRatio,
  lateSessions,
  avgScore,
  highScore,
  lowScore,
  missedTestsCount,
  homeworkCompletion,
  subject,
  level,
  studentName,
  studentId,
  curriculumName,
  dialogTitle
}: DetailHeaderViewProps) {
  if (type === 'care') return null

  return (
    <div className="pb-2 border-b border-border/60 mb-3 text-left">
      {type === 'evaluation' ? (
        <>
          <h4 className="text-xs font-bold flex items-center gap-1.5 text-amber-500 fill-amber-500">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span>★ {rating}</span>
            <span className="text-muted-foreground font-normal text-[10px]">({votes} lượt đánh giá)</span>
          </h4>
          <p className="text-[11px] text-muted-foreground mt-1 font-medium italic">
            &ldquo;{generalComment}&rdquo;
          </p>
        </>
      ) : type === 'attendance' ? (
        <>
          <h4 className="text-xs font-bold flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
            <Clock className="h-4 w-4 text-sky-500" />
            <span>{recentAttStatus} &bull; {attRate}%</span>
          </h4>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">
            Đã học {attendanceRatio} buổi &bull; Số buổi đi muộn: {lateSessions || 0} buổi
          </p>
        </>
      ) : type === 'score' ? (
        <>
          <h4 className="text-xs font-bold flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
            <TrendingUp className="h-4 w-4 text-violet-500" />
            <span>Gần nhất: {rating} &mdash; Trung bình: {avgScore}</span>
          </h4>
          <p className="text-[10px] text-muted-foreground mt-1 font-medium">
            Cao nhất: {highScore} &bull; Thấp nhất: {lowScore} &bull; Số bài thiếu: {missedTestsCount || 0}
          </p>
        </>
      ) : type === 'homework' ? (
        <>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-500 shrink-0" />
            {(homeworkCompletion ?? 100) >= 80 ? (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Đang mở file bài tập về nhà...");
                }}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3 inline shrink-0" />
                BT1 - {homeworkCompletion ?? 100}% (Đạt)
              </a>
            ) : (
              <h4 className="text-xs font-bold text-rose-600">Chưa nộp</h4>
            )}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1.5 space-y-0.5 text-left">
            <p className="font-semibold text-foreground">
              {subject === 'Toán tư duy' ? 'Chủ đề: Hàm số bậc nhất' : 'Chủ đề: Phonics lab - Nguyên âm ngắn'}
            </p>
            <p>
              Lịch học: 09/07/2026 (17:45 - 19:15)
            </p>
          </div>
        </>
      ) : type === 'level' ? (
        <>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-rose-500 shrink-0" />
            <h4 className="text-xs font-bold text-foreground">
              Năng lực & Xu hướng: {level} &mdash; <span className={cn(
                rating === 'Tiến bộ' ? 'text-emerald-600 dark:text-emerald-400' : rating === 'Cần cải thiện' ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500'
              )}>{rating}</span>
            </h4>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5 leading-relaxed font-medium bg-muted/40 p-2 rounded border border-border/40 text-left">
            Ghi nhận gần nhất: <span className="text-foreground font-normal">
              {rating === 'Tiến bộ' 
                ? 'Học viên có ý thức tự giác học tập tốt, hoàn thành bài tập về nhà đầy đủ và tiếp thu bài giảng nhanh.' 
                : rating === 'Cần cải thiện' 
                ? 'Kết quả kiểm tra gần nhất giảm nhẹ. Phụ huynh cần đôn đốc con hoàn thành BTVN trước khi đến lớp.' 
                : 'Học viên duy trì phong độ ổn định, hoàn thành tốt các nhiệm vụ học tập trên lớp.'}
            </span>
          </p>
        </>
      ) : (
        <>
          <h4 className="text-xs font-bold flex items-center gap-2 text-foreground">
            {type === 'sessions' && <Calendar className="h-4 w-4 text-blue-500" />}
            {type === 'sessions' ? curriculumName : dialogTitle}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-1 text-left">
            {type === 'sessions' ? (
              <>
                Môn học: <span className="font-semibold text-foreground">{subject}</span> &bull; Trình độ: <span className="font-semibold text-foreground">{level || '—'}</span>
              </>
            ) : (
              <>
                Học viên: <span className="font-bold text-foreground">{studentName}</span> ({studentId}) &bull; {subject}
              </>
            )}
          </p>
        </>
      )}
    </div>
  )
}
