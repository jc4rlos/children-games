import { useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { PricingForm } from './components/pricing-form'
import { type PricingConfigFormValues } from './data/schema'
import {
  useBranchesForPricing,
  useCreatePricingConfig,
} from './hooks/use-pricing'

export const PricingCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreatePricingConfig()
  const { data: branches = [], isLoading: loadingBranches } =
    useBranchesForPricing()

  const handleSubmit = (values: PricingConfigFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/pricing' }),
    })
  }

  const handleCancel = () => navigate({ to: '/pricing' })

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
          <h2 className='text-2xl font-bold tracking-tight'>
            Nueva Configuración
          </h2>
          <p className='text-muted-foreground'>
            Define el precio por hora y cargo mínimo para una sucursal.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        {loadingBranches ? (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        ) : (
          <PricingForm
            defaultValues={{
              branchId: 0,
              pricePerHour: 0,
              minimumCharge: 0,
              validFrom: new Date().toISOString().slice(0, 16),
              validUntil: '',
            }}
            branches={branches}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={createMutation.isPending}
            submitLabel='Crear Configuración'
          />
        )}
      </div>
    </Main>
  )
}
