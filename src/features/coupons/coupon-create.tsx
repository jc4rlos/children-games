import { useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { CouponForm } from './components/coupon-form'
import { type CouponFormValues } from './data/schema'
import { useBranchesForCoupon, useCreateCoupon } from './hooks/use-coupons'

export const CouponCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateCoupon()
  const { data: branches = [], isLoading: loadingBranches } =
    useBranchesForCoupon()

  const handleSubmit = (values: CouponFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/coupons' }),
    })
  }

  const handleCancel = () => navigate({ to: '/coupons' })

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
          <h2 className='text-2xl font-bold tracking-tight'>Nuevo Cupón</h2>
          <p className='text-muted-foreground'>
            Crea un cupón de descuento para tus clientes.
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
          <CouponForm
            defaultValues={{
              code: '',
              branchId: null,
              description: '',
              discountType: 'PERCENTAGE',
              discountValue: 0,
              maxUses: '',
              validFrom: new Date().toISOString().slice(0, 10),
              validUntil: '',
              isActive: true,
            }}
            branches={branches}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={createMutation.isPending}
            submitLabel='Crear Cupón'
          />
        )}
      </div>
    </Main>
  )
}
