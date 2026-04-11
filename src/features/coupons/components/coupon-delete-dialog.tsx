import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Coupon } from '../data/schema'
import { useDeleteCoupon } from '../hooks/use-coupons'

type CouponDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon: Coupon
}

export const CouponDeleteDialog = ({
  open,
  onOpenChange,
  coupon,
}: CouponDeleteDialogProps) => {
  const deleteMutation = useDeleteCoupon()

  const handleDelete = () => {
    deleteMutation.mutate(coupon.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={deleteMutation.isPending}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />
          Eliminar Cupón
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar el cupón{' '}
            <span className='font-mono font-bold'>{coupon.code}</span>? Esta
            acción no se puede deshacer.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              Ten cuidado, esta operación no se puede revertir.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
      destructive
    />
  )
}
