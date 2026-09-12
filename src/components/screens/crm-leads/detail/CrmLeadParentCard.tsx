'use client'

import React from 'react'
import {
  Phone,
  Copy,
  PhoneCall,
  ExternalLink,
  Briefcase,
  MessageSquare,
  FileText,
  CheckCircle2,
  Target,
  Clock,
  Wallet,
  User,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface ParentContact {
  name: string
  role: string
  phone: string
  email?: string
  occupation?: string
  financialSegment?: string
  budgetPerMonth?: string
  decisionMakerRole?: string
  preferredContactMethod?: string
  bestTimeToCall?: string
  parentExpectation?: string
  parentPainPoint?: string
  parentPersonalityNote?: string
  preferredChannel: string
  zaloStatus: string
  isPrimary: boolean
  address?: string
  nearestBranch?: string
  nearestBranchDistance?: string
  nearestBranches?: { name: string; distance: string }[]
  province?: string
  district?: string
  ward?: string
  street?: string
  mapLink?: string
  note?: string
  facebook?: string
  instagram?: string
  zaloPhone?: string
  otherContact?: string
}

interface CrmLeadParentCardProps {
  parent: ParentContact
  onCopy: (phone: string, name: string) => void
  onCall: (phone: string, name: string) => void
  onZalo: (phone: string, name: string) => void
  onClickProfile?: (parent: ParentContact) => void
}

export function CrmLeadParentCard({
  parent,
  onCopy,
  onCall,
  onZalo,
  onClickProfile,
}: CrmLeadParentCardProps) {
  const handleCardClick = () => {
    onClickProfile?.(parent)
  }

  const isGrandparent =
    parent.role.toLowerCase().includes('ông') || parent.role.toLowerCase().includes('bà')

  const isGuardian = parent.role.toLowerCase().includes('giám hộ')

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'group relative rounded-xl border bg-card p-3 sm:p-3.5 transition-all flex flex-col justify-between cursor-pointer select-none text-left shadow-2xs hover:shadow-sm',
        parent.isPrimary
          ? 'border-sky-300 dark:border-sky-800 bg-sky-50/10 dark:bg-sky-950/10 hover:border-sky-400 ring-1 ring-sky-200/50 dark:ring-sky-900/30'
          : isGrandparent
            ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/10 dark:bg-amber-950/10 hover:border-amber-400'
            : 'border-border/80 hover:border-sky-300'
      )}
    >
      {/* HEADER & THÔNG TIN ĐỊNH DANH (THU GỌN) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {parent.isPrimary ? (
              <Badge className="text-[10px] font-bold bg-sky-600 text-white h-5 px-1.5">
                Liên hệ chính
              </Badge>
            ) : isGrandparent ? (
              <Badge variant="outline" className="text-[10px] font-semibold border-amber-300 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 h-5 px-1.5">
                Ông / Bà
              </Badge>
            ) : isGuardian ? (
              <Badge variant="outline" className="text-[10px] font-semibold border-purple-300 text-purple-800 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 h-5 px-1.5">
                Giám hộ
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground h-5 px-1.5">
                Phụ huynh
              </Badge>
            )}

            <Badge variant="secondary" className="text-[10px] font-bold py-0 h-5 px-1.5">
              {parent.role}
            </Badge>
          </div>

          <span className="text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <span>Chi tiết</span>
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>

        {/* Tên & Avatar thu gọn */}
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shrink-0 shadow-2xs',
              parent.isPrimary
                ? 'bg-sky-600 text-white'
                : isGrandparent
                  ? 'bg-amber-600 text-white'
                  : 'bg-muted text-muted-foreground border border-border/80'
            )}
          >
            {isGrandparent ? (
              <HeartHandshake className="h-4.5 w-4.5" />
            ) : (
              <User className="h-4.5 w-4.5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
              {parent.name}
            </h4>
            {parent.decisionMakerRole && (
              <div className="flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-300 font-medium truncate pt-0.5">
                <ShieldCheck className="h-3 w-3 text-amber-600 shrink-0" />
                <span className="truncate">{parent.decisionMakerRole}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cụm SĐT & Tác nghiệp 1-chạm (Thu gọn) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1.5 flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Phone className="h-3 w-3 text-sky-600 shrink-0" />
            <span className="font-mono font-bold text-foreground text-xs tracking-wide">
              {parent.phone}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onCopy(parent.phone, parent.name)}
              className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer rounded"
              title="Sao chép SĐT"
            >
              <Copy className="h-2.5 w-2.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onZalo(parent.phone, parent.name)}
              className="h-6 px-2 text-[11px] font-semibold text-sky-700 border-sky-300 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 rounded cursor-pointer flex items-center gap-1"
            >
              <MessageSquare className="h-2.5 w-2.5 text-sky-600" />
              <span>Zalo</span>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => onCall(parent.phone, parent.name)}
              className="h-6 px-2.5 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-2xs cursor-pointer flex items-center gap-1"
            >
              <PhoneCall className="h-2.5 w-2.5 fill-current" />
              <span>Gọi</span>
            </Button>
          </div>
        </div>

        {/* Thông tin nghề nghiệp & ngân sách (Gọn gàng) */}
        <div className="space-y-1 text-xs">
          {parent.occupation && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="h-3 w-3 text-sky-600 shrink-0" />
              <span className="truncate text-foreground font-medium text-[11px]">{parent.occupation}</span>
            </div>
          )}

          {parent.budgetPerMonth && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Wallet className="h-3 w-3 text-emerald-600 shrink-0" />
              <span className="truncate text-[11px] text-foreground font-medium">
                Ngân sách: <strong className="text-emerald-700 dark:text-emerald-400">{parent.budgetPerMonth}</strong>
              </span>
            </div>
          )}

          {parent.bestTimeToCall && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3 w-3 text-amber-600 shrink-0" />
              <span className="truncate text-[11px] text-foreground font-medium">
                Giờ rảnh: {parent.bestTimeToCall}
              </span>
            </div>
          )}
        </div>

        {/* Tóm tắt kỳ vọng / ghi chú ngắn */}
        {parent.parentExpectation ? (
          <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-[11px] text-foreground flex items-start gap-1.5">
            <Target className="h-3 w-3 text-emerald-600 mt-0.5 shrink-0" />
            <span className="line-clamp-1">
              <strong className="text-emerald-900 dark:text-emerald-300 font-semibold">Kỳ vọng:</strong>{' '}
              {parent.parentExpectation}
            </span>
          </div>
        ) : parent.note ? (
          <div className="p-2 rounded-lg bg-muted/40 border border-border/50 text-[11px] text-muted-foreground flex items-start gap-1.5">
            <FileText className="h-3 w-3 text-muted-foreground/80 mt-0.5 shrink-0" />
            <span className="line-clamp-1">
              <strong className="text-foreground font-semibold">Lưu ý:</strong> {parent.note}
            </span>
          </div>
        ) : null}
      </div>

      {/* FOOTER: XEM CHÂN DUNG 360° */}
      <div className="pt-2 mt-2.5 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1 text-sky-700 dark:text-sky-300 font-medium">
          <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
          <span>{parent.zaloStatus}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClickProfile?.(parent)
          }}
          className="text-primary hover:text-primary/80 font-bold text-xs flex items-center gap-1 cursor-pointer"
        >
          <span>Xem chân dung 360°</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  )
}
