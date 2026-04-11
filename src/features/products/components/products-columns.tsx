import { Badge, Checkbox } from '@boilerplate/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { cn } from '@/lib/utils'
import type { Product } from '../data/schema'
import { ProductRowActions } from './product-row-actions'

export const createProductColumns = (
  onDelete: (product: Product) => void
): ColumnDef<Product>[] => [
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
    id: 'image',
    header: () => null,
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl
      if (!imageUrl) return null
      return (
        <img
          src={imageUrl}
          alt={row.original.name}
          className='h-10 w-10 rounded-md object-cover'
        />
      )
    },
    meta: { className: 'w-14' },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <div className='flex flex-col gap-1 ps-3'>
        <LongText className='max-w-48 font-medium'>
          {row.getValue('name')}
        </LongText>
        <Badge variant='outline' className='w-fit text-xs'>
          {row.original.categoryName}
        </Badge>
      </div>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
        'ps-0.5 max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'categoryId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Categoría' />
    ),
    cell: () => null,
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
    enableHiding: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Precio' />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return <span className='text-sm font-medium'>S/ {price.toFixed(2)}</span>
    },
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Stock' />
    ),
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number
      const isLow = stock < 5
      return (
        <span
          className={cn(
            'flex items-center gap-1 text-sm',
            isLow ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
          )}
        >
          {isLow && <AlertCircle size={14} />}
          {stock}
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
      <ProductRowActions product={row.original} onDelete={onDelete} />
    ),
    meta: { className: 'w-10' },
  },
]
