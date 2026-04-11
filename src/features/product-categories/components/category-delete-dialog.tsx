import { Alert, AlertDescription, AlertTitle } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { ProductCategory } from '../data/schema'
import { useDeleteCategory } from '../hooks/use-categories'

type CategoryDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: ProductCategory
}

export const CategoryDeleteDialog = ({
  open,
  onOpenChange,
  category,
}: CategoryDeleteDialogProps) => {
  const deleteMutation = useDeleteCategory()

  const handleDelete = () => {
    deleteMutation.mutate(category.id, {
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
          Eliminar Categoría
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p>
            ¿Estás seguro de que deseas eliminar{' '}
            <span className='font-bold'>{category.name}</span>? Esta acción no
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
