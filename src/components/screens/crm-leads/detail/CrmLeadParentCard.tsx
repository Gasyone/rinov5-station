'use client'

import {
  Phone,
  Mail,
  MapPin,
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
  AlertCircle,
  Lightbulb,
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
  province?: string
  district?: string
  ward?: string
  street?: string
  mapLink?: string
  note?: string
}

interface CrmLeadParentCardProps {
  parent: ParentContact
  onCopy: (phone: string, name: string) => void
  onCall: (phone: string, name: string) => void
  onZalo: (phone: string, name: string) => void
}

export function CrmLeadParentCard({
  parent,
  onCopy,
  onCall,
  onZalo,
}: CrmLeadParentCardProps) {
  return (
    <div
      className={cn(
        'p-3.5 lg:p-4 rounded-xl border bg-card transition-all shadow-xs space-y-3',
        parent.isPrimary
          ? 'border-sky-200/90 dark:border-sky-900/60 shadow-xs'
          : 'border-border/70'
      )}
    >
      {/* TẦNG 1: IDENTITY & VAI TRÒ RA QUYẾT ĐỊNH (AUTHORITY & STATUS) */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full font-bold text-xs shrink-0 shadow-3xs',
              parent.isPrimary
                ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200/60'
                : 'bg-muted text-muted-foreground border border-border/60'
            )}
          >
            {parent.name
              .split(' ')
              .slice(-2)
              .map((w) => w[0])
              .join('') || 'PH'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm leading-tight">
                {parent.name}
              </span>
              <Badge variant="secondary" className="text-[11px] font-semibold py-0.5 px-2">
                {parent.role}
              </Badge>
              {parent.isPrimary ? (
                <>
                  <Badge className="text-[10px] font-bold bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300">
                    Liên hệ chính
                  </Badge>
                  {parent.decisionMakerRole && (
                    <Badge variant="outline" className="text-[10px] font-semibold border-amber-300 text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40">
                      {parent.decisionMakerRole}
                    </Badge>
                  )}
                </>
              ) : (
                <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground">
                  Phụ huynh 2
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {parent.occupation && (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-muted/40 px-2.5 py-1 rounded-md border border-border/40">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground/70" />
              <span>{parent.occupation}</span>
            </span>
          )}
          {parent.isPrimary && parent.budgetPerMonth && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200/60">
              <Wallet className="h-3.5 w-3.5 text-emerald-600" />
              <span>{parent.budgetPerMonth}</span>
            </span>
          )}
        </div>
      </div>

      {/* TẦNG 2: FOCAL ACTION ZONE (SĐT, GIỜ VÀNG & HÀNH ĐỘNG TÁC NGHIỆP 1-CHẠM) */}
      <div className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 rounded-xl p-2.5 flex items-center justify-between gap-3 flex-wrap">
        {/* Bên trái: SĐT & Kênh ưu tiên & Giờ vàng */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300">
              <Phone className="h-3.5 w-3.5" />
            </div>
            <span className="font-mono font-bold text-foreground text-sm sm:text-base tracking-wide">
              {parent.phone}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onCopy(parent.phone, parent.name)}
              className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer rounded-md"
              title="Sao chép số điện thoại"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-sky-100/70 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200/50">
              {parent.preferredChannel}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>{parent.zaloStatus}</span>
            </span>
            {parent.bestTimeToCall && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60" title="Giờ vàng gọi điện / nhắn tin">
                <Clock className="h-3 w-3 text-amber-600" />
                <span>{parent.bestTimeToCall}</span>
              </span>
            )}
          </div>
        </div>

        {/* Bên phải: Nút tác nghiệp Gọi & Zalo */}
        <div className="flex items-center gap-2 ml-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onZalo(parent.phone, parent.name)}
            className="h-8 px-3 text-xs font-semibold text-sky-700 border-sky-300 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-950/60 cursor-pointer rounded-lg flex items-center gap-1.5 shadow-3xs"
            title="Nhắn tin Zalo với phụ huynh"
          >
            <MessageSquare className="h-3.5 w-3.5 text-sky-600" />
            <span>Zalo</span>
          </Button>

          <Button
            size="sm"
            onClick={() => onCall(parent.phone, parent.name)}
            className="h-8 px-3.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer rounded-lg shadow-2xs flex items-center gap-1.5"
            title="Gọi điện trực tiếp"
          >
            <PhoneCall className="h-3.5 w-3.5 fill-current" />
            <span>Gọi ngay</span>
          </Button>
        </div>
      </div>

      {/* TẦNG 3: ĐỊA CHỈ & EMAIL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-0.5">
        {parent.email && (
          <div className="flex items-center gap-2 text-muted-foreground truncate">
            <Mail className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="truncate text-foreground font-medium">{parent.email}</span>
          </div>
        )}

        {parent.address && (
          <div className="flex items-center justify-between gap-1.5 text-muted-foreground truncate">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <MapPin className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span className="truncate font-medium text-foreground">{parent.address}</span>
            </div>
            {parent.mapLink && (
              <a
                href={parent.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold flex items-center gap-1 shrink-0 ml-1.5 text-[11px]"
                title="Mở định vị trên Google Maps"
              >
                <span>Mở Map</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* TẦNG 4: THẤU CẢM CHÂN DUNG (KỲ VỌNG, NỖI ĐAU, LƯU Ý TƯ VẤN) - DÀNH CHO PHỤ HUYNH CHÍNH */}
      {parent.isPrimary ? (
        <div className="space-y-2 pt-1 border-t border-border/40">
          {parent.parentExpectation && (
            <div className="p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 text-xs text-foreground flex items-start gap-2 leading-relaxed">
              <Target className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-emerald-900 dark:text-emerald-300 font-semibold">
                  Kỳ vọng số 1 với Rino:
                </strong>{' '}
                <span>{parent.parentExpectation}</span>
              </div>
            </div>
          )}

          {parent.parentPainPoint && (
            <div className="p-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60 text-xs text-foreground flex items-start gap-2 leading-relaxed">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-amber-900 dark:text-amber-300 font-semibold">
                  Rào cản / Nỗi lo lớn nhất:
                </strong>{' '}
                <span>{parent.parentPainPoint}</span>
              </div>
            </div>
          )}

          {parent.parentPersonalityNote && (
            <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/50 text-xs text-foreground flex items-start gap-2 leading-relaxed">
              <Lightbulb className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-indigo-900 dark:text-indigo-300 font-semibold">
                  Tâm lý &amp; Lưu ý tư vấn chốt deal:
                </strong>{' '}
                <span className="text-muted-foreground">{parent.parentPersonalityNote}</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        parent.note && (
          <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-xs text-muted-foreground flex items-start gap-2 leading-relaxed">
            <FileText className="h-3.5 w-3.5 text-muted-foreground/80 mt-0.5 shrink-0" />
            <span>
              <strong className="text-foreground font-semibold">Quy tắc liên hệ:</strong>{' '}
              {parent.note}
            </span>
          </div>
        )
      )}
    </div>
  )
}
