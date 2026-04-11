import { Skeleton } from '@boilerplate/ui'
import { ShoppingBag } from 'lucide-react'
import { type TopProduct } from '../data/dashboard-service'

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
    v
  )

type TopProductsProps = {
  data: TopProduct[]
  isLoading: boolean
}

export const TopProducts = ({ data, isLoading }: TopProductsProps) => {
  const maxQty = data[0]?.totalQuantity ?? 1

  return (
    <div className='flex flex-col rounded-xl border bg-card shadow-sm'>
      <div className='flex items-center gap-2 border-b px-4 py-3'>
        <ShoppingBag size={16} className='text-blue-600' />
        <h3 className='font-semibold'>Top productos del mes</h3>
      </div>

      <div className='flex flex-col gap-3 p-4'>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='space-y-1.5'>
              <div className='flex justify-between'>
                <Skeleton className='h-3.5 w-32' />
                <Skeleton className='h-3.5 w-12' />
              </div>
              <Skeleton className='h-2 w-full rounded-full' />
            </div>
          ))
        ) : data.length === 0 ? (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            Sin consumos este mes.
          </p>
        ) : (
          data.map((product) => {
            const pct = Math.round((product.totalQuantity / maxQty) * 100)
            return (
              <div key={product.productId} className='space-y-1'>
                <div className='flex items-center justify-between gap-2 text-sm'>
                  <span className='min-w-0 truncate font-medium'>
                    {product.productName}
                  </span>
                  <span className='shrink-0 text-xs text-muted-foreground'>
                    x{product.totalQuantity} ·{' '}
                    {formatCurrency(product.totalRevenue)}
                  </span>
                </div>
                <div className='h-1.5 w-full overflow-hidden rounded-full bg-muted'>
                  <div
                    className='h-full rounded-full bg-blue-500 transition-all'
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  {product.categoryName}
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
