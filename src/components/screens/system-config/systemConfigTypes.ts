export type ConfigTabId = 'general' | 'security'

export interface TabConfig {
  value: ConfigTabId
  label: string
}

export const CONFIG_TABS: TabConfig[] = [
  { value: 'general', label: 'Cấu hình chung & Branding' },
  { value: 'security', label: 'Tham số bảo mật & Kỹ thuật' },
]

export const LANGUAGE_OPTIONS = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
]

export const TIMEZONE_OPTIONS = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh (UTC+7)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (UTC+8)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
  { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
  { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
]

export const UPLOAD_LIMIT_OPTIONS = [
  { value: '5', label: '5 MB' },
  { value: '10', label: '10 MB' },
  { value: '20', label: '20 MB' },
  { value: '50', label: '50 MB' },
]

export interface PresetLogo {
  id: string
  name: string
  url: string
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'default',
    name: 'Logo RinoEdu Mặc Định',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=80&auto=format&fit=crop&q=60',
  },
  {
    id: 'tech',
    name: 'Tech Blue Logo',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60',
  },
  {
    id: 'warm',
    name: 'Warm Orange Logo',
    url: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=80&auto=format&fit=crop&q=60',
  },
]
