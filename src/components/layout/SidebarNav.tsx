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

  const baseActiveMenu = activeMenu.split('/')[0]
  const isItemActive = (itemId: string) => activeMenu === itemId || baseActiveMenu === itemId

  const activeGroup = visibleNavigationGroups.find((group) =>
    group.items.some((item) => isItemActive(item.id))
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
    <div
      className={cn(
        'custom-scrollbar sidebar-scrollbar hover-scroll flex-1 space-y-0.5 overflow-y-auto py-2',
        open ? 'px-2' : 'px-1.5'
      )}
    >
      {visibleNavigationGroups.map((group) => {
        const isGroupActive = group.items.some((item) => isItemActive(item.id))
        const groupExpanded = expandedGroupIds.includes(group.id)
        const singleMenuGroup = isSingleMenuGroup(group)

        return (
          <div
            key={group.id}
            className={cn('flex w-full flex-col', open ? '' : 'items-center')}
          >
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                'flex items-center rounded-md font-medium transition-all',
                isGroupActive
                  ? 'bg-accent/80 text-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                open
                  ? 'h-[34px] w-full justify-between px-2.5 py-1 text-xs'
                  : 'h-8 w-8 justify-center p-0'
              )}
              aria-expanded={!singleMenuGroup ? groupExpanded : undefined}
              title={!open ? group.label : ''}
              onClick={() => handleGroupClick(group)}
            >
              {open ? (
                <span className="flex min-w-0 flex-1 items-center gap-2.5 pr-1">
                  <group.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate text-left text-xs font-medium text-inherit">
                    {group.label}
                  </span>
                </span>
              ) : (
                <group.icon className="h-4 w-4 shrink-0" />
              )}

              {open && !singleMenuGroup ? (
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 text-muted-foreground/70 transition-transform',
                    groupExpanded ? '' : '-rotate-90'
                  )}
                />
              ) : null}
            </Button>

            {groupExpanded && open && !singleMenuGroup ? (
              <div className="mt-0.5 space-y-0.5 overflow-hidden py-0.5 pl-4">
                {group.items.map((item) => {
                  const active = isItemActive(item.id)
                  return (
                    <Button
                      key={item.id}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-[30px] w-full justify-start rounded-md px-2 text-left text-xs transition-all',
                        active
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground font-normal'
                      )}
                      title={item.label}
                      onClick={() => handleItemClick(item.id)}
                    >
                      <span className="truncate text-xs text-inherit">{item.label}</span>
                    </Button>
                  )
                })}
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
          isOpen ? 'w-60' : 'w-14 items-center'
        )}
      >
        {renderNavContent(isOpen)}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-x-0 bottom-0 top-11 z-40 md:hidden">
          <Button
            type="button"
            variant="ghost"
            aria-label="Close navigation"
            className="absolute inset-0 h-auto w-auto rounded-none bg-foreground/40 p-0 hover:bg-foreground/40"
            onClick={onMobileClose}
          />
          <aside className="relative flex h-full w-60 max-w-[85vw] flex-col bg-background shadow-lg">
            <div className="flex h-11 items-center justify-between border-b border-border px-3">
              <span className="text-xs font-semibold">Navigation</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close navigation"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={onMobileClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {renderNavContent(true)}
          </aside>
        </div>
      ) : null}
    </>
  )
}
