'use client'

import { useState, useMemo } from 'react'
import { Phone, Copy, ChevronDown, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CallConnectionBanner } from '@/components/screens/care/CallConnectionBanner'
import { StudentActiveCareCard } from '@/components/screens/care/StudentActiveCareCard'
import type { Lead } from '@/mocks/crmLeads'
import type { StudentCareAlert } from '@/mocks/careAlerts'

interface CrmLeadCareSectionProps {
  lead: Lead
  studentCareAlert?: StudentCareAlert
  onSaveInteraction?: (interaction: {
    channel: 'zalo' | 'telephone' | 'direct'
    outcome: string
    note: string
    parentFeedback: string
    callbackTime?: string
    closeCare?: boolean
  }) => void
}

export function CrmLeadCareSection({
  lead,
  studentCareAlert,
  onSaveInteraction,
}: CrmLeadCareSectionProps) {
  // Contact list from lead data
  const contacts = useMemo(() => {
    const list = [
      {
        name: lead.parentName || 'Nguyễn Thị Mai',
        relationship: lead.parentRole || 'Mẹ',
        phone: lead.phone || '090161294',
        isPrimary: true,
      },
    ]
    if (lead.familySiblings && lead.familySiblings.length > 0) {
      lead.familySiblings.forEach((sib: string, idx: number) => {
        list.push({
          name: sib,
          relationship: `Bé thứ ${idx + 2}`,
          phone: lead.phone || '090161294',
          isPrimary: false,
        })
      })
    }
    return list
  }, [lead.parentName, lead.parentRole, lead.phone, lead.familySiblings])

  const [selectedContactIndex, setSelectedContactIndex] = useState(0)
  const selectedContact = contacts[selectedContactIndex] || contacts[0]
  const activePhone = selectedContact.phone

  // Interaction Form State
  const [chatChannel, setChatChannel] = useState<'zalo' | 'telephone' | 'direct'>('zalo')
  const [callOutcome, setCallOutcome] = useState('da_nhan')
  const [callbackTime, setCallbackTime] = useState('')
  const [chatText, setChatText] = useState('')
  const [parentOpinionText, setParentOpinionText] = useState('')
  const [isCallActive, setIsCallActive] = useState(false)
  const [isContactPopoverOpen, setIsContactPopoverOpen] = useState(false)

  // Channel change handler
  const handleChannelChange = (val: 'zalo' | 'telephone' | 'direct') => {
    setChatChannel(val)
    if (val === 'telephone') {
      setCallOutcome('nghe_may')
    } else if (val === 'direct') {
      setCallOutcome('da_gap')
    } else {
      setCallOutcome('da_nhan')
    }
  }

  // Copy phone number
  const handleCopyPhone = () => {
    if (!activePhone) return
    navigator.clipboard
      .writeText(activePhone)
      .then(() => toast.success(`Đã sao chép SĐT: ${activePhone}`))
      .catch(() => toast.error('Không thể sao chép SĐT'))
  }

  // Handle call trigger
  const handleStartCall = () => {
    if (!activePhone || activePhone === '--') {
      toast.warning('Chưa có số điện thoại liên hệ!')
      return
    }
    setChatChannel('telephone')
    setCallOutcome('nghe_may')
    setIsCallActive(true)
    toast.info(`Đang kết nối cuộc gọi tới ${selectedContact.name} (${activePhone})...`)
  }

  // Save note only (continue care)
  const handleSave = () => {
    if (!chatText.trim() && !parentOpinionText.trim()) {
      toast.warning('Vui lòng nhập ghi chú hoặc ý kiến phụ huynh trước khi lưu!')
      return
    }
    onSaveInteraction?.({
      channel: chatChannel,
      outcome: callOutcome,
      note: chatText.trim(),
      parentFeedback: parentOpinionText.trim(),
      callbackTime,
      closeCare: false,
    })
    toast.success('Đã lưu ghi chú tương tác thành công!')
    setChatText('')
    setParentOpinionText('')
    setIsCallActive(false)
  }

  // Save & Close care
  const handleSaveAndClose = () => {
    onSaveInteraction?.({
      channel: chatChannel,
      outcome: callOutcome,
      note: chatText.trim(),
      parentFeedback: parentOpinionText.trim(),
      callbackTime,
      closeCare: true,
    })
    toast.success('Đã lưu nội dung trao đổi và đóng ca chăm sóc này!')
    setChatText('')
    setParentOpinionText('')
    setIsCallActive(false)
  }

  // Recipient label
  const recipientName = `${selectedContact.name} (${selectedContact.relationship})`

  return (
    <div className="w-full space-y-3 text-left">
      {/* Active Call Banner */}
      <CallConnectionBanner
        isActive={isCallActive}
        contactName={recipientName}
        contactPhone={activePhone}
        onEndCall={() => setIsCallActive(false)}
        onOutcomeSelect={(outcome) => setCallOutcome(outcome)}
      />

      {/* CỤM FORM CHĂM SÓC (KHÔNG VIỀN NGOÀI CÙNG - KHỚP ẢNH MẪU) */}
      <div className="w-full space-y-2 select-none">
        <div className="flex flex-col sm:flex-row gap-3 w-full items-start">
          {/* CỘT TRÁI (~240px): LIÊN HỆ, KÊNH, KẾT QUẢ, LỊCH HẸN */}
          <div className="w-full sm:w-[240px] shrink-0 space-y-2">
            {/* Box người liên hệ */}
            <div className="p-2.5 rounded-xl border border-sky-200/90 dark:border-sky-800/80 bg-white dark:bg-zinc-900 space-y-1.5 w-full shadow-3xs">
              {/* Row 1: Tên & Vai trò */}
              <div className="flex items-center justify-between gap-1.5 min-w-0 w-full">
                <Popover open={isContactPopoverOpen} onOpenChange={setIsContactPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground transition-all cursor-pointer shrink-0 select-none group bg-transparent border-0 p-0 hover:opacity-80 flex-1 min-w-0 truncate justify-start"
                      title="Mở danh sách người liên hệ"
                    >
                      <span className="font-extrabold text-sky-700 dark:text-sky-400 shrink-0">
                        {selectedContact.relationship || 'Mẹ'}
                      </span>
                      <span className="font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                        {selectedContact.name}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0 transition-colors" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-1.5 text-xs" align="start">
                    <div className="font-normal text-[11.5px] text-muted-foreground px-2 py-1 border-b border-border/40 mb-1">
                      Liên hệ cho
                    </div>
                    <div className="space-y-0.5">
                      {contacts.map((c, idx) => (
                        <button
                          key={`${c.phone}-${idx}`}
                          type="button"
                          onClick={() => {
                            setSelectedContactIndex(idx)
                            setIsContactPopoverOpen(false)
                          }}
                          className={cn(
                            'w-full text-left px-2 py-1.5 rounded text-[11.5px] font-medium flex items-center justify-between transition-colors cursor-pointer',
                            selectedContactIndex === idx
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-bold'
                              : 'hover:bg-muted text-foreground'
                          )}
                        >
                          <div className="flex flex-col">
                            <span>
                              {c.name} ({c.relationship})
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">{c.phone}</span>
                          </div>
                          {selectedContactIndex === idx && (
                            <Check className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Row 2: SĐT + Sao chép + Nút Gọi */}
              <div className="flex items-center justify-between gap-1.5 min-w-0 w-full pt-0.5">
                <span className="text-muted-foreground font-mono font-semibold text-xs truncate">
                  {activePhone}
                </span>
                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-md transition-colors cursor-pointer shrink-0"
                    title="Sao chép số điện thoại"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleStartCall}
                    className="h-6 px-2.5 text-[10.5px] font-bold rounded-md transition-colors cursor-pointer inline-flex items-center justify-center gap-1 shadow-2xs shrink-0 bg-red-600 hover:bg-red-700 text-white"
                    title={`Kích hoạt cuộc gọi cho ${recipientName}`}
                  >
                    <Phone className="h-3 w-3 fill-current" />
                    <span>Gọi</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Row 3: Kênh liên hệ */}
            <div className="flex items-center justify-between gap-2 min-w-0 w-full">
              <span className="text-xs text-muted-foreground font-medium shrink-0 w-[74px]">
                Kênh liên hệ:
              </span>
              <select
                value={chatChannel}
                onChange={(e) => handleChannelChange(e.target.value as 'zalo' | 'telephone' | 'direct')}
                className="h-7 text-xs px-2 rounded-lg border border-sky-200/90 dark:border-sky-800/80 bg-white dark:bg-zinc-900 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-3xs flex-1 min-w-0 truncate"
              >
                <option value="zalo">Zalo</option>
                <option value="telephone">Gọi điện</option>
                <option value="direct">Gặp mặt</option>
              </select>
            </div>

            {/* Row 4: Kết quả */}
            <div className="flex items-center justify-between gap-2 min-w-0 w-full">
              <span className="text-xs text-muted-foreground font-medium shrink-0 w-[74px]">
                Kết quả:
              </span>
              <select
                value={callOutcome}
                onChange={(e) => setCallOutcome(e.target.value)}
                className="h-7 text-xs px-2 rounded-lg border border-sky-200/90 dark:border-sky-800/80 bg-white dark:bg-zinc-900 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer shadow-3xs flex-1 min-w-0 truncate"
              >
                {chatChannel === 'telephone' ? (
                  <>
                    <option value="nghe_may">Nghe máy</option>
                    <option value="khong_nghe">Không nghe máy</option>
                    <option value="may_ban">Máy bận</option>
                  </>
                ) : chatChannel === 'direct' ? (
                  <>
                    <option value="da_gap">Đã gặp</option>
                    <option value="vang_mat">Vắng mặt</option>
                  </>
                ) : (
                  <>
                    <option value="da_nhan">Đã gửi tin nhắn</option>
                    <option value="da_phan_hoi">Phụ huynh đã phản hồi</option>
                  </>
                )}
              </select>
            </div>

            {/* Row 5: Lịch hẹn */}
            <div className="flex items-center justify-between gap-2 min-w-0 w-full">
              <span className="text-xs text-muted-foreground font-medium shrink-0 w-[74px]">
                Lịch hẹn:
              </span>
              <input
                type={callbackTime ? 'datetime-local' : 'text'}
                value={callbackTime}
                placeholder="Lên lịch"
                onFocus={(e) => {
                  e.target.type = 'datetime-local'
                  try {
                    e.target.showPicker()
                  } catch {}
                }}
                onBlur={(e) => {
                  if (!e.target.value) e.target.type = 'text'
                }}
                onChange={(e) => setCallbackTime(e.target.value)}
                className="h-7 text-xs px-2 rounded-lg border border-sky-200/90 dark:border-sky-800/80 bg-white dark:bg-zinc-900 text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-3xs flex-1 min-w-0 placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          {/* CỘT PHẢI: HAI KHUNG NHẬP LIỆU & NÚT LƯU */}
          <div className="flex-1 min-w-0 space-y-2 flex flex-col justify-between h-full">
            <div className="space-y-1.5 w-full">
              {/* Textarea 1: Ghi chú trao đổi (Viền xanh dương) */}
              <textarea
                rows={3}
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Nhập ghi chú tóm tắt nội dung đã trao đổi..."
                className="w-full min-h-[68px] max-h-[160px] py-2 px-3 text-xs rounded-xl border border-sky-300 dark:border-sky-700 bg-white dark:bg-zinc-900 text-foreground placeholder:text-muted-foreground/70 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/40 resize-y overflow-y-auto leading-relaxed shadow-xs transition-all"
              />

              {/* Textarea 2: Ý kiến / Phản hồi của phụ huynh (Viền xanh lá, nền trắng khớp ảnh mẫu) */}
              <textarea
                rows={1}
                value={parentOpinionText}
                onChange={(e) => setParentOpinionText(e.target.value)}
                placeholder="Nhập ý kiến / phản hồi của phụ huynh..."
                className="w-full min-h-[36px] h-[36px] max-h-[75px] py-1.5 px-3 text-xs rounded-xl border border-emerald-400 dark:border-emerald-600 bg-white dark:bg-zinc-900 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-muted-foreground/70 placeholder:font-normal resize-y overflow-y-auto leading-normal shadow-xs transition-all"
              />
            </div>

            {/* Dòng nút Thao tác & Mô tả diễn giải */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleSaveAndClose}
                  className="h-7 px-3.5 text-xs font-semibold cursor-pointer shrink-0 bg-white dark:bg-zinc-900 text-sky-600 border border-sky-400 hover:bg-sky-50 dark:text-sky-400 dark:border-sky-500 dark:hover:bg-sky-950/60 rounded-xl transition-colors shadow-none"
                  title="Lưu nội dung trao đổi và đóng ca chăm sóc này"
                >
                  Lưu & Đóng
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleSave}
                  className="h-7 px-4 text-xs font-semibold cursor-pointer shrink-0 bg-sky-400 hover:bg-sky-500 text-white rounded-xl shadow-xs"
                  title="Lưu ghi chú tương tác và tiếp tục theo dõi ca chăm sóc"
                >
                  Lưu
                </Button>
              </div>

              <div className="flex justify-end pr-0.5">
                <p className="text-[11px] text-muted-foreground/80 italic text-right leading-tight select-none">
                  * &quot;Lưu & Đóng&quot;: Lưu nội dung trao đổi và đánh dấu đóng ca chăm sóc này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ĐƯỜNG PHÂN TÁCH & CỤM ĐANG XỬ LÝ (BOTTOM CARD) */}
      <div className="border-t border-sky-100 dark:border-zinc-800 pt-2">
        <StudentActiveCareCard
          student={studentCareAlert}
          chatRecipient={recipientName}
          isCaredStatus={false}
          defaultShowMissedCalls={true}
        />
      </div>
    </div>
  )
}
