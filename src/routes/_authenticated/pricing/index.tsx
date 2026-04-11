import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'
import { Pricing } from '@/features/pricing'

const pricingSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  branchId: z.array(z.string()).optional().catch([]),
})

export const Route = createFileRoute('/_authenticated/pricing/')({
  validateSearch: pricingSearchSchema,
  component: Pricing,
})
