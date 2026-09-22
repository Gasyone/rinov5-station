'use client'

import { useState } from 'react'
import {
  Users,
  Phone,
  Mail,
  GraduationCap,
  Clock,
  Building2,
  Calendar,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Check,
  Award,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/shared'
import type { Student } from '@/mocks/students'
import type { FamilyMember, StudentAvailableSlot, StudentProgram } from './studentDetailTypes'
import { getStudentFamilyMembers, getStudentAvailableSlots } from './studentDetailHelpers'

interface StudentDetailProfilePanelProps {
  student: Student
  selectedProgram?: StudentProgram | null
  className?: string
}

export function StudentDetailProfilePanel({
  student,
  selectedProgram,
  className,
}: StudentDetailProfilePanelProps) {
  const [showCodes, setShowCodes] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({})

  // Family members list
  const familyMembers: FamilyMember[] = getStudentFamilyMembers(student)
  // Available schedule slots (fall back to student slots if program does not define custom slots)
  const availableSlots: StudentAvailableSlot[] =
    selectedProgram?.availableSlots || getStudentAvailableSlots(student)

  // Dynamic program-specific attributes
  const activeBranch = selectedProgram?.branch || student.branch || 'RinoEdu Linh Đàm'
  const activeLevel = selectedProgram?.level || student.level || 'Chưa phân cấp'
  const activeSubLevel = selectedProgram?.subLevel || student.subLevel
  const activeEntryScore = selectedProgram?.entryScore || '8.5 / 10'
  const activeScoreEvaluation = selectedProgram?.entryScoreEvaluation || 'Khá giỏi'
  const activeAssessment =
    selectedProgram?.assessmentNote ||
    student.notes ||
    'Học viên tích cực, tập trung tốt, hoàn thành đầy đủ bài kiểm tra chẩn đoán đầu vào.'
  const activeCsm = selectedProgram?.csmName || 'Minh Phương (CSM)'
  const activeSale = selectedProgram?.saleName || student.saleName || 'Trần Thị Mai (Sales)'

  const studentCode = `STU-00${student.id.replace('s', '')}`

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

  const toggleRevealPhone = (key: string) => {
    setRevealedPhones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const maskPhone = (phone?: string) => {
    if (!phone) return 'Chưa cập nhật'
    if (phone.length < 7) return phone
    return `${phone.slice(0, 3)}****${phone.slice(-3)}`
  }

  return (
    <div className={cn('space-y-3.5 pr-0.5', className)}>
      {/* 1. THẺ THÔNG TIN HỌC VIÊN */}
      <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-3.5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg border border-primary/20 shadow-2xs">
            {student.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={student.avatar}
                alt={student.name}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              student.name.charAt(0).toUpperCase()
            )}
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] text-white ring-2 ring-card">
              ✓
            </span>
          </div>

          {/* Name & Basic Info */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-base font-bold text-foreground truncate">
                {student.name}
              </h3>
              {student.gender && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                  {student.gender === 'Male' ? 'Nam' : student.gender === 'Female' ? 'Nữ' : student.gender}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="font-mono font-semibold text-foreground/90 bg-muted/60 px-1.5 py-0.5 rounded text-[11px]">
                {studentCode}
              </span>
              {student.dob && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(student.dob).toLocaleDateString('vi-VN')}
                  {ageText && ` (${ageText})`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status & Point Badge */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50 flex-wrap">
          <StatusBadge
            status={student.status}
            label={student.status === 'active' ? 'Đang theo học' : undefined}
            className="text-xs font-semibold py-0.5 px-2"
          />

          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 dark:bg-amber-500/20 px-2 py-0.5 rounded-md">
            <Award className="h-3.5 w-3.5" />
            <span>120 Rino Points</span>
          </div>
        </div>

        {/* System Codes Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowCodes((prev) => !prev)}
            className="w-full flex items-center justify-between text-[11px] text-muted-foreground hover:text-foreground font-medium py-1 px-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Mã hệ thống (CID, UID, SID)
            </span>
            {showCodes ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showCodes && (
            <div className="mt-2 grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-muted/40 border border-border/40 text-[11px]">
              <div>
                <span className="text-muted-foreground block">CID:</span>
                <span className="font-mono font-semibold text-foreground">{student.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">UID:</span>
                <span className="font-mono font-semibold text-foreground">4809440</span>
              </div>
              <div>
                <span className="text-muted-foreground block">SID:</span>
                <span className="font-mono font-semibold text-foreground">177245</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. THẺ THÔNG TIN PHỤ HUYNH */}
      <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            Thông tin Phụ huynh
          </h4>
          <span className="text-[11px] text-muted-foreground">
            {familyMembers.length} người liên hệ
          </span>
        </div>

        <div className="space-y-2.5">
          {familyMembers.map((member, index) => {
            const isRevealed = revealedPhones[member.id] || false
            const displayPhone = isRevealed ? member.phone : maskPhone(member.phone)

            return (
              <div
                key={member.id || index}
                className="p-2.5 rounded-lg border border-border/50 bg-muted/20 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">
                      {member.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-medium">
                      {member.relationship || (index === 0 ? 'Phụ huynh chính' : 'Người thân')}
                    </span>
                  </div>
                </div>

                {/* Số điện thoại có che theo quy định */}
                <div className="flex items-center justify-between text-muted-foreground">
                  <div className="inline-flex items-center gap-1 font-mono">
                    <Phone className="h-3 w-3 text-muted-foreground/70" />
                    <span className={cn('text-xs', isRevealed ? 'text-foreground font-semibold' : 'text-foreground/80')}>
                      {displayPhone}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleRevealPhone(member.id)}
                      className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded"
                      title={isRevealed ? 'Ẩn số điện thoại' : 'Hiện đầy đủ số'}
                    >
                      {isRevealed ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(member.phone, `phone-${member.id}`, 'số điện thoại')}
                      className="p-1 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded"
                      title="Sao chép số điện thoại"
                    >
                      {copiedKey === `phone-${member.id}` ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Email nếu có */}
                {member.email && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                    <Mail className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. THẺ TRÌNH ĐỘ & ĐÁNH GIÁ ĐẦU VÀO THEO MÔN */}
      <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            Trình độ & Mục tiêu
          </h4>
          {selectedProgram && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20 truncate max-w-[150px]">
              {selectedProgram.name}
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Trình độ môn học:</span>
            <span className="font-semibold text-foreground text-right">
              {activeLevel} {activeSubLevel ? `(${activeSubLevel})` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Điểm test đầu vào:</span>
            <div className="text-right">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {activeEntryScore}
              </span>
              {activeScoreEvaluation && (
                <span className="text-[10px] text-muted-foreground block">
                  {activeScoreEvaluation}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground block text-[11px]">Đánh giá & Mục tiêu:</span>
              <span className="text-[10px] text-primary/80 font-medium">Theo môn học</span>
            </div>
            <p className="text-[11px] text-foreground/85 leading-relaxed bg-muted/30 p-2 rounded-lg border border-border/40">
              {activeAssessment}
            </p>
          </div>
        </div>
      </div>

      {/* 4. THẺ KHUNG GIỜ HỌC VIÊN RẢNH (AVAILABLE SLOTS) */}
      <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
            Khung giờ học viên rảnh
          </h4>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 font-semibold">
            {selectedProgram ? selectedProgram.name : 'Đối chiếu xếp lớp'}
          </span>
        </div>

        <div className="space-y-2">
          {availableSlots.length > 0 ? (
            availableSlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-start justify-between p-2 rounded-lg bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      {slot.dayOfWeek}
                    </span>
                    {slot.isPreferred && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-200/70 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-semibold">
                        Ưu tiên
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-muted-foreground text-[11px] block">
                    {slot.timeRange}
                  </span>
                </div>
                {slot.note && (
                  <span className="text-[10px] text-muted-foreground italic text-right max-w-[120px] truncate">
                    {slot.note}
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg">
              Chưa ghi nhận khung giờ rảnh cố định.
            </div>
          )}
        </div>
      </div>

      {/* 5. THẺ CƠ SỞ & NHÂN SỰ PHỤ TRÁCH THEO MÔN */}
      <div className="rounded-xl border border-border/70 bg-card p-4 shadow-2xs space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            Cơ sở & Phụ trách
          </h4>
          {selectedProgram && (
            <span className="text-[10px] text-muted-foreground font-medium">
              {selectedProgram.name}
            </span>
          )}
        </div>

        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cơ sở theo học:</span>
            <span className="font-bold text-foreground">
              {activeBranch}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">CSM phụ trách:</span>
            <span className="font-medium text-foreground">
              {activeCsm}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tư vấn viên (Sales):</span>
            <span className="font-medium text-foreground">
              {activeSale}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
