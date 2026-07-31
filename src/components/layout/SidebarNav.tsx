'use client'

import { useCallback, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import type { NavigationGroup } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarNavProps {
  navigationGroups: NavigationGroup[]
  activeMenu: string
  isOpen: boolean
  mobileOpen: boolean
  onNavigate: (menuId: string) => void
  onOpen: () => void
  onMobileClose: () => void
}

export function SidebarNav({
  navigationGroups,
  activeMenu,
  isOpen,
  mobileOpen,
  onNavigate,
  onOpen,
  onMobileClose,
}: SidebarNavProps) {
  const visibleNavigationGroups = navigationGroups
    .filter((group) => !group.hiddenInSidebar)
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.hiddenInSidebar),
    }))
    .filter((group) => group.items.length > 0)

  const activeGroup = visibleNavigationGroups.find((group) =>
    group.items.some((item) => item.id === activeMenu)
  )

  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    if (activeGroup) return [activeGroup.id]
    return visibleNavigationGroups[0] ? [visibleNavigationGroups[0].id] : []
  })

  const expandedGroupIds =
    activeGroup && !expandedGroups.includes(activeGroup.id)
      ? [...expandedGroups, activeGroup.id]
      : expandedGroups

  const handleGroupClick = useCallback(
    (group: NavigationGroup) => {
      if (!isOpen && !mobileOpen) {
        onOpen()
        setExpandedGroups((prev) => (prev.includes(group.id) ? prev : [...prev, group.id]))
        return
      }

      if (group.items.length === 1) {
        onNavigate(group.items[0].id)
        onMobileClose()
        return
      }

      setExpandedGroups((prev) =>
        prev.includes(group.id) ? prev.filter((id) => id !== group.id) : [...prev, group.id]
      )
    },
    [isOpen, mobileOpen, onMobileClose, onNavigate, onOpen]
  )

  const handleItemClick = useCallback(
    (itemId: string) => {
      onNavigate(itemId)
      onMobileClose()
    },
    [onMobileClose, onNavigate]
  )

  const isSingleMenuGroup = (group: NavigationGroup) => group.items.length === 1

  const renderNavContent = (open: boolean) => (
    <div className="custom-scrollbar sidebar-scrollbar hover-scroll flex-1 space-y-2 overflow-y-auto py-4">
      {visibleNavigationGroups.map((group) => {
        const isGroupActive = group.items.some((item) => item.id === activeMenu)
        const groupExpanded = expandedGroupIds.includes(group.id)
        const singleMenuGroup = isSingleMenuGroup(group)

        return (
          <div
            key={group.id}
            className={cn('flex w-full flex-col', open ? 'px-3' : 'items-center')}
          >
            <Button
              type="button"
              variant="ghost"
              className={cn(
                'flex items-center rounded-xl transition-all',
                isGroupActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                open ? 'w-full justify-between px-3 py-2.5' : 'h-11 w-11 justify-center p-0'
              )}
              aria-expanded={!singleMenuGroup ? groupExpanded : undefined}
              title={!open ? group.label : ''}
              onClick={() => handleGroupClick(group)}
            >
              {open ? (
                <span className="flex min-w-0 flex-1 items-center gap-3 pr-2">
                  <group.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 truncate text-left text-inherit text-sm">
                    {group.label}
                  </span>
                </span>
              ) : (
                <group.icon className="h-5 w-5 flex-shrink-0" />
              )}

              {open && !singleMenuGroup ? (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 flex-shrink-0 transition-transform',
                    groupExpanded ? '' : '-rotate-90'
                  )}
                />
              ) : null}
            </Button>

            {groupExpanded && open && !singleMenuGroup ? (
              <div className="mt-1 space-y-1 overflow-hidden py-1 pl-5 pr-1">
                {group.items.map((item) => (
                  <Button
                    key={item.id}
                    type="button"
                    variant="ghost"
                    className={cn(
                      'block w-full truncate rounded-lg px-4 py-2 text-left text-sm transition-all',
                      activeMenu === item.id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                    )}
                    title={item.label}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <span className="text-[13px] text-inherit">{item.label}</span>
                  </Button>
                ))}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <aside
        onMouseEnter={() => {
          if (!isOpen) onOpen()
        }}
        className={cn(
          'hidden h-full min-h-0 flex-shrink-0 flex-col transition-all duration-300 md:flex',
          isOpen ? 'w-72' : 'w-[72px] items-center'
        )}
      >
        {renderNavContent(isOpen)}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 md:hidden">
          <Button
            type="button"
            variant="ghost"
            aria-label="Close navigation"
            className="absolute inset-0 h-auto w-auto rounded-none bg-foreground/40 p-0 hover:bg-foreground/40"
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col border-r border-border bg-background shadow-lg">
            <div className="flex h-12 items-center justify-between border-b border-border px-4">
              <span className="text-sm font-semibold">Navigation</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onMobileClose}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {renderNavContent(true)}
          </aside>
        </div>
      ) : null}
    </>
  )
}
