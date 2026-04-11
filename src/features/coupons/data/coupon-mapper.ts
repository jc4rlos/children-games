import type { Database } from '@/lib/database.types'
import type { Coupon, CouponFormValues } from './schema'

type DbCoupon = Database['public']['Tables']['coupon']['Row']
type DbCouponInsert = Database['public']['Tables']['coupon']['Insert']
type DbCouponUpdate = Database['public']['Tables']['coupon']['Update']

export type DbCouponWithBranch = DbCoupon & {
  branch: { name: string } | null
}

const parseMaxUses = (value: string | undefined): number | null => {
  if (!value?.trim()) return null
  const num = parseInt(value.trim(), 10)
  return Number.isNaN(num) ? null : num
}

export const toCoupon = (row: DbCouponWithBranch): Coupon => ({
  id: row.id,
  branchId: row.branch_id,
  branchName: row.branch?.name ?? null,
  code: row.code,
  description: row.description,
  discountType: row.discount_type,
  discountValue: row.discount_value,
  maxUses: row.max_uses,
  usesCount: row.uses_count,
  validFrom: row.valid_from,
  validUntil: row.valid_until,
  isActive: row.is_active,
})

export const toDbInsert = (values: CouponFormValues): DbCouponInsert => ({
  branch_id: values.branchId ?? null,
  code: values.code.toUpperCase().trim(),
  description: values.description || null,
  discount_type: values.discountType,
  discount_value: values.discountValue,
  max_uses: parseMaxUses(values.maxUses),
  valid_from: values.validFrom,
  valid_until: values.validUntil || null,
  is_active: values.isActive,
  created_by: 'system',
})

export const toDbUpdate = (values: CouponFormValues): DbCouponUpdate => ({
  branch_id: values.branchId ?? null,
  code: values.code.toUpperCase().trim(),
  description: values.description || null,
  discount_type: values.discountType,
  discount_value: values.discountValue,
  max_uses: parseMaxUses(values.maxUses),
  valid_from: values.validFrom,
  valid_until: values.validUntil || null,
  is_active: values.isActive,
  updated_at: new Date().toISOString(),
})
