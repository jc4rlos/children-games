import { createFileRoute } from '@tanstack/react-router'
import { CouponCreate } from '@/features/coupons/coupon-create'

export const Route = createFileRoute('/_authenticated/coupons/new')({
  component: CouponCreate,
})
