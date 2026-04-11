import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { CouponForm } from './components/coupon-form'
import { type CouponFormValues } from './data/schema'
import { useBranchesForCoupon, useCoupon, useUpdateCoupon } from './hooks/use-coupons'

const route = getRouteApi('/_authenticated/coupons/$couponId/edit')

export const CouponEdit = () => {
  const { couponId } = route.useParams()
  const id = Number(couponId)
  const navigate = useNavigate()
  const updateMutation = useUpdateCoupon()

  const { data: coupon, isLoading, isError } = useCoupon(id)
  const { data: branches = [], isLoading: loadingBranches } = useBranchesForCoupon()

  const handleSubmit = (values: CouponFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/coupons' }) }
    )
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
          <h2 className='text-2xl font-bold tracking-tight'>Editar Cupón</h2>
          <p className='text-muted-foreground'>Actualiza los datos del cupón.</p>
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
            No se pudo cargar el cupón.
          </p>
        )}

        {coupon && !loadingBranches && (
          <CouponForm
            defaultValues={{
              code: coupon.code,
              branchId: coupon.branchId,
              description: coupon.description ?? '',
              discountType: coupon.discountType,
              discountValue: coupon.discountValue,
              maxUses: coupon.maxUses != null ? String(coupon.maxUses) : '',
              validFrom: coupon.validFrom.slice(0, 10),
              validUntil: coupon.validUntil ? coupon.validUntil.slice(0, 10) : '',
              isActive: coupon.isActive,
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
