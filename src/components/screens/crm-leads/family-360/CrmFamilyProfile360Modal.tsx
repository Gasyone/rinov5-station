/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import {
  X,
  ExternalLink,
  Users,
  ShoppingCart,
  Receipt,
  Truck,
  GraduationCap,
  Heart,
  MapPin,
  Navigation,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Lead } from '@/mocks/crmLeads'
import type {
  Family360TabKey,
  FamilyParentContact,
  FamilyChildItem,
} from './crmFamily360Types'
import {
  extractFamilyParents,
  extractFamilyChildren,
  extractFamilyLeadOccurrences,
  extractFamilyOrders,
  extractFamilyPayments,
  extractFamilyDeliveries,
} from './crmFamily360Helpers'

// Tabs
import { CrmFamilyParentsTab } from './tabs/CrmFamilyParentsTab'
import { CrmFamilyChildrenTab } from './tabs/CrmFamilyChildrenTab'
import { CrmFamilyOrdersTab } from './tabs/CrmFamilyOrdersTab'
import { CrmFamilyPaymentsTab } from './tabs/CrmFamilyPaymentsTab'
import { CrmFamilyDeliveriesTab } from './tabs/CrmFamilyDeliveriesTab'

export interface CrmFamilyProfile360ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead?: Lead | null
  initialTab?: Family360TabKey
  onUpdateLead?: (updatedLead: Lead) => void
}

export function CrmFamilyProfile360Modal({
  open,
  onOpenChange,
  lead,
  initialTab = 'parents',
  onUpdateLead,
}: CrmFamilyProfile360ModalProps) {
  // Chuyển tab 'leads' sang 'children' nếu được truyền từ ngoài
  const normalizedInitialTab = initialTab === 'leads' ? 'children' : initialTab
  const [activeTab, setActiveTab] = useState<Family360TabKey>(normalizedInitialTab)

  const [parents, setParents] = useState<FamilyParentContact[]>([])
  const [children, setChildren] = useState<FamilyChildItem[]>([])

  useEffect(() => {
    if (!open) return
    setActiveTab(normalizedInitialTab)
    setParents(extractFamilyParents(lead || null))
    setChildren(extractFamilyChildren(lead || null))
  }, [open, lead, normalizedInitialTab])

  const leadOccurrences = useMemo(
    () => extractFamilyLeadOccurrences(lead || null),
    [lead]
  )
  const orders = useMemo(() => extractFamilyOrders(lead || null), [lead])
  const payments = useMemo(
    () => extractFamilyPayments(lead || null, orders),
    [lead, orders]
  )
  const deliveries = useMemo(
    () => extractFamilyDeliveries(lead || null, orders),
    [lead, orders]
  )

  const familyCode = lead?.parentId || lead?.code || 'FAM-10291'
  const primaryParent = parents.find((p) => p.isPrimary) || parents[0]
  const defaultAddress =
    primaryParent?.address || lead?.address || 'Phường Bến Nghé, Quận 1, TP.HCM'
  const defaultBranches = primaryParent?.nearestBranches || [
    { name: 'RinoEdu Linh Đàm', distance: '1.2 km' },
    { name: 'RinoEdu Nguyễn Tuân', distance: '3.5 km' },
    { name: 'RinoEdu Smart City', distance: '5.2 km' },
  ]

  // Title viết thường tự nhiên, không in hoa toàn bộ, không có 360
  const familyTitle = primaryParent
    ? `Hồ sơ gia đình: ${primaryParent.name} (${primaryParent.role})`
    : `Hồ sơ gia đình • ${familyCode}`

  const handleOpenFullDirectory = () => {
    window.open('/app/contact_directory', '_blank')
  }

  const handleUpdateParents = (newParents: FamilyParentContact[]) => {
    setParents(newParents)
    if (lead && onUpdateLead) {
      const main = newParents.find((p) => p.isPrimary) || newParents[0]
      const updated: Lead = {
        ...lead,
        parentName: main?.name || lead.parentName,
        parentRole: main?.role || lead.parentRole,
        phone: main?.phone || lead.phone,
        email: main?.email || lead.email,
        address: main?.address || lead.address,
        otherParents: newParents.slice(1).map((p) => ({
          name: p.name,
          phone: p.phone,
          role: p.role,
          email: p.email,
          occupation: p.occupation,
          financialSegment: p.financialSegment,
          budgetPerMonth: p.budgetPerMonth,
          decisionMakerRole: p.decisionMakerRole,
          preferredChannel: p.preferredChannel,
          bestTimeToCall: p.bestTimeToCall,
          address: p.address,
        })),
      }
      onUpdateLead(updated)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[96vw] sm:max-w-[1360px] max-w-[1360px] h-[90vh] max-h-[90vh] flex flex-col p-0 border-border shadow-2xl rounded-xl gap-0 overflow-hidden bg-[#f8fafc] dark:bg-zinc-950"
        style={{ maxWidth: '1360px', width: '96vw', height: '90vh' }}
      >
        {/* ============================================================ */}
        {/* 1. HEADER DIALOG (ĐỊA CHỈ & KHOẢNG CÁCH CƠ SỞ MẶC ĐỊNH)       */}
        {/* ============================================================ */}
        <DialogHeader className="sticky top-0 z-30 flex flex-col gap-2 px-5 py-3 bg-white dark:bg-zinc-900 border-b border-border shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 shrink-0">
                <Heart className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <DialogTitle className="text-sm sm:text-base font-bold text-foreground truncate">
                  {familyTitle}
                </DialogTitle>
                <span className="font-mono text-xs text-muted-foreground hidden sm:inline">
                  • Mã: {familyCode}
                </span>
              </div>
              <DialogDescription className="sr-only">Hồ sơ gia đình</DialogDescription>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenFullDirectory}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.2 rounded-md text-xs text-primary hover:bg-primary/10 transition-colors cursor-pointer border border-primary/20"
                title="Mở toàn màn hình danh bạ"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Xem chi tiết danh bạ</span>
              </button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7.5 px-3 text-xs font-medium cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <X className="mr-1 h-3 w-3" />
                <span>Đóng</span>
              </Button>
            </div>
          </div>

          {/* Dòng 2: Địa chỉ gia đình & Khoảng cách 3 cơ sở gần nhất mặc định */}
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground pt-1.5 border-t border-border/50 flex-wrap">
            <div className="flex items-center gap-1.5 text-foreground min-w-0 flex-wrap">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="font-medium text-xs truncate max-w-[340px] sm:max-w-none" title={defaultAddress}>
                {defaultAddress}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(defaultAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-medium shrink-0 ml-1 cursor-pointer"
              >
                <span>(Mở map)</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground mr-1">
                <Navigation className="h-3 w-3 text-emerald-600 shrink-0" />
                <span>Khoảng cách cơ sở:</span>
              </div>
              {defaultBranches.map((b, idx) => (
                <span
                  key={b.name}
                  className={cn(
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] shrink-0 border',
                    idx === 0
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold'
                      : 'bg-muted/40 text-muted-foreground border-border/50'
                  )}
                >
                  {idx === 0 && <MapPin className="h-2.5 w-2.5 text-emerald-600 shrink-0" />}
                  <span>{b.name}</span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {b.distance}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* ============================================================ */}
        {/* 2. THANH TAB BAR GIA ĐÌNH (5 TABS - LỊCH SỬ TIẾP CẬN GỘP)   */}
        {/* ============================================================ */}
        <div className="bg-white dark:bg-zinc-900 border-b border-border/80 px-4 py-1.5 flex items-center gap-1 overflow-x-auto select-none shrink-0 scrollbar-none">
          {/* Tab 1: Phụ huynh & Người bảo trợ */}
          <button
            type="button"
            onClick={() => setActiveTab('parents')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'parents'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold shadow-2xs border border-sky-200 dark:border-sky-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Phụ huynh &amp; Người bảo trợ</span>
            {parents.length > 0 && (
              <Badge variant="secondary" className="h-4 px-1 text-[10px] font-bold rounded-full ml-0.5">
                {parents.length}
              </Badge>
            )}
          </button>

          {/* Tab 2: Danh sách Học viên (Các con - Gộp lịch sử tiếp cận bên phải) */}
          <button
            type="button"
            onClick={() => setActiveTab('children')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'children'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold shadow-2xs border border-indigo-200 dark:border-indigo-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
            <span>Danh sách Học viên ({children.length} bé)</span>
          </button>

          {/* Tab 3: Đơn hàng gia đình */}
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'orders'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold shadow-2xs border border-amber-200 dark:border-amber-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5 text-amber-600" />
            <span>Đơn hàng gia đình</span>
            {orders.length > 0 && (
              <Badge className="h-4 px-1 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 border-0 ml-0.5">
                {orders.length}
              </Badge>
            )}
          </button>

          {/* Tab 4: Lịch sử Thanh toán */}
          <button
            type="button"
            onClick={() => setActiveTab('payments')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'payments'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold shadow-2xs border border-emerald-200 dark:border-emerald-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Receipt className="h-3.5 w-3.5 text-emerald-600" />
            <span>Lịch sử Thanh toán</span>
            {payments.length > 0 && (
              <Badge className="h-4 px-1 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 border-0 ml-0.5">
                {payments.length}
              </Badge>
            )}
          </button>

          {/* Tab 5: Giao nhận & Vận đơn */}
          <button
            type="button"
            onClick={() => setActiveTab('deliveries')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'deliveries'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold shadow-2xs border border-sky-200 dark:border-sky-800'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <Truck className="h-3.5 w-3.5 text-sky-600" />
            <span>Giao nhận &amp; Vận đơn</span>
            {deliveries.length > 0 && (
              <Badge className="h-4 px-1 text-[10px] font-bold rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 border-0 ml-0.5">
                {deliveries.length}
              </Badge>
            )}
          </button>
        </div>

        {/* ============================================================ */}
        {/* 3. BODY DIALOG - CỐ ĐỊNH CHIỀU CAO, KHÔNG CO GIÃN THEO TAB   */}
        {/* ============================================================ */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#f8fafc] dark:bg-zinc-950">
          {activeTab === 'parents' && (
            <CrmFamilyParentsTab
              parents={parents}
              onUpdateParents={handleUpdateParents}
              familyCode={familyCode}
              createdAt={lead?.createdAt || '2026-08-10'}
              siblingNames={children.map((c) => c.name).filter(Boolean)}
            />
          )}

          {activeTab === 'children' && (
            <CrmFamilyChildrenTab
              childrenList={children}
              leadOccurrences={leadOccurrences}
            />
          )}

          {activeTab === 'orders' && (
            <CrmFamilyOrdersTab orders={orders} />
          )}

          {activeTab === 'payments' && (
            <CrmFamilyPaymentsTab payments={payments} />
          )}

          {activeTab === 'deliveries' && (
            <CrmFamilyDeliveriesTab deliveries={deliveries} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
