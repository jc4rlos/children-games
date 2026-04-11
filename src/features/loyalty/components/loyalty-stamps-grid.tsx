import { Star, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type LoyaltyCard } from '../data/schema'

type LoyaltyStampsGridProps = {
  card: LoyaltyCard
  className?: string
}

export const LoyaltyStampsGrid = ({
  card,
  className,
}: LoyaltyStampsGridProps) => {
  const { stampsCount, stampsRequired, freeSessions, totalEarned } = card
  const stamps = Array.from(
    { length: stampsRequired },
    (_, i) => i < stampsCount
  )

  return (
    <div className={cn('rounded-lg border bg-muted/30 p-3', className)}>
      <div className='mb-2 flex items-center justify-between'>
        <span className='text-sm font-medium'>Tarjeta de sellos</span>
        <div className='flex items-center gap-2'>
          {freeSessions > 0 && (
            <span className='flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300'>
              <Gift size={11} />
              {freeSessions} gratis
            </span>
          )}
          <span className='text-xs text-muted-foreground'>
            {stampsCount}/{stampsRequired} sellos
          </span>
        </div>
      </div>

      <div className='flex flex-wrap gap-1.5'>
        {stamps.map((filled, i) => (
          <div
            key={i}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors',
              filled
                ? 'border-teal-500 bg-teal-500 text-white dark:border-teal-400 dark:bg-teal-400'
                : 'border-dashed border-muted-foreground/30 bg-transparent'
            )}
          >
            {filled && <Star size={12} fill='currentColor' />}
          </div>
        ))}
      </div>

      {totalEarned > 0 && (
        <p className='mt-2 text-xs text-muted-foreground'>
          {totalEarned} sesión{totalEarned !== 1 ? 'es' : ''} gratis ganada
          {totalEarned !== 1 ? 's' : ''} en total
        </p>
      )}
    </div>
  )
}
