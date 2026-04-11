import { useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button } from '@boilerplate/ui'
import { PlusCircle } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ProductDeleteDialog } from './components/product-delete-dialog'
import { ProductsTable } from './components/products-table'
import { ProductsTableSkeleton } from './components/products-table-skeleton'
import { type Product } from './data/schema'
import { useCategoriesForProduct, useProducts } from './hooks/use-products'

const route = getRouteApi('/_authenticated/products/')

export const Products = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const { data, isLoading, isError, error } = useProducts({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
    categoryId: search.categoryId,
    isActive: search.isActive,
  })

  const { data: categories = [] } = useCategoriesForProduct()

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Productos</h2>
            <p className='text-muted-foreground'>
              Administra los productos disponibles.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/products/new' })}
            className='space-x-1'
          >
            <span>Nuevo Producto</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar productos: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <ProductsTableSkeleton />
        ) : (
          <ProductsTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setProductToDelete}
            categories={categories}
          />
        )}
      </Main>

      {productToDelete && (
        <ProductDeleteDialog
          open={!!productToDelete}
          onOpenChange={(open) => {
            if (!open) setProductToDelete(null)
          }}
          product={productToDelete}
        />
      )}
    </>
  )
}
