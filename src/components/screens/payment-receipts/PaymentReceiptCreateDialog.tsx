'use client'

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { PaymentReceipt, ReceiptType, PaymentMethod } from '@/mocks/paymentReceipts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FieldLabel } from '@/components/shared'
import { InlineSelect } from '@/components/controls'

interface PaymentReceiptCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateReceipt: (newReceipt: PaymentReceipt) => void
}

const ORDER_OPTIONS = [
  { value: 'OD-DRAFT-9230', label: 'OD-DRAFT-9230 • Bé An (Gói SuperKids 12T)' },
  { value: 'OD-DRAFT-9231', label: 'OD-DRAFT-9231 • Bé Bình (Flyers Intensive)' },
  { value: 'OD-DRAFT-9232', label: 'OD-DRAFT-9232 • Bé Đức (Gói Movers 1N)' },
  { value: 'OD-DRAFT-9235', label: 'OD-DRAFT-9235 • Bé Quốc (SuperKids 6T)' },
  { value: 'OD-DRAFT-9236', label: 'OD-DRAFT-9236 • Bé Hà (Gói Kindy 12T)' },
]

const TYPE_OPTIONS: { value: ReceiptType; label: string }[] = [
  { value: 'deposit', label: 'Cọc giữ chỗ' },
  { value: 'tuition_full', label: 'Thu đủ học phí' },
  { value: 'installment', label: 'Thanh toán kỳ trả góp' },
  { value: 'event_fee', label: 'Phí sự kiện / Thi thử' },
  { value: 'other', label: 'Khoản thu khác' },
]

const METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'qr_transfer', label: 'Chuyển khoản QR (MBBank / Techcombank)' },
  { value: 'cash', label: 'Tiền mặt tại quầy' },
  { value: 'pos_card', label: 'Cà thẻ POS' },
  { value: 'bank_transfer', label: 'Chuyển khoản Ngân hàng trực tiếp' },
]

export function PaymentReceiptCreateDialog({
  open,
  onOpenChange,
  onCreateReceipt,
}: PaymentReceiptCreateDialogProps) {
  const [orderCode, setOrderCode] = useState('OD-DRAFT-9230')
  const [studentName, setStudentName] = useState('Bé An')
  const [parentName, setParentName] = useState('Nguyễn Thu Hà')
  const [phone, setPhone] = useState('0912345678')
  const [receiptType, setReceiptType] = useState<ReceiptType>('deposit')
  const [amount, setAmount] = useState('5000000')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr_transfer')
  const [notes, setNotes] = useState('Thu tiền cọc học phí giữ chỗ')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numericAmount = Number(amount) || 0
    if (numericAmount <= 0) {
      toast.error('Vui lòng nhập số tiền thu hợp lệ!')
      return
    }

    const newRcpt: PaymentReceipt = {
      id: `rcpt-${Date.now()}`,
      code: `PT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      orderCode,
      studentName,
      parentName,
      phone,
      receiptType,
      amount: numericAmount,
      paymentMethod,
      bankAccount: paymentMethod === 'qr_transfer' ? 'MBBank - 090327988899' : undefined,
      status: 'completed',
      createdBy: 'Trần Thị Mai (Sales)',
      branch: 'Chi nhánh Quận 1',
      createdAt: 'Vừa xong',
      notes,
    }

    onCreateReceipt(newRcpt)
    toast.success(`Đã tạo thành công Phiếu thu ${newRcpt.code}!`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="border-b pb-2">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-600" />
            <DialogTitle className="text-lg font-bold">Lập Phiếu thu mới</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-2 text-xs">
          {/* Chọn Đơn hàng */}
          <FieldLabel label="Đơn hàng liên kết" required>
            <InlineSelect
              value={orderCode}
              onValueChange={(val: string) => {
                setOrderCode(val)
                const sel = ORDER_OPTIONS.find((o) => o.value === val)
                if (sel) {
                  const parts = sel.label.split(' • ')
                  if (parts[1]) {
                    setStudentName(parts[1].split(' (')[0])
                  }
                }
              }}
              options={ORDER_OPTIONS}
              className="w-full"
            />
          </FieldLabel>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Học viên" required>
              <Input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Tên bé"
              />
            </FieldLabel>
            <FieldLabel label="Người nộp (Phụ huynh)" required>
              <Input
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Tên phụ huynh"
              />
            </FieldLabel>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Số điện thoại" required>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912345678"
              />
            </FieldLabel>
            <FieldLabel label="Loại khoản thu" required>
              <InlineSelect
                value={receiptType}
                onValueChange={(val: string) => setReceiptType(val as ReceiptType)}
                options={TYPE_OPTIONS}
                className="w-full"
              />
            </FieldLabel>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label="Số tiền thu (VND)" required>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000000"
              />
            </FieldLabel>
            <FieldLabel label="Hình thức thanh toán" required>
              <InlineSelect
                value={paymentMethod}
                onValueChange={(val: string) => setPaymentMethod(val as PaymentMethod)}
                options={METHOD_OPTIONS}
                className="w-full"
              />
            </FieldLabel>
          </div>

          <FieldLabel label="Ghi chú phiếu thu">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú hoặc lý do thu..."
              rows={2}
            />
          </FieldLabel>

          <div className="flex items-center justify-end gap-2 border-t pt-3 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1">
              <Check className="h-4 w-4" />
              <span>Xác nhận lập phiếu</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
