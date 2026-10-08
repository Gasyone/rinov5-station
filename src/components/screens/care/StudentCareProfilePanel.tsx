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
  ExternalLink,
  Cake,
  History,
  Camera,
  User,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Student } from '@/mocks/students'
import type { FamilyMember } from '../students/detail/studentDetailTypes'
import { getStudentFamilyMembers, getStudentNotes } from '../students/detail/studentDetailHelpers'

export interface StudentCareProfilePanelProps {
  student: Student
  className?: string
  onEditProfile?: () => void
  onUpdateNote?: (newNote: string) => void
  address?: string
}

export function StudentCareProfilePanel({
  student,
  className,
  onEditProfile,
  onUpdateNote,
  address: addressProp,
}: StudentCareProfilePanelProps) {
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
      },
    ]
  }, [familyMembers, student])

  const primaryParent = displayFamilyMembers[0]

  // Student identifiers
  const charSum = student.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const cid = `3382${((charSum * 17) % 9000) + 1000}`
  const uid = `103${((charSum * 23) % 900) + 100}`
  const sid = student.id

  const address =
    addressProp ||
    (student as unknown as { address?: string }).address ||
    'Số 29 Nguyễn Tuân, Nam Từ Liêm, Hà Nội'

  const formatBirthDate = (dobString?: string) => {
    if (!dobString) return '25/08/2015'
    if (dobString.includes('-')) {
      const parts = dobString.split('-')
      if (parts.length === 3) {
        const y = parts[0]
        const m = parseInt(parts[1], 10)
        const d = parseInt(parts[2], 10)
        return `${d}/${m}/${y}`
      }
    }
    const d = new Date(dobString)
    return isNaN(d.getTime()) ? dobString : d.toLocaleDateString('vi-VN')
  }

  const birthDate = formatBirthDate(student.dob)
  const studentAvatar =
    student.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.name}`
  const attitudeNote =
    student.notes || 'Thường xuyên giơ tay phát biểu, có năng khiếu tự học tốt.'

  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')

  const handleStartEditNote = () => {
    setNoteDraft(attitudeNote)
    setIsEditingNote(true)
  }

  // Calculate age from DOB (ví dụ "12t")
  const calculateAge = (dobString?: string) => {
    if (!dobString) return null
    const birthYear = new Date(dobString).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - birthYear
    return age > 0 ? `${age}t` : null
  }

  const ageText = calculateAge(student.dob)

  // Lịch sử ghi chú tương tác
  const rawNotes = useMemo(() => getStudentNotes(student), [student])
  const notesHistory = useMemo(() => {
    if (rawNotes.length > 0) return rawNotes
    return [
      {
        id: `note-${student.id}-current`,
        text: attitudeNote,
        author: student.saleName || 'CSM / Phụ trách',
        timestamp: '10:00 01/06/2026',
      },
    ]
  }, [rawNotes, student, attitudeNote])

  // Luôn hiển thị tối đa 2 dòng + "... xem thêm" khi thu gọn
  const maxCollapsedChars = 92
  const noteLines = useMemo(
    () => attitudeNote.split('\n').filter((l) => l.trim().length > 0),
    [attitudeNote]
  )
  const hasMultipleNewlines = noteLines.length > 2
  const isLongNote = attitudeNote.length > maxCollapsedChars || hasMultipleNewlines

  const displayedNoteText = useMemo(() => {
    if (isNoteExpanded || !isLongNote) return attitudeNote

    if (hasMultipleNewlines) {
      const firstTwo = noteLines.slice(0, 2).join(' ')
      if (firstTwo.length <= maxCollapsedChars) {
        return firstTwo.trim()
      }
    }

    const trimmed = attitudeNote.slice(0, maxCollapsedChars)
    const lastSpace = trimmed.lastIndexOf(' ')
    const cut = lastSpace > 50 ? trimmed.slice(0, lastSpace) : trimmed
    return cut.trim().replace(/[,;:\.]*$/, '')
  }, [attitudeNote, isNoteExpanded, isLongNote, hasMultipleNewlines, noteLines])

  // Giới tính học viên
  const genderLabel =
    student.gender === 'Female' ? 'Nữ' : student.gender === 'Male' ? 'Nam' : 'Khác'

  // Nhận diện sinh nhật: Hôm nay, Ngày mai, hoặc Tháng theo ngày sinh học viên
  const bdayInfo = useMemo(() => {
    if (!student.dob) return null
    let bMonth = -1
    let bDate = -1

    if (student.dob.includes('-')) {
      const parts = student.dob.split('-')
      if (parts.length >= 3) {
        bMonth = parseInt(parts[1], 10) - 1
        bDate = parseInt(parts[2], 10)
      }
    }

    if (bMonth === -1 || isNaN(bMonth) || isNaN(bDate)) {
      const d = new Date(student.dob)
      if (isNaN(d.getTime())) return null
      bMonth = d.getMonth()
      bDate = d.getDate()
    }

    const today = new Date()
    const tMonth = today.getMonth()
    const tDate = today.getDate()

    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const tmMonth = tomorrow.getMonth()
    const tmDate = tomorrow.getDate()

    const isToday = bMonth === tMonth && bDate === tDate
    const isTomorrow = bMonth === tmMonth && bDate === tmDate
    const isThisMonth = bMonth === tMonth

    if (isToday) {
      return {
        label: 'Hôm nay',
        textColor: 'text-pink-600 dark:text-pink-400 font-normal',
        iconClass: 'text-pink-500 fill-pink-500/20 animate-pulse',
        tooltip: `🎂 Hôm nay là sinh nhật em! (${String(bDate).padStart(2, '0')}/${String(bMonth + 1).padStart(2, '0')})`,
      }
    }
    if (isTomorrow) {
      return {
        label: 'Ngày mai',
        textColor: 'text-amber-600 dark:text-amber-400 font-normal',
        iconClass: 'text-amber-500 fill-amber-500/20',
        tooltip: `🎂 Ngày mai là sinh nhật em! (${String(bDate).padStart(2, '0')}/${String(bMonth + 1).padStart(2, '0')})`,
      }
    }
    if (isThisMonth) {
      return {
        label: `Tháng ${bMonth + 1}`,
        textColor: 'text-sky-600 dark:text-sky-400 font-normal',
        iconClass: 'text-sky-500 fill-sky-500/20',
        tooltip: `🎂 Sinh nhật trong tháng: ${String(bDate).padStart(2, '0')}/${String(bMonth + 1).padStart(2, '0')}`,
      }
    }
    return null
  }, [student.dob])

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
    <div className={cn('space-y-2 pr-0.5', className)}>
      {/* THẺ THÔNG TIN HỌC VIÊN CHUẨN MÀN CHĂM SÓC */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-2xs space-y-1.5 text-left">
        {/* Top block: Avatar + Nút Mã ID | Cột thông tin 3 dòng thẳng cột */}
        <div className="flex items-start gap-2.5 min-w-0">
          {/* Cột trái: Avatar (h-13 w-13) + Nút Mã ID */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div
              className={cn(
                'relative group shrink-0',
                onEditProfile && 'cursor-pointer'
              )}
              onClick={onEditProfile}
              title={onEditProfile ? 'Nhấp để đổi ảnh đại diện / thông tin học viên' : undefined}
            >
              <AppAvatar
                src={studentAvatar}
                name={student.name}
                className="h-13 w-13 rounded-full border-2 border-background shadow-xs ring-1 ring-border/50 transition-transform group-hover:scale-105"
              />
              {onEditProfile && (
                <span className="absolute -bottom-0.5 -right-0.5 p-1 bg-background rounded-full border border-border/80 shadow-xs text-muted-foreground group-hover:text-primary group-hover:border-primary/50 transition-colors">
                  <Camera className="h-2.5 w-2.5" />
                </span>
              )}
            </div>

            {/* Nút Mã ID đặt dưới Avatar */}
            <button
              type="button"
              onClick={() => setShowCodes((prev) => !prev)}
              className={cn(
                'inline-flex items-center justify-center gap-1 text-[10.5px] transition-all cursor-pointer select-none shrink-0 h-5 px-1.5 rounded-md border',
                showCodes
                  ? 'text-primary font-bold bg-primary/10 border-primary/30'
                  : 'text-muted-foreground hover:text-foreground font-medium border-transparent bg-transparent hover:border-border/70 hover:bg-muted/60'
              )}
              title={showCodes ? 'Ẩn danh sách mã hệ thống' : 'Hiện mã CID, UID, SID'}
            >
              <ShieldCheck className="h-2.5 w-2.5 text-primary shrink-0" />
              <span>Mã ID</span>
              <ChevronDown
                className={cn(
                  'h-2.5 w-2.5 shrink-0 transition-transform duration-200',
                  showCodes && 'rotate-180'
                )}
              />
            </button>
          </div>

          {/* Cột phải: 3 dòng thẳng cột */}
          <div className="min-w-0 flex-1 space-y-1">
            {/* Dòng 1: Tên học viên + Tên tiếng anh + Nhãn sinh nhật cạnh tên tiếng anh | Nút Sửa */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 truncate min-w-0 flex-wrap sm:flex-nowrap">
                <span className="text-[14px] sm:text-[15px] font-bold text-foreground truncate leading-tight">
                  {student.name}
                </span>
                {student.englishName && (
                  <span className="text-[11px] text-muted-foreground font-medium truncate">
                    ({student.englishName})
                  </span>
                )}
                {/* Nhãn sinh nhật: hôm nay / tháng này cạnh tên tiếng anh */}
                {bdayInfo && (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-[10.5px] font-normal shrink-0 leading-tight select-none',
                      bdayInfo.textColor
                    )}
                    title={bdayInfo.tooltip}
                  >
                    <Cake className={cn('h-3 w-3 shrink-0', bdayInfo.iconClass)} />
                    <span>{bdayInfo.label}</span>
                  </span>
                )}
              </div>

              {onEditProfile && (
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="inline-flex items-center gap-1 text-[11px] font-normal text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline cursor-pointer shrink-0 transition-colors p-0.5 -my-0.5"
                  title="Chỉnh sửa thông tin học viên (Ảnh, Tên, Giới tính, Ngày sinh)"
                >
                  <Pencil className="h-3 w-3" />
                  <span>Chỉnh sửa</span>
                </button>
              )}
            </div>

            {/* Dòng 2: Giới tính • Ngày sinh (Tuổi) • Địa chỉ */}
            <div className="flex items-center gap-1.5 text-[11.5px] min-w-0 text-muted-foreground font-normal flex-wrap">
              <span className="text-foreground/85 font-normal">{genderLabel}</span>
              <span className="text-border/60">•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                <span>{birthDate}</span>
                {ageText && <span className="text-muted-foreground">({ageText})</span>}
              </span>

              {/* Chuyển địa chỉ về cạnh tuổi */}
              {address && (
                <>
                  <span className="text-border/60">•</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer min-w-0 truncate leading-snug"
                    title={`Xem trên Google Maps: ${address}`}
                  >
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="truncate text-foreground/85 group-hover:text-foreground font-normal underline-offset-2 group-hover:underline max-w-[200px] sm:max-w-[280px]">
                      {address}
                    </span>
                    <ExternalLink className="h-2.5 w-2.5 text-muted-foreground/70 group-hover:text-foreground shrink-0 transition-colors" />
                  </a>
                </>
              )}
            </div>

            {/* Dòng 3: Phụ huynh thẳng cột với dòng 1, 2 */}
            <div className="flex items-center justify-between gap-1 text-[11.5px] select-none pt-0.5">
              <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                <User className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />
                <span className="font-normal text-foreground shrink-0 text-xs">
                  {primaryParent.name}{' '}
                  <span className="text-muted-foreground font-normal">
                    ({primaryParent.relationship})
                  </span>
                </span>
                <span className="text-[9px] font-normal px-1 py-0.2 rounded bg-muted text-muted-foreground border border-border/60 leading-none shrink-0">
                  Chính
                </span>
                <span className="text-border">•</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-mono font-normal text-xs text-foreground/90">
                    {primaryParent.phone}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        primaryParent.phone,
                        'primary-phone',
                        `SĐT ${primaryParent.name}`
                      )
                    }
                    className="p-0.5 hover:bg-muted/80 rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    title="Sao chép SĐT"
                  >
                    {copiedKey === 'primary-phone' ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Nút Chevron toggle người thân khác (nếu có từ 2 người thân trở lên) */}
              {displayFamilyMembers.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsParentsExpanded((prev) => !prev)}
                  className="p-0.5 hover:bg-muted/80 rounded text-muted-foreground hover:text-foreground cursor-pointer shrink-0 transition-colors ml-0.5"
                  title={
                    isParentsExpanded
                      ? 'Thu gọn người thân khác'
                      : `Xem thêm người thân (${displayFamilyMembers.length - 1})`
                  }
                >
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 stroke-[2] transition-transform duration-200',
                      isParentsExpanded && 'rotate-180'
                    )}
                  />
                </button>
              )}
            </div>

            {/* Danh sách người thân phụ khi mở rộng */}
            {isParentsExpanded && displayFamilyMembers.length > 1 && (
              <div className="space-y-1 pt-0.5 text-left animate-in fade-in-50 duration-150">
                {displayFamilyMembers.slice(1).map((contact, idx) => (
                  <div
                    key={contact.id || idx + 1}
                    className="flex items-center justify-between gap-1 text-[11.5px] select-none text-muted-foreground/90 hover:text-foreground transition-colors py-0.5"
                  >
                    <div className="flex items-center gap-1.5 truncate flex-1 min-w-0">
                      <User className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                      <span className="font-normal text-foreground/90 shrink-0 text-xs">
                        {contact.name}{' '}
                        <span className="text-muted-foreground font-normal">
                          ({contact.relationship})
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-mono font-normal text-xs text-foreground/80">
                        {contact.phone}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(
                            contact.phone,
                            `phone-${contact.id || idx + 1}`,
                            `SĐT ${contact.name}`
                          )
                        }
                        className="p-0.5 hover:bg-muted/80 rounded text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                        title="Sao chép SĐT"
                      >
                        {copiedKey === `phone-${contact.id || idx + 1}` ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dải hiển thị Mã ID mở rộng */}
        {showCodes && (
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-muted-foreground select-none py-1 px-2.5 bg-muted/40 dark:bg-zinc-800/40 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-1 duration-200 w-full">
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
              <span>CID:</span>
              <strong className="text-foreground font-semibold">{cid}</strong>
              <button
                type="button"
                onClick={() => handleCopy(cid, 'cid', 'Mã CID')}
                className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                title="Sao chép CID"
              >
                {copiedKey === 'cid' ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1 font-mono">
              <span>UID:</span>
              <strong className="text-foreground font-semibold">{uid}</strong>
              <button
                type="button"
                onClick={() => handleCopy(uid, 'uid', 'Mã UID')}
                className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                title="Sao chép UID"
              >
                {copiedKey === 'uid' ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </span>
            <span className="text-muted-foreground/30">•</span>
            <span className="flex items-center gap-1 font-mono">
              <span>SID:</span>
              <strong className="text-foreground font-semibold">{sid}</strong>
              <button
                type="button"
                onClick={() => handleCopy(sid, 'sid', 'Mã SID')}
                className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                title="Sao chép SID"
              >
                {copiedKey === 'sid' ? (
                  <Check className="h-3 w-3 text-emerald-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>
            </span>
          </div>
        )}

        {/* Ghi chú: text xem thêm và icon lịch sử cùng màu với note */}
        <div className="pt-1 border-t border-border/30 text-[11px] text-amber-900/85 dark:text-amber-200/85">
          {isEditingNote ? (
            <div className="space-y-1.5 w-full">
              <div className="flex items-start gap-1.5">
                <Pencil className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400 mt-1" />
                <textarea
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Nhập ghi chú thói quen, năng khiếu của học viên..."
                  className="flex-1 min-h-[52px] bg-background border border-amber-300 dark:border-amber-700 rounded-md p-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setNoteDraft(attitudeNote)
                    setIsEditingNote(false)
                  }}
                  className="h-5.5 px-2 text-[10.5px] rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 cursor-pointer transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = noteDraft.trim()
                    onUpdateNote?.(trimmed)
                    setIsEditingNote(false)
                    toast.success('Đã cập nhật ghi chú học viên!')
                  }}
                  className="h-5.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-[10.5px] rounded cursor-pointer transition-colors"
                >
                  Lưu
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-1.5">
              <button
                type="button"
                onClick={handleStartEditNote}
                className="p-0.5 -ml-0.5 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 rounded text-amber-600 dark:text-amber-400 cursor-pointer transition-colors shrink-0"
                title="Nhấp để sửa ghi chú học viên"
              >
                <Pencil className="h-3 w-3 shrink-0" />
              </button>
              <div className="flex-1 min-w-0 text-left text-[11px] leading-snug">
                <span className="italic font-normal">{displayedNoteText}</span>
                {isLongNote && (
                  <button
                    type="button"
                    onClick={() => setIsNoteExpanded((prev) => !prev)}
                    className="inline text-[10.5px] text-amber-900/85 dark:text-amber-200/85 hover:underline italic font-normal cursor-pointer select-none ml-1 align-baseline"
                  >
                    {isNoteExpanded ? 'thu gọn' : '... xem thêm'}
                  </button>
                )}
              </div>

              {/* Icon lịch sử xem các ghi chú tương tác trước đó */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="p-0.5 -mr-0.5 -mt-0.5 hover:bg-amber-100/50 dark:hover:bg-amber-950/40 rounded text-amber-700/80 dark:text-amber-400/80 hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer shrink-0 transition-colors"
                    title="Xem lịch sử các ghi chú trước đó"
                  >
                    <History className="h-3 w-3" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-3 text-xs space-y-2 z-50 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-foreground">
                      <History className="h-3.5 w-3.5 text-primary" />
                      <span>Lịch sử ghi chú</span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {notesHistory.length} ghi chú
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-0.5">
                    {notesHistory.map((note) => (
                      <div
                        key={note.id}
                        className="p-2 rounded-lg bg-muted/40 border border-border/50 space-y-1 text-left"
                      >
                        <div className="flex items-center justify-between text-[10.5px] text-muted-foreground">
                          <span className="font-semibold text-foreground/90">
                            {note.author}
                          </span>
                          <span className="font-mono text-[10px]">
                            {note.timestamp}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-foreground/80 leading-relaxed">
                          {note.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
