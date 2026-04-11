import { Clock, Gift, Tag, Timer } from 'lucide-react'
import type { ActiveSessionInfo } from '../data/parent-service'
import { PortalCountdown } from './portal-countdown'

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
  })

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
    value
  )

type SessionTabProps = {
  session: ActiveSessionInfo | null | undefined
  isLoading: boolean
}

export const SessionTab = ({ session, isLoading }: SessionTabProps) => {
  if (isLoading) {
    return (
      <div className='flex flex-col gap-4 p-4'>
        <div className='h-64 animate-pulse rounded-2xl bg-muted' />
        <div className='h-32 animate-pulse rounded-2xl bg-muted' />
      </div>
    )
  }

  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 py-16 text-center'>
        <Timer size={56} className='text-muted-foreground/30' />
        <p className='text-lg font-semibold text-muted-foreground'>
          No hay sesión activa
        </p>
        <p className='text-sm text-muted-foreground'>
          Cuando inicies una sesión de juego, aparecerá aquí.
        </p>
      </div>
    )
  }

  const scheduledMs = session.scheduledCheckout
    ? new Date(session.scheduledCheckout).getTime()
    : null
  const durationMinutes = scheduledMs
    ? Math.round((scheduledMs - new Date(session.checkIn).getTime()) / 60_000)
    : null
  const estimatedCost = session.isFreeSession
    ? 0
    : durationMinutes !== null
      ? Math.max(
          session.minimumCharge,
          (durationMinutes / 60) * session.pricePerHour
        )
      : null

  return (
    <div className='flex flex-col gap-4 p-4'>
      {/* Countdown card */}
      <div className='flex flex-col items-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 px-6 py-8 text-white shadow-lg'>
        <p className='mb-4 text-sm font-medium tracking-wider text-teal-100 uppercase'>
          {session.isFreeSession ? '🎁 Sesión Gratuita' : '🎮 Sesión en curso'}
        </p>
        <PortalCountdown
          checkIn={session.checkIn}
          scheduledCheckout={session.scheduledCheckout}
        />
      </div>

      {/* Session details */}
      <div className='rounded-2xl border bg-card p-4 shadow-sm'>
        <p className='mb-3 text-sm font-medium text-muted-foreground'>
          Detalles
        </p>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-muted-foreground'>
              <Clock size={16} />
              <span className='text-sm'>Entrada</span>
            </div>
            <span className='font-semibold'>{formatTime(session.checkIn)}</span>
          </div>

          {session.scheduledCheckout && (
            <>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Clock size={16} />
                  <span className='text-sm'>Salida programada</span>
                </div>
                <span className='font-semibold'>
                  {formatTime(session.scheduledCheckout)}
                </span>
              </div>

              {durationMinutes !== null && (
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-muted-foreground'>
                    <Timer size={16} />
                    <span className='text-sm'>Tiempo contratado</span>
                  </div>
                  <span className='font-semibold'>
                    {durationMinutes >= 60
                      ? `${durationMinutes / 60}h`
                      : `${durationMinutes} min`}
                  </span>
                </div>
              )}
            </>
          )}

          {session.couponCode && (
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-amber-600 dark:text-amber-400'>
                <Tag size={16} />
                <span className='text-sm'>Cupón aplicado</span>
              </div>
              <span className='font-mono font-semibold text-amber-600 dark:text-amber-400'>
                {session.couponCode}
              </span>
            </div>
          )}

          {session.isFreeSession ? (
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2 text-purple-600 dark:text-purple-400'>
                <Gift size={16} />
                <span className='text-sm'>Costo</span>
              </div>
              <span className='font-bold text-purple-600 dark:text-purple-400'>
                Gratis
              </span>
            </div>
          ) : (
            estimatedCost !== null && (
              <div className='flex items-center justify-between border-t pt-3'>
                <span className='text-sm font-medium'>Monto estimado</span>
                <span className='text-lg font-bold text-teal-600 dark:text-teal-400'>
                  {formatCurrency(estimatedCost)}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
