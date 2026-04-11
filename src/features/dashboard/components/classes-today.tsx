import { Skeleton } from '@boilerplate/ui'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type ClassTodayRow } from '../data/dashboard-service'

type ClassesTodayProps = {
  data: ClassTodayRow[]
  isLoading: boolean
}

export const ClassesToday = ({ data, isLoading }: ClassesTodayProps) => (
  <div className='flex flex-col rounded-xl border bg-card shadow-sm'>
    <div className='flex items-center gap-2 border-b px-4 py-3'>
      <BookOpen size={16} className='text-teal-600' />
      <h3 className='font-semibold'>Clases de hoy</h3>
      {!isLoading && (
        <span className='ml-auto rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'>
          {data.length}
        </span>
      )}
    </div>

    <div className='divide-y'>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='space-y-1.5 px-4 py-3'>
            <Skeleton className='h-3.5 w-40' />
            <Skeleton className='h-3 w-24' />
          </div>
        ))
      ) : data.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-muted-foreground'>
          <BookOpen size={30} className='mb-2 opacity-20' />
          <p className='text-sm'>No hay clases programadas hoy</p>
        </div>
      ) : (
        data.map((cls) => {
          const isFull = cls.enrolledCount >= cls.capacity
          const pct = Math.round((cls.enrolledCount / cls.capacity) * 100)
          return (
            <div key={cls.id} className='px-4 py-3'>
              <div className='flex items-start justify-between gap-2'>
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>{cls.name}</p>
                  <p className='text-xs text-muted-foreground'>
                    {cls.startTime} - {cls.endTime}
                    {cls.teacherName && ` · ${cls.teacherName}`}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold',
                    isFull
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {cls.enrolledCount}/{cls.capacity}
                </span>
              </div>
              <div className='mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    isFull ? 'bg-red-500' : 'bg-teal-500'
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })
      )}
    </div>
  </div>
)
