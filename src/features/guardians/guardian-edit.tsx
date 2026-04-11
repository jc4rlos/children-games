import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { GuardianForm } from './components/guardian-form'
import { type GuardianFormValues } from './data/schema'
import { useGuardian, useUpdateGuardian } from './hooks/use-guardians'

const route = getRouteApi('/_authenticated/guardians/$guardianId/edit')

export const GuardianEdit = () => {
  const { guardianId } = route.useParams()
  const id = Number(guardianId)
  const navigate = useNavigate()
  const updateMutation = useUpdateGuardian()

  const { data: guardian, isLoading, isError } = useGuardian(id)

  const handleSubmit = (values: GuardianFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/guardians' }) }
    )
  }

  const handleCancel = () => navigate({ to: '/guardians' })

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
          <h2 className='text-2xl font-bold tracking-tight'>Editar Apoderado</h2>
          <p className='text-muted-foreground'>
            Actualiza los datos del apoderado.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        {isLoading && (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        )}

        {isError && (
          <p className='text-sm text-destructive'>
            No se pudo cargar el apoderado.
          </p>
        )}

        {guardian && (
          <GuardianForm
            defaultValues={{
              fullName: guardian.fullName,
              documentNumber: guardian.documentNumber,
              phone: guardian.phone ?? '',
              email: guardian.email ?? '',
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
