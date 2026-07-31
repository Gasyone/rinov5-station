'use client'

import { type ReactNode } from 'react'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { PageHeader } from './PageHeader'

export interface DetailDialogTab {
  id: string
  label: ReactNode
}

interface DetailDialogFrameProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: ReactNode
  accessibleTitle?: string
  accessibleDescription?: string
  description?: ReactNode
  code?: string
  status?: string
  statusLabel?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  headerClassName?: string
  bodyClassName?: string
}

export function DetailDialogFrame({
  open,
  onOpenChange,
  title,
  accessibleTitle,
  accessibleDescription,
  description,
  code,
  status,
  statusLabel,
  actions,
  children,
  className,
  headerClassName,
  bodyClassName,
}: DetailDialogFrameProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex h-[min(90vh,900px)] max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden p-0 sm:w-[92vw] sm:max-w-6xl',
          className
        )}
      >
        <DialogTitle className="sr-only">
          {accessibleTitle ?? (typeof title === 'string' ? title : 'Chi tiết')}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {accessibleDescription
            ?? (typeof description === 'string' ? description : 'Thông tin chi tiết')}
        </DialogDescription>

        <div className="shrink-0 border-b bg-background">
          <PageHeader
            title={title}
            description={description}
            code={code}
            status={status}
            statusLabel={statusLabel}
            actions={actions}
            className={cn('pr-16 lg:pr-16', headerClassName)}
          />
        </div>

        <div className={cn('min-h-0 flex-1 overflow-hidden', bodyClassName)}>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface DetailDialogTabsListProps {
  tabs: DetailDialogTab[]
}

export function DetailDialogTabsList({ tabs }: DetailDialogTabsListProps) {
  return (
    <div className="shrink-0 overflow-x-auto overflow-y-hidden px-4 py-2">
      <TabsList className="flex h-9 w-full justify-start rounded-md bg-transparent p-0 gap-1">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="h-8 shrink-0 flex-1 min-w-[100px] md:min-w-[120px] rounded-md px-4 text-sm font-medium transition-all data-[state=active]:!bg-primary/10 data-[state=active]:!text-primary data-[state=active]:shadow-none hover:bg-muted/30"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )
}
