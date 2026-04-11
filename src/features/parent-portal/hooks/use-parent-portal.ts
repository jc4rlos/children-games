import { useQuery } from '@tanstack/react-query'
import { getLoyaltyCard } from '@/features/loyalty/data/loyalty-service'
import {
  getActiveSession,
  getChildByCode,
  getSessionHistory,
} from '../data/parent-service'

export const portalQueryKeys = {
  child: (code: string) => ['portal', 'child', code] as const,
  loyalty: (childId: number) => ['portal', 'loyalty', childId] as const,
  activeSession: (childId: number) => ['portal', 'session', childId] as const,
  history: (childId: number, page: number) =>
    ['portal', 'history', childId, page] as const,
}

export const useChildByCode = (code: string) =>
  useQuery({
    queryKey: portalQueryKeys.child(code),
    queryFn: () => getChildByCode(code),
    enabled: code.length >= 3,
    staleTime: 60_000,
  })

export const usePortalLoyalty = (childId: number | null) =>
  useQuery({
    queryKey: portalQueryKeys.loyalty(childId ?? 0),
    queryFn: () => getLoyaltyCard(childId!),
    enabled: (childId ?? 0) > 0,
    staleTime: 30_000,
  })

export const usePortalActiveSession = (childId: number | null) =>
  useQuery({
    queryKey: portalQueryKeys.activeSession(childId ?? 0),
    queryFn: () => getActiveSession(childId!),
    enabled: (childId ?? 0) > 0,
    refetchInterval: 30_000,
  })

export const usePortalHistory = (childId: number | null, page: number) =>
  useQuery({
    queryKey: portalQueryKeys.history(childId ?? 0, page),
    queryFn: () => getSessionHistory(childId!, page),
    enabled: (childId ?? 0) > 0,
    placeholderData: (prev) => prev,
  })
