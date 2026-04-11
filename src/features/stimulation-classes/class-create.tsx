import { Button } from '@boilerplate/ui'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ClassForm } from './components/class-form'
import type { ClassFormValues } from './data/schema'
import { useCreateClass } from './hooks/use-classes'

export const ClassCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateClass()

  const handleSubmit = (values: ClassFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/stimulation-classes' }),
    })
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
          <h2 className='text-2xl font-bold tracking-tight'>Nueva Clase</h2>
          <p className='text-muted-foreground'>
            Completa los datos para crear una clase de estimulación temprana.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        <ClassForm
          defaultValues={{
            branchId: 0,
            teacherId: null,
            name: '',
            description: '',
            ageMinMonths: 0,
            ageMaxMonths: 36,
            capacity: 10,
            price: 0,
            daysOfWeek: ['MON'],
            startTime: '09:00',
            endTime: '10:00',
            isActive: true,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={createMutation.isPending}
          submitLabel='Crear Clase'
        />
      </div>
    </Main>
  )
}
