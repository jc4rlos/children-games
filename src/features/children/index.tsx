import { Button } from '@boilerplate/ui'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Main } from '@/components/layout/main'
import { ChildDeleteDialog } from './components/child-delete-dialog'
import { ChildrenTable } from './components/children-table'
import { ChildrenTableSkeleton } from './components/children-table-skeleton'
import type { Child } from './data/schema'
import { useChildren } from './hooks/use-children'

const route = getRouteApi('/_authenticated/children/')

export const Children = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [childToDelete, setChildToDelete] = useState<Child | null>(null)

  const { data, isLoading, isError, error } = useChildren({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
    gender: search.gender,
    isActive: search.isActive,
  })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Niños</h2>
            <p className='text-muted-foreground'>
              Administra los niños registrados en el sistema.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/children/new' })}
            className='space-x-1'
          >
            <span>Registrar Niño</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar niños: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <ChildrenTableSkeleton />
        ) : (
          <ChildrenTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setChildToDelete}
          />
        )}
      </Main>

      {childToDelete && (
        <ChildDeleteDialog
          open={!!childToDelete}
          onOpenChange={(open) => {
            if (!open) setChildToDelete(null)
          }}
          child={childToDelete}
        />
      )}
    </>
  )
}
