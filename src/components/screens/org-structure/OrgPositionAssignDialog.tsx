'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Briefcase,
  Search,
  Users,
  X,
  UserCheck,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/shared'
import { cn } from '@/lib/utils'
import { mockEmployees, type Employee } from '@/mocks/employees'
import type { OrgStaffMember, OrgUnit } from './orgStructureTypes'

interface OrgPositionAssignDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unit: OrgUnit
  positionTitle: string
  currentAssignedStaff: OrgStaffMember[]
  onSave: (positionTitle: string, selectedStaff: OrgStaffMember[]) => void
}

interface CandidateEmployee {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  avatar?: string
  isCurrentlyInUnit?: boolean
}

function maskPhone(phone?: string): string {
  if (!phone) return '—'
  const clean = phone.replace(/\s+/g, '')
  if (clean.length >= 7) {
    return clean.slice(0, 3) + '****' + clean.slice(-3)
  }
  return phone
}

export function OrgPositionAssignDialog({
  open,
  onOpenChange,
  unit,
  positionTitle,
  currentAssignedStaff,
  onSave,
}: OrgPositionAssignDialogProps) {
  const [search, setSearch] = useState('')
  const [tabFilter, setTabFilter] = useState<'all' | 'selected'>('all')

  // Set of selected employee IDs
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    return new Set(currentAssignedStaff.map((s) => s.id))
  })

  // Re-sync selectedIds when dialog opens or currentAssignedStaff changes
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIds(new Set(currentAssignedStaff.map((s) => s.id)))
      setSearch('')
      setTabFilter('all')
    }
  }, [open, currentAssignedStaff])

  // Build full pool of candidates (mock employees + unit members)
  const allCandidates = useMemo<CandidateEmployee[]>(() => {
    const candidateMap = new Map<string, CandidateEmployee>()

    // Add unit members first
    unit.members?.forEach((m) => {
      candidateMap.set(m.id, {
        id: m.id,
        name: m.name,
        email: m.email || '',
        phone: m.phone || '',
        department: unit.name,
        position: m.title,
        avatar: m.avatar,
        isCurrentlyInUnit: true,
      })
    })

    // Add mock employees
    mockEmployees
      .filter((e) => e.status !== 'resigned')
      .forEach((e: Employee) => {
        if (!candidateMap.has(e.id)) {
          candidateMap.set(e.id, {
            id: e.id,
            name: e.name,
            email: e.email,
            phone: e.phone,
            department: e.department,
            position: e.position,
            avatar: e.avatar,
            isCurrentlyInUnit: false,
          })
        }
      })

    return Array.from(candidateMap.values())
  }, [unit])

  // Filter candidates by search & tab
  const filteredCandidates = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allCandidates.filter((candidate) => {
      if (tabFilter === 'selected' && !selectedIds.has(candidate.id)) {
        return false
      }
      if (q) {
        const matchName = candidate.name.toLowerCase().includes(q)
        const matchEmail = candidate.email.toLowerCase().includes(q)
        const matchPhone = candidate.phone.includes(q)
        const matchDept = candidate.department.toLowerCase().includes(q)
        const matchPos = candidate.position.toLowerCase().includes(q)
        if (!matchName && !matchEmail && !matchPhone && !matchDept && !matchPos) {
          return false
        }
      }
      return true
    })
  }, [allCandidates, search, tabFilter, selectedIds])

  const handleToggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filteredCandidates.forEach((c) => next.add(c.id))
      return next
    })
  }

  const handleDeselectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      filteredCandidates.forEach((c) => next.delete(c.id))
      return next
    })
  }

  const handleSave = () => {
    const candidateMap = new Map(allCandidates.map((c) => [c.id, c]))
    const currentMemberMap = new Map((unit.members || []).map((m) => [m.id, m]))

    const selectedStaff: OrgStaffMember[] = Array.from(selectedIds).map((id) => {
      const existing = currentMemberMap.get(id)
      if (existing) {
        return {
          ...existing,
          title: positionTitle,
        }
      }
      const candidate = candidateMap.get(id)
      return {
        id,
        name: candidate?.name || 'Nhân viên mới',
        title: positionTitle,
        role: candidate?.department || 'Nhân sự',
        isPrimary: true,
        phone: candidate?.phone || '',
        email: candidate?.email || '',
        joinedDate: new Date().toISOString().slice(0, 10),
        avatar: candidate?.avatar,
      }
    })

    onSave(positionTitle, selectedStaff)
    onOpenChange(false)
  }

  const selectedCount = selectedIds.size
  const isAllVisibleSelected =
    filteredCandidates.length > 0 &&
    filteredCandidates.every((c) => selectedIds.has(c.id))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b bg-muted/20 shrink-0">
          <div className="flex items-center justify-between gap-3 pr-6">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" />
                <DialogTitle className="text-sm font-semibold text-foreground">
                  Gán nhân sự vào chức danh
                </DialogTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Chức danh:{' '}
                <span className="font-semibold text-foreground">{positionTitle}</span> — Đơn vị:{' '}
                <span className="font-medium text-foreground">{unit.name}</span>
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar: Search + Tabs + Quick Select */}
        <div className="p-3 border-b bg-background space-y-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm nhân sự theo tên, email, chức danh..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            {/* Filter tabs */}
            <div className="flex items-center rounded-md border bg-muted/40 p-0.5 shrink-0 text-xs">
              <button
                type="button"
                onClick={() => setTabFilter('all')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                  tabFilter === 'all'
                    ? 'bg-background text-foreground shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Tất cả ({allCandidates.length})
              </button>
              <button
                type="button"
                onClick={() => setTabFilter('selected')}
                className={cn(
                  'px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer',
                  tabFilter === 'selected'
                    ? 'bg-background text-primary shadow-2xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Đã chọn ({selectedCount})
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground px-0.5">
            <span>
              Hiển thị {filteredCandidates.length} nhân sự phù hợp
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[11px] cursor-pointer"
                onClick={isAllVisibleSelected ? handleDeselectAllVisible : handleSelectAllVisible}
              >
                {isAllVisibleSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả đang xem'}
              </Button>
            </div>
          </div>
        </div>

        {/* Candidate List Table */}
        <div className="flex-1 overflow-y-auto min-h-[260px] max-h-[420px]">
          {filteredCandidates.length === 0 ? (
            <div className="p-8 flex items-center justify-center">
              <EmptyState
                icon={<Users className="h-8 w-8 text-muted-foreground" />}
                title="Không tìm thấy nhân sự"
                description={
                  tabFilter === 'selected'
                    ? 'Chưa có nhân sự nào được chọn cho chức danh này.'
                    : 'Hãy thử thay đổi từ khóa tìm kiếm.'
                }
              />
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b bg-muted/40 font-medium text-muted-foreground sticky top-0 backdrop-blur-xs">
                <tr>
                  <th className="w-10 py-2 px-3 text-center">
                    <Checkbox
                      checked={
                        isAllVisibleSelected
                          ? true
                          : filteredCandidates.some((c) => selectedIds.has(c.id))
                          ? 'indeterminate'
                          : false
                      }
                      onCheckedChange={() => {
                        if (isAllVisibleSelected) {
                          handleDeselectAllVisible()
                        } else {
                          handleSelectAllVisible()
                        }
                      }}
                      aria-label="Chọn tất cả"
                      className="cursor-pointer"
                    />
                  </th>
                  <th className="py-2 px-3 font-semibold">Nhân sự</th>
                  <th className="py-2 px-3 font-semibold">Vị trí / Đơn vị hiện tại</th>
                  <th className="py-2 px-3 font-semibold">Liên hệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredCandidates.map((candidate) => {
                  const isSelected = selectedIds.has(candidate.id)
                  const initial =
                    candidate.name.split(' ').pop()?.charAt(0) || 'U'

                  return (
                    <tr
                      key={candidate.id}
                      onClick={() => handleToggle(candidate.id)}
                      className={cn(
                        'cursor-pointer transition-colors hover:bg-muted/40',
                        isSelected && 'bg-primary/5 hover:bg-primary/10'
                      )}
                    >
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggle(candidate.id)}
                          aria-label={`Chọn ${candidate.name}`}
                          className="cursor-pointer"
                        />
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7 border shrink-0">
                            {candidate.avatar ? (
                              <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            ) : null}
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground flex items-center gap-1.5">
                              <span>{candidate.name}</span>
                              {candidate.isCurrentlyInUnit ? (
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] px-1 py-0 h-4 font-normal text-muted-foreground"
                                >
                                  Đang ở đơn vị
                                </Badge>
                              ) : null}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">
                              {candidate.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-foreground truncate max-w-[200px]">
                          {candidate.position || 'Chưa gán chức danh'}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                          {candidate.department}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-muted-foreground">
                        <div className="font-mono text-[11px]">
                          {maskPhone(candidate.phone)}
                        </div>
                        <div className="text-[11px] truncate max-w-[180px]">
                          {candidate.email}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-4 py-2.5 border-t bg-muted/20 shrink-0 flex sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Đang chọn:{' '}
            <span className="font-bold text-foreground">{selectedCount}</span> nhân sự cho chức danh{' '}
            <span className="font-semibold text-foreground">&ldquo;{positionTitle}&rdquo;</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs gap-1.5 cursor-pointer"
              onClick={handleSave}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Lưu gán nhân sự ({selectedCount})</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
