import { Button } from '@boilerplate/ui'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { GuardianForm } from './components/guardian-form'
import type { GuardianFormValues } from './data/schema'
import { useCreateGuardian } from './hooks/use-guardians'

export const GuardianCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateGuardian()

  const handleSubmit = (values: GuardianFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/guardians' }),
    })
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
          <h2 className='text-2xl font-bold tracking-tight'>Nuevo Apoderado</h2>
          <p className='text-muted-foreground'>
            Completa los datos para registrar un apoderado.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        <GuardianForm
          defaultValues={{
            fullName: '',
            documentNumber: '',
            phone: '',
            email: '',
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={createMutation.isPending}
          submitLabel='Registrar Apoderado'
        />
      </div>
    </Main>
  )
}
