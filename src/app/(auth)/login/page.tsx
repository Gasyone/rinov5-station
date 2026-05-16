'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ChevronDown,
  Check,
  Globe,
} from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'

const LOCALE_OPTIONS = [
  { code: 'vi', label: 'Tiếng Việt', flag: 'https://flagcdn.com/w20/vn.png' },
  { code: 'en', label: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
  { code: 'zh', label: '中文', flag: 'https://flagcdn.com/w20/cn.png' },
]

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const { login, isLoading, error, setError } = useAuthStore()
  const router = useRouter()

  const closeLanguageDropdown = useCallback(() => setShowLanguageDropdown(false), [])

  useEffect(() => {
    if (!showLanguageDropdown) return
    const handleClick = () => closeLanguageDropdown()
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [showLanguageDropdown, closeLanguageDropdown])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const ok = await login(identifier, password)
    if (ok) {
      router.push('/app/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen relative bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.18),_transparent_28%),linear-gradient(135deg,_#f8fafc_0%,_#e0f2fe_52%,_#ecfeff_100%)] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center justify-center">
        <div className="relative w-full rounded-[32px] border border-slate-100/80 bg-white/92 p-6 shadow-[0_28px_70px_rgba(15,23,42,0.14)] backdrop-blur sm:p-8">

          <div className="absolute right-6 top-6 z-50">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm shadow-sm transition hover:bg-slate-50"
                onClick={(e) => { e.stopPropagation(); setShowLanguageDropdown(!showLanguageDropdown) }}
              >
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-600">VI</span>
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              {showLanguageDropdown && (
                <div
                  className="absolute right-0 top-full mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
                  onClick={(e) => e.stopPropagation()}
                >
                  {LOCALE_OPTIONS.map((option) => (
                    <button
                      key={option.code}
                      type="button"
                      className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-slate-50"
                      onClick={() => {
                        closeLanguageDropdown()
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <img src={option.flag} alt={option.code} className="h-3.5 w-5 rounded-[2px] object-cover shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                        <span className="font-medium text-slate-700">{option.label}</span>
                      </div>
                      {option.code === 'vi' && <Check className="h-3.5 w-3.5 text-sky-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                {logoFailed ? (
                  <GraduationCap className="h-8 w-8 text-slate-500" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/rinoedu-logo.png"
                    alt="RinoEdu Logo"
                    className="h-full w-full object-contain"
                    onError={() => setLogoFailed(true)}
                  />
                )}
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Đăng nhập
              </h2>
              <p className="text-sm text-slate-400">
                Nhập thông tin đăng nhập để truy cập hệ thống
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Email
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    autoComplete="username"
                    placeholder="Nhập email hoặc username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Mật khẩu
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition-all focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-400">
                  <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type={isPasswordVisible ? 'text' : 'password'}
                    className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-lg text-slate-400 transition hover:text-slate-600"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isLoading}
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
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
