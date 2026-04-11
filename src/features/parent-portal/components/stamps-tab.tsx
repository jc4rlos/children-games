import { Gift, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type LoyaltyCard } from '@/features/loyalty/data/schema'

type StampsTabProps = {
  card: LoyaltyCard | null | undefined
  isLoading: boolean
}

export const StampsTab = ({ card, isLoading }: StampsTabProps) => {
  if (isLoading) {
    return (
      <div className='flex flex-col gap-4 p-4'>
        <div className='h-48 animate-pulse rounded-2xl bg-muted' />
        <div className='h-24 animate-pulse rounded-2xl bg-muted' />
      </div>
    )
  }

  if (!card) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
        <Star size={48} className='text-muted-foreground/30' />
        <p className='text-muted-foreground'>Aún no tienes tarjeta de sellos.</p>
        <p className='text-sm text-muted-foreground'>
          Se creará con tu primera sesión.
        </p>
      </div>
    )
  }

  const { stampsCount, stampsRequired, freeSessions, totalEarned } = card
  const stamps = Array.from({ length: stampsRequired }, (_, i) => i < stampsCount)
  const progress = Math.round((stampsCount / stampsRequired) * 100)

  return (
    <div className='flex flex-col gap-4 p-4'>
      {/* Progress card */}
      <div className='rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 p-5 text-white shadow-lg'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <p className='text-sm font-medium text-teal-100'>Progreso actual</p>
            <p className='text-3xl font-bold'>
              {stampsCount}
              <span className='text-xl font-normal text-teal-200'>
                {' '}
                / {stampsRequired} sellos
              </span>
            </p>
          </div>
          {freeSessions > 0 && (
            <div className='flex flex-col items-center rounded-xl bg-white/20 px-3 py-2 text-center'>
              <Gift size={20} className='mb-0.5' />
              <span className='text-xl font-bold'>{freeSessions}</span>
              <span className='text-xs text-teal-100'>gratis</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className='h-2.5 w-full overflow-hidden rounded-full bg-white/20'>
          <div
            className='h-full rounded-full bg-white transition-all duration-700'
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className='mt-1.5 text-right text-xs text-teal-100'>{progress}%</p>
      </div>

      {/* Stamps grid */}
      <div className='rounded-2xl border bg-card p-4 shadow-sm'>
        <p className='mb-3 text-sm font-medium text-muted-foreground'>
          Tarjeta de sellos
        </p>
        <div className='flex flex-wrap justify-center gap-2'>
          {stamps.map((filled, i) => (
            <div
              key={i}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                filled
                  ? 'border-teal-500 bg-teal-500 text-white shadow-md dark:border-teal-400 dark:bg-teal-400'
                  : 'border-dashed border-muted-foreground/25 bg-muted/30'
              )}
            >
              {filled && <Star size={16} fill='currentColor' />}
            </div>
          ))}
        </div>

        {stampsCount === stampsRequired - 1 && (
          <p className='mt-3 text-center text-sm font-medium text-teal-600 dark:text-teal-400'>
            ¡Un sello más y ganas una sesión gratis! 🎉
          </p>
        )}
      </div>

      {/* Stats */}
      {totalEarned > 0 && (
        <div className='rounded-2xl border bg-card p-4 shadow-sm'>
          <p className='text-sm font-medium text-muted-foreground'>Historial de premios</p>
          <p className='mt-1 text-2xl font-bold text-teal-600 dark:text-teal-400'>
            {totalEarned}
            <span className='ml-1 text-base font-normal text-muted-foreground'>
              sesión{totalEarned !== 1 ? 'es' : ''} gratis ganada{totalEarned !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
      )}

      {freeSessions > 0 && (
        <div className='rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950'>
          <div className='flex items-center gap-2'>
            <Gift size={20} className='text-amber-600 dark:text-amber-400' />
            <div>
              <p className='font-semibold text-amber-800 dark:text-amber-200'>
                {freeSessions === 1
                  ? '¡Tienes 1 sesión gratis disponible!'
                  : `¡Tienes ${freeSessions} sesiones gratis disponibles!`}
              </p>
              <p className='text-sm text-amber-700 dark:text-amber-300'>
                Pídele al personal que la active.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
