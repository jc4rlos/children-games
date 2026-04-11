import { type Database } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { toGuardian, toDbInsert, toDbUpdate } from './guardian-mapper'
import { type Guardian, type GuardianFormValues } from './schema'

type DbGuardian = Database['public']['Tables']['guardian']['Row']

const SELECT_FIELDS = 'id, full_name, document_number, phone, email'

export type GuardiansParams = {
  page: number
  pageSize: number
  name?: string
  documentNumber?: string
}

export type PaginatedGuardians = {
  data: Guardian[]
  total: number
}

export type GuardianOption = {
  id: number
  fullName: string
  documentNumber: string
}

export const getGuardians = async (
  params: GuardiansParams
): Promise<PaginatedGuardians> => {
  const { page, pageSize, name, documentNumber } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('guardian')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('full_name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('full_name', `%${name}%`)
  if (documentNumber)
    query = query.ilike('document_number', `%${documentNumber}%`)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return { data: (data as DbGuardian[]).map(toGuardian), total: count ?? 0 }
}

export const getGuardianById = async (id: number): Promise<Guardian> => {
  const { data, error } = await supabase
    .from('guardian')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toGuardian(data as DbGuardian)
}

export const getGuardiansForSelect = async (): Promise<GuardianOption[]> => {
  const { data, error } = await supabase
    .from('guardian')
    .select('id, full_name, document_number')
    .is('deleted_at', null)
    .order('full_name', { ascending: true })

  if (error) throw new Error(error.message)
  return (data as Pick<DbGuardian, 'id' | 'full_name' | 'document_number'>[]).map((g) => ({
    id: g.id,
    fullName: g.full_name,
    documentNumber: g.document_number,
  }))
}

export const createGuardian = async (
  values: GuardianFormValues
): Promise<Guardian> => {
  const { data, error } = await supabase
    .from('guardian')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toGuardian(data as DbGuardian)
}

export const updateGuardian = async (
  id: number,
  values: GuardianFormValues
): Promise<Guardian> => {
  const { data, error } = await supabase
    .from('guardian')
    .update(toDbUpdate(values))
    .eq('id', id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toGuardian(data as DbGuardian)
}

export const deleteGuardian = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('guardian')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw new Error(error.message)
}
