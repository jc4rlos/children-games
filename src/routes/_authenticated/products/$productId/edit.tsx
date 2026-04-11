import { createFileRoute } from '@tanstack/react-router'
import { ProductEdit } from '@/features/products/product-edit'

export const Route = createFileRoute(
  '/_authenticated/products/$productId/edit'
)({
  component: ProductEdit,
})
