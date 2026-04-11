import { createFileRoute } from '@tanstack/react-router'
import { PricingEdit } from '@/features/pricing/pricing-edit'

export const Route = createFileRoute('/_authenticated/pricing/$pricingId/edit')(
  {
    component: PricingEdit,
  }
)
