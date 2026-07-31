'use client'

import { useMemo, useState } from 'react'
import { EmptyState } from '@/components/shared'
import { 
  Users, 
  BookOpen, 
  Calendar, 
  AlertTriangle,
  Clock, 
  PhoneCall, 
  UserCheck,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  Filter,
  Search
} from 'lucide-react'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { 
  getStudentActiveTags, 
  isOverdue, 
  isPending, 
  isWeakAcademic, 
  isLowAttendance,
  isCared,
  isInProgress,
  getTopUrgentAlerts,
  calculateStaffPerformanceMetrics
} from './operationsAlertHelpers'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface CareDashboardViewProps {
  alerts: StudentCareAlert[]
  onDrillDown?: (filterType: 'overdue' | 'academic' | 'attendance' | 'pending' | 'cared' | 'all', viewMode: 'table') => void
  onSelectStudent?: (studentId: string) => void
  onFilterByStaff?: (staffName: string) => void
}

export function CareDashboardView({ alerts, onDrillDown, onSelectStudent, onFilterByStaff }: CareDashboardViewProps) {
  const [staffSearchQuery, setStaffSearchQuery] = useState('')
  const [staffRoleTab, setStaffRoleTab] = useState<'all' | 'CS' | 'GV'>('all')

  // 1. Calculations for key metrics
  const metrics = useMemo(() => {
    const total = alerts.length
    const academic = alerts.filter(item => isWeakAcademic(item)).length
    const attendance = alerts.filter(item => isLowAttendance(item)).length
    const overdue = alerts.filter(item => isOverdue(item)).length
    const pending = alerts.filter(item => isPending(item)).length
    const cared = alerts.filter(item => isCared(item)).length
    const inProgress = alerts.filter(item => isInProgress(item)).length

    return { total, academic, attendance, overdue, pending, cared, inProgress }
  }, [alerts])

  // SLA status percentage
  const slaPercentage = useMemo(() => {
    if (metrics.total === 0) return { inTime: 100, overdue: 0 }
    const overduePct = Math.round((metrics.overdue / metrics.total) * 100)
    return {
      inTime: Math.max(0, 100 - overduePct),
      overdue: overduePct
    }
  }, [metrics])

  // Staff performance summary & individual list
  const { csSummary, gvSummary, staffList } = useMemo(() => {
    return calculateStaffPerformanceMetrics(alerts)
  }, [alerts])

  // Filtered staff list for leaderboard
  const filteredStaffList = useMemo(() => {
    return staffList.filter(s => {
      if (staffRoleTab !== 'all' && s.role !== staffRoleTab) return false
      if (staffSearchQuery) {
        const q = staffSearchQuery.toLowerCase()
        return s.staffName.toLowerCase().includes(q)
      }
      return true
    })
  }, [staffList, staffRoleTab, staffSearchQuery])

  // Care Status Distribution
  const careStatusDistribution = useMemo(() => {
    if (metrics.total === 0) return []
    return [
      {
        name: 'Chưa chăm sóc',
        count: metrics.pending,
        pct: Math.round((metrics.pending / metrics.total) * 100),
        color: 'bg-amber-500',
        textColor: 'text-amber-600 dark:text-amber-400',
        filterKey: 'pending' as const
      },
      {
        name: 'Đang xử lý',
        count: metrics.inProgress,
        pct: Math.round((metrics.inProgress / metrics.total) * 100),
        color: 'bg-sky-500',
        textColor: 'text-sky-600 dark:text-sky-400',
        filterKey: 'all' as const
      },
      {
        name: 'Đã hoàn thành CS',
        count: metrics.cared,
        pct: Math.round((metrics.cared / metrics.total) * 100),
        color: 'bg-emerald-500',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        filterKey: 'cared' as const
      }
    ]
  }, [metrics])

  // Care Channels Distribution
  const channelData = useMemo(() => {
    let call = 0
    let zalo = 0
    let direct = 0
    let facebook = 0

    alerts.forEach(item => {
      item.interactionLogs.forEach(log => {
        const text = log.callConfirmation || ''
        if (text.includes('gọi')) call++
        else if (text.includes('Zalo')) zalo++
        else if (text.includes('gặp')) direct++
        else if (text.includes('Facebook')) facebook++
      })
    })

    const totalLogs = call + zalo + direct + facebook
    if (totalLogs === 0) return [
      { name: 'Cuộc gọi', count: 0, pct: 0, color: 'bg-sky-500' },
      { name: 'Zalo', count: 0, pct: 0, color: 'bg-indigo-500' },
      { name: 'Trực tiếp', count: 0, pct: 0, color: 'bg-emerald-500' },
      { name: 'Facebook', count: 0, pct: 0, color: 'bg-purple-500' }
    ]

    return [
      { name: 'Cuộc gọi điện thoại', count: call, pct: Math.round((call / totalLogs) * 100), color: 'bg-sky-500' },
      { name: 'Nhắn tin Zalo', count: zalo, pct: Math.round((zalo / totalLogs) * 100), color: 'bg-indigo-500' },
      { name: 'Trao đổi Trực tiếp', count: direct, pct: Math.round((direct / totalLogs) * 100), color: 'bg-emerald-500' },
      { name: 'Nhắn qua Facebook', count: facebook, pct: Math.round((facebook / totalLogs) * 100), color: 'bg-purple-500' }
    ]
  }, [alerts])

  // Recent activity stream
  const recentActivities = useMemo(() => {
    const list: { studentName: string; studentId: string; staff: string; note: string; date: string; channel: string }[] = []
    alerts.forEach(item => {
      item.interactionLogs.slice(-2).forEach(log => {
        list.push({
          studentName: item.studentName,
          studentId: item.studentId,
          staff: log.staffName,
          note: log.notes,
          date: log.date,
          channel: log.callConfirmation || 'Tương tác'
        })
      })
    })
    return list.slice(0, 6)
  }, [alerts])

  // Top Urgent Cases
  const urgentAlerts = useMemo(() => {
    return getTopUrgentAlerts(alerts, 5)
  }, [alerts])

  if (alerts.length === 0) {
    return (
      <div className="p-8">
        <EmptyState
          title="Không có dữ liệu cảnh báo"
          description="Hiện tại không tìm thấy học viên nào phù hợp với bộ lọc cảnh báo hiện tại."
        />
      </div>
    )
  }

  return (
    <div className="space-y-5 p-4 lg:p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Row 1: KPI Metric Strip (Ultra Compact) */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: 'Tổng HV Cảnh báo', value: metrics.total, Icon: Users, trend: '+4%', positive: true, filter: 'all' as const, accent: 'text-sky-600 dark:text-sky-400', iconBg: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400' },
          { label: 'Cảnh báo Học lực', value: metrics.academic, Icon: BookOpen, trend: '-2%', positive: true, filter: 'academic' as const, accent: 'text-violet-600 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400' },
          { label: 'Cảnh báo Chuyên cần', value: metrics.attendance, Icon: Calendar, trend: '+8%', positive: false, filter: 'attendance' as const, accent: 'text-amber-600 dark:text-amber-400', iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' },
          { label: 'Ca Quá hạn SLA', value: metrics.overdue, Icon: AlertTriangle, trend: `${slaPercentage.overdue}%`, positive: metrics.overdue === 0, filter: 'overdue' as const, accent: 'text-rose-600 dark:text-rose-400', iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-900/50' },
          { label: 'Chưa Chăm sóc', value: metrics.pending, Icon: Clock, trend: `${metrics.pending} ca`, positive: metrics.pending === 0, filter: 'pending' as const, accent: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400' },
        ].map(kpi => (
          <button
            key={kpi.label}
            onClick={() => onDrillDown?.(kpi.filter, 'table')}
            className={`flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2 text-left shadow-sm transition-colors hover:bg-accent/50 ${kpi.border || 'border-border'}`}
          >
            <div className={`h-7 w-7 shrink-0 rounded-md flex items-center justify-center ${kpi.iconBg}`}>
              <kpi.Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground truncate">{kpi.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-base font-black leading-tight ${kpi.accent}`}>{kpi.value}</span>
                <span className={`text-[9px] font-bold ${kpi.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{kpi.trend}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Row 2: Analytics & Chart Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Chart 1: SLA Efficiency */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <Clock className="h-4 w-4 text-sky-500" />
              Hiệu suất Phản hồi SLA
            </h3>
            <span className="text-[10px] text-muted-foreground font-medium">Toàn hệ thống</span>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              {/* Circular Gauge Chart */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-rose-200 dark:text-rose-950/60"
                  strokeWidth="3.8"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-500 ease-out"
                  strokeWidth="3.8"
                  strokeDasharray={`${slaPercentage.inTime}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-foreground">{slaPercentage.inTime}%</span>
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Trong hạn</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Trong hạn ({metrics.total - metrics.overdue})</span>
              </div>
              <div 
                className="flex items-center gap-1.5 cursor-pointer hover:underline"
                onClick={() => onDrillDown?.('overdue', 'table')}
              >
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                <span className="text-rose-600 dark:text-rose-400 font-bold">Trễ SLA ({metrics.overdue})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Interaction Channels */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <PhoneCall className="h-4 w-4 text-sky-500" />
              Phân bổ Kênh Tương tác
            </h3>
            <span className="text-[10px] text-muted-foreground font-medium">Thống kê CSKH</span>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-3 py-2">
            {channelData.map(ch => (
              <div key={ch.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-foreground">{ch.name}</span>
                  <span className="text-muted-foreground font-mono">{ch.count} lượt ({ch.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                  <div className={`h-full ${ch.color} transition-all duration-300`} style={{ width: `${ch.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Care Status Breakdown */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <UserCheck className="h-4 w-4 text-sky-500" />
              Phân bổ Trạng thái Tác nghiệp
            </h3>
            <span className="text-[10px] text-muted-foreground font-medium">Tiến độ CS</span>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
            {careStatusDistribution.map(st => (
              <div 
                key={st.name} 
                className="space-y-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onDrillDown?.(st.filterKey, 'table')}
              >
                <div className="flex justify-between text-xs font-medium">
                  <span className={`font-semibold ${st.textColor}`}>{st.name}</span>
                  <span className="font-mono text-muted-foreground">{st.count} HV ({st.pct}%)</span>
                </div>
                <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden">
                  <div className={`h-full ${st.color}`} style={{ width: `${st.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Staff Role Performance Comparison (CS vs Teacher) */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <div className="border-b border-border/40 pb-2.5 flex items-center justify-between">
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <ShieldCheck className="h-4 w-4 text-sky-500" />
            Đo lường Hiệu suất Tác nghiệp theo Khối Chuyên môn (CSKH vs Giáo viên)
          </h3>
          <span className="text-[10px] text-muted-foreground font-medium">Phân định Trách nhiệm SLA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: CSKH Performance */}
          <div className="p-3.5 rounded-lg border border-sky-200 dark:border-sky-900/50 bg-sky-50/20 dark:bg-sky-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-sky-500 text-white font-bold text-xs flex items-center justify-center">
                  CS
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Bộ phận CSKH (Chăm sóc Khách hàng)</h4>
                  <p className="text-[10px] text-muted-foreground">Phụ trách Dịch vụ, Tái phí, Tiếp nhận yêu cầu</p>
                </div>
              </div>
              <Badge variant="outline" className="border-sky-300 text-sky-700 dark:text-sky-300 font-bold">
                Tỷ lệ SLA: {csSummary.inTimeRate}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-md bg-background border border-border/60">
                <span className="text-[10px] text-muted-foreground font-medium block">Tổng ca giao</span>
                <span className="text-base font-bold text-foreground">{csSummary.totalAlerts}</span>
              </div>
              <div className="p-2 rounded-md bg-background border border-border/60">
                <span className="text-[10px] text-muted-foreground font-medium block">Đã chăm sóc</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{csSummary.caredAlerts}</span>
              </div>
              <div className="p-2 rounded-md bg-background border border-border/60">
                <span className="text-[10px] text-muted-foreground font-medium block">Quá hạn SLA</span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">{csSummary.overdueAlerts}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Teacher Performance */}
          <div className="p-3.5 rounded-lg border border-violet-200 dark:border-violet-900/50 bg-violet-50/20 dark:bg-violet-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-violet-500 text-white font-bold text-xs flex items-center justify-center">
                  GV
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Bộ phận Giáo viên (Giảng dạy)</h4>
                  <p className="text-[10px] text-muted-foreground">Phụ trách Học lực, Chuyên cần, Nhận xét chuyên môn</p>
                </div>
              </div>
              <Badge variant="outline" className="border-violet-300 text-violet-700 dark:text-violet-300 font-bold">
                Tỷ lệ SLA: {gvSummary.inTimeRate}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="p-2 rounded-md bg-background border border-border/60">
                <span className="text-[10px] text-muted-foreground font-medium block">Tổng ca giao</span>
                <span className="text-base font-bold text-foreground">{gvSummary.totalAlerts}</span>
              </div>
              <div className="p-2 rounded-md bg-background border border-border/60">
                <span className="text-[10px] text-muted-foreground font-medium block">Đã chăm sóc</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">{gvSummary.caredAlerts}</span>
              </div>
              <div className="p-2 rounded-md bg-background border border-border/60">
                <span className="text-[10px] text-muted-foreground font-medium block">Quá hạn SLA</span>
                <span className="text-base font-bold text-rose-600 dark:text-rose-400">{gvSummary.overdueAlerts}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Individual Staff Performance Leaderboard Table */}
      <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-4">
        <div className="border-b border-border/40 pb-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <GraduationCap className="h-4 w-4 text-sky-500" />
              Bảng Đo lường Tác nghiệp Chi tiết theo Từng Nhân sự
            </h3>
            <p className="text-[10px] text-muted-foreground">Theo dõi trực tiếp khối lượng công việc, tỷ lệ hoàn thành và ca quá hạn của từng nhân viên CS & Giáo viên</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter Tabs */}
            <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/40 text-[10px]">
              <button
                onClick={() => setStaffRoleTab('all')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${staffRoleTab === 'all' ? 'bg-background text-foreground shadow-xs font-bold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Tất cả ({staffList.length})
              </button>
              <button
                onClick={() => setStaffRoleTab('CS')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${staffRoleTab === 'CS' ? 'bg-sky-500 text-white font-bold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Khối CS
              </button>
              <button
                onClick={() => setStaffRoleTab('GV')}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${staffRoleTab === 'GV' ? 'bg-violet-500 text-white font-bold' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Khối GV
              </button>
            </div>

            {/* Quick search input */}
            <div className="relative w-36 sm:w-44">
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm nhân sự..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="h-7 text-xs pl-7 py-0"
              />
            </div>
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto border border-border/60 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border/60 text-[10px] uppercase font-bold text-muted-foreground">
              <tr>
                <th className="py-2.5 px-3">Nhân sự Phụ trách</th>
                <th className="py-2.5 px-3">Vai trò</th>
                <th className="py-2.5 px-3 text-center">Số ca được giao</th>
                <th className="py-2.5 px-3 text-center">Đã chăm sóc</th>
                <th className="py-2.5 px-3 text-center">Quá hạn SLA</th>
                <th className="py-2.5 px-3">Tỷ lệ Đúng hạn SLA (%)</th>
                <th className="py-2.5 px-3 text-right">Thao tác Nhanh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredStaffList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-muted-foreground italic text-xs">
                    Không tìm thấy nhân sự phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStaffList.map((st) => {
                  const rateColor = st.inTimeRate >= 85 ? 'bg-emerald-500' : st.inTimeRate >= 70 ? 'bg-amber-500' : 'bg-rose-500'

                  return (
                    <tr key={`${st.role}-${st.staffName}`} className="hover:bg-accent/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-6 w-6 rounded-full font-bold text-[9px] flex items-center justify-center uppercase shrink-0 ${st.role === 'CS' ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' : 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'}`}>
                            {st.staffName.slice(0, 2)}
                          </div>
                          <span className="font-bold text-foreground">{st.staffName}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge 
                          variant="outline" 
                          className={`text-[9px] px-1.5 py-0 ${st.role === 'CS' ? 'border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300' : 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300'}`}
                        >
                          {st.role === 'CS' ? 'CSKH' : 'Giáo viên'}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-foreground font-mono">
                        {st.assignedCount} ca
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {st.caredCount} ca
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        {st.overdueCount > 0 ? (
                          <Badge variant="outline" className="border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px]">
                            {st.overdueCount} ca trễ
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="space-y-1 max-w-[160px]">
                          <div className="flex justify-between text-[10px] font-bold">
                            <span>{st.inTimeRate}%</span>
                            <span className="text-muted-foreground font-normal">
                              {st.assignedCount - st.overdueCount}/{st.assignedCount} trong hạn
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                            <div className={`h-full ${rateColor}`} style={{ width: `${st.inTimeRate}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onFilterByStaff?.(st.staffName)}
                          className="h-7 text-[10px] px-2 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40"
                        >
                          <Filter className="h-3 w-3 mr-1" />
                          Lọc ca tác nghiệp
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 5: Action Stream & Top Urgent Cases (2-Column Grid) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left Column: Recent Activity Feed (Span 2) */}
        <div className="lg:col-span-2 p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wide">
              <UserCheck className="h-4 w-4 text-sky-500" />
              Nhật ký Tác nghiệp Gần đây
            </h3>
            <span className="text-[10px] text-muted-foreground font-medium">Real-time Feed</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3.5 pt-3 pr-1 max-h-[260px]">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-8">Chưa có nhật ký tương tác mới nào.</p>
            ) : (
              recentActivities.map((act, index) => (
                <div key={index} className="flex gap-3 items-start border-b border-border/30 pb-3 last:border-b-0 last:pb-0">
                  <div className="h-7 w-7 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-[10px] font-bold flex items-center justify-center shrink-0 uppercase border border-sky-200 dark:border-sky-800">
                    {act.staff.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span 
                          onClick={() => onSelectStudent?.(act.studentId)}
                          className="font-bold text-xs text-foreground hover:underline cursor-pointer truncate"
                        >
                          {act.studentName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">({act.studentId})</span>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
                          {act.channel}
                        </Badge>
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground whitespace-nowrap shrink-0">{act.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      <strong className="text-foreground font-semibold">{act.staff}:</strong> {act.note}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Top Urgent Cases (Span 1) */}
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wide">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              Ca Cảnh báo Cấp bách
            </h3>
            <span className="text-[10px] text-rose-500 font-bold font-mono">{urgentAlerts.length} ca ưu tiên</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 max-h-[260px]">
            {urgentAlerts.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-8">Không có ca cảnh báo cấp bách nào.</p>
            ) : (
              urgentAlerts.map(item => {
                const tags = getStudentActiveTags(item)
                const isItemOverdue = isOverdue(item)

                return (
                  <div 
                    key={item.id} 
                    className="p-2.5 rounded-lg border border-border/60 bg-background hover:bg-accent/40 transition-colors flex items-center justify-between gap-2 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span 
                          onClick={() => onSelectStudent?.(item.studentId)}
                          className="text-xs font-bold text-foreground group-hover:text-sky-600 dark:group-hover:text-sky-400 cursor-pointer truncate"
                        >
                          {item.studentName}
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground">({item.classCode})</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {isItemOverdue && (
                          <Badge variant="outline" className="text-[8px] px-1 py-0 border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                            Quá hạn SLA
                          </Badge>
                        )}
                        {tags.map(t => (
                          <Badge key={t} variant="secondary" className="text-[8px] px-1 py-0">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectStudent?.(item.studentId)}
                      className="h-7 w-7 rounded-md bg-muted hover:bg-sky-100 hover:text-sky-700 dark:hover:bg-sky-950 dark:hover:text-sky-300 flex items-center justify-center shrink-0 transition-colors"
                      title="Xem chi tiết học viên"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
