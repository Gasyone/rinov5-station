'use client'

import { Printer, FileText } from 'lucide-react'
import { toast } from 'sonner'
import {
  PaymentReceipt,
  RECEIPT_TYPE_MAP,
  PAYMENT_METHOD_MAP,
  RECEIPT_STATUS_MAP,
} from '@/mocks/paymentReceipts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Panel, InfoField } from '@/components/shared'
import { formatCurrency } from './paymentReceiptsHelpers'

interface PaymentReceiptDetailDialogProps {
  receipt: PaymentReceipt | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentReceiptDetailDialog({
  receipt,
  open,
  onOpenChange,
}: PaymentReceiptDetailDialogProps) {
  if (!receipt) return null

  const handlePrint = () => {
    toast.success(`Đang gửi lệnh in phiếu thu ${receipt.code}...`)
    window.print()
  }

  const typeConfig = RECEIPT_TYPE_MAP[receipt.receiptType]
  const statusConfig = RECEIPT_STATUS_MAP[receipt.status]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <DialogTitle className="text-lg font-bold">
                Phiếu thu: {receipt.code}
              </DialogTitle>
            </div>
            <Badge className={statusConfig.class}>
              {statusConfig.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ngày lập: {receipt.createdAt} • Đơn hàng: <a href={`/quote/${receipt.orderCode}`} target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono">{receipt.orderCode}</a>
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Khối Tổng tiền thu */}
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                Số tiền thực thu ({typeConfig.label})
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                {formatCurrency(receipt.amount)}
              </div>
            </div>
            <Badge variant="outline" className={`text-xs px-2.5 py-1 ${typeConfig.class}`}>
              {typeConfig.label}
            </Badge>
          </div>

          {/* Thông tin người nộp & học viên */}
          <Panel title="Thông tin người nộp & Học viên">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <InfoField label="Học viên hưởng thụ" value={receipt.studentName} />
              <InfoField label="Người nộp tiền (Phụ huynh)" value={receipt.parentName} />
              <InfoField label="Số điện thoại liên hệ" value={receipt.phone} />
              <InfoField label="Chi nhánh thu tiền" value={receipt.branch} />
            </div>
          </Panel>

          {/* Thông tin phương thức & tài khoản */}
          <Panel title="Phương thức thanh toán & Giao dịch">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <InfoField label="Hình thức thu" value={PAYMENT_METHOD_MAP[receipt.paymentMethod]} />
              <InfoField label="Tài khoản thụ hưởng" value={receipt.bankAccount || 'Tiền mặt tại quầy'} />
              <InfoField label="Mã đơn hàng liên kết" value={receipt.orderCode} />
              <InfoField label="Nhân viên lập phiếu" value={receipt.createdBy} />
            </div>
          </Panel>

          {/* Ghi chú */}
          {receipt.notes && (
            <Panel title="Ghi chú phiếu thu">
              <p className="text-xs text-foreground bg-muted/40 p-2.5 rounded border">
                {receipt.notes}
              </p>
            </Panel>
          )}
        </div>

        {/* Footer Thao tác */}
        <div className="flex items-center justify-between border-t pt-3 mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" />
            <span>In biên nhận</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
