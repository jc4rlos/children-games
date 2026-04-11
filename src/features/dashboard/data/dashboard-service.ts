import { supabase } from '@/lib/supabase'

const DAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const

const todayStart = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}
const todayEnd = () => {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.toISOString()
}
const monthStart = () => {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}
const nDaysAgo = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type DailyKpis = {
  activeSessions: number
  totalSessionsToday: number
  revenueToday: number
  consumptionsToday: number
}

export type ActiveSessionRow = {
  id: number
  checkIn: string
  scheduledCheckout: string | null
  pricePerHour: number
  minimumCharge: number
  childName: string
  childAvatar: string | null
  childCode: string
  childGender: 'MALE' | 'FEMALE'
}

export type DayStats = {
  date: string
  label: string
  sessions: number
  revenue: number
}

export type TopChild = {
  childId: number
  childName: string
  childAvatar: string | null
  childCode: string
  childGender: 'MALE' | 'FEMALE'
  sessionCount: number
}

export type TopProduct = {
  productId: number
  productName: string
  categoryName: string
  totalQuantity: number
  totalRevenue: number
}

export type ClassTodayRow = {
  id: number
  name: string
  teacherName: string | null
  startTime: string
  endTime: string
  capacity: number
  enrolledCount: number
}

export type LowStockProduct = {
  id: number
  name: string
  categoryName: string
  stock: number
}

export type LoyaltySummary = {
  freeSessionsToday: number
  nearCompletionCount: number
  stampsToday: number
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getDailyKpis = async (): Promise<DailyKpis> => {
  const start = todayStart()
  const end = todayEnd()

  const [
    { count: activeSessions },
    { count: totalSessionsToday },
    { data: closedToday },
    { data: consumptionsToday },
  ] = await Promise.all([
    supabase
      .from('play_session')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'ACTIVE'),
    supabase
      .from('play_session')
      .select('id', { count: 'exact', head: true })
      .gte('check_in', start)
      .lte('check_in', end),
    supabase
      .from('play_session')
      .select('total_amount')
      .in('status', ['CLOSED', 'FREE'])
      .gte('check_out', start)
      .lte('check_out', end),
    supabase
      .from('session_consumption')
      .select('subtotal')
      .gte('added_at', start)
      .lte('added_at', end),
  ])

  const revenueToday = (
    (closedToday as { total_amount: number | null }[] | null) ?? []
  ).reduce((sum, r) => sum + (r.total_amount ?? 0), 0)

  const consumptionsTodayTotal = (
    (consumptionsToday as { subtotal: number }[] | null) ?? []
  ).reduce((sum, r) => sum + r.subtotal, 0)

  return {
    activeSessions: activeSessions ?? 0,
    totalSessionsToday: totalSessionsToday ?? 0,
    revenueToday,
    consumptionsToday: consumptionsTodayTotal,
  }
}

export const getActiveSessions = async (): Promise<ActiveSessionRow[]> => {
  const { data, error } = await supabase
    .from('play_session')
    .select(
      'id, check_in, scheduled_checkout, child(full_name, avatar, code, gender), pricing_config(price_per_hour, minimum_charge)'
    )
    .eq('status', 'ACTIVE')
    .order('check_in', { ascending: true })

  if (error) throw new Error(error.message)

  return (
    data as unknown as {
      id: number
      check_in: string
      scheduled_checkout: string | null
      child: {
        full_name: string
        avatar: string | null
        code: string
        gender: 'MALE' | 'FEMALE'
      }
      pricing_config: { price_per_hour: number; minimum_charge: number }
    }[]
  ).map((r) => ({
    id: r.id,
    checkIn: r.check_in,
    scheduledCheckout: r.scheduled_checkout,
    pricePerHour: r.pricing_config.price_per_hour,
    minimumCharge: r.pricing_config.minimum_charge,
    childName: r.child.full_name,
    childAvatar: r.child.avatar,
    childCode: r.child.code,
    childGender: r.child.gender,
  }))
}

export const getWeekStats = async (): Promise<DayStats[]> => {
  const { data, error } = await supabase
    .from('play_session')
    .select('check_in, total_amount')
    .in('status', ['CLOSED', 'FREE'])
    .gte('check_in', nDaysAgo(6))
    .order('check_in', { ascending: true })

  if (error) throw new Error(error.message)

  const days: DayStats[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const date = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('es-PE', { weekday: 'short' })
    return {
      date,
      label: label.charAt(0).toUpperCase() + label.slice(1, 3),
      sessions: 0,
      revenue: 0,
    }
  })

  for (const row of data as {
    check_in: string
    total_amount: number | null
  }[]) {
    const date = row.check_in.slice(0, 10)
    const day = days.find((d) => d.date === date)
    if (day) {
      day.sessions += 1
      day.revenue += row.total_amount ?? 0
    }
  }

  return days
}

export const getMonthTopChildren = async (): Promise<TopChild[]> => {
  const { data, error } = await supabase
    .from('play_session')
    .select('child_id, child(full_name, avatar, code, gender)')
    .gte('check_in', monthStart())
    .in('status', ['CLOSED', 'FREE'])

  if (error) throw new Error(error.message)

  const map = new Map<
    number,
    {
      childId: number
      childName: string
      childAvatar: string | null
      childCode: string
      childGender: 'MALE' | 'FEMALE'
      sessionCount: number
    }
  >()

  for (const row of data as unknown as {
    child_id: number
    child: {
      full_name: string
      avatar: string | null
      code: string
      gender: 'MALE' | 'FEMALE'
    }
  }[]) {
    const existing = map.get(row.child_id)
    if (existing) {
      existing.sessionCount += 1
    } else {
      map.set(row.child_id, {
        childId: row.child_id,
        childName: row.child.full_name,
        childAvatar: row.child.avatar,
        childCode: row.child.code,
        childGender: row.child.gender,
        sessionCount: 1,
      })
    }
  }

  return [...map.values()]
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 5)
}

export const getMonthTopProducts = async (): Promise<TopProduct[]> => {
  const { data, error } = await supabase
    .from('session_consumption')
    .select(
      'product_id, quantity, subtotal, product(name, product_category(name))'
    )
    .gte('added_at', monthStart())

  if (error) throw new Error(error.message)

  const map = new Map<
    number,
    {
      productId: number
      productName: string
      categoryName: string
      totalQuantity: number
      totalRevenue: number
    }
  >()

  for (const row of data as unknown as {
    product_id: number
    quantity: number
    subtotal: number
    product: { name: string; product_category: { name: string } | null }
  }[]) {
    const existing = map.get(row.product_id)
    if (existing) {
      existing.totalQuantity += row.quantity
      existing.totalRevenue += row.subtotal
    } else {
      map.set(row.product_id, {
        productId: row.product_id,
        productName: row.product.name,
        categoryName: row.product.product_category?.name ?? 'Sin categoría',
        totalQuantity: row.quantity,
        totalRevenue: row.subtotal,
      })
    }
  }

  return [...map.values()]
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5)
}

export const getClassesToday = async (): Promise<ClassTodayRow[]> => {
  const todayCode = DAY_CODES[new Date().getDay()]

  const { data: classes, error } = await supabase
    .from('stimulation_class')
    .select(
      'id, name, start_time, end_time, capacity, teacher:employee!stimulation_class_teacher_id_fkey(first_name, last_name)'
    )
    .eq('is_active', true)
    .contains('day_of_week', [todayCode])
    .order('start_time', { ascending: true })

  if (error) throw new Error(error.message)

  const classIds = (classes as { id: number }[]).map((c) => c.id)
  if (classIds.length === 0) return []

  const { data: enrollments } = await supabase
    .from('class_enrollment')
    .select('class_id')
    .in('class_id', classIds)
    .eq('is_active', true)

  const countMap = new Map<number, number>()
  for (const e of (enrollments as { class_id: number }[] | null) ?? []) {
    countMap.set(e.class_id, (countMap.get(e.class_id) ?? 0) + 1)
  }

  return (
    classes as unknown as {
      id: number
      name: string
      start_time: string
      end_time: string
      capacity: number
      teacher: { first_name: string; last_name: string } | null
    }[]
  ).map((c) => ({
    id: c.id,
    name: c.name,
    teacherName: c.teacher
      ? `${c.teacher.first_name} ${c.teacher.last_name}`
      : null,
    startTime: c.start_time.slice(0, 5),
    endTime: c.end_time.slice(0, 5),
    capacity: c.capacity,
    enrolledCount: countMap.get(c.id) ?? 0,
  }))
}

export const getLowStockProducts = async (): Promise<LowStockProduct[]> => {
  const { data, error } = await supabase
    .from('product')
    .select('id, name, stock, product_category(name)')
    .eq('is_active', true)
    .gt('stock', 0)
    .lte('stock', 5)
    .order('stock', { ascending: true })
    .limit(6)

  if (error) throw new Error(error.message)

  return (
    data as unknown as {
      id: number
      name: string
      stock: number
      product_category: { name: string } | null
    }[]
  ).map((r) => ({
    id: r.id,
    name: r.name,
    stock: r.stock,
    categoryName: r.product_category?.name ?? 'Sin categoría',
  }))
}

export const getLoyaltySummary = async (): Promise<LoyaltySummary> => {
  const start = todayStart()
  const end = todayEnd()

  const [{ count: freeSessionsToday }, { data: stamps }, { data: cards }] =
    await Promise.all([
      supabase
        .from('play_session')
        .select('id', { count: 'exact', head: true })
        .eq('is_free_session', true)
        .in('status', ['CLOSED', 'FREE'])
        .gte('check_out', start)
        .lte('check_out', end),
      supabase
        .from('loyalty_stamp')
        .select('id', { count: 'exact' })
        .gte('stamped_at', start)
        .lte('stamped_at', end),
      supabase.from('loyalty_card').select('stamps_count, stamps_required'),
    ])

  const nearCompletionCount = (
    (cards as { stamps_count: number; stamps_required: number }[] | null) ?? []
  ).filter(
    (c) => c.stamps_count > 0 && c.stamps_count === c.stamps_required - 1
  ).length

  return {
    freeSessionsToday: freeSessionsToday ?? 0,
    nearCompletionCount,
    stampsToday: (stamps as { id: number }[] | null)?.length ?? 0,
  }
}
