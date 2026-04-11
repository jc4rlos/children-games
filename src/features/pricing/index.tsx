import { useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button } from '@boilerplate/ui'
import { PlusCircle } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { PricingDeleteDialog } from './components/pricing-delete-dialog'
import { PricingTable } from './components/pricing-table'
import { PricingTableSkeleton } from './components/pricing-table-skeleton'
import { type PricingConfig } from './data/schema'
import { useBranchesForPricing, usePricingConfigs } from './hooks/use-pricing'

const route = getRouteApi('/_authenticated/pricing/')

export const Pricing = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [configToDelete, setConfigToDelete] = useState<PricingConfig | null>(null)

  const { data, isLoading, isError, error } = usePricingConfigs({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    branchId: search.branchId,
  })

  const { data: branches = [] } = useBranchesForPricing()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Precios</h2>
            <p className='text-muted-foreground'>
              Administra las configuraciones de precio por sucursal.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/pricing/new' })}
            className='space-x-1'
          >
            <span>Nueva Configuración</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar precios: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <PricingTableSkeleton />
        ) : (
          <PricingTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setConfigToDelete}
            branches={branches}
          />
        )}
      </Main>

      {configToDelete && (
        <PricingDeleteDialog
          open={!!configToDelete}
          onOpenChange={(open) => {
            if (!open) setConfigToDelete(null)
          }}
          config={configToDelete}
        />
      )}
    </>
  )
}
