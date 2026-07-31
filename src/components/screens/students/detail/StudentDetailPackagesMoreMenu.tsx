'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { StudentPackage } from './studentDetailTypes'

interface StudentDetailPackagesMoreMenuProps {
  packages: StudentPackage[]
  selectedPackageId: string
  onSelectPackage: (packageId: string) => void
  renderPackageIcon: (pkg: StudentPackage) => ReactNode
}

export function StudentDetailPackagesMoreMenu({
  packages,
  selectedPackageId,
  onSelectPackage,
  renderPackageIcon,
}: StudentDetailPackagesMoreMenuProps) {
  const [open, setOpen] = useState(false)
  const hasSelectedPackage = packages.some((pkg) => pkg.id === selectedPackageId)
  const triggerActive = open || hasSelectedPackage

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Xem thêm gói học"
          className={cn(
            'flex h-9 min-w-[122px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[10px] border-[1.5px] px-4 text-[13px] font-bold shadow-xs transition-colors',
            triggerActive
              ? 'border-[#1ea7c9] bg-[#1ea7c9] text-white hover:bg-[#198cad]'
              : 'border-[#d8e2e5] bg-background text-muted-foreground hover:border-[#b8c9ce] hover:bg-muted/40 hover:text-foreground'
          )}
        >
          <span>Xem thêm</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              open ? 'rotate-180 opacity-90' : 'opacity-70'
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[360px] max-w-[calc(100vw-48px)] rounded-[18px] border-[#d8e2e5] bg-background p-2 shadow-[0_12px_26px_rgba(15,23,42,0.16)]"
      >
        {packages.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id

          return (
            <DropdownMenuItem
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={cn(
                'flex h-12 cursor-pointer items-center gap-3 rounded-[12px] px-3 text-sm font-bold outline-none transition-colors focus:bg-[#e5f4f8]',
                isSelected
                  ? 'bg-[#e5f4f8] text-[#1e9ec1]'
                  : 'text-foreground hover:bg-muted/70'
              )}
            >
              {renderPackageIcon(pkg)}
              <span className="min-w-0 flex-1 truncate">{pkg.packageName}</span>
              {pkg.remainingSessions === 0 && (
                <span className="shrink-0 text-xs font-medium text-muted-foreground">(Hết)</span>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
