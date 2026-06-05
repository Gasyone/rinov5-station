export function formatDateTime(isoString: string): string {
  if (!isoString) return ""
  try {
    const date = new Date(isoString)
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${hours}:${minutes} - ${day}/${month}/${year}`
  } catch {
    return isoString
  }
}

export function formatTimeOnly(isoString: string): string {
  if (!isoString) return ""
  try {
    const date = new Date(isoString)
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
  } catch {
    return ""
  }
}

export function validateEventDates(startDateStr: string, endDateStr: string): { isValid: boolean; message?: string } {
  if (!startDateStr || !endDateStr) {
    return { isValid: false, message: "Vui lòng chọn đầy đủ thời gian bắt đầu và kết thúc." }
  }

  const start = new Date(startDateStr)
  const end = new Date(endDateStr)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, message: "Thời gian không hợp lệ." }
  }

  const durationMin = (end.getTime() - start.getTime()) / (1000 * 60)

  if (durationMin < 30) {
    return { isValid: false, message: "Thời gian kết thúc phải sau thời gian bắt đầu tối thiểu 30 phút." }
  }

  return { isValid: true }
}

export function calculatePercentage(registered: number, capacity: number): number {
  if (!capacity || capacity <= 0) return 0
  return Math.min(100, Math.round((registered / capacity) * 100))
}
