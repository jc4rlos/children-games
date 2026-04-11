import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { formatElapsed } from '@/features/sessions/data/schema'

type PortalCountdownProps = {
  checkIn: string
  scheduledCheckout: string | null
}

export const PortalCountdown = ({
  checkIn,
  scheduledCheckout,
}: PortalCountdownProps) => {
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
    const isWarning = !isOvertime && remainingSeconds < 300

    return (
      <div className='flex flex-col items-center gap-1'>
        <div
          className={cn(
            'font-mono text-6xl font-bold tracking-tight tabular-nums',
            isOvertime
              ? 'text-amber-500'
              : isWarning
                ? 'text-orange-500'
                : 'text-teal-600 dark:text-teal-400'
          )}
        >
          {isOvertime && <span className='text-4xl'>+</span>}
          {formatElapsed(displaySeconds)}
        </div>
        <p
          className={cn(
            'text-sm font-medium',
            isOvertime ? 'text-amber-500' : 'text-muted-foreground'
          )}
        >
          {isOvertime ? '⚠️ Tiempo extra' : 'tiempo restante'}
        </p>
      </div>
    )
  }

  // Fallback: elapsed
  const elapsed = Math.floor((now - new Date(checkIn).getTime()) / 1000)
  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='font-mono text-6xl font-bold tracking-tight text-teal-600 tabular-nums dark:text-teal-400'>
        {formatElapsed(elapsed)}
      </div>
      <p className='text-sm font-medium text-muted-foreground'>tiempo jugado</p>
    </div>
  )
}
