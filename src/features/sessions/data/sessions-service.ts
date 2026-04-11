import { supabase } from '@/lib/supabase'
import { type PlaySession, type SessionFormValues } from './schema'
import {
  toDbClose,
  toDbInsert,
  toPlaySession,
  type DbPlaySessionWithRelations,
} from './session-mapper'

const SELECT_FIELDS = [
  'id, branch_id, child_id, pricing_id, coupon_id, registered_by, closed_by',
  'status, is_free_session, check_in, check_out, scheduled_checkout',
  'minutes_played, play_subtotal, products_subtotal, discount_amount, total_amount, notes',
  'child(full_name, avatar, gender, birth_date, code)',
  'branch(name)',
  'pricing_config(price_per_hour, minimum_charge)',
  'coupon(code)',
  'registeredEmployee:employee!play_session_registered_by_fkey(first_name, last_name)',
  'session_consumption(id, subtotal)',
].join(', ')

export type SessionsParams = {
  page: number
  pageSize: number
  date?: string
  status?: string[]
}

export type PaginatedSessions = {
  data: PlaySession[]
  total: number
}

export type PricingOption = {
  id: number
  pricePerHour: number
  minimumCharge: number
  label: string
}

export type CouponOption = {
  id: number
  code: string
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
}

export type EmployeeOption = {
  id: number
  name: string
}

export type ChildSelectOption = {
  id: number
  fullName: string
  avatar: string | null
  gender: 'MALE' | 'FEMALE'
  birthDate: string
  code: string
  branchId: number
}

export const getSessions = async (
  params: SessionsParams
): Promise<PaginatedSessions> => {
  const { page, pageSize, date, status } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('play_session')
    .select(SELECT_FIELDS, { count: 'exact' })
    .is('deleted_at', null)
    .order('check_in', { ascending: false })
    .range(from, to)

  if (date) {
    query = query
      .gte('check_in', `${date}T00:00:00`)
      .lte('check_in', `${date}T23:59:59.999`)
  }

  if (status?.length) {
    query = query.in('status', status as ('ACTIVE' | 'CLOSED' | 'FREE')[])
  }

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (data as unknown as DbPlaySessionWithRelations[]).map(toPlaySession),
    total: count ?? 0,
  }
}

export const getSessionById = async (id: number): Promise<PlaySession> => {
  const { data, error } = await supabase
    .from('play_session')
    .select(SELECT_FIELDS)
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return toPlaySession(data as unknown as DbPlaySessionWithRelations)
}

export const createSession = async (
  values: SessionFormValues
): Promise<PlaySession> => {
  const { data, error } = await supabase
    .from('play_session')
    .insert(toDbInsert(values))
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toPlaySession(data as unknown as DbPlaySessionWithRelations)
}

export const closeSession = async (
  session: PlaySession
): Promise<PlaySession> => {
  const { data, error } = await supabase
    .from('play_session')
    .update(toDbClose(session))
    .eq('id', session.id)
    .select(SELECT_FIELDS)
    .single()

  if (error) throw new Error(error.message)
  return toPlaySession(data as unknown as DbPlaySessionWithRelations)
}

export const getPricingConfigsForBranch = async (
  branchId: number
): Promise<PricingOption[]> => {
  const { data, error } = await supabase
    .from('pricing_config')
    .select(
      'id, price_per_hour, minimum_charge, valid_from, valid_until, description'
    )
    .is('deleted_at', null)
    .eq('branch_id', branchId)
    .order('valid_from', { ascending: false })

  if (error) throw new Error(error.message)

  return (
    data as {
      id: number
      price_per_hour: number
      minimum_charge: number
      valid_from: string
      valid_until: string | null
      description: string | null
    }[]
  ).map((p) => ({
    id: p.id,
    pricePerHour: p.price_per_hour,
    minimumCharge: p.minimum_charge,
    label: `S/ ${p.price_per_hour} ${p.description ?? ''}`,
  }))
}

export const getCouponsForBranch = async (
  branchId: number
): Promise<CouponOption[]> => {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('coupon')
    .select('id, code, discount_type, discount_value')
    .is('deleted_at', null)
    .eq('is_active', true)
    .lte('valid_from', today)
    .or(`branch_id.eq.${branchId},branch_id.is.null`)
    .order('code', { ascending: true })

  if (error) throw new Error(error.message)

  return (
    data as {
      id: number
      code: string
      discount_type: 'PERCENTAGE' | 'FIXED_AMOUNT'
      discount_value: number
    }[]
  ).map((c) => ({
    id: c.id,
    code: c.code,
    discountType: c.discount_type,
    discountValue: c.discount_value,
  }))
}

export const getEmployeesForSelect = async (): Promise<EmployeeOption[]> => {
  const { data, error } = await supabase
    .from('employee')
    .select('id, first_name, last_name')
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('first_name', { ascending: true })

  if (error) throw new Error(error.message)

  return (data as { id: number; first_name: string; last_name: string }[]).map(
    (e) => ({ id: e.id, name: `${e.first_name} ${e.last_name}` })
  )
}

export const getChildrenForSessionPicker = async (params: {
  name?: string
  page?: number
  pageSize?: number
}): Promise<{ data: ChildSelectOption[]; total: number }> => {
  const { name, page = 1, pageSize = 8 } = params
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('child')
    .select('id, full_name, avatar, gender, birth_date, code, branch_id', {
      count: 'exact',
    })
    .is('deleted_at', null)
    .eq('is_active', true)
    .order('full_name', { ascending: true })
    .range(from, to)

  if (name) query = query.ilike('full_name', `%${name}%`)

  const { data, error, count } = await query
  if (error) throw new Error(error.message)

  return {
    data: (
      data as {
        id: number
        full_name: string
        avatar: string | null
        gender: 'MALE' | 'FEMALE'
        birth_date: string
        code: string
        branch_id: number
      }[]
    ).map((c) => ({
      id: c.id,
      fullName: c.full_name,
      avatar: c.avatar,
      gender: c.gender,
      birthDate: c.birth_date,
      code: c.code,
      branchId: c.branch_id,
    })),
    total: count ?? 0,
  }
}
