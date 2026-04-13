import { cn } from '@/lib/utils'

type CircularProgressProps = {
  checkIn: string
  scheduledCheckout: string | null
}

export function CircularProgress({
  checkIn,
  scheduledCheckout,
}: CircularProgressProps) {
  if (!scheduledCheckout) return null

  const total =
    new Date(scheduledCheckout).getTime() - new Date(checkIn).getTime()
  const elapsed = Date.now() - new Date(checkIn).getTime()
  const pct = Math.min(Math.round((elapsed / total) * 100), 100)
  const remaining = Math.max(0, Math.round((total - elapsed) / 60000))
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (pct / 100) * circumference

  const isUrgent = pct >= 80
  const color = isUrgent ? 'text-red-500' : 'text-teal-500'
  const bgColor = isUrgent
    ? 'bg-red-50 dark:bg-red-950/30'
    : 'bg-teal-50 dark:bg-teal-950/30'

  return (
    <div className='flex items-center gap-2'>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full p-0.5',
          bgColor
        )}
      >
        <svg className='h-10 w-10 -rotate-90' viewBox='0 0 36 36'>
          <title>Progreso de la sesión</title>
          <circle
            cx='18'
            cy='18'
            r={radius}
            fill='none'
            className='stroke-muted'
            strokeWidth='3'
          />
          <circle
            cx='18'
            cy='18'
            r={radius}
            fill='none'
            className={cn(
              'stroke-current transition-[stroke-dashoffset] duration-1000',
              color
            )}
            strokeWidth='3'
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap='round'
          />
        </svg>
        <span
          className={cn('absolute text-[9px] font-bold tabular-nums', color)}
        >
          {pct}%
        </span>
      </div>
      <span
        className={cn(
          'text-xs font-medium tabular-nums',
          isUrgent ? 'text-red-500' : 'text-muted-foreground',
          remaining > 0 ? 'text-green-500' : 'text-red-500'
        )}
      >
        {remaining > 0 ? 'Activo' : 'Vencido'}
      </span>
    </div>
  )
}
