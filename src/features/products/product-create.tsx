import { Button, Skeleton } from '@boilerplate/ui'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { ProductForm } from './components/product-form'
import type { ProductFormValues } from './data/schema'
import {
  useBranchesForProduct,
  useCategoriesForProduct,
  useCreateProduct,
} from './hooks/use-products'

export const ProductCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateProduct()
  const { data: branches = [], isLoading: loadingBranches } =
    useBranchesForProduct()
  const { data: categories = [], isLoading: loadingCategories } =
    useCategoriesForProduct()

  const handleSubmit = (values: ProductFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/products' }),
    })
  }

  const handleCancel = () => navigate({ to: '/products' })

  const isLoadingSelects = loadingBranches || loadingCategories

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
          <h2 className='text-2xl font-bold tracking-tight'>Nuevo Producto</h2>
          <p className='text-muted-foreground'>
            Completa los datos para crear un producto.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        {isLoadingSelects ? (
          <div className='space-y-4'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        ) : (
          <ProductForm
            defaultValues={{
              branchId: null,
              categoryId: 0,
              name: '',
              price: 0,
              stock: 0,
              imageUrl: '',
              isActive: true,
            }}
            branches={branches}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={createMutation.isPending}
            submitLabel='Crear Producto'
          />
        )}
      </div>
    </Main>
  )
}
