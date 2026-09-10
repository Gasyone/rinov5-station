'use client'

import { useState } from 'react'
import { Info, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import {
  PaymentReceipt,
  PaymentMethod,
} from '@/mocks/paymentReceipts'
import { Order } from '@/mocks/orders'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InlineSelect } from '@/components/controls'
import { formatCurrency } from './paymentReceiptsHelpers'

interface PaymentReceiptPayMoreDialogProps {
  receipt?: PaymentReceipt | null
  order?: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (newReceipt: PaymentReceipt) => void
}

const METHOD_OPTIONS: { value: PaymentMethod | 'COD'; label: string }[] = [
  { value: 'COD', label: 'COD' },
  { value: 'bank_transfer', label: 'BANK (Chuyển khoản)' },
  { value: 'qr_transfer', label: 'QR CODE' },
  { value: 'cash', label: 'Tiền mặt tại quầy' },
  { value: 'pos_card', label: 'Cà thẻ POS' },
]

export function PaymentReceiptPayMoreDialog({
  receipt,
  order,
  open,
  onOpenChange,
  onSuccess,
}: PaymentReceiptPayMoreDialogProps) {
  // Lấy dữ liệu từ receipt hoặc order
  const orderCode = receipt?.orderCode || order?.orderNo || 'ORD-2026003'
  const studentName = receipt?.studentName || order?.studentName || 'Lê Chi'
  const totalOrderAmount = receipt?.orderTotalAmount || order?.finalAmount || order?.totalAmount || 2000000
  const remainingAmount = receipt?.orderRemainingAmount ?? (order?.remainingAmount ?? 2000000)
  const paidAmount1 = totalOrderAmount - remainingAmount > 0 ? (totalOrderAmount - remainingAmount) : (receipt?.amount || (order?.paidAmount ?? 0))

  const [payAmount2, setPayAmount2] = useState<string>(String(remainingAmount > 0 ? remainingAmount : 2000000))
  const [method2, setMethod2] = useState<string>('COD')
  const [isCompleteNow, setIsCompleteNow] = useState<boolean>(true)
  const [convertSessions, setConvertSessions] = useState<string>('0')

  // Ghi chú giao hàng & ghi chú vận hành
  const [shippingNote, setShippingNote] = useState<string>(receipt?.shippingNote || (order as Order & { shippingNote?: string })?.shippingNote || '')
  const [operationNote, setOperationNote] = useState<string>(receipt?.operationNote || order?.notes || '')

  const [prevOpen, setPrevOpen] = useState(open)
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      const curRemaining = receipt?.orderRemainingAmount ?? (order?.remainingAmount ?? 2000000)
      setPayAmount2(String(curRemaining > 0 ? curRemaining : 2000000))
      setMethod2('COD')
      setIsCompleteNow(true)
      setConvertSessions('0')
    }
  }

  if (!receipt && !order) return null

  const handleContinue = () => {
    const numAmount = Number(payAmount2) || 0
    if (numAmount <= 0) {
      toast.error('Vui lòng nhập số tiền thanh toán hợp lệ!')
      return
    }

    const tnxSuffix = Math.floor(270000 + Math.random() * 90000)
    const newCode = `TNX00000${tnxSuffix}`

    toast.success(`Đã ghi nhận thanh toán thêm thành công: Phiếu thu ${newCode} (+${formatCurrency(numAmount)})!`)
    if (onSuccess) {
      onSuccess({
        id: `rcpt-sub-${Date.now()}`,
        code: newCode,
        orderCode,
        amount: numAmount,
        orderTotalAmount: totalOrderAmount,
        orderRemainingAmount: Math.max(0, remainingAmount - numAmount),
        isReconciled: false,
        paymentMethod: (method2 === 'COD' ? 'cash' : method2) as PaymentMethod,
        transactionType: 'receipt',
        receiptType: 'tuition_full',
        status: 'completed',
        createdAt: new Date().toISOString(),
        createdBy: 'Nguyễn Văn Thu',
        studentName,
        parentName: receipt?.parentName || 'Phụ huynh',
        phone: receipt?.phone || '0983055652',
        branch: receipt?.branch || 'RinoEdu Cầu Giấy',
        shippingNote,
        operationNote,
      })
    }
    onOpenChange(false)
  }

  // Gói học mẫu
  const packageName =
    receipt?.items?.[0]?.packageName ||
    (order as Order & { packageName?: string })?.packageName ||
    order?.items?.[0]?.productName ||
    'Khóa học Tiếng Anh A1 (1:6 - 48 buổi)'
  const totalSessions = 48
  const convertedSessionsAlready = 24
  const calculatedConvertMoney = 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl max-h-[92vh] overflow-y-auto p-5 text-xs text-foreground">
        {/* HEADER MODAL */}
        <DialogHeader className="pr-8 pb-1 space-y-1">
          <DialogTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
            Thanh toán nhiều lần
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 pt-1">
          {/* BANNER THÔNG BÁO */}
          <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-md p-2.5 flex items-center gap-2 text-xs text-sky-800 dark:text-sky-300">
            <Info className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" />
            <span>
              Hoàn tất thanh toán đơn hàng sẽ tự động mở khóa toàn bộ hạn học, bao gồm hạn học gốc và cả ưu đãi, khuyến mại
            </span>
          </div>

          {/* KHỐI CÁC ĐỢT THANH TOÁN */}
          <div className="rounded-lg border border-border bg-card p-3.5 space-y-2.5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
              {/* Dòng 1: Số tiền còn lại cần thanh toán */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground uppercase text-xs">• Số tiền còn lại cần thanh toán:</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(remainingAmount)} (đ)
                </span>
              </div>

              {/* Ô trống bên phải */}
              <div className="hidden md:block" />

              {/* Dòng 2: Số tiền thanh toán lần 1 */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground uppercase text-xs">• Số tiền thanh toán lần 1:</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(paidAmount1)} (đ)
                </span>
              </div>

              {/* Dòng 2 phải: PTTT lần 1 + Trạng thái */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground uppercase text-xs">• Phương thức thanh toán:</span>
                  <span className="text-foreground font-medium">BANK</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-muted-foreground">• Trạng thái:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-medium">Thành công</span>
                </div>
              </div>

              {/* Dòng 3: Số tiền thanh toán lần 2 */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground uppercase text-xs">• Số tiền thanh toán lần 2 <span className="text-destructive">*</span>:</span>
                <Input
                  type="number"
                  value={payAmount2}
                  onChange={(e) => setPayAmount2(e.target.value)}
                  placeholder="Nhập số tiền"
                  className="w-36 h-7 text-xs font-mono bg-background"
                />
              </div>

              {/* Dòng 3 phải: PTTT lần 2 + Hoàn tất ngay */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground uppercase text-xs">• Phương thức thanh toán:</span>
                  <InlineSelect
                    value={method2}
                    onValueChange={setMethod2}
                    options={METHOD_OPTIONS}
                    className="w-36 h-7 text-xs bg-background"
                  />
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-foreground select-none">
                  <Checkbox
                    checked={isCompleteNow}
                    onCheckedChange={(checked) => setIsCompleteNow(Boolean(checked))}
                  />
                  <span className="text-sky-600 dark:text-sky-400 font-medium">Hoàn tất ngay</span>
                </label>
              </div>
            </div>
          </div>

          {/* THANH TỔNG TIỀN QUY ĐỔI METRIC */}
          <div className="rounded-md bg-muted/40 border border-border/70 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <span className="text-sky-700 dark:text-sky-400 font-semibold uppercase text-xs">
                Tổng tiền đã thanh toán: <span className="font-mono">{formatCurrency(paidAmount1)} đ</span>
              </span>
            </div>

            <div>
              <span className="text-rose-600 dark:text-rose-400 font-semibold uppercase text-xs">
                Tổng tiền đã quy đổi: <span className="font-mono">{formatCurrency(paidAmount1 > 0 ? paidAmount1 - 8 : 0)} đ</span>
              </span>
            </div>

            <div>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase text-xs">
                Tổng tiền có thể quy đổi: <span className="font-mono">{formatCurrency(remainingAmount)} đ</span>
              </span>
            </div>
          </div>

          {/* BẢNG GÓI HỌC THỬ & QUY ĐỔI */}
          <div className="space-y-1.5">
            <div className="rounded-lg border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="font-semibold text-muted-foreground text-xs h-8">Gói học thử</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center h-8">Tên con</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center h-8">Thời hạn</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center h-8">Thời hạn đã quy đổi</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-center h-8">Nhập thời hạn muốn quy đổi</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-xs text-right h-8">Thành tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="hover:bg-muted/20">
                    <TableCell className="text-xs text-foreground py-2 font-medium">
                      {packageName}
                    </TableCell>
                    <TableCell className="text-xs text-center text-foreground py-2">
                      {studentName}
                    </TableCell>
                    <TableCell className="text-xs text-center text-muted-foreground font-mono py-2">
                      {totalSessions} (Buổi)
                    </TableCell>
                    <TableCell className="text-xs text-center text-muted-foreground font-mono py-2">
                      {convertedSessionsAlready} (Buổi)
                    </TableCell>
                    <TableCell className="text-xs text-center py-2">
                      <div className="flex items-center justify-center gap-1">
                        <Input
                          type="number"
                          value={convertSessions}
                          onChange={(e) => setConvertSessions(e.target.value)}
                          placeholder="Nhập thời hạn"
                          className="w-16 h-6 text-xs text-center font-mono bg-background"
                        />
                        <span className="text-muted-foreground text-xs">(Buổi)</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-right font-mono text-foreground py-2">
                      {formatCurrency(calculatedConvertMoney)} (đ)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end items-center gap-1.5 text-xs text-foreground pr-1">
              <span>• Tổng tiền quy đổi lần này:</span>
              <span className="font-medium font-mono text-foreground">
                {formatCurrency(calculatedConvertMoney)} (đ)
              </span>
            </div>
          </div>

          {/* KHỐI GHI CHÚ GIAO HÀNG & NOTE VẬN HÀNH */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-0.5">
            {/* Ghi chú giao hàng */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <MessageSquare className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                <span>Note cho vận đơn / Giao hàng</span>
              </div>
              <Textarea
                value={shippingNote}
                onChange={(e) => setShippingNote(e.target.value)}
                placeholder="Nhập ghi chú giao nhận giáo trình / địa chỉ giao hàng..."
                className="min-h-[55px] text-xs resize-none bg-muted/10 border-border"
              />
            </div>

            {/* Ghi chú vận hành */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <MessageSquare className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span>Note cho vận hành</span>
              </div>
              <Textarea
                value={operationNote}
                onChange={(e) => setOperationNote(e.target.value)}
                placeholder="Nhập ghi chú cho giáo vụ / vận hành..."
                className="min-h-[55px] text-xs resize-none bg-muted/10 border-border"
              />
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 h-8 cursor-pointer uppercase tracking-wide shadow-2xs"
              onClick={handleContinue}
            >
              TIẾP TỤC
            </Button>

            <Button
              type="button"
              size="sm"
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-6 h-8 cursor-pointer uppercase tracking-wide shadow-2xs"
              onClick={() => onOpenChange(false)}
            >
              HỦY
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
