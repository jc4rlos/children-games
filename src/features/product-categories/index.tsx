import { useState } from 'react'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button } from '@boilerplate/ui'
import { PlusCircle } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { CategoriesTable } from './components/categories-table'
import { CategoriesTableSkeleton } from './components/categories-table-skeleton'
import { CategoryDeleteDialog } from './components/category-delete-dialog'
import { type ProductCategory } from './data/schema'
import { useCategories } from './hooks/use-categories'

const route = getRouteApi('/_authenticated/product-categories/')

export const ProductCategories = () => {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const rootNavigate = useNavigate()
  const [categoryToDelete, setCategoryToDelete] =
    useState<ProductCategory | null>(null)

  const { data, isLoading, isError, error } = useCategories({
    page: search.page ?? 1,
    pageSize: search.pageSize ?? 10,
    name: search.name,
  })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Categorías de Productos
            </h2>
            <p className='text-muted-foreground'>
              Administra las categorías de productos aquí.
            </p>
          </div>
          <Button
            onClick={() => rootNavigate({ to: '/product-categories/new' })}
            className='space-x-1'
          >
            <span>Nueva Categoría</span>
            <PlusCircle size={18} />
          </Button>
        </div>

        {isError && (
          <p className='text-sm text-destructive'>
            Error al cargar categorías: {(error as Error).message}
          </p>
        )}

        {isLoading ? (
          <CategoriesTableSkeleton />
        ) : (
          <CategoriesTable
            data={data?.data ?? []}
            total={data?.total ?? 0}
            search={search}
            navigate={navigate}
            onDelete={setCategoryToDelete}
          />
        )}
      </Main>

      {categoryToDelete && (
        <CategoryDeleteDialog
          open={!!categoryToDelete}
          onOpenChange={(open) => {
            if (!open) setCategoryToDelete(null)
          }}
          category={categoryToDelete}
        />
      )}
    </>
  )
}
