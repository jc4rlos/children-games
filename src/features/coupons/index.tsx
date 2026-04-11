import { useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button } from '@boilerplate/ui'
import { PlusCircle } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { CouponDeleteDialog } from './components/coupon-delete-dialog'
import { CouponsTable } from './components/coupons-table'
import { CouponsTableSkeleton } from './components/coupons-table-skeleton'
import { type Coupon } from './data/schema'
import { useCoupons } from './hooks/use-coupons'

const route = getRouteApi('/_authenticated/coupons/')

export const Coupons = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null)

  const { data, isLoading, isError, error } = useCoupons({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    code: search.code,
    discountType: search.discountType,
    isActive: search.isActive,
  })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Cupones</h2>
            <p className='text-muted-foreground'>
              Administra los cupones de descuento.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/coupons/new' })}
            className='space-x-1'
          >
            <span>Nuevo Cupón</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar cupones: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <CouponsTableSkeleton />
        ) : (
          <CouponsTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setCouponToDelete}
          />
        )}
      </Main>

      {couponToDelete && (
        <CouponDeleteDialog
          open={!!couponToDelete}
          onOpenChange={(open) => {
            if (!open) setCouponToDelete(null)
          }}
          coupon={couponToDelete}
        />
      )}
    </>
  )
}
