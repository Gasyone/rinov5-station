'use client'

import {
  Check,
  ChevronDown,
  ExternalLink,
  Globe,
  Home,
  LogOut,
  Menu,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore, type DemoRole } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'
import { screens } from '@/config/screens'
import { navigationGroups } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const DEMO_ROLE_OPTIONS: Array<{ role: DemoRole; label: string; desc: string }> = [
  { role: 'csm', label: 'CS', desc: 'Chuyên cần, Dịch vụ & Rủi ro dừng học' },
  { role: 'teacher', label: 'Giáo viên (Teacher)', desc: 'Lớp của tôi & Chăm sóc chuyên môn' },
  { role: 'branch_manager', label: 'Quản lý Chi nhánh (BM)', desc: 'Góc nhìn Presets Quản trị' },
]

const ROLE_LABELS_MAP: Record<DemoRole, string> = {
  admin: 'Admin',
  branch_manager: 'Quản lý Chi nhánh',
  teacher: 'Giáo viên',
  csm: 'CS (Chăm sóc KH)',
  sale: 'Sale',
  ops: 'Vận hành',
  academic: 'Học vụ',
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { HeaderBrand } from './HeaderBrand'
import { HeaderNotificationCenter } from './HeaderNotificationCenter'
import { FeedbackPopover } from './FeedbackPopover'
import { HeaderWorkdayDatePicker } from './HeaderWorkdayDatePicker'
import { TutorialVideoButton } from '@/components/tutorial'

const UI_LOCALE_OPTIONS = [
  { code: 'vi', label: 'Tiếng Việt', shortLabel: 'VI' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'zh', label: '中文', shortLabel: 'ZH' },
] as const

interface HeaderBarProps {
  onOpenMobileSidebar: () => void
}

export function HeaderBar({ onOpenMobileSidebar }: HeaderBarProps) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const switchRole = useAuthStore((s) => s.switchRole)

  const handleRoleSelect = (role: DemoRole, label: string) => {
    switchRole(role)
    toast.success(`Đã chuyển vai trò giả lập sang: ${label}`)
  }
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const locale = useUIStore((s) => s.locale)
  const setLocale = useUIStore((s) => s.setLocale)
  const currentMenuId = useUIStore((s) => s.currentMenuId)
  const customHeaderTitle = useUIStore((s) => s.customHeaderTitle)
  const router = useRouter()

  const baseMenuId = currentMenuId ? currentMenuId.split('/')[0] : null
  const navMenuItem = currentMenuId
    ? navigationGroups.flatMap((g) => g.items).find((item) => item.id === currentMenuId || item.id === baseMenuId)
    : null
  const defaultMenuLabel = currentMenuId
    ? (screens[currentMenuId]?.label || (baseMenuId ? screens[baseMenuId]?.label : null) || navMenuItem?.label)
    : null
  const menuLabel = customHeaderTitle || defaultMenuLabel
  const currentGroup = currentMenuId
    ? navigationGroups.find((g) => g.items.some((item) => item.id === currentMenuId || item.id === baseMenuId))
    : null
  const GroupIcon = currentGroup?.icon || Home

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const initial = user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'
  const roleLabel = (user?.role && ROLE_LABELS_MAP[user.role]) || user?.role || 'Người dùng'

  return (
    <header className="ui-shell-header sticky top-0 z-50 flex h-11 flex-shrink-0 items-center justify-between bg-background/90 px-3 backdrop-blur-md md:pl-3 md:pr-4">
      {/* Left: Mobile menu toggle, Brand Logo & Page Title */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Open navigation"
          className="ui-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          onClick={onOpenMobileSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>

        <HeaderBrand />

        {menuLabel && (
          <div className="flex items-center gap-1.5 border-l border-border pl-2.5 md:pl-3">
            {GroupIcon && <GroupIcon className="h-4 w-4 text-muted-foreground/80 shrink-0" />}
            <span className="text-sm font-semibold text-foreground tracking-tight truncate max-w-[140px] sm:max-w-none">
              {menuLabel}
            </span>
          </div>
        )}
      </div>

      {/* Center: Ngày làm việc & Widget Thông báo 2 dòng */}
      <div className="flex items-center justify-center gap-2 flex-1 min-w-0 mx-2">
        <HeaderWorkdayDatePicker />
        <HeaderNotificationCenter />
      </div>

      {/* Right: Tutorials, Feedback, Settings & User Profile */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        {/* Video Hướng dẫn Sử dụng (Contextual Tutorials) */}
        <TutorialVideoButton />

        {/* Feedback Popover Button */}
        <FeedbackPopover />

        {/* Settings: language + theme */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Cài đặt"
              className="ui-icon-button inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              <span>Ngôn ngữ</span>
            </DropdownMenuLabel>
            <div className="grid grid-cols-3 gap-1 px-1 pb-1">
              {UI_LOCALE_OPTIONS.map((option) => {
                const selected = locale === option.code
                return (
                  <DropdownMenuItem
                    key={option.code}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm',
                      selected
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    onSelect={() => setLocale(option.code)}
                  >
                    <span className="text-xs font-semibold">{option.shortLabel}</span>
                    {selected && <Check className="h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                )
              })}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Giao diện
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md p-2 text-sm font-semibold"
              onSelect={(e) => {
                e.preventDefault()
                setTheme(theme === 'light' ? 'dark' : 'light')
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'rounded-lg p-1.5',
                    theme === 'dark'
                      ? 'bg-primary/15 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                </div>
                <span>{theme === 'dark' ? 'Chế độ tối' : 'Chế độ sáng'}</span>
              </div>
              <div
                className={cn(
                  'flex h-4 w-8 items-center rounded-full p-0.5 transition-all',
                  theme === 'dark' ? 'justify-end bg-primary' : 'justify-start bg-muted'
                )}
              >
                <div className="h-3 w-3 rounded-full bg-background shadow-sm" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu: Avatar, Tên & Vai trò */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              aria-label="Tài khoản"
              className="group inline-flex h-8 items-center gap-2 rounded-full border border-transparent pl-1 pr-2 py-0 hover:bg-accent data-[state=open]:bg-accent transition-colors text-left"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-xs">
                {initial}
              </div>
              <div className="flex flex-col text-left leading-tight min-w-0">
                <span className="text-xs font-semibold text-foreground tracking-tight truncate max-w-[90px] sm:max-w-[130px] md:max-w-[160px]">
                  {user?.name ?? 'Admin Demo'}
                </span>
                <span className="text-[10px] text-muted-foreground truncate max-w-[90px] sm:max-w-[130px] md:max-w-[160px]">
                  {roleLabel}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground shadow-md">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="ui-cell-primary truncate font-semibold text-foreground">
                  {user?.name ?? 'User'}
                </h4>
                <p className="ui-cell-secondary truncate text-sm text-muted-foreground">
                  {user?.email ?? ''}
                </p>
                <p className="mt-1 text-xs font-semibold capitalize text-muted-foreground">
                  {roleLabel}
                </p>
              </div>
            </div>
            <div className="p-2 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between px-2 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                <span>Giả lập Vai trò Demo</span>
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="space-y-0.5">
                {DEMO_ROLE_OPTIONS.map((item) => {
                  const isActive = user?.role === item.role
                  return (
                    <DropdownMenuItem
                      key={item.role}
                      onClick={() => handleRoleSelect(item.role, item.label)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
                        isActive ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-accent'
                      )}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className="truncate">{item.label}</span>
                        <span className="text-xs text-muted-foreground/80 font-normal truncate">
                          {item.desc}
                        </span>
                      </div>
                      {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
                    </DropdownMenuItem>
                  )
                })}
              </div>
            </div>
            <div className="p-2 border-b border-border">
              <div className="px-2 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Hệ thống liên kết
              </div>
              <DropdownMenuItem asChild>
                <a
                  href="https://crm.rinoedu.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-8 items-center justify-center rounded bg-blue-500/10 text-xs font-bold text-blue-500 dark:bg-blue-500/20">
                      CRM
                    </span>
                    <span>Hệ thống CRM</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://erp.rinoedu.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-8 items-center justify-center rounded bg-emerald-500/10 text-xs font-bold text-emerald-500 dark:bg-emerald-500/20">
                      ERP
                    </span>
                    <span>Hệ thống ERP</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="https://care.rinoedu.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="flex items-center gap-2">
                    <span className="flex h-5 w-8 items-center justify-center rounded bg-indigo-500/10 text-xs font-bold text-indigo-500 dark:bg-indigo-500/20">
                      CARE
                    </span>
                    <span>Hệ thống Care</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </DropdownMenuItem>
            </div>
            <div className="p-2">
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer gap-3 rounded-md px-3 py-2 text-sm font-medium"
                onSelect={(e) => {
                  e.preventDefault()
                  void handleLogout()
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
