import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { StimulationClass } from '../data/schema'
import { useDeleteClass } from '../hooks/use-classes'

type ClassDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  cls: StimulationClass
  enrolledCount: number
}

export const ClassDeleteDialog = ({
  open,
  onOpenChange,
  cls,
  enrolledCount,
}: ClassDeleteDialogProps) => {
  const deleteMutation = useDeleteClass()

  const handleDelete = () => {
    deleteMutation.mutate(cls.id, {
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
          Eliminar Clase
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar{' '}
            <span className='font-bold'>{cls.name}</span>? Esta acción no se
            puede deshacer.
          </p>
          <Alert variant='destructive'>
            <AlertTitle>¡Advertencia!</AlertTitle>
            <AlertDescription>
              {enrolledCount > 0
                ? `Esta clase tiene ${enrolledCount} alumno${enrolledCount !== 1 ? 's' : ''} inscrito${enrolledCount !== 1 ? 's' : ''}. Se eliminarán las inscripciones y asistencias asociadas.`
                : 'Esta operación no se puede revertir.'}
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
      destructive
    />
  )
}
