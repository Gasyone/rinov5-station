'use client'

import { useState, useEffect } from 'react'
import {
  Pencil,
  Check,
  ShieldCheck,
  Copy,
  ChevronDown,
  ChevronUp,
  History,
  Eye,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AppAvatar } from './AppAvatar'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import type { ParentMemberInfo } from './StudentParentInfoCards'

export interface StudentHeaderInfoCardProps {
  onToggleVersion?: () => void
  studentAvatar?: string
  studentName: string
  englishName?: string
  onSaveEnglishName?: (newEnglishName: string) => void
  status?: string
  statusKey?: string
  statusLabel?: string
  birthDate?: string
  gender?: string
  address?: string
  cid?: string
  uid?: string
  sid?: string
  initialNote?: string
  parents?: ParentMemberInfo[]
  onOpenRoadmap?: () => void
  className?: string
}

export function StudentHeaderInfoCard({
  studentAvatar,
  studentName,
  englishName = '',
  onSaveEnglishName,
  status = 'Đang học',
  statusKey,
  statusLabel,
  birthDate = '15/03/2005',
  gender = 'Nam',
  address = 'Số 49 Nguyễn Tuân, Nam Từ Liêm, Hà Nội',
  cid = 'VH230994',
  uid = '111185',
  sid = '193060',
  initialNote = 'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.',
  parents,
  className,
}: StudentHeaderInfoCardProps) {
  // English Name state
  const [currentEnglishName, setCurrentEnglishName] = useState(englishName)
  const [tempEnglishName, setTempEnglishName] = useState(englishName)
  const [isEditingEnglishName, setIsEditingEnglishName] = useState(false)

  useEffect(() => {
    setCurrentEnglishName(englishName)
    setTempEnglishName(englishName)
  }, [englishName])

  const handleEnglishNameChange = (val: string) => {
    setTempEnglishName(val)
    setCurrentEnglishName(val)
    if (onSaveEnglishName) {
      onSaveEnglishName(val)
    }
  }

  // Student Note States
  const [noteText, setNoteText] = useState(initialNote)
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [editingNoteText, setEditingNoteText] = useState(initialNote)
  const [isStudentNoteExpanded, setIsStudentNoteExpanded] = useState(false)

  // Codes section state
  const [showCodes, setShowCodes] = useState(false)

  // Default Parents Fallback
  const defaultParents: ParentMemberInfo[] = [
    {
      name: 'Nguyễn Văn A',
      relationship: 'Bố',
      isPrimary: true,
      phone: '0922222222',
    },
    {
      name: 'Nguyễn Thị Lan',
      relationship: 'Mẹ',
      isPrimary: false,
      phone: '0922222223',
    },
  ]

  // Contacts / Parents List State
  const [contactsList, setContactsList] = useState<ParentMemberInfo[]>(
    parents && parents.length > 0 ? parents : defaultParents
  )

  useEffect(() => {
    if (parents && parents.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContactsList(parents)
    }
  }, [parents])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNoteText(initialNote)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditingNoteText(initialNote)
  }, [initialNote])

  // Parents section expansion state
  const [isParentsExpanded, setIsParentsExpanded] = useState(false)

  const primaryContact = contactsList.find((c) => c.isPrimary) || contactsList[0]

  const mockStudentNoteHistory = [
    { id: '1', author: 'CSM Quỳnh Anh', date: '25/06/2025 10:15', content: 'Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.' },
    { id: '2', author: 'CS Lan Anh', date: '10/04/2025 14:30', content: 'Học viên hay đi trễ 5-10 phút, cần nhắc nhở trước buổi học.' },
    { id: '3', author: 'CSM Thu Hà', date: '15/01/2025 09:00', content: 'Học viên mới nhập học, cần theo dõi sát trong 2 tuần đầu.' },
  ]

  const handleCopyCode = async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success(`Đã sao chép ${label}: ${code}`)
    } catch {
      toast.error(`Không thể sao chép ${label}`)
    }
  }

  const handleCopyPhone = async (phone: string, name: string) => {
    try {
      await navigator.clipboard.writeText(phone)
      toast.success(`Đã sao chép SĐT của ${name}: ${phone}`)
    } catch {
      toast.error('Không thể sao chép SĐT')
    }
  }

  return (
    <div className={cn('rounded-xl border border-border/70 bg-card p-4 space-y-2.5 shadow-2xs shrink-0', className)}>
      <div className="flex items-start gap-3.5 min-w-0">
        {/* Avatar */}
        <div className="relative shrink-0 mt-0.5">
          <AppAvatar src={studentAvatar} name={studentName} size="xl" className="h-16 w-16 border-2 border-primary/40 shadow-sm shrink-0" />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Top Row: Student Name + English Name + Status Badge */}
          <div className="flex items-center gap-2 flex-wrap leading-tight">
            <span className="text-base font-extrabold text-foreground tracking-tight">{studentName}</span>

            {/* English Name Inline Editor Popover */}
            <Popover open={isEditingEnglishName} onOpenChange={setIsEditingEnglishName}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer border border-transparent select-none",
                    currentEnglishName
                      ? "bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground border-dashed border-border"
                  )}
                  title="Bấm để chỉnh sửa tên tiếng Anh"
                >
                  <span>{currentEnglishName ? `(${currentEnglishName})` : '+ Thêm tên TA'}</span>
                  <Pencil className="h-3 w-3 opacity-70 hover:opacity-100" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-3 space-y-2.5" align="start">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Chỉnh sửa Tên Tiếng Anh</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingEnglishName(false)}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                    title="Đóng"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <Input
                    value={tempEnglishName}
                    onChange={(e) => handleEnglishNameChange(e.target.value)}
                    placeholder="Nhập tên tiếng Anh (VD: Alex)"
                    className="h-8 text-xs pr-7"
                    autoFocus
                  />
                  {tempEnglishName ? (
                    <button
                      type="button"
                      onClick={() => handleEnglishNameChange('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors cursor-pointer"
                      title="Xóa tên tiếng Anh"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </PopoverContent>
            </Popover>

            <StatusBadge
              status={statusKey || status}
              label={statusLabel || (status.includes('_') ? undefined : status)}
              className="text-[10px] font-bold py-0.5 px-2.5 shadow-none"
            />
          </div>

          {/* Row 1: NS, Giới tính, ĐC + Toggle Icon Button Mở rộng Mã */}
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground font-medium flex-wrap pt-0.5">
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <span>
                <strong className="text-foreground/90 font-bold">NS:</strong> {birthDate} &bull; {gender}
              </span>
              <span className="text-border">•</span>
              <span className="truncate max-w-[280px]" title={address}>
                <strong className="text-foreground/90 font-bold">ĐC:</strong> {address}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowCodes((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1 text-[10px] transition-colors cursor-pointer select-none shrink-0 py-0.5",
                showCodes
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
              title={showCodes ? "Ẩn danh sách mã hệ thống" : "Hiện mã CID, UID, SID"}
            >
              <ShieldCheck className="h-3 w-3 text-primary" />
              <span>Mã ID</span>
              <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", showCodes && "rotate-180")} />
            </button>
          </div>

          {/* Row 2: Codes CID, UID, SID */}
          {showCodes && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground select-none py-1.5 px-2.5 bg-muted/40 dark:bg-zinc-800/40 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="flex items-center gap-1 font-mono text-[11px]">
                <ShieldCheck className="h-3 w-3 text-primary" /> CID: <strong className="text-foreground font-semibold">{cid}</strong>
                <button
                  type="button"
                  onClick={() => handleCopyCode(cid, 'Mã CID')}
                  className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                  title="Sao chép CID"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                UID: <strong className="text-foreground font-semibold">{uid}</strong>
                <button
                  type="button"
                  onClick={() => handleCopyCode(uid, 'Mã UID')}
                  className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                  title="Sao chép UID"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1 font-mono text-[11px]">
                SID: <strong className="text-foreground font-semibold">{sid}</strong>
                <button
                  type="button"
                  onClick={() => handleCopyCode(sid, 'Mã SID')}
                  className="p-0.5 hover:text-foreground text-muted-foreground transition-colors cursor-pointer rounded hover:bg-muted/80 ml-0.5"
                  title="Sao chép SID"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </span>
            </div>
          )}

          {/* ── Section: Phụ huynh (Chỉ thông tin liên hệ, không ghi chú) ── */}
          <div className="group/parent pt-0.5 text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-2 min-w-0 w-full justify-between select-none">
              {primaryContact && (
                <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                  <span className="font-bold text-foreground shrink-0">
                    {primaryContact.name} <span className="text-muted-foreground font-normal">({primaryContact.relationship})</span>
                  </span>
                  {primaryContact.isPrimary && (
                    <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900 leading-none shrink-0">
                      Chính
                    </span>
                  )}
                  <span className="text-border">•</span>
                  <span className="font-mono font-bold text-sky-600 dark:text-sky-400 shrink-0">{primaryContact.phone}</span>

                  {/* Icon Sao chép SĐT */}
                  <button
                    type="button"
                    onClick={() => handleCopyPhone(primaryContact.phone, primaryContact.name)}
                    className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover/parent:opacity-100 transition-opacity cursor-pointer shrink-0"
                    title={`Sao chép SĐT ${primaryContact.name}`}
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Nút Chevron toggle danh sách Phụ huynh nếu có > 1 người */}
              {contactsList.length > 1 && (
                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsParentsExpanded(!isParentsExpanded)}
                    className="p-1 hover:bg-muted rounded text-sky-600 dark:text-sky-400 cursor-pointer shrink-0 transition-colors"
                    title={isParentsExpanded ? 'Thu gọn danh sách phụ huynh' : `Xem chi tiết phụ huynh (${contactsList.length})`}
                  >
                    {isParentsExpanded ? (
                      <ChevronUp className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* View mở rộng cho tất cả Phụ huynh */}
            {isParentsExpanded && contactsList.length > 1 && (
              <div className="mt-2 space-y-1.5 border-t border-border/40 pt-2 text-left">
                {contactsList.map((contact, idx) => (
                  <div
                    key={idx}
                    className="group/contact flex items-center justify-between gap-2 p-2 bg-muted/20 dark:bg-zinc-800/30 border border-border/40 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                      <span className="font-bold text-foreground">{contact.name}</span>
                      <span className="text-muted-foreground font-normal">({contact.relationship})</span>
                      {contact.isPrimary && (
                        <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900 leading-none">
                          Chính
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-mono font-bold text-sky-600 dark:text-sky-400 mr-1">{contact.phone}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPhone(contact.phone, contact.name)}
                        className="p-1 hover:bg-background/80 rounded text-muted-foreground opacity-0 group-hover/contact:opacity-100 transition-opacity cursor-pointer"
                        title={`Sao chép SĐT ${contact.name}`}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section: Ghi chú học viên (FULL HÀNG - SÁT CẠNH TRÁI) ── */}
      <div className="pt-2 border-t border-border/30 w-full">
        {isEditingNote ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={editingNoteText}
              onChange={(e) => setEditingNoteText(e.target.value)}
              placeholder="Thói quen, sở thích và mục tiêu học tập"
              className="flex-1 bg-background border border-amber-400 dark:border-amber-600 rounded-md px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setNoteText(editingNoteText)
                  setIsEditingNote(false)
                  toast.success('Đã cập nhật ghi chú học viên!')
                }
                if (e.key === 'Escape') setIsEditingNote(false)
              }}
            />
            <Button
              size="sm"
              className="h-6 px-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] rounded-md cursor-pointer"
              onClick={() => {
                setNoteText(editingNoteText)
                setIsEditingNote(false)
                toast.success('Đã cập nhật ghi chú học viên!')
              }}
            >
              <Check className="h-3 w-3 mr-0.5" /> Lưu
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-muted-foreground text-[10px] cursor-pointer"
              onClick={() => setIsEditingNote(false)}
            >
              Hủy
            </Button>
          </div>
        ) : (
          <div className="group/note flex items-center justify-between gap-1.5 py-0.5 rounded-md text-left bg-transparent border-none w-full select-none">
            <div
              className="flex items-center gap-1.5 flex-1 min-w-0 cursor-pointer"
              onClick={() => {
                setIsEditingNote(true)
                setEditingNoteText(noteText)
              }}
              title="Nhấp để sửa ghi chú học viên"
            >
              <button
                type="button"
                className="p-1 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded text-amber-600 dark:text-amber-400 shrink-0 cursor-pointer transition-colors"
                title="Sửa trực tiếp ghi chú"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>

              <p
                className={cn(
                  'text-xs leading-tight flex-1 min-w-0 transition-all',
                  !isStudentNoteExpanded && 'truncate'
                )}
              >
                {noteText ? (
                  <span className="font-semibold italic text-amber-600 dark:text-amber-400">
                    {noteText}
                  </span>
                ) : (
                  <span className="italic text-muted-foreground font-normal">
                    Thói quen, sở thích và mục tiêu học tập
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {noteText.length > 40 && (
                <button
                  type="button"
                  onClick={() => setIsStudentNoteExpanded(!isStudentNoteExpanded)}
                  className="p-1 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded text-amber-600 dark:text-amber-400 cursor-pointer transition-colors"
                  title={isStudentNoteExpanded ? 'Thu gọn ghi chú' : 'Xem thêm ghi chú đầy đủ'}
                >
                  {isStudentNoteExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              )}

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="p-1 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded text-amber-600 dark:text-amber-400 cursor-pointer transition-colors"
                    title="Xem lịch sử thay đổi ghi chú học viên"
                  >
                    <History className="h-3.5 w-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3 text-xs z-50 shadow-md border bg-popover text-popover-foreground" align="end">
                  <div className="space-y-2 text-left">
                    <h5 className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 border-b pb-1.5">
                      <History className="h-3.5 w-3.5" />
                      Lịch sử ghi chú học viên
                    </h5>
                    <div className="space-y-2 text-[11px]">
                      {mockStudentNoteHistory.map((entry) => (
                        <div key={entry.id} className="border-l-2 border-amber-500 pl-2 space-y-0.5">
                          <div className="flex justify-between text-muted-foreground text-[10px]">
                            <span>{entry.author}</span>
                            <span>{entry.date}</span>
                          </div>
                          <p className="text-foreground italic">
                            &quot;{entry.content}&quot;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
