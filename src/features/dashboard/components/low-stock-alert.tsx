import { Skeleton } from '@boilerplate/ui'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { LowStockProduct } from '../data/dashboard-service'

type LowStockAlertProps = {
  data: LowStockProduct[]
  isLoading: boolean
}

export const LowStockAlert = ({ data, isLoading }: LowStockAlertProps) => (
  <div className='flex flex-col rounded-xl border bg-card shadow-sm'>
    <div className='flex items-center gap-2 border-b px-4 py-3'>
      <AlertTriangle size={16} className='text-amber-500' />
      <h3 className='font-semibold'>Stock bajo</h3>
      {!isLoading && data.length > 0 && (
        <span className='ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'>
          {data.length}
        </span>
      )}
    </div>

    <div className='divide-y'>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex items-center gap-3 px-4 py-2.5'>
            <Skeleton className='h-3.5 flex-1' />
            <Skeleton className='h-5 w-8 rounded-full' />
          </div>
        ))
      ) : data.length === 0 ? (
        <p className='py-6 text-center text-sm text-muted-foreground'>
          Todos los productos tienen stock suficiente.
        </p>
      ) : (
        data.map((product) => (
          <div
            key={product.id}
            className='flex items-center justify-between gap-3 px-4 py-2.5'
          >
            <div className='min-w-0'>
              <p className='truncate text-sm font-medium'>{product.name}</p>
              <p className='text-xs text-muted-foreground'>
                {product.categoryName}
              </p>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-bold',
                product.stock <= 2
                  ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              )}
            >
              {product.stock}
            </span>
          </div>
        ))
      )}
    </div>
  </div>
)
