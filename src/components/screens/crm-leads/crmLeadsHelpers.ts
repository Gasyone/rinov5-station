import { Lead, LeadChild } from '@/mocks/crmLeads'

/**
 * Che số điện thoại chỉ hiển thị 3 số cuối
 * Ví dụ: "0912345678" -> "*******678"
 */
export function maskPhoneNumber(phone?: string): string {
  if (!phone || phone.length < 3) return phone || '---'
  const last3 = phone.slice(-3)
  const maskedLength = Math.max(phone.length - 3, 5)
  return `${'*'.repeat(maskedLength)}${last3}`
}

/**
 * Định dạng hiển thị Học viên (Con): Tên (Tuổi - Năm sinh)
 * Ví dụ: "Bé An (8t - 2018)"
 */
export function formatChildLabel(child: LeadChild): string {
  const birthYear = child.birthYear ?? 2026 - child.age
  return `${child.name} (${child.age}t - ${birthYear})`
}

export function calculateStatusTileCounts(leads: Lead[]) {
  const counts: Record<string, number> = {
    all: leads.length,
    chua_tiep_can: 0,
    dang_cham_soc: 0,
    danh_gia_trai_nghiem: 0,
    tiem_nang: 0,
    chuyen_doi: 0,
    that_bai: 0,
  }

  leads.forEach((lead) => {
    if (counts[lead.status] !== undefined) {
      counts[lead.status]++
    }
  })

  return counts
}
