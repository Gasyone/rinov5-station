import { mockLeads } from '@/mocks/crmLeads'
import { mockStudents } from '@/mocks/students'
import { mockContacts } from '@/mocks/contacts'
import { PROGRAM_OPTIONS, SUBJECT_MAP } from './trialClassConstants'
import type { TrialContactPerson } from './trialClassCreateTypes'

export function mapLeadSubjectToTrialProgram(targetSubject?: string): string {
  if (!targetSubject) return PROGRAM_OPTIONS[0]
  const lower = targetSubject.toLowerCase()

  if (lower.includes('starter')) return 'Cambridge Starter'
  if (lower.includes('mover')) return 'Cambridge Movers'
  if (lower.includes('flyer')) return 'Cambridge Flyers'
  if (lower.includes('superkid') || lower.includes('nhi đồng')) return 'Cambridge Starter'
  if (lower.includes('kindy') || lower.includes('mẫu giáo')) return 'Cambridge Starter'
  if (lower.includes('foundation') || lower.includes('nền tảng')) return 'English Foundation'
  if (lower.includes('communication kids') || lower.includes('giao tiếp nhí')) return 'Communication Kids'
  if (lower.includes('communication junior') || lower.includes('giao tiếp')) return 'Communication Junior'
  if (lower.includes('ielts junior')) return 'IELTS Junior'
  if (lower.includes('ielts')) return 'IELTS Prep'
  if (lower.includes('toán') || lower.includes('math')) return 'Math Thinking'
  if (lower.includes('phonics')) return 'Phonics'
  if (lower.includes('robotics') || lower.includes('robot')) return 'STEM Robotics'
  if (lower.includes('coding') || lower.includes('lập trình')) return 'STEM Coding'

  const found = PROGRAM_OPTIONS.find((p) => lower.includes(p.toLowerCase()))
  return found || PROGRAM_OPTIONS[0]
}

export function buildTrialContactsList(customContacts: TrialContactPerson[] = []): TrialContactPerson[] {
  const map = new Map<string, TrialContactPerson>()

  // 1. Custom contacts created on-the-fly
  customContacts.forEach((c) => {
    map.set(c.id, c)
  })

  // 2. CRM Leads (highest priority for lead generation)
  mockLeads.forEach((lead) => {
    const pName = lead.parentName || `Phụ huynh ${lead.studentName}`
    const pPhone = lead.phone || '0900000000'
    const key = `lead_${pName}_${pPhone}`

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: pName,
        phone: pPhone,
        source: `Lead CRM (${lead.source || 'Tư vấn'})`,
        isFromLead: true,
        address: lead.address,
        children: [],
      })
    }

    const contact = map.get(key)!
    if (!contact.children.some((c) => c.name === lead.studentName || c.id === lead.id)) {
      contact.children.push({
        id: lead.id,
        name: lead.studentName,
        dob: lead.birthYear ? String(lead.birthYear) : (lead.studentAge ? `${lead.studentAge} tuổi` : undefined),
        targetSubject: lead.targetSubject,
        branch: lead.branch,
        isFromLead: true,
        leadId: lead.id,
      })
    }

    // Include family siblings if mentioned in lead
    if (lead.familySiblings && lead.familySiblings.length > 0) {
      lead.familySiblings.forEach((siblingName, idx) => {
        const cleanName = siblingName.replace(/\s*\(\d+t\)/, '').trim()
        if (!contact.children.some((c) => c.name.toLowerCase() === cleanName.toLowerCase())) {
          contact.children.push({
            id: `sib_${lead.id}_${idx}`,
            name: cleanName,
            targetSubject: lead.targetSubject,
            branch: lead.branch,
            isFromLead: true,
          })
        }
      })
    }
  })

  // 3. Students from Station Database
  mockStudents.forEach((student) => {
    const pName = student.parentName || `Phụ huynh ${student.name}`
    const pPhone = student.parentPhone || student.phone || '0900000000'
    const key = `stu_${pName}_${pPhone}`

    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: pName,
        phone: pPhone,
        source: 'Học viên Station',
        isFromLead: false,
        children: [],
      })
    }

    const contact = map.get(key)!
    if (!contact.children.some((c) => c.id === student.id || c.name === student.name)) {
      contact.children.push({
        id: student.id,
        name: student.name,
        dob: student.dob,
        branch: student.branch,
        isFromLead: false,
      })
    }
  })

  // 4. Contacts from general directory
  mockContacts.forEach((contact) => {
    const key = `dir_${contact.name}_${contact.phone}`
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        name: contact.name,
        phone: contact.phone,
        source: 'Danh bạ chung',
        isFromLead: false,
        children: [
          {
            id: `child_${contact.id}`,
            name: `Học viên (con ${contact.name})`,
            targetSubject: contact.interest,
            branch: contact.branch,
            isFromLead: false,
          },
        ],
      })
    }
  })

  return Array.from(map.values())
}

export function getSubjectForProgram(program: string): string {
  return SUBJECT_MAP[program] || 'Tiếng Anh'
}
