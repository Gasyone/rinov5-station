'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUIStore } from '@/stores/useUIStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

const LOCALE_OPTIONS = [
  { code: 'vi', label: 'Tiếng Việt', shortLabel: 'VI' },
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'zh', label: '中文', shortLabel: 'ZH' },
] as const

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const { login, isLoading, error, setError } = useAuthStore()
  const locale = useUIStore((s) => s.locale)
  const setLocale = useUIStore((s) => s.setLocale)
  const router = useRouter()

  const currentLocale = LOCALE_OPTIONS.find((option) => option.code === locale) ?? LOCALE_OPTIONS[0]

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)
    const ok = await login(identifier, password)
    if (ok) {
      router.push('/app/calendar_class_schedule')
      router.refresh()
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-muted/40 to-accent/40 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center justify-center">
        <div className="relative w-full rounded-3xl border border-border bg-card/95 p-6 shadow-lg backdrop-blur sm:p-8">
          <div className="absolute right-6 top-6 z-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg px-2.5"
                >
                  <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium">{currentLocale.shortLabel}</span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {LOCALE_OPTIONS.map((option) => {
                  const selected = option.code === locale
                  return (
                    <DropdownMenuItem
                      key={option.code}
                      className="flex cursor-pointer items-center justify-between"
                      onSelect={() => setLocale(option.code)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="inline-flex h-5 w-7 items-center justify-center rounded border border-border bg-muted text-[10px] font-semibold text-muted-foreground">
                          {option.shortLabel}
                        </span>
                        <span className="font-medium">{option.label}</span>
                      </span>
                      {selected ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                {logoFailed ? (
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                ) : (
                  <Image
                    src="/rinoedu-logo.png"
                    alt="RinoEdu Logo"
                    width={64}
                    height={64}
                    priority
                    className="h-full w-full object-contain"
                    onError={() => setLogoFailed(true)}
                  />
                )}
              </div>
              <h2 className="text-2xl font-black text-foreground">Đăng nhập</h2>
              <p className="text-sm text-muted-foreground">
                Nhập thông tin đăng nhập để truy cập hệ thống
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <LoginField label="Email" icon={<Mail className="h-4 w-4 text-muted-foreground shrink-0" />}>
                <Input
                  type="text"
                  className="h-auto w-full min-w-0 border-0 bg-transparent p-0 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
                  autoComplete="username"
                  placeholder="Nhập email hoặc username"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                />
              </LoginField>

              <LoginField label="Mật khẩu" icon={<Lock className="h-4 w-4 text-muted-foreground shrink-0" />}>
                <Input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="h-auto w-full min-w-0 border-0 bg-transparent p-0 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground transition hover:text-foreground"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </LoginField>

              {error ? (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full gap-2 rounded-2xl text-sm font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginField({
  label,
  icon,
  children,
  className,
}: {
  label: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 transition-all',
          'focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40',
          className
        )}
      >
        {icon}
        {children}
      </div>
    </label>
  )
}
