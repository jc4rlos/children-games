import { Button } from '@boilerplate/ui'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Main } from '@/components/layout/main'
import { SessionCloseDialog } from './components/session-close-dialog'
import { SessionConsumptionDialog } from './components/session-consumption-dialog'
import { SessionsTable } from './components/sessions-table'
import { SessionsTableSkeleton } from './components/sessions-table-skeleton'
import type { PlaySession } from './data/schema'
import { useSessions } from './hooks/use-sessions'

const route = getRouteApi('/_authenticated/sessions/')

const TODAY = new Date().toLocaleDateString('sv-SE')

type ConsumptionDialogState = {
  session: PlaySession
  view: 'products' | 'cart'
} | null

export const Sessions = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [sessionToClose, setSessionToClose] = useState<PlaySession | null>(null)
  const [consumptionDialog, setConsumptionDialog] =
    useState<ConsumptionDialogState>(null)

  const date = typeof search.date === 'string' ? search.date : TODAY
  const status =
    Array.isArray(search.status) && search.status.length > 0
      ? search.status
      : ['ACTIVE']

  const { data, isLoading, isError, error } = useSessions({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 20,
    date,
    status,
  })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Sesiones de Juego
            </h2>
            <p className='text-muted-foreground'>
              Gestiona las sesiones activas y el historial del día.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/sessions/new' })}
            className='space-x-1'
          >
            <span>Nueva Sesión</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar sesiones: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <SessionsTableSkeleton />
        ) : (
          <SessionsTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onClose={setSessionToClose}
            onAddConsumption={(session) =>
              setConsumptionDialog({ session, view: 'products' })
            }
            onViewCart={(session) =>
              setConsumptionDialog({ session, view: 'cart' })
            }
          />
        )}
      </Main>

      {sessionToClose && (
        <SessionCloseDialog
          open={!!sessionToClose}
          onOpenChange={(open) => {
            if (!open) setSessionToClose(null)
          }}
          session={sessionToClose}
        />
      )}

      {consumptionDialog && (
        <SessionConsumptionDialog
          open={!!consumptionDialog}
          onOpenChange={(open) => {
            if (!open) setConsumptionDialog(null)
          }}
          session={consumptionDialog.session}
          initialView={consumptionDialog.view}
        />
      )}
    </>
  )
}
