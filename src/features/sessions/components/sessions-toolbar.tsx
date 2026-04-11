import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button, Input } from '@boilerplate/ui'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import {
  sessionStatusLabels,
  sessionStatuses,
  type PlaySession,
} from '../data/schema'

type SessionsToolbarProps = {
  table: Table<PlaySession>
  currentDate: string
  onDateChange: (date: string) => void
  onReset: () => void
  isFiltered: boolean
}

export const SessionsToolbar = ({
  table,
  currentDate,
  onDateChange,
  onReset,
  isFiltered,
}: SessionsToolbarProps) => (
  <div className='flex items-center justify-between'>
    <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
      <div className='flex items-center gap-2'>
        <Input
          type='date'
          value={currentDate}
          onChange={(e) => onDateChange(e.target.value)}
          className='h-8 w-40'
        />
      </div>

      <div className='flex gap-x-2'>
        <DataTableFacetedFilter
          column={table.getColumn('status')}
          title='Estado'
          options={sessionStatuses.map((s) => ({
            label: sessionStatusLabels[s],
            value: s,
          }))}
        />
      </div>

      {isFiltered && (
        <Button variant='ghost' onClick={onReset} className='h-8 px-2 lg:px-3'>
          Limpiar
          <Cross2Icon className='ms-2 h-4 w-4' />
        </Button>
      )}
    </div>

    <DataTableViewOptions table={table} />
  </div>
)
