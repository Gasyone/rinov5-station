
/**
 * Injects a hex color as the primary color into the root document element.
 * Respects business rule [RULE-GEN-01] Theme Injection.
 */
export function injectThemeColor(hexColor: string) {
  if (typeof window !== 'undefined' && document?.documentElement) {
    // Hex colors can be set directly to CSS variables
    document.documentElement.style.setProperty('--primary', hexColor)
    document.documentElement.style.setProperty('--ring', hexColor)
    document.documentElement.style.setProperty('--sidebar-primary', hexColor)
  }
}

/**
 * Validates the Organization/Brand name.
 */
export function validateBrandName(name: string): string | null {
  if (!name || name.trim().length === 0) {
    return 'Tên tổ chức không được để trống'
  }
  return null
}

/**
 * Validates operational inputs.
 */
export function validateSessionTimeout(minutes: number): string | null {
  if (minutes < 15) {
    return 'Thời gian Timeout không được nhỏ hơn 15 phút (Quy tắc bảo mật [RULE-SEC-01])'
  }
  if (minutes > 1440) {
    return 'Thời gian Timeout không được lớn hơn 1440 phút (Quy tắc bảo mật [RULE-SEC-01])'
  }
  return null
}

export function validateMinPasswordLength(length: number): string | null {
  if (length < 8) {
    return 'Độ dài mật khẩu tối thiểu phải từ 8 ký tự'
  }
  return null
}

export function validateLockoutAttempts(attempts: number): string | null {
  if (attempts < 1) {
    return 'Số lần đăng nhập sai tối thiểu là 1'
  }
  return null
}
