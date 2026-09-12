'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import {
  mockOrgUnits,
  type OrgUnit,
  type OrgStaffMember,
} from '@/mocks/orgStructure'
import { OrgStructureToolbar } from './OrgStructureToolbar'
import { OrgStructureTableView } from './OrgStructureTableView'
import { OrgUnitCreateDialog } from './OrgUnitCreateDialog'
import { OrgUnitDetailDialog } from './OrgUnitDetailDialog'
import { OrgStaffTransferDialog } from './OrgStaffTransferDialog'
import {
  buildTreeFromUnits,
  filterOrgUnits,
} from './orgStructureHelpers'
import type { OrgFilterState } from './orgStructureTypes'

export function OrgStructureScreen() {
  const searchParams = useSearchParams()
  const targetUnitId = searchParams.get('unitId')

  const [units, setUnits] = useState<OrgUnit[]>(() => [...mockOrgUnits])
  const [filters, setFilters] = useState<OrgFilterState>({
    search: '',
    type: 'all',
  })

  // Set of expanded node IDs for both Tree and Table
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['org-bod', 'org-academic-ops-block', 'org-region-north', 'org-commercial-block'])
  )

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [defaultParentId, setDefaultParentId] = useState<string | undefined>(undefined)
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [transferTargetStaff, setTransferTargetStaff] = useState<OrgStaffMember | null>(null)
  const [transferPresetTitle, setTransferPresetTitle] = useState<string | undefined>(undefined)

  // Tự động mở rộng cây và bật popup xem chi tiết khi điều hướng từ trang Chức danh qua
  useEffect(() => {
    if (!targetUnitId) return

    const matchedUnit = units.find((u) => u.id === targetUnitId)
    if (matchedUnit) {
      const ancestors: string[] = []
      let currentParentId = matchedUnit.parentId
      while (currentParentId) {
        ancestors.push(currentParentId)
        const parentUnit = units.find((u) => u.id === currentParentId)
        currentParentId = parentUnit?.parentId || null
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedIds((prev) => new Set([...prev, ...ancestors, matchedUnit.id]))
      setSelectedUnit(matchedUnit)
      setIsDetailOpen(true)
      toast.info(`Đang xem chi tiết đơn vị: ${matchedUnit.name}`)
    }
  }, [targetUnitId, units])


  const filteredUnits = useMemo(() => {
    return filterOrgUnits(units, filters)
  }, [units, filters])

  const tree = useMemo(() => {
    return buildTreeFromUnits(filteredUnits)
  }, [filteredUnits])

  const handleToggleExpand = (nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const isAllExpanded = expandedIds.size > 0

  const handleToggleExpandAll = () => {
    if (expandedIds.size > 0) {
      setExpandedIds(new Set())
    } else {
      setExpandedIds(new Set(units.map((u) => u.id)))
    }
  }

  const handleCreateUnit = (
    newUnitData: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'members'>
  ) => {
    const newUnit: OrgUnit = {
      ...newUnitData,
      id: `org-${newUnitData.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      memberCount: 0,
      positions: newUnitData.positions && newUnitData.positions.length > 0 ? newUnitData.positions : [],
      members: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    setUnits((prev) => [...prev, newUnit])

    // Expand parent if created as child
    if (newUnit.parentId) {
      setExpandedIds((prev) => new Set([...prev, newUnit.parentId!]))
    }
  }

  const handleAddChild = (parentUnit: OrgUnit) => {
    setDefaultParentId(parentUnit.id)
    setIsCreateOpen(true)
  }

  const handleTransferStaffClick = (unit: OrgUnit, staff?: OrgStaffMember, targetTitle?: string) => {
    setSelectedUnit(unit)
    setTransferTargetStaff(staff || null)
    setTransferPresetTitle(targetTitle)
    setIsTransferOpen(true)
  }

  const handleAddPosition = (unitId: string, positionName: string) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          const currentPositions = u.positions || []
          if (currentPositions.includes(positionName)) return u
          return {
            ...u,
            positions: [...currentPositions, positionName],
          }
        }
        return u
      })
    )
    setSelectedUnit((prev) => {
      if (prev?.id === unitId) {
        const currentPositions = prev.positions || []
        if (currentPositions.includes(positionName)) return prev
        return {
          ...prev,
          positions: [...currentPositions, positionName],
        }
      }
      return prev
    })
    toast.success(`Đã thêm chức danh "${positionName}" vào đơn vị`)
  }

  const handleAssignStaffToPosition = (
    unitId: string,
    positionTitle: string,
    assignedStaff: OrgStaffMember[]
  ) => {
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          const assignedIds = new Set(assignedStaff.map((s) => s.id))
          const remainingMembers = (u.members || []).filter((m) => {
            const mClean = m.title.trim().toLowerCase()
            const pClean = positionTitle.trim().toLowerCase()
            const hadThisTitle =
              mClean === pClean || mClean.includes(pClean) || pClean.includes(mClean)
            if (hadThisTitle) {
              return assignedIds.has(m.id)
            }
            return true
          })

          const existingIds = new Set(remainingMembers.map((m) => m.id))
          const newMembers = [...remainingMembers]
          assignedStaff.forEach((s) => {
            if (!existingIds.has(s.id)) {
              newMembers.push(s)
            } else {
              const idx = newMembers.findIndex((m) => m.id === s.id)
              if (idx !== -1) {
                newMembers[idx] = { ...newMembers[idx], title: positionTitle }
              }
            }
          })

          return {
            ...u,
            members: newMembers,
            memberCount: newMembers.length,
          }
        }
        return u
      })
    )

    setSelectedUnit((prev) => {
      if (!prev || prev.id !== unitId) return prev
      const assignedIds = new Set(assignedStaff.map((s) => s.id))
      const remainingMembers = (prev.members || []).filter((m) => {
        const mClean = m.title.trim().toLowerCase()
        const pClean = positionTitle.trim().toLowerCase()
        const hadThisTitle =
          mClean === pClean || mClean.includes(pClean) || pClean.includes(mClean)
        if (hadThisTitle) {
          return assignedIds.has(m.id)
        }
        return true
      })

      const existingIds = new Set(remainingMembers.map((m) => m.id))
      const newMembers = [...remainingMembers]
      assignedStaff.forEach((s) => {
        if (!existingIds.has(s.id)) {
          newMembers.push(s)
        } else {
          const idx = newMembers.findIndex((m) => m.id === s.id)
          if (idx !== -1) {
            newMembers[idx] = { ...newMembers[idx], title: positionTitle }
          }
        }
      })

      return {
        ...prev,
        members: newMembers,
        memberCount: newMembers.length,
      }
    })

    toast.success(`Đã cập nhật nhân sự cho chức danh "${positionTitle}"`)
  }

  const handleExecuteTransfer = (params: {
    staffId: string
    fromUnitId: string
    toUnitId: string
    newTitle: string
    effectiveDate: string
    note: string
  }) => {
    setUnits((prev) => {
      const fromUnit = prev.find((u) => u.id === params.fromUnitId)
      const toUnit = prev.find((u) => u.id === params.toUnitId)
      if (!fromUnit || !toUnit) return prev

      const staffIdx = fromUnit.members.findIndex((m) => m.id === params.staffId)
      if (staffIdx === -1) return prev

      const staff = fromUnit.members[staffIdx]
      const newFromMembers = fromUnit.members.filter((_, idx) => idx !== staffIdx)
      const newToMembers = [
        ...toUnit.members,
        {
          ...staff,
          title: params.newTitle || staff.title,
          joinedDate: params.effectiveDate,
        },
      ]

      return prev.map((u) => {
        if (u.id === params.fromUnitId) {
          return {
            ...u,
            members: newFromMembers,
            memberCount: newFromMembers.length,
          }
        }
        if (u.id === params.toUnitId) {
          return {
            ...u,
            members: newToMembers,
            memberCount: newToMembers.length,
          }
        }
        return u
      })
    })

    // Refresh selected unit if currently viewed
    if (selectedUnit) {
      setSelectedUnit((prev) => {
        if (!prev) return null
        if (prev.id === params.fromUnitId) {
          return {
            ...prev,
            members: prev.members.filter((m) => m.id !== params.staffId),
            memberCount: prev.members.length - 1,
          }
        }
        return prev
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-3 lg:px-6">
      {/* Toolbar */}
      <OrgStructureToolbar
        filters={filters}
        onFilterChange={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
        isAllExpanded={isAllExpanded}
        onToggleExpandAll={handleToggleExpandAll}
        onCreateClick={() => {
          setDefaultParentId(undefined)
          setIsCreateOpen(true)
        }}
      />

      {/* Main Content: Hierarchical Table View */}
      <OrgStructureTableView
        tree={tree}
        allUnits={units}
        expandedIds={expandedIds}
        onToggleExpand={handleToggleExpand}
        onViewDetail={(unit) => {
          setSelectedUnit(unit)
          setIsDetailOpen(true)
        }}
        onAddChild={handleAddChild}
        onTransferStaff={(unit) => handleTransferStaffClick(unit)}
      />

      {/* Create Dialog */}
      <OrgUnitCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        existingUnits={units}
        defaultParentId={defaultParentId}
        onSubmit={handleCreateUnit}
      />

      {/* Detail Dialog */}
      <OrgUnitDetailDialog
        unit={selectedUnit}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onTransferStaffClick={handleTransferStaffClick}
        onAddPosition={handleAddPosition}
        onAssignStaffToPosition={handleAssignStaffToPosition}
      />

      {/* Staff Transfer Dialog */}
      <OrgStaffTransferDialog
        open={isTransferOpen}
        onOpenChange={setIsTransferOpen}
        currentUnit={selectedUnit}
        initialStaff={transferTargetStaff}
        initialTitle={transferPresetTitle}
        allUnits={units}
        onTransfer={handleExecuteTransfer}
      />
    </div>
  )
}
