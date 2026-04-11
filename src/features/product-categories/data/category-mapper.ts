import { type Database } from '@/lib/database.types'
import { type ProductCategory, type ProductCategoryFormValues } from './schema'

type DbProductCategory = Database['public']['Tables']['product_category']['Row']
type DbProductCategoryInsert =
  Database['public']['Tables']['product_category']['Insert']
type DbProductCategoryUpdate =
  Database['public']['Tables']['product_category']['Update']

export const toProductCategory = (row: DbProductCategory): ProductCategory => ({
  id: row.id,
  name: row.name,
  isActive: row.is_active,
})

export const toDbInsert = (
  values: ProductCategoryFormValues
): DbProductCategoryInsert => ({
  name: values.name,
  is_active: values.isActive,
  created_by: 'system',
})

export const toDbUpdate = (
  values: ProductCategoryFormValues
): DbProductCategoryUpdate => ({
  name: values.name,
  is_active: values.isActive,
})
