import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { formatElapsed } from '../data/schema'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
    value
  )

type SessionTimerProps = {
  checkIn: string
  scheduledCheckout?: string | null
  pricePerHour: number
  minimumCharge: number
  showCost?: boolean
}

export const SessionTimer = ({
  checkIn,
  scheduledCheckout,
  pricePerHour,
  minimumCharge,
  showCost = false,
}: SessionTimerProps) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (scheduledCheckout) {
    const scheduledMs = new Date(scheduledCheckout).getTime()
    const remainingSeconds = Math.floor((scheduledMs - now) / 1000)
    const isOvertime = remainingSeconds < 0
    const displaySeconds = Math.abs(remainingSeconds)

    const durationMinutes = Math.round(
      (scheduledMs - new Date(checkIn).getTime()) / 60_000
    )
    const hoursPlayed = durationMinutes / 60
    const cost = Math.max(minimumCharge, hoursPlayed * pricePerHour)

    return (
      <div className='flex flex-col gap-0.5'>
        <div className='flex items-center gap-1'>
          {isOvertime && (
            <span className='text-xs font-medium text-amber-500'>+</span>
          )}
          <span
            className={cn(
              'font-mono text-sm font-semibold tabular-nums',
              isOvertime
                ? 'text-amber-500 dark:text-amber-400'
                : remainingSeconds < 300
                  ? 'text-orange-500 dark:text-orange-400'
                  : 'text-teal-600 dark:text-teal-400'
            )}
          >
            {formatElapsed(displaySeconds)}
          </span>
        </div>
        {isOvertime && (
          <span className='text-xs font-medium text-amber-500'>
            tiempo extra
          </span>
        )}
        {!isOvertime && (
          <span className='text-xs text-muted-foreground'>restante</span>
        )}
        {showCost && (
          <span className='font-mono text-xs font-medium text-muted-foreground'>
            {formatCurrency(cost)}
          </span>
        )}
      </div>
    )
  }

  // Fallback: elapsed time (sessions without scheduled checkout)
  const elapsed = Math.floor((now - new Date(checkIn).getTime()) / 1000)
  const elapsedHours = elapsed / 3600
  const estimatedCost = Math.max(minimumCharge, elapsedHours * pricePerHour)

  return (
    <div className='flex flex-col gap-0.5'>
      <span className='font-mono text-sm text-foreground tabular-nums'>
        {formatElapsed(elapsed)}
      </span>
      {showCost && (
        <span className='font-mono text-xs font-medium text-teal-600 dark:text-teal-400'>
          {formatCurrency(estimatedCost)}
        </span>
      )}
    </div>
  )
}
