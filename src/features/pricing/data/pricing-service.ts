import { supabase } from '@/lib/supabase'
import {
  type DbPricingConfigWithBranch,
  toDbInsert,
  toDbUpdate,
  toPricingConfig,
} from './pricing-mapper'
import type { PricingConfig, PricingConfigFormValues } from './schema'

const SELECT_FIELDS =
  'id, branch_id, price_per_hour, minimum_charge, valid_from, valid_until, branch(name), description'

export type PricingParams = {
  page: number
  pageSize: number
  branchId?: string[]
}

export type PaginatedPricing = {
  data: PricingConfig[]
  total: number
}

export const getPricingConfigs = async (
  params: PricingParams
): Promise<PaginatedPricing> => {
  const { page, pageSize, branchId } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('pricing_config')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('valid_from', { ascending: false })
    .range(from, to)

  if (branchId?.length) query = query.in('branch_id', branchId.map(Number))

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (data as DbPricingConfigWithBranch[]).map(toPricingConfig),
    total: count ?? 0,
  }
}

export const getPricingConfigById = async (
  id: number
): Promise<PricingConfig> => {
  const { data, error } = await supabase
    .from('pricing_config')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toPricingConfig(data as DbPricingConfigWithBranch)
}

export const createPricingConfig = async (
  values: PricingConfigFormValues
): Promise<PricingConfig> => {
  const { data, error } = await supabase
    .from('pricing_config')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toPricingConfig(data as DbPricingConfigWithBranch)
}

export const updatePricingConfig = async (
  id: number,
  values: PricingConfigFormValues
): Promise<PricingConfig> => {
  const { data, error } = await supabase
    .from('pricing_config')
    .update(toDbUpdate(values))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toPricingConfig(data as DbPricingConfigWithBranch)
}

export const deletePricingConfig = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('pricing_config')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
