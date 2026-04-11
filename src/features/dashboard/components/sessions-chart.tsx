import { Skeleton } from '@boilerplate/ui'
import { BarChart2 } from 'lucide-react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DayStats } from '../data/dashboard-service'

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 0,
  }).format(v)

type SessionsChartProps = {
  data: DayStats[]
  isLoading: boolean
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number; name: string }[]
  label?: string
}) => {
  if (!active || !payload?.length) return null
  return (
    <div className='rounded-lg border bg-popover px-3 py-2 text-sm shadow-md'>
      <p className='mb-1 font-medium'>{label}</p>
      <p className='text-muted-foreground'>
        Sesiones:{' '}
        <span className='font-semibold text-teal-600'>{payload[0]?.value}</span>
      </p>
      <p className='text-muted-foreground'>
        Ingresos:{' '}
        <span className='font-semibold text-violet-600'>
          {formatCurrency(payload[1]?.value ?? 0)}
        </span>
      </p>
    </div>
  )
}

export const SessionsChart = ({ data, isLoading }: SessionsChartProps) => (
  <div className='flex flex-col rounded-xl border bg-card shadow-sm'>
    <div className='flex items-center gap-2 border-b px-4 py-3'>
      <BarChart2 size={16} className='text-violet-600' />
      <h3 className='font-semibold'>Sesiones e ingresos — últimos 7 días</h3>
    </div>

    <div className='p-4'>
      {isLoading ? (
        <Skeleton className='h-52 w-full rounded-lg' />
      ) : (
        <>
          <ResponsiveContainer width='100%' height={200}>
            <ComposedChart
              data={data}
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
              <XAxis
                dataKey='label'
                tick={{ fontSize: 12 }}
                className='fill-muted-foreground'
              />
              <YAxis
                yAxisId='left'
                tick={{ fontSize: 12 }}
                className='fill-muted-foreground'
                allowDecimals={false}
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                tick={{ fontSize: 12 }}
                className='fill-muted-foreground'
                tickFormatter={(v) => `S/${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                yAxisId='left'
                dataKey='sessions'
                fill='#0d9488'
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
              <Line
                yAxisId='right'
                type='monotone'
                dataKey='revenue'
                stroke='#7c3aed'
                strokeWidth={2}
                dot={{ fill: '#7c3aed', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className='mt-3 flex items-center justify-center gap-5 text-xs text-muted-foreground'>
            <span className='flex items-center gap-1.5'>
              <span className='h-3 w-3 rounded-sm bg-teal-600' />
              Sesiones
            </span>
            <span className='flex items-center gap-1.5'>
              <span className='h-0.5 w-4 bg-violet-600' />
              Ingresos
            </span>
          </div>
        </>
      )}
    </div>
  </div>
)
