export type LoyaltyCard = {
  id: number
  childId: number
  stampsCount: number
  stampsRequired: number
  freeSessions: number
  totalEarned: number
  updatedAt: string | null
}

export type LoyaltyStamp = {
  id: number
  loyaltyCardId: number
  playSessionId: number | null
  stampedAt: string
  note: string | null
}
