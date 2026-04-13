import { ChevronLeft, ChevronRight, BookOpen, Check, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useChildAttendance } from '../hooks/use-parent-portal'

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

type AttendanceTabProps = {
  childId: number
}

const PAGE_SIZE = 8

export const AttendanceTab = ({ childId }: AttendanceTabProps) => {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useChildAttendance(childId, page)

  if (isLoading) {
    return (
      <div className='flex flex-col gap-3 p-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='h-20 animate-pulse rounded-2xl bg-muted' />
        ))}
      </div>
    )
  }

  const attendances = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  if (attendances.length === 0 && page === 1) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
        <BookOpen size={56} className='text-muted-foreground/30' />
        <p className='text-lg font-semibold text-muted-foreground'>
          Sin asistencias registradas
        </p>
        <p className='text-sm text-muted-foreground'>
          Las asistencias a clases aparecerán aquí.
        </p>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3 p-4'>
      <p className='text-sm text-muted-foreground'>
        {total} asistencia{total !== 1 ? 's' : ''} registrada
        {total !== 1 ? 's' : ''}
      </p>

      {attendances.map((a, idx) => (
        <div
          key={idx}
          className='flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-sm'
        >
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              a.attended
                ? 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {a.attended ? <Check size={18} /> : <X size={18} />}
          </div>

          <div className='min-w-0 flex-1'>
            <p className='font-semibold'>{formatDate(a.classDate)}</p>
            <p className='text-sm text-muted-foreground'>{a.className}</p>
          </div>

          <div
            className={cn(
              'shrink-0 rounded-full px-2 py-1 text-xs font-semibold',
              a.attended
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {a.attended ? '✓ Asistió' : '✗ Faltó'}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-3 pt-2'>
          <button
            type='button'
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full border',
              page === 1 ? 'cursor-not-allowed opacity-40' : 'hover:bg-accent'
            )}
          >
            <ChevronLeft size={16} />
          </button>
          <span className='text-sm text-muted-foreground'>
            {page} / {totalPages}
          </span>
          <button
            type='button'
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
