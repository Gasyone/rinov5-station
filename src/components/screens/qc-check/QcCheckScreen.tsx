'use client'

import { useState, useMemo } from 'react'
import { DEFAULT_PAGE_SIZE } from '@/components/data-table'
import { FilterGroupAsidePanel, createFilterGroup, type FilterGroupConfig } from '@/components/filters'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  mockQcIncidents,
  INSPECTOR_OPTIONS,
  type QcIncident,
  type QcErrorStatus,
  type QcTargetGroup,
  type QcSourceType,
  type QcErrorSeverity,
} from '@/mocks/qcChecks'
import {
  type IncidentStatusFilter,
  type IncidentDeadlineFilter,
  type FilterState,
  BRANCH_OPTIONS,
  ADVANCED_STATUS_OPTIONS,
  matchesDeadlineFilter,
  computeIncidentStatusTotal,
} from './qcCheckTypes'
import { QcCheckToolbar } from './QcCheckToolbar'
import { QcCheckTable } from './QcCheckTable'
import { QcCheckCreateDialog, type CreateBatchIncidentForm } from './QcCheckCreateDialog'
import { QcCheckDetailDialog } from './QcCheckDetailDialog'
import { sortQcIncidents, type QcSortMode } from './qcCheckHelpers'

const CURRENT_USER_ID = 'ins_01'
const CURRENT_USER_NAME = 'Trần Văn Kiên'

const TARGET_GROUP_OPTIONS = [
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'facility', label: 'Cơ sở vật chất' },
  { value: 'operations', label: 'Vận hành (CS)' },
]

const SOURCE_OPTIONS = [
  { value: 'manual', label: 'Thủ công' },
  { value: 'system', label: 'Hệ thống tự tạo' },
]

const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high', label: 'Cao' },
  { value: 'critical', label: 'Nghiêm trọng' },
]

export interface QcCheckScreenProps {
  defaultViewMode?: string
}

export function QcCheckScreen({ defaultViewMode }: QcCheckScreenProps = {}) {
  const authUser = useAuthStore((s) => s.user)
  const currentStaffName = authUser?.name || CURRENT_USER_NAME

  const [incidents, setIncidents] = useState<QcIncident[]>(() => structuredClone(mockQcIncidents))
  const [activeBranch, setActiveBranch] = useState('all')
  const [activeSubject, setActiveSubject] = useState('all')
  const [activeCriteria, setActiveCriteria] = useState('all')
  const [activeDeadline, setActiveDeadline] = useState<IncidentDeadlineFilter>('all')
  const [selectedAssignee, setSelectedAssignee] = useState('all')
  const [activeTargetGroup, setActiveTargetGroup] = useState('all')
  const [activeStatus, setActiveStatus] = useState<IncidentStatusFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMode, setSortMode] = useState<QcSortMode>('severity_deadline')

  const [filters, setFilters] = useState<FilterState>({
    branches: [],
    targetGroups: [],
    sources: [],
    criteriaList: [],
    severities: [],
    statuses: [],
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [page, setPage] = useState(1)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [detailIncidentId, setDetailIncidentId] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())

  // Dynamic list of assignees for the personnel filter dropdown
  const assigneeOptions = useMemo(() => {
    const names = Array.from(new Set(incidents.map((i) => i.assignee?.trim()).filter(Boolean))).sort()
    return [
      { value: 'all', label: 'Tất cả nhân sự', selectedLabel: 'Tất cả nhân sự' },
      { value: 'my', label: `Lỗi của tôi (${currentStaffName})`, selectedLabel: 'Lỗi của tôi' },
      ...names.map((name) => ({ value: name, label: name, selectedLabel: name })),
    ]
  }, [incidents, currentStaffName])

  // Count of incidents assigned to or involving the current staff member
  const myIncidentsCount = useMemo(() => {
    const target = currentStaffName.toLowerCase().trim()
    return incidents.filter((inc) => {
      if (activeBranch !== 'all' && inc.branch !== activeBranch) return false
      return (
        inc.assignee.toLowerCase().includes(target) ||
        (inc.teacherName && inc.teacherName.toLowerCase().includes(target)) ||
        (inc.csmName && inc.csmName.toLowerCase().includes(target))
      )
    }).length
  }, [incidents, activeBranch, currentStaffName])

  // Filter & 2-Tier Sort logic (Level 1: Severity, Level 2: Deadline)
  const filteredIncidents = useMemo(() => {
    const base = incidents.filter((inc) => {
      if (activeBranch !== 'all' && inc.branch !== activeBranch) return false
      if (activeSubject !== 'all' && inc.subject && inc.subject !== activeSubject) return false
      if (activeCriteria !== 'all' && inc.criteria !== activeCriteria) return false
      if (activeTargetGroup !== 'all' && inc.targetGroup !== activeTargetGroup) return false
      if (!matchesDeadlineFilter(inc, activeDeadline)) return false

      if (selectedAssignee === 'my') {
        const target = currentStaffName.toLowerCase().trim()
        const isMine =
          inc.assignee.toLowerCase().includes(target) ||
          (inc.teacherName && inc.teacherName.toLowerCase().includes(target)) ||
          (inc.csmName && inc.csmName.toLowerCase().includes(target))
        if (!isMine) return false
      } else if (selectedAssignee !== 'all') {
        const target = selectedAssignee.toLowerCase().trim()
        if (!inc.assignee.toLowerCase().includes(target)) return false
      }

      // Lọc trạng thái (kết hợp tab nhanh và filter nâng cao)
      if (filters.statuses.length > 0) {
        if (!filters.statuses.includes(inc.status)) return false
      } else {
        if (activeStatus === 'all') {
          // 1. Đã hủy đưa vào filter nâng cao, không hiển thị ở đây
          if (inc.status === 'cancelled') return false
        } else if (activeStatus === 'correcting') {
          // 2. Chưa đáp ứng vẫn là đang khắc phục
          if (inc.status !== 'correcting' && inc.status !== 'not_met') return false
        } else if (inc.status !== activeStatus) {
          return false
        }
      }

      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const codeMatch = inc.code.toLowerCase().includes(q)
        const titleMatch = inc.title.toLowerCase().includes(q)
        const descMatch = inc.description.toLowerCase().includes(q)
        const classMatch = inc.className?.toLowerCase().includes(q) ?? false
        const teacherMatch = inc.teacherName?.toLowerCase().includes(q) ?? false
        const csmMatch = inc.csmName?.toLowerCase().includes(q) ?? false
        const roomMatch = inc.roomId?.toLowerCase().includes(q) ?? false
        const assigneeMatch = inc.assignee.toLowerCase().includes(q)

        if (!codeMatch && !titleMatch && !descMatch && !classMatch && !teacherMatch && !csmMatch && !roomMatch && !assigneeMatch) {
          return false
        }
      }

      if (filters.branches.length > 0 && !filters.branches.includes(inc.branch)) return false
      if (filters.targetGroups.length > 0 && !filters.targetGroups.includes(inc.targetGroup)) return false
      if (filters.sources.length > 0 && !filters.sources.includes(inc.source)) return false
      if (filters.severities.length > 0 && !filters.severities.includes(inc.severity)) return false

      return true
    })

    return sortQcIncidents(base, sortMode)
  }, [incidents, activeBranch, activeSubject, activeCriteria, activeDeadline, activeTargetGroup, selectedAssignee, currentStaffName, activeStatus, searchTerm, filters, sortMode])

  // Status totals according to active filters (Rule 5: Status Tiles update dynamically according to all active filters)
  const statusTileTotals = useMemo(() => {
    const totals: Record<string, number> = {}
    const baseFiltered = incidents.filter((inc) => {
      if (activeBranch !== 'all' && inc.branch !== activeBranch) return false
      if (activeSubject !== 'all' && inc.subject && inc.subject !== activeSubject) return false
      if (activeCriteria !== 'all' && inc.criteria !== activeCriteria) return false
      if (activeTargetGroup !== 'all' && inc.targetGroup !== activeTargetGroup) return false
      if (!matchesDeadlineFilter(inc, activeDeadline)) return false
      if (selectedAssignee === 'my') {
        const target = currentStaffName.toLowerCase().trim()
        const isMine =
          inc.assignee.toLowerCase().includes(target) ||
          (inc.teacherName && inc.teacherName.toLowerCase().includes(target)) ||
          (inc.csmName && inc.csmName.toLowerCase().includes(target))
        if (!isMine) return false
      } else if (selectedAssignee !== 'all') {
        const target = selectedAssignee.toLowerCase().trim()
        if (!inc.assignee.toLowerCase().includes(target)) return false
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const codeMatch = inc.code.toLowerCase().includes(q)
        const titleMatch = inc.title.toLowerCase().includes(q)
        const descMatch = inc.description.toLowerCase().includes(q)
        const classMatch = inc.className?.toLowerCase().includes(q) ?? false
        const teacherMatch = inc.teacherName?.toLowerCase().includes(q) ?? false
        const csmMatch = inc.csmName?.toLowerCase().includes(q) ?? false
        const roomMatch = inc.roomId?.toLowerCase().includes(q) ?? false
        const assigneeMatch = inc.assignee.toLowerCase().includes(q)
        if (!codeMatch && !titleMatch && !descMatch && !classMatch && !teacherMatch && !csmMatch && !roomMatch && !assigneeMatch) {
          return false
        }
      }
      if (filters.branches.length > 0 && !filters.branches.includes(inc.branch)) return false
      if (filters.targetGroups.length > 0 && !filters.targetGroups.includes(inc.targetGroup)) return false
      if (filters.sources.length > 0 && !filters.sources.includes(inc.source)) return false
      if (filters.severities.length > 0 && !filters.severities.includes(inc.severity)) return false
      if (filters.statuses.length > 0 && !filters.statuses.includes(inc.status)) return false
      return true
    })

    const tileKeys: IncidentStatusFilter[] = ['all', 'open', 'correcting', 'corrected', 'closed']
    const hasCancelledFilter = filters.statuses.includes('cancelled')
    for (const key of tileKeys) {
      totals[key] = computeIncidentStatusTotal(baseFiltered, key, hasCancelledFilter)
    }
    return totals
  }, [incidents, activeBranch, activeSubject, activeCriteria, activeDeadline, activeTargetGroup, selectedAssignee, currentStaffName, searchTerm, filters])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedIncidents = filteredIncidents.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Filter panel configuration
  const filterGroups = useMemo<FilterGroupConfig[]>(() => [
    createFilterGroup({
      id: 'statuses',
      title: 'Trạng thái sự cố',
      options: ADVANCED_STATUS_OPTIONS,
      selectedValues: filters.statuses,
      getOptionCount: (val) => incidents.filter((i) => i.status === val).length,
    }),
    createFilterGroup({
      id: 'branches',
      options: BRANCH_OPTIONS,
      selectedValues: filters.branches,
      getOptionCount: (branch) => incidents.filter((i) => i.branch === branch).length,
    }),
    createFilterGroup({
      id: 'targetGroups',
      title: 'Đối tượng đánh giá',
      options: TARGET_GROUP_OPTIONS,
      selectedValues: filters.targetGroups,
      getOptionCount: (val) => incidents.filter((i) => i.targetGroup === val).length,
    }),
    createFilterGroup({
      id: 'sources',
      title: 'Nguồn phát hiện',
      options: SOURCE_OPTIONS,
      selectedValues: filters.sources,
      getOptionCount: (val) => incidents.filter((i) => i.source === val).length,
    }),
    createFilterGroup({
      id: 'severities',
      title: 'Mức độ vi phạm',
      options: SEVERITY_OPTIONS,
      selectedValues: filters.severities,
      getOptionCount: (val) => incidents.filter((i) => i.severity === val).length,
    }),
  ], [incidents, filters])

  const activeFilterCount =
    filters.branches.length +
    filters.targetGroups.length +
    filters.sources.length +
    filters.severities.length +
    filters.statuses.length

  const detailIncident = incidents.find((i) => i.id === detailIncidentId) ?? null

  // Create Batch Incidents
  const handleCreateBatch = (form: CreateBatchIncidentForm) => {
    const inspector = INSPECTOR_OPTIONS.find((i) => i.id === form.inspectorId)
    const inspectorName = inspector?.name || CURRENT_USER_NAME
    const nowIso = new Date().toISOString()

    const newIncidents: QcIncident[] = form.incidents.map((item, idx) => {
      const codeIndex = incidents.length + idx + 1
      const year = new Date().getFullYear()
      const code = `QC-${year}-${codeIndex.toString().padStart(3, '0')}`

      return {
        id: `inc_${Date.now()}_${idx}`,
        code,
        title: item.title || item.description.slice(0, 50),
        targetGroup: item.targetGroup,
        criteria: item.criteria,
        source: 'manual',
        branch: form.branch,
        className: item.className,
        sessionNumber: item.sessionNumber,
        roomId: item.roomId,
        teacherName: item.teacherName,
        csmName: item.csmName,
        description: item.description,
        severity: item.severity,
        status: 'open',
        recurrenceCount: 0,
        evidence: item.evidence || 'Ghi nhận trực tiếp lúc kiểm tra',
        evidenceImage: item.evidenceImage || '',
        evidenceLink: item.evidenceLink || '',
        assignee: item.assignee || 'Bộ phận liên quan',
        issuedBy: inspectorName,
        createdAt: nowIso,
        deadline: item.deadline || undefined,
        notes: item.notes || '',
        comments: [],
        logs: [
          {
            id: `log_${Date.now()}_${idx}`,
            userId: CURRENT_USER_ID,
            userName: inspectorName,
            action: 'Ghi nhận sự cố',
            details: `Ghi nhận vi phạm ${item.title || item.description}`,
            createdAt: nowIso,
          },
        ],
      }
    })

    setIncidents((prev) => [...newIncidents, ...prev])
    setIsCreateOpen(false)
  }

  // Update Status
  const handleUpdateStatus = (incidentId: string, status: QcErrorStatus) => {
    const statusText =
      status === 'open'
        ? 'Mở'
        : status === 'correcting'
          ? 'Đang khắc phục'
          : status === 'corrected'
            ? 'Chờ duyệt'
            : status === 'closed'
              ? 'Đã đóng'
              : status === 'cancelled'
                ? 'Đã hủy'
                : status === 'not_met'
                  ? 'Chưa đáp ứng'
                  : status

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc
        const updates: { closedBy?: string; closedAt?: string; closureMethod?: 'manual' | 'system_auto' } = {}
        if (status === 'closed' || status === 'cancelled') {
          updates.closedBy = CURRENT_USER_NAME
          updates.closedAt = new Date().toISOString()
          updates.closureMethod = 'manual'
        }

        const newLog = {
          id: `log_${Date.now()}`,
          userId: CURRENT_USER_ID,
          userName: CURRENT_USER_NAME,
          action: status === 'closed' ? 'Nghiệm thu đóng lỗi' : 'Cập nhật trạng thái',
          details: `Chuyển trạng thái sang: ${statusText}`,
          createdAt: new Date().toISOString(),
        }

        return {
          ...inc,
          status,
          ...updates,
          logs: [...(inc.logs || []), newLog],
        }
      })
    )
  }

  // Submit Remediation
  const handleUpdateRemediation = (
    incidentId: string,
    correctiveAction: string,
    correctiveEvidence: string,
    correctiveImage?: string
  ) => {
    const nowIso = new Date().toISOString()
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc

        const newLog = {
          id: `log_${Date.now()}`,
          userId: CURRENT_USER_ID,
          userName: CURRENT_USER_NAME,
          action: 'Báo cáo khắc phục sự cố',
          details: `Nộp phương án khắc phục: ${correctiveAction.substring(0, 60)}...`,
          createdAt: nowIso,
        }

        return {
          ...inc,
          correctiveAction,
          correctiveEvidence,
          correctiveImage,
          completionDate: nowIso,
          status: 'corrected',
          logs: [...(inc.logs || []), newLog],
        }
      })
    )
  }

  // Re-check System (Auto-close bot issues)
  const handleRecheckSystem = (incidentId: string) => {
    const nowIso = new Date().toISOString()
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc

        const newLog = {
          id: `log_${Date.now()}`,
          userId: 'system',
          userName: 'Hệ thống tự động',
          action: 'Quét dữ liệu kiểm tra lại',
          details: 'Hệ thống nhận diện dữ liệu điểm danh / chăm sóc đã được bổ sung hợp lệ. Tự động đóng sự cố.',
          createdAt: nowIso,
        }

        return {
          ...inc,
          status: 'closed',
          closureMethod: 'system_auto',
          closedBy: 'Hệ thống tự động (Bot)',
          closedAt: nowIso,
          correctiveAction: inc.correctiveAction || 'Hệ thống xác nhận thao tác nghiệp vụ đã được hoàn tất bù trên phần mềm.',
          logs: [...(inc.logs || []), newLog],
        }
      })
    )
  }

  // Add Comment
  const handleAddComment = (incidentId: string, content: string) => {
    const nowIso = new Date().toISOString()
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id !== incidentId) return inc

        const newComment = {
          id: `comm_${Date.now()}`,
          userId: CURRENT_USER_ID,
          userName: CURRENT_USER_NAME,
          userRole: 'Kiểm tra viên',
          content,
          createdAt: nowIso,
        }

        const newLog = {
          id: `log_${Date.now()}`,
          userId: CURRENT_USER_ID,
          userName: CURRENT_USER_NAME,
          action: 'Gửi trao đổi',
          details: `"${content.substring(0, 50)}..."`,
          createdAt: nowIso,
        }

        return {
          ...inc,
          comments: [...(inc.comments || []), newComment],
          logs: [...(inc.logs || []), newLog],
        }
      })
    )
  }

  const toggleSelectAll = () => {
    const allIds = filteredIncidents.map((i) => i.id)
    const isAll = allIds.every((id) => selectedIds.has(id))
    setSelectedIds(isAll ? new Set() : new Set(allIds))
  }

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleFilterValue = <T extends string>(group: keyof FilterState, value: T) => {
    setPage(1)
    setFilters((current) => {
      const currentValues = current[group] as T[]
      const next = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
      return { ...current, [group]: next }
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <QcCheckToolbar
        sortMode={sortMode}
        onSortModeChange={setSortMode}
        activeBranch={activeBranch}
        activeSubject={activeSubject}
        activeCriteria={activeCriteria}
        activeDeadline={activeDeadline}
        onDeadlineChange={(d) => { setActiveDeadline(d); setPage(1) }}
        selectedAssignee={selectedAssignee}
        onAssigneeChange={(a) => { setSelectedAssignee(a); setPage(1) }}
        assigneeOptions={assigneeOptions}
        myIncidentsCount={myIncidentsCount}
        currentStaffName={currentStaffName}
        activeTargetGroup={activeTargetGroup}
        activeStatus={activeStatus}
        searchTerm={searchTerm}
        activeFilterCount={activeFilterCount}
        statusTileTotals={statusTileTotals}
        onBranchChange={(b) => { setActiveBranch(b); setPage(1) }}
        onSubjectChange={(s) => { setActiveSubject(s); setPage(1) }}
        onCriteriaChange={(c) => { setActiveCriteria(c); setPage(1) }}
        onTargetGroupChange={(g) => { setActiveTargetGroup(g); setPage(1) }}
        onStatusChange={(s) => {
          setActiveStatus(s)
          if (filters.statuses.length > 0) {
            setFilters((current) => ({ ...current, statuses: [] }))
          }
          setPage(1)
        }}
        onSearchChange={(v) => { setSearchTerm(v); setPage(1) }}
        onOpenFilters={() => setIsFilterOpen(true)}
        onCreate={() => setIsCreateOpen(true)}
      />

      <div className="flex flex-1 min-h-0 w-full gap-2 overflow-hidden px-2.5 pb-2 pt-1 lg:px-3 lg:pb-2.5">
        <div className="flex-1 min-w-0 h-full overflow-hidden">
          <QcCheckTable
            incidents={pagedIncidents}
            selectedIds={selectedIds}
            onToggleAll={toggleSelectAll}
            onToggleOne={toggleSelectOne}
            onRowClick={setDetailIncidentId}
            onQuickApprove={(id) => handleUpdateStatus(id, 'closed')}
            onQuickRecheck={handleRecheckSystem}
            sortMode={sortMode}
            onSortModeChange={setSortMode}
            pagination={{
              page: currentPage,
              total: filteredIncidents.length,
              pageSize,
              onPageChange: setPage,
              onPageSizeChange: setPageSize,
            }}
          />
        </div>

        {isFilterOpen && (
          <FilterGroupAsidePanel
            title="Bộ lọc nâng cao"
            groups={filterGroups}
            description="Lọc sự cố theo trạng thái, cơ sở, đối tượng đánh giá, nguồn phát hiện và mức độ."
            onToggle={(sectionId, value) => {
              if (sectionId === 'statuses') toggleFilterValue('statuses', value as QcErrorStatus)
              if (sectionId === 'branches') toggleFilterValue('branches', value)
              if (sectionId === 'targetGroups') toggleFilterValue('targetGroups', value as QcTargetGroup)
              if (sectionId === 'sources') toggleFilterValue('sources', value as QcSourceType)
              if (sectionId === 'severities') toggleFilterValue('severities', value as QcErrorSeverity)
            }}
            onClearSection={(sectionId) => {
              setPage(1)
              setFilters((current) => ({
                ...current,
                [sectionId]: [],
              }))
            }}
            onClearAll={() => {
              setFilters({
                branches: [],
                targetGroups: [],
                sources: [],
                criteriaList: [],
                severities: [],
                statuses: [],
              })
              setPage(1)
            }}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </div>

      {/* Batch Create Dialog */}
      <QcCheckCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateBatch}
      />

      {/* Detail Dialog */}
      <QcCheckDetailDialog
        incident={detailIncident}
        open={!!detailIncident}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDetailIncidentId('')
        }}
        onUpdateStatus={handleUpdateStatus}
        onUpdateRemediation={handleUpdateRemediation}
        onRecheckSystem={handleRecheckSystem}
        onAddComment={handleAddComment}
      />
    </div>
  )
}
