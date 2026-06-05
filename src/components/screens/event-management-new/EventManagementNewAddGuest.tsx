'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SubjectSelect } from '@/components/controls'
import { mockContacts, Contact } from '@/mocks/contacts'
import { Search, UserPlus } from 'lucide-react'

interface EventManagementNewAddGuestProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (guest: { name: string; phone: string; email?: string; childName?: string; childAge?: number; trialStation?: string }) => void
}

const TRIAL_STATION_OPTIONS = [
  { value: 'Không đăng ký', label: 'Không đăng ký học thử' },
  { value: 'Robotics', label: 'Robotics & Lập trình' },
  { value: 'Toán tư duy', label: 'Toán tư duy Archimedes' },
  { value: 'Tiếng Anh', label: 'Tiếng Anh Công nghệ' },
]

export function EventManagementNewAddGuest({ isOpen, onClose, onAdd }: EventManagementNewAddGuestProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [customName, setCustomName] = useState('')
  const [customPhone, setCustomPhone] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  
  // Child information states
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')
  const [trialStation, setTrialStation] = useState('Không đăng ký')
  
  const [errorMsg, setErrorMsg] = useState('')

  // Filter contacts based on search query
  const filteredContacts = mockContacts.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.phone.includes(searchQuery)
  })

  const handleSelectContact = (c: Contact) => {
    onAdd({ 
      name: c.name, 
      phone: c.phone, 
      email: c.email,
      childName: childName.trim() || undefined,
      childAge: childAge ? parseInt(childAge) : undefined,
      trialStation: childName.trim() ? trialStation : undefined
    })
    onClose()
    resetForm()
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customName.trim() || !customPhone.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Tên và Số điện thoại phụ huynh.')
      return
    }
    onAdd({ 
      name: customName, 
      phone: customPhone, 
      email: customEmail || undefined,
      childName: childName.trim() || undefined,
      childAge: childAge ? parseInt(childAge) : undefined,
      trialStation: childName.trim() ? trialStation : undefined
    })
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setSearchQuery('')
    setCustomName('')
    setCustomPhone('')
    setCustomEmail('')
    setChildName('')
    setChildAge('')
    setTrialStation('Không đăng ký')
    setErrorMsg('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); resetForm(); }}>
      <DialogContent className="max-w-lg rounded-lg max-h-[90vh] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>Thêm khách mời mới</DialogTitle>
          <DialogDescription>
            Đăng ký đón tiếp gia đình. Chọn từ CRM có sẵn hoặc nhập thông tin trực tiếp khách vãng lai.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 py-2 min-h-0 pr-1">
          {/* Section: Child Info to attach */}
          <div className="bg-purple-50/50 dark:bg-purple-950/10 p-3 rounded-lg border border-purple-100/50 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
              Thông tin học sinh đi kèm (Nếu có)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-foreground">Họ tên con</label>
                <Input
                  placeholder="VD: Nguyễn Bảo Lâm"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-foreground">Tuổi con</label>
                <Input
                  type="number"
                  placeholder="VD: 8"
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
            {childName.trim() && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-foreground">Trạm học thử đăng ký</label>
                <SubjectSelect
                  value={trialStation}
                  options={TRIAL_STATION_OPTIONS}
                  includeAll={false}
                  variant="inline"
                  ariaLabel="Trạm học thử đăng ký"
                  onValueChange={setTrialStation}
                  className="h-8 border-solid text-xs shadow-xs"
                />
              </div>
            )}
          </div>

          {/* Tab 1: Search from CRM */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bước 1: Chọn Phụ huynh từ CRM
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nhập tên hoặc số điện thoại phụ huynh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4"
              />
            </div>

            <div className="border rounded-md max-h-36 overflow-y-auto divide-y">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(c => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center p-2.5 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleSelectContact(c)}
                  >
                    <div>
                      <p className="text-xs font-semibold">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">{c.phone} {c.email ? `· ${c.email}` : ''}</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" className="text-primary hover:bg-primary/10">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-muted-foreground">
                  Không tìm thấy phụ huynh nào khớp từ khóa.
                </div>
              )}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground">HOẶC NHẬP MỚI PHỤ HUYNH</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          {/* Tab 2: Add custom/walk-in guest */}
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Bước 2: Nhập trực tiếp phụ huynh vãng lai
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Họ và tên *</label>
                <Input
                  placeholder="VD: Nguyễn Văn A"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Số điện thoại *</label>
                <Input
                  placeholder="VD: 0912345678"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Địa chỉ Email</label>
              <Input
                placeholder="VD: nguyenvana@email.com (Tùy chọn)"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-destructive font-medium">{errorMsg}</p>
            )}

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => { onClose(); resetForm(); }}>
                Đóng
              </Button>
              <Button type="submit">
                Thêm & Điểm danh
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
