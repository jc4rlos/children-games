import { useEffect, useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle, Star } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { getAvatarUrl } from '@/features/children/data/avatar-utils'
import { useLoyaltyCard } from '@/features/loyalty/hooks/use-loyalty'
import { LoyaltyStampsGrid } from '@/features/loyalty/components/loyalty-stamps-grid'
import { formatElapsed, type PlaySession } from '../data/schema'
import { useCloseSession } from '../hooks/use-sessions'
import { SessionTimer } from './session-timer'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)

type SessionCloseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: PlaySession
}

export const SessionCloseDialog = ({
  open,
  onOpenChange,
  session,
}: SessionCloseDialogProps) => {
  const closeMutation = useCloseSession()
  const { data: loyaltyCard } = useLoyaltyCard(session.childId)
  const [elapsed, setElapsed] = useState(() =>
    Math.floor((Date.now() - new Date(session.checkIn).getTime()) / 1000)
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - new Date(session.checkIn).getTime()) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [session.checkIn])

  const handleClose = () => {
    closeMutation.mutate(session, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const avatarSrc =
    session.childAvatar ?? getAvatarUrl(session.childCode, session.childGender)

  const hoursPlayed = elapsed / 3600
  const estimatedCost = Math.max(
    session.minimumCharge,
    hoursPlayed * session.pricePerHour
  )

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleClose}
      disabled={closeMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />
          Cerrar Sesión
        </span>
      }
      desc={
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <img
              src={avatarSrc}
              alt={session.childName}
              className='h-12 w-12 rounded-full object-cover'
            />
            <div>
              <p className='font-semibold'>{session.childName}</p>
              <p className='text-sm text-muted-foreground'>
                Ingreso: {new Date(session.checkIn).toLocaleTimeString('es-PE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className='rounded-lg border p-3 text-sm'>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>Tiempo jugado</span>
              <span className='font-mono font-medium'>
                {formatElapsed(elapsed)}
              </span>
            </div>
            <div className='flex justify-between py-1'>
              <span className='text-muted-foreground'>Subtotal juego</span>
              <span className='font-mono'>{formatCurrency(estimatedCost)}</span>
            </div>
            {(session.productsSubtotal ?? 0) > 0 && (
              <div className='flex justify-between py-1'>
                <span className='text-muted-foreground'>Consumos</span>
                <span className='font-mono'>
                  {formatCurrency(session.productsSubtotal ?? 0)}
                </span>
              </div>
            )}
            {(session.discountAmount ?? 0) > 0 && (
              <div className='flex justify-between py-1 text-teal-600 dark:text-teal-400'>
                <span>Descuento ({session.couponCode})</span>
                <span className='font-mono'>
                  -{formatCurrency(session.discountAmount ?? 0)}
                </span>
              </div>
            )}
            <div className='mt-1 flex justify-between border-t pt-2 font-semibold'>
              <span>Total estimado</span>
              <span className='font-mono'>
                {formatCurrency(
                  Math.max(
                    0,
                    estimatedCost +
                      (session.productsSubtotal ?? 0) -
                      (session.discountAmount ?? 0)
                  )
                )}
              </span>
            </div>
          </div>

          {loyaltyCard && !session.isFreeSession && (
            <div className='space-y-1'>
              <LoyaltyStampsGrid card={loyaltyCard} />
              <p className='flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400'>
                <Star size={11} fill='currentColor' />
                Al cerrar se agregará 1 sello
                {loyaltyCard.stampsCount + 1 >= loyaltyCard.stampsRequired
                  ? ' ¡y ganará 1 sesión gratis!'
                  : ` (${loyaltyCard.stampsCount + 1}/${loyaltyCard.stampsRequired}).`}
              </p>
            </div>
          )}

          <Alert variant='destructive'>
            <AlertTitle>¡Atención!</AlertTitle>
            <AlertDescription>
              Esta acción cerrará la sesión. No se puede revertir.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={closeMutation.isPending ? 'Cerrando...' : 'Cerrar Sesión'}
      destructive
    />
  )
}

export { SessionTimer }
