import { supabase } from '@/lib/supabase'

export type SessionConsumption = {
  id: number
  playSessionId: number
  productId: number
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
  addedAt: string
}

export type AddConsumptionPayload = {
  playSessionId: number
  productId: number
  quantity: number
  unitPrice: number
}

export const getSessionConsumptions = async (
  playSessionId: number
): Promise<SessionConsumption[]> => {
  const { data, error } = await supabase
    .from('session_consumption')
    .select(
      'id, play_session_id, product_id, quantity, unit_price, subtotal, added_at, product(name)'
    )
    .eq('play_session_id', playSessionId)
    .order('added_at', { ascending: true })

  if (error) throw new Error(error.message)

  return (
    data as unknown as {
      id: number
      play_session_id: number
      product_id: number
      quantity: number
      unit_price: number
      subtotal: number
      added_at: string
      product: { name: string }
    }[]
  ).map((row) => ({
    id: row.id,
    playSessionId: row.play_session_id,
    productId: row.product_id,
    productName: row.product.name,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    subtotal: row.subtotal,
    addedAt: row.added_at,
  }))
}

export const addSessionConsumption = async (
  payload: AddConsumptionPayload
): Promise<SessionConsumption> => {
  const { data, error } = await supabase
    .from('session_consumption')
    .insert({
      play_session_id: payload.playSessionId,
      product_id: payload.productId,
      quantity: payload.quantity,
      unit_price: payload.unitPrice,
    })
    .select(
      'id, play_session_id, product_id, quantity, unit_price, subtotal, added_at, product(name)'
    )
    .single()

  if (error) throw new Error(error.message)

  const row = data as unknown as {
    id: number
    play_session_id: number
    product_id: number
    quantity: number
    unit_price: number
    subtotal: number
    added_at: string
    product: { name: string }
  }

  return {
    id: row.id,
    playSessionId: row.play_session_id,
    productId: row.product_id,
    productName: row.product.name,
    quantity: row.quantity,
    unitPrice: row.unit_price,
    subtotal: row.subtotal,
    addedAt: row.added_at,
  }
}

export const removeSessionConsumption = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('session_consumption')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
}
