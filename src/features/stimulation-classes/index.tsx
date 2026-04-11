import { Button } from '@boilerplate/ui'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Main } from '@/components/layout/main'
import { ClassDeleteDialog } from './components/class-delete-dialog'
import { ClassesTable } from './components/classes-table'
import { ClassesTableSkeleton } from './components/classes-table-skeleton'
import type { StimulationClass } from './data/schema'
import { useClasses, useEnrolledCounts } from './hooks/use-classes'

const route = getRouteApi('/_authenticated/stimulation-classes/')

export const StimulationClasses = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [classToDelete, setClassToDelete] = useState<StimulationClass | null>(
    null
  )

  const { data, isLoading, isError, error } = useClasses({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
    isActive: search.isActive,
  })

  const classIds = data?.data.map((c) => c.id) ?? []
  const { data: enrolledCounts = new Map<number, number>() } =
    useEnrolledCounts(classIds)

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Clases de Estimulación Temprana
            </h2>
            <p className='text-muted-foreground'>
              Administra las clases de estimulación temprana.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/stimulation-classes/new' })}
            className='space-x-1'
          >
            <span>Nueva Clase</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar clases: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <ClassesTableSkeleton />
        ) : (
          <ClassesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setClassToDelete}
            enrolledCounts={enrolledCounts}
          />
        )}
      </Main>

      {classToDelete && (
        <ClassDeleteDialog
          open={!!classToDelete}
          onOpenChange={(open) => {
            if (!open) setClassToDelete(null)
          }}
          cls={classToDelete}
          enrolledCount={enrolledCounts.get(classToDelete.id) ?? 0}
        />
      )}
    </>
  )
}
