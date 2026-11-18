'use client'

import React, { useState } from 'react'
import {
  Bell,
  GraduationCap,
  RotateCcw,
  Save,
  ShieldCheck,
  Volume2,
  Mail,
  CalendarDays,
  CreditCard,
  MessageSquareWarning,
  Settings,
  Send,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  useNotificationStore,
  type NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '@/stores/useNotificationStore'

interface NotificationSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SettingsForm({ onClose }: { onClose: () => void }) {
  const { settings, updateSettings, resetSettings } = useNotificationStore()

  const [localSettings, setLocalSettings] = useState<NotificationSettings>(() => ({
    ...settings,
    categoryPreferences: {
      ...DEFAULT_NOTIFICATION_SETTINGS.categoryPreferences,
      ...(settings.categoryPreferences || {}),
    },
    subCategoryPreferences: {
      ...DEFAULT_NOTIFICATION_SETTINGS.subCategoryPreferences,
      ...(settings.subCategoryPreferences || {}),
    },
    channels: {
      ...DEFAULT_NOTIFICATION_SETTINGS.channels,
      ...(settings.channels || {}),
      webUi: settings.channels?.webUi ?? settings.channels?.inAppPopup ?? true,
      zaloSms: settings.channels?.zaloSms ?? settings.channels?.zaloEmergency ?? false,
    },
    channelAccounts: {
      ...DEFAULT_NOTIFICATION_SETTINGS.channelAccounts,
      ...(settings.channelAccounts || {}),
    },
  }))

  const [hasChanges, setHasChanges] = useState(false)

  // Toggle all subcategories when parent is toggled
  const handleParentCategoryToggle = (
    categoryKey: keyof NotificationSettings['categoryPreferences'],
    subKeys: Array<keyof NotificationSettings['subCategoryPreferences']>
  ) => {
    const nextVal = !localSettings.categoryPreferences[categoryKey]
    const updatedSub = { ...localSettings.subCategoryPreferences }
    subKeys.forEach((k) => {
      updatedSub[k] = nextVal
    })

    setLocalSettings((prev) => ({
      ...prev,
      categoryPreferences: {
        ...prev.categoryPreferences,
        [categoryKey]: nextVal,
      },
      subCategoryPreferences: updatedSub,
    }))
    setHasChanges(true)
  }

  // Toggle individual subcategory
  const handleSubCategoryToggle = (
    categoryKey: keyof NotificationSettings['categoryPreferences'],
    subKey: keyof NotificationSettings['subCategoryPreferences'],
    allSubKeys: Array<keyof NotificationSettings['subCategoryPreferences']>
  ) => {
    const updatedSub = {
      ...localSettings.subCategoryPreferences,
      [subKey]: !localSettings.subCategoryPreferences[subKey],
    }
    const anyActive = allSubKeys.some((k) =>
      k === subKey ? !localSettings.subCategoryPreferences[k] : updatedSub[k]
    )

    setLocalSettings((prev) => ({
      ...prev,
      subCategoryPreferences: updatedSub,
      categoryPreferences: {
        ...prev.categoryPreferences,
        [categoryKey]: anyActive,
      },
    }))
    setHasChanges(true)
  }

  // Channel toggles
  const handleChannelToggle = (channel: keyof NotificationSettings['channels']) => {
    setLocalSettings((prev) => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: !prev.channels[channel],
      },
    }))
    setHasChanges(true)
  }

  // Account inputs
  const handleAccountChange = (
    channelKey: keyof NotificationSettings['channelAccounts'],
    value: string
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      channelAccounts: {
        ...prev.channelAccounts,
        [channelKey]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setHasChanges(false)
    toast.success('Đã lưu cấu hình thông báo')
    onClose()
  }

  const handleReset = () => {
    resetSettings()
    setLocalSettings(DEFAULT_NOTIFICATION_SETTINGS)
    setHasChanges(false)
    toast.info('Đã khôi phục cấu hình thông báo về mặc định')
  }

  // 6 Chuẩn danh mục nghiệp vụ trường học / cơ sở đào tạo (Rinov5 Station)
  const categoryGroups = [
    {
      id: 'operations' as const,
      name: 'Vận hành Lớp & Lịch học',
      icon: CalendarDays,
      color: 'text-sky-500',
      subKeys: [
        'ops_cancelled',
        'ops_substitution',
        'ops_room_change',
        'ops_attendance',
        'ops_materials',
      ] as Array<keyof NotificationSettings['subCategoryPreferences']>,
      items: [
        { key: 'ops_cancelled' as const, label: 'Buổi học bị hủy đột xuất hoặc dời lịch' },
        { key: 'ops_substitution' as const, label: 'Phân công ca dạy mới & Phân công dạy thay' },
        { key: 'ops_room_change' as const, label: 'Thay đổi phòng học hoặc đổi cơ sở' },
        { key: 'ops_attendance' as const, label: 'Nhắc nhở giáo viên điểm danh sau ca dạy' },
        { key: 'ops_materials' as const, label: 'Bàn giao sách giáo trình, học liệu & thiết bị' },
      ],
    },
    {
      id: 'student_care' as const,
      name: 'Học vụ & Chăm sóc học viên',
      icon: GraduationCap,
      color: 'text-indigo-500',
      subKeys: [
        'care_absent',
        'care_reserve',
        'care_makeup',
        'care_alert',
      ] as Array<keyof NotificationSettings['subCategoryPreferences']>,
      items: [
        { key: 'care_absent' as const, label: 'Học viên vắng mặt không phép (từ 2 buổi)' },
        { key: 'care_reserve' as const, label: 'Phiếu bảo lưu học phí & Đơn xin nghỉ phép' },
        { key: 'care_makeup' as const, label: 'Đăng ký ca học bù & Thủ tục chuyển lớp' },
        { key: 'care_alert' as const, label: 'Cảnh báo học lực sa sút & Nhắc liên hệ phụ huynh' },
      ],
    },
    {
      id: 'admissions' as const,
      name: 'Tuyển sinh & Ghi danh',
      icon: UserCheck,
      color: 'text-violet-500',
      subKeys: [
        'adm_booking_test',
        'adm_trial_class',
        'adm_lead_assigned',
      ] as Array<keyof NotificationSettings['subCategoryPreferences']>,
      items: [
        { key: 'adm_booking_test' as const, label: 'Lịch kiểm tra trình độ đầu vào & Kết quả thi' },
        { key: 'adm_trial_class' as const, label: 'Lịch lớp học thử & Nhận xét của giáo viên' },
        { key: 'adm_lead_assigned' as const, label: 'Tiếp nhận hồ sơ tuyển sinh mới phân bổ' },
      ],
    },
    {
      id: 'commercial' as const,
      name: 'Đơn hàng & Học phí',
      icon: CreditCard,
      color: 'text-emerald-500',
      subKeys: [
        'order_created',
        'order_paid',
        'order_renewal',
        'order_debt',
      ] as Array<keyof NotificationSettings['subCategoryPreferences']>,
      items: [
        { key: 'order_created' as const, label: 'Đơn đăng ký học mới vừa được tạo' },
        { key: 'order_paid' as const, label: 'Thu học phí thành công & Phát hành phiếu thu' },
        { key: 'order_renewal' as const, label: 'Học viên sắp hết phí / Đến kỳ tái phí (≤ 3 buổi)' },
        { key: 'order_debt' as const, label: 'Đôn đốc các khoản công nợ học phí quá hạn' },
      ],
    },
    {
      id: 'ticket' as const,
      name: 'Khiếu nại & Hỗ trợ (SLA)',
      icon: MessageSquareWarning,
      color: 'text-amber-500',
      subKeys: [
        'ticket_created',
        'ticket_sla',
        'ticket_feedback',
      ] as Array<keyof NotificationSettings['subCategoryPreferences']>,
      items: [
        { key: 'ticket_created' as const, label: 'Ticket khiếu nại dịch vụ / phản ánh mới phát sinh' },
        { key: 'ticket_sla' as const, label: 'Cảnh báo vi phạm cam kết SLA xử lý (quá 2 giờ)' },
        { key: 'ticket_feedback' as const, label: 'Phản hồi không hài lòng về chất lượng buổi học' },
      ],
    },
    {
      id: 'system' as const,
      name: 'Hệ thống & Tài khoản',
      icon: ShieldCheck,
      color: 'text-zinc-500',
      subKeys: [
        'sys_maintenance',
        'sys_permission',
        'sys_security',
      ] as Array<keyof NotificationSettings['subCategoryPreferences']>,
      items: [
        { key: 'sys_maintenance' as const, label: 'Thông báo lịch bảo trì hệ thống định kỳ' },
        { key: 'sys_permission' as const, label: 'Thay đổi phân quyền vai trò & tài khoản' },
        { key: 'sys_security' as const, label: 'Cảnh báo bảo mật & Đăng nhập thiết bị mới' },
      ],
    },
  ]

  return (
    <>
      <div className="space-y-3 py-0.5">
        {/* =========================================================================
            1. DANH MỤC NGHIỆP VỤ (ACCORDION PHÂN RÃ THEO NĂNG LỰC CỐT LÕI)
           ========================================================================= */}
        <div className="space-y-1">
          <div className="flex items-center justify-between pb-0.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Danh mục nghiệp vụ
            </h4>
            <span className="text-[10px] text-muted-foreground">
              Nhấp vào từng nhóm để bật/tắt chi tiết các loại sự vụ
            </span>
          </div>

          <Accordion type="multiple" className="space-y-1 border-0">
            {categoryGroups.map((group) => {
              const Icon = group.icon
              const isParentActive = !!localSettings.categoryPreferences[group.id]
              const activeCount = group.subKeys.filter(
                (k) => !!localSettings.subCategoryPreferences[k]
              ).length

              return (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="rounded-md border border-border/60 bg-muted/20 px-2.5 py-0 overflow-hidden transition-colors data-[state=open]:bg-muted/30"
                >
                  <div className="flex items-center justify-between py-1.5">
                    {/* Left: Accordion trigger header */}
                    <AccordionTrigger className="hover:no-underline py-0 pr-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 min-w-0 text-left">
                        <Icon className={`h-3.5 w-3.5 ${group.color} shrink-0`} />
                        <div className="truncate">
                          <p className="text-xs font-medium text-foreground truncate">
                            {group.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-normal">
                            Đang bật {activeCount}/{group.subKeys.length} loại thông báo
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>

                    {/* Right: Master Switch for this whole category */}
                    <div
                      className="shrink-0 pl-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Switch
                        checked={isParentActive}
                        onCheckedChange={() =>
                          handleParentCategoryToggle(group.id, group.subKeys)
                        }
                        className="scale-85"
                        aria-label={`Bật tắt toàn bộ ${group.name}`}
                      />
                    </div>
                  </div>

                  {/* Accordion Content: Fine-grained sub-events */}
                  <AccordionContent className="pt-0.5 pb-2 pl-3.5 pr-1 space-y-1">
                    {group.items.map((item) => {
                      const isSubChecked = !!localSettings.subCategoryPreferences[item.key]

                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between gap-2 text-xs py-0.5"
                        >
                          <span
                            className={
                              isSubChecked
                                ? 'text-foreground font-normal text-xs'
                                : 'text-muted-foreground text-xs'
                            }
                          >
                            {item.label}
                          </span>
                          <Switch
                            checked={isSubChecked}
                            onCheckedChange={() =>
                              handleSubCategoryToggle(
                                group.id,
                                item.key,
                                group.subKeys
                              )
                            }
                            className="scale-75 shrink-0"
                          />
                        </div>
                      )
                    })}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>

        {/* =========================================================================
            2. KÊNH NHẬN THÔNG BÁO & TÀI KHOẢN (BỐ CỤC FIELD NẰM DƯỚI LABEL TIÊU ĐỀ)
           ========================================================================= */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between pb-0.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Kênh nhận thông báo & Tài khoản
            </h4>
            <span className="text-[10px] text-muted-foreground">
              Cấu hình tài khoản/số điện thoại nhận tin
            </span>
          </div>

          <div className="space-y-1.5 rounded-md border border-border/60 p-2 bg-muted/20">
            {/* 1 & 2: Web UI & Sound in compact block */}
            <div className="rounded border border-border/50 bg-background/70 p-2 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Bell className="h-3.5 w-3.5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Thông báo trên giao diện web
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Thanh chạy trên Header và cửa sổ popup xem nhanh
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.channels.webUi}
                  onCheckedChange={() => handleChannelToggle('webUi')}
                  className="scale-85"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Âm thanh chuông báo
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Phát tiếng chuông nhẹ khi có thông báo mới đến trình duyệt
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.channels.soundAlert}
                  onCheckedChange={() => handleChannelToggle('soundAlert')}
                  className="scale-85"
                />
              </div>
            </div>

            {/* 3. Telegram Card */}
            <div className="rounded border border-border/50 bg-background/80 p-2 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-sky-500/10 text-sky-500">
                    <Send className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Tin nhắn Telegram Bot
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Nhận thông báo tức thời qua bot Telegram @RinoStationBot
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.channels.telegram}
                  onCheckedChange={() => handleChannelToggle('telegram')}
                  className="scale-85"
                />
              </div>

              {localSettings.channels.telegram && (
                <div className="space-y-1 pt-1.5 border-t border-border/40">
                  <label className="text-[11px] font-medium text-foreground block">
                    Tài khoản Telegram:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <Input
                      type="text"
                      placeholder="Nhập @username hoặc Chat ID (vd: @rino_admin)"
                      value={localSettings.channelAccounts.telegram}
                      onChange={(e) => handleAccountChange('telegram', e.target.value)}
                      className="h-7 text-xs flex-1 rounded"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => toast.success('Đã gửi tin nhắn mẫu đến Telegram!')}
                      className="h-7 text-xs px-2.5 shrink-0"
                    >
                      Kiểm tra
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Email Digest Card */}
            <div className="rounded border border-border/50 bg-background/80 p-2 space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-amber-500/10 text-amber-500">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Email tổng hợp báo cáo
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Gửi email tóm tắt các cảnh báo và sự vụ cần xử lý
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localSettings.channels.emailDigest}
                  onCheckedChange={() => handleChannelToggle('emailDigest')}
                  className="scale-85"
                />
              </div>

              {localSettings.channels.emailDigest && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1.5 border-t border-border/40">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground block">
                      Địa chỉ Email nhận báo cáo:
                    </label>
                    <Input
                      type="email"
                      placeholder="admin@rinoedu.vn"
                      value={localSettings.channelAccounts.email}
                      onChange={(e) => handleAccountChange('email', e.target.value)}
                      className="h-7 text-xs w-full rounded"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-foreground block">
                      Tần suất gửi email:
                    </label>
                    <Select
                      value={localSettings.emailFrequency}
                      onValueChange={(val: NotificationSettings['emailFrequency']) => {
                        setLocalSettings((prev) => ({ ...prev, emailFrequency: val }))
                        setHasChanges(true)
                      }}
                    >
                      <SelectTrigger className="w-full h-7 text-xs rounded">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Gửi tức thời</SelectItem>
                        <SelectItem value="daily">Hàng ngày (08:00)</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="never">Không gửi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <DialogFooter className="flex items-center justify-between sm:justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-7.5 text-xs gap-1 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Khôi phục mặc định</span>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7.5 text-xs"
          >
            Hủy
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges}
            className="h-7.5 text-xs gap-1.5 font-medium"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Lưu cài đặt</span>
          </Button>
        </div>
      </DialogFooter>
    </>
  )
}

export function NotificationSettingsDialog({
  open,
  onOpenChange,
}: NotificationSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto p-4 sm:p-4.5">
        <DialogHeader className="p-0 pb-0.5">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2">
            <Settings className="h-4 w-4 text-primary" />
            <span>Cài đặt thông báo</span>
          </DialogTitle>
        </DialogHeader>

        {open && <SettingsForm onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  )
}
