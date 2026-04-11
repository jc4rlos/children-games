import { createFileRoute } from '@tanstack/react-router'
import { CouponEdit } from '@/features/coupons/coupon-edit'

export const Route = createFileRoute('/_authenticated/coupons/$couponId/edit')({
  component: CouponEdit,
})
