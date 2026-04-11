import { Skeleton } from '@boilerplate/ui'
import { Star } from 'lucide-react'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import type { TopChild } from '../data/dashboard-service'

type TopChildrenProps = {
  data: TopChild[]
  isLoading: boolean
}

export const TopChildren = ({ data, isLoading }: TopChildrenProps) => (
  <div className='flex flex-col rounded-xl border bg-card shadow-sm'>
    <div className='flex items-center gap-2 border-b px-4 py-3'>
      <Star size={16} className='text-amber-500' />
      <h3 className='font-semibold'>Top niños del mes</h3>
    </div>

    <div className='divide-y'>
      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='flex items-center gap-3 px-4 py-3'>
            <Skeleton className='h-8 w-8 shrink-0 rounded-full' />
            <Skeleton className='h-3.5 flex-1' />
            <Skeleton className='h-5 w-10 rounded-full' />
          </div>
        ))
      ) : data.length === 0 ? (
        <p className='py-8 text-center text-sm text-muted-foreground'>
          Sin sesiones este mes.
        </p>
      ) : (
        data.map((child, index) => {
          const avatar =
            child.childAvatar ??
            getAvatarUrl(child.childCode, child.childGender)
          return (
            <div
              key={child.childId}
              className='flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/40'
            >
              <span className='w-4 shrink-0 text-center text-xs font-bold text-muted-foreground'>
                {index + 1}
              </span>
              <img
                src={avatar}
                alt={child.childName}
                className='h-8 w-8 shrink-0 rounded-full object-cover'
              />
              <p className='min-w-0 flex-1 truncate text-sm font-medium'>
                {child.childName}
              </p>
              <span className='shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'>
                {child.sessionCount}{' '}
                {child.sessionCount === 1 ? 'sesión' : 'sesiones'}
              </span>
            </div>
          )
        })
      )}
    </div>
  </div>
)
