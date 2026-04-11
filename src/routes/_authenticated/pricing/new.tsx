import { createFileRoute } from '@tanstack/react-router'
import { PricingCreate } from '@/features/pricing/pricing-create'

export const Route = createFileRoute('/_authenticated/pricing/new')({
  component: PricingCreate,
})
