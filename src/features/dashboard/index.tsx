import { Main } from '@/components/layout/main'
import { ActiveSessionsList } from './components/active-sessions-list'
import { ClassesToday } from './components/classes-today'
import { KpiCards } from './components/kpi-cards'
import { LowStockAlert } from './components/low-stock-alert'
import { LoyaltySummaryCard } from './components/loyalty-summary'
import { SessionsChart } from './components/sessions-chart'
import { TopChildren } from './components/top-children'
import { TopProducts } from './components/top-products'
import {
  useActiveSessions,
  useClassesToday,
  useDailyKpis,
  useLowStockProducts,
  useLoyaltySummary,
  useMonthTopChildren,
  useMonthTopProducts,
  useWeekStats,
} from './hooks/use-dashboard'

export function Dashboard() {
  const { data: kpis, isLoading: kpisLoading } = useDailyKpis()
  const { data: activeSessions = [], isLoading: activeLoading } =
    useActiveSessions()
  const { data: weekStats = [], isLoading: weekLoading } = useWeekStats()
  const { data: topChildren = [], isLoading: childrenLoading } =
    useMonthTopChildren()
  const { data: topProducts = [], isLoading: productsLoading } =
    useMonthTopProducts()
  const { data: classesToday = [], isLoading: classesLoading } =
    useClassesToday()
  const { data: lowStock = [], isLoading: stockLoading } = useLowStockProducts()
  const { data: loyalty, isLoading: loyaltyLoading } = useLoyaltySummary()

  const now = new Date()
  const dateLabel = now.toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const greeting =
    now.getHours() < 12
      ? 'Buenos días'
      : now.getHours() < 19
        ? 'Buenas tardes'
        : 'Buenas noches'

  return (
    <Main className='flex flex-1 flex-col gap-5'>
      {/* Header */}
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{greeting} 👋</h2>
        <p className='text-muted-foreground capitalize'>{dateLabel}</p>
      </div>

      {/* Row 1 — KPIs */}
      <KpiCards data={kpis} isLoading={kpisLoading} />

      {/* Row 2 — Active sessions + Classes today */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <ActiveSessionsList data={activeSessions} isLoading={activeLoading} />
        </div>
        <ClassesToday data={classesToday} isLoading={classesLoading} />
      </div>

      {/* Row 3 — Chart + Top products */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          <SessionsChart data={weekStats} isLoading={weekLoading} />
        </div>
        <TopProducts data={topProducts} isLoading={productsLoading} />
      </div>

      {/* Row 4 — Top children + Loyalty + Low stock */}
      <div className='grid gap-4 lg:grid-cols-3'>
        <TopChildren data={topChildren} isLoading={childrenLoading} />
        <LoyaltySummaryCard data={loyalty} isLoading={loyaltyLoading} />
        <LowStockAlert data={lowStock} isLoading={stockLoading} />
      </div>
    </Main>
  )
}
