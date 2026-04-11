import { supabase } from '@/lib/supabase'
import {
  toCoupon,
  toDbInsert,
  toDbUpdate,
  type DbCouponWithBranch,
} from './coupon-mapper'
import { type Coupon, type CouponFormValues } from './schema'

const SELECT_FIELDS =
  'id, branch_id, code, description, discount_type, discount_value, max_uses, uses_count, valid_from, valid_until, is_active, branch(name)'

export type CouponsParams = {
  page: number
  pageSize: number
  code?: string
  discountType?: string[]
  isActive?: string[]
}

export type PaginatedCoupons = {
  data: Coupon[]
  total: number
}

export const getCoupons = async (
  params: CouponsParams
): Promise<PaginatedCoupons> => {
  const { page, pageSize, code, discountType, isActive } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('coupon')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (code) query = query.ilike('code', `%${code}%`)
  if (discountType?.length)
    query = query.in('discount_type', discountType as ('PERCENTAGE' | 'FIXED_AMOUNT')[])
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (data as DbCouponWithBranch[]).map(toCoupon),
    total: count ?? 0,
  }
}

export const getCouponById = async (id: number): Promise<Coupon> => {
  const { data, error } = await supabase
    .from('coupon')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toCoupon(data as DbCouponWithBranch)
}

export const createCoupon = async (values: CouponFormValues): Promise<Coupon> => {
  const { data, error } = await supabase
    .from('coupon')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toCoupon(data as DbCouponWithBranch)
}

export const updateCoupon = async (
  id: number,
  values: CouponFormValues
): Promise<Coupon> => {
  const { data, error } = await supabase
    .from('coupon')
    .update(toDbUpdate(values))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toCoupon(data as DbCouponWithBranch)
}

export const deleteCoupon = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('coupon')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
