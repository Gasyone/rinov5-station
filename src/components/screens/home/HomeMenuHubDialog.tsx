'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  CalendarDays,
  GraduationCap,
  TrendingUp,
  ArrowRight,
  LayoutGrid,
  HeartHandshake,
  Package,
  Settings,
  Search,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HomeMenuHubDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MenuModuleItem {
  id: string
  title: string
  path: string
}

interface MenuModuleGroup {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  badgeColor: string
  items: MenuModuleItem[]
}

const ALL_MENU_GROUPS: MenuModuleGroup[] = [
  {
    id: 'class_operations',
    title: 'Vận hành & Đào tạo',
    icon: GraduationCap,
    badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    items: [
      { id: 'classes', title: 'Quản lý Lớp học', path: '/app/classes' },
      { id: 'order_fulfillment', title: 'Bàn giao & Giao hàng', path: '/app/order_fulfillment' },
      { id: 'leave_reserve', title: 'Bảo lưu & Nghỉ phép', path: '/app/leave_reserve' },
      { id: 'makeup_class', title: 'Học bù học viên', path: '/app/makeup_class' },
      { id: 'class_placement', title: 'Xếp lớp học viên', path: '/app/class_placement' },
    ],
  },
  {
    id: 'schedules_work',
    title: 'Lịch biểu & Ca làm việc',
    icon: CalendarDays,
    badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    items: [
      { id: 'calendar_class_schedule', title: 'Lịch học trung tâm', path: '/app/calendar_class_schedule' },
      { id: 'my_schedule', title: 'Lịch của tôi', path: '/app/my_schedule' },
      { id: 'digi_schedule', title: 'Lịch học digi', path: '/app/digi_schedule' },
      { id: 'calendar_event_schedule', title: 'Lịch test đầu vào', path: '/app/calendar_event_schedule' },
      { id: 'work_registration', title: 'Đăng ký lịch làm việc', path: '/app/work_registration' },
      { id: 'event_management_new', title: 'Quản lý sự kiện', path: '/app/event_management_new' },
    ],
  },
  {
    id: 'crm_enrollment',
    title: 'CRM & Tuyển sinh',
    icon: TrendingUp,
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    items: [
      { id: 'crm_my_leads', title: 'Lead của tôi', path: '/app/crm_my_leads' },
      { id: 'crm_leads', title: 'Quản lý Lead', path: '/app/crm_leads' },
      { id: 'booking_test', title: 'Kiểm tra / Trải nghiệm', path: '/app/booking_test' },
      { id: 'trial_class', title: 'Lớp học thử', path: '/app/trial_class' },
      { id: 'orders', title: 'Quản lý đơn hàng', path: '/app/orders' },
      { id: 'payment_receipts', title: 'Thu phí & Công nợ', path: '/app/payment_receipts' },
    ],
  },
  {
    id: 'student_care_quality',
    title: 'Chăm sóc & Chất lượng',
    icon: HeartHandshake,
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    items: [
      { id: 'student_operations_alert', title: 'Chăm sóc học viên', path: '/app/student_operations_alert' },
      { id: 'renewal', title: 'Tái phí học viên', path: '/app/renewal' },
      { id: 'support_tickets', title: 'Quản lý Ticket & Chất lượng', path: '/app/support_tickets' },
    ],
  },
  {
    id: 'products_promotions',
    title: 'Sản phẩm & Khuyến mãi',
    icon: Package,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    items: [
      { id: 'products', title: 'Quản lý sản phẩm', path: '/app/products' },
      { id: 'campaigns', title: 'Quản lý Chiến dịch', path: '/app/campaigns' },
      { id: 'promotions', title: 'Quản lý Khuyến mãi', path: '/app/promotions' },
    ],
  },
  {
    id: 'system_operations_config',
    title: 'Cấu hình & Hệ thống',
    icon: Settings,
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    items: [
      { id: 'branches', title: 'Quản lý cơ sở', path: '/app/branches' },
      { id: 'org_structure', title: 'Sơ đồ tổ chức', path: '/app/org_structure' },
      { id: 'job_titles', title: 'Chức danh', path: '/app/job_titles' },
      { id: 'permissions', title: 'Nhóm quyền & Phân quyền', path: '/app/permissions' },
      { id: 'lead_lifecycle_config', title: 'Cấu hình Phễu & Kho Lead', path: '/app/lead_lifecycle_config' },
      { id: 'care_conditions_config', title: 'Danh mục chăm sóc', path: '/app/care_conditions_config' },
      { id: 'system_config', title: 'Cấu hình hệ thống', path: '/app/system_config' },
    ],
  },
]

export function HomeMenuHubDialog({
  open,
  onOpenChange,
}: HomeMenuHubDialogProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSelectMenu = (path: string) => {
    onOpenChange(false)
    router.push(path)
  }

  const filteredGroups = useMemo(() => {
    if (!searchTerm.trim()) return ALL_MENU_GROUPS
    const term = searchTerm.toLowerCase().trim()
    return ALL_MENU_GROUPS.map((group) => {
      const matchedItems = group.items.filter((item) =>
        item.title.toLowerCase().includes(term)
      )
      return {
        ...group,
        items: matchedItems,
      }
    }).filter((group) => group.items.length > 0)
  }, [searchTerm])

  const totalItemCount = ALL_MENU_GROUPS.reduce((acc, g) => acc + g.items.length, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl xl:max-w-6xl p-4 sm:p-5 gap-3 max-h-[85vh] flex flex-col">
        {/* Header với Tiêu đề (text thường, chỉ icon và title) và Ô tìm kiếm nhanh ở cạnh phải */}
        <DialogHeader className="pb-2.5 border-b border-border/40">
          <div className="flex items-center justify-between gap-4 pr-7">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <LayoutGrid className="w-3.5 h-3.5" />
              </div>
              <DialogTitle className="text-sm font-normal text-foreground">
                Danh mục phân hệ quản lý hệ thống
              </DialogTitle>
              <DialogDescription className="sr-only">
                Danh mục toàn bộ các phân hệ nghiệp vụ thuộc hệ thống
              </DialogDescription>
            </div>

            {/* Ô tìm kiếm nhanh phân hệ ở cạnh phải */}
            <div className="relative w-56 sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm nhanh phân hệ..."
                className="w-full h-8 pl-8 pr-7 text-xs bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/70 rounded-lg outline-none focus:ring-1 focus:ring-primary/40 transition-all text-foreground placeholder:text-muted-foreground/70"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* 6 Nhóm phân hệ chia 3 cột thoáng đãng, cỡ chữ 12px rõ ràng, không bị co ngắn chữ */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {filteredGroups.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Không tìm thấy phân hệ nào khớp với từ khóa &ldquo;{searchTerm}&rdquo;
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-1">
              {filteredGroups.map((group) => {
                const Icon = group.icon

                return (
                  <div
                    key={group.id}
                    className="rounded-xl border border-border/60 bg-muted/15 p-2.5 space-y-1.5 flex flex-col justify-between"
                  >
                    {/* Tiêu đề nhóm */}
                    <div className="flex items-center gap-1.5 pb-1.5 border-b border-border/40 text-sm font-medium text-foreground/90">
                      <span className={`p-1 rounded-md ${group.badgeColor}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="truncate">{group.title}</span>
                      <span className="text-xs text-muted-foreground font-normal ml-auto">
                        ({group.items.length})
                      </span>
                    </div>

                    {/* Danh sách phân hệ: Chữ 12px chuẩn, rộng rãi, không bị dấu 3 chấm */}
                    <div className="space-y-0.5 flex-1">
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectMenu(item.path)}
                          className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-normal text-foreground/85 hover:text-primary hover:bg-background shadow-none hover:shadow-2xs transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{item.title}</span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 opacity-0 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
