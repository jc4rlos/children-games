import { createFileRoute } from '@tanstack/react-router'
import { ProductCreate } from '@/features/products/product-create'

export const Route = createFileRoute('/_authenticated/products/new')({
  component: ProductCreate,
})
