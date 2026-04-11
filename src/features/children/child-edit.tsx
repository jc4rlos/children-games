import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ChildForm } from './components/child-form'
import { type ChildFormValues } from './data/schema'
import { useChild, useUpdateChild } from './hooks/use-children'

const route = getRouteApi('/_authenticated/children/$childId/edit')

export const ChildEdit = () => {
  const { childId } = route.useParams()
  const id = Number(childId)
  const navigate = useNavigate()
  const updateMutation = useUpdateChild()

  const { data: child, isLoading, isError } = useChild(id)

  const handleSubmit = (values: ChildFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/children' }) }
    )
  }

  const handleCancel = () => navigate({ to: '/children' })

  return (
    <Main className='flex flex-1 flex-col gap-6'>
      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          onClick={handleCancel}
          aria-label='Volver'
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Editar Niño</h2>
          <p className='text-muted-foreground'>Actualiza los datos del niño.</p>
        </div>
      </div>

      <div className='max-w-2xl'>
        {isLoading && (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        )}

        {isError && (
          <p className='text-sm text-destructive'>
            No se pudo cargar los datos del niño.
          </p>
        )}

        {child && (
          <ChildForm
            defaultValues={{
              guardianId: child.guardianId,
              branchId: child.branchId,
              fullName: child.fullName,
              gender: child.gender,
              birthDate: child.birthDate,
              notes: child.notes ?? '',
              isActive: child.isActive,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={updateMutation.isPending}
            submitLabel='Guardar Cambios'
          />
        )}
      </div>
    </Main>
  )
}
