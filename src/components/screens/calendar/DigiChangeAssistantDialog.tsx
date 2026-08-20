'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FieldLabel } from '@/components/shared'
import {
  UserCheck,
  Repeat,
  Clock,
  ArrowLeftRight,
  Check,
  Search,
  ChevronDown,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface DigiChangeAssistantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAssistantName: string
  substituteAssistantName?: string
  initialScope?: 'today_only' | 'all_future'
  onConfirm: (data: { assistantName: string; isTemporaryOneDay: boolean; reason: string }) => void
}

const AVAILABLE_TEACHING_ASSISTANTS = [
  { id: 'tg-01', name: 'Trần Minh Châu', code: 'EMP-TG02', branch: 'RinoEdu Linh Đàm', role: 'Trợ giảng' },
  { id: 'tg-02', name: 'Lê Hồng Nhung', code: 'EMP-TG05', branch: 'RinoEdu Linh Đàm', role: 'Trợ giảng' },
  { id: 'tg-03', name: 'Nguyễn Văn An', code: 'EMP-TG09', branch: 'RinoEdu Linh Đàm', role: 'Trợ giảng' },
  { id: 'tg-04', name: 'Phạm Thùy Linh', code: 'EMP-TG11', branch: 'RinoEdu Linh Đàm', role: 'Trợ giảng' },
  { id: 'tg-05', name: 'Vũ Mai Hương', code: 'EMP-TG14', branch: 'RinoEdu Linh Đàm', role: 'Trợ giảng' },
  { id: 'tg-06', name: 'Đặng Mai Phương', code: 'EMP-TG18', branch: 'RinoEdu Nguyễn Tuân', role: 'Trợ giảng' },
  { id: 'tg-07', name: 'Hoàng Quốc Bảo', code: 'EMP-TG22', branch: 'RinoEdu Cầu Giấy', role: 'Trợ giảng' },
  { id: 'gv-01', name: 'Nguyễn Văn Hùng', code: 'EMP-GV01', branch: 'RinoEdu Linh Đàm', role: 'Giáo viên' },
  { id: 'gv-02', name: 'Trần Thị Mai', code: 'EMP-GV03', branch: 'RinoEdu Linh Đàm', role: 'Giáo viên' },
]

export function DigiChangeAssistantDialog({
  open,
  onOpenChange,
  currentAssistantName,
  substituteAssistantName,
  initialScope = 'today_only',
  onConfirm,
}: DigiChangeAssistantDialogProps) {
  const [prevOpen, setPrevOpen] = useState(open)
  const [scope, setScope] = useState<'today_only' | 'all_future'>(initialScope)
  const [selectedAssistant, setSelectedAssistant] = useState(substituteAssistantName || '')
  const [reason, setReason] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Reset form when dialog transitions to open without cascading effect render
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setScope(initialScope)
      setSelectedAssistant(substituteAssistantName || '')
      setReason('')
      setSearchQuery('')
      setIsSearchOpen(false)
    }
  }

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    }
  }, [isSearchOpen])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false)
      }
    }
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchOpen])

  const selectedAssistantObj = AVAILABLE_TEACHING_ASSISTANTS.find(
    (a) => a.name === selectedAssistant
  )

  const filteredAssistants = AVAILABLE_TEACHING_ASSISTANTS.filter((a) => {
    if (a.name === currentAssistantName) return false // Không chọn lại chính người đang trực
    const q = searchQuery.toLowerCase().trim()
    if (!q) return true
    return (
      a.name.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.branch.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q)
    )
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssistant) {
      toast.error('Vui lòng chọn trợ giảng thay thế.')
      return
    }
    onConfirm({
      assistantName: selectedAssistant,
      isTemporaryOneDay: scope === 'today_only',
      reason: reason.trim(),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-[480px] p-4 bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border-border">
        <DialogHeader className="pb-1 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <ArrowLeftRight className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-foreground">
                {scope === 'today_only' ? 'Phân công Dạy thay / Trực thay ca Digi' : 'Thay đổi Trợ giảng trực ca Digi'}
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Ca 18:00–21:00 • Phòng Digi (Lặp lại hàng ngày)
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          {/* Thông tin trợ giảng hiện tại */}
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Trợ giảng cố định:</span>
            <span className="font-bold text-foreground">{currentAssistantName}</span>
          </div>

          {/* Chọn phạm vi thay đổi */}
          <FieldLabel label="Phạm vi thay đổi" required>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setScope('today_only')}
                className={cn(
                  'p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer select-none',
                  scope === 'today_only'
                    ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 shadow-2xs font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                    <Clock className="h-3 w-3 text-purple-600" />
                    <span>Dạy thay / Trực thay 1 buổi</span>
                  </div>
                  {scope === 'today_only' && <Check className="h-3.5 w-3.5 text-purple-600" />}
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Chỉ áp dụng cho buổi hôm nay (19/08)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setScope('all_future')}
                className={cn(
                  'p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer select-none',
                  scope === 'all_future'
                    ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200 shadow-2xs font-semibold'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                    <Repeat className="h-3 w-3 text-purple-600" />
                    <span>Đổi cố định</span>
                  </div>
                  {scope === 'all_future' && <Check className="h-3.5 w-3.5 text-purple-600" />}
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  Đổi trợ giảng chính cho tất cả các ngày sau
                </p>
              </button>
            </div>
          </FieldLabel>

          {/* Chọn trợ giảng mới (Có ô Tìm kiếm bên trong) */}
          <div className="space-y-1 relative" ref={dropdownRef}>
            <FieldLabel label="Chọn Trợ giảng thay thế" required>
              <div className="mt-1 relative">
                <button
                  type="button"
                  onClick={() => setIsSearchOpen((prev) => !prev)}
                  className={cn(
                    'w-full h-9 px-3 text-xs rounded-lg border bg-card flex items-center justify-between transition-all cursor-pointer text-left',
                    isSearchOpen ? 'border-purple-600 ring-2 ring-purple-500/20' : 'border-border hover:bg-muted/30',
                    !selectedAssistant && 'text-muted-foreground'
                  )}
                >
                  {selectedAssistantObj ? (
                    <div className="flex items-center gap-2 truncate">
                      <div className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {selectedAssistantObj.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-foreground truncate">
                        {selectedAssistantObj.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        ({selectedAssistantObj.code}) — {selectedAssistantObj.branch}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground font-normal">
                      -- Chọn hoặc tìm kiếm trợ giảng --
                    </span>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1.5" />
                </button>

                {/* Searchable Dropdown Popup */}
                {isSearchOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-zinc-900 border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
                    {/* Ô tìm kiếm */}
                    <div className="p-2 border-b border-border/60 bg-muted/20 flex items-center gap-2">
                      <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-1" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm theo tên, mã NV, cơ sở..."
                        className="w-full bg-transparent border-none text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="h-4 w-4 rounded-full text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer p-0 border-none bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Danh sách trợ giảng */}
                    <div className="max-h-48 overflow-y-auto p-1 space-y-0.5 custom-scrollbar">
                      {filteredAssistants.length > 0 ? (
                        filteredAssistants.map((assistant) => {
                          const isSelected = selectedAssistant === assistant.name
                          return (
                            <div
                              key={assistant.id}
                              onClick={() => {
                                setSelectedAssistant(assistant.name)
                                setIsSearchOpen(false)
                              }}
                              className={cn(
                                'px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs cursor-pointer transition-colors',
                                isSelected
                                  ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 font-semibold'
                                  : 'hover:bg-muted/60 text-foreground'
                              )}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {assistant.name.charAt(0)}
                                </div>
                                <div className="truncate leading-tight">
                                  <span className="font-semibold text-xs text-foreground block truncate">
                                    {assistant.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground block truncate">
                                    {assistant.code} • {assistant.branch}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="h-3.5 w-3.5 text-purple-600 shrink-0 ml-2" />
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <div className="p-3 text-center text-xs text-muted-foreground">
                          Không tìm thấy trợ giảng nào phù hợp
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FieldLabel>
          </div>

          {/* Lý do thay đổi (Textarea nhập nhiều dòng) */}
          <FieldLabel label="Lý do / Ghi chú điều phối">
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do thay ca, dạy thay hoặc ghi chú bàn giao công việc..."
              className="w-full p-2.5 text-xs bg-muted/30 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500 font-normal mt-1 resize-y min-h-[72px]"
            />
          </FieldLabel>

          <DialogFooter className="pt-2 border-t border-border/60 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs font-semibold rounded-lg cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!selectedAssistant}
              className="h-8 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-2xs gap-1 cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Xác nhận thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
