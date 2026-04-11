import { Skeleton } from '@boilerplate/ui'
import { PlayCircle } from 'lucide-react'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import { SessionTimer } from '@/features/sessions/components/session-timer'
import type { ActiveSessionRow } from '../data/dashboard-service'

type ActiveSessionsListProps = {
  data: ActiveSessionRow[]
  isLoading: boolean
}

export const ActiveSessionsList = ({
  data,
  isLoading,
}: ActiveSessionsListProps) => (
  <div className='flex flex-col rounded-xl border bg-card shadow-sm'>
    <div className='flex items-center gap-2 border-b px-4 py-3'>
      <PlayCircle size={16} className='text-teal-600' />
      <h3 className='font-semibold'>Sesiones activas</h3>
      {!isLoading && (
        <span className='ml-auto rounded-full bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-700 dark:bg-teal-900/50 dark:text-teal-300'>
          {data.length}
        </span>
      )}
    </div>

    <div className='flex-1 overflow-y-auto'>
      {isLoading ? (
        <div className='space-y-0 divide-y'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='flex items-center gap-3 px-4 py-3'>
              <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
              <div className='flex-1 space-y-1.5'>
                <Skeleton className='h-3.5 w-32' />
                <Skeleton className='h-3 w-20' />
              </div>
              <Skeleton className='h-8 w-20' />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
          <PlayCircle size={36} className='mb-2 opacity-20' />
          <p className='text-sm'>No hay sesiones activas</p>
        </div>
      ) : (
        <div className='divide-y'>
          {data.map((session) => {
            const avatar =
              session.childAvatar ??
              getAvatarUrl(session.childCode, session.childGender)
            const checkInTime = new Date(session.checkIn).toLocaleTimeString(
              'es-PE',
              {
                hour: '2-digit',
                minute: '2-digit',
              }
            )

            return (
              <div
                key={session.id}
                className='flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40'
              >
                <img
                  src={avatar}
                  alt={session.childName}
                  className='h-10 w-10 shrink-0 rounded-full object-cover'
                />
                <div className='min-w-0 flex-1'>
                  <p className='truncate leading-tight font-medium'>
                    {session.childName}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    Entrada: {checkInTime}
                  </p>
                </div>
                <SessionTimer
                  checkIn={session.checkIn}
                  scheduledCheckout={session.scheduledCheckout}
                  pricePerHour={session.pricePerHour}
                  minimumCharge={session.minimumCharge}
                  showCost
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  </div>
)
