import { Button, Skeleton } from '@boilerplate/ui'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { PricingForm } from './components/pricing-form'
import { toDatetimeLocal } from './data/pricing-mapper'
import type { PricingConfigFormValues } from './data/schema'
import {
  useBranchesForPricing,
  usePricingConfig,
  useUpdatePricingConfig,
} from './hooks/use-pricing'

const route = getRouteApi('/_authenticated/pricing/$pricingId/edit')

export const PricingEdit = () => {
  const { pricingId } = route.useParams()
  const id = Number(pricingId)
  const navigate = useNavigate()
  const updateMutation = useUpdatePricingConfig()

  const { data: config, isLoading, isError } = usePricingConfig(id)
  const { data: branches = [], isLoading: loadingBranches } =
    useBranchesForPricing()

  const handleSubmit = (values: PricingConfigFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/pricing' }) }
    )
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
            Editar Configuración
          </h2>
          <p className='text-muted-foreground'>
            Actualiza la configuración de precio.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        {(isLoading || loadingBranches) && (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        )}

        {isError && (
          <p className='text-sm text-destructive'>
            No se pudo cargar la configuración.
          </p>
        )}

        {config && !loadingBranches && (
          <PricingForm
            defaultValues={{
              branchId: config.branchId,
              pricePerHour: config.pricePerHour,
              minimumCharge: config.minimumCharge,
              validFrom: toDatetimeLocal(config.validFrom),
              validUntil: config.validUntil
                ? toDatetimeLocal(config.validUntil)
                : '',
              description: config.description ?? '',
            }}
            branches={branches}
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
