import { supabase } from '@/lib/supabase'

export type ChildPublicInfo = {
  id: number
  fullName: string
  avatar: string | null
  gender: 'MALE' | 'FEMALE'
  birthDate: string
  code: string
  branchName: string
}

export type ActiveSessionInfo = {
  id: number
  checkIn: string
  scheduledCheckout: string | null
  pricePerHour: number
  minimumCharge: number
  isFreeSession: boolean
  couponCode: string | null
}

export type SessionHistoryItem = {
  id: number
  checkIn: string
  checkOut: string | null
  minutesPlayed: number | null
  totalAmount: number | null
  status: 'CLOSED' | 'FREE'
  isFreeSession: boolean
}

export const getChildByCode = async (
  code: string
): Promise<ChildPublicInfo | null> => {
  const { data } = await supabase
    .from('child')
    .select('id, full_name, avatar, gender, birth_date, code, branch(name)')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .is('deleted_at', null)
    .maybeSingle()

  if (!data) return null

  const row = data as typeof data & { branch: { name: string } }
  return {
    id: row.id,
    fullName: row.full_name,
    avatar: row.avatar,
    gender: row.gender as 'MALE' | 'FEMALE',
    birthDate: row.birth_date,
    code: row.code,
    branchName: row.branch.name,
  }
}

export const getActiveSession = async (
  childId: number
): Promise<ActiveSessionInfo | null> => {
  const { data } = await supabase
    .from('play_session')
    .select(
      'id, check_in, scheduled_checkout, is_free_session, coupon(code), pricing_config(price_per_hour, minimum_charge)'
    )
    .eq('child_id', childId)
    .eq('status', 'ACTIVE')
    .is('deleted_at', null)
    .maybeSingle()

  if (!data) return null

  const row = data as typeof data & {
    pricing_config: { price_per_hour: number; minimum_charge: number }
    coupon: { code: string } | null
  }

  return {
    id: row.id,
    checkIn: row.check_in,
    scheduledCheckout:
      (row as { scheduled_checkout?: string | null }).scheduled_checkout ??
      null,
    pricePerHour: row.pricing_config.price_per_hour,
    minimumCharge: row.pricing_config.minimum_charge,
    isFreeSession: row.is_free_session,
    couponCode: row.coupon?.code ?? null,
  }
}

export const getSessionHistory = async (
  childId: number,
  page = 1,
  pageSize = 10
): Promise<{ data: SessionHistoryItem[]; total: number }> => {
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count } = await supabase
    .from('play_session')
    .select(
      'id, check_in, check_out, minutes_played, total_amount, status, is_free_session',
      { count: 'exact' }
    )
    .eq('child_id', childId)
    .in('status', ['CLOSED', 'FREE'])
    .is('deleted_at', null)
    .order('check_in', { ascending: false })
    .range(from, to)

  return {
    data: (data ?? []).map((row) => ({
      id: row.id,
      checkIn: row.check_in,
      checkOut: row.check_out,
      minutesPlayed: row.minutes_played,
      totalAmount: row.total_amount,
      status: row.status as 'CLOSED' | 'FREE',
      isFreeSession: row.is_free_session,
    })),
    total: count ?? 0,
  }
}
