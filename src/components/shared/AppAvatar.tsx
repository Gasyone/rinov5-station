'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useUserProfileStore, type UserProfileType } from '@/stores/useUserProfileStore'

export interface AppAvatarProps {
  src?: string | null
  name?: string
  initials?: React.ReactNode
  alt?: string
  /**
   * Sizes:
   * - xs: 20px (h-5 w-5)
   * - sm: 28px (h-7 w-7)
   * - default: 32px (h-8 w-8)
   * - md: 36px (h-9 w-9)
   * - lg: 44px (h-11 w-11)
   * - xl: 56px (h-14 w-14)
   * - 2xl: 72px (h-18 w-18)
   */
  size?: 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl'
  /**
   * Shape: 'circle' (default, rounded-full) or 'square' (rounded-lg)
   */
  shape?: 'circle' | 'square'
  /**
   * For substitute teachers (amber dashed border)
   */
  isSubstitute?: boolean
  className?: string
  fallbackClassName?: string
  /**
   * Optional props to open user profile modal when clicked
   */
  userId?: string
  userType?: UserProfileType
}

export function AppAvatar({
  src,
  name,
  initials: initialsProp,
  alt = '',
  size = 'md',
  shape = 'circle',
  isSubstitute = false,
  className,
  fallbackClassName,
  userId,
  userType,
}: AppAvatarProps) {
  const openProfile = useUserProfileStore((s) => s.openProfile)
  const isInteractive = Boolean(userId && userType)

  const sizeClasses = {
    xs: 'size-5 text-[9px] border',
    sm: 'size-7 text-[10px] border',
    default: 'size-8 text-xs border',
    md: 'size-9 text-xs border',
    lg: 'size-11 text-sm border-2',
    xl: 'size-14 text-base border-2',
    '2xl': 'size-[72px] text-lg border-2',
  }

  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  }

  const initials = initialsProp || (name ? getInitials(name) : '?')

  const handleClick = (e: React.MouseEvent) => {
    if (isInteractive && userId && userType) {
      e.stopPropagation()
      e.preventDefault()
      openProfile(userId, userType)
    }
  }

  return (
    <Avatar
      onClick={isInteractive ? handleClick : undefined}
      className={cn(
        'shrink-0 select-none bg-muted flex items-center justify-center overflow-hidden border-border',
        sizeClasses[size],
        shapeClasses[shape],
        isSubstitute && 'border-dashed border-amber-500 bg-amber-50 text-amber-600 dark:bg-amber-950/20',
        isInteractive && 'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all duration-200',
        className
      )}
    >
      {src && (
        <AvatarImage
          src={src}
          alt={alt || name || ''}
          className={cn('aspect-square size-full object-cover', shapeClasses[shape])}
        />
      )}
      <AvatarFallback
        className={cn(
          'flex h-full w-full items-center justify-center font-bold',
          shapeClasses[shape],
          isSubstitute
            ? 'bg-transparent text-amber-600'
            : 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary',
          fallbackClassName
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
