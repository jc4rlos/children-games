import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ProductCategories } from '@/features/product-categories'

const searchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  name: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/product-categories/')({
  validateSearch: searchSchema,
  component: ProductCategories,
})
