'use client'

import { useState } from 'react'
import { Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { toast } from 'sonner'
import { PaymentReceipt, ReceiptType, PaymentMethod, TransactionType } from '@/mocks/paymentReceipts'
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
import { BranchSelect, InlineSelect, SYSTEM_BRANCHES } from '@/components/controls'

interface PaymentReceiptCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateReceipt: (newReceipt: PaymentReceipt) => void
  initialTransactionType?: TransactionType
}

const ORDER_OPTIONS = [
  { value: 'OD-9230', label: 'OD-9230 • Bé An (Gói SuperKids 12T - 18.000.000 đ)' },
  { value: 'OD-9231', label: 'OD-9231 • Bé Bình (Flyers Intensive - 15.000.000 đ)' },
  { value: 'OD-9232', label: 'OD-9232 • Bé Đức (Gói Movers 1N - 28.000.000 đ)' },
  { value: 'OD-9235', label: 'OD-9235 • Bé Quốc (SuperKids 6T - 12.000.000 đ)' },
  { value: 'OD-9236', label: 'OD-9236 • Bé Hà (Gói Kindy 12T - 20.000.000 đ)' },
]

const TRANSACTION_TYPE_OPTIONS = [
  { value: 'receipt', label: '📥 Phiếu thu (Thu tiền học viên/phụ huynh)' },
  { value: 'payment_voucher', label: '📤 Phiếu chi (Hoàn tiền/Chi trả)' },
]

const RECEIPT_TYPE_OPTIONS: { value: ReceiptType; label: string }[] = [
  { value: 'deposit', label: 'Cọc giữ chỗ' },
  { value: 'tuition_full', label: 'Học phí' },
  { value: 'installment', label: 'Kỳ trả góp' },
  { value: 'event_fee', label: 'Phí sự kiện' },
  { value: 'other', label: 'Khoản khác' },
]

const VOUCHER_TYPE_OPTIONS: { value: ReceiptType; label: string }[] = [
  { value: 'refund', label: 'Hoàn tiền' },
  { value: 'other', label: 'Khoản khác' },
]

const METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'qr_transfer', label: 'Chuyển khoản QR (MBBank / Techcombank)' },
  { value: 'cash', label: 'Tiền mặt tại quầy' },
  { value: 'pos_card', label: 'Cà thẻ POS' },
  { value: 'bank_transfer', label: 'Chuyển khoản Ngân hàng' },
]

export function PaymentReceiptCreateDialog({
  open,
  onOpenChange,
  onCreateReceipt,
  initialTransactionType = 'receipt',
}: PaymentReceiptCreateDialogProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>(initialTransactionType)
  const [orderCode, setOrderCode] = useState('OD-9230')
  const [studentName, setStudentName] = useState('Bé An')
  const [parentName, setParentName] = useState('Nguyễn Thu Hà')
  const [phone, setPhone] = useState('0912345678')
  const [receiptType, setReceiptType] = useState<ReceiptType>('deposit')
  const [amount, setAmount] = useState('5000000')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qr_transfer')
  const [branch, setBranch] = useState<string>(SYSTEM_BRANCHES[0] || 'RinoEdu Linh Đàm')
  const [notes, setNotes] = useState('Thu tiền cọc học phí giữ chỗ')

  const isReceipt = transactionType === 'receipt'

  const handleTransactionTypeChange = (type: TransactionType) => {
    setTransactionType(type)
    if (type === 'payment_voucher') {
      setReceiptType('refund')
      setNotes('Chi hoàn tiền do phụ huynh yêu cầu')
    } else {
      setReceiptType('deposit')
      setNotes('Thu tiền cọc học phí giữ chỗ')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const numericAmount = Number(amount) || 0
    if (numericAmount <= 0) {
      toast.error('Vui lòng nhập số tiền giao dịch hợp lệ!')
      return
    }

    const tnxSuffix = Math.floor(270000 + Math.random() * 90000)
    const newCode = `TNX00000${tnxSuffix}`

    const newRcpt: PaymentReceipt = {
      id: `rcpt-${Date.now()}`,
      code: newCode,
      transactionType,
      orderCode,
      studentName,
      parentName,
      phone,
      receiptType,
      amount: numericAmount,
      orderTotalAmount: 18000000,
      orderRemainingAmount: isReceipt ? Math.max(0, 18000000 - numericAmount) : 0,
      paymentMethod,
      isReconciled: false,
      bankAccount:
        paymentMethod === 'qr_transfer'
          ? 'MBBank - 090327988899'
          : paymentMethod === 'pos_card'
          ? 'POS Vietcombank - 0451000'
          : paymentMethod === 'bank_transfer'
          ? 'Techcombank - 1902888899'
          : 'Tiền mặt tại quầy',
      status: 'completed',
      createdBy: 'Trần Thị Mai (Sales)',
      branch,
      createdAt: 'Vừa xong',
      notes,
    }

    onCreateReceipt(newRcpt)
    toast.success(`Đã tạo thành công ${isReceipt ? 'Phiếu thu' : 'Phiếu chi'} ${newRcpt.code}!`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="border-b pb-2">
          <div className="flex items-center gap-2">
            {isReceipt ? (
              <ArrowDownLeft className="h-5 w-5 text-emerald-600" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-rose-600" />
            )}
            <DialogTitle className="text-lg font-bold">
              {isReceipt ? 'Lập Phiếu thu mới' : 'Lập Phiếu chi / Hoàn tiền'}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-2 text-xs">
          {/* Loại giao dịch: Thu vs Chi */}
          <FieldLabel label="Loại phiếu giao dịch" required>
            <InlineSelect
              value={transactionType}
              onValueChange={(val: string) => handleTransactionTypeChange(val as TransactionType)}
              options={TRANSACTION_TYPE_OPTIONS}
              className="w-full font-semibold"
            />
          </FieldLabel>

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

          {/* Cơ sở thực hiện */}
          <FieldLabel label="Cơ sở thực hiện" required>
            <BranchSelect
              value={branch}
              onValueChange={setBranch}
              includeAll={false}
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
            <FieldLabel label="Khách hàng (Người nộp/nhận)" required>
              <Input
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Tên phụ huynh / khách hàng"
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
            <FieldLabel label="Phân loại mục đích" required>
              <InlineSelect
                value={receiptType}
                onValueChange={(val: string) => setReceiptType(val as ReceiptType)}
                options={isReceipt ? RECEIPT_TYPE_OPTIONS : VOUCHER_TYPE_OPTIONS}
                className="w-full"
              />
            </FieldLabel>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FieldLabel label={`Số tiền ${isReceipt ? 'thu' : 'chi'} (VND)`} required>
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

          <FieldLabel label="Ghi chú giao dịch">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Nhập ghi chú hoặc lý do thu/chi..."
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
            <Button
              type="submit"
              size="sm"
              className={
                isReceipt
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white gap-1'
                  : 'bg-rose-600 hover:bg-rose-700 text-white gap-1'
              }
            >
              <Check className="h-4 w-4" />
              <span>Xác nhận lập {isReceipt ? 'phiếu thu' : 'phiếu chi'}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

