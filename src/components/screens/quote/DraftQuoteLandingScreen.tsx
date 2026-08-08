'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  CheckCircle2,
  Copy,
  PhoneCall,
  QrCode,
  ShieldCheck,
  Building2,
  Clock,
  Gift,
  Check,
  ChevronLeft,
  User,
  MapPin,
  Tag,
} from 'lucide-react'
import { formatCurrency } from '@/lib/format'
import { toast } from 'sonner'
import Link from 'next/link'
import { AddPaymentModalDialog } from '@/components/screens/care/draft-order/AddPaymentModalDialog'

interface DraftQuoteLandingScreenProps {
  quoteId: string
}

interface QuoteItemVariant {
  name: string
  durationText: string
  teacherText?: string
}

interface QuoteItem {
  id: string
  productName: string
  orderType: string
  durationText?: string
  giftText?: string
  unitPrice: number
  quantity: number
  variants?: QuoteItemVariant[]
}

interface QuoteChildGroup {
  childId: string
  childName: string
  studentCode: string
  accountPhone: string
  branch: string
  items: QuoteItem[]
}

export function DraftQuoteLandingScreen({ quoteId }: DraftQuoteLandingScreenProps) {
  const [copiedAccount, setCopiedAccount] = useState(false)
  const [copiedContent, setCopiedContent] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  const quoteNo = quoteId.toUpperCase()

  // Dynamic Quote Details matching Order Form structure
  const [orderDetails] = useState(() => {
    const defaultMock = {
      quoteNo: quoteNo,
      createdDate: '08/08/2026',
      validUntil: '15/08/2026',
      customer: {
        parentName: 'Nguyễn Thị Mai',
        role: 'Phụ huynh học viên',
        phone: '0903279888',
        email: 'nguyenthimai@gmail.com',
        address: 'Số 42 Nguyễn Tuân, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội',
      },
      delivery: {
        recipientName: 'Đặng Thiên An - 0903279888',
        address: 'Số 42 Nguyễn Tuân, Phường Thanh Xuân Trung, Quận Thanh Xuân, Hà Nội',
      },
      branch: {
        centerName: 'RinoEdu Nguyễn Tuân',
        csmName: 'Trần Nguyễn CSM',
        csmPhone: '0903.279.888',
      },
      childGroups: [
        {
          childId: 'HV-8849',
          childName: 'Đặng Thiên An',
          studentCode: 'HV-8849',
          accountPhone: '0903279888',
          branch: 'RinoEdu Nguyễn Tuân',
          items: [
            {
              id: 'item-1',
              productName: '[IE_TUTOR] Ielts Intermediate PLUS 5.0_40 buổi',
              orderType: 'Gia hạn gói học',
              durationText: '40 buổi học (Gia sư 1:1)',
              giftText: 'Tặng 1 x [IELTS] Khóa 5.0 nâng cao',
              unitPrice: 8400000,
              quantity: 1,
            },
          ],
        },
        {
          childId: 'HV-8850',
          childName: 'Đặng Quốc Bảo (Con thứ 2)',
          studentCode: 'HV-8850',
          accountPhone: '0982345678',
          branch: 'RinoEdu Nguyễn Tuân',
          items: [
            {
              id: 'item-2',
              productName: '[Station] Global Digi 288 buổi (2 station + 2 Digi/ Tuần)',
              orderType: 'Mua mới',
              unitPrice: 45564000,
              quantity: 1,
              variants: [
                {
                  name: '[Station] Tiếng Anh OMO_1:10_288 buổi',
                  durationText: '288 buổi',
                  teacherText: '--',
                },
                {
                  name: '[DIGI] Tiếng Anh Digital_288 buổi',
                  durationText: '288 buổi',
                  teacherText: '--',
                },
              ],
              giftText: 'Tặng 1 Bảng vẽ điện tử Canva & 1 Bộ Giáo trình Digital',
            },
          ],
        },
      ] as QuoteChildGroup[],
      subtotal: 53964000,
      discount: 0,
      finalAmount: 53964000,
      bankInfo: {
        bankName: 'MBBank (Ngân hàng Quân Đội)',
        accountNumber: '090327988899',
        accountName: 'CTCP GIAO DUC RINOEDU',
        transferContent: `${quoteNo} DANG THIEN AN`,
      },
    }

    if (typeof window !== 'undefined') {
      const saved =
        localStorage.getItem(`quote_data_${quoteId}`) ||
        localStorage.getItem(`quote_data_${quoteNo}`) ||
        localStorage.getItem('latest_quote_data')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          return {
            ...defaultMock,
            quoteNo: parsed.quoteNo || quoteNo,
            createdDate: parsed.createdDate || defaultMock.createdDate,
            validUntil: parsed.validUntil || defaultMock.validUntil,
            customer: parsed.customer || defaultMock.customer,
            delivery: parsed.delivery || defaultMock.delivery,
            branch: parsed.branch || defaultMock.branch,
            childGroups: parsed.childGroups && parsed.childGroups.length > 0 ? parsed.childGroups : defaultMock.childGroups,
            subtotal: parsed.subtotalAmount ?? defaultMock.subtotal,
            discount: parsed.totalDiscount ?? defaultMock.discount,
            finalAmount: parsed.finalAmount ?? defaultMock.finalAmount,
            bankInfo: {
              ...defaultMock.bankInfo,
              transferContent: `${parsed.quoteNo || quoteNo} DANG THIEN AN`,
            },
          }
        } catch (e) {
          console.error('Error parsing stored quote details:', e)
        }
      }
    }

    return defaultMock
  })

  const [totalPaidAmount, setTotalPaidAmount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved =
        localStorage.getItem(`quote_data_${quoteId}`) ||
        localStorage.getItem('latest_quote_data')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.totalPaidAmount !== undefined) return parsed.totalPaidAmount
        } catch (e) {
          console.error(e)
        }
      }
    }
    return 0
  })

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)

  const [paymentHistory, setPaymentHistory] = useState<
    Array<{
      id: string
      code: string
      amount: number
      timestamp: string
      method: string
      status: string
      convertedSessions: number
      convertedAmount: number
    }>
  >(() => {
    if (typeof window !== 'undefined') {
      const saved =
        localStorage.getItem(`quote_data_${quoteId}`) ||
        localStorage.getItem('latest_quote_data')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.paymentHistory && parsed.paymentHistory.length > 0) {
            return parsed.paymentHistory
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    return []
  })

  const handleCopy = (text: string, type: 'account' | 'content') => {
    navigator.clipboard.writeText(text)
    if (type === 'account') {
      setCopiedAccount(true)
      setTimeout(() => setCopiedAccount(false), 2000)
    } else {
      setCopiedContent(true)
      setTimeout(() => setCopiedContent(false), 2000)
    }
    toast.success('Đã sao chép vào bộ nhớ tạm!')
  }

  const handleAcceptQuote = () => {
    setIsAccepted(true)
    toast.success('Xác nhận đăng ký thành công!', {
      description: 'Bộ phận CSM của RinoEdu sẽ liên hệ xác nhận trong vòng 15 phút.',
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 font-sans pb-20 overflow-y-auto selection:bg-orange-500 selection:text-white">
      {/* ── TOP NAV HEADER WITH SOFT RED-ORANGE BRAND THEME & OFFICIAL LOGO ── */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/app/dashboard"
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 transition-colors"
              title="Quay lại Hệ thống"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-orange-50 dark:bg-zinc-800 p-1 border border-orange-200/80 dark:border-zinc-700">
                <Image
                  src="/rinoedu-logo.png"
                  alt="RinoEdu Logo"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="relative h-5 w-28">
                  <Image
                    src="/rinoedu-name.png"
                    alt="RinoEdu"
                    fill
                    sizes="110px"
                    className="object-contain object-left"
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium leading-none">
                  Hệ thống Đào tạo & Gia sư Tiêu chuẩn
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${orderDetails.branch.csmPhone}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 font-bold text-xs transition-colors cursor-pointer border border-orange-200 dark:border-orange-900/60"
            >
              <PhoneCall className="h-3.5 w-3.5 text-orange-600" />
              <span>Hotline: {orderDetails.branch.csmPhone}</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── MAIN ORDER CONTAINER ── */}
      <main className="max-w-5xl mx-auto px-4 pt-4 pb-20 space-y-4">
        {/* ── HEADER TITLE BAR ── */}
        <div className="flex items-center justify-between pb-2 flex-wrap gap-2 border-b border-slate-200/60 dark:border-zinc-800/60">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Chi tiết Đơn hàng nháp & Báo giá
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Mã báo giá: <strong className="font-mono font-bold text-slate-800 dark:text-zinc-200">{orderDetails.quoteNo}</strong>
            </p>
          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400 text-right">
            <span>Ngày lập: <strong className="text-slate-700 dark:text-zinc-300 font-medium">{orderDetails.createdDate}</strong></span>
            <span className="mx-1.5">•</span>
            <span>Hiệu lực đến: <strong className="text-slate-700 dark:text-zinc-300 font-medium">{orderDetails.validUntil}</strong></span>
          </div>
        </div>

        {/* ── SECTION 1: CUSTOMER & DELIVERY PANELS (LIGHT GRAY LABELS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Panel 1: Khách hàng (Phụ huynh) */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <User className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
              <h3 className="font-normal text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Thông tin Khách hàng</h3>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-zinc-500">Phụ huynh:</span>
                <strong className="font-bold text-slate-900 dark:text-white">{orderDetails.customer.parentName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-zinc-500">Số điện thoại:</span>
                <strong className="font-mono font-bold text-slate-900 dark:text-white">{orderDetails.customer.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-zinc-500">Email:</span>
                <span className="text-slate-700 dark:text-zinc-300">{orderDetails.customer.email}</span>
              </div>
              <div className="flex justify-between items-start gap-2 pt-0.5">
                <span className="text-slate-400 dark:text-zinc-500 shrink-0">Địa chỉ:</span>
                <span className="text-right text-slate-700 dark:text-zinc-300 font-medium">{orderDetails.customer.address}</span>
              </div>
            </div>
          </div>

          {/* Panel 2: Thông tin Cơ sở Học tập & Quản lý */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-4 space-y-2.5 shadow-2xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <Building2 className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
              <h3 className="font-normal text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Thông tin Cơ sở Học tập & Quản lý</h3>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600 dark:text-zinc-300">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-zinc-500">Cơ sở học tập:</span>
                <strong className="font-bold text-slate-900 dark:text-white">{orderDetails.branch.centerName}</strong>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-400 dark:text-zinc-500 shrink-0">Địa chỉ cơ sở học:</span>
                <span className="text-right text-slate-700 dark:text-zinc-300 font-medium">{orderDetails.delivery.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-zinc-500">Chuyên viên phụ trách (CSM):</span>
                <strong className="font-bold text-slate-900 dark:text-white">{orderDetails.branch.csmName} ({orderDetails.branch.csmPhone})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-zinc-500">Giờ hoạt động cơ sở:</span>
                <span className="text-slate-700 dark:text-zinc-300">08:00 - 21:30 (Thứ 2 - Chủ Nhật)</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: STANDALONE CHILD CARDS (MINIMALIST & LIGHT GRAY LABELS) ── */}
        <div className="space-y-3.5">
          {orderDetails.childGroups.map((childGroup: QuoteChildGroup, groupIdx: number) => (
            <div
              key={childGroup.childId}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-2xs space-y-0"
            >
              {/* Standalone Child Banner */}
              <div className="bg-slate-50 dark:bg-zinc-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-2 flex-wrap text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 font-semibold text-xs flex items-center justify-center">
                    {groupIdx + 1}
                  </div>
                  <span className="font-normal text-slate-400 dark:text-zinc-500 text-xs sm:text-sm">
                    Sản phẩm dành cho con: <span className="text-slate-800 dark:text-zinc-200 font-semibold">{childGroup.childName}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    (Mã HV: <strong className="font-normal text-slate-600 dark:text-zinc-400">{childGroup.studentCode}</strong>)
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-normal">
                  {childGroup.items.length} sản phẩm
                </span>
              </div>

              {/* Child Products List */}
              <div className="p-2.5 space-y-2.5">
                {childGroup.items.map((item: QuoteItem, itemIdx: number) => {
                  const hasVariants = item.variants && item.variants.length > 0

                  return (
                    <div key={item.id} className="space-y-1.5">
                      {/* Product Name, Quantity & Price */}
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {itemIdx + 1}. {item.productName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-normal bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-700">
                            {item.orderType}
                          </span>
                        </div>

                        {/* Inline Quantity (SL: X) & Subtotal Price (TT: X) */}
                        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                          <span className="text-slate-400">
                            SL: <strong className="font-bold text-slate-700 dark:text-zinc-300 text-xs sm:text-sm">{item.quantity}</strong>
                          </span>
                          <span className="text-slate-400">
                            TT: <strong className="font-extrabold text-orange-600 dark:text-orange-400 text-sm sm:text-base">{formatCurrency(item.unitPrice * item.quantity)}</strong>
                          </span>
                        </div>
                      </div>

                      {/* CONDITIONAL RENDERING BASED ON VARIANTS */}
                      {hasVariants ? (
                        <div className="space-y-1.5 mt-1">
                          <div className="bg-slate-50/60 dark:bg-zinc-800/30 p-2.5 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 space-y-2">
                            {item.variants!.map((variant: QuoteItemVariant, vIdx: number) => (
                              <div
                                key={vIdx}
                                className="flex items-center justify-between gap-2 text-xs border-b border-slate-200/40 dark:border-zinc-800/40 pb-1.5 last:border-b-0 last:pb-0 flex-wrap"
                              >
                                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-zinc-200">
                                  <span className="text-slate-400 font-bold">•</span>
                                  <span>{variant.name}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0 font-mono">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{variant.durationText}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5 text-slate-400" />
                                    <span>{variant.teacherText || '--'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-slate-50/60 dark:bg-zinc-800/30 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 font-normal">
                            <Gift className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span>{item.giftText ? `Quà tặng: ${item.giftText}` : 'Quà tặng: -'}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          <div className="bg-slate-50/60 dark:bg-zinc-800/30 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400">
                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">Thời lượng: <strong className="font-medium text-slate-700 dark:text-zinc-300">{item.durationText}</strong></span>
                          </div>

                          <div className="bg-slate-50/60 dark:bg-zinc-800/30 px-3 py-2 rounded-lg border border-slate-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 font-normal">
                            <Gift className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.giftText ? `Quà tặng: ${item.giftText}` : 'Quà tặng: -'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION 3: FINANCIAL CALCULATION & BANK QR (LIGHT GRAY LABELS) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-start pt-1">
          {/* Left Column (5 cols): Spacious QR Code Payment Instructions */}
          <div className="md:col-span-5 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                <h3 className="font-normal text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Hướng dẫn Thanh toán qua QR</h3>
              </div>
              <span className="text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck className="h-3.5 w-3.5" /> An toàn 100%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* QR Visual */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-center space-y-1.5">
                <div className="p-1.5 bg-white rounded-lg shadow-2xs border border-slate-200">
                  <div className="w-28 h-28 bg-slate-900 rounded-md p-2 flex flex-col justify-between items-center text-white relative">
                    <div className="w-full flex justify-between">
                      <div className="w-6 h-6 bg-white border-2 border-slate-900 rounded-xs flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-slate-900" />
                      </div>
                      <div className="w-6 h-6 bg-white border-2 border-slate-900 rounded-xs flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-slate-900" />
                      </div>
                    </div>
                    <div className="my-auto font-black text-[9px] text-amber-300 tracking-wider">
                      MBBANK QR
                    </div>
                    <div className="w-full flex justify-between items-end">
                      <div className="w-6 h-6 bg-white border-2 border-slate-900 rounded-xs flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-slate-900" />
                      </div>
                      <div className="text-[7.5px] font-mono text-zinc-300">RINOEDU</div>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-normal leading-tight">
                  Quét QR bằng App
                </span>
              </div>

              {/* Account Details */}
              <div className="sm:col-span-7 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/60">
                  <span className="text-slate-400 text-[10px] block">Ngân hàng:</span>
                  <strong className="font-bold text-slate-900 dark:text-white text-xs">{orderDetails.bankInfo.bankName}</strong>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-slate-400 text-[10px] block">Số tài khoản:</span>
                    <strong className="font-mono font-bold text-slate-900 dark:text-white text-xs truncate block">
                      {orderDetails.bankInfo.accountNumber}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(orderDetails.bankInfo.accountNumber, 'account')}
                    className="px-2 py-0.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 font-semibold text-[10.5px] flex items-center gap-1 cursor-pointer border border-orange-200 shrink-0"
                  >
                    {copiedAccount ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedAccount ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>

                <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between gap-1">
                  <div className="min-w-0">
                    <span className="text-amber-800 dark:text-amber-300 text-[10px] font-normal block">
                      Nội dung chuyển khoản:
                    </span>
                    <strong className="font-mono font-bold text-amber-900 dark:text-amber-200 text-xs truncate block">
                      {orderDetails.bankInfo.transferContent}
                    </strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(orderDetails.bankInfo.transferContent, 'content')}
                    className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100 font-semibold text-[10.5px] flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedContent ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedContent ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Financial Summary Panel */}
          <div className="md:col-span-7 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-4 space-y-3.5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-400 dark:text-zinc-500" />
                <h3 className="font-normal text-xs text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Tổng kết Học phí & Thanh toán</h3>
              </div>
            </div>

            {/* Subtotal, Discount & Final Amount Line */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-700/60 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">• Tổng các gói:</span>
                <strong className="font-bold font-mono text-slate-900 dark:text-white text-xs sm:text-sm">
                  {formatCurrency(orderDetails.subtotal)}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">• Giảm giá:</span>
                <strong className="font-bold font-mono text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">
                  - {formatCurrency(orderDetails.discount)}
                </strong>
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-[11px] block">CẦN THANH TOÁN:</span>
                <strong className="font-black font-mono text-orange-600 dark:text-orange-400 text-sm sm:text-base">
                  {formatCurrency(orderDetails.finalAmount)}
                </strong>
              </div>
            </div>

            {/* Lịch sử thanh toán & Quy đổi */}
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/40 border border-slate-200/80 dark:border-zinc-700/60 space-y-2 text-xs">
              <div className="flex justify-between items-center pb-1.5 border-b border-slate-200/50 dark:border-zinc-700/50">
                <span className="font-normal text-slate-400 dark:text-zinc-500 text-[11px] uppercase tracking-wider">
                  SỐ TIỀN ĐÃ THANH TOÁN:
                </span>
                <span className="font-extrabold font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                  {formatCurrency(totalPaidAmount)}
                </span>
              </div>

              {/* Lịch sử giao dịch & Quy đổi */}
              <div className="space-y-1.5 pt-1">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((pm) => (
                    <div key={pm.id} className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-700/60 text-xs font-mono space-y-1">
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>{pm.timestamp} (Phiếu thu)</span>
                        <span className="text-emerald-600 font-bold">THÀNH CÔNG</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {pm.code}: <span className="text-emerald-600 dark:text-emerald-400">{formatCurrency(pm.amount)}</span> ({pm.method})
                      </div>
                      <div className="text-xs text-slate-400 pt-1 border-t border-slate-100 dark:border-zinc-800 flex justify-between font-sans flex-wrap gap-2">
                        <span>Quy đổi: <strong className="text-slate-700 dark:text-zinc-300">{pm.convertedSessions} buổi</strong></span>
                        <span>Tiền quy đổi: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(pm.convertedAmount)}</strong></span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-[11px] text-slate-400 font-normal italic">
                    Chưa ghi nhận phiếu thu thanh toán
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons: THANH TOÁN THÊM + ĐỒNG Ý ĐĂNG KÝ & THANH TOÁN */}
            <div className="space-y-2 pt-1">
              {totalPaidAmount > 0 && totalPaidAmount < orderDetails.finalAmount && (
                <button
                  type="button"
                  onClick={() => setIsAddPaymentOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>THANH TOÁN THÊM ({formatCurrency(orderDetails.finalAmount - totalPaidAmount)})</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleAcceptQuote}
                disabled={isAccepted}
                className={`w-full py-3 rounded-xl font-extrabold text-xs uppercase tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                  isAccepted
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-98'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isAccepted ? 'ĐÃ XÁC NHẬN ĐĂNG KÝ' : 'ĐỒNG Ý ĐĂNG KÝ & THANH TOÁN'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Payment Modal Dialog for Landing Page */}
      <AddPaymentModalDialog
        open={isAddPaymentOpen}
        onOpenChange={setIsAddPaymentOpen}
        orderNo={orderDetails.quoteNo}
        remainingAmount={Math.max(0, orderDetails.finalAmount - totalPaidAmount)}
        onAddPayment={(amount, method, note) => {
          setTotalPaidAmount((prev) => prev + amount)
          setPaymentHistory((prev) => [
            ...prev,
            {
              id: `tx-${Date.now()}`,
              code: note,
              amount: amount,
              timestamp: `${new Date().toLocaleTimeString('vi-VN')} - ${new Date().toLocaleDateString('vi-VN')}`,
              method: method,
              status: 'completed',
              convertedSessions: Math.round(amount / 210000),
              convertedAmount: amount,
            },
          ])
          toast.success(`Đã nhận thanh toán thêm ${formatCurrency(amount)} (${method}) thành công!`, {
            description: `Mã phiếu thu: ${note}`,
          })
        }}
      />

      {/* ── STICKY FOOTER BAR FOR MOBILE / QUICK ACTION ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200 dark:border-zinc-800 p-3 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="text-[11px] text-slate-400 font-normal block">Tổng học phí cần thanh toán:</span>
            <span className="text-lg font-black text-orange-600 dark:text-orange-400">
              {formatCurrency(orderDetails.finalAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${orderDetails.branch.csmPhone}`}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors inline-flex items-center gap-1.5"
            >
              <PhoneCall className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden sm:inline">Gọi CSM</span>
            </a>

            <button
              type="button"
              onClick={handleAcceptQuote}
              disabled={isAccepted}
              className={`px-4 py-2 rounded-lg font-extrabold text-xs uppercase tracking-wide transition-all shadow-sm cursor-pointer flex items-center gap-1.5 ${
                isAccepted
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-orange-500 hover:bg-orange-600 text-white active:scale-98'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isAccepted ? 'ĐÃ XÁC NHẬN' : 'XÁC NHẬN & THANH TOÁN'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
