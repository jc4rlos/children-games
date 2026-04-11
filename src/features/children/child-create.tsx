import { useNavigate } from '@tanstack/react-router'
import { Button } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ChildForm } from './components/child-form'
import { type ChildFormValues } from './data/schema'
import { useCreateChild } from './hooks/use-children'

export const ChildCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateChild()

  const handleSubmit = (values: ChildFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/children' }),
    })
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
          <h2 className='text-2xl font-bold tracking-tight'>Registrar Niño</h2>
          <p className='text-muted-foreground'>
            Completa los datos para registrar un niño.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        <ChildForm
          defaultValues={{
            guardianId: undefined as unknown as number,
            branchId: undefined as unknown as number,
            fullName: '',
            gender: undefined as unknown as 'MALE' | 'FEMALE',
            birthDate: '',
            notes: '',
            isActive: true,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={createMutation.isPending}
          submitLabel='Registrar Niño'
        />
      </div>
    </Main>
  )
}
