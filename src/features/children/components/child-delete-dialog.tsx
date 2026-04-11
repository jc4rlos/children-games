import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Child } from '../data/schema'
import { useDeleteChild } from '../hooks/use-children'

type ChildDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  child: Child
}

export const ChildDeleteDialog = ({
  open,
  onOpenChange,
  child,
}: ChildDeleteDialogProps) => {
  const deleteMutation = useDeleteChild()

  const handleDelete = () => {
    deleteMutation.mutate(child.id, {
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
          Eliminar Niño
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar a{' '}
            <span className='font-bold'>{child.fullName}</span>? Esta acción no
            se puede deshacer.
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
