'use client'

import {
  PaymentReceipt,
  PAYMENT_METHOD_MAP,
  RECEIPT_STATUS_MAP,
} from '@/mocks/paymentReceipts'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Panel, InfoField } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
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

  const statusLabel = RECEIPT_STATUS_MAP[receipt.status] || receipt.status

  const methodLabel =
    receipt.paymentMethod === 'bank_transfer'
      ? 'Chuyển khoản (BANK)'
      : receipt.paymentMethod === 'cash'
        ? 'Tiền mặt tại quầy'
        : receipt.paymentMethod === 'pos_card'
          ? 'Cà thẻ POS'
          : receipt.paymentMethod === 'qr_transfer'
            ? 'Chuyển khoản QR'
            : PAYMENT_METHOD_MAP[receipt.paymentMethod] || 'Chuyển khoản'

  const hasItems = receipt.items && receipt.items.length > 0
  const items = hasItems ? receipt.items! : []
  const totalConvertedAmount = receipt.totalConvertedAmount || receipt.amount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] overflow-y-auto p-5 text-xs text-foreground">
        {/* HEADER MODAL CHUẨN DESIGN SYSTEM */}
        <DialogHeader className="pr-10 pb-3 border-b">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <DialogTitle className="text-base font-semibold text-foreground">
                Thông tin phiếu thu {receipt.code}
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Đơn hàng: <span className="font-mono text-foreground font-medium">{receipt.orderCode || 'Không có mã đơn'}</span> • Học viên: <span className="text-foreground font-medium">{receipt.studentName || '—'}</span>
              </p>
            </div>

            <Badge className={`text-xs font-normal py-0.5 px-2.5 ${getStatusBadgeClass(receipt.status)}`}>
              {statusLabel}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* CỤM 1: THÔNG TIN THANH TOÁN (PANEL + INFOFIELD CHUẨN) */}
          <Panel
            title="Thông tin thanh toán"
            className="rounded-lg border bg-card p-4 space-y-3"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
              <InfoField
                label="Số tiền thanh toán"
                value={
                  <span className="font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(receipt.amount)}
                  </span>
                }
              />

              <InfoField
                label="Phương thức thanh toán"
                value={methodLabel}
              />

              <InfoField
                label="Tài khoản / Quầy thu"
                value={<span className="font-mono text-xs">{receipt.bankAccount || 'Tiền mặt tại quầy'}</span>}
              />

              <InfoField
                label="Sale tạo phiếu"
                value={receipt.createdBy}
              />

              <InfoField
                label="Chi nhánh thực hiện"
                value={receipt.branch}
              />

              <InfoField
                label="Thời gian tạo phiếu"
                value={<span className="font-mono text-xs text-muted-foreground">{receipt.createdAt}</span>}
              />

              <InfoField
                label="Cập nhật cuối cùng"
                value={<span className="font-mono text-xs text-muted-foreground">{receipt.updatedAt || receipt.createdAt}</span>}
              />
            </div>
          </Panel>

          {/* CỤM 2: GÓI HỌC THỬ & QUY ĐỔI SỐ BUỔI (CHỈ HIỂN THỊ KHI CÓ ĐƠN/GÓI HỌC) */}
          {hasItems && (
            <Panel
              title="Gói học & Số buổi quy đổi"
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="rounded-md border border-border overflow-hidden bg-background">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="font-medium text-foreground text-xs h-8">Gói học thử</TableHead>
                      <TableHead className="font-medium text-foreground text-xs text-center h-8 w-[110px]">Thời hạn</TableHead>
                      <TableHead className="font-medium text-foreground text-xs text-center h-8 w-[140px]">Thời hạn quy đổi</TableHead>
                      <TableHead className="font-medium text-foreground text-xs text-right h-8 w-[130px]">Thành tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item, idx) => (
                      <TableRow key={idx} className="hover:bg-muted/20">
                        <TableCell className="text-xs text-foreground py-2 font-normal">
                          {item.packageName || `[Gia sư][TH] Toán Tư Duy 1:6 (${item.durationText || '48 buổi'})`}
                        </TableCell>
                        <TableCell className="text-xs text-center py-2 text-muted-foreground font-mono">
                          {item.durationText || '48 buổi'}
                        </TableCell>
                        <TableCell className="text-xs text-center py-2 text-muted-foreground font-mono">
                          {item.convertedSessions || '24 buổi'}
                        </TableCell>
                        <TableCell className="text-xs text-right font-mono font-medium text-foreground py-2">
                          {formatCurrency(item.allocatedAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end items-center gap-2 text-xs text-foreground pr-1">
                <span className="text-muted-foreground">Tổng tiền quy đổi lần này:</span>
                <span className="font-medium font-mono text-sm text-foreground">
                  {formatCurrency(totalConvertedAmount)}
                </span>
              </div>
            </Panel>
          )}

          {/* CỤM 3: GHI CHÚ CHO VẬN HÀNH */}
          <Panel
            title="Ghi chú vận hành"
            className="rounded-lg border bg-card p-4 space-y-2"
          >
            <Textarea
              readOnly
              value={receipt.operationNote || (receipt.notes ? receipt.notes : '')}
              placeholder="Chưa có ghi chú cho vận hành..."
              className="min-h-[55px] text-xs resize-none bg-muted/10 border-border"
            />
          </Panel>
        </div>
      </DialogContent>
    </Dialog>
  )
}

