'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Edit3,
  ExternalLink,
  Save,
  Send,
  User,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import type {
  DepositCustomerInfo,
  DepositOrderMode,
  DepositProductItem,
  DepositType,
} from './depositOrderTypes'
import { DepositProductTable } from './DepositProductTable'
import { DepositConversionBanner } from './DepositConversionBanner'
import { DepositCustomerPanel } from './DepositCustomerPanel'

interface DepositOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialMode?: DepositOrderMode
  order?: any
  orderNo?: string
  studentId?: string
  studentName?: string
  studentPhone?: string
  studentAddress?: string
  existingDepositAmount?: number
  onSaveSuccess?: (orderData: any) => void
}

export function DepositOrderModal({
  open,
  onOpenChange,
  initialMode = 'deposit',
  order,
  orderNo = 'DH653961',
  studentId = 'HV-65396',
  studentName = 'Vũ Đình Tuấn Anh',
  studentPhone = '0963355809',
  studentAddress = 'Đường 66 Khánh Lộc, Phường Khánh Bình, Thị xã Tân Uyên, Bình Dương',
  existingDepositAmount = 6000000,
  onSaveSuccess,
}: DepositOrderModalProps) {
  const currentOrderNo = order?.orderNo || orderNo
  const currentStudentName = order?.studentName || studentName
  const currentStudentPhone = order?.customerPhone || order?.phone || studentPhone
  const currentPaid = order?.totalPaidAmount ?? order?.paidAmount ?? existingDepositAmount

  const [mode, setMode] = useState<DepositOrderMode>(initialMode)
  const [depositType, setDepositType] = useState<DepositType>('study_now')
  const [depositAmount, setDepositAmount] = useState<number>(currentPaid)
  const [convertedSessions, setConvertedSessions] = useState<number>(60)
  const [paymentMethod, setPaymentMethod] = useState<string>('BANK')
  const [orderNote, setOrderNote] = useState<string>('')
  const [classPlacementNote, setClassPlacementNote] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Products State
  const [products, setProducts] = useState<DepositProductItem[]>([
    {
      id: 'item-1',
      orderType: 'Gia hạn',
      program: 'Tiếng Anh IELTS',
      teacherType: 'Việt Nam',
      packageType: '1:6 : 72 buổi',
      productId: 'p-1',
      productName: '[IE_TUTOR][THCS] Skill Plus 1:6 72 buổi',
      quantity: 1,
      unitPrice: 7200000,
      subtotal: 7200000,
      studentName: currentStudentName,
    },
  ])

  // Customer State
  const [customer, setCustomer] = useState<DepositCustomerInfo>({
    recipientName: order?.customerName || 'Nguyễn Thị Vân',
    phone: currentStudentPhone,
    email: 'nguyenthivan@gmail.com',
    province: 'Bình Dương',
    district: 'Thị xã Tân Uyên',
    ward: 'Phường Khánh Bình',
    detailAddress: order?.shippingAddress || 'Đường 66 Khánh Lộc',
  })

  // Sync mode and order data when dialog opens
  React.useEffect(() => {
    if (open) {
      setMode(initialMode)
      if (order) {
        setDepositAmount(order.totalPaidAmount ?? order.paidAmount ?? existingDepositAmount)
        if (order.detailedItems && order.detailedItems.length > 0) {
          setProducts(
            order.detailedItems.map((di: any, idx: number) => ({
              id: `item-${idx}`,
              orderType: di.orderType === 'Mua mới' ? 'Mua mới' : 'Gia hạn',
              program: di.programName || 'Tiếng Anh IELTS',
              teacherType: di.teacherType || 'Việt Nam',
              packageType: di.durationText || di.packageType || '1:6 : 72 buổi',
              productId: di.productId || `p-${idx}`,
              productName: di.productName || '[IE_TUTOR][THCS] Skill Plus 1:6 72 buổi',
              quantity: di.quantity || 1,
              unitPrice: di.unitPrice || order.finalAmount || 7200000,
              subtotal: di.subtotal || di.unitPrice || order.finalAmount || 7200000,
              studentName: di.studentName || order.studentName || currentStudentName,
            }))
          )
        } else if (order.items && order.items.length > 0) {
          setProducts(
            order.items.map((it: any, idx: number) => ({
              id: `item-${idx}`,
              orderType: it.isRenewal ? 'Gia hạn' : 'Mua mới',
              program: it.programName || 'Tiếng Anh IELTS',
              teacherType: it.teacherType || 'Việt Nam',
              packageType: it.packageType || '1:6 : 72 buổi',
              productId: it.productId || `p-${idx}`,
              productName: it.productName || '[IE_TUTOR][THCS] Skill Plus 1:6 72 buổi',
              quantity: it.quantity || 1,
              unitPrice: it.unitPrice || order.finalAmount || 7200000,
              subtotal: it.subtotal || it.unitPrice || order.finalAmount || 7200000,
              studentName: it.studentName || order.studentName || currentStudentName,
            }))
          )
        }
        if (order.customerName || order.shippingAddress) {
          setCustomer((prev) => ({
            ...prev,
            recipientName: order.customerName || prev.recipientName,
            phone: order.customerPhone || prev.phone,
            detailAddress: order.shippingAddress || prev.detailAddress,
          }))
        }
      }
    }
  }, [open, initialMode, order, existingDepositAmount, currentStudentName])

  const totalAmount = products.reduce((acc, p) => acc + p.subtotal, 0)
  const totalSessions = 72
  const remainingSessions = Math.max(0, totalSessions - convertedSessions)

  // Product Handlers
  const handleUpdateProduct = (id: string, updates: Partial<DepositProductItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  const handleAddProduct = () => {
    const newItem: DepositProductItem = {
      id: `item-${Date.now()}`,
      orderType: 'Mua mới',
      program: 'Tiếng Anh IELTS',
      teacherType: 'Việt Nam',
      packageType: '1:6 : 48 buổi',
      productId: 'p-2',
      productName: '[IE_TUTOR][THCS] Skill booster_1:6_48 buổi',
      quantity: 1,
      unitPrice: 5550000,
      subtotal: 5550000,
      studentName: studentName || 'Vũ Đình Tuấn Anh',
    }
    setProducts((prev) => [...prev, newItem])
    toast.success('Đã thêm dòng sản phẩm mới')
  }

  const handleRemoveProduct = (id: string) => {
    if (products.length <= 1) {
      toast.error('Đơn hàng phải có ít nhất 1 sản phẩm')
      return
    }
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleUpdateCustomer = (updates: Partial<DepositCustomerInfo>) => {
    setCustomer((prev) => ({ ...prev, ...updates }))
  }

  // Submit Action
  const handleSubmit = () => {
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      if (mode === 'deposit') {
        toast.success(`Đã lưu cập nhật Đơn có cọc ${orderNo}!`, {
          description: `Số tiền cọc: ${formatCurrency(depositAmount)} (Quy đổi: ${convertedSessions} buổi)`,
        })
      } else {
        const remaining = Math.max(0, totalAmount - depositAmount)
        toast.success(`Tạo Đơn hoàn tất cọc thành công!`, {
          description: `Đơn hoàn tất: DH-${Date.now().toString().slice(-6)} · Số tiền thanh toán tiếp: ${formatCurrency(remaining)}`,
        })
      }
      onSaveSuccess?.({
        orderNo,
        mode,
        products,
        totalAmount,
        depositAmount,
        convertedSessions,
        paymentMethod,
        customer,
      })
      onOpenChange(false)
    }, 600)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[98vw] sm:max-w-[1440px] h-[92vh] flex flex-col p-0 gap-0 bg-zinc-50 dark:bg-zinc-950 text-foreground border border-border rounded-xl shadow-2xl overflow-hidden text-left"
      >
        {/* ── 1. MODAL TOP HEADER BAR ── */}
        <DialogHeader className="p-3 px-4 pb-2 bg-white dark:bg-zinc-900 shrink-0 border-b border-border/80 space-y-2">
          {/* Row 1: Left Avatar + Order/Receipt Info + Tab Pills + Right Action Buttons */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Left: Pink Avatar + Order & Receipt Codes */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-2xs font-bold shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="space-y-0.5 font-mono text-xs">
                <DialogTitle className="flex items-center gap-1.5 font-bold text-foreground text-xs leading-normal">
                  <span>ĐƠN HÀNG:</span>
                  <span className="text-foreground tracking-tight">{currentOrderNo}</span>
                </DialogTitle>
                <div className="text-[11px] text-muted-foreground">
                  PHIẾU THU:{' '}
                  <span className="font-semibold text-foreground">TNX00000099780</span>
                </div>
              </div>

              {/* Mode Selector Tab Pills */}
              <div className="flex items-center gap-1.5 pl-3 border-l border-border/60">
                <button
                  type="button"
                  onClick={() => setMode('deposit')}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs',
                    mode === 'deposit'
                      ? 'bg-purple-950 text-white dark:bg-purple-900'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                  )}
                >
                  Đơn cọc
                </button>

                <button
                  type="button"
                  onClick={() => setMode('completion')}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer shadow-2xs',
                    mode === 'completion'
                      ? 'bg-purple-950 text-white dark:bg-purple-900'
                      : 'bg-muted/70 text-muted-foreground hover:bg-muted'
                  )}
                >
                  <span>Đơn hoàn tất</span>
                  <span className="h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                    !
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                type="button"
                size="sm"
                onClick={() => toast.info(`Xem tài khoản học viên: ${studentName}`)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs h-7.5 px-3 rounded-lg shadow-2xs cursor-pointer"
              >
                XEM TÀI KHOẢN
              </Button>

              <Button
                type="button"
                size="sm"
                onClick={() => toast.info(`Chi tiết khách hàng: ${customer.recipientName}`)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs h-7.5 px-3 rounded-lg shadow-2xs cursor-pointer"
              >
                CHI TIẾT KHÁCH HÀNG
              </Button>

              {mode === 'deposit' ? (
                <Button
                  type="button"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs h-7.5 px-3 rounded-lg shadow-2xs cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 mr-1" />
                  <span>SỬA ĐƠN</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs h-7.5 px-3.5 rounded-lg shadow-2xs cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  <span>TẠO ĐƠN HOÀN TẤT</span>
                </Button>
              )}

              <Button
                type="button"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-7.5 px-3 rounded-lg shadow-2xs cursor-pointer"
              >
                THOÁT
              </Button>
            </div>
          </div>

          {/* Row 2: Sub-info bar */}
          <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">Thông tin đơn hàng</span>
              <span className="text-muted-foreground font-normal">
                Trạng thái: <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">(T5-Đã nhận bank)</strong>
              </span>
            </div>
            <div className="text-muted-foreground text-[11px]">
              Mã khách hàng: <strong className="font-mono text-foreground">{studentId}</strong>
            </div>
          </div>

          <DialogDescription className="sr-only">
            Modal quản lý và biên tập đơn có cọc hoặc hoàn tất cọc cho học viên
          </DialogDescription>
        </DialogHeader>

        {/* ── 2. MODAL BODY (SCROLLABLE 2-COLUMN LAYOUT) ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT COLUMN (Col 8 / ~70%): Product Table + Deposit Settings + Notes */}
            <div className="lg:col-span-8 space-y-4">
              {/* Product Line Items */}
              <DepositProductTable
                products={products}
                onUpdateProduct={handleUpdateProduct}
                onAddProduct={handleAddProduct}
                onRemoveProduct={handleRemoveProduct}
                studentName={studentName}
              />

              {/* Deposit / Completion Conversion Settings */}
              <DepositConversionBanner
                mode={mode}
                depositType={depositType}
                onDepositTypeChange={setDepositType}
                depositAmount={depositAmount}
                onDepositAmountChange={setDepositAmount}
                totalAmount={totalAmount}
                trialPackageName={products[0]?.productName || 'Gia hạn - Việt Nam : 1-6 : 72 buổi'}
                convertedSessions={convertedSessions}
                onConvertedSessionsChange={setConvertedSessions}
                remainingSessions={remainingSessions}
                studentName={studentName}
              />

              {/* Payment Method Select & Notes */}
              <div className="rounded-xl border bg-card p-4 space-y-3 shadow-2xs">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <span>Hình thức thanh toán</span>
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="w-full text-xs h-8.5 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BANK" className="text-xs">
                        Chuyển khoản Ngân hàng (BANK)
                      </SelectItem>
                      <SelectItem value="COD" className="text-xs">
                        Thu tiền tận nơi (COD)
                      </SelectItem>
                      <SelectItem value="CASH" className="text-xs">
                        Tiền mặt tại quầy (CASH)
                      </SelectItem>
                      <SelectItem value="MOMO" className="text-xs">
                        Ví điện tử MoMo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ghi chú đơn hàng */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">
                    Ghi chú đơn hàng
                  </Label>
                  <Textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Ghi chú về thanh toán, thỏa thuận cọc với phụ huynh..."
                    className="text-xs min-h-[56px] resize-none"
                  />
                </div>

                {/* Note cho vận hành xếp lớp */}
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-foreground">
                    Note cho vận hành xếp lớp
                  </Label>
                  <Textarea
                    value={classPlacementNote}
                    onChange={(e) => setClassPlacementNote(e.target.value)}
                    placeholder="Ghi chú về lịch học thử, trình độ học viên, khung giờ mong muốn..."
                    className="text-xs min-h-[56px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (Col 4 / ~30%): Customer Delivery Info Panel */}
            <div className="lg:col-span-4 space-y-4">
              <DepositCustomerPanel
                customer={customer}
                onUpdateCustomer={handleUpdateCustomer}
              />

              {/* Bottom Quick Contact Overview Card */}
              <div className="rounded-xl border bg-muted/30 p-3.5 space-y-2 text-xs">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-muted-foreground">
                  Thông tin người nhận
                </span>
                <p className="text-xs font-semibold text-foreground">
                  Số điện thoại: {customer.recipientName} -{' '}
                  <span className="font-mono font-normal">{customer.phone}</span>
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Địa chỉ: {customer.detailAddress}, {customer.ward}, {customer.district}, {customer.province}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
