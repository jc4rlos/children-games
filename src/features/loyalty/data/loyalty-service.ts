import { supabase } from '@/lib/supabase'
import { type LoyaltyCard, type LoyaltyStamp } from './schema'

const SELECT_CARD = 'id, child_id, stamps_count, stamps_required, free_sessions, total_earned, updated_at'
const SELECT_STAMP = 'id, loyalty_card_id, play_session_id, stamped_at, note'

const mapCard = (row: {
  id: number
  child_id: number
  stamps_count: number
  stamps_required: number
  free_sessions: number
  total_earned: number
  updated_at: string | null
}): LoyaltyCard => ({
  id: row.id,
  childId: row.child_id,
  stampsCount: row.stamps_count,
  stampsRequired: row.stamps_required,
  freeSessions: row.free_sessions,
  totalEarned: row.total_earned,
  updatedAt: row.updated_at,
})

const mapStamp = (row: {
  id: number
  loyalty_card_id: number
  play_session_id: number | null
  stamped_at: string
  note: string | null
}): LoyaltyStamp => ({
  id: row.id,
  loyaltyCardId: row.loyalty_card_id,
  playSessionId: row.play_session_id,
  stampedAt: row.stamped_at,
  note: row.note,
})

export const getOrCreateLoyaltyCard = async (childId: number): Promise<LoyaltyCard> => {
  const { data: existing } = await supabase
    .from('loyalty_card')
    .select(SELECT_CARD)
    .eq('child_id', childId)
    .maybeSingle()

  if (existing) return mapCard(existing as Parameters<typeof mapCard>[0])

  const { data, error } = await supabase
    .from('loyalty_card')
    .insert({ child_id: childId })
    .select(SELECT_CARD)
    .single()

  if (error) throw new Error(error.message)
  return mapCard(data as Parameters<typeof mapCard>[0])
}

export const getLoyaltyCard = async (childId: number): Promise<LoyaltyCard | null> => {
  const { data } = await supabase
    .from('loyalty_card')
    .select(SELECT_CARD)
    .eq('child_id', childId)
    .maybeSingle()

  return data ? mapCard(data as Parameters<typeof mapCard>[0]) : null
}

export const getLoyaltyStamps = async (cardId: number): Promise<LoyaltyStamp[]> => {
  const { data, error } = await supabase
    .from('loyalty_stamp')
    .select(SELECT_STAMP)
    .eq('loyalty_card_id', cardId)
    .order('stamped_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data as Parameters<typeof mapStamp>[0][]).map(mapStamp)
}

export const decrementFreeSession = async (childId: number): Promise<void> => {
  const { data: card, error: fetchError } = await supabase
    .from('loyalty_card')
    .select('id, free_sessions')
    .eq('child_id', childId)
    .maybeSingle()

  if (fetchError) throw new Error(fetchError.message)
  if (!card || card.free_sessions <= 0) return

  const { error } = await supabase
    .from('loyalty_card')
    .update({ free_sessions: card.free_sessions - 1, updated_at: new Date().toISOString() })
    .eq('id', card.id)

  if (error) throw new Error(error.message)
}
