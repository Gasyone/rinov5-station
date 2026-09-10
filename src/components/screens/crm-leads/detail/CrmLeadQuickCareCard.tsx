'use client'

import { useState } from 'react'
import { Phone, MessageSquare, User, Calendar, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { CareInteraction } from './crmLeadDetailTypes'

interface CrmLeadQuickCareCardProps {
  cycleId: string
  staffName: string
  onSaveInteraction: (interaction: CareInteraction) => void
}

type ChannelType = 'call' | 'zalo' | 'direct'

const OUTCOME_OPTIONS = [
  { value: 'interested', label: '📞 Nghe máy - Rất quan tâm' },
  { value: 'callback', label: '⏰ Bận - Hẹn gọi lại sau' },
  { value: 'booked_test', label: '🎯 Đã chốt hẹn test năng lực' },
  { value: 'no_answer', label: '📵 Không nghe máy (KNM)' },
  { value: 'wrong_number', label: '⚠️ Sai số / Không liên lạc được' },
  { value: 'rejected', label: '❌ Từ chối / Không có nhu cầu' },
]

export function CrmLeadQuickCareCard({
  cycleId,
  staffName,
  onSaveInteraction,
}: CrmLeadQuickCareCardProps) {
  const [channel, setChannel] = useState<ChannelType>('call')
  const [outcome, setOutcome] = useState<string>('interested')
  const [note, setNote] = useState('')
  const [nextAppointment, setNextAppointment] = useState('')

  const handleSave = () => {
    if (!note.trim()) {
      toast.error('Vui lòng nhập tóm tắt nội dung trao đổi trước khi lưu!')
      return
    }

    const outcomeObj = OUTCOME_OPTIONS.find((o) => o.value === outcome)

    const now = new Date()
    const d = String(now.getDate()).padStart(2, '0')
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const y = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, '0')
    const mins = String(now.getMinutes()).padStart(2, '0')
    const timestampStr = `${d}/${m}/${y} ${hours}:${mins}`

    const newInteraction: CareInteraction = {
      id: `care-${Date.now()}`,
      cycleId,
      timestamp: timestampStr,
      staffName: staffName || 'Tư vấn viên',
      channel,
      outcome: outcome as CareInteraction['outcome'],
      outcomeLabel: outcomeObj?.label.replace(/^[^\s]+\s*/, '') || 'Tương tác',
      note: note.trim(),
      nextAppointment: nextAppointment.trim() || undefined,
    }

    onSaveInteraction(newInteraction)
    setNote('')
    setNextAppointment('')
    toast.success('Đã lưu biên bản chăm sóc vào Dòng thời gian!')
  }

  return (
    <div className="bg-muted/30 border border-border/80 rounded-xl p-3.5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2">
        <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Ghi nhận tương tác nhanh (Quick Care Logger)</span>
        </span>

        {/* Kênh tương tác */}
        <div className="flex items-center gap-1 bg-background p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setChannel('call')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer',
              channel === 'call'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Phone className="h-3 w-3" />
            <span>Gọi điện</span>
          </button>
          <button
            type="button"
            onClick={() => setChannel('zalo')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer',
              channel === 'zalo'
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <MessageSquare className="h-3 w-3" />
            <span>Zalo</span>
          </button>
          <button
            type="button"
            onClick={() => setChannel('direct')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer',
              channel === 'direct'
                ? 'bg-violet-600 text-white font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <User className="h-3 w-3" />
            <span>Trực tiếp</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Kết quả tương tác */}
        <div className="sm:col-span-1 space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground block">
            Kết quả cuộc trao đổi:
          </label>
          <Select value={outcome} onValueChange={setOutcome}>
            <SelectTrigger className="h-8.5 text-xs w-full bg-background">
              <SelectValue placeholder="Chọn kết quả" />
            </SelectTrigger>
            <SelectContent>
              {OUTCOME_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lịch hẹn gọi lại nếu có */}
        <div className="sm:col-span-2 space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground block">
            Lịch hẹn tương tác tiếp theo (nếu có):
          </label>
          <div className="relative">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-2.5 pointer-events-none" />
            <Input
              type="text"
              placeholder="VD: 15/09/2026 18:30 (Gọi sau giờ làm)"
              className="h-8.5 text-xs pl-8 bg-background"
              value={nextAppointment}
              onChange={(e) => setNextAppointment(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Nội dung ghi chú */}
      <div className="space-y-1.5">
        <Textarea
          placeholder="Nhập chi tiết nội dung trao đổi với phụ huynh, câu hỏi thắc mắc, nguyện vọng của bé..."
          className="text-xs min-h-[60px] resize-none bg-background"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* Nút lưu */}
      <div className="flex items-center justify-end">
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          className="h-8 text-xs gap-1.5 cursor-pointer font-semibold"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Lưu biên bản chăm sóc</span>
        </Button>
      </div>
    </div>
  )
}
