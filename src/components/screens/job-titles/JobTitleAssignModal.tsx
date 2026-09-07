'use client'

import React, { useState, useMemo } from 'react'
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Building2,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { mockEmployees, type Employee } from '@/mocks/employees'
import type { JobTitle } from './jobTitlesTypes'
import { maskPhoneNumber, getInitials } from './jobTitlesHelpers'

interface JobTitleAssignModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  jobTitle: JobTitle | null
  onSaveAssignments: (jobTitleId: string, assignedIds: string[]) => void
}

export const JobTitleAssignModal: React.FC<JobTitleAssignModalProps> = ({
  open,
  onOpenChange,
  jobTitle,
  onSaveAssignments,
}) => {
  const [assignedIds, setAssignedIds] = useState<string[]>(() => jobTitle?.assignedEmployeeIds || [])
  const [prevTitleId, setPrevTitleId] = useState(jobTitle?.id)
  const [activeTab, setActiveTab] = useState<'current' | 'add'>('current')

  // Search queries
  const [searchAssigned, setSearchAssigned] = useState('')
  const [searchCandidates, setSearchCandidates] = useState('')

  // Removal confirm
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const [employeeToRemove, setEmployeeToRemove] = useState<Employee | null>(null)

  // Sync state when selected jobTitle changes
  if (jobTitle && jobTitle.id !== prevTitleId) {
    setPrevTitleId(jobTitle.id)
    setAssignedIds(jobTitle.assignedEmployeeIds || [])
    setSearchAssigned('')
    setSearchCandidates('')
    setActiveTab('current')
  }

  // Current assigned employees
  const currentEmployees = useMemo(() => {
    const idSet = new Set(assignedIds)
    return mockEmployees.filter((e) => idSet.has(e.id))
  }, [assignedIds])

  // Filtered assigned employees
  const filteredCurrentEmployees = useMemo(() => {
    const q = searchAssigned.trim().toLowerCase()
    if (!q) return currentEmployees
    return currentEmployees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.branch.toLowerCase().includes(q)
    )
  }, [currentEmployees, searchAssigned])

  // Available candidates to assign (not yet in this job title, not resigned)
  const availableCandidates = useMemo(() => {
    const idSet = new Set(assignedIds)
    const q = searchCandidates.trim().toLowerCase()
    return mockEmployees
      .filter((e) => !idSet.has(e.id) && e.status !== 'resigned')
      .filter((e) => {
        if (!q) return true
        return (
          e.name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.phone.includes(q) ||
          e.position.toLowerCase().includes(q) ||
          e.branch.toLowerCase().includes(q)
        )
      })
  }, [assignedIds, searchCandidates])

  if (!jobTitle) return null

  // Handle Assign Employee
  const handleAssign = (employee: Employee) => {
    if (assignedIds.includes(employee.id)) return
    const nextIds = [...assignedIds, employee.id]
    setAssignedIds(nextIds)
    onSaveAssignments(jobTitle.id, nextIds)
    toast.success(`Đã gán nhân sự ${employee.name} vào chức danh ${jobTitle.name}`)
  }

  // Handle Remove Employee trigger
  const handlePromptRemove = (employee: Employee) => {
    setEmployeeToRemove(employee)
    setRemoveConfirmOpen(true)
  }

  // Confirm remove
  const handleConfirmRemove = () => {
    if (!employeeToRemove) return
    const nextIds = assignedIds.filter((id) => id !== employeeToRemove.id)
    setAssignedIds(nextIds)
    onSaveAssignments(jobTitle.id, nextIds)
    toast.info(`Đã gỡ nhân sự ${employeeToRemove.name} khỏi chức danh ${jobTitle.name}`)
    setEmployeeToRemove(null)
    setRemoveConfirmOpen(false)
  }

  const isUnderCapacity = assignedIds.length < jobTitle.targetHeadcount

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          {/* HEADER */}
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-border shrink-0 bg-muted/20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <span>Phân bổ & Gán nhân sự: {jobTitle.name}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                  <span>Mã: <strong className="text-foreground">{jobTitle.code}</strong></span>
                  <span>•</span>
                  <span>Khối: <strong className="text-foreground">{jobTitle.department}</strong></span>
                  <span>•</span>
                  <span>Định mức: <strong className="text-foreground">{jobTitle.targetHeadcount} nhân sự</strong></span>
                </DialogDescription>
              </div>

              {/* Headcount Status Pill */}
              <div className="shrink-0">
                {isUnderCapacity ? (
                  <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 gap-1 py-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>Hiện có: {assignedIds.length}/{jobTitle.targetHeadcount} (Thiếu {jobTitle.targetHeadcount - assignedIds.length})</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 gap-1 py-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Hiện có: {assignedIds.length}/{jobTitle.targetHeadcount} (Đạt định mức)</span>
                  </Badge>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* TABS & BODY */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'current' | 'add')}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="px-6 pt-3 pb-2 border-b border-border bg-background shrink-0">
              <TabsList className="h-8 p-0.5 bg-muted/60">
                <TabsTrigger value="current" className="text-xs gap-1.5 h-7">
                  <Users className="h-3.5 w-3.5" />
                  <span>Đang đảm nhiệm ({assignedIds.length})</span>
                </TabsTrigger>
                <TabsTrigger value="add" className="text-xs gap-1.5 h-7">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Gán thêm nhân sự mới</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: CURRENT ASSIGNED EMPLOYEES */}
            <TabsContent value="current" className="flex-1 flex flex-col min-h-0 m-0 p-0">
              {/* Search filter in assigned list */}
              <div className="px-6 py-2.5 border-b border-border/60 shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Tìm nhân sự đang đảm nhiệm theo tên, email, cơ sở..."
                    value={searchAssigned}
                    onChange={(e) => setSearchAssigned(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-border/60 min-h-0">
                {filteredCurrentEmployees.length === 0 ? (
                  <div className="py-8">
                    <EmptyState
                      icon={<Users className="h-7 w-7 text-muted-foreground" />}
                      title={
                        assignedIds.length === 0
                          ? 'Chưa có nhân sự nào được gán'
                          : 'Không tìm thấy nhân sự phù hợp'
                      }
                      description={
                        assignedIds.length === 0
                          ? 'Chuyển sang tab "Gán thêm nhân sự mới" để phân bổ nhân sự vào chức danh này.'
                          : 'Hãy thử tìm kiếm với từ khóa khác.'
                      }
                    />
                  </div>
                ) : (
                  filteredCurrentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="py-2.5 flex items-center justify-between gap-3 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                          {getInitials(employee.name)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {employee.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              STAFF-{employee.id.toUpperCase()}
                            </span>
                            {employee.contractType && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 font-normal">
                                {employee.contractType}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {employee.branch}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {maskPhoneNumber(employee.phone)}
                            </span>
                            <span className="flex items-center gap-1 truncate max-w-[160px]">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 cursor-pointer"
                        onClick={() => handlePromptRemove(employee)}
                        title="Gỡ khỏi chức danh này"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* TAB 2: CANDIDATES TO ASSIGN */}
            <TabsContent value="add" className="flex-1 flex flex-col min-h-0 m-0 p-0">
              {/* Search candidate filter */}
              <div className="px-6 py-2.5 border-b border-border/60 shrink-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm nhân sự chưa có chức danh này để gán (tên, chức danh hiện tại, cơ sở)..."
                    value={searchCandidates}
                    onChange={(e) => setSearchCandidates(e.target.value)}
                    className="h-8 pl-8 text-xs"
                  />
                </div>
              </div>

              {/* Candidates list */}
              <div className="flex-1 overflow-y-auto px-6 py-3 divide-y divide-border/60 min-h-0">
                {availableCandidates.length === 0 ? (
                  <div className="py-8">
                    <EmptyState
                      icon={<Users className="h-7 w-7 text-muted-foreground" />}
                      title="Không tìm thấy nhân sự phù hợp"
                      description="Toàn bộ nhân sự phù hợp đã được gán hoặc không khớp từ khóa tìm kiếm."
                    />
                  </div>
                ) : (
                  availableCandidates.map((employee) => (
                    <div
                      key={employee.id}
                      className="py-2.5 flex items-center justify-between gap-3 hover:bg-muted/30 -mx-2 px-2 rounded-md transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground font-medium text-xs flex items-center justify-center shrink-0 border border-border">
                          {getInitials(employee.name)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground truncate">
                              {employee.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              (Đang giữ: {employee.position})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {employee.branch}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {maskPhoneNumber(employee.phone)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Assign Button */}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 border-primary/40 text-primary hover:bg-primary/5 hover:text-primary shrink-0 cursor-pointer"
                        onClick={() => handleAssign(employee)}
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>+ Gán</span>
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* FOOTER */}
          <div className="px-6 py-3 border-t border-border flex items-center justify-between bg-muted/20 shrink-0">
            <span className="text-xs text-muted-foreground">
              Tổng số nhân sự đảm nhiệm: <strong className="text-foreground">{assignedIds.length}</strong> / {jobTitle.targetHeadcount}
            </span>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Hoàn tất
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRM REMOVE DIALOG */}
      <ConfirmDialog
        open={removeConfirmOpen}
        onOpenChange={setRemoveConfirmOpen}
        title="Xác nhận gỡ nhân sự khỏi chức danh"
        description={`Bạn có chắc chắn muốn gỡ nhân sự "${employeeToRemove?.name}" khỏi chức danh "${jobTitle.name}"?`}
        confirmLabel="Gỡ nhân sự"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={handleConfirmRemove}
      />
    </>
  )
}
