import { type Database } from '@/lib/database.types'
import { type PlaySession, type SessionFormValues } from './schema'

type DbPlaySession = Database['public']['Tables']['play_session']['Row']
type DbPlaySessionInsert = Database['public']['Tables']['play_session']['Insert']
type DbPlaySessionUpdate = Database['public']['Tables']['play_session']['Update']

export type DbPlaySessionWithRelations = DbPlaySession & {
  child: {
    full_name: string
    avatar: string | null
    gender: 'MALE' | 'FEMALE'
    birth_date: string
    code: string
  }
  branch: { name: string }
  pricing_config: { price_per_hour: number; minimum_charge: number }
  coupon: { code: string } | null
  registeredEmployee: { first_name: string; last_name: string }
  scheduled_checkout?: string | null
  session_consumption?: { id: number; subtotal: number }[]
}

export const toPlaySession = (row: DbPlaySessionWithRelations): PlaySession => ({
  id: row.id,
  branchId: row.branch_id,
  branchName: row.branch.name,
  childId: row.child_id,
  childName: row.child.full_name,
  childAvatar: row.child.avatar,
  childGender: row.child.gender,
  childBirthDate: row.child.birth_date,
  childCode: row.child.code,
  pricingId: row.pricing_id,
  pricePerHour: row.pricing_config.price_per_hour,
  minimumCharge: row.pricing_config.minimum_charge,
  couponId: row.coupon_id,
  couponCode: row.coupon?.code ?? null,
  registeredById: row.registered_by,
  registeredByName: `${row.registeredEmployee.first_name} ${row.registeredEmployee.last_name}`,
  status: row.status,
  isFreeSession: row.is_free_session,
  checkIn: row.check_in,
  checkOut: row.check_out,
  scheduledCheckout: row.scheduled_checkout ?? null,
  minutesPlayed: row.minutes_played,
  playSubtotal: row.play_subtotal,
  productsSubtotal: row.session_consumption?.length
    ? row.session_consumption.reduce((sum, c) => sum + c.subtotal, 0)
    : (row.products_subtotal ?? 0),
  discountAmount: row.discount_amount,
  totalAmount: row.total_amount,
  consumptionsCount: row.session_consumption?.length ?? 0,
  notes: row.notes,
})

export const toDbInsert = (values: SessionFormValues): DbPlaySessionInsert => {
  const checkIn = new Date()
  const scheduledCheckout = new Date(checkIn.getTime() + values.durationMinutes * 60_000)
  return {
    branch_id: values.branchId,
    child_id: values.childId,
    pricing_id: values.pricingId,
    coupon_id: values.couponId ?? null,
    registered_by: values.registeredById,
    status: 'ACTIVE',
    is_free_session: values.isFreeSession,
    notes: values.notes || null,
    created_by: 'system',
    scheduled_checkout: scheduledCheckout.toISOString(),
  } as DbPlaySessionInsert
}

export const toDbClose = (
  session: PlaySession
): DbPlaySessionUpdate => {
  const checkOut = new Date()
  const minutesPlayed = Math.floor(
    (checkOut.getTime() - new Date(session.checkIn).getTime()) / 60_000
  )
  const hoursPlayed = minutesPlayed / 60
  const rawSubtotal = hoursPlayed * session.pricePerHour
  const playSubtotal = parseFloat(
    Math.max(session.minimumCharge, rawSubtotal).toFixed(2)
  )
  const productsSubtotal = session.productsSubtotal ?? 0
  const discountAmount = session.discountAmount ?? 0
  const totalAmount = parseFloat(
    Math.max(0, playSubtotal + productsSubtotal - discountAmount).toFixed(2)
  )

  const isFree = session.isFreeSession

  return {
    status: isFree ? 'FREE' : 'CLOSED',
    check_out: checkOut.toISOString(),
    minutes_played: minutesPlayed,
    play_subtotal: isFree ? 0 : playSubtotal,
    products_subtotal: productsSubtotal,
    discount_amount: isFree ? 0 : discountAmount,
    total_amount: isFree ? productsSubtotal : totalAmount,
    updated_at: new Date().toISOString(),
    updated_by: 'system',
  }
}
