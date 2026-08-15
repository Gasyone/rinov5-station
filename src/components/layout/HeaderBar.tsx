'use client'

import { useRef, useState } from 'react'
import {
  Check,
  ExternalLink,
  Globe,
  Home,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  MessageSquarePlus,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { HeaderBrand } from './HeaderBrand'
import { NotificationDropdown } from './NotificationDropdown'
import { FeedbackPopover } from './FeedbackPopover'

const UI_LOCALE_OPTIONS = [
  { code: 'vi', label: 'Tiếng Việt', shortLabel: 'VI' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'zh', label: '中文', shortLabel: 'ZH' },
] as const

interface HeaderBarProps {
  onOpenMobileSidebar: () => void
}

export function HeaderBar({ onOpenMobileSidebar }: HeaderBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
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

  const navMenuItem = currentMenuId
    ? navigationGroups.flatMap((g) => g.items).find((item) => item.id === currentMenuId)
    : null
  const defaultMenuLabel = currentMenuId ? (screens[currentMenuId]?.label || navMenuItem?.label) : null
  const menuLabel = customHeaderTitle || defaultMenuLabel
  const currentGroup = currentMenuId
    ? navigationGroups.find((g) => g.items.some((item) => item.id === currentMenuId))
    : null
  const GroupIcon = currentMenuId === 'dashboard' ? Home : (currentGroup?.icon || null)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
    router.refresh()
  }

  const initial = user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? 'U'

  const closeSearchIfIdle = () => {
    if (searchValue.trim()) return
    if (document.activeElement === searchInputRef.current) return
    setIsSearchOpen(false)
  }

  return (
    <header className="ui-shell-header sticky top-0 z-50 flex h-16 flex-shrink-0 items-center justify-between bg-background/90 px-4 backdrop-blur-md md:pl-4 md:pr-6">
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Open navigation"
          className="ui-icon-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          onClick={onOpenMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <HeaderBrand />

        {menuLabel && (
          <div className="flex items-center gap-2 border-l border-border pl-3 md:pl-4">
            {GroupIcon && <GroupIcon className="h-4 w-4 text-muted-foreground/80 shrink-0" />}
            <span className="text-sm font-semibold text-foreground tracking-tight truncate max-w-[140px] sm:max-w-none">
              {menuLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div
          className={cn(
            'hidden h-10 items-center rounded-full border transition-[width,background-color,border-color,box-shadow] duration-200 md:flex',
            isSearchOpen
              ? 'w-72 border-border bg-background shadow-xs'
              : 'w-10 border-transparent bg-transparent shadow-none'
          )}
          onMouseEnter={() => setIsSearchOpen(true)}
          onMouseLeave={closeSearchIfIdle}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Search"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent bg-transparent p-0 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => {
              setIsSearchOpen(true)
              window.requestAnimationFrame(() => searchInputRef.current?.focus())
            }}
          >
            <Search className="h-4 w-4" />
          </Button>
          <div
            className={cn(
              'grid min-w-0 transition-[grid-template-columns,opacity] duration-200',
              isSearchOpen ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0'
            )}
          >
            <Input
              ref={searchInputRef}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={closeSearchIfIdle}
              placeholder="Search..."
              className="h-auto min-w-0 border-0 bg-transparent p-0 pr-3 text-sm shadow-none outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Feedback Popover Button */}
        <FeedbackPopover />

        {/* Settings: language + theme */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Cài đặt"
              className="ui-icon-button inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent p-0 leading-none text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
            >
              <Settings className="h-5 w-5" />
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

        {/* Notifications */}
        <NotificationDropdown />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Tài khoản"
              className="group inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-transparent p-1 leading-none transition-colors hover:bg-accent data-[state=open]:bg-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                {initial}
              </div>
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
                <p className="mt-1 text-[11px] font-semibold capitalize text-muted-foreground">
                  {user?.role ?? ''}
                </p>
              </div>
            </div>
            <div className="p-2 border-b border-border bg-muted/20">
              <div className="flex items-center justify-between px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
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
                        <span className="text-[10px] text-muted-foreground/80 font-normal truncate">
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
              <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
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
                    <span className="flex h-5 w-8 items-center justify-center rounded bg-blue-500/10 text-[10px] font-bold text-blue-500 dark:bg-blue-500/20">
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
                    <span className="flex h-5 w-8 items-center justify-center rounded bg-emerald-500/10 text-[10px] font-bold text-emerald-500 dark:bg-emerald-500/20">
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
                    <span className="flex h-5 w-8 items-center justify-center rounded bg-indigo-500/10 text-[10px] font-bold text-indigo-500 dark:bg-indigo-500/20">
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
