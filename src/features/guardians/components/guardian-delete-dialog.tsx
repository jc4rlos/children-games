import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Guardian } from '../data/schema'
import { useDeleteGuardian } from '../hooks/use-guardians'

type GuardianDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  guardian: Guardian
}

export const GuardianDeleteDialog = ({
  open,
  onOpenChange,
  guardian,
}: GuardianDeleteDialogProps) => {
  const deleteMutation = useDeleteGuardian()

  const handleDelete = () => {
    deleteMutation.mutate(guardian.id, {
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
          Eliminar Apoderado
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar a{' '}
            <span className='font-bold'>{guardian.fullName}</span>? Esta acción
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
