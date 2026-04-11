import { type Database } from '@/lib/database.types'
import { type PricingConfig, type PricingConfigFormValues } from './schema'

type DbPricingConfig = Database['public']['Tables']['pricing_config']['Row']
type DbPricingConfigInsert =
  Database['public']['Tables']['pricing_config']['Insert']
type DbPricingConfigUpdate =
  Database['public']['Tables']['pricing_config']['Update']

export type DbPricingConfigWithBranch = DbPricingConfig & {
  branch: { name: string }
}

const toTimestamp = (value: string | undefined): string | null => {
  if (!value) return null
  return new Date(value).toISOString()
}

export const toDatetimeLocal = (iso: string): string => iso.slice(0, 16)

export const toPricingConfig = (
  row: DbPricingConfigWithBranch
): PricingConfig => ({
  id: row.id,
  branchId: row.branch_id,
  branchName: row.branch.name,
  pricePerHour: row.price_per_hour,
  minimumCharge: row.minimum_charge,
  validFrom: row.valid_from,
  validUntil: row.valid_until,
  description: row.description,
})

export const toDbInsert = (
  values: PricingConfigFormValues
): DbPricingConfigInsert => ({
  branch_id: values.branchId,
  price_per_hour: values.pricePerHour,
  minimum_charge: values.minimumCharge,
  valid_from: toTimestamp(values.validFrom) ?? new Date().toISOString(),
  valid_until: toTimestamp(values.validUntil),
  description: values.description ?? null,
  created_by: 'system',
})

export const toDbUpdate = (
  values: PricingConfigFormValues
): DbPricingConfigUpdate => ({
  branch_id: values.branchId,
  price_per_hour: values.pricePerHour,
  minimum_charge: values.minimumCharge,
  valid_from: toTimestamp(values.validFrom) ?? new Date().toISOString(),
  valid_until: toTimestamp(values.validUntil),
  description: values.description ?? null,
  updated_at: new Date().toISOString(),
})
