import { Checkbox } from '@boilerplate/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { cn } from '@/lib/utils'
import type { PricingConfig } from '../data/schema'
import { PricingRowActions } from './pricing-row-actions'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(
    value
  )

const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

const getPricingStatus = (validFrom: string, validUntil: string | null) => {
  const now = new Date()
  const from = new Date(validFrom)
  if (now < from)
    return {
      label: 'Programado',
      className: 'text-blue-600 dark:text-blue-400',
    }
  if (validUntil && now > new Date(validUntil))
    return { label: 'Expirado', className: 'text-muted-foreground' }
  return { label: 'Vigente', className: 'text-teal-600 dark:text-teal-400' }
}

export const createPricingColumns = (
  onDelete: (config: PricingConfig) => void
): ColumnDef<PricingConfig>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Seleccionar todo'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Seleccionar fila'
        className='translate-y-0.5'
      />
    ),
    meta: { className: cn('max-md:sticky start-0 z-10 rounded-tl-[inherit]') },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'branchId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sucursal' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.original.branchName}</span>
    ),
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
    enableHiding: false,
  },
  {
    accessorKey: 'pricePerHour',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Precio / hora' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>
        {formatCurrency(row.getValue('pricePerHour'))}
      </span>
    ),
  },
  {
    accessorKey: 'minimumCharge',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cargo mínimo' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>
        {formatCurrency(row.getValue('minimumCharge'))}
      </span>
    ),
  },
  {
    accessorKey: 'validFrom',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Desde' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>
        {formatDateTime(row.getValue('validFrom'))}
      </span>
    ),
  },
  {
    accessorKey: 'validUntil',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hasta' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('validUntil') as string | null
      return (
        <span className='text-sm text-muted-foreground'>
          {value ? formatDateTime(value) : '—'}
        </span>
      )
    },
  },
  {
    id: 'status',
    header: 'Estado',
    cell: ({ row }) => {
      const { label, className } = getPricingStatus(
        row.original.validFrom,
        row.original.validUntil
      )
      return (
        <span className={cn('text-sm font-medium', className)}>{label}</span>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <PricingRowActions config={row.original} onDelete={onDelete} />
    ),
    meta: { className: 'w-10' },
  },
]
