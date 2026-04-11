import { useState } from 'react'
import { cn } from '@/lib/utils'
import { getAvatarUrl, INITIALS_COLORS } from '../data/avatar-utils'
import { type Child } from '../data/schema'

const getInitials = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()

type ChildAvatarProps = {
  child: Child
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
}

export const ChildAvatar = ({
  child,
  size = 'md',
  className,
}: ChildAvatarProps) => {
  const [imgError, setImgError] = useState(false)
  const sizeClass = SIZE_CLASSES[size]
  const colorClass = INITIALS_COLORS[child.gender]
  const src = child.avatar ?? getAvatarUrl(child.code, child.gender)

  if (imgError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold',
          sizeClass,
          colorClass,
          className
        )}
      >
        {getInitials(child.fullName)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={child.fullName}
      className={cn('rounded-full object-cover', sizeClass, className)}
      onError={() => setImgError(true)}
    />
  )
}
