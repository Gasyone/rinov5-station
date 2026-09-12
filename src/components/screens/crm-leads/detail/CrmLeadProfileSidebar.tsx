'use client'

import { useState } from 'react'
import {
  Baby,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Copy,
  Check,
  PhoneCall,
  Sparkles,
  Repeat,
  Clock,
  UserCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { Lead } from '@/mocks/crmLeads'
import { SOURCE_LABEL_MAP } from '../crmLeadsTypes'
import { SalesCycle } from './crmLeadDetailTypes'

interface CrmLeadProfileSidebarProps {
  lead: Lead
  activeCycleId: string
  onCycleChange: (cycleId: string) => void
}

export function CrmLeadProfileSidebar({
  lead,
  activeCycleId,
  onCycleChange,
}: CrmLeadProfileSidebarProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(lead.phone)
    setCopied(true)
    toast.success(`Đã sao chép số điện thoại: ${lead.phone}`)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCall = () => {
    toast.info(`Đang kết nối cuộc gọi đến ${lead.parentName} (${lead.phone})...`)
    window.open(`tel:${lead.phone}`, '_self')
  }

  const birthYear = lead.birthYear ?? 2026 - lead.studentAge
  const cycles = lead.salesCycles || [
    {
      cycleId: 'cycle-default',
      cycleNumber: 1,
      title: 'Chu kỳ 1 (Hiện tại)',
      status: 'active',
      startDate: lead.createdAt || '10/08/2026',
      assignedSales: lead.assignedTo || 'Chưa phân bổ',
    } as SalesCycle,
  ]

  const activeCycle = cycles.find((c) => c.cycleId === activeCycleId) || cycles[0]

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Bộ chuyển đổi Chu kỳ Bán (Sales Cycle Selector) */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <Repeat className="h-3.5 w-3.5 text-primary" />
            <span>Chu kỳ bán hàng (Sales Cycle)</span>
          </span>
          {cycles.length > 1 && (
            <Badge variant="outline" className="text-[10px] bg-background">
              {cycles.length} chu kỳ
            </Badge>
          )}
        </div>

        {cycles.length > 1 ? (
          <Select value={activeCycleId} onValueChange={onCycleChange}>
            <SelectTrigger className="h-8 text-xs font-semibold bg-background w-full">
              <SelectValue placeholder="Chọn chu kỳ bán" />
            </SelectTrigger>
            <SelectContent>
              {cycles.map((c) => (
                <SelectItem key={c.cycleId} value={c.cycleId} className="text-xs">
                  {c.title} • {c.status === 'converted' ? 'Đã chốt' : c.status === 'dropped' ? 'Đã rớt' : 'Đang xử lý'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span className="font-semibold text-foreground">{activeCycle?.title}</span>
            <span className="text-[11px] font-mono">Bắt đầu: {activeCycle?.startDate}</span>
          </div>
        )}

        {activeCycle?.outcomeNote && (
          <p className="text-[11px] text-muted-foreground italic bg-background/60 p-1.5 rounded border border-border/50">
            &ldquo;{activeCycle.outcomeNote}&rdquo;
          </p>
        )}
      </div>

      {/* 2. Thông tin Học viên (Chủ thể Lead) */}
      <div className="bg-card border border-border rounded-xl p-3.5 space-y-3">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Baby className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm leading-tight">
              {lead.studentName}
            </h4>
            <span className="text-[11px] text-muted-foreground">
              {lead.studentAge} tuổi ({birthYear})
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-muted-foreground block text-[11px]">Khóa học quan tâm:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              {lead.targetSubject}
            </span>
          </div>

          {lead.initialLevel && (
            <div>
              <span className="text-muted-foreground block text-[11px]">Trình độ hiện tại / test:</span>
              <span className="font-medium text-foreground">{lead.initialLevel}</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Thông tin Phụ huynh (Người đại diện) */}
      <div className="bg-card border border-border rounded-xl p-3.5 space-y-3">
        <div className="flex items-center gap-2 border-b border-border/60 pb-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-foreground truncate">{lead.parentName}</span>
              {lead.parentRole && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  {lead.parentRole}
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">Người bảo trợ tài chính</span>
          </div>
        </div>

        {/* Số điện thoại ĐẦY ĐỦ + Nút Gọi + Nút Chép */}
        <div className="bg-muted/40 p-2.5 rounded-lg border border-border/70 space-y-2">
          <span className="text-[11px] text-muted-foreground block">Số điện thoại liên hệ:</span>
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono font-bold text-sm text-foreground tracking-wide">
              {lead.phone}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer"
                title="Gọi điện trực tiếp"
                onClick={handleCall}
              >
                <PhoneCall className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="h-7 w-7 cursor-pointer"
                title="Sao chép số"
                onClick={handleCopyPhone}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {lead.email && (
            <div className="flex items-start gap-2">
              <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground truncate">{lead.email}</span>
            </div>
          )}

          {lead.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-muted-foreground leading-relaxed">{lead.address}</span>
            </div>
          )}
        </div>

        {/* Liên kết anh chị em cùng nhà */}
        {lead.familySiblings && lead.familySiblings.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 mb-1">
              <Users className="h-3.5 w-3.5" />
              <span>Con khác cùng phụ huynh:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {lead.familySiblings.map((sib, i) => (
                <Badge key={i} variant="outline" className="text-[10px] bg-sky-50 dark:bg-sky-950/40 border-sky-300">
                  {sib}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Nguồn & Phân bổ */}
      <div className="bg-muted/30 border border-border rounded-xl p-3 space-y-2 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Nguồn Lead:</span>
          <span className="font-semibold text-foreground">
            {SOURCE_LABEL_MAP[lead.source] ?? lead.source}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Tư vấn phụ trách:</span>
          <span className="font-semibold text-primary flex items-center gap-1">
            <UserCheck className="h-3 w-3" />
            {lead.assignedTo?.replace(/\s*\((?:Sales|Sale)\)/i, '') || 'Chưa phân bổ'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Cơ sở tiếp nhận:</span>
          <span className="font-medium text-foreground">{lead.branch}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Ngày tạo hồ sơ:</span>
          <span className="font-mono text-muted-foreground">{lead.createdAt}</span>
        </div>
      </div>
    </div>
  )
}
