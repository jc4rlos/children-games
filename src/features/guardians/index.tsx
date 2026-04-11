import { Button } from '@boilerplate/ui'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Main } from '@/components/layout/main'
import { GuardianDeleteDialog } from './components/guardian-delete-dialog'
import { GuardiansTable } from './components/guardians-table'
import { GuardiansTableSkeleton } from './components/guardians-table-skeleton'
import type { Guardian } from './data/schema'
import { useGuardians } from './hooks/use-guardians'

const route = getRouteApi('/_authenticated/guardians/')

export const Guardians = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [guardianToDelete, setGuardianToDelete] = useState<Guardian | null>(
    null
  )

  const { data, isLoading, isError, error } = useGuardians({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
  })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Apoderados</h2>
            <p className='text-muted-foreground'>
              Administra los apoderados y padres de familia aquí.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/guardians/new' })}
            className='space-x-1'
          >
            <span>Nuevo Apoderado</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar apoderados: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <GuardiansTableSkeleton />
        ) : (
          <GuardiansTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setGuardianToDelete}
          />
        )}
      </Main>

      {guardianToDelete && (
        <GuardianDeleteDialog
          open={!!guardianToDelete}
          onOpenChange={(open) => {
            if (!open) setGuardianToDelete(null)
          }}
          guardian={guardianToDelete}
        />
      )}
    </>
  )
}
