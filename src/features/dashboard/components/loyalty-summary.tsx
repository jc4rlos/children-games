import { Skeleton } from '@boilerplate/ui'
import { Award, Gift, Stamp } from 'lucide-react'
import type { LoyaltySummary } from '../data/dashboard-service'

type LoyaltySummaryCardProps = {
  data: LoyaltySummary | undefined
  isLoading: boolean
}

export const LoyaltySummaryCard = ({
  data,
  isLoading,
}: LoyaltySummaryCardProps) => (
  <div className='flex flex-col rounded-xl border bg-card shadow-sm'>
    <div className='flex items-center gap-2 border-b px-4 py-3'>
      <Award size={16} className='text-violet-600' />
      <h3 className='font-semibold'>Fidelización hoy</h3>
    </div>

    <div className='grid grid-cols-3 divide-x'>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex flex-col items-center gap-2 px-4 py-4'>
            <Skeleton className='h-6 w-8' />
            <Skeleton className='h-3 w-16' />
          </div>
        ))
      ) : (
        <>
          <div className='flex flex-col items-center gap-1 px-4 py-4 text-center'>
            <div className='flex items-center gap-1'>
              <Stamp size={14} className='text-teal-600' />
              <span className='text-2xl font-bold tabular-nums'>
                {data?.stampsToday ?? 0}
              </span>
            </div>
            <span className='text-xs text-muted-foreground'>Sellos dados</span>
          </div>

          <div className='flex flex-col items-center gap-1 px-4 py-4 text-center'>
            <div className='flex items-center gap-1'>
              <Gift size={14} className='text-violet-600' />
              <span className='text-2xl font-bold tabular-nums'>
                {data?.freeSessionsToday ?? 0}
              </span>
            </div>
            <span className='text-xs text-muted-foreground'>
              Sesiones gratis
            </span>
          </div>

          <div className='flex flex-col items-center gap-1 px-4 py-4 text-center'>
            <div className='flex items-center gap-1'>
              <Award size={14} className='text-amber-500' />
              <span className='text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400'>
                {data?.nearCompletionCount ?? 0}
              </span>
            </div>
            <span className='text-xs text-muted-foreground'>
              Casi completan
            </span>
          </div>
        </>
      )}
    </div>
  </div>
)
