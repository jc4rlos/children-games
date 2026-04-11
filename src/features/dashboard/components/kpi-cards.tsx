import { Skeleton } from '@boilerplate/ui'
import { Activity, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import type { DailyKpis } from '../data/dashboard-service'

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
    v
  )

type KpiCardProps = {
  label: string
  value: string | number
  icon: React.ReactNode
  color: string
  sub?: string
}

const KpiCard = ({ label, value, icon, color, sub }: KpiCardProps) => (
  <div className='rounded-xl border bg-card p-4 shadow-sm'>
    <div className='flex items-start justify-between'>
      <div>
        <p className='text-sm text-muted-foreground'>{label}</p>
        <p className='mt-1 text-2xl font-bold tabular-nums'>{value}</p>
        {sub && <p className='mt-0.5 text-xs text-muted-foreground'>{sub}</p>}
      </div>
      <div className={`rounded-lg p-2 ${color}`}>{icon}</div>
    </div>
  </div>
)

type KpiCardsProps = {
  data: DailyKpis | undefined
  isLoading: boolean
}

export const KpiCards = ({ data, isLoading }: KpiCardsProps) => {
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-24 rounded-xl' />
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
      <KpiCard
        label='Sesiones activas'
        value={data?.activeSessions ?? 0}
        icon={<Activity size={18} className='text-teal-600' />}
        color='bg-teal-50 dark:bg-teal-950/50'
        sub='En este momento'
      />
      <KpiCard
        label='Sesiones hoy'
        value={data?.totalSessionsToday ?? 0}
        icon={<Users size={18} className='text-blue-600' />}
        color='bg-blue-50 dark:bg-blue-950/50'
        sub='Total del día'
      />
      <KpiCard
        label='Ingresos hoy'
        value={formatCurrency(data?.revenueToday ?? 0)}
        icon={<TrendingUp size={18} className='text-violet-600' />}
        color='bg-violet-50 dark:bg-violet-950/50'
        sub='Sesiones cerradas'
      />
      <KpiCard
        label='Consumos hoy'
        value={formatCurrency(data?.consumptionsToday ?? 0)}
        icon={<ShoppingBag size={18} className='text-amber-600' />}
        color='bg-amber-50 dark:bg-amber-950/50'
        sub='Productos vendidos'
      />
    </div>
  )
}
