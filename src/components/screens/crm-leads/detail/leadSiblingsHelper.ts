import { mockLeads, type Lead } from '@/mocks/crmLeads'

export interface SiblingLeadItem {
  id: string
  name: string
  age?: number
  code?: string
  url: string
}

/**
 * Trích xuất danh sách các con khác thuộc cùng phụ huynh / gia đình của Lead hiện tại
 * Hỗ trợ tìm kiếm theo parentId, phone, familySiblings và otherChildren
 */
export function getSiblingLeads(
  lead: Lead,
  allLeads: Lead[] = mockLeads,
  basePath = '/app/crm_my_leads'
): SiblingLeadItem[] {
  if (!lead) return []

  const siblings: SiblingLeadItem[] = []
  const seenIds = new Set<string>([lead.id])
  const seenNames = new Set<string>([lead.studentName.toLowerCase().trim()])

  // 1. Tìm các lead khác có cùng parentId
  if (lead.parentId) {
    for (const other of allLeads) {
      if (!seenIds.has(other.id) && other.parentId === lead.parentId) {
        seenIds.add(other.id)
        seenNames.add(other.studentName.toLowerCase().trim())
        siblings.push({
          id: other.id,
          name: other.studentName,
          age: other.studentAge,
          code: other.code,
          url: `${basePath}/${other.id}`,
        })
      }
    }
  }

  // 2. Tìm các lead khác có cùng số điện thoại phụ huynh
  if (lead.phone) {
    const cleanLeadPhone = lead.phone.replace(/\D/g, '')
    for (const other of allLeads) {
      if (!seenIds.has(other.id) && other.phone) {
        const cleanOtherPhone = other.phone.replace(/\D/g, '')
        if (cleanOtherPhone === cleanLeadPhone) {
          seenIds.add(other.id)
          seenNames.add(other.studentName.toLowerCase().trim())
          siblings.push({
            id: other.id,
            name: other.studentName,
            age: other.studentAge,
            code: other.code,
            url: `${basePath}/${other.id}`,
          })
        }
      }
    }
  }

  // 3. Kiểm tra danh sách familySiblings (ví dụ: ['Bé Bình (12t)'])
  if (lead.familySiblings && lead.familySiblings.length > 0) {
    for (const sibStr of lead.familySiblings) {
      const match = sibStr.match(/^(.*?)(?:\s*\((?:(\d+)t|.*?)\))?$/)
      const rawName = (match ? match[1] : sibStr).trim()
      const age = match && match[2] ? parseInt(match[2], 10) : undefined

      if (!seenNames.has(rawName.toLowerCase())) {
        const matched = allLeads.find(
          (l) => l.studentName.toLowerCase().trim() === rawName.toLowerCase()
        )
        if (matched && !seenIds.has(matched.id)) {
          seenIds.add(matched.id)
          seenNames.add(rawName.toLowerCase())
          siblings.push({
            id: matched.id,
            name: matched.studentName,
            age: matched.studentAge || age,
            code: matched.code,
            url: `${basePath}/${matched.id}`,
          })
        } else if (!matched) {
          seenNames.add(rawName.toLowerCase())
          siblings.push({
            id: `sib-${rawName}`,
            name: rawName,
            age,
            url: `${basePath}?search=${encodeURIComponent(rawName)}`,
          })
        }
      }
    }
  }

  // 4. Kiểm tra otherChildren (nếu có)
  if (lead.otherChildren && lead.otherChildren.length > 0) {
    for (const ch of lead.otherChildren) {
      const rawName = ch.name.trim()
      if (!seenNames.has(rawName.toLowerCase())) {
        const matched = allLeads.find(
          (l) => l.studentName.toLowerCase().trim() === rawName.toLowerCase()
        )
        if (matched && !seenIds.has(matched.id)) {
          seenIds.add(matched.id)
          seenNames.add(rawName.toLowerCase())
          siblings.push({
            id: matched.id,
            name: matched.studentName,
            age: matched.studentAge || ch.age,
            code: matched.code,
            url: `${basePath}/${matched.id}`,
          })
        } else if (!matched) {
          seenNames.add(rawName.toLowerCase())
          siblings.push({
            id: `sib-${rawName}`,
            name: rawName,
            age: ch.age,
            url: `${basePath}?search=${encodeURIComponent(rawName)}`,
          })
        }
      }
    }
  }

  return siblings
}
