import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { PricingConfig } from '../data/schema'
import { useDeletePricingConfig } from '../hooks/use-pricing'

type PricingDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  config: PricingConfig
}

export const PricingDeleteDialog = ({
  open,
  onOpenChange,
  config,
}: PricingDeleteDialogProps) => {
  const deleteMutation = useDeletePricingConfig()

  const handleDelete = () => {
    deleteMutation.mutate(config.id, {
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
          Eliminar Configuración
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar la configuración de{' '}
            <span className='font-bold'>{config.branchName}</span>? Esta acción
            no se puede deshacer.
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
