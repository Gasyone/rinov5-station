import type { OrgUnit, OrgTreeNode, OrgFilterState } from './orgStructureTypes'

export function buildTreeFromUnits(units: OrgUnit[]): OrgTreeNode[] {
  const map = new Map<string, OrgTreeNode>()

  units.forEach((u) => {
    map.set(u.id, { ...u, children: [] })
  })

  const roots: OrgTreeNode[] = []

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export interface FlattenedOrgNode extends OrgUnit {
  level: number
  hasChildren: boolean
}

export function flattenOrgTree(
  nodes: OrgTreeNode[],
  expandedIds: Set<string>,
  level = 0
): FlattenedOrgNode[] {
  const result: FlattenedOrgNode[] = []

  for (const node of nodes) {
    const hasChildren = node.children && node.children.length > 0
    result.push({
      ...node,
      level,
      hasChildren,
    })

    if (hasChildren && expandedIds.has(node.id)) {
      result.push(...flattenOrgTree(node.children, expandedIds, level + 1))
    }
  }

  return result
}

export interface OrgMetrics {
  totalUnits: number
  totalStaff: number
  totalBlocks: number
  totalBranches: number
  totalDepartments: number
}

export function calculateOrgMetrics(units: OrgUnit[]): OrgMetrics {
  return units.reduce(
    (acc, u) => {
      acc.totalUnits += 1
      acc.totalStaff += u.memberCount || 0
      if (u.type === 'block') acc.totalBlocks += 1
      else if (u.type === 'branch') acc.totalBranches += 1
      else if (u.type === 'department') acc.totalDepartments += 1
      return acc
    },
    { totalUnits: 0, totalStaff: 0, totalBlocks: 0, totalBranches: 0, totalDepartments: 0 }
  )
}

export function filterOrgUnits(units: OrgUnit[], filters: OrgFilterState): OrgUnit[] {
  let result = [...units]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase().trim()
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        (u.leaderName ? u.leaderName.toLowerCase().includes(q) : false) ||
        (u.leaderTitle ? u.leaderTitle.toLowerCase().includes(q) : false) ||
        (u.description ? u.description.toLowerCase().includes(q) : false) ||
        Boolean(u.positions?.some((pos) => pos.toLowerCase().includes(q))) ||
        Boolean(u.members?.some((m) => m.title.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)))
    )
  }

  if (filters.type && filters.type !== 'all') {
    result = result.filter((u) => u.type === filters.type)
  }

  return result
}

export function validateUnitCode(code: string, existingUnits: OrgUnit[], currentId?: string): string | null {
  const trimmed = code.trim()
  if (!trimmed) return 'Vui lòng nhập mã đơn vị'
  if (/\s/.test(trimmed)) return 'Mã đơn vị không được chứa khoảng trắng'
  if (!/^[A-Za-z0-9_-]+$/.test(trimmed)) return 'Mã đơn vị chỉ gồm chữ, số, gạch nối (- hoặc _)'

  const isDuplicate = existingUnits.some(
    (u) => u.code.toLowerCase() === trimmed.toLowerCase() && u.id !== currentId
  )
  if (isDuplicate) return 'Mã đơn vị này đã tồn tại'

  return null
}
