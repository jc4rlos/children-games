import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@boilerplate/ui'
import { flexRender } from '@tanstack/react-table'
import { DataTablePagination } from '@/components/data-table'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { cn } from '@/lib/utils'
import type { Guardian } from '../data/schema'
import { useGuardiansTable } from '../hooks/use-guardians-table'
import { GuardiansToolbar } from './guardians-toolbar'

const COLUMNS_COUNT = 6

type GuardiansTableProps = {
  data: Guardian[]
  total: number
  search: Record<string, unknown>
  navigate: NavigateFn
  onDelete: (guardian: Guardian) => void
}

export const GuardiansTable = ({
  data,
  total,
  search,
  navigate,
  onDelete,
}: GuardiansTableProps) => {
  const {
    table,
    nameInput,
    setNameInput,
    handleSearch,
    handleReset,
    isFiltered,
  } = useGuardiansTable({ data, total, search, navigate, onDelete })

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <GuardiansToolbar
        table={table}
        nameInput={nameInput}
        onNameChange={setNameInput}
        onSearch={handleSearch}
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
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
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
                  Sin resultados.
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
