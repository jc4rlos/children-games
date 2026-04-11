import { Button } from '@boilerplate/ui'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { DataTableFacetedFilter } from '@/components/data-table/faceted-filter'
import { DataTableViewOptions } from '@/components/data-table/view-options'
import type { BranchOption } from '@/features/branches/data/branches-service'
import type { PricingConfig } from '../data/schema'

type PricingToolbarProps = {
  table: Table<PricingConfig>
  branches: BranchOption[]
  onReset: () => void
  isFiltered: boolean
}

export const PricingToolbar = ({
  table,
  branches,
  onReset,
  isFiltered,
}: PricingToolbarProps) => (
  <div className='flex items-center justify-between'>
    <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
      <div className='flex gap-x-2'>
        <DataTableFacetedFilter
          column={table.getColumn('branchId')}
          title='Sucursal'
          options={branches.map((b) => ({
            label: b.name,
            value: String(b.id),
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
