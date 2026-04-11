import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { Button, Skeleton } from '@boilerplate/ui'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { CategoryForm } from './components/category-form'
import { type ProductCategoryFormValues } from './data/schema'
import { useCategoryById, useUpdateCategory } from './hooks/use-categories'

const route = getRouteApi('/_authenticated/product-categories/$categoryId/edit')

export const CategoryEdit = () => {
  const { categoryId } = route.useParams()
  const id = Number(categoryId)
  const navigate = useNavigate()
  const updateMutation = useUpdateCategory()

  const { data: category, isLoading, isError } = useCategoryById(id)

  const handleSubmit = (values: ProductCategoryFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/product-categories' }) }
    )
  }

  const handleCancel = () => navigate({ to: '/product-categories' })

  return (
    <>
      <Main className='flex flex-1 flex-col gap-6'>
        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleCancel}
            aria-label='Volver'
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Editar Categoría
            </h2>
            <p className='text-muted-foreground'>
              Actualiza los datos de la categoría.
            </p>
          </div>
        </div>

        <div className='max-w-2xl'>
          {isLoading && (
            <div className='space-y-4'>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-10 w-full' />
            </div>
          )}

          {isError && (
            <p className='text-sm text-destructive'>
              No se pudo cargar la categoría.
            </p>
          )}

          {category && (
            <CategoryForm
              defaultValues={{
                name: category.name,
                isActive: category.isActive,
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isPending={updateMutation.isPending}
              submitLabel='Guardar Cambios'
            />
          )}
        </div>
      </Main>
    </>
  )
}
