'use client'

import React, { useState, useMemo } from 'react'
import {
  Sparkles,
  LayoutGrid,
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Clock,
  AlertTriangle,
  CreditCard,
  ClipboardCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BranchSelect } from '@/components/controls'
import { AppAvatar, StudentProfileHoverCard } from '@/components/shared'
import type { CareAvatarItem, RenewalAvatarItem } from './homeTypes'

export interface HomeWorkdayHeaderProps {
  selectedBranch: string
  onBranchChange: (branch: string) => void
  userName?: string
  totalClasses?: number
  runningClasses?: number
  todaySessionsCount: number
  careAvatarItems: CareAvatarItem[]
  renewalAvatarItems: RenewalAvatarItem[]
  pendingLeaveCount: number
  onOpenCareStudent: (studentId: string) => void
  onOpenRenewalStudent: (studentId: string) => void
  onNavigateCare: () => void
  onNavigateRenewal: () => void
  onOpenMenuHub: () => void
  onNavigateManage: () => void
}

type UnifiedAvatarItem = {
  id: string
  studentId: string
  studentName: string
  avatar?: string
  type: 'attendance' | 'feedback' | 'grading' | 'care' | 'renewal'
  typeLabel: string
  badgeColor: 'red' | 'amber' | 'blue' | 'emerald' | 'purple'
  tooltip: string
  profileItem: any
}

export function HomeWorkdayHeader({
  selectedBranch,
  onBranchChange,
  userName = 'Admin',
  totalClasses = 0,
  runningClasses = 0,
  todaySessionsCount = 0,
  careAvatarItems = [],
  renewalAvatarItems = [],
  pendingLeaveCount = 0,
  onOpenCareStudent,
  onOpenRenewalStudent,
  onNavigateCare,
  onNavigateRenewal,
  onOpenMenuHub,
  onNavigateManage,
}: HomeWorkdayHeaderProps) {
  const currentHour = new Date().getHours()
  const greeting =
    currentHour < 12
      ? 'Chào buổi sáng'
      : currentHour < 18
      ? 'Chào buổi chiều'
      : 'Chào buổi tối'

  const [careFilterTab, setCareFilterTab] = useState<
    'all' | 'attendance' | 'feedback' | 'grading' | 'care' | 'renewal'
  >('all')

  const unifiedItems = useMemo<UnifiedAvatarItem[]>(() => {
    // 1. Chờ điểm danh ca học
    const attendanceList: UnifiedAvatarItem[] = [
      {
        id: 'att-1',
        studentId: 'st-att-1',
        studentName: 'Đỗ Gia Hưng',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        type: 'attendance',
        typeLabel: 'Điểm danh',
        badgeColor: 'amber',
        tooltip: 'Đỗ Gia Hưng — Chờ điểm danh: Lớp IELTS Junior 1A (Ca 10:30)',
        profileItem: {
          id: 'st-att-1',
          name: 'Đỗ Gia Hưng',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
          code: 'HV-08912',
          className: 'IELTS Junior 1A',
          classCode: 'CLS-IELTS-001',
          parentName: 'Đỗ Văn Cường',
          parentPhone: '0912***456',
          note: 'Chưa xác nhận điểm danh ca sáng',
        },
      },
      {
        id: 'att-2',
        studentId: 'st-att-2',
        studentName: 'Trần Bảo Nam',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        type: 'attendance',
        typeLabel: 'Điểm danh',
        badgeColor: 'amber',
        tooltip: 'Trần Bảo Nam — Chờ điểm danh: Lớp Math Kindi 1B (Ca 08:30)',
        profileItem: {
          id: 'st-att-2',
          name: 'Trần Bảo Nam',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          code: 'HV-07123',
          className: 'Math Kindi 1B',
          classCode: 'CLS-MATH-020',
          parentName: 'Trần Tuấn Kiệt',
          parentPhone: '0988***112',
          note: 'Học sinh vào lớp muộn 15p, chờ giáo viên tick xác nhận',
        },
      },
    ]

    // 2. Chờ nhận xét buổi học
    const feedbackList: UnifiedAvatarItem[] = [
      {
        id: 'fb-1',
        studentId: 'st-fb-1',
        studentName: 'Lê Tuấn Kiệt',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        type: 'feedback',
        typeLabel: 'Nhận xét',
        badgeColor: 'blue',
        tooltip: 'Lê Tuấn Kiệt — Chờ nhận xét buổi học: Lớp Math Kindi 1B (Bài 12)',
        profileItem: {
          id: 'st-fb-1',
          name: 'Lê Tuấn Kiệt',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          code: 'HV-06155',
          className: 'Math Kindi 1B',
          classCode: 'CLS-MATH-020',
          parentName: 'Lê Quốc Trung',
          parentPhone: '0903***789',
          note: 'Cần nhận xét đánh giá khả năng tính nhẩm buổi hôm nay',
        },
      },
      {
        id: 'fb-2',
        studentId: 'st-fb-2',
        studentName: 'Vũ Quỳnh Anh',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        type: 'feedback',
        typeLabel: 'Nhận xét',
        badgeColor: 'blue',
        tooltip: 'Vũ Quỳnh Anh — Chờ nhận xét buổi học: IELTS Junior 1B',
        profileItem: {
          id: 'st-fb-2',
          name: 'Vũ Quỳnh Anh',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          code: 'HV-09231',
          className: 'IELTS Junior 1B',
          classCode: 'CLS-IELTS-002',
          parentName: 'Phạm Thu Hương',
          parentPhone: '0977***663',
          note: 'Chưa cập nhật nhận xét bài nói Speaking task',
        },
      },
    ]

    // 3. Chờ chấm điểm sau buổi học (bài kiểm tra / mini project)
    const gradingList: UnifiedAvatarItem[] = [
      {
        id: 'gr-1',
        studentId: 'st-gr-1',
        studentName: 'Nguyễn Phương Vy',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        type: 'grading',
        typeLabel: 'Chấm điểm',
        badgeColor: 'purple',
        tooltip: 'Nguyễn Phương Vy — Chờ chấm điểm: Mini Project Scratch Kỳ 1',
        profileItem: {
          id: 'st-gr-1',
          name: 'Nguyễn Phương Vy',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          code: 'HV-05441',
          className: 'Digi Lab 01',
          classCode: 'CLS-DIGI-001',
          parentName: 'Nguyễn Đức Thắng',
          parentPhone: '0915***333',
          note: 'Đã nộp bài thuyết trình dự án, chờ giáo viên nhập thang điểm 5 sao',
        },
      },
    ]

    // 4. Chăm sóc học viên
    const careList: UnifiedAvatarItem[] = careAvatarItems.map((c) => ({
      id: `care-${c.id}`,
      studentId: c.studentId,
      studentName: c.studentName,
      avatar: c.avatar,
      type: 'care',
      typeLabel: 'Chăm sóc',
      badgeColor: c.alertBadgeColor === 'red' ? 'red' : 'amber',
      tooltip: `${c.studentName} — ${c.alertLabel}: ${c.reason}`,
      profileItem: c.profileItem,
    }))

    // 5. Tái phí
    const renewalList: UnifiedAvatarItem[] = renewalAvatarItems.map((r) => ({
      id: `renew-${r.id}`,
      studentId: r.studentId,
      studentName: r.studentName,
      avatar: r.avatar,
      type: 'renewal',
      typeLabel: 'Tái phí',
      badgeColor: 'emerald',
      tooltip: `${r.studentName} — ${r.renewalStatusLabel} (Hạn: ${r.expectedEndDate})`,
      profileItem: r.profileItem,
    }))

    if (careFilterTab === 'attendance') return attendanceList
    if (careFilterTab === 'feedback') return feedbackList
    if (careFilterTab === 'grading') return gradingList
    if (careFilterTab === 'care') return careList
    if (careFilterTab === 'renewal') return renewalList

    return [...attendanceList, ...feedbackList, ...gradingList, ...careList, ...renewalList]
  }, [careAvatarItems, renewalAvatarItems, careFilterTab])

  const maxVisible = 10
  const visibleAvatars = unifiedItems.slice(0, maxVisible)
  const remainingCount = unifiedItems.length - visibleAvatars.length

  const handleTitleClick = () => {
    if (careFilterTab === 'renewal') {
      onNavigateRenewal()
    } else {
      onNavigateCare()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3.5 lg:gap-6 items-center">
      {/* Khối bên trái: Lời chào to rõ, Thống kê ca trực bên dưới, Bộ chọn cơ sở & Menu điều hướng (Để phẳng, không có viền, dịch vào trong cách lề) */}
      <div className="space-y-1.5 min-w-0 py-0.5 pl-2 sm:pl-3.5 lg:pl-6">
        {/* 1. Lời chào: Tách riêng ra, Cho to lên */}
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-[15px] font-medium text-foreground tracking-tight truncate">
              {greeting}, <span className="font-semibold text-foreground">{userName}</span>
            </h2>
          </div>
        </div>

        {/* 2. Thống kê: Đưa xuống dưới phần chào */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted/70 text-muted-foreground font-normal leading-tight text-xs"
            title={`${totalClasses} lớp quản lý (${runningClasses} đang học)`}
          >
            <GraduationCap className="w-3 h-3 text-indigo-500 shrink-0" />
            <span>{runningClasses}/{totalClasses} lớp</span>
          </span>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary/80 font-normal leading-tight text-xs"
            title={`${todaySessionsCount} ca học hôm nay`}
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span>{todaySessionsCount} ca hôm nay</span>
          </span>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-700/80 dark:text-amber-400/80 font-normal border border-amber-500/20 leading-tight text-xs"
            title={`${careAvatarItems.length} học viên cần chăm sóc`}
          >
            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{careAvatarItems.length} CS</span>
          </span>

          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700/80 dark:text-emerald-400/80 font-normal border border-emerald-500/20 leading-tight text-xs"
            title={`${renewalAvatarItems.length} học viên cần tái phí`}
          >
            <CreditCard className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{renewalAvatarItems.length} tái phí</span>
          </span>

          {pendingLeaveCount > 0 && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 text-rose-700/80 dark:text-rose-400/80 font-normal border border-rose-500/20 leading-tight text-xs"
              title={`${pendingLeaveCount} đơn nghỉ/bảo lưu chờ duyệt`}
            >
              <span>{pendingLeaveCount} đơn</span>
            </span>
          )}
        </div>

        {/* 3. Chọn cơ sở, Button Menu, Vào trang quản lý: Ở dưới phần chào & thống kê */}
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap pt-0.5">
          <div className="w-40 sm:w-44 shrink-0">
            <BranchSelect
              value={selectedBranch}
              onValueChange={onBranchChange}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenMenuHub}
            className="h-7 text-xs font-normal gap-1.5 px-2.5 rounded-lg border-border/80 hover:bg-muted/60 transition-colors"
            title="Mở toàn bộ danh mục phân hệ"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-primary" />
            <span>Menu</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onNavigateManage}
            className="h-7 text-xs font-normal gap-1 px-2.5 rounded-lg shadow-2xs hover:shadow-xs transition-all shrink-0"
            title="Vào giao diện quản lý chi tiết"
          >
            <span>Trang quản lý</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Khối bên phải: THEO DÕI & CHĂM SÓC (BAO GỒM ĐIỂM DANH, NHẬN XÉT, CHẤM ĐIỂM, CHĂM SÓC, TÁI PHÍ) */}
      <div className="bg-card border border-border/70 rounded-xl p-2.5 sm:p-3 shadow-xs space-y-2 min-w-0 w-full lg:w-[560px] xl:w-[600px] 2xl:w-[640px] shrink-0 justify-self-end">
        {/* Header Theo dõi & Chăm sóc + Filter Tabs */}
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-border/40">
          <div className="flex items-center gap-1.5 min-w-0 shrink-0">
            <button
              type="button"
              onClick={handleTitleClick}
              className="flex items-center gap-1 group text-left cursor-pointer hover:opacity-85 transition-opacity whitespace-nowrap shrink-0"
              title="Click để mở danh sách theo dõi & CS chi tiết"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded bg-primary/10 text-primary shrink-0">
                <ClipboardCheck className="w-2.5 h-2.5" />
              </div>
              <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors flex items-center gap-0.5 whitespace-nowrap">
                Theo dõi & CS
                <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
              </span>
              <Badge variant="secondary" className="text-xs h-4.5 px-1.5 font-normal text-muted-foreground bg-muted/80 rounded-full shrink-0">
                {unifiedItems.length}
              </Badge>
            </button>
          </div>

          {/* Tab lọc nghiệp vụ: Tất cả | Điểm danh | Nhận xét | Chấm điểm | CS | Tái phí */}
          <div className="inline-flex items-center rounded-md bg-muted/60 p-0.5 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setCareFilterTab('all')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                careFilterTab === 'all'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setCareFilterTab('attendance')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                careFilterTab === 'attendance'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              Điểm danh
            </button>
            <button
              type="button"
              onClick={() => setCareFilterTab('feedback')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                careFilterTab === 'feedback'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              Nhận xét
            </button>
            <button
              type="button"
              onClick={() => setCareFilterTab('grading')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                careFilterTab === 'grading'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              Chấm điểm
            </button>
            <button
              type="button"
              onClick={() => setCareFilterTab('care')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                careFilterTab === 'care'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              CS
            </button>
            <button
              type="button"
              onClick={() => setCareFilterTab('renewal')}
              className={`px-2 py-0.5 rounded text-xs leading-none transition-all cursor-pointer ${
                careFilterTab === 'renewal'
                  ? 'bg-background text-foreground shadow-2xs font-medium'
                  : 'text-muted-foreground hover:text-foreground font-normal'
              }`}
            >
              Tái phí
            </button>
          </div>
        </div>

        {/* Dải avatar học viên */}
        {unifiedItems.length === 0 ? (
          <div className="text-xs text-muted-foreground py-2 text-center bg-muted/20 rounded-lg">
            Không có cảnh báo hoặc nhiệm vụ nào tồn đọng
          </div>
        ) : (
          <div className="flex items-center gap-1.5 py-1 px-0.5 overflow-hidden">
            {visibleAvatars.map((item) => {
              const ringColor =
                item.type === 'attendance'
                  ? 'ring-amber-500/80 hover:ring-amber-500'
                  : item.type === 'feedback'
                  ? 'ring-blue-500/80 hover:ring-blue-500'
                  : item.type === 'grading'
                  ? 'ring-purple-500/80 hover:ring-purple-500'
                  : item.badgeColor === 'red'
                  ? 'ring-rose-500/80 hover:ring-rose-500'
                  : 'ring-emerald-500/70 hover:ring-emerald-500'

              const dotBg =
                item.type === 'attendance'
                  ? 'bg-amber-500'
                  : item.type === 'feedback'
                  ? 'bg-blue-500'
                  : item.type === 'grading'
                  ? 'bg-purple-500'
                  : item.badgeColor === 'red'
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'

              return (
                <StudentProfileHoverCard
                  key={item.id}
                  student={item.profileItem}
                  onOpenDetail={item.type === 'care' ? onOpenCareStudent : onOpenRenewalStudent}
                  align="center"
                  side="bottom"
                >
                  <div
                    className="relative group cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0"
                    onClick={() =>
                      item.type === 'care'
                        ? onOpenCareStudent(item.studentId)
                        : onOpenRenewalStudent(item.studentId)
                    }
                    title={item.tooltip}
                  >
                    <div className={`p-0.5 rounded-full ring-2 ${ringColor} ring-offset-1 ring-offset-background transition-all`}>
                      <AppAvatar
                        name={item.studentName}
                        src={item.avatar}
                        size="md"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full ring-2 ring-background ${dotBg}`}
                    />
                  </div>
                </StudentProfileHoverCard>
              )
            })}

            {remainingCount > 0 && (
              <button
                type="button"
                onClick={handleTitleClick}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/80 hover:bg-muted text-muted-foreground text-xs font-normal ring-1 ring-border shrink-0 transition-transform hover:scale-105 cursor-pointer"
                title={`Xem thêm ${remainingCount} học viên`}
              >
                +{remainingCount}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
