import { Button } from '@boilerplate/ui'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Main } from '@/components/layout/main'
import { CategoryForm } from './components/category-form'
import type { ProductCategoryFormValues } from './data/schema'
import { useCreateCategory } from './hooks/use-categories'

export const CategoryCreate = () => {
  const navigate = useNavigate()
  const createMutation = useCreateCategory()

  const handleSubmit = (values: ProductCategoryFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => navigate({ to: '/product-categories' }),
    })
  }

  const handleCancel = () => navigate({ to: '/product-categories' })

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
          <h2 className='text-2xl font-bold tracking-tight'>Nueva Categoría</h2>
          <p className='text-muted-foreground'>
            Completa los datos para crear una categoría de producto.
          </p>
        </div>
      </div>

      <div className='max-w-2xl'>
        <CategoryForm
          defaultValues={{
            name: '',
            isActive: true,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={createMutation.isPending}
          submitLabel='Crear Categoría'
        />
      </div>
    </Main>
  )
}
