'use client'

import { useState } from 'react'
import {
  Copy,
  Check,
  Pencil,
  History,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export interface FamilyContact {
  name: string
  phone: string
  relationship: string
  isPrimary?: boolean
}

export interface StudentCareHeaderClusterInfoProps {
  birthYear: string
  address: string
  contactsList: FamilyContact[]
  setContactsList: React.Dispatch<React.SetStateAction<FamilyContact[]>>
  isParentsExpanded: boolean
  setIsParentsExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

export function StudentCareHeaderClusterInfo({
  birthYear,
  address,
  contactsList,
  isParentsExpanded,
  setIsParentsExpanded,
}: StudentCareHeaderClusterInfoProps) {
  const primaryContact = contactsList.find((c) => c.isPrimary) || contactsList[0]

  return (
    <div className="space-y-1 pt-0.5">
      {/* Abbreviated NS & ĐC directly under name */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium flex-wrap">
        <span>
          <strong className="text-foreground/90 font-bold">NS:</strong> {birthYear}
        </span>
        <span className="text-border">•</span>
        <span className="truncate max-w-[280px]" title={address}>
          <strong className="text-foreground/90 font-bold">ĐC:</strong> {address}
        </span>
      </div>

      {/* ── Section: Phụ huynh ── */}
      <div className="group/parent pt-0.5 text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-2 min-w-0 w-full justify-between select-none">
          {primaryContact && (() => {
            const cleanedName =
              primaryContact.name.replace(/^[^\s]+\s+(Mẹ|Bố|Phụ huynh)\s+/i, '') || primaryContact.name
            return (
              <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate">
                <span className="font-bold text-foreground shrink-0">
                  {cleanedName} <span className="text-muted-foreground font-normal">({primaryContact.relationship})</span>
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
                  onClick={() => {
                    navigator.clipboard.writeText(primaryContact.phone)
                    toast.success(`Đã sao chép SĐT ${cleanedName}!`)
                  }}
                  className="p-1 hover:bg-muted rounded text-muted-foreground opacity-0 group-hover/parent:opacity-100 transition-opacity cursor-pointer shrink-0"
                  title="Sao chép SĐT"
                >
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            )
          })()}

          {/* Dropdown Chevron */}
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

        {/* Expanded View for All Parents */}
        {isParentsExpanded && (
          <div className="mt-2 space-y-1.5 border-t border-border/40 pt-2 text-left">
            {contactsList.map((contact, idx) => {
              const cleanedName =
                contact.name.replace(/^[^\s]+\s+(Mẹ|Bố|Phụ huynh)\s+/i, '') || contact.name
              return (
                <div
                  key={idx}
                  className="group/contact flex items-center justify-between gap-2 p-2 bg-muted/20 dark:bg-zinc-800/30 border border-border/40 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-bold text-foreground">{cleanedName}</span>
                    <span className="text-muted-foreground font-normal">({contact.relationship})</span>
                    {contact.isPrimary && (
                      <span className="text-[8.5px] font-semibold px-1.5 py-0.5 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60 dark:border-sky-900 leading-none">
                        Chính
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400 mr-1">{contact.phone}</span>
                    
                    {/* Icon Sao chép */}
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(contact.phone)
                        toast.success(`Đã sao chép SĐT ${cleanedName}!`)
                      }}
                      className="p-1 hover:bg-background/80 rounded text-muted-foreground opacity-0 group-hover/contact:opacity-100 transition-opacity cursor-pointer"
                      title="Sao chép SĐT"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export interface StudentCareHeaderClusterNoteProps {
  studentNote: string
  setStudentNote: (note: string) => void
  isEditingStudentNote: boolean
  setIsEditingStudentNote: (editing: boolean) => void
  editingStudentNoteText: string
  setEditingStudentNoteText: (text: string) => void
}

export function StudentCareHeaderClusterNote({
  studentNote,
  setStudentNote,
  isEditingStudentNote,
  setIsEditingStudentNote,
  editingStudentNoteText,
  setEditingStudentNoteText,
}: StudentCareHeaderClusterNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongNote = Boolean(studentNote && studentNote.length > 55)

  return (
    <div className="pt-2 mt-1 border-t border-border/40 w-full select-none text-left">
      {isEditingStudentNote ? (
        <div className="flex items-center gap-1.5 w-full">
          <input
            type="text"
            value={editingStudentNoteText}
            onChange={(e) => setEditingStudentNoteText(e.target.value)}
            placeholder="Nhập thói quen, sở thích và mục tiêu học tập..."
            className="flex-1 bg-background border border-amber-400 dark:border-amber-600 rounded-md px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setStudentNote(editingStudentNoteText)
                setIsEditingStudentNote(false)
                toast.success('Đã cập nhật ghi chú học viên!')
              }
              if (e.key === 'Escape') setIsEditingStudentNote(false)
            }}
          />
          <Button
            size="sm"
            className="h-6 px-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[10px] rounded-md"
            onClick={() => {
              setStudentNote(editingStudentNoteText)
              setIsEditingStudentNote(false)
              toast.success('Đã cập nhật ghi chú học viên!')
            }}
          >
            <Check className="h-3 w-3 mr-0.5" /> Lưu
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-1.5 text-muted-foreground text-[10px]"
            onClick={() => setIsEditingStudentNote(false)}
          >
            Hủy
          </Button>
        </div>
      ) : (
        <div className="group/note flex items-start justify-between gap-1.5 w-full">
          <div className="flex items-start gap-1.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                setIsEditingStudentNote(true)
                setEditingStudentNoteText(studentNote)
              }}
              className="p-0.5 mt-0.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded text-amber-600 dark:text-amber-400 shrink-0 cursor-pointer transition-colors"
              title="Sửa trực tiếp ghi chú"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>

            <div className="relative flex-1 min-w-0">
              <p
                className={cn(
                  'text-xs leading-relaxed font-semibold italic text-amber-600 dark:text-amber-400 cursor-pointer',
                  !isExpanded && 'line-clamp-2 pr-16'
                )}
                onClick={() => {
                  if (isLongNote) {
                    setIsExpanded(!isExpanded)
                  } else {
                    setIsEditingStudentNote(true)
                    setEditingStudentNoteText(studentNote)
                  }
                }}
                title={isLongNote ? (isExpanded ? 'Nhấp để thu gọn' : 'Nhấp để xem đầy đủ ghi chú') : 'Nhấp để sửa ghi chú học viên'}
              >
                {studentNote ? (
                  <>
                    {studentNote}
                    {isExpanded && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsExpanded(false)
                        }}
                        className="ml-1.5 text-[11px] font-normal not-italic text-amber-700 dark:text-amber-300 hover:underline cursor-pointer select-none"
                      >
                        Thu gọn
                      </span>
                    )}
                  </>
                ) : (
                  <span className="italic text-muted-foreground font-normal">
                    Thói quen, sở thích và mục tiêu học tập
                  </span>
                )}
              </p>

              {!isExpanded && isLongNote && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsExpanded(true)
                  }}
                  className="absolute bottom-0 right-0 bg-card dark:bg-zinc-900 pl-1.5 text-[11px] font-normal italic text-amber-700 dark:text-amber-300 hover:underline cursor-pointer select-none"
                >
                  ... xem thêm
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover/note:opacity-100 transition-opacity">
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
                    <div className="border-l-2 border-amber-500 pl-2 space-y-0.5">
                      <div className="flex justify-between text-muted-foreground text-[10px]">
                        <span>Nguyễn Văn Hùng (Bố)</span>
                        <span>26/07 14:20</span>
                      </div>
                      <p className="text-foreground italic">
                        &quot;Học viên tích cực, thích hoạt động nhóm, cần động viên nhiều hơn khi làm bài tập cá nhân.&quot;
                      </p>
                    </div>
                    <div className="border-l-2 border-border pl-2 space-y-0.5">
                      <div className="flex justify-between text-muted-foreground text-[10px]">
                        <span>Cô Hoàng Thị Mai (GV)</span>
                        <span>18/07 16:45</span>
                      </div>
                      <p className="text-muted-foreground italic">
                        &quot;Con tiếp thu kiến thức nhanh, giơ tay phát biểu nhiệt tình.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  )
}

export interface StudentCareHeaderClusterProps {
  birthYear: string
  address: string
  contactsList: FamilyContact[]
  setContactsList: React.Dispatch<React.SetStateAction<FamilyContact[]>>
  studentNote: string
  setStudentNote: (note: string) => void
  isEditingStudentNote: boolean
  setIsEditingStudentNote: (editing: boolean) => void
  editingStudentNoteText: string
  setEditingStudentNoteText: (text: string) => void
  isParentsExpanded: boolean
  setIsParentsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  isStudentNoteExpanded?: boolean
  setIsStudentNoteExpanded?: React.Dispatch<React.SetStateAction<boolean>>
}

export function StudentCareHeaderCluster({
  birthYear,
  address,
  contactsList,
  setContactsList,
  studentNote,
  setStudentNote,
  isEditingStudentNote,
  setIsEditingStudentNote,
  editingStudentNoteText,
  setEditingStudentNoteText,
  isParentsExpanded,
  setIsParentsExpanded,
}: StudentCareHeaderClusterProps) {
  return (
    <div className="space-y-2 w-full">
      <StudentCareHeaderClusterInfo
        birthYear={birthYear}
        address={address}
        contactsList={contactsList}
        setContactsList={setContactsList}
        isParentsExpanded={isParentsExpanded}
        setIsParentsExpanded={setIsParentsExpanded}
      />
      <StudentCareHeaderClusterNote
        studentNote={studentNote}
        setStudentNote={setStudentNote}
        isEditingStudentNote={isEditingStudentNote}
        setIsEditingStudentNote={setIsEditingStudentNote}
        editingStudentNoteText={editingStudentNoteText}
        setEditingStudentNoteText={setEditingStudentNoteText}
      />
    </div>
  )
}
