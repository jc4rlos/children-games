import { useEffect, useMemo, useState } from 'react'
import {
  type ColumnFiltersState,
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
import { createChildColumns } from '../components/children-columns'
import { type Child } from '../data/schema'

type UseChildrenTableParams = {
  data: Child[]
  total: number
  search: Record<string, unknown>
  navigate: NavigateFn
  onDelete: (child: Child) => void
}

export const useChildrenTable = ({
  data,
  total,
  search,
  navigate,
  onDelete,
}: UseChildrenTableParams) => {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo(() => createChildColumns(onDelete), [onDelete])

  const {
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: false },
    columnFilters: [
      { columnId: 'fullName', searchKey: 'name', type: 'string' },
      { columnId: 'gender', searchKey: 'gender', type: 'array' },
      { columnId: 'isActive', searchKey: 'isActive', type: 'array' },
    ],
  })

  const [nameInput, setNameInput] = useState(() => {
    const filter = columnFilters.find((f) => f.id === 'fullName')
    return typeof filter?.value === 'string' ? filter.value : ''
  })

  useEffect(() => {
    const filter = columnFilters.find((f) => f.id === 'fullName')
    setNameInput(typeof filter?.value === 'string' ? filter.value : '')
  }, [columnFilters])

  const handleSearch = () => {
    const next: ColumnFiltersState = [
      ...columnFilters.filter((f) => f.id !== 'fullName'),
      ...(nameInput.trim()
        ? [{ id: 'fullName', value: nameInput.trim() }]
        : []),
    ]
    onColumnFiltersChange(next)
  }

  const handleReset = () => {
    setNameInput('')
    onColumnFiltersChange([])
  }

  const pageCount = Math.ceil(total / (pagination?.pageSize ?? 10))

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
    nameInput,
    setNameInput,
    handleSearch,
    handleReset,
    isFiltered: columnFilters.length > 0 || nameInput.trim() !== '',
  }
}
