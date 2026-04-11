import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Coupons } from '@/features/coupons'

const couponsSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  code: z.string().optional().catch(''),
  discountType: z.array(z.string()).optional().catch([]),
  isActive: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/coupons/')({
  validateSearch: couponsSearchSchema,
  component: Coupons,
})
