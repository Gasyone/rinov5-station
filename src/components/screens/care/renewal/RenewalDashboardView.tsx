'use client'

import { useMemo } from 'react'
import { MetricTile } from '@/components/shared'
import { 
  Users, 
  CheckCircle, 
  HelpCircle, 
  TrendingUp,
  Award,
  PhoneCall,
  UserCheck
} from 'lucide-react'
import type { StudentCareAlert } from '@/mocks/careAlerts'
import { getRenewalClassification } from './renewalHelpers'

interface RenewalDashboardViewProps {
  alerts: StudentCareAlert[]
}

export function RenewalDashboardView({ alerts }: RenewalDashboardViewProps) {
  // 1. Calculations
  const metrics = useMemo(() => {
    const total = alerts.length
    
    // Successful renewal classification: tai_phi, chong_phi
    const success = alerts.filter(item => {
      const cls = getRenewalClassification(item)
      return cls === 'tai_phi' || cls === 'chong_phi'
    }).length

    // Active pipeline: can_nhac, tiem_nang, hen_tai
    const pipeline = alerts.filter(item => {
      const cls = getRenewalClassification(item)
      return cls === 'can_nhac' || cls === 'tiem_nang' || cls === 'hen_tai'
    }).length

    // Pending (Mới)
    const pending = alerts.filter(item => getRenewalClassification(item) === 'moi').length

    // Conversion rate
    const conversionRate = total > 0 ? Math.round((success / total) * 100) : 0

    return { total, success, pipeline, pending, conversionRate }
  }, [alerts])

  // Chart 1: Funnel conversion status list
  const statusData = useMemo(() => {
    let chuaLienHe = 0
    let canNhac = 0
    let tiemNang = 0
    let henTai = 0
    let daTai = 0
    let chongPhi = 0
    let rutPhi = 0
    let thatBai = 0

    alerts.forEach(item => {
      const cls = getRenewalClassification(item)
      if (cls === 'moi') chuaLienHe++
      else if (cls === 'can_nhac') canNhac++
      else if (cls === 'tiem_nang') tiemNang++
      else if (cls === 'hen_tai') henTai++
      else if (cls === 'tai_phi') daTai++
      else if (cls === 'chong_phi') chongPhi++
      else if (cls === 'rut_phi') rutPhi++
      else if (cls === 'that_bai') thatBai++
    })

    const data = [
      { name: 'Đã tái phí', count: daTai + chongPhi, color: 'bg-emerald-500' },
      { name: 'Đang cân nhắc / Hẹn tái', count: canNhac + tiemNang + henTai, color: 'bg-sky-500' },
      { name: 'Mới', count: chuaLienHe, color: 'bg-zinc-400' },
      { name: 'Thất bại / Rút phí', count: thatBai + rutPhi, color: 'bg-rose-500' }
    ]

    return data.map(item => ({
      ...item,
      pct: metrics.total > 0 ? Math.round((item.count / metrics.total) * 100) : 0
    }))
  }, [alerts, metrics])

  // Recent interaction list
  const recentActivities = useMemo(() => {
    const list: { studentName: string; studentId: string; staff: string; note: string; date: string }[] = []
    alerts.forEach(item => {
      item.interactionLogs.slice(-2).forEach(log => {
        list.push({
          studentName: item.studentName,
          studentId: item.studentId,
          staff: log.staffName,
          note: log.notes,
          date: log.date
        })
      })
    })
    return list.slice(0, 5)
  }, [alerts])

  return (
    <div className="space-y-4 p-4 lg:p-6 overflow-y-auto max-h-[calc(100vh-140px)]">
      {/* Row 1: Key Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricTile
          label="Tổng học viên Tái phí"
          value={metrics.total}
          icon={Users}
          trend={{ value: '+2.8%', positive: true, description: 'so với tháng trước' }}
        />
        <MetricTile
          label="Đã hoàn thành Tái phí"
          value={metrics.success}
          icon={CheckCircle}
          trend={{ value: `${metrics.conversionRate}%`, positive: true, description: 'tỷ lệ chuyển đổi' }}
        />
        <MetricTile
          label="Đang chăm sóc (Pipeline)"
          value={metrics.pipeline}
          icon={HelpCircle}
          trend={{ value: '-5%', positive: true, description: 'giảm tồn đọng' }}
        />
        <MetricTile
          label="Tỷ lệ Tái phí thành công"
          value={`${metrics.conversionRate}%`}
          icon={TrendingUp}
          className="border-emerald-200 dark:border-emerald-900/50"
          trend={{ value: '+4.5%', positive: true, description: 'tăng trưởng mục tiêu' }}
        />
      </div>

      {/* Row 2: Charts Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Chart 1: Funnel donut visualization */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2 mb-3">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-500" />
              Tỷ lệ Chuyển đổi Tái phí
            </h3>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted/30"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeWidth="3.5"
                  strokeDasharray={`${metrics.conversionRate}, 100`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold">{metrics.conversionRate}%</span>
                <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Đã tái phí</p>
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>Thành công ({metrics.success})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-400" />
                <span>Còn lại ({metrics.total - metrics.success})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Pipeline Distribution */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2 mb-3">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <PhoneCall className="h-4 w-4 text-sky-500" />
              Tiến độ Chăm sóc Tái phí
            </h3>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-3 py-1">
            {statusData.map(ch => (
              <div key={ch.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span>{ch.name}</span>
                  <span className="text-muted-foreground">{ch.count} học viên ({ch.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-muted/55 rounded-full overflow-hidden">
                  <div className={`h-full ${ch.color}`} style={{ width: `${ch.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Recent Actions */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex flex-col justify-between">
          <div className="border-b border-border/40 pb-2 mb-3">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-sky-500" />
              Lịch sử Tương tác Tái phí Gần đây
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[190px]">
            {recentActivities.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-6">Chưa có tương tác tái phí nào.</p>
            ) : (
              recentActivities.map((act, index) => (
                <div key={index} className="flex gap-2 items-start border-b border-border/20 pb-2 last:border-b-0 last:pb-0 text-left">
                  <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5 uppercase">
                    {act.staff.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-1 text-[10px]">
                      <span className="font-bold text-foreground truncate">{act.studentName} ({act.studentId})</span>
                      <span className="text-[8px] font-mono text-muted-foreground whitespace-nowrap shrink-0">{act.date}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-normal">
                      <strong>{act.staff}:</strong> {act.note}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
