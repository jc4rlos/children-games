import { Button } from '@boilerplate/ui'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { SessionForm } from './components/session-form'
import type { SessionFormValues } from './data/schema'
import { useCreateSession } from './hooks/use-sessions'
import { useAuthStore } from '@/stores/auth-store'

export const SessionCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateSession()
  const {
    auth: { user },
  } = useAuthStore()

  const handleSubmit = (values: SessionFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/sessions' }),
    })
  }

  const handleCancel = () => navigate({ to: '/sessions' })

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
          <h2 className='text-2xl font-bold tracking-tight'>Nueva Sesión</h2>
          <p className='text-muted-foreground'>
            Registra el ingreso de un niño a la sala de juegos.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        <SessionForm
          defaultValues={{
            childId: 0,
            branchId: user?.branchId ?? 0,
            pricingId: 0,
            durationMinutes: 0,
            couponId: null,
            registeredById: user?.employeeId ?? 0,
            isFreeSession: false,
            notes: '',
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={createMutation.isPending}
          submitLabel='Iniciar Sesión'
        />
      </div>
    </Main>
  )
}
