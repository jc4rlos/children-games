import { type Database } from '@/lib/database.types'
import { type Product, type ProductFormValues } from './schema'

type DbProduct = Database['public']['Tables']['product']['Row']
type DbProductInsert = Database['public']['Tables']['product']['Insert']
type DbProductUpdate = Database['public']['Tables']['product']['Update']

export type DbProductWithRelations = DbProduct & {
  product_category: { name: string } | null
  branch: { name: string } | null
}

export const toProduct = (row: DbProductWithRelations): Product => ({
  id: row.id,
  branchId: row.branch_id,
  branchName: row.branch?.name ?? null,
  categoryId: row.category_id,
  categoryName: row.product_category?.name ?? '',
  name: row.name,
  price: row.price,
  stock: row.stock,
  imageUrl: row.image_url,
  isActive: row.is_active,
})

export const toDbInsert = (values: ProductFormValues): DbProductInsert => ({
  branch_id: values.branchId ?? null,
  category_id: values.categoryId,
  name: values.name,
  price: values.price,
  stock: values.stock ?? 0,
  image_url: values.imageUrl || null,
  is_active: values.isActive,
  created_by: 'system',
})

export const toDbUpdate = (values: ProductFormValues): DbProductUpdate => ({
  branch_id: values.branchId ?? null,
  category_id: values.categoryId,
  name: values.name,
  price: values.price,
  stock: values.stock ?? 0,
  image_url: values.imageUrl || null,
  is_active: values.isActive,
})
