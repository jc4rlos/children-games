import { createFileRoute } from '@tanstack/react-router'
import { CategoryCreate } from '@/features/product-categories/category-create'

export const Route = createFileRoute('/_authenticated/product-categories/new')({
  component: CategoryCreate,
})
