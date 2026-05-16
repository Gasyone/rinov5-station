'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { navigationGroups } from '@/config/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const visibleGroups = navigationGroups.filter((group) => !group.hiddenInSidebar)

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Chào mừng đến với Rinov5 - Hệ thống quản lý đào tạo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {visibleGroups.map((group) => (
              <Link
                key={group.id}
                href={`/app/${group.items[0].id}`}
                className="rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <group.icon className="mb-2 h-6 w-6 text-muted-foreground" />
                <h3 className="font-semibold">{group.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {group.items.length} màn hình
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
