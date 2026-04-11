import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ClassForm } from './components/class-form'
import { type ClassFormValues } from './data/schema'
import { useClassById, useUpdateClass } from './hooks/use-classes'

const route = getRouteApi('/_authenticated/stimulation-classes/$classId/edit')

export const ClassEdit = () => {
  const { classId } = route.useParams()
  const id = Number(classId)
  const navigate = useNavigate()
  const updateMutation = useUpdateClass()

  const { data: cls, isLoading, isError } = useClassById(id)

  const handleSubmit = (values: ClassFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/stimulation-classes' }) }
    )
  }

  const handleCancel = () => navigate({ to: '/stimulation-classes' })

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
          <h2 className='text-2xl font-bold tracking-tight'>Editar Clase</h2>
          <p className='text-muted-foreground'>
            Actualiza los datos de la clase.
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
            No se pudo cargar la clase.
          </p>
        )}

        {cls && (
          <ClassForm
            defaultValues={{
              branchId: cls.branchId,
              teacherId: cls.teacherId,
              name: cls.name,
              description: cls.description ?? '',
              ageMinMonths: cls.ageMinMonths,
              ageMaxMonths: cls.ageMaxMonths,
              capacity: cls.capacity,
              price: cls.price,
              daysOfWeek: cls.daysOfWeek,
              startTime: cls.startTime,
              endTime: cls.endTime,
              isActive: cls.isActive,
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
