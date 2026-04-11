import { flexRender } from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@boilerplate/ui'
import { cn } from '@/lib/utils'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { DataTablePagination } from '@/components/data-table'
import { type PlaySession } from '../data/schema'
import { useSessionsTable } from '../hooks/use-sessions-table'
import { SessionsToolbar } from './sessions-toolbar'

const COLUMNS_COUNT = 7

type SessionsTableProps = {
  data: PlaySession[]
  total: number
  search: Record<string, unknown>
  navigate: NavigateFn
  onClose: (session: PlaySession) => void
  onAddConsumption: (session: PlaySession) => void
  onViewCart: (session: PlaySession) => void
}

export const SessionsTable = ({
  data,
  total,
  search,
  navigate,
  onClose,
  onAddConsumption,
  onViewCart,
}: SessionsTableProps) => {
  const { table, currentDate, handleDateChange, handleReset, isFiltered } =
    useSessionsTable({
      data,
      total,
      search,
      navigate,
      onClose,
      onAddConsumption,
      onViewCart,
    })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <SessionsToolbar
        table={table}
        currentDate={currentDate}
        onDateChange={handleDateChange}
        onReset={handleReset}
        isFiltered={isFiltered}
      />

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'group/row',
                    row.original.status === 'ACTIVE' &&
                      'bg-teal-50/30 dark:bg-teal-950/20'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        row.original.status === 'ACTIVE'
                          ? 'bg-teal-50/30 dark:bg-teal-950/20'
                          : 'bg-background',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={COLUMNS_COUNT} className='h-24 text-center'>
                  Sin sesiones para esta fecha y filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} className='mt-auto' />
    </div>
  )
}
