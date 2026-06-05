'use client'

import { useState, useEffect } from 'react'
import { 
  Terminal, 
  MessageSquare, 
  Globe, 
  ShieldAlert, 
  Undo2, 
  Save, 
  Settings2, 
  Palette,
  CheckCircle,
  HelpCircle,
  Image as ImageIcon
} from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { 
  PageHeader, 
  FieldLabel, 
  ConfirmDialog 
} from '@/components/shared'
import { SegmentedControl, InlineSelect } from '@/components/controls'
import { 
  getSystemConfig, 
  updateSystemConfig, 
  resetSystemConfigToDefaults, 
  SystemConfig 
} from '@/mocks/systemConfig'
import { 
  CONFIG_TABS, 
  LANGUAGE_OPTIONS, 
  TIMEZONE_OPTIONS, 
  UPLOAD_LIMIT_OPTIONS, 
  PRESET_LOGOS,
  ConfigTabId
} from './systemConfigTypes'
import { 
  injectThemeColor, 
  validateBrandName, 
  validateSessionTimeout, 
  validateMinPasswordLength, 
  validateLockoutAttempts 
} from './systemConfigHelpers'

export function SystemConfigScreen() {
  const [activeTab, setActiveTab] = useState<ConfigTabId>('general')
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)

  // Get initial config synchronously
  const initialConfig = getSystemConfig()

  // System State Fields
  const [defaultLanguage, setDefaultLanguage] = useState<SystemConfig['defaultLanguage']>(initialConfig.defaultLanguage)
  const [timezone, setTimezone] = useState(initialConfig.timezone)
  const [brandName, setBrandName] = useState(initialConfig.brandName)
  const [brandLogoUrl, setBrandLogoUrl] = useState(initialConfig.brandLogoUrl)
  const [brandPrimaryColor, setBrandPrimaryColor] = useState(initialConfig.brandPrimaryColor)
  const [workingMode, setWorkingMode] = useState<SystemConfig['workingMode']>(initialConfig.workingMode)
  
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(initialConfig.sessionTimeoutMinutes)
  const [minPasswordLength, setMinPasswordLength] = useState(initialConfig.minPasswordLength)
  const [lockoutAttempts, setLockoutAttempts] = useState(initialConfig.lockoutAttempts)
  const [maxUploadSizeMb, setMaxUploadSizeMb] = useState(String(initialConfig.maxUploadSizeMb))
  
  const [passwordRequireComplexity, setPasswordRequireComplexity] = useState(initialConfig.passwordRequireComplexity)
  const [autoAudit, setAutoAudit] = useState(initialConfig.autoAudit)
  const [remoteVpnAccess, setRemoteVpnAccess] = useState(initialConfig.remoteVpnAccess)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  const loadConfigIntoState = (config: SystemConfig) => {
    setDefaultLanguage(config.defaultLanguage)
    setTimezone(config.timezone)
    setBrandName(config.brandName)
    setBrandLogoUrl(config.brandLogoUrl)
    setBrandPrimaryColor(config.brandPrimaryColor)
    setWorkingMode(config.workingMode)
    setSessionTimeoutMinutes(config.sessionTimeoutMinutes)
    setMinPasswordLength(config.minPasswordLength)
    setLockoutAttempts(config.lockoutAttempts)
    setMaxUploadSizeMb(String(config.maxUploadSizeMb))
    setPasswordRequireComplexity(config.passwordRequireComplexity)
    setAutoAudit(config.autoAudit)
    setRemoteVpnAccess(config.remoteVpnAccess)
    setErrors({})
  }

  // Load initial settings
  useEffect(() => {
    // Dynamic theme colors inject on initial mount
    injectThemeColor(initialConfig.brandPrimaryColor)
  }, [initialConfig.brandPrimaryColor])

  // Live theme color changes
  const handleColorChange = (hex: string) => {
    setBrandPrimaryColor(hex)
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      injectThemeColor(hex)
    }
  }

  // Handle updates validation
  const runValidation = (): boolean => {
    const newErrors: Record<string, string> = {}

    const nameErr = validateBrandName(brandName)
    if (nameErr) newErrors.brandName = nameErr

    const timeoutErr = validateSessionTimeout(sessionTimeoutMinutes)
    if (timeoutErr) newErrors.sessionTimeoutMinutes = timeoutErr

    const minPassErr = validateMinPasswordLength(minPasswordLength)
    if (minPassErr) newErrors.minPasswordLength = minPassErr

    const lockoutErr = validateLockoutAttempts(lockoutAttempts)
    if (lockoutErr) newErrors.lockoutAttempts = lockoutErr

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!runValidation()) {
      toast.error('Vui lòng kiểm tra lại các trường thông tin lỗi.')
      return
    }

    const updated = updateSystemConfig({
      defaultLanguage,
      timezone,
      brandName,
      brandLogoUrl,
      brandPrimaryColor,
      workingMode,
      sessionTimeoutMinutes,
      minPasswordLength,
      lockoutAttempts,
      maxUploadSizeMb: Number(maxUploadSizeMb),
      passwordRequireComplexity,
      autoAudit,
      remoteVpnAccess,
    })

    // Instant color confirmation
    injectThemeColor(updated.brandPrimaryColor)
    
    toast.success('Lưu cấu hình hệ thống thành công!', {
      description: 'Các thay đổi đã được cập nhật trực tiếp vào phiên chạy demo hiện tại.',
    })
  }

  const handleRestoreDefaults = () => {
    const config = resetSystemConfigToDefaults()
    loadConfigIntoState(config)
    injectThemeColor(config.brandPrimaryColor)
    toast.success('Đã khôi phục các tham số hệ thống về mặc định.', {
      description: 'Màu sắc và các cài đặt chính đã được reset thành công.',
    })
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-background/50">
      <PageHeader
        title="Cấu hình hệ thống"
        description="Quản lý các thiết lập vận hành hệ thống, khu vực hóa, nhận diện thương hiệu và bảo mật."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              className="h-8 gap-1.5"
            >
              <Undo2 className="h-3.5 w-3.5" />
              Khôi phục mặc định
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Save className="h-3.5 w-3.5" />
              Lưu thay đổi
            </Button>
          </div>
        }
      />

      {/* Tabs list navigation */}
      <div className="px-4 border-b border-border lg:px-6 py-2 bg-card/45 flex items-center">
        <SegmentedControl
          value={activeTab}
          options={CONFIG_TABS}
          onValueChange={(val) => setActiveTab(val as ConfigTabId)}
          className="w-full sm:w-auto"
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6 space-y-6">
        {activeTab === 'general' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl items-start">
            
            {/* Column 1 & 2: Main settings */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Localization Section */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Globe className="h-4.5 w-4.5 text-primary" />
                  <h2 className="text-sm font-semibold">Ngôn ngữ &amp; Khu vực hóa</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldLabel label="Ngôn ngữ mặc định" required>
                    <InlineSelect
                      value={defaultLanguage}
                      options={LANGUAGE_OPTIONS}
                      onValueChange={(val) => setDefaultLanguage(val as SystemConfig['defaultLanguage'])}
                      variant="solid"
                      className="h-9"
                    />
                  </FieldLabel>

                  <FieldLabel label="Múi giờ hệ thống" required>
                    <InlineSelect
                      value={timezone}
                      options={TIMEZONE_OPTIONS}
                      onValueChange={setTimezone}
                      variant="solid"
                      className="h-9"
                    />
                  </FieldLabel>
                </div>
              </div>

              {/* Branding Section */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-5">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Palette className="h-4.5 w-4.5 text-primary" />
                  <h2 className="text-sm font-semibold">Nhận diện thương hiệu (Branding)</h2>
                </div>

                <div className="space-y-4">
                  <FieldLabel 
                    label="Tên tổ chức / Thương hiệu" 
                    required 
                    error={errors.brandName}
                    description="Hiển thị trên tiêu đề tab trình duyệt, hóa đơn và email hệ thống."
                  >
                    <Input
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="Nhập tên tổ chức..."
                      className="h-9 text-sm"
                    />
                  </FieldLabel>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                    
                    {/* Primary Color selection */}
                    <FieldLabel 
                      label="Màu chủ đạo ứng dụng" 
                      description="Thay đổi màu sắc giao diện chính (CSS Variable --primary)."
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          {/* Circle preview with native HTML color picker */}
                          <div 
                            className="relative flex items-center justify-center h-9 w-9 rounded-full border border-border shadow-xs cursor-pointer overflow-hidden transition-transform hover:scale-105 active:scale-95" 
                            style={{ backgroundColor: brandPrimaryColor }}
                            title="Chọn màu sắc tùy chỉnh"
                          >
                            <input
                              type="color"
                              value={brandPrimaryColor}
                              onChange={(e) => handleColorChange(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                          </div>
                          <Input
                            value={brandPrimaryColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            placeholder="#17a2b8"
                            className="h-9 text-sm font-mono uppercase w-32"
                          />
                        </div>

                        {/* Quick pick palettes */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          {[
                            { hex: '#17a2b8', name: 'Mặc định (Teal)' },
                            { hex: '#4f46e5', name: 'Indigo' },
                            { hex: '#10b981', name: 'Emerald' },
                            { hex: '#f97316', name: 'Orange' },
                            { hex: '#8b5cf6', name: 'Violet' },
                            { hex: '#ef4444', name: 'Crimson' }
                          ].map((preset) => (
                            <button
                              key={preset.hex}
                              type="button"
                              onClick={() => handleColorChange(preset.hex)}
                              className="w-6 h-6 rounded-full border border-border shadow-2xs hover:scale-110 active:scale-95 transition-transform"
                              style={{ backgroundColor: preset.hex }}
                              title={preset.name}
                            />
                          ))}
                        </div>
                      </div>
                    </FieldLabel>

                    {/* App Logo Preset Selector */}
                    <FieldLabel 
                      label="Logo thương hiệu" 
                      description="Lựa chọn logo hiển thị trên thanh Menu bên hoặc Header."
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {PRESET_LOGOS.map((logo) => {
                          const isActive = brandLogoUrl === logo.url
                          return (
                            <button
                              key={logo.id}
                              type="button"
                              onClick={() => setBrandLogoUrl(logo.url)}
                              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-all bg-card overflow-hidden ${
                                isActive 
                                  ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                                  : 'border-border hover:bg-muted/30 hover:border-muted-foreground/30'
                              }`}
                            >
                              <img 
                                src={logo.url} 
                                alt={logo.name} 
                                className="h-8 w-8 object-contain rounded bg-muted/20" 
                              />
                              <span className="text-[10px] truncate max-w-full font-medium text-muted-foreground">
                                {logo.name}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </FieldLabel>

                  </div>

                  <FieldLabel label="Liên kết URL Logo tùy chỉnh" description="Nhập địa chỉ URL logo ngoài nếu không sử dụng các preset trên.">
                    <div className="flex gap-2 items-center">
                      <Input
                        value={brandLogoUrl}
                        onChange={(e) => setBrandLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="h-9 text-sm"
                      />
                      {brandLogoUrl ? (
                        <div className="h-9 w-9 shrink-0 flex items-center justify-center border border-border rounded-lg bg-card overflow-hidden">
                          <img 
                            src={brandLogoUrl} 
                            alt="Custom Logo Preview" 
                            className="h-7 w-7 object-contain"
                            onError={(e) => {
                              // Fallback image indicator if invalid URL
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </FieldLabel>

                </div>
              </div>

              {/* Working Mode Component Section */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Chế độ làm việc</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Chọn mức độ chi tiết kỹ thuật mà Codex hiển thị</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: For programming */}
                  <div
                    onClick={() => setWorkingMode('developer')}
                    className={`group relative flex items-center justify-between rounded-xl border p-4 shadow-2xs transition-all duration-200 cursor-pointer ${
                      workingMode === 'developer'
                        ? 'border-primary/80 bg-primary/5 ring-1 ring-primary/30 dark:bg-primary/10'
                        : 'border-border bg-card hover:bg-muted/40 hover:border-ring/30 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary ${
                        workingMode === 'developer' ? 'bg-primary/15 text-primary dark:text-primary-foreground' : ''
                      }`}>
                        <Terminal className="h-5 w-5" />
                      </div>
                      <div className="ml-3 mr-4 flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-foreground truncate">
                          Cho lập trình
                        </span>
                        <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">
                          Phản hồi mang tính kỹ thuật hơn và kiể...
                        </span>
                      </div>
                    </div>
                    {/* Custom Radio Button Circle */}
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      workingMode === 'developer' 
                        ? 'border-primary' 
                        : 'border-muted-foreground/30 group-hover:border-primary/60'
                    }`}>
                      {workingMode === 'developer' ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-in zoom-in-50 duration-200" />
                      ) : null}
                    </div>
                  </div>

                  {/* Card 2: Daily operations */}
                  <div
                    onClick={() => setWorkingMode('standard')}
                    className={`group relative flex items-center justify-between rounded-xl border p-4 shadow-2xs transition-all duration-200 cursor-pointer ${
                      workingMode === 'standard'
                        ? 'border-primary/80 bg-primary/5 ring-1 ring-primary/30 dark:bg-primary/10'
                        : 'border-border bg-card hover:bg-muted/40 hover:border-ring/30 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary ${
                        workingMode === 'standard' ? 'bg-primary/15 text-primary dark:text-primary-foreground' : ''
                      }`}>
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="ml-3 mr-4 flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-foreground truncate">
                          Cho công việc hằng ngày
                        </span>
                        <span className="block text-xs text-muted-foreground mt-0.5 leading-relaxed truncate">
                          Vẫn mạnh mẽ, ít chi tiết kỹ thuật hơn
                        </span>
                      </div>
                    </div>
                    {/* Custom Radio Button Circle */}
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      workingMode === 'standard' 
                        ? 'border-primary' 
                        : 'border-muted-foreground/30 group-hover:border-primary/60'
                    }`}>
                      {workingMode === 'standard' ? (
                        <div className="h-2.5 w-2.5 rounded-full bg-primary animate-in zoom-in-50 duration-200" />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Column 3: Live Preview & Settings Info */}
            <div className="xl:col-span-1 space-y-6">
              
              {/* Branding Live Preview Widget */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-1.5 border-b border-border/60 pb-3">
                  <Settings2 className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Xem trước thương hiệu</h2>
                </div>

                <div className="space-y-4 bg-muted/20 rounded-lg p-4 border border-border/40">
                  {/* Simulated App Header */}
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {brandLogoUrl ? (
                        <img 
                          src={brandLogoUrl} 
                          alt="Logo Preview" 
                          className="h-6 w-6 object-contain rounded bg-white p-0.5 border border-border/50" 
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground bg-muted p-1 rounded" />
                      )}
                      <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                        {brandName || 'Chưa đặt tên'}
                      </span>
                    </div>
                    <div className="h-1.5 w-6 rounded bg-muted-foreground/20" />
                  </div>

                  {/* Simulated Buttons & Accents */}
                  <div className="space-y-3">
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Màu nhấn chủ đạo (Primary color) sẽ được áp dụng cho các thành phần hành động, tiêu điểm và đường viền active trong toàn trang web.
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-md text-white transition-all shadow-xs flex-1 text-center cursor-default"
                        style={{ backgroundColor: brandPrimaryColor }}
                      >
                        Nút chính
                      </button>
                      <button 
                        type="button"
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-md border border-border bg-card text-foreground flex-1 text-center cursor-default hover:bg-muted/20"
                      >
                        Nút phụ
                      </button>
                    </div>

                    {/* Simulated Text Highlight */}
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="h-3 w-3 rounded-full border flex items-center justify-center" 
                        style={{ borderColor: brandPrimaryColor }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: brandPrimaryColor }} />
                      </span>
                      <span className="text-[10px] font-medium" style={{ color: brandPrimaryColor }}>
                        Trạng thái Hoạt động
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-2 pt-1">
                  <div className="flex gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Lưu cấu hình sẽ tự động cập nhật Header và Menu của bạn ngay lập tức.</span>
                  </div>
                </div>
              </div>

              {/* Working mode description info */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Về Chế độ làm việc</h3>
                </div>
                <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
                  <p>
                    <strong>Chế độ lập trình:</strong> Ưu tiên hiển thị chi tiết mã nguồn, log kỹ thuật và giao diện dòng lệnh. Phù hợp cho lập trình viên quản trị hệ thống.
                  </p>
                  <p>
                    <strong>Chế độ nghiệp vụ hằng ngày:</strong> Ẩn bớt thông tin debug kỹ thuật, tối ưu hóa giao diện cho tác vụ tư vấn tuyển sinh và vận hành trung tâm lớp học.
                  </p>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl items-start animate-in fade-in-50 duration-200">
            
            {/* Tab 2: Security & Technical parameters */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Technical Parameters Card */}
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                  <Settings2 className="h-4.5 w-4.5 text-primary" />
                  <h2 className="text-sm font-semibold">Tham số kỹ thuật vận hành</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FieldLabel 
                    label="Thời gian Timeout phiên (phút)" 
                    required 
                    error={errors.sessionTimeoutMinutes}
                    description="Thời gian nhàn rỗi (idle) trước khi tự động đăng xuất người dùng. Giới hạn 15 - 1440 phút."
                  >
                    <Input
                      type="number"
                      value={sessionTimeoutMinutes}
                      onChange={(e) => setSessionTimeoutMinutes(Number(e.target.value))}
                      className="h-9 text-sm"
                      min={15}
                      max={1440}
                    />
                  </FieldLabel>

                  <FieldLabel 
                    label="Độ dài mật khẩu tối thiểu" 
                    required 
                    error={errors.minPasswordLength}
                    description="Yêu cầu tối thiểu khi thiết lập hoặc thay đổi mật khẩu người dùng. Min là 8 ký tự."
                  >
                    <Input
                      type="number"
                      value={minPasswordLength}
                      onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                      className="h-9 text-sm"
                      min={8}
                    />
                  </FieldLabel>

                  <FieldLabel 
                    label="Số lần đăng nhập sai tối đa" 
                    required 
                    error={errors.lockoutAttempts}
                    description="Số lần nhập mật khẩu sai liên tiếp trước khi khóa tài khoản tạm thời chống brute-force."
                  >
                    <Input
                      type="number"
                      value={lockoutAttempts}
                      onChange={(e) => setLockoutAttempts(Number(e.target.value))}
                      className="h-9 text-sm"
                      min={1}
                    />
                  </FieldLabel>

                  <FieldLabel 
                    label="Giới hạn dung lượng File tải lên" 
                    required
                    description="Dung lượng tối đa cho mỗi tệp tin đính kèm hình ảnh hoặc hợp đồng trong hệ thống."
                  >
                    <InlineSelect
                      value={maxUploadSizeMb}
                      options={UPLOAD_LIMIT_OPTIONS}
                      onValueChange={setMaxUploadSizeMb}
                      variant="solid"
                      className="h-9"
                    />
                  </FieldLabel>
                </div>
              </div>

              {/* Permissions switches group exactly matching reference style */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Các quyền</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Cấu hình các chính sách và đặc quyền bảo mật nâng cao</p>
                </div>

                <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden divide-y divide-border">
                  
                  {/* Item 1: Default Permissions */}
                  <div className="flex items-start justify-between gap-4 p-4 hover:bg-muted/20 transition-colors">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <span className="block text-sm font-medium text-foreground">
                        Quyền mặc định
                      </span>
                      <span className="block text-xs text-muted-foreground leading-relaxed">
                        Theo mặc định, Codex có thể đọc và chỉnh sửa tệp trong không gian làm việc của mình. Codex có thể yêu cầu quyền truy cập bổ sung khi cần.
                      </span>
                    </div>
                    <Switch
                      checked={remoteVpnAccess}
                      onCheckedChange={setRemoteVpnAccess}
                      className="mt-1"
                    />
                  </div>

                  {/* Item 2: Automatic Audit / Review */}
                  <div className="flex items-start justify-between gap-4 p-4 hover:bg-muted/20 transition-colors">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <span className="block text-sm font-medium text-foreground">
                        Rà soát tự động
                      </span>
                      <span className="block text-xs text-muted-foreground leading-relaxed">
                        Codex có thể đọc và chỉnh sửa tệp trong không gian làm việc của mình. Codex tự động rà soát các yêu cầu xin thêm quyền truy cập. Rà soát tự động có thể mắc lỗi. <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline font-medium">Tìm hiểu thêm</a> về các rủi ro tăng cao.
                      </span>
                    </div>
                    <Switch
                      checked={autoAudit}
                      onCheckedChange={setAutoAudit}
                      className="mt-1"
                    />
                  </div>

                  {/* Item 3: Full access permissions */}
                  <div className="flex items-start justify-between gap-4 p-4 hover:bg-muted/20 transition-colors">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <span className="block text-sm font-medium text-foreground">
                        Toàn quyền truy cập
                      </span>
                      <span className="block text-xs text-muted-foreground leading-relaxed">
                        Khi Codex chạy với quyền truy cập đầy đủ, nó có thể chỉnh sửa mọi tệp trên máy tính của bạn và chạy lệnh có truy cập mạng mà không cần bạn chấp thuận. Điều này làm tăng đáng kể nguy cơ mất dữ liệu, rò rỉ hoặc hành vi ngoài dự kiến. <a href="#" onClick={(e) => e.preventDefault()} className="text-primary hover:underline font-medium">Tìm hiểu thêm</a> về các rủi ro tăng cao.
                      </span>
                    </div>
                    <Switch
                      checked={passwordRequireComplexity}
                      onCheckedChange={setPasswordRequireComplexity}
                      className="mt-1"
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* Tech rules summary card column */}
            <div className="xl:col-span-1 space-y-6">
              
              <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lưu ý bảo mật</h3>
                </div>
                <div className="text-xs text-muted-foreground space-y-3 leading-relaxed">
                  <p>
                    <strong>Thời gian phiên timeout:</strong> Đặt quá ngắn sẽ gây phiền phức khi thao tác liên tục; quá dài làm tăng rủi ro khi quên khóa màn hình máy tính ([RULE-SEC-01]).
                  </p>
                  <p>
                    <strong>Quy định mật khẩu:</strong> Mật khẩu dài và có ký tự đặc biệt giúp ngăn chặn việc dò quét brute-force hiệu quả. Bất kỳ sự thay đổi nào chỉ áp dụng với tài khoản mới hoặc khi yêu cầu reset mật khẩu ([RULE-SEC-02]).
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>

      {/* Confirmation Dialog for Default Reset */}
      <ConfirmDialog
        open={isResetConfirmOpen}
        onOpenChange={setIsResetConfirmOpen}
        title="Xác nhận khôi phục mặc định?"
        description="Toàn bộ cấu hình hệ thống bao gồm nhận diện thương hiệu, màu sắc, chế độ làm việc và các tham số kỹ thuật sẽ quay về cấu hình an toàn gốc. Hành động này không thể hoàn tác trong phiên làm việc."
        confirmLabel="Khôi phục"
        cancelLabel="Hủy bỏ"
        variant="destructive"
        onConfirm={handleRestoreDefaults}
      />
    </div>
  )
}
export default SystemConfigScreen
