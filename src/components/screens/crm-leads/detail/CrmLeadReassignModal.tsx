'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UserCog,
  Search,
  Check,
  ChevronDown,
  ArrowRight,
  Building2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'
import type { Lead } from '@/mocks/crmLeads'

export interface AvailableSalesStaff {
  id: string
  name: string
  code: string
  role: string
  branch: string
  activeLeadsCount: number
  phone: string
  avatar?: string
}

export const MOCK_SALES_STAFF_LIST: AvailableSalesStaff[] = [
  {
    id: 'st-01',
    name: 'Trần Thị Mai',
    code: 'NV-0248',
    role: 'Tư vấn viên Senior',
    branch: 'RinoEdu Nguyễn Tuân',
    activeLeadsCount: 18,
    phone: '0901112233',
  },
  {
    id: 'st-02',
    name: 'Trần Thị Sale',
    code: 'NV-0195',
    role: 'Tư vấn viên Tuyển sinh',
    branch: 'RinoEdu Nguyễn Tuân',
    activeLeadsCount: 12,
    phone: '0901112244',
  },
  {
    id: 'st-03',
    name: 'Nguyễn Hoàng Sale',
    code: 'NV-0210',
    role: 'Tư vấn viên Tuyển sinh',
    branch: 'RinoEdu Linh Đàm',
    activeLeadsCount: 15,
    phone: '0903334455',
  },
  {
    id: 'st-04',
    name: 'Bùi Thu Phương',
    code: 'NV-0304',
    role: 'Tư vấn viên Tuyển sinh',
    branch: 'RinoEdu Nguyễn Tuân',
    activeLeadsCount: 9,
    phone: '0908990011',
  },
  {
    id: 'st-05',
    name: 'Đỗ Anh Tuấn',
    code: 'NV-0288',
    role: 'Tư vấn viên Tuyển sinh',
    branch: 'RinoEdu Nguyễn Tuân',
    activeLeadsCount: 14,
    phone: '0909001122',
  },
  {
    id: 'st-06',
    name: 'Lê Thị Chăm Sóc',
    code: 'NV-0155',
    role: 'Chuyên viên Tư vấn & CS',
    branch: 'RinoEdu Smart City',
    activeLeadsCount: 8,
    phone: '0902223344',
  },
]

export interface CrmLeadReassignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead
  currentStaffName: string
  onConfirmReassign: (newStaffName: string, reason: string, handoverNote: string) => void
}

export function CrmLeadReassignModal({
  open,
  onOpenChange,
  lead,
  currentStaffName,
  onConfirmReassign,
}: CrmLeadReassignModalProps) {
  const [selectedStaff, setSelectedStaff] = useState<AvailableSalesStaff | null>(null)
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const [reassignReason, setReassignReason] = useState<string>('workload_rebalance')
  const [handoverNote, setHandoverNote] = useState<string>('')

  const currentCleanName = currentStaffName.replace(/\s*\(.*?\)/g, '').trim()

  const handleModalOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedStaff(null)
      setSearchKeyword('')
      setHandoverNote('')
      setIsPopoverOpen(false)
    }
    onOpenChange(newOpen)
  }

  // Danh sách nhân sự khả dụng (loại trừ người phụ trách hiện tại)
  const filteredStaff = useMemo(() => {
    return MOCK_SALES_STAFF_LIST.filter((s) => {
      const isNotCurrent = s.name.toLowerCase() !== currentCleanName.toLowerCase()
      const q = searchKeyword.toLowerCase().trim()
      const matches =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q)

      return isNotCurrent && matches
    })
  }, [currentCleanName, searchKeyword])

  const handleConfirm = () => {
    if (!selectedStaff) {
      toast.error('Vui lòng tìm và chọn tư vấn viên tiếp nhận!')
      return
    }

    const reasonLabels: Record<string, string> = {
      workload_rebalance: 'Điều phối cân bằng tải công việc (Workload Rebalance)',
      staff_leave: 'Tư vấn viên nghỉ phép / Đổi ca trực',
      parent_request: 'Phụ huynh yêu cầu đổi người phụ trách',
      branch_transfer: 'Học viên chuyển địa điểm sang cơ sở khác',
      other: 'Lý do nghiệp vụ khác',
    }

    const reasonText = reasonLabels[reassignReason] || reassignReason

    onConfirmReassign(selectedStaff.name, reasonText, handoverNote)
    handleModalOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden text-left select-none">
        {/* Header Modal */}
        <DialogHeader className="p-4 pb-3 border-b border-border/70 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-800">
              <UserCog className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold text-foreground">
                Điều chuyển Nhân sự Phụ trách Lead
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground truncate">
                Mã: <strong className="font-mono text-foreground">{lead.code}</strong> • Học viên:{' '}
                <strong className="text-foreground">{lead.studentName}</strong> • {lead.branch || 'RinoEdu Nguyễn Tuân'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Người phụ trách hiện tại */}
          <div className="p-3 rounded-xl border border-border/70 bg-muted/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <AppAvatar name={currentCleanName} size="sm" className="h-8 w-8 shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block">Người phụ trách hiện tại:</span>
                <strong className="text-xs font-bold text-foreground block truncate">
                  {currentCleanName}
                </strong>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-semibold bg-background">
              Đang phụ trách
            </Badge>
          </div>

          {/* Ô search và chọn nhân sự mới (Popover list) */}
          <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground text-xs">
                Chọn Tư vấn viên tiếp nhận mới <span className="text-rose-500">*</span>
              </label>
              {selectedStaff && (
                <span className="text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                  {selectedStaff.activeLeadsCount} leads đang phụ trách
                </span>
              )}
            </div>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div
                  className={cn(
                    "w-full h-9 px-3 rounded-lg border bg-background flex items-center justify-between gap-2 cursor-pointer transition-all shadow-2xs select-none",
                    isPopoverOpen ? "border-primary ring-1 ring-primary/30" : "border-input hover:border-sky-400"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    {selectedStaff ? (
                      <div className="flex items-center gap-1.5 min-w-0 truncate">
                        <span className="font-semibold text-foreground text-xs">{selectedStaff.name}</span>
                        <span className="font-mono text-[10.5px] text-muted-foreground">({selectedStaff.code})</span>
                        <span className="text-[11px] text-muted-foreground truncate">• {selectedStaff.branch}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Tìm kiếm và chọn tư vấn viên...
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {selectedStaff && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedStaff(null)
                          setSearchKeyword('')
                        }}
                        className="h-5 w-5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
                        title="Bỏ chọn"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isPopoverOpen && "rotate-180")} />
                  </div>
                </div>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                sideOffset={4}
                className="w-[var(--radix-popover-trigger-width)] min-w-[340px] p-0 z-[60] shadow-md rounded-xl overflow-hidden border border-border"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {/* Ô tìm kiếm trong popover */}
                <div className="p-2 border-b border-border/70 bg-muted/20">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      placeholder="Tìm theo tên, mã NV, cơ sở..."
                      className="h-8 pl-8 pr-7 text-xs bg-background"
                      autoFocus
                    />
                    {searchKeyword && (
                      <button
                        type="button"
                        onClick={() => setSearchKeyword('')}
                        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Danh sách nhân sự trong Popover */}
                <div className="max-h-[220px] overflow-y-auto p-1.5 space-y-1">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => {
                      const isSelected = selectedStaff?.id === staff.id
                      return (
                        <div
                          key={staff.id}
                          onClick={() => {
                            setSelectedStaff(staff)
                            setSearchKeyword('')
                            setIsPopoverOpen(false)
                          }}
                          className={cn(
                            'p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between gap-2 select-none',
                            isSelected
                              ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-500 ring-1 ring-sky-500 shadow-2xs'
                              : 'bg-card hover:bg-muted/60 border-border/60 hover:border-sky-300'
                          )}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <AppAvatar name={staff.name} size="sm" className="h-7 w-7 shrink-0" />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-foreground text-xs truncate">
                                  {staff.name}
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  ({staff.code})
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span>{staff.role}</span>
                                <span>•</span>
                                <span className="flex items-center gap-0.5 truncate">
                                  <Building2 className="h-2.5 w-2.5" />
                                  {staff.branch}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10.5px] text-muted-foreground font-medium">
                              {staff.activeLeadsCount} leads
                            </span>
                            <div
                              className={cn(
                                'h-4 w-4 rounded-full border flex items-center justify-center transition-colors',
                                isSelected
                                  ? 'bg-sky-600 border-sky-600 text-white'
                                  : 'border-border bg-background'
                              )}
                            >
                              {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">
                      Không tìm thấy tư vấn viên nào phù hợp
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Lý do điều chuyển (Full width, sát cạnh phải) */}
          <div className="space-y-1.5 w-full">
            <label className="font-bold text-foreground text-xs">Lý do điều chuyển</label>
            <Select value={reassignReason} onValueChange={setReassignReason}>
              <SelectTrigger className="w-full h-8.5 text-xs bg-background">
                <SelectValue placeholder="Chọn lý do" />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <SelectItem value="workload_rebalance">
                  Điều phối cân bằng tải công việc (Workload Rebalance)
                </SelectItem>
                <SelectItem value="staff_leave">Tư vấn viên nghỉ phép / Đổi ca trực</SelectItem>
                <SelectItem value="parent_request">Phụ huynh yêu cầu đổi tư vấn viên</SelectItem>
                <SelectItem value="branch_transfer">Học viên đổi sang cơ sở khác</SelectItem>
                <SelectItem value="other">Lý do nghiệp vụ khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ghi chú bàn giao tiến độ (Full width, sát cạnh phải) */}
          <div className="space-y-1.5 w-full">
            <label className="font-bold text-foreground text-xs">Ghi chú bàn giao tiến độ</label>
            <Textarea
              value={handoverNote}
              onChange={(e) => setHandoverNote(e.target.value)}
              placeholder="Nhập thông tin cần lưu ý cho người tiếp nhận (VD: Phụ huynh ưu tiên gọi sau 18:00, đã quan tâm môn Toán...)"
              className="w-full text-xs min-h-[70px] bg-background resize-none"
            />
          </div>
        </div>

        {/* Footer Modal */}
        <DialogFooter className="p-3 border-t border-border/70 bg-muted/10 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleModalOpenChange(false)}
            className="h-8 px-3 text-xs"
          >
            Hủy
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleConfirm}
            disabled={!selectedStaff}
            className="h-8 px-4 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs gap-1.5 cursor-pointer"
          >
            <span>Xác nhận chuyển</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
