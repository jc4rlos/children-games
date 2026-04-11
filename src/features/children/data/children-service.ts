import type { Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import {
  toChild,
  toChildWithLoyalty,
  toDbInsert,
  toDbUpdate,
} from './child-mapper'
import type { Child, ChildFormValues } from './schema'

type DbChild = Database['public']['Tables']['child']['Row']
type DbBranch = Database['public']['Tables']['branch']['Row']

const SELECT_FIELDS =
  'id, guardian_id, branch_id, full_name, gender, avatar, birth_date, code, notes, is_active'

const SELECT_FIELDS_WITH_LOYALTY =
  'id, guardian_id, branch_id, full_name, gender, avatar, birth_date, code, notes, is_active, loyalty_card(stamps_count, stamps_required, free_sessions)'

export type ChildrenParams = {
  page: number
  pageSize: number
  name?: string
  gender?: string[]
  isActive?: string[]
}

export type PaginatedChildren = {
  data: Child[]
  total: number
}

export type BranchOption = {
  id: number
  name: string
}

export const getChildren = async (
  params: ChildrenParams
): Promise<PaginatedChildren> => {
  const { page, pageSize, name, gender, isActive } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('child')
    .select(SELECT_FIELDS_WITH_LOYALTY, { count: 'exact' })
    .is('deleted_at', null)
    .order('full_name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('full_name', `%${name}%`)
  if (gender?.length)
    query = query.in('gender', gender as ('MALE' | 'FEMALE')[])
  if (isActive?.length === 1)
    query = query.eq('is_active', isActive[0] === 'true')

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (
      data as (DbChild & {
        loyalty_card: {
          stamps_count: number
          stamps_required: number
          free_sessions: number
        } | null
      })[]
    ).map(toChildWithLoyalty),
    total: count ?? 0,
  }
}

export const getChildById = async (id: number): Promise<Child> => {
  const { data, error } = await supabase
    .from('child')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toChild(data as DbChild)
}

export const createChild = async (values: ChildFormValues): Promise<Child> => {
  const { data, error } = await supabase
    .from('child')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toChild(data as DbChild)
}

export const updateChild = async (
  id: number,
  values: ChildFormValues
): Promise<Child> => {
  const { data: existing, error: fetchError } = await supabase
    .from('child')
    .select('code')
    .eq('id', id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const { data, error } = await supabase
    .from('child')
    .update(toDbUpdate(values, (existing as { code: string }).code))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toChild(data as DbChild)
}

export const deleteChild = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('child')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}

export const getBranchesForSelect = async (): Promise<BranchOption[]> => {
  const { data, error } = await supabase
    .from('branch')
    .select('id, name')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as Pick<DbBranch, 'id' | 'name'>[]).map((b) => ({
    id: b.id,
    name: b.name,
  }))
}
