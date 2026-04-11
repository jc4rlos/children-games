import { Button, Skeleton } from '@boilerplate/ui'
import { getRouteApi, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ProductForm } from './components/product-form'
import type { ProductFormValues } from './data/schema'
import {
  useBranchesForProduct,
  useCategoriesForProduct,
  useProduct,
  useUpdateProduct,
} from './hooks/use-products'

const route = getRouteApi('/_authenticated/products/$productId/edit')

export const ProductEdit = () => {
  const { productId } = route.useParams()
  const id = Number(productId)
  const navigate = useNavigate()
  const updateMutation = useUpdateProduct()

  const { data: product, isLoading, isError } = useProduct(id)
  const { data: branches = [], isLoading: loadingBranches } =
    useBranchesForProduct()
  const { data: categories = [], isLoading: loadingCategories } =
    useCategoriesForProduct()

  const handleSubmit = (values: ProductFormValues) => {
    updateMutation.mutate(
      { id, values },
      { onSuccess: () => navigate({ to: '/products' }) }
    )
  }

  const handleCancel = () => navigate({ to: '/products' })

  const isLoadingData = isLoading || loadingBranches || loadingCategories

  return (
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
          <h2 className='text-2xl font-bold tracking-tight'>Editar Producto</h2>
          <p className='text-muted-foreground'>
            Actualiza los datos del producto.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        {isLoadingData && (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        )}

        {isError && (
          <p className='text-sm text-destructive'>
            No se pudo cargar el producto.
          </p>
        )}

        {product && !isLoadingData && (
          <ProductForm
            defaultValues={{
              branchId: product.branchId,
              categoryId: product.categoryId,
              name: product.name,
              price: product.price,
              stock: product.stock,
              imageUrl: product.imageUrl ?? '',
              isActive: product.isActive,
            }}
            branches={branches}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={updateMutation.isPending}
            submitLabel='Guardar Cambios'
          />
        )}
      </div>
    </Main>
  )
}
