import { Checkbox } from '@boilerplate/ui'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { cn } from '@/lib/utils'
import { IconWhatsapp } from '@/assets/brand-icons'
import type { Guardian } from '../data/schema'
import { GuardianRowActions } from './guardian-row-actions'

const PORTAL_BASE_URL =
  import.meta.env.VITE_PORTAL_URL ?? window.location.origin

export const createGuardianColumns = (
  onDelete: (guardian: Guardian) => void
): ColumnDef<Guardian>[] => [
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
      <span className='font-mono text-xs font-semibold text-teal-700 dark:text-teal-300'>
        {row.getValue('code')}
      </span>
    ),
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nombre completo' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-52 ps-3'>{row.getValue('fullName')}</LongText>
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
    accessorKey: 'documentNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Documento' />
    ),
    cell: ({ row }) => (
      <span className='font-mono text-sm'>
        {row.getValue('documentNumber')}
      </span>
    ),
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Teléfono' />
    ),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null
      return <span className='text-sm'>{phone ?? '—'}</span>
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string | null
      return (
        <span className='text-sm text-muted-foreground'>{email ?? '—'}</span>
      )
    },
  },
  {
    id: 'whatsapp',
    header: 'WhatsApp',
    cell: ({ row }) => {
      const guardian = row.original
      const portalUrl = `${PORTAL_BASE_URL}/portal?code=${encodeURIComponent(guardian.code)}`
      const message = encodeURIComponent(
        `Hola, ingresa al portal de padres con tu código: ${portalUrl}`
      )
      const whatsappUrl = guardian.phone
        ? `https://wa.me/${guardian.phone.replace(/[^0-9]/g, '')}?text=${message}`
        : null

      if (!whatsappUrl) {
        return (
          <span className='text-xs text-muted-foreground'>Sin teléfono</span>
        )
      }

      return (
        <a
          href={whatsappUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-1 text-green-600 transition-colors hover:text-green-700 dark:text-green-500 dark:hover:text-green-400'
          title='Enviar enlace de portal por WhatsApp'
        >
          <IconWhatsapp className='h-4 w-4' />
          <span className='sr-only'>Enviar enlace de portal por WhatsApp</span>
        </a>
      )
    },
    meta: { className: 'w-24 text-center' },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <GuardianRowActions guardian={row.original} onDelete={onDelete} />
    ),
    meta: { className: 'w-10' },
  },
]
