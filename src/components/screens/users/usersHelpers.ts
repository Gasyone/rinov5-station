import { mockUsers, type User } from '@/mocks/users'
import type { UserFilterState, UserStatusFilter } from './usersTypes'

export function getInitialUsers(): User[] {
  return [...mockUsers]
}

export function getUserBranches(items: User[]) {
  return Array.from(new Set(items.map((u) => u.branch))).sort()
}

export function getUserRoles(items: User[]): User['role'][] {
  return Array.from(new Set(items.map((u) => u.role))) as User['role'][]
}

export function countUsersByStatus(items: User[], status: UserStatusFilter): number {
  if (status === 'all') return items.length
  return items.filter((u) => u.status === status).length
}

export function filterUsers(
  items: User[],
  filters: {
    search: string
    branch: string
    status: UserStatusFilter
    extra: UserFilterState
  }
): User[] {
  const query = filters.search.trim().toLowerCase()
  return items.filter((u) => {
    if (filters.branch !== 'all' && u.branch !== filters.branch) return false
    if (filters.status !== 'all' && u.status !== filters.status) return false
    if (filters.extra.branches.length > 0 && !filters.extra.branches.includes(u.branch))
      return false
    if (filters.extra.roles.length > 0 && !filters.extra.roles.includes(u.role)) return false
    if (query) {
      const haystack = [u.fullName, u.username, u.email, u.phone ?? '', u.id]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(query)) return false
    }
    return true
  })
}

export function nextUserId(items: User[]): string {
  const max = items.reduce((acc, u) => {
    const numeric = Number.parseInt(u.id.replace(/^\D+/g, ''), 10)
    return Number.isNaN(numeric) ? acc : Math.max(acc, numeric)
  }, 0)
  return `u${max + 1}`
}

export function buildEmptyUser(): Omit<User, 'id'> {
  return {
    email: '',
    username: '',
    fullName: '',
    role: 'sale',
    status: 'active',
    branch: '',
    phone: '',
    createdAt: new Date().toISOString(),
  }
}
