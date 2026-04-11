import type { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { toDbInsert, toDbUpdate, toProductCategory } from './category-mapper'
import type { ProductCategory, ProductCategoryFormValues } from './schema'

type DbProductCategory = Database['public']['Tables']['product_category']['Row']

const SELECT_FIELDS = 'id, name, is_active'

export type CategoriesParams = {
  page: number
  pageSize: number
  name?: string
}

export type PaginatedCategories = {
  data: ProductCategory[]
  total: number
}

export const getCategories = async (
  params: CategoriesParams
): Promise<PaginatedCategories> => {
  const { page, pageSize, name } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('product_category')
    .select(SELECT_FIELDS, { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('name', `%${name}%`)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (data as DbProductCategory[]).map(toProductCategory),
    total: count ?? 0,
  }
}

export const getCategoryById = async (id: number): Promise<ProductCategory> => {
  const { data, error } = await supabase
    .from('product_category')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toProductCategory(data as DbProductCategory)
}

export const createCategory = async (
  values: ProductCategoryFormValues
): Promise<ProductCategory> => {
  const { data, error } = await supabase
    .from('product_category')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toProductCategory(data as DbProductCategory)
}

export const updateCategory = async (
  id: number,
  values: ProductCategoryFormValues
): Promise<ProductCategory> => {
  const { data, error } = await supabase
    .from('product_category')
    .update(toDbUpdate(values))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toProductCategory(data as DbProductCategory)
}

export const deleteCategory = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('product_category')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export type CategoryOption = {
  id: number
  name: string
}

export const getCategoriesForSelect = async (): Promise<CategoryOption[]> => {
  const { data, error } = await supabase
    .from('product_category')
    .select('id, name')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as Pick<DbProductCategory, 'id' | 'name'>[]).map((c) => ({
    id: c.id,
    name: c.name,
  }))
}
