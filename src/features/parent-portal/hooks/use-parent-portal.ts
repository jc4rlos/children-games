import { useQuery } from '@tanstack/react-query'
import { getLoyaltyCard } from '@/features/loyalty/data/loyalty-service'
import {
  getActiveSession,
  getChildAttendanceHistory,
  getChildByCode,
  getChildrenByGuardianId,
  getGuardianByCode,
  getSessionHistory,
} from '../data/parent-service'

export const portalQueryKeys = {
  child: (code: string) => ['portal', 'child', code] as const,
  guardian: (code: string) => ['portal', 'guardian', code] as const,
  guardianChildren: (guardianId: number) =>
    ['portal', 'guardian-children', guardianId] as const,
  loyalty: (childId: number) => ['portal', 'loyalty', childId] as const,
  activeSession: (childId: number) => ['portal', 'session', childId] as const,
  history: (childId: number, page: number) =>
    ['portal', 'history', childId, page] as const,
  attendance: (childId: number, page: number) =>
    ['portal', 'attendance', childId, page] as const,
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
    queryFn: () => getLoyaltyCard(childId as number),
    enabled: (childId ?? 0) > 0,
    staleTime: 30_000,
  })

export const usePortalActiveSession = (childId: number | null) =>
  useQuery({
    queryKey: portalQueryKeys.activeSession(childId ?? 0),
    queryFn: () => getActiveSession(childId as number),
    enabled: (childId ?? 0) > 0,
    refetchInterval: 30_000,
  })

export const usePortalHistory = (childId: number | null, page: number) =>
  useQuery({
    queryKey: portalQueryKeys.history(childId ?? 0, page),
    queryFn: () => getSessionHistory(childId as number, page),
    enabled: (childId ?? 0) > 0,
    placeholderData: (prev) => prev,
  })

export const useGuardianByCode = (code: string) =>
  useQuery({
    queryKey: portalQueryKeys.guardian(code),
    queryFn: () => getGuardianByCode(code),
    enabled: code.length >= 3,
    staleTime: 60_000,
  })

export const useChildrenByGuardian = (guardianId: number | null) =>
  useQuery({
    queryKey: portalQueryKeys.guardianChildren(guardianId ?? 0),
    queryFn: () => getChildrenByGuardianId(guardianId as number),
    enabled: (guardianId ?? 0) > 0,
    staleTime: 60_000,
  })

export const useChildAttendance = (childId: number | null, page: number) =>
  useQuery({
    queryKey: portalQueryKeys.attendance(childId ?? 0, page),
    queryFn: () => getChildAttendanceHistory(childId as number, page),
    enabled: (childId ?? 0) > 0,
    placeholderData: (prev) => prev,
  })
