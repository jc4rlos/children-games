import { useQuery } from '@tanstack/react-query'
import {
  getLoyaltyStamps,
  getOrCreateLoyaltyCard,
} from '../data/loyalty-service'

export const loyaltyQueryKeys = {
  card: (childId: number) => ['loyalty', 'card', childId] as const,
  stamps: (cardId: number) => ['loyalty', 'stamps', cardId] as const,
}

export const useLoyaltyCard = (childId: number | null) =>
  useQuery({
    queryKey: loyaltyQueryKeys.card(childId ?? 0),
    queryFn: () => getOrCreateLoyaltyCard(childId as number),
    enabled: (childId ?? 0) > 0,
    staleTime: 30_000,
  })

export const useLoyaltyStamps = (cardId: number | null) =>
  useQuery({
    queryKey: loyaltyQueryKeys.stamps(cardId ?? 0),
    queryFn: () => getLoyaltyStamps(cardId as number),
    enabled: (cardId ?? 0) > 0,
    staleTime: 30_000,
  })
