import { useEffect, useMemo, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import { createSessionColumns } from '../components/sessions-columns'
import { type PlaySession } from '../data/schema'

const TODAY = new Date().toISOString().slice(0, 10)

type UseSessionsTableParams = {
  data: PlaySession[]
  total: number
  search: Record<string, unknown>
  navigate: NavigateFn
  onClose: (session: PlaySession) => void
  onAddConsumption: (session: PlaySession) => void
  onViewCart: (session: PlaySession) => void
}

export const useSessionsTable = ({
  data,
  total,
  search,
  navigate,
  onClose,
  onAddConsumption,
  onViewCart,
}: UseSessionsTableParams) => {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(
    () => createSessionColumns(onClose, onAddConsumption, onViewCart),
    [onClose, onAddConsumption, onViewCart]
  )

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 20 },
    globalFilter: { enabled: false },
    columnFilters: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
  })

  const currentDate = typeof search.date === 'string' ? search.date : TODAY

  const handleDateChange = (date: string) => {
    navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, date, page: 1 }),
    })
  }

  const handleReset = () => {
    handleDateChange(TODAY)
    onColumnFiltersChange([{ id: 'status', value: ['ACTIVE'] }])
  }

  const statusValues = (columnFilters.find((f) => f.id === 'status')?.value as
    | string[]
    | undefined) ?? ['ACTIVE']

  const isFiltered =
    currentDate !== TODAY ||
    !(statusValues.length === 1 && statusValues[0] === 'ACTIVE')

  const pageCount = Math.ceil(total / (pagination?.pageSize ?? 20))

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: {
      sorting,
      pagination,
      rowSelection,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    manualFiltering: true,
    enableRowSelection: true,
    onPaginationChange,
    onColumnFiltersChange,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    ensurePageInRange(pageCount)
  }, [pageCount, ensurePageInRange])

  return {
    table,
    currentDate,
    handleDateChange,
    handleReset,
    isFiltered,
  }
}
