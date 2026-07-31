'use client'

import Link from 'next/link'
import {
  BookOpen,
  CalendarCheck,
  GraduationCap,
  type LucideIcon,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MetricTile, StatusBadge } from '@/components/shared'
import { getNavigationGroupsForRole } from '@/config/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  mockStudents,
  mockEmployees,
  mockOrders,
  getMockClassSessions,
  getBookingTests,
} from '@/mocks'

interface DashboardMetric {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; positive: boolean; description?: string }
}

function getMetrics(): DashboardMetric[] {
  const activeStudents = mockStudents.filter((s) => s.status === 'active').length
  const activeEmployees = mockEmployees.filter((e) => e.status === 'active').length
  const completedOrders = mockOrders.filter((o) => o.status === 'completed').length
  const sessionsToday = getMockClassSessions().filter((s) => {
    const today = new Date()
    return s.date === today.toISOString().slice(0, 10)
  }).length

  return [
    { label: 'Active Students', value: activeStudents, icon: GraduationCap, trend: { value: '+12%', positive: true, description: 'this month' } },
    { label: 'Active Staff', value: activeEmployees, icon: Users, trend: { value: '+3%', positive: true, description: 'this month' } },
    { label: 'Completed Orders', value: completedOrders, icon: TrendingUp, trend: { value: '+18%', positive: true, description: 'this month' } },
    { label: "Today's Sessions", value: sessionsToday, icon: CalendarCheck },
  ]
}

export function DashboardScreen() {
  const userRole = useAuthStore((state) => state.user?.role)
  const metrics = getMetrics()
  const recentBookings = getBookingTests().slice(0, 5)
  const visibleGroups = getNavigationGroupsForRole(userRole).filter((group) => !group.hiddenInSidebar)

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto px-3 py-3 lg:px-3 lg:py-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Tổng quan hoạt động hôm nay
          </p>
        </div>
      </header>

      {/* Metric Tiles */}
      <section
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Key metrics"
      >
        {metrics.map((metric) => (
          <MetricTile
            key={metric.label}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
          />
        ))}
      </section>

      {/* Recent Bookings */}
      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <UserCheck className="h-4 w-4" />
              Recent Booking Tests
            </CardTitle>
            <Link
              href="/app/booking_test"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border">
              {recentBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {booking.childName}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {booking.id} · {booking.school}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4" />
              Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {visibleGroups.slice(0, 6).map((group) => {
                const Icon = group.icon
                return (
                  <Link
                    key={group.id}
                    href={`/app/${group.items[0].id}`}
                    className="flex flex-col items-start gap-2 rounded-md border border-border p-3 transition-colors hover:bg-accent"
                  >
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{group.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {group.items.length} screens
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
