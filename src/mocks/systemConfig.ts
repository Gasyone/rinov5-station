export interface SystemConfig {
  defaultLanguage: 'vi' | 'en' | 'zh'
  timezone: string
  brandName: string
  brandLogoUrl: string
  brandPrimaryColor: string // hex code
  workingMode: 'developer' | 'standard'
  sessionTimeoutMinutes: number
  minPasswordLength: number
  lockoutAttempts: number
  maxUploadSizeMb: number
  passwordRequireComplexity: boolean
  autoAudit: boolean
  remoteVpnAccess: boolean
}

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  defaultLanguage: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  brandName: 'Học viện Giáo dục RinoEdu',
  brandLogoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=80&auto=format&fit=crop&q=60',
  brandPrimaryColor: '#17a2b8', // maps to hsl(195 70% 45%) equivalent in globals.css
  workingMode: 'developer',
  sessionTimeoutMinutes: 30,
  minPasswordLength: 8,
  lockoutAttempts: 5,
  maxUploadSizeMb: 20,
  passwordRequireComplexity: true,
  autoAudit: true,
  remoteVpnAccess: true,
}

// In-memory store for demo session
let currentConfig: SystemConfig = { ...DEFAULT_SYSTEM_CONFIG }

export function getSystemConfig(): SystemConfig {
  return currentConfig
}

export function updateSystemConfig(updates: Partial<SystemConfig>): SystemConfig {
  currentConfig = {
    ...currentConfig,
    ...updates,
  }
  return currentConfig
}

export function resetSystemConfigToDefaults(): SystemConfig {
  currentConfig = { ...DEFAULT_SYSTEM_CONFIG }
  return currentConfig
}
