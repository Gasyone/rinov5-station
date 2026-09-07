export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Mã hóa số điện thoại theo định dạng *******xxx (ẩn 7 chữ số đầu, giữ lại 3 số cuối)
 */
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '*******111'
  const clean = phone.replace(/\D/g, '')
  if (clean.length <= 3) return clean || phone
  const last3 = clean.slice(-3)
  const starCount = Math.max(clean.length - 3, 7)
  return `${'*'.repeat(starCount)}${last3}`
}

/**
 * Chuẩn hóa và hiển thị ngày gọn dạng DD/MM/YYYY
 */
export function formatReceiptDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  if (dateStr.includes(' - ')) {
    const parts = dateStr.split(' - ')
    return parts[1] || parts[0]
  }
  if (dateStr.includes(' ')) {
    const parts = dateStr.split(' ')
    return parts[0].includes('/') ? parts[0] : (parts[1] || dateStr)
  }
  return dateStr
}

