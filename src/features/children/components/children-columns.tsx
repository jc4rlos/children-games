import { Badge, Checkbox } from '@boilerplate/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { CheckCircle, Gift, XCircle } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { cn } from '@/lib/utils'
import { type Child, genderLabels } from '../data/schema'
import { ChildAvatar } from './child-avatar'
import { ChildRowActions } from './child-row-actions'

export const createChildColumns = (
  onDelete: (child: Child) => void
): ColumnDef<Child>[] => [
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
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre' />
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <ChildAvatar child={row.original} size='sm' />
        <LongText className='max-w-44'>{row.getValue('fullName')}</LongText>
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
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Código' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-xs text-muted-foreground'>
        {row.getValue('code')}
      </span>
    ),
  },
  {
    accessorKey: 'gender',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Género' />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('gender') as Child['gender']
      return (
        <Badge
          variant='outline'
          className={cn(
            gender === 'MALE'
              ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
              : 'border-pink-200 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950 dark:text-pink-300'
          )}
        >
          {genderLabels[gender]}
        </Badge>
      )
    },
    filterFn: (row, id, value) => value.includes(String(row.getValue(id))),
  },
  {
    accessorKey: 'birthDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nacimiento' />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('birthDate') as string)
      return (
        <span className='text-sm text-muted-foreground'>
          {date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
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
    id: 'loyalty',
    header: 'Sellos',
    cell: ({ row }) => {
      const child = row.original
      const count = child.loyaltyStampsCount
      const required = child.loyaltyStampsRequired
      const free = child.loyaltyFreeSessions

      if (
        count === null ||
        count === undefined ||
        required === null ||
        required === undefined
      ) {
        return <span className='text-xs text-muted-foreground'>—</span>
      }

      const dots = Array.from({ length: required }, (_, i) => i < count)

      return (
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-0.5'>
            {dots.map((filled, i) => (
              <div
                key={i}
                className={cn(
                  'h-3 w-3 rounded-full',
                  filled
                    ? 'bg-teal-500 dark:bg-teal-400'
                    : 'bg-muted-foreground/15'
                )}
              />
            ))}
            <span className='ml-1.5 font-mono text-xs text-muted-foreground'>
              {count}/{required}
            </span>
          </div>
          {(free ?? 0) > 0 && (
            <span className='flex w-fit items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-300'>
              <Gift size={10} />
              {free}
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ChildRowActions child={row.original} onDelete={onDelete} />
    ),
    meta: { className: 'w-10' },
  },
]
