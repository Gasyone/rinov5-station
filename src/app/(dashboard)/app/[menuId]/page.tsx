'use client'

import { use } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { screens } from '@/config/screens'

export default function MenuPage({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = use(params)
  const screen = screens[menuId]

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>{screen?.label || menuId}</CardTitle>
          <CardDescription>{screen?.description || 'Screen content'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-muted/50 dark:border-slate-700">
            <p className="text-lg text-muted-foreground">
              Screen: {menuId} - Coming Soon
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
