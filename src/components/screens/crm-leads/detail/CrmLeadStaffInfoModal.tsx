'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Headset,
  Phone,
  Mail,
  Building2,
  MapPin,
  ExternalLink,
  Copy,
  Clock,
  ShieldCheck,
  Check,
  HeartHandshake,
  UserCheck,
  RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppAvatar } from '@/components/shared'
import type { Lead } from '@/mocks/crmLeads'

export interface CrmLeadStaffInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead
  staffName?: string
  onReassignStaff?: (newStaffName: string) => void
  onOpenReassignModal?: () => void
}

export function CrmLeadStaffInfoModal({
  open,
  onOpenChange,
  lead,
  staffName,
  onReassignStaff,
  onOpenReassignModal,
}: CrmLeadStaffInfoModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isReassigning, setIsReassigning] = useState(false)
  const [selectedNewStaff, setSelectedNewStaff] = useState<string>('')

  const activeStaffName = staffName || lead.assignedTo || 'Trần Thị Mai'
  const branchName = lead.branch || 'RinoEdu Nguyễn Tuân'

  // Mock dữ liệu thông tin chi tiết của Tư vấn viên (Sales Lead)
  const salesStaff = {
    name: activeStaffName,
    code: 'NV-0248',
    role: 'Chuyên viên Tư vấn Tuyển sinh (Lead Owner)',
    department: 'Phòng Tuyển sinh & Phát triển thị trường',
    phone: '0901112233',
    email: 'mai.tt@rinoedu.vn',
    shift: 'Ca sáng (08:00 - 17:30) • Trực ca chính',
    assignedDate: lead.createdAt || '10/08/2026',
    slaStatus: 'Hoàn thành 100% cam kết SLA phản hồi',
    interactionCount: '4 cuộc gọi • 2 tin nhắn Zalo',
  }

  // Mock dữ liệu thông tin Chuyên viên Chăm sóc Khách hàng (CS / CSM phối hợp)
  const csStaff = {
    name: branchName.includes('Linh Đàm')
      ? 'Đinh Quốc Tuấn'
      : branchName.includes('Smart City')
      ? 'Phạm Mai Anh'
      : 'Lê Hoàng Nam',
    code: 'NV-0312',
    role: 'Chuyên viên Trải nghiệm & Chăm sóc Học viên (CS Officer)',
    department: 'Bộ phận Trải nghiệm & Dịch vụ Khách hàng (CS)',
    phone: '0902223344',
    email: 'nam.lh@rinoedu.vn',
    scope: 'Đón tiếp học thử & test đầu vào, hỗ trợ học vụ, khảo sát độ hài lòng phụ huynh',
  }

  // Mock dữ liệu thông tin Cơ sở tiếp nhận & đào tạo (Branch / Station)
  const branchInfo = {
    name: branchName,
    address: branchName.includes('Linh Đàm')
      ? 'Tầng 2, Tòa HH02, KĐT Linh Đàm, Hoàng Mai, Hà Nội'
      : branchName.includes('Smart City')
      ? 'Tòa S2.01, Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội'
      : 'Số 45 Nguyễn Tuân, Phường Thanh Xuân Trung, Thanh Xuân, Hà Nội',
    hotline: '024.7300.6868',
    manager: branchName.includes('Linh Đàm')
      ? 'Vũ Văn Reception'
      : branchName.includes('Smart City')
      ? 'Nguyễn Văn Quản Lý'
      : 'Đặng Văn Bắc',
    openHours: '08:00 - 21:30 (Thứ Hai đến Chủ Nhật)',
    testRoom: 'Phòng Lab Đánh giá 202 - Tầng 2',
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branchName + ' Hà Nội')}`,
  }

  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedKey(key)
        toast.success(`Đã sao chép ${label}: ${text}`)
        setTimeout(() => setCopiedKey(null), 2000)
      })
      .catch(() => toast.error('Không thể sao chép văn bản'))
  }

  const handleCall = (phone: string, name: string) => {
    toast.info(`Đang kích hoạt cuộc gọi tới ${name} (${phone})...`)
    window.open(`tel:${phone}`, '_self')
  }

  const handleConfirmReassign = () => {
    if (!selectedNewStaff) {
      toast.error('Vui lòng chọn nhân sự tư vấn viên mới!')
      return
    }
    onReassignStaff?.(selectedNewStaff)
    toast.success(`Đã điều chuyển phụ trách Lead sang: ${selectedNewStaff}`)
    setIsReassigning(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden text-left select-none">
        {/* Header Modal */}
        <DialogHeader className="p-4 pb-3 border-b border-border/70 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-sky-100 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0 border border-sky-200 dark:border-sky-800">
              <UserCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold text-foreground">
                Thông tin Đội ngũ Phụ trách &amp; Cơ sở Tiếp nhận
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground truncate">
                Mã Lead: <strong className="font-mono text-foreground">{lead.code}</strong> • Học viên:{' '}
                <strong className="text-foreground">{lead.studentName}</strong> • {branchName}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Nội dung chi tiết các khối phụ trách */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* ============================================================ */}
          {/* 1. KHỐI TƯ VẤN VIÊN TUYỂN SINH (LEAD OWNER / SALE PHỤ TRÁCH)  */}
          {/* ============================================================ */}
          <div className="rounded-xl border border-sky-200/80 dark:border-sky-900/60 bg-sky-50/20 dark:bg-sky-950/20 p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-sky-100 dark:border-sky-900/40">
              <div className="flex items-center gap-2">
                <Headset className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                <span className="font-bold text-foreground text-xs">
                  Tư vấn viên Tuyển sinh (Sales Lead)
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800">
                Phụ trách chính
              </Badge>
            </div>

            <div className="flex items-start gap-3">
              <AppAvatar
                name={salesStaff.name}
                size="md"
                className="h-11 w-11 border border-border shrink-0 shadow-2xs"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-foreground">{salesStaff.name}</h4>
                  <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                    {salesStaff.code}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{salesStaff.role}</p>
                <p className="text-[11px] text-muted-foreground/80">{salesStaff.department}</p>
              </div>
            </div>

            {/* Kênh liên hệ Sale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-sky-100 dark:border-sky-900/40 text-xs">
              <div className="flex items-center justify-between bg-card rounded-lg px-2.5 py-1.5 border border-border/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono text-foreground font-medium truncate">
                    {salesStaff.phone}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(salesStaff.phone, 'SĐT Sale', 'sales-phone')}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    title="Sao chép SĐT"
                  >
                    {copiedKey === 'sales-phone' ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCall(salesStaff.phone, salesStaff.name)}
                    className="h-6 px-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer"
                  >
                    Gọi
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-card rounded-lg px-2.5 py-1.5 border border-border/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  <span className="text-foreground truncate">{salesStaff.email}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(salesStaff.email, 'Email Sale', 'sales-email')}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                  title="Sao chép Email"
                >
                  {copiedKey === 'sales-email' ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            {/* Thông số SLA & Tương tác */}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap pt-0.5">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-sky-600" />
                Tiếp nhận: <strong className="text-foreground font-semibold">{salesStaff.assignedDate}</strong>
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {salesStaff.slaStatus}
                </span>
              </span>
              <span className="text-muted-foreground/40">•</span>
              <span>Đã tương tác: <strong className="text-foreground font-semibold">{salesStaff.interactionCount}</strong></span>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 2. KHỐI CHĂM SÓC KHÁCH HÀNG (CUSTOMER CARE / CS PHỐI HỢP)     */}
          {/* ============================================================ */}
          <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/20 p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
              <div className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-foreground text-xs">
                  Chuyên viên Chăm sóc Khách hàng &amp; Trải nghiệm (CS)
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                Phối hợp trải nghiệm
              </Badge>
            </div>

            <div className="flex items-start gap-3">
              <AppAvatar
                name={csStaff.name}
                size="md"
                className="h-11 w-11 border border-border shrink-0 shadow-2xs"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-foreground">{csStaff.name}</h4>
                  <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                    {csStaff.code}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{csStaff.role}</p>
                <p className="text-[11px] text-muted-foreground/80">{csStaff.scope}</p>
              </div>
            </div>

            {/* Kênh liên hệ CS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-emerald-100 dark:border-emerald-900/40 text-xs">
              <div className="flex items-center justify-between bg-card rounded-lg px-2.5 py-1.5 border border-border/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-mono text-foreground font-medium truncate">
                    {csStaff.phone}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(csStaff.phone, 'SĐT CS', 'cs-phone')}
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    title="Sao chép SĐT"
                  >
                    {copiedKey === 'cs-phone' ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleCall(csStaff.phone, csStaff.name)}
                    className="h-6 px-1.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer"
                  >
                    Gọi
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-card rounded-lg px-2.5 py-1.5 border border-border/60">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Mail className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  <span className="text-foreground truncate">{csStaff.email}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(csStaff.email, 'Email CS', 'cs-email')}
                  className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                  title="Sao chép Email"
                >
                  {copiedKey === 'cs-email' ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3. KHỐI CƠ SỞ TIẾP NHẬN & ĐÀO TẠO (BRANCH / STATION)          */}
          {/* ============================================================ */}
          <div className="rounded-xl border border-border/80 bg-card p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground text-xs">
                  Cơ sở Tiếp nhận &amp; Giảng dạy (Station)
                </span>
              </div>
              <a
                href={branchInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
                title="Mở chỉ đường trên Google Maps"
              >
                <span>Mở Google Maps</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <strong className="text-foreground font-semibold block">{branchInfo.name}</strong>
                  <span className="text-muted-foreground">{branchInfo.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-border/50 text-[11px]">
                <div>
                  <span className="text-muted-foreground block">Hotline quầy lễ tân:</span>
                  <span className="font-mono font-bold text-foreground">{branchInfo.hotline}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Giám đốc cơ sở (BM):</span>
                  <span className="font-medium text-foreground">{branchInfo.manager}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Giờ mở cửa đón tiếp:</span>
                  <span className="text-foreground font-medium">{branchInfo.openHours}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Phòng kiểm tra đầu vào:</span>
                  <span className="text-foreground font-medium">{branchInfo.testRoom}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 4. ĐIỀU CHUYỂN PHỤ TRÁCH (REASSIGN NẾU CẦN THIẾT)             */}
          {/* ============================================================ */}
          {isReassigning ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 p-3 space-y-2.5">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Điều chuyển Tư vấn viên phụ trách Lead
              </div>
              <p className="text-[11px] text-muted-foreground">
                Chọn tư vấn viên mới để tiếp quản chăm sóc và theo dõi chu kỳ bán của Lead này:
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {['Trần Thị Sale', 'Nguyễn Hoàng Sale', 'Bùi Thu Phương'].map((staff) => (
                  <button
                    key={staff}
                    type="button"
                    onClick={() => setSelectedNewStaff(staff)}
                    className={cn(
                      'px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer',
                      selectedNewStaff === staff
                        ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                        : 'bg-card text-foreground border-border hover:bg-muted'
                    )}
                  >
                    {staff}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReassigning(false)}
                  className="h-7 text-xs"
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConfirmReassign}
                  className="h-7 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Xác nhận chuyển
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Modal */}
        <DialogFooter className="p-3 border-t border-border/70 bg-muted/10 flex items-center justify-between sm:justify-between">
          {!isReassigning ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                if (onOpenReassignModal) {
                  onOpenChange(false)
                  onOpenReassignModal()
                } else {
                  setIsReassigning(true)
                }
              }}
              className="h-7.5 px-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground border-border cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Điều chuyển phụ trách</span>
            </Button>
          ) : (
            <div />
          )}

          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-7.5 px-4 text-xs font-semibold"
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
