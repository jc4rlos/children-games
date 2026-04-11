import { useState } from 'react'
import { ChevronLeft, ChevronRight, Gift, History } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatElapsed } from '@/features/sessions/data/schema'
import { usePortalHistory } from '../hooks/use-parent-portal'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)

type HistoryTabProps = {
  childId: number
}

const PAGE_SIZE = 8

export const HistoryTab = ({ childId }: HistoryTabProps) => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = usePortalHistory(childId, page)

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3 p-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='h-20 animate-pulse rounded-2xl bg-muted' />
        ))}
      </div>
    )
  }

  const sessions = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (sessions.length === 0 && page === 1) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
        <History size={56} className='text-muted-foreground/30' />
        <p className='text-lg font-semibold text-muted-foreground'>Sin historial</p>
        <p className='text-sm text-muted-foreground'>
          Las sesiones completadas aparecerán aquí.
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3 p-4'>
      <p className='text-sm text-muted-foreground'>
        {total} sesión{total !== 1 ? 'es' : ''} registrada{total !== 1 ? 's' : ''}
      </p>

      {sessions.map((s) => (
        <div
          key={s.id}
          className='flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm'
        >
          {s.isFreeSession ? (
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'>
              <Gift size={18} />
            </div>
          ) : (
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300'>
              <span className='text-lg'>🎮</span>
            </div>
          )}

          <div className='min-w-0 flex-1'>
            <p className='font-semibold'>{formatDate(s.checkIn)}</p>
            <p className='text-sm text-muted-foreground'>
              {formatTime(s.checkIn)}
              {s.checkOut ? ` → ${formatTime(s.checkOut)}` : ''}
              {s.minutesPlayed != null
                ? ` · ${formatElapsed(s.minutesPlayed * 60)}`
                : ''}
            </p>
          </div>

          <div className='text-right'>
            {s.isFreeSession ? (
              <span className='text-sm font-bold text-purple-600 dark:text-purple-400'>
                Gratis
              </span>
            ) : s.totalAmount != null ? (
              <span className='font-bold text-teal-700 dark:text-teal-300'>
                {formatCurrency(s.totalAmount)}
              </span>
            ) : null}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-3 pt-2'>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border',
              page === 1
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-accent'
            )}
          >
            <ChevronLeft size={16} />
          </button>
          <span className='text-sm text-muted-foreground'>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border',
              page === totalPages
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-accent'
            )}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
