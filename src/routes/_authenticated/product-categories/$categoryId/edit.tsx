import { createFileRoute } from '@tanstack/react-router'
import { CategoryEdit } from '@/features/product-categories/category-edit'

export const Route = createFileRoute(
  '/_authenticated/product-categories/$categoryId/edit'
)({
  component: CategoryEdit,
})
