'use client'

import { useState, useMemo } from 'react'
import {
  Calendar,
  ShieldCheck,
  ChevronDown,
  Copy,
  Check,
  Pencil,
  MapPin,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'
import type { Student } from '@/mocks/students'
import type { FamilyMember } from './studentDetailTypes'
import { getStudentFamilyMembers } from './studentDetailHelpers'

interface StudentDetailProfilePanelProps {
  student: Student
  className?: string
}

export function StudentDetailProfilePanel({
  student,
  className,
}: StudentDetailProfilePanelProps) {
  const [showCodes, setShowCodes] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isParentsExpanded, setIsParentsExpanded] = useState(false)
  const [isNoteExpanded, setIsNoteExpanded] = useState(false)

  // Family members list
  const familyMembers: FamilyMember[] = getStudentFamilyMembers(student)
  const displayFamilyMembers = useMemo(() => {
    if (familyMembers.length > 0) return familyMembers
    return [
      {
        id: `p-${student.id}-1`,
        name: student.parentName || 'Nguyễn Thị Mai',
        relationship: 'Mẹ',
        phone: student.parentPhone || '090612294',
      },
      {
        id: `p-${student.id}-2`,
        name: 'Trần Văn Sơn',
        relationship: 'Bố',
        phone: '091612999',
      }
    ]
  }, [familyMembers, student])

  const primaryParent = displayFamilyMembers[0]

  // Student identifiers
  const charSum = student.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const cid = `3382${((charSum * 17) % 9000) + 1000}`
  const uid = `103${((charSum * 23) % 900) + 100}`
  const sid = student.id

  const address = 'Số 29 Nguyễn Tuân, Nam Từ Liêm, Hà Nội'
  const birthDate = student.dob ? new Date(student.dob).toLocaleDateString('vi-VN') : '25/08/2015'
  const studentAvatar = student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`
  const attitudeNote = student.notes || 'Thường xuyên giơ tay phát biểu, có năng khiếu tự học tốt.'

  // Calculate age from DOB
  const calculateAge = (dobString?: string) => {
    if (!dobString) return null
    const birthYear = new Date(dobString).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear
    return age > 0 ? `${age} tuổi` : null
  }

  const ageText = calculateAge(student.dob)

  const handleCopy = async (text: string, key: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      toast.success(`Đã sao chép ${label}!`)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      toast.error(`Không thể sao chép ${label}!`)
    }
  }

  return (
    <div className={cn('space-y-3.5 pr-0.5', className)}>
      {/* 1. THẺ THÔNG TIN HỌC VIÊN CHUẨN MÀN CHĂM SÓC (Images 1, 2, 3) */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 shadow-xs space-y-2.5 text-left">
        {/* Top block: Avatar + Name + Mã ID + NS/ĐC + Phụ huynh chính */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            <AppAvatar
              src={studentAvatar}
              name={student.name}
              size="lg"
              className="h-14 w-14 rounded-full border-2 border-background shadow-xs"
            />
          </div>

          {/* Center details */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-1.5 flex-nowrap">
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-base font-bold text-foreground truncate">
                  {student.name}
                </span>
                {student.englishName && (
                  <span className="text-xs text-muted-foreground font-medium truncate">
                    ({student.englishName})
                  </span>
                )}
              </div>

              {/* Nút Mã ID (Image 3) */}
              <button
                type="button"
                onClick={() => setShowCodes((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1 text-xs transition-colors cursor-pointer select-none shrink-0 h-6.5 px-2 rounded-md border",
                  showCodes
                    ? "text-primary font-bold bg-primary/10 border-primary/30"
                    : "text-muted-foreground hover:text-foreground font-medium border-border/70 hover:bg-muted/60"
                )}
                title={showCodes ? "Ẩn danh sách mã hệ thống" : "Hiện mã CID, UID, SID"}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Mã ID</span>
                <ChevronDown className={cn("h-3 w-3 shrink-0 transition-transform duration-200", showCodes && "rotate-180")} />
              </button>
            </div>

            {/* NS & ĐC */}
            <div className="flex items-center gap-2 text-[11.5px] text-muted-foreground font-medium flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 opacity-70" />
                <span>{birthDate}</span>
                {ageText && <span>({ageText})</span>}
              </span>
              <span className="text-border">•</span>
              <span className="inline-flex items-center gap-1 truncate max-w-[200px]" title={address}>
                <MapPin className="h-3 w-3 opacity-70 shrink-0" />
                <span className="truncate">{address}</span>
              </span>
            </div>

            {/* Dòng Phụ huynh chính với Chevron mở rộng (Images 1, 2) */}
            <div className="flex items-center justify-between gap-1 pt-0.5 text-xs select-none">
              <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                <span className="font-bold text-foreground shrink-0">
                  {primaryParent.name} <span className="text-muted-foreground font-normal">({primaryParent.relationship})</span>
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900 leading-none shrink-0">
                  Chính
                </span>
                <span className="text-border">•</span>
                <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">
                  {primaryParent.phone}
                </span>
              </div>

              {/* Nút Chevron toggle danh sách phụ huynh */}
              <button
                type="button"
                onClick={() => setIsParentsExpanded((prev) => !prev)}
                className="p-1 hover:bg-muted/80 rounded text-sky-600 dark:text-sky-400 cursor-pointer shrink-0 transition-colors"
                title={isParentsExpanded ? "Thu gọn danh sách phụ huynh" : `Xem chi tiết phụ huynh (${displayFamilyMembers.length})`}
              >
                <ChevronDown className={cn("h-4 w-4 stroke-[2.5] transition-transform duration-200", isParentsExpanded && "rotate-180")} />
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách phụ huynh khi mở rộng (Image 1) */}
        {isParentsExpanded && (
          <div className="space-y-1.5 border-t border-border/40 pt-2 text-left animate-in fade-in-50 duration-200">
            {displayFamilyMembers.map((contact, idx) => (
              <div
                key={contact.id || idx}
                className="group flex items-center justify-between gap-2 p-2 bg-muted/30 dark:bg-zinc-800/30 border border-border/40 rounded-lg text-xs"
              >
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="font-bold text-foreground">{contact.name}</span>
                  <span className="text-muted-foreground font-normal">({contact.relationship})</span>
                  {idx === 0 && (
                    <span className="text-[8.5px] font-semibold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900 leading-none">
                      Chính
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 mr-1">
                    {contact.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(contact.phone, `phone-${contact.id || idx}`, `SĐT ${contact.name}`)}
                    className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Sao chép SĐT"
                  >
                    {copiedKey === `phone-${contact.id || idx}` ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dải hiển thị Mã ID mở rộng (Image 3) */}
        {showCodes && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground select-none py-1.5 px-3 bg-muted/40 dark:bg-zinc-800/40 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-1 duration-200 w-full">
            <span className="flex items-center gap-1 font-mono text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>CID:</span>
              <strong className="text-foreground font-semibold">{cid}</strong>
              <button
                type="button"
                onClick={() => handleCopy(cid, 'cid', 'Mã CID')}
                className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                title="Sao chép CID"
              >
                {copiedKey === 'cid' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              </button>
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1 font-mono text-xs">
              <span>UID:</span>
              <strong className="text-foreground font-semibold">{uid}</strong>
              <button
                type="button"
                onClick={() => handleCopy(uid, 'uid', 'Mã UID')}
                className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                title="Sao chép UID"
              >
                {copiedKey === 'uid' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              </button>
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1 font-mono text-xs">
              <span>SID:</span>
              <strong className="text-foreground font-semibold">{sid}</strong>
              <button
                type="button"
                onClick={() => handleCopy(sid, 'sid', 'Mã SID')}
                className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                title="Sao chép SID"
              >
                {copiedKey === 'sid' ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              </button>
            </span>
          </div>
        )}

        {/* Dòng Ghi chú thái độ học tập (Images 1, 2, 3) */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 text-xs text-amber-700 dark:text-amber-400 select-none">
          <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
            <Pencil className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="truncate italic font-medium">
              {attitudeNote}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsNoteExpanded((prev) => !prev)}
            className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer shrink-0 font-medium hover:underline"
          >
            {isNoteExpanded ? 'thu gọn' : '... xem thêm'}
          </button>
        </div>

        {isNoteExpanded && (
          <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 text-xs text-amber-900 dark:text-amber-200 animate-in fade-in duration-200">
            {attitudeNote}
          </div>
        )}
      </div>
    </div>
  )
}
