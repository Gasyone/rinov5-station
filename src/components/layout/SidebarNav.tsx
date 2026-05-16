'use client'

import { useCallback, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { NavigationGroup } from '@/config/navigation'
import { cn } from '@/lib/utils'

interface SidebarNavProps {
  navigationGroups: NavigationGroup[]
  activeMenu: string
  isOpen: boolean
  onNavigate: (menuId: string) => void
  onToggle: () => void
}

export function SidebarNav({ navigationGroups, activeMenu, isOpen, onNavigate, onToggle }: SidebarNavProps) {
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

  // Default-expand the group containing the active route. Fall back to the
  // first group so the sidebar is never fully collapsed on first paint.
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    if (activeGroup) return [activeGroup.id]
    return visibleNavigationGroups[0] ? [visibleNavigationGroups[0].id] : []
  })

  const expandedGroupIds =
    activeGroup && !expandedGroups.includes(activeGroup.id)
      ? [...expandedGroups, activeGroup.id]
      : expandedGroups

  const handleGroupClick = useCallback(
    (groupId: string, firstItemId: string) => {
      if (!isOpen) {
        onToggle()
      }
      setExpandedGroups((prev) =>
        prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
      )
      onNavigate(firstItemId)
    },
    [isOpen, onToggle, onNavigate]
  )

  const handleItemClick = useCallback(
    (itemId: string) => {
      onNavigate(itemId)
    },
    [onNavigate]
  )

  const isSingleMenuGroup = (group: NavigationGroup) => group.items.length === 1

  return (
    <aside
      className={cn(
        'hidden h-full min-h-0 flex-shrink-0 flex-col transition-all duration-300 md:flex',
        isOpen ? 'w-72' : 'w-[72px] items-center'
      )}
    >
      <div className="custom-scrollbar hover-scroll flex-1 space-y-2 overflow-y-auto py-4">
        {visibleNavigationGroups.map((group) => (
          <div
            key={group.id}
            className={cn('flex w-full flex-col', isOpen ? 'px-3' : 'items-center')}
          >
            <button
              type="button"
              className={cn(
                'flex items-center rounded-xl transition-all',
                group.items.some((item) => item.id === activeMenu)
                  ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50',
                isOpen ? 'w-full justify-between px-3 py-2.5' : 'h-11 w-11 justify-center p-0'
              )}
              title={!isOpen ? group.label : ''}
              onClick={() => handleGroupClick(group.id, group.items[0].id)}
            >
              {isOpen ? (
                <div className="flex min-w-0 flex-1 items-center gap-3 pr-2">
                  <group.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1 truncate text-left text-inherit text-sm">
                    {group.label}
                  </span>
                </div>
              ) : (
                <group.icon className="h-5 w-5 flex-shrink-0" />
              )}

              {isOpen && !isSingleMenuGroup(group) && (
                <ChevronDown
                  className={cn(
                    'h-4 w-4 flex-shrink-0 transition-transform',
                    expandedGroupIds.includes(group.id) ? '' : '-rotate-90'
                  )}
                />
              )}
            </button>

            {expandedGroupIds.includes(group.id) && isOpen && !isSingleMenuGroup(group) && (
              <div className="ml-2 mt-1 space-y-1 overflow-hidden border-l-2 border-slate-200 py-1 pl-5 pr-1 dark:border-slate-700">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={cn(
                      'block w-full truncate rounded-lg px-4 py-2 text-left text-sm transition-all',
                      activeMenu === item.id
                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                        : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                    )}
                    title={item.label}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <span className="text-[13px] text-inherit">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
