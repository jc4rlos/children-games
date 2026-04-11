import { type ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@boilerplate/ui'
import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Coupon, discountTypeLabels } from '../data/schema'
import { CouponRowActions } from './coupon-row-actions'

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(iso))

const formatDiscount = (type: Coupon['discountType'], value: number) => {
  if (type === 'PERCENTAGE') return `${value}%`
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value)
}

export const createCouponColumns = (
  onDelete: (coupon: Coupon) => void
): ColumnDef<Coupon>[] => [
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
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Código' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm font-semibold tracking-wider'>
        {row.getValue('code')}
      </span>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'branchId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sucursal' />
    ),
    cell: ({ row }) => (
      <span className='text-sm text-muted-foreground'>
        {row.original.branchName ?? 'Todas las sedes'}
      </span>
    ),
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: 'discountType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipo' />
    ),
    cell: ({ row }) => (
      <span className='text-sm'>
        {discountTypeLabels[row.getValue('discountType') as Coupon['discountType']]}
      </span>
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: 'discount',
    header: 'Descuento',
    cell: ({ row }) => (
      <span className='font-mono text-sm font-medium'>
        {formatDiscount(row.original.discountType, row.original.discountValue)}
      </span>
    ),
  },
  {
    id: 'uses',
    header: 'Usos',
    cell: ({ row }) => {
      const max = row.original.maxUses
      const used = row.original.usesCount
      return (
        <span className='text-sm'>
          {used} / {max != null ? max : '∞'}
        </span>
      )
    },
  },
  {
    accessorKey: 'validFrom',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vigencia' />
    ),
    cell: ({ row }) => {
      const until = row.original.validUntil
      return (
        <span className='text-sm'>
          {formatDate(row.getValue('validFrom'))}
          {until ? ` — ${formatDate(until)}` : ''}
        </span>
      )
    },
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Estado' />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return isActive ? (
        <span className='flex items-center gap-1 text-teal-600 dark:text-teal-400'>
          <CheckCircle size={15} />
          Activo
        </span>
      ) : (
        <span className='flex items-center gap-1 text-muted-foreground'>
          <XCircle size={15} />
          Inactivo
        </span>
      )
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <CouponRowActions coupon={row.original} onDelete={onDelete} />
    ),
    meta: { className: 'w-10' },
  },
]
