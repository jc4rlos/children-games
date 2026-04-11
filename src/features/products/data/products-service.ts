import { supabase } from '@/lib/supabase'
import {
  toDbInsert,
  toDbUpdate,
  toProduct,
  type DbProductWithRelations,
} from './product-mapper'
import { type Product, type ProductFormValues } from './schema'

const SELECT_FIELDS =
  'id, branch_id, category_id, name, price, stock, image_url, is_active, product_category(name), branch(name)'

export type ProductsParams = {
  page: number
  pageSize: number
  name?: string
  categoryId?: string[]
  isActive?: string[]
}

export type PaginatedProducts = {
  data: Product[]
  total: number
}

export const getProducts = async (
  params: ProductsParams
): Promise<PaginatedProducts> => {
  const { page, pageSize, name, categoryId, isActive } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('product')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('name', `%${name}%`)
  if (categoryId?.length)
    query = query.in('category_id', categoryId.map(Number))
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (data as unknown as DbProductWithRelations[]).map(toProduct),
    total: count ?? 0,
  }
}

export const getProductById = async (id: number): Promise<Product> => {
  const { data, error } = await supabase
    .from('product')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toProduct(data as unknown as DbProductWithRelations)
}

export const createProduct = async (
  values: ProductFormValues
): Promise<Product> => {
  const { data, error } = await supabase
    .from('product')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toProduct(data as unknown as DbProductWithRelations)
}

export const updateProduct = async (
  id: number,
  values: ProductFormValues
): Promise<Product> => {
  const { data, error } = await supabase
    .from('product')
    .update(toDbUpdate(values))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toProduct(data as unknown as DbProductWithRelations)
}

export const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase.from('product').delete().eq('id', id)

  if (error) throw new Error(error.message)
}

export type ProductOption = {
  id: number
  name: string
  price: number
  stock: number
  categoryName: string
}

export const getProductsForSelect = async (
  branchId?: number
): Promise<ProductOption[]> => {
  let query = supabase
    .from('product')
    .select('id, name, price, stock, product_category(name)')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (branchId != null) {
    query = query.or(`branch_id.eq.${branchId},branch_id.is.null`)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)

  return (data as unknown as DbProductWithRelations[]).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    categoryName: p.product_category?.name ?? '',
  }))
}
