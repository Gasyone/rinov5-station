'use client'

import { useState, useMemo } from 'react'
import {
  Check,
  Clock,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  StatusBadge,
  ConfirmDialog,
} from '@/components/shared'
import { toast } from 'sonner'
import { type TrialClass } from '@/mocks/trialClasses'
import { mockLeads } from '@/mocks/crmLeads'
import {
  getTrialStatusLabel,
  getTrialFamilyMembers,
  getStudentAgeText,
  buildPersonnelItem,
} from './trialClassHelpers'
import type { AssignDialogMode } from './trialClassTypes'
import { SessionSubjectFilterBar } from '../admissions/SessionSubjectFilterBar'
import { StudentUnifiedProfilePanel } from '../admissions/StudentUnifiedProfilePanel'
import { UnifiedAttemptResultCard } from '../admissions/UnifiedAttemptResultCard'
import { resolveStudentUnifiedSessions } from '../admissions/unifiedSessionHelpers'
import type { UnifiedSubject } from '../admissions/unifiedSessionTypes'
import { StudentDetailLevelDialog } from '../students/detail/StudentDetailLevelDialog'

interface TrialClassDetailDialogProps {
  trial: TrialClass | null
  onOpenChange: (open: boolean) => void
  onCopy?: (text: string, key: string) => void
  copiedKey?: string
  onOpenAssign?: (mode: AssignDialogMode) => void
  onRequestReschedule?: (trialId: string, reason: string, notes: string) => void
  onUpdateTrial?: (trialId: string, updater: (trial: TrialClass) => TrialClass) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TrialClassDetailDialog({
  trial,
  onOpenChange,
  onOpenAssign,
  onUpdateTrial,
  onApprove,
  onReject,
}: TrialClassDetailDialogProps) {
  const [confirmAction, setConfirmAction] = useState<{ type: string; label: string; description: string } | null>(null)
  const [overrideTrial, setOverrideTrial] = useState<TrialClass | null>(null)
  const [prevTrialId, setPrevTrialId] = useState(trial?.id)
  const [levelModalOpen, setLevelModalOpen] = useState(false)

  const defaultSubj: UnifiedSubject = trial?.subject?.toLowerCase().includes('toán') ? 'math' : 'english'
  const [activeSubject, setActiveSubject] = useState<UnifiedSubject>(defaultSubj)

  // Reset overrideTrial nếu prop trial bên ngoài thay đổi
  if (trial?.id !== prevTrialId) {
    setPrevTrialId(trial?.id)
    setOverrideTrial(null)
    setActiveSubject(trial?.subject?.toLowerCase().includes('toán') ? 'math' : 'english')
  }

  const currentTrial = overrideTrial ?? trial

  // Đối chiếu lead match để lấy trường học, học lực, địa chỉ nếu có
  const leadMatch = useMemo(() => {
    if (!currentTrial) return null
    return (
      mockLeads.find(
        (l) =>
          l.studentName.toLowerCase() === currentTrial.studentName.toLowerCase() ||
          l.phone === currentTrial.familyPhone ||
          (currentTrial.customerId && l.id === currentTrial.customerId)
      ) ?? null
    )
  }, [currentTrial])

  // Profile nhân sự cho Hover Card
  const creatorPersonnelItem = useMemo(
    () => buildPersonnelItem(currentTrial?.creator, 'Nhân viên kinh doanh / Tuyển sinh'),
    [currentTrial?.creator]
  )

  // Trích xuất Dòng sự kiện đa chiều (Test + Học thử) của học viên này
  const { allSessions, placementLevels } = useMemo(() => {
    if (!currentTrial) return { allSessions: [], placementLevels: {} }
    return resolveStudentUnifiedSessions({
      studentName: currentTrial.studentName,
      phone: currentTrial.familyPhone,
      currentTrialId: currentTrial.id,
    })
  }, [currentTrial])

  // Đếm số lượng ca theo từng môn
  const subjectCounts = useMemo(() => {
    return {
      english: allSessions.filter((s) => s.subject === 'english').length,
      math: allSessions.filter((s) => s.subject === 'math').length,
    }
  }, [allSessions])

  // Lọc các ca thuộc MÔN ĐANG CHỌN (riêng rẽ, không gộp tất cả các môn)
  const currentSubjectSessions = useMemo(() => {
    return allSessions.filter((s) => s.subject === activeSubject)
  }, [allSessions, activeSubject])

  if (!trial || !currentTrial) return null

  const handleConfirmAction = () => {
    if (!confirmAction) return
    if (confirmAction.type === 'approve') onApprove?.(currentTrial.id)
    if (confirmAction.type === 'reject') onReject?.(currentTrial.id)
    setConfirmAction(null)
  }

  const isPendingReschedule = currentTrial.status === 'reschedule'
  const activeSessions = isPendingReschedule ? [] : currentTrial.sessions
  const familyMembers = getTrialFamilyMembers(currentTrial)
  const primaryFamilyMember = familyMembers.find((m) => m.isPrimary) ?? familyMembers[0] ?? { name: currentTrial.parentName || currentTrial.familyName, phone: currentTrial.familyPhone }

  const studentSchool = currentTrial.currentSchool || leadMatch?.schoolName || 'Tiểu học Chu Văn An (Hà Nội)'
  const studentAbility = currentTrial.academicPerformance || leadMatch?.academicPerformance || leadMatch?.academicAbility || 'Khá - Giỏi / Tiếp thu nhanh'
  const parentAddress = currentTrial.parentAddress || currentTrial.address || leadMatch?.address || 'Thanh Xuân, Hà Nội'
  const parentDisplayName = primaryFamilyMember.name.includes('(') ? primaryFamilyMember.name : `${primaryFamilyMember.name} (Bố)`

  return (
    <>
      <Dialog open={Boolean(trial)} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] flex flex-col gap-0 overflow-hidden sm:max-w-5xl p-0 border shadow-2xl bg-background">
          {/* Header gọn gàng: Tiêu đề */}
          <DialogHeader className="shrink-0 px-4 pt-3 pb-0.5 bg-background">
            <div className="flex items-center justify-between gap-3 pr-6">
              <DialogTitle className="text-xs font-medium text-foreground">
                Chi tiết Phiếu học thử
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Body: 2 Panel - Panel trái tăng bề rộng, Panel phải giữ nguyên */}
          <div className="flex-1 overflow-y-auto px-4 py-3 bg-background">
            <div className="flex flex-col md:flex-row gap-3.5 items-start">
              {/* ==================== PANEL TRÁI: TĂNG BỀ RỘNG ==================== */}
              <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
                {/* 1. BỘ LỌC MÔN RIÊNG RẼ DẠNG NÚT BẤM NỔI BẬT */}
                <SessionSubjectFilterBar
                  activeSubject={activeSubject}
                  onSubjectChange={setActiveSubject}
                  counts={subjectCounts}
                />

                {/* 2. DANH SÁCH CÁC LẦN CỦA MÔN NÀY (GOM LẦN & KẾT QUẢ VÀO 1 CARD) */}
                <div className="space-y-3">
                  {currentSubjectSessions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-xs text-muted-foreground">
                      <p className="font-medium text-foreground text-xs sm:text-sm">
                        Chưa có lịch {activeSubject === 'math' ? 'Toán tư duy' : 'Tiếng Anh'}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Học viên chưa phát sinh buổi kiểm tra đầu vào hoặc lớp học thử nào cho môn này.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* CA HIỆN TẠI / GẦN NHẤT */}
                      {currentSubjectSessions[0] && (
                        <UnifiedAttemptResultCard
                          key={currentSubjectSessions[0].id}
                          session={currentSubjectSessions[0]}
                          attemptNumber={currentSubjectSessions.length}
                          isFocused={currentSubjectSessions[0].id === currentTrial.id}
                          canEditPlacement={false}
                          collapsible={false}
                          onOpenAssign={(mode, trialId) => onOpenAssign?.({ mode, trialId: trialId || currentSubjectSessions[0].id })}
                          onSelectAsFocus={() => {
                            if (currentSubjectSessions[0].type === 'trial' && currentSubjectSessions[0].sourceTrial) {
                              setOverrideTrial(currentSubjectSessions[0].sourceTrial)
                            }
                          }}
                          onApproveTrial={(id) => {
                            onApprove?.(id)
                            setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'confirmed' } : curr))
                            toast.success('Đã xác nhận ghép lớp học thử!')
                          }}
                          onRejectTrial={(id) => {
                            onReject?.(id)
                            setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'rejected', sessions: [] } : curr))
                            toast.success('Đã từ chối ghép lớp học thử!')
                          }}
                          onCheckInTrial={(id) => {
                            if (onUpdateTrial) {
                              onUpdateTrial(id, (prev) => ({ ...prev, status: 'completed' }))
                            }
                            setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'completed' } : curr))
                            toast.success('Đã điểm danh (Check-in) học viên vào lớp học thử!')
                          }}
                          onCancelTrial={(id) => {
                            if (onUpdateTrial) {
                              onUpdateTrial(id, (prev) => ({ ...prev, status: 'cancelled' }))
                            }
                            setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'cancelled' } : curr))
                            toast.success('Đã hủy lịch học thử!')
                          }}
                        />
                      )}

                      {/* NHÃN LỊCH SỬ Ở GIỮA PANEL TRÁI */}
                      {currentSubjectSessions.length > 1 && (
                        <div className="relative flex items-center justify-center my-2 select-none">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/70" />
                          </div>
                          <div className="relative flex items-center gap-1.5 bg-background px-3 text-xs font-normal text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>Lịch sử</span>
                            <span className="text-[10px] bg-muted px-1.5 py-0.2 rounded-full font-mono text-muted-foreground">
                              {currentSubjectSessions.length - 1}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* CÁC LẦN TRƯỚC ĐÓ (CHO HẾT VÀO LỊCH SỬ) */}
                      {currentSubjectSessions.slice(1).map((item, index) => {
                        const isCurrentSession = item.id === currentTrial.id
                        const attemptNumber = currentSubjectSessions.length - 1 - index

                        return (
                          <UnifiedAttemptResultCard
                            key={item.id}
                            session={item}
                            attemptNumber={attemptNumber}
                            isFocused={isCurrentSession}
                            canEditPlacement={false}
                            collapsible={true}
                            defaultCollapsed={true}
                            onOpenAssign={(mode, trialId) => onOpenAssign?.({ mode, trialId: trialId || item.id })}
                            onSelectAsFocus={() => {
                              if (item.type === 'trial' && item.sourceTrial) {
                                setOverrideTrial(item.sourceTrial)
                              }
                            }}
                            onApproveTrial={(id) => {
                              onApprove?.(id)
                              setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'confirmed' } : curr))
                              toast.success('Đã xác nhận ghép lớp học thử!')
                            }}
                            onRejectTrial={(id) => {
                              onReject?.(id)
                              setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'rejected', sessions: [] } : curr))
                              toast.success('Đã từ chối ghép lớp học thử!')
                            }}
                            onCheckInTrial={(id) => {
                              if (onUpdateTrial) {
                                onUpdateTrial(id, (prev) => ({ ...prev, status: 'completed' }))
                              }
                              setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'completed' } : curr))
                              toast.success('Đã điểm danh (Check-in) học viên vào lớp học thử!')
                            }}
                            onCancelTrial={(id) => {
                              if (onUpdateTrial) {
                                onUpdateTrial(id, (prev) => ({ ...prev, status: 'cancelled' }))
                              }
                              setOverrideTrial((curr) => (curr?.id === id ? { ...curr, status: 'cancelled' } : curr))
                              toast.success('Đã hủy lịch học thử!')
                            }}
                          />
                        )
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* ==================== PANEL PHẢI: GIỮ NGUYÊN BỀ RỘNG (~330px) ==================== */}
              <div className="w-full md:w-[330px] shrink-0 flex flex-col gap-3 min-w-0">
                <StudentUnifiedProfilePanel
                  studentName={currentTrial.studentName}
                  studentAgeDob={getStudentAgeText(currentTrial)}
                  studentSchool={studentSchool}
                  studentAbility={studentAbility}
                  placementLevels={placementLevels}
                  activeSubject={activeSubject}
                  parentName={parentDisplayName}
                  parentPhone={primaryFamilyMember.phone}
                  parentAddress={parentAddress}
                  notes={currentTrial.notes}
                  createdDate={currentTrial.auditLog[0]?.timestamp || '2026-05-18 10:00'}
                  creatorName={currentTrial.creator || 'Nguyễn Thị Hà'}
                  creatorRole="Chuyên viên Tư vấn Tuyển sinh"
                  creatorPhone={creatorPersonnelItem?.phone}
                  creatorEmail={creatorPersonnelItem?.email}
                  creatorAvatar={creatorPersonnelItem?.avatar}
                  auditLogs={currentTrial.auditLog}
                  onEditLevel={() => setLevelModalOpen(true)}
                />
              </div>
            </div>
          </div>

          {/* Footer chuẩn: Nút đóng bên trái/phải, nút thao tác chính */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/20">
            <div>
              {currentTrial.status === 'pending_approval' && activeSessions.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  onClick={() =>
                    setConfirmAction({
                      type: 'reject',
                      label: 'Từ chối ghép lớp',
                      description: 'Bạn có chắc chắn muốn từ chối ghép lớp học thử này?',
                    })
                  }
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Từ chối ghép lớp
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="h-8 text-xs cursor-pointer">
                Đóng
              </Button>

              {/* Action chính theo trạng thái */}
              {currentTrial.status === 'pending_approval' && (
                activeSessions.length > 0 ? (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs cursor-pointer"
                    onClick={() => {
                      onApprove?.(currentTrial.id)
                      onOpenChange(false)
                    }}
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Xác nhận ghép lớp
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer"
                    onClick={() => onOpenAssign?.({ mode: 'assign', trialId: currentTrial.id })}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Ghép lớp & xác nhận
                  </Button>
                )
              )}

              {currentTrial.status === 'rejected' && (
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer"
                  onClick={() => onOpenAssign?.({ mode: 'assign', trialId: currentTrial.id })}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Ghép lại lớp
                </Button>
              )}

              {currentTrial.status === 'reschedule' && (
                <Button
                  size="sm"
                  className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer"
                  onClick={() => onOpenAssign?.({ mode: 'reschedule', trialId: currentTrial.id })}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  Đổi buổi học
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Tái sử dụng: Cập nhật thông tin trình độ học viên (Lấy theo trình độ mới nhất) */}
      {currentTrial && (
        <StudentDetailLevelDialog
          open={levelModalOpen}
          onOpenChange={setLevelModalOpen}
          initialLevel={
            (activeSubject === 'math' ? placementLevels.math?.level : placementLevels.english?.level) ||
            currentTrial.program ||
            ''
          }
          initialSubLevel={
            (activeSubject === 'math' ? placementLevels.math?.subLevel : placementLevels.english?.subLevel) ||
            ''
          }
          initialSchoolClass={studentSchool}
          isEnglish={activeSubject === 'english'}
          onSave={(newLevel, newSubLevel) => {
            if (onUpdateTrial) {
              onUpdateTrial(currentTrial.id, (prev: TrialClass) => ({
                ...prev,
                program: newLevel,
              }))
            }
            toast.success(
              `Đã cập nhật trình độ môn ${activeSubject === 'math' ? 'Toán tư duy' : 'Tiếng Anh'}: ${newLevel}${
                newSubLevel ? ` - ${newSubLevel}` : ''
              }`
            )
          }}
        />
      )}

      {/* Confirm Dialog */}
      {confirmAction && (
        <ConfirmDialog
          open={Boolean(confirmAction)}
          onOpenChange={(open) => {
            if (!open) setConfirmAction(null)
          }}
          title={confirmAction.label}
          description={confirmAction.description}
          onConfirm={handleConfirmAction}
          variant="destructive"
        />
      )}
    </>
  )
}
