import { mockContacts, type Contact } from '@/mocks/contacts'
import type { BirthdayInfo, ContactBirthdayFilter, ContactRoleFilter } from './contactsTypes'

export function getInitialContacts(): Contact[] {
  return [...mockContacts]
}

export function getContactBranches(items: Contact[]): string[] {
  const branches = new Set<string>()
  for (const c of items) {
    if (c.branch) branches.add(c.branch)
    if (c.branches) {
      c.branches.forEach((b) => branches.add(b))
    }
  }
  return Array.from(branches).filter(Boolean).sort()
}

export function countContactsByRole(items: Contact[], role: ContactRoleFilter): number {
  if (role === 'all') return items.length
  return items.filter((c) => c.role === role).length
}

export function getBirthdayInfo(dobString?: string): BirthdayInfo | null {
  if (!dobString) return null
  const parts = dobString.split('-')
  if (parts.length < 3) return null
  const birthYear = parseInt(parts[0], 10)
  const birthMonth = parseInt(parts[1], 10) - 1 // 0-indexed
  const birthDay = parseInt(parts[2], 10)

  if (isNaN(birthYear) || isNaN(birthMonth) || isNaN(birthDay)) return null

  const today = new Date()
  const isToday = birthMonth === today.getMonth() && birthDay === today.getDate()
  const isThisMonth = birthMonth === today.getMonth()

  const dayStr = String(birthDay).padStart(2, '0')
  const monthStr = String(birthMonth + 1).padStart(2, '0')
  const fullDob = `${dayStr}/${monthStr}/${birthYear}`
  const formattedDay = `${dayStr}/${monthStr}`

  let age: number | null = today.getFullYear() - birthYear
  const monthDiff = today.getMonth() - birthMonth
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDay)) {
    age -= 1
  }
  if (age < 0) age = null

  return {
    isToday,
    isThisMonth,
    hasBirthday: isToday || isThisMonth,
    birthYear,
    fullDob,
    formattedDay,
    age,
  }
}

export function countBirthdayThisMonth(items: Contact[]): number {
  return items.filter((c) => {
    const b = getBirthdayInfo(c.dob)
    return b?.isThisMonth
  }).length
}

export function filterContacts(
  items: Contact[],
  filters: {
    search: string
    branch: string
    role: ContactRoleFilter
    birthday: ContactBirthdayFilter
  }
): Contact[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((c) => {
    if (filters.branch !== 'all') {
      const inBranch = c.branch === filters.branch
      const inBranches = c.branches && c.branches.includes(filters.branch)
      if (!inBranch && !inBranches) return false
    }

    if (filters.role !== 'all' && c.role !== filters.role) return false

    if (filters.birthday === 'this_month') {
      const b = getBirthdayInfo(c.dob)
      if (!b?.isThisMonth) return false
    } else if (filters.birthday === 'today') {
      const b = getBirthdayInfo(c.dob)
      if (!b?.isToday) return false
    }

    if (query) {
      const haystack = [
        c.name,
        c.englishName ?? '',
        c.email ?? '',
        c.phone,
        c.address ?? '',
        c.relatedContact?.name ?? '',
        c.relatedContact?.phone ?? '',
        c.notes ?? '',
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function buildEmptyContact(): Contact {
  return {
    id: '',
    name: '',
    role: 'parent',
    phone: '',
    email: '',
    address: '',
    notes: '',
  }
}
